'use client';

import { useState } from 'react';
import { ACTIVITY_EMOJI_PALETTE } from '@/constants/placeholder-activity';
import useActivity from '@/hooks/useActivity';
import { ActivityComposer } from './ActivityComposer';
import { ActivityFeed } from './ActivityFeed';
import { ActivityFeedTabs } from './ActivityFeedTabs';
import { ActivityFilters } from './ActivityFilters';
import { ActivitySearch } from './ActivitySearch';
import { ModerationQueue } from './ModerationQueue';
import type { ActivityFeedKind } from '@/types/activity';

export function ActivityBrowser() {
  const activity = useActivity();
  const [activeKind, setActiveKind] = useState<ActivityFeedKind | 'all'>('all');

  const feed = activity.feeds.find((entry) => entry.kind === activeKind);
  const list = activity.query.trim()
    ? activity.searchResults
    : activeKind === 'all'
      ? activity.activities
      : feed?.items ?? [];

  return (
    <div className="space-y-6">
      <ActivityComposer onSubmit={activity.post} />

      <div className="space-y-4">
        <ActivityFeedTabs feeds={activity.feeds} activeKind={activeKind} onKindChange={setActiveKind} />
        <ActivitySearch query={activity.query} onQueryChange={activity.setQuery} />
        <ActivityFilters
          type={activity.type}
          onTypeChange={activity.setType}
          sort={activity.sort}
          onSortChange={activity.setSort}
          publicOnly={activity.showPublicOnly}
          onPublicOnlyChange={activity.togglePublicOnly}
        />
      </div>

      <ActivityFeed
        activities={list}
        comments={activity.comments}
        currentUserId={activity.currentUser}
        emojiPalette={ACTIVITY_EMOJI_PALETTE}
        isBookmarked={activity.isBookmarked}
        isPinned={activity.isPinned}
        onReact={activity.react}
        onUnreact={activity.unreact}
        onToggleBookmark={activity.toggleBookmarkOn}
        onRepost={activity.repost}
        onPin={activity.pin}
        onUnpin={activity.unpin}
        onComment={activity.commentOn}
        onReply={activity.replyOn}
      />

      <section aria-label="Moderation queue">
        <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">🛡️ Moderation queue</h2>
        <ModerationQueue
          queue={activity.queue}
          onResolve={activity.resolveReportById}
          onModerate={activity.applyModerationDecision}
        />
      </section>
    </div>
  );
}
