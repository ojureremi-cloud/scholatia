'use client';

import React from 'react';
import type { ConferenceProfile } from '@/types/identity';

type ConferenceStatisticsProps = {
  conference: ConferenceProfile;
  className?: string;
};

export default function ConferenceStatistics({ conference, className = '' }: ConferenceStatisticsProps) {
  const stats = [
    { label: 'Registrations', value: conference.registrations.length.toString() },
    { label: 'Submissions', value: conference.submissions.length.toString() },
    { label: 'Trust score', value: conference.trustScore.toString() },
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
