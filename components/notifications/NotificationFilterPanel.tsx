'use client';

import React from 'react';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { NOTIFICATION_PRIORITIES, NOTIFICATION_PRIORITY_LABELS, NOTIFICATION_STATUSES, NOTIFICATION_STATUS_LABELS } from '@/types/notifications';
import type { NotificationChannel, NotificationPriority, NotificationStatus } from '@/types/notifications';

type NotificationFilterPanelProps = {
  priority: NotificationPriority | 'all';
  onPriorityChange: (value: NotificationPriority | 'all') => void;
  status: NotificationStatus | 'all';
  onStatusChange: (value: NotificationStatus | 'all') => void;
  channel: NotificationChannel | 'all';
  onChannelChange: (value: NotificationChannel | 'all') => void;
  showArchived: boolean;
  onToggleArchived: () => void;
};

const channelOptions: { label: string; value: NotificationChannel | 'all' }[] = [
  { label: 'All channels', value: 'all' },
  { label: 'In-app', value: 'in-app' },
  { label: 'Email', value: 'email' },
  { label: 'Push', value: 'push' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Desktop', value: 'desktop' },
  { label: 'SMS', value: 'sms' },
  { label: 'Webhook', value: 'webhook' },
];

export default function NotificationFilterPanel({
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  channel,
  onChannelChange,
  showArchived,
  onToggleArchived,
}: NotificationFilterPanelProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Filters</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Select
          label="Priority"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as NotificationPriority | 'all')}
          options={[
            { label: 'All priorities', value: 'all' },
            ...NOTIFICATION_PRIORITIES.map((entry) => ({ label: NOTIFICATION_PRIORITY_LABELS[entry], value: entry })),
          ]}
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as NotificationStatus | 'all')}
          options={[
            { label: 'All statuses', value: 'all' },
            ...NOTIFICATION_STATUSES.map((entry) => ({ label: NOTIFICATION_STATUS_LABELS[entry], value: entry })),
          ]}
        />
        <Select
          label="Channel"
          value={channel}
          onChange={(event) => onChannelChange(event.target.value as NotificationChannel | 'all')}
          options={channelOptions}
        />
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <Switch checked={showArchived} onChange={onToggleArchived} label="Show archived notifications" />
      </div>
    </div>
  );
}
