import type {
  AuthenticatedPrincipal,
  CrieAction,
  CrieActorType,
  CrieAuditEntry,
  CrieFilter,
  CrieHistoryEntry,
  CriePage,
  CrieQuery,
  CrieRecord,
  CrieTableDefinition,
} from '@/types/crie';
import { getCrieDatabaseAdapter } from './adapter';
import { listAudit, writeAudit } from './audit';
import { CrieNotFoundError } from './errors';
import { addToIndex, queryIndex, removeFromIndex } from './indexes';
import { applyQuery } from './queries';
import { filterDeleted } from './softDelete';
import { ensureCrieSeeded } from './seed';
import { runInTransaction } from './transactions';
import { crieIdFor, nowIso, uuid } from './utils';
import { assertVersion, bumpVersion, recordVersion, snapshotAtVersion, versionHistory } from './versioning';

export interface CrieRepositoryOptions {
  definition: CrieTableDefinition;
  defaultSort?: readonly { field: string; direction: 'asc' | 'desc' }[];
}

export interface CrieCreateInput {
  data: Record<string, unknown>;
  principal: AuthenticatedPrincipal;
  crieId?: string;
  reason?: string;
}

export interface CrieUpdateInput {
  id: string;
  patch: Record<string, unknown>;
  principal: AuthenticatedPrincipal;
  expectedVersion?: number;
  reason?: string;
}

export interface CrieActorInput {
  id: string;
  principal: AuthenticatedPrincipal;
  reason?: string;
}

export class CrieRepository<T extends CrieRecord = CrieRecord> {
  readonly table: string;
  private readonly definition: CrieTableDefinition;
  private readonly defaultSort: readonly { field: string; direction: 'asc' | 'desc' }[];

  constructor(options: CrieRepositoryOptions) {
    this.definition = options.definition;
    this.table = options.definition.table;
    this.defaultSort = options.defaultSort ?? [{ field: 'createdAt', direction: 'asc' }];
  }

  private actorType(principal: AuthenticatedPrincipal): CrieActorType {
    if (principal.scope === 'system') return 'system';
    if (principal.scope === 'institution') return 'institution';
    return 'researcher';
  }

  private recordAudit(
    principal: AuthenticatedPrincipal,
    action: CrieAction,
    resourceId?: string,
    payload?: Record<string, unknown>,
  ) {
    writeAudit({
      userId: principal.userId,
      username: principal.username,
      actorType: this.actorType(principal),
      resource: this.table,
      resourceId,
      action,
      payload,
    });
  }

  private index(row: CrieRecord): void {
    const def = this.definition;
    if (!def.searchTitle) return;
    addToIndex({
      table: this.table,
      crieId: row.crieId,
      entityId: row.id,
      entityClass: def.facet?.(row) ?? this.table,
      title: def.searchTitle(row),
      description: def.searchDescription?.(row),
      confidence: def.confidenceOf?.(row) ?? 0.5,
      facet: def.facet?.(row),
    });
  }

  private allowPurge(): boolean {
    return this.definition.allowPurge ?? false;
  }

  create(input: CrieCreateInput): T {
    ensureCrieSeeded();
    const now = nowIso();
    const { data } = input;
    const row = {
      ...data,
      id: uuid(),
      crieId: input.crieId ?? (typeof data.crieId === 'string' ? data.crieId : crieIdFor(this.table, String(data.title ?? uuid()))),
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: input.principal.userId,
      updatedBy: input.principal.userId,
      deletedAt: null,
    } as unknown as T;
    getCrieDatabaseAdapter().write(this.table, row);
    recordVersion(row, input.principal.userId, input.reason ?? 'create');
    this.index(row);
    this.recordAudit(input.principal, 'create', row.id, { crieId: row.crieId });
    return row;
  }

  getById(id: string): T | undefined {
    ensureCrieSeeded();
    const row = getCrieDatabaseAdapter().read(this.table, id);
    return row && !row.deletedAt ? (row as T) : undefined;
  }

  getByCrieId(crieId: string): T | undefined {
    ensureCrieSeeded();
    const row = getCrieDatabaseAdapter().findByCrieId(this.table, crieId);
    return row && !row.deletedAt ? (row as T) : undefined;
  }

  /** Fetch a row by id regardless of soft-delete state (restore path). */
  getIncludingDeleted(id: string): T | undefined {
    ensureCrieSeeded();
    const row = getCrieDatabaseAdapter().read(this.table, id);
    return row as T | undefined;
  }

  get(id: string): T | undefined {
    return this.getById(id) ?? this.getByCrieId(id);
  }

  getOrThrow(id: string): T {
    const row = this.get(id);
    if (!row) throw new CrieNotFoundError(this.table, id);
    return row;
  }

  /** Batch read of active rows by id (cached, single storage pass). */
  getMany(ids: readonly string[]): T[] {
    ensureCrieSeeded();
    return getCrieDatabaseAdapter()
      .readMany(this.table, ids)
      .filter((row) => !row.deletedAt) as T[];
  }

  /** Active rows in insertion order with no query processing (read surface). */
  rawRows(): T[] {
    ensureCrieSeeded();
    return getCrieDatabaseAdapter()
      .readAll(this.table)
      .filter((row) => !row.deletedAt) as T[];
  }

  list(query: CrieQuery = {}): CriePage<T> {
    ensureCrieSeeded();
    const rows = getCrieDatabaseAdapter().readAll(this.table);
    const defaulted: CrieQuery = {
      ...query,
      sort: query.sort && query.sort.length > 0 ? query.sort : [...this.defaultSort],
      pagination: query.pagination ?? { page: 1, pageSize: 20 },
    };
    const result = applyQuery(rows, defaulted);
    return {
      items: result.rows as T[],
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      pageCount: result.total === 0 ? 0 : Math.ceil(result.total / result.pageSize),
    };
  }

  all(query: CrieQuery = {}): T[] {
    ensureCrieSeeded();
    const rows = getCrieDatabaseAdapter().readAll(this.table);
    const result = applyQuery(rows, {
      ...query,
      sort: query.sort && query.sort.length > 0 ? query.sort : [...this.defaultSort],
      pagination: { page: 1, pageSize: Math.max(100, rows.length) },
    });
    return result.rows as T[];
  }

  count(query: CrieQuery = {}): number {
    ensureCrieSeeded();
    const rows = getCrieDatabaseAdapter().readAll(this.table);
    return applyQuery(rows, { ...query, pagination: { page: 1, pageSize: 1 } }).total;
  }

  countBy(filter: CrieFilter): number {
    return this.count({ filters: [filter] });
  }

  update(input: CrieUpdateInput): T {
    ensureCrieSeeded();
    const existing = this.getOrThrow(input.id);
    assertVersion(existing, input.expectedVersion);

    const whitelisted = this.pick(input.patch);
    const updated = bumpVersion(existing, whitelisted) as T;
    getCrieDatabaseAdapter().write(this.table, updated);
    recordVersion(existing, input.principal.userId, input.reason ?? 'update');
    this.index(updated);
    this.recordAudit(input.principal, 'update', updated.id, { crieId: updated.crieId, version: updated.version });
    return updated;
  }

  archive(input: CrieActorInput): T {
    ensureCrieSeeded();
    const existing = this.getOrThrow(input.id);
    const archived = { ...existing, deletedAt: nowIso(), updatedAt: nowIso(), version: existing.version + 1 } as T;
    getCrieDatabaseAdapter().write(this.table, archived);
    removeFromIndex(archived.id);
    recordVersion(existing, input.principal.userId, input.reason ?? 'archive');
    this.recordAudit(input.principal, 'archive', archived.id, { crieId: archived.crieId });
    return archived;
  }

  restore(input: CrieActorInput): T {
    ensureCrieSeeded();
    const existing = getCrieDatabaseAdapter().read(this.table, input.id);
    if (!existing || !existing.deletedAt) throw new CrieNotFoundError(this.table, input.id);
    const restored = { ...existing, deletedAt: null, updatedAt: nowIso(), version: existing.version + 1 } as T;
    getCrieDatabaseAdapter().write(this.table, restored);
    this.index(restored);
    recordVersion(existing, input.principal.userId, input.reason ?? 'restore');
    this.recordAudit(input.principal, 'restore', restored.id, { crieId: restored.crieId });
    return restored;
  }

  softDelete(input: CrieActorInput): T {
    return this.archive(input);
  }

  /** Soft-delete alias — the default destruction path (never physical). */
  delete(input: CrieActorInput): T {
    return this.softDelete(input);
  }

  purge(input: CrieActorInput): void {
    ensureCrieSeeded();
    if (!this.allowPurge()) {
      throw new Error(`Purge is prohibited for table '${this.table}'. Use soft delete.`);
    }
    const existing = getCrieDatabaseAdapter().read(this.table, input.id);
    if (!existing) throw new CrieNotFoundError(this.table, input.id);
    removeFromIndex(existing.id);
    getCrieDatabaseAdapter().remove(this.table, existing.id);
    this.recordAudit(input.principal, 'purge', existing.id, { crieId: existing.crieId });
  }

  search(terms: string[], query: CrieQuery = {}, limit = 20): CriePage<T> {
    ensureCrieSeeded();
    if (terms.length === 0) return this.list(query);
    const hits = queryIndex({ terms, table: this.table, limit: Math.max(100, limit * 10) });
    const ids = new Set(hits.map((hit) => hit.entityId));
    const rows = filterDeleted(getCrieDatabaseAdapter().readAll(this.table), query.includeDeleted ?? false).filter(
      (row) => ids.has(row.id),
    );
    const result = applyQuery(rows, {
      ...query,
      sort: query.sort && query.sort.length > 0 ? query.sort : [...this.defaultSort],
      pagination: query.pagination ?? { page: 1, pageSize: limit },
    });
    return {
      items: result.rows as T[],
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      pageCount: result.total === 0 ? 0 : Math.ceil(result.total / result.pageSize),
    };
  }

  history(id: string): CrieHistoryEntry[] {
    ensureCrieSeeded();
    this.getOrThrow(id);
    return versionHistory(id);
  }

  /** Current version number of a record (0 when unknown). */
  version(id: string): number {
    ensureCrieSeeded();
    const row = getCrieDatabaseAdapter().read(this.table, id);
    return row ? row.version : 0;
  }

  /** Immutable snapshot of a record at a given version. */
  versionAt(id: string, version: number): CrieRecord | undefined {
    ensureCrieSeeded();
    this.getOrThrow(id);
    return snapshotAtVersion(id, version);
  }

  /** Audit trail scoped to this repository's table. */
  audit(options: { limit?: number } = {}): CrieAuditEntry[] {
    ensureCrieSeeded();
    return listAudit({ resource: this.table, limit: options.limit });
  }

  /** Run work atomically; on failure the whole store rolls back. */
  transaction<R>(work: () => R): R {
    return runInTransaction(work);
  }

  private pick(patch: Record<string, unknown>): Record<string, unknown> {
    const allowed = new Set(this.definition.fields);
    const picked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (allowed.has(key)) picked[key] = value;
    }
    return picked;
  }
}
