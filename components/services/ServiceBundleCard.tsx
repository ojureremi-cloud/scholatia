import React from 'react';
import { DiscountBadge } from './ServiceBadge';
import { formatCurrency } from './format';
import type { ServiceBundle } from '@/lib/services';

type ServiceBundleCardProps = {
  bundle: ServiceBundle;
  featured?: boolean;
};

export default function ServiceBundleCard({ bundle, featured = false }: ServiceBundleCardProps) {
  const savings = bundle.listTotal - bundle.price;

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
        <p className="font-semibold text-slate-900">{bundle.name}</p>
        <DiscountBadge percent={bundle.discountPercent} />
      </div>
      <p className="mt-1 text-xs text-slate-400">{bundle.services.length} services combined</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500">{bundle.description}</p>

      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        {bundle.services.slice(0, 4).map((service) => (
          <li key={service.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-slate-700">{service.title}</span>
            <span className="shrink-0 text-xs text-slate-400">{formatCurrency(service.price.amount, service.price.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs text-slate-400 line-through">{formatCurrency(bundle.listTotal, bundle.currency)}</p>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(bundle.price, bundle.currency)}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          Save {formatCurrency(savings, bundle.currency)}
        </span>
      </div>
    </article>
  );
}
