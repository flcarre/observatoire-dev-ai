import { createObservatoryUseCases } from "@/core/application/observatory-use-cases";
import { createMarkdownDossierRepository } from "./markdown-dossier-repository";
import { createStaticResourceCatalogRepository } from "./static-resource-catalog-repository";

export function createAppUseCases() {
  return createObservatoryUseCases({
    dossiers: createMarkdownDossierRepository(),
    resources: createStaticResourceCatalogRepository(),
  });
}
