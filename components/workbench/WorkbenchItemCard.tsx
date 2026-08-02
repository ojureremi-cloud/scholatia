import { WorkbenchItemStatusBadge } from './WorkbenchBadges';
import { formatRelative, workbenchItemTypeIcon } from './format';
import type { WorkbenchItem } from '@/types/workflows';

type WorkbenchItemCardProps = {
  item: WorkbenchItem;
};

export function WorkbenchItemCard({ item }: WorkbenchItemCardProps) {
  const content = item.body ?? item.content;

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {workbenchItemTypeIcon(item.type)} v{item.version} · updated {formatRelative(item.updatedAt)}
          </p>
        </div>
        <WorkbenchItemStatusBadge status={item.status} />
      </div>

      {content && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{content}</p>
      )}

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {item.promotedTo && (
        <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          🚀 Promoted to {item.promotedTo}
        </p>
      )}
    </article>
  );
}
