'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { ConferenceProfile } from '@/types/identity';

type ConferenceCardProps = {
  conference: ConferenceProfile;
  className?: string;
};

export default function ConferenceCard({ conference, className = '' }: ConferenceCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{conference.eventType}</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{conference.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{conference.city ?? 'Location not specified'} • {conference.country ?? 'Country not specified'}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary">View details</Button>
        <Button>Register</Button>
      </div>
    </div>
  );
}
