'use client';

import React from 'react';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

type AlertProps = {
  variant?: AlertVariant;
  title: string;
  description?: string;
  className?: string;
};

const variantStyles: Record<AlertVariant, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-200',
  warning: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200',
  danger: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-200',
  info: 'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950 dark:border-sky-700 dark:text-sky-200',
};

export default function Alert({ variant = 'info', title, description, className = '' }: AlertProps) {
  return (
    <div className={['rounded-3xl border p-4', variantStyles[variant], className].filter(Boolean).join(' ')} role="alert">
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6">{description}</p> : null}
    </div>
  );
}
