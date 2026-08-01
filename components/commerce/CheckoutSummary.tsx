import React from 'react';
import { formatCurrency } from './format';
import type { CommerceOrderCalculation } from '@/lib/commerce';
import type { CommerceCheckoutStep } from '@/types/commerce';

type CheckoutSummaryProps = {
  calculation: CommerceOrderCalculation;
  step?: CommerceCheckoutStep;
};

const STEP_LABELS: Record<CommerceCheckoutStep, string> = {
  cart: 'Cart',
  'billing-address': 'Billing address',
  payment: 'Payment',
  review: 'Review',
  processing: 'Processing',
  confirmation: 'Confirmation',
};

export default function CheckoutSummary({ calculation, step = 'review' }: CheckoutSummaryProps) {
  const { currency } = calculation;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Checkout</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {STEP_LABELS[step]}
        </span>
      </div>

      <ol className="mt-5 space-y-2">
        {(['cart', 'billing-address', 'payment', 'review'] as const).map((entry, index) => (
          <li key={entry} className="flex items-center gap-3 text-sm">
            <span
              className={[
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                index <= ['cart', 'billing-address', 'payment', 'review'].indexOf(step)
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-400',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {index + 1}
            </span>
            <span className={index <= ['cart', 'billing-address', 'payment', 'review'].indexOf(step) ? 'font-medium text-slate-800' : 'text-slate-400'}>
              {STEP_LABELS[entry]}
            </span>
          </li>
        ))}
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
        <span className="text-sm">Pay</span>
        <span className="text-lg font-semibold">{formatCurrency(calculation.total, currency)}</span>
      </div>
    </div>
  );
}
