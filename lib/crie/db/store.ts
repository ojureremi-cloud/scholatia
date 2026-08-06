import type { CrieAuditEntry, CrieHistoryEntry, CrieRecord } from '@/types/crie';

export interface CrieStoreData {
  tables: Map<string, Map<string, CrieRecord>>;
  audit: CrieAuditEntry[];
  versions: Map<string, CrieHistoryEntry[]>;
  seeded: boolean;
}

const STORE_KEY = '__scholatiaCrieStore';

export function createCrieStore(): CrieStoreData {
  return {
    tables: new Map<string, Map<string, CrieRecord>>(),
    audit: [],
    versions: new Map<string, CrieHistoryEntry[]>(),
    seeded: false,
  };
}

export function getCrieStore(): CrieStoreData {
  const globalForStore = globalThis as unknown as { [STORE_KEY]?: CrieStoreData };
  if (!globalForStore[STORE_KEY]) {
    globalForStore[STORE_KEY] = createCrieStore();
  }
  return globalForStore[STORE_KEY];
}

export function tableOf(store: CrieStoreData, table: string): Map<string, CrieRecord> {
  let rows = store.tables.get(table);
  if (!rows) {
    rows = new Map<string, CrieRecord>();
    store.tables.set(table, rows);
  }
  return rows;
}

export function markSeeded(): void {
  getCrieStore().seeded = true;
}

export function isSeeded(): boolean {
  return getCrieStore().seeded;
}
