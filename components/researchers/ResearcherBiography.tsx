'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type ResearcherBiographyProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearcherBiography({ researcher, className = '' }: ResearcherBiographyProps) {
  const { biography } = researcher;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-slate-50 p-6', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Biography</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{biography.professionalSummary}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{biography.academicSummary}</p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{biography.fullBiography}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {biography.areasOfExpertise.map((area) => (
          <Badge key={area}>{area}</Badge>
        ))}
      </div>
    </section>
  );
}
