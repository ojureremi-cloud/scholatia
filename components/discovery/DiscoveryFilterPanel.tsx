'use client';

import React from 'react';
import { entityTypeLabel } from './format';
import type { DiscoveryFacet, DiscoveryFilter } from '@/types/discovery';

type DiscoveryFilterPanelProps = {
  filters: DiscoveryFilter[];
  facets?: DiscoveryFacet[];
  onRemove?: (filterId: string) => void;
  onClear?: () => void;
  className?: string;
};

export default function DiscoveryFilterPanel({
  filters,
  onRemove,
  onClear,
  className = '',
}: DiscoveryFilterPanelProps) {
  if (filters.length === 0) return null;

  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Active filters</p>
        {onClear ? (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-slate-500 transition hover:text-rose-600">
            Clear all
          </button>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {filter.type === 'category' ? entityTypeLabel(filter.value as never) : filter.label}
            {onRemove ? (
              <button
                type="button"
                onClick={() => onRemove(filter.id)}
                aria-label={`Remove ${filter.label}`}
                className="text-slate-400 transition hover:text-rose-600"
              >
                ✕
              </button>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
