# Research: Open Source DevIA Observatory

## Decision: Curate from primary and high-signal sources first

**Rationale**: The user asked for modern, senior-level veille as of April 2026.
Vendor engineering blogs and docs are useful when labeled as vendor sources
because they reveal real tool capabilities and operating models. Independent
research and DORA/METR-style studies provide counterweight against adoption
hype.

**Alternatives considered**:

- Influencer lists and generic "awesome AI" repositories: useful for discovery,
  but too noisy for the core catalog.
- Beginner tutorials: rejected because they do not serve senior developers.

## Decision: Treat existing modules as dossiers, not curriculum

**Rationale**: Several existing files are still valuable, especially context
engineering, agent workflows, process équipe, evals/observability and cost/
security. The failure is the training-module framing, not all content.

**Alternatives considered**:

- Delete the old modules: rejected because it would lose useful material.
- Keep the linear formation model: rejected because it contradicts the product
  goal.

## Decision: Store the catalog locally in typed TypeScript

**Rationale**: The initial open source release should be forkable, reviewable and
deployable without private APIs. A typed local catalog gives contributors clear
shape and catches missing fields during typecheck.

**Alternatives considered**:

- CMS or database: unnecessary operational weight for the current scope.
- Markdown-only resource list: easier to edit but harder to filter and validate.

## Decision: Build a professional atlas UI

**Rationale**: Senior developers need fast scanning, filtering and direct source
access. A dashboard-like atlas is a better fit than a marketing hero or course
progression.

**Alternatives considered**:

- Keep cards-only module grid: too close to a course.
- Create a landing page: rejected because the first screen should be usable.
