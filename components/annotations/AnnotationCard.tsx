'use client';

import { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { aggregateReactions, threadReplyCount } from '@/lib/annotations';
import type {
  Annotation,
  AnnotationDecision,
  AnnotationMention,
  AnnotationReaction,
} from '@/types/annotations';
import {
  AnnotationCommentTypeBadge,
  AnnotationDecisionBadge,
  AnnotationRoleBadge,
  AnnotationStatusBadge,
  AnnotationTypeBadge,
} from './AnnotationBadges';
import { AnnotationLocation } from './AnnotationLocation';
import { formatDateTime, formatRelative } from './format';

type AnnotationCardProps = {
  annotation: Annotation;
  isBookmarkedByUser?: boolean;
  onReact?: (emoji: string) => void;
  onToggleBookmark?: () => void;
  onReply?: (body: string) => void;
  onDecide?: (decision: AnnotationDecision, comment?: string) => void;
  onArchive?: (comment?: string) => void;
  onReopen?: () => void;
};

function MentionChips({ mentions }: { mentions: AnnotationMention[] }) {
  if (mentions.length === 0) {
    return null;
  }
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {mentions.map((mention) => (
        <span
          key={`${mention.sourceId}-${mention.name}`}
          className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-900 dark:text-sky-200"
        >
          @{mention.username ?? mention.name}
        </span>
      ))}
    </div>
  );
}

function ReactionBar({ reactions }: { reactions: AnnotationReaction[] }) {
  const summary = aggregateReactions(reactions);
  if (summary.length === 0) {
    return null;
  }
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {summary.map((entry) => (
        <span
          key={entry.emoji}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <span>{entry.emoji}</span>
          <span>{entry.count}</span>
        </span>
      ))}
    </div>
  );
}

type ThreadReplyProps = {
  annotationId: string;
  parentReplyId?: string;
  author: string;
  authorName: string;
  body: string;
  reactions: AnnotationReaction[];
  createdAt: string;
};

function ThreadReply({ annotationId, parentReplyId, authorName, body, reactions, createdAt }: ThreadReplyProps) {
  void annotationId;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold text-slate-500">
        {authorName} <span className="font-normal">· {formatRelative(createdAt)}</span>
        {parentReplyId ? <span className="font-normal"> · reply</span> : null}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200">{body}</p>
      <ReactionBar reactions={reactions} />
    </div>
  );
}

export function AnnotationCard({
  annotation,
  isBookmarkedByUser = false,
  onReact,
  onToggleBookmark,
  onReply,
  onDecide,
  onArchive,
  onReopen,
}: AnnotationCardProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const canDecide = onDecide !== undefined;
  const showDecision = annotation.decision !== undefined;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <AnnotationTypeBadge type={annotation.type} />
          <AnnotationStatusBadge status={annotation.status} />
          <AnnotationRoleBadge role={annotation.role} />
          <AnnotationCommentTypeBadge type={annotation.commentType} />
          {showDecision && annotation.decision ? (
            <AnnotationDecisionBadge decision={annotation.decision} />
          ) : null}
        </div>
        <button
          type="button"
          onClick={onToggleBookmark}
          title={isBookmarkedByUser ? 'Remove bookmark' : 'Bookmark'}
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold transition',
            isBookmarkedByUser
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
              : 'border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {isBookmarkedByUser ? '🔖 Bookmarked' : '🔖 Bookmark'}
        </button>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
        {annotation.title ?? 'Annotation'}
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{annotation.body}</p>

      <MentionChips mentions={annotation.mentions} />
      <ReactionBar reactions={annotation.reactions} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold text-slate-500">
          {annotation.authorName} <span className="font-normal">· {formatDateTime(annotation.createdAt)}</span>
        </p>
        {annotation.reviewId ? <Badge variant="info">{annotation.reviewId}</Badge> : null}
        {annotation.workflowId ? <Badge variant="default">{annotation.workflowId}</Badge> : null}
      </div>

      <div className="mt-4">
        <AnnotationLocation location={annotation.location} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {onReact ? (
          <Button variant="outline" size="sm" onClick={() => onReact('👍')}>
            👍
          </Button>
        ) : null}
        {onToggleBookmark ? (
          <Button variant="ghost" size="sm" onClick={onToggleBookmark}>
            {isBookmarkedByUser ? 'Remove bookmark' : 'Bookmark'}
          </Button>
        ) : null}
        {onReply ? (
          <Button variant="secondary" size="sm" onClick={() => setReplyOpen((open) => !open)}>
            💬 Reply ({threadReplyCount(annotation)})
          </Button>
        ) : null}
        {canDecide ? (
          <Button variant="secondary" size="sm" onClick={() => setDecisionOpen((open) => !open)}>
            ⚖️ Decide
          </Button>
        ) : null}
        {onArchive && (annotation.status === 'open' || annotation.status === 'pending') ? (
          <Button variant="outline" size="sm" onClick={() => onArchive('Archived by reviewer.')}>
            🗄️ Archive
          </Button>
        ) : null}
        {onReopen && annotation.status === 'archived' ? (
          <Button variant="outline" size="sm" onClick={onReopen}>
            ↩️ Reopen
          </Button>
        ) : null}
      </div>

      {replyOpen && onReply ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <textarea
            value={replyBody}
            onChange={(event) => setReplyBody(event.target.value)}
            placeholder="Write a reply…"
            rows={2}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (replyBody.trim()) {
                  onReply(replyBody.trim());
                  setReplyBody('');
                  setReplyOpen(false);
                }
              }}
            >
              Post reply
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setReplyOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {decisionOpen && canDecide ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['accept-suggestion', 'Accept'],
                ['reject-suggestion', 'Reject'],
                ['accept-partially', 'Accept partially'],
                ['needs-discussion', 'Needs discussion'],
                ['escalate', 'Escalate'],
              ] as [AnnotationDecision, string][]
            ).map(([decision, label]) => (
              <Button key={decision} variant="outline" size="sm" onClick={() => onDecide(decision)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {annotation.thread.replies.length > 0 ? (
        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Discussion thread
          </p>
          {annotation.thread.replies.map((reply) => (
            <ThreadReply
              key={reply.id}
              annotationId={annotation.id}
              parentReplyId={reply.parentReplyId}
              author={reply.author}
              authorName={reply.authorName}
              body={reply.body}
              reactions={reply.reactions}
              createdAt={reply.createdAt}
            />
          ))}
        </div>
      ) : null}

      {annotation.resolutions.length > 0 ? (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Resolution trail
          </p>
          {annotation.resolutions.map((resolution) => (
            <p key={resolution.id} className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {resolution.resolvedByName}
              </span>{' '}
              → <span className="font-semibold">{formatRelative(resolution.at)}</span> ·{' '}
              {resolution.comment ?? 'No comment'}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
