'use client';

import React from 'react';
import { formatAmount } from './format';
import type { CurrencyCode, GrantCategory } from '@/types/funding';

type FundingCategoryCardProps = {
  category: GrantCategory;
  count: number;
  value: number;
  currency: CurrencyCode;
  className?: string;
};

const categoryIcon: Record<GrantCategory, string> = {
  'research-grant': '🔬',
  fellowship: '🎓',
  scholarship: '📖',
  'seed-funding': '🌱',
  'innovation-fund': '💡',
  'industry-funding': '🏭',
  'government-funding': '🏛️',
  'ngo-funding': '🤝',
  'international-funding': '🌍',
  'institutional-funding': '🏫',
  'venture-research-funding': '🚀',
};

export default function FundingCategoryCard({ category, count, value, currency, className = '' }: FundingCategoryCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl">
          {categoryIcon[category] ?? '•'}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{category.replace(/-/g, ' ')}</p>
          <p className="text-xs text-slate-500">{count} opportunities</p>
        </div>
      </div>
      <p className="mt-4 text-xl font-semibold text-slate-900">{formatAmount(value, currency)}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Awarded value</p>
    </div>
  );
}
