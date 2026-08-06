import type { NextRequest } from 'next/server';
import { crieAgentService } from '@/lib/crie/services';
import {
  crieErrorResponse,
  idOf,
  jsonCrie,
  readBodyObject,
  requirePrincipal,
  type CrieRouteContext,
} from '@/lib/crie/http';

export async function GET(request: NextRequest, context: CrieRouteContext) {
  try {
    const principal = await requirePrincipal(request);
    return jsonCrie(crieAgentService.getTask(await idOf(context), principal));
  } catch (error) {
    return crieErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: CrieRouteContext) {
  try {
    const principal = await requirePrincipal(request);
    const body = await readBodyObject(request);
    return jsonCrie(crieAgentService.updateTask(await idOf(context), body, principal));
  } catch (error) {
    return crieErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: CrieRouteContext) {
  try {
    const principal = await requirePrincipal(request);
    return jsonCrie(crieAgentService.removeTask(await idOf(context), principal));
  } catch (error) {
    return crieErrorResponse(error);
  }
}
