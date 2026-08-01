import React from 'react';
import { formatCurrency } from './format';
import type { CommerceOrderCalculation } from '@/lib/commerce';
import type { CommerceCheckoutStep } from '@/types/commerce';

type CheckoutCardProps = {
  calculation: CommerceOrderCalculation;
  step?: CommerceCheckoutStep;
};

const CHECKOUT_STEPS: CommerceCheckoutStep[] = [
  'cart',
  'billing-address',
  'payment',
  'review',
  'processing',
  'confirmation',
];

const STEP_LABELS: Record<CommerceCheckoutStep, string> = {
  cart: 'Cart',
  'billing-address': 'Billing address',
  payment: 'Payment',
  review: 'Review',
  processing: 'Processing',
  confirmation: 'Confirmation',
};

export default function CheckoutCard({ calculation, step = 'review' }: CheckoutCardProps) {
  const { currency } = calculation;
  const currentIndex = CHECKOUT_STEPS.indexOf(step);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Checkout pipeline</p>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          {STEP_LABELS[step]}
        </span>
      </div>

      <ol className="mt-5 grid gap-2">
        {CHECKOUT_STEPS.map((entry, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={entry}
              className={[
                'flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm',
                active ? 'border-slate-900 bg-slate-50' : 'border-transparent',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {done ? '✓' : index + 1}
              </span>
              <span className={active || done ? 'font-medium text-slate-800' : 'text-slate-400'}>
                {STEP_LABELS[entry]}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">{formatCurrency(calculation.subtotal, currency)}</span>
        </div>
        {calculation.discount > 0 ? (
          <div className="flex justify-between text-rose-600">
            <span>Discount{calculation.couponCode ? ` (${calculation.couponCode})` : ''}</span>
            <span>−{formatCurrency(calculation.discount, currency)}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-slate-600">
          <span>Tax</span>
          <span className="font-medium text-slate-900">{formatCurrency(calculation.tax, currency)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Platform fee</span>
          <span className="font-medium text-slate-900">{formatCurrency(calculation.platformFee, currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-3 text-white">
        <span className="text-sm">Payable</span>
        <span className="text-lg font-semibold">{formatCurrency(calculation.total, currency)}</span>
      </div>
    </article>
  );
}
