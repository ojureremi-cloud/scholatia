import type {
  Notification,
  NotificationAlert,
  NotificationAnalytics,
  NotificationCategory,
  NotificationChannel,
  NotificationDelivery,
  NotificationDigest,
  NotificationDigestFrequency,
  NotificationDigestSummary,
  NotificationPreference,
  NotificationPriority,
  NotificationSource,
  NotificationSourceEntityType,
  NotificationStatistics,
  NotificationStatus,
  NotificationSubscription,
  NotificationTarget,
  NotificationTemplate,
} from '@/types/notifications';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_SOURCE_ENTITY_TYPES,
} from '@/types/notifications';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Unified Notification Engine (Phase 2.2A).
 *
 * The event-driven notification backbone of the platform. This module is pure —
 * no React, no side effects, no API calls — and is deliberately written
 * API-shaped so every helper can be exported directly as an endpoint in later
 * phases (Mobile API, Enterprise API). It owns no records: notifications
 * reference their source records by canonical ID, delivery is decomposed into
 * templates, channels, deliveries, digests, and subscriptions, and consuming
 * modules (Activity Feed, Messaging, Email, Push, Mobile, Enterprise) reuse
 * these helpers instead of re-implementing routing or digest logic.
 */

/** Canonical route resolution for a notification source. */
export function buildNotificationUrl(source: NotificationSource): string {
  switch (source.entityType) {
    case 'researcher':
      return source.title ? `/researchers/${source.id}` : `/researchers`;
    case 'journal':
      return `/journals`;
    case 'conference':
      return `/conferences`;
    case 'institution':
      return `/institutions`;
    case 'publisher':
      return `/publishers`;
    case 'project':
      return `/research/${source.id}`;
    case 'publication':
      return `/publications`;
    case 'dataset':
      return `/datasets`;
    case 'manuscript':
      return `/manuscripts`;
    case 'funding':
      return `/funding`;
    case 'order':
      return `/commerce`;
    case 'service':
      return `/services`;
    case 'listing':
      return `/marketplace`;
    case 'campaign':
      return `/ads`;
    case 'subscription':
      return `/commerce`;
    case 'review':
      return `/marketplace`;
    case 'dispute':
      return `/services`;
    case 'milestone':
      return `/services`;
    default:
      return `/notifications`;
  }
}

/** A generated canonical notification ID: ntf-{kebab-id}. */
export function notificationId(label: string): string {
  const key = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `ntf-${key}`;
}

/** Create a notification from a partial input, filling canonical defaults. */
export function createNotification(input: {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  channels?: NotificationChannel[];
  source: NotificationSource;
  target: NotificationTarget;
  actor?: Notification['actor'];
  action?: Notification['action'];
  stageId?: ResearchLifecycleStageId;
  metadata?: Record<string, string>;
  createdAt?: string;
  readAt?: string;
  archivedAt?: string;
  expiresAt?: string;
}): Notification {
  return {
    id: input.id,
    title: input.title,
    body: input.body,
    category: input.category,
    priority: input.priority ?? 'normal',
    status: input.status ?? 'unread',
    channels: input.channels ?? ['in-app'],
    source: input.source,
    target: input.target,
    actor: input.actor,
    action: input.action ?? (input.source.url ? { label: 'View', url: input.source.url } : undefined),
    stageId: input.stageId,
    metadata: input.metadata,
    createdAt: input.createdAt ?? new Date().toISOString(),
    readAt: input.readAt,
    archivedAt: input.archivedAt,
    expiresAt: input.expiresAt,
  };
}

/** Publish a new notification into a list, most recent first. */
export function publishNotification(
  notifications: readonly Notification[],
  input: Parameters<typeof createNotification>[0],
): Notification[] {
  return [createNotification(input), ...notifications];
}

function mapNotification(
  notifications: readonly Notification[],
  id: string,
  update: (notification: Notification) => Notification,
): Notification[] {
  return notifications.map((notification) => (notification.id === id ? update(notification) : notification));
}

/** Mark a notification as read. */
export function markRead(notifications: readonly Notification[], id: string): Notification[] {
  return mapNotification(notifications, id, (notification) =>
    notification.status === 'read'
      ? notification
      : { ...notification, status: 'read', readAt: notification.readAt ?? new Date().toISOString() },
  );
}

/** Mark a notification as unread. */
export function markUnread(notifications: readonly Notification[], id: string): Notification[] {
  return mapNotification(notifications, id, (notification) =>
    notification.status === 'unread' ? notification : { ...notification, status: 'unread', readAt: undefined },
  );
}

/** Archive a notification. */
export function archiveNotification(notifications: readonly Notification[], id: string): Notification[] {
  return mapNotification(notifications, id, (notification) =>
    notification.status === 'archived'
      ? notification
      : { ...notification, status: 'archived', archivedAt: notification.archivedAt ?? new Date().toISOString() },
  );
}

/** Dismiss a notification without archiving it. */
export function dismissNotification(notifications: readonly Notification[], id: string): Notification[] {
  return mapNotification(notifications, id, (notification) =>
    notification.status === 'dismissed' ? notification : { ...notification, status: 'dismissed' },
  );
}

/** Count of unread notifications. */
export function unreadCount(notifications: readonly Notification[]): number {
  return notifications.filter((notification) => notification.status === 'unread').length;
}

/** Count of notifications for a status. */
export function countByStatus(notifications: readonly Notification[], status: NotificationStatus): number {
  return notifications.filter((notification) => notification.status === status).length;
}

/** Group notifications by category, preserving recency within each group. */
export function groupByCategory(
  notifications: readonly Notification[],
): { category: NotificationCategory; label: string; items: Notification[] }[] {
  return NOTIFICATION_CATEGORIES.map((category) => ({
    category,
    label: category,
    items: notifications.filter((notification) => notification.category === category),
  })).filter((group) => group.items.length > 0);
}

/** Group notifications by priority, from urgent to low. */
export function groupByPriority(
  notifications: readonly Notification[],
): { priority: NotificationPriority; items: Notification[] }[] {
  return NOTIFICATION_PRIORITIES.map((priority) => ({
    priority,
    items: notifications.filter((notification) => notification.priority === priority),
  })).filter((group) => group.items.length > 0);
}

/** Whether a notification is addressed to a target identity. */
export function targetsNotification(notification: Notification, target: NotificationTarget): boolean {
  if (target.username && notification.target.username === target.username) return true;
  if (target.userId && notification.target.userId === target.userId) return true;
  if (target.said && notification.target.said === target.said) return true;
  if (target.entityType && notification.target.entityType === target.entityType) return true;
  return false;
}

/** All notifications for a given target. */
export function notificationsForUser(
  notifications: readonly Notification[],
  target: NotificationTarget,
): Notification[] {
  return notifications.filter((notification) => targetsNotification(notification, target));
}

/** Notifications referencing a specific source record. */
export function notificationsBySource(notifications: readonly Notification[], sourceId: string): Notification[] {
  return notifications.filter((notification) => notification.source.id === sourceId);
}

/** Notifications routed through a specific channel. */
export function notificationsByChannel(notifications: readonly Notification[], channel: NotificationChannel): Notification[] {
  return notifications.filter((notification) => notification.channels.includes(channel));
}

/** Notifications tied to a canonical lifecycle stage. */
export function notificationsByLifecycle(
  notifications: readonly Notification[],
  stageId: ResearchLifecycleStageId,
): Notification[] {
  return notifications.filter((notification) => notification.stageId === stageId);
}

/** Notifications for a given source entity type. */
export function notificationsBySourceType(
  notifications: readonly Notification[],
  entityType: NotificationSourceEntityType,
): Notification[] {
  return notifications.filter((notification) => notification.source.entityType === entityType);
}

export type NotificationFilter = {
  query?: string;
  category?: NotificationCategory | 'all';
  priority?: NotificationPriority | 'all';
  status?: NotificationStatus | 'all';
  channel?: NotificationChannel | 'all';
  sourceEntityType?: NotificationSourceEntityType;
  target?: NotificationTarget;
};

/** Free-text search across notification title and body. */
export function searchNotifications(notifications: readonly Notification[], query: string): Notification[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [...notifications];
  return notifications.filter((notification) => {
    const haystack = [notification.title, notification.body, notification.category, notification.source.id]
      .join(' ')
      .toLowerCase();
    return haystack.includes(trimmed);
  });
}

/** Apply the notification filter set without re-implementing it in the UI. */
export function filterNotifications(
  notifications: readonly Notification[],
  filter: NotificationFilter = {},
): Notification[] {
  return notifications.filter((notification) => {
    if (filter.query && !searchNotifications([notification], filter.query).length) return false;
    if (filter.category && filter.category !== 'all' && notification.category !== filter.category) return false;
    if (filter.priority && filter.priority !== 'all' && notification.priority !== filter.priority) return false;
    if (filter.status && filter.status !== 'all' && notification.status !== filter.status) return false;
    if (filter.channel && filter.channel !== 'all' && !notification.channels.includes(filter.channel)) return false;
    if (filter.sourceEntityType && notification.source.entityType !== filter.sourceEntityType) return false;
    if (filter.target && !targetsNotification(notification, filter.target)) return false;
    return true;
  });
}

export type NotificationSort = 'recent' | 'priority' | 'category';

/** Sort a notification slice; priority orders urgent first, then recent. */
export function sortNotifications(
  notifications: readonly Notification[],
  sort: NotificationSort = 'recent',
): Notification[] {
  const sorted = [...notifications];
  switch (sort) {
    case 'priority': {
      const rank: Record<NotificationPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
      return sorted.sort(
        (a, b) => rank[a.priority] - rank[b.priority] || b.createdAt.localeCompare(a.createdAt),
      );
    }
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category) || b.createdAt.localeCompare(a.createdAt));
    case 'recent':
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/** Recency threshold used to slice a digest window. */
export function digestCutoff(frequency: NotificationDigestFrequency, now: Date): Date {
  const cutoff = new Date(now);
  if (frequency === 'daily') cutoff.setDate(cutoff.getDate() - 1);
  if (frequency === 'weekly') cutoff.setDate(cutoff.getDate() - 7);
  return cutoff;
}

function digestSummary(items: readonly Notification[]): NotificationDigestSummary {
  const byCategory = NOTIFICATION_CATEGORIES.map((category) => ({
    category,
    count: items.filter((notification) => notification.category === category).length,
  })).filter((entry) => entry.count > 0);
  const byPriority = NOTIFICATION_PRIORITIES.map((priority) => ({
    priority,
    count: items.filter((notification) => notification.priority === priority).length,
  })).filter((entry) => entry.count > 0);
  return {
    total: items.length,
    unread: unreadCount(items),
    byCategory,
    byPriority,
  };
}

/** Build a digest for a target over the most recent window. */
export function digestNotifications(
  notifications: readonly Notification[],
  target: NotificationTarget,
  frequency: NotificationDigestFrequency,
  now = new Date(),
): NotificationDigest {
  const cutoff = digestCutoff(frequency, now);
  const items = notifications
    .filter((notification) => targetsNotification(notification, target))
    .filter((notification) => new Date(notification.createdAt) >= cutoff)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return {
    id: `digest-${frequency}-${target.username ?? target.userId ?? target.said ?? 'all'}`,
    target,
    frequency,
    generatedAt: now.toISOString(),
    items,
    summary: digestSummary(items),
  };
}

/** Whether a notification should be delivered to a target on a channel. */
export function shouldDeliver(
  preference: NotificationPreference | undefined,
  notification: Notification,
  channel: NotificationChannel,
): boolean {
  if (!preference) return true;
  if (preference.muted) return false;
  if (preference.category !== 'identity' && preference.category !== notification.category) return false;
  if (preference.channels[channel] === false) return false;
  if (preference.digestFrequency !== 'realtime' && channel !== 'in-app') return false;
  return true;
}

/** Render a plain-text email digest for a target. */
export function buildEmailDigest(
  digest: NotificationDigest,
  appName = 'Scholatia',
): { subject: string; body: string } {
  const lines = digest.items.map((item, index) => {
    const prefix = item.priority === 'urgent' ? '[URGENT] ' : '';
    return `${index + 1}. ${prefix}${item.title} — ${item.body}`;
  });
  const subject = `${appName} digest (${digest.frequency}): ${digest.summary.total} notification${
    digest.summary.total === 1 ? '' : 's'
  }${digest.summary.unread ? `, ${digest.summary.unread} unread` : ''}`;
  const body = [
    `Your ${appName} ${digest.frequency} digest — generated ${digest.generatedAt}.`,
    '',
    ...lines,
    '',
    'Manage your preferences at your Scholatia notification settings.',
  ].join('\n');
  return { subject, body };
}

/** Build a push notification payload for a single notification. */
export function buildPushPayload(notification: Notification): { title: string; body: string; data: Record<string, string> } {
  return {
    title: notification.priority === 'urgent' ? `⚠️ ${notification.title}` : notification.title,
    body: notification.body,
    data: {
      notificationId: notification.id,
      category: notification.category,
      priority: notification.priority,
      sourceId: notification.source.id,
      sourceEntity: notification.source.entityType,
      url: notification.action?.url ?? buildNotificationUrl(notification.source),
    },
  };
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

function categoryStats(notifications: readonly Notification[]): { category: NotificationCategory; count: number; unread: number }[] {
  return NOTIFICATION_CATEGORIES.map((category) => {
    const items = notifications.filter((notification) => notification.category === category);
    return {
      category,
      count: items.length,
      unread: items.filter((notification) => notification.status === 'unread').length,
    };
  }).filter((stat) => stat.count > 0);
}

function priorityStats(notifications: readonly Notification[]): {
  priority: NotificationPriority;
  count: number;
  unread: number;
}[] {
  return NOTIFICATION_PRIORITIES.map((priority) => {
    const items = notifications.filter((notification) => notification.priority === priority);
    return {
      priority,
      count: items.length,
      unread: items.filter((notification) => notification.status === 'unread').length,
    };
  }).filter((stat) => stat.count > 0);
}

function statusStats(notifications: readonly Notification[]): { status: NotificationStatus; count: number }[] {
  const statuses: NotificationStatus[] = ['unread', 'read', 'archived', 'dismissed'];
  return statuses.map((status) => ({ status, count: countByStatus(notifications, status) }));
}

function channelStats(
  notifications: readonly Notification[],
  deliveries: readonly NotificationDelivery[],
): { channel: NotificationChannel; count: number; delivered: number }[] {
  return NOTIFICATION_CHANNELS.map((channel) => {
    const items = notifications.filter((notification) => notification.channels.includes(channel));
    const delivered = deliveries.filter(
      (delivery) =>
        delivery.channel === channel && (delivery.status === 'delivered' || delivery.status === 'opened' || delivery.status === 'clicked'),
    ).length;
    return { channel, count: items.length, delivered };
  }).filter((stat) => stat.count > 0);
}

export function notificationStatistics(input: {
  notifications: readonly Notification[];
  preferences: readonly NotificationPreference[];
  templates: readonly NotificationTemplate[];
  subscriptions: readonly NotificationSubscription[];
  deliveries: readonly NotificationDelivery[];
  digests: readonly NotificationDigest[];
  alerts: readonly NotificationAlert[];
}): NotificationStatistics {
  const { notifications, templates, subscriptions, deliveries, digests, alerts } = input;
  const totalDeliveries = deliveries.length;
  const succeeded = deliveries.filter(
    (delivery) => delivery.status !== 'queued' && delivery.status !== 'failed',
  ).length;
  return {
    totalNotifications: notifications.length,
    totalUnread: unreadCount(notifications),
    totalRead: countByStatus(notifications, 'read'),
    totalArchived: countByStatus(notifications, 'archived'),
    totalDismissed: countByStatus(notifications, 'dismissed'),
    totalCategories: NOTIFICATION_CATEGORIES.length,
    totalTemplates: templates.length,
    totalSubscriptions: subscriptions.length,
    totalDigests: digests.length,
    totalDeliveries,
    deliverySuccessRate: totalDeliveries > 0 ? Math.round((succeeded / totalDeliveries) * 100) : 0,
    activeAlerts: alerts.filter((alert) => !alert.acknowledged).length,
    byCategory: categoryStats(notifications),
    byPriority: priorityStats(notifications),
    byStatus: statusStats(notifications),
    byChannel: channelStats(notifications, deliveries),
  };
}

export function notificationAnalytics(input: {
  notifications: readonly Notification[];
  deliveries: readonly NotificationDelivery[];
  digests: readonly NotificationDigest[];
}): NotificationAnalytics {
  const { notifications, deliveries, digests } = input;
  const total = deliveries.length;
  const sent = deliveries.filter((delivery) => delivery.status === 'sent').length;
  const delivered = deliveries.filter((delivery) => delivery.status === 'delivered').length;
  const opened = deliveries.filter((delivery) => delivery.status === 'opened' || delivery.status === 'clicked').length;
  const clicked = deliveries.filter((delivery) => delivery.status === 'clicked').length;
  const failed = deliveries.filter((delivery) => delivery.status === 'failed').length;
  const byCategory = categoryStats(notifications);
  const byPriority = priorityStats(notifications);
  const sources = new Map<string, { sourceId: string; entityType: NotificationSourceEntityType; count: number }>();
  for (const notification of notifications) {
    const existing = sources.get(notification.source.id);
    if (existing) {
      existing.count += 1;
    } else {
      sources.set(notification.source.id, {
        sourceId: notification.source.id,
        entityType: notification.source.entityType,
        count: 1,
      });
    }
  }
  return {
    totalDeliveries: total,
    totalSent: sent,
    totalDelivered: delivered,
    totalOpened: opened,
    totalClicked: clicked,
    totalFailed: failed,
    deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
    openRate: delivered > 0 ? Math.round((opened / delivered) * 100) : 0,
    clickRate: delivered > 0 ? Math.round((clicked / delivered) * 100) : 0,
    deliveryByChannel: channelStats(notifications, deliveries),
    byCategory,
    byPriority,
    topSources: Array.from(sources.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    digestsGenerated: digests.length,
    digestsDelivered: digests.filter((digest) => Boolean(digest.sentAt)).length,
  };
}

/** Stable entity-type vocabulary reused by consumers and validation. */
export { NOTIFICATION_SOURCE_ENTITY_TYPES };
