import {
  computeResourceStats,
  indexResources,
  type ResourceCategory,
  type WatchSource,
} from "@/core/domain/observatory";
import type { ResourceCatalogRepository } from "@/core/application/ports";
import { resourceCategories, watchSources } from "@/lib/resources";

export function createStaticResourceCatalogRepository(): ResourceCatalogRepository {
  return {
    listCategories() {
      return resourceCategories satisfies ResourceCategory[];
    },
    listResources() {
      return indexResources(resourceCategories);
    },
    listWatchSources() {
      return watchSources satisfies WatchSource[];
    },
    getStats() {
      return computeResourceStats(resourceCategories, watchSources);
    },
  };
}
