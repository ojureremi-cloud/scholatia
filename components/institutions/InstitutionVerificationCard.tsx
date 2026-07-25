'use client';

import React from 'react';
import type { InstitutionProfile } from '@/types/identity';

type InstitutionVerificationCardProps = {
  institution: InstitutionProfile;
  className?: string;
};

export default function InstitutionVerificationCard({ institution, className = '' }: InstitutionVerificationCardProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Verification status</h3>
      <p className="mt-3 text-sm text-slate-600">Current status: {institution.verificationStatus}</p>
      <p className="mt-2 text-sm text-slate-600">Last review: {institution.lastVerifiedAt ?? 'Not reviewed yet'}</p>
    </section>
  );
}
