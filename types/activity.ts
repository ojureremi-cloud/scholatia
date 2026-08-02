import type { ResearchLifecycleStageId } from '@/types/research';
import type { DiscoveryEntityType } from '@/types/discovery';

/**
 * Scholatia Unified Scholarly Activity Feed (Phase 2.2C).
 *
 * The canonical scholarly event stream of the Scholatia ecosystem. This is NOT
 * a social-media clone — it is the event stream every module publishes into
 * (publications, citations, datasets, manuscripts, conferences, journals,
 * publishers, peer reviews, funding, grants, projects, collaborators, awards,
 * institutions, education, profile updates, ORCID, verification, trust,
 * advertising, marketplace, research services, subscriptions, commerce,
 * recommendations, AI insights, announcements, security).
 *
 * The Activity Feed owns no records: every activity references its source
 * record through the canonical `sourceId` + `sourceEntity` pattern and never
 * duplicates a researcher, publication, journal, conference, institution,
 * publisher, project, grant, order, service, listing, or campaign owned by
 * another module. Visibility, feeds, trending, recommendations, moderation,
 * and statistics are all derived from the typed graph by the pure engine in
 * `lib/activity.ts` — no schema change is ever needed for new consuming
 * modules or AI assistants.
 */

/** The canonical activity vocabulary — one type per emitting module/surface. */
export type ActivityType =
  | 'publication'
  | 'citation'
  | 'dataset'
  | 'manuscript'
  | 'conference'
  | 'journal'
  | 'publisher'
  | 'peer-review'
  | 'funding'
  | 'grant'
  | 'project'
  | 'collaborator'
  | 'award'
  | 'institution'
  | 'education'
  | 'profile'
  | 'orcid'
  | 'verification'
  | 'trust'
  | 'advertising'
  | 'marketplace-product'
  | 'marketplace-purchase'
  | 'research-service'
  | 'service-order'
  | 'subscription'
  | 'commerce'
  | 'recommendation'
  | 'ai-insight'
  | 'announcement'
  | 'security';

/** How an activity is shared with the network. */
export type ActivityVisibility = 'public' | 'institution' | 'collaborators' | 'followers' | 'private' | 'restricted';

/**
 * The entity vocabulary an activity can reference. Extends the unified
 * Discovery entity types with the commerce, marketplace, service, funding,
 * award, and community records that are not part of the scholarly index.
 */
export type ActivitySourceEntityType =
  | DiscoveryEntityType
  | 'order'
  | 'service'
  | 'listing'
  | 'campaign'
  | 'subscription'
  | 'review'
  | 'dispute'
  | 'milestone'
  | 'grant'
  | 'award'
  | 'announcement'
  | 'group'
  | 'community';

/** The derived feeds the engine can produce from the same canonical graph. */
export type ActivityFeedKind =
  | 'following'
  | 'institution'
  | 'discipline'
  | 'journal'
  | 'conference'
  | 'funding'
  | 'discovery'
  | 'recommended'
  | 'trending'
  | 'ai-curated';

/** The record an activity points back at. Only references, never duplicates. */
export interface ActivitySource {
  id: string;
  entityType: ActivitySourceEntityType;
  title?: string;
  url?: string;
}

/** The actor that triggered an activity, identified by canonical username. */
export interface ActivityActor {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
}

/** A reaction to an activity or comment by one participant. */
export interface ActivityReaction {
  id: string;
  emoji: string;
  actorId: string;
  actorName: string;
  createdAt: string;
}

/** The entity vocabulary a mention can reference. */
export type ActivityMentionEntityType =
  | 'researcher'
  | 'institution'
  | 'journal'
  | 'conference'
  | 'publisher'
  | 'project'
  | 'grant'
  | 'group'
  | 'community';

/** A mention of a researcher or canonical entity inside an activity. */
export interface ActivityMention {
  username?: string;
  userId?: string;
  name: string;
  entityType?: ActivityMentionEntityType;
  entityId?: string;
}

/** The attachment kinds an activity can carry. */
export type ActivityAttachmentType =
  | 'image'
  | 'document'
  | 'file'
  | 'link'
  | 'video'
  | 'publication'
  | 'dataset'
  | 'project'
  | 'manuscript'
  | 'grant';

/** A structured attachment inside an activity, referencing a canonical record. */
export interface ActivityAttachment {
  id: string;
  type: ActivityAttachmentType;
  title: string;
  entityId?: string;
  entityType?: ActivitySourceEntityType;
  url?: string;
}

/** A threaded reply underneath a comment. */
export interface ActivityReply {
  id: string;
  commentId: string;
  author: ActivityActor;
  body: string;
  mentions: ActivityMention[];
  reactions: ActivityReaction[];
  createdAt: string;
  editedAt?: string;
}

/** A top-level comment on an activity with threaded replies. */
export interface ActivityComment {
  id: string;
  activityId: string;
  author: ActivityActor;
  body: string;
  mentions: ActivityMention[];
  reactions: ActivityReaction[];
  createdAt: string;
  editedAt?: string;
  replies: ActivityReply[];
}

/** A per-user bookmark of an activity. */
export interface ActivityBookmark {
  id: string;
  activityId: string;
  bookmarkedBy: string;
  bookmarkedByName: string;
  bookmarkedAt: string;
}

/** A share/repost of an activity across a distribution surface. */
export interface ActivityShare {
  id: string;
  activityId: string;
  sharedBy: string;
  sharedByName: string;
  platform: 'scholatia' | 'linkedin' | 'twitter' | 'facebook' | 'email';
  sharedAt: string;
}

/** Lifecycle state of a moderation report. */
export type ActivityReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

/** A user report on an activity for the moderation queue. */
export interface ActivityReport {
  id: string;
  activityId: string;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  detail?: string;
  status: ActivityReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

/** The outcome a moderator can apply to an activity. */
export type ActivityModerationAction = 'none' | 'flagged' | 'hidden' | 'removed' | 'suspended';

/** A moderation decision applied to an activity. */
export interface ActivityModerationEntry {
  id: string;
  activityId: string;
  action: ActivityModerationAction;
  moderator: string;
  moderatorName: string;
  reason: string;
  createdAt: string;
}

/** A per-user pin of an activity. */
export interface ActivityPin {
  activityId: string;
  pinnedBy: string;
  pinnedByName: string;
  pinnedAt: string;
}

/**
 * A single canonical activity item. Engagement counts are derived by the
 * engine from the comment/bookmark/share ledgers — never hand-maintained.
 */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  verb: string;
  actor: ActivityActor;
  title: string;
  body?: string;
  source: ActivitySource;
  /** Canonical lifecycle stage of the source record, when applicable. */
  stageId?: ResearchLifecycleStageId;
  visibility: ActivityVisibility;
  /** Human note explaining a non-public visibility restriction. */
  restriction?: string;
  hashtags: string[];
  mentions: ActivityMention[];
  attachments: ActivityAttachment[];
  reactions: ActivityReaction[];
  commentCount: number;
  repostCount: number;
  bookmarkCount: number;
  views: number;
  pinned: boolean;
  featured: boolean;
  trendScore: number;
  recommendationScore: number;
  metadata?: Record<string, string>;
  createdAt: string;
  url?: string;
}

/** A single generated feed — one of the ten derived feed kinds. */
export interface ActivityFeed {
  kind: ActivityFeedKind;
  title: string;
  description: string;
  items: ActivityItem[];
}

/** A trending slot with its engine-computed score. */
export interface ActivityTrendingEntry {
  activity: ActivityItem;
  score: number;
  period: string;
}

/** A recommendation slot with its score and human reason. */
export interface ActivityRecommendation {
  activity: ActivityItem;
  score: number;
  reason: string;
}

/** A derived AI insight over the activity graph. */
export interface ActivityInsight {
  id: string;
  title: string;
  body: string;
  type: 'trend' | 'cluster' | 'spotlight' | 'summary' | 'opportunity';
  activityId?: string;
}

/** Input profile the recommendation, following, and institution engines use. */
export interface ActivityRecommendationProfile {
  username: string;
  institution?: string;
  disciplines?: string[];
  follows?: string[];
}

export interface ActivityFilter {
  type?: ActivityType;
  visibility?: ActivityVisibility;
  sourceEntity?: ActivitySourceEntityType;
  pinned?: boolean;
  featured?: boolean;
  moderated?: boolean;
}

export type ActivitySort = 'recent' | 'trending' | 'recommended' | 'engagement' | 'title';

// ---------------------------------------------------------------------------
// Statistics, analytics, portfolio
// ---------------------------------------------------------------------------

export interface ActivityTypeStat {
  type: ActivityType;
  count: number;
}

export interface ActivityVisibilityStat {
  visibility: ActivityVisibility;
  count: number;
}

export interface ActivityFeedStat {
  kind: ActivityFeedKind;
  count: number;
}

export interface ActivityDayStat {
  date: string;
  count: number;
}

export interface ActivityStatistics {
  totalActivities: number;
  totalTypes: number;
  totalActors: number;
  totalSources: number;
  totalReactions: number;
  totalComments: number;
  totalReplies: number;
  totalReposts: number;
  totalBookmarks: number;
  totalMentions: number;
  totalHashtags: number;
  totalAttachments: number;
  totalPinned: number;
  totalFeatured: number;
  totalReports: number;
  totalModerated: number;
  byType: ActivityTypeStat[];
  byVisibility: ActivityVisibilityStat[];
}

export interface ActivityAnalytics {
  totalEngagements: number;
  totalViews: number;
  averageEngagementPerActivity: number;
  averageViewsPerActivity: number;
  engagementRate: number;
  mostEngagingActivityId: string;
  topHashtags: { tag: string; count: number }[];
  topTypes: ActivityTypeStat[];
  byDay: ActivityDayStat[];
  byFeedKind: ActivityFeedStat[];
}

/** Aggregate root of the Unified Scholarly Activity Feed. */
export interface ActivityPortfolio {
  statistics: ActivityStatistics;
  analytics: ActivityAnalytics;
  activities: ActivityItem[];
  comments: ActivityComment[];
  bookmarks: ActivityBookmark[];
  shares: ActivityShare[];
  reports: ActivityReport[];
  moderation: ActivityModerationEntry[];
  feeds: ActivityFeed[];
  trending: ActivityTrendingEntry[];
  recommendations: ActivityRecommendation[];
  featured: ActivityItem[];
  pinned: ActivityPin[];
  insights: ActivityInsight[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const ACTIVITY_TYPES: readonly ActivityType[] = [
  'publication',
  'citation',
  'dataset',
  'manuscript',
  'conference',
  'journal',
  'publisher',
  'peer-review',
  'funding',
  'grant',
  'project',
  'collaborator',
  'award',
  'institution',
  'education',
  'profile',
  'orcid',
  'verification',
  'trust',
  'advertising',
  'marketplace-product',
  'marketplace-purchase',
  'research-service',
  'service-order',
  'subscription',
  'commerce',
  'recommendation',
  'ai-insight',
  'announcement',
  'security',
];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  publication: 'Publications',
  citation: 'Citations',
  dataset: 'Datasets',
  manuscript: 'Manuscripts',
  conference: 'Conferences',
  journal: 'Journals',
  publisher: 'Publishers',
  'peer-review': 'Peer Reviews',
  funding: 'Funding',
  grant: 'Grants',
  project: 'Projects',
  collaborator: 'Collaborators',
  award: 'Awards',
  institution: 'Institutions',
  education: 'Education',
  profile: 'Profile Updates',
  orcid: 'ORCID',
  verification: 'Identity Verification',
  trust: 'Trust Badges',
  advertising: 'Advertising Campaigns',
  'marketplace-product': 'Marketplace Products',
  'marketplace-purchase': 'Marketplace Purchases',
  'research-service': 'Research Services',
  'service-order': 'Service Orders',
  subscription: 'Subscriptions',
  commerce: 'Commerce Transactions',
  recommendation: 'Recommendations',
  'ai-insight': 'AI Insights',
  announcement: 'Platform Announcements',
  security: 'Security Alerts',
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  publication: '📄',
  citation: '🔖',
  dataset: '🗄️',
  manuscript: '📝',
  conference: '🎤',
  journal: '🗞️',
  publisher: '🏛️',
  'peer-review': '🔍',
  funding: '💰',
  grant: '🎯',
  project: '📁',
  collaborator: '🤝',
  award: '🏆',
  institution: '🎓',
  education: '📚',
  profile: '🪪',
  orcid: '🔗',
  verification: '✔️',
  trust: '🛡️',
  advertising: '📢',
  'marketplace-product': '🛍️',
  'marketplace-purchase': '🧾',
  'research-service': '🛠️',
  'service-order': '📦',
  subscription: '♻️',
  commerce: '💳',
  recommendation: '⭐',
  'ai-insight': '🧠',
  announcement: '📣',
  security: '⚠️',
};

export const ACTIVITY_VISIBILITIES: readonly ActivityVisibility[] = [
  'public',
  'institution',
  'collaborators',
  'followers',
  'private',
  'restricted',
];

export const ACTIVITY_VISIBILITY_LABELS: Record<ActivityVisibility, string> = {
  public: 'Public',
  institution: 'Institution',
  collaborators: 'Collaborators',
  followers: 'Followers',
  private: 'Private',
  restricted: 'Restricted',
};

export const ACTIVITY_VISIBILITY_ICONS: Record<ActivityVisibility, string> = {
  public: '🌍',
  institution: '🎓',
  collaborators: '🤝',
  followers: '👥',
  private: '🔒',
  restricted: '🔐',
};

export const ACTIVITY_SOURCE_ENTITY_TYPES: readonly ActivitySourceEntityType[] = [
  'researcher',
  'journal',
  'conference',
  'institution',
  'publisher',
  'project',
  'publication',
  'dataset',
  'manuscript',
  'funding',
  'order',
  'service',
  'listing',
  'campaign',
  'subscription',
  'review',
  'dispute',
  'milestone',
  'grant',
  'award',
  'announcement',
  'group',
  'community',
];

export const ACTIVITY_FEED_KINDS: readonly ActivityFeedKind[] = [
  'following',
  'institution',
  'discipline',
  'journal',
  'conference',
  'funding',
  'discovery',
  'recommended',
  'trending',
  'ai-curated',
];

export const ACTIVITY_FEED_KIND_LABELS: Record<ActivityFeedKind, string> = {
  following: 'Following',
  institution: 'Institution',
  discipline: 'Discipline',
  journal: 'Journal',
  conference: 'Conference',
  funding: 'Funding',
  discovery: 'Discovery',
  recommended: 'Recommended',
  trending: 'Trending',
  'ai-curated': 'AI-curated',
};

export const ACTIVITY_FEED_KIND_ICONS: Record<ActivityFeedKind, string> = {
  following: '👣',
  institution: '🎓',
  discipline: '🧭',
  journal: '🗞️',
  conference: '🎤',
  funding: '💰',
  discovery: '🔎',
  recommended: '⭐',
  trending: '📈',
  'ai-curated': '🧠',
};

export const ACTIVITY_ATTACHMENT_TYPES: readonly ActivityAttachmentType[] = [
  'image',
  'document',
  'file',
  'link',
  'video',
  'publication',
  'dataset',
  'project',
  'manuscript',
  'grant',
];

export const ACTIVITY_ATTACHMENT_TYPE_LABELS: Record<ActivityAttachmentType, string> = {
  image: 'Image',
  document: 'Document',
  file: 'File',
  link: 'Link',
  video: 'Video',
  publication: 'Publication',
  dataset: 'Dataset',
  project: 'Project',
  manuscript: 'Manuscript',
  grant: 'Grant',
};

export const ACTIVITY_ATTACHMENT_TYPE_ICONS: Record<ActivityAttachmentType, string> = {
  image: '🖼️',
  document: '📄',
  file: '📁',
  link: '🔗',
  video: '🎬',
  publication: '📄',
  dataset: '🗄️',
  project: '📁',
  manuscript: '📝',
  grant: '🎯',
};

export const ACTIVITY_REPORT_REASONS: readonly string[] = [
  'Spam',
  'Harassment',
  'Misinformation',
  'Plagiarism',
  'Inappropriate content',
  'Duplicate activity',
  'Copyright violation',
  'Other',
];

export const ACTIVITY_MODERATION_ACTIONS: readonly ActivityModerationAction[] = [
  'none',
  'flagged',
  'hidden',
  'removed',
  'suspended',
];

/** The emoji reaction palette users can apply to activities. */
export const ACTIVITY_EMOJIS: readonly string[] = ['👍', '❤️', '🎉', '🔥', '🧠', '🚀', '👏', '💡'];
