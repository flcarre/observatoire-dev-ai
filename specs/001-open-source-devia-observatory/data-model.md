# Data Model: Open Source DevIA Observatory

## ResourceCategory

Represents a durable theme in the observatory.

Fields:

- `id`: stable slug used for filtering.
- `title`: human-readable category name.
- `summary`: short editorial framing.
- `whyItMatters`: senior-level reason to follow the theme.
- `dossierSlugs`: existing internal dossier slugs related to the theme.
- `resources`: list of curated resources.

Validation:

- `id` MUST be unique.
- Category MUST contain at least one resource.
- Category SHOULD link to internal dossiers only when they add real background.

## Resource

Represents one external source.

Fields:

- `title`: source title.
- `publisher`: organization or author.
- `url`: original source URL.
- `date`: source date, update date, or "rolling" when it is a living page.
- `kind`: one of `engineering`, `docs`, `research`, `report`, `product`, `case-study`, `community`.
- `sourceType`: one of `primary`, `independent`, `community`.
- `freshness`: one of `recent`, `durable`, `historical`.
- `tags`: short terms used for filtering and scanning.
- `synthesis`: compressed summary in French.
- `seniorTakeaway`: practical lesson for senior developers.
- `useWhen`: when to read or apply the resource.

Validation:

- `url`, `title`, `publisher`, `synthesis`, `seniorTakeaway`, and `useWhen`
  MUST be non-empty.
- Recent product/tool resources SHOULD be from 2025-10 or later.
- Older resources MUST be marked `durable` or `historical`.

## InternalDossier

Represents an existing long-form markdown page.

Fields:

- `slug`: existing route slug.
- `title`: loaded from markdown H1.
- `hook`: existing summary.
- `href`: route to the reader page.

Validation:

- Dossier slugs referenced by categories SHOULD exist in `lib/modules.ts`.

## SpecArtifact

Represents the Spec Kit documentation for this repositioning.

Fields:

- `constitution`: `.specify/memory/constitution.md`
- `spec`: `specs/001-open-source-devia-observatory/spec.md`
- `plan`: `specs/001-open-source-devia-observatory/plan.md`
- `tasks`: `specs/001-open-source-devia-observatory/tasks.md`

Validation:

- Artifacts MUST stay aligned with shipped behavior.

## WatchSource

Represents an external watch list, repo or README used as source material for
curation. Detailed ingestion rules live in
`specs/002-watch-source-ingestion/`.

Fields:

- `title`
- `owner`
- `url`
- `importedAt`
- `description`
- `resourceCount`
- `selectedCount`
- `strategy`
- `categoryIds`

Validation:

- Imported sources MUST remain traceable from the product surface.
- Imported resources MUST still follow the normal `Resource` contract.
