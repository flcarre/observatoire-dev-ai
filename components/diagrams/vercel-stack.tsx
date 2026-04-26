"use client";

import { FlowDiagram } from "./flow-base";

export function VercelStackDiagram() {
  return (
    <FlowDiagram
      height={620}
      nodes={[
        {
          id: "client",
          position: { x: 350, y: 0 },
          data: { label: "Client (browser)", description: "Next.js 16 app", tone: "default", badge: "Edge" },
        },
        {
          id: "fluid",
          position: { x: 350, y: 110 },
          data: {
            label: "Vercel Fluid Compute",
            description: "Routes Next.js · in-function concurrency",
            tone: "accent",
            badge: "Plateforme",
          },
        },
        {
          id: "rsc",
          position: { x: 80, y: 240 },
          data: {
            label: "Server Components",
            description: "Cache Components · DAL",
            tone: "default",
          },
        },
        {
          id: "actions",
          position: { x: 350, y: 240 },
          data: {
            label: "Server Actions",
            description: "Zod validate · verifySession",
            tone: "default",
          },
        },
        {
          id: "stream",
          position: { x: 620, y: 240 },
          data: {
            label: "Stream / SSE",
            description: "useChat v6 · resumable",
            tone: "default",
          },
        },
        {
          id: "gateway",
          position: { x: 350, y: 360 },
          data: {
            label: "AI Gateway",
            description: "Routing · BYOK · observability",
            tone: "accent",
            badge: "Vercel",
          },
        },
        {
          id: "models",
          position: { x: 80, y: 490 },
          data: {
            label: "LLM Providers",
            description: "Anthropic · OpenAI · Vertex · Bedrock",
            tone: "ok",
          },
        },
        {
          id: "trigger",
          position: { x: 350, y: 490 },
          data: {
            label: "Trigger.dev / Inngest",
            description: "Background tasks · durable",
            tone: "ok",
          },
        },
        {
          id: "sandbox",
          position: { x: 620, y: 490 },
          data: {
            label: "Vercel Sandbox",
            description: "Code exec isolé · Firecracker",
            tone: "ok",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "client", target: "fluid" },
        { id: "e2", source: "fluid", target: "rsc" },
        { id: "e3", source: "fluid", target: "actions" },
        { id: "e4", source: "fluid", target: "stream" },
        { id: "e5", source: "rsc", target: "gateway" },
        { id: "e6", source: "actions", target: "gateway" },
        { id: "e7", source: "stream", target: "gateway", animated: true },
        { id: "e8", source: "gateway", target: "models", animated: true },
        { id: "e9", source: "actions", target: "trigger", label: "long jobs" },
        { id: "e10", source: "actions", target: "sandbox", label: "untrusted code" },
      ]}
    />
  );
}
