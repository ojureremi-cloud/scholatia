# Scholatia Unified Scholarly Activity Feed Architecture

## Purpose

The Unified Scholarly Activity Feed is the **platform-wide canonical event
stream** of the Scholatia ecosystem. Every existing and future module emits into
this single typed graph — referenced by canonical ID with **zero duplication** —
and the pure engine derives feeds, trending, recommendations, moderation,
insights, and analytics over it.

It is **not** messaging and **not** the notification engine:

- **Messaging** is the private 1:1 and group conversation layer between
  researchers (`components/messages`, `lib/messages`).
- **Notifications** are the delivery infrastructure every module emits into —
  routing decomposed into channels, templates, deliveries, digests, and
  subscriptions (`components/notifications`, `lib/notifications`).
- The **Activity Feed** is the shared, public-facing event backbone both can
  attach to — the stream of *what happened* across the whole ecosystem.

The engine is **additive by design**. It does **not** own records and does
**not** duplicate any module data:

- Every **activity** references its source record through the canonical
  `sourceId` + `sourceEntity` pattern — a researcher username, a journal id, a
  conference id, an institution id, a grant id, a dataset id, a manuscript id, a
  publisher id, a project id, a commerce order, a service, a marketplace
  listing, an ad campaign, or a subscription. It never duplicates a record owned
  by another module.
- Engagement is recorded in **append-only ledgers** — reactions, comments,
  threaded replies, bookmarks, and shares/reposts — and derived counts
  (`commentCount`, `bookmarkCount`, `repostCount`) are always computed by the
  engine, never hand-maintained.
- The existing per-researcher profile widget (`RecentActivityEntry`,
  `RecentActivityCard`, `buildRecentActivity`) is a complementary view of a
  single researcher's activity and is **kept as-is** — never rebuilt or
  duplicated.

The module reuses the existing design system, page patterns, and the
Researchers, Journals, Conferences, Institutions, Publishers, Funding, Datasets,
Manuscripts, Projects, Discovery, Intelligence, Trust, Advertising, Commerce,
Marketplace, Services, Messaging, Notifications, RBAC, and Authentication
modules. It introduces no new packages, no duplicate records, no APIs, no
database writes, no server actions, and no external model dependency.

## Relationship to the Research Lifecycle

- The Activity Feed is a platform-wide infrastructure layer and does **not** own
  a lifecycle stage. Each activity may carry the canonical
  `ResearchLifecycleStageId` of its source record through `stageId` (a
  publication release lives at `publication`, a manuscript decision at
  `peer-review`, a dataset release at `dataset`, and so on).
- `ResearchLifecycleStageId` from `types/research.ts` is reused; the lifecycle
  engine in `lib/lifecycle.ts` is referenced by type id only and is never
  mutated.
- `DiscoveryEntityType` from `types/discovery.ts` is the base of the
  `ActivitySourceEntityType` vocabulary, extended with the commerce-facing and
  engagement records that are not part of the scholarly index (`order`,
  `service`, `listing`, `campaign`, `subscription`, `review`, `dispute`,
  `milestone`, `grant`, `award`, `announcement`, `group`, `community`).
- Actors reference canonical researcher identities by `username`, never by
  duplicated copies.

## Entity model

Types live in `types/activity.ts`.

| Entity | Description |
|---|---|
| `ActivityType` | The thirty canonical activity types every module emits — publication, citation, dataset, manuscript, conference, journal, publisher, peer-review, funding, grant, project, collaborator, award, institution, education, profile, orcid, verification, trust, advertising, marketplace-product, marketplace-purchase, research-service, service-order, subscription, commerce, recommendation, ai-insight, announcement, security. |
| `ActivityVisibility` | The six visibility levels the viewer-authorization layer checks — public, institution, collaborators, followers, private, restricted. |
| `ActivitySourceEntityType`, `ActivitySource` | The canonical reference back to the source record by ID + entity type + title + URL. Never a copy. |
| `ActivityActor` | The canonical actor identified by username, with name and avatar. |
| `ActivityReaction` | A per-participant emoji reaction on an activity (ledger). |
| `ActivityMention`, `ActivityMentionEntityType` | An `@mention` of a researcher or canonical entity inside an activity. |
| `ActivityAttachment`, `ActivityAttachmentType` | A structured attachment referencing a canonical record (publication, dataset, project, manuscript, grant) or media. |
| `ActivityReply`, `ActivityComment` | Threaded replies and top-level comments with mentions and reactions (ledger). |
| `ActivityBookmark`, `ActivityShare` | Per-user bookmarks and shares/reposts across distribution surfaces (ledger). |
| `ActivityReportStatus`, `ActivityReport`, `ActivityModerationAction`, `ActivityModerationEntry` | The moderation pipeline — user reports and moderator decisions (flagged/hidden/removed/suspended). |
| `ActivityPin` | A per-user pin of an activity. |
| `ActivityItem` | A single canonical activity item. Engagement counts, `trendScore`, and `recommendationScore` are engine-derived fields, never hand-maintained. |
| `ActivityFeedKind`, `ActivityFeed` | The ten derived feed kinds — following, institution, discipline, journal, conference, funding, discovery, recommended, trending, and ai-curated — each a computed feed over the canonical stream. |
| `ActivityTrendingEntry`, `ActivityRecommendation`, `ActivityInsight`, `ActivityRecommendationProfile` | Engine-derived trending slots (72-hour half-life score), scored recommendations with human reasons, and AI insights over the activity graph. |
| `ActivityFilter`, `ActivitySort` | The filter vocabulary (type, visibility, source entity, pinned, featured, moderated) and sort order (recent, trending, recommended, engagement, title). |
| `ActivityTypeStat`, `ActivityVisibilityStat`, `ActivityFeedStat`, `ActivityDayStat`, `ActivityStatistics`, `ActivityAnalytics` | Engine-derived per-type/visibility/feed/day stats, headline statistics, and engagement analytics. |
| `ActivityPortfolio` | The engine's aggregate root: statistics, analytics, activities, comments, bookmarks, shares, reports, moderation, feeds, trending, recommendations, featured, pinned, and insights. |
| Vocabularies | `ACTIVITY_TYPES`, `_TYPE_LABELS`, `_TYPE_ICONS`, `_VISIBILITIES`, `_VISIBILITY_LABELS`, `_VISIBILITY_ICONS`, `_SOURCE_ENTITY_TYPES`, `_FEED_KINDS`, `_FEED_KIND_LABELS`, `_FEED_KIND_ICONS`, `_ATTACHMENT_TYPES`, `_ATTACHMENT_TYPE_LABELS`, `_ATTACHMENT_TYPE_ICONS`, `ACTIVITY_REPORT_REASONS`, `ACTIVITY_MODERATION_ACTIONS`, `ACTIVITY_EMOJIS`. |

## Pure engine

`lib/activity.ts` is a **pure, framework-free module** — no React, no state, no
side effects — with ~70 functions mirroring the conventions of `lib/notifications.ts`:

- **URLs & creation**: `activityId`, `buildActivityUrl`, `activityUrl`,
  `createActivity`.
- **Text**: `extractHashtags` / `extractMentions` (Unicode-aware),
  `hashtagsForActivities`.
- **Engagement ledgers**: `commentsForActivity` / `commentCount` / `replyCount` /
  `repliesForComment` / `addComment` / `addReply`, `bookmarksForActivity` /
  `bookmarkCount` / `toggleBookmark`, `sharesForActivity` / `shareCount` /
  `repostCount`, `engagementScore` / `resolveEngagement`, `addReaction` /
  `removeReaction`.
- **Visibility**: `canViewActivity` / `visibleActivities` /
  `resolveVisibility` driven by an `ActivityViewer` (username, institution,
  follows, collaborators).
- **Trending**: `trendScore` with a 72-hour half-life, `trendingActivities`.
- **Recommendations**: `recommendationScore`, `recommendedActivities`.
- **Feeds**: `followingFeed`, `institutionFeed`, `disciplineFeed`,
  `journalFeed`, `conferenceFeed`, `fundingFeed`, `discoveryFeed`,
  `recommendedFeed`, `trendingFeed`, `aiCuratedFeed`, `feedForKind`,
  `buildFeeds`, `activitiesByFeedKind`.
- **Browse**: `filterActivities`, `sortActivities`, `searchActivities`,
  `groupActivitiesByDay`, `activitiesByType`, `activitiesByVisibility`.
- **Pinning & featuring**: `pinActivity`, `unpinActivity`,
  `pinnedActivitiesForUser`, `featuredActivities`.
- **Moderation**: `reportActivity`, `moderationStatusOf`, `moderationQueue`,
  `shouldModerate`, `applyModeration`, `resolveReport`.
- **Aggregates**: `activityInsights`, `activityStatistics`, `activityAnalytics`.

`lib/index.ts` re-exports the engine explicitly (mirroring `lib/notifications`),
avoiding collisions with the messaging suite (`addReaction`, `removeReaction`,
`extractHashtags`, `extractMentions`, `sortActivities` live in `lib/messages.ts`
and are imported directly from `lib/messages` when needed — never from the
barrel).

## State hook

`hooks/useActivity.ts` (registered in `hooks/index.ts` after `useMessages`) is the
client state layer for the activity centre. It holds `activities`, `comments`,
`bookmarks`, `shares`, `reports`, `moderation`, and `pins` in local state seeded
from the placeholder aggregates and exposes:

- **View state**: `portfolio`, `activities` (filtered/sorted), `allActivities`,
  `visible`, `searchResults`, `activeFeed`, `feeds`, `feedKind`/`setFeedKind`,
  `query`/`setQuery`, `type`/`setType`, `sort`/`setSort`,
  `showPublicOnly`/`togglePublicOnly`, `viewer`.
- **Ledgers**: `comments`, `bookmarks`, `shares`, `reports`, `moderation`,
  `queue`.
- **Actions**: `react`, `unreact`, `toggleBookmarkOn`, `isBookmarked`,
  `repost`, `pin`, `unpin`, `isPinned`, `commentOn`, `replyOn`, `report`,
  `resolveReportById`, `applyModerationDecision`, `post`.
- **Derived**: `featured`, `trending`, `recommendations`, `insights`,
  `hashtags`, `statistics`, `analytics`, `profile`, `buildActivityUrl`,
  `currentUser`, `currentUserName`.

The current user is the canonical `ojuri` (Dr. Adebisi Ojurere) of the
researchers module.

## Component map

All activity components live in `components/activity/` and are re-exported from
`components/activity/index.ts`. They consume the existing UI primitives
(`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`,
`StatisticCard`, `Badge`, `Switch`, `SearchBox`, `Select`) and follow the same
conventions as `components/notifications/*`:

| Component | Purpose |
|---|---|
| `ActivityStatistics` | Headline statistics grid (total activities, contributors, reactions, comments, reposts). |
| `ActivityAnalytics` | Engagement/views analytics with the daily activity curve. |
| `ActivityCard` | The canonical activity item card — actor, type and visibility badges, verb + source link, body, hashtags, mentions, attachments, reaction summary and bar, comments with threaded replies, bookmark/repost/pin actions. |
| `ActivityFeed` | Renders an ordered list of `ActivityCard`s with per-activity action wiring. |
| `ActivityTimeline` | Chronological vertical timeline of activities. |
| `ActivityBrowser` | The interactive activity centre — composer, feed-kind tabs, search, filters, feed, and moderation queue. |
| `ActivityComposer`, `ActivityFeedTabs`, `ActivitySearch`, `ActivityFilters` | Composition controls for posting, switching feeds, searching, and filtering/sorting. |
| `ReactionBar`, `ReactionSummary`, `CommentCard`, `CommentList`, `ReplyCard` | Engagement UI — palette reactions, grouped reaction summary, threaded comments. |
| `BookmarkCard`, `ShareCard`, `MentionCard`, `HashtagCard` | Ledger and graph micro-views. |
| `TrendingActivity`, `FeaturedActivity`, `RecommendedFeed` | The derived discovery surfaces. |
| `ActivityInsights`, `ActivityPortfolioCard`, `ModerationQueue` | AI insights, the aggregate-root summary, and the moderation review queue. |
| `ActivityBadge`, `ActivityVisibilityBadge` | Type and visibility badges. |
| `format.ts` | Formatting helpers (dates, numbers, labels, icons, variants, previews) including `activityHref`. |

## Route

`app/activity/page.tsx` is a **Server Component** following the page convention
in `node_modules/next/dist/docs` (`params`/`searchParams` are promises; a static
page without request-time APIs prerenders). It mirrors `app/notifications/page.tsx`:

- Header with the hub description and cross-module navigation.
- Engine overview (`ActivityStatistics`), derived intelligence (`ActivityAnalytics`).
- Discovery: `TrendingActivity` + `FeaturedActivity`.
- The interactive `ActivityBrowser` centre.
- Recommendations + `ActivityInsights`, trending hashtags, `ActivityTimeline`,
  and the `ActivityPortfolioCard` aggregate root.
- A closing warning that all activity data is illustrative and engine-derived.

## Database schema

`db/schema.sql` is **append-only**. Phase 2.2C appends the activity suite after
the messaging suite:

`activity_feed` (canonical stream with type/verb/actor/source/visibility
checks), `activity_hashtags`, `activity_mentions`, `activity_attachments`,
`activity_reactions`, `activity_comments`, `activity_comment_replies`,
`activity_bookmarks`, `activity_shares`, `activity_pins`, `activity_reports`,
`activity_moderation`, and `activity_featured`. All engagement is recorded in
append-only ledgers; derived counts and feed scores are computed by the engine,
not stored.

## Placeholder data

`constants/placeholder-activity.ts` seeds 31 activities covering all thirty
canonical types, each a **canonical source reference** into the existing
placeholder modules — `ojuri`, `smith`, `jscholar`, `adebayo`, `okonkwo`,
`adesina`, `maria`, `tanaka`, `wang`, `dube`; `JNL-001`, `CONF-001`, `CONF-002`,
`INST-UI-001`, `scholatia-press`; `grant-nrc-2022-113`, `grant-dff-2021-087`;
`multilingual-parsing-framework`, `low-resource-language-toolkit`;
`mpf-multilingual-treebanks`; `MS-2026-0014`; `10.1000/placeholder.2026.0042`;
`ord-2026-0001`; `svc-editing-proofreading-1`, `svc-statistical-analysis-1`;
`sub-ojuri-pro`; `cam-paper-promotion`; `vendor-ibadan-statistics-lab`,
`listing-statistical-analysis` — together with `COMMENTS` (threaded), `BOOKMARKS`,
`SHARES`, `REPORTS`, `MODERATION`, `PINS`, and the derived aggregates
`ACTIVITIES`, `FEATURED_ACTIVITIES`, `TRENDING`, `RECOMMENDATIONS`, `FEEDS`,
`ACTIVITY_STATISTICS`, `ACTIVITY_ANALYTICS`, `INSIGHTS`, `ALL_HASHTAGS`,
`ACTIVITY_PORTFOLIO`, `CURRENT_ACTIVITY_USER`, `FEATURED_ACTIVITY`,
`DEFAULT_ACTIVITY_TYPE`, `DEFAULT_ACTIVITY_VISIBILITY`, `ACTIVITY_EMOJI_PALETTE`,
and the `PINNED_ACTIVITIES` alias.

## Conventions and boundaries

- `sourceId` + `sourceEntity` everywhere — activities reference, never duplicate.
- `CURRENT_USER 'ojuri'`, `CURRENT_DATE '2026-07-31'` / `NOW` conventions.
- `researcherOf()` throws on missing researcher — canonical lookups never return
  partial records.
- Explicit/excluding barrel re-exports; collision surface with
  `lib/messages.ts` (`extractHashtags`/`extractMentions`) is handled by direct
  imports, never the barrel.
- Components never own data and never call the placeholder data or business
  functions themselves — the browser wires the hook, the hook seeds from
  placeholder data.
- No new packages, no APIs, no database writes, no server actions.
