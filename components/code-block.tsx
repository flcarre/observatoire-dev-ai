"use client";

import { useState, useRef, type ReactNode } from "react";
import { Copy, Check } from "@phosphor-icons/react";

export function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const onCopy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="group relative my-5">
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copier"
        className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-card text-muted-fg opacity-0 transition group-hover:opacity-100 hover:text-fg"
      >
        {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
      </button>
      <pre ref={ref} className={className}>
        {children}
      </pre>
    </div>
  );
}
