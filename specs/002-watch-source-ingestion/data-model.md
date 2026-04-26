# Data Model: Watch Source Ingestion

## WatchSource

Represents an external source used to enrich the observatory.

Fields:

- `title`: human-readable source name.
- `owner`: person, team or organization maintaining the source.
- `url`: original source URL.
- `importedAt`: date the source was reviewed/imported.
- `description`: short description of the source.
- `resourceCount`: number of candidate resources observed in the source.
- `selectedCount`: number of resources retained in the observatory.
- `strategy`: editorial selection strategy.
- `categoryIds`: categories touched by the import.

Validation:

- `url`, `title`, `owner`, `importedAt` and `strategy` MUST be non-empty.
- `selectedCount` MUST be lower than or equal to `resourceCount`.
- `categoryIds` SHOULD reference existing `ResourceCategory.id` values.

## ResourceCandidate

Represents a link extracted from a source before curation.

Fields:

- `title`
- `url`
- `sourceCategory`
- `sourceDescription`
- `sourceUnreadFlag`

Validation:

- Candidates are not displayed until transformed into curated resources.
- Candidates SHOULD be deduplicated by URL before review.

## CuratedResource

The final resource is the existing `Resource` type from
`specs/001-open-source-devia-observatory/data-model.md`.

Additional editorial rule:

- If a resource is selected from a watch source, its tags SHOULD make the
  topical mapping clear, not merely copy the source category.
