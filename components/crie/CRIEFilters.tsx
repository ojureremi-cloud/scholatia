'use client';

import type { ReactNode } from 'react';

export type CRIEFilterOption = {
  value: string;
  label: string;
};

type CRIEFiltersProps = {
  label?: string;
  options: CRIEFilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export function CRIEFilters({ label = 'Filters', options, selected, onChange }: CRIEFiltersProps) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</span>
      ) : null}
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(option.value)}
            className={[
              'rounded-full px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
              isSelected
                ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
