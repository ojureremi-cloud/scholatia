'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ACTIVITY_STATISTICS,
  ACTIVITY_ANALYTICS,
  ACTIVITY_PORTFOLIO,
  ACTIVITIES,
  ALL_HASHTAGS,
  BOOKMARKS,
  COMMENTS,
  FEATURED_ACTIVITIES,
  FEEDS,
  INSIGHTS,
  MODERATION,
  OJURI_PROFILE,
  PINNED_ACTIVITIES,
  RECOMMENDATIONS,
  REPORTS,
  SHARES,
  TRENDING,
} from '@/constants/placeholder-activity';
import {
  addComment,
  addReaction,
  addReply,
  applyModeration,
  buildActivityUrl,
  canViewActivity,
  createActivity,
  filterActivities,
  moderationQueue,
  pinActivity,
  removeReaction,
  reportActivity,
  resolveReport,
  searchActivities,
  sortActivities,
  toggleBookmark,
  unpinActivity,
} from '@/lib/activity';
import type { ActivityComment, ActivityFeedKind, ActivityFilter, ActivityItem, ActivityMention, ActivityModerationEntry, ActivityReport, ActivitySort, ActivityType } from '@/types/activity';

const CURRENT_USER = 'ojuri';
const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useActivity() {
  const [activities, setActivities] = useState(ACTIVITIES);
  const [comments, setComments] = useState<ActivityComment[]>(COMMENTS);
  const [bookmarks, setBookmarks] = useState(BOOKMARKS);
  const [shares, setShares] = useState(SHARES);
  const [reports, setReports] = useState<ActivityReport[]>(REPORTS);
  const [moderation, setModeration] = useState<ActivityModerationEntry[]>(MODERATION);
  const [pins, setPins] = useState(PINNED_ACTIVITIES);
  const [query, setQuery] = useState('');
  const [feedKind, setFeedKind] = useState<ActivityFeedKind>('following');
  const [type, setType] = useState<'all' | ActivityType>('all');
  const [sort, setSort] = useState<ActivitySort>('recent');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  const viewer = useMemo(
    () => ({
      username: CURRENT_USER,
      institution: 'INST-UI-001',
      follows: ['smith', 'jscholar', 'wang'],
      collaborators: ['smith', 'tanaka', 'adebayo'],
    }),
    [],
  );

  const visible = useMemo(() => activities.filter((activity) => canViewActivity(activity, viewer)), [activities, viewer]);

  const filtered = useMemo(() => {
    const filter: ActivityFilter = { type: type === 'all' ? undefined : type, visibility: showPublicOnly ? 'public' : undefined };
    return sortActivities(filterActivities(visible, filter), sort, comments, bookmarks, shares);
  }, [visible, type, sort, showPublicOnly, comments, bookmarks, shares]);

  const searchResults = useMemo(() => (query.trim() ? searchActivities(visible, query) : []), [query, visible]);

  const activeFeed = useMemo(
    () => FEEDS.find((feed) => feed.kind === feedKind) ?? FEEDS[0],
    [feedKind],
  );

  const queue = useMemo(() => moderationQueue(activities, reports), [activities, reports]);

  const react = useCallback((activityId: string, emoji: string) => {
    setActivities((current) =>
      addReaction(current, activityId, {
        id: `reaction-${Date.now()}`,
        emoji,
        actorId: CURRENT_USER,
        actorName: CURRENT_USER_NAME,
        createdAt: new Date().toISOString(),
      }),
    );
  }, []);

  const unreact = useCallback((activityId: string, emoji: string) => {
    setActivities((current) => removeReaction(current, activityId, CURRENT_USER, emoji));
  }, []);

  const toggleBookmarkOn = useCallback((activity: ActivityItem) => {
    setBookmarks((current) => toggleBookmark(current, activity, { username: CURRENT_USER, name: CURRENT_USER_NAME }));
  }, []);

  const repost = useCallback((activity: ActivityItem) => {
    setShares((current) => [...current, { id: `share-${Date.now()}`, activityId: activity.id, sharedBy: CURRENT_USER, sharedByName: CURRENT_USER_NAME, platform: 'scholatia', sharedAt: new Date().toISOString() }]);
  }, []);

  const pin = useCallback((activityId: string) => setPins((current) => pinActivity(current, activityId, { username: CURRENT_USER, name: CURRENT_USER_NAME })), []);
  const unpin = useCallback((activityId: string) => setPins((current) => unpinActivity(current, activityId, { username: CURRENT_USER })), []);

  const commentOn = useCallback(
    (activityId: string, body: string) => {
      const mentionBody: ActivityMention[] = [];
      setComments((current) =>
        addComment(current, {
          id: `comment-${Date.now()}`,
          activityId,
          author: { id: CURRENT_USER, name: CURRENT_USER_NAME, username: CURRENT_USER },
          body,
          mentions: mentionBody,
        }),
      );
    },
    [],
  );

  const replyOn = useCallback((commentId: string, body: string) => {
    setComments((current) =>
      addReply(current, commentId, {
        id: `reply-${Date.now()}`,
        author: { id: CURRENT_USER, name: CURRENT_USER_NAME, username: CURRENT_USER },
        body,
      }),
    );
  }, []);

  const report = useCallback((activityId: string, reason: string, detail?: string) => {
    setReports((current) =>
      reportActivity(current, {
        id: `report-${Date.now()}`,
        activityId,
        reportedBy: CURRENT_USER,
        reportedByName: CURRENT_USER_NAME,
        reason,
        detail,
      }),
    );
  }, []);

  const resolveReportById = useCallback((reportId: string) => {
    setReports((current) => resolveReport(current, reportId, 'moderator-1'));
  }, []);

  const applyModerationDecision = useCallback((activityId: string, action: ActivityModerationEntry['action'], reason: string) => {
    const entry: ActivityModerationEntry = {
      id: `moderation-${Date.now()}`,
      activityId,
      action,
      moderator: 'moderator-1',
      moderatorName: 'Scholatia Moderation',
      reason,
      createdAt: new Date().toISOString(),
    };
    setModeration((current) => [...current, entry]);
    setActivities((current) => applyModeration(current, entry));
  }, []);

  const post = useCallback(
    (body: string) => {
      const now = new Date().toISOString();
      const created = createActivity({
        id: `act-${Date.now()}`,
        type: 'profile',
        verb: 'posted',
        actor: { id: CURRENT_USER, name: CURRENT_USER_NAME, username: CURRENT_USER },
        title: body.slice(0, 60),
        body,
        source: { id: CURRENT_USER, entityType: 'researcher', title: CURRENT_USER_NAME, url: `/researchers/${CURRENT_USER}` },
        hashtags: [],
        mentions: [],
        views: 0,
        createdAt: now,
      });
      setActivities((current) => [created, ...current]);
    },
    [],
  );

  const pinnedActivityIds = useMemo(() => new Set(pins.map((entry) => entry.activityId)), [pins]);
  const isPinned = useCallback((activityId: string) => pinnedActivityIds.has(activityId), [pinnedActivityIds]);
  const isBookmarked = useCallback(
    (activityId: string) => bookmarks.some((entry) => entry.activityId === activityId && entry.bookmarkedBy === CURRENT_USER),
    [bookmarks],
  );

  return useMemo(
    () => ({
      portfolio: ACTIVITY_PORTFOLIO,
      activities: filtered,
      allActivities: activities,
      visible,
      searchResults,
      activeFeed,
      feeds: FEEDS,
      feedKind,
      setFeedKind,
      query,
      setQuery,
      type,
      setType,
      sort,
      setSort,
      showPublicOnly,
      togglePublicOnly: () => setShowPublicOnly((current) => !current),
      viewer,
      comments,
      bookmarks,
      shares,
      reports,
      moderation,
      queue,
      react,
      unreact,
      toggleBookmarkOn,
      isBookmarked,
      repost,
      pin,
      unpin,
      isPinned,
      commentOn,
      replyOn,
      report,
      resolveReportById,
      applyModerationDecision,
      post,
      featured: FEATURED_ACTIVITIES,
      trending: TRENDING,
      recommendations: RECOMMENDATIONS,
      insights: INSIGHTS,
      hashtags: ALL_HASHTAGS,
      statistics: ACTIVITY_STATISTICS,
      analytics: ACTIVITY_ANALYTICS,
      profile: OJURI_PROFILE,
      buildActivityUrl,
      currentUser: CURRENT_USER,
      currentUserName: CURRENT_USER_NAME,
    }),
    [
      filtered,
      activities,
      visible,
      searchResults,
      activeFeed,
      feedKind,
      query,
      type,
      sort,
      showPublicOnly,
      viewer,
      comments,
      bookmarks,
      shares,
      reports,
      moderation,
      queue,
      react,
      unreact,
      toggleBookmarkOn,
      isBookmarked,
      repost,
      pin,
      unpin,
      isPinned,
      commentOn,
      replyOn,
      report,
      resolveReportById,
      applyModerationDecision,
      post,
    ],
  );
}
