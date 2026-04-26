"use client";

import { FlowDiagram } from "./flow-base";

export function TeamRolesDiagram() {
  return (
    <FlowDiagram
      height={520}
      nodes={[
        {
          id: "lead",
          position: { x: 350, y: 0 },
          data: {
            label: "Tech lead / Staff IA",
            description: "Architecture · gates · gouvernance",
            tone: "accent",
            badge: "Owner",
          },
        },
        {
          id: "context",
          position: { x: 80, y: 130 },
          data: {
            label: "Context engineer",
            description: "AGENTS.md · skills · prompts · tool descriptions",
            tone: "ok",
            badge: "Hat ou full-time",
          },
        },
        {
          id: "eval",
          position: { x: 350, y: 130 },
          data: {
            label: "Eval engineer",
            description: "Golden datasets · LLM-judges calibrés · CI gates",
            tone: "ok",
            badge: "Multiplicateur d'équipe",
          },
        },
        {
          id: "ops",
          position: { x: 620, y: 130 },
          data: {
            label: "Ops / Observability",
            description: "Coûts · traces multi-agent · alerting",
            tone: "ok",
            badge: "Hat",
          },
        },
        {
          id: "app",
          position: { x: 350, y: 280 },
          data: {
            label: "App engineers",
            description: "Implémentent les features avec les outils de l'équipe",
            tone: "default",
            badge: "Tous les devs",
          },
        },
        {
          id: "skills-stewards",
          position: { x: 80, y: 410 },
          data: {
            label: "Skills stewards (CODEOWNERS)",
            description: "Auth · Payments · Design · Generic",
            tone: "warn",
          },
        },
        {
          id: "data-spec",
          position: { x: 620, y: 410 },
          data: {
            label: "AI Data Specialists",
            description: "Notion-style · rubriques eval par feature",
            tone: "warn",
            badge: "À scale",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "lead", target: "context" },
        { id: "e2", source: "lead", target: "eval" },
        { id: "e3", source: "lead", target: "ops" },
        { id: "e4", source: "context", target: "app" },
        { id: "e5", source: "eval", target: "app" },
        { id: "e6", source: "ops", target: "app" },
        { id: "e7", source: "context", target: "skills-stewards", label: "owns" },
        { id: "e8", source: "eval", target: "data-spec", label: "scales to" },
      ]}
    />
  );
}
