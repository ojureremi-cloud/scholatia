'use client';

import React from 'react';

type ErrorStateProps = {
  title: string;
  description: string;
  className?: string;
};

export default function ErrorState({ title, description, className = '' }: ErrorStateProps) {
  return (
    <div className={[ 'rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center shadow-sm dark:border-rose-700 dark:bg-rose-950', className ].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">Error</p>
      <h3 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
