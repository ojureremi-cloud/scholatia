import React from 'react';
import Badge from '@/components/ui/Badge';
import JournalReviewerCard from '@/components/journals/ReviewerCard';
import type { Manuscript, Recommendation } from '@/types/manuscript';
import { formatDate } from './format';

const recommendationVariant: Record<Recommendation, 'success' | 'warning' | 'info' | 'danger'> = {
  accept: 'success',
  'minor-revision': 'warning',
  'major-revision': 'warning',
  reject: 'danger',
};

interface ReviewerAssignment {
  reviewer: string;
  rounds: number[];
  completed: boolean;
}

type ReviewerAssignmentCardProps = {
  manuscript: Manuscript;
};

export function ReviewerAssignmentCard({ manuscript }: ReviewerAssignmentCardProps) {
  const assignments = new Map<string, ReviewerAssignment>();
  const comments = manuscript.submissions.flatMap((submission) =>
    submission.rounds.flatMap((round) => round.comments)
  );

  manuscript.submissions.forEach((submission) => {
    submission.rounds.forEach((round) => {
      round.invitedReviewers.forEach((reviewer) => {
        const entry = assignments.get(reviewer) ?? { reviewer, rounds: [], completed: false };
        entry.rounds.push(round.round);
        if (round.completedReviews.includes(reviewer)) entry.completed = true;
        assignments.set(reviewer, entry);
      });
    });
  });

  const assignedReviewers = [...assignments.values()];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Assigned reviewers</p>
        {assignedReviewers.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {assignedReviewers.map((assignment) => (
              <li key={assignment.reviewer} className="rounded-2xl border border-slate-200 p-3">
                <JournalReviewerCard name={assignment.reviewer} />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">
                    Round{assignment.rounds.length > 1 ? 's' : ''} {assignment.rounds.join(', ')}
                  </p>
                  <Badge variant={assignment.completed ? 'success' : 'info'}>
                    {assignment.completed ? 'Completed' : 'Assigned'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No reviewers have been assigned yet.</p>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reviewer summaries</p>
        {comments.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {comment.anonymous ? comment.reviewer : comment.reviewer}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">{comment.anonymous ? 'Anonymous' : 'Open'}</Badge>
                    <Badge variant={recommendationVariant[comment.recommendation]}>
                      {comment.recommendation}
                    </Badge>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">{formatDate(comment.date)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{comment.summary}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{comment.details}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No reviewer summaries available yet.</p>
        )}
      </div>
    </div>
  );
}
