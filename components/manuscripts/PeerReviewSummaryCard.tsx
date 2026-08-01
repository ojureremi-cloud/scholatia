import React from 'react';
import Badge from '@/components/ui/Badge';
import type { PeerReviewSummary, Recommendation } from '@/types/manuscript';

const recommendationVariant: Record<Recommendation, 'success' | 'warning' | 'danger'> = {
  accept: 'success',
  'minor-revision': 'warning',
  'major-revision': 'warning',
  reject: 'danger',
};

type PeerReviewSummaryCardProps = {
  summary: PeerReviewSummary;
};

export function PeerReviewSummaryCard({ summary }: PeerReviewSummaryCardProps) {
  const stats = [
    { label: 'Review rounds', value: `${summary.reviewRounds}` },
    { label: 'Completed rounds', value: `${summary.completedRounds}` },
    { label: 'Invited reviewers', value: `${summary.invitedReviewers}` },
    { label: 'Completed reviews', value: `${summary.completedReviews}` },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-slate-700">{summary.summary}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 p-4">
        <span className="text-sm font-medium text-slate-700">Average recommendation</span>
        <Badge variant={recommendationVariant[summary.averageRecommendation]}>
          {summary.averageRecommendation}
        </Badge>
      </div>
    </div>
  );
}
