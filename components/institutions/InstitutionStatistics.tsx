'use client';

import React from 'react';
import type { Institution } from '@/types/institution';

type InstitutionStatisticsProps = {
  institution: Institution;
  className?: string;
};

export default function InstitutionStatistics({ institution, className = '' }: InstitutionStatisticsProps) {
  const stats = [
    { label: 'Students', value: institution.statistics.students.toLocaleString('en-US') },
    { label: 'Faculty', value: institution.statistics.faculty.toLocaleString('en-US') },
    { label: 'Departments', value: institution.statistics.departments.toLocaleString('en-US') },
    { label: 'Research centres', value: institution.statistics.researchCentres.toLocaleString('en-US') },
    { label: 'Laboratories', value: institution.statistics.laboratories.toLocaleString('en-US') },
    { label: 'Campuses', value: institution.statistics.campuses.toLocaleString('en-US') },
  ];

  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
