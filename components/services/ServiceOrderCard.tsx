import React from 'react';
import { OrderStatusBadge, ServicePaymentStatusBadge } from './ServiceBadge';
import MilestoneTracker from './MilestoneTracker';
import { formatCurrency, formatDate } from './format';
import type { ServiceOrder } from '@/types/services';

type ServiceOrderCardProps = {
  order: ServiceOrder;
};

export default function ServiceOrderCard({ order }: ServiceOrderCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-slate-900">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {order.buyerName} · {formatDate(order.placedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <OrderStatusBadge status={order.status} />
          <ServicePaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm text-slate-600">
        {order.serviceId} — by {order.providerName}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          {order.deadline ? <p>Deadline {formatDate(order.deadline)}</p> : null}
          {order.deliveredAt ? <p>Delivered {formatDate(order.deliveredAt)}</p> : null}
        </div>
        <p className="text-lg font-semibold text-slate-900">{formatCurrency(order.amount, order.currency)}</p>
      </div>

      {order.milestones.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <MilestoneTracker milestones={order.milestones} />
        </div>
      ) : null}

      {order.notes ? <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">{order.notes}</p> : null}
    </article>
  );
}
