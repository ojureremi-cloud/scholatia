'use client';

import React from 'react';
import type { InstitutionAccreditation } from '@/types/institution';

type InstitutionAccreditationCardProps = {
  accreditations: InstitutionAccreditation[];
  className?: string;
};

const statusStyles: Record<InstitutionAccreditation['status'], string> = {
  Accredited: 'bg-emerald-100 text-emerald-800',
  'Provisionally Accredited': 'bg-amber-100 text-amber-800',
  Pending: 'bg-slate-100 text-slate-700',
  'Under Review': 'bg-sky-100 text-sky-800',
  Revoked: 'bg-rose-100 text-rose-800',
};

export default function InstitutionAccreditationCard({
  accreditations,
  className = '',
}: InstitutionAccreditationCardProps) {
  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {accreditations.map((accreditation) => (
        <div key={accreditation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{accreditation.body}</p>
            <span
              className={['rounded-full px-2 py-0.5 text-xs font-medium', statusStyles[accreditation.status]].join(' ')}
            >
              {accreditation.status}
            </span>
          </div>
          {accreditation.country ? <p className="mt-1 text-xs text-slate-500">{accreditation.country}</p> : null}
          <p className="mt-3 text-sm leading-6 text-slate-600">{accreditation.scope}</p>
          <p className="mt-2 text-xs text-slate-500">
            Awarded {accreditation.awardedYear}
            {accreditation.expiresYear ? ` · Expires ${accreditation.expiresYear}` : ''}
          </p>
          {accreditation.certification ? (
            <p className="mt-1 text-xs text-slate-500">Certification: {accreditation.certification}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
