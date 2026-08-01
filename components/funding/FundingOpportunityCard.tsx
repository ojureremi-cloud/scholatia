'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmountRange, formatDate } from './format';
import type { FundingOpportunity } from '@/types/funding';

type FundingOpportunityCardProps = {
  opportunity: FundingOpportunity;
  className?: string;
};

export default function FundingOpportunityCard({ opportunity, className = '' }: FundingOpportunityCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{opportunity.agencyName}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{opportunity.title}</h3>
        </div>
        <FundingBadge status={opportunity.status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{opportunity.summary}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Funding</p>
          <p className="mt-1 font-semibold text-slate-900">{formatAmountRange(opportunity.funding)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Deadline</p>
          <p className="mt-1 font-semibold text-slate-900">{formatDate(opportunity.deadline)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Category</p>
          <p className="mt-1 font-medium text-slate-900">{opportunity.category.replace(/-/g, ' ')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Career stage</p>
          <p className="mt-1 font-medium text-slate-900">{opportunity.careerStage.replace(/-/g, ' ')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Duration</p>
          <p className="mt-1 font-medium text-slate-900">{opportunity.durationMonths} months</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Decision</p>
          <p className="mt-1 font-medium text-slate-900">
            {opportunity.decisionDate ? formatDate(opportunity.decisionDate) : '—'}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {opportunity.researchAreas.map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{area}</span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>📍 {opportunity.countries.join(', ')}</span>
        <span>🌐 {opportunity.continents.join(', ')}</span>
      </div>

      {opportunity.howToApply ? <p className="mt-4 text-sm leading-6 text-slate-600">{opportunity.howToApply}</p> : null}

      {opportunity.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
