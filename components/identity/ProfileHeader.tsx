'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { SAIDProfile } from '@/types/identity';

type ProfileHeaderProps = {
  profile: SAIDProfile;
  className?: string;
};

export default function ProfileHeader({ profile, className = '' }: ProfileHeaderProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{profile.said}</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">{profile.displayName}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{profile.professionalSummary ?? profile.biography}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">View public profile</Button>
          <Button>Share SAID</Button>
        </div>
      </div>
    </div>
  );
}
