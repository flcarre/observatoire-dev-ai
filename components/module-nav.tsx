import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Nav = { slug: string; title: string } | null;

export function ModuleNav({ prev, next }: { prev: Nav; next: Nav }) {
  return (
    <nav className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 not-prose">
      {prev ? (
        <Link
          href={`/m/${prev.slug}`}
          className="group flex flex-col rounded-lg border border-border bg-card p-4 transition hover:border-accent/40 hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-fg">
            <ArrowLeft size={12} />
            Article precedent
          </span>
          <span className="mt-1 font-medium leading-snug">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/m/${next.slug}`}
          className="group flex flex-col items-end rounded-lg border border-border bg-card p-4 text-right transition hover:border-accent/40 hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-fg">
            Article suivant
            <ArrowRight size={12} />
          </span>
          <span className="mt-1 font-medium leading-snug">{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
