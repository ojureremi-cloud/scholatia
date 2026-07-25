'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { InstitutionProfile } from '@/types/identity';

type InstitutionCardProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function InstitutionCard({ institution, className = '' }: InstitutionCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{institution.institutionType}</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{institution.institutionName}</h3>
      <p className="mt-2 text-sm text-slate-600">{institution.city ?? 'Location not specified'} • {institution.country ?? 'Country not specified'}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary">View profile</Button>
        <Button>Verify institution</Button>
      </div>
    </div>
  );
}
