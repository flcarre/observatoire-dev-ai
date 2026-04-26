"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Desktop } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-[88px] h-8 rounded-md bg-muted/30" aria-hidden />;
  }

  const options = [
    { v: "light", icon: Sun, label: "Clair" },
    { v: "system", icon: Desktop, label: "Système" },
    { v: "dark", icon: Moon, label: "Sombre" },
  ] as const;

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5">
      {options.map(({ v, icon: Icon, label }) => (
        <button
          key={v}
          onClick={() => setTheme(v)}
          aria-label={`Thème ${label}`}
          aria-pressed={theme === v}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded transition",
            theme === v ? "bg-muted text-fg" : "text-muted-fg hover:text-fg",
          )}
        >
          <Icon size={14} weight={theme === v ? "fill" : "regular"} />
        </button>
      ))}
    </div>
  );
}
