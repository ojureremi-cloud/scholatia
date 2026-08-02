import type {
  Approval,
  ApprovalAction,
  ApprovalHistoryEntry,
  ApprovalKind,
  ApprovalStatus,
  Review,
  ReviewAnalytics,
  ReviewComment,
  ReviewCommentType,
  ReviewCycle,
  ReviewDecision,
  ReviewKind,
  ReviewStatistics,
  ReviewStatus,
  ReviewVoiceNote,
  VoiceNoteStatus,
} from '@/types/reviews';

/**
 * Scholatia Review & Approval Engine (Phase 2.2E SWTROP).
 *
 * The pure review and approval engine — no React, no side effects, no API
 * calls. Review cycles are universal and round-agnostic: any cycle iterates
 * until the artefact or workflow is approved, never assuming a fixed
 * Review 1/2/3. Voice review (typed + voice comments, speech-to-text, optional
 * original-audio retention, inline annotations, voice replies) and approvals
 * with an append-only decision history are part of this engine. Everything
 * reviewed is referenced through `sourceId` + `sourceEntity`.
 */

// ---------------------------------------------------------------------------
// IDs
// ---------------------------------------------------------------------------

function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Canonical review id prefix. */
export function reviewId(label: string): string {
  return `rv-${slugOf(label)}`;
}

/** Canonical review cycle id prefix. */
export function reviewCycleId(label: string): string {
  return `rvc-${slugOf(label)}`;
}

/** Canonical review comment id prefix. */
export function reviewCommentId(label: string): string {
  return `rvcx-${slugOf(label)}`;
}

/** Canonical review voice note id prefix. */
export function reviewVoiceNoteId(label: string): string {
  return `rvv-${slugOf(label)}`;
}

/** Canonical approval id prefix. */
export function approvalId(label: string): string {
  return `apr-${slugOf(label)}`;
}

/** Canonical approval history id prefix. */
export function approvalHistoryId(label: string): string {
  return `aprh-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Review cycles
// ---------------------------------------------------------------------------

/** Open a new review cycle at a given round. */
export function createReviewCycle(input: {
  round: number;
  workflowId?: string;
  artefactId?: string;
  sourceId?: string;
  sourceEntity?: string;
  requestedBy?: string;
  requestedByName?: string;
  openedAt?: string;
}): ReviewCycle {
  return {
    id: reviewCycleId(`${input.workflowId ?? input.artefactId ?? input.sourceId ?? 'cycle'}-r${input.round}`),
    workflowId: input.workflowId,
    artefactId: input.artefactId,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    round: input.round,
    status: 'open',
    reviews: [],
    requestedBy: input.requestedBy,
    requestedByName: input.requestedByName,
    openedAt: input.openedAt ?? new Date().toISOString(),
  };
}

/** Advance a cycle to its next round, preserving history. */
export function advanceReviewCycle(cycle: ReviewCycle, openedAt?: string): ReviewCycle {
  return {
    ...cycle,
    id: reviewCycleId(`${cycle.id}-r${cycle.round + 1}`),
    round: cycle.round + 1,
    status: 'open',
    reviews: [],
    closedAt: undefined,
    openedAt: openedAt ?? new Date().toISOString(),
  };
}

/** Complete a cycle. */
export function completeReviewCycle(cycle: ReviewCycle, closedAt?: string): ReviewCycle {
  return { ...cycle, status: 'completed', closedAt: closedAt ?? new Date().toISOString() };
}

/** Cancel a cycle. */
export function cancelReviewCycle(cycle: ReviewCycle, closedAt?: string): ReviewCycle {
  return { ...cycle, status: 'cancelled', closedAt: closedAt ?? new Date().toISOString() };
}

/** Open the next round when the current round requires revision. */
export function openNextReviewRound(cycle: ReviewCycle, openedAt?: string): ReviewCycle {
  return advanceReviewCycle(cycle, openedAt);
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

/** Create a review inside a cycle. */
export function createReview(input: {
  cycle: ReviewCycle;
  reviewer: string;
  reviewerName: string;
  kind?: ReviewKind;
  title?: string;
  description?: string;
  dueAt?: string;
  sourceId?: string;
  sourceEntity?: string;
}): { cycle: ReviewCycle; review: Review } {
  const review: Review = {
    id: reviewId(`${input.cycle.id}-${input.reviewer}-${input.cycle.round}`),
    cycleId: input.cycle.id,
    workflowId: input.cycle.workflowId,
    artefactId: input.cycle.artefactId,
    kind: input.kind ?? 'peer-review',
    status: 'invited',
    round: input.cycle.round,
    title: input.title,
    description: input.description,
    reviewer: input.reviewer,
    reviewerName: input.reviewerName,
    comments: [],
    voiceNotes: [],
    sourceId: input.sourceId ?? input.cycle.sourceId,
    sourceEntity: input.sourceEntity ?? input.cycle.sourceEntity,
    dueAt: input.dueAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return { cycle: { ...input.cycle, reviews: [...input.cycle.reviews, review] }, review };
}

/** Update the lifecycle status of a review. */
export function setReviewStatus(review: Review, status: ReviewStatus, now?: string): Review {
  return {
    ...review,
    status,
    updatedAt: now ?? new Date().toISOString(),
    submittedAt: status === 'submitted' || status === 'completed' ? review.submittedAt ?? now ?? new Date().toISOString() : review.submittedAt,
  };
}

/** Submit a review with a decision. */
export function submitReview(input: {
  review: Review;
  decision: ReviewDecision;
  comments?: Omit<ReviewComment, 'id' | 'reviewId' | 'createdAt'>[];
  now?: string;
}): Review {
  const now = input.now ?? new Date().toISOString();
  return {
    ...input.review,
    status: 'completed',
    decision: input.decision,
    comments: [
      ...input.review.comments,
      ...(input.comments ?? []).map((comment, index) => ({
        ...comment,
        id: reviewCommentId(`${input.review.id}-${index + 1}`),
        reviewId: input.review.id,
        createdAt: now,
      })),
    ],
    submittedAt: now,
    updatedAt: now,
  };
}

/** Add a comment to a review. */
export function addReviewComment(input: {
  review: Review;
  author: string;
  authorName: string;
  type: ReviewCommentType;
  body?: string;
  voiceTranscript?: string;
  voiceAudioUrl?: string;
  inlineAnchor?: string;
  parentCommentId?: string;
  now?: string;
}): Review {
  const now = input.now ?? new Date().toISOString();
  const comment: ReviewComment = {
    id: reviewCommentId(`${input.review.id}-${input.review.comments.length + 1}`),
    reviewId: input.review.id,
    author: input.author,
    authorName: input.authorName,
    type: input.type,
    body: input.body,
    voiceTranscript: input.voiceTranscript,
    voiceAudioUrl: input.voiceAudioUrl,
    inlineAnchor: input.inlineAnchor,
    parentCommentId: input.parentCommentId,
    createdAt: now,
  };
  return { ...input.review, comments: [...input.review.comments, comment], updatedAt: now };
}

// ---------------------------------------------------------------------------
// Voice review
// ---------------------------------------------------------------------------

/** Attach a voice note (transcript + optional retained audio) to a review. */
export function addReviewVoiceNote(input: {
  review: Review;
  author: string;
  authorName: string;
  transcript: string;
  audioUrl?: string;
  durationSeconds?: number;
  status?: VoiceNoteStatus;
  sourceId?: string;
  sourceEntity?: string;
  now?: string;
}): Review {
  const now = input.now ?? new Date().toISOString();
  const voiceNote: ReviewVoiceNote = {
    id: reviewVoiceNoteId(`${input.review.id}-${input.review.voiceNotes.length + 1}`),
    reviewId: input.review.id,
    author: input.author,
    authorName: input.authorName,
    transcript: input.transcript,
    audioUrl: input.audioUrl,
    durationSeconds: input.durationSeconds,
    status: input.status ?? 'transcribed',
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    createdAt: now,
  };
  return {
    ...input.review,
    voiceNotes: [...input.review.voiceNotes, voiceNote],
    comments: [
      ...input.review.comments,
      {
        id: reviewCommentId(`${input.review.id}-voice-${input.review.voiceNotes.length + 1}`),
        reviewId: input.review.id,
        author: input.author,
        authorName: input.authorName,
        type: 'voice',
        body: input.transcript,
        voiceTranscript: input.transcript,
        voiceAudioUrl: input.audioUrl,
        createdAt: now,
      },
    ],
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Approval engine
// ---------------------------------------------------------------------------

/** Create an approval request. */
export function createApproval(input: {
  kind: ApprovalKind;
  title: string;
  description?: string;
  approver: string;
  approverName: string;
  approverRole?: string;
  requestedBy?: string;
  requestedByName?: string;
  workflowId?: string;
  sourceId?: string;
  sourceEntity?: string;
  createdAt?: string;
}): Approval {
  return {
    id: approvalId(input.title),
    workflowId: input.workflowId,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    kind: input.kind,
    status: 'pending',
    title: input.title,
    description: input.description,
    approver: input.approver,
    approverName: input.approverName,
    approverRole: input.approverRole,
    requestedBy: input.requestedBy,
    requestedByName: input.requestedByName,
    createdAt: input.createdAt ?? new Date().toISOString(),
    updatedAt: input.createdAt ?? new Date().toISOString(),
  };
}

const ACTION_STATUS: Record<ApprovalAction, ApprovalStatus> = {
  approve: 'approved',
  reject: 'rejected',
  'minor-revision': 'minor-revision',
  'major-revision': 'major-revision',
  escalate: 'escalated',
  delegate: 'delegated',
  return: 'returned',
  withdraw: 'withdrawn',
  reopen: 'reopened',
  close: 'closed',
};

/** Apply an approval action, appending the decision history. */
export function applyApprovalAction(input: {
  approval: Approval;
  action: ApprovalAction;
  actor: string;
  actorName: string;
  comment?: string;
  now?: string;
}): { approval: Approval; history: ApprovalHistoryEntry[] } {
  const now = input.now ?? new Date().toISOString();
  const toStatus = ACTION_STATUS[input.action];
  const historyEntry: ApprovalHistoryEntry = {
    id: approvalHistoryId(`${input.approval.id}-${input.approval.history?.length ?? 0 + 1}`),
    approvalId: input.approval.id,
    action: input.action,
    actor: input.actor,
    actorName: input.actorName,
    comment: input.comment,
    fromStatus: input.approval.status,
    toStatus,
    at: now,
  };
  const history = [...(input.approval.history ?? []), historyEntry];
  return {
    approval: {
      ...input.approval,
      status: toStatus,
      comment: input.comment ?? input.approval.comment,
      decidedAt: toStatus === 'approved' || toStatus === 'rejected' ? now : input.approval.decidedAt,
      updatedAt: now,
      history,
    },
    history,
  };
}

/** Convenience approval actions. */
export const approveApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment?: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'approve', actor, actorName, comment, now });

export const rejectApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'reject', actor, actorName, comment, now });

export const requestApprovalMinorRevision = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'minor-revision', actor, actorName, comment, now });

export const requestApprovalMajorRevision = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'major-revision', actor, actorName, comment, now });

export const escalateApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'escalate', actor, actorName, comment, now });

export const delegateApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment?: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'delegate', actor, actorName, comment, now });

export const returnApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment?: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'return', actor, actorName, comment, now });

export const withdrawApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment?: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'withdraw', actor, actorName, comment, now });

export const reopenApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment?: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'reopen', actor, actorName, comment, now });

export const closeApproval = (
  approval: Approval,
  actor: string,
  actorName: string,
  comment?: string,
  now?: string,
): { approval: Approval; history: ApprovalHistoryEntry[] } =>
  applyApprovalAction({ approval, action: 'close', actor, actorName, comment, now });

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

/** Derive review statistics. */
export function reviewStatistics(cycles: ReviewCycle[]): ReviewStatistics {
  const reviews = cycles.flatMap((cycle) => cycle.reviews);
  const completed = reviews.filter((review) => review.status === 'completed').length;
  const inProgress = reviews.filter((review) => review.status === 'in-progress').length;
  const invited = reviews.filter((review) => review.status === 'invited').length;
  const byKind: ReviewStatistics['byKind'] = REVIEW_KINDS.map((kind) => ({
    kind,
    count: reviews.filter((review) => review.kind === kind).length,
  })).filter((stat) => stat.count > 0);
  const decisions = reviews
    .map((review) => review.decision)
    .filter((decision): decision is ReviewDecision => decision !== undefined);
  const approved = decisions.filter((decision) => decision === 'approve').length;
  const revisions = decisions.filter(
    (decision) => decision === 'minor-revision' || decision === 'major-revision',
  ).length;
  return {
    totalReviews: reviews.length,
    completedReviews: completed,
    inProgressReviews: inProgress,
    invitedReviews: invited,
    approvalRate: decisions.length === 0 ? 0 : Math.round((approved / decisions.length) * 100),
    revisionRate: decisions.length === 0 ? 0 : Math.round((revisions / decisions.length) * 100),
    byKind,
    averageRounds: cycles.length === 0 ? 0 : Math.round((cycles.reduce((total, cycle) => total + cycle.round, 0) / cycles.length) * 10) / 10,
  };
}

/** Derive review analytics. */
export function reviewAnalytics(cycles: ReviewCycle[], approvals: Approval[]): ReviewAnalytics {
  const reviews = cycles.flatMap((cycle) => cycle.reviews);
  const decisions: ReviewAnalytics['decisions'] = REVIEW_DECISIONS.map((decision) => ({
    decision,
    count: reviews.filter((review) => review.decision === decision).length,
  })).filter((stat) => stat.count > 0);
  const roundsDistribution: ReviewAnalytics['roundsDistribution'] = [];
  cycles.forEach((cycle) => {
    const existing = roundsDistribution.find((entry) => entry.round === cycle.round);
    if (existing) {
      existing.count += 1;
    } else {
      roundsDistribution.push({ round: cycle.round, count: 1 });
    }
  });
  return {
    byKind: reviewStatistics(cycles).byKind,
    decisions,
    roundsDistribution: roundsDistribution.sort((a, b) => a.round - b.round),
    approvals: {
      total: approvals.length,
      pending: approvals.filter((approval) => approval.status === 'pending').length,
      approved: approvals.filter((approval) => approval.status === 'approved').length,
      rejected: approvals.filter((approval) => approval.status === 'rejected').length,
      escalated: approvals.filter((approval) => approval.status === 'escalated').length,
    },
    voiceNotes: reviews.reduce((total, review) => total + review.voiceNotes.length, 0),
    totalComments: reviews.reduce((total, review) => total + review.comments.length, 0),
  };
}

const REVIEW_KINDS: readonly ReviewKind[] = [
  'peer-review',
  'editorial',
  'supervisory',
  'examination',
  'ethics',
  'grant',
  'approval',
  'voice',
  'institutional',
];
const REVIEW_DECISIONS: readonly ReviewDecision[] = [
  'approve',
  'reject',
  'minor-revision',
  'major-revision',
  'escalate',
  'delegate',
  'return',
  'withdraw',
  'reopen',
  'close',
];
