"use client";

import { FlowDiagram } from "./flow-base";

export function AgentDecisionDiagram() {
  return (
    <FlowDiagram
      height={580}
      nodes={[
        {
          id: "task",
          position: { x: 350, y: 0 },
          data: {
            label: "Tâche identifiée",
            tone: "accent",
            badge: "Start",
          },
        },
        {
          id: "size",
          position: { x: 350, y: 100 },
          data: {
            label: "Diff < 1 phrase ?",
            description: "Une seule modification claire",
            tone: "default",
            badge: "Décision 1",
          },
        },
        {
          id: "self",
          position: { x: 80, y: 220 },
          data: {
            label: "Coder soi-même",
            description: "Plus rapide que plan",
            tone: "ok",
            badge: "Vous",
          },
        },
        {
          id: "critical",
          position: { x: 350, y: 220 },
          data: {
            label: "Crypto / auth / billing ?",
            description: "Cost d'hallucination élevé",
            tone: "default",
            badge: "Décision 2",
          },
        },
        {
          id: "selfreview",
          position: { x: 350, y: 340 },
          data: {
            label: "Vous + tests intégration",
            description: "Code humain ou agent + 100% review",
            tone: "warn",
            badge: "Vous",
          },
        },
        {
          id: "scope",
          position: { x: 620, y: 220 },
          data: {
            label: "Multi-fichier ?",
            description: "≥ 3 fichiers touchés",
            tone: "default",
            badge: "Décision 3",
          },
        },
        {
          id: "plan",
          position: { x: 620, y: 340 },
          data: {
            label: "Plan mode + execute",
            description: "Sweet spot agent",
            tone: "accent",
            badge: "Agent",
          },
        },
        {
          id: "long",
          position: { x: 850, y: 340 },
          data: {
            label: "Background agent",
            description: "Trigger.dev · agent team",
            tone: "accent",
            badge: "Agent",
          },
        },
        {
          id: "verify",
          position: { x: 500, y: 470 },
          data: {
            label: "Verification primitive",
            description: "Tests · screenshots · type-check",
            tone: "ok",
            badge: "Always",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "task", target: "size" },
        { id: "e2", source: "size", target: "self", label: "oui" },
        { id: "e3", source: "size", target: "critical", label: "non" },
        { id: "e4", source: "critical", target: "selfreview", label: "oui" },
        { id: "e5", source: "critical", target: "scope", label: "non" },
        { id: "e6", source: "scope", target: "plan", label: "≤ 3 fichiers" },
        { id: "e7", source: "scope", target: "long", label: "migration large" },
        { id: "e8", source: "self", target: "verify" },
        { id: "e9", source: "selfreview", target: "verify" },
        { id: "e10", source: "plan", target: "verify" },
        { id: "e11", source: "long", target: "verify" },
      ]}
    />
  );
}
