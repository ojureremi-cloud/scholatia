'use client';

import React from 'react';
import { entityTypeIcon, entityTypeLabel } from './format';
import type { DiscoverySuggestion } from '@/types/discovery';

type DiscoverySuggestionCardProps = {
  suggestion: DiscoverySuggestion;
  className?: string;
};

const typeStyles: Record<DiscoverySuggestion['type'], string> = {
  historical: 'bg-slate-100 text-slate-600',
  popular: 'bg-amber-100 text-amber-700',
  trending: 'bg-rose-100 text-rose-700',
  recommended: 'bg-emerald-100 text-emerald-700',
  recent: 'bg-sky-100 text-sky-700',
};

const typeLabels: Record<DiscoverySuggestion['type'], string> = {
  historical: 'Historical',
  popular: 'Popular',
  trending: 'Trending',
  recommended: 'Recommended',
  recent: 'Recent',
};

export default function DiscoverySuggestionCard({ suggestion, className = '' }: DiscoverySuggestionCardProps) {
  return (
    <button
      type="button"
      className={[
        'flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left shadow-card transition hover:border-slate-300 hover:bg-slate-50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex min-w-0 items-center gap-3">
        {suggestion.entityType ? (
          <span className="text-lg">{entityTypeIcon(suggestion.entityType)}</span>
        ) : (
          <span className="text-lg">🔎</span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{suggestion.query}</p>
          {suggestion.entityType ? (
            <p className="text-xs text-slate-500">{entityTypeLabel(suggestion.entityType)}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {suggestion.count !== undefined ? (
          <span className="text-xs font-medium text-slate-400">{suggestion.count.toLocaleString('en-US')}</span>
        ) : null}
        <span className={['rounded-full px-2.5 py-0.5 text-[11px] font-semibold', typeStyles[suggestion.type]].join(' ')}>
          {typeLabels[suggestion.type]}
        </span>
      </div>
    </button>
  );
}
