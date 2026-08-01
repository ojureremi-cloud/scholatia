import React from 'react';
import { BillingCycleBadge, SubscriberTypeBadge } from './CommerceBadge';
import { formatCurrency, formatPrice } from './format';
import { calculateSubscriptionCost } from '@/lib/commerce';
import type { CommerceSubscriptionPlan } from '@/types/commerce';

type PricingCardProps = {
  plan: CommerceSubscriptionPlan;
  seats?: number;
  featured?: boolean;
};

export default function PricingCard({ plan, seats = 1, featured = false }: PricingCardProps) {
  const cost = calculateSubscriptionCost({ plan, seats });

  return (
    <article
      className={[
        'flex flex-col rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        featured ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{plan.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">For {plan.subscriberType}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <SubscriberTypeBadge type={plan.subscriberType} />
          <BillingCycleBadge cycle={plan.billingCycle} />
        </div>
      </div>

      {featured ? (
        <span className="mt-4 inline-flex w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      ) : null}

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-3xl font-semibold text-slate-900">{formatCurrency(cost.perCycle, plan.price.currency)}</p>
        <p className="text-xs text-slate-500">
          per {plan.billingCycle} · list {formatPrice(plan.price)}
        </p>
      </div>

      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-slate-700">
            <span className="mt-0.5 text-emerald-600">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {cost.discountApplied > 0 ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
          Save {formatCurrency(cost.discountApplied, plan.price.currency)} on the annual cycle
        </p>
      ) : null}
    </article>
  );
}
