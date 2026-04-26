import type {
  IndexedResource,
  ResourceCategory,
  ResourceStats,
  WatchSource,
} from "@/core/domain/observatory";
import type { Dossier } from "@/core/domain/dossier";

export type ResourceCatalogRepository = {
  listCategories(): ResourceCategory[];
  listResources(): IndexedResource[];
  listWatchSources(): WatchSource[];
  getStats(): ResourceStats;
};

export type DossierRepository = {
  listDossiers(): Promise<Dossier[]>;
  findDossierBySlug(slug: string): Promise<Dossier | null>;
  listSlugs(): Promise<string[]>;
};
