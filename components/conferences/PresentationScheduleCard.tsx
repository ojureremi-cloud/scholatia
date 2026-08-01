'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceAcceptedPaper, ConferenceSession } from '@/types/conference';

type PresentationScheduleCardProps = {
  session: ConferenceSession;
  papers?: ConferenceAcceptedPaper[];
  className?: string;
};

const sessionTypeVariant: Record<ConferenceSession['type'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  Keynote: 'warning',
  Oral: 'success',
  Poster: 'info',
  Panel: 'default',
  Demo: 'danger',
  Workshop: 'info',
  Tutorial: 'default',
};

export default function PresentationScheduleCard({ session, papers = [], className = '' }: PresentationScheduleCardProps) {
  const sessionPapers = papers.filter((paper) => session.paperIds.includes(paper.id));

  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{session.name}</p>
        <Badge variant={sessionTypeVariant[session.type]}>{session.type}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {session.date}
        {session.startTime ? ` · ${session.startTime}` : ''}
        {session.endTime ? ` – ${session.endTime}` : ''}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {session.room ?? 'Room TBD'}
        {session.mode ? ` · ${session.mode}` : ''}
      </p>
      <p className="mt-1 text-sm text-slate-600">Track: {session.track}</p>
      {session.chairs && session.chairs.length > 0 ? (
        <p className="mt-1 text-xs text-slate-500">Chairs: {session.chairs.join(', ')}</p>
      ) : null}
      {sessionPapers.length > 0 ? (
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {sessionPapers.map((paper) => (
            <li key={paper.id}>
              <p className="text-sm font-medium leading-5 text-slate-800">{paper.title}</p>
              <p className="text-xs text-slate-500">
                {paper.authors.join(', ')}
                {paper.presentationSlot ? ` · ${paper.presentationSlot}` : ''}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
