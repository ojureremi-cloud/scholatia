import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatChannel, formatChannelIcon, formatDateTime } from './format';
import type { NotificationChannel } from '@/types/notifications';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  queued: 'warning',
  sent: 'info',
  delivered: 'success',
  opened: 'success',
  clicked: 'success',
  failed: 'danger',
};

type NotificationDeliveryCardProps = {
  delivery: {
    id: string;
    notificationId: string;
    channel: NotificationChannel;
    status: string;
    queuedAt?: string;
    sentAt?: string;
    deliveredAt?: string;
    openedAt?: string;
    clickedAt?: string;
    error?: string;
  };
};

export default function NotificationDeliveryCard({ delivery }: NotificationDeliveryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4">
      <span className="text-xl">{formatChannelIcon(delivery.channel)}</span>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-900">{formatChannel(delivery.channel)}</p>
          <Badge variant={statusVariant[delivery.status] ?? 'default'}>{delivery.status}</Badge>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{delivery.notificationId}</p>
        {delivery.error ? <p className="mt-1 text-xs text-rose-600">{delivery.error}</p> : null}
      </div>
      <div className="shrink-0 text-right text-xs text-slate-400">
        <p>Queued: {formatDateTime(delivery.queuedAt)}</p>
        <p>Delivered: {formatDateTime(delivery.deliveredAt)}</p>
      </div>
    </div>
  );
}
