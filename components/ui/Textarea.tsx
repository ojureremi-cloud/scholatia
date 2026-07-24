'use client';

import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export default function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={[ 'space-y-2', className ].filter(Boolean).join(' ')}>
      <label htmlFor={textareaId} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
        {label}
      </label>
      <textarea
        id={textareaId}
        className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        {...props}
      />
      {error ? <p className="text-sm text-danger-600">{error}</p> : null}
    </div>
  );
}
