'use client';

import React from 'react';
import { formatAmount } from './format';
import type { Budget } from '@/types/funding';

type BudgetChartProps = {
  budget: Budget;
  className?: string;
};

export default function BudgetChart({ budget, className = '' }: BudgetChartProps) {
  const total = Math.max(1, budget.items.reduce((sum, item) => sum + item.amount, 0));
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Allocation</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Budget allocation</h3>
      <ul className="mt-5 space-y-4">
        {budget.items.map((item) => {
          const percentage = Math.round((item.amount / total) * 100);
          return (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="font-semibold text-slate-900">{percentage}%</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm text-slate-500">
        Total: <span className="font-semibold text-slate-900">{formatAmount(budget.totalRequested, budget.currency)}</span>
      </p>
    </div>
  );
}
