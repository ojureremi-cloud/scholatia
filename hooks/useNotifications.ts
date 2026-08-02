'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  archiveNotification,
  dismissNotification,
  filterNotifications,
  groupByCategory,
  markRead,
  markUnread,
  searchNotifications,
  sortNotifications,
  unreadCount,
} from '@/lib/notifications';
import type { NotificationFilter, NotificationSort } from '@/lib/notifications';
import {
  ALERTS,
  ALL_NOTIFICATIONS,
  DIGESTS,
  LIFECYCLE_NOTIFICATIONS,
  NOTIFICATION_ANALYTICS,
  NOTIFICATION_PORTFOLIO,
  NOTIFICATION_STATISTICS,
  PREFERENCES,
  SUBSCRIPTIONS,
  TEMPLATES,
  URGENT_NOTIFICATIONS,
} from '@/constants/placeholder-notifications';
import type { NotificationCategory } from '@/types/notifications';

export default function useNotifications() {
  const [items, setItems] = useState(ALL_NOTIFICATIONS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | NotificationCategory>('all');
  const [sort, setSort] = useState<NotificationSort>('recent');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    const filter: NotificationFilter = { query, category };
    if (showUnreadOnly) filter.status = 'unread';
    return sortNotifications(filterNotifications(items, filter), sort);
  }, [items, query, category, sort, showUnreadOnly]);

  const searchResults = useMemo(
    () => (query.trim() ? searchNotifications(items, query) : filtered),
    [query, items, filtered],
  );

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const stats = useMemo(
    () => ({
      unread: unreadCount(items),
      read: items.filter((notification) => notification.status === 'read').length,
      archived: items.filter((notification) => notification.status === 'archived').length,
      dismissed: items.filter((notification) => notification.status === 'dismissed').length,
      urgent: URGENT_NOTIFICATIONS.length,
    }),
    [items],
  );

  const markAsRead = useCallback((id: string) => setItems((current) => markRead(current, id)), []);
  const markAsUnread = useCallback((id: string) => setItems((current) => markUnread(current, id)), []);
  const dismiss = useCallback((id: string) => setItems((current) => dismissNotification(current, id)), []);
  const archive = useCallback((id: string) => setItems((current) => archiveNotification(current, id)), []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAcknowledgedAlerts((current) => new Set(current).add(id));
  }, []);

  const toggleUnreadOnly = useCallback(() => {
    setShowUnreadOnly((current) => !current);
  }, []);

  return useMemo(
    () => ({
      portfolio: NOTIFICATION_PORTFOLIO,
      notifications: filtered,
      searchResults,
      grouped,
      stats,
      query,
      setQuery,
      category,
      setCategory,
      sort,
      setSort,
      showUnreadOnly,
      toggleUnreadOnly,
      markAsRead,
      markAsUnread,
      dismiss,
      archive,
      unreadCount: stats.unread,
      alerts: ALERTS,
      acknowledgedAlerts,
      acknowledgeAlert,
      activeAlerts: ALERTS.filter((alert) => !acknowledgedAlerts.has(alert.id)),
      lifecycle: LIFECYCLE_NOTIFICATIONS,
      statistics: NOTIFICATION_STATISTICS,
      analytics: NOTIFICATION_ANALYTICS,
      preferences: PREFERENCES,
      templates: TEMPLATES,
      channels: NOTIFICATION_PORTFOLIO.channels,
      deliveries: NOTIFICATION_PORTFOLIO.deliveries,
      digests: DIGESTS,
      subscriptions: SUBSCRIPTIONS,
    }),
    [
      filtered,
      searchResults,
      grouped,
      stats,
      query,
      category,
      sort,
      showUnreadOnly,
      toggleUnreadOnly,
      markAsRead,
      markAsUnread,
      dismiss,
      archive,
      acknowledgedAlerts,
      acknowledgeAlert,
    ],
  );
}
