'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { JournalProfile, JournalQuartile } from '@/types/identity';

type JournalImpactCardProps = {
  journal: JournalProfile;
  className?: string;
};

const quartileVariant: Record<JournalQuartile, 'success' | 'info' | 'warning' | 'danger'> = {
  Q1: 'success',
  Q2: 'info',
  Q3: 'warning',
  Q4: 'danger',
};

export default function JournalImpactCard({ journal, className = '' }: JournalImpactCardProps) {
  const metrics = journal.impactMetrics ?? {};
  const values = [
    { label: 'Impact factor', value: metrics.impactFactor ? metrics.impactFactor.toFixed(2) : '—' },
    { label: '5-year IF', value: metrics.fiveYearImpactFactor ? metrics.fiveYearImpactFactor.toFixed(2) : '—' },
    { label: 'CiteScore', value: metrics.citeScore ? metrics.citeScore.toFixed(1) : '—' },
    { label: 'SJR', value: metrics.sjr ? metrics.sjr.toFixed(2) : '—' },
    { label: 'SNIP', value: metrics.snip ? metrics.snip.toFixed(2) : '—' },
    { label: 'h-index', value: metrics.hIndex ? `${metrics.hIndex}` : '—' },
  ];

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {values.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 p-4">
        <span className="text-sm font-medium text-slate-700">Scimago quartile</span>
        {metrics.quartile ? (
          <Badge variant={quartileVariant[metrics.quartile]}>{metrics.quartile}</Badge>
        ) : (
          <span className="text-sm text-slate-500">Not ranked</span>
        )}
        {metrics.totalCitations ? (
          <span className="text-xs text-slate-500">
            Citations: {metrics.totalCitations.toLocaleString('en-US')}
          </span>
        ) : null}
      </div>
    </div>
  );
}
