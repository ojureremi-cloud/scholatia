import type { CrieFilter, CrieQuery, CrieRecord, CrieSort } from '@/types/crie';
import { filterDeleted } from './softDelete';
import { paginate } from './pagination';

export function matchFilter(row: CrieRecord, filter: CrieFilter): boolean {
  const value = row[filter.field];
  switch (filter.operator) {
    case 'eq':
      return value === filter.value;
    case 'neq':
      return value !== filter.value;
    case 'in':
      return Array.isArray(filter.value) && (filter.value as unknown[]).includes(value);
    case 'like':
      return typeof value === 'string' && typeof filter.value === 'string'
        ? value.toLowerCase().includes(String(filter.value).toLowerCase())
        : false;
    case 'gt':
      return (value as number) > (filter.value as number);
    case 'gte':
      return (value as number) >= (filter.value as number);
    case 'lt':
      return (value as number) < (filter.value as number);
    case 'lte':
      return (value as number) <= (filter.value as number);
    case 'exists':
      return value !== undefined && value !== null && value !== '';
    case 'null':
      return value === undefined || value === null || value === '';
  }
}

export function applyFilters(rows: readonly CrieRecord[], filters: readonly CrieFilter[]): CrieRecord[] {
  if (filters.length === 0) return [...rows];
  return rows.filter((row) => filters.every((filter) => matchFilter(row, filter)));
}

export function applySort(rows: readonly CrieRecord[], sort: readonly CrieSort[]): CrieRecord[] {
  if (sort.length === 0) return [...rows];
  return [...rows].sort((a, b) => {
    for (const clause of sort) {
      const aValue = a[clause.field];
      const bValue = b[clause.field];
      let cmp = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        cmp = aValue - bValue;
      } else {
        cmp = String(aValue ?? '').localeCompare(String(bValue ?? ''));
      }
      if (cmp !== 0) return clause.direction === 'desc' ? -cmp : cmp;
    }
    return a.crieId.localeCompare(b.crieId);
  });
}

export function applyQuery(
  rows: readonly CrieRecord[],
  query: CrieQuery = {},
): { rows: CrieRecord[]; total: number; page: number; pageSize: number } {
  let result = filterDeleted(rows, query.includeDeleted ?? false);
  result = applyFilters(result, query.filters ?? []);
  result = applySort(result, query.sort ?? []);
  const total = result.length;
  const page = query.pagination?.page ?? 1;
  const pageSize = query.pagination?.pageSize ?? 20;
  const paged = paginate(result, { page, pageSize });
  return { rows: paged.items, total, page, pageSize };
}

export function toCrieSort(field: string, direction: 'asc' | 'desc' = 'asc'): CrieSort {
  return { field, direction };
}

export function toCrieFilter(field: string, operator: CrieFilter['operator'], value?: unknown): CrieFilter {
  return { field, operator, value };
}

// ---------------------------------------------------------------------------
// PostgreSQL target-schema fragments (production swap contract)
// ---------------------------------------------------------------------------

export function columnName(field: string): string {
  return field.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function whereSql(filters: readonly CrieFilter[], params: unknown[]): string {
  const clauses = filters.map((filter) => {
    const column = columnName(filter.field);
    switch (filter.operator) {
      case 'eq':
        params.push(filter.value);
        return `${column} = $${params.length}`;
      case 'neq':
        params.push(filter.value);
        return `${column} <> $${params.length}`;
      case 'in':
        params.push(Array.isArray(filter.value) ? filter.value : []);
        return `${column} = ANY($${params.length}::text[])`;
      case 'like':
        params.push(`%${String(filter.value)}%`);
        return `${column}::text ILIKE $${params.length}`;
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte': {
        const operator = filter.operator === 'gt' ? '>' : filter.operator === 'gte' ? '>=' : filter.operator === 'lt' ? '<' : '<=';
        params.push(filter.value);
        return `${column} ${operator} $${params.length}`;
      }
      case 'exists':
        return `${column} IS NOT NULL`;
      case 'null':
        return `${column} IS NULL`;
    }
  });
  return clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '';
}

export function orderBySql(sort: readonly CrieSort[]): string {
  if (sort.length === 0) return ' ORDER BY created_at ASC';
  const clauses = sort.map((clause) => `${columnName(clause.field)} ${clause.direction.toUpperCase()}`);
  return ` ORDER BY ${clauses.join(', ')}`;
}

export function offsetLimitSql(page: number, pageSize: number): string {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const offset = (safePage - 1) * safeSize;
  return ` LIMIT ${safeSize} OFFSET ${offset}`;
}

export function projectionSql(fields: readonly string[], prefix = 'row'): string {
  return fields.map((field) => `${prefix}.${columnName(field)}`).join(', ');
}
