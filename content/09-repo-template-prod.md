# Module 09 — Repo template de prod (Avril 2026)

> Tout ce qui précède matérialisé dans une structure de repo concrète. Cherry-pickez ce qui s'applique à votre cas.

## Vue d'ensemble visuelle

Le diagramme [Architecture du repo](/diagrammes#repo-architecture) montre les liens entre AGENTS.md, `.claude/`, `specs/`, `apps/`, `packages/`, `trigger/`, `evals/` et la CI.

## 1. Structure top-level

```
my-ai-app/
├── apps/
│   ├── web/                          # Next.js 16 (UI principale)
│   └── docs/                         # Doc / blog (optionnel, Fumadocs ou Docusaurus)
├── packages/
│   ├── ai/                           # Wrapper AI SDK + prompts + tools partagés
│   ├── db/                           # Drizzle schema + queries
│   ├── ui/                           # shadcn primitives + design tokens
│   ├── auth/                         # BetterAuth config + DAL
│   ├── config-eslint/
│   ├── config-tsconfig/
│   └── config-tailwind/
├── trigger/                          # Tasks Trigger.dev (background)
├── evals/                            # Promptfoo configs + golden datasets
├── specs/                            # Specs SDD pour les features > 2 jours
├── .claude/                          # Claude Code: skills, agents, settings, hooks
│   ├── skills/
│   ├── agents/
│   ├── settings.json
│   └── scripts/
├── AGENTS.md                         # Instructions tool-agnostiques (≤ 80 lignes)
├── CLAUDE.md                         # Claude-specific seulement (rare)
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── evals.yml
│       └── deploy.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 2. `AGENTS.md` minimaliste (top-level)

```markdown
# Project: my-ai-app

## Stack
- Next.js 16 (App Router, Cache Components)
- React 19.2 + TypeScript 5.x strict
- Drizzle ORM + PostgreSQL (Neon)
- AI SDK 6 + Vercel AI Gateway
- BetterAuth
- Trigger.dev v3 (background tasks)

## Commands
- `pnpm dev` — local dev (Turbopack)
- `pnpm build` — production build
- `pnpm test` — Vitest
- `pnpm test:e2e` — Playwright
- `pnpm db:push` — push Drizzle schema
- `pnpm evals` — run Promptfoo regression tests

## Conventions
- Server Actions: validate inputs with Zod, re-auth via `verifySession()` from `packages/auth`.
- Server Components: data fetching via DAL only, never direct ORM calls.
- AI: model strings via Gateway, never instantiate provider clients directly.
- Tools required for: any code in `packages/auth/dal.ts`, any AI tool in `packages/ai/tools/*`.
- Tests required for: any change to `packages/auth`, any change to `packages/ai/tools/*`.

## Don't
- Don't add comments unless explaining WHY (business rule, gotcha, workaround).
- Don't hardcode user-facing strings — `next-intl` namespaces in `packages/i18n`.
- Don't put authz logic in `proxy.ts` (middleware) — re-verify in pages/actions.
- Don't write `.cursorrules` / `.windsurfrules` — this AGENTS.md is the single source.

## Specs
- Features > 2 days of work: write a spec in `specs/<feature>/{requirements,design,tasks}.md`.
- Smaller changes: skip the spec, use plan mode.

## Evals
- Run `pnpm evals` before merging changes to `packages/ai/prompts/*` or `packages/ai/agents/*`.
- CI gate: faithfulness ≥ 0.85, answer_relevance ≥ 0.80.
```

> **Gardez ça sous 80 lignes.** Tout le reste va dans des skills.

## 3. `.claude/settings.json`

```json
{
  "permissions": {
    "allow": ["Read", "Grep", "Glob", "Bash(pnpm test:*)", "Bash(pnpm typecheck)"],
    "deny": ["Bash(rm -rf*)", "Bash(git push --force*)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "node ./.claude/scripts/check-bash.js"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "pnpm prettier --write $CLAUDE_FILE_PATH 2>/dev/null && pnpm eslint --fix $CLAUDE_FILE_PATH 2>/dev/null"
        }]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{
          "type": "command",
          "command": "node ./.claude/scripts/inject-context.js"
        }]
      }
    ]
  }
}
```

## 4. `.claude/scripts/check-bash.js`

```javascript
#!/usr/bin/env node
const input = JSON.parse(process.argv[2] || '{}');
const cmd = input.tool_input?.command ?? '';

const dangerous = [
  /rm -rf [^/]/,
  /git push.*--force/,
  /drop (table|database)/i,
  /TRUNCATE/i,
  /delete from .* (?!where)/i,
];

for (const pattern of dangerous) {
  if (pattern.test(cmd)) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Dangerous command blocked: matches ${pattern}`,
      },
    }));
    process.exit(0);
  }
}

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow",
  },
}));
```

## 5. `.claude/skills/<domain>/SKILL.md`

Exemple : skill Stripe webhooks.

```markdown
---
name: stripe-webhooks
description: Use when implementing or debugging Stripe webhook handlers. Covers signature verification, idempotency, retry logic.
---

# Stripe Webhooks Skill

## Signature verification

Always use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`.
Never accept events without signature verification.

## Idempotency

Stripe retries webhooks. Insert event ID into the `webhook_events` table
with `ON CONFLICT DO NOTHING`. If conflict, return 200 immediately
without re-processing.

## Retry logic

Stripe retries with exponential backoff for 3 days. Always return 200
after recording the event, then process async via Trigger.dev.

@./reference.md
@./examples/checkout-completed.ts
```

## 6. `.claude/agents/security-reviewer.md`

```markdown
---
name: security-reviewer
description: Reviews code for security issues. Use when changes touch auth, payments, PII, or LLM tool execution.
tools: Read, Grep, Glob, WebFetch
model: opus
---

You are a strict security reviewer. Focus on:
- OWASP Top 10 vulnerabilities (especially A01 Broken Access Control, A03 Injection, A07 Authn).
- Prompt injection in code that takes LLM output (direct or indirect via retrieved content).
- Authn/z bypasses (esp. Server Actions called without `verifySession()`).
- PII leakage in logs (esp. full prompts containing user input).
- Secrets in code or env files.

Report only HIGH and CRITICAL severity. Don't lecture about minor style.
For each issue:
- File and line number.
- Severity (HIGH / CRITICAL).
- Why it matters.
- Specific fix recommendation.
```

## 7. `packages/ai/` structure

```
packages/ai/
├── agents/
│   ├── support-agent.ts             # ToolLoopAgent definition
│   └── research-agent.ts
├── prompts/
│   ├── system.ts                    # Stable system prompts (cached)
│   └── tools.ts                     # Tool definitions
├── tools/
│   ├── search-code.ts
│   ├── retrieve.ts
│   └── final-answer.ts
├── gateway.ts                       # AI Gateway config + helpers
├── index.ts
└── package.json
```

```typescript
// packages/ai/gateway.ts
import { createAnthropic } from "@ai-sdk/anthropic";
import { gateway } from "@ai-sdk/gateway";

export function getModel(name: string, opts?: { tags?: string[] }) {
  // Model strings routed via Gateway
  return {
    model: name,
    providerOptions: {
      gateway: {
        order: ["anthropic", "vertex", "bedrock"],
        zeroDataRetention: process.env.NODE_ENV === "production",
        tags: opts?.tags ?? [],
      },
    },
  };
}
```

```typescript
// packages/ai/agents/support-agent.ts
import { ToolLoopAgent, stepCountIs } from "ai";
import { z } from "zod";
import { lookupCustomer, refund, escalate } from "../tools";

export const supportAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  instructions: `You are a tier-2 support agent.
Greet the user, identify them, then resolve the issue or escalate.`,
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
```

## 8. `packages/auth/` structure

```
packages/auth/
├── auth.ts                          # BetterAuth config
├── dal.ts                           # Data Access Layer
└── package.json
```

```typescript
// packages/auth/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, twoFactor } from "better-auth/plugins";
import { db } from "@my/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    },
  },
  plugins: [organization(), twoFactor()],
});
```

```typescript
// packages/auth/dal.ts
import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@my/db";

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

export async function assertWorkspaceMember(userId: string, workspaceId: string) {
  const member = await db.query.workspaceMembers.findFirst({
    where: { userId, workspaceId },
  });
  if (!member) throw new Error("forbidden");
  return member;
}

export async function getProfileDTO(slug: string) {
  const viewer = await verifySession();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.slug, slug));
  return {
    username: row.username,
    phone: viewer?.role === "admin" || viewer?.workspaceId === row.workspaceId
      ? row.phone
      : null,
  };
}
```

## 9. `apps/web/` (Next.js)

```
apps/web/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── webhooks/stripe/route.ts
│   │   └── jobs/drain/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── proxy.ts                         # ex middleware.ts
├── next.config.ts
└── package.json
```

```typescript
// apps/web/next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  cacheComponents: true,
  experimental: {
    authInterrupts: true,
    viewTransition: true,
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com" },
    ],
    minimumCacheTTL: 86400,
  },
};

export default config;
```

```typescript
// apps/web/app/api/chat/route.ts
import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { verifySession } from "@my/auth";
import { tools } from "@my/ai/tools";
import { getModel } from "@my/ai/gateway";

export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await verifySession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { messages, chatId } = await req.json();

  const result = streamText({
    ...getModel("anthropic/claude-sonnet-4.5", {
      tags: [`user:${user.id}`, `chat:${chatId}`],
    }),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
    abortSignal: req.signal,
    onFinish: async ({ text, totalUsage, steps }) => {
      await db.chats.appendMessage({
        chatId,
        role: "assistant",
        content: text,
        usage: totalUsage,
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
```

## 10. `evals/` structure

```
evals/
├── promptfoo.yaml
├── datasets/
│   ├── support.jsonl                # 100+ queries golden
│   └── research.jsonl
└── thresholds.ts
```

```yaml
# evals/promptfoo.yaml
prompts:
  - file://../packages/ai/prompts/system.ts
providers:
  - id: anthropic:claude-sonnet-4.5
    config:
      max_tokens: 1024
tests:
  - description: "Refund flow basic"
    vars:
      query: "I want a refund for order 12345"
    assert:
      - type: contains
        value: "lookup_customer"
      - type: llm-rubric
        value: "Confirms customer identity before issuing refund"
        threshold: 0.85
      - type: latency
        threshold: 5000
```

## 11. `.github/workflows/evals.yml`

```yaml
name: Evals
on:
  pull_request:
    paths:
      - "packages/ai/prompts/**"
      - "packages/ai/agents/**"
      - "packages/ai/tools/**"

jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm promptfoo eval --output evals/results.json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - run: pnpm tsx evals/check-thresholds.ts evals/results.json
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: eval-results
          path: evals/results.json
```

## 12. `specs/` (Spec-Driven Development)

Pour les features > 2 jours :

```
specs/
└── 2026-04-checkout-redesign/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

```markdown
# requirements.md

## User Stories

### US-1: Apply discount code at checkout
WHEN the user enters a valid discount code AND clicks Apply,
THE SYSTEM SHALL display the discounted total within 500 ms.

### US-2: Reject invalid discount code
WHEN the user enters an invalid discount code,
THE SYSTEM SHALL display "Code invalid or expired" without changing the total.

### US-3: Multiple discount handling
WHEN the user attempts to apply a second discount code,
THE SYSTEM SHALL show "Only one discount per order" and not modify the cart.
```

```markdown
# design.md

## Architecture

POST /api/cart/discount → Server Action → discount.service.applyDiscount()

## Data flow

[diagram of components and stores]

## Edge cases
- Network failure mid-apply → optimistic UI rollback
- Code expires between fetch and apply → backend rejects
- Tax recomputation triggers → rate-limited
```

```markdown
# tasks.md

- [ ] T-1: Add `applyDiscount` action in `apps/web/app/cart/actions.ts`
- [ ] T-2: Add `applyDiscount` service in `packages/services/cart`
- [ ] T-3: Add VineJS validator
- [ ] T-4: Update cart store optimistic mutation
- [ ] T-5: Tests for happy path + 3 error paths
- [ ] T-6: Eval prompt for the assistant cart helper
- [ ] T-7: Update i18n strings (en, fr)
```

## 13. `trigger/` structure

```
trigger/
├── trigger.config.ts
├── tasks/
│   ├── ingest-doc.ts
│   ├── research-agent.ts
│   └── webhook-stripe.ts
└── package.json
```

```typescript
// trigger/trigger.config.ts
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "my-ai-app",
  runtime: "node",
  logLevel: "info",
  maxDuration: 1800,
  retries: { default: { maxAttempts: 3 } },
  dirs: ["./tasks"],
});
```

## 14. `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": { "dependsOn": ["^build"] },
    "test:e2e": { "dependsOn": ["build"] },
    "lint": {},
    "typecheck": { "dependsOn": ["^typecheck"] },
    "evals": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

## 15. `package.json` scripts (root)

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "test:e2e": "turbo test:e2e",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "evals": "turbo evals",
    "db:push": "pnpm --filter @my/db db:push",
    "trigger:dev": "pnpm --filter @my/trigger dev",
    "trigger:deploy": "pnpm --filter @my/trigger deploy"
  }
}
```

## 16. Variables d'env (.env.local) typique

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000

# AI (provider direct)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Vercel AI Gateway (recommandé)
AI_GATEWAY_API_KEY=...           # OIDC sur Vercel, sinon explicit

# Trigger.dev
TRIGGER_SECRET_KEY=tr_dev_...
TRIGGER_PROJECT_ID=...

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Vector store (pgvector via DATABASE_URL, ou autre)
TURBOPUFFER_API_KEY=...

# Observability / evals
LANGFUSE_SECRET_KEY=...
LANGFUSE_PUBLIC_KEY=...
BRAINTRUST_API_KEY=...

# Webhooks
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GITHUB_WEBHOOK_SECRET=...

# Misc
REDIS_URL=redis://...
KV_REST_API_TOKEN=...

# Security
LAKERA_API_KEY=...               # prompt injection guard
```

## 17. Checklist sénior pré-déploiement

- [ ] AGENTS.md ≤ 80 lignes, à jour avec les commands actuels.
- [ ] Hooks `.claude/settings.json` activés (PreToolUse Bash check, PostToolUse formatter).
- [ ] DAL en place dans `packages/auth` ; toutes les queries Server Components passent par lui.
- [ ] Server Actions validés Zod + `verifySession()`.
- [ ] AI Gateway configuré ; pas d'instanciation directe de provider client en prod.
- [ ] `cacheComponents: true` ; au moins un `'use cache'` segment par route principale.
- [ ] Resumable streams branchés sur les chats (Redis store).
- [ ] Trigger.dev tasks pour tout > 60 s ou avec retry needs.
- [ ] Webhooks : signature check + idempotence par event ID.
- [ ] Per-tenant rate limiting (token-aware, pas request-aware).
- [ ] Lakera ou équivalent en input filter pour les LLM endpoints user-facing.
- [ ] Trust boundaries : tags `<untrusted>` sur tout contenu retrieved.
- [ ] Tools `needsApproval: true` pour les actions destructives.
- [ ] Promptfoo eval CI gate (faithfulness ≥ 0.85, relevance ≥ 0.80).
- [ ] OpenTelemetry GenAI conventions activées.
- [ ] Cost dashboard par tenant / model / feature ; alertes spike + cache miss.
- [ ] Backup strategy DB ; backup vector store si pgvector ; reindex script.
- [ ] BYOK encryption (envelope KMS).
- [ ] EU residency configurée si applicable (Gateway region routing).

## Ce qu'il faut emporter de ce module

1. **AGENTS.md court (≤ 80 lignes), tool-agnostique, single source.**
2. **`.claude/skills/`** pour le domain knowledge ; **`.claude/agents/`** pour les subagents réutilisables ; **`.claude/settings.json`** pour les hooks enforcés.
3. **`packages/ai/`** centralise prompts, tools, agents, gateway config — cross-app reuse.
4. **`packages/auth/dal.ts`** est le seul point d'accès auth + data ; Server Components → DTO uniquement.
5. **`evals/`** avec golden datasets et CI gate ; `specs/` pour les features > 2 jours.
6. **`trigger/`** pour tout ce qui dépasse 60 s ou nécessite retry/durabilité.
7. **Checklist pré-déploiement** : c'est la liste qu'on parcourt avant chaque release majeure.

Module suivant : [10-roadmap-personnelle.md](./10-roadmap-personnelle.md) — comment vous transformez personnellement en top dev IA en 6 mois.
