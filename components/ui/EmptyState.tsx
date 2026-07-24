'use client';

import React from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export default function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={[ 'rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950', className ].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">No content</p>
      <h3 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
