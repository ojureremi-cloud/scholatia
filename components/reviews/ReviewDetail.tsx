import { ReviewDecisionBadge, ReviewKindBadge, ReviewStatusBadge } from './ReviewBadges';
import { VoiceNoteCard } from './VoiceNoteCard';
import { commentTypeIcon, formatDateTime, formatRelative } from './format';
import type { Review, ReviewComment } from '@/types/reviews';

type ReviewDetailProps = {
  review: Review;
};

function CommentItem({ comment, depth = 0 }: { comment: ReviewComment; depth?: number }) {
  const text = comment.body ?? comment.voiceTranscript;
  return (
    <div className={depth > 0 ? 'ml-10 mt-3' : 'mt-0'}>
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm dark:bg-slate-800">
          {commentTypeIcon(comment.type)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{comment.authorName ?? comment.author}</span>
            <span className="text-xs text-slate-400">{formatRelative(comment.createdAt)}</span>
            {comment.type === 'voice' && comment.voiceTranscript ? <span className="text-xs text-violet-500">🎙️</span> : null}
          </div>
          {text && <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>}
          {comment.inlineAnchor && (
            <p className="mt-1 text-xs text-indigo-500">📌 {comment.inlineAnchor}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReviewDetail({ review }: ReviewDetailProps) {
  const topLevel = review.comments.filter((comment) => !comment.parentCommentId);
  const repliesByParent = review.comments.reduce<Record<string, ReviewComment[]>>((acc, comment) => {
    if (comment.parentCommentId) {
      (acc[comment.parentCommentId] ??= []).push(comment);
    }
    return acc;
  }, {});

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <ReviewKindBadge kind={review.kind} />
        <ReviewStatusBadge status={review.status} />
        {review.decision && <ReviewDecisionBadge decision={review.decision} />}
      </div>

      {review.title && <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">{review.title}</h3>}
      {review.description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{review.description}</p>}

      {review.voiceNotes.length > 0 && (
        <section className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">🎙️ Voice notes</h4>
          <div className="mt-3 space-y-3">
            {review.voiceNotes.map((voiceNote) => (
              <VoiceNoteCard key={voiceNote.id} voiceNote={voiceNote} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          💬 Comments ({review.comments.length})
        </h4>
        {review.comments.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No comments yet.</p>
        ) : (
          <div className="mt-3 space-y-5">
            {topLevel.map((comment) => (
              <div key={comment.id}>
                <CommentItem comment={comment} />
                {(repliesByParent[comment.id] ?? []).map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={1} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
        {review.submittedAt && <span>Submitted {formatDateTime(review.submittedAt)}</span>}
        {review.dueAt && <span>Due {formatDateTime(review.dueAt)}</span>}
        <span>Round {review.round}</span>
      </div>
    </article>
  );
}
