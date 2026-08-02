import type {
  ActivityAnalytics,
  ActivityBookmark,
  ActivityComment,
  ActivityFeed,
  ActivityFeedKind,
  ActivityFilter,
  ActivityInsight,
  ActivityItem,
  ActivityMention,
  ActivityModerationEntry,
  ActivityPin,
  ActivityRecommendation,
  ActivityRecommendationProfile,
  ActivityReport,
  ActivityShare,
  ActivitySort,
  ActivitySource,
  ActivityStatistics,
  ActivityTrendingEntry,
  ActivityVisibility,
} from '@/types/activity';
import {
  ACTIVITY_FEED_KINDS,
  ACTIVITY_SOURCE_ENTITY_TYPES,
  ACTIVITY_TYPES,
} from '@/types/activity';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Unified Scholarly Activity Feed (Phase 2.2C).
 *
 * The pure activity engine — no React, no side effects, no API calls — and
 * deliberately API-shaped so every helper can be exported directly as an
 * endpoint in later phases (Mobile API, Enterprise API). It owns no records:
 * every activity references a canonical source record through `sourceId` +
 * `sourceEntity`, visibility is resolved against the network, and feeds,
 * trending, recommendations, moderation, statistics, and analytics are all
 * derived from the typed graph so no schema change is ever needed.
 */

/** Canonical activity id prefix. */
export function activityId(label: string): string {
  const key = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `act-${key}`;
}

/** Canonical route resolution for an activity source record. */
export function buildActivityUrl(source: ActivitySource): string {
  switch (source.entityType) {
    case 'researcher':
      return `/researchers/${source.id}`;
    case 'journal':
      return `/journals`;
    case 'conference':
      return `/conferences`;
    case 'institution':
      return `/institutions`;
    case 'publisher':
      return `/publishers`;
    case 'project':
      return `/research/${source.id}`;
    case 'publication':
      return `/publications`;
    case 'dataset':
      return `/datasets`;
    case 'manuscript':
      return `/manuscripts`;
    case 'funding':
    case 'grant':
      return `/funding`;
    case 'order':
      return `/commerce`;
    case 'service':
      return `/services`;
    case 'listing':
      return `/marketplace`;
    case 'campaign':
      return `/ads`;
    case 'subscription':
      return `/commerce`;
    case 'review':
      return `/marketplace`;
    case 'dispute':
    case 'milestone':
      return `/services`;
    case 'award':
      return `/awards`;
    case 'announcement':
      return `/notifications`;
    case 'group':
    case 'community':
      return `/messages`;
    default:
      return `/activity`;
  }
}

/** The canonical route to an activity's source record. */
export function activityUrl(activity: ActivityItem): string {
  return activity.url ?? buildActivityUrl(activity.source);
}

/** Create an activity from a partial input, filling canonical defaults. */
export function createActivity(input: {
  id: string;
  type: ActivityItem['type'];
  verb: string;
  actor: ActivityItem['actor'];
  title: string;
  body?: string;
  source: ActivitySource;
  stageId?: ResearchLifecycleStageId;
  visibility?: ActivityVisibility;
  restriction?: string;
  hashtags?: string[];
  mentions?: ActivityMention[];
  attachments?: ActivityItem['attachments'];
  reactions?: ActivityItem['reactions'];
  views?: number;
  pinned?: boolean;
  featured?: boolean;
  trendScore?: number;
  recommendationScore?: number;
  metadata?: Record<string, string>;
  createdAt?: string;
  url?: string;
}): ActivityItem {
  return {
    id: input.id,
    type: input.type,
    verb: input.verb,
    actor: input.actor,
    title: input.title,
    body: input.body,
    source: input.source,
    stageId: input.stageId,
    visibility: input.visibility ?? 'public',
    restriction: input.restriction,
    hashtags: input.hashtags ?? [],
    mentions: input.mentions ?? [],
    attachments: input.attachments ?? [],
    reactions: input.reactions ?? [],
    commentCount: 0,
    repostCount: 0,
    bookmarkCount: 0,
    views: input.views ?? 0,
    pinned: input.pinned ?? false,
    featured: input.featured ?? false,
    trendScore: input.trendScore ?? 0,
    recommendationScore: input.recommendationScore ?? 0,
    metadata: input.metadata,
    createdAt: input.createdAt ?? new Date().toISOString(),
    url: input.url ?? buildActivityUrl(input.source),
  };
}

// ---------------------------------------------------------------------------
// Hashtags & mentions
// ---------------------------------------------------------------------------

const HASHTAG_PATTERN = /#([\p{L}\p{N}_]+)/gu;
const MENTION_PATTERN = /@([\p{L}\p{N}_]+)/gu;

/** Extract canonical hashtags from free text (Unicode-aware). */
export function extractHashtags(text: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const match of text.matchAll(HASHTAG_PATTERN)) {
    const tag = match[1].toLowerCase();
    if (!seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
  }
  return tags;
}

/** Extract mentions from free text, resolving `@name` against known people. */
export function extractMentions(text: string, people: readonly { username?: string; name: string }[]): ActivityMention[] {
  const mentions: ActivityMention[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(MENTION_PATTERN)) {
    const needle = match[1].toLowerCase();
    const person = people.find((entry) => entry.username?.toLowerCase() === needle || entry.name.toLowerCase() === needle);
    if (person && !seen.has(person.name)) {
      seen.add(person.name);
      mentions.push({ username: person.username, name: person.name, entityType: 'researcher', entityId: person.username });
    }
  }
  return mentions;
}

/** Aggregate hashtag frequencies across a set of activities. */
export function hashtagsForActivities(activities: readonly ActivityItem[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  activities.forEach((activity) => {
    activity.hashtags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// ---------------------------------------------------------------------------
// Comments, bookmarks, shares, engagement
// ---------------------------------------------------------------------------

export function commentsForActivity(comments: readonly ActivityComment[], activityId: string): ActivityComment[] {
  return comments.filter((comment) => comment.activityId === activityId);
}

export function commentCount(comments: readonly ActivityComment[], activityId: string): number {
  return comments.filter((comment) => comment.activityId === activityId).length;
}

export function replyCount(comment: ActivityComment): number {
  return comment.replies.length;
}

export function repliesForComment(comment: ActivityComment): ActivityComment['replies'] {
  return comment.replies;
}

/** Append a comment (pure). */
export function addComment(
  comments: readonly ActivityComment[],
  input: {
    id: string;
    activityId: string;
    author: ActivityComment['author'];
    body: string;
    mentions?: ActivityMention[];
    createdAt?: string;
  },
): ActivityComment[] {
  return [
    ...comments,
    {
      id: input.id,
      activityId: input.activityId,
      author: input.author,
      body: input.body,
      mentions: input.mentions ?? [],
      reactions: [],
      createdAt: input.createdAt ?? new Date().toISOString(),
      replies: [],
    },
  ];
}

/** Append a threaded reply to a comment (pure). */
export function addReply(
  comments: readonly ActivityComment[],
  commentId: string,
  input: {
    id: string;
    author: ActivityComment['author'];
    body: string;
    mentions?: ActivityMention[];
    createdAt?: string;
  },
): ActivityComment[] {
  return comments.map((comment) =>
    comment.id === commentId
      ? {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: input.id,
              commentId,
              author: input.author,
              body: input.body,
              mentions: input.mentions ?? [],
              reactions: [],
              createdAt: input.createdAt ?? new Date().toISOString(),
            },
          ],
        }
      : comment,
  );
}

export function bookmarksForActivity(bookmarks: readonly ActivityBookmark[], activityId: string): ActivityBookmark[] {
  return bookmarks.filter((bookmark) => bookmark.activityId === activityId);
}

export function bookmarkCount(bookmarks: readonly ActivityBookmark[], activityId: string): number {
  return bookmarks.filter((bookmark) => bookmark.activityId === activityId).length;
}

/** Toggle a bookmark for a user (pure). */
export function toggleBookmark(
  bookmarks: readonly ActivityBookmark[],
  activity: ActivityItem,
  user: { username: string; name: string },
): ActivityBookmark[] {
  const existing = bookmarks.find(
    (bookmark) => bookmark.activityId === activity.id && bookmark.bookmarkedBy === user.username,
  );
  if (existing) {
    return bookmarks.filter((bookmark) => bookmark !== existing);
  }
  return [
    ...bookmarks,
    {
      id: `bm-${Date.now()}`,
      activityId: activity.id,
      bookmarkedBy: user.username,
      bookmarkedByName: user.name,
      bookmarkedAt: new Date().toISOString(),
    },
  ];
}

export function sharesForActivity(shares: readonly ActivityShare[], activityId: string): ActivityShare[] {
  return shares.filter((share) => share.activityId === activityId);
}

export function shareCount(shares: readonly ActivityShare[], activityId: string): number {
  return shares.filter((share) => share.activityId === activityId).length;
}

/** Reposts are shares distributed on the Scholatia platform itself. */
export function repostCount(shares: readonly ActivityShare[], activityId: string): number {
  return shares.filter((share) => share.activityId === activityId && share.platform === 'scholatia').length;
}

/** The engagement score of an activity across every interaction surface. */
export function engagementScore(
  activity: ActivityItem,
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
): number {
  const commentsTotal = commentCount(comments, activity.id);
  const repliesTotal = commentsForActivity(comments, activity.id).reduce((sum, comment) => sum + comment.replies.length, 0);
  return (
    activity.reactions.length +
    commentsTotal * 2 +
    repliesTotal * 2 +
    repostCount(shares, activity.id) * 3 +
    bookmarkCount(bookmarks, activity.id) * 2
  );
}

/** Return a fresh activity with derived engagement counts baked in. */
export function resolveEngagement(
  activity: ActivityItem,
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
): ActivityItem {
  return {
    ...activity,
    commentCount: commentCount(comments, activity.id),
    repostCount: repostCount(shares, activity.id),
    bookmarkCount: bookmarkCount(bookmarks, activity.id),
  };
}

/** Add a reaction to an activity (pure). */
export function addReaction(
  activities: readonly ActivityItem[],
  activityId: string,
  reaction: ActivityItem['reactions'][number],
): ActivityItem[] {
  return activities.map((activity) =>
    activity.id === activityId
      ? {
          ...activity,
          reactions: activity.reactions.some(
            (existing) => existing.emoji === reaction.emoji && existing.actorId === reaction.actorId,
          )
            ? activity.reactions
            : [...activity.reactions, reaction],
        }
      : activity,
  );
}

/** Remove a reaction from an activity (pure). */
export function removeReaction(
  activities: readonly ActivityItem[],
  activityId: string,
  actorId: string,
  emoji: string,
): ActivityItem[] {
  return activities.map((activity) =>
    activity.id === activityId
      ? { ...activity, reactions: activity.reactions.filter((reaction) => !(reaction.emoji === emoji && reaction.actorId === actorId)) }
      : activity,
  );
}

// ---------------------------------------------------------------------------
// Visibility resolution
// ---------------------------------------------------------------------------

export type ActivityViewer = {
  username: string;
  institution?: string;
  follows?: string[];
  collaborators?: string[];
  isModerator?: boolean;
  isAdmin?: boolean;
};

/** Resolve whether a viewer may see an activity under its visibility rules. */
export function canViewActivity(activity: ActivityItem, viewer: ActivityViewer): boolean {
  if (viewer.isAdmin || viewer.isModerator) return true;
  const isActor = activity.actor.username === viewer.username || activity.actor.id === viewer.username;
  if (isActor) return true;
  switch (activity.visibility) {
    case 'public':
      return true;
    case 'followers':
      return viewer.follows?.includes(activity.actor.username ?? '') ?? false;
    case 'collaborators':
      return viewer.collaborators?.includes(activity.actor.username ?? '') ?? false;
    case 'institution':
      return (
        activity.source.entityType === 'institution' && activity.source.id === viewer.institution
      );
    case 'restricted':
    case 'private':
    default:
      return false;
  }
}

/** Filter activities to only those the viewer may see. */
export function visibleActivities(activities: readonly ActivityItem[], viewer: ActivityViewer): ActivityItem[] {
  return activities.filter((activity) => canViewActivity(activity, viewer));
}

/** Named alias kept for API symmetry with other modules. */
export function resolveVisibility(activity: ActivityItem, viewer: ActivityViewer): boolean {
  return canViewActivity(activity, viewer);
}

// ---------------------------------------------------------------------------
// Trending & recommendation scoring
// ---------------------------------------------------------------------------

const TREND_HALF_LIFE_HOURS = 72;

/** Recency-weighted trending score for an activity. */
export function trendScore(
  activity: ActivityItem,
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  now = new Date(),
): number {
  const engagement = engagementScore(activity, comments, bookmarks, shares);
  const elapsedMs = Math.max(0, now.getTime() - new Date(activity.createdAt).getTime());
  const elapsedHours = elapsedMs / 3_600_000;
  const recency = Math.exp(-elapsedHours / TREND_HALF_LIFE_HOURS);
  return Math.round((engagement + 1) * (1 + recency * 5) * 10) / 10;
}

/** The trending slots for a set of activities. */
export function trendingActivities(
  activities: readonly ActivityItem[],
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  options: { top?: number; now?: Date; period?: string } = {},
): ActivityTrendingEntry[] {
  const period = options.period ?? '7d';
  return activities
    .map((activity) => ({
      activity,
      score: trendScore(activity, comments, bookmarks, shares, options.now),
      period,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, options.top ?? 10);
}

/** Recommendation score (0-100) of an activity for a viewer profile. */
export function recommendationScore(activity: ActivityItem, profile: ActivityRecommendationProfile): number {
  let score = 0;
  const actorUsername = activity.actor.username ?? activity.actor.id;
  if (profile.follows?.includes(actorUsername)) score += 40;
  if (activity.mentions.some((mention) => mention.username === profile.username)) score += 50;
  if (activity.source.entityType === 'institution' && activity.source.id === profile.institution) score += 30;
  const disciplines = profile.disciplines ?? [];
  const tagMatch = activity.hashtags.filter((tag) => disciplines.some((discipline) => tag.includes(discipline.toLowerCase())));
  score += Math.min(30, tagMatch.length * 15);
  if (activity.metadata?.discipline && disciplines.includes(activity.metadata.discipline)) score += 20;
  if (activity.visibility === 'public') score += 10;
  if (activity.visibility === 'followers' || activity.visibility === 'collaborators') score += 5;
  if (activity.featured) score += 10;
  return Math.max(0, Math.min(100, score));
}

/** The recommendation slots for a viewer profile. */
export function recommendedActivities(
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
  options: { top?: number } = {},
): ActivityRecommendation[] {
  return activities
    .map((activity) => {
      const score = recommendationScore(activity, profile);
      return { activity, score, reason: reasonForRecommendation(activity, profile, score) };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, options.top ?? 10);
}

function reasonForRecommendation(activity: ActivityItem, profile: ActivityRecommendationProfile, score: number): string {
  if (score >= 60) return 'Closely aligned with your network and research areas';
  if (score >= 40) return 'From researchers and records in your network';
  if (score >= 20) return 'Related to your disciplines and interests';
  return 'Rising engagement in your community';
}

// ---------------------------------------------------------------------------
// Derived feeds
// ---------------------------------------------------------------------------

export type ActivityFeedOptions = {
  discipline?: string;
  journalId?: string;
  conferenceId?: string;
  top?: number;
};

export function followingFeed(
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
): ActivityItem[] {
  return activities
    .filter(
      (activity) =>
        activity.actor.username === profile.username ||
        profile.follows?.includes(activity.actor.username ?? '') ||
        activity.mentions.some((mention) => mention.username === profile.username),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function institutionFeed(activities: readonly ActivityItem[], institutionId: string): ActivityItem[] {
  return activities
    .filter(
      (activity) =>
        activity.source.entityType === 'institution' &&
        activity.source.id === institutionId,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function disciplineFeed(activities: readonly ActivityItem[], discipline: string): ActivityItem[] {
  const needle = discipline.toLowerCase();
  return activities
    .filter(
      (activity) =>
        activity.metadata?.discipline === discipline ||
        activity.hashtags.some((tag) => tag.includes(needle)) ||
        `${activity.title} ${activity.body ?? ''}`.toLowerCase().includes(needle),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function journalFeed(activities: readonly ActivityItem[], journalId: string): ActivityItem[] {
  return activities
    .filter((activity) => activity.source.entityType === 'journal' && activity.source.id === journalId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function conferenceFeed(activities: readonly ActivityItem[], conferenceId: string): ActivityItem[] {
  return activities
    .filter((activity) => activity.source.entityType === 'conference' && activity.source.id === conferenceId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function fundingFeed(activities: readonly ActivityItem[]): ActivityItem[] {
  return activities
    .filter(
      (activity) =>
        activity.type === 'funding' ||
        activity.type === 'grant' ||
        activity.source.entityType === 'funding' ||
        activity.source.entityType === 'grant',
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function discoveryFeed(activities: readonly ActivityItem[]): ActivityItem[] {
  return [...activities].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function recommendedFeed(
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
  options: { top?: number } = {},
): ActivityItem[] {
  return recommendedActivities(activities, profile, options).map((entry) => entry.activity);
}

export function trendingFeed(
  activities: readonly ActivityItem[],
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  options: { top?: number } = {},
): ActivityItem[] {
  return trendingActivities(activities, comments, bookmarks, shares, options).map((entry) => entry.activity);
}

/** AI-curated feed: the highest-scored recommendations with insight framing. */
export function aiCuratedFeed(
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
  options: { top?: number } = {},
): ActivityItem[] {
  return recommendedActivities(activities, profile, { top: (options.top ?? 10) * 2 })
    .sort((a, b) => b.score - a.score)
    .slice(0, options.top ?? 10)
    .map((entry) => entry.activity);
}

/** Build a single feed by kind. */
export function feedForKind(
  kind: ActivityFeedKind,
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  options: ActivityFeedOptions = {},
): ActivityFeed {
  const base = { kind, title: kind, description: `${kind} feed`, items: [] as ActivityItem[] };
  switch (kind) {
    case 'following':
      return { ...base, title: 'Following', description: 'Activity from researchers you follow and mentions of you.', items: followingFeed(activities, profile).slice(0, options.top ?? 25) };
    case 'institution':
      return {
        ...base,
        title: 'Institution',
        description: 'Activity from your institution and its records.',
        items: (profile.institution ? institutionFeed(activities, profile.institution) : []).slice(0, options.top ?? 25),
      };
    case 'discipline':
      return {
        ...base,
        title: 'Discipline',
        description: `Activity across ${options.discipline ?? 'your disciplines'}.`,
        items: (options.discipline ? disciplineFeed(activities, options.discipline) : []).slice(0, options.top ?? 25),
      };
    case 'journal':
      return {
        ...base,
        title: 'Journal',
        description: 'Activity from journals you follow.',
        items: (options.journalId ? journalFeed(activities, options.journalId) : []).slice(0, options.top ?? 25),
      };
    case 'conference':
      return {
        ...base,
        title: 'Conference',
        description: 'Activity from conferences you follow.',
        items: (options.conferenceId ? conferenceFeed(activities, options.conferenceId) : []).slice(0, options.top ?? 25),
      };
    case 'funding':
      return { ...base, title: 'Funding', description: 'Funding and grant opportunities, awards, and deadlines.', items: fundingFeed(activities).slice(0, options.top ?? 25) };
    case 'discovery':
      return { ...base, title: 'Discovery', description: 'The full platform-wide scholarly event stream.', items: discoveryFeed(activities).slice(0, options.top ?? 25) };
    case 'recommended':
      return { ...base, title: 'Recommended', description: 'Personalised recommendations for you.', items: recommendedFeed(activities, profile, options).slice(0, options.top ?? 25) };
    case 'trending':
      return { ...base, title: 'Trending', description: 'The fastest-rising activity across the platform.', items: trendingFeed(activities, comments, bookmarks, shares, options).slice(0, options.top ?? 25) };
    case 'ai-curated':
      return { ...base, title: 'AI-curated', description: 'A curated briefing generated from your network and research areas.', items: aiCuratedFeed(activities, profile, options).slice(0, options.top ?? 25) };
    default:
      return base;
  }
}

/** Build every derived feed in canonical order. */
export function buildFeeds(
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  options: ActivityFeedOptions = {},
): ActivityFeed[] {
  return ACTIVITY_FEED_KINDS.map((kind) => feedForKind(kind, activities, profile, comments, bookmarks, shares, options));
}

/** Count of activities that qualify for each feed kind. */
export function activitiesByFeedKind(
  activities: readonly ActivityItem[],
  profile: ActivityRecommendationProfile,
  options: ActivityFeedOptions = {},
): { kind: ActivityFeedKind; count: number }[] {
  return ACTIVITY_FEED_KINDS.map((kind) => ({
    kind,
    count: feedForKind(kind, activities, profile, [], [], [], options).items.length,
  }));
}

// ---------------------------------------------------------------------------
// Filtering, sorting, search
// ---------------------------------------------------------------------------

export function filterActivities(activities: readonly ActivityItem[], filter: ActivityFilter = {}): ActivityItem[] {
  return activities.filter((activity) => {
    if (filter.type && activity.type !== filter.type) return false;
    if (filter.visibility && activity.visibility !== filter.visibility) return false;
    if (filter.sourceEntity && activity.source.entityType !== filter.sourceEntity) return false;
    if (filter.pinned === true && !activity.pinned) return false;
    if (filter.featured === true && !activity.featured) return false;
    if (filter.moderated === false && activity.metadata?.moderated === 'true') return false;
    if (filter.moderated === true && activity.metadata?.moderated !== 'true') return false;
    return true;
  });
}

export function sortActivities(
  activities: readonly ActivityItem[],
  sort: ActivitySort,
  comments: readonly ActivityComment[] = [],
  bookmarks: readonly ActivityBookmark[] = [],
  shares: readonly ActivityShare[] = [],
): ActivityItem[] {
  const sorted = [...activities];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'trending':
      return sorted.sort((a, b) => b.trendScore - a.trendScore || b.createdAt.localeCompare(a.createdAt));
    case 'recommended':
      return sorted.sort((a, b) => b.recommendationScore - a.recommendationScore || b.createdAt.localeCompare(a.createdAt));
    case 'engagement':
      return sorted.sort(
        (a, b) =>
          engagementScore(b, comments, bookmarks, shares) - engagementScore(a, comments, bookmarks, shares) ||
          b.createdAt.localeCompare(a.createdAt),
      );
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

export function searchActivities(activities: readonly ActivityItem[], query: string): ActivityItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return activities.filter((activity) =>
    `${activity.title} ${activity.body ?? ''} ${activity.verb} ${activity.actor.name} ${activity.hashtags.join(' ')} ${activity.type}`
      .toLowerCase()
      .includes(needle),
  );
}

export function groupActivitiesByDay(activities: readonly ActivityItem[]): { date: string; count: number }[] {
  const counts = new Map<string, number>();
  activities.forEach((activity) => {
    const date = new Date(activity.createdAt).toISOString().slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function activitiesByType(activities: readonly ActivityItem[]): { type: ActivityItem['type']; count: number }[] {
  return ACTIVITY_TYPES.map((type) => ({ type, count: activities.filter((activity) => activity.type === type).length })).filter(
    (stat) => stat.count > 0,
  );
}

export function activitiesByVisibility(activities: readonly ActivityItem[]): { visibility: ActivityVisibility; count: number }[] {
  const counts = new Map<ActivityVisibility, number>();
  activities.forEach((activity) => counts.set(activity.visibility, (counts.get(activity.visibility) ?? 0) + 1));
  return [...counts.entries()]
    .map(([visibility, count]) => ({ visibility, count }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Pinning, featured
// ---------------------------------------------------------------------------

export function pinActivity(pins: readonly ActivityPin[], activityId: string, user: { username: string; name: string }): ActivityPin[] {
  if (pins.some((entry) => entry.activityId === activityId && entry.pinnedBy === user.username)) return [...pins];
  return [...pins, { activityId, pinnedBy: user.username, pinnedByName: user.name, pinnedAt: new Date().toISOString() }];
}

export function unpinActivity(pins: readonly ActivityPin[], activityId: string, user: { username: string }): ActivityPin[] {
  return pins.filter((entry) => !(entry.activityId === activityId && entry.pinnedBy === user.username));
}

export function pinnedActivitiesForUser(pins: readonly ActivityPin[], activities: readonly ActivityItem[], username: string): ActivityItem[] {
  const ids = new Set(pins.filter((entry) => entry.pinnedBy === username).map((entry) => entry.activityId));
  return activities.filter((activity) => ids.has(activity.id));
}

export function featuredActivities(activities: readonly ActivityItem[]): ActivityItem[] {
  return activities.filter((activity) => activity.featured);
}

// ---------------------------------------------------------------------------
// Moderation
// ---------------------------------------------------------------------------

export function reportActivity(
  reports: readonly ActivityReport[],
  input: {
    id: string;
    activityId: string;
    reportedBy: string;
    reportedByName: string;
    reason: string;
    detail?: string;
  },
): ActivityReport[] {
  return [
    ...reports,
    {
      id: input.id,
      activityId: input.activityId,
      reportedBy: input.reportedBy,
      reportedByName: input.reportedByName,
      reason: input.reason,
      detail: input.detail,
      status: 'open',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function moderationStatusOf(activity: ActivityItem, moderation: readonly ActivityModerationEntry[]): ActivityModerationEntry['action'] {
  const sorted = moderation
    .filter((entry) => entry.activityId === activity.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sorted[0]?.action ?? 'none';
}

/** Activities needing attention: reported and not yet resolved. */
export function moderationQueue(
  activities: readonly ActivityItem[],
  reports: readonly ActivityReport[],
): { activity: ActivityItem; reports: ActivityReport[] }[] {
  return activities
    .map((activity) => ({
      activity,
      reports: reports.filter((report) => report.activityId === activity.id && report.status !== 'resolved' && report.status !== 'dismissed'),
    }))
    .filter((entry) => entry.reports.length > 0)
    .sort((a, b) => b.reports.length - a.reports.length);
}

/** An activity with two or more open reports is flagged for review. */
export function shouldModerate(activity: ActivityItem, reports: readonly ActivityReport[]): boolean {
  return reports.filter((report) => report.activityId === activity.id && report.status === 'open').length >= 2;
}

/** Apply a moderation decision (pure) — marks the activity in its metadata. */
export function applyModeration(activities: readonly ActivityItem[], entry: ActivityModerationEntry): ActivityItem[] {
  return activities.map((activity) =>
    activity.id === entry.activityId
      ? {
          ...activity,
          metadata: entry.action !== 'none' ? { ...activity.metadata, moderated: 'true' } : activity.metadata,
        }
      : activity,
  );
}

/** Resolve a report (pure). */
export function resolveReport(reports: readonly ActivityReport[], reportId: string, resolvedBy: string): ActivityReport[] {
  return reports.map((report) =>
    report.id === reportId
      ? {
          ...report,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          resolvedBy,
        }
      : report,
  );
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

/** Derived AI insights over the activity graph. */
export function activityInsights(
  activities: readonly ActivityItem[],
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  options: { top?: number } = {},
): ActivityInsight[] {
  const insights: ActivityInsight[] = [];
  const tags = hashtagsForActivities(activities);
  if (tags.length > 0) {
    insights.push({
      id: 'ai-trending-topic',
      title: 'Rising topic',
      body: `#${tags[0].tag} is the most active hashtag on the feed, appearing in ${tags[0].count} recent activities.`,
      type: 'trend',
    });
  }
  const types = activitiesByType(activities);
  if (types.length > 0) {
    insights.push({
      id: 'ai-busiest-type',
      title: 'Busiest activity type',
      body: `${types[0].type} activity leads the platform right now with ${types[0].count} recent activities.`,
      type: 'summary',
    });
  }
  const engaging = [...activities].sort(
    (a, b) => engagementScore(b, comments, bookmarks, shares) - engagementScore(a, comments, bookmarks, shares),
  )[0];
  if (engaging) {
    insights.push({
      id: 'ai-spotlight',
      title: 'Spotlight',
      body: `"${engaging.title}" is drawing the most engagement in the network right now.`,
      type: 'spotlight',
      activityId: engaging.id,
    });
  }
  const institutions = activities.filter((activity) => activity.source.entityType === 'institution');
  if (institutions.length > 0) {
    insights.push({
      id: 'ai-institution-cluster',
      title: 'Institution cluster',
      body: `Institutional activity is concentrated around ${institutions.length} records on the feed, signalling active faculty output.`,
      type: 'cluster',
    });
  }
  const opportunities = activities.filter(
    (activity) => activity.type === 'funding' || activity.type === 'grant' || activity.type === 'collaborator',
  );
  if (opportunities.length > 0) {
    insights.push({
      id: 'ai-opportunity',
      title: 'Open opportunity',
      body: `${opportunities.length} funding, grant, and collaboration activities are live — matching them to your research areas can raise visibility.`,
      type: 'opportunity',
    });
  }
  return insights.slice(0, options.top ?? 6);
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export function activityStatistics(
  activities: readonly ActivityItem[],
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  reports: readonly ActivityReport[],
  moderation: readonly ActivityModerationEntry[],
): ActivityStatistics {
  const totalComments = comments.length;
  const totalReplies = comments.reduce((sum, comment) => sum + comment.replies.length, 0);
  const sources = new Set(activities.map((activity) => `${activity.source.entityType}:${activity.source.id}`));
  const actors = new Set(activities.map((activity) => activity.actor.id));
  return {
    totalActivities: activities.length,
    totalTypes: new Set(activities.map((activity) => activity.type)).size,
    totalActors: actors.size,
    totalSources: sources.size,
    totalReactions: activities.reduce((sum, activity) => sum + activity.reactions.length, 0),
    totalComments,
    totalReplies,
    totalReposts: activities.reduce((sum, activity) => sum + activity.repostCount, 0),
    totalBookmarks: activities.reduce((sum, activity) => sum + activity.bookmarkCount, 0),
    totalMentions: activities.reduce((sum, activity) => sum + activity.mentions.length, 0),
    totalHashtags: activities.reduce((sum, activity) => sum + activity.hashtags.length, 0),
    totalAttachments: activities.reduce((sum, activity) => sum + activity.attachments.length, 0),
    totalPinned: activities.filter((activity) => activity.pinned).length,
    totalFeatured: activities.filter((activity) => activity.featured).length,
    totalReports: reports.length,
    totalModerated: moderation.length,
    byType: activitiesByType(activities),
    byVisibility: activitiesByVisibility(activities),
  };
}

export function activityAnalytics(
  activities: readonly ActivityItem[],
  comments: readonly ActivityComment[],
  bookmarks: readonly ActivityBookmark[],
  shares: readonly ActivityShare[],
  profile: ActivityRecommendationProfile,
  options: ActivityFeedOptions = {},
): ActivityAnalytics {
  const totalViews = activities.reduce((sum, activity) => sum + activity.views, 0);
  const totalEngagements = activities.reduce(
    (sum, activity) => sum + engagementScore(activity, comments, bookmarks, shares),
    0,
  );
  const count = activities.length;
  const mostEngaging = [...activities].sort(
    (a, b) => engagementScore(b, comments, bookmarks, shares) - engagementScore(a, comments, bookmarks, shares),
  )[0];
  return {
    totalEngagements,
    totalViews,
    averageEngagementPerActivity: count > 0 ? Math.round((totalEngagements / count) * 10) / 10 : 0,
    averageViewsPerActivity: count > 0 ? Math.round(totalViews / count) : 0,
    engagementRate: totalViews > 0 ? Math.round((totalEngagements / totalViews) * 1000) / 1000 : 0,
    mostEngagingActivityId: mostEngaging?.id ?? '',
    topHashtags: hashtagsForActivities(activities).slice(0, 8),
    topTypes: activitiesByType(activities).slice(0, 5),
    byDay: groupActivitiesByDay(activities),
    byFeedKind: activitiesByFeedKind(activities, profile, options),
  };
}

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export { ACTIVITY_SOURCE_ENTITY_TYPES as ACTIVITY_SOURCES, ACTIVITY_TYPES };
