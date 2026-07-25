'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type DepartmentCardProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function DepartmentCard({ institution, className = '' }: DepartmentCardProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Departments</h3>
      <p className="mt-3 text-sm text-slate-600">Academic departments are curated for {institution.institutionName}.</p>
    </section>
  );
}
