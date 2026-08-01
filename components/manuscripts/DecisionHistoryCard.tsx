import React from 'react';
import Badge from '@/components/ui/Badge';
import type { EditorialDecisionType, Manuscript } from '@/types/manuscript';
import { formatDate } from './format';

const decisionVariant: Record<EditorialDecisionType, 'success' | 'warning' | 'danger' | 'default'> = {
  accept: 'success',
  'minor-revision': 'warning',
  'major-revision': 'warning',
  reject: 'danger',
  withdraw: 'default',
};

type DecisionHistoryCardProps = {
  manuscript: Manuscript;
};

export function DecisionHistoryCard({ manuscript }: DecisionHistoryCardProps) {
  const decisions = manuscript.submissions
    .flatMap((submission) =>
      submission.decision ? [{ ...submission.decision, journalTitle: submission.journalTitle }] : []
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  if (decisions.length === 0) {
    return <p className="text-sm text-slate-500">No editorial decisions recorded yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {decisions.map((decision) => (
        <li key={decision.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={decisionVariant[decision.type]}>{decision.type}</Badge>
              <span className="text-sm font-medium text-slate-900">
                Round {decision.round} · {decision.journalTitle}
              </span>
            </div>
            <span className="text-xs text-slate-500">{formatDate(decision.date)}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{decision.summary}</p>
        </li>
      ))}
    </ul>
  );
}
