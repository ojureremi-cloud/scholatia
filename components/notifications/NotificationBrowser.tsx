'use client';

import React from 'react';
import useNotifications from '@/hooks/useNotifications';
import NotificationSearchPanel from './NotificationSearchPanel';
import NotificationCategoryTabs from './NotificationCategoryTabs';
import NotificationCard from './NotificationCard';

type NotificationBrowserProps = {
  showGrouping?: boolean;
};

export default function NotificationBrowser({ showGrouping = false }: NotificationBrowserProps) {
  const {
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    showUnreadOnly,
    toggleUnreadOnly,
    searchResults,
    grouped,
    markAsRead,
    markAsUnread,
    archive,
    dismiss,
  } = useNotifications();

  const counts: Partial<Record<string, number>> = {};
  grouped.forEach((group) => {
    counts[group.category] = group.items.length;
  });

  return (
    <div className="space-y-6">
      <NotificationSearchPanel
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={toggleUnreadOnly}
      />

      <NotificationCategoryTabs active={category} onChange={setCategory} counts={counts} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {searchResults.length} {searchResults.length === 1 ? 'notification' : 'notifications'}
          {query.trim() ? ` for "${query.trim()}"` : ''}
        </p>
        <p className="text-xs text-slate-400">{showUnreadOnly ? 'unread only' : 'all statuses'}</p>
      </div>

      {showGrouping ? (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.category} className="space-y-4">
              <p className="font-semibold text-slate-900">
                {group.label} <span className="text-sm font-normal text-slate-400">({group.items.length})</span>
              </p>
              <div className="grid gap-4">
                {group.items.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markAsRead}
                    onMarkUnread={markAsUnread}
                    onArchive={archive}
                    onDismiss={dismiss}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {searchResults.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
              onMarkUnread={markAsUnread}
              onArchive={archive}
              onDismiss={dismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
}
