/**
 * CRIE grant & funding types (fspec §2.10).
 *
 * `GrantOpportunity` is a funding opportunity, `GrantProposal` a proposal
 * under development, and `GrantReview` a review against criteria (CRIE Ch. 29).
 */
import type {
  Auditable,
  ConfidenceScore,
  ResearcherRef,
  Versioned,
} from './base';

export type GrantOpportunityStatus = 'open' | 'closing-soon' | 'closed' | 'awarded';

/** A funding opportunity. */
export interface GrantOpportunity extends Auditable {
  id: string;
  funder: string;
  title: string;
  description: string;
  deadline: string;
  amount?: number;
  status: GrantOpportunityStatus;
}

export type ProposalStatus =
  | 'developing'
  | 'internal-review'
  | 'submitted'
  | 'under-review'
  | 'awarded'
  | 'declined';

/** A proposal under development. */
export interface GrantProposal extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  grantOpportunityId: string;
  lead: ResearcherRef;
  proposalStatus: ProposalStatus;
  readiness: number; // 0..1
  sections: string[];
}

export type GrantDecision = 'recommend' | 'recommend-minor' | 'recommend-major' | 'reject';

/** A grant review against criteria. */
export interface GrantReview extends Auditable {
  id: string;
  grantProposalId: string;
  reviewer: ResearcherRef;
  criteria: Record<string, unknown>;
  decision: GrantDecision;
  confidence: ConfidenceScore;
  comments: string;
}
