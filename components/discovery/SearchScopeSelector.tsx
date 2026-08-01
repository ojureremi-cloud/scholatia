'use client';

import React from 'react';

type SearchScope = 'all' | 'scholatia' | 'global';

type SearchScopeSelectorProps = {
  value: SearchScope;
  onChange?: (scope: SearchScope) => void;
  className?: string;
};

const scopes: { value: SearchScope; label: string; description: string }[] = [
  { value: 'all', label: 'Everything', description: 'All indexed sources' },
  { value: 'scholatia', label: 'Scholatia', description: 'Platform records only' },
  { value: 'global', label: 'Global', description: 'External scholarly metadata' },
];

export default function SearchScopeSelector({ value, onChange, className = '' }: SearchScopeSelectorProps) {
  return (
    <div className={['inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-card', className].filter(Boolean).join(' ')}>
      {scopes.map((scope) => {
        const active = scope.value === value;
        return (
          <button
            key={scope.value}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(scope.value)}
            title={scope.description}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50',
              !onChange ? 'cursor-default' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {scope.label}
          </button>
        );
      })}
    </div>
  );
}
