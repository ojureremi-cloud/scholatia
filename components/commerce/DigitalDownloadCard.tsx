import React from 'react';
import { formatCurrency, formatDate } from './format';
import type { CommercePurchaseRecord } from '@/types/commerce';

type DigitalDownloadCardProps = {
  record: CommercePurchaseRecord;
  format?: string;
};

export default function DigitalDownloadCard({ record, format = 'PDF' }: DigitalDownloadCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">⬇</span>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">{format}</span>
      </div>

      <p className="mt-4 font-semibold text-slate-900">{record.productName}</p>
      <p className="mt-0.5 text-xs text-slate-400">Digital download · purchased {formatDate(record.purchasedAt)}</p>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Quantity</span>
          <span className="font-semibold text-slate-800">×{record.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Unit price</span>
          <span className="font-semibold text-slate-800">{formatCurrency(record.unitPrice, record.currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-xs text-slate-500">Total</span>
        <span className="text-lg font-semibold text-slate-900">{formatCurrency(record.total, record.currency)}</span>
      </div>
    </article>
  );
}
