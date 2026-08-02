import { ActivityCard } from './ActivityCard';
import type { ActivityComment, ActivityItem } from '@/types/activity';

type ActivityFeedProps = {
  activities: ActivityItem[];
  comments: ActivityComment[];
  currentUserId: string;
  emojiPalette: readonly string[];
  isBookmarked?: (activityId: string) => boolean;
  isPinned?: (activityId: string) => boolean;
  onReact?: (activityId: string, emoji: string) => void;
  onUnreact?: (activityId: string, emoji: string) => void;
  onToggleBookmark?: (activity: ActivityItem) => void;
  onRepost?: (activity: ActivityItem) => void;
  onPin?: (activityId: string) => void;
  onUnpin?: (activityId: string) => void;
  onComment?: (activityId: string, body: string) => void;
  onReply?: (commentId: string, body: string) => void;
};

export function ActivityFeed({
  activities,
  comments,
  currentUserId,
  emojiPalette,
  isBookmarked,
  isPinned,
  onReact,
  onUnreact,
  onToggleBookmark,
  onRepost,
  onPin,
  onUnpin,
  onComment,
  onReply,
}: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="rounded-[1.75rem] border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-600">
        No activities match the current view.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          comments={comments.filter((comment) => comment.activityId === activity.id)}
          currentUserId={currentUserId}
          emojiPalette={emojiPalette}
          isBookmarked={isBookmarked?.(activity.id)}
          isPinned={isPinned?.(activity.id)}
          onReact={onReact}
          onUnreact={onUnreact}
          onToggleBookmark={onToggleBookmark ? () => onToggleBookmark(activity) : undefined}
          onRepost={onRepost ? () => onRepost(activity) : undefined}
          onPin={onPin ? () => onPin(activity.id) : undefined}
          onUnpin={onUnpin ? () => onUnpin(activity.id) : undefined}
          onComment={onComment}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
