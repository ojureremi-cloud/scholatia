'use client';

import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { formatRelative, notificationKindIcon, notificationKindLabel } from '../format';
import useLearning from '@/hooks/useLearning';

export function WorkspaceNotifications() {
  const { notifications } = useLearning();
  const items = notifications.slice(0, 6);

  if (items.length === 0) {
    return <WorkspaceEmptyState title="No notifications" description="Workflow notifications will appear here." />;
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Notifications
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span aria-hidden="true" className="text-xl">
              {notificationKindIcon(item.kind)}
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">{item.detail}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {notificationKindLabel(item.kind)} · {formatRelative(item.occurredAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
