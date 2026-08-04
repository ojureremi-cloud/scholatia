import type {
  Community,
  CommunityAnalytics,
  CommunityCategory,
  CommunityDiscussion,
  CommunityEvent,
  CommunityFilter,
  CommunityFollower,
  CommunityInsight,
  CommunityMember,
  CommunityPortfolio,
  CommunityRecommendation,
  CommunityRecommendationProfile,
  CommunityReport,
  CommunityRole,
  CommunitySort,
  CommunityStatistics,
  CommunityVisibility,
} from '@/types/communities';
import { COMMUNITY_ROLES } from '@/types/communities';

/**
 * Pure engine for the Scholatia Scholarly Communities Platform (Phase 2.2G.2).
 *
 * This module is a side-effect-free library. It owns no records, never imports
 * React, and never mutates its inputs — every operation returns new values.
 * Derived counts (members, followers, discussions, resources, events) and the
 * activity score are computed from the typed community graph. Creators,
 * members, mentors, experts, ambassadors, and followers are canonical
 * researcher usernames; resources may carry canonical `doi` and `url`
 * references to records owned by other modules.
 */

function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Canonical community id prefix. */
export function communityId(label: string): string {
  return `com-${slugOf(label)}`;
}

/** Canonical community slug. */
export function buildCommunitySlug(label: string): string {
  return slugOf(label);
}

/** Canonical route to a community. */
export function communityUrl(community: Community): string {
  return `/communities/${community.slug}`;
}

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

/** Weighted activity contribution of each community surface. */
export function communityActivityScore(community: Pick<Community, 'discussions' | 'questions' | 'resources' | 'events' | 'polls' | 'announcements'>): number {
  return Math.round(
    community.discussions.length * 4 +
      community.questions.length * 3 +
      community.resources.length * 2 +
      community.events.length * 5 +
      community.polls.length * 3 +
      community.announcements.length * 2,
  );
}

/**
 * Create a community from a partial input, filling canonical defaults and
 * deriving the count fields (memberCount, discussionCount, resourceCount,
 * eventCount, followerCount, activityScore) from the typed collections — never
 * hand-maintained.
 */
export function createCommunity(input: {
  id: string;
  name: string;
  description?: string;
  category: CommunityCategory;
  discipline?: string;
  researchAreas?: string[];
  keywords?: string[];
  language?: string;
  country?: string;
  region?: string;
  visibility?: CommunityVisibility;
  creator: string;
  creatorName?: string;
  verificationStatus?: Community['verificationStatus'];
  profileImage?: string;
  coverImage?: string;
  website?: string;
  socialLinks?: Community['socialLinks'];
  rules?: string[];
  codeOfConduct?: string;
  administrators?: CommunityMember[];
  moderators?: CommunityMember[];
  members?: CommunityMember[];
  mentors?: CommunityMember[];
  experts?: CommunityMember[];
  ambassadors?: CommunityMember[];
  followers?: CommunityFollower[];
  announcements?: Community['announcements'];
  discussions?: Community['discussions'];
  questions?: Community['questions'];
  resources?: Community['resources'];
  events?: Community['events'];
  polls?: Community['polls'];
  mentorships?: Community['mentorships'];
  opportunities?: Community['opportunities'];
  spotlights?: Community['spotlights'];
  achievements?: Community['achievements'];
  bookmarks?: Community['bookmarks'];
  trends?: Community['trends'];
  reports?: Community['reports'];
  warnings?: Community['warnings'];
  createdAt?: string;
}): Community {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const collections = {
    announcements: (input.announcements ?? []).map((item) => ({ ...item, communityId: input.id })),
    discussions: (input.discussions ?? []).map((item) => ({ ...item, communityId: input.id })),
    questions: (input.questions ?? []).map((item) => ({ ...item, communityId: input.id })),
    resources: (input.resources ?? []).map((item) => ({ ...item, communityId: input.id })),
    events: (input.events ?? []).map((item) => ({ ...item, communityId: input.id })),
    polls: (input.polls ?? []).map((item) => ({ ...item, communityId: input.id })),
    mentorships: (input.mentorships ?? []).map((item) => ({ ...item, communityId: input.id })),
    opportunities: (input.opportunities ?? []).map((item) => ({ ...item, communityId: input.id })),
    spotlights: (input.spotlights ?? []).map((item) => ({ ...item, communityId: input.id })),
    achievements: (input.achievements ?? []).map((item) => ({ ...item, communityId: input.id })),
    bookmarks: (input.bookmarks ?? []).map((item) => ({ ...item, communityId: input.id })),
    trends: (input.trends ?? []).map((item) => ({ ...item, communityId: input.id })),
    reports: (input.reports ?? []).map((item) => ({ ...item, communityId: input.id })),
    warnings: (input.warnings ?? []).map((item) => ({ ...item, communityId: input.id })),
  };
  const administrators = input.administrators ?? [];
  const moderators = input.moderators ?? [];
  const members = input.members ?? [];
  const followerCount = input.followers?.length ?? 0;
  return {
    id: input.id,
    slug: buildCommunitySlug(input.name),
    name: input.name,
    description: input.description ?? '',
    category: input.category,
    discipline: input.discipline ?? 'Not Specified',
    researchAreas: input.researchAreas ?? [],
    keywords: input.keywords ?? [],
    language: input.language ?? 'English',
    country: input.country ?? 'Not Specified',
    region: input.region,
    visibility: input.visibility ?? 'public',
    creator: input.creator,
    creatorName: input.creatorName,
    administrators,
    moderators,
    members,
    mentors: input.mentors ?? [],
    experts: input.experts ?? [],
    ambassadors: input.ambassadors ?? [],
    followers: input.followers ?? [],
    verificationStatus: input.verificationStatus ?? 'Pending',
    profileImage: input.profileImage,
    coverImage: input.coverImage,
    website: input.website,
    socialLinks: input.socialLinks,
    rules: input.rules ?? [],
    codeOfConduct: input.codeOfConduct ?? '',
    createdAt,
    updatedAt: createdAt,
    memberCount: memberCountOf({ administrators, moderators, members }),
    discussionCount: collections.discussions.length,
    resourceCount: collections.resources.length,
    eventCount: collections.events.length,
    followerCount,
    activityScore: communityActivityScore(collections),
    ...collections,
  };
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

/** Every researcher holding a base seat in the community, across role buckets. */
export function allCommunityMembers(
  community: Pick<Community, 'administrators' | 'moderators' | 'members'>,
): CommunityMember[] {
  return [...community.administrators, ...community.moderators, ...community.members];
}

export function memberCountOf(
  community: Pick<Community, 'administrators' | 'moderators' | 'members'>,
): number {
  return allCommunityMembers(community).length;
}

export function activeCommunityMembers(community: Community): CommunityMember[] {
  return allCommunityMembers(community).filter((member) => member.status === 'active');
}

/** Every designated seat (mentors, experts, ambassadors) in the community. */
export function designatedCommunityMembers(community: Community): CommunityMember[] {
  return [...community.mentors, ...community.experts, ...community.ambassadors];
}

export function communityMemberOf(community: Community, username: string): CommunityMember | undefined {
  return allCommunityMembers(community).find((member) => member.username === username);
}

export function communityMemberRoleOf(community: Community, username: string): CommunityRole | undefined {
  return communityMemberOf(community, username)?.role;
}

export function communityFollowerOf(community: Community, username: string): CommunityFollower | undefined {
  return community.followers.find((follower) => follower.username === username);
}

export function isCommunityFollower(community: Community, username: string): boolean {
  return Boolean(communityFollowerOf(community, username));
}

export function addCommunityMember(
  community: Community,
  input: {
    username: string;
    name: string;
    avatar?: string;
    role?: CommunityRole;
    status?: CommunityMember['status'];
    joinedAt?: string;
  },
): Community {
  const member: CommunityMember = {
    username: input.username,
    name: input.name,
    avatar: input.avatar,
    role: input.role ?? 'member',
    status: input.status ?? 'active',
    joinedAt: input.joinedAt ?? new Date().toISOString(),
  };
  const members =
    member.role === 'administrator'
      ? [...community.administrators, member]
      : member.role === 'moderator'
        ? [...community.moderators, member]
        : [...community.members, member];
  const administrators = member.role === 'administrator' ? members : community.administrators;
  const moderators = member.role === 'moderator' ? members : community.moderators;
  const memberList = member.role === 'administrator' || member.role === 'moderator' ? community.members : members;
  return {
    ...community,
    administrators,
    moderators,
    members: memberList,
    memberCount: memberCountOf({ administrators, moderators, members: memberList }),
    updatedAt: new Date().toISOString(),
  };
}

export function removeCommunityMember(community: Community, username: string): Community {
  const administrators = community.administrators.filter((member) => member.username !== username);
  const moderators = community.moderators.filter((member) => member.username !== username);
  const members = community.members.filter((member) => member.username !== username);
  return {
    ...community,
    administrators,
    moderators,
    members,
    memberCount: memberCountOf({ administrators, moderators, members }),
    updatedAt: new Date().toISOString(),
  };
}

export function changeCommunityMemberRole(community: Community, username: string, role: CommunityRole): Community {
  const buckets = [community.administrators, community.moderators, community.members];
  const next = buckets.map((bucket) => bucket.filter((member) => member.username !== username));
  const member = allCommunityMembers(community).find((candidate) => candidate.username === username);
  if (!member) return community;
  const updated: CommunityMember = { ...member, role };
  const target =
    role === 'administrator' ? [...next[0], updated] : role === 'moderator' ? [...next[1], updated] : [...next[2], updated];
  const administrators = role === 'administrator' ? target : next[0];
  const moderators = role === 'moderator' ? target : next[1];
  const members = role === 'administrator' || role === 'moderator' ? next[2] : target;
  return {
    ...community,
    administrators,
    moderators,
    members,
    memberCount: memberCountOf({ administrators, moderators, members }),
    updatedAt: new Date().toISOString(),
  };
}

export function followCommunity(
  community: Community,
  input: { username: string; name: string; avatar?: string; followedAt?: string },
): Community {
  if (communityFollowerOf(community, input.username)) return community;
  const follower: CommunityFollower = {
    username: input.username,
    name: input.name,
    avatar: input.avatar,
    followedAt: input.followedAt ?? new Date().toISOString(),
  };
  return {
    ...community,
    followers: [...community.followers, follower],
    followerCount: community.followerCount + 1,
    updatedAt: new Date().toISOString(),
  };
}

export function unfollowCommunity(community: Community, username: string): Community {
  return {
    ...community,
    followers: community.followers.filter((follower) => follower.username !== username),
    followerCount: Math.max(0, community.followerCount - 1),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

/** Whether a researcher can see the community given its visibility. */
export function canViewCommunity(community: Community, username: string): boolean {
  if (community.visibility === 'public') return true;
  const seat = communityMemberOf(community, username);
  if (!seat || seat.status === 'removed' || seat.status === 'pending') return false;
  return true;
}

/** Whether a researcher can manage the community (creator or administrator). */
export function canManageCommunity(community: Community, username: string): boolean {
  return community.creator === username || communityMemberRoleOf(community, username) === 'administrator';
}

/** Whether a researcher can moderate content (creator, administrator, or moderator). */
export function canModerateCommunity(community: Community, username: string): boolean {
  const role = communityMemberRoleOf(community, username);
  return community.creator === username || role === 'administrator' || role === 'moderator';
}

/** Whether a researcher can contribute content (any active seat or public visitor). */
export function canPostToCommunity(community: Community, username: string): boolean {
  const seat = communityMemberOf(community, username);
  if (!seat) return community.visibility === 'public';
  return seat.status === 'active';
}

/** Whether a researcher can invite others (creator, administrator, or moderator). */
export function canInviteToCommunity(community: Community, username: string): boolean {
  return canModerateCommunity(community, username);
}

// ---------------------------------------------------------------------------
// Collections — discussions
// ---------------------------------------------------------------------------

export function communityDiscussions(community: Community): CommunityDiscussion[] {
  return community.discussions;
}

export function communityDiscussionCount(community: Community): number {
  return community.discussions.length;
}

export function openCommunityDiscussions(community: Community): CommunityDiscussion[] {
  return community.discussions.filter((discussion) => discussion.status === 'open');
}

export function lockedCommunityDiscussions(community: Community): CommunityDiscussion[] {
  return community.discussions.filter((discussion) => discussion.status === 'locked');
}

export function archivedCommunityDiscussions(community: Community): CommunityDiscussion[] {
  return community.discussions.filter((discussion) => discussion.status === 'archived');
}

export function pinnedCommunityDiscussions(community: Community): CommunityDiscussion[] {
  return community.discussions.filter((discussion) => discussion.pinned);
}

/** All replies across the thread, flattened in document order. */
export function communityDiscussionReplies(discussion: CommunityDiscussion): Community['discussions'][number]['replies'] {
  return discussion.replies;
}

export function communityReplyCount(discussion: CommunityDiscussion): number {
  return discussion.replies.length;
}

/** Maximum nesting depth of a threaded discussion (1 = flat). */
export function communityThreadDepth(discussion: CommunityDiscussion): number {
  const parents = new Map<string, string | undefined>();
  discussion.replies.forEach((reply) => parents.set(reply.id, reply.parentId));
  let depth = 1;
  for (const reply of discussion.replies) {
    let cursor: string | undefined = reply.id;
    let count = 1;
    const seen = new Set<string>();
    while (cursor && parents.has(cursor) && parents.get(cursor) && !seen.has(cursor)) {
      seen.add(cursor);
      cursor = parents.get(cursor);
      count += 1;
    }
    depth = Math.max(depth, count);
  }
  return depth;
}

/** Flatten a threaded discussion into a topologically ordered reply list. */
export function communityFlattenedReplies(discussion: CommunityDiscussion): Community['discussions'][number]['replies'] {
  const rootReplies = discussion.replies.filter((reply) => !reply.parentId);
  const childrenOf = (id: string) =>
    discussion.replies
      .filter((reply) => reply.parentId === id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const walk = (reply: Community['discussions'][number]['replies'][number]): Community['discussions'][number]['replies'][number][] => {
    const children = childrenOf(reply.id).flatMap((child) => walk(child));
    return [reply, ...children];
  };
  return rootReplies.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).flatMap((reply) => walk(reply));
}

/** Add a nested reply to a discussion. */
export function addCommunityReply(
  community: Community,
  discussionId: string,
  input: { author: string; authorName?: string; body: string; parentId?: string },
): Community {
  const discussions = community.discussions.map((discussion) => {
    if (discussion.id !== discussionId) return discussion;
    const reply = {
      id: `${discussionId}-reply-${discussion.replies.length + 1}`,
      discussionId,
      parentId: input.parentId,
      author: input.author,
      authorName: input.authorName,
      body: input.body,
      createdAt: new Date().toISOString(),
    };
    return { ...discussion, replies: [...discussion.replies, reply], updatedAt: new Date().toISOString() };
  });
  return { ...community, discussions, updatedAt: new Date().toISOString() };
}

export function pinCommunityDiscussion(community: Community, discussionId: string): Community {
  return {
    ...community,
    discussions: community.discussions.map((discussion) =>
      discussion.id === discussionId ? { ...discussion, pinned: true } : discussion,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function unpinCommunityDiscussion(community: Community, discussionId: string): Community {
  return {
    ...community,
    discussions: community.discussions.map((discussion) =>
      discussion.id === discussionId ? { ...discussion, pinned: false } : discussion,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function lockCommunityDiscussion(community: Community, discussionId: string): Community {
  return {
    ...community,
    discussions: community.discussions.map((discussion) =>
      discussion.id === discussionId ? { ...discussion, status: 'locked' } : discussion,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function unlockCommunityDiscussion(community: Community, discussionId: string): Community {
  return {
    ...community,
    discussions: community.discussions.map((discussion) =>
      discussion.id === discussionId ? { ...discussion, status: 'open' } : discussion,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function archiveCommunityDiscussion(community: Community, discussionId: string): Community {
  return {
    ...community,
    discussions: community.discussions.map((discussion) =>
      discussion.id === discussionId ? { ...discussion, status: 'archived' } : discussion,
    ),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Collections — questions & answers, resources, events, polls
// ---------------------------------------------------------------------------

export function communityQuestions(community: Community): Community['questions'] {
  return community.questions;
}

export function openCommunityQuestions(community: Community): Community['questions'] {
  return community.questions.filter((question) => question.status === 'open');
}

export function answeredCommunityQuestions(community: Community): Community['questions'] {
  return community.questions.filter((question) => question.status === 'answered');
}

export function communityAnswerCount(question: Community['questions'][number]): number {
  return question.answers.length;
}

export function addCommunityAnswer(
  community: Community,
  questionId: string,
  input: { author: string; authorName?: string; body: string },
): Community {
  const questions = community.questions.map((question) => {
    if (question.id !== questionId) return question;
    const answer = {
      id: `${questionId}-answer-${question.answers.length + 1}`,
      questionId,
      author: input.author,
      authorName: input.authorName,
      body: input.body,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    return { ...question, status: 'answered' as const, answers: [...question.answers, answer] };
  });
  return { ...community, questions, updatedAt: new Date().toISOString() };
}

export function communityResources(community: Community): Community['resources'] {
  return community.resources;
}

export function communityResourceCount(community: Community): number {
  return community.resources.length;
}

export function communityResourcesByType(
  community: Community,
  type: Community['resources'][number]['type'],
): Community['resources'] {
  return community.resources.filter((resource) => resource.type === type);
}

export function communityEvents(community: Community): CommunityEvent[] {
  return community.events;
}

export function communityEventCount(community: Community): number {
  return community.events.length;
}

export function communityEventsByType(
  community: Community,
  type: Community['events'][number]['type'],
): CommunityEvent[] {
  return community.events.filter((event) => event.type === type);
}

export function upcomingCommunityEvents(community: Community, now = new Date()): CommunityEvent[] {
  return community.events
    .filter((event) => event.status === 'scheduled' && new Date(event.scheduledAt).getTime() >= now.getTime())
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

export function communityWebinars(community: Community): CommunityEvent[] {
  return communityEventsByType(community, 'webinar');
}

export function communityJournalClubs(community: Community): CommunityEvent[] {
  return communityEventsByType(community, 'journal-club');
}

export function communityReadingGroups(community: Community): CommunityEvent[] {
  return communityEventsByType(community, 'reading-group');
}

export function communityPolls(community: Community): Community['polls'] {
  return community.polls;
}

export function openCommunityPolls(community: Community): Community['polls'] {
  return community.polls.filter((poll) => poll.status === 'open');
}

export function communityPollCount(community: Community): number {
  return community.polls.length;
}

export function voteCommunityPoll(community: Community, pollId: string, option: string): Community {
  const polls = community.polls.map((poll) => {
    if (poll.id !== pollId || poll.status !== 'open') return poll;
    return { ...poll, votes: { ...poll.votes, [option]: (poll.votes[option] ?? 0) + 1 } };
  });
  return { ...community, polls, updatedAt: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Collections — mentorship, opportunities, spotlights, achievements, bookmarks
// ---------------------------------------------------------------------------

export function communityMentorships(community: Community): Community['mentorships'] {
  return community.mentorships;
}

export function activeCommunityMentorships(community: Community): Community['mentorships'] {
  return community.mentorships.filter((mentorship) => mentorship.status === 'active');
}

export function communityMentorshipCount(community: Community): number {
  return community.mentorships.length;
}

export function communityOpportunities(community: Community): Community['opportunities'] {
  return community.opportunities;
}

export function communityOpportunitiesByKind(
  community: Community,
  kind: Community['opportunities'][number]['kind'],
): Community['opportunities'] {
  return community.opportunities.filter((opportunity) => opportunity.kind === kind);
}

export function communityOpportunitiesForUser(community: Community, username: string): Community['opportunities'] {
  return community.opportunities.filter((opportunity) => opportunity.postedBy === username);
}

export function communitySpotlights(community: Community): Community['spotlights'] {
  return community.spotlights;
}

export function communityAchievements(community: Community): Community['achievements'] {
  return community.achievements;
}

export function communityBookmarks(community: Community): Community['bookmarks'] {
  return community.bookmarks;
}

export function communityBookmarksForUser(community: Community, username: string): Community['bookmarks'] {
  return community.bookmarks.filter((bookmark) => bookmark.username === username);
}

export function bookmarkedCommunityDiscussions(community: Community, username: string): CommunityDiscussion[] {
  const bookmarks = communityBookmarksForUser(community, username);
  const ids = new Set(bookmarks.map((bookmark) => bookmark.discussionId));
  return community.discussions.filter((discussion) => ids.has(discussion.id));
}

export function isCommunityDiscussionBookmarked(community: Community, username: string, discussionId: string): boolean {
  return community.bookmarks.some(
    (bookmark) => bookmark.username === username && bookmark.discussionId === discussionId,
  );
}

export function addCommunityBookmark(community: Community, username: string, discussionId: string): Community {
  if (isCommunityDiscussionBookmarked(community, username, discussionId)) return community;
  const bookmark = {
    id: `com-bookmark-${community.bookmarks.length + 1}-${username}`,
    communityId: community.id,
    username,
    discussionId,
    savedAt: new Date().toISOString(),
  };
  return { ...community, bookmarks: [...community.bookmarks, bookmark], updatedAt: new Date().toISOString() };
}

export function removeCommunityBookmark(community: Community, username: string, discussionId: string): Community {
  return {
    ...community,
    bookmarks: community.bookmarks.filter(
      (bookmark) => !(bookmark.username === username && bookmark.discussionId === discussionId),
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function communityTrends(community: Community): Community['trends'] {
  return community.trends;
}

// ---------------------------------------------------------------------------
// Moderation
// ---------------------------------------------------------------------------

export function communityReports(community: Community): CommunityReport[] {
  return community.reports;
}

export function openCommunityReports(community: Community): CommunityReport[] {
  return community.reports.filter((report) => report.status === 'open' || report.status === 'reviewed');
}

export function communityWarnings(community: Community): Community['warnings'] {
  return community.warnings;
}

export function warningsForUser(community: Community, username: string): Community['warnings'] {
  return community.warnings.filter((warning) => warning.username === username);
}

/** Report a discussion — increments the discussion report count. */
export function reportCommunityDiscussion(
  community: Community,
  discussionId: string,
  input: { reporter: string; reason: string },
): Community {
  const report: CommunityReport = {
    id: `com-report-${community.reports.length + 1}`,
    communityId: community.id,
    targetKind: 'discussion',
    targetId: discussionId,
    reporter: input.reporter,
    reason: input.reason,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  return {
    ...community,
    reports: [...community.reports, report],
    discussions: community.discussions.map((discussion) =>
      discussion.id === discussionId
        ? { ...discussion, reportCount: discussion.reportCount + 1 }
        : discussion,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function resolveCommunityReport(community: Community, reportId: string, action?: string): Community {
  return {
    ...community,
    reports: community.reports.map((report) =>
      report.id === reportId
        ? { ...report, status: 'resolved' as const, resolvedAt: new Date().toISOString(), action }
        : report,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function dismissCommunityReport(community: Community, reportId: string): Community {
  return {
    ...community,
    reports: community.reports.map((report) =>
      report.id === reportId ? { ...report, status: 'dismissed' as const, resolvedAt: new Date().toISOString() } : report,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function addCommunityWarning(
  community: Community,
  input: { username: string; reason: string; issuedBy: string },
): Community {
  const warning = {
    id: `com-warning-${community.warnings.length + 1}`,
    communityId: community.id,
    username: input.username,
    reason: input.reason,
    issuedBy: input.issuedBy,
    issuedAt: new Date().toISOString(),
  };
  return { ...community, warnings: [...community.warnings, warning], updatedAt: new Date().toISOString() };
}

export function appealCommunityWarning(community: Community, warningId: string, appeal: string): Community {
  return {
    ...community,
    warnings: community.warnings.map((warning) =>
      warning.id === warningId ? { ...warning, appeal, appealedAt: new Date().toISOString() } : warning,
    ),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

export function communitiesForUser(communities: readonly Community[], username: string): Community[] {
  return communities.filter(
    (community) =>
      community.creator === username ||
      Boolean(communityMemberOf(community, username)) ||
      isCommunityFollower(community, username),
  );
}

export function communitiesByCategory(communities: readonly Community[], category: CommunityCategory): Community[] {
  return communities.filter((community) => community.category === category);
}

export function communitiesByVisibility(
  communities: readonly Community[],
  visibility: CommunityVisibility,
): Community[] {
  return communities.filter((community) => community.visibility === visibility);
}

export function communitiesByCountry(communities: readonly Community[], country: string): Community[] {
  return communities.filter((community) => community.country.toLowerCase() === country.toLowerCase());
}

export function communitiesByLanguage(communities: readonly Community[], language: string): Community[] {
  return communities.filter((community) => community.language.toLowerCase() === language.toLowerCase());
}

export function filterCommunities(communities: readonly Community[], filter: CommunityFilter = {}): Community[] {
  return communities.filter((community) => {
    if (filter.category && community.category !== filter.category) return false;
    if (filter.visibility && community.visibility !== filter.visibility) return false;
    if (filter.country && community.country.toLowerCase() !== filter.country.toLowerCase()) return false;
    if (filter.region && community.region !== filter.region) return false;
    if (filter.language && community.language.toLowerCase() !== filter.language.toLowerCase()) return false;
    if (filter.institution && !community.name.includes(filter.institution) && !community.keywords.includes(filter.institution)) {
      return false;
    }
    if (filter.discipline && community.discipline !== filter.discipline) return false;
    if (filter.verification && community.verificationStatus !== filter.verification) return false;
    if (filter.researchArea && !community.researchAreas.includes(filter.researchArea)) return false;
    if (filter.keyword && !community.keywords.includes(filter.keyword)) return false;
    return true;
  });
}

export function sortCommunities(communities: readonly Community[], sort: CommunitySort): Community[] {
  const sorted = [...communities];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'members':
      return sorted.sort((a, b) => b.memberCount - a.memberCount || a.name.localeCompare(b.name));
    case 'followers':
      return sorted.sort((a, b) => b.followerCount - a.followerCount || a.name.localeCompare(b.name));
    case 'activity':
      return sorted.sort((a, b) => b.activityScore - a.activityScore || a.name.localeCompare(b.name));
    case 'discussions':
      return sorted.sort((a, b) => b.discussionCount - a.discussionCount || a.name.localeCompare(b.name));
    case 'resources':
      return sorted.sort((a, b) => b.resourceCount - a.resourceCount || a.name.localeCompare(b.name));
    case 'events':
      return sorted.sort((a, b) => b.eventCount - a.eventCount || a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/**
 * Search communities across name, description, discipline, country, language,
 * research areas, and keywords.
 */
export function searchCommunities(communities: readonly Community[], query: string): Community[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return communities.filter((community) =>
    [
      community.name,
      community.description,
      community.discipline,
      community.country,
      community.region ?? '',
      community.language,
      community.creatorName ?? '',
      community.researchAreas.join(' '),
      community.keywords.join(' '),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
}

/** Communities ranked by weighted activity score. */
export function trendingCommunities(communities: readonly Community[], options: { top?: number } = {}): Community[] {
  const ranked = [...communities].sort((a, b) => b.activityScore - a.activityScore);
  return options.top ? ranked.slice(0, options.top) : ranked;
}

/** Communities with the most recent activity. */
export function recentlyActiveCommunities(communities: readonly Community[], options: { top?: number } = {}): Community[] {
  const ranked = [...communities].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return options.top ? ranked.slice(0, options.top) : ranked;
}

/** Communities with the most members and followers. */
export function mostPopularCommunities(communities: readonly Community[], options: { top?: number } = {}): Community[] {
  const ranked = [...communities].sort(
    (a, b) => b.memberCount + b.followerCount - (a.memberCount + a.followerCount),
  );
  return options.top ? ranked.slice(0, options.top) : ranked;
}

/** The newest communities by creation date. */
export function newestCommunities(communities: readonly Community[], options: { top?: number } = {}): Community[] {
  const ranked = [...communities].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return options.top ? ranked.slice(0, options.top) : ranked;
}

/** Communities carrying a verified institution status. */
export function verifiedCommunities(communities: readonly Community[]): Community[] {
  return communities.filter(
    (community) =>
      community.verificationStatus === 'Verified' ||
      community.verificationStatus === 'Trusted' ||
      community.verificationStatus === 'Accredited' ||
      community.verificationStatus === 'Government Recognised',
  );
}

// ---------------------------------------------------------------------------
// Recommendation engine
// ---------------------------------------------------------------------------

/**
 * Recommend communities for a researcher. Signals are weighted across research
 * interests, discipline, institution, country, language, keywords, groups
 * membership, publishing activity, marketplace activity, and conference
 * participation (CRIE integration is reserved for a later phase).
 */
export function recommendCommunities(
  communities: readonly Community[],
  profile: CommunityRecommendationProfile,
  options: { top?: number } = {},
): CommunityRecommendation[] {
  const interests = new Set(
    [...profile.researchInterests, ...profile.keywords].map((value) => value.toLowerCase()),
  );
  const activitySet = new Set(
    [...profile.marketplaceActivity, ...profile.publishingActivity, ...profile.conferenceParticipation].map(
      (value) => value.toLowerCase(),
    ),
  );
  const groupsSet = new Set(profile.groupMemberships.map((value) => value.toLowerCase()));

  const scored = communities.map((community) => {
    const reasons: string[] = [];
    let score = 0;
    const communityAreas = new Set(
      [...community.researchAreas, ...community.keywords].map((value) => value.toLowerCase()),
    );
    for (const interest of interests) {
      if (communityAreas.has(interest)) {
        score += 3;
        reasons.push(`Matches your research interest: ${interest}`);
      }
    }
    if (profile.discipline && community.discipline.toLowerCase() === profile.discipline.toLowerCase()) {
      score += 2;
      reasons.push('Same discipline as your research profile');
    }
    if (profile.institution && community.name.toLowerCase().includes(profile.institution.toLowerCase())) {
      score += 2;
      reasons.push('Affiliated with your institution');
    }
    if (profile.country && community.country.toLowerCase() === profile.country.toLowerCase()) {
      score += 1;
      reasons.push('Community in your country');
    }
    if (profile.language && community.language.toLowerCase() === profile.language.toLowerCase()) {
      score += 1;
      reasons.push('Community in your language');
    }
    const communityActivity = [...community.keywords, community.discipline, ...community.researchAreas]
      .map((value) => value.toLowerCase())
      .filter((value) => activitySet.has(value));
    if (communityActivity.length > 0) {
      score += 2;
      reasons.push('Aligned with your publishing and conference activity');
    }
    if (groupsSet.size > 0 && community.keywords.some((keyword) => groupsSet.has(keyword.toLowerCase()))) {
      score += 1;
      reasons.push('Related to the groups you belong to');
    }
    if (community.verificationStatus === 'Verified' || community.verificationStatus === 'Trusted') {
      score += 1;
    }
    return { communityId: community.id, score, reasons };
  });

  const ranked = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  return options.top ? ranked.slice(0, options.top) : ranked;
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export function communityInsights(communities: readonly Community[], options: { top?: number } = {}): CommunityInsight[] {
  const insights: CommunityInsight[] = [];
  const largest = [...communities].sort((a, b) => b.memberCount - a.memberCount)[0];
  const mostActive = [...communities].sort((a, b) => b.activityScore - a.activityScore)[0];
  if (largest) {
    insights.push({
      id: 'insight-community-largest',
      title: 'Largest scholarly ecosystem',
      body: `${largest.name} leads the network with ${largest.memberCount} members and ${largest.followerCount} followers across ${largest.country}.`,
      type: 'spotlight',
      communityId: largest.id,
    });
  }
  if (mostActive && mostActive.id !== largest?.id) {
    insights.push({
      id: 'insight-community-most-active',
      title: 'Most active knowledge exchange',
      body: `${mostActive.name} has the highest activity score (${mostActive.activityScore}), combining discussions, events, and shared knowledge.`,
      type: 'trend',
      communityId: mostActive.id,
    });
  }
  const cluster = new Map<string, number>();
  communities.forEach((community) =>
    community.researchAreas.forEach((area) => cluster.set(area, (cluster.get(area) ?? 0) + 1)),
  );
  const [clusterArea, clusterCount] = [...cluster.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (clusterArea) {
    insights.push({
      id: 'insight-community-cluster',
      title: 'Dominant research theme',
      body: `${clusterArea} is the strongest shared theme, active in ${clusterCount} communities.`,
      type: 'cluster',
    });
  }
  const verified = verifiedCommunities(communities);
  insights.push({
    id: 'insight-community-verification',
    title: 'Trusted communities are growing',
    body: `${verified.length} of ${communities.length} communities carry an institution-verified status.`,
    type: 'summary',
  });
  const privateCount = communities.filter(
    (community) => community.visibility === 'private' || community.visibility === 'invitation-only',
  ).length;
  if (privateCount > 0) {
    insights.push({
      id: 'insight-community-opportunity',
      title: 'Communities to open up',
      body: `${privateCount} communities remain private or invitation-only — candidates for wider participation.`,
      type: 'opportunity',
    });
  }
  return options.top ? insights.slice(0, options.top) : insights;
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export function communityStatistics(communities: readonly Community[]): CommunityStatistics {
  const countBy = <T extends string>(values: readonly T[]): { value: T; count: number }[] => {
    const map = new Map<T, number>();
    values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
    return [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  };

  const allMembers = communities.flatMap((community) => allCommunityMembers(community));
  const researchAreas = new Set(communities.flatMap((community) => community.researchAreas));
  const keywords = new Set(communities.flatMap((community) => community.keywords));
  const languages = new Set(communities.map((community) => community.language));

  return {
    totalCommunities: communities.length,
    totalMembers: allMembers.length,
    totalFollowers: communities.reduce((sum, community) => sum + community.followerCount, 0),
    totalAdministrators: allMembers.filter((member) => member.role === 'administrator').length,
    totalModerators: allMembers.filter((member) => member.role === 'moderator').length,
    totalContributors: allMembers.filter((member) => member.role === 'contributor').length,
    totalMentors: communities.flatMap((community) => community.mentors).length,
    totalExperts: communities.flatMap((community) => community.experts).length,
    totalAmbassadors: communities.flatMap((community) => community.ambassadors).length,
    totalAnnouncements: communities.reduce((sum, community) => sum + community.announcements.length, 0),
    totalDiscussions: communities.reduce((sum, community) => sum + community.discussions.length, 0),
    totalReplies: communities.reduce(
      (sum, community) =>
        sum + community.discussions.reduce((replies, discussion) => replies + discussion.replies.length, 0),
      0,
    ),
    totalQuestions: communities.reduce((sum, community) => sum + community.questions.length, 0),
    totalAnswers: communities.reduce(
      (sum, community) =>
        sum + community.questions.reduce((answers, question) => answers + question.answers.length, 0),
      0,
    ),
    totalResources: communities.reduce((sum, community) => sum + community.resourceCount, 0),
    totalEvents: communities.reduce((sum, community) => sum + community.eventCount, 0),
    totalPolls: communities.reduce((sum, community) => sum + community.polls.length, 0),
    totalMentorships: communities.reduce((sum, community) => sum + community.mentorships.length, 0),
    totalOpportunities: communities.reduce((sum, community) => sum + community.opportunities.length, 0),
    totalSpotlights: communities.reduce((sum, community) => sum + community.spotlights.length, 0),
    totalAchievements: communities.reduce((sum, community) => sum + community.achievements.length, 0),
    totalBookmarks: communities.reduce((sum, community) => sum + community.bookmarks.length, 0),
    totalTrends: communities.reduce((sum, community) => sum + community.trends.length, 0),
    totalOpenReports: communities.reduce(
      (sum, community) =>
        sum + community.reports.filter((report) => report.status === 'open' || report.status === 'reviewed').length,
      0,
    ),
    totalResearchAreas: researchAreas.size,
    totalKeywords: keywords.size,
    totalLanguages: languages.size,
    byCategory: countBy(communities.map((community) => community.category)).map(({ value, count }) => ({
      category: value,
      count,
      members: communities
        .filter((community) => community.category === value)
        .reduce((sum, community) => sum + community.memberCount, 0),
      followers: communities
        .filter((community) => community.category === value)
        .reduce((sum, community) => sum + community.followerCount, 0),
    })),
    byVisibility: countBy(communities.map((community) => community.visibility)).map(({ value, count }) => ({
      visibility: value,
      count,
    })),
    byCountry: countBy(communities.map((community) => community.country)).map(({ value, count }) => ({
      country: value,
      count,
    })),
    byLanguage: countBy(communities.map((community) => community.language)).map(({ value, count }) => ({
      language: value,
      count,
    })),
    byVerification: countBy(communities.map((community) => community.verificationStatus)).map(({ value, count }) => ({
      status: value,
      count,
    })),
    byRole: countBy(allMembers.map((member) => member.role)).map(({ value, count }) => ({ role: value, count })),
  };
}

export function communityAnalytics(communities: readonly Community[]): CommunityAnalytics {
  const total = communities.length || 1;
  const average = (selector: (community: Community) => number) =>
    communities.reduce((sum, community) => sum + selector(community), 0) / total;
  const topValues = (values: readonly string[]) => {
    const map = new Map<string, number>();
    values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
    return [...map.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };
  const mostActive = [...communities].sort((a, b) => b.activityScore - a.activityScore)[0];
  const trendScores = new Map<string, number>();
  communities.forEach((community) =>
    community.trends.forEach((trend) => trendScores.set(trend.label, (trendScores.get(trend.label) ?? 0) + trend.score)),
  );

  return {
    avgMembersPerCommunity: Number(average((community) => community.memberCount).toFixed(1)),
    avgFollowersPerCommunity: Number(average((community) => community.followerCount).toFixed(1)),
    avgDiscussionsPerCommunity: Number(average((community) => community.discussionCount).toFixed(1)),
    avgResourcesPerCommunity: Number(average((community) => community.resourceCount).toFixed(1)),
    avgEventsPerCommunity: Number(average((community) => community.eventCount).toFixed(1)),
    avgActivityScore: Number(average((community) => community.activityScore).toFixed(1)),
    publicShare: Number(((communities.filter((community) => community.visibility === 'public').length / total) * 100).toFixed(1)),
    mostActiveCommunityId: mostActive?.id ?? '',
    topCountries: topValues(communities.map((community) => community.country)).map(({ key, count }) => ({
      country: key,
      count,
    })),
    topDisciplines: topValues(communities.map((community) => community.discipline)).map(({ key, count }) => ({
      discipline: key,
      count,
    })),
    topLanguages: topValues(communities.map((community) => community.language)).map(({ key, count }) => ({
      language: key,
      count,
    })),
    topResearchAreas: topValues(communities.flatMap((community) => community.researchAreas)).map(({ key, count }) => ({
      area: key,
      count,
    })),
    topKeywords: topValues(communities.flatMap((community) => community.keywords)).map(({ key, count }) => ({
      keyword: key,
      count,
    })),
    topTrendingTopics: [...trendScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, score]) => ({ label, score })),
  };
}

export function buildCommunityPortfolio(
  communities: readonly Community[],
  options: { top?: number; profile?: CommunityRecommendationProfile } = {},
): CommunityPortfolio {
  const statistics = communityStatistics(communities);
  const analytics = communityAnalytics(communities);
  const featured = mostPopularCommunities(communities, { top: options.top ?? 6 });
  const trending = trendingCommunities(communities, { top: options.top ?? 6 });
  return {
    statistics,
    analytics,
    communities: [...communities],
    members: communities.flatMap((community) => allCommunityMembers(community)),
    followers: communities.flatMap((community) => community.followers),
    discussions: communities.flatMap((community) => community.discussions),
    questions: communities.flatMap((community) => community.questions),
    resources: communities.flatMap((community) => community.resources),
    events: communities.flatMap((community) => community.events),
    announcements: communities.flatMap((community) => community.announcements),
    opportunities: communities.flatMap((community) => community.opportunities),
    insights: communityInsights(communities),
    featured,
    trending,
    recommendations: options.profile ? recommendCommunities(communities, options.profile, { top: 6 }) : [],
  };
}

export const COMMUNITY_ROLE_VOCABULARY: readonly CommunityRole[] = COMMUNITY_ROLES;

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export {
  COMMUNITY_CATEGORIES,
  COMMUNITY_DISCUSSION_STATUSES,
  COMMUNITY_EVENT_MODES,
  COMMUNITY_EVENT_STATUSES,
  COMMUNITY_EVENT_TYPES,
  COMMUNITY_MEMBER_STATUSES,
  COMMUNITY_MENTORSHIP_STATUSES,
  COMMUNITY_OPPORTUNITY_KINDS,
  COMMUNITY_POLL_STATUSES,
  COMMUNITY_REPORT_KINDS,
  COMMUNITY_REPORT_STATUSES,
  COMMUNITY_RESOURCE_TYPES,
  COMMUNITY_ROLES,
  COMMUNITY_VISIBILITIES,
} from '@/types/communities';
