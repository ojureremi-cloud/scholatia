/**
 * CRIE evidence types (fspec §2.5, §4.4).
 *
 * `Claim` is the unit of evidence assessment; `EvidenceRecord` is the
 * underlying support record (data, experiment, observation, reference).
 * `EvidenceAssessment` binds a claim to evidence with a verdict and strength,
 * `Contradiction` surfaces conflicting claims, and `Retraction` propagates the
 * withdrawal of evidence (CRIE Ch. 14).
 */
import type {
  Auditable,
  ConfidenceScore,
  CrieIdRef,
  EntityLifecycleState,
  ProvenanceRef,
  Versioned,
} from './base';
import type { EvidenceChain } from './reasoning';

export type EvidenceType = 'data' | 'experiment' | 'observation' | 'reference';

/** The underlying support record for claims. */
export interface EvidenceRecord extends Auditable, Versioned {
  id: string;
  evidenceType: EvidenceType;
  summary: string;
  provenance: ProvenanceRef;
  confidence: ConfidenceScore;
  researchEntityId?: string;
  documentId?: string;
}

export type ClaimType =
  | 'empirical'
  | 'theoretical'
  | 'methodological'
  | 'descriptive'
  | 'interpretive'
  | 'normative';

/** An assertion made by a work; the unit of evidence assessment. */
export interface Claim extends Auditable, Versioned {
  id: string;
  documentChunkId?: string;
  entityRef?: CrieIdRef;
  claimType: ClaimType;
  statement: string;
  confidence: ConfidenceScore;
  lifecycleState: EntityLifecycleState;
  evidenceChains: EvidenceChain[];
}

export type AssessmentVerdict =
  | 'supports'
  | 'contradicts'
  | 'neutral'
  | 'refutes';

/** The binding between a claim and its evidence with an assessment. */
export interface EvidenceAssessment {
  claimId: string;
  evidenceRecordId: string;
  assessment: AssessmentVerdict;
  strength: number; // 0..1
}

export type ContradictionSeverity = 'minor' | 'major' | 'critical';

export type ContradictionResolutionState = 'open' | 'reconciled' | 'resolved';

/** A surfaced contradiction between claims. */
export interface Contradiction extends Auditable {
  id: string;
  claimA: string;
  claimB: string;
  severity: ContradictionSeverity;
  resolutionState: ContradictionResolutionState;
}

export type RetractionStatus = 'proposed' | 'accepted' | 'rejected';

/** A recorded retraction of an evidence record, propagated through the web. */
export interface Retraction extends Auditable {
  id: string;
  evidenceRecordId: string;
  reason: string;
  status: RetractionStatus;
  affectedClaimIds: string[];
  effectiveAt: string;
}
