import type { NextRequest } from 'next/server';
import { crieSearchAll } from '@/lib/crie/services';
import { crieErrorResponse, jsonCrie, parseCrieQuery, requirePrincipal, searchTerms } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const url = new URL(request.url);
    const terms = searchTerms(url.searchParams.get('q') ?? '');
    const query = parseCrieQuery(url);
    const table = url.searchParams.get('table') ?? undefined;
    const facet = url.searchParams.get('facet') ?? undefined;
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const results = crieSearchAll(terms, {
      table,
      facet,
      limit: Number.isFinite(limit) && limit > 0 ? Math.min(100, Math.trunc(limit)) : 20,
    });
    return jsonCrie({ terms, results, query });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
