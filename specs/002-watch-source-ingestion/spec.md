# Feature Specification: Watch Source Ingestion

**Feature Branch**: `main`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User example: "Je devrais pouvoir donner un repo comme https://github.com/fdelbrayelle/ai-watchtower et que le projet ajoute les ressources dans les bonnes sections avec des resumes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Importer une veille externe (Priority: P1)

Un mainteneur fournit une source de veille externe, par exemple un README ou un
repo public contenant des liens. Le projet doit pouvoir en extraire les
ressources candidates, les rapprocher de la taxonomie existante, puis garder les
ressources utiles avec une synthese originale et un lien source.

**Why this priority**: c'est le mecanisme qui transforme l'observatoire en base
vivante et collaborative.

**Independent Test**: a partir d'une source publique comme `ai-watchtower`, le
catalogue affiche des ressources importees, categorisees, avec synthese,
takeaway senior, usage conseille et lien original.

**Acceptance Scenarios**:

1. **Given** une source externe riche en liens, **When** elle est analysee,
   **Then** les ressources candidates sont regroupees par themes existants ou
   nouveaux themes utiles.
2. **Given** une ressource candidate, **When** elle est retenue, **Then** elle
   obtient une synthese francaise originale, une source typee et une valeur
   senior explicite, avec un auteur ou une organisation canonique pour le tri.
3. **Given** une source externe importee, **When** un lecteur consulte
   l'accueil, **Then** il voit d'ou vient cette veille et peut ouvrir la source
   d'origine.

### User Story 2 - Filtrer le bruit d'une veille large (Priority: P2)

Un mainteneur ne veut pas importer automatiquement tout un repo de liens. Les
ressources doivent etre selectionnees selon l'intention du projet: senior-first,
framework-agnostic, moderne, pratique pour le travail en entreprise.

**Independent Test**: une veille externe de plus de 100 liens peut produire une
selection plus courte, traçable et coherent avec les categories du projet.

## Edge Cases

- Une source externe peut contenir des liens obsoletes, juniors, vendor-heavy ou
  tres specifiques a un langage; ils ne doivent pas entrer tels quels.
- Un meme article peut deja exister dans le catalogue; il doit etre deduplique.
- Certaines ressources anciennes restent utiles si elles cadrent un concept
  durable, mais la fraicheur doit le signaler.
- Les descriptions fournies par la source externe ne doivent pas etre recopiees
  comme syntheses finales sans reecriture editoriale.

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
