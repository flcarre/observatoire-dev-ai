export type ResourceKind =
  | "engineering"
  | "docs"
  | "research"
  | "report"
  | "product"
  | "case-study"
  | "community";

export type SourceType = "primary" | "independent" | "community";
export type Freshness = "recent" | "durable" | "historical";

export type Resource = {
  title: string;
  publisher: string;
  url: string;
  date: string;
  kind: ResourceKind;
  sourceType: SourceType;
  freshness: Freshness;
  tags: string[];
  synthesis: string;
  seniorTakeaway: string;
  useWhen: string;
};

export type ResourceCategory = {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  dossierSlugs: string[];
  resources: Resource[];
};

export type WatchSource = {
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

export type IndexedResource = Resource & {
  categoryId: string;
  categoryTitle: string;
  anchorId: string;
};

export type ResourceStats = {
  categoryCount: number;
  resourceCount: number;
  recentCount: number;
  primaryCount: number;
  watchSourceCount: number;
  importedResourceCount: number;
};

export function slugifyResourceTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export function getResourceAnchorId(categoryId: string, title: string) {
  return `r-${categoryId}-${slugifyResourceTitle(title)}`;
}

export function indexResources(categories: ResourceCategory[]): IndexedResource[] {
  return categories.flatMap((category) =>
    category.resources.map((resource) => ({
      ...resource,
      categoryId: category.id,
      categoryTitle: category.title,
      anchorId: getResourceAnchorId(category.id, resource.title),
    })),
  );
}

export function computeResourceStats(
  categories: ResourceCategory[],
  watchSources: WatchSource[],
): ResourceStats {
  const resources = indexResources(categories);
  const recentCount = resources.filter((resource) => resource.freshness === "recent").length;
  const primaryCount = resources.filter((resource) => resource.sourceType === "primary").length;

  return {
    categoryCount: categories.length,
    resourceCount: resources.length,
    recentCount,
    primaryCount,
    watchSourceCount: watchSources.length,
    importedResourceCount: watchSources.reduce((sum, source) => sum + source.selectedCount, 0),
  };
}
