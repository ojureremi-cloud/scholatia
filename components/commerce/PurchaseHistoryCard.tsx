import React from 'react';
import { ProductTypeBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommercePurchaseRecord } from '@/types/commerce';

type PurchaseHistoryCardProps = {
  records: CommercePurchaseRecord[];
  limit?: number;
};

export default function PurchaseHistoryCard({ records, limit }: PurchaseHistoryCardProps) {
  const visible = limit ? records.slice(0, limit) : records;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Purchase history</p>
        <p className="mt-1 text-xs text-slate-400">{records.length} records derived from placed orders</p>
      </div>
      <ul className="divide-y divide-slate-100">
        {visible.map((record) => (
          <li key={record.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{record.productName}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {formatDate(record.purchasedAt)} · {record.orderId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ProductTypeBadge type={record.productType} />
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(record.total, record.currency)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
