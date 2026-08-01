import React from 'react';
import { ProductTypeBadge } from './CommerceBadge';
import { formatPrice } from './format';
import type { CommerceProduct } from '@/types/commerce';

type ProductCardProps = {
  product: CommerceProduct;
  featured?: boolean;
};

export default function ProductCard({ product, featured = false }: ProductCardProps) {
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
        <p className="font-semibold text-slate-900">{product.name}</p>
        <ProductTypeBadge type={product.type} />
      </div>
      <p className="mt-1 text-xs text-slate-400">{product.sku}</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500">{product.summary}</p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatPrice(product.price)}</p>
          {product.stock != null ? (
            <p className="mt-0.5 text-xs text-slate-400">{product.stock.toLocaleString()} in stock</p>
          ) : null}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{product.category}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
        {product.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
