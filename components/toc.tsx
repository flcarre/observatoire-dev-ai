"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const closest = visible.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          )[0];
          setActive(closest.target.id);
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0 sticky top-0 self-start max-h-screen overflow-y-auto scrollbar-thin py-8 pl-6 pr-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg mb-3">
        Sur cette page
      </div>
      <ul className="space-y-1 border-l border-border">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "block border-l-2 -ml-px py-1 pl-3 text-xs leading-snug transition hover:text-fg",
                it.level === 3 && "pl-6",
                active === it.id
                  ? "border-l-accent text-fg font-medium"
                  : "border-l-transparent text-muted-fg",
              )}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
