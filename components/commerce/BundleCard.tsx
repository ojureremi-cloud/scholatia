import React from 'react';
import { BundleStatusBadge } from './CommerceBadge';
import { formatCurrency, formatPercent } from './format';
import type { CommerceBundle, CommerceProduct } from '@/types/commerce';

type BundleCardProps = {
  bundle: CommerceBundle;
  products: CommerceProduct[];
  featured?: boolean;
};

export default function BundleCard({ bundle, products, featured = false }: BundleCardProps) {
  const members = bundle.productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is CommerceProduct => product != null);

  return (
    <article
      className={[
        'flex flex-col rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        featured ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{bundle.name}</p>
        <BundleStatusBadge status={bundle.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">{bundle.description}</p>

      <ul className="mt-4 space-y-1 text-xs text-slate-500">
        {members.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-2">
            <span>{product.name}</span>
            <span className="font-medium text-slate-700">{formatCurrency(product.price.amount, product.price.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">List total</span>
          <span className="text-slate-500 line-through">{formatCurrency(bundle.listTotal, bundle.currency)}</span>
        </div>
        <div className="mt-1 flex items-end justify-between">
          <span className="text-xs text-slate-500">Bundle price</span>
          <span className="text-2xl font-semibold text-slate-900">{formatCurrency(bundle.bundlePrice, bundle.currency)}</span>
        </div>
        <p className="mt-2 text-xs font-semibold text-emerald-600">
          You save {formatCurrency(bundle.savings, bundle.currency)} ({formatPercent(bundle.savingsPercent)})
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {bundle.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
