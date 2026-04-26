"use client";

import { useMemo, useState } from "react";
import {
  ArrowSquareOut,
  Books,
  Buildings,
  FunnelSimple,
  MagnifyingGlass,
  SealCheck,
  Sparkle,
} from "@phosphor-icons/react";
import type { Dossier } from "@/core/domain/dossier";
import type { ResourceCategory } from "@/core/domain/observatory";
import { getResourceAnchorId, listResourceAuthors } from "@/core/domain/observatory";
import { cn } from "@/lib/utils";

type ResourceExplorerProps = {
  categories: ResourceCategory[];
  dossiers: Pick<Dossier, "slug" | "title" | "href" | "hook">[];
};

const sourceLabels = {
  primary: "source primaire",
  independent: "recherche indépendante",
  community: "communauté",
};

const freshnessLabels = {
  recent: "récent",
  durable: "durable",
  historical: "historique",
};

export function ResourceExplorer({ categories, dossiers }: ResourceExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [query, setQuery] = useState("");
  const totalResourceCount = categories.reduce(
    (sum, category) => sum + category.resources.length,
    0,
  );

  const dossierBySlug = useMemo(() => new Map(dossiers.map((dossier) => [dossier.slug, dossier])), [
    dossiers,
  ]);
  const authors = useMemo(() => listResourceAuthors(categories), [categories]);

  const visibleCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return categories
      .filter((category) => selectedCategory === "all" || category.id === selectedCategory)
      .map((category) => {
        const resources = category.resources.filter((resource) => {
          if (selectedAuthor !== "all" && resource.author !== selectedAuthor) {
            return false;
          }

          if (normalizedQuery) {
            const haystack = [
              resource.title,
              resource.publisher,
              resource.author,
              resource.date,
              resource.kind,
              resource.sourceType,
              resource.freshness,
              resource.synthesis,
              resource.articleSummary,
              resource.seniorTakeaway,
              resource.useWhen,
              ...resource.tags,
            ]
              .join(" ")
              .toLowerCase();
            return haystack.includes(normalizedQuery);
          }

          return true;
        });

        return { ...category, resources };
      })
      .filter(
        (category) =>
          category.resources.length > 0 || (!normalizedQuery && selectedAuthor === "all"),
      );
  }, [categories, query, selectedAuthor, selectedCategory]);

  const visibleResourceCount = visibleCategories.reduce(
    (sum, category) => sum + category.resources.length,
    0,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="border border-border bg-card p-3">
            <div className="flex items-center gap-2 px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-fg">
              <FunnelSimple size={14} />
              Catégories
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition",
                selectedCategory === "all" ? "bg-muted text-fg" : "text-muted-fg hover:bg-muted/60",
              )}
            >
              <span>Toute la veille</span>
              <span className="font-mono text-xs">{totalResourceCount}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "mt-1 flex w-full items-center justify-between px-3 py-2 text-left text-sm transition",
                  selectedCategory === category.id
                    ? "bg-muted text-fg"
                    : "text-muted-fg hover:bg-muted/60",
                )}
              >
                <span className="line-clamp-1">{category.title}</span>
                <span className="font-mono text-xs">{category.resources.length}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="border border-border bg-card p-3 sm:p-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
              <label className="relative block">
                <MagnifyingGlass
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Chercher: context, Codex, Linear, evals, sécurité..."
                  className="h-11 w-full border border-border bg-bg pl-10 pr-3 text-sm outline-none transition placeholder:text-muted-fg focus:border-accent"
                />
              </label>
              <label className="relative block">
                <Buildings
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
                />
                <select
                  value={selectedAuthor}
                  onChange={(event) => setSelectedAuthor(event.target.value)}
                  className="h-11 w-full appearance-none border border-border bg-bg pl-10 pr-8 text-sm outline-none transition focus:border-accent"
                >
                  <option value="all">Tous auteurs / orgs</option>
                  {authors.map((author) => (
                    <option key={author.name} value={author.name}>
                      {author.name} ({author.resourceCount})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-fg">
              <span className="inline-flex items-center gap-1 border border-border px-2 py-1">
                <SealCheck size={13} />
                {visibleResourceCount} ressources visibles
              </span>
              <span className="inline-flex items-center gap-1 border border-border px-2 py-1">
                <Sparkle size={13} />
                Mis à jour avril 2026
              </span>
              {selectedAuthor !== "all" && (
                <span className="inline-flex items-center gap-1 border border-border px-2 py-1">
                  <Buildings size={13} />
                  {selectedAuthor}
                </span>
              )}
            </div>
          </div>

          {visibleResourceCount === 0 ? (
            <div className="mt-4 border border-border bg-card p-8 text-center">
              <p className="text-sm font-medium">Aucune ressource ne correspond à cette recherche.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                  setSelectedAuthor("all");
                }}
                className="mt-3 border border-border px-3 py-2 text-xs font-medium text-muted-fg transition hover:bg-muted hover:text-fg"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-8">
              {visibleCategories.map((category) => {
                const relatedDossiers = category.dossierSlugs
                  .map((slug) => dossierBySlug.get(slug))
                  .filter(Boolean);

                return (
                  <section key={category.id} id={category.id} className="scroll-mt-8">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
                      <div>
                        <div className="border-l-2 border-accent pl-4">
                          <h2 className="text-2xl font-semibold tracking-tight">{category.title}</h2>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-fg">
                            {category.summary}
                          </p>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-fg/80">
                            {category.whyItMatters}
                          </p>
                        </div>

                        <div className="mt-4 grid gap-3">
                          {category.resources.map((resource) => (
                            <article
                              key={`${category.id}-${resource.url}`}
                              id={getResourceAnchorId(category.id, resource.title)}
                              className="scroll-mt-6 border border-border bg-card p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-muted-fg">
                                    <span>{resource.author}</span>
                                    {resource.author !== resource.publisher && (
                                      <>
                                        <span className="h-1 w-1 bg-border" />
                                        <span>{resource.publisher}</span>
                                      </>
                                    )}
                                    <span className="h-1 w-1 bg-border" />
                                    <span>{resource.date}</span>
                                    <span className="h-1 w-1 bg-border" />
                                    <span>{sourceLabels[resource.sourceType]}</span>
                                  </div>
                                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                                    {resource.title}
                                  </h3>
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium text-muted-fg transition hover:border-accent hover:text-fg"
                                >
                                  Source
                                  <ArrowSquareOut size={14} />
                                </a>
                              </div>

                              <p className="mt-3 text-sm leading-6 text-fg/85">{resource.synthesis}</p>

                              {resource.articleSummary && (
                                <div className="mt-4 border border-border bg-bg p-4">
                                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-fg">
                                    Résumé de l'article
                                  </div>
                                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-fg/90">
                                    {resource.articleSummary}
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="bg-muted/50 p-3">
                                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-fg">
                                    Takeaway senior
                                  </div>
                                  <p className="mt-1 text-sm leading-6">{resource.seniorTakeaway}</p>
                                </div>
                                <div className="bg-muted/50 p-3">
                                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-fg">
                                    À lire quand
                                  </div>
                                  <p className="mt-1 text-sm leading-6">{resource.useWhen}</p>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <span className="border border-border px-2 py-1 text-[11px] text-muted-fg">
                                  {freshnessLabels[resource.freshness]}
                                </span>
                                <span className="border border-border px-2 py-1 text-[11px] text-muted-fg">
                                  {resource.kind}
                                </span>
                                {resource.tags.map((tag) => (
                                  <span key={tag} className="bg-muted px-2 py-1 text-[11px] text-muted-fg">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>

                      {relatedDossiers.length > 0 && (
                        <aside className="border border-border bg-card p-4 xl:self-start">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-fg">
                            <Books size={14} />
                            Articles liés
                          </div>
                          <div className="mt-3 space-y-2">
                            {relatedDossiers.map((dossier) => (
                              <a
                                key={dossier!.slug}
                                href={dossier!.href}
                                className="block border border-border p-3 transition hover:border-accent hover:bg-muted/50"
                              >
                                <div className="text-sm font-medium leading-snug">{dossier!.title}</div>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-fg">
                                  {dossier!.hook}
                                </p>
                              </a>
                            ))}
                          </div>
                        </aside>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
