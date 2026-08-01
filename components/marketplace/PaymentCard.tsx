import React from 'react';
import { PaymentMethodBadge, PaymentStatusBadge } from './MarketplaceBadge';
import { formatCurrency, formatDate } from './format';
import type { MarketplacePayment } from '@/types/marketplace';

type PaymentCardProps = {
  payment: MarketplacePayment;
};

export default function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{payment.reference ?? payment.id}</p>
          <p className="mt-0.5 text-xs text-slate-400">order {payment.orderId}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <PaymentMethodBadge method={payment.method} />
          <PaymentStatusBadge status={payment.status} />
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <div className="text-xs text-slate-500">
          {payment.escrowed ? <p className="font-semibold text-sky-700">Held in escrow</p> : <p>Direct settlement</p>}
          {payment.invoiceId ? <p className="mt-0.5">invoice {payment.invoiceId}</p> : null}
        </div>
        <p className="text-xl font-semibold text-slate-900">{formatCurrency(payment.amount, payment.currency)}</p>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">Paid {formatDate(payment.date)}</p>
    </article>
  );
}
