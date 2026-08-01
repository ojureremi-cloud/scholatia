import React from 'react';
import { OrderStatusBadge, PaymentStatusBadge } from './MarketplaceBadge';
import { formatCurrency, formatDate } from './format';
import type { MarketplaceOrder } from '@/types/marketplace';

type OrderCardProps = {
  order: MarketplaceOrder;
};

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {order.buyerName} · {formatDate(order.placedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
        {order.items.map((item) => (
          <li key={item.listingId} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">
              {item.title}
              <span className="ml-1 text-xs text-slate-400">× {item.quantity}</span>
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(item.total, order.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-500">
          {order.discount > 0 ? (
            <p>Discount −{formatCurrency(order.discount, order.currency)}</p>
          ) : null}
          {order.completedAt ? <p>Completed {formatDate(order.completedAt)}</p> : null}
        </div>
        <p className="text-lg font-semibold text-slate-900">{formatCurrency(order.total, order.currency)}</p>
      </div>

      {order.notes ? <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">{order.notes}</p> : null}
    </article>
  );
}
