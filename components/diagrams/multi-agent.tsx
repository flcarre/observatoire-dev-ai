"use client";

import { FlowDiagram } from "./flow-base";

export function MultiAgentDiagram() {
  return (
    <FlowDiagram
      height={520}
      nodes={[
        {
          id: "user",
          position: { x: 380, y: 0 },
          data: { label: "Utilisateur", description: "Question de recherche", tone: "default", badge: "Input" },
        },
        {
          id: "orch",
          position: { x: 380, y: 110 },
          data: {
            label: "Orchestrator",
            description: "Sonnet · plan + synthèse",
            tone: "accent",
            badge: "Lead agent",
          },
        },
        {
          id: "w1",
          position: { x: 100, y: 260 },
          data: {
            label: "Worker A",
            description: "Recherche docs + boundaries spécifiques",
            tone: "ok",
            badge: "Haiku",
          },
        },
        {
          id: "w2",
          position: { x: 340, y: 260 },
          data: {
            label: "Worker B",
            description: "Recherche web · scope géo",
            tone: "ok",
            badge: "Haiku",
          },
        },
        {
          id: "w3",
          position: { x: 580, y: 260 },
          data: {
            label: "Worker C",
            description: "Recherche interne · scope produit",
            tone: "ok",
            badge: "Haiku",
          },
        },
        {
          id: "synth",
          position: { x: 380, y: 410 },
          data: {
            label: "Synthèse",
            description: "Sonnet · agrège outputs structurés",
            tone: "accent",
            badge: "Output",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "user", target: "orch", label: "query" },
        { id: "e2", source: "orch", target: "w1", label: "scope A", animated: true },
        { id: "e3", source: "orch", target: "w2", label: "scope B", animated: true },
        { id: "e4", source: "orch", target: "w3", label: "scope C", animated: true },
        { id: "e5", source: "w1", target: "synth" },
        { id: "e6", source: "w2", target: "synth" },
        { id: "e7", source: "w3", target: "synth" },
      ]}
    />
  );
}
