'use client';

import Badge from '@/components/ui/Badge';
import useCommunities from '@/hooks/useCommunities';
import { formatDate, formatRelative, formatTime } from './format';
import { communityUrl } from '@/lib/communities';
import type { Community } from '@/types/communities';

export function CommunityGlobalFeed() {
  const communities = useCommunities();

  const items = communities.visible.flatMap((community) => [
    ...community.announcements.map((item) => ({
      kind: 'announcement' as const,
      communityId: community.id,
      communityName: community.name,
      communitySlug: community.slug,
      id: item.id,
      title: item.title,
      body: item.body,
      author: item.authorName ?? item.author,
      authorUsername: item.author,
      createdAt: item.createdAt,
      pinned: item.pinned,
    })),
    ...community.spotlights.map((item) => ({
      kind: 'spotlight' as const,
      communityId: community.id,
      communityName: community.name,
      communitySlug: community.slug,
      id: item.id,
      title: item.title,
      body: item.body,
      author: item.name ?? item.username,
      authorUsername: item.author,
      createdAt: item.publishedAt,
      pinned: false,
    })),
    ...community.achievements.map((item) => ({
      kind: 'achievement' as const,
      communityId: community.id,
      communityName: community.name,
      communitySlug: community.slug,
      id: item.id,
      title: item.title,
      body: item.description ?? '',
      author: item.awardedTo,
      authorUsername: item.awardedTo,
      createdAt: item.awardedAt,
      pinned: false,
      icon: item.icon,
    })),
  ]);

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (items.length === 0) {
    return (
      <p className="rounded-[1.75rem] border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        No announcements, spotlights, or achievements across any visible community yet.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.slice(0, 30).map((item) => (
        <li
          key={`${item.kind}-${item.communityId}-${item.id}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            {item.kind === 'announcement' && <Badge variant="info">📣 Announcement</Badge>}
            {item.kind === 'spotlight' && <Badge variant="success">🌟 Spotlight</Badge>}
            {item.kind === 'achievement' && <Badge variant="warning">🏆 Achievement</Badge>}
            <a
              href={communityUrl({ slug: item.communitySlug } as Community)}
              className="text-xs font-bold text-sky-600 hover:underline dark:text-sky-400"
            >
              {item.communityName}
            </a>
            {item.pinned && <Badge variant="warning">📌 Pinned</Badge>}
            <span className="ml-auto text-xs text-slate-400">{formatRelative(item.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            {item.kind === 'achievement' && item.icon ? `${item.icon} ` : ''}
            {item.title}
          </p>
          {item.body && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>}
          <p className="mt-2 text-xs text-slate-400">
            {item.author} · @{item.authorUsername} · {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
