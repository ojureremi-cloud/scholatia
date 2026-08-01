'use client';

import type { ResearcherProfile } from '@/types/researcher';

type CitationMetricsCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function CitationMetricsCard({ researcher, className = '' }: CitationMetricsCardProps) {
  const { citationMetrics } = researcher.impact;
  const max = Math.max(...citationMetrics.citationsByYear.map((entry) => entry.citations), 1);
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Citation metrics</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{citationMetrics.totalCitations.toLocaleString('en-US')}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Total citations</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{citationMetrics.hIndex}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">h-index</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{citationMetrics.i10Index}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">i10-index</p>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">Citations per year</p>
        <div className="mt-3 flex h-40 items-end gap-3">
          {citationMetrics.citationsByYear.map((entry) => (
            <div key={entry.year} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-xs font-semibold text-slate-700">{entry.citations}</span>
              <div
                className="w-full max-w-10 rounded-t-xl bg-sky-200"
                style={{ height: `${Math.max((entry.citations / max) * 100, 6)}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-3 border-t border-slate-200 pt-2">
          {citationMetrics.citationsByYear.map((entry) => (
            <span key={entry.year} className="flex-1 text-center text-xs font-medium text-slate-500">
              {entry.year}
            </span>
          ))}
        </div>
      </div>
      {citationMetrics.mostCitedWork ? (
        <p className="mt-5 text-sm text-slate-600">
          <span className="font-medium text-slate-900">Most cited work: </span>
          {citationMetrics.mostCitedWork}
        </p>
      ) : null}
    </section>
  );
}
