'use client';

import type { ResearcherProfile } from '@/types/researcher';

type EducationCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function EducationCard({ researcher, className = '' }: EducationCardProps) {
  const { education } = researcher;
  if (education.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No education history recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Education</h3>
      <ul className="mt-5 space-y-5">
        {education.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{entry.degree}</p>
            <p className="mt-1 text-sm text-slate-600">{entry.institution}</p>
            <p className="mt-1 text-sm text-slate-500">
              {entry.field} • {entry.startDate}
              {entry.endDate ? ` - ${entry.endDate}` : ''}
            </p>
            {entry.description ? <p className="mt-2 text-sm text-slate-600">{entry.description}</p> : null}
            {entry.honors && entry.honors.length > 0 ? (
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Honours: </span>
                {entry.honors.join(', ')}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
