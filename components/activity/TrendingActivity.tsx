import { ActivityBadge } from './ActivityBadge';
import { formatRelative } from './format';
import type { ActivityTrendingEntry } from '@/types/activity';

type TrendingActivityProps = {
  entries: ActivityTrendingEntry[];
};

export function TrendingActivity({ entries }: TrendingActivityProps) {
  return (
    <ol className="space-y-3">
      {entries.map((entry, index) => (
        <li
          key={entry.activity.id}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <span className="w-8 shrink-0 text-center text-lg font-black text-slate-300 dark:text-slate-600">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <ActivityBadge type={entry.activity.type} />
            <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {entry.activity.title}
            </p>
            <p className="text-xs text-slate-400">
              {entry.activity.actor.name} · {formatRelative(entry.activity.createdAt)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-emerald-600">{entry.score.toFixed(1)}</p>
            <p className="text-xs text-slate-400">trending</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
