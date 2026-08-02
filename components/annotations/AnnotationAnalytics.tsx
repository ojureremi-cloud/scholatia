import { Badge } from '@/components/ui';
import type { AnnotationAnalytics } from '@/types/annotations';
import { annotationTypeIcon, formatAnnotationType } from './format';

type AnnotationAnalyticsProps = {
  analytics: AnnotationAnalytics;
};

function StatRow({
  label,
  count,
  total,
  icon,
}: {
  label: string;
  count: number;
  total: number;
  icon?: string;
}) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 flex-shrink-0 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
        {icon ? `${icon} ` : ''}
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-10 flex-shrink-0 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
        {count}
      </span>
    </div>
  );
}

export function AnnotationAnalytics({ analytics }: AnnotationAnalyticsProps) {
  const totalByType = analytics.byType.reduce((sum, stat) => sum + stat.count, 0);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Annotations by type
        </p>
        <div className="mt-4 space-y-3">
          {analytics.byType.map((stat) => (
            <StatRow
              key={stat.type}
              label={formatAnnotationType(stat.type)}
              icon={annotationTypeIcon(stat.type)}
              count={stat.count}
              total={totalByType}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Decision mix
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.decisions.map((stat) => (
              <Badge key={stat.decision} variant="default">
                {stat.decision} · {stat.count}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Source distribution
          </p>
          <div className="mt-4 space-y-3">
            {analytics.bySource.map((stat) => (
              <StatRow
                key={`${stat.sourceEntity}-${stat.sourceId}`}
                label={`${stat.sourceEntity} · ${stat.sourceId}`}
                count={stat.count}
                total={analytics.bySource.reduce((sum, entry) => sum + entry.count, 0)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Voice & suggestions
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {analytics.voiceLinked}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">Voice linked</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {analytics.suggestionRate}%
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">Suggestion rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
