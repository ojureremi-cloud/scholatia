'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmount, formatDate } from './format';
import type { Grant } from '@/types/funding';

type FundingImpactCardProps = {
  grant: Grant;
  className?: string;
};

export default function FundingImpactCard({ grant, className = '' }: FundingImpactCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Impact</p>
        <FundingBadge status={grant.status} />
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{grant.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{grant.summary}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Awarded</p>
          <p className="mt-1 font-semibold text-slate-900">
            {grant.awardedAmount !== undefined ? formatAmount(grant.awardedAmount, grant.funding.currency) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Duration</p>
          <p className="mt-1 font-medium text-slate-900">{grant.durationMonths} months</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Start</p>
          <p className="mt-1 font-medium text-slate-900">{grant.startDate ? formatDate(grant.startDate) : '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Deliverables</p>
          <p className="mt-1 font-medium text-slate-900">{grant.deliverables.length}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {grant.researchAreas.map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{area}</span>
        ))}
      </div>
      {grant.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {grant.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
