import React from 'react';
import { SettlementStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceSettlement } from '@/types/commerce';

type PayoutCardProps = {
  settlement: CommerceSettlement;
};

export default function PayoutCard({ settlement }: PayoutCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-900">{settlement.reference}</p>
          <p className="mt-0.5 text-xs text-slate-400">{settlement.vendorName}</p>
        </div>
        <SettlementStatusBadge status={settlement.status} />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(settlement.amount, settlement.currency)}</p>
        <p className="text-xs text-slate-500">via {settlement.provider}</p>
      </div>

      <div className="mt-4 flex-1 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Scheduled</span>
          <span className="font-medium text-slate-800">{formatDate(settlement.scheduledAt)}</span>
        </div>
        {settlement.completedAt ? (
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="font-medium text-slate-800">{formatDate(settlement.completedAt)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Vendor</span>
        <span className="text-sm font-semibold text-slate-800">{settlement.vendorId}</span>
      </div>
    </article>
  );
}
