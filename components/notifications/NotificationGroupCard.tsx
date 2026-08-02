import React from 'react';
import NotificationCard from './NotificationCard';
import { formatCategory, formatCategoryIcon, formatNumber } from './format';
import type { Notification } from '@/types/notifications';
import type { NotificationCategory } from '@/types/notifications';

type NotificationGroupCardProps = {
  group: { category: NotificationCategory; label: string; items: Notification[] };
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDismiss?: (id: string) => void;
};

export default function NotificationGroupCard({
  group,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDismiss,
}: NotificationGroupCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{formatCategoryIcon(group.category)}</span>
          <div>
            <p className="font-semibold text-slate-900">{formatCategory(group.category)}</p>
            <p className="text-xs text-slate-400">{formatNumber(group.items.length)} notifications</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {formatNumber(group.items.filter((notification) => notification.status === 'unread').length)} unread
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {group.items.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
            onMarkUnread={onMarkUnread}
            onArchive={onArchive}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </section>
  );
}
