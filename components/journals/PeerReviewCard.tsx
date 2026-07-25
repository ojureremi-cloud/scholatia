'use client';

import React from 'react';
import type { JournalProfile } from '@/types/identity';

type PeerReviewCardProps = {
  journal: JournalProfile;
  className?: string;
};

export default function PeerReviewCard({ journal, className = '' }: PeerReviewCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">Peer review models</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {journal.peerReviewModes.map((mode) => (
          <span key={mode} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
            {mode}
          </span>
        ))}
      </div>
    </div>
  );
}
