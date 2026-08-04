import type { InstitutionVerificationStatus } from '@/types/identity';

/**
 * Scholatia Scholarly Communities Platform (Phase 2.2G.2).
 *
 * Communities are NOT Groups. Groups are governed organisations — persistent,
 * role-governed scholarly spaces. Communities are open scholarly knowledge
 * ecosystems centred around discussion, collaboration, mentoring, networking,
 * learning, and academic exchange. A researcher may belong to many
 * Communities while belonging to few or no Groups.
 *
 * A community owns a profile, a discovery surface, an open membership, and a
 * rich exchange surface: announcements, threaded discussions, questions &
 * answers, knowledge sharing (articles, preprints, datasets, DOIs, ORCID
 * references), events (webinars, journal clubs, reading groups), polls,
 * mentorship pairings, opportunities (research calls, funding calls, jobs),
 * scholar spotlights, achievements, bookmarks, and trending topics. Community
 * moderation is explicit: reports, content review, warnings, temporary
 * suspension, permanent removal, and appeals.
 *
 * The module owns no external records. Creators, members, mentors, experts,
 * ambassadors, and followers reference canonical researchers by `username`;
 * the verification status reuses the canonical `InstitutionVerificationStatus`
 * vocabulary from the Identity platform. Derived counts (members, discussions,
 * resources, events, followers) and the activity score are computed from the
 * typed graph by the pure engine in `lib/communities.ts`, never hand-maintained.
 */

/** The community vocabulary — one category per scholarly knowledge ecosystem. */
export type CommunityCategory =
  | 'research'
  | 'professional'
  | 'academic-society'
  | 'open-science'
  | 'educational'
  | 'student'
  | 'early-career'
  | 'women-in-research'
  | 'ai'
  | 'health-sciences'
  | 'engineering'
  | 'arts-humanities'
  | 'social-sciences'
  | 'sustainability'
  | 'regional'
  | 'country'
  | 'institutional'
  | 'multidisciplinary';

/** Who can see the community and its content. */
export type CommunityVisibility = 'public' | 'private' | 'invitation-only' | 'institution-only';

/** The permission level a researcher holds inside a community. */
export type CommunityRole =
  | 'owner'
  | 'administrator'
  | 'moderator'
  | 'contributor'
  | 'member'
  | 'follower'
  | 'visitor';

/** Membership lifecycle of a researcher inside a community. */
export type CommunityMemberStatus = 'active' | 'invited' | 'pending' | 'removed';

/** The lifecycle of a community discussion thread. */
export type CommunityDiscussionStatus = 'open' | 'locked' | 'archived';

/** The kinds of knowledge shared inside a community. */
export type CommunityResourceType =
  | 'article'
  | 'preprint'
  | 'book'
  | 'dataset'
  | 'presentation'
  | 'video'
  | 'teaching-material'
  | 'research-tool'
  | 'protocol'
  | 'software'
  | 'repository'
  | 'doi'
  | 'orcid-reference';

/** The kinds of events a community hosts. */
export type CommunityEventType =
  | 'webinar'
  | 'journal-club'
  | 'reading-group'
  | 'meetup'
  | 'workshop'
  | 'seminar'
  | 'conference'
  | 'social';

/** How a community event is delivered. */
export type CommunityEventMode = 'in-person' | 'online' | 'hybrid';

/** The lifecycle of a community event. */
export type CommunityEventStatus = 'scheduled' | 'completed' | 'cancelled';

/** The lifecycle of a community poll. */
export type CommunityPollStatus = 'open' | 'closed';

/** The lifecycle of a mentorship pairing. */
export type CommunityMentorshipStatus = 'requested' | 'active' | 'completed';

/** The kinds of opportunities shared in a community. */
export type CommunityOpportunityKind = 'research-call' | 'funding-call' | 'job' | 'volunteer';

/** What a moderation report targets. */
export type CommunityReportKind = 'discussion' | 'reply' | 'question' | 'resource' | 'user';

/** The lifecycle of a moderation report. */
export type CommunityReportStatus = 'open' | 'reviewed' | 'resolved' | 'dismissed';

/** A researcher seat inside a community, referenced by canonical username. */
export interface CommunityMember {
  username: string;
  name: string;
  avatar?: string;
  role: CommunityRole;
  status: CommunityMemberStatus;
  joinedAt: string;
}

/** A researcher following a community (follow ≠ membership). */
export interface CommunityFollower {
  username: string;
  name: string;
  avatar?: string;
  followedAt: string;
}

/** Public contact and social presence of a community. */
export interface CommunitySocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  orcid?: string;
  youtube?: string;
  discord?: string;
}

/** An announcement broadcast to the community. */
export interface CommunityAnnouncement {
  id: string;
  communityId: string;
  title: string;
  body: string;
  author: string;
  authorName?: string;
  pinned?: boolean;
  createdAt: string;
}

/** A threaded (nested) reply inside a community discussion. */
export interface CommunityReply {
  id: string;
  discussionId: string;
  /** Parent reply id — supports arbitrary nesting depth. */
  parentId?: string;
  author: string;
  authorName?: string;
  body: string;
  createdAt: string;
}

/** A moderation report raised inside a community. */
export interface CommunityReport {
  id: string;
  communityId: string;
  targetKind: CommunityReportKind;
  targetId: string;
  targetTitle?: string;
  reporter: string;
  reason: string;
  status: CommunityReportStatus;
  createdAt: string;
  resolvedAt?: string;
  action?: string;
}

/** A formal community warning issued by a moderator. */
export interface CommunityWarning {
  id: string;
  communityId: string;
  username: string;
  reason: string;
  issuedBy: string;
  issuedAt: string;
  appeal?: string;
  appealedAt?: string;
}

/** A discussion thread opened inside a community. */
export interface CommunityDiscussion {
  id: string;
  communityId: string;
  title: string;
  body?: string;
  author: string;
  authorName?: string;
  status: CommunityDiscussionStatus;
  pinned?: boolean;
  /** Count of reports raised against this discussion. */
  reportCount: number;
  replies: CommunityReply[];
  createdAt: string;
  updatedAt?: string;
}

/** An answer to a community question. */
export interface CommunityAnswer {
  id: string;
  questionId: string;
  author: string;
  authorName?: string;
  body: string;
  upvotes: number;
  createdAt: string;
}

/** A question posed in the community Q&A. */
export interface CommunityQuestion {
  id: string;
  communityId: string;
  title: string;
  body?: string;
  author: string;
  authorName?: string;
  tags: string[];
  status: 'open' | 'answered' | 'closed';
  answers: CommunityAnswer[];
  createdAt: string;
}

/** A knowledge-sharing item curated by the community. */
export interface CommunityResource {
  id: string;
  communityId: string;
  title: string;
  type: CommunityResourceType;
  url?: string;
  doi?: string;
  /** Canonical contributor researcher username. */
  contributor: string;
  addedAt: string;
}

/** An event hosted or co-hosted by the community. */
export interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  description?: string;
  type: CommunityEventType;
  mode: CommunityEventMode;
  scheduledAt: string;
  durationHours?: number;
  location?: string;
  /** Canonical speaker researcher usernames. */
  speakers: string[];
  status: CommunityEventStatus;
}

/** A community poll. */
export interface CommunityPoll {
  id: string;
  communityId: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  author: string;
  authorName?: string;
  status: CommunityPollStatus;
  createdAt: string;
}

/** A mentorship pairing inside a community. */
export interface CommunityMentorship {
  id: string;
  communityId: string;
  mentor: string;
  mentorName?: string;
  mentee: string;
  menteeName?: string;
  area: string;
  status: CommunityMentorshipStatus;
  startedAt?: string;
}

/** An opportunity shared in a community. */
export interface CommunityOpportunity {
  id: string;
  communityId: string;
  title: string;
  kind: CommunityOpportunityKind;
  description?: string;
  url?: string;
  deadline?: string;
  postedBy: string;
  postedAt: string;
}

/** A scholar spotlight published in a community. */
export interface CommunitySpotlight {
  id: string;
  communityId: string;
  username: string;
  name?: string;
  title: string;
  body: string;
  author: string;
  publishedAt: string;
}

/** A community achievement. */
export interface CommunityAchievement {
  id: string;
  communityId: string;
  title: string;
  icon?: string;
  description?: string;
  awardedTo: string;
  awardedAt: string;
}

/** A saved discussion bookmark. */
export interface CommunityBookmark {
  id: string;
  communityId: string;
  username: string;
  discussionId: string;
  savedAt: string;
}

/** A trending topic derived over the community graph. */
export interface CommunityTrend {
  id: string;
  communityId: string;
  label: string;
  score: number;
  period: 'day' | 'week' | 'month';
}

/**
 * A single scholarly community — the aggregate of an open knowledge ecosystem.
 * Derived counts and the activity score are computed by the engine, never
 * hand-maintained.
 */
export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CommunityCategory;
  discipline: string;
  researchAreas: string[];
  keywords: string[];
  language: string;
  country: string;
  region?: string;
  visibility: CommunityVisibility;
  /** The canonical creator researcher username. */
  creator: string;
  creatorName?: string;
  /** Community administrators, referenced by canonical username. */
  administrators: CommunityMember[];
  /** Community moderators, referenced by canonical username. */
  moderators: CommunityMember[];
  /** Community members (contributor / member / follower / visitor roles). */
  members: CommunityMember[];
  /** Designated mentors, referenced by canonical username. */
  mentors: CommunityMember[];
  /** Designated experts, referenced by canonical username. */
  experts: CommunityMember[];
  /** Designated ambassadors, referenced by canonical username. */
  ambassadors: CommunityMember[];
  /** Followers — a follow is lighter than membership. */
  followers: CommunityFollower[];
  verificationStatus: InstitutionVerificationStatus;
  profileImage?: string;
  coverImage?: string;
  website?: string;
  socialLinks?: CommunitySocialLinks;
  rules: string[];
  codeOfConduct: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  discussionCount: number;
  resourceCount: number;
  eventCount: number;
  followerCount: number;
  activityScore: number;
  announcements: CommunityAnnouncement[];
  discussions: CommunityDiscussion[];
  questions: CommunityQuestion[];
  resources: CommunityResource[];
  events: CommunityEvent[];
  polls: CommunityPoll[];
  mentorships: CommunityMentorship[];
  opportunities: CommunityOpportunity[];
  spotlights: CommunitySpotlight[];
  achievements: CommunityAchievement[];
  bookmarks: CommunityBookmark[];
  trends: CommunityTrend[];
  reports: CommunityReport[];
  warnings: CommunityWarning[];
}

/** The filter vocabulary for browsing communities. */
export interface CommunityFilter {
  category?: CommunityCategory;
  visibility?: CommunityVisibility;
  country?: string;
  region?: string;
  language?: string;
  institution?: string;
  discipline?: string;
  verification?: InstitutionVerificationStatus;
  keyword?: string;
  researchArea?: string;
}

export type CommunitySort =
  | 'recent'
  | 'name'
  | 'members'
  | 'followers'
  | 'activity'
  | 'discussions'
  | 'resources'
  | 'events';

/** Signals used by the recommendation engine. */
export interface CommunityRecommendationProfile {
  username: string;
  researchInterests: string[];
  institution?: string;
  discipline?: string;
  country?: string;
  language?: string;
  keywords: string[];
  groupMemberships: string[];
  marketplaceActivity: string[];
  publishingActivity: string[];
  conferenceParticipation: string[];
}

/** A scored community recommendation with explanation. */
export interface CommunityRecommendation {
  communityId: string;
  score: number;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Statistics, analytics, insights, portfolio
// ---------------------------------------------------------------------------

export interface CommunityCategoryStat {
  category: CommunityCategory;
  count: number;
  members: number;
  followers: number;
}

export interface CommunityVisibilityStat {
  visibility: CommunityVisibility;
  count: number;
}

export interface CommunityCountryStat {
  country: string;
  count: number;
}

export interface CommunityLanguageStat {
  language: string;
  count: number;
}

export interface CommunityVerificationStat {
  status: InstitutionVerificationStatus;
  count: number;
}

export interface CommunityRoleStat {
  role: CommunityRole;
  count: number;
}

export interface CommunityStatistics {
  totalCommunities: number;
  totalMembers: number;
  totalFollowers: number;
  totalAdministrators: number;
  totalModerators: number;
  totalContributors: number;
  totalMentors: number;
  totalExperts: number;
  totalAmbassadors: number;
  totalAnnouncements: number;
  totalDiscussions: number;
  totalReplies: number;
  totalQuestions: number;
  totalAnswers: number;
  totalResources: number;
  totalEvents: number;
  totalPolls: number;
  totalMentorships: number;
  totalOpportunities: number;
  totalSpotlights: number;
  totalAchievements: number;
  totalBookmarks: number;
  totalTrends: number;
  totalOpenReports: number;
  totalResearchAreas: number;
  totalKeywords: number;
  totalLanguages: number;
  byCategory: CommunityCategoryStat[];
  byVisibility: CommunityVisibilityStat[];
  byCountry: CommunityCountryStat[];
  byLanguage: CommunityLanguageStat[];
  byVerification: CommunityVerificationStat[];
  byRole: CommunityRoleStat[];
}

export interface CommunityAnalytics {
  avgMembersPerCommunity: number;
  avgFollowersPerCommunity: number;
  avgDiscussionsPerCommunity: number;
  avgResourcesPerCommunity: number;
  avgEventsPerCommunity: number;
  avgActivityScore: number;
  publicShare: number;
  mostActiveCommunityId: string;
  topCountries: { country: string; count: number }[];
  topDisciplines: { discipline: string; count: number }[];
  topLanguages: { language: string; count: number }[];
  topResearchAreas: { area: string; count: number }[];
  topKeywords: { keyword: string; count: number }[];
  topTrendingTopics: { label: string; score: number }[];
}

/** A derived AI insight over the communities graph. */
export interface CommunityInsight {
  id: string;
  title: string;
  body: string;
  type: 'trend' | 'cluster' | 'spotlight' | 'summary' | 'opportunity';
  communityId?: string;
}

/** Aggregate root of the Scholarly Communities Platform. */
export interface CommunityPortfolio {
  statistics: CommunityStatistics;
  analytics: CommunityAnalytics;
  communities: Community[];
  members: CommunityMember[];
  followers: CommunityFollower[];
  discussions: CommunityDiscussion[];
  questions: CommunityQuestion[];
  resources: CommunityResource[];
  events: CommunityEvent[];
  announcements: CommunityAnnouncement[];
  opportunities: CommunityOpportunity[];
  insights: CommunityInsight[];
  featured: Community[];
  trending: Community[];
  recommendations: CommunityRecommendation[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const COMMUNITY_CATEGORIES: readonly CommunityCategory[] = [
  'research',
  'professional',
  'academic-society',
  'open-science',
  'educational',
  'student',
  'early-career',
  'women-in-research',
  'ai',
  'health-sciences',
  'engineering',
  'arts-humanities',
  'social-sciences',
  'sustainability',
  'regional',
  'country',
  'institutional',
  'multidisciplinary',
];

export const COMMUNITY_CATEGORY_LABELS: Record<CommunityCategory, string> = {
  research: 'Research Community',
  professional: 'Professional Community',
  'academic-society': 'Academic Society',
  'open-science': 'Open Science Community',
  educational: 'Educational Community',
  student: 'Student Community',
  'early-career': 'Early Career Researchers',
  'women-in-research': 'Women in Research',
  ai: 'AI Community',
  'health-sciences': 'Health Sciences Community',
  engineering: 'Engineering Community',
  'arts-humanities': 'Arts & Humanities Community',
  'social-sciences': 'Social Sciences Community',
  sustainability: 'Sustainability Community',
  regional: 'Regional Community',
  country: 'Country Community',
  institutional: 'Institutional Community',
  multidisciplinary: 'Multidisciplinary Community',
};

export const COMMUNITY_CATEGORY_ICONS: Record<CommunityCategory, string> = {
  research: '🔬',
  professional: '💼',
  'academic-society': '🏛️',
  'open-science': '🌍',
  educational: '🎓',
  student: '🧑‍🎓',
  'early-career': '🌱',
  'women-in-research': '👩‍🔬',
  ai: '🤖',
  'health-sciences': '🩺',
  engineering: '⚙️',
  'arts-humanities': '🎨',
  'social-sciences': '📊',
  sustainability: '♻️',
  regional: '📍',
  country: '🗺️',
  institutional: '🏫',
  multidisciplinary: '🧩',
};

export const COMMUNITY_VISIBILITIES: readonly CommunityVisibility[] = [
  'public',
  'private',
  'invitation-only',
  'institution-only',
];

export const COMMUNITY_VISIBILITY_LABELS: Record<CommunityVisibility, string> = {
  public: 'Public',
  private: 'Private',
  'invitation-only': 'Invitation Only',
  'institution-only': 'Institution Only',
};

export const COMMUNITY_VISIBILITY_ICONS: Record<CommunityVisibility, string> = {
  public: '🌍',
  private: '🔒',
  'invitation-only': '📨',
  'institution-only': '🎓',
};

export const COMMUNITY_ROLES: readonly CommunityRole[] = [
  'owner',
  'administrator',
  'moderator',
  'contributor',
  'member',
  'follower',
  'visitor',
];

export const COMMUNITY_ROLE_LABELS: Record<CommunityRole, string> = {
  owner: 'Owner',
  administrator: 'Administrator',
  moderator: 'Moderator',
  contributor: 'Contributor',
  member: 'Member',
  follower: 'Follower',
  visitor: 'Visitor',
};

export const COMMUNITY_ROLE_ICONS: Record<CommunityRole, string> = {
  owner: '👑',
  administrator: '🛡️',
  moderator: '⚖️',
  contributor: '✍️',
  member: '👤',
  follower: '🔔',
  visitor: '👁️',
};

export const COMMUNITY_MEMBER_STATUSES: readonly CommunityMemberStatus[] = [
  'active',
  'invited',
  'pending',
  'removed',
];

export const COMMUNITY_MEMBER_STATUS_LABELS: Record<CommunityMemberStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  pending: 'Pending',
  removed: 'Removed',
};

export const COMMUNITY_MEMBER_STATUS_ICONS: Record<CommunityMemberStatus, string> = {
  active: '✅',
  invited: '📨',
  pending: '⏳',
  removed: '🚫',
};

export const COMMUNITY_DISCUSSION_STATUSES: readonly CommunityDiscussionStatus[] = ['open', 'locked', 'archived'];

export const COMMUNITY_DISCUSSION_STATUS_LABELS: Record<CommunityDiscussionStatus, string> = {
  open: 'Open',
  locked: 'Locked',
  archived: 'Archived',
};

export const COMMUNITY_DISCUSSION_STATUS_ICONS: Record<CommunityDiscussionStatus, string> = {
  open: '💬',
  locked: '🔒',
  archived: '🗄️',
};

export const COMMUNITY_RESOURCE_TYPES: readonly CommunityResourceType[] = [
  'article',
  'preprint',
  'book',
  'dataset',
  'presentation',
  'video',
  'teaching-material',
  'research-tool',
  'protocol',
  'software',
  'repository',
  'doi',
  'orcid-reference',
];

export const COMMUNITY_RESOURCE_TYPE_LABELS: Record<CommunityResourceType, string> = {
  article: 'Article',
  preprint: 'Preprint',
  book: 'Book',
  dataset: 'Dataset',
  presentation: 'Presentation',
  video: 'Video',
  'teaching-material': 'Teaching Material',
  'research-tool': 'Research Tool',
  protocol: 'Protocol',
  software: 'Software',
  repository: 'Repository',
  doi: 'DOI',
  'orcid-reference': 'ORCID Reference',
};

export const COMMUNITY_RESOURCE_TYPE_ICONS: Record<CommunityResourceType, string> = {
  article: '📄',
  preprint: '📰',
  book: '📚',
  dataset: '🗄️',
  presentation: '📽️',
  video: '🎬',
  'teaching-material': '🧑‍🏫',
  'research-tool': '🔧',
  protocol: '📜',
  software: '💻',
  repository: '🗃️',
  doi: '🔗',
  'orcid-reference': '🆔',
};

export const COMMUNITY_EVENT_TYPES: readonly CommunityEventType[] = [
  'webinar',
  'journal-club',
  'reading-group',
  'meetup',
  'workshop',
  'seminar',
  'conference',
  'social',
];

export const COMMUNITY_EVENT_TYPE_LABELS: Record<CommunityEventType, string> = {
  webinar: 'Webinar',
  'journal-club': 'Journal Club',
  'reading-group': 'Reading Group',
  meetup: 'Meetup',
  workshop: 'Workshop',
  seminar: 'Seminar',
  conference: 'Conference',
  social: 'Social',
};

export const COMMUNITY_EVENT_TYPE_ICONS: Record<CommunityEventType, string> = {
  webinar: '💻',
  'journal-club': '📖',
  'reading-group': '📚',
  meetup: '🤝',
  workshop: '🛠️',
  seminar: '🎙️',
  conference: '🎤',
  social: '🎉',
};

export const COMMUNITY_EVENT_MODES: readonly CommunityEventMode[] = ['in-person', 'online', 'hybrid'];

export const COMMUNITY_EVENT_MODE_LABELS: Record<CommunityEventMode, string> = {
  'in-person': 'In Person',
  online: 'Online',
  hybrid: 'Hybrid',
};

export const COMMUNITY_EVENT_STATUSES: readonly CommunityEventStatus[] = ['scheduled', 'completed', 'cancelled'];

export const COMMUNITY_EVENT_STATUS_LABELS: Record<CommunityEventStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const COMMUNITY_EVENT_STATUS_ICONS: Record<CommunityEventStatus, string> = {
  scheduled: '📅',
  completed: '✅',
  cancelled: '❌',
};

export const COMMUNITY_POLL_STATUSES: readonly CommunityPollStatus[] = ['open', 'closed'];

export const COMMUNITY_POLL_STATUS_LABELS: Record<CommunityPollStatus, string> = {
  open: 'Open',
  closed: 'Closed',
};

export const COMMUNITY_POLL_STATUS_ICONS: Record<CommunityPollStatus, string> = {
  open: '🗳️',
  closed: '🔒',
};

export const COMMUNITY_MENTORSHIP_STATUSES: readonly CommunityMentorshipStatus[] = ['requested', 'active', 'completed'];

export const COMMUNITY_MENTORSHIP_STATUS_LABELS: Record<CommunityMentorshipStatus, string> = {
  requested: 'Requested',
  active: 'Active',
  completed: 'Completed',
};

export const COMMUNITY_MENTORSHIP_STATUS_ICONS: Record<CommunityMentorshipStatus, string> = {
  requested: '📨',
  active: '🤝',
  completed: '🏁',
};

export const COMMUNITY_OPPORTUNITY_KINDS: readonly CommunityOpportunityKind[] = [
  'research-call',
  'funding-call',
  'job',
  'volunteer',
];

export const COMMUNITY_OPPORTUNITY_KIND_LABELS: Record<CommunityOpportunityKind, string> = {
  'research-call': 'Research Call',
  'funding-call': 'Funding Call',
  job: 'Job',
  volunteer: 'Volunteer',
};

export const COMMUNITY_OPPORTUNITY_KIND_ICONS: Record<CommunityOpportunityKind, string> = {
  'research-call': '🔬',
  'funding-call': '💰',
  job: '💼',
  volunteer: '🤲',
};

export const COMMUNITY_REPORT_KINDS: readonly CommunityReportKind[] = [
  'discussion',
  'reply',
  'question',
  'resource',
  'user',
];

export const COMMUNITY_REPORT_KIND_LABELS: Record<CommunityReportKind, string> = {
  discussion: 'Discussion',
  reply: 'Reply',
  question: 'Question',
  resource: 'Resource',
  user: 'User',
};

export const COMMUNITY_REPORT_KIND_ICONS: Record<CommunityReportKind, string> = {
  discussion: '💬',
  reply: '↩️',
  question: '❓',
  resource: '📦',
  user: '👤',
};

export const COMMUNITY_REPORT_STATUSES: readonly CommunityReportStatus[] = ['open', 'reviewed', 'resolved', 'dismissed'];

export const COMMUNITY_REPORT_STATUS_LABELS: Record<CommunityReportStatus, string> = {
  open: 'Open',
  reviewed: 'Reviewed',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

export const COMMUNITY_REPORT_STATUS_ICONS: Record<CommunityReportStatus, string> = {
  open: '🚩',
  reviewed: '🔍',
  resolved: '✅',
  dismissed: '🗑️',
};
