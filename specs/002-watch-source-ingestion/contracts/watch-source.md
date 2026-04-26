# Watch Source Contract

The watch source registry is exported from `lib/resources.ts`.

## TypeScript Contract

```ts
type WatchSource = {
  title: string;
  owner: string;
  url: string;
  importedAt: string;
  description: string;
  resourceCount: number;
  selectedCount: number;
  strategy: string;
  categoryIds: string[];
};
```

## Behavior Contract

- The home page SHOULD display imported watch sources with source URL.
- Imported resources MUST still be displayed through the normal
  `ResourceCategory` contract.
- The catalog MUST NOT require runtime network access to render imported
  resources.
- Contributors MAY submit a GitHub repo, markdown file or JSON list as source
  material, but maintainers decide the final taxonomy and summaries.
