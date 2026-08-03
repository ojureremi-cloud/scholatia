import Badge from '@/components/ui/Badge';
import { formatDate, formatResourceType, formatResourceTypeIcon } from './format';
import type { Group } from '@/types/groups';

type GroupResourcesProps = {
  group: Group;
};

export function GroupResources({ group }: GroupResourcesProps) {
  if (group.resources.length === 0) {
    return <p className="text-sm text-slate-400">No resources curated by this group yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {group.resources.map((resource) => (
        <li
          key={resource.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{formatResourceTypeIcon(resource.type)}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{resource.title}</p>
            <Badge variant="default">{formatResourceType(resource.type)}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            contributed by @{resource.contributor} · added {formatDate(resource.addedAt)}
            {resource.url ? ` · ${resource.url}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}
