'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type CampusCardProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function CampusCard({ institution, className = '' }: CampusCardProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Campus details</h3>
      <p className="mt-3 text-sm text-slate-600">{institution.city ?? 'City not specified'}, {institution.country ?? 'Country not specified'}</p>
    </section>
  );
}
