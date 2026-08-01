'use client';

import React from 'react';
import FundingBadge from './FundingBadge';
import { formatAmount, formatDate } from './format';
import type { Grant } from '@/types/funding';

type GrantStatusCardProps = {
  grant: Grant;
  className?: string;
};

export default function GrantStatusCard({ grant, className = '' }: GrantStatusCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{grant.agencyName}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{grant.title}</h3>
        </div>
        <FundingBadge status={grant.status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{grant.summary}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Stage</p>
          <p className="mt-1 font-medium text-slate-900">{grant.applicationStage.replace(/-/g, ' ')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Grant number</p>
          <p className="mt-1 font-medium text-slate-900">{grant.grantNumber ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Requested</p>
          <p className="mt-1 font-medium text-slate-900">
            {grant.requestedAmount !== undefined ? formatAmount(grant.requestedAmount, grant.funding.currency) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Awarded</p>
          <p className="mt-1 font-medium text-slate-900">
            {grant.awardedAmount !== undefined ? formatAmount(grant.awardedAmount, grant.funding.currency) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Start</p>
          <p className="mt-1 font-medium text-slate-900">{grant.startDate ? formatDate(grant.startDate) : '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">End</p>
          <p className="mt-1 font-medium text-slate-900">{grant.endDate ? formatDate(grant.endDate) : '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Deadline</p>
          <p className="mt-1 font-medium text-slate-900">
            {grant.applicationDeadline ? formatDate(grant.applicationDeadline) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Decision</p>
          <p className="mt-1 font-medium text-slate-900">{grant.decisionDate ? formatDate(grant.decisionDate) : '—'}</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Principal investigator</p>
        <p className="mt-1 font-semibold text-slate-900">{grant.principalInvestigator.name}</p>
        <p className="text-sm text-slate-500">
          {grant.principalInvestigator.institution} · {grant.principalInvestigator.said}
        </p>
      </div>
      {grant.reporting.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Reporting obligations</p>
          <ul className="mt-2 space-y-1">
            {grant.reporting.map((item) => (
              <li key={item} className="text-sm text-slate-600">• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
