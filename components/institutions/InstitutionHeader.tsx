'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { Institution } from '@/types/institution';

type InstitutionHeaderProps = {
  institution: Institution;
  className?: string;
};

export default function InstitutionHeader({ institution, className = '' }: InstitutionHeaderProps) {
  const { profile } = institution;
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
            {institution.logo}
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{profile.institutionId}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{profile.institutionName}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {profile.city ?? 'Location not specified'} • {profile.country ?? 'Country not specified'}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{profile.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Shared documents</Button>
          <Button>Verify now</Button>
        </div>
      </div>
    </div>
  );
}
