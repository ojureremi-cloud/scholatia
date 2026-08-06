import type { NextRequest } from 'next/server';
import type { CrieAction } from '@/types/crie';
import { crieAuditList } from '@/lib/crie/services';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const url = new URL(request.url);
    const rawLimit = url.searchParams.get('limit');
    const action = url.searchParams.get('action') ?? undefined;
    const entries = crieAuditList(principal, {
      resourceId: url.searchParams.get('resourceId') ?? undefined,
      resource: url.searchParams.get('resource') ?? undefined,
      action: action as CrieAction | undefined,
      actorId: url.searchParams.get('actorId') ?? undefined,
      limit: rawLimit && Number.isFinite(Number(rawLimit)) ? Number(rawLimit) : undefined,
    });
    return jsonCrie({ entries, count: entries.length });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
