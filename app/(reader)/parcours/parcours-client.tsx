"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Circle,
  ArrowsClockwise,
  MapTrifold,
  Clock,
} from "@phosphor-icons/react";

type Module = {
  slug: string;
  number: string;
  title: string;
  hook: string;
  readingTimeMin: number;
};

export function ParcoursClient({ modules }: { modules: Module[] }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("devai:progress");
      if (raw) setProgress(JSON.parse(raw));
    } catch {}
    const handler = () => {
      const raw = localStorage.getItem("devai:progress");
      setProgress(raw ? JSON.parse(raw) : {});
    };
    window.addEventListener("devai:progress-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("devai:progress-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggle = (slug: string) => {
    setProgress((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem("devai:progress", JSON.stringify(next));
        window.dispatchEvent(new Event("devai:progress-change"));
      } catch {}
      return next;
    });
  };

  const reset = () => {
    if (!confirm("Réinitialiser toute la progression ?")) return;
    setProgress({});
    try {
      localStorage.removeItem("devai:progress");
      window.dispatchEvent(new Event("devai:progress-change"));
    } catch {}
  };

  const completed = Object.values(progress).filter(Boolean).length;
  const total = modules.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remainingTime = modules
    .filter((m) => !progress[m.slug])
    .reduce((sum, m) => sum + m.readingTimeMin, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:py-14">
      <div className="flex items-start gap-3 mb-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-accent/10 text-accent">
          <MapTrifold size={20} weight="duotone" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mon parcours</h1>
          <p className="mt-1 text-muted-fg">
            Suivez votre progression à travers les modules. Sauvegardé localement dans votre
            navigateur (aucun compte requis).
          </p>
        </div>
      </div>

      {!mounted ? (
        <div className="mt-10 h-32 rounded-lg border border-border bg-card animate-pulse" />
      ) : (
        <>
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
              <div>
                <div className="text-3xl font-semibold tabular-nums">
                  {completed} <span className="text-muted-fg text-base font-normal">/ {total}</span>
                </div>
                <div className="text-sm text-muted-fg">Modules complétés</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold tabular-nums text-accent">{pct}%</div>
                <div className="text-sm text-muted-fg">Avancement</div>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded bg-muted">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-muted-fg">
                <Clock size={12} />
                Temps restant estimé : ~{Math.max(0, Math.round(remainingTime / 60))} h{" "}
                {remainingTime % 60} min
              </span>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 text-muted-fg hover:text-red-500 transition"
              >
                <ArrowsClockwise size={12} />
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="mt-10 space-y-2">
            {modules.map((m, i) => {
              const done = progress[m.slug];
              return (
                <div
                  key={m.slug}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-accent/40"
                >
                  <button
                    type="button"
                    onClick={() => toggle(m.slug)}
                    aria-label={done ? "Marquer comme non lu" : "Marquer comme lu"}
                    className="mt-0.5 shrink-0 text-muted-fg hover:text-accent transition"
                  >
                    {done ? (
                      <CheckCircle size={20} weight="fill" className="text-accent" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <Link href={`/m/${m.slug}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-fg mb-1">
                      <span className="font-mono">{m.number}</span>
                      <span>·</span>
                      <span>~{m.readingTimeMin} min</span>
                    </div>
                    <div className="font-semibold leading-snug group-hover:text-accent transition">
                      {m.title}
                    </div>
                    <p className="mt-1 text-sm text-muted-fg leading-relaxed line-clamp-2">
                      {m.hook}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
