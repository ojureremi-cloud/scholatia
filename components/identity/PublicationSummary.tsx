'use client';

import React from 'react';
import type { PublicationSummary as PublicationSummaryType } from '@/types/identity';

type PublicationSummaryProps = {
  summary: PublicationSummaryType;
  className?: string;
};

export default function PublicationSummary({ summary, className = '' }: PublicationSummaryProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Publication summary</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Articles</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalArticles}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Citations</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalCitations}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">H-index</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.hIndex ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
