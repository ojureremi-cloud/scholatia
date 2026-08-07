/**
 * E-32 Semantic Search Engine — Mission 008.
 *
 * Pure multi-factor retrieval over the RKG (CRIE Chs. 12, 61). Ranking
 * combines token overlap, entity confidence, graph connectivity, and derived
 * trust into explainable factors (P11). Derived, budget-cheap, and never
 * authoritative.
 */
import type {
  KGEntity,
  MultiFactorScore,
  MultiFactorSearchOptions,
  RankedEntityResult,
  SearchRankingFactor,
  SearchRankingFactorKey,
  SemanticSearchOptions,
} from '@/types/crie';
import { clamp, round } from './utils';
import { queryTokens, searchEntities } from './search';
import { deriveEntityTrust } from './trust';

const DEFAULT_WEIGHTS: Record<SearchRankingFactorKey, number> = {
  token: 0.4,
  confidence: 0.25,
  connectivity: 0.2,
  trust: 0.15,
  freshness: 0.1,
};

export function rankingFactor(
  key: SearchRankingFactorKey,
  score: number,
  weight: number,
): SearchRankingFactor {
  return { key, weight: round(weight), score: round(clamp(score, 0, 1)), contribution: round(weight * score) };
}

// ---------------------------------------------------------------------------
// Per-entity scoring
// ---------------------------------------------------------------------------

/** Multi-factor score of a single entity against a query. */
export function scoreEntity(
  entity: KGEntity,
  query: string,
  adjacencyCount: (crieId: string) => number,
  options: MultiFactorSearchOptions = {},
): MultiFactorScore | undefined {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return undefined;
  const weightOf = (key: SearchRankingFactorKey) => options.weights?.[key] ?? DEFAULT_WEIGHTS[key];
  const tokenHits = searchEntities([entity], query);
  const tokenScore = tokenHits.length > 0 ? tokenHits[0].score : 0;
  const confidenceScore = entity.confidence.value;
  const connectivity = adjacencyCount(entity.crieId);
  const trust = deriveEntityTrust(entity).trust;
  const factors = [
    rankingFactor('token', tokenScore, weightOf('token')),
    rankingFactor('confidence', confidenceScore, weightOf('confidence')),
    rankingFactor('connectivity', clamp(connectivity / 10, 0, 1), weightOf('connectivity')),
    rankingFactor('trust', trust, weightOf('trust')),
    rankingFactor('freshness', 1, weightOf('freshness')),
  ];
  const total = round(factors.reduce((sum, factor) => sum + factor.contribution, 0));
  if (options.minScore !== undefined && total < options.minScore) return undefined;
  return { entityCrieId: entity.crieId, total, factors };
}

// ---------------------------------------------------------------------------
// Ranking over a graph
// ---------------------------------------------------------------------------

/** Multi-factor ranked search over a knowledge graph. */
export function rankedSearch(
  graphEntities: readonly KGEntity[],
  query: string,
  adjacencyCount: (crieId: string) => number,
  options: MultiFactorSearchOptions = {},
): RankedEntityResult[] {
  const scored = graphEntities
    .map((entity) => scoreEntity(entity, query, adjacencyCount, options))
    .filter((score): score is MultiFactorScore => score !== undefined);
  return scored
    .sort((a, b) => b.total - a.total)
    .slice(0, Math.max(0, options.limit ?? 10))
    .map((score) => ({
      entity: graphEntities.find((entity) => entity.crieId === score.entityCrieId) as KGEntity,
      score: score.total,
      factors: score.factors,
    }));
}

/** Semantic search respecting class and confidence filters. */
export function semanticSearch(
  graphEntities: readonly KGEntity[],
  query: string,
  adjacencyCount: (crieId: string) => number,
  options: SemanticSearchOptions = {},
): RankedEntityResult[] {
  const filtered = graphEntities.filter(
    (entity) =>
      (!options.entityClasses || options.entityClasses.includes(entity.entityClass)) &&
      (options.minConfidence === undefined || entity.confidence.value >= options.minConfidence),
  );
  return rankedSearch(
    filtered,
    query,
    adjacencyCount,
    { limit: options.limit, minScore: 0 },
  );
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface SemanticSearchStatistics {
  queries: number;
  totalResults: number;
  averageResults: number;
}

export function semanticSearchStatistics(
  resultSets: readonly (readonly RankedEntityResult[])[],
): SemanticSearchStatistics {
  const totalResults = resultSets.reduce((sum, results) => sum + results.length, 0);
  return {
    queries: resultSets.length,
    totalResults,
    averageResults: resultSets.length === 0 ? 0 : round(totalResults / resultSets.length),
  };
}
