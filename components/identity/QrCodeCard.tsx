'use client';

import React from 'react';
import type { SAIDProfile } from '@/types/identity';

type QrCodeCardProps = {
  profile: SAIDProfile;
  className?: string;
};

export default function QrCodeCard({ profile, className = '' }: QrCodeCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">SAID QR</p>
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-900">{profile.said}</p>
        <p className="mt-2 text-sm text-slate-600">Public URL: {profile.publicUrl ?? 'https://scholatia.org/profile'}</p>
      </div>
    </div>
  );
}
