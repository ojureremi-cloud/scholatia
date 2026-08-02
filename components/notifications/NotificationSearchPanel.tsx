'use client';

import React from 'react';
import SearchBox from '@/components/ui/SearchBox';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CATEGORY_LABELS } from '@/types/notifications';
import type { NotificationCategory } from '@/types/notifications';
import type { NotificationSort } from '@/lib/notifications';

const sortOptions: { label: string; value: NotificationSort }[] = [
  { label: 'Most recent', value: 'recent' },
  { label: 'Priority', value: 'priority' },
  { label: 'Category', value: 'category' },
];

type NotificationSearchPanelProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: 'all' | NotificationCategory;
  onCategoryChange: (value: 'all' | NotificationCategory) => void;
  sort: NotificationSort;
  onSortChange: (value: NotificationSort) => void;
  showUnreadOnly: boolean;
  onToggleUnreadOnly: () => void;
};

export default function NotificationSearchPanel({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  showUnreadOnly,
  onToggleUnreadOnly,
}: NotificationSearchPanelProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <SearchBox value={query} onChange={onQueryChange} placeholder="Search notifications..." />

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="min-w-52 flex-1">
          <Select
            label="Category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as 'all' | NotificationCategory)}
            options={[
              { label: 'All categories', value: 'all' },
              ...NOTIFICATION_CATEGORIES.map((entry) => ({ label: NOTIFICATION_CATEGORY_LABELS[entry], value: entry })),
            ]}
          />
        </div>
        <div className="min-w-44 flex-1">
          <Select
            label="Sort by"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as NotificationSort)}
            options={sortOptions}
          />
        </div>
        <div className="pb-1">
          <Switch checked={showUnreadOnly} onChange={onToggleUnreadOnly} label="Unread only" />
        </div>
      </div>
    </div>
  );
}
