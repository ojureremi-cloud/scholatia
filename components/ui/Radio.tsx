'use client';

import React from 'react';

type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string;
  name: string;
};

export default function Radio({ label, value, name, id, className = '', ...props }: RadioProps) {
  const radioId = id ?? `${name}-${value}`;

  return (
    <label className={[ 'inline-flex cursor-pointer items-center gap-2 text-sm text-slate-900 dark:text-slate-100', className ].filter(Boolean).join(' ')}>
      <input
        id={radioId}
        type="radio"
        name={name}
        value={value}
        className="h-4 w-4 rounded-full border-slate-300 text-sky-600 focus:ring-sky-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
