import type {
  JournalProfile,
  JournalSubmissionType,
  ReviewModel,
} from '@/types/identity';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Canonical research lifecycle stage ids that every manuscript in Scholatia
 * belongs to. Manuscripts span stages 8-10 of the lifecycle (Manuscript →
 * Submission → Peer Review), sitting between Analysis and Publication.
 */
export type ManuscriptLifecycleStageId =
  | 'manuscript'
  | 'submission'
  | 'peer-review';

export const MANUSCRIPT_LIFECYCLE_STAGE_IDS: readonly ManuscriptLifecycleStageId[] = [
  'manuscript',
  'submission',
  'peer-review',
] as const;

/** Stage id of the earliest lifecycle stage this module implements. */
export const MANUSCRIPT_STAGE_ID: ResearchLifecycleStageId = 'manuscript';

/**
 * Aggregate status of a manuscript across all lifecycle stages. The status
 * signals where the manuscript is in the process; `stageId` signals which
 * canonical lifecycle stage currently owns it.
 */
export type ManuscriptStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'major-revision'
  | 'minor-revision'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type ManuscriptAuthorRole =
  | 'first'
  | 'corresponding'
  | 'senior'
  | 'co-author';

export interface ManuscriptAuthor {
  id: string;
  name: string;
  said: string;
  orcid?: string;
  institution: string;
  role: ManuscriptAuthorRole;
}

export type ManuscriptVersionStatus =
  | 'draft'
  | 'submitted'
  | 'revised'
  | 'accepted'
  | 'superseded';

export interface ManuscriptVersion {
  id: string;
  version: string;
  createdAt: string;
  status: ManuscriptVersionStatus;
  filename: string;
  wordCount: number;
  pageCount: number;
  doi?: string;
  changes?: string;
}

export type SubmissionStageStatus =
  | 'submitted'
  | 'under-review'
  | 'major-revision'
  | 'minor-revision'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type ReviewRoundStatus = 'invited' | 'in-progress' | 'completed';

export type Recommendation =
  | 'accept'
  | 'minor-revision'
  | 'major-revision'
  | 'reject';

export interface ReviewerComment {
  id: string;
  /** Display name of the reviewer or an anonymous label. */
  reviewer: string;
  anonymous: boolean;
  recommendation: Recommendation;
  date: string;
  summary: string;
  details: string;
}

export interface ReviewRound {
  id: string;
  round: number;
  startedAt: string;
  completedAt?: string;
  status: ReviewRoundStatus;
  invitedReviewers: string[];
  completedReviews: string[];
  comments: ReviewerComment[];
}

export type EditorialDecisionType =
  | 'accept'
  | 'minor-revision'
  | 'major-revision'
  | 'reject'
  | 'withdraw';

export interface EditorialDecision {
  id: string;
  round: number;
  type: EditorialDecisionType;
  date: string;
  summary: string;
}

export interface ManuscriptSubmission {
  id: string;
  journalId: string;
  journalTitle: string;
  submissionType: JournalSubmissionType;
  reviewModel: ReviewModel;
  submittedAt: string;
  status: SubmissionStageStatus;
  manuscriptId?: string;
  rounds: ReviewRound[];
  decision?: EditorialDecision;
}

export interface TargetJournal {
  id: string;
  /** Reused journal domain object from the journals module. */
  journal: JournalProfile;
  fit: 'high' | 'medium' | 'low';
  status:
    | 'considered'
    | 'preparing'
    | 'submitted'
    | 'under-review'
    | 'in-revision'
    | 'accepted'
    | 'rejected'
    | 'withdrawn';
  submissionType: JournalSubmissionType;
}

export interface ManuscriptRevision {
  id: string;
  version: string;
  date: string;
  reason: string;
  summary: string;
  status: 'submitted' | 'in-progress' | 'completed';
}

export interface AuthorContribution {
  role: string;
  authors: string[];
}

export interface SubmissionChecklistItem {
  id: string;
  label: string;
  detail?: string;
  required: boolean;
  complete: boolean;
  note?: string;
}

export interface ManuscriptMetadata {
  abstract: string;
  keywords: string[];
  subjects: string[];
  language: string;
  wordCount: number;
  pageCount: number;
  figures: number;
  tables: number;
  references: number;
}

export interface ManuscriptRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

export interface ManuscriptRelationships {
  project?: ManuscriptRelationshipRef;
  datasets: ManuscriptRelationshipRef[];
  grants: ManuscriptRelationshipRef[];
  publications: ManuscriptRelationshipRef[];
  researchers: string[];
}

export interface PublicationReadinessCheck {
  label: string;
  complete: boolean;
  note?: string;
}

export interface PublicationReadiness {
  score: number;
  status: 'ready' | 'in-progress' | 'not-ready';
  checks: PublicationReadinessCheck[];
}

export interface PeerReviewSummary {
  reviewRounds: number;
  completedRounds: number;
  invitedReviewers: number;
  completedReviews: number;
  averageRecommendation: Recommendation;
  summary: string;
}

export interface ManuscriptStatistics {
  totalManuscripts: number;
  drafts: number;
  submitted: number;
  underReview: number;
  inRevision: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  avgReviewDays: number;
  lifecycleCompletionPercent: number;
}

export interface ManuscriptTimelineEntry {
  date: string;
  title: string;
  detail: string;
  type:
    | 'Draft'
    | 'Submission'
    | 'Review'
    | 'Decision'
    | 'Revision'
    | 'Acceptance'
    | 'Withdrawal';
}

export interface Manuscript {
  id: string;
  title: string;
  description: string;
  /** Canonical research lifecycle stage id (manuscript | submission | peer-review). */
  stageId: ManuscriptLifecycleStageId;
  status: ManuscriptStatus;
  correspondingAuthor: string;
  institution: string;
  createdAt: string;
  updatedAt?: string;
  doi?: string;
  preprintDoi?: string;
  authors: ManuscriptAuthor[];
  versions: ManuscriptVersion[];
  submissions: ManuscriptSubmission[];
  targetJournals: TargetJournal[];
  revisions: ManuscriptRevision[];
  contributions: AuthorContribution[];
  checklist: SubmissionChecklistItem[];
  metadata: ManuscriptMetadata;
  relationships: ManuscriptRelationships;
  readiness: PublicationReadiness;
  tags: string[];
}

export interface ManuscriptPeerReviewOverview {
  manuscripts: Manuscript[];
  summary: PeerReviewSummary;
}
