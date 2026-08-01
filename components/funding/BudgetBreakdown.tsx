'use client';

import React from 'react';
import { formatAmount } from './format';
import type { Budget } from '@/types/funding';

type BudgetBreakdownProps = {
  budget: Budget;
  className?: string;
};

export default function BudgetBreakdown({ budget, className = '' }: BudgetBreakdownProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Budget</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">Budget breakdown</h3>
        <p className="text-2xl font-semibold text-slate-900">{formatAmount(budget.totalRequested, budget.currency)}</p>
      </div>
      <ul className="mt-5 space-y-3">
        {budget.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
            <div>
              <p className="font-medium text-slate-900">{item.label}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{item.category}</p>
            </div>
            <p className="font-semibold text-slate-900">{formatAmount(item.amount, item.currency)}</p>
          </li>
        ))}
      </ul>
      {budget.totalAwarded !== undefined ? (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm">
          <span className="font-medium text-emerald-800">Total awarded</span>
          <span className="font-semibold text-emerald-800">{formatAmount(budget.totalAwarded, budget.currency)}</span>
        </div>
      ) : null}
      {budget.notes ? <p className="mt-4 text-sm leading-6 text-slate-500">{budget.notes}</p> : null}
    </div>
  );
}
