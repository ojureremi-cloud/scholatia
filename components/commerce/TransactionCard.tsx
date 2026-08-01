import React from 'react';
import { TransactionKindBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceTransaction } from '@/types/commerce';

type TransactionCardProps = {
  transaction: CommerceTransaction;
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{transaction.description}</p>
          <p className="mt-0.5 text-xs text-slate-400">{formatDate(transaction.createdAt)}</p>
        </div>
        <TransactionKindBadge kind={transaction.kind} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-slate-500">{transaction.reference}</span>
        <span className="text-lg font-semibold text-slate-900">{formatCurrency(transaction.amount, transaction.currency)}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-500">
        {transaction.method ? <span>Method: {transaction.method}</span> : null}
        {transaction.provider ? <span>· {transaction.provider}</span> : null}
        {transaction.status ? <span>· {transaction.status}</span> : null}
      </div>
    </article>
  );
}
