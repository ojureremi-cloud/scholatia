import { formatRelative } from './format';
import type { ActivityBookmark } from '@/types/activity';

type BookmarkCardProps = {
  bookmark: ActivityBookmark;
};

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <span className="text-xl">👤</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{bookmark.bookmarkedByName}</p>
        <p className="text-xs text-slate-400">bookmarked {formatRelative(bookmark.bookmarkedAt)}</p>
      </div>
      <span aria-hidden>🔖</span>
    </div>
  );
}
