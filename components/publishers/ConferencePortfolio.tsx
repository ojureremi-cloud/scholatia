'use client';

import React from 'react';
import { formatDate } from './format';
import type { PublisherConferenceRef } from '@/types/publisher';

type ConferencePortfolioProps = {
  conferences: PublisherConferenceRef[];
  className?: string;
};

export default function ConferencePortfolio({ conferences, className = '' }: ConferencePortfolioProps) {
  if (conferences.length === 0) {
    return <p className="text-sm text-slate-500">No conference portfolio recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {conferences.map((conference) => (
        <div key={conference.conferenceId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">{conference.title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {conference.city ?? 'Location'} · {conference.country ?? 'Country'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {conference.eventType ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{conference.eventType}</span>
            ) : null}
            {conference.date ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{formatDate(conference.date)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
