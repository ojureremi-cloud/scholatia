'use client';

import React from 'react';
import type { InstitutionPortfolioStatistics as InstitutionPortfolioStatisticsType } from '@/types/institution';

type InstitutionPortfolioStatisticsProps = {
  statistics: InstitutionPortfolioStatisticsType;
  className?: string;
};

export default function InstitutionPortfolioStatistics({
  statistics,
  className = '',
}: InstitutionPortfolioStatisticsProps) {
  const stats = [
    { label: 'Institutions', value: statistics.totalInstitutions, icon: '🏛️' },
    { label: 'Countries', value: statistics.totalCountries, icon: '🌍' },
    { label: 'Universities', value: statistics.totalUniversities, icon: '🎓' },
    { label: 'Research institutes', value: statistics.totalResearchInstitutes, icon: '🔬' },
    { label: 'Students', value: statistics.totalStudents, icon: '🧑‍🎓' },
    { label: 'Faculty', value: statistics.totalFaculty, icon: '👩‍🏫' },
    { label: 'Campuses', value: statistics.totalCampuses, icon: '🏫' },
    { label: 'Faculties', value: statistics.totalFaculties, icon: '📚' },
    { label: 'Departments', value: statistics.totalDepartments, icon: '🗂️' },
    { label: 'Research centres', value: statistics.totalResearchCentres, icon: '🧪' },
    { label: 'Laboratories', value: statistics.totalLaboratories, icon: '⚗️' },
    { label: 'Publications', value: statistics.totalPublications, icon: '📄' },
    { label: 'Researchers', value: statistics.totalResearchers, icon: '👥' },
    { label: 'Grants', value: statistics.totalGrants, icon: '💼' },
    { label: 'Partnerships', value: statistics.totalPartnerships, icon: '🤝' },
    { label: 'Verified', value: statistics.verifiedInstitutions, icon: '✅' },
    { label: 'Accredited', value: statistics.accreditedInstitutions, icon: '🏅' },
  ];

  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className].filter(Boolean).join(' ')}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <span className="text-xl">{stat.icon}</span>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value.toLocaleString('en-US')}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
        </div>
      ))}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <span className="text-xl">⭐</span>
        <p className="mt-2 text-2xl font-semibold text-emerald-900">{statistics.avgTrustScore}/100</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Average trust score</p>
      </div>
    </div>
  );
}
