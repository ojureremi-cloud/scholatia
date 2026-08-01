import React from 'react';
import { formatCurrency } from './format';
import { calculateOrder, cartCount } from '@/lib/commerce';
import type { CommerceCart, CommerceCoupon } from '@/types/commerce';

type ShoppingCartProps = {
  cart: CommerceCart;
  coupons?: CommerceCoupon[];
};

export default function ShoppingCart({ cart, coupons = [] }: ShoppingCartProps) {
  const coupon = cart.couponCode ? coupons.find((entry) => entry.code === cart.couponCode) : undefined;
  const calc = calculateOrder(cart.items, {
    coupon,
    taxRatePercent: 5,
    currency: cart.items[0]?.currency,
  });
  const itemCount = cartCount(cart.items);

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{cart.id}</p>
          <p className="mt-0.5 text-xs text-slate-400">{itemCount} line units</p>
        </div>
        {cart.couponCode ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 font-mono text-xs font-semibold text-sky-800">
            {cart.couponCode}
          </span>
        ) : null}
      </div>

      <ul className="mt-4 flex-1 space-y-3 border-t border-slate-100 pt-4">
        {cart.items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-medium text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-400">
                {formatCurrency(item.unitPrice, item.currency)} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-slate-900">
              {formatCurrency(item.unitPrice * item.quantity, item.currency)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">{formatCurrency(calc.subtotal, calc.currency)}</span>
        </div>
        {calc.discount > 0 ? (
          <div className="flex justify-between text-rose-600">
            <span>Discount</span>
            <span>−{formatCurrency(calc.discount, calc.currency)}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-slate-600">
          <span>Tax (5%)</span>
          <span className="font-medium text-slate-900">{formatCurrency(calc.tax, calc.currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-3 text-white">
        <span className="text-sm">Total</span>
        <span className="text-lg font-semibold">{formatCurrency(calc.total, calc.currency)}</span>
      </div>
    </article>
  );
}
