/**
 * CRIE HTTP helpers — Mission 004-F (Wave 4).
 *
 * Shared plumbing for `app/api/crie/**` route handlers:
 *   - authentication (requirePrincipal) on every route
 *   - query parsing (page/pageSize/sort/filter/terms)
 *   - body parsing with a readable 400 on malformed JSON
 *   - CrieError → typed JSON error mapping (same shape as lib/auth/response)
 *   - handler factories so each route file stays a thin declaration
 */
import type { NextRequest } from 'next/server';
import type { AuthenticatedPrincipal, CrieFilter, CrieQuery, CrieSort } from '@/types/crie';
import { CrieError } from './db/errors';
import { requirePrincipal } from './auth';
import type { CrieService } from './services';

export { requirePrincipal } from './auth';

export interface CrieRouteContext {
  params: Promise<Record<string, string | string[] | undefined>>;
}

/** Normalize the `id` dynamic segment (single-segment routes). */
export async function idOf(context: CrieRouteContext): Promise<string> {
  const params = await context.params;
  const raw = params.id;
  return Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '');
}

export type CrieRouteHandler = (request: NextRequest, context: CrieRouteContext) => Promise<Response>;

export function crieErrorResponse(error: unknown): Response {
  if (error instanceof CrieError) {
    const body: Record<string, unknown> = {
      error: {
        code: error.code,
        message: error.message,
        ...(error.fieldErrors && Object.keys(error.fieldErrors).length > 0
          ? { fieldErrors: error.fieldErrors }
          : {}),
      },
    };
    return Response.json(body, { status: error.status });
  }
  if (error instanceof SyntaxError) {
    return Response.json(
      { error: { code: 'validation', message: 'The request body must be valid JSON.' } },
      { status: 400 },
    );
  }
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return Response.json(
    { error: { code: 'internal', message: `Something went wrong: ${message}` } },
    { status: 500 },
  );
}

export function jsonCrie(data: unknown, status = 200): Response {
  return Response.json({ data }, { status });
}

export async function readBodyObject(request: NextRequest): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (!text.trim()) return {};
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Request body must be a JSON object.');
  }
  return parsed as Record<string, unknown>;
}

function parseFilter(raw: string): CrieFilter | undefined {
  const parts = raw.split(':');
  if (parts.length < 2) return undefined;
  const field = parts[0].trim();
  const operatorRaw = parts[1].trim();
  const value = parts.slice(2).join(':');
  const operators: CrieFilter['operator'][] = [
    'eq',
    'neq',
    'in',
    'like',
    'gt',
    'gte',
    'lt',
    'lte',
    'exists',
    'null',
  ];
  const operator = (operators as string[]).includes(operatorRaw) ? (operatorRaw as CrieFilter['operator']) : 'eq';
  if (operator === 'exists' || operator === 'null') return { field, operator };
  return { field, operator, value };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Parse a `CrieQuery` from URL search parameters. */
export function parseCrieQuery(url: URL): CrieQuery {
  const query: CrieQuery = {};

  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
  if (Number.isFinite(page) && Number.isFinite(pageSize)) {
    query.pagination = { page: clamp(Math.trunc(page), 1, 1_000_000), pageSize: clamp(Math.trunc(pageSize), 1, 100) };
  }

  const sortRaw = url.searchParams.get('sort');
  if (sortRaw) {
    const sorts: CrieSort[] = [];
    for (const token of sortRaw.split(',')) {
      const [field, direction] = token.split(':');
      if (!field) continue;
      sorts.push({ field, direction: direction === 'asc' ? 'asc' : 'desc' });
    }
    if (sorts.length > 0) query.sort = sorts;
  }

  const filters: CrieFilter[] = [];
  for (const raw of url.searchParams.getAll('filter')) {
    const parsed = parseFilter(raw);
    if (parsed) filters.push(parsed);
  }
  if (filters.length > 0) query.filters = filters;

  const search = url.searchParams.get('q') ?? url.searchParams.get('search');
  if (search) query.search = search;

  if (url.searchParams.get('includeDeleted') === 'true') query.includeDeleted = true;

  return query;
}

/** Split a query string into search terms. */
export function searchTerms(value: string): string[] {
  return value
    .split(/[\s,;]+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 0)
    .slice(0, 12);
}

export function expectedVersionOf(request: NextRequest): number | undefined {
  const raw = new URL(request.url).searchParams.get('expectedVersion');
  const value = Number(raw);
  return raw !== null && Number.isFinite(value) && value >= 1 ? value : undefined;
}

// ---------------------------------------------------------------------------
// Handler factories.
// ---------------------------------------------------------------------------

export interface CollectionHandlers {
  GET: CrieRouteHandler;
  POST: CrieRouteHandler;
}

export function collectionHandlers(service: CrieService): CollectionHandlers {
  return {
    GET: async (request) => {
      try {
        const principal = await requirePrincipal(request);
        const page = service.list(parseCrieQuery(new URL(request.url)), principal);
        return jsonCrie(page);
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
    POST: async (request) => {
      try {
        const principal = await requirePrincipal(request);
        const body = await readBodyObject(request);
        const created = service.create(body, principal);
        return jsonCrie(created, 201);
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
  };
}

export interface RecordHandlers {
  GET: CrieRouteHandler;
  PATCH: CrieRouteHandler;
  DELETE: CrieRouteHandler;
}

export function recordHandlers(service: CrieService): RecordHandlers {
  return {
    GET: async (request, context) => {
      try {
        const principal = await requirePrincipal(request);
        return jsonCrie(service.get(await idOf(context), principal));
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
    PATCH: async (request, context) => {
      try {
        const principal = await requirePrincipal(request);
        const id = await idOf(context);
        const body = await readBodyObject(request);
        const expectedVersion = expectedVersionOf(request);
        const { expectedVersion: _bodyVersion, ...patch } = body;
        const version = expectedVersion ?? (typeof _bodyVersion === 'number' ? _bodyVersion : undefined);
        return jsonCrie(service.update(id, patch, principal, version));
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
    DELETE: async (request, context) => {
      try {
        const principal = await requirePrincipal(request);
        return jsonCrie(service.remove(await idOf(context), principal));
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
  };
}

export interface HistoryHandlers {
  GET: CrieRouteHandler;
}

export function historyHandlers(service: CrieService): HistoryHandlers {
  return {
    GET: async (request, context) => {
      try {
        const principal = await requirePrincipal(request);
        return jsonCrie(service.history(await idOf(context), principal));
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
  };
}

export interface ActionHandlers {
  POST: CrieRouteHandler;
}

/** Generic single-argument record action (restore / purge). */
export function actionHandlers(
  service: CrieService,
  action: 'restore' | 'purge',
): ActionHandlers {
  return {
    POST: async (request, context) => {
      try {
        const principal = await requirePrincipal(request);
        return jsonCrie(service[action](await idOf(context), principal));
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
  };
}

export function searchHandlers(service: CrieService): { GET: CrieRouteHandler } {
  return {
    GET: async (request) => {
      try {
        const principal = await requirePrincipal(request);
        const url = new URL(request.url);
        const terms = searchTerms(url.searchParams.get('q') ?? '');
        const page = service.search(terms, parseCrieQuery(url), principal);
        return jsonCrie(page);
      } catch (error) {
        return crieErrorResponse(error);
      }
    },
  };
}

// Re-exported for convenience in route files.
export type { AuthenticatedPrincipal };
