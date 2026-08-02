import React from 'react';
import Badge from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { formatCategory, formatCategoryIcon, formatDateTime, formatPriority, priorityVariant } from './format';
import { notificationUrl } from './format';
import type { Notification } from '@/types/notifications';

type NotificationTimelineProps = {
  notifications: Notification[];
};

export default function NotificationTimeline({ notifications }: NotificationTimelineProps) {
  return (
    <Timeline>
      {notifications.map((notification) => (
        <Timeline.Item
          key={notification.id}
          date={formatDateTime(notification.createdAt)}
          icon={<span className="text-xl">{formatCategoryIcon(notification.category)}</span>}
        >
          <div className="flex flex-wrap items-center gap-2">
            <a href={notificationUrl(notification.source)} className="font-semibold text-slate-900 hover:text-sky-700">
              {notification.title}
            </a>
            <Badge variant={priorityVariant(notification.priority)}>{formatPriority(notification.priority)}</Badge>
            <span className="text-xs text-slate-400">{formatCategory(notification.category)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{notification.body}</p>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
