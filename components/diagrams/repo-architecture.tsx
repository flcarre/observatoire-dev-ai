"use client";

import { FlowDiagram } from "./flow-base";

export function RepoArchitectureDiagram() {
  return (
    <FlowDiagram
      height={620}
      nodes={[
        {
          id: "agents",
          position: { x: 350, y: 0 },
          data: {
            label: "AGENTS.md",
            description: "Tool-agnostique · ≤ 80 lignes",
            tone: "accent",
            badge: "Single source",
          },
        },
        {
          id: "claude",
          position: { x: 80, y: 110 },
          data: {
            label: ".claude/",
            description: "Hooks · Skills · Subagents",
            tone: "default",
            badge: "Claude Code",
          },
        },
        {
          id: "specs",
          position: { x: 620, y: 110 },
          data: {
            label: "specs/",
            description: "SDD pour features > 2 jours",
            tone: "default",
            badge: "Spec Kit",
          },
        },
        {
          id: "apps",
          position: { x: 350, y: 230 },
          data: {
            label: "apps/web",
            description: "Next.js 16 · App Router",
            tone: "accent",
          },
        },
        {
          id: "ai",
          position: { x: 80, y: 360 },
          data: {
            label: "packages/ai",
            description: "Prompts · tools · agents · gateway",
            tone: "ok",
          },
        },
        {
          id: "auth",
          position: { x: 280, y: 360 },
          data: {
            label: "packages/auth",
            description: "BetterAuth · DAL",
            tone: "ok",
          },
        },
        {
          id: "db",
          position: { x: 460, y: 360 },
          data: {
            label: "packages/db",
            description: "Drizzle · pgvector",
            tone: "ok",
          },
        },
        {
          id: "ui",
          position: { x: 640, y: 360 },
          data: {
            label: "packages/ui",
            description: "shadcn primitives · tokens",
            tone: "ok",
          },
        },
        {
          id: "trigger",
          position: { x: 80, y: 490 },
          data: {
            label: "trigger/",
            description: "Background tasks · Trigger.dev",
            tone: "warn",
          },
        },
        {
          id: "evals",
          position: { x: 350, y: 490 },
          data: {
            label: "evals/",
            description: "Promptfoo · golden datasets · CI gate",
            tone: "warn",
          },
        },
        {
          id: "ci",
          position: { x: 620, y: 490 },
          data: {
            label: ".github/workflows",
            description: "ci · evals · deploy",
            tone: "warn",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "agents", target: "claude" },
        { id: "e2", source: "agents", target: "specs" },
        { id: "e3", source: "agents", target: "apps" },
        { id: "e4", source: "apps", target: "ai" },
        { id: "e5", source: "apps", target: "auth" },
        { id: "e6", source: "apps", target: "db" },
        { id: "e7", source: "apps", target: "ui" },
        { id: "e8", source: "ai", target: "trigger" },
        { id: "e9", source: "ai", target: "evals", animated: true },
        { id: "e10", source: "evals", target: "ci" },
        { id: "e11", source: "ci", target: "apps", style: { strokeDasharray: "4 4" }, label: "deploy" },
      ]}
    />
  );
}
