'use client';

import type { ResearcherProfile } from '@/types/researcher';

type AwardCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function AwardCard({ researcher, className = '' }: AwardCardProps) {
  const { awards, honors } = researcher;
  if (awards.length === 0 && honors.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No awards or honours recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Awards and honours</h3>
      <ul className="mt-5 space-y-5">
        {awards.map((award) => (
          <li key={award.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{award.title}</p>
            <p className="mt-1 text-sm text-slate-600">
              {award.organisation} • {award.year}
            </p>
            {award.category ? <p className="mt-1 text-xs font-medium uppercase tracking-wider text-sky-700">{award.category}</p> : null}
            <p className="mt-2 text-sm text-slate-600">{award.description}</p>
          </li>
        ))}
        {honors.map((honor) => (
          <li key={honor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{honor.title}</p>
            <p className="mt-1 text-sm text-slate-600">
              {honor.organisation} • {honor.year}
            </p>
            <p className="mt-2 text-sm text-slate-600">{honor.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
