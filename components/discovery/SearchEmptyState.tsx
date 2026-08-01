'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type SearchEmptyStateProps = {
  query?: string;
  onReset?: () => void;
  className?: string;
};

export default function SearchEmptyState({ query, onReset, className = '' }: SearchEmptyStateProps) {
  return (
    <div className={['flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center', className].filter(Boolean).join(' ')}>
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">🔍</span>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">No results found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {query
          ? `Nothing matched “${query}”. Try a broader keyword, remove a filter, or browse the collections below.`
          : 'No records match the current filters. Try removing a filter or switching category.'}
      </p>
      {onReset ? (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onReset}>
          Reset search
        </Button>
      ) : null}
    </div>
  );
}
