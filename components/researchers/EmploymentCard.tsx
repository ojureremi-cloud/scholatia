'use client';

import type { ResearcherProfile } from '@/types/researcher';

type EmploymentCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function EmploymentCard({ researcher, className = '' }: EmploymentCardProps) {
  const { employment } = researcher;
  if (employment.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No employment history recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Employment</h3>
      <ul className="mt-5 space-y-5">
        {employment.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{entry.role}</p>
              {entry.current ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Current</span> : null}
            </div>
            <p className="mt-1 text-sm text-slate-600">{entry.organisation}</p>
            {entry.department ? <p className="mt-1 text-sm text-slate-500">{entry.department}</p> : null}
            <p className="mt-1 text-sm text-slate-500">
              {entry.startDate}
              {entry.endDate ? ` - ${entry.endDate}` : ' - Present'}
            </p>
            {entry.description ? <p className="mt-2 text-sm text-slate-600">{entry.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
