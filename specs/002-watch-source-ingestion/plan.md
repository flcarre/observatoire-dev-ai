# Implementation Plan: Watch Source Ingestion

**Branch**: `main` | **Date**: 2026-04-26 | **Spec**: `spec.md`

## Summary

Add an explicit importable-watch-source layer to the open source observatory.
Use `fdelbrayelle/ai-watchtower` as the first reference source, but curate only
the resources that match the project: senior developers, GenAI-era software
engineering, team practices, context, agents, observability, security and
product engineering.

## Technical Context

- Next.js static app with local TypeScript data.
- Existing resource catalog lives in `lib/resources.ts`.
- UI entry point is `app/(reader)/page.tsx` and
  `components/resource/resource-explorer.tsx`.
- No database, ingestion service or runtime crawler for this iteration.

## Constitution Check

- Senior-first: imported resources must avoid beginner chatbot tutorials.
- Framework-agnostic: source taxonomy is normalized to durable engineering
  themes.
- Source-traceable: each resource keeps the original URL and the imported
  source is visible.
- Open source: README explains contribution workflow.
- Spec-driven: this feature owns its own spec, data model, contract and tasks.

## Project Structure

```text
lib/resources.ts
  ResourceCategory[]
  WatchSource[]

specs/002-watch-source-ingestion/
  spec.md
  plan.md
  data-model.md
  contracts/watch-source.md
  tasks.md
```

## Complexity Tracking

No technical constitution violation. The main risk is editorial drift: importing
too much low-signal content. The mitigation is a manual selection strategy and
clear contribution criteria.
