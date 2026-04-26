"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Mermaid } from "./mermaid";
import { CodeBlock } from "./code-block";
import { highlightCode } from "@/lib/highlight";
import { slugifyHeading } from "@/lib/toc";
import { useEffect, useState } from "react";

const slugify = slugifyHeading;

function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    highlightCode(code, lang).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (!html) {
    return (
      <CodeBlock>
        <code>{code}</code>
      </CodeBlock>
    );
  }
  return (
    <div className="my-5 group relative">
      <CopyButton text={code} />
      <div
        className="overflow-x-auto rounded-xl border border-border [&_pre]:!bg-card [&_pre]:!p-4 [&_pre]:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copier"
      className="absolute right-3 top-3 z-10 rounded border border-border bg-card px-2 py-1 text-[10px] uppercase tracking-wider text-muted-fg opacity-0 transition group-hover:opacity-100 hover:text-fg"
    >
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 id={slugify(String(children))} {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 id={slugify(String(children))} {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 id={slugify(String(children))} {...props}>
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 id={slugify(String(children))} {...props}>
            {children}
          </h4>
        ),
        a: ({ href, children, ...props }) => {
          const isInternal =
            href?.startsWith("./") ||
            href?.startsWith("/") ||
            (href && !href.includes("://") && !href.startsWith("#"));
          let resolved = href;
          if (href?.startsWith("./") && href.endsWith(".md")) {
            resolved = href.replace(/^\.\//, "/m/").replace(/\.md$/, "");
          }
          return (
            <a
              href={resolved}
              target={isInternal ? undefined : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer"}
              {...props}
            >
              {children}
            </a>
          );
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className ?? "");
          const isBlock = match !== null;
          const code = String(children).replace(/\n$/, "");

          if (isBlock && match[1] === "mermaid") {
            return <Mermaid chart={code} />;
          }
          if (isBlock) {
            return <HighlightedCode code={code} lang={match[1]} />;
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        table: ({ children, ...props }) => (
          <div className="my-6 overflow-x-auto rounded-lg border border-border">
            <table {...props} className="w-full">
              {children}
            </table>
          </div>
        ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
