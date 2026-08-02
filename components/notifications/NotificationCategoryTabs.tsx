'use client';

import React from 'react';
import { formatCategory, formatCategoryIcon, formatNumber } from './format';
import type { NotificationCategory } from '@/types/notifications';

type NotificationCategoryTabsProps = {
  active: 'all' | NotificationCategory;
  onChange: (value: 'all' | NotificationCategory) => void;
  counts: Partial<Record<NotificationCategory, number>>;
};

export default function NotificationCategoryTabs({ active, onChange, counts }: NotificationCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={[
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          active === 'all'
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        All
      </button>
      {(Object.keys(counts) as NotificationCategory[]).map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(active === category ? 'all' : category)}
          className={[
            'rounded-full border px-4 py-2 text-sm font-medium transition',
            active === category
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {formatCategoryIcon(category)} {formatCategory(category)}{' '}
          <span className={active === category ? 'text-slate-300' : 'text-slate-400'}>{formatNumber(counts[category] ?? 0)}</span>
        </button>
      ))}
    </div>
  );
}
