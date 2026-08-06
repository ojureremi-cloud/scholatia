'use client';

import type { ResearchSession, SessionMessage } from '@/types/crie';
import { CRIE_SESSION_MESSAGES } from '@/constants/placeholder-crie';
import { Chip, Panel } from '../primitives';
import { formatDateTime, statusTone } from '../format';

type ResearchSessionProps = {
  session: ResearchSession;
  messages?: SessionMessage[];
};

export function ResearchSession({ session, messages }: ResearchSessionProps) {
  const goals = session.goals ?? [];
  const transcript = messages ?? CRIE_SESSION_MESSAGES;

  return (
    <Panel eyebrow="Session" title={`Session — ${session.id}`} icon="⏱️">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Goals</h4>
          {goals.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No goals recorded for this session.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {goals.map((goal) => (
                <li key={goal.id} className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{goal.statement}</p>
                    <p className="mt-0.5 text-xs text-slate-400">Type: {goal.goalType}</p>
                  </div>
                  <Chip tone={statusTone(goal.goalType)} className="shrink-0">{goal.goalType}</Chip>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Chip tone={statusTone(session.status)}>{session.status}</Chip>
            <Chip>Started {formatDateTime(session.startedAt)}</Chip>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transcript</h4>
          <ul className="mt-3 space-y-3">
            {transcript.map((message) => (
              <li key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{message.role}</p>
                  <p className="text-[11px] text-slate-400">{formatDateTime(message.createdAt)}</p>
                </div>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{message.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
