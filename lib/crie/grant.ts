/**
 * E-19 Grant Engine — Mission 004-D (Wave 2).
 *
 * Pure grant and funding helpers over `GrantOpportunity`, `GrantProposal`,
 * and `GrantReview` (CRIE Ch. 29).
 */
import type {
  GrantDecision,
  GrantOpportunity,
  GrantOpportunityStatus,
  GrantProposal,
  GrantReview,
  ProposalStatus,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function grantOpportunityId(label: string): string {
  return `grant-${slugOf(label)}`;
}

export interface GrantOpportunityInput {
  label: string;
  funder: string;
  title: string;
  description: string;
  deadline: string;
  amount?: number;
  status?: GrantOpportunityStatus;
}

export function createGrantOpportunity(input: GrantOpportunityInput): GrantOpportunity {
  const now = nowIso();
  return {
    id: grantOpportunityId(input.label),
    funder: input.funder,
    title: input.title,
    description: input.description,
    deadline: input.deadline,
    amount: input.amount,
    status: input.status ?? 'open',
    createdAt: now,
    updatedAt: now,
  };
}

export interface GrantProposalInput {
  label: string;
  researchEntityId: string;
  grantOpportunityId: string;
  lead: ResearcherRef;
  sections?: string[];
  proposalStatus?: ProposalStatus;
}

export function createGrantProposal(input: GrantProposalInput): GrantProposal {
  const now = nowIso();
  return {
    id: `proposal-${slugOf(input.label)}`,
    researchEntityId: input.researchEntityId,
    grantOpportunityId: input.grantOpportunityId,
    lead: input.lead,
    proposalStatus: input.proposalStatus ?? 'developing',
    readiness: 0,
    sections: input.sections ?? [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function proposalReadiness(proposal: GrantProposal): number {
  return round(proposal.readiness);
}

export interface GrantReviewInput {
  label: string;
  grantProposalId: string;
  reviewer: ResearcherRef;
  decision: GrantDecision;
  comments: string;
  criteria?: Record<string, unknown>;
  confidenceValue?: number;
}

export function reviewProposal(input: GrantReviewInput): GrantReview {
  const now = nowIso();
  return {
    id: `grant-review-${slugOf(input.label)}`,
    grantProposalId: input.grantProposalId,
    reviewer: input.reviewer,
    criteria: input.criteria ?? {},
    decision: input.decision,
    confidence: confidence(input.confidenceValue ?? 0.5),
    comments: input.comments,
    createdAt: now,
    updatedAt: now,
  };
}

export interface GrantStatistics {
  opportunities: number;
  openOpportunities: number;
  proposals: number;
  reviews: number;
}

export function grantStatistics(
  opportunities: readonly GrantOpportunity[],
  proposals: readonly GrantProposal[] = [],
  reviews: readonly GrantReview[] = [],
): GrantStatistics {
  return {
    opportunities: opportunities.length,
    openOpportunities: opportunities.filter((opportunity) => opportunity.status === 'open').length,
    proposals: proposals.length,
    reviews: reviews.length,
  };
}
