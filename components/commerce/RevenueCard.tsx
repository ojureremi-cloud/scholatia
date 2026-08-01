import React from 'react';
import { formatCurrency } from './format';
import type { CurrencyCode } from '@/types/funding';

type RevenueCardProps = {
  label: string;
  value: number;
  currency: CurrencyCode;
  icon?: string;
  sharePercent?: number;
};

export default function RevenueCard({ label, value, currency, icon, sharePercent }: RevenueCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      {icon ? <span className="text-xl">{icon}</span> : null}
      <p className="mt-3 text-2xl font-semibold text-slate-900">{formatCurrency(value, currency)}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">{label}</p>
      {sharePercent != null ? (
        <p className="mt-2 text-xs text-slate-400">{sharePercent}% of gross revenue</p>
      ) : null}
    </div>
  );
}
