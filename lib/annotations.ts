import type {
  Annotation,
  AnnotationBookmark,
  AnnotationCommentType,
  AnnotationDecision,
  AnnotationFilter,
  AnnotationHistoryEntry,
  AnnotationLocation,
  AnnotationMention,
  AnnotationReaction,
  AnnotationResolution,
  AnnotationRole,
  AnnotationSort,
  AnnotationStatistics,
  AnnotationStatus,
  AnnotationThreadReply,
  AnnotationType,
  AnnotationAnalytics,
} from '@/types/annotations';
import {
  ANNOTATION_COMMENT_TYPES,
  ANNOTATION_DECISIONS,
  ANNOTATION_ROLES,
  ANNOTATION_STATUSES,
  ANNOTATION_TYPES,
} from '@/types/annotations';

/**
 * Scholatia Annotation & Comment Engine (Phase 2.2F ACSDE) — pure annotation
 * engine.
 *
 * No React, no side effects, no API calls. Annotations reference canonical
 * source records (`sourceEntity` + `sourceId`) and a granular, content-free
 * `AnnotationLocation` — document content is never duplicated. The engine
 * provides the annotation lifecycle (open/pending/accepted/rejected/resolved/
 * archived), the review-decision trail, discussion threads (unlimited depth),
 * mention parsing, reaction aggregation, resolution + history, bookmarks,
 * location resolution, role validation, statistics and analytics.
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

/** Canonical annotation id prefix. */
export function annotationId(label: string): string {
  return `ann-${slugOf(label)}`;
}

/** Canonical annotation thread id prefix. */
export function annotationThreadId(label: string): string {
  return `annt-${slugOf(label)}`;
}

/** Canonical annotation thread reply id prefix. */
export function annotationReplyId(label: string): string {
  return `annr-${slugOf(label)}`;
}

/** Canonical annotation mention id prefix. */
export function annotationMentionId(label: string): string {
  return `anm-${slugOf(label)}`;
}

/** Canonical annotation reaction id prefix. */
export function annotationReactionId(label: string): string {
  return `anx-${slugOf(label)}`;
}

/** Canonical annotation resolution id prefix. */
export function annotationResolutionId(label: string): string {
  return `anres-${slugOf(label)}`;
}

/** Canonical annotation history id prefix. */
export function annotationHistoryId(label: string): string {
  return `anh-${slugOf(label)}`;
}

/** Canonical annotation bookmark id prefix. */
export function annotationBookmarkId(label: string): string {
  return `anb-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Role validation
// ---------------------------------------------------------------------------

/** Validate that a role is a canonical annotation role. */
export function validateAnnotationRole(role: string): role is AnnotationRole {
  return (ANNOTATION_ROLES as readonly string[]).includes(role);
}

/** Validate that a comment type is a canonical annotation comment type. */
export function validateAnnotationCommentType(type: string): type is AnnotationCommentType {
  return (ANNOTATION_COMMENT_TYPES as readonly string[]).includes(type);
}

/** A suggestion-like comment type (one that may carry a review decision). */
export function isSuggestion(type: AnnotationCommentType): boolean {
  return (
    type === 'suggested-correction' ||
    type === 'required-correction' ||
    type === 'grammar' ||
    type === 'language' ||
    type === 'style' ||
    type === 'citation-issue' ||
    type === 'methodology-issue' ||
    type === 'statistical-issue' ||
    type === 'formatting-issue' ||
    type === 'ethical-concern' ||
    type === 'major-revision' ||
    type === 'minor-revision'
  );
}

// ---------------------------------------------------------------------------
// Annotation lifecycle
// ---------------------------------------------------------------------------

function historyEntry(
  annotation: Annotation,
  action: string,
  actor: string,
  actorName: string,
  toStatus: AnnotationStatus,
  comment: string | undefined,
  at: string,
): AnnotationHistoryEntry {
  return {
    id: annotationHistoryId(`${annotation.id}-${action}-${(annotation.history.length + 1)}`),
    annotationId: annotation.id,
    action,
    actor,
    actorName,
    fromStatus: annotation.status,
    toStatus,
    comment,
    at,
  };
}

/** Create a new annotation at a content-free location. */
export function createAnnotation(input: {
  sourceEntity: string;
  sourceId: string;
  type: AnnotationType;
  commentType: AnnotationCommentType;
  role: AnnotationRole;
  author: string;
  authorName: string;
  title?: string;
  body: string;
  location: AnnotationLocation;
  mentions?: AnnotationMention[];
  reviewId?: string;
  workflowId?: string;
  at?: string;
}): Annotation {
  const at = input.at ?? new Date().toISOString();
  const id = annotationId(`${input.sourceId}-${input.type}-${slugOf(input.title ?? input.body.slice(0, 24))}`);
  const base: Annotation = {
    id,
    sourceEntity: input.sourceEntity,
    sourceId: input.sourceId,
    type: input.type,
    commentType: input.commentType,
    role: input.role,
    status: 'open',
    author: input.author,
    authorName: input.authorName,
    title: input.title,
    body: input.body,
    location: input.location,
    thread: {
      id: annotationThreadId(id),
      annotationId: id,
      status: 'open',
      replies: [],
      createdAt: at,
    },
    mentions: input.mentions ?? [],
    reactions: [],
    resolutions: [],
    history: [],
    bookmarks: [],
    reviewId: input.reviewId,
    workflowId: input.workflowId,
    createdAt: at,
    updatedAt: at,
  };
  return {
    ...base,
    history: [historyEntry(base, 'created', input.author, input.authorName, 'open', undefined, at)],
  };
}

/** Change the lifecycle status of an annotation, appending history. */
export function setAnnotationStatus(
  annotation: Annotation,
  status: AnnotationStatus,
  actor: string,
  actorName: string,
  comment?: string,
  at?: string,
): Annotation {
  const now = at ?? new Date().toISOString();
  return {
    ...annotation,
    status,
    updatedAt: now,
    history: [...annotation.history, historyEntry(annotation, 'status-changed', actor, actorName, status, comment, now)],
  };
}

// ---------------------------------------------------------------------------
// Decision & resolution engine
// ---------------------------------------------------------------------------

const DECISION_TO_STATUS: Record<AnnotationDecision, AnnotationStatus> = {
  'accept-suggestion': 'accepted',
  'reject-suggestion': 'rejected',
  'accept-partially': 'resolved',
  'needs-discussion': 'pending',
  escalate: 'pending',
};

/** Apply a review decision to an annotation, appending resolution + history. */
export function applyAnnotationDecision(input: {
  annotation: Annotation;
  decision: AnnotationDecision;
  actor: string;
  actorName: string;
  comment?: string;
  at?: string;
}): Annotation {
  const now = input.at ?? new Date().toISOString();
  const toStatus = DECISION_TO_STATUS[input.decision];
  const resolution: AnnotationResolution = {
    id: annotationResolutionId(`${input.annotation.id}-${input.annotation.resolutions.length + 1}`),
    annotationId: input.annotation.id,
    decision: input.decision,
    resolvedBy: input.actor,
    resolvedByName: input.actorName,
    comment: input.comment,
    at: now,
  };
  const threadClosed = toStatus === 'accepted' || toStatus === 'rejected' || toStatus === 'resolved';
  return {
    ...input.annotation,
    status: toStatus,
    decision: input.decision,
    resolutions: [...input.annotation.resolutions, resolution],
    thread: threadClosed
      ? { ...input.annotation.thread, status: 'resolved' }
      : input.annotation.thread,
    updatedAt: now,
    history: [...input.annotation.history, historyEntry(input.annotation, 'decision-applied', input.actor, input.actorName, toStatus, input.comment, now)],
  };
}

/** Reopen a resolved or archived annotation. */
export function reopenAnnotation(
  annotation: Annotation,
  actor: string,
  actorName: string,
  comment?: string,
  at?: string,
): Annotation {
  const now = at ?? new Date().toISOString();
  return {
    ...annotation,
    status: 'open',
    thread: { ...annotation.thread, status: 'open' },
    updatedAt: now,
    history: [...annotation.history, historyEntry(annotation, 'reopened', actor, actorName, 'open', comment, now)],
  };
}

/** Archive an annotation (soft tombstone, never deleted). */
export function archiveAnnotation(
  annotation: Annotation,
  actor: string,
  actorName: string,
  comment?: string,
  at?: string,
): Annotation {
  const now = at ?? new Date().toISOString();
  return {
    ...annotation,
    status: 'archived',
    thread: { ...annotation.thread, status: 'archived' },
    updatedAt: now,
    history: [...annotation.history, historyEntry(annotation, 'archived', actor, actorName, 'archived', comment, now)],
  };
}

// ---------------------------------------------------------------------------
// Thread engine (unlimited depth)
// ---------------------------------------------------------------------------

/** Append a nested reply to an annotation thread. */
export function addThreadReply(
  annotation: Annotation,
  input: {
    author: string;
    authorName: string;
    body: string;
    parentReplyId?: string;
    mentions?: AnnotationMention[];
    at?: string;
  },
): Annotation {
  const now = input.at ?? new Date().toISOString();
  const reply: AnnotationThreadReply = {
    id: annotationReplyId(`${annotation.id}-${annotation.thread.replies.length + 1}`),
    annotationId: annotation.id,
    author: input.author,
    authorName: input.authorName,
    body: input.body,
    parentReplyId: input.parentReplyId,
    mentions: input.mentions ?? [],
    reactions: [],
    createdAt: now,
  };
  return {
    ...annotation,
    thread: { ...annotation.thread, replies: [...annotation.thread.replies, reply] },
    updatedAt: now,
  };
}

/** Count the replies in an annotation thread (including nested). */
export function threadReplyCount(annotation: Annotation): number {
  return annotation.thread.replies.length;
}

/** The depth of a reply (1 = root, unlimited thereafter). */
export function replyDepth(
  replies: readonly AnnotationThreadReply[],
  reply: AnnotationThreadReply,
): number {
  const byId = new Map(replies.map((entry) => [entry.id, entry]));
  let depth = 1;
  let current: AnnotationThreadReply | undefined = reply;
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

/** Resolve an annotation thread without changing the annotation status. */
export function resolveAnnotationThread(
  annotation: Annotation,
  actor: string,
  actorName: string,
  at?: string,
): Annotation {
  const now = at ?? new Date().toISOString();
  return {
    ...annotation,
    thread: { ...annotation.thread, status: 'resolved' },
    updatedAt: now,
    history: [...annotation.history, historyEntry(annotation, 'thread-resolved', actor, actorName, annotation.status, undefined, now)],
  };
}

/** Reopen an annotation thread. */
export function reopenAnnotationThread(
  annotation: Annotation,
  actor: string,
  actorName: string,
  at?: string,
): Annotation {
  const now = at ?? new Date().toISOString();
  return {
    ...annotation,
    thread: { ...annotation.thread, status: 'open' },
    updatedAt: now,
    history: [...annotation.history, historyEntry(annotation, 'thread-reopened', actor, actorName, annotation.status, undefined, now)],
  };
}

/** Archive an annotation thread. */
export function archiveAnnotationThread(
  annotation: Annotation,
  actor: string,
  actorName: string,
  at?: string,
): Annotation {
  const now = at ?? new Date().toISOString();
  return {
    ...annotation,
    thread: { ...annotation.thread, status: 'archived' },
    updatedAt: now,
    history: [...annotation.history, historyEntry(annotation, 'thread-archived', actor, actorName, annotation.status, undefined, now)],
  };
}

// ---------------------------------------------------------------------------
// Mentions & reactions
// ---------------------------------------------------------------------------

const MENTION_PATTERN = /@([\w.-]+)/g;

/** Parse `@mentions` from free text against canonical people. */
export function parseMentions(
  text: string,
  people: readonly { username?: string; name: string }[],
): AnnotationMention[] {
  const mentions: AnnotationMention[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(MENTION_PATTERN)) {
    const needle = match[1].toLowerCase();
    const person = people.find(
      (entry) => entry.username?.toLowerCase() === needle || entry.name.toLowerCase() === needle,
    );
    if (person && !seen.has(person.name)) {
      seen.add(person.name);
      mentions.push({
        username: person.username,
        name: person.name,
        sourceEntity: 'researcher',
        sourceId: person.username ?? person.name,
      });
    }
  }
  return mentions;
}

/** The mentions attached to an annotation. */
export function mentionsInAnnotation(annotation: Annotation): AnnotationMention[] {
  return annotation.mentions;
}

/** Add a reaction to an annotation. */
export function addAnnotationReaction(
  annotation: Annotation,
  input: {
    emoji: string;
    actor: string;
    actorName: string;
    at?: string;
  },
): Annotation {
  const now = input.at ?? new Date().toISOString();
  const reaction: AnnotationReaction = {
    id: annotationReactionId(`${annotation.id}-${input.actor}-${input.emoji}`),
    emoji: input.emoji,
    actor: input.actor,
    actorName: input.actorName,
    createdAt: now,
  };
  return {
    ...annotation,
    reactions: [...annotation.reactions.filter((entry) => !(entry.actor === input.actor && entry.emoji === input.emoji)), reaction],
    updatedAt: now,
  };
}

/** Remove a reaction from an annotation. */
export function removeAnnotationReaction(annotation: Annotation, reactionId: string): Annotation {
  return {
    ...annotation,
    reactions: annotation.reactions.filter((reaction) => reaction.id !== reactionId),
    updatedAt: new Date().toISOString(),
  };
}

/** Aggregate reactions into an ordered emoji summary. */
export function aggregateReactions(
  reactions: readonly AnnotationReaction[],
): { emoji: string; count: number; actors: string[] }[] {
  const byEmoji = new Map<string, { count: number; actors: string[] }>();
  reactions.forEach((reaction) => {
    const existing = byEmoji.get(reaction.emoji);
    if (existing) {
      existing.count += 1;
      if (!existing.actors.includes(reaction.actorName)) {
        existing.actors.push(reaction.actorName);
      }
    } else {
      byEmoji.set(reaction.emoji, { count: 1, actors: [reaction.actorName] });
    }
  });
  return [...byEmoji.entries()]
    .map(([emoji, value]) => ({ emoji, count: value.count, actors: value.actors }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

/** Toggle a bookmark for a user on an annotation. */
export function toggleAnnotationBookmark(
  annotation: Annotation,
  user: string,
  userName: string,
  at?: string,
): Annotation {
  const existing = annotation.bookmarks ?? [];
  const present = existing.some((bookmark) => bookmark.user === user);
  if (present) {
    return { ...annotation, bookmarks: existing.filter((bookmark) => bookmark.user !== user) };
  }
  const bookmark: AnnotationBookmark = {
    id: annotationBookmarkId(`${annotation.id}-${user}`),
    annotationId: annotation.id,
    user,
    userName,
    createdAt: at ?? new Date().toISOString(),
  };
  return { ...annotation, bookmarks: [...existing, bookmark] };
}

/** Bookmark count for an annotation. */
export function annotationBookmarkCount(annotation: Annotation): number {
  return (annotation.bookmarks ?? []).length;
}

/** Whether a user has bookmarked an annotation. */
export function isAnnotationBookmarked(annotation: Annotation, user: string): boolean {
  return (annotation.bookmarks ?? []).some((bookmark) => bookmark.user === user);
}

/** Annotations bookmarked by a user. */
export function bookmarksForUser(annotations: readonly Annotation[], user: string): Annotation[] {
  return annotations.filter((annotation) => isAnnotationBookmarked(annotation, user));
}

/** Annotations that carry at least one bookmark. */
export function bookmarkedAnnotations(annotations: readonly Annotation[]): Annotation[] {
  return annotations.filter((annotation) => (annotation.bookmarks ?? []).length > 0);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Annotations attached to a canonical source. */
export function annotationsForSource(
  annotations: readonly Annotation[],
  sourceEntity: string,
  sourceId: string,
): Annotation[] {
  return annotations.filter(
    (annotation) => annotation.sourceEntity === sourceEntity && annotation.sourceId === sourceId,
  );
}

/** Annotations in a given lifecycle status. */
export function annotationsByStatus(annotations: readonly Annotation[], status: AnnotationStatus): Annotation[] {
  return annotations.filter((annotation) => annotation.status === status);
}

/** Annotations of a given type. */
export function annotationsByType(annotations: readonly Annotation[], type: AnnotationType): Annotation[] {
  return annotations.filter((annotation) => annotation.type === type);
}

/** Annotations created in a given reviewer role. */
export function annotationsByRole(annotations: readonly Annotation[], role: AnnotationRole): Annotation[] {
  return annotations.filter((annotation) => annotation.role === role);
}

/** Annotations mentioning a given researcher username. */
export function annotationsMentioning(annotations: readonly Annotation[], username: string): Annotation[] {
  return annotations.filter((annotation) =>
    annotation.mentions.some((mention) => mention.sourceId === username),
  );
}

/** Full-text search across annotation text, titles, and locations. */
export function searchAnnotations(annotations: readonly Annotation[], query: string): Annotation[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [...annotations];
  }
  return annotations.filter((annotation) =>
    [
      annotation.body,
      annotation.title,
      annotation.authorName,
      annotation.sourceId,
      annotation.sourceEntity,
      annotation.location.sectionId,
      annotation.location.chapterId,
      annotation.location.paragraphId,
    ]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(needle)),
  );
}

/** Apply the canonical annotation filter. */
export function filterAnnotations(
  annotations: readonly Annotation[],
  filter: AnnotationFilter,
): Annotation[] {
  let result = [...annotations];
  if (filter.status) {
    result = result.filter((annotation) => annotation.status === filter.status);
  }
  if (filter.type) {
    result = result.filter((annotation) => annotation.type === filter.type);
  }
  if (filter.role) {
    result = result.filter((annotation) => annotation.role === filter.role);
  }
  if (filter.sourceEntity) {
    result = result.filter((annotation) => annotation.sourceEntity === filter.sourceEntity);
  }
  if (filter.mentionUsername) {
    result = annotationsMentioning(result, filter.mentionUsername);
  }
  if (filter.bookmarked) {
    result = filter.bookmarkedUser
      ? bookmarksForUser(result, filter.bookmarkedUser)
      : bookmarkedAnnotations(result);
  }
  if (filter.query) {
    result = searchAnnotations(result, filter.query);
  }
  return sortAnnotations(result, filter.sort ?? 'recent');
}

/** Sort annotations by a canonical sort key. */
export function sortAnnotations(annotations: readonly Annotation[], sort: AnnotationSort): Annotation[] {
  const sorted = [...annotations];
  switch (sort) {
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status) || b.createdAt.localeCompare(a.createdAt));
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type) || b.createdAt.localeCompare(a.createdAt));
    case 'role':
      return sorted.sort((a, b) => a.role.localeCompare(b.role) || b.createdAt.localeCompare(a.createdAt));
    case 'recent':
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

// ---------------------------------------------------------------------------
// Location resolution
// ---------------------------------------------------------------------------

const TARGET_PREFIX: Record<string, string> = {
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
  document: 'Document',
};

/** Resolve a location into a human-readable breadcrumb of id references. */
export function locationBreadcrumb(location: AnnotationLocation): string[] {
  const parts: string[] = [`${location.sourceEntity}:${location.sourceId}`];
  const granular: Array<[string, string]> = [
    ['chapterId', 'Chapter'],
    ['sectionId', 'Section'],
    ['paragraphId', 'Paragraph'],
    ['sentenceId', 'Sentence'],
    ['wordId', 'Word'],
    ['figureId', 'Figure'],
    ['tableId', 'Table'],
    ['equationId', 'Equation'],
    ['citationId', 'Citation'],
    ['referenceId', 'Reference'],
    ['datasetId', 'Dataset'],
    ['attachmentId', 'Attachment'],
  ];
  granular.forEach(([key, label]) => {
    const value = (location as unknown as Record<string, string | undefined>)[key];
    if (value) {
      parts.push(`${label} ${value}`);
    }
  });
  if (parts.length === 1 && location.target !== 'document') {
    parts.push(`${TARGET_PREFIX[location.target] ?? location.target}`);
  }
  return parts;
}

/** Resolve a location into a single canonical label string. */
export function resolveLocation(location: AnnotationLocation): string {
  return locationBreadcrumb(location).join(' › ');
}

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

/** Derive annotation statistics. */
export function annotationStatistics(annotations: readonly Annotation[]): AnnotationStatistics {
  return {
    totalAnnotations: annotations.length,
    openAnnotations: annotations.filter((annotation) => annotation.status === 'open').length,
    pendingAnnotations: annotations.filter((annotation) => annotation.status === 'pending').length,
    resolvedAnnotations: annotations.filter(
      (annotation) =>
        annotation.status === 'resolved' ||
        annotation.status === 'accepted' ||
        annotation.status === 'rejected',
    ).length,
    archivedAnnotations: annotations.filter((annotation) => annotation.status === 'archived').length,
    totalThreadReplies: annotations.reduce(
      (total, annotation) => total + annotation.thread.replies.length,
      0,
    ),
    totalMentions: annotations.reduce((total, annotation) => total + annotation.mentions.length, 0),
    totalReactions: annotations.reduce((total, annotation) => total + annotation.reactions.length, 0),
    byType: ANNOTATION_TYPES.map((type) => ({
      type,
      count: annotations.filter((annotation) => annotation.type === type).length,
    })).filter((stat) => stat.count > 0),
    byStatus: ANNOTATION_STATUSES.map((status) => ({
      status,
      count: annotations.filter((annotation) => annotation.status === status).length,
    })).filter((stat) => stat.count > 0),
    byRole: ANNOTATION_ROLES.map((role) => ({
      role,
      count: annotations.filter((annotation) => annotation.role === role).length,
    })).filter((stat) => stat.count > 0),
  };
}

/** Derive annotation analytics. */
export function annotationAnalytics(annotations: readonly Annotation[]): AnnotationAnalytics {
  const sources = new Map<string, { sourceEntity: string; sourceId: string; count: number }>();
  annotations.forEach((annotation) => {
    const key = `${annotation.sourceEntity}:${annotation.sourceId}`;
    const existing = sources.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      sources.set(key, { sourceEntity: annotation.sourceEntity, sourceId: annotation.sourceId, count: 1 });
    }
  });
  const suggestions = annotations.filter((annotation) => isSuggestion(annotation.commentType)).length;
  const decisions: AnnotationAnalytics['decisions'] = ANNOTATION_DECISIONS.map((decision) => ({
    decision,
    count: annotations.filter((annotation) => annotation.decision === decision).length,
  })).filter((stat) => stat.count > 0);
  return {
    byType: annotationStatistics(annotations).byType,
    byStatus: annotationStatistics(annotations).byStatus,
    byRole: annotationStatistics(annotations).byRole,
    bySource: [...sources.values()].sort((a, b) => b.count - a.count),
    decisions,
    voiceLinked: annotations.filter((annotation) => annotation.reviewId !== undefined).length,
    suggestionRate: annotations.length === 0 ? 0 : Math.round((suggestions / annotations.length) * 100),
  };
}
