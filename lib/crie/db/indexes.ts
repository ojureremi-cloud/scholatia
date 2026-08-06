import { queryTokens } from '@/lib/crie/search';
import type { CrieIndexEntry, CrieRecord } from '@/types/crie';
import { getCrieStore, tableOf } from './store';
import { nowIso, uuid } from './utils';

const INDEX_TABLE = 'crie_search_index_entries';

export function tokenize(text: string): string[] {
  return queryTokens(text);
}

export interface IndexInput {
  table: string;
  crieId: string;
  entityId: string;
  entityClass: string;
  title: string;
  description?: string;
  tokens?: string[];
  confidence: number;
  facet?: string;
}

export function addToIndex(input: IndexInput): CrieIndexEntry {
  const store = getCrieStore();
  const rows = tableOf(store, INDEX_TABLE);
  const entry: CrieIndexEntry = {
    id: uuid(),
    table: input.table,
    crieId: input.crieId,
    entityId: input.entityId,
    entityClass: input.entityClass,
    title: input.title,
    description: input.description,
    tokens: input.tokens ?? tokenize(`${input.title} ${input.description ?? ''}`),
    confidence: input.confidence,
    facet: input.facet,
    indexedAt: nowIso(),
  };
  rows.set(entry.id, entry as unknown as CrieRecord);
  return entry;
}

export function removeFromIndex(entityId: string): void {
  const store = getCrieStore();
  const rows = tableOf(store, INDEX_TABLE);
  for (const [id, row] of rows) {
    if ((row as unknown as CrieIndexEntry).entityId === entityId) rows.delete(id);
  }
}

export function rebuildIndex(
  table: string,
  rows: readonly CrieRecord[],
  toIndex: (row: CrieRecord) => IndexInput,
): number {
  const store = getCrieStore();
  const indexRows = tableOf(store, INDEX_TABLE);
  for (const [id, row] of indexRows) {
    if ((row as unknown as CrieIndexEntry).table === table) indexRows.delete(id);
  }
  for (const row of rows) {
    addToIndex(toIndex(row));
  }
  return rows.length;
}

export function queryIndex(options: {
  terms: string[];
  table?: string;
  facet?: string;
  limit?: number;
}): CrieIndexEntry[] {
  const store = getCrieStore();
  const rows = [...tableOf(store, INDEX_TABLE).values()] as unknown as CrieIndexEntry[];
  const terms = options.terms.map((term) => term.toLowerCase());
  const ranked = rows
    .filter((entry) => {
      if (options.table && entry.table !== options.table) return false;
      if (options.facet && entry.facet !== options.facet) return false;
      return terms.some(
        (term) => entry.tokens.includes(term) || entry.title.toLowerCase().includes(term),
      );
    })
    .map((entry) => {
      const overlap = terms.filter((term) => entry.tokens.includes(term)).length;
      const titleHit = terms.some((term) => entry.title.toLowerCase().includes(term)) ? 1 : 0;
      const score = overlap / Math.max(1, terms.length) + titleHit * 0.3 + entry.confidence * 0.2;
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score || b.entry.indexedAt.localeCompare(a.entry.indexedAt));
  return ranked.slice(0, options.limit ?? 20).map(({ entry }) => entry);
}

export interface IndexSummary {
  table: string;
  count: number;
  lastIndexed?: string;
}

export function listIndexes(): IndexSummary[] {
  const store = getCrieStore();
  const rows = [...tableOf(store, INDEX_TABLE).values()] as unknown as CrieIndexEntry[];
  const byTable = new Map<string, CrieIndexEntry[]>();
  for (const entry of rows) {
    const group = byTable.get(entry.table) ?? [];
    group.push(entry);
    byTable.set(entry.table, group);
  }
  return [...byTable.entries()].map(([table, entries]) => ({
    table,
    count: entries.length,
    lastIndexed: [...entries].sort((a, b) => b.indexedAt.localeCompare(a.indexedAt))[0]?.indexedAt,
  }));
}
