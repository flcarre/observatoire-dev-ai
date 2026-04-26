import { notFound } from "next/navigation";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getAllModules, getModuleBySlug } from "@/lib/modules";
import { Markdown } from "@/components/markdown";
import { Toc } from "@/components/toc";
import { buildToc } from "@/lib/toc";
import { ProgressButton } from "@/components/progress-button";
import { ModuleNav } from "@/components/module-nav";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const modules = await getAllModules();
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getModuleBySlug(slug);
  if (!m) return { title: "Introuvable" };
  return {
    title: m.title,
    description: m.hook,
  };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getModuleBySlug(slug);
  if (!m) notFound();

  const all = await getAllModules();
  const idx = all.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const toc = buildToc(m.content);

  return (
    <div className="flex">
      <article className="flex-1 min-w-0 mx-auto max-w-3xl px-6 py-10 lg:py-14">
        <div className="mb-8 not-prose">
          <div className="text-xs uppercase tracking-wider text-muted-fg mb-2">
            Module {m.number}
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
                {m.title.replace(/^Module\s+\d+\s+—\s+/i, "")}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-fg">
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} />
                  ~{m.readingTimeMin} min
                </span>
              </div>
            </div>
            <ProgressButton slug={m.slug} />
          </div>
        </div>

        <div className="prose-content">
          <Markdown source={stripFirstH1(m.content)} />
        </div>

        <ModuleNav prev={prev} next={next} />

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
