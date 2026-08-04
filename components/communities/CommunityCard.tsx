import { CommunityBadge } from './CommunityBadge';
import { CommunityVerificationBadge } from './CommunityVerificationBadge';
import { CommunityVisibilityBadge } from './CommunityVisibilityBadge';
import { formatCategoryIcon, formatNumber, formatRelative } from './format';
import { communityUrl } from '@/lib/communities';
import type { Community } from '@/types/communities';

type CommunityCardProps = {
  community: Community;
};

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
          {community.profileImage ?? formatCategoryIcon(community.category)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            <a href={communityUrl(community)} className="hover:underline">
              {community.name}
            </a>
          </h3>
          <p className="text-xs text-slate-400">
            {community.creatorName ?? community.creator} · updated {formatRelative(community.updatedAt)}
          </p>
        </div>
        <CommunityVerificationBadge status={community.verificationStatus} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <CommunityBadge category={community.category} />
        <CommunityVisibilityBadge visibility={community.visibility} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{community.description}</p>

      <p className="mt-2 text-xs text-slate-400">
        {community.discipline} · {community.country} · {community.language}
      </p>

      {community.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {community.keywords.slice(0, 4).map((keyword) => (
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
        <span>👥 {formatNumber(community.memberCount)} members</span>
        <span>🔔 {formatNumber(community.followerCount)} followers</span>
        <span>💬 {formatNumber(community.discussionCount)} threads</span>
        <span>📈 {formatNumber(community.activityScore)} activity</span>
      </div>
    </article>
  );
}
