import Badge from '@/components/ui/Badge';
import { formatDate, formatRelative } from './format';
import type { Community } from '@/types/communities';

type CommunityFeedProps = {
  community: Community;
  variant?: 'overview' | 'full';
};

export function CommunityFeed({ community, variant = 'full' }: CommunityFeedProps) {
  const announcements = community.announcements;
  const spotlights = community.spotlights;
  const achievements = community.achievements;

  if (announcements.length === 0 && spotlights.length === 0 && achievements.length === 0) {
    return (
      <p className="rounded-[1.75rem] border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        No announcements, spotlights, or achievements published in this community yet.
      </p>
    );
  }

  const items = [
    ...announcements.map((item) => ({ kind: 'announcement' as const, id: item.id, title: item.title, body: item.body, author: item.authorName ?? item.author, authorUsername: item.author, createdAt: item.createdAt, pinned: item.pinned })),
    ...spotlights.map((item) => ({ kind: 'spotlight' as const, id: item.id, title: item.title, body: item.body, author: item.name ?? item.username, authorUsername: item.author, createdAt: item.publishedAt, pinned: false as const })),
    ...achievements.map((item) => ({ kind: 'achievement' as const, id: item.id, title: item.title, body: item.description ?? '', author: item.awardedTo, authorUsername: item.awardedTo, createdAt: item.awardedAt, icon: item.icon, pinned: false as const })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const visible = variant === 'overview' ? items.slice(0, 5) : items;

  return (
    <ul className="space-y-4">
      {visible.map((item) => (
        <li
          key={`${item.kind}-${item.id}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            {item.kind === 'announcement' && <Badge variant="info">📣 Announcement</Badge>}
            {item.kind === 'spotlight' && <Badge variant="success">🌟 Spotlight</Badge>}
            {item.kind === 'achievement' && <Badge variant="warning">🏆 Achievement</Badge>}
            {item.pinned && <Badge variant="warning">📌 Pinned</Badge>}
            <span className="ml-auto text-xs text-slate-400">{formatRelative(item.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            {item.kind === 'achievement' && item.icon ? `${item.icon} ` : ''}
            {item.title}
          </p>
          {item.body && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>}
          <p className="mt-2 text-xs text-slate-400">
            {item.author} · @{item.authorUsername} · {formatDate(item.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
