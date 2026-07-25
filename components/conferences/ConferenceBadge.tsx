'use client';

import React from 'react';
import type { ConferenceProfile } from '@/types/identity';

type ConferenceBadgeProps = {
  conference: ConferenceProfile;
  className?: string;
};

export default function ConferenceBadge({ conference, className = '' }: ConferenceBadgeProps) {
  return (
    <span className={['inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700', className].filter(Boolean).join(' ')}>
      {conference.registrationStatus}
    </span>
  );
}
