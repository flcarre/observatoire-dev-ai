"use client";

import { FlowDiagram } from "./flow-base";

export function ContextLifecycleDiagram() {
  return (
    <FlowDiagram
      height={620}
      nodes={[
        {
          id: "init",
          position: { x: 350, y: 0 },
          data: {
            label: "Initializer agent",
            description: "Run UNE fois · crée progress.md, baseline commit",
            tone: "accent",
            badge: "Init",
          },
        },
        {
          id: "session",
          position: { x: 350, y: 110 },
          data: {
            label: "Nouvelle session",
            description: "Coding agent démarre",
            tone: "default",
            badge: "Loop",
          },
        },
        {
          id: "load",
          position: { x: 80, y: 230 },
          data: {
            label: "Load progress.md<br/>+ git log",
            description: "5–10K tokens · pas le transcript",
            tone: "ok",
          },
        },
        {
          id: "skills",
          position: { x: 350, y: 230 },
          data: {
            label: "Skills tier 1",
            description: "name + description always-on (~50 tokens chacune)",
            tone: "ok",
            badge: "Tier 1",
          },
        },
        {
          id: "tools",
          position: { x: 620, y: 230 },
          data: {
            label: "Tool defs (compactes)",
            description: "Tool Search Tool si > 30 tools",
            tone: "ok",
          },
        },
        {
          id: "exec",
          position: { x: 350, y: 360 },
          data: {
            label: "Execution",
            description: "Just-in-time retrieval · grep · read on-demand",
            tone: "accent",
            badge: "Run",
          },
        },
        {
          id: "subagent",
          position: { x: 80, y: 360 },
          data: {
            label: "Sub-agent isolé",
            description: "Window propre · retourne summary 1–2K",
            tone: "warn",
          },
        },
        {
          id: "skill2",
          position: { x: 620, y: 360 },
          data: {
            label: "Skill tier 2/3",
            description: "Chargée à la pertinence · scripts à la demande",
            tone: "warn",
          },
        },
        {
          id: "compact",
          position: { x: 350, y: 480 },
          data: {
            label: "Compaction ?",
            description: "Trigger si > 100K tokens ou > 20 turns",
            tone: "warn",
            badge: "Decision",
          },
        },
        {
          id: "summary",
          position: { x: 80, y: 600 },
          data: {
            label: "Summarize<br/>+ discard tool outputs",
            description: "Garde décisions, top 5 fichiers",
            tone: "warn",
          },
        },
        {
          id: "persist",
          position: { x: 350, y: 600 },
          data: {
            label: "Persist progress.md<br/>+ memory tool",
            description: "État architectural HORS contexte",
            tone: "ok",
            badge: "External",
          },
        },
        {
          id: "commit",
          position: { x: 620, y: 600 },
          data: {
            label: "Commit + verify Puppeteer",
            description: "Marque feature 'passing' si E2E OK",
            tone: "ok",
          },
        },
      ]}
      edges={[
        { id: "e1", source: "init", target: "session", animated: true },
        { id: "e2", source: "session", target: "load" },
        { id: "e3", source: "session", target: "skills" },
        { id: "e4", source: "session", target: "tools" },
        { id: "e5", source: "load", target: "exec" },
        { id: "e6", source: "skills", target: "exec" },
        { id: "e7", source: "tools", target: "exec" },
        { id: "e8", source: "exec", target: "subagent", label: "delegate" },
        { id: "e9", source: "exec", target: "skill2", label: "pertinence" },
        { id: "e10", source: "subagent", target: "exec", label: "summary", animated: true },
        { id: "e11", source: "skill2", target: "exec" },
        { id: "e12", source: "exec", target: "compact" },
        { id: "e13", source: "compact", target: "summary", label: "yes" },
        { id: "e14", source: "compact", target: "persist", label: "no" },
        { id: "e15", source: "summary", target: "persist" },
        { id: "e16", source: "persist", target: "commit" },
        { id: "e17", source: "commit", target: "session", label: "next session", style: { strokeDasharray: "4 4" } },
      ]}
    />
  );
}
