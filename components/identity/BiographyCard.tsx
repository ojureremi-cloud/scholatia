'use client';

import React from 'react';
import type { SAIDProfile } from '@/types/identity';

type BiographyCardProps = {
  profile: SAIDProfile;
  className?: string;
};

export default function BiographyCard({ profile, className = '' }: BiographyCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Biography</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{profile.biography ?? 'No biography provided yet.'}</p>
    </div>
  );
}
