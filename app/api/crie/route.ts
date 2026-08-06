import type { NextRequest } from 'next/server';
import { requirePrincipal } from '@/lib/crie/http';
import { crieErrorResponse, jsonCrie } from '@/lib/crie/http';

const DOMAINS = [
  'entities',
  'evidence',
  'citations',
  'references',
  'memory',
  'graph/entities',
  'graph/relations',
  'reasoning',
  'recommendations',
  'decisions',
  'agents',
  'agents/tasks',
  'trust',
  'federation/contracts',
  'federation/assets',
  'federation/enterprise',
  'analytics',
  'workspace',
  'search',
  'audit',
] as const;

export async function GET(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    return jsonCrie({
      name: 'CRIE API',
      wave: '4',
      scopes: principal.scope,
      permissions: principal.permissions,
      endpoints: DOMAINS.map((domain) => `/api/crie/${domain}`),
    });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
