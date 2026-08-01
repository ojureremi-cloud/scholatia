'use client';

import React from 'react';
import type { Institution } from '@/types/institution';

type InstitutionVerificationCardProps = {
  institution: Institution;
  className?: string;
};

export default function InstitutionVerificationCard({ institution, className = '' }: InstitutionVerificationCardProps) {
  const { profile } = institution;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Verification status</h3>
      <p className="mt-3 text-sm text-slate-600">Current status: {profile.verificationStatus}</p>
      <p className="mt-2 text-sm text-slate-600">Last review: {profile.lastVerifiedAt ?? 'Not reviewed yet'}</p>
      {profile.verificationHistory.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {profile.verificationHistory.map((record, index) => (
            <li key={`${record.type}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{record.type}</p>
              <p className="mt-1 text-xs text-slate-500">
                {record.status}
                {record.verifiedAt ? ` · ${record.verifiedAt}` : ''}
              </p>
              {record.details ? <p className="mt-1 text-xs text-slate-600">{record.details}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
