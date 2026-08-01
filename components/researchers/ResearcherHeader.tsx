'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { buildResearcherUrl } from '@/lib/researchers';
import type { ResearcherProfile } from '@/types/researcher';

type ResearcherHeaderProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearcherHeader({ researcher, className = '' }: ResearcherHeaderProps) {
  const url = buildResearcherUrl(researcher.username);
  const subdomain = buildResearcherUrl(researcher.username, { mode: 'subdomain' });
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
            {researcher.avatar}
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{researcher.identity.said}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{researcher.displayName}</h2>
            <p className="mt-2 text-sm font-medium text-slate-700">{researcher.headline}</p>
            <p className="mt-1 text-sm text-slate-600">
              {researcher.position.title} • {researcher.position.institution} • {researcher.country}
            </p>
            <p className="mt-3 font-mono text-sm text-slate-500">{subdomain}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">{researcher.verification.verificationStatus}</Badge>
            <Badge variant="info">{researcher.identity.orcid}</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" href="/researchers">
              Researchers
            </Button>
            <Button size="sm" href={url}>
              Open profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
