"use client";

import { FlowDiagram } from "./flow-base";

export function RagPipelineDiagram() {
  return (
    <FlowDiagram
      height={520}
      nodes={[
        {
          id: "q",
          position: { x: 320, y: 0 },
          data: {
            label: "Query utilisateur",
            description: "Question en langage naturel",
            tone: "default",
            badge: "Input",
          },
        },
        {
          id: "rewrite",
          position: { x: 320, y: 100 },
          data: {
            label: "Query rewrite",
            description: "Haiku · expand, normalize",
            tone: "accent",
            badge: "Étape 1",
          },
        },
        {
          id: "dense",
          position: { x: 100, y: 220 },
          data: {
            label: "Dense retrieval",
            description: "pgvector · top 200",
            tone: "default",
            badge: "Parallèle",
          },
        },
        {
          id: "sparse",
          position: { x: 540, y: 220 },
          data: {
            label: "BM25 retrieval",
            description: "Postgres tsvector · top 200",
            tone: "default",
            badge: "Parallèle",
          },
        },
        {
          id: "fusion",
          position: { x: 320, y: 340 },
          data: {
            label: "Fusion RRF",
            description: "Reciprocal Rank Fusion · top 100",
            tone: "accent",
            badge: "Étape 3",
          },
        },
        {
          id: "rerank",
          position: { x: 320, y: 440 },
          data: {
            label: "Reranker",
            description: "Cohere Rerank 3 · top 10",
            tone: "ok",
            badge: "Highest ROI",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "q", target: "rewrite" },
        { id: "e2", source: "rewrite", target: "dense", label: "embed" },
        { id: "e3", source: "rewrite", target: "sparse", label: "tokenize" },
        { id: "e4", source: "dense", target: "fusion" },
        { id: "e5", source: "sparse", target: "fusion" },
        { id: "e6", source: "fusion", target: "rerank", animated: true },
      ]}
    />
  );
}
