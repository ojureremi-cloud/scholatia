'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type InstitutionDirectoryCardProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function InstitutionDirectoryCard({ institution, className = '' }: InstitutionDirectoryCardProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-slate-50 p-6', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Directory snapshot</h3>
      <dl className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <dt>Institution type</dt>
          <dd className="font-medium text-slate-900">{institution.institutionType}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Accreditation</dt>
          <dd className="font-medium text-slate-900">{institution.accreditation}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Founded</dt>
          <dd className="font-medium text-slate-900">{institution.foundedYear}</dd>
        </div>
      </dl>
    </section>
  );
}
