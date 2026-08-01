'use client';

import type { ResearcherProfile } from '@/types/researcher';

type DatasetCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function DatasetCard({ researcher, className = '' }: DatasetCardProps) {
  const datasets = researcher.relationships.datasets;
  if (datasets.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No linked datasets.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Datasets</h3>
      <ul className="mt-5 space-y-3">
        {datasets.map((dataset) => (
          <li key={dataset.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{dataset.title}</p>
            {dataset.detail ? <p className="mt-1 break-all font-mono text-xs text-slate-500">{dataset.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
