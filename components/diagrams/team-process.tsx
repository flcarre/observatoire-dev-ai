"use client";

import { FlowDiagram } from "./flow-base";

export function TeamProcessDiagram() {
  return (
    <FlowDiagram
      height={680}
      nodes={[
        {
          id: "spec",
          position: { x: 350, y: 0 },
          data: {
            label: "Spec ou plan mode",
            description: "Spec si > 2 jours · plan mode sinon",
            tone: "accent",
            badge: "Avant code",
          },
        },
        {
          id: "lead-approve",
          position: { x: 350, y: 100 },
          data: {
            label: "Tech lead approve",
            description: "Sur design.md ou plan",
            tone: "accent",
            badge: "Gate humain",
          },
        },
        {
          id: "impl",
          position: { x: 350, y: 200 },
          data: {
            label: "Implémentation",
            description: "Plan mode + execute + verify",
            tone: "default",
            badge: "Code",
          },
        },
        {
          id: "pr",
          position: { x: 350, y: 300 },
          data: {
            label: "PR ouverte",
            description: "Auto-trigger des reviewers",
            tone: "accent",
          },
        },
        {
          id: "ai-review",
          position: { x: 80, y: 420 },
          data: {
            label: "AI reviewer",
            description: "Greptile / CodeRabbit · advisory",
            tone: "warn",
            badge: "Non bloquant",
          },
        },
        {
          id: "ci",
          position: { x: 280, y: 420 },
          data: {
            label: "CI : type, lint, tests",
            description: "Standard build + unit",
            tone: "ok",
            badge: "Bloquant",
          },
        },
        {
          id: "evals",
          position: { x: 480, y: 420 },
          data: {
            label: "Eval gate",
            description: "Promptfoo · LLM-judges calibrés",
            tone: "ok",
            badge: "Bloquant si IA",
          },
        },
        {
          id: "mutation",
          position: { x: 680, y: 420 },
          data: {
            label: "Mutation gate",
            description: "Stryker · tests killent les mutants",
            tone: "ok",
            badge: "Bloquant",
          },
        },
        {
          id: "security",
          position: { x: 280, y: 510 },
          data: {
            label: "Security gate",
            description: "Trufflehog · Lakera · Garak",
            tone: "ok",
            badge: "Bloquant",
          },
        },
        {
          id: "human",
          position: { x: 480, y: 510 },
          data: {
            label: "Human review",
            description: "Architecture, design, ownership",
            tone: "accent",
            badge: "Gate humain",
          },
        },
        {
          id: "merge",
          position: { x: 350, y: 620 },
          data: {
            label: "Merge",
            description: "Land + deploy",
            tone: "ok",
            badge: "Done",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "spec", target: "lead-approve" },
        { id: "e2", source: "lead-approve", target: "impl" },
        { id: "e3", source: "impl", target: "pr" },
        { id: "e4", source: "pr", target: "ai-review" },
        { id: "e5", source: "pr", target: "ci" },
        { id: "e6", source: "pr", target: "evals" },
        { id: "e7", source: "pr", target: "mutation" },
        { id: "e8", source: "ci", target: "security" },
        { id: "e9", source: "evals", target: "human" },
        { id: "e10", source: "mutation", target: "human" },
        { id: "e11", source: "ai-review", target: "human", style: { strokeDasharray: "4 4" }, label: "advisory" },
        { id: "e12", source: "security", target: "human" },
        { id: "e13", source: "human", target: "merge", animated: true },
      ]}
    />
  );
}
