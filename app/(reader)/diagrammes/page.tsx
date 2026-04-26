import { Graph } from "@phosphor-icons/react/dist/ssr";
import { MultiAgentDiagram } from "@/components/diagrams/multi-agent";
import { RagPipelineDiagram } from "@/components/diagrams/rag-pipeline";
import { VercelStackDiagram } from "@/components/diagrams/vercel-stack";
import { RepoArchitectureDiagram } from "@/components/diagrams/repo-architecture";
import { AgentDecisionDiagram } from "@/components/diagrams/agent-decision";
import { CostStackDiagram } from "@/components/diagrams/cost-stack";
import { ContextLifecycleDiagram } from "@/components/diagrams/context-lifecycle";
import { TeamProcessDiagram } from "@/components/diagrams/team-process";
import { TeamRolesDiagram } from "@/components/diagrams/team-roles";

export const metadata = {
  title: "Diagrammes interactifs",
  description: "Architectures, flows multi-agents, pipelines RAG visualisés avec React Flow.",
};

export default function DiagrammesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
      <div className="flex items-start gap-3 mb-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-accent/10 text-accent">
          <Graph size={20} weight="duotone" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Diagrammes interactifs</h1>
          <p className="mt-1 text-muted-fg">
            Visualisations React Flow des architectures et flows clefs de la formation. Tous les
            schémas sont zoomables (boutons en bas à droite).
          </p>
        </div>
      </div>

      <Section
        title="Stack Next.js + Vercel"
        text="La pile fullstack en avril 2026 : du browser jusqu'aux providers LLM, en passant par le Gateway, les Server Actions, les jobs durables et la sandbox."
        anchor="vercel-stack"
        moduleRef="01"
      >
        <VercelStackDiagram />
      </Section>

      <Section
        title="Décision : coder vs déléguer"
        text="L'arbre de décision pour chaque tâche du daily loop. Diff < 1 phrase ? Code critique ? Multi-fichier ? Long-running ? Vérification toujours."
        anchor="agent-decision"
        moduleRef="03"
      >
        <AgentDecisionDiagram />
      </Section>

      <Section
        title="Pattern Orchestrator-Worker (multi-agent)"
        text="Le pattern canonique pour la recherche en parallèle. Lead agent (Sonnet) plan, workers (Haiku) exécutent avec scopes explicites pour éviter la convergence sur les mêmes sources."
        anchor="multi-agent"
        moduleRef="04"
      >
        <MultiAgentDiagram />
      </Section>

      <Section
        title="Pipeline RAG hybride 2026"
        text="Le baseline de production : query rewrite → retrieve parallèle dense + sparse → fusion RRF → reranker. −67 % failure rate vs naïf (Anthropic Contextual Retrieval)."
        anchor="rag-pipeline"
        moduleRef="05"
      >
        <RagPipelineDiagram />
      </Section>

      <Section
        title="Stack des leviers de coût"
        text="Comment passer de 100 % du coût naïf à ~5–10 %, en cumulant routing, prompt caching, batch API et context engineering."
        anchor="cost-stack"
        moduleRef="07"
      >
        <CostStackDiagram />
      </Section>

      <Section
        title="Architecture du repo template"
        text="Le repo prod-ready 2026. AGENTS.md en single source, .claude/ pour les hooks/skills/subagents, packages/ai centralisé, evals gated en CI."
        anchor="repo-architecture"
        moduleRef="09"
      >
        <RepoArchitectureDiagram />
      </Section>

      <Section
        title="Cycle de vie du contexte"
        text="Comment le contexte est managé sur un agent long-running : initializer agent une fois, puis loop coding agent qui charge progress.md + git log, exécute en just-in-time retrieval, compacte si > 100K tokens, persiste l'état architectural en fichiers externes, vérifie via Puppeteer avant d'ajouter une feature passing."
        anchor="context-lifecycle"
        moduleRef="11"
      >
        <ContextLifecycleDiagram />
      </Section>

      <Section
        title="Rôles dans une équipe IA-native"
        text="Le tech lead/staff possède l'architecture et les gates. Le context engineer (hat puis full-time) owne AGENTS.md/skills/prompts. L'eval engineer est le multiplicateur d'équipe — souvent le rôle le plus négligé. L'ops gère coûts et observabilité. Les app engineers consomment ces outils."
        anchor="team-roles"
        moduleRef="12"
      >
        <TeamRolesDiagram />
      </Section>

      <Section
        title="Process d'équipe : PR jusqu'au merge"
        text="Une PR traverse spec/plan → AI reviewer (advisory) en parallèle de CI gates bloquants (lint, tests, evals, mutation, security). Le human reviewer focus sur architecture, pas line-by-line. Merge seulement après tous les gates passés."
        anchor="team-process"
        moduleRef="12"
      >
        <TeamProcessDiagram />
      </Section>
    </div>
  );
}

function Section({
  title,
  text,
  anchor,
  moduleRef,
  children,
}: {
  title: string;
  text: string;
  anchor: string;
  moduleRef: string;
  children: React.ReactNode;
}) {
  return (
    <section id={anchor} className="mt-12 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="text-xs font-mono text-muted-fg">Module {moduleRef}</span>
      </div>
      <p className="mt-2 text-sm text-muted-fg leading-relaxed">{text}</p>
      {children}
    </section>
  );
}
