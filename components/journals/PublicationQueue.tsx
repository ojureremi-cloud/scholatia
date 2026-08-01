'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { PublicationQueueEntry, PublicationWorkflowStage } from '@/types/identity';

type PublicationQueueProps = {
  entries: PublicationQueueEntry[];
  className?: string;
};

const stageVariant: Record<PublicationWorkflowStage, 'default' | 'success' | 'warning' | 'info'> = {
  Submission: 'default',
  'Editorial Screening': 'default',
  'Reviewer Assignment': 'info',
  'Peer Review': 'info',
  Decision: 'default',
  Revision: 'warning',
  Acceptance: 'success',
  Copyediting: 'default',
  Typesetting: 'default',
  Proofreading: 'default',
  Publication: 'success',
  Archiving: 'default',
};

export default function PublicationQueue({ entries, className = '' }: PublicationQueueProps) {
  if (entries.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">The production queue is currently empty.</p>;
  }

  return (
    <div className={['space-y-3', className].filter(Boolean).join(' ')}>
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
            <Badge variant={stageVariant[entry.stage]}>{entry.stage}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">{entry.authors.join(', ')}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {entry.doi ? <span>DOI: {entry.doi}</span> : null}
            {entry.issue ? <span>Issue: {entry.issue}</span> : null}
            {entry.scheduledPublication ? <span>Scheduled: {entry.scheduledPublication}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
