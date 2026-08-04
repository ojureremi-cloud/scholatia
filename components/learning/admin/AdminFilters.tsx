'use client';

export type AdminFilterOption<T extends string> = {
  label: string;
  value: T;
};

type AdminFiltersProps<T extends string> = {
  options: readonly AdminFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function AdminFilters<T extends string>({ options, value, onChange }: AdminFiltersProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={[
              'rounded-full px-4 py-2 text-xs font-semibold transition',
              active
                ? 'bg-sky-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
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
