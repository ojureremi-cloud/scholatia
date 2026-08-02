'use client';

import { formatFeedKind, formatFeedKindIcon } from './format';
import type { ActivityFeed, ActivityFeedKind } from '@/types/activity';

type ActivityFeedTabsProps = {
  feeds: ActivityFeed[];
  activeKind: ActivityFeedKind | 'all';
  onKindChange: (kind: ActivityFeedKind | 'all') => void;
};

export function ActivityFeedTabs({ feeds, activeKind, onKindChange }: ActivityFeedTabsProps) {
  const tabs: { kind: ActivityFeedKind | 'all'; label: string; icon: string }[] = [
    { kind: 'all', label: 'All', icon: '🗂️' },
    ...feeds.map((feed) => ({
      kind: feed.kind,
      label: formatFeedKind(feed.kind),
      icon: formatFeedKindIcon(feed.kind),
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.kind}
          type="button"
          onClick={() => onKindChange(tab.kind)}
          className={[
            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition',
            activeKind === tab.kind
              ? 'bg-slate-900 text-white'
              : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
