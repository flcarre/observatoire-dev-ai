import Link from "next/link";
import {
  ArrowRight,
  Binoculars,
  GitBranch,
  Rows,
} from "@phosphor-icons/react/dist/ssr";
import { ResourceExplorer } from "@/components/resource/resource-explorer";
import { createAppUseCases } from "@/core/infrastructure/container";

export const metadata = {
  title: "Watchtower",
  description:
    "Veille sourcee sur l'evolution du software engineering avec la GenAI.",
};

export default async function WatchtowerPage() {
  const { getHomePage } = createAppUseCases();
  const { categories, dossiers, stats, watchSources } = await getHomePage();

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-bg">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1 text-xs text-muted-fg">
                <Binoculars size={14} className="text-accent" />
                Watchtower · veille sourcee · avril 2026
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
                Watchtower DevIA
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-fg">
                Le radar de ressources externes: articles, recherches, docs produit et retours
                terrain tries pour des equipes senior qui veulent changer leur pratique, pas
                juste empiler des liens.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#product-engineering-architecture"
                  className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90"
                >
                  Parcourir les axes
                  <ArrowRight size={15} weight="bold" />
                </a>
                <Link
                  href="/dossiers"
                  className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Voir les articles de fond
                  <Rows size={15} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Ressources" value={stats.resourceCount.toString()} />
              <Stat label="Axes" value={stats.categoryCount.toString()} />
              <Stat label="Recentes" value={stats.recentCount.toString()} />
              <Stat label="Sources watch" value={stats.watchSourceCount.toString()} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/25">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                Sources importees
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-fg">
                Chaque watch source est lue comme une entree brute, puis reduite a une
                selection courte, dedoublonnee et resumee en francais.
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
