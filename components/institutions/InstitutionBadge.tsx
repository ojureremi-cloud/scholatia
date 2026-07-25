'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type InstitutionBadgeProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function InstitutionBadge({ institution, className = '' }: InstitutionBadgeProps) {
  return (
    <span className={['inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700', className].filter(Boolean).join(' ')}>
      {institution.verificationStatus}
    </span>
  );
}
