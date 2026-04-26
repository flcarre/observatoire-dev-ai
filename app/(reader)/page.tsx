import Link from "next/link";
import { ArrowRight, Sparkle, Lightning, Brain, Books, Stack, Graph } from "@phosphor-icons/react/dist/ssr";
import { getAllModules } from "@/lib/modules";

export default async function HomePage() {
  const modules = await getAllModules();
  const totalWords = modules.reduce((sum, m) => sum + m.raw.split(/\s+/).length, 0);
  const totalReadingTime = modules.reduce((sum, m) => sum + m.readingTimeMin, 0);

  return (
    <div className="min-h-screen">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-fg">
            <Sparkle size={12} weight="fill" className="text-accent" />
            Avril 2026 · Sénior · Sans junior content
          </div>
          <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tight">
            Formation Dev IA Sénior
          </h1>
          <p className="mt-3 text-lg text-muted-fg max-w-2xl leading-relaxed">
            Next.js 16, Vercel Fluid Compute, AI SDK 6, agents, RAG, evals, prod patterns.
            Compilé à partir des sources primaires d'Anthropic, Vercel, OpenAI, Cursor.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/m/00-etat-de-lart-2026"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90"
            >
              Commencer la formation
              <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/diagrammes"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Graph size={14} />
              Voir les diagrammes
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Modules" value={modules.length.toString()} />
            <Stat label="Mots" value={`~${(totalWords / 1000).toFixed(1)} k`} />
            <Stat label="Lecture" value={`~${Math.round(totalReadingTime / 60)} h`} />
            <Stat label="Date" value="Avril 2026" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Modules</h2>
          <Link
            href="/parcours"
            className="text-sm text-muted-fg hover:text-fg transition inline-flex items-center gap-1"
          >
            Mon parcours <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {modules.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 transition hover:border-accent/40 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-9 shrink-0 items-center justify-center rounded bg-muted font-mono text-xs font-semibold tabular-nums">
                  {m.number}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug group-hover:text-accent transition">
                    {m.title}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-fg leading-relaxed line-clamp-2">
                    {m.hook}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-fg">
                    <span>~{m.readingTimeMin} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Ce qui distingue</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<Brain size={20} weight="duotone" />}
            title="Sénior, pas junior"
            text="Aucun « build a chatbot in 5 min ». Patterns réels chez Anthropic, Vercel, Cursor, Linear, Notion."
          />
          <Feature
            icon={<Lightning size={20} weight="duotone" />}
            title="Code dense"
            text="Code TypeScript moderne (AI SDK 6, Next.js 16) avec trade-offs explicites et failure modes documentés."
          />
          <Feature
            icon={<Books size={20} weight="duotone" />}
            title="Sources primaires"
            text="Citations datées vers les blogs eng, RFC, talks. Aucun contenu d'influenceur, aucune réécriture floue."
          />
          <Feature
            icon={<Stack size={20} weight="duotone" />}
            title="Stack complète"
            text="De la plateforme Vercel à l'auth, observability, evals, multi-agents. Une vue full-stack cohérente."
          />
          <Feature
            icon={<Graph size={20} weight="duotone" />}
            title="Diagrammes interactifs"
            text="Schémas Mermaid + React Flow pour visualiser les architectures et flows multi-agents."
          />
          <Feature
            icon={<Sparkle size={20} weight="duotone" />}
            title="Lisible partout"
            text="Plateforme Next.js déployable sur Vercel. Lecture mobile / desktop / dark mode. Progression sauvegardée."
          />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-muted-fg flex flex-wrap items-center justify-between gap-2">
          <span>Sources primaires citées dans les modules et dans les annexes.</span>
          <Link href="/m/annexes-sources" className="hover:text-fg transition">
            Bibliographie complète →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-3">
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-muted-fg uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="text-accent mb-3">{icon}</div>
      <div className="font-semibold mb-1.5">{title}</div>
      <p className="text-sm text-muted-fg leading-relaxed">{text}</p>
    </div>
  );
}
