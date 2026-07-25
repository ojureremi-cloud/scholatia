'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type InstitutionStatisticsProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function InstitutionStatistics({ institution, className = '' }: InstitutionStatisticsProps) {
  const stats = [
    { label: 'Students', value: institution.studentCount?.toLocaleString() ?? '—' },
    { label: 'Faculty', value: institution.facultyCount?.toLocaleString() ?? '—' },
    { label: 'Programs', value: institution.programCount?.toLocaleString() ?? '—' },
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
