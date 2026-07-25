'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type FacultyCardProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function FacultyCard({ institution, className = '' }: FacultyCardProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Faculty overview</h3>
      <p className="mt-3 text-sm text-slate-600">{institution.facultyCount ?? 0} faculty members currently listed.</p>
    </section>
  );
}
