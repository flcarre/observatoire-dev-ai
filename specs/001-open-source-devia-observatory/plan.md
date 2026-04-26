# Implementation Plan: Open Source DevIA Observatory

**Branch**: `main` | **Date**: 2026-04-26 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-open-source-devia-observatory/spec.md`

## Summary

Reposition the existing Next.js training reader into an open source observatory
for senior developers tracking how GenAI changes software engineering work.
Implementation keeps the static web architecture, adds a typed local resource
catalog, creates an interactive resource explorer, reframes existing modules as
internal dossiers, and documents the product through Spec Kit artifacts.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15  
**Primary Dependencies**: Next.js App Router, Tailwind CSS, Phosphor Icons, existing markdown reader components  
**Storage**: Local repository data in TypeScript and markdown; no user account or reader tracking  
**Testing**: `npm run typecheck`, `npm run build`, local browser smoke check  
**Target Platform**: Static web application deployable on Vercel or any Next-compatible host  
**Project Type**: Web application / static knowledge base  
**Performance Goals**: First viewport renders the observatory without remote API calls; resource filtering is instant for the local catalog  
**Constraints**: No account, no database, no analytics by default, no framework-specific positioning in primary copy  
**Scale/Scope**: Initial catalog of 35+ resources across 7+ categories, extensible by editing local data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Senior-first value: PASS. The feature explicitly removes beginner training positioning.
- Source-traceable watch: PASS. Each resource has URL, date/recency, type and synthesis.
- Spec-driven clarity: PASS. This feature includes spec, plan, data model, contracts, quickstart and tasks.
- Open source default: PASS. README and license updates are in scope.
- Durable reading experience: PASS. The app remains static, searchable and account-free.

## Project Structure

### Documentation (this feature)

```text
specs/001-open-source-devia-observatory/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── resource-catalog.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── (reader)/
│   ├── page.tsx
│   ├── watchtower/
│   │   └── page.tsx
│   ├── dossiers/
│   │   └── page.tsx
│   └── layout.tsx
├── globals.css
└── layout.tsx

components/
├── sidebar.tsx
└── resource/
    └── resource-explorer.tsx

lib/
├── modules.ts
└── resources.ts

content/
└── *.md

README.md
LICENSE
AGENTS.md
```

**Structure Decision**: Keep the existing single Next.js application. Introduce
`lib/resources.ts` as the catalog source of truth and a small client component
for filtering. Keep markdown dossiers in `content/` and reuse existing reader
routes for long-form background.

## Complexity Tracking

No constitution violations identified.
