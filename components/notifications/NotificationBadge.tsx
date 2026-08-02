'use client';

import React from 'react';
import { formatNumber } from './format';

type NotificationBadgeProps = {
  unread: number;
  className?: string;
};

export default function NotificationBadge({ unread, className = '' }: NotificationBadgeProps) {
  return (
    <div className={['relative inline-flex', className].filter(Boolean).join(' ')}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl shadow-sm">
        🔔
      </span>
      {unread > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-semibold text-white">
          {formatNumber(unread)}
        </span>
      ) : null}
    </div>
  );
}
