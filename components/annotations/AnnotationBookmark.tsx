import type { Annotation } from '@/types/annotations';
import { Badge, Button } from '@/components/ui';
import { formatRelative } from './format';

type AnnotationBookmarkProps = {
  annotations: Annotation[];
  currentUserName?: string;
  onToggleBookmark?: (id: string) => void;
};

export function AnnotationBookmark({
  annotations,
  currentUserName,
  onToggleBookmark,
}: AnnotationBookmarkProps) {
  const bookmarked = annotations.filter((annotation) => annotation.bookmarks.length > 0);

  if (bookmarked.length === 0) {
    return <p className="text-sm text-slate-500">No annotations are bookmarked yet.</p>;
  }

  return (
    <div className="space-y-3">
      {bookmarked.map((annotation) => (
        <div
          key={annotation.id}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <span className="text-lg">🔖</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {annotation.title ?? 'Annotation'}
            </p>
            <p className="text-xs text-slate-500">
              {annotation.bookmarks.length} bookmark
              {annotation.bookmarks.length === 1 ? '' : 's'}
              {annotation.bookmarks[0]?.userName
                ? ` · saved by ${annotation.bookmarks[0].userName}`
                : ''}
            </p>
          </div>
          <Badge variant="info">{annotation.type}</Badge>
          <p className="text-xs text-slate-500">
            {formatRelative(annotation.bookmarks[0]?.createdAt)}
          </p>
          {onToggleBookmark ? (
            <Button variant="outline" size="sm" onClick={() => onToggleBookmark(annotation.id)}>
              Remove
            </Button>
          ) : null}
        </div>
      ))}
      {currentUserName ? (
        <p className="text-xs text-slate-500">
          Bookmark visibility is per-user ({currentUserName}); other users&apos; bookmarks are only
          counted, never exposed.
        </p>
      ) : null}
    </div>
  );
}
