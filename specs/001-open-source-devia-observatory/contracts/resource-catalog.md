# Resource Catalog Contract

The catalog is a local TypeScript contract exported from `lib/resources.ts`.

## ResourceCategory Contract

```ts
type ResourceCategory = {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  dossierSlugs: string[];
  resources: Resource[];
};
```

## Resource Contract

```ts
type Resource = {
  title: string;
  publisher: string;
  author: string;
  url: string;
  date: string;
  kind:
    | "engineering"
    | "docs"
    | "research"
    | "report"
    | "product"
    | "case-study"
    | "community";
  sourceType: "primary" | "independent" | "community";
  freshness: "recent" | "durable" | "historical";
  tags: string[];
  synthesis: string;
  articleSummary?: string;
  seniorTakeaway: string;
  useWhen: string;
};
```

## UI Behavior Contract

- The home page MUST render all categories and resources from this contract.
- The client explorer MUST support text search across title, publisher, author,
  tags, synthesis, article summary, senior takeaway and use case.
- Resource cards SHOULD display `articleSummary` when present so readers can
  understand the source without opening it immediately.
- The client explorer MUST support category filtering.
- The client explorer MUST support filtering by canonical resource author, where
  author can be a company, organization, individual author or tech influencer.
- The sidebar MUST support search across curated resources and internal dossiers.
- Resource search results SHOULD link to stable anchors on the observatory home page.
- External source links MUST open in a new tab with safe `rel` attributes.
- Empty search results MUST show a recoverable empty state.
- Imported watch sources SHOULD be visible on the home page and linked to their
  original repository/list.
