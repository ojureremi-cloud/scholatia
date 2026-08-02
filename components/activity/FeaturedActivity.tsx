import Badge from '@/components/ui/Badge';
import { ActivityBadge } from './ActivityBadge';
import { activityHref, formatRelative } from './format';
import type { ActivityItem } from '@/types/activity';

type FeaturedActivityProps = {
  activity: ActivityItem;
};

export function FeaturedActivity({ activity }: FeaturedActivityProps) {
  return (
    <a
      href={activityHref(activity)}
      className="block rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition hover:border-sky-300 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="info">⭐ Featured</Badge>
        <ActivityBadge type={activity.type} />
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{activity.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{activity.body}</p>
      <p className="mt-3 text-xs text-slate-400">
        {activity.actor.name} · {formatRelative(activity.createdAt)}
      </p>
    </a>
  );
}
