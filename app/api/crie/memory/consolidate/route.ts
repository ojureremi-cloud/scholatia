import type { NextRequest } from 'next/server';
import { crieMemoryService } from '@/lib/crie/services';
import { crieErrorResponse, jsonCrie, readBodyObject, requirePrincipal } from '@/lib/crie/http';

export async function POST(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const body = await readBodyObject(request);
    const recordIds = Array.isArray(body.recordIds) ? body.recordIds.map(String) : [];
    return jsonCrie(crieMemoryService.consolidate(recordIds, principal), 201);
  } catch (error) {
    return crieErrorResponse(error);
  }
}
