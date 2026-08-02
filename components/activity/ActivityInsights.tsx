import Badge from '@/components/ui/Badge';
import type { ActivityInsight } from '@/types/activity';

type ActivityInsightsProps = {
  insights: ActivityInsight[];
};

const insightVariant: Record<ActivityInsight['type'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  trend: 'info',
  cluster: 'warning',
  spotlight: 'success',
  summary: 'default',
  opportunity: 'warning',
};

export function ActivityInsights({ insights }: ActivityInsightsProps) {
  return (
    <ul className="space-y-3">
      {insights.map((insight) => (
        <li
          key={insight.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{insight.title}</p>
            <Badge variant={insightVariant[insight.type]}>{insight.type}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{insight.body}</p>
        </li>
      ))}
    </ul>
  );
}
