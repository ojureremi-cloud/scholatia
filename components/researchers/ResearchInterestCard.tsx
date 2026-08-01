'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type ResearchInterestCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchInterestCard({ researcher, className = '' }: ResearchInterestCardProps) {
  const { interests, researchAreas } = researcher;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Research interests</h3>
      <ul className="mt-5 space-y-3">
        {interests.map((interest) => (
          <li key={interest.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{interest.name}</p>
              <Badge>{interest.category}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">{interest.keywords.join(' • ')}</p>
          </li>
        ))}
      </ul>
      {researchAreas.length > 0 ? (
        <>
          <p className="mt-6 text-sm font-medium text-slate-500">Research areas</p>
          <ul className="mt-3 space-y-3">
            {researchAreas.map((area) => (
              <li key={area.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{area.name}</p>
                {area.description ? <p className="mt-1 text-sm text-slate-600">{area.description}</p> : null}
                <p className="mt-1 text-xs text-slate-500">
                  {area.publications} publications • {area.citations.toLocaleString('en-US')} citations
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
