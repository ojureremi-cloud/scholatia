import React from 'react';
import { InvoiceStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceInvoice } from '@/types/commerce';

type InvoiceCardProps = {
  invoice: CommerceInvoice;
};

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-slate-900">{invoice.invoiceNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {invoice.buyerName} · Issued {formatDate(invoice.issuedAt)}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
        {invoice.lines.map((line, index) => (
          <li key={index} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">
              {line.description}
              <span className="ml-1 text-xs text-slate-400">× {line.quantity}</span>
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(line.total, invoice.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
        </div>
        {invoice.discount > 0 ? (
          <div className="flex justify-between text-rose-600">
            <span>Discount</span>
            <span>−{formatCurrency(invoice.discount, invoice.currency)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(invoice.tax, invoice.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fees</span>
          <span>{formatCurrency(invoice.fees, invoice.currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Due {formatDate(invoice.dueAt)}</span>
        <span className="text-lg font-semibold text-slate-900">{formatCurrency(invoice.total, invoice.currency)}</span>
      </div>
    </article>
  );
}
