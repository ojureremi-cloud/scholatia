import React from 'react';
import { RefundStatusBadge } from './MarketplaceBadge';
import { formatCurrency, formatDate } from './format';
import type { MarketplaceRefund } from '@/types/marketplace';

type RefundCardProps = {
  refund: MarketplaceRefund;
};

export default function RefundCard({ refund }: RefundCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{refund.id}</p>
          <p className="mt-0.5 text-xs text-slate-400">order {refund.orderId}</p>
        </div>
        <RefundStatusBadge status={refund.status} />
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{refund.reason}</p>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <div className="text-xs text-slate-500">
          <p>Requested {formatDate(refund.requestedAt)}</p>
          {refund.decidedBy ? <p className="mt-0.5">Decided by {refund.decidedBy}</p> : null}
        </div>
        <p className="text-xl font-semibold text-slate-900">{formatCurrency(refund.amount, refund.currency)}</p>
      </div>

      {refund.decidedAt ? (
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">Resolved {formatDate(refund.decidedAt)}</p>
      ) : null}
    </article>
  );
}
