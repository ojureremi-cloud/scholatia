import React from 'react';
import { formatCurrency } from './format';
import type { CommerceOrder, CommercePurchaseRecord, CommerceSubscription, CommerceWallet } from '@/types/commerce';

type CustomerFinanceCardProps = {
  customerName: string;
  wallet?: CommerceWallet;
  orders: readonly CommerceOrder[];
  subscriptions?: readonly CommerceSubscription[];
  purchases?: readonly CommercePurchaseRecord[];
  currency?: string;
};

export default function CustomerFinanceCard({
  customerName,
  wallet,
  orders,
  subscriptions = [],
  purchases = [],
  currency = 'USD',
}: CustomerFinanceCardProps) {
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === 'active').length;

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Customer finance</p>
      <p className="mt-4 font-semibold text-slate-900">{customerName}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(totalSpent, currency)}</p>
          <p className="text-xs text-slate-500">Lifetime spend</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(wallet?.balance ?? 0, wallet?.currency ?? currency)}</p>
          <p className="text-xs text-slate-500">Wallet balance</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Orders placed</span>
          <span className="font-medium text-slate-800">{orders.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Active subscriptions</span>
          <span className="font-medium text-slate-800">{activeSubscriptions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Purchases recorded</span>
          <span className="font-medium text-slate-800">{purchases.length}</span>
        </div>
        {wallet ? (
          <div className="flex justify-between">
            <span className="text-slate-500">Wallet available</span>
            <span className="font-medium text-slate-800">{formatCurrency(wallet.availableBalance, wallet.currency)}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
