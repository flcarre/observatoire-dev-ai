"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Article,
  Binoculars,
  BookOpen,
  Books,
  FolderOpen,
  GitPullRequest,
  House,
  List,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

type ModuleEntry = {
  slug: string;
  number: string;
  title: string;
  hook: string;
};

type CategoryEntry = {
  id: string;
  title: string;
  summary: string;
  resourceCount: number;
};

type ResourceEntry = {
  title: string;
  publisher: string;
  categoryTitle: string;
  categoryId: string;
  anchorId: string;
  synthesis: string;
  tags: string[];
};

const FEATURED_DOSSIERS = new Set([
  "00-etat-de-lart-2026",
  "03-workflow-agents-dev",
  "04-multi-agents-prod",
  "05-rag-moderne",
  "06-evals-observability",
  "07-cout-securite-perf",
  "10-roadmap-personnelle",
  "11-context-engineering",
  "12-process-equipe-genai",
]);

export function Sidebar({
  modules,
  categories,
  resources,
}: {
  modules: ModuleEntry[];
  categories: CategoryEntry[];
  resources: ResourceEntry[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const visibleDossiers = modules.filter((module) => FEATURED_DOSSIERS.has(module.slug));
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (normalizedQuery.length < 2) return [];

    const resourceResults = resources
      .filter((resource) =>
        [
          resource.title,
          resource.publisher,
          resource.categoryTitle,
          resource.synthesis,
          ...resource.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 7)
      .map((resource) => ({
        id: `resource-${resource.anchorId}`,
        type: "Ressource",
        title: resource.title,
        eyebrow: `${resource.publisher} · ${resource.categoryTitle}`,
        href: `/#${resource.anchorId}`,
      }));

    const dossierResults = modules
      .filter((module) =>
        [module.title, module.hook, module.slug].join(" ").toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 4)
      .map((module) => ({
        id: `dossier-${module.slug}`,
        type: "Dossier",
        title: module.title,
        eyebrow: module.hook,
        href: `/m/${module.slug}`,
      }));

    return [...resourceResults, ...dossierResults].slice(0, 10);
  }, [modules, normalizedQuery, resources]);

  const closeSearch = () => {
    setQuery("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden fixed top-3 left-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card shadow-sm"
      >
        {open ? <X size={18} /> : <List size={18} />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[300px] shrink-0 border-r border-border bg-bg/95 backdrop-blur",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="px-5 pt-5 pb-3 border-b border-border">
            <Link href="/" className="block group">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-fg">
                  <BookOpen size={18} weight="duotone" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-fg">Observatoire</div>
                  <div className="text-sm font-semibold leading-tight">DevIA</div>
                </div>
              </div>
            </Link>
            <div className="mt-3 text-xs text-muted-fg">Avril 2026 · Veille senior · Open source</div>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
            <div className="px-2 pb-3">
              <label className="relative block">
                <MagnifyingGlass
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une ressource..."
                  className="h-10 w-full border border-border bg-card pl-9 pr-8 text-sm outline-none transition placeholder:text-muted-fg focus:border-accent"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Effacer la recherche"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-muted-fg transition hover:text-fg"
                  >
                    <X size={13} />
                  </button>
                )}
              </label>

              {normalizedQuery.length >= 2 && (
                <div className="mt-2 border border-border bg-card">
                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto p-1">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={result.href}
                          onClick={closeSearch}
                          className="block border-b border-border/60 px-2 py-2 last:border-b-0 transition hover:bg-muted/60"
                        >
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-fg">
                            {result.type === "Ressource" ? <Article size={12} /> : <Books size={12} />}
                            {result.type}
                          </div>
                          <div className="mt-1 line-clamp-2 text-sm font-medium leading-snug">
                            {result.title}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-fg">
                            {result.eyebrow}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-4 text-xs leading-5 text-muted-fg">
                      Aucun article ou dossier trouve.
                    </div>
                  )}
                </div>
              )}
            </div>

            <NavLink href="/" icon={<House size={14} />} active={pathname === "/"}>
              Observatoire
            </NavLink>
            <NavLink href="/#contribuer" icon={<GitPullRequest size={14} />} active={false}>
              How to contribute
            </NavLink>

            <div className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-fg">
              Axes de veille
            </div>

            <ul className="space-y-0.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/#${category.id}`}
                    className="flex items-start gap-2 rounded px-3 py-2 text-sm text-muted-fg transition hover:bg-muted/50 hover:text-fg"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-7 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-mono font-semibold text-muted-fg tabular-nums">
                      {category.resourceCount}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-1 leading-snug">{category.title}</span>
                      <span className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-muted-fg/80">
                        {category.summary}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-fg">
              Dossiers de fond
            </div>

            <ul className="space-y-0.5">
              {visibleDossiers.map((m) => {
                const isActive = pathname === `/m/${m.slug}`;
                return (
                  <li key={m.slug}>
                    <Link
                      href={`/m/${m.slug}`}
                      className={cn(
                        "flex items-start gap-2 rounded px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-muted text-fg font-medium"
                          : "text-muted-fg hover:bg-muted/50 hover:text-fg",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-5 w-7 shrink-0 items-center justify-center rounded text-[10px] font-mono font-semibold tabular-nums",
                          isActive
                            ? "bg-accent text-accent-fg"
                            : "bg-muted text-muted-fg",
                        )}
                      >
                        {m.number}
                      </span>
                      <span className="line-clamp-2 leading-snug">{m.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-fg">Thème</span>
              <ThemeToggle />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 border border-border px-3 py-2 text-xs text-muted-fg transition hover:border-accent hover:text-fg"
            >
              <Binoculars size={14} />
              Veille principale
              <FolderOpen size={14} className="ml-auto" />
            </Link>
          </div>
        </div>
      </aside>

      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
        />
      )}
    </>
  );
}

function NavLink({
  href,
  children,
  icon,
  active,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded px-3 py-2 text-sm transition",
        active
          ? "bg-muted text-fg font-medium"
          : "text-muted-fg hover:bg-muted/50 hover:text-fg",
      )}
    >
      <span className="text-muted-fg">{icon}</span>
      {children}
    </Link>
  );
}
