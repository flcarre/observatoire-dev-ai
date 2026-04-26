# Module 02 — Vercel AI SDK 6 et concurrents (Avril 2026)

> Versions de référence : **AI SDK 6** (release décembre 2025, default pour les nouveaux projets) ; AI SDK 5.0.179 reste maintenu mais on développe sur la 6.

## 1. Architecture du SDK

Trois packages, conceptuellement indépendants :

```
ai                       # Core: generateText, streamText, generateObject, streamObject, Agent
@ai-sdk/react            # UI: useChat, useCompletion, useObject (parité Vue/Svelte/Angular en v5+)
@ai-sdk/rsc              # RSC: PAUSED, ne pas adopter pour de nouveaux projets
@ai-sdk/gateway          # Provider routing
@ai-sdk/devtools         # Inspecteur d'appels LLM (v6)
@ai-sdk/mcp              # Client MCP (v6, OAuth-aware)
```

**Décision architecturale clef de v6** : les *model strings* remplacent les constructeurs de provider. `"anthropic/claude-sonnet-4.5"` au lieu de `anthropic("claude-sonnet-4.5")`. La string passe par défaut par AI Gateway, qui *est* la posture de prod.

> **AI SDK RSC est officiellement en pause.** Les équipes de prod utilisent `useChat` v6 avec le nouveau transport API. La doc RSC existe encore, mais l'équipe pousse explicitement vers `useChat` avec custom data parts pour la generative UI. **Ne démarrez pas un projet avec `streamUI`/RSC.**

## 2. `streamText` / `generateText` — toutes les options

```typescript
import { streamText, stepCountIs, hasToolCall, smoothStream, tool } from "ai";
import { z } from "zod";

const result = streamText({
  model: "anthropic/claude-sonnet-4.5",
  system: "You are a senior engineer. Be concise.",
  messages: convertToModelMessages(uiMessages),

  tools: {
    searchCode: tool({
      description: "Search the repo by ripgrep query",
      inputSchema: z.object({ query: z.string(), path: z.string().optional() }),
      execute: async ({ query, path }, { abortSignal, toolCallId }) => {
        const res = await fetch(`/api/rg?q=${query}`, { signal: abortSignal });
        return res.json();
      },
      onInputStart: () => log("tool input streaming"),
      onInputDelta: ({ inputTextDelta }) => log(inputTextDelta),
    }),
    finalAnswer: tool({
      description: "Submit the final answer",
      inputSchema: z.object({ answer: z.string() }),
    }),
  },

  // Contrôle de la boucle agentique (v5+)
  stopWhen: [stepCountIs(8), hasToolCall("finalAnswer")],

  // Config par étape (v5+)
  prepareStep: async ({ stepNumber, messages }) => {
    if (stepNumber === 0) {
      return {
        model: "anthropic/claude-haiku-4.5",
        toolChoice: { type: "tool", toolName: "searchCode" },
      };
    }
    if (messages.length > 12) {
      return { messages: messages.slice(-12) }; // sliding window
    }
  },

  experimental_transform: smoothStream({ delayInMs: 20, chunking: "word" }),

  abortSignal: req.signal,
  onAbort: ({ steps }) => persistPartial(steps),
  onStepFinish: ({ stepNumber, finishReason, usage }) => track(stepNumber, usage),
  onFinish: ({ text, totalUsage, steps }) => persist({ text, steps }),
  onError: ({ error }) => report(error),
});

return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === "finish") {
      return {
        model: part.response.modelId,
        totalTokens: part.totalUsage.totalTokens,
        cacheReadTokens: part.totalUsage.inputTokenDetails?.cacheReadTokens,
      };
    }
  },
});
```

### Pièges qu'on ne peut pas inventer si on ne s'est pas brûlé

- **`stopWhen` est un array** ; les conditions sont OU. `stepCountIs(N)` est le filet de sécurité que vous voulez systématiquement.
- **`prepareStep` est l'endroit propre** pour : sliding-window de contexte, model-tiering (Haiku pour le triage, Sonnet pour l'exécution), forcer un tool choice à l'étape 0.
- **`onAbort` se déclenche au cancel ; `onFinish` non**. Si vous persistez seulement dans `onFinish`, les streams aborted *fuitent*. Persistez dans les deux.
- **L'envoi UI doit utiliser `toUIMessageStreamResponse`**, pas `Response`. Sinon vous perdez le typing des data parts.

## 3. `generateObject` / `streamObject` et `Output.object()` (v6)

En v6, le path recommandé est `Output.object()` passé à `generateText`/`streamText` *plutôt que* `generateObject` standalone. Ça compose avec tool calling et reasoning :

```typescript
import { generateText, streamText, Output } from "ai";
import { z } from "zod";

// v6 unifié : boucle d'outils + sortie structurée finale
const { output } = await generateText({
  model: "anthropic/claude-sonnet-4.5",
  tools: { search, fetch_url },
  stopWhen: stepCountIs(6),
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      citations: z.array(z.object({ url: z.string(), quote: z.string() })),
      confidence: z.enum(["high", "medium", "low"]),
    }),
  }),
  prompt: "Research the AI SDK 6 release and produce a summary.",
});

// Streaming d'objets partiels vers l'UI
const stream = streamText({
  model: "anthropic/claude-sonnet-4.5",
  output: Output.object({ schema: ItemSchema }),
  prompt,
});
for await (const partial of stream.partialOutputStream) {
  // partial est le type Zod inféré, deeply partial, sûr à render
}
```

Autres modes : `Output.array(itemSchema)` pour streamer des items un par un, `Output.choice(["a","b","c"])` pour la classification enum, `Output.json()` pour l'unstructured. Le Standard JSON Schema est supporté en v6, donc ArkType, Valibot et Effect Schema sont des drop-in replacements.

## 4. Tools — patterns avancés

```typescript
import { tool, dynamicTool } from "ai";
import { createMCPClient } from "@ai-sdk/mcp";

// Tool statique avec features v6
const writeFile = tool({
  description: "Write a file to disk",
  inputSchema: z.object({ path: z.string(), content: z.string() }),
  needsApproval: true,                       // human-in-loop, v6
  strict: true,                              // OpenAI strict-mode JSON, par tool, v6
  inputExamples: [{ input: { path: "src/x.ts", content: "..." }}],
  execute: async ({ path, content }) => writeAtomic(path, content),
  toModelOutput: ({ input, output }) => ({   // v6: vue modèle séparée du retour app
    type: "text",
    value: `Wrote ${output.bytes} bytes to ${input.path}`,
  }),
});

// Tool dynamique — schéma inconnu à compile time
const userTool = dynamicTool({
  description: spec.description,
  inputSchema: jsonSchemaToZod(spec.schema),
  execute: async (input) => callUserHandler(spec.id, input),
});

// MCP client avec OAuth (v6)
const mcp = await createMCPClient({
  transport: { type: "http", url: "https://mcp.notion.com/mcp" },
});
const mcpTools = await mcp.tools();
const resources = await mcp.listResources();
```

### Doctrine de prod : tools in-process > MCP, sauf si...

La doc Vercel est sans ambiguïté : **préférez les tools AI SDK in-process** pour le typing end-to-end et la vitesse d'exécution ; utilisez MCP quand la surface de tools est *possédée par une autre équipe ou par l'utilisateur*. Les tools AI SDK ont la full type safety via le générique `UIMessage<Metadata, DataParts, Tools>` ; les tools MCP sont runtime-typed.

### `needsApproval` (human-in-loop)

Le tool ne s'exécute pas tant que l'utilisateur n'a pas approuvé. Pattern UI : on render le tool call avec deux boutons "Approve" / "Deny" ; au click, on `sendMessage` avec un message custom qui débloque l'agent.

### Generators dans `execute` (v6)

```typescript
tool({
  inputSchema: z.object({ city: z.string() }),
  async *execute({ city }) {
    yield { status: "loading", city };
    const data = await fetch(`/api/weather/${city}`).then(r => r.json());
    yield { status: "success", city, ...data };
  },
});
```

Le client reçoit les états intermédiaires — utile pour les tools longs (>5 s) qui veulent montrer du progrès.

## 5. `useChat` v6 — transport, `sendMessage`, data parts typed

L'API chat est radicalement différente de v4. State découplé (Zustand/Redux/MobX marchent nativement), transport pluggable, types end-to-end.

```typescript
// types.ts
import type { UIMessage } from "ai";
type Metadata = { model: string; totalTokens?: number };
type DataParts = {
  weather: { city: string; temp?: number; status: "loading" | "success" };
  notification: { message: string; level: "info" | "warn" | "error" };
};
type Tools = { searchCode: typeof searchCode; finalAnswer: typeof finalAnswer };
export type AppMessage = UIMessage<Metadata, DataParts, Tools>;

// client.tsx
import { useChat, DefaultChatTransport } from "@ai-sdk/react";

const { messages, sendMessage, status, stop, regenerate, setMessages } =
  useChat<AppMessage>({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: () => ({ Authorization: `Bearer ${token}` }),
      body: () => ({ chatId, model: selectedModel }),
    }),
    onData: ({ type, data }) => {
      if (type === "data-notification" && data.level === "error") toast.error(data.message);
    },
    onFinish: ({ message }) => log(message.metadata?.totalTokens),
  });

await sendMessage({ text: "summarize the repo" });
await sendMessage({ files: fileList });                    // multimodal
await sendMessage({ parts: [{ type: "text", text: "..." }, { type: "file", url, mediaType }] });
```

Côté serveur, `createUIMessageStream` + `writer.write({ type: "data-weather", id, data, transient? })` permet de streamer des data parts typés que le client reçoit via `onData` et render inline. **`transient: true` = ne persiste pas en historique** ; c'est le pattern canonique pour les statuts éphémères (toasts, progrès).

## 6. AI Gateway (default en v6)

Les model strings routent par défaut via le gateway sauf si vous importez explicitement un provider. C'est ce qui débloque les comportements production-grade :

```typescript
const { text } = await generateText({
  model: "anthropic/claude-sonnet-4.5",
  providerOptions: {
    gateway: {
      order: ["anthropic", "vertex", "bedrock"],     // essayer dans cet ordre
      only: ["anthropic", "vertex", "bedrock"],      // restreindre
      models: ["openai/gpt-5.4-nano"],               // ladder de fallback de modèle
      zeroDataRetention: true,
      hipaaCompliant: true,
      user: userId,
      tags: ["agent:research", "tier:enterprise"],
    },
  },
});
```

L'OIDC gère l'auth sur les déploiements Vercel (pas de clés API en env). Reports de dépense via `gateway.getSpendReport({ groupBy: "tag" })`.

> **Trade-off** : un overhead de latence mesurable (~10–30 ms) vs SDK Anthropic natif. Pour la majorité des apps, le failover + observabilité valent largement le coût.

## 7. La classe `ToolLoopAgent` (v6) — le bon abstrait pour le réutilisable

```typescript
import { ToolLoopAgent, stepCountIs } from "ai";

export const supportAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  instructions: "You are a tier-2 support agent.",
  tools: { lookupCustomer, refund, escalate },
  stopWhen: stepCountIs(10),
  callOptionsSchema: z.object({
    userId: z.string(),
    tier: z.enum(["free", "pro", "enterprise"]),
  }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: `${settings.instructions}\nAccount tier: ${options.tier}.`,
  }),
});

const result = await supportAgent.generate({
  prompt: "User #123 wants a refund",
  callOptions: { userId: "123", tier: "pro" },
});
```

L'`Agent` est la bonne abstraction quand on a *plusieurs call sites pour le même agent* (route chat + cron job + queue worker). Pour les appels one-shot, `streamText`/`generateText` restent les primitives bas-niveau.

## 8. Resumable streams (v5+)

Construit sur `@vercel/resumable-stream` + Redis. **Trade-off** : incompatible avec l'abort. Choisissez l'un ou l'autre.

```typescript
// app/api/chat/route.ts
import { createResumableStreamContext } from "resumable-stream";
import { Redis } from "ioredis";
const ctx = createResumableStreamContext({ waitUntil, redis: new Redis(process.env.REDIS_URL!) });

export async function POST(req: Request) {
  const { id, message } = await req.json();
  const result = streamText({ model, messages, /* ... */ });
  const streamId = crypto.randomUUID();
  await db.chats.update({ id, activeStreamId: streamId });

  return new Response(
    await ctx.resumableStream(streamId, () => result.toUIMessageStream()),
    { headers: { "content-type": "text/event-stream" } },
  );
}

// app/api/chat/[id]/stream/route.ts — handler GET pour resume
export async function GET(_: Request, { params }) {
  const chat = await db.chats.findById(params.id);
  if (!chat.activeStreamId) return new Response(null, { status: 204 });
  const stream = await ctx.resumeExistingStream(chat.activeStreamId);
  return new Response(stream, { headers: { "content-type": "text/event-stream" } });
}

// client
useChat({ id, resume: true, transport: new DefaultChatTransport({ /* ... */ }) });
```

Sans resumable streams, un refresh de page ou une perte de réseau fait perdre le stream en cours. **À adopter pour tout chat sérieux.**

## 9. Récupération d'erreur en cours de stream

Deux paths :

1. **Failure provider mid-stream** : `onError` se déclenche, le texte partiel est préservé dans `result.steps`, persistez ce que vous avez.
2. **Failure d'exécution de tool** : le tool throw → l'AI SDK marque le résultat comme erreur → l'étape suivante, le modèle voit l'erreur et décide. **Ne catchez pas dans le tool** ; laissez le modèle récupérer.

## 10. Choix du path pour les sorties structurées

| Besoin | Utiliser |
|---|---|
| Sortie structurée pure, pas de tools | `generateObject` (le plus propre) |
| Boucle de tools + sortie structurée finale | `generateText` + `Output.object()` (v6) |
| Streaming d'objet partiel vers l'UI | `streamObject` ou `streamText` + `partialOutputStream` |
| Mode chooser au niveau provider raw | `mode: "json" \| "tool" \| "json-schema"` (quand le provider diffère) |

Les équipes de prod ont largement standardisé sur Zod. ArkType monte pour les paths sensibles à la perf, et Standard JSON Schema (en v6) permet le mix-and-match.

> JSON-mode (le bouton OpenAI `response_format: json_object`) est désormais legacy — utilisez `Output.object()` avec strict mode et laissez le SDK choisir le wire format selon le provider.

## 11. Comparaison frameworks (avril 2026)

| Capability | AI SDK 6 | Mastra 1.0 | LangGraph TS | Claude Agent SDK | OpenAI Agents |
|---|---|---|---|---|---|
| **TypeScript-native** | oui | oui | port | oui | oui |
| **Provider-agnostic** | oui (gateway) | oui | oui | Claude only | OpenAI only |
| **Best for chatbots/streaming UI** | best | good | weak | weak | ok |
| **Best for agentic workflows** | good | best | good | best (file-system) | good |
| **Best for RAG** | good | best (built-in) | good | manuel | good (file_search) |
| **Best for multi-agent** | ok (Agent + handoffs manuels) | good (workflows) | best (graph) | good (sub-agents) | good (handoffs) |
| **Built-in human-in-loop** | oui (`needsApproval`) | oui | manuel | oui (permissions) | manuel |
| **Resumable streams** | oui (Redis) | partiel | manuel | session resume | server-stateful |
| **Durable execution** | externe (Trigger/Inngest) | externe | externe | sessions | server-stateful |
| **Server-managed tools** | gateway-routed | none | none | none | oui (web/file/computer) |
| **Observabilité** | Gateway + DevTools | built-in | LangSmith | session log | Traces dashboard |
| **Lock-in** | low | low | medium | high | high |

## 12. Quand choisir quoi (recommandation honnête sénior)

- **Chatbot ou feature IA dans une app Next.js** : AI SDK 6 + AI Gateway. Les primitives streaming UI et `useChat` sont sans équivalent.
- **Agent autonome long-running** (écrit du code, run tests, ouvre PRs) : **Claude Agent SDK**, optionnellement wrappé dans une task Trigger.dev pour la durabilité. Ne tentez pas ça sur les Vercel functions.
- **Cross-provider, cross-cloud TS-native avec workflows + agents + RAG** : **Mastra**. Used by Replit, PayPal, Sanity, Brex.
- **Multi-agent avec state graph explicite** : LangGraph si vous avez du Python ; sinon Mastra workflows.
- **Stack OpenAI-only avec tools managés (web/file search/computer use)** : OpenAI Agents SDK. Vous acceptez le lock-in pour les tools managés.
- **Agents durables, fault-tolerant** : Inngest AgentKit ou Trigger.dev wrappant l'AI SDK.

> Ne démarrez pas un projet avec **AI SDK RSC** — pause active. Faites de la generative UI avec `useChat` + custom data parts.

## 13. Claude Agent SDK — quand vous *en avez vraiment besoin*

Le SDK qui fait tourner Claude Code, exposé en `@anthropic-ai/claude-agent-sdk`. Centre de design **différent** de l'AI SDK : autonome, long-running, sur le filesystem, avec permissions, sessions, sub-agents en first-class.

```typescript
import {
  query, tool, createSdkMcpServer, listSessions,
} from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const grepTool = tool(
  "ripgrep",
  "Search files using ripgrep",
  { query: z.string(), path: z.string().optional() },
  async ({ query, path }) => ({
    content: [{ type: "text", text: await rg(query, path) }],
  }),
  { annotations: { readOnlyHint: true } },
);
const server = createSdkMcpServer({ name: "rg", version: "1", tools: [grepTool] });

const stream = query({
  prompt: "Find all usages of `useEffect` and report patterns",
  options: {
    model: "claude-opus-4-1",
    cwd: "/path/to/repo",
    maxTurns: 20,
    permissionMode: "default",                // default | acceptEdits | bypassPermissions | plan
    settingSources: [],                        // [] = ignorer les CLAUDE.md/settings filesystem
    allowedTools: ["Read", "Grep", "Glob"],
    mcpServers: { rg: { type: "sdk", instance: server } },

    agents: {
      reviewer: {
        description: "Reviews code for correctness and style",
        prompt: "You are a strict code reviewer.",
        model: "opus",
        tools: ["Read", "Grep"],
        disallowedTools: ["Write", "Bash"],
        maxTurns: 5,
      },
    },

    canUseTool: async (toolName, input, { decisionReason, agentID }) => {
      if (toolName === "Bash" && /rm |drop /i.test(input.command ?? "")) {
        return { behavior: "deny", message: "destructive op blocked", interrupt: true };
      }
      return { behavior: "allow" };
    },

    hooks: {
      PreToolUse: [{
        hooks: [async (input) => {
          await audit(input);
          return {
            hookSpecificOutput: {
              hookEventName: "PreToolUse",
              permissionDecision: input.tool_name === "Write" ? "ask" : "allow",
            },
          };
        }],
      }],
    },
  },
});

for await (const msg of stream) {
  if (msg.type === "assistant") render(msg.message.content);
  if (msg.type === "result" && msg.subtype === "success") {
    log({ cost: msg.total_cost_usd, turns: msg.num_turns });
  }
}
```

> **Le V2 `send()` / `stream()` est en preview en avril 2026.** Pas pour la prod. **Restez sur V1 `query()`** qui est stable et bien documenté.

## 14. OpenAI Agents SDK + Responses API

`@openai/agents` (TypeScript). Construit sur la **Responses API**, qui est la default OpenAI désormais — Chat Completions marche encore, Assistants sunset août 2026.

```typescript
import {
  Agent, run, tool, handoff, webSearchTool, fileSearchTool, computerTool,
} from "@openai/agents";
import { z } from "zod";

const refundTool = tool({
  name: "refund",
  description: "Issue a refund",
  parameters: z.object({ orderId: z.string(), amount: z.number() }),
  execute: async ({ orderId, amount }) => stripe.refunds.create({ /* ... */ }),
});

const triage = new Agent({
  name: "Triage",
  model: "gpt-5.4",
  instructions: "Route to the right specialist.",
  tools: [webSearchTool()],
  handoffs: [
    handoff({ agent: refundsAgent, name: "transfer_to_refunds" }),
    handoff({ agent: techAgent, name: "transfer_to_tech" }),
  ],
});

const result = await run(triage, "I want a refund for order 12345", {
  previousResponseId: lastResponseId,         // stateful
});
```

Tools built-in qui *sont* le selling point : `webSearchTool`, `fileSearchTool` (vector store managé), `computerTool` (modèle CUA + sandbox), `codeInterpreterTool`, `imageGenerationTool`. Ils tournent server-side chez OpenAI ; pas d'infra à payer. Pas customisables — c'est le trade-off.

Tracing built-in (chaque run a une trace sur platform.openai.com), pas de config.

## Ce qu'il faut emporter de ce module

1. **Démarrer en 2026 = AI SDK 6 + AI Gateway**, point. Sauf cas spécifiques (Claude Agent SDK pour les agents long-running, OpenAI Agents pour les tools managés).
2. **`stopWhen: stepCountIs(N)` est ton filet de sécurité**, à mettre systématiquement.
3. **`prepareStep` est l'endroit propre** pour le model tiering, le sliding window, le forced tool choice.
4. **`needsApproval`** (v6) débloque les workflows avec gates humains, sans rouler ton propre approval flow.
5. **AI SDK RSC est en pause** ; faites du Generative UI avec `useChat` + data parts custom.
6. **MCP arrive comme client** dans v6 avec OAuth — branchez Notion/Linear/Sentry/GitHub pour avoir des tools sans coder.

Module suivant : [03-workflow-agents-dev.md](./03-workflow-agents-dev.md) — comment vous-même travaillez avec ces outils au quotidien.
