import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import Badge from '@/components/ui/Badge';
import type { PublicationTimelineEntry } from '@/constants/placeholder-research';

type PublicationTimelineProps = {
  entries: PublicationTimelineEntry[];
};

export function PublicationTimeline({ entries }: PublicationTimelineProps) {
  return (
    <Timeline>
      {entries.map((entry) => (
        <Timeline.Item
          key={`${entry.year}-${entry.title}`}
          date={entry.year}
          icon={
            <span className="mt-1 flex h-4 w-4 items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-sky-500" aria-hidden="true" />
            </span>
          }
        >
          <div className="rounded-2xl bg-slate-50 p-4">
            <h4 className="font-semibold text-slate-900">{entry.title}</h4>
            <p className="mt-1 text-sm text-slate-600">
              {entry.venue} · <span className="font-medium text-slate-700">{entry.type}</span>
            </p>
            <div className="mt-2">
              <Badge variant="default">{entry.citations} citations</Badge>
            </div>
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
