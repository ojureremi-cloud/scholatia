import { Timeline } from '@/components/ui';
import type { AnnotationHistoryEntry } from '@/types/annotations';
import { formatDateTime } from './format';

type AnnotationTimelineProps = {
  history: AnnotationHistoryEntry[];
};

export function AnnotationTimeline({ history }: AnnotationTimelineProps) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-500">No history entries yet.</p>;
  }
  const sorted = [...history].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <Timeline>
      {sorted.map((entry) => (
        <Timeline.Item key={entry.id} date={formatDateTime(entry.at)} icon={<span>🔵</span>}>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {entry.actorName}
            </span>{' '}
            {entry.action} → <span className="font-semibold">{entry.toStatus}</span>
            {entry.fromStatus && entry.fromStatus !== entry.toStatus ? (
              <span className="text-slate-500"> (from {entry.fromStatus})</span>
            ) : null}
          </p>
          {entry.comment ? (
            <p className="mt-1 text-sm text-slate-500">“{entry.comment}”</p>
          ) : null}
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
