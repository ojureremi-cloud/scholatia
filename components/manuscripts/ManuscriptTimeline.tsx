import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import Badge from '@/components/ui/Badge';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';
import type { ManuscriptTimelineEntry } from '@/types/manuscript';

const MANUSCRIPT_STAGE = ResearchLifecycleEngine.getStage('manuscript')!;
const SUBMISSION_STAGE = ResearchLifecycleEngine.getStage('submission')!;
const PEER_REVIEW_STAGE = ResearchLifecycleEngine.getStage('peer-review')!;
const ANALYSIS_STAGE = ResearchLifecycleEngine.getPreviousStage('manuscript')!;
const PUBLICATION_STAGE = ResearchLifecycleEngine.getNextStage('peer-review')!;

const typeVariant: Record<ManuscriptTimelineEntry['type'], 'default' | 'info' | 'success' | 'warning'> = {
  Draft: 'default',
  Submission: 'info',
  Review: 'info',
  Decision: 'warning',
  Revision: 'warning',
  Acceptance: 'success',
  Withdrawal: 'default',
};

const typeColor: Record<ManuscriptTimelineEntry['type'], string> = {
  Draft: 'bg-slate-400',
  Submission: 'bg-sky-500',
  Review: 'bg-blue-500',
  Decision: 'bg-amber-500',
  Revision: 'bg-orange-500',
  Acceptance: 'bg-emerald-500',
  Withdrawal: 'bg-slate-400',
};

type ManuscriptTimelineProps = {
  entries: ManuscriptTimelineEntry[];
};

export function ManuscriptTimeline({ entries }: ManuscriptTimelineProps) {
  return (
    <div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">{ANALYSIS_STAGE.icon}</span>
            {ANALYSIS_STAGE.name}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            →
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${MANUSCRIPT_STAGE.color}`}
          >
            <span aria-hidden="true" className="mr-1">
              {MANUSCRIPT_STAGE.icon}
            </span>
            {MANUSCRIPT_STAGE.name} · Stage {MANUSCRIPT_STAGE.order}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            →
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${SUBMISSION_STAGE.color}`}
          >
            <span aria-hidden="true" className="mr-1">
              {SUBMISSION_STAGE.icon}
            </span>
            {SUBMISSION_STAGE.name} · Stage {SUBMISSION_STAGE.order}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            →
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${PEER_REVIEW_STAGE.color}`}
          >
            <span aria-hidden="true" className="mr-1">
              {PEER_REVIEW_STAGE.icon}
            </span>
            {PEER_REVIEW_STAGE.name} · Stage {PEER_REVIEW_STAGE.order}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            →
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">{PUBLICATION_STAGE.icon}</span>
            {PUBLICATION_STAGE.name}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {MANUSCRIPT_STAGE.description} Then {SUBMISSION_STAGE.description.toLowerCase()}, then{' '}
          {PEER_REVIEW_STAGE.description.toLowerCase()}.
        </p>
      </div>
      <Timeline>
        {entries.map((entry) => (
          <Timeline.Item
            key={`${entry.date}-${entry.title}`}
            date={entry.date}
            icon={
              <span className="mt-1 flex h-4 w-4 items-center justify-center">
                <span className={`h-3 w-3 rounded-full ${typeColor[entry.type]}`} aria-hidden="true" />
              </span>
            }
          >
            <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">{entry.title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">{entry.detail}</p>
              </div>
              <Badge variant={typeVariant[entry.type]}>{entry.type}</Badge>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}
