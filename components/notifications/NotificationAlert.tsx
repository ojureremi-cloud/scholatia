'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { formatCategory, formatCategoryIcon, formatRelative } from './format';
import { notificationUrl } from './format';
import type { NotificationAlert } from '@/types/notifications';

type NotificationAlertProps = {
  alert: NotificationAlert;
  onAcknowledge?: (id: string) => void;
};

export default function NotificationAlert({ alert, onAcknowledge }: NotificationAlertProps) {
  return (
    <div
      className={[
        'rounded-[1.75rem] border p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        alert.priority === 'urgent' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50',
      ]
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {alert.priority === 'urgent' ? '🚨' : '⚠️'} {formatCategoryIcon(alert.category)}
          </span>
          <div>
            <p className="font-semibold text-slate-900">{alert.title}</p>
            <p className="mt-1 text-xs text-slate-500">{formatCategory(alert.category)}</p>
          </div>
        </div>
        <p className="shrink-0 text-xs text-slate-500">{formatRelative(alert.createdAt)}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">{alert.message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a href={notificationUrl(alert.source)} className="text-xs font-medium text-slate-600 underline hover:text-slate-900">
          {alert.source.title ?? alert.source.id}
        </a>
        {!alert.acknowledged && onAcknowledge ? (
          <Button size="sm" onClick={() => onAcknowledge(alert.id)}>
            Acknowledge
          </Button>
        ) : null}
      </div>
    </div>
  );
}
