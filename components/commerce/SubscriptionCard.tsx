import React from 'react';
import { BillingCycleBadge, SubscriptionStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import { subscriptionMonthlyAmount, subscriptionAnnualAmount } from '@/lib/commerce';
import type { CommerceSubscription } from '@/types/commerce';

type SubscriptionCardProps = {
  subscription: CommerceSubscription;
};

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{subscription.planName}</p>
          <p className="mt-0.5 text-xs text-slate-400">{subscription.subscriberName}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <SubscriptionStatusBadge status={subscription.status} />
          <BillingCycleBadge cycle={subscription.billingCycle} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-2xl font-semibold text-slate-900">
          {formatCurrency(subscription.price, subscription.currency)}
        </p>
        <p className="text-xs text-slate-500">
          {subscription.seats ? `${subscription.seats} seats · ` : ''}
          per {subscription.billingCycle}
        </p>
      </div>

      <div className="mt-4 flex-1 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Monthly equivalent</span>
          <span className="font-medium text-slate-800">
            {formatCurrency(subscriptionMonthlyAmount(subscription), subscription.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Annual equivalent</span>
          <span className="font-medium text-slate-800">
            {formatCurrency(subscriptionAnnualAmount(subscription), subscription.currency)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Started {formatDate(subscription.startedAt)}</span>
        <span>
          Next billing {formatDate(subscription.nextBillingAt)}
          {subscription.autoRenew ? ' · auto-renew' : ''}
        </span>
      </div>
    </article>
  );
}
