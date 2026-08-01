import React from 'react';
import { formatNumber } from './format';
import type { CommerceCurrency } from '@/types/commerce';

type CurrencyCardProps = {
  currency: CommerceCurrency;
};

export default function CurrencyCard({ currency }: CurrencyCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-lg font-semibold text-slate-900">{currency.code}</p>
        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold',
            currency.supported ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {currency.supported ? 'Settlement rail' : 'Display only'}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {currency.name} · {currency.symbol}
      </p>
      <p className="mt-4 text-xs text-slate-400">{formatNumber(currency.minorUnit)} decimal places</p>
    </article>
  );
}
