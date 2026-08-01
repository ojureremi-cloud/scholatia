'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmount, formatDate } from './format';
import type { Award } from '@/types/funding';

type AwardCardProps = {
  award: Award;
  className?: string;
};

export default function AwardCard({ award, className = '' }: AwardCardProps) {
  return (
    <div className={['flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{award.agencyName}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{award.title}</h3>
        </div>
        <FundingBadge status={award.status} />
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{formatAmount(award.amount, award.currency)}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{award.fundedResearch}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {award.researchAreas.slice(0, 3).map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{area}</span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Awarded</p>
          <p className="mt-1 font-medium text-slate-900">{formatDate(award.awardedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Duration</p>
          <p className="mt-1 font-medium text-slate-900">{award.durationMonths} months</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">PI</p>
          <p className="mt-1 font-medium text-slate-900">{award.principalInvestigator}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Grant no.</p>
          <p className="mt-1 font-medium text-slate-900">{award.grantNumber ?? '—'}</p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm text-slate-500">
        {award.institution}
        {award.partnerInstitutions.length > 0
          ? ` · ${award.partnerInstitutions.map((partner) => partner.name).join(', ')}`
          : ''}
      </p>
    </div>
  );
}
