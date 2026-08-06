/**
 * E-06 Recommendation Engine — Mission 004-D (Wave 2).
 *
 * Pure decision-intelligence helpers for `Recommendation` (CRIE Ch. 65).
 * Every recommendation carries an explainable rationale, calibrated
 * confidence, and is dismissible (the researcher always holds authority).
 */
import type {
  DecisionCapability,
  Recommendation,
  RecommendationExplanation,
  RecommendationStatus,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function recommendationId(label: string): string {
  return `rec-${slugOf(label)}`;
}

export interface RecommendationInput {
  label: string;
  owner: ResearcherRef;
  kind: DecisionCapability;
  target: string;
  summary: string;
  explanation: RecommendationExplanation;
  confidenceValue?: number;
  status?: RecommendationStatus;
}

export function createRecommendation(input: RecommendationInput): Recommendation {
  const now = nowIso();
  return {
    id: recommendationId(input.label),
    owner: input.owner,
    kind: input.kind,
    target: input.target,
    summary: input.summary,
    explanation: input.explanation,
    confidence: confidence(input.confidenceValue ?? 0.5),
    status: input.status ?? 'proposed',
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function recommendationsFor(
  recommendations: readonly Recommendation[],
  ownerUsername: string,
): Recommendation[] {
  return recommendations.filter((recommendation) => recommendation.owner.username === ownerUsername);
}

export function pendingRecommendations(
  recommendations: readonly Recommendation[],
): Recommendation[] {
  return recommendations.filter((recommendation) => recommendation.status === 'proposed');
}

export function applyRecommendation(recommendation: Recommendation): Recommendation {
  const now = nowIso();
  return { ...recommendation, status: 'accepted', updatedAt: now, version: recommendation.version + 1 };
}

export function dismissRecommendation(recommendation: Recommendation): Recommendation {
  const now = nowIso();
  return { ...recommendation, status: 'dismissed', updatedAt: now, version: recommendation.version + 1 };
}

export function rankRecommendations(
  recommendations: readonly Recommendation[],
): Recommendation[] {
  return [...recommendations].sort(
    (a, b) => b.confidence.value - a.confidence.value || b.explanation.reasons.length - a.explanation.reasons.length,
  );
}

export interface RecommendationStatistics {
  total: number;
  pending: number;
  accepted: number;
  dismissed: number;
  byKind: Partial<Record<DecisionCapability, number>>;
}

export function recommendationStatistics(
  recommendations: readonly Recommendation[],
): RecommendationStatistics {
  const byKind: Partial<Record<DecisionCapability, number>> = {};
  let pending = 0;
  let accepted = 0;
  let dismissed = 0;
  for (const recommendation of recommendations) {
    byKind[recommendation.kind] = (byKind[recommendation.kind] ?? 0) + 1;
    if (recommendation.status === 'proposed') pending += 1;
    if (recommendation.status === 'accepted') accepted += 1;
    if (recommendation.status === 'dismissed') dismissed += 1;
  }
  return { total: recommendations.length, pending, accepted, dismissed, byKind };
}
