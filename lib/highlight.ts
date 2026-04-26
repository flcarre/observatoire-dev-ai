import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

const LANGS = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "bash",
  "shell",
  "yaml",
  "markdown",
  "python",
  "html",
  "css",
  "diff",
  "sql",
  "dockerfile",
];

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-dark-default", "github-light-default"],
        langs: LANGS,
      }),
    );
  }
  return highlighterPromise;
}

export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  const safeLang = highlighter.getLoadedLanguages().includes(lang as never)
    ? (lang as never)
    : ("plaintext" as never);
  const isDark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return highlighter.codeToHtml(code, {
    lang: safeLang,
    theme: isDark ? "github-dark-default" : "github-light-default",
  });
}
