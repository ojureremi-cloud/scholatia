import React from 'react';
import { WalletTransactionTypeBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceWalletTransaction } from '@/types/commerce';

type WalletHistoryProps = {
  transactions: CommerceWalletTransaction[];
  limit?: number;
};

export default function WalletHistory({ transactions, limit = 6 }: WalletHistoryProps) {
  const shown = [...transactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Wallet activity</p>
      <div className="mt-5 divide-y divide-slate-100">
        {shown.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{transaction.description}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {formatDate(transaction.createdAt)} · {transaction.reference}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={[
                  'text-sm font-semibold',
                  transaction.direction === 'credit' ? 'text-emerald-600' : 'text-slate-900',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {transaction.direction === 'credit' ? '+' : '−'}
                {formatCurrency(transaction.amount, transaction.currency)}
              </span>
              <WalletTransactionTypeBadge type={transaction.type} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
