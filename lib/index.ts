export const formatNumber = (value: number) => value.toLocaleString('en-US');

export * from './auth';
export * from './said';
export * from './institutions';
export * from './conferences';
export * from './journals';
export * from './research';
export * from './lifecycle';
export * from './researchers';
export * from './intelligence';
export * from './ads';
export * from './marketplace';
export { discountPercentOf, invoiceTotal } from './commerce';
export * from './commerce';
export * from './services';
export { toDiscoveryItem, toDiscoveryItems } from './marketplace';
export * from './trust';
export {
  archiveNotification,
  buildEmailDigest,
  buildNotificationUrl,
  buildPushPayload,
  countByStatus,
  createNotification,
  digestCutoff,
  digestNotifications,
  dismissNotification,
  filterNotifications,
  groupByCategory,
  groupByPriority,
  markRead,
  markUnread,
  notificationAnalytics,
  notificationId,
  notificationStatistics,
  notificationsByChannel,
  notificationsByLifecycle,
  notificationsBySource,
  notificationsBySourceType,
  notificationsForUser,
  publishNotification,
  searchNotifications,
  shouldDeliver,
  sortNotifications,
  targetsNotification,
} from './notifications';
export type { NotificationFilter, NotificationSort } from './notifications';
export * from './messages';
export {
  ACTIVITY_SOURCES,
  ACTIVITY_TYPES,
  activityAnalytics,
  activityId,
  activityInsights,
  activityStatistics,
  activityUrl,
  addComment,
  addReaction,
  addReply,
  applyModeration,
  bookmarkCount,
  bookmarksForActivity,
  buildActivityUrl,
  buildFeeds,
  canViewActivity,
  commentCount,
  commentsForActivity,
  createActivity,
  discoveryFeed,
  disciplineFeed,
  engagementScore,
  extractHashtags,
  extractMentions,
  featuredActivities,
  feedForKind,
  filterActivities,
  followingFeed,
  fundingFeed,
  groupActivitiesByDay,
  hashtagsForActivities,
  institutionFeed,
  journalFeed,
  conferenceFeed,
  moderationQueue,
  moderationStatusOf,
  pinActivity,
  pinnedActivitiesForUser,
  recommendationScore,
  recommendedActivities,
  removeReaction,
  replyCount,
  reportActivity,
  resolveEngagement,
  resolveReport,
  resolveVisibility,
  searchActivities,
  shareCount,
  sharesForActivity,
  shouldModerate,
  sortActivities,
  toggleBookmark,
  trendScore,
  trendingActivities,
  unpinActivity,
  visibleActivities,
  activitiesByFeedKind,
  activitiesByType,
  activitiesByVisibility,
} from './activity';
export type { ActivityFeedOptions, ActivityViewer } from './activity';
