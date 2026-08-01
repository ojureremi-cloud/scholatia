'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type InnovationCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function InnovationCard({ researcher, className = '' }: InnovationCardProps) {
  const { innovations } = researcher;
  if (innovations.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No innovations recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Innovations</h3>
      <ul className="mt-5 space-y-3">
        {innovations.map((innovation) => (
          <li key={innovation.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{innovation.title}</p>
              <Badge>{innovation.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{innovation.category} • {innovation.year}</p>
            <p className="mt-2 text-sm text-slate-600">{innovation.description}</p>
            {innovation.impact ? <p className="mt-2 text-sm text-slate-600">Impact: {innovation.impact}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
