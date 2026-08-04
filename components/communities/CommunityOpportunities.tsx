import Badge from '@/components/ui/Badge';
import { formatDate, formatOpportunityKind, formatOpportunityKindIcon } from './format';
import type { Community } from '@/types/communities';

type CommunityOpportunitiesProps = {
  community: Community;
};

export function CommunityOpportunities({ community }: CommunityOpportunitiesProps) {
  if (community.opportunities.length === 0) {
    return <p className="text-sm text-slate-400">No opportunities shared in this community yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {community.opportunities.map((opportunity) => (
        <li
          key={opportunity.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{formatOpportunityKindIcon(opportunity.kind)}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{opportunity.title}</p>
            <Badge variant="default">{formatOpportunityKind(opportunity.kind)}</Badge>
          </div>
          {opportunity.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{opportunity.description}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            posted by @{opportunity.postedBy} · {formatDate(opportunity.postedAt)}
            {opportunity.deadline ? ` · deadline ${formatDate(opportunity.deadline)}` : ''}
          </p>
          {opportunity.url && (
            <p className="mt-1 truncate text-xs text-sky-600 dark:text-sky-400">{opportunity.url}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
