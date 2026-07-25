'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type InstitutionTrustBadgeProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function InstitutionTrustBadge({ institution, className = '' }: InstitutionTrustBadgeProps) {
  return (
    <span className={['inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700', className].filter(Boolean).join(' ')}>
      Trust score {institution.trustScore ?? 0}
    </span>
  );
}
