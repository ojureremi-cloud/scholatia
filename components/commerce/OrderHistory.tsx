import React from 'react';
import { formatCompactNumber, formatCurrency } from './format';
import type { CommerceOrder } from '@/types/commerce';

type OrderHistoryProps = {
  orders: CommerceOrder[];
  limit?: number;
};

export default function OrderHistory({ orders, limit = 8 }: OrderHistoryProps) {
  const completed = orders.filter((order) => order.status === 'completed').length;
  const pending = orders.filter((order) => order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing').length;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const currency = orders[0]?.currency ?? 'USD';
  const shown = [...orders]
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
    .slice(0, limit);

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Order history</p>
        <p className="text-xs text-slate-500">
          {formatCompactNumber(completed)} completed · {formatCompactNumber(pending)} in flight
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-3">
        <span className="text-sm text-slate-600">Lifetime order value</span>
        <span className="text-xl font-semibold text-slate-900">{formatCurrency(revenue, currency)}</span>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {shown.map((order) => (
          <div key={order.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <div>
              <p className="font-mono text-xs font-semibold text-slate-800">{order.orderNumber}</p>
              <p className="text-xs text-slate-400">
                {order.buyerName} · {order.status}
              </p>
            </div>
            <span className="font-semibold text-slate-900">{formatCurrency(order.total, order.currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
