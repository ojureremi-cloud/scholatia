'use client';

import type { ActivityItem } from '@/types/activity';

type ReactionBarProps = {
  activity: ActivityItem;
  currentUserId: string;
  palette: readonly string[];
  onReact?: (activityId: string, emoji: string) => void;
  onUnreact?: (activityId: string, emoji: string) => void;
};

export function ReactionBar({ activity, currentUserId, palette, onReact, onUnreact }: ReactionBarProps) {
  const myReactions = activity.reactions.filter((reaction) => reaction.actorId === currentUserId);

  const toggle = (emoji: string) => {
    if (!onReact && !onUnreact) return;
    if (myReactions.some((reaction) => reaction.emoji === emoji)) {
      onUnreact?.(activity.id, emoji);
    } else {
      onReact?.(activity.id, emoji);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {palette.map((emoji) => {
        const reacted = myReactions.some((reaction) => reaction.emoji === emoji);
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => toggle(emoji)}
            title={reacted ? `Remove ${emoji}` : `React with ${emoji}`}
            className={[
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition',
              reacted
                ? 'border-sky-400 bg-sky-100 dark:border-sky-500 dark:bg-sky-900'
                : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span>{emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
