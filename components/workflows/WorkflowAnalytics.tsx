import { formatKind, formatNumber, formatStatus } from './format';
import type { WorkflowAnalytics as WorkflowAnalyticsData } from '@/types/workflows';

type WorkflowAnalyticsProps = {
  analytics: WorkflowAnalyticsData;
};

export function WorkflowAnalytics({ analytics }: WorkflowAnalyticsProps) {
  const max = Math.max(1, ...analytics.recentActivity.map((entry) => entry.count));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Status distribution</h3>
        <ul className="mt-4 space-y-3">
          {analytics.statusDistribution.map((entry) => (
            <li key={entry.status} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{formatStatus(entry.status)}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(entry.count)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Kinds</h3>
        <ul className="mt-4 space-y-3">
          {analytics.kindDistribution.map((entry) => (
            <li key={entry.kind} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{formatKind(entry.kind)}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(entry.count)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Activity (7 days)</h3>
        <div className="mt-6 flex h-32 items-end gap-2">
          {analytics.recentActivity.map((entry) => (
            <div key={entry.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-sky-500"
                style={{ height: `${Math.max(6, (entry.count / max) * 100)}%` }}
              />
              <span className="text-[10px] text-slate-400">{entry.date.slice(8)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{analytics.completionRate}%</p>
            <p className="text-[10px] uppercase text-slate-400">Completion</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{analytics.averageProgress}%</p>
            <p className="text-[10px] uppercase text-slate-400">Avg progress</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{analytics.deadlineHealth.overdue}</p>
            <p className="text-[10px] uppercase text-slate-400">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
