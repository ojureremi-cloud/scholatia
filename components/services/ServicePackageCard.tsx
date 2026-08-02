import React from 'react';
import { DiscountBadge } from './ServiceBadge';
import { formatCurrency } from './format';
import { effectiveServicePrice, estimateDelivery, serviceDiscountPercent, serviceListPrice } from '@/lib/services';
import type { Service, ServicePackage } from '@/types/services';

type ServicePackageCardProps = {
  service: Service;
  pkg: ServicePackage;
};

export default function ServicePackageCard({ service, pkg }: ServicePackageCardProps) {
  const effective = effectiveServicePrice(service, pkg);
  const list = serviceListPrice(service, pkg);
  const discount = serviceDiscountPercent(service, pkg);
  const delivery = estimateDelivery(service, pkg);

  return (
    <article
      className={[
        'flex flex-col rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        pkg.popular ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{pkg.name}</p>
        {pkg.popular ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Most popular</span>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-3xl font-semibold text-slate-900">{formatCurrency(effective, pkg.price.currency)}</p>
          {discount > 0 ? (
            <>
              <span className="text-sm text-slate-400 line-through">{formatCurrency(list, pkg.price.currency)}</span>
              <DiscountBadge percent={discount} />
            </>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {pkg.price.interval ? `per ${pkg.price.interval.replace(/-/g, ' ')}` : 'fixed price'} · {delivery.range}
        </p>
      </div>

      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {pkg.includes.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-slate-700">
            <span className="mt-0.5 text-emerald-600">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>Delivery: {delivery.range}</span>
        <span>Revisions: {pkg.revisions}</span>
      </div>
    </article>
  );
}
