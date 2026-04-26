# Tasks: Open Source DevIA Observatory

**Input**: Design documents from `/specs/001-open-source-devia-observatory/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Typecheck, production build and browser smoke check are required by
the feature spec.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish Spec Kit and open source foundations.

- [x] T001 Initialize Spec Kit project structure in `.specify/` and `.agents/skills/`
- [x] T002 Write project constitution in `.specify/memory/constitution.md`
- [x] T003 Create feature spec artifacts in `specs/001-open-source-devia-observatory/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the content contract and documentation foundation.

- [x] T004 Create typed resource catalog in `lib/resources.ts`
- [x] T005 [P] Add open source license in `LICENSE`
- [x] T006 Update agent context in `AGENTS.md`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Explorer une veille senior par thèmes (Priority: P1) MVP

**Goal**: Replace course-first home page with a searchable observatory.

**Independent Test**: User can filter resources and open original sources from
the home page.

- [x] T007 [US1] Build resource explorer component in `components/resource/resource-explorer.tsx`
- [x] T008 [US1] Replace home page course layout in `app/(reader)/page.tsx`
- [x] T009 [US1] Tune professional information UI styles in `app/globals.css`

**Checkpoint**: Home page is a usable resource atlas.

---

## Phase 4: User Story 2 - Relier la veille aux dossiers internes utiles (Priority: P2)

**Goal**: Keep valuable existing content while reframing it as dossiers.

**Independent Test**: User can navigate from atlas categories to existing
dossiers and sidebar labels match the new framing.

- [x] T010 [US2] Rename module navigation framing in `components/sidebar.tsx`
- [x] T011 [US2] Reframe module metadata from course modules to dossiers in `lib/modules.ts`
- [x] T012 [US2] Update reader page labels in `app/(reader)/m/[slug]/page.tsx`
- [x] T013 [US2] Remove reader progress/parcours tracking from the public platform

**Checkpoint**: Old content is accessible as dossiers, not mandatory training.

---

## Phase 5: User Story 3 - Comprendre et contribuer au projet open source (Priority: P3)

**Goal**: Make the repository clear and forkable.

**Independent Test**: A contributor can understand setup, scope, curation rules
and Spec Kit workflow from the repository docs.

- [x] T014 [US3] Rewrite `README.md` for open source observatory positioning
- [x] T015 [US3] Document resource contribution rules in `README.md`
- [x] T016 [US3] Align root metadata in `app/layout.tsx`

**Checkpoint**: Repository is ready for public reading and contribution.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T017 Run `npm run typecheck`
- [x] T018 Run `npm run build`
- [x] T019 Smoke test the home page in a browser
- [x] T020 Review final diff for spec alignment and accidental framework-first copy
- [x] T021 Update sidebar from legacy module list to observatory categories and curated dossiers
- [x] T022 Add global sidebar search across resources and dossiers
- [x] T023 Add LLM-native contribution instructions, prompt and PR template
- [x] T024 Refactor toward hexagonal architecture with domain, application ports, use cases and infrastructure adapters

## Dependencies & Execution Order

- Setup and Foundational tasks must complete before UI work.
- US1 is the MVP and can be validated independently.
- US2 can follow US1 because it depends on the new information architecture.
- US3 can run after the content model is stable.

## Parallel Opportunities

- T005 can run in parallel with T004.
- T010 through T013 touch separate files and can be parallelized after US1.
- T014 and T016 can be parallelized once final naming is known.

## Implementation Strategy

1. Deliver US1 first: local catalog plus searchable home page.
2. Reframe old modules as dossiers without deleting content.
3. Finish open source docs and metadata.
4. Validate with typecheck, build and browser smoke test.
