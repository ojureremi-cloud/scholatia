import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import Badge from '@/components/ui/Badge';
import type { ProjectTimelineEntry } from '@/constants/placeholder-research';

type ProjectTimelineProps = {
  entries: ProjectTimelineEntry[];
};

const typeVariant: Record<ProjectTimelineEntry['type'], 'default' | 'info' | 'success'> = {
  Milestone: 'default',
  Publication: 'info',
  Grant: 'success',
};

export function ProjectTimeline({ entries }: ProjectTimelineProps) {
  return (
    <Timeline>
      {entries.map((entry) => (
        <Timeline.Item
          key={`${entry.date}-${entry.title}`}
          date={entry.date}
          icon={
            <span className="mt-1 flex h-4 w-4 items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-slate-400" aria-hidden="true" />
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
  );
}
