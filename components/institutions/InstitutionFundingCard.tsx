'use client';

import React from 'react';
import type { InstitutionFunding } from '@/types/institution';

type InstitutionFundingCardProps = {
  entries: InstitutionFunding[];
  className?: string;
};

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function InstitutionFundingCard({ entries, className = '' }: InstitutionFundingCardProps) {
  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{entry.source}</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{entry.year}</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-slate-900">{formatAmount(entry.amount, entry.currency)}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{entry.type}</p>
          {entry.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
