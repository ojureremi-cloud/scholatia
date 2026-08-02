import { ActivityBadge } from './ActivityBadge';
import { formatActivityTypeIcon, formatRelative } from './format';
import type { ActivityItem } from '@/types/activity';

type ActivityTimelineProps = {
  activities: ActivityItem[];
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
      {activities.map((activity) => (
        <li key={activity.id} className="relative">
          <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-sky-400 bg-white text-[10px] dark:bg-slate-900">
            {formatActivityTypeIcon(activity.type)}
          </span>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <ActivityBadge type={activity.type} />
              <span className="text-xs text-slate-400">
                {activity.actor.name} · {formatRelative(activity.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{activity.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{activity.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
