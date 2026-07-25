'use client';

import React from 'react';
import { VerificationLevel, VERIFICATION_LEVEL_LABELS } from '@/types/identity';

type VerificationBadgeProps = {
  level: VerificationLevel;
  className?: string;
};

export default function VerificationBadge({ level, className = '' }: VerificationBadgeProps) {
  return (
    <div className={['inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700', className].filter(Boolean).join(' ')}>
      {VERIFICATION_LEVEL_LABELS[level]}
    </div>
  );
}
