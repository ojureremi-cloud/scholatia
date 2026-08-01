'use client';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { buildResearcherUrl } from '@/lib/researchers';
import type { ResearcherProfile } from '@/types/researcher';

type ResearcherCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearcherCard({ researcher, className = '' }: ResearcherCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {researcher.avatar}
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{researcher.position.title}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{researcher.displayName}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {researcher.position.institution} • {researcher.country}
      </p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{researcher.headline}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="success">Verified</Badge>
        <Badge>{researcher.identity.orcid}</Badge>
      </div>
      <div className="mt-5">
        <Button variant="secondary" size="sm" href={buildResearcherUrl(researcher.username)}>
          View profile
        </Button>
      </div>
    </div>
  );
}
