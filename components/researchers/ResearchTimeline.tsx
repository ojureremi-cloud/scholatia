'use client';

import { Timeline } from '@/components/ui/Timeline';
import type { ResearcherProfile } from '@/types/researcher';

type ResearchTimelineProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchTimeline({ researcher, className = '' }: ResearchTimelineProps) {
  const entries = researcher.timeline;
  if (entries.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No timeline entries yet.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Research timeline</h3>
      <div className="mt-5">
        <Timeline>
          {entries.map((entry) => (
            <Timeline.Item key={entry.id} date={entry.date}>
              <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
              <p className="mt-1 text-sm text-slate-600">{entry.detail}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-sky-700">{entry.type}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </section>
  );
}
