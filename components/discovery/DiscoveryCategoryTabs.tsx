'use client';

import React from 'react';
import { entityTypeIcon, entityTypeLabel } from './format';
import type { DiscoveryCategory } from '@/types/discovery';

type DiscoveryCategoryTabsProps = {
  categories: DiscoveryCategory[];
  active: DiscoveryCategory;
  onSelect?: (category: DiscoveryCategory) => void;
  className?: string;
};

export default function DiscoveryCategoryTabs({
  categories,
  active,
  onSelect,
  className = '',
}: DiscoveryCategoryTabsProps) {
  return (
    <div className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}>
      {categories.map((category) => {
        const isActive = category === active;
        const label = category === 'all' ? 'All' : entityTypeLabel(category as never);
        return (
          <button
            key={category}
            type="button"
            disabled={!onSelect}
            onClick={() => onSelect?.(category)}
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
              isActive
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
              !onSelect ? 'cursor-default' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {category !== 'all' ? (
              <span className="text-sm leading-none">{entityTypeIcon(category as never)}</span>
            ) : null}
            {label}
          </button>
        );
      })}
    </div>
  );
}
