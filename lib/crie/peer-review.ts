/**
 * E-24 Peer Review Engine — Mission 004-D (Wave 2).
 *
 * Pure peer-review helpers over `PeerReview`, `PeerReviewComment`,
 * `ReviewCycle`, and `ReviewRound` (CRIE Ch. 25, Ch. 55). Review cycles are
 * round-agnostic and reference SWTROP review cycles.
 */
import type {
  PeerReview,
  PeerReviewComment,
  PeerReviewCommentType,
  PeerReviewDecision,
  PeerReviewStatus,
  ResearcherRef,
  ReviewCycle,
  ReviewRound,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export function peerReviewId(label: string): string {
  return `review-${slugOf(label)}`;
}

export interface PeerReviewInput {
  label: string;
  reviewer: ResearcherRef;
  documentId: string;
  overallAssessment: string;
  status?: PeerReviewStatus;
  decision?: PeerReviewDecision;
}

export function createPeerReview(input: PeerReviewInput): PeerReview {
  const now = nowIso();
  return {
    id: peerReviewId(input.label),
    reviewer: input.reviewer,
    documentId: input.documentId,
    status: input.status ?? 'assigned',
    decision: input.decision,
    overallAssessment: input.overallAssessment,
    createdAt: now,
    updatedAt: now,
  };
}

export interface PeerReviewCommentInput {
  label: string;
  peerReviewId: string;
  commentType: PeerReviewCommentType;
  content: string;
  parentCommentId?: string;
  chunkId?: string;
}

export function addComment(input: PeerReviewCommentInput): PeerReviewComment {
  const now = nowIso();
  return {
    id: `review-comment-${slugOf(input.label)}`,
    peerReviewId: input.peerReviewId,
    parentCommentId: input.parentCommentId,
    commentType: input.commentType,
    content: input.content,
    chunkId: input.chunkId,
    createdAt: now,
    updatedAt: now,
  };
}

export function createReviewCycle(label: string, workflowReferenceId?: string): ReviewCycle {
  const now = nowIso();
  return {
    id: `review-cycle-${slugOf(label)}`,
    workflowReferenceId,
    status: 'open',
    rounds: [],
    createdAt: now,
    updatedAt: now,
  };
}

export interface ReviewRoundInput {
  label: string;
  reviewCycleId: string;
  roundOrder: number;
  reviews: string[];
}

export function openRound(input: ReviewRoundInput): ReviewRound {
  const now = nowIso();
  return {
    id: `review-round-${slugOf(input.label)}`,
    reviewCycleId: input.reviewCycleId,
    roundOrder: input.roundOrder,
    reviews: input.reviews,
    createdAt: now,
    updatedAt: now,
  };
}

export interface PeerReviewStatistics {
  reviews: number;
  submitted: number;
  completed: number;
  rounds: number;
}

export function peerReviewStatistics(
  reviews: readonly PeerReview[],
  cycles: readonly ReviewCycle[] = [],
): PeerReviewStatistics {
  const submitted = reviews.filter((review) => review.status === 'submitted').length;
  const completed = reviews.filter((review) => review.status === 'completed').length;
  const rounds = cycles.reduce((sum, cycle) => sum + cycle.rounds.length, 0);
  return { reviews: reviews.length, submitted, completed, rounds };
}
