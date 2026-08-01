import React from 'react';
import { SettlementStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import { calculateSettlement } from '@/lib/commerce';
import type { CommerceSettlement } from '@/types/commerce';

type SettlementCardProps = {
  settlement: CommerceSettlement;
};

export default function SettlementCard({ settlement }: SettlementCardProps) {
  const math = calculateSettlement({ gross: settlement.amount, currency: settlement.currency });

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
        <p className="text-xs text-slate-500">settled via {settlement.provider}</p>
      </div>

      <div className="mt-4 flex-1 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-500">
          <span>Gross payout</span>
          <span className="font-medium text-slate-800">{formatCurrency(math.gross, math.currency)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Marketplace commission</span>
          <span className="font-medium text-slate-800">{formatCurrency(math.commission, math.currency)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Platform fee</span>
          <span className="font-medium text-slate-800">{formatCurrency(math.platformFee, math.currency)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Withdrawal fee</span>
          <span className="font-medium text-slate-800">{formatCurrency(math.withdrawalFee, math.currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Net</span>
        <span className="text-base font-semibold text-slate-900">{formatCurrency(math.net, math.currency)}</span>
      </div>

      <div className="mt-3 flex justify-between text-xs text-slate-500">
        <span>Scheduled {formatDate(settlement.scheduledAt)}</span>
        {settlement.completedAt ? <span>Completed {formatDate(settlement.completedAt)}</span> : null}
      </div>
    </article>
  );
}
