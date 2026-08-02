/**
 * Scholatia Review & Approval Engine — canonical types (Phase 2.2E SWTROP).
 *
 * A universal, round-agnostic review cycle powers every review on the
 * platform — peer review, editorial review, supervisory review, examination,
 * ethics review, grant review, and approval. Review cycles never assume a
 * fixed number of rounds: any cycle may iterate indefinitely until the artefact
 * or workflow is approved. Voice review (typed comments, voice comments,
 * speech-to-text, optional original-audio retention, inline annotations, voice
 * replies, voice discussions) and approvals with an append-only decision
 * history are part of this engine.
 */

/** The kinds of review the engine can express. */
export type ReviewKind =
  | 'peer-review'
  | 'editorial'
  | 'supervisory'
  | 'examination'
  | 'ethics'
  | 'grant'
  | 'approval'
  | 'voice'
  | 'institutional';

/** The universal review decision vocabulary. */
export type ReviewDecision =
  | 'approve'
  | 'reject'
  | 'minor-revision'
  | 'major-revision'
  | 'escalate'
  | 'delegate'
  | 'return'
  | 'withdraw'
  | 'reopen'
  | 'close';

/** The lifecycle of a single review. */
export type ReviewStatus = 'draft' | 'invited' | 'accepted' | 'in-progress' | 'submitted' | 'completed' | 'cancelled';

/** The kinds of comment inside a review. */
export type ReviewCommentType = 'general' | 'summary' | 'inline' | 'reply' | 'voice';

/** The lifecycle of a voice note. */
export type VoiceNoteStatus = 'recorded' | 'transcribed' | 'failed';

/** A comment inside a review — typed, inline, or a reply. */
export interface ReviewComment {
  id: string;
  reviewId: string;
  author: string;
  authorName: string;
  type: ReviewCommentType;
  body?: string;
  voiceTranscript?: string;
  voiceAudioUrl?: string;
  inlineAnchor?: string;
  parentCommentId?: string;
  createdAt: string;
}

/** A recorded voice note, optionally retained as original audio. */
export interface ReviewVoiceNote {
  id: string;
  reviewId: string;
  author: string;
  authorName: string;
  transcript: string;
  audioUrl?: string;
  durationSeconds?: number;
  status: VoiceNoteStatus;
  sourceId?: string;
  sourceEntity?: string;
  createdAt: string;
}

/** A single review inside a review cycle. */
export interface Review {
  id: string;
  cycleId: string;
  workflowId?: string;
  artefactId?: string;
  kind: ReviewKind;
  status: ReviewStatus;
  round: number;
  title?: string;
  description?: string;
  reviewer: string;
  reviewerName: string;
  decision?: ReviewDecision;
  comments: ReviewComment[];
  voiceNotes: ReviewVoiceNote[];
  sourceId?: string;
  sourceEntity?: string;
  dueAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** The lifecycle of a review cycle. */
export type ReviewCycleStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

/**
 * A universal review cycle. Round is unbounded: `round 1, 2, 3 ... n` until
 * the cycle completes. Never assume a fixed Review 1/2/3.
 */
export interface ReviewCycle {
  id: string;
  workflowId?: string;
  artefactId?: string;
  sourceId?: string;
  sourceEntity?: string;
  round: number;
  status: ReviewCycleStatus;
  reviews: Review[];
  requestedBy?: string;
  requestedByName?: string;
  openedAt: string;
  closedAt?: string;
}

/** The kinds of approval the engine can express. */
export type ApprovalKind =
  | 'topic-approval'
  | 'proposal-approval'
  | 'chapter-approval'
  | 'section-approval'
  | 'milestone-approval'
  | 'final-approval'
  | 'ethics-approval'
  | 'grant-approval'
  | 'submission-approval'
  | 'publication-approval'
  | 'institutional-approval'
  | 'general-approval';

/** The universal approval action vocabulary. */
export type ApprovalAction =
  | 'approve'
  | 'reject'
  | 'minor-revision'
  | 'major-revision'
  | 'escalate'
  | 'delegate'
  | 'return'
  | 'withdraw'
  | 'reopen'
  | 'close';

/** The lifecycle of an approval. */
export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'minor-revision'
  | 'major-revision'
  | 'escalated'
  | 'delegated'
  | 'returned'
  | 'withdrawn'
  | 'reopened'
  | 'closed';

/** A decision request on a workflow, artefact, or source record. */
export interface Approval {
  id: string;
  workflowId?: string;
  sourceId?: string;
  sourceEntity?: string;
  kind: ApprovalKind;
  status: ApprovalStatus;
  title: string;
  description?: string;
  approver: string;
  approverName: string;
  approverRole?: string;
  requestedBy?: string;
  requestedByName?: string;
  comment?: string;
  decidedAt?: string;
  createdAt: string;
  updatedAt: string;
  history?: ApprovalHistoryEntry[];
}

/** An entry in the append-only approval decision history. */
export interface ApprovalHistoryEntry {
  id: string;
  approvalId: string;
  action: ApprovalAction;
  actor: string;
  actorName: string;
  comment?: string;
  fromStatus?: ApprovalStatus;
  toStatus: ApprovalStatus;
  at: string;
}

// ---------------------------------------------------------------------------
// Derived view models
// ---------------------------------------------------------------------------

export interface ReviewKindStat {
  kind: ReviewKind;
  count: number;
}

export interface ReviewDecisionStat {
  decision: ReviewDecision;
  count: number;
}

export interface ReviewStatistics {
  totalReviews: number;
  completedReviews: number;
  inProgressReviews: number;
  invitedReviews: number;
  approvalRate: number;
  revisionRate: number;
  byKind: ReviewKindStat[];
  averageRounds: number;
}

export interface ReviewAnalytics {
  byKind: ReviewKindStat[];
  decisions: ReviewDecisionStat[];
  roundsDistribution: { round: number; count: number }[];
  approvals: { total: number; pending: number; approved: number; rejected: number; escalated: number };
  voiceNotes: number;
  totalComments: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const REVIEW_KINDS: readonly ReviewKind[] = [
  'peer-review',
  'editorial',
  'supervisory',
  'examination',
  'ethics',
  'grant',
  'approval',
  'voice',
  'institutional',
] as const;

export const REVIEW_KIND_LABELS: Record<ReviewKind, string> = {
  'peer-review': 'Peer Review',
  editorial: 'Editorial Review',
  supervisory: 'Supervisory Review',
  examination: 'Examination',
  ethics: 'Ethics Review',
  grant: 'Grant Review',
  approval: 'Approval Review',
  voice: 'Voice Review',
  institutional: 'Institutional Review',
};

export const REVIEW_KIND_ICONS: Record<ReviewKind, string> = {
  'peer-review': '🔬',
  editorial: '📝',
  supervisory: '🧑‍🏫',
  examination: '⚖️',
  ethics: '🛡️',
  grant: '💼',
  approval: '🖊️',
  voice: '🎙️',
  institutional: '🏛️',
};

export const REVIEW_DECISIONS: readonly ReviewDecision[] = [
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
] as const;

export const REVIEW_DECISION_LABELS: Record<ReviewDecision, string> = {
  approve: 'Approve',
  reject: 'Reject',
  'minor-revision': 'Minor Revision',
  'major-revision': 'Major Revision',
  escalate: 'Escalate',
  delegate: 'Delegate',
  return: 'Return',
  withdraw: 'Withdraw',
  reopen: 'Reopen',
  close: 'Close',
};

export const REVIEW_STATUSES: readonly ReviewStatus[] = [
  'draft',
  'invited',
  'accepted',
  'in-progress',
  'submitted',
  'completed',
  'cancelled',
] as const;

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: 'Draft',
  invited: 'Invited',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  submitted: 'Submitted',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const REVIEW_COMMENT_TYPES: readonly ReviewCommentType[] = [
  'general',
  'summary',
  'inline',
  'reply',
  'voice',
] as const;

export const REVIEW_COMMENT_TYPE_LABELS: Record<ReviewCommentType, string> = {
  general: 'General',
  summary: 'Summary',
  inline: 'Inline',
  reply: 'Reply',
  voice: 'Voice',
};

export const VOICE_NOTE_STATUSES: readonly VoiceNoteStatus[] = ['recorded', 'transcribed', 'failed'] as const;

export const REVIEW_CYCLE_STATUSES: readonly ReviewCycleStatus[] = [
  'open',
  'in-progress',
  'completed',
  'cancelled',
] as const;

export const APPROVAL_KINDS: readonly ApprovalKind[] = [
  'topic-approval',
  'proposal-approval',
  'chapter-approval',
  'section-approval',
  'milestone-approval',
  'final-approval',
  'ethics-approval',
  'grant-approval',
  'submission-approval',
  'publication-approval',
  'institutional-approval',
  'general-approval',
] as const;

export const APPROVAL_KIND_LABELS: Record<ApprovalKind, string> = {
  'topic-approval': 'Topic Approval',
  'proposal-approval': 'Proposal Approval',
  'chapter-approval': 'Chapter Approval',
  'section-approval': 'Section Approval',
  'milestone-approval': 'Milestone Approval',
  'final-approval': 'Final Approval',
  'ethics-approval': 'Ethics Approval',
  'grant-approval': 'Grant Approval',
  'submission-approval': 'Submission Approval',
  'publication-approval': 'Publication Approval',
  'institutional-approval': 'Institutional Approval',
  'general-approval': 'General Approval',
};

export const APPROVAL_ACTIONS: readonly ApprovalAction[] = [
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
] as const;

export const APPROVAL_ACTION_LABELS: Record<ApprovalAction, string> = {
  approve: 'Approve',
  reject: 'Reject',
  'minor-revision': 'Minor Revision',
  'major-revision': 'Major Revision',
  escalate: 'Escalate',
  delegate: 'Delegate',
  return: 'Return',
  withdraw: 'Withdraw',
  reopen: 'Reopen',
  close: 'Close',
};

export const APPROVAL_STATUSES: readonly ApprovalStatus[] = [
  'pending',
  'approved',
  'rejected',
  'minor-revision',
  'major-revision',
  'escalated',
  'delegated',
  'returned',
  'withdrawn',
  'reopened',
  'closed',
] as const;

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  'minor-revision': 'Minor Revision',
  'major-revision': 'Major Revision',
  escalated: 'Escalated',
  delegated: 'Delegated',
  returned: 'Returned',
  withdrawn: 'Withdrawn',
  reopened: 'Reopened',
  closed: 'Closed',
};

export const APPROVAL_STATUS_ICONS: Record<ApprovalStatus, string> = {
  pending: '⏳',
  approved: '✅',
  rejected: '🚫',
  'minor-revision': '🔁',
  'major-revision': '🔁',
  escalated: '🚨',
  delegated: '🧑‍💼',
  returned: '↩️',
  withdrawn: '✖️',
  reopened: '🔃',
  closed: '🔒',
};
