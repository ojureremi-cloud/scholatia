'use client';

import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import VerificationBadge from '@/components/ui/VerificationBadge';
import type { SAIDProfile } from '@/types/identity';

type ProfileHeaderProps = {
  profile: SAIDProfile;
  className?: string;
};

export default function ProfileHeader({ profile, className = '' }: ProfileHeaderProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar name={profile.displayName} imageUrl={profile.profilePhotoUrl} className="h-24 w-24 text-3xl" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{profile.said}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{profile.displayName}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="info">{profile.accountType}</Badge>
              <VerificationBadge level={profile.verificationLevel} />
            </div>
            {profile.institution || profile.department ? (
              <p className="mt-2 text-sm font-medium text-slate-700">
                {profile.institution}
                {profile.institution && profile.department ? ' • ' : ''}
                {profile.department}
              </p>
            ) : null}
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{profile.professionalSummary ?? profile.biography}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">View public profile</Button>
          <Button>Share SAID</Button>
        </div>
      </div>
    </div>
  );
}
