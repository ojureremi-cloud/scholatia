import React from 'react';
import Badge from '@/components/ui/Badge';
import JournalSubmissionStatusCard from '@/components/journals/SubmissionStatusCard';
import type { Manuscript, SubmissionStageStatus } from '@/types/manuscript';
import { formatDate } from './format';

const statusVariant: Record<SubmissionStageStatus, 'success' | 'warning' | 'info' | 'default' | 'danger'> = {
  submitted: 'info',
  'under-review': 'info',
  'major-revision': 'warning',
  'minor-revision': 'warning',
  accepted: 'success',
  rejected: 'danger',
  withdrawn: 'default',
};

type SubmissionStatusCardProps = {
  manuscript: Manuscript;
};

export function SubmissionStatusCard({ manuscript }: SubmissionStatusCardProps) {
  const latest = [...manuscript.submissions]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
  const primaryJournal =
    manuscript.targetJournals.find((target) => target.journal.journalId === latest?.journalId) ??
    manuscript.targetJournals[0];

  if (!latest || !primaryJournal) {
    return (
      <p className="text-sm leading-6 text-slate-500">
        This manuscript has not been submitted to a journal yet. Target journals are listed in the
        journal targets section.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[latest.status]}>{latest.status}</Badge>
            <span className="text-sm font-medium text-slate-900">{latest.journalTitle}</span>
          </div>
          <span className="text-xs text-slate-500">{latest.manuscriptId ?? 'ID assigned by journal'}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">Submitted on {formatDate(latest.submittedAt)}</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Submission type</dt>
            <dd className="font-semibold text-slate-900">{latest.submissionType}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Review model</dt>
            <dd className="font-semibold text-slate-900">{latest.reviewModel}</dd>
          </div>
        </dl>
      </div>
      <JournalSubmissionStatusCard journal={primaryJournal.journal} />
    </div>
  );
}
