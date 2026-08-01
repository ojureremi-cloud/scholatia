'use client';

import React from 'react';
import type { EditorialDecisionStatistics } from '@/types/identity';

type EditorialDecisionStatisticsProps = {
  statistics: EditorialDecisionStatistics;
  className?: string;
};

export default function EditorialDecisionStatistics({
  statistics,
  className = '',
}: EditorialDecisionStatisticsProps) {
  const stats = [
    { label: 'Submitted', value: statistics.submitted },
    { label: 'Under review', value: statistics.underReview },
    { label: 'In revision', value: statistics.inRevision },
    { label: 'Accepted', value: statistics.accepted },
    { label: 'Rejected', value: statistics.rejected },
    { label: 'In production', value: statistics.inProduction },
    { label: 'Published', value: statistics.published },
  ];

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{statistics.avgDaysToFirstDecision} days</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Median first decision</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{statistics.avgDaysToAcceptance} days</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Median acceptance</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Acceptance rate</span>
            <span className="font-semibold text-emerald-600">{statistics.acceptanceRate}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${statistics.acceptanceRate}%` }}
              role="progressbar"
              aria-valuenow={statistics.acceptanceRate}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Rejection rate</span>
            <span className="font-semibold text-rose-600">{statistics.rejectionRate}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-rose-500"
              style={{ width: `${statistics.rejectionRate}%` }}
              role="progressbar"
              aria-valuenow={statistics.rejectionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
