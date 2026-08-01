import React from 'react';
import { ProductTypeBadge } from './CommerceBadge';
import { formatCurrency, formatPercent } from './format';
import { effectiveProductPrice, productDiscount, productDiscountPercent } from '@/lib/commerce';
import type { CommerceProduct } from '@/types/commerce';

type DiscountCardProps = {
  product: CommerceProduct;
};

export default function DiscountCard({ product }: DiscountCardProps) {
  const list = product.price.compareAt ?? product.price.amount;
  const effective = effectiveProductPrice(product);
  const percent = productDiscountPercent(product);
  const discount = productDiscount(product);
  const savings = Math.max(0, list - effective);

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{product.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{product.sku}</p>
        </div>
        <ProductTypeBadge type={product.type} />
      </div>

      {percent > 0 ? (
        <span className="mt-4 inline-flex w-fit rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
          Save {formatPercent(percent)}
        </span>
      ) : null}

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-slate-500 line-through">{formatCurrency(list, product.price.currency)}</span>
          <span className="text-3xl font-semibold text-slate-900">{formatCurrency(effective, product.price.currency)}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {product.price.interval ? `per ${product.price.interval.replace(/-/g, ' ')}` : 'one-time'}
        </p>
      </div>

      <div className="mt-4 flex-1 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>List price</span>
          <span className="font-medium text-slate-800">{formatCurrency(list, product.price.currency)}</span>
        </div>
        {discount ? (
          <div className="flex justify-between">
            <span>Discount applied</span>
            <span className="font-medium text-rose-600">−{formatCurrency(discount.value, product.price.currency)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">You save</span>
        <span className="text-lg font-semibold text-emerald-700">{formatCurrency(savings, product.price.currency)}</span>
      </div>
    </article>
  );
}
