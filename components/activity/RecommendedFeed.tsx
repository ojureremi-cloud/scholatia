import { ActivityBadge } from './ActivityBadge';
import { formatRelative } from './format';
import type { ActivityRecommendation } from '@/types/activity';

type RecommendedFeedProps = {
  recommendations: ActivityRecommendation[];
};

export function RecommendedFeed({ recommendations }: RecommendedFeedProps) {
  return (
    <ul className="space-y-3">
      {recommendations.map((recommendation) => (
        <li
          key={recommendation.activity.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-2">
            <ActivityBadge type={recommendation.activity.type} />
            <span className="text-xs text-slate-400">{recommendation.score.toFixed(2)} score</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {recommendation.activity.title}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {recommendation.activity.actor.name} · {formatRelative(recommendation.activity.createdAt)}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
            {recommendation.activity.body}
          </p>
          <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
            {recommendation.reason}
          </p>
        </li>
      ))}
    </ul>
  );
}
