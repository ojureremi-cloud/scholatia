'use client';

import Button from '@/components/ui/Button';
import useCommunities from '@/hooks/useCommunities';
import { CommunityBadge } from './CommunityBadge';
import { CommunityVerificationBadge } from './CommunityVerificationBadge';
import { CommunityVisibilityBadge } from './CommunityVisibilityBadge';
import { formatCategoryIcon, formatDate, formatNumber, formatRelative, formatRole } from './format';
import type { Community } from '@/types/communities';

type CommunityHeaderProps = {
  community: Community;
};

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const communities = useCommunities();
  const role = communities.roleOf(community.id);
  const following = communities.isFollowing(community);

  return (
    <header className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
            {community.profileImage ?? formatCategoryIcon(community.category)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{community.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {community.creatorName ?? community.creator} · created {formatDate(community.createdAt)} · updated{' '}
              {formatRelative(community.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CommunityBadge category={community.category} />
          <CommunityVisibilityBadge visibility={community.visibility} />
          <CommunityVerificationBadge status={community.verificationStatus} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{community.description}</p>

      <p className="mt-2 text-xs text-slate-400">
        {community.discipline} · {community.language} · {community.country}
        {community.region ? ` · ${community.region}` : ''}
        {role ? ` · your role: ${formatRole(role)}` : ''}
      </p>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
        {communities.canManage(community) && (
          <Button size="sm" href="/communities/create">
            Manage community
          </Button>
        )}
        {role ? (
          <Button size="sm" variant="outline" onClick={() => communities.leaveCommunity(community.id)}>
            Leave community
          </Button>
        ) : (
          <Button size="sm" onClick={() => communities.joinCommunity(community.id)}>
            Join community
          </Button>
        )}
        <Button size="sm" variant={following ? 'outline' : 'secondary'} onClick={() => communities.toggleFollow(community.id)}>
          {following ? '🔕 Following' : '🔔 Follow'}
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-800">
        <span>👥 {formatNumber(community.memberCount)} members</span>
        <span>🔔 {formatNumber(community.followerCount)} followers</span>
        <span>💬 {formatNumber(community.discussionCount)} discussions</span>
        <span>📚 {formatNumber(community.resourceCount)} resources</span>
        <span>📅 {formatNumber(community.eventCount)} events</span>
        <span>📈 {formatNumber(community.activityScore)} activity score</span>
      </div>
    </header>
  );
}
