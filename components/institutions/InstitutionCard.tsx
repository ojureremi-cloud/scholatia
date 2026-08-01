'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { Institution } from '@/types/institution';

type InstitutionCardProps = {
  institution: Institution;
  className?: string;
};

export default function InstitutionCard({ institution, className = '' }: InstitutionCardProps) {
  const { profile } = institution;
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {institution.logo}
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{profile.institutionType}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{profile.institutionName}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {profile.city ?? 'Location not specified'} • {profile.country ?? 'Country not specified'}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{profile.description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary">View profile</Button>
        <Button>Verify institution</Button>
      </div>
    </div>
  );
}
