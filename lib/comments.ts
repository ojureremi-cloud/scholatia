import type {
  Comment,
  CommentAnalytics,
  CommentReply,
  CommentStatistics,
  CommentThread,
  ThreadFilter,
  ThreadSort,
  TranscriptTimestamp,
  TranscriptionProvider,
  VoiceComment,
  VoiceCommentMode,
  VoiceTranscript,
} from '@/types/comments';
import {
  DEFAULT_TRANSCRIPTION_PROVIDER,
  THREAD_KINDS,
  THREAD_STATUSES,
  VOICE_COMMENT_MODES,
  VOICE_COMMENT_STATUSES,
} from '@/types/comments';
import type {
  AnnotationMention,
  AnnotationReaction,
} from '@/types/annotations';
import {
  aggregateReactions,
  annotationReactionId,
} from '@/lib/annotations';

/**
 * Scholatia Comment, Thread & Voice Engine (Phase 2.2F ACSDE) — pure comment
 * engine.
 *
 * No React, no side effects, no API calls. Comment threads attach to any
 * canonical source and carry unlimited-depth nested replies with mentions and
 * reactions. Voice comments are first-class: the transcription abstraction
 * layer models speech-to-text, punctuation, speaker identification,
 * confidence scoring, editable transcripts, regenerated transcripts, AI
 * summaries, searchable timed transcripts, and language metadata — no external
 * API is integrated, only the abstraction surface.
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

/** Canonical comment thread id prefix. */
export function commentThreadId(label: string): string {
  return `thr-${slugOf(label)}`;
}

/** Canonical comment id prefix. */
export function commentId(label: string): string {
  return `cmt-${slugOf(label)}`;
}

/** Canonical comment reply id prefix. */
export function commentReplyId(label: string): string {
  return `cmtr-${slugOf(label)}`;
}

/** Canonical voice comment id prefix. */
export function voiceCommentId(label: string): string {
  return `vc-${slugOf(label)}`;
}

/** Canonical voice transcript id prefix. */
export function voiceTranscriptId(label: string): string {
  return `vct-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Thread engine
// ---------------------------------------------------------------------------

/** Create a discussion thread attached to a canonical source. */
export function createCommentThread(input: {
  sourceEntity: string;
  sourceId: string;
  title?: string;
  kind?: CommentThread['kind'];
  at?: string;
}): CommentThread {
  const at = input.at ?? new Date().toISOString();
  const id = commentThreadId(`${input.sourceId}-${slugOf(input.title ?? input.kind ?? 'discussion')}`);
  return {
    id,
    sourceEntity: input.sourceEntity,
    sourceId: input.sourceId,
    title: input.title,
    kind: input.kind ?? 'discussion',
    status: 'open',
    comments: [],
    replies: [],
    createdAt: at,
    updatedAt: at,
  };
}

/** Append a comment to a thread (mentions parsed by the caller). */
export function addComment(
  thread: CommentThread,
  input: {
    author: string;
    authorName: string;
    body: string;
    annotationId?: string;
    mentions?: AnnotationMention[];
    at?: string;
  },
): CommentThread {
  const now = input.at ?? new Date().toISOString();
  const comment: Comment = {
    id: commentId(`${thread.id}-${thread.comments.length + 1}`),
    threadId: thread.id,
    author: input.author,
    authorName: input.authorName,
    body: input.body,
    annotationId: input.annotationId,
    mentions: input.mentions ?? [],
    reactions: [],
    createdAt: now,
    updatedAt: now,
  };
  return { ...thread, comments: [...thread.comments, comment], updatedAt: now };
}

/** Append a nested reply to a thread (unlimited depth). */
export function addReply(
  thread: CommentThread,
  input: {
    author: string;
    authorName: string;
    body: string;
    parentReplyId?: string;
    mentions?: AnnotationMention[];
    at?: string;
  },
): CommentThread {
  const now = input.at ?? new Date().toISOString();
  const reply: CommentReply = {
    id: commentReplyId(`${thread.id}-${thread.replies.length + 1}`),
    threadId: thread.id,
    parentReplyId: input.parentReplyId,
    author: input.author,
    authorName: input.authorName,
    body: input.body,
    mentions: input.mentions ?? [],
    reactions: [],
    createdAt: now,
  };
  return { ...thread, replies: [...thread.replies, reply], updatedAt: now };
}

/** The depth of a comment reply (1 = root, unlimited thereafter). */
export function replyDepth(
  replies: readonly CommentReply[],
  reply: CommentReply,
): number {
  const byId = new Map(replies.map((entry) => [entry.id, entry]));
  let depth = 1;
  let current: CommentReply | undefined = reply;
  while (current.parentReplyId) {
    const parent = byId.get(current.parentReplyId);
    if (!parent) {
      break;
    }
    depth += 1;
    current = parent;
  }
  return depth;
}

/** Comment count of a thread. */
export function commentCount(thread: CommentThread): number {
  return thread.comments.length;
}

/** Reply count of a thread. */
export function replyCount(thread: CommentThread): number {
  return thread.replies.length;
}

/** The threads attached to a canonical source. */
export function threadsForSource(
  threads: readonly CommentThread[],
  sourceEntity: string,
  sourceId: string,
): CommentThread[] {
  return threads.filter(
    (thread) => thread.sourceEntity === sourceEntity && thread.sourceId === sourceId,
  );
}

// ---------------------------------------------------------------------------
// Resolution engine
// ---------------------------------------------------------------------------

/** Resolve a discussion thread. */
export function resolveThread(thread: CommentThread, at?: string): CommentThread {
  const now = at ?? new Date().toISOString();
  return { ...thread, status: 'resolved', updatedAt: now };
}

/** Reopen a discussion thread. */
export function reopenThread(thread: CommentThread, at?: string): CommentThread {
  const now = at ?? new Date().toISOString();
  return { ...thread, status: 'open', updatedAt: now };
}

/** Archive a discussion thread. */
export function archiveThread(thread: CommentThread, at?: string): CommentThread {
  const now = at ?? new Date().toISOString();
  return { ...thread, status: 'archived', updatedAt: now };
}

// ---------------------------------------------------------------------------
// Mentions & reactions
// ---------------------------------------------------------------------------

/** Parse `@mentions` from free text against canonical people. */
export { parseMentions } from '@/lib/annotations';

/** Add a reaction to a comment inside a thread. */
export function addCommentReaction(
  thread: CommentThread,
  commentIdToReact: string,
  input: {
    emoji: string;
    actor: string;
    actorName: string;
    at?: string;
  },
): CommentThread {
  const now = input.at ?? new Date().toISOString();
  const reaction: AnnotationReaction = {
    id: annotationReactionId(`${commentIdToReact}-${input.actor}-${input.emoji}`),
    emoji: input.emoji,
    actor: input.actor,
    actorName: input.actorName,
    createdAt: now,
  };
  return {
    ...thread,
    comments: thread.comments.map((comment) =>
      comment.id === commentIdToReact
        ? {
            ...comment,
            reactions: [
              ...comment.reactions.filter(
                (entry) => !(entry.actor === input.actor && entry.emoji === input.emoji),
              ),
              reaction,
            ],
          }
        : comment,
    ),
    updatedAt: now,
  };
}

/** Add a reaction to a reply inside a thread. */
export function addReplyReaction(
  thread: CommentThread,
  replyIdToReact: string,
  input: {
    emoji: string;
    actor: string;
    actorName: string;
    at?: string;
  },
): CommentThread {
  const now = input.at ?? new Date().toISOString();
  const reaction: AnnotationReaction = {
    id: annotationReactionId(`${replyIdToReact}-${input.actor}-${input.emoji}`),
    emoji: input.emoji,
    actor: input.actor,
    actorName: input.actorName,
    createdAt: now,
  };
  return {
    ...thread,
    replies: thread.replies.map((reply) =>
      reply.id === replyIdToReact
        ? {
            ...reply,
            reactions: [
              ...reply.reactions.filter(
                (entry) => !(entry.actor === input.actor && entry.emoji === input.emoji),
              ),
              reaction,
            ],
          }
        : reply,
    ),
    updatedAt: now,
  };
}

/** Aggregate reactions across comments and replies into an emoji summary. */
export function aggregateThreadReactions(thread: CommentThread) {
  const reactions = [
    ...thread.comments.flatMap((comment) => comment.reactions),
    ...thread.replies.flatMap((reply) => reply.reactions),
  ];
  return aggregateReactions(reactions);
}

// ---------------------------------------------------------------------------
// Voice & transcription abstraction
// ---------------------------------------------------------------------------

/** The capabilities exposed by a transcription provider. */
export function transcriptionCapabilities(provider: TranscriptionProvider) {
  return provider.capabilities;
}

/** Whether a provider can transcribe at all. */
export function canTranscribe(provider: TranscriptionProvider): boolean {
  return provider.capabilities.speechToText;
}

/** Create a voice comment (audio optional, mode-driven). */
export function createVoiceComment(input: {
  sourceEntity: string;
  sourceId: string;
  commentThreadId?: string;
  annotationId?: string;
  author: string;
  authorName: string;
  mode: VoiceCommentMode;
  audioUrl?: string;
  durationSeconds?: number;
  language: string;
  transcript?: VoiceTranscript;
  aiSummary?: string;
  mentions?: AnnotationMention[];
  at?: string;
}): VoiceComment {
  const now = input.at ?? new Date().toISOString();
  const id = voiceCommentId(`${input.sourceId}-${input.author}-${input.mode}`);
  return {
    id,
    sourceEntity: input.sourceEntity,
    sourceId: input.sourceId,
    commentThreadId: input.commentThreadId,
    annotationId: input.annotationId,
    author: input.author,
    authorName: input.authorName,
    mode: input.mode,
    status: input.transcript ? 'transcribed' : 'recorded',
    audioUrl: input.audioUrl,
    durationSeconds: input.durationSeconds,
    language: input.language,
    transcript: input.transcript ? { ...input.transcript, voiceCommentId: id } : undefined,
    aiSummary: input.aiSummary,
    mentions: input.mentions ?? [],
    reactions: [],
    createdAt: now,
    updatedAt: now,
  };
}

function estimateDuration(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return words === 0 ? 0 : Math.ceil(words / 2.5);
}

function sentenceSegments(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

/** Distribute estimated timestamps across transcript sentences (pure). */
export function buildTranscriptTimestamps(
  text: string,
  durationSeconds: number,
  speakerId?: string,
): TranscriptTimestamp[] {
  const sentences = sentenceSegments(text);
  if (sentences.length === 0) {
    return [];
  }
  const perSentence = durationSeconds / sentences.length;
  let cursor = 0;
  return sentences.map((sentence) => {
    const startSeconds = cursor;
    cursor += perSentence;
    return {
      startSeconds: Math.round(startSeconds * 10) / 10,
      endSeconds: Math.round(cursor * 10) / 10,
      text: sentence,
      speakerId,
    };
  });
}

/** Simulate a transcription job against a provider abstraction. */
export function transcribeVoiceComment(input: {
  voiceComment: VoiceComment;
  text: string;
  provider?: TranscriptionProvider;
  confidence?: number;
  language?: string;
  speakerId?: string;
  now?: string;
}): VoiceComment {
  const provider = input.provider ?? DEFAULT_TRANSCRIPTION_PROVIDER;
  const now = input.now ?? new Date().toISOString();
  const duration = input.voiceComment.durationSeconds ?? estimateDuration(input.text);
  const transcript: VoiceTranscript = {
    id: voiceTranscriptId(input.voiceComment.id),
    voiceCommentId: input.voiceComment.id,
    text: input.text,
    language: input.language ?? input.voiceComment.language,
    confidence:
      input.confidence ?? Math.round((0.9 - (input.text.length % 7) / 100) * 100) / 100,
    speakerId: input.speakerId,
    providerId: provider.id,
    timestamps: buildTranscriptTimestamps(input.text, duration, input.speakerId),
    createdAt: now,
    updatedAt: now,
  };
  return {
    ...input.voiceComment,
    status: 'transcribed',
    transcript,
    updatedAt: now,
  };
}

/** Edit an existing transcript (editable transcripts). */
export function editTranscript(voiceComment: VoiceComment, text: string, now?: string): VoiceComment {
  const timestamp = now ?? new Date().toISOString();
  if (!voiceComment.transcript) {
    return voiceComment;
  }
  const transcript: VoiceTranscript = {
    ...voiceComment.transcript,
    text,
    timestamps: buildTranscriptTimestamps(
      text,
      voiceComment.durationSeconds ?? estimateDuration(text),
      voiceComment.transcript.speakerId,
    ),
    updatedAt: timestamp,
  };
  return { ...voiceComment, status: 'edited', transcript, updatedAt: timestamp };
}

/** Regenerate a transcript (regenerated transcripts). */
export function regenerateTranscript(
  voiceComment: VoiceComment,
  text: string,
  provider?: TranscriptionProvider,
  now?: string,
): VoiceComment {
  const timestamp = now ?? new Date().toISOString();
  if (!voiceComment.transcript) {
    return transcribeVoiceComment({ voiceComment, text, provider, now: timestamp });
  }
  const transcript: VoiceTranscript = {
    ...voiceComment.transcript,
    text,
    providerId: provider?.id ?? voiceComment.transcript.providerId,
    timestamps: buildTranscriptTimestamps(
      text,
      voiceComment.durationSeconds ?? estimateDuration(text),
      voiceComment.transcript.speakerId,
    ),
    updatedAt: timestamp,
  };
  return { ...voiceComment, status: 'regenerated', transcript, updatedAt: timestamp };
}

/** Search a transcript by text (searchable transcript). */
export function transcriptSearch(
  transcript: VoiceTranscript,
  query: string,
): TranscriptTimestamp[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return transcript.timestamps;
  }
  return transcript.timestamps.filter((segment) => segment.text.toLowerCase().includes(needle));
}

/** The confidence score of a transcript. */
export function transcriptConfidence(transcript: VoiceTranscript): number {
  return transcript.confidence;
}

/** The language metadata of a transcript. */
export function transcriptLanguage(transcript: VoiceTranscript): string {
  return transcript.language;
}

/** Build an AI summary from a transcript (pure abstraction — no external AI). */
export function summarizeVoiceComment(voiceComment: VoiceComment): string {
  const text = voiceComment.transcript?.text ?? '';
  const sentences = sentenceSegments(text);
  if (sentences.length === 0) {
    return 'No transcript available to summarise.';
  }
  const first = sentences.slice(0, 2).join(' ');
  return first.length > 220 ? `${first.slice(0, 217)}…` : first;
}

/** Voice comments attached to a canonical source. */
export function voiceCommentsForSource(
  voiceComments: readonly VoiceComment[],
  sourceEntity: string,
  sourceId: string,
): VoiceComment[] {
  return voiceComments.filter(
    (voiceComment) =>
      voiceComment.sourceEntity === sourceEntity && voiceComment.sourceId === sourceId,
  );
}

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

/** Derive comment statistics. */
export function commentStatistics(
  threads: readonly CommentThread[],
  voiceComments: readonly VoiceComment[],
): CommentStatistics {
  return {
    totalThreads: threads.length,
    openThreads: threads.filter((thread) => thread.status === 'open').length,
    resolvedThreads: threads.filter((thread) => thread.status === 'resolved').length,
    archivedThreads: threads.filter((thread) => thread.status === 'archived').length,
    totalComments: threads.reduce((total, thread) => total + thread.comments.length, 0),
    totalReplies: threads.reduce((total, thread) => total + thread.replies.length, 0),
    totalVoiceComments: voiceComments.length,
    totalMentions: threads.reduce(
      (total, thread) =>
        total +
        thread.comments.reduce((sum, comment) => sum + comment.mentions.length, 0) +
        thread.replies.reduce((sum, reply) => sum + reply.mentions.length, 0),
      0,
    ),
    totalReactions: threads.reduce(
      (total, thread) =>
        total +
        thread.comments.reduce((sum, comment) => sum + comment.reactions.length, 0) +
        thread.replies.reduce((sum, reply) => sum + reply.reactions.length, 0),
      0,
    ),
    byStatus: THREAD_STATUSES.map((status) => ({
      status,
      count: threads.filter((thread) => thread.status === status).length,
    })).filter((stat) => stat.count > 0),
    byKind: THREAD_KINDS.map((kind) => ({
      kind,
      count: threads.filter((thread) => thread.kind === kind).length,
    })).filter((stat) => stat.count > 0),
  };
}

/** Derive comment analytics. */
export function commentAnalytics(
  threads: readonly CommentThread[],
  voiceComments: readonly VoiceComment[],
): CommentAnalytics {
  const sources = new Map<string, { sourceEntity: string; sourceId: string; count: number }>();
  threads.forEach((thread) => {
    const key = `${thread.sourceEntity}:${thread.sourceId}`;
    const existing = sources.get(key);
    const count = thread.comments.length + thread.replies.length;
    if (existing) {
      existing.count += count;
    } else {
      sources.set(key, { sourceEntity: thread.sourceEntity, sourceId: thread.sourceId, count });
    }
  });
  const depths = threads.flatMap((thread) => thread.replies.map((reply) => replyDepth(thread.replies, reply)));
  const durations = voiceComments
    .map((voiceComment) => voiceComment.durationSeconds ?? 0)
    .filter((duration) => duration > 0);
  return {
    byKind: commentStatistics(threads, voiceComments).byKind,
    byStatus: commentStatistics(threads, voiceComments).byStatus,
    bySource: [...sources.values()].sort((a, b) => b.count - a.count),
    voiceModes: VOICE_COMMENT_MODES.map((mode) => ({
      mode,
      count: voiceComments.filter((voiceComment) => voiceComment.mode === mode).length,
    })).filter((stat) => stat.count > 0),
    voiceByStatus: VOICE_COMMENT_STATUSES.map((status) => ({
      status,
      count: voiceComments.filter((voiceComment) => voiceComment.status === status).length,
    })).filter((stat) => stat.count > 0),
    averageDepth: depths.length === 0 ? 0 : Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10,
    averageVoiceDuration:
      durations.length === 0 ? 0 : Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Full-text search across thread titles and comment/reply text. */
export function searchThreads(threads: readonly CommentThread[], query: string): CommentThread[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [...threads];
  }
  return threads.filter((thread) =>
    [thread.title, thread.sourceId, thread.sourceEntity]
      .concat(thread.comments.map((comment) => comment.body))
      .concat(thread.replies.map((reply) => reply.body))
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(needle)),
  );
}

/** Apply the canonical thread filter. */
export function filterThreads(threads: readonly CommentThread[], filter: ThreadFilter): CommentThread[] {
  let result = [...threads];
  if (filter.status) {
    result = result.filter((thread) => thread.status === filter.status);
  }
  if (filter.kind) {
    result = result.filter((thread) => thread.kind === filter.kind);
  }
  if (filter.sourceEntity) {
    result = result.filter((thread) => thread.sourceEntity === filter.sourceEntity);
  }
  if (filter.query) {
    result = searchThreads(result, filter.query);
  }
  return sortThreads(result, filter.sort ?? 'recent');
}

/** Sort threads by a canonical sort key. */
export function sortThreads(threads: readonly CommentThread[], sort: ThreadSort): CommentThread[] {
  const sorted = [...threads];
  switch (sort) {
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status) || b.createdAt.localeCompare(a.createdAt));
    case 'replies':
      return sorted.sort((a, b) => replyCount(b) - replyCount(a));
    case 'recent':
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
