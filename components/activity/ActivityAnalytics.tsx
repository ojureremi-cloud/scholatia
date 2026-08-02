import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { ActivityAnalytics } from '@/types/activity';

type ActivityAnalyticsProps = {
  analytics: ActivityAnalytics;
};

export function ActivityAnalytics({ analytics }: ActivityAnalyticsProps) {
  const peak = analytics.byDay.reduce<ActivityAnalytics['byDay'][number] | null>(
    (max, day) => (day.count > (max?.count ?? -1) ? day : max),
    null,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Total engagements" value={formatNumber(analytics.totalEngagements)} />
        <StatisticCard title="Engagement rate" value={formatPercent(analytics.engagementRate)} />
        <StatisticCard title="Avg per activity" value={analytics.averageEngagementPerActivity.toFixed(1)} />
        <StatisticCard title="Total views" value={formatNumber(analytics.totalViews)} />
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Activities per day{peak ? ` · peak ${peak.date}` : ''}
        </h4>
        <div className="flex items-end gap-1">
          {analytics.byDay.map((day) => (
            <div key={day.date} className="group flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-sky-500/80 transition group-hover:bg-sky-600"
                style={{
                  height: `${Math.max(4, (day.count / (analytics.byDay.reduce((max, d) => Math.max(max, d.count), 1) || 1)) * 72)}px`,
                }}
                title={`${day.date}: ${day.count} activities`}
              />
              <span className="text-[10px] text-slate-400">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
