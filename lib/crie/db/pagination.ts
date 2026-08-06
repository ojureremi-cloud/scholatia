import type { CrieCursorPage, CriePage } from '@/types/crie';

export interface CriePaginationOptions {
  page: number;
  pageSize: number;
}

export function paginate<T>(
  items: readonly T[],
  options: CriePaginationOptions,
): CriePage<T> {
  const page = Math.max(1, options.page);
  const pageSize = Math.min(100, Math.max(1, options.pageSize));
  const total = items.length;
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    pageCount,
  };
}

export function encodeCursor(value: string | number): string {
  return Buffer.from(`${value}`, 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): string | number {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  return Number.isNaN(Number(decoded)) ? decoded : Number(decoded);
}

export function paginateWithCursor<T>(
  items: readonly T[],
  options: { limit?: number; cursor?: string; cursorField?: (item: T) => string | number },
): CrieCursorPage<T> {
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  let cursorValue: string | number | undefined;
  if (options.cursor) {
    cursorValue = decodeCursor(options.cursor);
  }

  let rows = [...items];
  if (cursorValue !== undefined && options.cursorField) {
    const from = String(cursorValue);
    rows = rows.filter((item) => String(options.cursorField!(item)).localeCompare(from) > 0);
  }

  const hasMore = rows.length > limit;
  const pageRows = rows.slice(0, limit);
  const nextCursor =
    hasMore && options.cursorField && pageRows.length > 0
      ? encodeCursor(options.cursorField(pageRows[pageRows.length - 1]))
      : undefined;

  return { items: pageRows, nextCursor, hasMore };
}
