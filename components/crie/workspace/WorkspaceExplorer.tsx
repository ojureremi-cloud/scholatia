'use client';

import type { ResearchSession as ResearchSessionModel, SessionMessage } from '@/types/crie';
import { sessionStatistics } from '@/lib/crie/session';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel } from '../primitives';
import { formatDateTime, formatNumber } from '../format';
import { ResearchSession } from './ResearchSession';

type WorkspaceExplorerProps = {
  session?: ResearchSessionModel;
  sessionMessages?: SessionMessage[];
};

export function WorkspaceExplorer({ session, sessionMessages = [] }: WorkspaceExplorerProps) {
  if (!session) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No sessions are available.</p>;
  }

  const stats = sessionStatistics([session]);
  const statItems: CRIEStat[] = [
    { title: 'Sessions', value: formatNumber(stats.total), icon: '💬' },
    { title: 'Active', value: formatNumber(stats.active), icon: '⏱️' },
    { title: 'Ended', value: formatNumber(stats.ended), icon: '🏁' },
    { title: 'Goals', value: formatNumber(stats.totalGoals), icon: '🎯' },
  ];

  return (
    <div className="space-y-8">
      <CRIEStats stats={statItems} />
      <ResearchSession session={session} messages={sessionMessages} />

      <Panel eyebrow="Workspace" title="Recent activity" icon="🪪">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {sessionMessages.map((message) => (
            <li key={message.id} className="py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-700 dark:text-slate-200">{message.content}</p>
                <p className="shrink-0 text-xs text-slate-400">{formatDateTime(message.createdAt)}</p>
              </div>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{message.role}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
