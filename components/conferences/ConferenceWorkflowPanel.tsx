'use client';

import React from 'react';
import useConferenceSchedule from '@/hooks/useConferenceSchedule';
import type { ConferenceRecord } from '@/types/conference';

type ConferenceWorkflowPanelProps = {
  conference: ConferenceRecord;
  className?: string;
};

export default function ConferenceWorkflowPanel({ conference, className = '' }: ConferenceWorkflowPanelProps) {
  const { sessions, getSessionsByDate } = useConferenceSchedule(conference);

  const sessionDates = [...new Set(sessions.map((session) => session.date))].sort();

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div>
        <p className="text-sm font-semibold text-slate-900">Submission workflow</p>
        <div className="mt-3 space-y-2">
          {conference.submissions.map((submission) => (
            <div
              key={submission.type}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="text-sm font-medium text-slate-800">{submission.type}</span>
              <span className="text-xs text-slate-500">
                {submission.required ? 'Required' : 'Optional'}
                {submission.deadline ? ` · ${submission.deadline}` : ''}
              </span>
            </div>
          ))}
          {conference.submissionDeadline ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-800">Full paper</span>
              <span className="text-xs text-slate-500">{conference.submissionDeadline}</span>
            </div>
          ) : null}
          {conference.cameraReadyDeadline ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-800">Camera ready</span>
              <span className="text-xs text-slate-500">{conference.cameraReadyDeadline}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">Programme schedule</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {sessions.length} sessions across {sessionDates.length} days, surfaced from the conference programme.
        </p>
        <div className="mt-4 space-y-4">
          {sessionDates.map((date) => (
            <div key={date}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{date}</p>
              <ol className="mt-2 space-y-2">
                {getSessionsByDate(date).map((session, index) => (
                  <li
                    key={session.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{session.name}</p>
                      <p className="text-xs text-slate-500">
                        {session.type}
                        {session.startTime ? ` · ${session.startTime}` : ''}
                        {session.room ? ` · ${session.room}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
