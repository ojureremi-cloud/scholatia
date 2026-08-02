'use client';

import { useState } from 'react';
import { ActivityBadge } from './ActivityBadge';
import { ActivityVisibilityBadge } from './ActivityVisibilityBadge';
import { CommentList } from './CommentList';
import { ReactionBar } from './ReactionBar';
import { ReactionSummary } from './ReactionSummary';
import { activityHref, formatAttachmentTypeIcon, formatRelative } from './format';
import type { ActivityComment, ActivityItem } from '@/types/activity';

type ActivityCardProps = {
  activity: ActivityItem;
  comments: ActivityComment[];
  currentUserId: string;
  emojiPalette: readonly string[];
  isBookmarked?: boolean;
  isPinned?: boolean;
  onReact?: (activityId: string, emoji: string) => void;
  onUnreact?: (activityId: string, emoji: string) => void;
  onToggleBookmark?: () => void;
  onRepost?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onComment?: (activityId: string, body: string) => void;
  onReply?: (commentId: string, body: string) => void;
};

export function ActivityCard({
  activity,
  comments,
  currentUserId,
  emojiPalette,
  isBookmarked = false,
  isPinned = false,
  onReact,
  onUnreact,
  onToggleBookmark,
  onRepost,
  onPin,
  onUnpin,
  onComment,
  onReply,
}: ActivityCardProps) {
  const [showComments, setShowComments] = useState(false);

  const actionButton = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition';

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
          {activity.actor.avatar ?? '🧑‍🔬'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{activity.actor.name}</span>
            <span className="text-xs text-slate-400">@{activity.actor.username}</span>
            <span className="text-xs text-slate-400">· {formatRelative(activity.createdAt)}</span>
          </div>
          <p className="text-xs font-medium capitalize text-slate-500 dark:text-slate-400">
            {activity.verb}{' '}
            <a href={activityHref(activity)} className="text-sky-600 hover:underline dark:text-sky-400">
              {activity.source.title}
            </a>
          </p>
        </div>
        <ActivityVisibilityBadge visibility={activity.visibility} />
      </div>

      <div className="mt-4">
        <ActivityBadge type={activity.type} />
        {activity.title && (
          <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{activity.title}</h3>
        )}
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{activity.body}</p>

        {activity.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activity.hashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-900 dark:text-sky-300"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        )}

        {activity.mentions.length > 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Mentions:{' '}
            {activity.mentions.map((mention, index) => (
              <span key={mention.userId ?? mention.name} className="font-semibold text-slate-700 dark:text-slate-200">
                {index > 0 ? ' ' : ''}@{mention.username ?? mention.name}
              </span>
            ))}
          </p>
        )}

        {activity.attachments.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {activity.attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                <span>{formatAttachmentTypeIcon(attachment.type)}</span>
                <span className="truncate font-medium">{attachment.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <ReactionSummary reactions={activity.reactions} />
        <p className="text-xs text-slate-400">
          {activity.commentCount} comments · {activity.bookmarkCount} bookmarks · {activity.repostCount} reposts ·{' '}
          {activity.views} views
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ReactionBar
          activity={activity}
          currentUserId={currentUserId}
          palette={emojiPalette}
          onReact={onReact}
          onUnreact={onUnreact}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {onComment && (
          <button
            type="button"
            onClick={() => setShowComments((current) => !current)}
            className={[actionButton, 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'].join(' ')}
          >
            💬 Comments ({activity.commentCount})
          </button>
        )}
        {onToggleBookmark && (
          <button
            type="button"
            onClick={onToggleBookmark}
            className={[
              actionButton,
              isBookmarked
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200',
            ].join(' ')}
          >
            {isBookmarked ? '🔖 Saved' : '🔖 Save'}
          </button>
        )}
        {onRepost && (
          <button
            type="button"
            onClick={onRepost}
            className={[actionButton, 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'].join(' ')}
          >
            🔁 Repost
          </button>
        )}
        {(onPin || onUnpin) && (
          <button
            type="button"
            onClick={isPinned ? onUnpin : onPin}
            className={[
              actionButton,
              isPinned
                ? 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200',
            ].join(' ')}
          >
            {isPinned ? '📌 Pinned' : '📌 Pin'}
          </button>
        )}
      </div>

      {onComment && showComments && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <CommentList comments={comments} onReply={onReply} />
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const body = String(form.get('comment') ?? '').trim();
              if (body) onComment(activity.id, body);
              event.currentTarget.reset();
            }}
          >
            <input
              name="comment"
              placeholder="Write a comment…"
              className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
