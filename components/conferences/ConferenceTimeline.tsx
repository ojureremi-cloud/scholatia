'use client';

import React from 'react';
import type { ConferenceProfile } from '@/types/identity';

type ConferenceTimelineProps = {
  conference: ConferenceProfile;
  className?: string;
};

export default function ConferenceTimeline({ conference, className = '' }: ConferenceTimelineProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Event timeline</h3>
      <div className="mt-4 space-y-3">
        <p className="text-sm text-slate-600">Start: {conference.startDate ?? 'TBD'}</p>
        <p className="text-sm text-slate-600">End: {conference.endDate ?? 'TBD'}</p>
        <p className="text-sm text-slate-600">Timezone: {conference.timezone ?? 'TBD'}</p>
      </div>
    </section>
  );
}
