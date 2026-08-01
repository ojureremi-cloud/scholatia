import React from 'react';
import { PaymentMethodBadge, ReceiptStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceReceipt } from '@/types/commerce';

type ReceiptCardProps = {
  receipt: CommerceReceipt;
};

export default function ReceiptCard({ receipt }: ReceiptCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-slate-900">{receipt.receiptNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {receipt.buyerName} · Paid {formatDate(receipt.paidAt)}
          </p>
        </div>
        <ReceiptStatusBadge status={receipt.status} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5 text-xs">
        <span className="text-slate-500">{receipt.merchantName}</span>
        {receipt.paymentMethod ? <PaymentMethodBadge method={receipt.paymentMethod} /> : null}
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
        {receipt.items.map((item, index) => (
          <li key={index} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">
              {item.description}
              <span className="ml-1 text-xs text-slate-400">× {item.quantity}</span>
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(item.total, receipt.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(receipt.subtotal, receipt.currency)}</span>
        </div>
        {receipt.discount > 0 ? (
          <div className="flex justify-between text-rose-600">
            <span>Discount</span>
            <span>−{formatCurrency(receipt.discount, receipt.currency)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(receipt.tax, receipt.currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Paid {formatDate(receipt.paidAt)}</span>
        <span className="text-lg font-semibold text-slate-900">{formatCurrency(receipt.total, receipt.currency)}</span>
      </div>
    </article>
  );
}
