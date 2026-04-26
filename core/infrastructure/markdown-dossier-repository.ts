import type { DossierRepository } from "@/core/application/ports";
import { getAllModules, getModuleBySlug, getModuleSlugs } from "@/lib/modules";

export function createMarkdownDossierRepository(): DossierRepository {
  return {
    listDossiers() {
      return getAllModules();
    },
    findDossierBySlug(slug) {
      return getModuleBySlug(slug);
    },
    listSlugs() {
      return getModuleSlugs();
    },
  };
}
