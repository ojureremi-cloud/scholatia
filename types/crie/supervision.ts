/**
 * CRIE supervision types (fspec §2.9).
 *
 * `SupervisionRecord` is a supervision portfolio record and
 * `SupervisionFeedback` feedback issued within supervision (CRIE Ch. 24).
 */
import type { Auditable, ResearcherRef } from './base';

export type SupervisionStatus = 'active' | 'paused' | 'completed' | 'withdrawn';

/** A supervision portfolio record. */
export interface SupervisionRecord extends Auditable {
  id: string;
  supervisor: ResearcherRef;
  researchEntityId: string;
  status: SupervisionStatus;
  startedAt: string;
  meetingsHeld: number;
}

export type SupervisionFeedbackType =
  | 'academic'
  | 'methodological'
  | 'writing'
  | 'progress'
  | 'pastoral';

/** Feedback issued within supervision. */
export interface SupervisionFeedback extends Auditable {
  id: string;
  supervisionRecordId: string;
  feedbackType: SupervisionFeedbackType;
  content: string;
  issuedBy: ResearcherRef;
  issuedAt: string;
}
