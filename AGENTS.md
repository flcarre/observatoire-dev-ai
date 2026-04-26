<!-- SPECKIT START -->
For the current product repositioning, read
`specs/001-open-source-devia-observatory/plan.md` before making changes.
The business source of truth is
`specs/001-open-source-devia-observatory/spec.md`, governed by
`.specify/memory/constitution.md`.
<!-- SPECKIT END -->

# Agent Instructions

This repository is an open source DevIA observatory for senior software
engineers. It is not a beginner course, not a framework tutorial, and not a
marketing landing page.

## Product Intent

- Audience: senior developers, staff engineers, tech leads and hands-on
  engineering managers.
- Scope: how GenAI changes software engineering work: agentic coding, context
  engineering, team process, evals, observability, security, tools, adoption and
  critical research.
- Positioning: framework-agnostic and language-agnostic. Mention specific tools
  only when they teach durable practices.
- Public platform: no accounts, no reader progress, no localStorage tracking, no
  private user state.

## Where To Edit

- Architecture rules live in `ARCHITECTURE.md`.
- Domain types and pure rules live in `core/domain/`.
- Use cases and ports live in `core/application/`.
- Static and markdown adapters live in `core/infrastructure/`.
- Curated resources live in `lib/resources.ts`.
- Existing long-form dossiers live in `content/*.md`.
- The home observatory UI lives in `app/(reader)/page.tsx`.
- Sidebar/global search lives in `components/sidebar.tsx`.
- Spec Kit product docs live in `specs/`.

## Editorial Rules

When adding a resource:

- Prefer 2025-10 or newer for products, tools, pricing, model behavior and
  workflows. Older sources are acceptable only for durable concepts.
- Do not add beginner "build a chatbot in 5 minutes" content.
- Do not import a full watch list blindly. Select signal, deduplicate, and
  explain why each retained source matters.
- Write summaries in French.
- Keep summaries original. Do not copy long source excerpts.
- Always include `title`, `publisher`, `author`, `url`, `date`, `kind`,
  `sourceType`, `freshness`, `tags`, `synthesis`, `seniorTakeaway`, and
  `useWhen`.
- Use `author` as the canonical "who wrote it" filter value. It can be a
  company, lab, standards body, individual author or tech influencer; normalize
  product/blog variants to the same author when useful, for example
  "Anthropic Engineering" and "Anthropic / Claude Code Docs" -> "Anthropic".
- Make `seniorTakeaway` practical: what changes in architecture, review,
  delivery, process or judgment.
- Make `useWhen` concrete: when a team should read or apply the resource.

## Ingesting An Article Or Watch Repo

1. Read `CONTRIBUTING.md`.
2. Read `specs/002-watch-source-ingestion/spec.md`.
3. If the input is a repo/list/README, add or update a `watchSources` entry in
   `lib/resources.ts`.
4. Extract candidate links, then curate a short selection.
5. Map selected resources to existing categories when possible.
6. Create a new category only when it adds a durable axis of senior practice.
7. Run `npm run typecheck` and `npm run build`.
8. In the PR, list sources reviewed, resources added, and validation commands.

For a normal article/watch contribution, only edit:

- `lib/resources.ts`
- `README.md` when public docs change
- `CONTRIBUTING.md` when the contribution prompt changes
- `AGENTS.md` when agent instructions change
- `specs/002-watch-source-ingestion/**` when ingestion behavior changes
- `specs/001-open-source-devia-observatory/**` when public behavior changes

Do not edit `app/`, `components/`, `core/`, `content/`, package files,
`scripts/` or `.github/workflows/` in a content-only PR. The
`Contribution Scope` GitHub Action emits a non-blocking warning when
`lib/resources.ts` is modified together with protected files.

## UI Rules

- The first screen should be the useful observatory, not marketing copy.
- Keep the UI dense, scannable and work-focused.
- Pages and components must consume application use cases, not static catalogs
  or markdown loaders directly.
- Do not reintroduce course language, module validation, saved progress, or
  reader tracking.
- Do not reintroduce the removed `/diagrammes` or `/parcours` routes.

## Pull Request Standard

A good PR:

- Adds a small amount of high-signal content.
- Preserves source traceability.
- Explains categorization choices.
- Updates specs/docs when behavior or contribution flow changes.
- Passes `npm run typecheck` and `npm run build`.
