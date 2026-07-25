'use client';

import React from 'react';
import type { JournalProfile } from '@/types/identity';

type JournalBadgeProps = {
  journal: JournalProfile;
  className?: string;
};

export default function JournalBadge({ journal, className = '' }: JournalBadgeProps) {
  return (
    <span className={['inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700', className].filter(Boolean).join(' ')}>
      {journal.reviewModel}
    </span>
  );
}
