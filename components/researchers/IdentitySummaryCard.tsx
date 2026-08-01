'use client';

import Badge from '@/components/ui/Badge';
import { buildResearcherUrl } from '@/lib/researchers';
import type { ResearcherProfile } from '@/types/researcher';

type IdentitySummaryCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function IdentitySummaryCard({ researcher, className = '' }: IdentitySummaryCardProps) {
  const { identity, position, verification } = researcher;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {researcher.avatar}
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{identity.said}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{identity.displayName}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {position.title} • {position.institution} • {position.country}
      </p>
      <p className="mt-1 font-mono text-sm text-slate-500">{buildResearcherUrl(researcher.username)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="success">{verification.verificationStatus}</Badge>
        <Badge variant="info">{identity.orcid}</Badge>
      </div>
      <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Identity score</dt>
          <dd className="font-semibold text-slate-900">{verification.identityScore}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Trust score</dt>
          <dd className="font-semibold text-slate-900">{verification.trustScore}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Member since</dt>
          <dd className="font-semibold text-slate-900">{identity.memberSince}</dd>
        </div>
      </dl>
    </section>
  );
}
