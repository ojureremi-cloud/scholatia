import React from 'react';
import { formatCurrency, formatPercent } from './format';
import type { MarketplaceBundle } from '@/types/marketplace';

type BundleCardProps = {
  bundle: MarketplaceBundle;
};

export default function BundleCard({ bundle }: BundleCardProps) {
  const savings = Math.round((bundle.listTotal - bundle.price.amount) * 100) / 100;

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">Bundle</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatPercent(bundle.discountPercent)} off
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{bundle.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{bundle.description}</p>

      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        {bundle.items.map((item) => (
          <li key={item.listingId} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">
              {item.title}
              <span className="ml-1 text-xs text-slate-400">× {item.quantity}</span>
            </span>
            <span className="text-xs text-slate-400">{formatCurrency(item.quantity * 1, 'GBP')}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-end justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs text-slate-400 line-through">{formatCurrency(bundle.listTotal, bundle.price.currency)}</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(bundle.price.amount, bundle.price.currency)}</p>
        </div>
        <p className="text-sm font-semibold text-emerald-700">Save {formatCurrency(savings, bundle.price.currency)}</p>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        Status: {bundle.status}
      </p>
    </article>
  );
}
