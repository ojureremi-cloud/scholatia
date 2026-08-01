'use client';

import type { ResearcherProfile } from '@/types/researcher';

type PublicationTrendChartProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function PublicationTrendChart({ researcher, className = '' }: PublicationTrendChartProps) {
  const { publicationTrend } = researcher.analytics;
  const max = Math.max(...publicationTrend.map((point) => point.publications), 1);
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Publication trend</h3>
      <p className="mt-1 text-sm text-slate-600">Publications per period from the researcher analytics record.</p>
      <div className="mt-5 flex h-40 items-end gap-4">
        {publicationTrend.map((point) => (
          <div key={point.period} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs font-semibold text-slate-700">{point.publications}</span>
            <div
              className="w-full max-w-12 rounded-t-xl bg-indigo-200"
              style={{ height: `${Math.max((point.publications / max) * 100, 8)}%` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 border-t border-slate-200 pt-2">
        {publicationTrend.map((point) => (
          <span key={point.period} className="flex-1 text-center text-sm font-medium text-slate-500">
            {point.period}
          </span>
        ))}
      </div>
    </section>
  );
}
