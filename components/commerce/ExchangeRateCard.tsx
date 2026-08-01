import React from 'react';
import { formatDate } from './format';
import type { CommerceExchangeRate } from '@/types/commerce';

type ExchangeRateCardProps = {
  rate: CommerceExchangeRate;
};

export default function ExchangeRateCard({ rate }: ExchangeRateCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-lg font-semibold text-slate-900">
          {rate.from} <span className="text-slate-400">→</span> {rate.to}
        </p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">quoted</span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{rate.rate.toLocaleString()}</p>
      <p className="mt-1 text-xs text-slate-500">
        1 {rate.from} = {rate.rate} {rate.to}
      </p>
      <p className="mt-4 text-xs text-slate-400">Updated {formatDate(rate.updatedAt)}</p>
    </article>
  );
}
