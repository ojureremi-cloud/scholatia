import { formatNumber } from './format';
import type { ReviewAnalytics as ReviewAnalyticsData } from '@/types/reviews';

type ReviewAnalyticsProps = {
  analytics: ReviewAnalyticsData;
};

export function ReviewAnalytics({ analytics }: ReviewAnalyticsProps) {
  const maxDecisions = Math.max(1, ...analytics.decisions.map((entry) => entry.count));
  const maxRounds = Math.max(1, ...analytics.roundsDistribution.map((entry) => entry.count));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Decisions</h3>
        <div className="mt-4 space-y-2">
          {analytics.decisions.map((entry) => (
            <div key={entry.decision} className="flex items-center gap-2">
              <span className="w-32 shrink-0 text-xs text-slate-500">{entry.decision}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(entry.count / maxDecisions) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-xs font-bold text-slate-600 dark:text-slate-300">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Rounds distribution</h3>
        <div className="mt-4 space-y-2">
          {analytics.roundsDistribution.map((entry) => (
            <div key={entry.round} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs text-slate-500">Round {entry.round}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${(entry.count / maxRounds) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-xs font-bold text-slate-600 dark:text-slate-300">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Approvals</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatNumber(analytics.approvals.total)}</p>
            <p className="text-[10px] uppercase text-slate-400">Total</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-amber-600">{formatNumber(analytics.approvals.pending)}</p>
            <p className="text-[10px] uppercase text-slate-400">Pending</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-emerald-600">{formatNumber(analytics.approvals.approved)}</p>
            <p className="text-[10px] uppercase text-slate-400">Approved</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-rose-600">{formatNumber(analytics.approvals.rejected)}</p>
            <p className="text-[10px] uppercase text-slate-400">Rejected</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">🎙️ {formatNumber(analytics.voiceNotes)}</p>
            <p className="text-[10px] uppercase text-slate-400">Voice notes</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">💬 {formatNumber(analytics.totalComments)}</p>
            <p className="text-[10px] uppercase text-slate-400">Comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
