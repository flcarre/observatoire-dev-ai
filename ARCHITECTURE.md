# Architecture

The application follows a pragmatic hexagonal architecture.

## Dependency Rule

Dependencies point inward:

```text
app/ and components/        UI adapters
        ↓
core/application/           use cases and ports
        ↓
core/domain/                entities and pure rules

core/infrastructure/        adapters implementing application ports
lib/                        static data and low-level technical helpers
```

The UI must not reach directly into static catalogs or markdown loaders. It asks
application use cases for view data.

## Layers

### Domain

`core/domain/`

- Business types: resources, watch sources, dossiers.
- Pure functions: resource anchors, indexing, statistics.
- No React, no Next.js, no filesystem.

### Application

`core/application/`

- Ports that describe what the app needs from storage.
- Use cases that compose resources and dossiers for pages.
- No concrete filesystem or static-data imports.

### Infrastructure

`core/infrastructure/`

- Adapters for local markdown dossiers and static resource catalogs.
- The composition root in `container.ts`.

### Interface

`app/` and `components/`

- Next.js routes and React components.
- They render use-case results.
- They should not own business rules or catalog indexing logic.

## Craft Rules

- Keep content curation rules in domain/application concepts, not hidden in UI.
- Add new data sources by creating or extending infrastructure adapters.
- Add new product behavior through a use case first, then wire the UI.
- Prefer small pure functions over inline logic in React components.
- Do not reintroduce user tracking, course progression, framework-first routes
  or direct data access from pages.

## SOLID Interpretation

- Single Responsibility: pages render; use cases orchestrate; repositories load.
- Open/Closed: add another resource source via a repository adapter.
- Liskov: adapters must satisfy the same ports without changing use cases.
- Interface Segregation: repositories expose only the methods the app needs.
- Dependency Inversion: application code depends on ports, infrastructure
  depends on application/domain.
