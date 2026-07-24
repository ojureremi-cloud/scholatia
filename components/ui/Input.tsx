'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={[ 'space-y-2', className ].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
        {label}
      </label>
      <input
        id={inputId}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        {...props}
      />
      {error ? <p className="text-sm text-danger-600">{error}</p> : null}
    </div>
  );
}
