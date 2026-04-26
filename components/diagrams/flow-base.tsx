"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type FlowNodeData = {
  label: string;
  description?: string;
  tone?: "default" | "accent" | "warn" | "ok" | "danger";
  badge?: string;
};

const TONE: Record<NonNullable<FlowNodeData["tone"]>, string> = {
  default:
    "border-border bg-card text-fg",
  accent:
    "border-accent/40 bg-accent/10 text-fg",
  warn:
    "border-amber-500/40 bg-amber-500/10 text-fg",
  ok:
    "border-emerald-500/40 bg-emerald-500/10 text-fg",
  danger:
    "border-red-500/40 bg-red-500/10 text-fg",
};

function BoxNode({ data }: { data: FlowNodeData }) {
  const tone = data.tone ?? "default";
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 shadow-sm min-w-[140px] max-w-[240px]",
        TONE[tone],
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-accent !w-2 !h-2" />
      {data.badge && (
        <div className="text-[9px] font-mono uppercase tracking-wider text-muted-fg mb-0.5">
          {data.badge}
        </div>
      )}
      <div className="text-xs font-semibold leading-snug">{data.label}</div>
      {data.description && (
        <div className="text-[11px] leading-snug text-muted-fg mt-1">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-accent !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="l" className="!bg-accent !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="r" className="!bg-accent !w-2 !h-2" />
    </div>
  );
}

const nodeTypes: NodeTypes = { box: BoxNode };

export function FlowDiagram({
  nodes,
  edges,
  height = 420,
}: {
  nodes: Node[];
  edges: Edge[];
  height?: number;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        animated: e.animated ?? false,
        markerEnd: e.markerEnd ?? {
          type: MarkerType.ArrowClosed,
          color: isDark ? "#a1a1aa" : "#52525b",
          width: 16,
          height: 16,
        },
        style: {
          stroke: isDark ? "#71717a" : "#a1a1aa",
          strokeWidth: 1.5,
          ...e.style,
        },
        labelStyle: {
          fontSize: 10,
          fill: isDark ? "#d4d4d8" : "#52525b",
          ...e.labelStyle,
        },
        labelBgStyle: {
          fill: isDark ? "#0a0a0a" : "#ffffff",
          ...e.labelBgStyle,
        },
      })),
    [edges, isDark],
  );

  const styledNodes = useMemo(
    () => nodes.map((n) => ({ ...n, type: n.type ?? "box" })),
    [nodes],
  );

  return (
    <div
      className="my-6 rounded-lg border border-border bg-card overflow-hidden"
      style={{ height }}
    >
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        zoomOnScroll={false}
        panOnScroll={false}
      >
        <Background color={isDark ? "#27272a" : "#e4e4e7"} gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-card !border !border-border [&>button]:!border-border [&>button]:!bg-card [&>button]:!text-fg"
        />
      </ReactFlow>
    </div>
  );
}
