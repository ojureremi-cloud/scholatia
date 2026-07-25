'use client';

import React from 'react';
import type { JournalProfile } from '@/types/identity';

type JournalStatisticsProps = {
  journal: JournalProfile;
  className?: string;
};

export default function JournalStatistics({ journal, className = '' }: JournalStatisticsProps) {
  const stats = [
    { label: 'Articles', value: journal.articles.length.toString() },
    { label: 'Issues', value: journal.issues.length.toString() },
    { label: 'Trust score', value: journal.trustScore.toString() },
  ];

  return (
    <div className={['grid gap-4 sm:grid-cols-3', className].filter(Boolean).join(' ')}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
