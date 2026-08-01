import React from 'react';
import { formatDate, formatNotificationType } from './format';
import type { MarketplaceNotification } from '@/types/marketplace';

type NotificationCardProps = {
  notification: MarketplaceNotification;
};

export default function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatNotificationType(notification.type)}
        </span>
        {!notification.read ? (
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" aria-label="Unread" />
        ) : null}
      </div>

      <h3 className="mt-3 font-semibold text-slate-900">{notification.title}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{notification.body}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>For {notification.recipientId}</span>
        <span>{formatDate(notification.createdAt)}</span>
      </div>
    </article>
  );
}
