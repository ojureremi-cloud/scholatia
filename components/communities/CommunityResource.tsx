import Badge from '@/components/ui/Badge';
import { formatDate, formatResourceType, formatResourceTypeIcon } from './format';
import type { Community } from '@/types/communities';

type CommunityResourceProps = {
  community: Community;
};

export function CommunityResource({ community }: CommunityResourceProps) {
  if (community.resources.length === 0) {
    return <p className="text-sm text-slate-400">No resources curated by this community yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {community.resources.map((resource) => (
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
          </p>
          {(resource.url || resource.doi) && (
            <p className="mt-1 truncate text-xs text-sky-600 dark:text-sky-400">
              {resource.doi ? `DOI ${resource.doi}` : resource.url}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
