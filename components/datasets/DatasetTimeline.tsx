import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import Badge from '@/components/ui/Badge';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';
import { DATASET_LIFECYCLE_STAGE_ID, type DatasetTimelineEntry } from '@/types/dataset';

const DATASET_STAGE = ResearchLifecycleEngine.getStage(DATASET_LIFECYCLE_STAGE_ID)!;
const PREVIOUS_STAGE = ResearchLifecycleEngine.getPreviousStage(DATASET_LIFECYCLE_STAGE_ID)!;
const NEXT_STAGE = ResearchLifecycleEngine.getNextStage(DATASET_LIFECYCLE_STAGE_ID)!;

const typeVariant: Record<DatasetTimelineEntry['type'], 'default' | 'info' | 'success' | 'warning'> = {
  Collection: 'success',
  Version: 'info',
  Verification: 'warning',
  Publication: 'default',
  Project: 'default',
};

type DatasetTimelineProps = {
  entries: DatasetTimelineEntry[];
};

export function DatasetTimeline({ entries }: DatasetTimelineProps) {
  return (
    <div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">{PREVIOUS_STAGE.icon}</span>
            {PREVIOUS_STAGE.name}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            →
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${DATASET_STAGE.color}`}
          >
            <span aria-hidden="true" className="mr-1">
              {DATASET_STAGE.icon}
            </span>
            {DATASET_STAGE.name} · Stage {DATASET_STAGE.order}
          </span>
          <span aria-hidden="true" className="text-slate-400">
            →
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">{NEXT_STAGE.icon}</span>
            {NEXT_STAGE.name}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{DATASET_STAGE.description}</p>
      </div>
      <Timeline>
        {entries.map((entry) => (
          <Timeline.Item
            key={`${entry.date}-${entry.title}`}
            date={entry.date}
            icon={
              <span className="mt-1 flex h-4 w-4 items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-teal-500" aria-hidden="true" />
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
