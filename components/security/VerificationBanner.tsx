'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type VerificationBannerProps = {
  className?: string;
  title?: string;
  description?: string;
  variant?: 'verified' | 'pending' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
};

const variantStyles = {
  verified: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  pending: 'border-amber-200 bg-amber-50 text-amber-900',
  warning: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function VerificationBanner({
  className = '',
  title = 'Identity verification is pending',
  description = 'Complete your verification steps to unlock enhanced trust features and permissions.',
  variant = 'pending',
  actionLabel,
  onAction,
}: VerificationBannerProps) {
  return (
    <div className={['rounded-3xl border p-6 shadow-sm', variantStyles[variant], className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.26em] opacity-80">Verification status</p>
          <h3 className="mt-2 text-lg font-semibold">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">{description}</p>
        </div>
        {actionLabel ? (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
