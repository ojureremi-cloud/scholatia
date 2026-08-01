'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceKeynoteSpeaker } from '@/types/conference';

type KeynoteSpeakerCardProps = {
  speaker: ConferenceKeynoteSpeaker;
  className?: string;
};

export default function KeynoteSpeakerCard({ speaker, className = '' }: KeynoteSpeakerCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <Badge variant="warning">Keynote</Badge>
      <p className="mt-3 text-sm font-semibold text-slate-900">{speaker.name}</p>
      <p className="mt-1 text-sm text-slate-600">{speaker.affiliation}</p>
      <p className="mt-3 text-sm font-medium leading-5 text-slate-800">{speaker.talkTitle}</p>
      {speaker.abstract ? <p className="mt-2 text-sm leading-6 text-slate-600">{speaker.abstract}</p> : null}
    </div>
  );
}
