'use client';

import React from 'react';
import type { ConferenceProfile } from '@/types/identity';
import { CONFERENCE_LIFECYCLE_STAGE_ID } from '@/types/conference';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';

type ConferenceTimelineProps = {
  conference: ConferenceProfile;
  className?: string;
};

export default function ConferenceTimeline({ conference, className = '' }: ConferenceTimelineProps) {
  const stage = ResearchLifecycleEngine.getStage(CONFERENCE_LIFECYCLE_STAGE_ID);
  const previousStage = ResearchLifecycleEngine.getPreviousStage(CONFERENCE_LIFECYCLE_STAGE_ID);
  const nextStage = ResearchLifecycleEngine.getNextStage(CONFERENCE_LIFECYCLE_STAGE_ID);

  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Event timeline</h3>
      <div className="mt-4 space-y-3">
        <p className="text-sm text-slate-600">Start: {conference.startDate ?? 'TBD'}</p>
        <p className="text-sm text-slate-600">End: {conference.endDate ?? 'TBD'}</p>
        <p className="text-sm text-slate-600">Timezone: {conference.timezone ?? 'TBD'}</p>
      </div>

      {stage ? (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-900">Research lifecycle position</p>
          <ol className="mt-4 space-y-3">
            {[previousStage, stage, nextStage].map((entry, index) => (
              <li key={entry?.id ?? `position-${index}`} className="flex items-center gap-3">
                <span
                  className={[
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    index === 1 ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600',
                  ].join(' ')}
                >
                  {index + 1}
                </span>
                <div>
                  <p
                    className={[
                      'text-sm font-medium',
                      index === 1 ? 'text-sky-800' : 'text-slate-700',
                    ].join(' ')}
                  >
                    {entry?.title}
                    {index === 1 ? ' (current)' : ''}
                  </p>
                  {entry?.description ? (
                    <p className="text-xs text-slate-500">{entry.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
