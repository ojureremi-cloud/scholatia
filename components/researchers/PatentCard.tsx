'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type PatentCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function PatentCard({ researcher, className = '' }: PatentCardProps) {
  const { patents } = researcher;
  if (patents.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No patents recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Patents</h3>
      <ul className="mt-5 space-y-3">
        {patents.map((patent) => (
          <li key={patent.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{patent.title}</p>
              <Badge variant={patent.status === 'Granted' ? 'success' : 'warning'}>{patent.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{patent.patentNumber} • {patent.country} • {patent.year}</p>
            <p className="mt-1 text-sm text-slate-500">Inventors: {patent.inventors.join(', ')}</p>
            {patent.description ? <p className="mt-2 text-sm text-slate-600">{patent.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
