import React from 'react';
import { entityTypeIcon, entityTypeLabel } from '@/components/discovery';
import type { DiscoveryEntityType } from '@/types/discovery';
import type { KnowledgeGraphEdge, KnowledgeGraphNode } from '@/types/intelligence';

const GROUP_COLORS: Record<string, string> = {
  researcher: '#0ea5e9',
  journal: '#8b5cf6',
  conference: '#f59e0b',
  institution: '#10b981',
  publisher: '#f97316',
  project: '#ec4899',
  publication: '#6366f1',
  dataset: '#14b8a6',
  manuscript: '#94a3b8',
  funding: '#22c55e',
};

const WIDTH = 960;
const HEIGHT = 620;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 250;

type Position = { x: number; y: number };

function layout(nodes: KnowledgeGraphNode[]): Map<string, Position> {
  const positions = new Map<string, Position>();
  nodes.forEach((node, index) => {
    const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2 - Math.PI / 2;
    positions.set(node.id, {
      x: CX + RADIUS * Math.cos(angle),
      y: CY + RADIUS * Math.sin(angle),
    });
  });
  return positions;
}

type KnowledgeGraphProps = {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
};

export default function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  const positions = layout(nodes);
  const labeled = nodes
    .filter((node) => node.weight >= 60)
    .slice(0, 14)
    .reduce((set, node) => set.add(node.id), new Set<string>());

  const groups = new Map<string, number>();
  nodes.forEach((node) => {
    groups.set(node.group, (groups.get(node.group) ?? 0) + 1);
  });

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="Ecosystem knowledge graph">
          {edges.map((edge) => {
            const source = positions.get(edge.source);
            const target = positions.get(edge.target);
            if (!source || !target) return null;
            return (
              <line
                key={edge.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#94a3b8"
                strokeWidth={1 + edge.weight / 50}
                opacity={0.25 + (edge.weight / 100) * 0.55}
              >
                <title>{edge.relation}</title>
              </line>
            );
          })}
          {nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) return null;
            const radius = 7 + node.weight / 18;
            const color = GROUP_COLORS[node.entityType] ?? '#64748b';
            const showLabel = labeled.has(node.id);
            return (
              <g key={node.id}>
                <circle cx={position.x} cy={position.y} r={radius} fill={color} opacity={0.85} stroke="#ffffff" strokeWidth={2}>
                  <title>{node.label}</title>
                </circle>
                {showLabel ? (
                  <text
                    x={position.x}
                    y={position.y - radius - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={600}
                    fill="#475569"
                  >
                    {node.label.length > 28 ? `${node.label.slice(0, 26)}…` : node.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex flex-wrap gap-3 border-t border-slate-100 px-2 pt-3">
          {Array.from(groups.entries()).map(([group, count]) => (
            <span key={group} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS[group] ?? '#64748b' }} />
              {entityTypeIcon(group as DiscoveryEntityType)} {entityTypeLabel(group as DiscoveryEntityType)} · {count}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {edges.map((edge) => {
          const source = nodes.find((node) => node.id === edge.source);
          const target = nodes.find((node) => node.id === edge.target);
          if (!source || !target) return null;
          return (
            <div key={edge.id} className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 text-sm">
              <a href={source.url} className="max-w-[220px] truncate font-semibold text-slate-800 transition hover:text-sky-700">
                {source.label}
              </a>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                {edge.relation}
              </span>
              <a href={target.url} className="max-w-[220px] truncate font-semibold text-slate-800 transition hover:text-sky-700">
                {target.label}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
