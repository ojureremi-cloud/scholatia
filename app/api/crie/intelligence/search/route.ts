import type { NextRequest } from 'next/server';
import { crieGraph } from '@/lib/crie/access';
import { semanticSearch, semanticSearchStatistics } from '@/lib/crie/semantic-search';
import { adjacency } from '@/lib/crie/graph-reasoning';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const url = new URL(request.url);
    const query = url.searchParams.get('q') ?? '';
    const rawLimit = Number(url.searchParams.get('limit') ?? 10);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(50, Math.trunc(rawLimit)) : 10;
    const rawConfidence = Number(url.searchParams.get('minConfidence') ?? 0);
    const minConfidence = Number.isFinite(rawConfidence) && rawConfidence > 0 ? Math.min(1, rawConfidence) : undefined;
    const entityClasses = (url.searchParams.get('entityClasses') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    const graph = crieGraph();
    const results = semanticSearch(graph.entities, query, (crieId) => adjacency(graph, crieId).length, {
      limit,
      minConfidence,
      entityClasses: entityClasses.length > 0 ? entityClasses : undefined,
    });
    return jsonCrie({ query, results, statistics: semanticSearchStatistics([results]) });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
