# Observatoire DevIA

Ressources open source pour développeurs seniors qui veulent suivre le virage du
métier avec la GenAI: agents de code, context engineering, workflows d'équipe,
évaluation, sécurité, outils et adoption entreprise.

Ce projet n'est plus pensé comme une formation Next.js à valider module par
module. L'application est un atlas de veille: des catégories, des sources
originales, des synthèses courtes et des dossiers internes pour creuser.

## Public visé

- Développeurs seniors, staff engineers, tech leads, engineering managers hands-on.
- Équipes qui connaissent déjà le développement logiciel en entreprise.
- Personnes qui veulent comprendre comment travailler mieux avec Codex, Claude
  Code, Cursor, Copilot, Linear, Sourcegraph, Devin, etc. sans dépendre d'un
  framework ou langage particulier.

## Ce que contient l'application

- Un catalogue typé de ressources dans `lib/resources.ts`.
- Un registre de veilles externes importées, par exemple
  [`fdelbrayelle/ai-watchtower`](https://github.com/fdelbrayelle/ai-watchtower).
- Des catégories comme context engineering, agentic coding, process équipe,
  evals, sécurité, adoption entreprise et recherche critique.
- Des synthèses en français avec lien vers la source originale.
- Des dossiers internes existants dans `content/*.md` pour les sujets de fond.
- Une recherche dans la navigation pour retrouver une ressource ou un dossier
  depuis n'importe quelle page.
- Une interface filtrable et statique, sans compte, DB, suivi utilisateur ou
  tracking par défaut.
- Une documentation métier Spec Kit dans `specs/001-open-source-devia-observatory/`.

## Stack

- Next.js 15, React 19, TypeScript strict
- Tailwind CSS
- `react-markdown`, `remark-gfm`, Shiki, Mermaid
- Phosphor Icons

Le projet reste statique et facilement déployable sur Vercel ou tout hébergeur
compatible Next.js.

## Démarrer en local

```bash
npm install
npm run dev
# http://localhost:3000
```

Validation:

```bash
npm run typecheck
npm run build
```

## Ajouter une ressource

Les ressources sont regroupées par catégorie dans `lib/resources.ts`.

Chaque entrée doit fournir:

- `title`, `publisher`, `author`, `url`, `date`
- `kind`: `engineering`, `docs`, `research`, `report`, `product`,
  `case-study` ou `community`
- `sourceType`: `primary`, `independent` ou `community`
- `freshness`: `recent`, `durable` ou `historical`
- `tags`
- `synthesis`
- `seniorTakeaway`
- `useWhen`

Règles éditoriales:

- Renseigner `author` comme valeur canonique de tri "qui l'a écrit": entreprise,
  laboratoire, organisme, auteur individuel ou influenceur tech. Normaliser les
  variantes quand elles désignent le même acteur, par exemple `GitHub Blog` et
  `GitHub Docs` -> `GitHub`.
- Préférer les sources récentes pour les outils, prix, pratiques produit et
  capacités agents.
- Garder les sources plus anciennes seulement si elles posent un concept durable.
- Toujours distinguer source vendor, recherche indépendante et communauté.
- Éviter les tutoriels débutants et les contenus framework-first.
- Ne pas copier de longs extraits: écrire une synthèse originale et citer la
  source.

## Importer une veille externe

On peut proposer un repo, un README, un fichier Markdown ou une liste JSON de
liens comme matière première. L'objectif n'est pas de tout importer, mais de
transformer une veille large en ressources à fort signal.

Un prompt prêt à donner à Codex, Claude Code ou un autre agent est disponible
dans `CONTRIBUTING.md`.

Workflow recommandé:

1. Ajouter la source dans `watchSources` (`lib/resources.ts`) avec propriétaire,
   URL, date d'import, nombre de ressources candidates et stratégie de sélection.
2. Extraire les liens candidats par script, JSON existant ou lecture du README.
3. Dédupliquer par URL et écarter les contenus trop juniors, obsolètes,
   framework-first ou purement marketing.
4. Mapper les ressources retenues vers les catégories DevIA existantes, ou créer
   une catégorie seulement si elle apporte un axe durable.
5. Renseigner `author` pour permettre le tri par auteur ou organisation, puis
   rédiger `synthesis`, `seniorTakeaway` et `useWhen` en français sans recopier
   la description d'origine.
6. Mettre à jour ou créer une spec dans `specs/` si l'import change le modèle
   métier.

Le premier exemple documenté est
`specs/002-watch-source-ingestion/`, basé sur `ai-watchtower`: une veille de
203 ressources dont une sélection courte est intégrée au catalogue.

## Spec Kit

Le projet utilise GitHub Spec Kit pour garder une documentation métier claire.

Artefacts principaux:

- `.specify/memory/constitution.md`
- `specs/001-open-source-devia-observatory/spec.md`
- `specs/001-open-source-devia-observatory/plan.md`
- `specs/001-open-source-devia-observatory/data-model.md`
- `specs/001-open-source-devia-observatory/contracts/resource-catalog.md`
- `specs/001-open-source-devia-observatory/tasks.md`
- `specs/002-watch-source-ingestion/spec.md`

Avant une évolution produit significative:

1. Mettre à jour ou créer une spec dans `specs/`.
2. Décrire les critères d'acceptation avant l'implémentation.
3. Relier les tâches au comportement utilisateur.
4. Mettre à jour README et docs en même temps que le code.

## Architecture

L'application suit une architecture hexagonale pragmatique:

- `core/domain/`: types métier et règles pures.
- `core/application/`: ports et cas d'usage.
- `core/infrastructure/`: adaptateurs markdown et catalogue statique.
- `app/` + `components/`: interface Next.js/React.

Les pages ne doivent pas importer directement les catalogues statiques ou les
loaders markdown. Elles passent par les cas d'usage exposés par
`core/infrastructure/container.ts`.

Voir `ARCHITECTURE.md`.

## Structure

```text
app/
  (reader)/
    page.tsx                  # Observatoire et explorateur de ressources
    m/[slug]/page.tsx          # Lecteur des dossiers internes
components/
  resource/resource-explorer.tsx
  sidebar.tsx
content/
  *.md                         # Dossiers internes
lib/
  modules.ts                   # Chargement des dossiers markdown
  resources.ts                 # Catalogue de veille
core/
  domain/                      # Entités et règles pures
  application/                 # Ports et cas d'usage
  infrastructure/              # Adapters statiques/markdown
specs/
  001-open-source-devia-observatory/
```

## Licence

MIT. Voir `LICENSE`.

## Contribution

Les contributions sont bienvenues si elles respectent l'intention du projet:
veille moderne, senior-first, framework-agnostic, sources traçables. Une bonne
PR ajoute peu de bruit, beaucoup de signal, et explique pourquoi une ressource
change réellement la pratique du développement logiciel avec l'IA.

Pour contribuer avec un agent de code:

1. Lire `CONTRIBUTING.md`.
2. Donner le prompt fourni à Codex, Claude Code, Cursor ou équivalent.
3. Remplacer `<URL_TO_ANALYZE>` par un article, un repo ou une veille externe.
4. Relire le diff généré.
5. Ouvrir une PR avec le template GitHub du projet.

Les PR qui modifient `lib/resources.ts` sont automatiquement relues par la
GitHub Action `Contribution Scope`: si une contribution de veille touche aussi
l'UI, l'architecture, les fichiers package, les scripts ou les workflows, elle
remonte un warning non bloquant pour aider la revue humaine.
