import React from 'react';
import { WalletStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import { walletAvailableBalance } from '@/lib/commerce';
import type { CommerceWallet, CommerceWalletTransaction } from '@/types/commerce';

type WalletCardProps = {
  wallet: CommerceWallet;
  transactions?: CommerceWalletTransaction[];
};

export default function WalletCard({ wallet, transactions = [] }: WalletCardProps) {
  const available = walletAvailableBalance(wallet);
  const recent = transactions.length;
  const pending = wallet.pendingBalance;

  return (
    <article className="flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-300">{wallet.ownerName}</p>
          <WalletStatusBadge status={wallet.status} />
        </div>
        <p className="mt-6 text-4xl font-semibold">{formatCurrency(wallet.balance, wallet.currency)}</p>
        <p className="mt-1 text-xs text-slate-400">Total balance</p>

        <div className="mt-6 flex gap-6 text-xs">
          <div>
            <p className="text-2xl font-semibold">{formatCurrency(available, wallet.currency)}</p>
            <p className="mt-0.5 text-slate-400">Available</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{formatCurrency(pending, wallet.currency)}</p>
            <p className="mt-0.5 text-slate-400">Pending</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between gap-3 p-5 text-xs text-slate-500">
        <span>Created {formatDate(wallet.createdAt)}</span>
        <span>{recent} transactions recorded</span>
      </div>
    </article>
  );
}
