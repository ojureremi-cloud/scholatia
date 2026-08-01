import type { DiscoveryEntityType } from '@/types/discovery';
import type {
  IntelligenceConfidence,
  IntelligenceInsight,
  IntelligenceInsightSeverity,
  Recommendation,
  ResearchTrend,
} from '@/types/intelligence';

/**
 * Scholarly Intelligence utilities (Scholatia Phase 1.8).
 *
 * The Intelligence module is the analytical layer of the ecosystem. It does NOT
 * own records and does NOT duplicate placeholder data — everything is derived
 * from the existing Researchers, Journals, Conferences, Publishers,
 * Institutions, Projects, Funding, Datasets, Manuscripts, and Discovery
 * modules. These utilities are pure, strongly typed helpers that operate on the
 * derived intelligence surfaces (recommendations, trends, insights, forecasts)
 * so the placeholder data and the page never re-implement ranking, filtering,
 * or confidence logic by hand.
 */

/** Numeric backing for a confidence level, used to average across surfaces. */
export const CONFIDENCE_RANK: Record<IntelligenceConfidence, number> = {
  high: 95,
  medium: 70,
  low: 45,
};

/** Resolves a 0-100 score into a confidence level. */
export function resolveConfidence(score: number): IntelligenceConfidence {
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

/** Average confidence of any collection of confidence-annotated surfaces. */
export function averageConfidence(
  items: readonly { confidence: IntelligenceConfidence }[]
): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + CONFIDENCE_RANK[item.confidence], 0);
  return Math.round(total / items.length);
}

/** Sorts recommendation-shaped records by descending score. */
export function sortRecommendationsByScore<T extends Recommendation>(
  recommendations: readonly T[]
): T[] {
  return [...recommendations].sort((a, b) => b.score - a.score);
}

/** Keeps only recommendations for a given source module (entity type). */
export function filterRecommendationsByEntityType<T extends Recommendation>(
  recommendations: readonly T[],
  entityType: DiscoveryEntityType
): T[] {
  return recommendations.filter((recommendation) => recommendation.entityType === entityType);
}

/** Keeps only insights at or above a given severity. */
export function filterInsightsBySeverity(
  insights: readonly IntelligenceInsight[],
  severity: IntelligenceInsightSeverity
): IntelligenceInsight[] {
  const rank: Record<IntelligenceInsightSeverity, number> = {
    info: 0,
    positive: 1,
    warning: 2,
    critical: 3,
  };
  const threshold = rank[severity];
  return insights.filter((insight) => rank[insight.severity] >= threshold);
}

/** The single strongest trend within a discipline, if any. */
export function findBestTrendForDiscipline(
  trends: readonly ResearchTrend[],
  discipline: string
): ResearchTrend | undefined {
  return trends
    .filter((trend) => trend.discipline === discipline)
    .sort((a, b) => b.momentum - a.momentum)[0];
}

/** Sorts trends by descending momentum (rising first, declining last). */
export function sortTrendsByMomentum(trends: readonly ResearchTrend[]): ResearchTrend[] {
  return [...trends].sort((a, b) => b.momentum - a.momentum);
}
