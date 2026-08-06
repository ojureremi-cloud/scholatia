import type { NextRequest } from 'next/server';
import { crieFederationService } from '@/lib/crie/services';
import { crieErrorResponse, jsonCrie, parseCrieQuery, readBodyObject, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const page = crieFederationService.listAssets(parseCrieQuery(new URL(request.url)), principal);
    return jsonCrie(page);
  } catch (error) {
    return crieErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const body = await readBodyObject(request);
    return jsonCrie(crieFederationService.createAsset(body, principal), 201);
  } catch (error) {
    return crieErrorResponse(error);
  }
}
