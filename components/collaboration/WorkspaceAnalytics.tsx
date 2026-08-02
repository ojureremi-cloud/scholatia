import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { CollaborationAnalytics } from '@/types/collaboration';

type WorkspaceAnalyticsProps = {
  analytics: CollaborationAnalytics;
};

export function WorkspaceAnalytics({ analytics }: WorkspaceAnalyticsProps) {
  const peak = analytics.byDay.reduce<CollaborationAnalytics['byDay'][number] | null>(
    (max, day) => (day.count > (max?.count ?? -1) ? day : max),
    null,
  );
  const maxDayCount = analytics.byDay.reduce((max, day) => Math.max(max, day.count), 1) || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Task completion" value={formatPercent(analytics.taskCompletionRate)} />
        <StatisticCard title="Milestone completion" value={formatPercent(analytics.milestoneCompletionRate)} />
        <StatisticCard title="Total task progress" value={formatPercent(analytics.totalTaskProgress)} />
        <StatisticCard title="Overdue tasks" value={formatNumber(analytics.overdueTasks)} trend={analytics.overdueTasks > 0 ? 'needs a sprint' : undefined} />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Upcoming meetings" value={formatNumber(analytics.upcomingMeetings)} />
        <StatisticCard title="Avg members / workspace" value={analytics.avgMembersPerWorkspace.toFixed(1)} />
        <StatisticCard title="Avg tasks / workspace" value={analytics.avgTasksPerWorkspace.toFixed(1)} />
        <StatisticCard title="Distinct tags" value={formatNumber(analytics.topTags.length)} />
      </div>

      {analytics.tasksByPriority.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {analytics.tasksByPriority.map((stat) => (
            <StatisticCard
              key={stat.priority}
              title={`${stat.priority} priority`}
              value={formatNumber(stat.count)}
              icon={stat.priority === 'urgent' ? '🚨' : stat.priority === 'high' ? '🔼' : stat.priority === 'medium' ? '➖' : '🔽'}
            />
          ))}
        </div>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Workspace activity per day{peak ? ` · peak ${peak.date}` : ''}
        </h4>
        <div className="flex items-end gap-1">
          {analytics.byDay.map((day) => (
            <div key={day.date} className="group flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-sky-500/80 transition group-hover:bg-sky-600"
                style={{ height: `${Math.max(4, (day.count / maxDayCount) * 72)}px` }}
                title={`${day.date}: ${day.count} events`}
              />
              <span className="text-[10px] text-slate-400">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
