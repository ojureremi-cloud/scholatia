'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { JournalAnalytics } from '@/types/identity';

type JournalAnalyticsProps = {
  analytics: JournalAnalytics;
  className?: string;
};

export default function JournalAnalytics({ analytics, className = '' }: JournalAnalyticsProps) {
  const stats = [
    { label: 'Annual submissions', value: `${analytics.annualSubmissions}` },
    { label: 'Annual publications', value: `${analytics.annualPublications}` },
    {
      label: 'Downloads',
      value: analytics.totalDownloads ? analytics.totalDownloads.toLocaleString('en-US') : '—',
    },
    {
      label: 'Citations',
      value: analytics.totalCitations ? analytics.totalCitations.toLocaleString('en-US') : '—',
    },
    {
      label: 'Median first decision',
      value: analytics.medianDaysToFirstDecision ? `${analytics.medianDaysToFirstDecision} days` : '—',
    },
    {
      label: 'Median acceptance',
      value: analytics.medianDaysToAcceptance ? `${analytics.medianDaysToAcceptance} days` : '—',
    },
  ];

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      {analytics.googleScholarRank || analytics.altmetricScore ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 p-4">
          {analytics.googleScholarRank ? (
            <span className="text-sm font-medium text-slate-700">
              {analytics.googleScholarRank} (Google Scholar)
            </span>
          ) : null}
          {analytics.altmetricScore ? <Badge variant="info">Altmetric {analytics.altmetricScore}</Badge> : null}
        </div>
      ) : null}
    </div>
  );
}
