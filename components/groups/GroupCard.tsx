import { GroupBadge } from './GroupBadge';
import { GroupVerificationBadge } from './GroupVerificationBadge';
import { GroupVisibilityBadge } from './GroupVisibilityBadge';
import { formatCategoryIcon, formatNumber, formatRelative } from './format';
import { groupUrl } from '@/lib/groups';
import type { Group } from '@/types/groups';

type GroupCardProps = {
  group: Group;
};

export function GroupCard({ group }: GroupCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
          {group.profileImage ?? formatCategoryIcon(group.category)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            <a href={groupUrl(group)} className="hover:underline">
              {group.name}
            </a>
          </h3>
          <p className="text-xs text-slate-400">
            {group.ownerName ?? group.owner} · updated {formatRelative(group.updatedAt)}
          </p>
        </div>
        <GroupVerificationBadge status={group.verificationStatus} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <GroupBadge category={group.category} />
        <GroupVisibilityBadge visibility={group.visibility} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{group.description}</p>

      <p className="mt-2 text-xs text-slate-400">
        {group.institution} · {group.country} · {group.discipline}
      </p>

      {group.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {group.keywords.slice(0, 4).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-900 dark:text-sky-300"
            >
              #{keyword}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
        <span>👥 {formatNumber(group.memberCount)} members</span>
        <span>📄 {formatNumber(group.publicationCount)} pubs</span>
        <span>📅 {formatNumber(group.eventCount)} events</span>
        <span>📚 {formatNumber(group.resourceCount)} resources</span>
      </div>
    </article>
  );
}
