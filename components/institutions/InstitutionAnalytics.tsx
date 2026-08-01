'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { InstitutionAnalytics as InstitutionAnalyticsType } from '@/types/institution';

type InstitutionAnalyticsProps = {
  analytics: InstitutionAnalyticsType;
  className?: string;
};

function formatFunding(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function InstitutionAnalytics({ analytics, className = '' }: InstitutionAnalyticsProps) {
  const stats = [
    { label: 'Research outputs', value: analytics.researchOutputs },
    { label: 'Publications', value: analytics.publications },
    { label: 'Citations', value: analytics.citations },
    { label: 'h-index', value: analytics.hIndex },
    { label: 'Journals connected', value: analytics.journalsConnected },
    { label: 'Conference papers', value: analytics.conferencePapers },
    { label: 'Datasets published', value: analytics.datasetsPublished },
    { label: 'Active projects', value: analytics.activeProjects },
    { label: 'Completed projects', value: analytics.completedProjects },
    { label: 'Active grants', value: analytics.activeGrants },
    { label: 'Researchers', value: analytics.researchers },
    { label: 'International partners', value: analytics.internationalPartners },
    { label: 'Collaborations', value: analytics.collaborations },
  ];
  const maxPublications = Math.max(
    ...analytics.publicationTrend.map((point) => point.publications),
    1
  );

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">{stat.value.toLocaleString('en-US')}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-700">Publication trend</p>
          <Badge variant="info">Total funding {formatFunding(analytics.totalFunding)}</Badge>
        </div>
        <div className="mt-5 flex items-end gap-4">
          {analytics.publicationTrend.map((point) => (
            <div key={point.period} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-700">{point.publications}</span>
              <div
                className="w-full rounded-t-lg bg-sky-600"
                style={{ height: `${Math.max(8, Math.round((point.publications / maxPublications) * 120))}px` }}
              />
              <span className="text-xs text-slate-500">{point.period}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
