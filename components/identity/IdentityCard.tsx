'use client';

import React from 'react';
import type { SAIDProfile } from '@/types/identity';

type IdentityCardProps = {
  profile: SAIDProfile;
  className?: string;
};

export default function IdentityCard({ profile, className = '' }: IdentityCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Identity</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{profile.displayName}</h3>
      <p className="mt-2 text-sm text-slate-600">{profile.accountType} • {profile.accountCategory}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {profile.roles.map((role) => (
          <span key={role} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}
