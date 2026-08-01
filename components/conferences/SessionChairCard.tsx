'use client';

import React from 'react';
import type { SessionChair } from '@/types/conference';

type SessionChairCardProps = {
  chair: SessionChair;
  className?: string;
};

export default function SessionChairCard({ chair, className = '' }: SessionChairCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{chair.name}</p>
      {chair.affiliation ? <p className="mt-1 text-sm text-slate-600">{chair.affiliation}</p> : null}
      {chair.track ? <p className="mt-1 text-xs text-slate-500">Track: {chair.track}</p> : null}
      {chair.session ? <p className="mt-0.5 text-xs text-slate-500">Session: {chair.session}</p> : null}
    </div>
  );
}
