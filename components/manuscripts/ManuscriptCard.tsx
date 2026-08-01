import React from 'react';
import Badge from '@/components/ui/Badge';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';
import type { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import { formatShortDate } from './format';

const statusVariant: Record<ManuscriptStatus, 'success' | 'warning' | 'info' | 'default' | 'danger'> = {
  draft: 'warning',
  submitted: 'info',
  'under-review': 'info',
  'major-revision': 'warning',
  'minor-revision': 'warning',
  accepted: 'success',
  rejected: 'danger',
  withdrawn: 'default',
};

type ManuscriptCardProps = {
  manuscript: Manuscript;
};

export function ManuscriptCard({ manuscript }: ManuscriptCardProps) {
  const stage = ResearchLifecycleEngine.getStage(manuscript.stageId);
  const latestSubmission = [...manuscript.submissions]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[manuscript.status]}>{manuscript.status}</Badge>
          {stage ? (
            <Badge variant="default">
              {stage.icon} {stage.name}
            </Badge>
          ) : null}
        </div>
        <span className="text-xl" aria-hidden="true">
          ✍️
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{manuscript.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{manuscript.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {manuscript.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <dt className="text-slate-500">Authors</dt>
          <dd className="font-semibold text-slate-900">{manuscript.authors.length}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Versions</dt>
          <dd className="font-semibold text-slate-900">{manuscript.versions.length}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Target journal</dt>
          <dd className="font-semibold text-slate-900">
            {latestSubmission?.journalTitle ?? manuscript.targetJournals[0]?.journal.journalTitle ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Updated</dt>
          <dd className="font-semibold text-slate-900">{formatShortDate(manuscript.updatedAt ?? manuscript.createdAt)}</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-700">
          {manuscript.doi ?? manuscript.preprintDoi ?? manuscript.id}
        </span>
        {manuscript.submissions.length > 0 ? (
          <>
            {' '}
            · {latestSubmission?.journalTitle}
          </>
        ) : null}
      </p>
    </div>
  );
}
