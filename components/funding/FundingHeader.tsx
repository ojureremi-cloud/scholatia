'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmount, formatDate } from './format';
import type { FundingAgency } from '@/types/funding';

type FundingHeaderProps = {
  agency: FundingAgency;
  className?: string;
};

export default function FundingHeader({ agency, className = '' }: FundingHeaderProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">{agency.logo}</span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{agency.name}</h2>
              <FundingBadge status={agency.verificationStatus} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {agency.acronym} · {agency.country} · {agency.continent}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{agency.description}</p>
            {agency.mission ? <p className="mt-2 max-w-2xl text-sm italic leading-6 text-slate-500">Mission: {agency.mission}</p> : null}
          </div>
        </div>
        <div className="flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-3xl font-semibold text-slate-900">{agency.trustScore}/100</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Trust score</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Founded</p>
          <p className="mt-1 font-medium text-slate-900">{agency.foundedYear ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Annual budget</p>
          <p className="mt-1 font-medium text-slate-900">
            {agency.annualBudget !== undefined && agency.currency ? formatAmount(agency.annualBudget, agency.currency) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Average award</p>
          <p className="mt-1 font-medium text-slate-900">
            {agency.averageAwardSize !== undefined && agency.currency ? formatAmount(agency.averageAwardSize, agency.currency) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Open opportunities</p>
          <p className="mt-1 font-medium text-slate-900">{agency.openOpportunities ?? '—'}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
        {agency.focusAreas.map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{area}</span>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Last refreshed {formatDate('2026-08-01')} · {agency.contact.email ?? agency.contact.website}
      </p>
    </div>
  );
}
