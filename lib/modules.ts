import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = join(process.cwd(), "content");

export type ModuleMeta = {
  slug: string;
  number: string;
  title: string;
  hook: string;
  href: string;
  readingTimeMin: number;
};

export type Module = ModuleMeta & {
  content: string;
  raw: string;
};

const MODULE_DEFS: Array<{ file: string; number: string; hook: string }> = [
  {
    file: "00-etat-de-lart-2026.md",
    number: "00",
    hook: "Le marché coding agents ($6B ARR), les transitions clefs, le hype vs le prouvé.",
  },
  {
    file: "01-nextjs-vercel-prod.md",
    number: "01",
    hook: "Cache Components, PPR, after(), Fluid Compute, AI Gateway, Sandbox.",
  },
  {
    file: "02-ai-sdk-6.md",
    number: "02",
    hook: "streamText, Tools, useChat v6, Output.object, ToolLoopAgent, AI Gateway.",
  },
  {
    file: "03-workflow-agents-dev.md",
    number: "03",
    hook: "Claude Code (hooks, skills, sub-agents, plan mode), Cursor 3, AGENTS.md, MCP.",
  },
  {
    file: "04-multi-agents-prod.md",
    number: "04",
    hook: "Workflow vs Agent, 5 primitives, lessons Anthropic (15× tokens, 90 % perf gain).",
  },
  {
    file: "05-rag-moderne.md",
    number: "05",
    hook: "Contextual retrieval, hybrid + rerank, ColBERT, agentic RAG, Cursor codebase.",
  },
  {
    file: "06-evals-observability.md",
    number: "06",
    hook: "Error analysis, code assertions, LLM-as-judge, Promptfoo/Braintrust, OpenTelemetry GenAI.",
  },
  {
    file: "07-cout-securite-perf.md",
    number: "07",
    hook: "Prompt caching, batch, model routing, context engineering, prompt injection, trust boundaries.",
  },
  {
    file: "08-jobs-realtime-voice.md",
    number: "08",
    hook: "Trigger.dev/Inngest, SSE résumable, OpenAI Realtime + WebRTC, BetterAuth, R2/Blob.",
  },
  {
    file: "09-repo-template-prod.md",
    number: "09",
    hook: "Structure mono/multi-repo, AGENTS.md, .claude/, specs/, evals/, CI/CD.",
  },
  {
    file: "10-roadmap-personnelle.md",
    number: "10",
    hook: "Daily loop, quand coder vs déléguer, anti-patterns, métriques perso à tracker.",
  },
  {
    file: "11-context-engineering.md",
    number: "11",
    hook: "La compétence rare 2026 : just-in-time retrieval, compaction, sub-agent isolation, harness Anthropic.",
  },
  {
    file: "12-process-equipe-genai.md",
    number: "12",
    hook: "Coordination multi-dev : AGENTS.md partagé, gates, eval engineer, onboarding, anti-patterns équipe.",
  },
  {
    file: "annexes-sources.md",
    number: "99",
    hook: "Toutes les sources primaires citées, par thème, et glossaire des termes 2026.",
  },
];

function fileToSlug(file: string) {
  return file.replace(/\.md$/, "");
}

function extractTitle(raw: string): string {
  const m = raw.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "(sans titre)";
}

function readingTime(raw: string): number {
  const words = raw.split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getAllModules(): Promise<Module[]> {
  const out = await Promise.all(
    MODULE_DEFS.map(async (def) => {
      const slug = fileToSlug(def.file);
      const raw = await readFile(join(CONTENT_DIR, def.file), "utf-8");
      const { content } = matter(raw);
      return {
        slug,
        number: def.number,
        title: extractTitle(content),
        hook: def.hook,
        href: `/m/${slug}`,
        readingTimeMin: readingTime(content),
        content,
        raw,
      };
    }),
  );
  return out;
}

export async function getModuleBySlug(slug: string): Promise<Module | null> {
  const def = MODULE_DEFS.find((d) => fileToSlug(d.file) === slug);
  if (!def) return null;
  const raw = await readFile(join(CONTENT_DIR, def.file), "utf-8");
  const { content } = matter(raw);
  return {
    slug,
    number: def.number,
    title: extractTitle(content),
    hook: def.hook,
    href: `/m/${slug}`,
    readingTimeMin: readingTime(content),
    content,
    raw,
  };
}

export async function getModuleSlugs(): Promise<string[]> {
  return MODULE_DEFS.map((d) => fileToSlug(d.file));
}

export function getModuleMetas(): ModuleMeta[] {
  return MODULE_DEFS.map((d) => ({
    slug: fileToSlug(d.file),
    number: d.number,
    title: "",
    hook: d.hook,
    href: `/m/${fileToSlug(d.file)}`,
    readingTimeMin: 0,
  }));
}
