import Link from "next/link";
import {
  ArrowRight,
  Clock,
  GitBranch,
  GlobeHemisphereWest,
  Rows,
} from "@phosphor-icons/react/dist/ssr";
import { ResourceExplorer } from "@/components/resource/resource-explorer";
import { createAppUseCases } from "@/core/infrastructure/container";

const contributionPrompt = `Tu contribues au repo open source Observatoire DevIA.

Source a analyser:
<URL_ARTICLE_OU_REPO>

Objectif:
Ajoute uniquement les ressources a fort signal pour des developpeurs seniors qui veulent comprendre le travail logiciel avec la GenAI.

Avant d'editer:
1. Lis AGENTS.md.
2. Lis CONTRIBUTING.md.
3. Lis specs/002-watch-source-ingestion/spec.md.
4. Inspecte lib/resources.ts.

Fichiers autorises pour une contribution article/veille:
- lib/resources.ts
- README.md seulement si la documentation publique change
- CONTRIBUTING.md seulement si le prompt ou le workflow change
- AGENTS.md seulement si les instructions agent changent
- specs/002-watch-source-ingestion/* seulement si le comportement d'import change
- specs/001-open-source-devia-observatory/* seulement si le comportement produit change

Fichiers interdits pour une contribution article/veille standard:
- app/*
- components/*
- core/*
- content/*
- package.json
- package-lock.json
- scripts/*
- .github/workflows/*

Regles:
- N'importe pas tout.
- Dedoublonne les URLs existantes.
- Rejette les contenus debutants, framework-first ou purement marketing.
- Ecris les syntheses finales en francais.
- Ne copie pas de longs extraits.
- Garde la source originale tracable.

Implementation:
1. Si la source est un repo/liste/README, ajoute ou mets a jour watchSources.
2. Ajoute les ressources retenues dans les categories existantes.
3. Cree une categorie seulement si elle est durable et framework-agnostic.
4. Renseigne title, publisher, url, date, kind, sourceType, freshness, tags, synthesis, seniorTakeaway et useWhen.

Validation:
- npm run typecheck
- npm run build
- npm run check:contribution-scope
  Cette commande emet un warning non bloquant si la PR de veille touche aussi des fichiers proteges.

PR:
Ouvre une pull request avec la source analysee, les ressources retenues, les ressources rejetees, les categories modifiees, les validations lancees et les warnings eventuels a expliquer.`;

export default async function HomePage() {
  const { getHomePage } = createAppUseCases();
  const { categories, dossiers, stats, watchSources } = await getHomePage();

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-bg">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1 text-xs text-muted-fg">
              <GlobeHemisphereWest size={14} className="text-accent" />
              Veille avril 2026 · Devs seniors · Framework agnostic
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight lg:text-6xl">
              Observatoire DevIA
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-fg">
              Une base open source de ressources pour comprendre comment le metier de
              developpeur evolue avec les agents, le context engineering, la revue IA,
              les workflows d'equipe et les outils utilises dans l'industrie.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#context-engineering"
                className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90"
              >
                Explorer la veille
                <ArrowRight size={15} weight="bold" />
              </a>
              <a
                href="#dossiers"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Lire un dossier
                <Rows size={15} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:self-end">
            <Stat label="Ressources" value={stats.resourceCount.toString()} />
            <Stat label="Categories" value={stats.categoryCount.toString()} />
            <Stat label="Recentes" value={stats.recentCount.toString()} />
            <Stat label="Veilles importees" value={stats.watchSourceCount.toString()} />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                Sources de veille importees
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-fg">
                Le catalogue peut absorber un repo ou README de veille, puis garder une
                selection categorisee et resumee pour developpeurs seniors.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchSources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-sm transition hover:border-accent hover:bg-muted"
                  title={source.strategy}
                >
                  <GitBranch size={15} />
                  <span>{source.title}</span>
                  <span className="font-mono text-xs text-muted-fg">
                    {source.selectedCount}/{source.resourceCount}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ResourceExplorer categories={categories} dossiers={dossiers} />

      <section id="dossiers" className="scroll-mt-8 border-t border-border bg-muted/25">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                Dossiers de fond
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Approfondir un sujet</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-fg">
                Les anciens modules utiles restent disponibles comme dossiers longs. Ils
                ne sont pas un parcours obligatoire: choisissez le sujet qui complete
                votre veille.
              </p>
            </div>
            <div className="font-mono text-sm text-muted-fg">{dossiers.length} dossiers</div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dossiers.map((dossier) => (
              <Link
                key={dossier.slug}
                href={dossier.href}
                className="group border border-border bg-card p-4 transition hover:border-accent hover:bg-bg"
              >
                <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wide text-muted-fg">
                  <span>Dossier de fond</span>
                  <span className="inline-flex items-center gap-1 font-normal normal-case tracking-normal">
                    <Clock size={12} />
                    ~{dossier.readingTimeMin} min
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug transition group-hover:text-accent">
                  {dossier.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-fg">{dossier.hook}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="contribuer" className="border-t border-border bg-bg">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
              Contribuer
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Ajouter une veille avec un agent
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-fg">
              Le projet est pense pour recevoir des contributions preparees par
              Codex, Claude Code, Cursor ou un autre agent. Donnez un lien
              d'article, de repo ou de watch list, laissez l'agent proposer une
              selection, puis ouvrez une PR relue humainement.
            </p>
            <div className="mt-5 space-y-2 text-sm leading-6 text-muted-fg">
              <p>
                Les instructions canoniques sont dans <code className="text-fg">AGENTS.md</code>,
                le guide contributeur dans <code className="text-fg">CONTRIBUTING.md</code>,
                et le template de PR dans <code className="text-fg">.github/pull_request_template.md</code>.
              </p>
              <p>
                Le principe: peu de bruit, beaucoup de signal, sources tracables,
                syntheses originales en francais.
              </p>
            </div>
          </div>

          <div className="min-w-0 border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                Prompt a donner au LLM
              </div>
            </div>
            <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-6 text-fg">
              <code>{contributionPrompt}</code>
            </pre>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted-fg sm:px-6 lg:px-8">
          <span>Observatoire open source, contenu local, pas de compte, pas de tracking par defaut.</span>
          <div className="flex flex-wrap gap-3">
            <a href="#contribuer" className="transition hover:text-fg">
              Contribuer
            </a>
            <a
              href="https://github.com/github/spec-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-fg"
            >
              Spec Kit
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card px-4 py-4">
      <div className="font-mono text-3xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-muted-fg">{label}</div>
    </div>
  );
}
