import React from 'react';
import { RecommendationBadge } from './TrustBadge';
import { formatPercent } from './format';
import type { ReviewerAnalytics } from '@/types/trust';

type ReviewerAnalyticsPanelProps = {
  analytics: ReviewerAnalytics;
};

export default function ReviewerAnalyticsPanel({ analytics }: ReviewerAnalyticsPanelProps) {
  const maxCount = Math.max(...analytics.recommendationDistribution.map((entry) => entry.count), 1);
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Reviewer pool analytics</p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{analytics.totalAssignments}</p>
          <p className="text-xs text-slate-500">Total assignments</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{analytics.completedReviews}</p>
          <p className="text-xs text-slate-500">Completed reviews</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatPercent(analytics.invitationAcceptanceRate)}</p>
          <p className="text-xs text-slate-500">Invitation acceptance</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{analytics.averageTurnaroundDays}d</p>
          <p className="text-xs text-slate-500">Avg turnaround</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatPercent(analytics.onTimeRate)}</p>
          <p className="text-xs text-slate-500">On-time rate</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{analytics.conflictDeclarations}</p>
          <p className="text-xs text-slate-500">Conflict declarations</p>
        </div>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Recommendation distribution</p>
        <ul className="mt-3 space-y-3">
          {analytics.recommendationDistribution.map((entry) => (
            <li key={entry.recommendation}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2">
                  <RecommendationBadge recommendation={entry.recommendation} />
                </span>
                <span className="font-semibold text-slate-700">{entry.count}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-sky-600" style={{ width: `${(entry.count / maxCount) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-400">Average review length: {analytics.averageReviewLength.toLocaleString('en-US')} words</p>
      </div>
    </article>
  );
}
