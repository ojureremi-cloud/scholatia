import React from 'react';
import { EscrowStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceEscrow } from '@/types/commerce';

type EscrowCardProps = {
  escrow: CommerceEscrow;
};

export default function EscrowCard({ escrow }: EscrowCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-900">{escrow.id}</p>
          <p className="mt-0.5 text-xs text-slate-400">Order {escrow.orderId}</p>
        </div>
        <EscrowStatusBadge status={escrow.status} />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(escrow.amount, escrow.currency)}</p>
        <p className="text-xs text-slate-500">Held since {formatDate(escrow.heldAt)}</p>
      </div>

      <div className="mt-4 flex-1 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Buyer</span>
          <span className="font-medium text-slate-800">{escrow.buyerId ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span>Vendor</span>
          <span className="font-medium text-slate-800">{escrow.vendorId}</span>
        </div>
        {escrow.releasedTo ? (
          <div className="flex justify-between">
            <span>Released to</span>
            <span className="font-medium text-slate-800">{escrow.releasedTo}</span>
          </div>
        ) : null}
      </div>

      {escrow.note ? <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">{escrow.note}</p> : null}

      {escrow.releasedAt ? (
        <p className="mt-3 text-right text-xs text-slate-400">Released {formatDate(escrow.releasedAt)}</p>
      ) : null}
    </article>
  );
}
