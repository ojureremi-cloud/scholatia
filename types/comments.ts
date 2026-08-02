/**
 * Scholatia Comment, Thread & Voice Engine — canonical types (Phase 2.2F ACSDE).
 *
 * The generic discussion layer of the platform. A `CommentThread` attaches to
 * any canonical source (`sourceEntity` + `sourceId`) — a manuscript, an
 * artefact, a review, a workflow, a dataset — and carries comments with
 * unlimited-depth nested replies. Mentions and reactions are shared with the
 * annotation engine (imported from types/annotations.ts). Voice review is
 * native: `VoiceComment` records carry retained audio, an editable/regenerated
 * transcript, AI summary, searchable transcript, timestamps, and language
 * metadata, and a reviewer chooses their delivery mode (audio only, transcript
 * only, audio + transcript, or AI transcription).
 */

import type {
  AnnotationMention,
  AnnotationReaction,
  AnnotationType,
} from '@/types/annotations';

/** The lifecycle of a discussion thread. */
export type ThreadStatus = 'open' | 'resolved' | 'archived';

/** How a voice comment is delivered. */
export type VoiceCommentMode =
  | 'audio-only'
  | 'transcript-only'
  | 'audio-and-transcript'
  | 'ai-transcription';

/** The lifecycle of a voice comment. */
export type VoiceCommentStatus =
  | 'recorded'
  | 'transcribing'
  | 'transcribed'
  | 'edited'
  | 'regenerated'
  | 'failed';

/** Capabilities exposed by the transcription abstraction layer. */
export interface TranscriptionCapabilities {
  speechToText: boolean;
  punctuation: boolean;
  speakerIdentification: boolean;
  confidence: boolean;
  editableTranscript: boolean;
  regeneratedTranscript: boolean;
}

/** An abstract transcription provider (no external API is integrated). */
export interface TranscriptionProvider {
  id: string;
  name: string;
  languages: string[];
  capabilities: TranscriptionCapabilities;
}

/** A single timed segment of a transcript (searchable). */
export interface TranscriptTimestamp {
  startSeconds: number;
  endSeconds: number;
  text: string;
  speakerId?: string;
}

/** The transcript of a voice comment. */
export interface VoiceTranscript {
  id: string;
  voiceCommentId: string;
  text: string;
  language: string;
  confidence: number;
  speakerId?: string;
  providerId?: string;
  timestamps: TranscriptTimestamp[];
  createdAt: string;
  updatedAt: string;
}

/** A recorded voice comment, optionally retaining original audio. */
export interface VoiceComment {
  id: string;
  sourceEntity: string;
  sourceId: string;
  commentThreadId?: string;
  annotationId?: string;
  author: string;
  authorName: string;
  mode: VoiceCommentMode;
  status: VoiceCommentStatus;
  /** Retained original audio (never required — the engine is audio-optional). */
  audioUrl?: string;
  durationSeconds?: number;
  language: string;
  transcript?: VoiceTranscript;
  aiSummary?: string;
  mentions: AnnotationMention[];
  reactions: AnnotationReaction[];
  createdAt: string;
  updatedAt: string;
}

/** A nested reply inside a comment thread (unlimited depth). */
export interface CommentReply {
  id: string;
  threadId: string;
  parentReplyId?: string;
  author: string;
  authorName: string;
  body: string;
  mentions: AnnotationMention[];
  reactions: AnnotationReaction[];
  createdAt: string;
}

/** A comment attached to a canonical source record. */
export interface Comment {
  id: string;
  threadId: string;
  author: string;
  authorName: string;
  body: string;
  annotationId?: string;
  mentions: AnnotationMention[];
  reactions: AnnotationReaction[];
  createdAt: string;
  updatedAt: string;
}

/** A discussion thread attached to any canonical source. */
export interface CommentThread {
  id: string;
  sourceEntity: string;
  sourceId: string;
  title?: string;
  kind: 'discussion' | 'review-discussion' | 'editorial-discussion' | 'supervision-discussion';
  status: ThreadStatus;
  comments: Comment[];
  replies: CommentReply[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Derived view models
// ---------------------------------------------------------------------------

export interface CommentThreadStatusStat {
  status: ThreadStatus;
  count: number;
}

export interface CommentThreadKindStat {
  kind: CommentThread['kind'];
  count: number;
}

export interface CommentStatistics {
  totalThreads: number;
  openThreads: number;
  resolvedThreads: number;
  archivedThreads: number;
  totalComments: number;
  totalReplies: number;
  totalVoiceComments: number;
  totalMentions: number;
  totalReactions: number;
  byStatus: CommentThreadStatusStat[];
  byKind: CommentThreadKindStat[];
}

export interface CommentAnalytics {
  byKind: CommentThreadKindStat[];
  byStatus: CommentThreadStatusStat[];
  bySource: { sourceEntity: string; sourceId: string; count: number }[];
  voiceModes: { mode: VoiceCommentMode; count: number }[];
  voiceByStatus: { status: VoiceCommentStatus; count: number }[];
  averageDepth: number;
  averageVoiceDuration: number;
}

export type ThreadSort = 'recent' | 'oldest' | 'status' | 'replies';

export interface ThreadFilter {
  status?: ThreadStatus;
  kind?: CommentThread['kind'];
  sourceEntity?: string;
  query?: string;
  sort?: ThreadSort;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const THREAD_STATUSES: readonly ThreadStatus[] = ['open', 'resolved', 'archived'] as const;

export const THREAD_STATUS_LABELS: Record<ThreadStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  archived: 'Archived',
};

export const THREAD_KINDS: readonly CommentThread['kind'][] = [
  'discussion',
  'review-discussion',
  'editorial-discussion',
  'supervision-discussion',
] as const;

export const THREAD_KIND_LABELS: Record<CommentThread['kind'], string> = {
  discussion: 'Discussion',
  'review-discussion': 'Review Discussion',
  'editorial-discussion': 'Editorial Discussion',
  'supervision-discussion': 'Supervision Discussion',
};

export const VOICE_COMMENT_MODES: readonly VoiceCommentMode[] = [
  'audio-only',
  'transcript-only',
  'audio-and-transcript',
  'ai-transcription',
] as const;

export const VOICE_COMMENT_MODE_LABELS: Record<VoiceCommentMode, string> = {
  'audio-only': 'Audio Only',
  'transcript-only': 'Transcript Only',
  'audio-and-transcript': 'Audio + Transcript',
  'ai-transcription': 'AI Transcription',
};

export const VOICE_COMMENT_STATUSES: readonly VoiceCommentStatus[] = [
  'recorded',
  'transcribing',
  'transcribed',
  'edited',
  'regenerated',
  'failed',
] as const;

export const VOICE_COMMENT_STATUS_LABELS: Record<VoiceCommentStatus, string> = {
  recorded: 'Recorded',
  transcribing: 'Transcribing',
  transcribed: 'Transcribed',
  edited: 'Edited',
  regenerated: 'Regenerated',
  failed: 'Failed',
};

/** The default transcription provider offered by the abstraction layer. */
export const DEFAULT_TRANSCRIPTION_PROVIDER: TranscriptionProvider = {
  id: 'scholatia-transcription',
  name: 'Scholatia Speech-to-Text',
  languages: ['en-US'],
  capabilities: {
    speechToText: true,
    punctuation: true,
    speakerIdentification: true,
    confidence: true,
    editableTranscript: true,
    regeneratedTranscript: true,
  },
};

/** The abstract surface an annotation may be voiced over (reuses AnnotationType). */
export const VOICEABLE_ANNOTATION_TYPES: readonly AnnotationType[] = [
  'inline',
  'paragraph',
  'sentence',
  'word',
  'chapter',
  'section',
  'figure',
  'table',
  'equation',
  'citation',
  'reference',
  'dataset',
  'attachment',
  'document',
  'general-note',
] as const;
