'use client';

import React from 'react';
import { formatAmount } from './format';
import type { FundingAgency } from '@/types/funding';

type FundingSourceCardProps = {
  agency: FundingAgency;
  className?: string;
};

export default function FundingSourceCard({ agency, className = '' }: FundingSourceCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Source</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{agency.name}</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Acronym</span>
          <span className="font-medium text-slate-900">{agency.acronym}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Type</span>
          <span className="font-medium text-slate-900">{agency.type.replace(/-/g, ' ')}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Location</span>
          <span className="font-medium text-slate-900">{agency.country}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Founded</span>
          <span className="font-medium text-slate-900">{agency.foundedYear ?? '—'}</span>
        </div>
        {agency.annualBudget !== undefined && agency.currency ? (
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Annual budget</span>
            <span className="font-medium text-slate-900">{formatAmount(agency.annualBudget, agency.currency)}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
        {agency.contact.email ? (
          <a href={`mailto:${agency.contact.email}`} className="block text-sky-700 hover:underline">{agency.contact.email}</a>
        ) : null}
        {agency.contact.phone ? <p className="text-slate-600">{agency.contact.phone}</p> : null}
        <a href={agency.website} className="block truncate text-sky-700 hover:underline" rel="noreferrer" target="_blank">
          {agency.website}
        </a>
        {agency.contact.applicationPortal ? (
          <a href={agency.contact.applicationPortal} className="block truncate text-sky-700 hover:underline" rel="noreferrer" target="_blank">
            Application portal
          </a>
        ) : null}
        {agency.contact.address ? <p className="text-slate-600">{agency.contact.address}</p> : null}
      </div>
      {agency.programmes.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Programmes</p>
          <ul className="mt-2 space-y-2">
            {agency.programmes.slice(0, 4).map((programme) => (
              <li key={programme.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                <p className="font-medium text-slate-900">{programme.name}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{programme.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
