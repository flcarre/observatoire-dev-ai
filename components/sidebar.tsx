"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { List, X, BookOpen, House, Graph, MapTrifold } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

type ModuleEntry = {
  slug: string;
  number: string;
  title: string;
  hook: string;
};

export function Sidebar({ modules }: { modules: ModuleEntry[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("devai:progress");
      if (raw) setProgress(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const completed = Object.values(progress).filter(Boolean).length;
  const total = modules.length;
  const pct = Math.round((completed / total) * 100);

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
                  <div className="text-xs uppercase tracking-wide text-muted-fg">Formation</div>
                  <div className="text-sm font-semibold leading-tight">Dev IA Sénior</div>
                </div>
              </div>
            </Link>
            <div className="mt-3 text-xs text-muted-fg">Avril 2026 · Next.js + Vercel + Agents</div>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
            <NavLink href="/" icon={<House size={14} />} active={pathname === "/"}>
              Accueil
            </NavLink>
            <NavLink href="/diagrammes" icon={<Graph size={14} />} active={pathname === "/diagrammes"}>
              Diagrammes interactifs
            </NavLink>
            <NavLink href="/parcours" icon={<MapTrifold size={14} />} active={pathname === "/parcours"}>
              Mon parcours
            </NavLink>

            <div className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-fg">
              Modules
            </div>

            <ul className="space-y-0.5">
              {modules.map((m) => {
                const isActive = pathname === `/m/${m.slug}`;
                const done = progress[m.slug];
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
                          done
                            ? "bg-accent/20 text-accent border border-accent/40"
                            : isActive
                            ? "bg-accent text-accent-fg"
                            : "bg-muted text-muted-fg",
                        )}
                      >
                        {done ? "✓" : m.number}
                      </span>
                      <span className="line-clamp-2 leading-snug">{m.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-fg">Progression</span>
                <span className="tabular-nums font-medium">
                  {completed}/{total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded bg-muted">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-fg">Thème</span>
              <ThemeToggle />
            </div>
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
