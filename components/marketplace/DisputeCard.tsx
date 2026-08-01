import React from 'react';
import { DisputeSeverityBadge, DisputeStatusBadge } from './MarketplaceBadge';
import { formatDate } from './format';
import type { MarketplaceDispute } from '@/types/marketplace';

type DisputeCardProps = {
  dispute: MarketplaceDispute;
};

export default function DisputeCard({ dispute }: DisputeCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DisputeStatusBadge status={dispute.status} />
          <DisputeSeverityBadge severity={dispute.severity} />
        </div>
        <span className="text-xs text-slate-400">order {dispute.orderId}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{dispute.subject}</h3>
      <p className="mt-1 text-xs text-slate-400">
        Opened by {dispute.openedBy} · {formatDate(dispute.openedAt)}
      </p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{dispute.description}</p>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        {dispute.messages.map((message) => (
          <div key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700">
              {message.from} <span className="font-normal text-slate-400">· {formatDate(message.sentAt)}</span>
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{message.body}</p>
          </div>
        ))}
      </div>

      {dispute.resolvedAt ? (
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-emerald-600">
          Resolved {formatDate(dispute.resolvedAt)}
        </p>
      ) : null}
    </article>
  );
}
