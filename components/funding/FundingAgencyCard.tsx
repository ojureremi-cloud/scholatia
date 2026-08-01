'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmount } from './format';
import type { FundingAgency } from '@/types/funding';

type FundingAgencyCardProps = {
  agency: FundingAgency;
  className?: string;
};

export default function FundingAgencyCard({ agency, className = '' }: FundingAgencyCardProps) {
  return (
    <div className={['flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{agency.logo}</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{agency.name}</h3>
            <p className="text-sm text-slate-500">{agency.acronym} · {agency.country}</p>
          </div>
        </div>
        <FundingBadge status={agency.verificationStatus} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{agency.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {agency.focusAreas.slice(0, 3).map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{area}</span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Trust</p>
          <p className="mt-1 font-semibold text-slate-900">{agency.trustScore}/100</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Type</p>
          <p className="mt-1 font-medium text-slate-900">{agency.type.replace(/-/g, ' ')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Avg award</p>
          <p className="mt-1 font-medium text-slate-900">
            {agency.averageAwardSize !== undefined && agency.currency
              ? formatAmount(agency.averageAwardSize, agency.currency)
              : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
