/**
 * CRIE database adapter — Mission 006 (persistence layer).
 *
 * The adapter is the single storage seam between the persistence layer and the
 * runtime engine. The in-memory implementation delegates to the seeded store
 * (`lib/crie/db/store.ts`) while exposing the full storage contract
 * (single-row reads, bulk reads, crieId lookups, writes, removal) that a
 * production SQL adapter must satisfy. The SQL fragments in
 * `lib/crie/db/queries.ts` document the target-schema mapping for that swap.
 *
 * The adapter also provides the performance surface required by the
 * persistence layer: a table-scoped read cache (invalidated on every write and
 * bypassed inside transactions so rollback can never serve stale rows), an
 * id → row index and a crieId → id index, and batch reads.
 */
import type { CrieRecord } from '@/types/crie';
import { getCrieStore, tableOf } from './store';
import { inTransaction } from './transactions';

export interface CrieDatabaseAdapter {
  readonly name: string;

  /** Read a single active-or-deleted row by id (no soft-delete filtering). */
  read(table: string, id: string): CrieRecord | undefined;

  /** Read every row in a table (no soft-delete filtering). */
  readAll(table: string): CrieRecord[];

  /** Batch read of rows by id (no soft-delete filtering). */
  readMany(table: string, ids: readonly string[]): CrieRecord[];

  /** Indexed lookup by stable CRIE id (no soft-delete filtering). */
  findByCrieId(table: string, crieId: string): CrieRecord | undefined;

  /** Row count for a table. */
  count(table: string): number;

  /** Whether the table already exists in the backing store. */
  tableExists(table: string): boolean;

  /** Persist (insert or replace) a row. */
  write(table: string, row: CrieRecord): void;

  /** Remove a row physically (purge path — never the default). */
  remove(table: string, id: string): void;

  /** Drop a table entirely. */
  clear(table: string): void;
}

const CACHE_KEY_LIMIT = 10_000;

export class InMemoryCrieAdapter implements CrieDatabaseAdapter {
  readonly name = 'in-memory';

  /** table → id → row read cache (table-scoped, invalidated on writes). */
  private readonly cache = new Map<string, Map<string, CrieRecord>>();

  /** table → crieId → id index for O(1) CRIE-id lookups. */
  private readonly crieIndex = new Map<string, Map<string, string>>();

  private storeRows(table: string): Map<string, CrieRecord> {
    return tableOf(getCrieStore(), table);
  }

  private tableCache(table: string): Map<string, CrieRecord> | undefined {
    if (inTransaction()) return undefined;
    let rows = this.cache.get(table);
    if (!rows) {
      if (this.cache.size >= CACHE_KEY_LIMIT) this.cache.clear();
      rows = new Map<string, CrieRecord>();
      this.cache.set(table, rows);
    }
    return rows;
  }

  private invalidateTable(table: string): void {
    this.cache.delete(table);
    this.crieIndex.delete(table);
  }

  read(table: string, id: string): CrieRecord | undefined {
    const cached = this.tableCache(table);
    if (cached) {
      const hit = cached.get(id);
      if (hit !== undefined) return hit;
      const row = this.storeRows(table).get(id);
      if (row) cached.set(id, row);
      return row;
    }
    return this.storeRows(table).get(id);
  }

  readAll(table: string): CrieRecord[] {
    const rows = [...this.storeRows(table).values()];
    const cached = this.tableCache(table);
    if (cached && cached.size === 0 && rows.length > 0) {
      for (const row of rows) cached.set(row.id, row);
    }
    return rows;
  }

  readMany(table: string, ids: readonly string[]): CrieRecord[] {
    const cached = this.tableCache(table);
    const rows = this.storeRows(table);
    const found: CrieRecord[] = [];
    for (const id of ids) {
      let row = cached?.get(id);
      if (row === undefined) row = rows.get(id);
      if (row) {
        if (cached && cached.get(id) === undefined) cached.set(id, row);
        found.push(row);
      }
    }
    return found;
  }

  findByCrieId(table: string, crieId: string): CrieRecord | undefined {
    if (!inTransaction()) {
      const byCrieId = this.crieIndex.get(table);
      if (byCrieId) {
        const id = byCrieId.get(crieId);
        if (id !== undefined) return this.storeRows(table).get(id);
      }
    }
    for (const row of this.storeRows(table).values()) {
      if (row.crieId === crieId) {
        if (!inTransaction()) {
          let byCrieId = this.crieIndex.get(table);
          if (!byCrieId) {
            byCrieId = new Map<string, string>();
            this.crieIndex.set(table, byCrieId);
          }
          byCrieId.set(crieId, row.id);
        }
        return row;
      }
    }
    return undefined;
  }

  count(table: string): number {
    return this.storeRows(table).size;
  }

  tableExists(table: string): boolean {
    return getCrieStore().tables.has(table);
  }

  write(table: string, row: CrieRecord): void {
    this.storeRows(table).set(row.id, row);
    this.invalidateTable(table);
  }

  remove(table: string, id: string): void {
    this.storeRows(table).delete(id);
    this.invalidateTable(table);
  }

  clear(table: string): void {
    getCrieStore().tables.delete(table);
    this.invalidateTable(table);
  }
}

let adapterInstance: CrieDatabaseAdapter | undefined;

export function getCrieDatabaseAdapter(): CrieDatabaseAdapter {
  if (!adapterInstance) adapterInstance = new InMemoryCrieAdapter();
  return adapterInstance;
}

export function resetCrieDatabaseAdapter(): void {
  adapterInstance = undefined;
}
