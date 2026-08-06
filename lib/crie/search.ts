/**
 * E-26 Search Engine — Mission 004-D (Wave 2).
 *
 * Pure retrieval and ranking helpers over the RKG and its index (CRIE Ch. 9,
 * Ch. 61). Searches are derived, budget-cheap, and never authoritative: ranking
 * combines token overlap with calibrated confidence and index freshness.
 */
import type {
  ConfidenceScore,
  KGEntity,
  KGEntityClass,
  KGIndexEntry,
  KGRelation,
  KnowledgeGraph,
} from '@/types/crie';
import { clamp, round, slugOf } from './utils';

export function searchId(label: string): string {
  return `search-${slugOf(label)}`;
}

export function queryTokens(query: string): string[] {
  return slugOf(query).split('-').filter(Boolean);
}

export interface EntitySearchResult {
  entity: KGEntity;
  score: number;
}

function entityTokens(entity: KGEntity): string[] {
  const tokens = new Set<string>([
    ...slugOf(entity.crieId).split('-').filter(Boolean),
    ...slugOf(entity.entityClass).split('-').filter(Boolean),
  ]);
  for (const value of Object.values(entity.attributes)) {
    if (typeof value === 'string') {
      for (const token of slugOf(value).split('-').filter(Boolean)) tokens.add(token);
    }
  }
  return [...tokens];
}

export function searchEntities(
  entities: readonly KGEntity[],
  query: string,
): EntitySearchResult[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];
  const scored = entities.map((entity) => {
    const entityTokensSet = new Set(entityTokens(entity));
    const overlap = tokens.filter((token) => entityTokensSet.has(token)).length;
    const score = round(clamp((overlap / tokens.length) * 0.7 + entity.confidence.value * 0.3, 0, 1));
    return { entity, score };
  });
  return scored
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || b.entity.confidence.value - a.entity.confidence.value);
}

export function searchGraph(
  graph: KnowledgeGraph,
  query: string,
): EntitySearchResult[] {
  return searchEntities(graph.entities, query);
}

export function searchByClass(
  graph: KnowledgeGraph,
  query: string,
  entityClass: KGEntityClass,
): EntitySearchResult[] {
  return searchEntities(
    graph.entities.filter((entity) => entity.entityClass === entityClass),
    query,
  );
}

export function searchRelations(
  graph: KnowledgeGraph,
  query: string,
): KGRelation[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];
  return graph.relations
    .filter((relation) => {
      const haystack = slugOf(`${relation.predicate} ${relation.subject.crieId} ${relation.object.crieId}`);
      return tokens.some((token) => haystack.includes(token));
    })
    .sort((a, b) => b.strength - a.strength);
}

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

export function indexEntry(input: {
  label: string;
  graphId: string;
  entityId: string;
  crieId: string;
  terms: string[];
  embeddingRef?: string;
  freshness: number;
}): KGIndexEntry {
  return {
    id: `index-${slugOf(input.label)}`,
    graphId: input.graphId,
    entityId: input.entityId,
    crieId: input.crieId,
    terms: input.terms,
    embeddingRef: input.embeddingRef,
    freshness: round(clamp(input.freshness, 0, 1)),
  };
}

export function searchIndex(
  entries: readonly KGIndexEntry[],
  query: string,
): KGIndexEntry[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];
  return [...entries]
    .map((entry) => {
      const overlap = tokens.filter((token) => entry.terms.some((term) => slugOf(term) === token)).length;
      return { entry, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        b.entry.freshness - a.entry.freshness ||
        b.entry.id.localeCompare(a.entry.id),
    )
    .map(({ entry }) => entry);
}

// ---------------------------------------------------------------------------
// Facets and results
// ---------------------------------------------------------------------------

export function facetByClass(
  results: readonly EntitySearchResult[],
): Partial<Record<KGEntityClass, number>> {
  const facets: Partial<Record<KGEntityClass, number>> = {};
  for (const result of results) {
    facets[result.entity.entityClass] = (facets[result.entity.entityClass] ?? 0) + 1;
  }
  return facets;
}

export function topResults<T>(results: readonly T[], limit: number): T[] {
  return results.slice(0, Math.max(0, limit));
}

export function resultConfidence(result: EntitySearchResult): ConfidenceScore {
  return result.entity.confidence;
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface SearchStatistics {
  searches: number;
  totalResults: number;
  averageResults: number;
}

export function searchStatistics(
  resultSets: readonly (readonly EntitySearchResult[])[],
): SearchStatistics {
  const totalResults = resultSets.reduce((sum, results) => sum + results.length, 0);
  return {
    searches: resultSets.length,
    totalResults,
    averageResults: resultSets.length === 0 ? 0 : round(totalResults / resultSets.length),
  };
}
