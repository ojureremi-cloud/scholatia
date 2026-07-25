'use client';

import React from 'react';
import type { SAIDProfile } from '@/types/identity';

type ProfileStatisticsProps = {
  profile: SAIDProfile;
  className?: string;
};

export default function ProfileStatistics({ profile, className = '' }: ProfileStatisticsProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Profile statistics</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Trust score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{profile.trustMetrics.trustScore}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Research interests</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{profile.researchInterests.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Public links</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{profile.socialLinks.length + profile.academicLinks.length}</p>
        </div>
      </div>
    </div>
  );
}
