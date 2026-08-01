import React from 'react';
import { RefundStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate, formatRefundReason } from './format';
import type { CommerceRefund } from '@/types/commerce';

type RefundCardProps = {
  refund: CommerceRefund;
};

export default function RefundCard({ refund }: RefundCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-900">{refund.refundNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">Order {refund.orderId}</p>
        </div>
        <RefundStatusBadge status={refund.status} />
      </div>

      <div className="mt-4 rounded-2xl bg-rose-50 px-5 py-4">
        <p className="text-2xl font-semibold text-rose-900">{formatCurrency(refund.amount, refund.currency)}</p>
        <p className="mt-0.5 text-xs text-rose-700">{formatRefundReason(refund.reason)}</p>
      </div>

      {refund.note ? <p className="mt-4 text-sm leading-relaxed text-slate-600">{refund.note}</p> : null}

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Requested</span>
          <span className="font-medium text-slate-800">{formatDate(refund.requestedAt)}</span>
        </div>
        {refund.decidedAt ? (
          <div className="flex justify-between">
            <span>Decided</span>
            <span className="font-medium text-slate-800">{formatDate(refund.decidedAt)}</span>
          </div>
        ) : null}
        {refund.decidedBy ? (
          <div className="flex justify-between">
            <span>Decided by</span>
            <span className="font-medium text-slate-800">{refund.decidedBy}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
