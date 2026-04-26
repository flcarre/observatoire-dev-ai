# Tasks: Watch Source Ingestion

**Input**: Design documents from `/specs/002-watch-source-ingestion/`  
**Prerequisites**: spec.md, plan.md, data-model.md, contracts/watch-source.md

## Phase 1: Source Understanding

- [x] T001 Inspect `fdelbrayelle/ai-watchtower` README and generated resources JSON
- [x] T002 Identify high-signal resources aligned with the DevIA observatory

## Phase 2: Data Contract

- [x] T003 Add `WatchSource` type and registry in `lib/resources.ts`
- [x] T004 Add selected `ai-watchtower` resources into the curated catalog
- [x] T005 Update resource stats to include imported watch sources

## Phase 3: Product Surface

- [x] T006 Show imported watch source provenance on the home page
- [x] T007 Document external watch contribution workflow in README

## Phase 4: Validation

- [x] T008 Run `npm run typecheck`
- [x] T009 Run `npm run build`
- [x] T010 Smoke test search/filter after import
