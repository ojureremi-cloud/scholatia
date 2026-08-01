import React from 'react';
import { ProductTypeBadge } from './CommerceBadge';
import { formatCurrency } from './format';
import type { CommerceProductVariant } from '@/types/commerce';

type VariantCardProps = {
  variant: CommerceProductVariant;
};

export default function VariantCard({ variant }: VariantCardProps) {
  const attributes = Object.entries(variant.attributes);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{variant.name}</p>
          <p className="mt-0.5 font-mono text-xs text-slate-400">{variant.sku}</p>
        </div>
        <ProductTypeBadge type="product" />
      </div>

      <p className="mt-4 text-2xl font-semibold text-slate-900">{formatCurrency(variant.unitPrice, variant.currency)}</p>
      <p className="text-xs text-slate-500">unit price</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {attributes.map(([key, value]) => (
          <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {key}: <span className="font-semibold text-slate-900">{value}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Parent product</span>
        <span className="font-medium text-slate-800">{variant.productId}</span>
      </div>
      {variant.stock != null ? (
        <p className="mt-1 text-xs text-slate-400">{variant.stock.toLocaleString()} units in stock</p>
      ) : null}
    </article>
  );
}
