# Module 03 — Workflow dev avec agents (Avril 2026)

> Ce module couvre comment *vous* travaillez avec les outils, pas comment vous construisez des features IA. Ces deux niveaux comptent autant l'un que l'autre.

## 1. Claude Code comme plateforme power user

Claude Code n'est pas un chatbot dans un terminal — c'est un utilitaire Unix avec une surface d'extension profonde. Les cinq points d'extension, classés par leverage :

### 1.1 Hooks (déterministe, blocage garanti)

Configurés dans `.claude/settings.json`, `~/.claude/settings.json`, ou `.claude/settings.local.json`. Le cycle de vie : `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `Stop`, `SessionEnd`, plus en mode team `TeammateIdle`, `TaskCreated`, `TaskCompleted`.

Les hooks tournent comme commandes shell, endpoints HTTP, tools MCP, ou même prompts Claude. Output JSON structuré : `permissionDecision: "allow|deny|ask|defer"`, `updatedInput`, `additionalContext`. Exit code 2 = block.

> **C'est le seul mécanisme qui *garantit* un comportement.** CLAUDE.md est advisory ; les hooks sont enforced.

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node ./.claude/scripts/check-bash.js"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm prettier --write $CLAUDE_FILE_PATH && pnpm eslint --fix $CLAUDE_FILE_PATH"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{
          "type": "command",
          "command": "node ./.claude/scripts/inject-ci-status.js"
        }]
      }
    ]
  }
}
```

Cas d'usage prouvés en prod :

- `PreToolUse` matcher sur `Bash` qui diffe les `rm -rf`, `drop table`, et deny.
- `PostToolUse` matcher sur `Edit|Write` qui run `prettier` + `eslint --fix` + `tsc --noEmit`.
- `UserPromptSubmit` qui injecte la branche git courante + statut CI dans le contexte.
- `SessionStart` qui charge un fichier `progress.md` du projet.

### 1.2 Skills (auto-loaded knowledge avec progressive disclosure)

Un fichier `SKILL.md` avec frontmatter YAML (`name`, `description`) sous `.claude/skills/<name>/`. Trois niveaux de chargement :

1. **Au startup** : `name` + `description` chargés (pour décider si la skill s'active).
2. **À la pertinence détectée** : full `SKILL.md` chargé.
3. **Sur besoin** : fichiers/scripts référencés chargés.

Anthropic engineering blog (oct. 2025) : "Equipping agents for the real world with Agent Skills". C'est *le* mécanisme pour ne pas bloater CLAUDE.md — la connaissance domain-specific dort dans des skills jusqu'à ce que la pertinence task la déclenche. Anthropic en utilise des centaines en interne.

```markdown
---
name: stripe-webhooks
description: Use when implementing or debugging Stripe webhook handlers. Covers signature verification, idempotency keys, retry logic.
---

# Stripe Webhooks Skill

## Signature verification

Always use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`...

## Idempotency

The Stripe Idempotency-Key header is sent with retries...

@./reference.md
@./scripts/replay-event.ts
```

Skills peuvent inclure des scripts exécutables. La skill PDF canonique d'Anthropic bundle un extracteur Python qui tourne sans charger le contenu en contexte.

### 1.3 Subagents vs Agent Teams (deux modèles de parallelisme)

**Subagents** (`.claude/agents/<name>.md`) : contexte propre, retournent un summary à l'appelant, pas de messaging entre pairs. Built-ins : `Explore` (read-only, Haiku, rapide), `Plan`, `Implement`. À utiliser pour la fan-out research qui sinon flooderait le contexte principal.

```markdown
---
name: security-reviewer
description: Reviews code for security issues (OWASP Top 10, prompt injection, authn/z)
tools: Read, Grep, Glob, WebFetch
model: opus
---

You are a strict security reviewer. Focus on:
- OWASP Top 10 vulnerabilities
- Prompt injection in LLM-handling code
- Authn/z bypasses
- PII leakage in logs

Report only HIGH and CRITICAL issues. Don't lecture about minor style.
```

**Agent Teams** (Claude Code v2.1.32+, env flag `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) : une session lead spawn des teammates nommés, avec une task list partagée, file locking, et mailbox peer-to-peer. Affichage : in-process (`Shift+Down` pour cycler) ou split panes via tmux/iTerm2.

> **Le killer use case** : **debugging adversarial par hypothèses concurrentes**. 5 teammates défendent chacun une théorie, avec instruction de *réfuter les autres*. Tokens scale linéairement ; sweet spot 3–5 teammates avec 5–6 tasks chacun.

### 1.4 Plan Mode — le golden workflow

> Boris Cherny (Anthropic) : *"Once there is a good plan, it will one-shot the implementation almost every time."*

Pattern :
1. Entrer en plan mode (`/plan` ou Shift+Tab pour cycler).
2. Claude lit les fichiers (lecture seule, pas de write).
3. Press `Ctrl+G` pour ouvrir le plan dans `$EDITOR`.
4. Reviewer comme la PR description d'un junior — marquer les hypothèses fausses, les edge cases manquants.
5. Sortir du plan mode pour exécution normale.

**Skip plan mode seulement quand le diff tient en une phrase.** Sur des changements multi-fichiers, le coût d'aller dans la mauvaise direction excède largement le coût de planning.

Ultraplan (preview avril 2026) draft le plan sur le cloud Anthropic et expose un éditeur web pour l'annotation avant exécution remote/locale — donne aux tech leads un audit trail pour les changements régulés.

### 1.5 Plugins + Marketplace

L'unité de distribution. Un plugin bundle skills, hooks, subagents, et MCP servers. Le marketplace Anthropic-managed (`anthropics/claude-plugins-official`) a été rejoint en février 2026 par les marketplaces enterprise — les boites hébergent leur propre registry plugin, et le badge "Anthropic Verified" indique une review qualité+sécurité.

C'est ainsi que les staff engineers packagent la connaissance institutionnelle pour une org sans que chaque équipe la rebuilde.

### 1.6 Autres knobs qui comptent

| Commande | Usage |
|---|---|
| `claude --continue` / `--resume` | Reprendre une session entre journées |
| `/rewind` (ou `Esc Esc`) | Restore un checkpoint (chaque action checkpoint, persiste cross-session, pas un git replacement) |
| `/btw` | Question side qui ne rentre pas dans le contexte |
| `/compact <instruction>` | Summarization steered |
| `claude -p "..."` | Mode non-interactif pour CI / pre-commit |
| `--permission-mode auto` | Classifier model qui block l'escalation de scope mais laisse passer le routine |

> **Auto mode est la réponse pratique à la fatigue de prompts permission** — et la raison pour laquelle les séniors peuvent run du fan-out unattended.

## 2. Cursor 2.0 / 3.0 — IDE-first agentique

**Cursor 2.0** (29 oct. 2025) a shippé **Composer**, un modèle in-house RL-tuned pour le coding agentique low-latency (~4× plus rapide que les models comparables, la plupart des tâches < 30 s). L'interface multi-agent permet de run plusieurs agents en parallèle via git worktrees ou remote machines, puis de pick le winner.

> Cursor a trouvé que **déployer plusieurs models sur le même problème et sélectionner le meilleur** améliore matériellement la qualité sur les tâches dures.

**Cursor 3** (2 avril 2026) ajoute un **workspace unifié** : agents cloud et locaux dans une seule sidebar, lançables depuis mobile, web, desktop, Slack, GitHub, ou Linear. Sessions hand-off cloud↔local seamlessly. Background agents sur infra cloud Anthropic-style survivent à la fermeture du laptop ; vous recevez les notifs. Cursor 3 a full LSP, browser intégré pour les tests locaux, et un marketplace plugin avec MCPs et subagents customs.

### Claude Code vs Cursor — la décision sénior

| Vous voulez… | Choisir |
|---|---|
| Workflow Unix profond, terminal, scriptable | **Claude Code** |
| Hooks-driven enforcement, run en CI headless | **Claude Code** |
| Plan mode déterministe, review du plan offline | **Claude Code** |
| Le pattern parallel-by-default Anthropic | **Claude Code** |
| Visual diff workflows, garder l'IDE feedback loop | **Cursor** |
| Multi-model selection sur tâches dures | **Cursor** |
| Mobile / Slack / Linear-initiated agents | **Cursor** |

> Beaucoup de staff engineers run **les deux** : Cursor pour les sessions interactives, Claude Code pour le scripté/agentique et la CI.

## 3. AGENTS.md — la convergence (plus important qu'il n'y paraît)

Fin 2025, OpenAI, Cursor, Sourcegraph, Google (Jules), et Factory ont standardisé sur **AGENTS.md** comme fichier d'instructions tool-agnostique. Claude Code lit AGENTS.md aussi (l'issue `anthropics/claude-code#6235` a été résolue en faveur de la compatibilité). 60 000+ repos l'ont adopté, dont OpenAI, Apache Airflow, n8n, LangFlow, Temporal. Gouvernance migrée à la Linux Foundation's Agentic AI Foundation.

> **Vous pouvez arrêter de maintenir `.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md` séparés.**

Pattern qui marche en 2026 :

- **Un `AGENTS.md` à la racine** (build, test, code style, security, PR conventions) — readable par tous les agents.
- **`CLAUDE.md` uniquement pour les choses Claude-specific** que vous ne pouvez pas exprimer tool-agnostiquement (slash commands Claude, hook triggers, output style).
- **Per-package `AGENTS.md` en monorepo** — closest file wins.
- **Skills (ou OpenAI Codex Skills, même format SKILL.md)** pour les domain knowledge qui ne doivent *pas* toujours load.

Anti-patterns explicitement appelés par Anthropic dans les recommandations CLAUDE.md/AGENTS.md :

- Fichier > 100 lignes.
- "WHAT/HOW" advice plutôt que les comportements non-évidents.
- Tout ce que l'agent peut lire en regardant le code.

> Boris Cherny : *"Pour chaque ligne, demandez-vous : 'est-ce que retirer cette ligne ferait faire des erreurs à Claude ?' Si non, coupez."*

### Exemple AGENTS.md minimaliste pour un projet Next.js

```markdown
# Project: <name>

## Stack
- Next.js 16 (App Router, Cache Components)
- TypeScript strict
- Drizzle + PostgreSQL
- AI SDK 6
- Vercel AI Gateway

## Commands
- `pnpm dev` — local dev (Turbopack)
- `pnpm build` — production build
- `pnpm test` — Vitest
- `pnpm db:push` — push Drizzle schema

## Conventions
- All Server Actions go through `verifySession()` from `lib/dal.ts` first.
- Validate Server Action inputs with Zod, NEVER trust TS types.
- Server Components: data fetching via DAL only, never direct ORM calls.
- AI: model strings via Gateway, never instantiate provider clients directly.
- Tests required for: any code in `lib/dal.ts`, any AI tool in `lib/ai/tools/*`.

## Don't
- Don't add comments unless explaining WHY (business rule, gotcha, workaround).
- Don't use `lucide-react` — use `@phosphor-icons/react`.
- Don't hardcode user-facing strings — `next-intl` for all of them.
- Don't put authz logic in `proxy.ts` (middleware) — re-verify in pages/actions.
```

## 4. Spec-driven development — quand ça vaut, quand non

Deux frameworks sérieux ont émergé en 2025–2026 :

### GitHub Spec Kit

Annoncé sept. 2025 ; v0.1.4 en février 2026. Workflow CLI :

1. `/speckit.constitution` — principes du projet
2. `/speckit.specify` — spec user-journey, sans implémentation
3. `/speckit.plan` — architecture technique
4. `/speckit.tasks` — work items atomiques
5. `/speckit.implement` — exécution

Plus `/speckit.clarify`, `/speckit.analyze`, `/speckit.checklist`. Marche avec 30+ agents (Claude Code, Copilot, Gemini CLI, Cursor, Qwen, Windsurf).

> Citation GitHub blog : *"They're exceptional at pattern completion, but not at mind reading."*

### AWS Kiro

IDE agentique adossé à Bedrock, stabilisé début 2026. L'unité de travail est une spec en langage naturel. Trois fichiers, trois phases :

- `requirements.md` — user stories avec **EARS notation** (`When <trigger>, the <system> shall <response>`).
- `design.md` — architecture, schémas, sequence diagrams.
- `tasks.md` — tasks discrètes avec tracking de complétion et ordering de dépendance.

Deux types de spec : Feature (Requirements-First ou Design-First) et Bugfix. Vibe Mode pour le coding exploratoire quand les specs sont overkill.

### Le take honnête sénior

SDD est juste *RFC / PRD / design doc* rebrandé pour l'ère IA. Ça marche quand :

- La feature est assez large pour que le ratio overhead/valeur soit favorable (rule of thumb : 2+ jours de boulot).
- Vous traitez la spec comme **alignement et audit**, pas comme un build controller.
- Vous gardez les specs en sync avec le code (la maintenance tax est réelle).

Ça échoue quand :

- Les équipes forcent chaque bug fix dans `/speckit.specify`.
- Les specs deviennent une ligne Maginot junior-developer.
- Le finding Faros AI 2025 tient : 75 % des devs adoptent l'IA, peu d'orgs voient un gain de vélocité mesurable parce qu'il n'y a pas de structure ni de stratégie.

## 5. MCP en prod (avril 2026)

### Spec 2026-03-15 : OAuth 2.1 standardisé

Impacts pratiques pour les séniors qui buildent des MCPs :

- Les MCP servers agissent comme **OAuth 2.1 resource servers** ; **MUST** implémenter RFC 9728 Protected Resource Metadata avec `.well-known/oauth-protected-resource`.
- Les clients **MUST** inclure le paramètre `resource` dans les auth + token requests, bound au URI canonique du serveur MCP — kill les attaques token passthrough / confused-deputy.
- Trois paths d'enregistrement client : pre-registered creds, OAuth Client ID Metadata Documents (URL HTTPS comme `client_id`), ou RFC 7591 Dynamic Client Registration (legacy fallback).
- PKCE avec S256 mandatory ; les 401 **MUST** inclure `WWW-Authenticate` avec `resource_metadata=` ; 403 pour `insufficient_scope` triggers step-up auth.

### Production servers en avril 2026 (97M+ MCP installs en mars)

Sentry (now remote sur `mcp.sentry.dev`, supersedes STDIO), Linear (default pour AI-assisted PM), GitHub (398K installs, leader écosystème), Atlassian, HubSpot, Slack, Vercel, Notion, Stripe (balances/customers/invoices/subscriptions), Neon.

> **Le combo qui matter** : **GitHub + Vercel + Stripe + Notion + Linear** couvre code, deploy, money, organizational memory, ticket execution. Les agents ont *les cinq*.

### Discipline de design de tools (Anthropic)

Du blog Anthropic engineering ("Writing effective tools for AI agents" + "Advanced tool use") :

- **Consolider les workflows multi-step** : `schedule_event` plutôt que `list_users` + `list_events` + `create_event`.
- **Préfixes de namespace** pour éviter les collisions.
- **Identifiants sémantiques** ; les UUID causent des hallucinations.
- **Pagination avec erreurs explicites**.
- **Traiter les descriptions de tools comme des instructions pour un nouvel embauché**.

Features beta avancées :

- **Tool Search Tool** : Opus 4.5 a fait 79.5 % → 88.1 % sur multi-tool tasks ; coupe ~55K tokens de tool defs inutilisées.
- **Programmatic Tool Calling** : Claude orchestre via Python, ~37 % réduction de tokens sur la research.
- **Tool Use Examples** : 72 % → 90 % sur le complex parameter handling.

## 6. AI code review

### Benchmarks 2025-2026

Greptile vs concurrents (50 vrais bugs de Sentry / Cal.com / Grafana / Keycloak / Discourse) :

- **Greptile : 82 %**
- Bugbot : 58 %
- Copilot : 54 %
- CodeRabbit : 44 %
- Graphite : 6 %

Greptile indexe le full codebase ; CodeRabbit review en diff-isolation mais marche cross-platforms (GitHub/GitLab/Bitbucket/Azure DevOps) et est l'app IA la plus installée sur GitHub.

### Pattern de gating prod qui marche

> AI review en **advisory et merge-required**, pas blocking sur les commentaires individuels.

Greptile / CodeRabbit commentent, l'humain (ou un autre agent) décide. Le gate bloquant est réservé pour : secrets scanning, license violations, eval regressions, mutation-score drops.

OpenAI Codex a un agent reviewer pre-commit built-in ; GitHub Copilot Agent Mode (GA sur VS Code + JetBrains depuis mars 2026, inline preview avril 2026) a self-healing à l'analyse d'erreur terminal.

## 7. AI testing — TAG avec mutation gates

Anti-pattern dominant 2025-2026 : *"Test suites IA-générées avec 95 % line coverage qui ne catchent pas un opérateur de comparaison inversé."* La coverage est un Goodhart target pour les LLMs.

### Ce qui marche

- **Test-After-Generation (TAG) avec mutation-score gate** : l'agent génère code + tests en parallèle, le mutation testing (Stryker, mutmut, PIT) génère des mutants, l'agent doit écrire des tests qui *killent* ces mutants. Meta paper "ACH" (Engineering at Meta, sept. 2025 ; InfoQ Jan 2026) : *"ACH ne demande pas juste à un LLM d'écrire des tests. Ça run une boucle mutation-guidée."* Les engineers privacy ont accepté 73 % des tests générés ; 36 % privacy-relevant.
- **Property-based testing** (Hypothesis / fast-check) pour les invariants — ordering, monotonicity, idempotence — catch ce que l'example-based manque.
- **Equivalent-mutant detection** (un second LLM) : baseline 0.79 precision / 0.47 recall, post-filtering 0.95 / 0.96. **Le filter compte plus que le générateur.**
- **Scenarios as holdout sets** (StrongDM) : user stories stockées hors du codebase, traitées comme données de validation ML ; succès mesuré par taux de satisfaction.

> **Règle sénior** : ne jamais accepter des tests IA-écrits sans une passe mutation sur les lignes changées. CodeRabbit / Greptile catchent la majorité des régressions code en review, mais la review coverage-only est du théâtre.

## 8. Pratiques big tech (2026)

### Anthropic

- Boris Cherny et son pattern **5 Claude en parallèle**.
- La search dans le codebase utilise **glob + grep**, pas RAG (Anthropic l'a essayé ; sur leur codebase, RAG sous-performait).
- 80–90 % de Claude Code lui-même écrit par Claude.
- Modèle billing pay-as-you-go encourage les power users : médiane $6/jour, top users > $1k/jour.
- Titres uniformes "Member of Technical Staff" pour casser les silos de rôle.

### Vercel

- Agents = 60 % du trafic Vercel.
- v0.app (renommé v0.dev en janvier 2026) = full sandbox-runtime app builder avec Git panel, VS Code editor, intégrations DB (Snowflake/AWS), token-based billing, 6M+ devs.
- Usage interne : AI SDK + Workflow DevKit pour agents durables, `@ai-sdk/mcp` stable.

### StrongDM Software Factory (Simon Willison, 7 fév. 2026)

Deux règles : *"Le code ne doit ni être écrit ni reviewé par des humains."* Catalyseur : Claude 3.5 (oct. 2024) qui a fait passer les agents de coding long-horizon en "compounding correctness". Ils ont remplacé le TDD par :

- **Scenarios** : user stories held-out comme set de validation.
- **Digital twins** d'Okta/Jira/Slack en binaires Go pour des milliers de scenarios/heure.

Coût : ~$1k tokens/jour/engineer.

### Spotify

Plus aucun humain n'écrit le code de production depuis décembre 2025. 650 PR IA/mois mergées, –90 % de temps de migration. Emphasis sur **APIs over UIs** : *"Si ça n'existe pas comme API utilisable par les agents, ça n'existe pas."*

### Cursor

- 35 % des PR mergées proviennent d'agents cloud autonomes — ils dogfood les background agents lourdement.

## 9. Workflow recommandé pour un sénior (avril 2026)

### Daily loop

1. **Démarrer la journée** avec `claude --resume` ou `claude --continue`. Les sessions resume sont comme des branches ; nommez-les via `/rename oauth-migration`.
2. **Pour chaque tâche non triviale : plan mode d'abord**. Ouvrir le plan dans `$EDITOR` (Ctrl+G), red-pen les hypothèses fausses, sortir pour exécution. Ne sautez pas ce step sur les changements multi-fichiers — le coût de diff dans la mauvaise direction excède largement la planning tax.
3. **Subagents pour la research** ("use a subagent to investigate how token refresh works") ; **agent teams pour le debugging adversarial** (5 teammates avec hypothèses concurrentes). Les deux gardent le contexte principal clean.
4. **Auto mode** (`--permission-mode auto`) pour le fan-out work ; **hooks** pour les must-happen-every-time guardrails (block prod schema migrations, run formatter, inject CI status).
5. **`/clear` agressivement** entre les tâches — la failure mode #1 de Claude est la "kitchen sink session" où la pollution de tâches précédentes corrompt l'output de la suivante. Après deux corrections échouées, `/clear` et réécrire le prompt.
6. **Verification primitives non-négociables** : tests, screenshots, type-check, build. Anthropic explicit : *"the single highest-leverage thing you can do."* Sans verification, vous *êtes* la feedback loop unique et chaque miss bouffe votre journée.

### Structure de repo qui aide les agents

- Top-level `AGENTS.md` (~80 lignes max), tool-agnostique.
- `.claude/skills/<domain>/SKILL.md` pour les non-default knowledge (charge on-demand, zéro coût contexte quand idle).
- `.claude/agents/security-reviewer.md`, `.../api-design-reviewer.md` — definitions de subagent réutilisables.
- `.claude/settings.json` avec hooks PreToolUse pour la safety prod + PostToolUse pour `prettier`/`eslint`/`tsc`.
- `specs/<feature>/{requirements,design,tasks}.md` pour les features > 2 jours ; pour les plus petites, sautez la spec.
- `evals/` directory avec regression tests sur prompts/agents, gated en CI via Braintrust ou Langfuse.

### Quand coder vous-même vs déléguer

| Situation | Approche |
|---|---|
| Bug fix descriptible en une phrase | **Vous-même** |
| Code de perf nécessitant intuition | **Vous-même** |
| Langage/framework où vous battez le model | **Vous-même** |
| Crypto / auth / billing primitifs (cost de hallucination unacceptable) | **Vous-même**, ou **delegate avec re-review humaine + tests intégration** |
| Features touchant 3+ fichiers | **Plan mode + execute** |
| Migrations | **Plan mode + execute** |
| Nouveaux endpoints suivant des patterns existants | **Plan mode + execute** |
| Backfill de tests | **Plan mode + execute** |
| Refactors avec frontières claires | **Plan mode + execute** |
| Migrations larges | **Background agent / agent team** (survivent à la fermeture du laptop) |
| Refactors cross-cutting | **Agent team** |
| PR review triage | **Agent en CI (CodeRabbit / Greptile)** |
| Investigation cross-services | **Agent team avec hypothèses concurrentes** |

### Ce qu'il faut ignorer en 2026

- Les threads d'influenceurs vibe-coding.
- *"AI 10x'd my productivity"* sans mesure (Faros : 75 % adoption, pas de gain mesurable dans la majorité).
- RAG-everywhere quand `glob + grep + reasoning` suffit pour la Q&A sur codebase.
- Le hand-tuned prompt engineering pour des choses que les skills/tools/MCP font déclarativement.
- Run le dernier model sans baseline d'evals.

## Ce qu'il faut emporter de ce module

1. **Hooks > CLAUDE.md** pour ce qui doit être enforced.
2. **Plan mode + review du plan** est le single highest-leverage habit.
3. **AGENTS.md unique et court** ; Skills pour le domain knowledge ; subagents pour la décomposition.
4. **MCP arrive standardisé** (OAuth 2.1) et le combo GitHub + Vercel + Stripe + Notion + Linear couvre 80 % du tooling.
5. **TAG + mutation gating** est la seule manière honnête d'utiliser l'IA pour les tests.
6. **AI code review = advisory + merge-required**, pas blocking.
7. La compétence rare en 2026 est le **system design pour agents** : décomposition, gates, ownership.

Module suivant : [04-multi-agents-prod.md](./04-multi-agents-prod.md) — comment combiner ces agents quand vous *construisez des features* multi-agent (et pas juste pour vous-même développer).
