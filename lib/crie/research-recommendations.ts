/**
 * E-33 Research Recommendation Engine — Mission 008.
 *
 * Pure decision-intelligence helpers that derive grounded next-best actions
 * for a research entity (CRIE Ch. 65): research recommendations with
 * explainable reasons, and lightweight assistant suggestions. Every
 * recommendation is derived, dismissible, and preserves human authority
 * (Article VIII).
 */
import type {
  AssistantRecommendation,
  AssistantRecommendationKind,
  RecommendationReason,
  ResearchEntity,
  ResearchRecommendation,
  ResearchRecommendationKind,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';
import { stageProgressOf } from './research-intelligence';

export function researchRecommendationId(label: string): string {
  return `research-rec-${slugOf(label)}`;
}

export function recommendationReason(
  type: RecommendationReason['type'],
  detail: string,
  sourceIds: string[] = [],
): RecommendationReason {
  return { type, detail, sourceIds };
}

export interface ResearchRecommendationInput {
  label: string;
  owner: ResearcherRef;
  researchEntityId: string;
  kind: ResearchRecommendationKind;
  title: string;
  summary: string;
  reasons: RecommendationReason[];
  confidenceValue?: number;
  evidenceChainIds?: string[];
}

export function createResearchRecommendation(
  input: ResearchRecommendationInput,
): ResearchRecommendation {
  const now = nowIso();
  return {
    id: researchRecommendationId(input.label),
    owner: { username: input.owner.username, name: input.owner.name },
    researchEntityId: input.researchEntityId,
    kind: input.kind,
    title: input.title,
    summary: input.summary,
    reasons: input.reasons,
    confidence: confidence(input.confidenceValue ?? 0.5),
    status: 'proposed',
    evidenceChainIds: input.evidenceChainIds ?? [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

// ---------------------------------------------------------------------------
// Derived recommendation
// ---------------------------------------------------------------------------

/** Derive a next-step recommendation from the entity's stage and progress. */
export function recommendNextStep(entity: ResearchEntity): ResearchRecommendation {
  const progress = stageProgressOf(entity);
  const stage = entity.model.stage;
  const title = `Advance from ${stage} stage`;
  const summary =
    progress < 0.5
      ? `Current stage coverage is ${round(progress * 100)}%. Consolidate the ${stage} stage before moving forward.`
      : `Stage coverage is ${round(progress * 100)}%. The next research stage is ready to begin.`;
  return createResearchRecommendation({
    label: `${entity.id}-next-step`,
    owner: entity.owner,
    researchEntityId: entity.id,
    kind: 'next-step',
    title,
    summary,
    reasons: [
      recommendationReason('evidence', `Stage coverage ${round(progress * 100)}%`, [entity.model.id]),
      recommendationReason('inference', `Stage is ${progress < 0.5 ? 'below' : 'at or above'} the readiness threshold.`),
    ],
    confidenceValue: progress < 0.5 ? 0.4 : 0.7,
  });
}

export function recommendationsForEntity(
  recommendations: readonly ResearchRecommendation[],
  researchEntityId: string,
): ResearchRecommendation[] {
  return recommendations.filter(
    (recommendation) => recommendation.researchEntityId === researchEntityId,
  );
}

export function rankResearchRecommendations(
  recommendations: readonly ResearchRecommendation[],
): ResearchRecommendation[] {
  return [...recommendations].sort(
    (a, b) => b.confidence.value - a.confidence.value || b.reasons.length - a.reasons.length,
  );
}

export function acceptRecommendation(recommendation: ResearchRecommendation): ResearchRecommendation {
  const now = nowIso();
  return { ...recommendation, status: 'accepted', updatedAt: now, version: recommendation.version + 1 };
}

// ---------------------------------------------------------------------------
// Assistant recommendations
// ---------------------------------------------------------------------------

export function assistantRecommendationId(label: string): string {
  return `assistant-rec-${slugOf(label)}`;
}

export interface AssistantRecommendationInput {
  label: string;
  kind: AssistantRecommendationKind;
  summary: string;
  rationale: string;
  confidenceValue?: number;
  action?: string;
}

export function createAssistantRecommendation(
  input: AssistantRecommendationInput,
): AssistantRecommendation {
  const now = nowIso();
  return {
    id: assistantRecommendationId(input.label),
    kind: input.kind,
    summary: input.summary,
    rationale: input.rationale,
    confidence: confidence(input.confidenceValue ?? 0.5),
    action: input.action,
    createdAt: now,
    updatedAt: now,
  };
}

export function assistantRecommendationsFor(
  recommendations: readonly AssistantRecommendation[],
  kind: AssistantRecommendationKind,
): AssistantRecommendation[] {
  return recommendations.filter((recommendation) => recommendation.kind === kind);
}

export function rankAssistantRecommendations(
  recommendations: readonly AssistantRecommendation[],
): AssistantRecommendation[] {
  return [...recommendations].sort((a, b) => b.confidence.value - a.confidence.value);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface ResearchRecommendationStatistics {
  total: number;
  byKind: Partial<Record<ResearchRecommendationKind, number>>;
  pending: number;
  accepted: number;
  averageConfidence: number;
}

export function researchRecommendationStatistics(
  recommendations: readonly ResearchRecommendation[],
): ResearchRecommendationStatistics {
  const byKind: Partial<Record<ResearchRecommendationKind, number>> = {};
  let pending = 0;
  let accepted = 0;
  let confidenceTotal = 0;
  for (const recommendation of recommendations) {
    byKind[recommendation.kind] = (byKind[recommendation.kind] ?? 0) + 1;
    if (recommendation.status === 'proposed') pending += 1;
    if (recommendation.status === 'accepted') accepted += 1;
    confidenceTotal += recommendation.confidence.value;
  }
  return {
    total: recommendations.length,
    byKind,
    pending,
    accepted,
    averageConfidence: recommendations.length === 0 ? 0 : round(confidenceTotal / recommendations.length),
  };
}
