'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import useGroups from '@/hooks/useGroups';
import { GroupAbout } from './GroupAbout';
import { GroupAnnouncements } from './GroupAnnouncements';
import { GroupBadge } from './GroupBadge';
import { GroupDiscussions } from './GroupDiscussions';
import { GroupEvents } from './GroupEvents';
import { GroupMedia } from './GroupMedia';
import { GroupMembers } from './GroupMembers';
import { GroupProjects } from './GroupProjects';
import { GroupPublications } from './GroupPublications';
import { GroupResources } from './GroupResources';
import { GroupVerificationBadge } from './GroupVerificationBadge';
import { GroupVisibilityBadge } from './GroupVisibilityBadge';
import { formatCategoryIcon, formatDate, formatNumber, formatRelative, formatRole } from './format';

type TabId =
  | 'about'
  | 'members'
  | 'publications'
  | 'events'
  | 'resources'
  | 'discussions'
  | 'announcements'
  | 'projects'
  | 'media';

type GroupDetailProps = {
  groupId: string;
};

const TAB_IDS: TabId[] = [
  'about',
  'members',
  'publications',
  'events',
  'resources',
  'discussions',
  'announcements',
  'projects',
  'media',
];

export function GroupDetail({ groupId }: GroupDetailProps) {
  const groups = useGroups();
  const [activeTab, setActiveTab] = useState<TabId>('about');

  const group = useMemo(() => groups.groups.find((entry) => entry.id === groupId), [groups.groups, groupId]);

  const role = groups.roleOf(groupId);

  if (!group) {
    return <p className="text-sm text-slate-400">Group not found.</p>;
  }

  const tabCount: Record<TabId, number> = {
    about: 0,
    members: group.memberCount,
    publications: group.publicationCount,
    events: group.eventCount,
    resources: group.resourceCount,
    discussions: group.discussions.length,
    announcements: group.announcements.length,
    projects: group.projects.length,
    media: group.media.length,
  };
  const tabLabel: Record<TabId, string> = {
    about: 'About',
    members: 'Members',
    publications: 'Publications',
    events: 'Events',
    resources: 'Resources',
    discussions: 'Discussions',
    announcements: 'Announcements',
    projects: 'Projects',
    media: 'Media',
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
              {group.profileImage ?? formatCategoryIcon(group.category)}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{group.name}</h1>
              <p className="mt-1 text-sm text-slate-400">
                {group.ownerName ?? group.owner} · created {formatDate(group.createdAt)} · updated{' '}
                {formatRelative(group.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <GroupBadge category={group.category} />
            <GroupVisibilityBadge visibility={group.visibility} />
            <GroupVerificationBadge status={group.verificationStatus} />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{group.description}</p>

        <p className="mt-2 text-xs text-slate-400">
          {group.institution}
          {group.institutionId ? ` · ${group.institutionId}` : ''} · {group.department} · {group.country} ·{' '}
          {group.discipline}
          {role ? ` · your role: ${formatRole(role)}` : ''}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          {groups.canManage(group) && (
            <Button size="sm" href={`/groups/create`}>
              Edit group
            </Button>
          )}
          {role ? (
            <Button size="sm" variant="outline" onClick={() => groups.ejectMemberFrom(group.id, groups.currentUser)}>
              Leave group
            </Button>
          ) : (
            <Button size="sm" onClick={() => groups.inviteMemberTo(group.id, groups.currentUser, groups.currentUserName, 'member')}>
              Join group
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
        {TAB_IDS.map((tab) => (
          <button
            key={tab}
            type="button"
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
            {tabLabel[tab]}
            {tabCount[tab] > 0 ? ` (${formatNumber(tabCount[tab])})` : ''}
          </button>
        ))}
      </div>

      {activeTab === 'about' && <GroupAbout group={group} />}
      {activeTab === 'members' && (
        <GroupMembers
          group={group}
          currentUser={groups.currentUser}
          onInvite={groups.canInvite(group) ? (username, name, memberRole) => groups.inviteMemberTo(group.id, username, name, memberRole) : undefined}
          onEject={groups.canManage(group) ? (username) => groups.ejectMemberFrom(group.id, username) : undefined}
          onChangeRole={groups.canManage(group) ? (username, memberRole) => groups.changeRoleOfMember(group.id, username, memberRole) : undefined}
        />
      )}
      {activeTab === 'publications' && <GroupPublications group={group} />}
      {activeTab === 'events' && <GroupEvents group={group} />}
      {activeTab === 'resources' && <GroupResources group={group} />}
      {activeTab === 'discussions' && <GroupDiscussions group={group} />}
      {activeTab === 'announcements' && <GroupAnnouncements group={group} />}
      {activeTab === 'projects' && <GroupProjects group={group} />}
      {activeTab === 'media' && <GroupMedia group={group} />}
    </div>
  );
}
