/**
 * CRIE ethics types (fspec §2.8).
 *
 * `EthicsReview` and `EthicsDecision` support research-ethics review;
 * `RefusalRecord` records a CRIE refusal with explanation, required whenever a
 * request violates the Constitution (Article X; CRIE Chs. 19, 67).
 */
import type {
  Auditable,
  ConfidenceScore,
  ResearcherRef,
} from './base';

export type EthicsReviewKind = 'full' | 'expedited' | 'exempt' | 'self-assessment';

export type EthicsReviewStatus = 'in-progress' | 'submitted' | 'approved' | 'rejected';

/** A research-ethics review support record. */
export interface EthicsReview extends Auditable {
  id: string;
  researchEntityId: string;
  reviewKind: EthicsReviewKind;
  status: EthicsReviewStatus;
  assessments: EthicsAssessment[];
}

export interface EthicsAssessment {
  id: string;
  ethicsReviewId: string;
  dimension: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: ConfidenceScore;
  notes: string;
}

export type EthicsVerdict = 'approve' | 'conditionally-approve' | 'reject' | 'refer';

/** A documented ethics decision or refusal. */
export interface EthicsDecision extends Auditable {
  id: string;
  ethicsReviewId: string;
  decision: EthicsVerdict;
  rationale: string;
  conditions: string[];
  decidedBy: ResearcherRef;
}

export type RefusalReason =
  | 'integrity'
  | 'confidentiality'
  | 'consent'
  | 'safety'
  | 'legal'
  | 'autonomy'
  | 'resource-bound'
  | 'constitutional';

/** A recorded refusal with explanation (Constitution Article X). */
export interface RefusalRecord extends Auditable {
  id: string;
  researcher: ResearcherRef;
  requestingAgentId?: string;
  refusalReason: RefusalReason;
  explanation: string;
  refusedAt: string;
}
