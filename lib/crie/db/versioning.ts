import type { CrieHistoryEntry, CrieRecord } from '@/types/crie';
import { CrieVersionConflictError } from './errors';
import { getCrieStore } from './store';
import { nowIso, uuid } from './utils';

export function bumpVersion(row: CrieRecord, fields?: Partial<CrieRecord>): CrieRecord {
  return {
    ...row,
    ...(fields ?? {}),
    version: row.version + 1,
    updatedAt: nowIso(),
  };
}

export function assertVersion(row: CrieRecord, expectedVersion?: number): void {
  if (expectedVersion !== undefined && row.version !== expectedVersion) {
    throw new CrieVersionConflictError(row.crieId, expectedVersion, row.version);
  }
}

export function recordVersion(row: CrieRecord, changedBy?: string, reason?: string): CrieHistoryEntry {
  const store = getCrieStore();
  const key = `${row.id}`;
  const history = store.versions.get(key) ?? [];
  const entry: CrieHistoryEntry = {
    id: uuid(),
    crieId: row.crieId,
    version: row.version,
    snapshot: { ...row },
    changedBy,
    reason,
    at: nowIso(),
  };
  history.push(entry);
  store.versions.set(key, history);
  return entry;
}

export function versionHistory(id: string): CrieHistoryEntry[] {
  const store = getCrieStore();
  return [...(store.versions.get(id) ?? [])].sort((a, b) => b.version - a.version);
}

export function snapshotAtVersion(id: string, version: number): CrieRecord | undefined {
  const store = getCrieStore();
  const history = store.versions.get(id) ?? [];
  const entry = history.find((candidate) => candidate.version === version);
  return entry ? entry.snapshot : undefined;
}
