'use client';

import React from 'react';
import type { Institution } from '@/types/institution';

type InstitutionDirectoryCardProps = {
  institution: Institution;
  className?: string;
};

export default function InstitutionDirectoryCard({ institution, className = '' }: InstitutionDirectoryCardProps) {
  const { profile } = institution;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-slate-50 p-6', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Directory snapshot</h3>
      <dl className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <dt>Institution type</dt>
          <dd className="font-medium text-slate-900">{profile.institutionType}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Country</dt>
          <dd className="font-medium text-slate-900">{profile.country ?? 'Not specified'}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Founded</dt>
          <dd className="font-medium text-slate-900">{profile.foundedYear ?? 'Not listed'}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Trust score</dt>
          <dd className="font-medium text-slate-900">{profile.trustScore}/100</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Campuses</dt>
          <dd className="font-medium text-slate-900">{institution.campuses.length}</dd>
        </div>
      </dl>
    </section>
  );
}
