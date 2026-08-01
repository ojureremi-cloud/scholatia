import React from 'react';
import { RecommendationBadge, ReviewModelBadge } from './TrustBadge';
import { formatDateLabel } from './format';
import type { ReviewerAssignment } from '@/types/trust';

type PeerReviewAssignmentCardProps = {
  assignment: ReviewerAssignment;
  featured?: boolean;
};

const statusStyles: Record<ReviewerAssignment['status'], string> = {
  invited: 'bg-slate-100 text-slate-700',
  accepted: 'bg-sky-50 text-sky-700',
  declined: 'bg-rose-50 text-rose-700',
  'in-progress': 'bg-amber-50 text-amber-700',
  submitted: 'bg-emerald-50 text-emerald-700',
  withdrawn: 'bg-slate-100 text-slate-500',
  completed: 'bg-emerald-50 text-emerald-700',
};

export default function PeerReviewAssignmentCard({ assignment, featured = false }: PeerReviewAssignmentCardProps) {
  const statusLabel = assignment.status.replace('-', ' ');
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[assignment.status]}`}>{statusLabel}</span>
        <ReviewModelBadge model={assignment.model} />
      </div>
      <h3 className={['mt-3 font-semibold text-slate-900', featured ? 'text-xl leading-8' : 'text-lg leading-7'].join(' ')}>
        {assignment.manuscriptTitle}
      </h3>
      <p className="mt-1 text-xs font-medium text-slate-400">
        {assignment.journalName} · {assignment.manuscriptId}
      </p>
      <div className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">
        <p>
          Reviewer: <span className="font-semibold text-slate-800">{assignment.reviewerName}</span>
        </p>
        {assignment.conflictOfInterest ? (
          <p className="font-medium text-rose-600">Conflict of interest declared</p>
        ) : null}
        {assignment.anonymized ? <p className="font-medium text-slate-500">Anonymized review</p> : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Invited {formatDateLabel(assignment.invitedAt)}</span>
        {assignment.submittedAt ? <span>Submitted {formatDateLabel(assignment.submittedAt)}</span> : null}
      </div>
      {assignment.recommendation ? (
        <div className="mt-3">
          <RecommendationBadge recommendation={assignment.recommendation} />
        </div>
      ) : null}
    </article>
  );
}
