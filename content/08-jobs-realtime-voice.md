# Module 08 — Jobs, real-time, voice (Avril 2026)

> Au-delà du chat synchrone : agents background, streaming résumable, voice agents, auth, storage. Ce module couvre les "morceaux qui ne tiennent pas dans une route handler".

## 1. Le problème : Vercel functions ont des timeouts

Limites Vercel Fluid Compute (avril 2026) :

- Hobby : 300 s.
- Pro / Enterprise : 800 s = ~13 min.

Pour tout ce qui dépasse, ou tout ce qui doit *survivre* à un crash / deploy, il faut une couche d'exécution durable.

## 2. Trigger.dev v3 vs Inngest vs Cloudflare Workflows

### Trigger.dev v3

- **DX TypeScript-first** ; tasks sont des fonctions TS.
- **No timeouts** sur tasks (vs Vercel 300/800 s, AWS Lambda 15 min).
- Self-host ou cloud.
- Realtime streams pour suivre les tasks depuis le client.

```typescript
import { task, metadata } from "@trigger.dev/sdk/v3";
import { streamText } from "ai";

export const longResearchTask = task({
  id: "long-research",
  retry: { maxAttempts: 3 },
  maxDuration: 1800, // 30 min
  run: async (payload: { topic: string }, { ctx }) => {
    const result = streamText({
      model: "anthropic/claude-sonnet-4.5",
      tools: { /* ... */ },
      stopWhen: stepCountIs(50),
      prompt: payload.topic,
    });

    // Stream vers le client via metadata
    for await (const chunk of result.textStream) {
      await metadata.stream("text", chunk);
    }

    return await result.text;
  },
});
```

```typescript
// Côté client (Next.js Server Action)
import { tasks } from "@trigger.dev/sdk/v3";

export async function startResearch(topic: string) {
  const handle = await tasks.trigger<typeof longResearchTask>("long-research", { topic });
  return { runId: handle.id, publicAccessToken: handle.publicAccessToken };
}

// Client React subscriber au stream
import { useRealtimeRunWithStreams } from "@trigger.dev/react-hooks";

function ResearchUI({ runId, accessToken }) {
  const { run, streams } = useRealtimeRunWithStreams({ runId, accessToken });
  return (
    <>
      <p>Status: {run?.status}</p>
      <pre>{streams.text?.join("")}</pre>
    </>
  );
}
```

### Inngest

- **Durable execution** : chaque `step.run` est retried + persisted independently.
- `step.ai.infer` wrap les LLM calls en steps durables.
- `step.waitForEvent` pour human-in-loop.
- Architecture event-driven naturelle.

```typescript
import { inngest } from "./client";
import { anthropic } from "@inngest/agent-kit";

export const researchAgent = inngest.createFunction(
  { id: "deep-research", retries: 3 },
  { event: "research/requested" },
  async ({ event, step }) => {
    // Chaque step est durable, retried indépendamment
    const plan = await step.ai.infer("plan", {
      model: anthropic("claude-sonnet-4.5"),
      body: { messages: [{ role: "user", content: event.data.query }] },
    });

    const results = await Promise.all(
      plan.subtasks.map((t, i) =>
        step.run(`worker-${i}`, async () => runWorker(t))
      )
    );

    // Wait for human approval (jusqu'à 24h)
    const approval = await step.waitForEvent("approval", {
      event: "research/approved",
      timeout: "24h",
      match: "data.runId",
    });

    if (!approval) {
      return { status: "timeout" };
    }

    return await step.ai.infer("synthesize", { /* ... */ });
  }
);
```

### Cloudflare Workflows

- Open beta en 2026. Durable execution sur Workers.
- Trigger depuis Queue consumer ou Cron.
- S'intègre avec Durable Objects pour la coordination stateful.

```typescript
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";

export class ResearchWorkflow extends WorkflowEntrypoint<Env, { topic: string }> {
  async run(event: WorkflowEvent<{ topic: string }>, step: WorkflowStep) {
    const plan = await step.do("plan", async () => {
      return await llm.plan(event.payload.topic);
    });

    const results = await step.do("execute", async () => {
      return await Promise.all(plan.subtasks.map(runWorker));
    });

    return await step.do("synthesize", () => llm.synthesize(results));
  }
}
```

### Hatchet

- Best pour orchestration AI complexe (DAGs, fan-out/in).
- Self-host first.

### Décision sénior

| Cas | Choisir |
|---|---|
| TS-first, simple DX, cloud OK | **Trigger.dev v3** |
| Event-driven, durable, human-in-loop | **Inngest** |
| Stack Cloudflare Workers déjà | **Cloudflare Workflows** |
| DAG complexe, self-host strict | **Hatchet** |

## 3. Pattern : agent long-running avec streaming au client

```typescript
// trigger/research.ts
import { task, metadata } from "@trigger.dev/sdk/v3";
import { ToolLoopAgent, stepCountIs } from "ai";

export const researchAgent = task({
  id: "research-agent",
  maxDuration: 1800,
  retry: { maxAttempts: 2 },
  run: async (payload: { query: string; userId: string }) => {
    const agent = new ToolLoopAgent({
      model: "anthropic/claude-sonnet-4.5",
      tools: { search, retrieve, finalAnswer },
      stopWhen: stepCountIs(50),
    });

    const stream = agent.stream({
      prompt: payload.query,
      onStepFinish: async ({ stepNumber, finishReason, usage }) => {
        await metadata.stream("step", { stepNumber, finishReason });
        await metadata.set("totalTokens", usage.totalTokens);
      },
    });

    for await (const part of stream.fullStream) {
      if (part.type === "text-delta") {
        await metadata.stream("text", part.textDelta);
      }
      if (part.type === "tool-call") {
        await metadata.stream("tool", { name: part.toolName, args: part.args });
      }
    }

    return { final: await stream.text };
  },
});
```

```typescript
// app/research/[id]/page.tsx
"use client";
import { useRealtimeRunWithStreams } from "@trigger.dev/react-hooks";

export default function ResearchPage({ runId, accessToken }) {
  const { run, streams } = useRealtimeRunWithStreams({ runId, accessToken });

  return (
    <div>
      <h2>Research</h2>
      <p>Status: {run?.status}</p>
      <p>Steps: {streams.step?.length}</p>
      <p>Tools used: {streams.tool?.map(t => t.name).join(", ")}</p>
      <pre>{streams.text?.join("")}</pre>
    </div>
  );
}
```

## 4. Streaming SSE et resumable streams

Vercel AI SDK 5/6 standardisé sur **SSE** pour les client streams (passe à travers les CDNs, support browser natif, keep-alive ping, cache handling).

### Resumable streams (cf. module 02 §8)

Pattern complet :

```typescript
// app/api/chat/route.ts
import { createResumableStreamContext } from "resumable-stream";
import { Redis } from "ioredis";

const ctx = createResumableStreamContext({
  waitUntil,
  redis: new Redis(process.env.REDIS_URL!),
});

export async function POST(req: Request) {
  const { id, message } = await req.json();
  const result = streamText({ model, messages });

  const streamId = crypto.randomUUID();
  await db.chats.update({ id, activeStreamId: streamId });

  return new Response(
    await ctx.resumableStream(streamId, () => result.toUIMessageStream()),
    { headers: { "content-type": "text/event-stream" } },
  );
}

// app/api/chat/[id]/stream/route.ts — handler GET pour resume
export async function GET(_req: Request, { params }) {
  const chat = await db.chats.findById(params.id);
  if (!chat.activeStreamId) return new Response(null, { status: 204 });
  const stream = await ctx.resumeExistingStream(chat.activeStreamId);
  return new Response(stream, { headers: { "content-type": "text/event-stream" } });
}
```

```tsx
// client
useChat({
  id,
  resume: true,
  transport: new DefaultChatTransport({ api: "/api/chat" }),
});
```

> **Trade-off** : incompatible avec abort. Choisissez. T3Chat, OpenAI UI utilisent ce pattern.

## 5. Real-time collaboratif (multi-user, presence)

Pour les surfaces AI collaboratives (multi-user, presence, cursors) :

- **Liveblocks** : best DX pour la présence + commentaires.
- **Pusher** : real-time pub/sub generic.
- **Inngest Realtime** : pour les agents background avec realtime built-in.
- **Cloudflare Durable Objects** : self-host, statefull.

```typescript
import { useStorage, useMutation } from "@liveblocks/react";

function CollaborativeChat() {
  const messages = useStorage((root) => root.messages);
  const addMessage = useMutation(({ storage }, message) => {
    storage.get("messages").push(message);
  }, []);

  // Multi-user voit les messages en temps réel
}
```

## 6. Voice agents — OpenAI Realtime + WebRTC

OpenAI Realtime + WebRTC (snapshot `2025-12-15`) atteint **~300–500 ms end-to-end audio**.

> WebRTC est recommandé sur WebSockets pour browser/mobile (meilleur jitter handling, congestion control).

Le mini snapshot a amélioré instruction-following +18.6 pp, tool-calling +12.9 pp.

### Sub-300 ms est le seuil "natural conversation"

Chaque 100 ms additionnels casse l'illusion. Ce qui contribue à la latence :

- Mic capture + encoding : 30–80 ms.
- Network upload : 30–150 ms.
- Server processing (STT + LLM + TTS) : 150–300 ms.
- Network download : 30–150 ms.
- Decode + playback : 20–50 ms.

### Code WebRTC client

```typescript
// Client browser
const pc = new RTCPeerConnection();

// Get mic
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
stream.getTracks().forEach(track => pc.addTrack(track, stream));

// Receive audio
pc.ontrack = (e) => {
  const audio = new Audio();
  audio.srcObject = e.streams[0];
  audio.play();
};

// Data channel pour les events
const channel = pc.createDataChannel("oai-events");
channel.onmessage = (e) => {
  const event = JSON.parse(e.data);
  if (event.type === "response.function_call_arguments.done") {
    // Tool call à exécuter
  }
};

// SDP exchange via votre serveur
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const ephemeralKey = await fetch("/api/realtime/session").then(r => r.json());
const response = await fetch(
  `https://api.openai.com/v1/realtime?model=gpt-realtime`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ephemeralKey.value}`,
      "Content-Type": "application/sdp",
    },
    body: offer.sdp,
  }
);

await pc.setRemoteDescription({ type: "answer", sdp: await response.text() });
```

```typescript
// Server: ephemeral key
// app/api/realtime/session/route.ts
export async function GET() {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-realtime", voice: "alloy" }),
  });
  return Response.json(await r.json());
}
```

### Provider voice alternatifs

- **ElevenLabs** : meilleure qualité TTS, latence + élevée.
- **Deepgram** : STT specialist, low latency.
- **AssemblyAI** : STT + diarization.
- **Cartesia** : TTS streaming low-latency.
- **LiveKit Agents** : framework full-stack voice.

### Pattern voice agent complet

```typescript
import { Agent, run } from "@openai/agents";
import { tool } from "@openai/agents";

const lookupCustomer = tool({
  name: "lookup_customer",
  description: "Look up a customer by phone number",
  parameters: z.object({ phone: z.string() }),
  execute: async ({ phone }) => db.customers.findByPhone(phone),
});

const voiceAgent = new Agent({
  name: "Support Voice Agent",
  model: "gpt-realtime",
  instructions: "Greet, identify the user, route to the right specialist.",
  tools: [lookupCustomer],
});

// Le run() handle la session WebRTC
await run(voiceAgent, audioStream);
```

## 7. Auth pour les apps IA (avril 2026)

| | BetterAuth | Clerk | Stack Auth |
|---|---|---|---|
| Hosted | Self-host | Hosted | Self-host ou hosted |
| Coût @ 100K MAU | Coût infra seul | ~2 025 $/mois | Plus bas |
| Multi-tenant orgs | Built-in | Built-in (best UI) | Built-in |
| Pre-built UI | Aucun (1–3 jours de boulot) | Production-grade | Some |
| Data residency | N'importe où | US only | N'importe où |
| TS type-safety | First-class | Wrappers | First-class |

### Recommandations

- **Default 2026 pour self-hosted Next.js** : **BetterAuth**.
- **Vous voulez ship vite, le coût n'est pas critique** : **Clerk**.
- **Enterprise SSO/SCIM** : **WorkOS** au-dessus de l'un ou l'autre.

### BetterAuth — exemple

```typescript
// auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: { clientId: env.GITHUB_ID, clientSecret: env.GITHUB_SECRET },
  },
  plugins: [
    organization({ allowUserToCreateOrganization: true }),
    twoFactor(),
  ],
});

// Usage en Server Component / Action
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const verifySession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});
```

### BYOK et per-tenant API keys

Pattern crucial pour les apps IA multi-tenant :

```typescript
// Encrypted at rest avec envelope encryption (KMS DEK + KEK)
async function storeApiKey(tenantId: string, provider: string, key: string) {
  const dek = await kms.generateDataKey({ keySpec: "AES_256" });
  const ciphertext = encrypt(key, dek.plaintext);
  await db.apiKeys.create({
    tenantId,
    provider,
    ciphertext,
    encryptedDek: dek.ciphertext,
    scope: ["chat", "embeddings"],
  });
}

async function getApiKey(tenantId: string, provider: string) {
  const row = await db.apiKeys.findOne({ tenantId, provider });
  const dek = await kms.decrypt({ ciphertext: row.encryptedDek });
  return decrypt(row.ciphertext, dek.plaintext);
}
```

Usage metering tied to billing : pour chaque LLM call, log `tenantId + tokens + cost` ; aggregate par mois pour facturation.

## 8. Storage pour apps IA

### Object storage

- **Cloudflare R2** : zero egress, S3-compatible. Le price leader pour les blobs lourds.
- **Vercel Blob** : tight DX Next.js, mais egress fees.
- **S3** : default AWS-native.

```typescript
// Vercel Blob — upload depuis Server Action
import { put } from "@vercel/blob";

export async function uploadDoc(formData: FormData) {
  "use server";
  const file = formData.get("file") as File;
  const blob = await put(`docs/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  await db.documents.create({ url: blob.url, size: file.size });
  return blob.url;
}
```

### Pipelines RAG fichiers

Recipe production :

1. **Layout extraction** : Anthropic File Search tool (native, zéro preprocessing) OU LlamaParse / Unstructured / Reducto.
2. **OCR** : AWS Textract / Azure Document Intelligence / open-source dolphin/marker.
3. **Image understanding** : envoyer aux vision models (Claude / GPT-4o) pour figure/table descriptions.
4. **Audio** : Whisper / AssemblyAI / Deepgram → transcript diarized.

Idempotence : key par hash de fichier (SHA256). Si déjà ingéré, skip.

```typescript
import { task } from "@trigger.dev/sdk/v3";
import { createHash } from "node:crypto";

export const ingestDoc = task({
  id: "ingest-doc",
  retry: { maxAttempts: 3 },
  run: async (payload: { fileUrl: string }) => {
    const buf = await fetch(payload.fileUrl).then(r => r.arrayBuffer());
    const hash = createHash("sha256").update(Buffer.from(buf)).digest("hex");

    const existing = await db.documents.findByHash(hash);
    if (existing) return { documentId: existing.id, skipped: true };

    const pages = await llamaparse.parse(buf);
    const chunks = await chunkAndContextualize(pages);
    const embeds = await embedAll(chunks);
    const id = await db.documents.create({ hash, chunks: embeds });
    return { documentId: id };
  },
});
```

## 9. Webhooks et idempotence

Les webhooks sont l'épine dorsale de l'intégration multi-systèmes (Stripe, GitHub, Linear, etc.). Trois principes :

1. **Vérifier la signature** : HMAC du payload avec le secret.
2. **Idempotence par event ID** : `INSERT ON CONFLICT DO NOTHING` ou Redis `SETNX`.
3. **Async processing** : le handler webhook stocke le job ; un worker le traite.

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Idempotence
  const inserted = await db.webhookEvents.create({
    eventId: event.id,
    type: event.type,
    payload: event,
  }).onConflictDoNothing();

  if (!inserted) return new Response("ok"); // déjà processed

  // Async — Trigger.dev
  await tasks.trigger("process-stripe-event", { eventId: event.id });

  return new Response("ok");
}
```

## 10. Patterns multi-tenant

### Workspace / organization scoping

```typescript
// Toutes les queries scopées par workspace
export async function listChats(userId: string, workspaceId: string) {
  await assertWorkspaceMember(userId, workspaceId);
  return db.chats.findMany({ where: { workspaceId } });
}
```

### Per-tenant rate limiting (cf. module 07 §6)

### Per-tenant model access

```typescript
const tenant = await db.tenants.findById(workspaceId);
const allowedModels = tenant.plan === "enterprise"
  ? ["opus", "sonnet", "haiku"]
  : ["sonnet", "haiku"];
```

### Per-tenant API keys (BYOK) — cf. §7

## Ce qu'il faut emporter de ce module

1. **Trigger.dev v3 ou Inngest** pour tout ce qui dépasse 5 minutes ou survit à un crash.
2. **Resumable streams** (Redis-backed) pour les chats sérieux : refresh sans perdre le stream.
3. **OpenAI Realtime + WebRTC** est la pile voice 2026 pour sub-300 ms.
4. **BetterAuth** est le default self-hosted Next.js auth ; **Clerk** pour speed-to-market.
5. **Cloudflare R2** pour le price leader objet storage ; **Vercel Blob** pour la DX serrée Next.js.
6. **Idempotence par event ID + signature check** sur les webhooks ; async processing systématique.
7. **Multi-tenant** : workspace scoping de toutes les queries, BYOK avec envelope encryption, per-tenant rate limit.

Module suivant : [09-repo-template-prod.md](./09-repo-template-prod.md) — un template repo complet avec toutes ces décisions architecturales matérialisées.
