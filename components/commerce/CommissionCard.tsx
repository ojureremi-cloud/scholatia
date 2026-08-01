import React from 'react';
import { CommissionStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate, formatPercent } from './format';
import type { CommerceCommission } from '@/types/commerce';

type CommissionCardProps = {
  commission: CommerceCommission;
};

export default function CommissionCard({ commission }: CommissionCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-900">{commission.id}</p>
          <p className="mt-0.5 text-xs text-slate-400">Order {commission.orderId}</p>
        </div>
        <CommissionStatusBadge status={commission.status} />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-slate-600">{commission.ratePercent}% commission</span>
          <span className="text-2xl font-semibold text-slate-900">
            {formatCurrency(commission.amount, commission.currency)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Gross sale</span>
          <span className="font-medium text-slate-800">{formatCurrency(commission.grossAmount, commission.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span>Vendor keeps</span>
          <span className="font-medium text-slate-800">
            {formatCurrency(commission.grossAmount - commission.amount, commission.currency)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Created {formatDate(commission.createdAt)}</span>
        <span>{commission.paidAt ? `Paid ${formatDate(commission.paidAt)}` : formatPercent(commission.ratePercent)}</span>
      </div>
    </article>
  );
}
