import React from 'react';
import { formatCurrency } from './format';
import type { CommerceWallet } from '@/types/commerce';

type WalletBalanceProps = {
  wallet: CommerceWallet;
  compact?: boolean;
};

export default function WalletBalance({ wallet, compact = false }: WalletBalanceProps) {
  const rows = [
    { label: 'Total balance', value: wallet.balance, emphasized: true },
    { label: 'Available', value: wallet.availableBalance, emphasized: false },
    { label: 'Pending', value: wallet.pendingBalance, emphasized: false },
    { label: 'Frozen', value: wallet.frozenBalance, emphasized: false },
  ];

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Wallet balance</p>
        <span className="font-mono text-xs text-slate-400">{wallet.currency}</span>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">{row.label}</span>
            <span className={row.emphasized ? 'text-2xl font-semibold text-slate-900' : 'text-sm font-semibold text-slate-800'}>
              {formatCurrency(row.value, wallet.currency)}
            </span>
          </div>
        ))}
      </div>

      {!compact ? (
        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Lifetime credits</span>
            <span className="font-medium text-slate-800">{formatCurrency(wallet.lifetimeCredits, wallet.currency)}</span>
          </div>
          <div className="mt-1.5 flex justify-between">
            <span>Lifetime debits</span>
            <span className="font-medium text-slate-800">{formatCurrency(wallet.lifetimeDebits, wallet.currency)}</span>
          </div>
        </div>
      ) : null}
    </article>
  );
}
