"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => m.default);
  }
  return mermaidPromise;
}

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`m-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setSvg(null);

    loadMermaid().then((mermaid) => {
      if (cancelled) return;
      const isDark = resolvedTheme === "dark";
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "neutral",
        themeVariables: isDark
          ? {
              background: "transparent",
              primaryColor: "#27272a",
              primaryTextColor: "#fafafa",
              primaryBorderColor: "#3f3f46",
              lineColor: "#71717a",
              secondaryColor: "#18181b",
              tertiaryColor: "#0a0a0a",
            }
          : {
              background: "transparent",
              primaryColor: "#f4f4f5",
              primaryTextColor: "#18181b",
              primaryBorderColor: "#d4d4d8",
              lineColor: "#71717a",
            },
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
        sequence: { useMaxWidth: true },
      });

      mermaid
        .render(idRef.current, chart)
        .then(({ svg }) => {
          if (!cancelled) setSvg(svg);
        })
        .catch((e: Error) => {
          if (!cancelled) setError(e.message ?? "Erreur de rendu Mermaid");
        });
    });

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
        <strong>Diagramme Mermaid invalide.</strong>
        <pre className="mt-2 overflow-auto text-xs">{error}</pre>
        <pre className="mt-2 overflow-auto text-xs opacity-70">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 grid place-items-center rounded-lg border border-border bg-muted/30 p-12 text-sm text-muted-fg">
        Rendu du diagramme…
      </div>
    );
  }

  return (
    <div
      className="mermaid-container my-6 rounded-lg border border-border bg-card p-6 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
