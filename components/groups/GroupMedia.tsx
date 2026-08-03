import Badge from '@/components/ui/Badge';
import { formatDate, formatMediaKind, formatMediaKindIcon } from './format';
import type { Group } from '@/types/groups';

type GroupMediaProps = {
  group: Group;
};

export function GroupMedia({ group }: GroupMediaProps) {
  if (group.media.length === 0) {
    return <p className="text-sm text-slate-400">No media in this group gallery yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {group.media.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <span className="flex h-20 items-center justify-center rounded-2xl bg-slate-100 text-4xl dark:bg-slate-800">
            {formatMediaKindIcon(item.kind)}
          </span>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
            <Badge variant="default">{formatMediaKind(item.kind)}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            uploaded by @{item.uploadedBy} · {formatDate(item.uploadedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}
