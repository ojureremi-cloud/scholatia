'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { JournalIndexingRecord, JournalProfile } from '@/types/identity';

type IndexingCardProps = {
  journal: JournalProfile;
  className?: string;
};

const statusVariant: Record<JournalIndexingRecord['status'], 'success' | 'info' | 'warning'> = {
  Indexed: 'success',
  'In Review': 'info',
  'Not Indexed': 'warning',
};

export default function IndexingCard({ journal, className = '' }: IndexingCardProps) {
  const records: JournalIndexingRecord[] =
    journal.indexingRecords ??
    journal.indexingServices.map((service) => ({ service, status: 'Indexed' }));

  return (
    <ul className={['space-y-3', className].filter(Boolean).join(' ')}>
      {records.map((record) => (
        <li
          key={record.service}
          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4"
        >
          <span className="text-sm font-semibold text-slate-900">{record.service}</span>
          <Badge variant={statusVariant[record.status]}>{record.status}</Badge>
        </li>
      ))}
    </ul>
  );
}
