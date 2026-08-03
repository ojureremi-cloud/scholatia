import Badge from '@/components/ui/Badge';
import { formatDate } from './format';
import type { Group } from '@/types/groups';

type GroupAnnouncementsProps = {
  group: Group;
};

export function GroupAnnouncements({ group }: GroupAnnouncementsProps) {
  if (group.announcements.length === 0) {
    return <p className="text-sm text-slate-400">No announcements broadcast to this group yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {group.announcements.map((announcement) => (
        <li
          key={announcement.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">📢</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{announcement.title}</p>
            {announcement.pinned && <Badge variant="warning">📌 Pinned</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{announcement.body}</p>
          <p className="mt-1 text-xs text-slate-400">
            {announcement.authorName ?? announcement.author} · {formatDate(announcement.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
