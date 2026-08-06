/**
 * CRIE peer review types (fspec §2.9).
 *
 * `PeerReview` with `PeerReviewComment`s and a `PeerReviewDecision`;
 * `ReviewCycle` is round-agnostic and references SWTROP review cycles
 * (CRIE Ch. 25, Ch. 55).
 */
import type { Auditable, ResearcherRef } from './base';

export type PeerReviewStatus = 'assigned' | 'in-progress' | 'submitted' | 'completed';

export type PeerReviewDecision =
  | 'approve'
  | 'accept'
  | 'minor-revision'
  | 'major-revision'
  | 'reject'
  | 'resubmit';

/** A peer review with decision and comments. */
export interface PeerReview extends Auditable {
  id: string;
  reviewer: ResearcherRef;
  documentId: string;
  status: PeerReviewStatus;
  decision?: PeerReviewDecision;
  overallAssessment: string;
}

export type PeerReviewCommentType = 'general' | 'inline' | 'summary' | 'reply';

/** A comment within a peer review. */
export interface PeerReviewComment extends Auditable {
  id: string;
  peerReviewId: string;
  parentCommentId?: string;
  commentType: PeerReviewCommentType;
  content: string;
  chunkId?: string;
}

/** A review cycle (round-agnostic; references SWTROP review cycles). */
export interface ReviewCycle extends Auditable {
  id: string;
  workflowReferenceId?: string;
  status: 'open' | 'closed';
  rounds: ReviewRound[];
}

/** A round within a review cycle. */
export interface ReviewRound extends Auditable {
  id: string;
  reviewCycleId: string;
  roundOrder: number;
  reviews: string[];
}
