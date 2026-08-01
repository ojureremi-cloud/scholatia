'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import JournalSubmissionStatusCard from '@/components/journals/SubmissionStatusCard';
import JournalPeerReviewCard from '@/components/journals/PeerReviewCard';
import useSubmission from '@/hooks/useSubmission';
import usePeerReview from '@/hooks/usePeerReview';
import type { JournalProfile } from '@/types/identity';
import type { TargetJournal } from '@/types/manuscript';

const fitVariant: Record<TargetJournal['fit'], 'success' | 'warning' | 'default'> = {
  high: 'success',
  medium: 'warning',
  low: 'default',
};

const statusVariant: Record<TargetJournal['status'], 'success' | 'warning' | 'info' | 'default' | 'danger'> = {
  considered: 'default',
  preparing: 'default',
  submitted: 'info',
  'under-review': 'info',
  'in-revision': 'warning',
  accepted: 'success',
  rejected: 'danger',
  withdrawn: 'default',
};

type TargetJournalItemProps = {
  journal: JournalProfile;
};

function TargetJournalItem({ journal }: TargetJournalItemProps) {
  const { submissionTypes } = useSubmission(journal);
  const { peerReviewModes } = usePeerReview(journal);

  return (
    <div>
      <p className="text-sm leading-6 text-slate-600">{journal.aimsAndScope}</p>
      <p className="mt-3 text-xs text-slate-500">
        Accepts {submissionTypes.length} submission types · offers {peerReviewModes.length} peer review
        models
      </p>
      <div className="mt-4 space-y-3">
        <JournalSubmissionStatusCard journal={journal} />
        <JournalPeerReviewCard journal={journal} />
      </div>
    </div>
  );
}

type JournalTargetCardProps = {
  journals: TargetJournal[];
};

export function JournalTargetCard({ journals }: JournalTargetCardProps) {
  if (journals.length === 0) {
    return <p className="text-sm text-slate-500">No target journals identified yet.</p>;
  }
  return (
    <div className="space-y-5">
      {journals.map((target) => (
        <div key={target.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                {target.journal.publicationType}
              </p>
              <h4 className="mt-1 font-semibold text-slate-900">{target.journal.journalTitle}</h4>
              <p className="mt-1 text-sm text-slate-600">
                {target.journal.publisher} · {target.journal.country}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={fitVariant[target.fit]}>Fit: {target.fit}</Badge>
              <Badge variant={statusVariant[target.status]}>{target.status}</Badge>
            </div>
          </div>
          <div className="mt-4">
            <TargetJournalItem journal={target.journal} />
          </div>
        </div>
      ))}
    </div>
  );
}
