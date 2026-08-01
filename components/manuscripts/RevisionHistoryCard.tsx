import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ManuscriptRevision } from '@/types/manuscript';
import { formatDate } from './format';

type RevisionHistoryCardProps = {
  revisions: ManuscriptRevision[];
};

export function RevisionHistoryCard({ revisions }: RevisionHistoryCardProps) {
  if (revisions.length === 0) {
    return <p className="text-sm text-slate-500">No revisions recorded yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {revisions.map((revision) => (
        <li key={revision.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={revision.status === 'completed' ? 'success' : 'warning'}>{revision.version}</Badge>
              <span className="text-sm text-slate-500">{formatDate(revision.date)}</span>
            </div>
            <Badge variant={revision.status === 'completed' ? 'info' : 'default'}>{revision.status}</Badge>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">{revision.reason}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{revision.summary}</p>
        </li>
      ))}
    </ul>
  );
}
