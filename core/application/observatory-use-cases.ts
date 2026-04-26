import type { DossierNavigationItem } from "@/core/domain/dossier";
import type { DossierRepository, ResourceCatalogRepository } from "./ports";

export function createObservatoryUseCases({
  dossiers,
  resources,
}: {
  dossiers: DossierRepository;
  resources: ResourceCatalogRepository;
}) {
  return {
    async getHomePage() {
      return {
        dossiers: await dossiers.listDossiers(),
        categories: resources.listCategories(),
        stats: resources.getStats(),
        watchSources: resources.listWatchSources(),
      };
    },

    async getReaderShell() {
      const allDossiers = await dossiers.listDossiers();
      const indexedResources = resources.listResources();

      return {
        navItems: allDossiers.map((dossier) => ({
          slug: dossier.slug,
          title: dossier.title,
          hook: dossier.hook,
        })),
        categoryItems: resources.listCategories().map((category) => ({
          id: category.id,
          title: category.title,
          summary: category.summary,
          resourceCount: category.resources.length,
        })),
        resourceItems: indexedResources.map((resource) => ({
          title: resource.title,
          publisher: resource.publisher,
          categoryTitle: resource.categoryTitle,
          categoryId: resource.categoryId,
          anchorId: resource.anchorId,
          synthesis: resource.synthesis,
          tags: resource.tags,
        })),
      };
    },

    async getDossierPage(slug: string) {
      const dossier = await dossiers.findDossierBySlug(slug);
      if (!dossier) return null;

      const allDossiers = await dossiers.listDossiers();
      const index = allDossiers.findIndex((item) => item.slug === slug);
      const previous: DossierNavigationItem = index > 0 ? allDossiers[index - 1] : null;
      const next: DossierNavigationItem =
        index >= 0 && index < allDossiers.length - 1 ? allDossiers[index + 1] : null;

      return { dossier, previous, next };
    },

    listDossierSlugs() {
      return dossiers.listSlugs();
    },
  };
}
