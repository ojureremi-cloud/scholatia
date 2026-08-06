'use client';

import { CRIE_SESSION, CRIE_SESSION_MESSAGES, CRIE_SESSION_STATISTICS } from '@/constants/placeholder-crie';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel } from '../primitives';
import { formatDateTime, formatNumber } from '../format';
import { ResearchSession } from './ResearchSession';

export function WorkspaceExplorer() {
  const stats: CRIEStat[] = [
    { title: 'Sessions', value: formatNumber(CRIE_SESSION_STATISTICS.total), icon: '💬' },
    { title: 'Active', value: formatNumber(CRIE_SESSION_STATISTICS.active), icon: '⏱️' },
    { title: 'Ended', value: formatNumber(CRIE_SESSION_STATISTICS.ended), icon: '🏁' },
    { title: 'Goals', value: formatNumber(CRIE_SESSION_STATISTICS.totalGoals), icon: '🎯' },
  ];

  return (
    <div className="space-y-8">
      <CRIEStats stats={stats} />
      <ResearchSession session={CRIE_SESSION} />

      <Panel eyebrow="Workspace" title="Recent activity" icon="🪪">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {CRIE_SESSION_MESSAGES.map((message) => (
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
