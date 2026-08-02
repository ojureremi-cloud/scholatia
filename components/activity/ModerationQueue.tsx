'use client';

import { ActivityBadge } from './ActivityBadge';
import { formatRelative } from './format';
import type { ActivityItem, ActivityModerationEntry, ActivityReport } from '@/types/activity';

type ModerationQueueProps = {
  queue: { activity: ActivityItem; reports: ActivityReport[] }[];
  onResolve?: (reportId: string) => void;
  onModerate?: (activityId: string, action: ActivityModerationEntry['action'], reason: string) => void;
};

export function ModerationQueue({ queue, onResolve, onModerate }: ModerationQueueProps) {
  if (queue.length === 0) {
    return <p className="text-sm text-slate-400">The moderation queue is clear.</p>;
  }

  return (
    <div className="space-y-4">
      {queue.map(({ activity, reports }) => (
        <div
          key={activity.id}
          className="rounded-2xl border border-rose-200 bg-white p-5 dark:border-rose-900 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ActivityBadge type={activity.type} />
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-900 dark:text-rose-200">
              {reports.length} report{reports.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{activity.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{activity.body}</p>
          <p className="mt-1 text-xs text-slate-400">
            {activity.actor.name} · {formatRelative(activity.createdAt)}
          </p>

          <ul className="mt-3 space-y-1">
            {reports.map((report) => (
              <li key={report.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{report.reportedByName}</span>{' '}
                  reported: {report.reason}
                  {report.detail ? ` — ${report.detail}` : ''}
                </span>
                {report.status === 'open' && onResolve && (
                  <button
                    type="button"
                    onClick={() => onResolve(report.id)}
                    className="shrink-0 rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
                  >
                    Resolve
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onModerate && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onModerate(activity.id, 'hidden', 'Moderation decision: content hidden')}
                className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Hide content
              </button>
              <button
                type="button"
                onClick={() => onModerate(activity.id, 'removed', 'Moderation decision: content removed')}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Remove content
              </button>
              <button
                type="button"
                onClick={() => onModerate(activity.id, 'flagged', 'Moderation decision: content flagged for review')}
                className="rounded-full border border-amber-300 px-4 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-200"
              >
                Flag for review
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
