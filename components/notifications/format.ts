import { buildNotificationUrl } from '@/lib/notifications';
import {
  NOTIFICATION_CATEGORY_ICONS,
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CHANNEL_ICONS,
  NOTIFICATION_CHANNEL_LABELS,
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_STATUS_LABELS,
} from '@/types/notifications';
import type {
  NotificationCategory,
  NotificationChannel,
  NotificationDigestFrequency,
  NotificationEventType,
  NotificationPriority,
  NotificationSource,
  NotificationStatus,
} from '@/types/notifications';

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDateTime(iso: string | undefined): string {
  return `${formatDate(iso)} at ${formatTime(iso)}`;
}

/** Human-relative time, e.g. "2h ago". Falls back to a formatted date. */
export function formatRelative(iso: string | undefined, now = new Date()): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(iso);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatCategory(category: NotificationCategory): string {
  return NOTIFICATION_CATEGORY_LABELS[category] ?? category;
}

export function formatCategoryIcon(category: NotificationCategory): string {
  return NOTIFICATION_CATEGORY_ICONS[category] ?? '🔔';
}

export function formatChannel(channel: NotificationChannel): string {
  return NOTIFICATION_CHANNEL_LABELS[channel] ?? channel;
}

export function formatChannelIcon(channel: NotificationChannel): string {
  return NOTIFICATION_CHANNEL_ICONS[channel] ?? '🔔';
}

export function formatPriority(priority: NotificationPriority): string {
  return NOTIFICATION_PRIORITY_LABELS[priority] ?? priority;
}

export function formatStatus(status: NotificationStatus): string {
  return NOTIFICATION_STATUS_LABELS[status] ?? status;
}

export function formatFrequency(frequency: NotificationDigestFrequency): string {
  const labels: Record<NotificationDigestFrequency, string> = {
    realtime: 'Real-time',
    daily: 'Daily digest',
    weekly: 'Weekly digest',
  };
  return labels[frequency] ?? frequency;
}

export function formatEventType(event: NotificationEventType): string {
  return event.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function notificationUrl(source: NotificationSource): string {
  return source.url ?? buildNotificationUrl(source);
}

export function priorityVariant(priority: NotificationPriority): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (priority) {
    case 'urgent':
      return 'danger';
    case 'high':
      return 'warning';
    case 'low':
      return 'default';
    case 'normal':
    default:
      return 'info';
  }
}

export function statusVariant(status: NotificationStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'unread':
      return 'warning';
    case 'read':
      return 'info';
    case 'archived':
      return 'default';
    case 'dismissed':
      return 'danger';
    default:
      return 'default';
  }
}
