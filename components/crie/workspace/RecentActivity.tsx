import type { SessionMessage } from '@/types/crie';
import { Panel } from '../primitives';
import { formatDateTime } from '../format';

type RecentActivityProps = {
  messages: SessionMessage[];
};

export function RecentActivity({ messages }: RecentActivityProps) {
  return (
    <Panel eyebrow="Workspace" title="Recent activity" icon="🕘">
      {messages.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No recent activity to show.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li key={message.id} className="flex gap-3">
              <div
                className={[
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  message.role === 'researcher' ? 'bg-sky-500' : message.role === 'agent' ? 'bg-indigo-500' : 'bg-slate-400',
                ].join(' ')}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{message.role}</p>
                  <p className="shrink-0 text-[11px] text-slate-400">{formatDateTime(message.createdAt)}</p>
                </div>
                <p className="mt-0.5 text-sm leading-6 text-slate-700 dark:text-slate-200">{message.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
