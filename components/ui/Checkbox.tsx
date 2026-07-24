'use client';

import React from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <label className={[ 'inline-flex cursor-pointer items-center gap-2 text-sm text-slate-900 dark:text-slate-100', className ].filter(Boolean).join(' ')}>
      <input id={checkId} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" {...props} />
      <span>{label}</span>
    </label>
  );
}
