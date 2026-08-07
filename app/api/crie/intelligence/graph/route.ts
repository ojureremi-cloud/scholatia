import type { NextRequest } from 'next/server';
import { crieGraph } from '@/lib/crie/access';
import {
  discoverRelationships,
  graphReasoningStatistics,
  propagateTrust,
  shortestPath,
  similarEntities,
} from '@/lib/crie/graph-reasoning';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

function clampInt(value: number, fallback: number, max: number): number {
  return Number.isFinite(value) && value > 0 ? Math.min(max, Math.trunc(value)) : fallback;
}

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const similar = url.searchParams.get('similar');
    const propagate = url.searchParams.get('propagate');
    const subject = url.searchParams.get('discover');
    const object = url.searchParams.get('vs');
    const maxHops = clampInt(Number(url.searchParams.get('maxHops') ?? 2), 2, 5);
    const limit = clampInt(Number(url.searchParams.get('limit') ?? 5), 5, 25);
    const graph = crieGraph();
    const path = from && to ? shortestPath(graph, from, to) : undefined;
    const similarities = similar ? similarEntities(graph, similar, limit) : [];
    const propagations = propagate ? propagateTrust(graph, propagate, maxHops) : [];
    const discoveries = subject && object ? discoverRelationships(graph, subject, object) : [];
    return jsonCrie({
      path,
      similarities,
      propagations,
      discoveries,
      statistics: graphReasoningStatistics({
        paths: path ? [path] : [],
        discoveries,
        propagations,
        similarities,
      }),
    });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
