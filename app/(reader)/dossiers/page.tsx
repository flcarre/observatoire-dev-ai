import Link from "next/link";
import { ArrowRight, Binoculars, Clock, Rows } from "@phosphor-icons/react/dist/ssr";
import { createAppUseCases } from "@/core/infrastructure/container";

export const metadata = {
  title: "Articles de fond",
  description:
    "Articles longs et dossiers internes pour approfondir les pratiques DevIA.",
};

export default async function DossiersPage() {
  const { getHomePage } = createAppUseCases();
  const { dossiers, stats } = await getHomePage();

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-bg">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1 text-xs text-muted-fg">
                <Rows size={14} className="text-accent" />
                Articles longs · contexte durable
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
                Articles de fond
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-fg">
                Les anciens modules sont conserves comme articles approfondis. Ils servent a
                comprendre les pratiques, arbitrages et architectures derriere la veille
                rapide de la Watchtower.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/watchtower"
                  className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90"
                >
                  Retour a la Watchtower
                  <Binoculars size={15} />
                </Link>
                <a
                  href="#articles"
                  className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Parcourir les articles
                  <ArrowRight size={15} weight="bold" />
                </a>
              </div>
            </div>

            <div className="border border-border bg-card px-4 py-4">
              <div className="font-mono text-3xl font-semibold tabular-nums">{dossiers.length}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-fg">
                articles disponibles
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-fg">
                Relies aux {stats.categoryCount} axes de veille quand un article apporte un
                contexte utile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="articles" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dossiers.map((dossier) => (
            <Link
              key={dossier.slug}
              href={dossier.href}
              className="group border border-border bg-card p-4 transition hover:border-accent hover:bg-bg"
            >
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wide text-muted-fg">
                <span>Article de fond</span>
                <span className="inline-flex items-center gap-1 font-normal normal-case tracking-normal">
                  <Clock size={12} />
                  ~{dossier.readingTimeMin} min
                </span>
              </div>
              <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug transition group-hover:text-accent">
                {dossier.title}
              </h2>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-fg">{dossier.hook}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
