import { formatNumber } from './format';
import type { TaskAnalytics as TaskAnalyticsData } from '@/types/tasks';

type TaskAnalyticsProps = {
  analytics: TaskAnalyticsData;
};

export function TaskAnalytics({ analytics }: TaskAnalyticsProps) {
  const max = Math.max(1, ...analytics.trend.map((entry) => entry.created + entry.completed));
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Trend (7 days)</h3>
        <div className="mt-6 flex h-32 items-end gap-2">
          {analytics.trend.map((entry) => (
            <div key={entry.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-sky-500" style={{ height: `${Math.max(6, (entry.created / max) * 100)}%` }} />
              <span className="text-[10px] text-slate-400">{entry.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">By assignee</h3>
        <ul className="mt-4 space-y-3">
          {analytics.byAssignee.map((entry) => (
            <li key={entry.assignee} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{entry.assigneeName ?? entry.assignee}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(entry.completed)} ✓ / {formatNumber(entry.open)} open
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Health</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{analytics.completionRate}%</p>
            <p className="text-[10px] uppercase text-slate-400">Completion</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{analytics.overdueRate}%</p>
            <p className="text-[10px] uppercase text-slate-400">Overdue rate</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{analytics.averageProgress}%</p>
            <p className="text-[10px] uppercase text-slate-400">Avg progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
