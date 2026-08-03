import type {
  Group,
  GroupAnalytics,
  GroupCategory,
  GroupDiscussion,
  GroupEvent,
  GroupFilter,
  GroupInsight,
  GroupMember,
  GroupPortfolio,
  GroupProject,
  GroupRole,
  GroupSort,
  GroupStatistics,
  GroupVisibility,
} from '@/types/groups';
import { GROUP_ROLES } from '@/types/groups';

/**
 * Pure engine for the Scholatia Academic Groups Foundation (Phase 2.2G Part 1).
 *
 * This module is a side-effect-free library. It owns no records, never imports
 * React, and never mutates its inputs — every operation returns new values.
 * Derived counts (members, publications, events, resources), statistics,
 * analytics, and insights are all computed from the typed group graph. Members
 * and creators are canonical researcher usernames; institutions are canonical
 * `institutionId` references; publications and projects may carry canonical
 * `sourceId` + `sourceEntity` references to records owned by other modules.
 */

function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Canonical group id prefix. */
export function groupId(label: string): string {
  return `grp-${slugOf(label)}`;
}

/** Canonical group slug. */
export function buildGroupSlug(label: string): string {
  return slugOf(label);
}

/** Canonical route to a group. */
export function groupUrl(group: Group): string {
  return `/groups/${group.slug}`;
}

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

/**
 * Create a group from a partial input, filling canonical defaults and deriving
 * the count fields (memberCount, publicationCount, eventCount, resourceCount)
 * from the typed collections — never hand-maintained.
 */
export function createGroup(input: {
  id: string;
  name: string;
  description?: string;
  category: GroupCategory;
  visibility?: GroupVisibility;
  owner: string;
  ownerName?: string;
  institution?: string;
  institutionId?: string;
  department?: string;
  country?: string;
  discipline?: string;
  researchAreas?: string[];
  keywords?: string[];
  profileImage?: string;
  coverImage?: string;
  website?: string;
  email?: string;
  socialLinks?: Group['socialLinks'];
  verificationStatus?: Group['verificationStatus'];
  administrators?: GroupMember[];
  moderators?: GroupMember[];
  members?: GroupMember[];
  publications?: Group['publications'];
  events?: Group['events'];
  resources?: Group['resources'];
  discussions?: Group['discussions'];
  announcements?: Group['announcements'];
  projects?: Group['projects'];
  media?: Group['media'];
  createdAt?: string;
}): Group {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const collections = {
    publications: (input.publications ?? []).map((item) => ({ ...item, groupId: input.id })),
    events: (input.events ?? []).map((item) => ({ ...item, groupId: input.id })),
    resources: (input.resources ?? []).map((item) => ({ ...item, groupId: input.id })),
    discussions: (input.discussions ?? []).map((item) => ({ ...item, groupId: input.id })),
    announcements: (input.announcements ?? []).map((item) => ({ ...item, groupId: input.id })),
    projects: (input.projects ?? []).map((item) => ({ ...item, groupId: input.id })),
    media: (input.media ?? []).map((item) => ({ ...item, groupId: input.id })),
  };
  return {
    id: input.id,
    slug: buildGroupSlug(input.name),
    name: input.name,
    description: input.description ?? '',
    category: input.category,
    visibility: input.visibility ?? 'public',
    owner: input.owner,
    ownerName: input.ownerName,
    administrators: input.administrators ?? [],
    moderators: input.moderators ?? [],
    members: input.members ?? [],
    institution: input.institution ?? 'Not Specified',
    institutionId: input.institutionId,
    department: input.department ?? 'Not Specified',
    country: input.country ?? 'Not Specified',
    discipline: input.discipline ?? 'Not Specified',
    researchAreas: input.researchAreas ?? [],
    keywords: input.keywords ?? [],
    profileImage: input.profileImage,
    coverImage: input.coverImage,
    website: input.website,
    email: input.email,
    socialLinks: input.socialLinks,
    verificationStatus: input.verificationStatus ?? 'Pending',
    createdAt,
    updatedAt: createdAt,
    memberCount: memberCountOf({
      administrators: input.administrators ?? [],
      moderators: input.moderators ?? [],
      members: input.members ?? [],
    }),
    publicationCount: collections.publications.length,
    eventCount: collections.events.length,
    resourceCount: collections.resources.length,
    ...collections,
  };
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

/** Every researcher holding a seat in the group, across all role buckets. */
export function allGroupMembers(group: Pick<Group, 'administrators' | 'moderators' | 'members'>): GroupMember[] {
  return [...group.administrators, ...group.moderators, ...group.members];
}

export function memberCountOf(group: Pick<Group, 'administrators' | 'moderators' | 'members'>): number {
  return allGroupMembers(group).length;
}

export function activeGroupMembers(group: Group): GroupMember[] {
  return allGroupMembers(group).filter((member) => member.status === 'active');
}

export function groupMemberCount(group: Group): number {
  return group.memberCount;
}

export function groupMemberOf(group: Group, username: string): GroupMember | undefined {
  return allGroupMembers(group).find((member) => member.username === username);
}

export function groupMemberRoleOf(group: Group, username: string): GroupRole | undefined {
  return groupMemberOf(group, username)?.role;
}

export function addGroupMember(
  group: Group,
  input: {
    username: string;
    name: string;
    avatar?: string;
    role?: GroupRole;
    status?: GroupMember['status'];
    joinedAt?: string;
  },
): Group {
  const member: GroupMember = {
    username: input.username,
    name: input.name,
    avatar: input.avatar,
    role: input.role ?? 'member',
    status: input.status ?? 'active',
    joinedAt: input.joinedAt ?? new Date().toISOString(),
  };
  const members =
    member.role === 'administrator'
      ? [...group.administrators, member]
      : member.role === 'moderator'
        ? [...group.moderators, member]
        : [...group.members, member];
  return { ...group, members, memberCount: group.memberCount + 1, updatedAt: new Date().toISOString() };
}

export function removeGroupMember(group: Group, username: string): Group {
  const administrators = group.administrators.filter((member) => member.username !== username);
  const moderators = group.moderators.filter((member) => member.username !== username);
  const members = group.members.filter((member) => member.username !== username);
  return {
    ...group,
    administrators,
    moderators,
    members,
    memberCount: memberCountOf({ administrators, moderators, members }),
    updatedAt: new Date().toISOString(),
  };
}

export function changeGroupMemberRole(group: Group, username: string, role: GroupRole): Group {
  const move = (buckets: GroupMember[][]): { member?: GroupMember; next: GroupMember[][] } => {
    const next = buckets.map((bucket) => bucket.filter((member) => member.username !== username));
    const member = allGroupMembers({ administrators: buckets[0], moderators: buckets[1], members: buckets[2] }).find(
      (candidate) => candidate.username === username,
    );
    return { member, next };
  };
  const { member, next } = move([group.administrators, group.moderators, group.members]);
  if (!member) return group;
  const updated: GroupMember = { ...member, role };
  const target =
    role === 'administrator'
      ? [...next[0], updated]
      : role === 'moderator'
        ? [...next[1], updated]
        : [...next[2], updated];
  const administrators = role === 'administrator' ? target : next[0];
  const moderators = role === 'moderator' ? target : next[1];
  const members = role === 'administrator' || role === 'moderator' ? next[2] : target;
  return {
    ...group,
    administrators,
    moderators,
    members,
    memberCount: memberCountOf({ administrators, moderators, members }),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export function groupPublications(group: Group): Group['publications'] {
  return group.publications;
}

export function groupPublicationCount(group: Group): number {
  return group.publications.length;
}

export function groupEvents(group: Group): Group['events'] {
  return group.events;
}

export function groupEventCount(group: Group): number {
  return group.events.length;
}

export function groupEventsByType(group: Group, type: GroupEvent['type']): GroupEvent[] {
  return group.events.filter((event) => event.type === type);
}

export function upcomingGroupEvents(group: Group, now = new Date()): GroupEvent[] {
  return group.events
    .filter((event) => event.status === 'scheduled' && new Date(event.scheduledAt).getTime() >= now.getTime())
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

export function groupResources(group: Group): Group['resources'] {
  return group.resources;
}

export function groupResourceCount(group: Group): number {
  return group.resources.length;
}

export function groupDiscussions(group: Group): GroupDiscussion[] {
  return group.discussions;
}

export function openGroupDiscussions(group: Group): GroupDiscussion[] {
  return group.discussions.filter((discussion) => discussion.status === 'open');
}

export function resolvedGroupDiscussions(group: Group): GroupDiscussion[] {
  return group.discussions.filter((discussion) => discussion.status === 'resolved');
}

export function groupReplyCount(discussion: GroupDiscussion): number {
  return discussion.replies.length;
}

export function groupAnnouncements(group: Group): Group['announcements'] {
  return group.announcements;
}

export function groupProjects(group: Group): GroupProject[] {
  return group.projects;
}

export function groupProjectsByStatus(group: Group, status: GroupProject['status']): GroupProject[] {
  return group.projects.filter((project) => project.status === status);
}

export function activeGroupProjects(group: Group): GroupProject[] {
  return groupProjectsByStatus(group, 'active');
}

export function groupMedia(group: Group): Group['media'] {
  return group.media;
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

/** Whether a researcher can see the group given its visibility. */
export function canViewGroup(group: Group, username: string): boolean {
  if (group.visibility === 'public') return true;
  const seat = groupMemberOf(group, username);
  if (!seat || seat.status === 'removed') return false;
  if (seat.status === 'pending') return false;
  return true;
}

/** Whether a researcher can manage the group (owner or administrator). */
export function canManageGroup(group: Group, username: string): boolean {
  return group.owner === username || groupMemberRoleOf(group, username) === 'administrator';
}

/** Whether a researcher can moderate content (owner, administrator, or moderator). */
export function canModerateGroup(group: Group, username: string): boolean {
  const role = groupMemberRoleOf(group, username);
  return group.owner === username || role === 'administrator' || role === 'moderator';
}

/** Whether a researcher can contribute content (any active seat). */
export function canPostToGroup(group: Group, username: string): boolean {
  const seat = groupMemberOf(group, username);
  if (!seat) return group.visibility === 'public';
  return seat.status === 'active';
}

/** Whether a researcher can invite others (owner, administrator, or moderator). */
export function canInviteToGroup(group: Group, username: string): boolean {
  return canModerateGroup(group, username);
}

// ---------------------------------------------------------------------------
// Browsing
// ---------------------------------------------------------------------------

export function groupsForUser(groups: readonly Group[], username: string): Group[] {
  return groups.filter((group) => group.owner === username || Boolean(groupMemberOf(group, username)));
}

export function groupsByCategory(groups: readonly Group[], category: GroupCategory): Group[] {
  return groups.filter((group) => group.category === category);
}

export function groupsByVisibility(groups: readonly Group[], visibility: GroupVisibility): Group[] {
  return groups.filter((group) => group.visibility === visibility);
}

export function groupsByCountry(groups: readonly Group[], country: string): Group[] {
  return groups.filter((group) => group.country.toLowerCase() === country.toLowerCase());
}

export function filterGroups(groups: readonly Group[], filter: GroupFilter = {}): Group[] {
  return groups.filter((group) => {
    if (filter.category && group.category !== filter.category) return false;
    if (filter.visibility && group.visibility !== filter.visibility) return false;
    if (filter.country && group.country.toLowerCase() !== filter.country.toLowerCase()) return false;
    if (filter.institution && group.institutionId !== filter.institution && !group.institution.includes(filter.institution)) {
      return false;
    }
    if (filter.discipline && group.discipline !== filter.discipline) return false;
    if (filter.verification && group.verificationStatus !== filter.verification) return false;
    if (filter.researchArea && !group.researchAreas.includes(filter.researchArea)) return false;
    if (filter.keyword && !group.keywords.includes(filter.keyword)) return false;
    return true;
  });
}

export function sortGroups(groups: readonly Group[], sort: GroupSort): Group[] {
  const sorted = [...groups];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'members':
      return sorted.sort((a, b) => b.memberCount - a.memberCount || a.name.localeCompare(b.name));
    case 'publications':
      return sorted.sort((a, b) => b.publicationCount - a.publicationCount || a.name.localeCompare(b.name));
    case 'events':
      return sorted.sort((a, b) => b.eventCount - a.eventCount || a.name.localeCompare(b.name));
    case 'research':
      return sorted.sort((a, b) => b.researchAreas.length - a.researchAreas.length || a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/**
 * Search groups across name, description, institution, discipline, country,
 * research areas, and keywords.
 */
export function searchGroups(groups: readonly Group[], query: string): Group[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return groups.filter((group) =>
    [
      group.name,
      group.description,
      group.institution,
      group.institutionId ?? '',
      group.department,
      group.discipline,
      group.country,
      group.researchAreas.join(' '),
      group.keywords.join(' '),
      group.ownerName ?? '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export function groupInsights(groups: readonly Group[], options: { top?: number } = {}): GroupInsight[] {
  const insights: GroupInsight[] = [];
  const largest = [...groups].sort((a, b) => b.memberCount - a.memberCount)[0];
  const mostPublished = [...groups].sort((a, b) => b.publicationCount - a.publicationCount)[0];
  if (largest) {
    insights.push({
      id: 'insight-group-largest',
      title: 'Largest scholarly community',
      body: `${largest.name} leads the network with ${largest.memberCount} members across ${largest.country}.`,
      type: 'spotlight',
      groupId: largest.id,
    });
  }
  if (mostPublished && mostPublished.id !== largest?.id) {
    insights.push({
      id: 'insight-group-most-published',
      title: 'Most productive output',
      body: `${mostPublished.name} has produced ${mostPublished.publicationCount} publications to date.`,
      type: 'trend',
      groupId: mostPublished.id,
    });
  }
  const researchClusters = new Map<string, number>();
  groups.forEach((group) => group.researchAreas.forEach((area) => researchClusters.set(area, (researchClusters.get(area) ?? 0) + 1)));
  const [clusterArea, clusterCount] = [...researchClusters.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (clusterArea) {
    insights.push({
      id: 'insight-group-cluster',
      title: 'Emerging research cluster',
      body: `${clusterArea} is the strongest shared research area, active in ${clusterCount} groups.`,
      type: 'cluster',
    });
  }
  const verified = groups.filter((group) => group.verificationStatus === 'Verified' || group.verificationStatus === 'Trusted');
  insights.push({
    id: 'insight-group-verification',
    title: 'Verified groups are growing',
    body: `${verified.length} of ${groups.length} groups carry an institution-verified status, strengthening the trust graph.`,
    type: 'summary',
  });
  const privateCount = groups.filter((group) => group.visibility === 'private' || group.visibility === 'invitation-only').length;
  if (privateCount > 0) {
    insights.push({
      id: 'insight-group-opportunity',
      title: 'Private spaces to open',
      body: `${privateCount} groups remain invitation-only or private — candidates for wider collaboration.`,
      type: 'opportunity',
    });
  }
  return options.top ? insights.slice(0, options.top) : insights;
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export function groupStatistics(groups: readonly Group[]): GroupStatistics {
  const countBy = <T extends string>(values: readonly T[]): { value: T; count: number }[] => {
    const map = new Map<T, number>();
    values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
    return [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  };

  const allMembers = groups.flatMap((group) => allGroupMembers(group));
  const researchAreas = new Set(groups.flatMap((group) => group.researchAreas));
  const keywords = new Set(groups.flatMap((group) => group.keywords));

  return {
    totalGroups: groups.length,
    totalMembers: allMembers.length,
    totalAdministrators: allMembers.filter((member) => member.role === 'administrator').length,
    totalModerators: allMembers.filter((member) => member.role === 'moderator').length,
    totalPublications: groups.reduce((sum, group) => sum + group.publicationCount, 0),
    totalEvents: groups.reduce((sum, group) => sum + group.eventCount, 0),
    totalResources: groups.reduce((sum, group) => sum + group.resourceCount, 0),
    totalDiscussions: groups.reduce((sum, group) => sum + group.discussions.length, 0),
    totalAnnouncements: groups.reduce((sum, group) => sum + group.announcements.length, 0),
    totalProjects: groups.reduce((sum, group) => sum + group.projects.length, 0),
    totalMedia: groups.reduce((sum, group) => sum + group.media.length, 0),
    totalResearchAreas: researchAreas.size,
    totalKeywords: keywords.size,
    byCategory: countBy(groups.map((group) => group.category)).map(({ value, count }) => ({
      category: value,
      count,
      members: groups.filter((group) => group.category === value).reduce((sum, group) => sum + group.memberCount, 0),
    })),
    byVisibility: countBy(groups.map((group) => group.visibility)).map(({ value, count }) => ({ visibility: value, count })),
    byCountry: countBy(groups.map((group) => group.country)).map(({ value, count }) => ({ country: value, count })),
    byVerification: countBy(groups.map((group) => group.verificationStatus)).map(({ value, count }) => ({
      status: value,
      count,
    })),
    byRole: countBy(allMembers.map((member) => member.role)).map(({ value, count }) => ({ role: value, count })),
  };
}

export function groupAnalytics(groups: readonly Group[]): GroupAnalytics {
  const total = groups.length || 1;
  const average = (selector: (group: Group) => number) =>
    groups.reduce((sum, group) => sum + selector(group), 0) / total;
  const topValues = (values: readonly string[]) => {
    const map = new Map<string, number>();
    values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
    return [...map.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };
  const mostActive = [...groups].sort((a, b) => b.eventCount + b.discussions.length - (a.eventCount + a.discussions.length))[0];

  return {
    avgMembersPerGroup: Number(average((group) => group.memberCount).toFixed(1)),
    avgPublicationsPerGroup: Number(average((group) => group.publicationCount).toFixed(1)),
    avgEventsPerGroup: Number(average((group) => group.eventCount).toFixed(1)),
    avgResourcesPerGroup: Number(average((group) => group.resourceCount).toFixed(1)),
    publicShare: Number(((groups.filter((group) => group.visibility === 'public').length / total) * 100).toFixed(1)),
    institutionShare: Number(
      ((groups.filter((group) => group.visibility === 'institution-only' || group.visibility === 'department-only').length / total) * 100).toFixed(1),
    ),
    mostActiveGroupId: mostActive?.id ?? '',
    topCountries: topValues(groups.map((group) => group.country)).map(({ key, count }) => ({ country: key, count })),
    topDisciplines: topValues(groups.map((group) => group.discipline)).map(({ key, count }) => ({ discipline: key, count })),
    topResearchAreas: topValues(groups.flatMap((group) => group.researchAreas)).map(({ key, count }) => ({ area: key, count })),
    topKeywords: topValues(groups.flatMap((group) => group.keywords)).map(({ key, count }) => ({ keyword: key, count })),
  };
}

export function buildGroupPortfolio(groups: readonly Group[], options: { top?: number } = {}): GroupPortfolio {
  const statistics = groupStatistics(groups);
  const analytics = groupAnalytics(groups);
  const featured = [...groups]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, options.top ?? 6);
  return {
    statistics,
    analytics,
    groups: [...groups],
    members: groups.flatMap((group) => allGroupMembers(group)),
    publications: groups.flatMap((group) => group.publications),
    events: groups.flatMap((group) => group.events),
    resources: groups.flatMap((group) => group.resources),
    discussions: groups.flatMap((group) => group.discussions),
    announcements: groups.flatMap((group) => group.announcements),
    projects: groups.flatMap((group) => group.projects),
    media: groups.flatMap((group) => group.media),
    insights: groupInsights(groups),
    featured,
  };
}

export const GROUP_ROLE_VOCABULARY: readonly GroupRole[] = GROUP_ROLES;

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export {
  GROUP_CATEGORIES,
  GROUP_DISCUSSION_STATUSES,
  GROUP_EVENT_MODES,
  GROUP_EVENT_STATUSES,
  GROUP_EVENT_TYPES,
  GROUP_MEDIA_KINDS,
  GROUP_MEMBER_STATUSES,
  GROUP_PROJECT_STATUSES,
  GROUP_PUBLICATION_STATUSES,
  GROUP_PUBLICATION_TYPES,
  GROUP_RESOURCE_TYPES,
  GROUP_ROLES,
  GROUP_VISIBILITIES,
} from '@/types/groups';
