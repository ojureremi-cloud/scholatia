'use client';

import React from 'react';

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export default function Switch({ checked, onChange, label, className = '' }: SwitchProps) {
  return (
    <label className={[ 'inline-flex items-center gap-3', className ].filter(Boolean).join(' ')}>
      <span className="text-sm text-slate-900 dark:text-slate-100">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 bg-slate-200 transition hover:border-slate-400',
          checked ? 'bg-sky-600' : 'bg-slate-300',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className={[
            'block h-5 w-5 transform rounded-full bg-white shadow transition',
            checked ? 'translate-x-5' : 'translate-x-1',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </button>
    </label>
  );
}
