import React from 'react';
import { InvoiceStatusBadge } from './MarketplaceBadge';
import { formatCurrency, formatDate } from './format';
import type { MarketplaceInvoice } from '@/types/marketplace';

type InvoiceCardProps = {
  invoice: MarketplaceInvoice;
};

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{invoice.invoiceNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {invoice.buyerName} · order {invoice.orderId}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
        {invoice.lines.map((line) => (
          <li key={`${line.description}-${line.unitPrice}`} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">
              {line.description}
              <span className="ml-1 text-xs text-slate-400">× {line.quantity}</span>
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(line.total, invoice.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-slate-100 pt-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
        </div>
        <div className="mt-1 flex justify-between text-slate-600">
          <span>Platform fees</span>
          <span>{formatCurrency(invoice.fees, invoice.currency)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-100 pt-2">
          <span className="font-semibold text-slate-900">Total</span>
          <span className="font-semibold text-slate-900">{formatCurrency(invoice.total, invoice.currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Issued {formatDate(invoice.issuedAt)}</span>
        <span>Due {formatDate(invoice.dueAt)}</span>
        {invoice.paidAt ? <span className="font-semibold text-emerald-600">Paid {formatDate(invoice.paidAt)}</span> : null}
      </div>
    </article>
  );
}
