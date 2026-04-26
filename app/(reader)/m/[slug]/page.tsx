import { notFound } from "next/navigation";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Markdown } from "@/components/markdown";
import { Toc } from "@/components/toc";
import { createAppUseCases } from "@/core/infrastructure/container";
import { buildToc } from "@/lib/toc";
import { ModuleNav } from "@/components/module-nav";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const { listDossierSlugs } = createAppUseCases();
  const slugs = await listDossierSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { getDossierPage } = createAppUseCases();
  const page = await getDossierPage(slug);
  if (!page) return { title: "Introuvable" };
  return {
    title: page.dossier.title,
    description: page.dossier.hook,
  };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { getDossierPage } = createAppUseCases();
  const page = await getDossierPage(slug);
  if (!page) notFound();

  const { dossier, next, previous } = page;
  const toc = buildToc(dossier.content);

  return (
    <div className="flex">
      <article className="flex-1 min-w-0 mx-auto max-w-3xl px-6 py-10 lg:py-14">
        <div className="mb-8 not-prose">
          <div className="text-xs uppercase tracking-wider text-muted-fg mb-2">
            Dossier {dossier.number}
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
                {dossier.title.replace(/^Module\s+\d+\s+—\s+/i, "")}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-fg">
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} />
                  ~{dossier.readingTimeMin} min
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose-content">
          <Markdown source={stripFirstH1(dossier.content)} />
        </div>

        <ModuleNav prev={previous} next={next} />

        {next && (
          <div className="mt-8 not-prose flex justify-end">
            <a
              href={`/m/${next.slug}`}
              className="text-sm text-muted-fg hover:text-fg inline-flex items-center gap-1 transition"
            >
              Continuer la lecture
              <ArrowRight size={12} />
            </a>
          </div>
        )}
      </article>

      <Toc items={toc} />
    </div>
  );
}

function stripFirstH1(md: string): string {
  return md.replace(/^#\s+.+\n+/, "");
}
