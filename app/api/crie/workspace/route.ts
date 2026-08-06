import type { NextRequest } from 'next/server';
import { crieWorkspaceService } from '@/lib/crie/services';
import { crieErrorResponse, jsonCrie, readBodyObject, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const workspace = crieWorkspaceService.getOwnWorkspace(principal);
    return jsonCrie(workspace ?? null);
  } catch (error) {
    return crieErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const body = await readBodyObject(request);
    return jsonCrie(crieWorkspaceService.upsertOwn(body, principal));
  } catch (error) {
    return crieErrorResponse(error);
  }
}
