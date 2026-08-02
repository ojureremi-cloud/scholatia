import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatCategory, formatCategoryIcon, formatDateTime, formatPriority, formatRelative, priorityVariant } from './format';
import { notificationUrl } from './format';
import type { Notification } from '@/types/notifications';

type NotificationCardProps = {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDismiss?: (id: string) => void;
};

export default function NotificationCard({
  notification,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDismiss,
}: NotificationCardProps) {
  const url = notificationUrl(notification.source);

  return (
    <article
      className={[
        'rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        notification.status === 'unread' ? 'border-sky-200 ring-2 ring-sky-100' : 'border-slate-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{formatCategoryIcon(notification.category)}</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <a href={url} className="font-semibold text-slate-900 hover:text-sky-700">
                {notification.title}
              </a>
              <Badge variant={priorityVariant(notification.priority)}>{formatPriority(notification.priority)}</Badge>
              {notification.status === 'unread' ? <Badge variant="warning">Unread</Badge> : null}
            </div>
            <p className="mt-1 text-xs text-slate-400">{formatCategory(notification.category)}</p>
          </div>
        </div>
        <p className="shrink-0 text-xs text-slate-400" title={formatDateTime(notification.createdAt)}>
          {formatRelative(notification.createdAt)}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{notification.body}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <a href={url} className="text-xs font-medium text-sky-700 hover:text-sky-900">
          {notification.source.title ?? notification.source.id}
        </a>
        <div className="flex flex-wrap gap-2">
          {notification.status === 'unread' && onMarkRead ? (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Mark read
            </button>
          ) : null}
          {notification.status === 'read' && onMarkUnread ? (
            <button
              type="button"
              onClick={() => onMarkUnread(notification.id)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Mark unread
            </button>
          ) : null}
          {onArchive ? (
            <button
              type="button"
              onClick={() => onArchive(notification.id)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Archive
            </button>
          ) : null}
          {onDismiss ? (
            <button
              type="button"
              onClick={() => onDismiss(notification.id)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Dismiss
            </button>
          ) : null}
        </div>
      </div>

      {notification.action ? (
        <a
          href={notification.action.url ?? url}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          {notification.action.label} →
        </a>
      ) : null}
    </article>
  );
}
