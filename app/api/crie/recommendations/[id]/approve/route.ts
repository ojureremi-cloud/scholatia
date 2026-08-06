import type { NextRequest } from 'next/server';
import { crieRecommendationService } from '@/lib/crie/services';
import { crieErrorResponse, idOf, jsonCrie, requirePrincipal, type CrieRouteContext } from '@/lib/crie/http';

export async function POST(request: NextRequest, context: CrieRouteContext) {
  try {
    const principal = await requirePrincipal(request);
    return jsonCrie(crieRecommendationService.approve(await idOf(context), principal));
  } catch (error) {
    return crieErrorResponse(error);
  }
}
