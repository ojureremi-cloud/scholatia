/**
 * E-21 Innovation Engine — Mission 004-D (Wave 2).
 *
 * Pure innovation helpers over `InnovationOpportunity` (CRIE Ch. 31).
 * Opportunity analyses are derived with calibrated confidence.
 */
import type { InnovationOpportunity, InnovationOpportunityType } from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export interface InnovationOpportunityInput {
  label: string;
  researchEntityId: string;
  opportunityType: InnovationOpportunityType;
  title: string;
  score: number;
  rationale: string;
  confidenceValue?: number;
  marketSignal?: string;
}

export function assessInnovation(input: InnovationOpportunityInput): InnovationOpportunity {
  const now = nowIso();
  return {
    id: `innovation-${slugOf(input.label)}`,
    researchEntityId: input.researchEntityId,
    opportunityType: input.opportunityType,
    title: input.title,
    score: round(Math.max(0, Math.min(1, input.score))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    rationale: input.rationale,
    marketSignal: input.marketSignal,
    createdAt: now,
    updatedAt: now,
  };
}

export function innovationScore(opportunity: InnovationOpportunity): number {
  return opportunity.score;
}

export interface InnovationStatistics {
  opportunities: number;
  byType: Partial<Record<InnovationOpportunityType, number>>;
  averageScore: number;
}

export function innovationStatistics(
  opportunities: readonly InnovationOpportunity[],
): InnovationStatistics {
  const byType: Partial<Record<InnovationOpportunityType, number>> = {};
  let scoreTotal = 0;
  for (const opportunity of opportunities) {
    byType[opportunity.opportunityType] = (byType[opportunity.opportunityType] ?? 0) + 1;
    scoreTotal += opportunity.score;
  }
  return {
    opportunities: opportunities.length,
    byType,
    averageScore: opportunities.length === 0 ? 0 : round(scoreTotal / opportunities.length),
  };
}
