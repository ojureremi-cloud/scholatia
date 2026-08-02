import React from 'react';
import { DisputeStatusBadge } from './ServiceBadge';
import { formatCurrency, formatDate } from './format';
import type { ServiceDispute } from '@/types/services';

type ServiceDisputeCardProps = {
  dispute: ServiceDispute;
};

export default function ServiceDisputeCard({ dispute }: ServiceDisputeCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-slate-900">{dispute.id}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            order {dispute.orderId} · opened by {dispute.openedBy} · {formatDate(dispute.openedAt)}
          </p>
        </div>
        <DisputeStatusBadge status={dispute.status} />
      </div>

      <p className="mt-4 font-medium text-slate-800">{dispute.subject}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{dispute.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{dispute.refunded ? 'Refunded to buyer' : 'No refund issued'}</span>
        {dispute.refundAmount != null && dispute.currency ? (
          <span className="font-medium text-slate-800">{formatCurrency(dispute.refundAmount, dispute.currency)}</span>
        ) : null}
      </div>

      {dispute.resolvedAt ? <p className="mt-3 text-xs text-slate-400">Resolved {formatDate(dispute.resolvedAt)}</p> : null}
    </article>
  );
}
