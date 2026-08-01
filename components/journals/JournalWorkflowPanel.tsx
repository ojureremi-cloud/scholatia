'use client';

import React from 'react';
import useSubmission from '@/hooks/useSubmission';
import usePeerReview from '@/hooks/usePeerReview';
import type { JournalProfile } from '@/types/identity';

type JournalWorkflowPanelProps = {
  journal: JournalProfile;
  className?: string;
};

export default function JournalWorkflowPanel({ journal, className = '' }: JournalWorkflowPanelProps) {
  const { submissionTypes } = useSubmission(journal);
  const { workflow, peerReviewModes } = usePeerReview(journal);

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div>
        <p className="text-sm font-semibold text-slate-900">Peer review workflow</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {workflow.length} stages from {workflow[0]} to {workflow[workflow.length - 1]}, surfaced from the
          publication workflow stages of the featured journal.
        </p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {workflow.map((stage, index) => (
            <li
              key={stage}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-slate-800">{stage}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">Accepted submission types</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {submissionTypes.map((type) => (
            <span
              key={type}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">Peer review modes</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {peerReviewModes.map((mode) => (
            <span
              key={mode}
              className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700"
            >
              {mode}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
