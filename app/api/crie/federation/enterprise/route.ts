import type { NextRequest } from 'next/server';
import { crieFederationService } from '@/lib/crie/services';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const institutionId = new URL(request.url).searchParams.get('institutionId') ?? principal.institutionId;
    if (!institutionId) {
      return crieErrorResponse(
        new Error('The institutionId query parameter is required when the principal has no institution.'),
      );
    }
    return jsonCrie(crieFederationService.getEnterpriseModel(institutionId, principal));
  } catch (error) {
    return crieErrorResponse(error);
  }
}
