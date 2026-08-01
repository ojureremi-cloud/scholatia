import React from 'react';
import { formatDateLabel } from './format';
import type { AffiliationRecord } from '@/types/trust';

type AffiliationCardProps = {
  affiliation: AffiliationRecord;
};

export default function AffiliationCard({ affiliation }: AffiliationCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{affiliation.role}</span>
        <div className="flex items-center gap-2">
          {affiliation.current ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Current</span>
          ) : null}
          {affiliation.verified ? (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Verified</span>
          ) : null}
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{affiliation.institution}</h3>
      {affiliation.department ? <p className="mt-1 text-sm text-slate-600">{affiliation.department}</p> : null}
      <p className="mt-3 text-xs text-slate-400">
        {formatDateLabel(affiliation.startDate)} → {affiliation.endDate ? formatDateLabel(affiliation.endDate) : 'present'}
      </p>
    </article>
  );
}
