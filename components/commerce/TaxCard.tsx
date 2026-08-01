import React from 'react';
import { formatPercent } from './format';
import type { CommerceTaxRate } from '@/types/commerce';

type TaxCardProps = {
  rate: CommerceTaxRate;
};

export default function TaxCard({ rate }: TaxCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{rate.name}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{rate.appliesTo}</span>
      </div>
      <p className="mt-0.5 text-xs text-slate-400">{rate.jurisdiction}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(rate.ratePercent)}</p>
      <p className="mt-1 text-xs text-slate-500">applied on applicable line items</p>
    </article>
  );
}
