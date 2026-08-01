'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmountRange, formatDate } from './format';
import type { FundingOpportunity } from '@/types/funding';

type FundingCardProps = {
  opportunity: FundingOpportunity;
  className?: string;
};

export default function FundingCard({ opportunity, className = '' }: FundingCardProps) {
  return (
    <div className={['flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{opportunity.agencyName}</p>
          <h3 className="mt-2 text-lg font-semibold leading-6 text-slate-900">{opportunity.title}</h3>
        </div>
        <FundingBadge status={opportunity.status} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{opportunity.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {opportunity.researchAreas.slice(0, 3).map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {area}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Deadline</p>
          <p className="mt-1 font-medium text-slate-900">{formatDate(opportunity.deadline)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Funding</p>
          <p className="mt-1 font-medium text-slate-900">{formatAmountRange(opportunity.funding)}</p>
        </div>
      </div>
    </div>
  );
}
