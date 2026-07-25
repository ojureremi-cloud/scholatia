'use client';

import React from 'react';
import type { ConferenceProfile } from '@/types/identity';

type VenueCardProps = {
  conference: ConferenceProfile;
  className?: string;
};

export default function VenueCard({ conference, className = '' }: VenueCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{conference.venue ?? 'Venue TBD'}</p>
      <p className="mt-2 text-sm text-slate-600">{conference.city ?? 'City TBD'} • {conference.country ?? 'Country TBD'}</p>
    </div>
  );
}
