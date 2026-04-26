# Feature Specification: Watch Source Ingestion

**Feature Branch**: `main`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User example: "Je devrais pouvoir donner un repo comme https://github.com/fdelbrayelle/ai-watchtower et que le projet ajoute les ressources dans les bonnes sections avec des résumés."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Importer une veille externe (Priority: P1)

Un mainteneur fournit une source de veille externe, par exemple un README ou un
repo public contenant des liens. Le projet doit pouvoir en extraire les
ressources candidates, les rapprocher de la taxonomie existante, puis garder les
ressources utiles avec une synthèse originale et un lien source.

**Why this priority**: c'est le mecanisme qui transforme l'observatoire en base
vivante et collaborative.

**Independent Test**: à partir d'une source publique comme `ai-watchtower`, le
catalogue affiche des ressources importées, catégorisées, avec synthèse,
takeaway senior, usage conseille et lien original.

**Acceptance Scenarios**:

1. **Given** une source externe riche en liens, **When** elle est analysée,
   **Then** les ressources candidates sont regroupées par thèmes existants ou
   nouveaux themes utiles.
2. **Given** une ressource candidate, **When** elle est retenue, **Then** elle
   obtient une synthèse française originale, une source typée et une valeur
   senior explicite, avec un auteur ou une organisation canonique pour le tri.
3. **Given** une source externe importée, **When** un lecteur consulte
   l'accueil, **Then** il voit d'où vient cette veille et peut ouvrir la source
   d'origine.

### User Story 2 - Filtrer le bruit d'une veille large (Priority: P2)

Un mainteneur ne veut pas importer automatiquement tout un repo de liens. Les
ressources doivent être sélectionnées selon l'intention du projet: senior-first,
framework-agnostic, moderne, pratique pour le travail en entreprise.

**Independent Test**: une veille externe de plus de 100 liens peut produire une
sélection plus courte, traçable et cohérente avec les catégories du projet.

## Edge Cases

- Une source externe peut contenir des liens obsolètes, juniors, vendor-heavy ou
  très spécifiques à un langage; ils ne doivent pas entrer tels quels.
- Un même article peut déjà exister dans le catalogue; il doit être dédupliqué.
- Certaines ressources anciennes restent utiles si elles cadrent un concept
  durable, mais la fraicheur doit le signaler.
- Les descriptions fournies par la source externe ne doivent pas être recopiées
  comme synthèses finales sans réécriture éditoriale.

## Requirements *(mandatory)*

- **FR-001**: System MUST document imported watch sources with title, owner,
  URL, import date, description, selection strategy and linked categories.
- **FR-002**: System MUST keep curated resources in the same typed catalog as
  native resources.
- **FR-003**: Imported resources MUST be mapped to framework-agnostic senior
  categories rather than preserving the source taxonomy blindly.
- **FR-004**: Imported resources MUST include original source URL, synthesis,
  article summary, senior takeaway, canonical author/organization and
  recommended use case.
- **FR-005**: README MUST explain how to contribute a repo/list of watch links.
- **FR-006**: The home page SHOULD expose imported watch sources so provenance
  stays visible.

## Key Entities

- **WatchSource**: external repository, README, list or radar used as source
  material for curation.
- **ResourceCandidate**: extracted link before editorial filtering.
- **CuratedResource**: final `Resource` entry after categorization and summary.

## Success Criteria *(mandatory)*

- **SC-001**: At least one external watch source is represented in product data.
- **SC-002**: At least 10 resources inspired by `ai-watchtower` are added or
  connected to existing categories.
- **SC-003**: README documents the manual ingestion workflow for open source
  contributors.
- **SC-004**: `npm run typecheck` and `npm run build` pass.

## Assumptions

- First implementation is editorial/manual with local TypeScript data.
- Automated extraction can come later, but the content contract must already
  support provenance.
- The project favors signal over exhaustiveness.
