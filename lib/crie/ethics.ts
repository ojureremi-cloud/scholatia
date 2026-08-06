/**
 * E-14 Ethics Engine — Mission 004-D (Wave 2).
 *
 * Pure research-ethics helpers over `EthicsReview`, `EthicsAssessment`,
 * `EthicsDecision`, and `RefusalRecord` (CRIE Chs. 19, 67). Refusals are
 * recorded whenever a request violates the Constitution (Article X).
 */
import type {
  EthicsAssessment,
  EthicsDecision,
  EthicsReview,
  EthicsReviewKind,
  EthicsReviewStatus,
  EthicsVerdict,
  RefusalReason,
  RefusalRecord,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function ethicsReviewId(label: string): string {
  return `ethics-${slugOf(label)}`;
}

export interface EthicsReviewInput {
  label: string;
  researchEntityId: string;
  reviewKind: EthicsReviewKind;
  status?: EthicsReviewStatus;
}

export function createEthicsReview(input: EthicsReviewInput): EthicsReview {
  const now = nowIso();
  return {
    id: ethicsReviewId(input.label),
    researchEntityId: input.researchEntityId,
    reviewKind: input.reviewKind,
    status: input.status ?? 'in-progress',
    assessments: [],
    createdAt: now,
    updatedAt: now,
  };
}

export interface EthicsAssessmentInput {
  label: string;
  ethicsReviewId: string;
  dimension: string;
  riskLevel: 'low' | 'medium' | 'high';
  notes: string;
  confidenceValue?: number;
}

export function assessEthics(input: EthicsAssessmentInput): EthicsAssessment {
  return {
    id: `ethics-assess-${slugOf(input.label)}`,
    ethicsReviewId: input.ethicsReviewId,
    dimension: input.dimension,
    riskLevel: input.riskLevel,
    confidence: confidence(input.confidenceValue ?? 0.5),
    notes: input.notes,
  };
}

export interface EthicsDecisionInput {
  label: string;
  ethicsReviewId: string;
  decision: EthicsVerdict;
  rationale: string;
  conditions?: string[];
  decidedBy: ResearcherRef;
}

export function decideEthics(input: EthicsDecisionInput): EthicsDecision {
  const now = nowIso();
  return {
    id: `ethics-decision-${slugOf(input.label)}`,
    ethicsReviewId: input.ethicsReviewId,
    decision: input.decision,
    rationale: input.rationale,
    conditions: input.conditions ?? [],
    decidedBy: input.decidedBy,
    createdAt: now,
    updatedAt: now,
  };
}

export interface RefusalInput {
  label: string;
  researcher: ResearcherRef;
  refusalReason: RefusalReason;
  explanation: string;
  requestingAgentId?: string;
}

/** Record a Constitution-compliant refusal (Article X). */
export function refuse(input: RefusalInput): RefusalRecord {
  const now = nowIso();
  return {
    id: `refusal-${slugOf(input.label)}`,
    researcher: input.researcher,
    requestingAgentId: input.requestingAgentId,
    refusalReason: input.refusalReason,
    explanation: input.explanation,
    refusedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export interface EthicsStatistics {
  reviews: number;
  approved: number;
  conditionallyApproved: number;
  rejected: number;
  refusals: number;
}

export function ethicsStatistics(
  reviews: readonly EthicsReview[],
  decisions: readonly EthicsDecision[] = [],
  refusals: readonly RefusalRecord[] = [],
): EthicsStatistics {
  let approved = 0;
  let conditionallyApproved = 0;
  let rejected = 0;
  for (const decision of decisions) {
    if (decision.decision === 'approve') approved += 1;
    if (decision.decision === 'conditionally-approve') conditionallyApproved += 1;
    if (decision.decision === 'reject') rejected += 1;
  }
  return { reviews: reviews.length, approved, conditionallyApproved, rejected, refusals: refusals.length };
}
