import { formatNumber } from './format';
import type { ActivityReaction } from '@/types/activity';

type ReactionSummaryProps = {
  reactions: ActivityReaction[];
};

export function ReactionSummary({ reactions }: ReactionSummaryProps) {
  const grouped = new Map<string, number>();
  for (const reaction of reactions) {
    grouped.set(reaction.emoji, (grouped.get(reaction.emoji) ?? 0) + 1);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from(grouped.entries()).map(([emoji, count]) => (
        <span
          key={emoji}
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          <span>{emoji}</span>
          <span className="font-semibold">{formatNumber(count)}</span>
        </span>
      ))}
    </div>
  );
}
