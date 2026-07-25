'use client';

import React from 'react';
import type { TrustMetrics } from '@/types/identity';

type TrustBadgeProps = {
  trustMetrics: TrustMetrics;
  className?: string;
};

export default function TrustBadge({ trustMetrics, className = '' }: TrustBadgeProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Trust score</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{trustMetrics.trustScore}</p>
      <p className="mt-2 text-sm text-slate-600">Identity confidence {trustMetrics.identityConfidence} • Institution confidence {trustMetrics.institutionConfidence}</p>
    </div>
  );
}
