import type { CrieRecord } from '@/types/crie';
import { nowIso } from './utils';

export function applySoftDelete(row: CrieRecord): CrieRecord {
  return {
    ...row,
    deletedAt: nowIso(),
    updatedAt: nowIso(),
    version: row.version + 1,
  };
}

export function restoreRow(row: CrieRecord): CrieRecord {
  return {
    ...row,
    deletedAt: null,
    updatedAt: nowIso(),
    version: row.version + 1,
  };
}

export function isActive(row: CrieRecord): boolean {
  return !row.deletedAt;
}

export function activeRows<T extends CrieRecord>(rows: readonly T[]): T[] {
  return rows.filter((row) => isActive(row));
}

export function filterDeleted(rows: readonly CrieRecord[], includeDeleted: boolean): CrieRecord[] {
  return includeDeleted ? [...rows] : activeRows(rows);
}
