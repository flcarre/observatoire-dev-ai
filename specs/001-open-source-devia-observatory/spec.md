# Feature Specification: Open Source DevIA Observatory

**Feature Branch**: `main`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "Repenser le projet comme une ressource open source pour développeurs seniors sur le travail avec la GenAI, agnostique framework, orientée veille moderne, sources, articles résumés et pratiques d'équipe. Utiliser Spec Kit pour documenter clairement le métier."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorer une veille senior par thèmes (Priority: P1)

Un développeur senior arrive sur le site et comprend immédiatement que le
produit est un observatoire de veille sur l'évolution du métier avec la GenAI,
pas une formation Next.js. Il peut parcourir les catégories, filtrer les
ressources, lire les synthèses, et ouvrir les sources originales.

**Why this priority**: c'est le changement de positionnement principal et le
MVP utile du produit.

**Independent Test**: depuis la page d'accueil, l'utilisateur peut trouver une
catégorie pertinente, filtrer les ressources, lire au moins une synthèse, et
ouvrir sa source originale sans passer par un module linéaire.

**Acceptance Scenarios**:

1. **Given** un visiteur sur l'accueil, **When** il scanne le premier écran,
   **Then** il voit une interface de veille avec catégories, ressources, dates
   et sources, pas un appel à "commencer une formation".
2. **Given** une ressource listée, **When** l'utilisateur l'inspecte,
   **Then** il voit un résumé, une source, l'auteur ou organisation canonique,
   un niveau de fraîcheur, un usage conseillé, et un lien externe vers l'article
   ou document original.
3. **Given** un utilisateur qui cherche "context engineering", **When** il
   filtre ou utilise la recherche, **Then** les ressources pertinentes restent
   visibles et les autres sont masquées.
4. **Given** un lecteur dans la navigation globale, **When** il ouvre
   "Watchtower", **Then** il arrive sur une page de veille dédiée listant les
   axes, ressources, sources importées et liens vers les contenus longs.

---

### User Story 2 - Relier la veille aux dossiers internes utiles (Priority: P2)

Un lecteur peut passer d'une catégorie de veille vers les anciens contenus
internes qui restent utiles, comme context engineering, workflows agents,
process équipe, évaluations et observabilité.

**Why this priority**: le projet existant contient du bon contenu, mais il doit
être repositionné comme dossiers de fond plutôt que formation obligatoire.

**Independent Test**: depuis une catégorie, l'utilisateur peut accéder à un
dossier interne lié et revenir à l'observatoire.

**Acceptance Scenarios**:

1. **Given** une catégorie avec contenu interne associé, **When** l'utilisateur
   clique sur un dossier, **Then** il arrive sur la page de lecture existante.
2. **Given** la sidebar, **When** l'utilisateur lit la navigation, **Then** les
   anciens modules sont nommés comme articles ou dossiers de fond et non comme
   étapes de formation.
3. **Given** la sidebar, **When** de nouveaux contenus existent dans
   `content/*.md`, **Then** tous les articles de fond exposés par le dépôt sont
   visibles sans liste manuelle de favoris.
4. **Given** un lecteur qui veut du contenu long, **When** il ouvre la page
   "Articles de fond", **Then** il voit l'ensemble des anciens modules utiles
   présentés comme articles approfondis.

---

### User Story 3 - Comprendre et contribuer au projet open source (Priority: P3)

Un développeur externe peut comprendre le projet, son modèle de contenu, ses
règles éditoriales et son workflow Spec Kit afin de proposer une contribution.

**Why this priority**: le projet doit devenir open source et durable.

**Independent Test**: un contributeur peut lire le README, identifier la licence,
   trouver la spec métier, lancer le projet localement et ajouter une ressource
   selon le modèle documenté.

**Acceptance Scenarios**:

1. **Given** le dépôt cloné, **When** un contributeur lit le README, **Then** il
   comprend l'objectif, le setup local, le modèle de données des ressources et
   le workflow Spec Kit.
2. **Given** le dépôt, **When** le contributeur cherche la licence, **Then** une
   licence open source explicite est disponible.
3. **Given** une évolution fonctionnelle, **When** elle est proposée, **Then**
   elle peut être reliée à `specs/001-open-source-devia-observatory/`.

### Edge Cases

- Les ressources plus anciennes que six mois restent acceptables si elles
  décrivent des concepts durables et sont clairement étiquetées.
- Les sources vendor peuvent être biaisées; l'interface doit les distinguer des
  recherches indépendantes.
- Les anciens modules orientés Next.js/Vercel ne doivent pas dominer l'accueil
  ni contredire l'objectif framework-agnostic.
- Le site doit rester utile sans JavaScript avancé côté serveur, compte
  utilisateur, analytics ou base de données.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present the primary product as an observatory of GenAI-era software engineering resources for senior developers.
- **FR-002**: System MUST organize resources into thematic categories that are independent from any programming language or web framework.
- **FR-003**: System MUST expose for each resource: title, publisher/source, canonical author or organization, date or recency, source URL, source type, tags, synthesis, senior takeaway, recommended use case, and a richer article summary when available.
- **FR-004**: Users MUST be able to filter resources by category, filter by canonical author/organization, and search by keyword.
- **FR-005**: System MUST preserve access to useful existing internal dossiers while renaming their role away from mandatory training modules.
- **FR-006**: System MUST include Spec Kit artifacts documenting product intent, plan, data model, contracts, and tasks.
- **FR-007**: System MUST include open-source repository documentation covering local setup, contribution model, content curation rules, and licensing.
- **FR-008**: System MUST keep all core content locally available in the repository so the project can be forked and deployed statically.
- **FR-009**: System MUST clearly label vendor-authored resources versus independent research or community references.
- **FR-010**: System MUST provide global navigation search across curated resources and internal dossiers from the sidebar.
- **FR-011**: Sidebar navigation MUST prioritize observatory categories over legacy framework-specific dossiers.
- **FR-012**: System MUST explain how contributors can use coding agents to add articles or watch repositories and open traceable pull requests.
- **FR-013**: System MUST provide a dedicated Watchtower page for curated external watch resources.
- **FR-014**: System MUST provide a dedicated long-form articles page that lists every internal dossier exposed by the repository.

### Key Entities *(include if feature involves data)*

- **ResourceCategory**: A durable theme such as context engineering, team process, tools, evaluation, security, or research.
- **Resource**: A curated external source with metadata, synthesis and practical senior framing.
- **InternalDossier**: An existing long-form article from `content/*.md` that remains useful as background material.
- **SpecArtifact**: A Spec Kit document that captures product intent and implementation traceability.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify the site's new purpose in under 10 seconds from the first viewport.
- **SC-002**: At least 35 curated resources are available across at least 7 categories.
- **SC-003**: 100% of curated resources include a source URL and practical senior takeaway.
- **SC-004**: The home page can be searched or filtered without navigation to another page.
- **SC-005**: The repository includes a constitution, feature spec, plan, data model, quickstart and tasks for this repositioning.
- **SC-006**: `npm run typecheck` and `npm run build` pass after implementation.
- **SC-007**: From any reader page, searching for a known resource such as "Linear" shows matching resource results in the sidebar.
- **SC-008**: A contributor can find a ready-to-use LLM prompt for adding an article or watch repo.

## Assumptions

- The first release remains a static Next.js app with local TypeScript data.
- The project will use MIT licensing unless the maintainer later chooses a
  different open source license.
- External resource summaries are editorial syntheses, not copied article text.
- The existing markdown dossiers remain in the repo for deeper reading, but are
  secondary to the observatory experience.
