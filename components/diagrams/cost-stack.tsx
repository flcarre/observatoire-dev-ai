"use client";

import { FlowDiagram } from "./flow-base";

export function CostStackDiagram() {
  return (
    <FlowDiagram
      height={500}
      nodes={[
        {
          id: "raw",
          position: { x: 100, y: 50 },
          data: {
            label: "Coût de référence",
            description: "Sonnet, sans optimisation",
            tone: "danger",
            badge: "100 %",
          },
        },
        {
          id: "route",
          position: { x: 380, y: 50 },
          data: {
            label: "+ Routing Haiku",
            description: "80 % du trafic au modèle cheap",
            tone: "warn",
            badge: "≈ 30 %",
          },
        },
        {
          id: "cache",
          position: { x: 100, y: 220 },
          data: {
            label: "+ Prompt caching",
            description: "Anthropic 90 % off sur prefix",
            tone: "warn",
            badge: "≈ 10 %",
          },
        },
        {
          id: "batch",
          position: { x: 380, y: 220 },
          data: {
            label: "+ Batch API (async)",
            description: "50 % off sur SLA 24h",
            tone: "ok",
            badge: "≈ 5 %",
          },
        },
        {
          id: "context",
          position: { x: 100, y: 390 },
          data: {
            label: "+ Context engineering",
            description: "Skills · subagents · compaction",
            tone: "ok",
            badge: "Variable",
          },
        },
        {
          id: "final",
          position: { x: 380, y: 390 },
          data: {
            label: "Stack production",
            description: "5–10 % du coût naïf, latence + basse",
            tone: "ok",
            badge: "Cible",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "raw", target: "route", label: "−70 %" },
        { id: "e2", source: "route", target: "cache" },
        { id: "e3", source: "cache", target: "batch", label: "−50 %" },
        { id: "e4", source: "batch", target: "context" },
        { id: "e5", source: "context", target: "final", animated: true },
      ]}
    />
  );
}
