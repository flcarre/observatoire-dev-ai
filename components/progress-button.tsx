"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function ProgressButton({ slug }: { slug: string }) {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("devai:progress");
      if (raw) {
        const map = JSON.parse(raw);
        setDone(Boolean(map[slug]));
      }
    } catch {}
  }, [slug]);

  const toggle = () => {
    const next = !done;
    setDone(next);
    try {
      const raw = localStorage.getItem("devai:progress");
      const map = raw ? JSON.parse(raw) : {};
      map[slug] = next;
      localStorage.setItem("devai:progress", JSON.stringify(map));
      window.dispatchEvent(new Event("devai:progress-change"));
    } catch {}
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-fg"
      >
        <Circle size={14} />
        Marquer comme lu
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition",
        done
          ? "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
          : "border-border bg-card text-fg hover:bg-muted",
      )}
    >
      {done ? <CheckCircle size={14} weight="fill" /> : <Circle size={14} />}
      {done ? "Lu" : "Marquer comme lu"}
    </button>
  );
}
