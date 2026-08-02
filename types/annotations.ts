/**
 * Scholatia Annotation & Comment Engine — canonical types (Phase 2.2F ACSDE).
 *
 * The unified annotation, comment, and scholarly discussion engine. This is
 * the canonical commenting layer used throughout Scholatia: SAES, journal and
 * conference peer review, project and thesis supervision, editorial workflows,
 * grants, and future modules all consume this engine. It is NOT tied to SAES.
 *
 * An annotation targets a location inside a canonical source record
 * (`sourceEntity` + `sourceId`, plus granular chapter/section/paragraph/
 * sentence/figure/table/equation/citation/reference/dataset/attachment ids).
 * Document content is never duplicated — locations reference by ID and offset
 * only. Annotations carry a reviewer role, a review-decision lifecycle, an
 * optional discussion thread (unlimited depth), mentions, reactions, an
 * append-only resolution + history trail, and bookmarks. Voice review is
 * first-class through the comment engine (see types/comments.ts).
 */

/** The kinds of annotation the engine can express. */
export type AnnotationType =
  | 'inline'
  | 'paragraph'
  | 'sentence'
  | 'word'
  | 'chapter'
  | 'section'
  | 'figure'
  | 'table'
  | 'equation'
  | 'reference'
  | 'citation'
  | 'dataset'
  | 'attachment'
  | 'document'
  | 'general-note'
  | 'highlight'
  | 'sticky-note'
  | 'bookmark';

/** The platform roles an annotation may originate from. */
export type AnnotationRole =
  | 'author'
  | 'co-author'
  | 'supervisor'
  | 'co-supervisor'
  | 'reviewer'
  | 'associate-editor'
  | 'editor'
  | 'conference-reviewer'
  | 'conference-chair'
  | 'examiner'
  | 'external-examiner'
  | 'grant-reviewer'
  | 'collaborator'
  | 'institution-admin';

/** The lifecycle of an annotation. */
export type AnnotationStatus = 'open' | 'pending' | 'accepted' | 'rejected' | 'resolved' | 'archived';

/** The review-decision vocabulary applied to an annotation suggestion. */
export type AnnotationDecision =
  | 'accept-suggestion'
  | 'reject-suggestion'
  | 'accept-partially'
  | 'needs-discussion'
  | 'escalate';

/** The kind of comment an annotation carries. */
export type AnnotationCommentType =
  | 'normal'
  | 'suggested-correction'
  | 'required-correction'
  | 'question'
  | 'recommendation'
  | 'observation'
  | 'grammar'
  | 'language'
  | 'style'
  | 'citation-issue'
  | 'methodology-issue'
  | 'statistical-issue'
  | 'formatting-issue'
  | 'ethical-concern'
  | 'major-revision'
  | 'minor-revision'
  | 'approval-note';

/** The granular location target inside a source record. */
export type AnnotationLocationTarget =
  | 'document'
  | 'chapter'
  | 'section'
  | 'paragraph'
  | 'sentence'
  | 'word'
  | 'figure'
  | 'table'
  | 'equation'
  | 'citation'
  | 'reference'
  | 'dataset'
  | 'attachment';

/**
 * A precise, content-free location reference. Content is never duplicated —
 * only IDs and character offsets are stored.
 */
export interface AnnotationLocation {
  /** Canonical source module (e.g. `manuscript`, `journal`, `artefact`). */
  sourceEntity: string;
  /** Canonical source record id. */
  sourceId: string;
  /** Granular target within the source. */
  target: AnnotationLocationTarget;
  chapterId?: string;
  sectionId?: string;
  paragraphId?: string;
  sentenceId?: string;
  wordId?: string;
  figureId?: string;
  tableId?: string;
  equationId?: string;
  citationId?: string;
  referenceId?: string;
  datasetId?: string;
  attachmentId?: string;
  /** Start character offset within the target (never the content itself). */
  startOffset?: number;
  /** End character offset within the target (never the content itself). */
  endOffset?: number;
}

/** A `@mention` of a canonical researcher inside annotation/thread text. */
export interface AnnotationMention {
  username?: string;
  name: string;
  sourceEntity: 'researcher';
  sourceId: string;
}

/** A reaction (emoji) attached to an annotation, reply, or comment. */
export interface AnnotationReaction {
  id: string;
  emoji: string;
  actor: string;
  actorName: string;
  createdAt: string;
}

/** A reply in an annotation discussion thread (unlimited depth). */
export interface AnnotationThreadReply {
  id: string;
  annotationId: string;
  author: string;
  authorName: string;
  body: string;
  parentReplyId?: string;
  mentions: AnnotationMention[];
  reactions: AnnotationReaction[];
  createdAt: string;
}

/** A discussion thread attached to an annotation. */
export interface AnnotationThread {
  id: string;
  annotationId: string;
  status: 'open' | 'resolved' | 'archived';
  replies: AnnotationThreadReply[];
  createdAt: string;
}

/** An entry in the append-only annotation resolution trail. */
export interface AnnotationResolution {
  id: string;
  annotationId: string;
  decision: AnnotationDecision;
  resolvedBy: string;
  resolvedByName: string;
  comment?: string;
  at: string;
}

/** An entry in the append-only annotation history. */
export interface AnnotationHistoryEntry {
  id: string;
  annotationId: string;
  action: string;
  actor: string;
  actorName: string;
  fromStatus?: AnnotationStatus;
  toStatus: AnnotationStatus;
  comment?: string;
  at: string;
}

/** A bookmark flag on an annotation. */
export interface AnnotationBookmark {
  id: string;
  annotationId: string;
  user: string;
  userName: string;
  createdAt: string;
}

/**
 * A single annotation. Flattened `sourceEntity` + `sourceId` mirror the
 * canonical cross-module reference pattern; `location` carries the granular,
 * content-free position.
 */
export interface Annotation {
  id: string;
  /** Canonical source module (e.g. `manuscript`, `journal`, `artefact`). */
  sourceEntity: string;
  /** Canonical source record id. */
  sourceId: string;
  type: AnnotationType;
  commentType: AnnotationCommentType;
  role: AnnotationRole;
  status: AnnotationStatus;
  author: string;
  authorName: string;
  title?: string;
  body: string;
  /** Decision applied to a suggestion annotation. */
  decision?: AnnotationDecision;
  location: AnnotationLocation;
  thread: AnnotationThread;
  mentions: AnnotationMention[];
  reactions: AnnotationReaction[];
  resolutions: AnnotationResolution[];
  history: AnnotationHistoryEntry[];
  bookmarks: AnnotationBookmark[];
  reviewId?: string;
  workflowId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Derived view models
// ---------------------------------------------------------------------------

export interface AnnotationTypeStat {
  type: AnnotationType;
  count: number;
}

export interface AnnotationStatusStat {
  status: AnnotationStatus;
  count: number;
}

export interface AnnotationRoleStat {
  role: AnnotationRole;
  count: number;
}

export interface AnnotationStatistics {
  totalAnnotations: number;
  openAnnotations: number;
  pendingAnnotations: number;
  resolvedAnnotations: number;
  archivedAnnotations: number;
  totalThreadReplies: number;
  totalMentions: number;
  totalReactions: number;
  byType: AnnotationTypeStat[];
  byStatus: AnnotationStatusStat[];
  byRole: AnnotationRoleStat[];
}

export interface AnnotationAnalytics {
  byType: AnnotationTypeStat[];
  byStatus: AnnotationStatusStat[];
  byRole: AnnotationRoleStat[];
  bySource: { sourceEntity: string; sourceId: string; count: number }[];
  decisions: { decision: AnnotationDecision; count: number }[];
  voiceLinked: number;
  suggestionRate: number;
}

export type AnnotationSort = 'recent' | 'oldest' | 'status' | 'type' | 'role';

export interface AnnotationFilter {
  status?: AnnotationStatus;
  type?: AnnotationType;
  role?: AnnotationRole;
  sourceEntity?: string;
  mentionUsername?: string;
  bookmarked?: boolean;
  /** The user whose bookmark state is evaluated when `bookmarked` is set. */
  bookmarkedUser?: string;
  query?: string;
  sort?: AnnotationSort;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ANNOTATION_TYPES: readonly AnnotationType[] = [
  'inline',
  'paragraph',
  'sentence',
  'word',
  'chapter',
  'section',
  'figure',
  'table',
  'equation',
  'reference',
  'citation',
  'dataset',
  'attachment',
  'document',
  'general-note',
  'highlight',
  'sticky-note',
  'bookmark',
] as const;

export const ANNOTATION_TYPE_LABELS: Record<AnnotationType, string> = {
  inline: 'Inline',
  paragraph: 'Paragraph',
  sentence: 'Sentence',
  word: 'Word',
  chapter: 'Chapter',
  section: 'Section',
  figure: 'Figure',
  table: 'Table',
  equation: 'Equation',
  reference: 'Reference',
  citation: 'Citation',
  dataset: 'Dataset',
  attachment: 'Attachment',
  document: 'Document',
  'general-note': 'General Note',
  highlight: 'Highlight',
  'sticky-note': 'Sticky Note',
  bookmark: 'Bookmark',
};

export const ANNOTATION_TYPE_ICONS: Record<AnnotationType, string> = {
  inline: '📌',
  paragraph: '📄',
  sentence: '✍️',
  word: '🔤',
  chapter: '📖',
  section: '📑',
  figure: '🖼️',
  table: '📊',
  equation: '∑',
  reference: '🔖',
  citation: '💬',
  dataset: '🗄️',
  attachment: '📎',
  document: '📄',
  'general-note': '📝',
  highlight: '🖍️',
  'sticky-note': '📒',
  bookmark: '🔖',
};

export const ANNOTATION_ROLES: readonly AnnotationRole[] = [
  'author',
  'co-author',
  'supervisor',
  'co-supervisor',
  'reviewer',
  'associate-editor',
  'editor',
  'conference-reviewer',
  'conference-chair',
  'examiner',
  'external-examiner',
  'grant-reviewer',
  'collaborator',
  'institution-admin',
] as const;

export const ANNOTATION_ROLE_LABELS: Record<AnnotationRole, string> = {
  author: 'Author',
  'co-author': 'Co-author',
  supervisor: 'Supervisor',
  'co-supervisor': 'Co-supervisor',
  reviewer: 'Reviewer',
  'associate-editor': 'Associate Editor',
  editor: 'Editor',
  'conference-reviewer': 'Conference Reviewer',
  'conference-chair': 'Conference Chair',
  examiner: 'Examiner',
  'external-examiner': 'External Examiner',
  'grant-reviewer': 'Grant Reviewer',
  collaborator: 'Collaborator',
  'institution-admin': 'Institution Admin',
};

export const ANNOTATION_STATUSES: readonly AnnotationStatus[] = [
  'open',
  'pending',
  'accepted',
  'rejected',
  'resolved',
  'archived',
] as const;

export const ANNOTATION_STATUS_LABELS: Record<AnnotationStatus, string> = {
  open: 'Open',
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  resolved: 'Resolved',
  archived: 'Archived',
};

export const ANNOTATION_DECISIONS: readonly AnnotationDecision[] = [
  'accept-suggestion',
  'reject-suggestion',
  'accept-partially',
  'needs-discussion',
  'escalate',
] as const;

export const ANNOTATION_DECISION_LABELS: Record<AnnotationDecision, string> = {
  'accept-suggestion': 'Accept Suggestion',
  'reject-suggestion': 'Reject Suggestion',
  'accept-partially': 'Accept Partially',
  'needs-discussion': 'Needs Discussion',
  escalate: 'Escalate',
};

export const ANNOTATION_COMMENT_TYPES: readonly AnnotationCommentType[] = [
  'normal',
  'suggested-correction',
  'required-correction',
  'question',
  'recommendation',
  'observation',
  'grammar',
  'language',
  'style',
  'citation-issue',
  'methodology-issue',
  'statistical-issue',
  'formatting-issue',
  'ethical-concern',
  'major-revision',
  'minor-revision',
  'approval-note',
] as const;

export const ANNOTATION_COMMENT_TYPE_LABELS: Record<AnnotationCommentType, string> = {
  normal: 'Comment',
  'suggested-correction': 'Suggested Correction',
  'required-correction': 'Required Correction',
  question: 'Question',
  recommendation: 'Recommendation',
  observation: 'Observation',
  grammar: 'Grammar',
  language: 'Language',
  style: 'Style',
  'citation-issue': 'Citation Issue',
  'methodology-issue': 'Methodology Issue',
  'statistical-issue': 'Statistical Issue',
  'formatting-issue': 'Formatting Issue',
  'ethical-concern': 'Ethical Concern',
  'major-revision': 'Major Revision',
  'minor-revision': 'Minor Revision',
  'approval-note': 'Approval Note',
};

export const ANNOTATION_LOCATION_TARGETS: readonly AnnotationLocationTarget[] = [
  'document',
  'chapter',
  'section',
  'paragraph',
  'sentence',
  'word',
  'figure',
  'table',
  'equation',
  'citation',
  'reference',
  'dataset',
  'attachment',
] as const;

export const ANNOTATION_LOCATION_TARGET_LABELS: Record<AnnotationLocationTarget, string> = {
  document: 'Document',
  chapter: 'Chapter',
  section: 'Section',
  paragraph: 'Paragraph',
  sentence: 'Sentence',
  word: 'Word',
  figure: 'Figure',
  table: 'Table',
  equation: 'Equation',
  citation: 'Citation',
  reference: 'Reference',
  dataset: 'Dataset',
  attachment: 'Attachment',
};
