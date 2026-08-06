import type { CrieAuditEntry, CrieRecord } from '@/types/crie';
import { CrieStoreData, getCrieStore } from './store';
import { uuid } from './utils';

export interface CrieTransaction {
  readonly id: string;
  commit(): void;
  rollback(): void;
}

let activeDepth = 0;
let currentSnapshot: CrieStoreData | null = null;

function snapshotStore(): CrieStoreData {
  const store = getCrieStore();
  const tables = new Map<string, Map<string, CrieRecord>>();
  for (const [table, rows] of store.tables) {
    tables.set(table, new Map(rows));
  }
  return {
    tables,
    audit: [...store.audit] as CrieAuditEntry[],
    versions: new Map(store.versions),
    seeded: store.seeded,
  };
}

function restoreSnapshot(snapshot: CrieStoreData): void {
  const store = getCrieStore();
  store.tables = new Map(snapshot.tables);
  store.audit = [...snapshot.audit];
  store.versions = new Map(snapshot.versions);
  store.seeded = snapshot.seeded;
}

export function runInTransaction<T>(work: () => T): T {
  if (activeDepth > 0) {
    return work();
  }
  currentSnapshot = snapshotStore();
  activeDepth += 1;
  try {
    const result = work();
    currentSnapshot = null;
    activeDepth -= 1;
    return result;
  } catch (error) {
    if (currentSnapshot) {
      restoreSnapshot(currentSnapshot);
      currentSnapshot = null;
    }
    activeDepth -= 1;
    throw error;
  }
}

export function beginTransaction(): CrieTransaction {
  if (activeDepth === 0) {
    currentSnapshot = snapshotStore();
  }
  activeDepth += 1;
  const id = uuid();
  return {
    id,
    commit() {
      if (activeDepth > 0) activeDepth -= 1;
      if (activeDepth === 0) currentSnapshot = null;
    },
    rollback() {
      if (currentSnapshot) {
        restoreSnapshot(currentSnapshot);
      }
      if (activeDepth > 0) activeDepth -= 1;
      if (activeDepth === 0) currentSnapshot = null;
    },
  };
}

export function inTransaction(): boolean {
  return activeDepth > 0;
}
