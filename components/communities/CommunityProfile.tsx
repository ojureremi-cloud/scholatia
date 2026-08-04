'use client';

import { useMemo, useState } from 'react';
import useCommunities from '@/hooks/useCommunities';
import { CommunityAnalytics } from './CommunityAnalytics';
import { CommunityDiscussion } from './CommunityDiscussion';
import { CommunityEvents } from './CommunityEvents';
import { CommunityFeed } from './CommunityFeed';
import { CommunityInsights } from './CommunityInsights';
import { CommunityMembers } from './CommunityMembers';
import { CommunityMentorship } from './CommunityMentorship';
import { CommunityModeration } from './CommunityModeration';
import { CommunityOpportunities } from './CommunityOpportunities';
import { CommunityPolls } from './CommunityPolls';
import { CommunityQuestion } from './CommunityQuestion';
import { CommunityResource } from './CommunityResource';
import { CommunitySidebar } from './CommunitySidebar';
import { formatNumber } from './format';

type TabId =
  | 'overview'
  | 'feed'
  | 'discussions'
  | 'q&a'
  | 'resources'
  | 'events'
  | 'polls'
  | 'mentorship'
  | 'opportunities'
  | 'members'
  | 'moderation';

type CommunityProfileProps = {
  communityId: string;
};

const TAB_IDS: TabId[] = [
  'overview',
  'feed',
  'discussions',
  'q&a',
  'resources',
  'events',
  'polls',
  'mentorship',
  'opportunities',
  'members',
  'moderation',
];

const TAB_LABELS: Record<TabId, string> = {
  overview: 'Overview',
  feed: 'Feed',
  discussions: 'Discussions',
  'q&a': 'Q&A',
  resources: 'Resources',
  events: 'Events',
  polls: 'Polls',
  mentorship: 'Mentorship',
  opportunities: 'Opportunities',
  members: 'Members',
  moderation: 'Moderation',
};

export function CommunityProfile({ communityId }: CommunityProfileProps) {
  const communities = useCommunities();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const community = useMemo(
    () => communities.communities.find((entry) => entry.id === communityId),
    [communities.communities, communityId],
  );

  if (!community) {
    return <p className="text-sm text-slate-400">Community not found.</p>;
  }

  const tabCount: Record<TabId, number> = {
    overview: 0,
    feed: community.announcements.length + community.spotlights.length + community.achievements.length,
    discussions: community.discussions.length,
    'q&a': community.questions.length,
    resources: community.resourceCount,
    events: community.eventCount,
    polls: community.polls.length,
    mentorship: community.mentorships.length,
    opportunities: community.opportunities.length,
    members: community.memberCount,
    moderation: community.reports.length + community.warnings.length,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-8">
        <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
          {TAB_IDS.map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'rounded-3xl px-4 py-2 text-sm font-semibold transition',
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {TAB_LABELS[tab]}
              {tabCount[tab] > 0 ? ` (${formatNumber(tabCount[tab])})` : ''}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <CommunityFeed community={community} variant="overview" />
            <CommunityInsights insights={communities.insights} />
            <CommunityAnalytics analytics={communities.analytics} />
          </div>
        )}
        {activeTab === 'feed' && <CommunityFeed community={community} />}
        {activeTab === 'discussions' && <CommunityDiscussion community={community} />}
        {activeTab === 'q&a' && <CommunityQuestion community={community} />}
        {activeTab === 'resources' && <CommunityResource community={community} />}
        {activeTab === 'events' && <CommunityEvents community={community} />}
        {activeTab === 'polls' && <CommunityPolls community={community} />}
        {activeTab === 'mentorship' && <CommunityMentorship community={community} />}
        {activeTab === 'opportunities' && <CommunityOpportunities community={community} />}
        {activeTab === 'members' && (
          <CommunityMembers
            community={community}
            currentUser={communities.currentUser}
            onInvite={communities.canInvite(community) ? (username, name, memberRole) => communities.inviteMemberTo(community.id, username, name, memberRole) : undefined}
            onEject={communities.canManage(community) ? (username) => communities.ejectMemberFrom(community.id, username) : undefined}
            onChangeRole={communities.canManage(community) ? (username, memberRole) => communities.changeRoleOfMember(community.id, username, memberRole) : undefined}
          />
        )}
        {activeTab === 'moderation' && <CommunityModeration community={community} />}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <CommunitySidebar community={community} />
      </aside>
    </div>
  );
}
