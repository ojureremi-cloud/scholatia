# Scholatia Unified Notification Engine Architecture

## Purpose

The Unified Notification Engine is the **canonical event-driven notification
backbone** of the Scholatia ecosystem. It is **not** a messaging module and it is
**not** an activity feed: it is the delivery infrastructure every existing and
future module emits into — a single typed notification graph that later powers
the Activity Feed, Messaging, email notifications, push notifications, mobile
notifications, institution and publisher notifications, enterprise
notifications, AI recommendations, and workflow alerts.

The engine is **additive by design**. It does **not** own records and does
**not** duplicate any module data:

- Every **notification** references its source record through the canonical
  `sourceId` + `sourceEntity` pattern — a researcher username, a journal id, a
  conference id, an institution id, a grant id, a dataset id, a manuscript id, a
  publisher id, a project id, a commerce order, a service, a marketplace
  listing, an ad campaign, or a trust integrity record. It never duplicates a
  record owned by another module.
- Delivery is decomposed into **channels**, **templates**, **deliveries**,
  **digests**, and **subscriptions** so no consuming module re-implements
  routing, digest, or summary logic.
- Notifications, preferences, and subscriptions are keyed to a target identified
  by a canonical platform id (`username`, `userId`, or SAID) and never
  re-created per page or per component.

The module reuses the existing design system, page patterns, and the
Researchers, Journals, Conferences, Institutions, Publishers, Funding, Datasets,
Manuscripts, Projects, Discovery, Intelligence, Trust, Advertising, Commerce,
Marketplace, Services, RBAC, and Authentication modules. It introduces no new
packages, no duplicate records, no APIs, no database writes, no server actions,
and no external model dependency.

## Relationship to the Research Lifecycle

- The Unified Notification Engine is a platform-wide infrastructure layer and
  does **not** own a lifecycle stage. Each notification may carry the canonical
  `ResearchLifecycleStageId` of its source record through `stageId` (funding
  deadlines live at `funding`, manuscript decisions at `peer-review`,
  dataset releases at `dataset`, and so on).
- `ResearchLifecycleStageId` from `types/research.ts` is reused; the lifecycle
  engine in `lib/lifecycle.ts` is referenced by type id only and is never
  mutated.
- `DiscoveryEntityType` from `types/discovery.ts` is the base of the
  `NotificationSourceEntityType` vocabulary, extended with the commerce-facing
  records that are not part of the scholarly index (`order`, `service`,
  `listing`, `campaign`, `subscription`, `review`, `dispute`, `milestone`).
- Targets reference canonical researcher identities by `username` + SAID and
  institution/journal/conference/publisher records by canonical id, never by
  duplicated copies.

## Entity model

Types live in `types/notifications.ts`.

| Entity | Description |
|---|---|
| `NotificationCategory` | The seventeen module categories that map 1:1 to the modules that emit notifications — identity, research, projects, datasets, discovery, intelligence, trust, advertising, commerce, marketplace, services, publishing, publishers, institutions, funding, conferences, journals. |
| `NotificationChannel`, `NotificationPriority`, `NotificationStatus`, `NotificationDigestFrequency` | The delivery channels (in-app, email, push, mobile, desktop, sms, webhook), the priority vocabulary (urgent reserved for time-critical alerts), the lifecycle status of a notification for its target, and the digest cadence. |
| `NotificationSource`, `NotificationTarget`, `NotificationActor`, `NotificationAction` | The canonical reference back to a source record, the recipient identified by canonical platform id, the triggering actor, and an optional call-to-action. |
| `Notification` | A single canonical notification event referencing one source and targeting one recipient, with category, priority, status, channels, optional lifecycle stage, metadata, and timestamps. |
| `NotificationPreference` | Per-category, per-channel delivery preference for one target, with mute state, digest frequency, and quiet hours. |
| `NotificationTemplate` | A reusable notification template bound to a category with default priority and default channels. |
| `NotificationDeliveryStatus`, `NotificationDelivery` | Delivery state of a single notification across one channel (queued, sent, delivered, opened, clicked, failed). |
| `NotificationDigestSummary`, `NotificationDigest` | A consolidated periodic digest with an engine-computed summary by category and priority. |
| `NotificationSubscription` | A standing subscription to events for a specific source record, routed through chosen channels. |
| `NotificationAlert` | A derived time-critical alert surfaced outside the standard list. |
| `NotificationCategoryStat`, `NotificationPriorityStat`, `NotificationStatusStat`, `NotificationChannelStat`, `NotificationStatistics`, `NotificationAnalytics` | Engine-derived per-category/priority/status/channel stats, headline statistics, and delivery analytics. |
| `NotificationPortfolio` | The engine's aggregate root: statistics, analytics, notifications, preferences, templates, channels, deliveries, digests, subscriptions, and alerts. |
| Vocabularies | `NOTIFICATION_CATEGORIES`, `NOTIFICATION_CATEGORY_LABELS`, `NOTIFICATION_CATEGORY_ICONS`, `NOTIFICATION_CHANNELS`, `NOTIFICATION_CHANNEL_LABELS`, `NOTIFICATION_CHANNEL_ICONS`, `NOTIFICATION_PRIORITIES`, `NOTIFICATION_PRIORITY_LABELS`, `NOTIFICATION_STATUSES`, `NOTIFICATION_STATUS_LABELS`, `NOTIFICATION_SOURCE_ENTITY_TYPES`, `NOTIFICATION_EVENT_TYPES`. |

## Component map

All notification components live in `components/notifications/` and are
re-exported from `components/notifications/index.ts`. They consume the existing
UI primitives (`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`,
`Container`, `StatisticCard`, `Badge`, `Switch`, `Timeline`, `SearchBox`,
`Select`) and follow the same conventions as `components/services/*`,
`components/marketplace/*`, `components/ads/*`, and `components/commerce/*`.

| Component | Responsibility |
|---|---|
| `NotificationBadge` | Bell icon with the live unread count. |
| `NotificationStatistics` | Headline engine statistics (notifications, categories, deliveries, active alerts). |
| `NotificationAnalytics` | Delivery, open, click, and failed analytics plus per-channel delivery volume bars. |
| `NotificationSearchPanel` | Controlled search panel — free-text query, category, sort, and unread-only switch wired to the engine filter/sort. |
| `NotificationCategoryTabs` | Controlled category filter chips (All + categories with counts). |
| `NotificationCard` | Single notification card with priority/status badges, source link, relative time, and read/unread/archive/dismiss actions. |
| `NotificationGroupCard` | A category group rendered as a section of notification cards with unread count. |
| `NotificationTimeline` | Notifications rendered in the shared `Timeline` primitive. |
| `NotificationPreferenceCard` | Per-category preference card with per-channel switches and mute control. |
| `NotificationChannelCard` | Delivery volume per channel with share of total delivery volume. |
| `NotificationDeliveryCard` | A single delivery ledger row (channel, status, timestamps, error). |
| `NotificationDigestCard` | A periodic digest with engine-computed summary by category and priority. |
| `NotificationSubscriptionCard` | A standing event subscription with its event and channel chips. |
| `NotificationTemplateCard` | A reusable template with its placeholder body, default priority, and default channels. |
| `NotificationPortfolioCard` | The engine overview: notifications, preferences, templates, channels, deliveries, digests, subscriptions, alerts. |
| `NotificationBrowser` | Client composition owning `useNotifications` once and wiring the search panel, category tabs, result count, and the results grid/list with actions. |
| `NotificationFilterPanel` | Controlled priority/status/channel filter selects plus an archived toggle. |
| `NotificationSettingsCard` | Per-category settings — digest frequency, enabled state, quiet hours summary. |
| `NotificationSummaryCard` | Inbox status distribution (unread/read/archived/dismissed) and delivery success. |
| `NotificationAlert` | Time-critical alert card with acknowledge action. |
| `format` | Shared formatting helpers (`formatDate`, `formatTime`, `formatDateTime`, `formatRelative`, `formatNumber`, `formatPercent`, `formatCategory`, `formatCategoryIcon`, `formatChannel`, `formatChannelIcon`, `formatPriority`, `formatStatus`, `formatFrequency`, `formatEventType`, `notificationUrl`, `priorityVariant`, `statusVariant`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/notifications` | `app/notifications/page.tsx` | Notification statistics, analytics + channel breakdown, active alerts, notification centre (search/filter/sort/inbox actions), inbox status, lifecycle-stage notifications, notifications by category, digests, preferences, templates, subscriptions, delivery log, featured notification/alert/preference/subscription, featured template, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it. Notification detail and target-specific inboxes remain future work;
`buildNotificationUrl` already resolves every source entity type to its
canonical in-app route.

## Delivery & digest flow

```
module event → Notification (single typed event, one target)
             → NotificationDelivery (per channel: queued → sent → delivered → opened → clicked | failed)
             → NotificationDigest (consolidated window by frequency)
             → NotificationAlert (derived time-critical surface)
```

- Every notification references one canonical source record and targets one
  recipient identified by canonical platform id; the engine owns no records.
- Delivery is decomposed per channel and per status so the UI and later
  providers never re-implement routing.
- Digests are computed by the engine over the recency window (`digestCutoff`)
  and summarized by category and priority (`digestSummary`).
- Statistics and analytics are derived by the engine from the notification and
  delivery sets, never hand-maintained.

## Engine utilities

`lib/notifications.ts` provides pure, strongly typed engine helpers so the
placeholder data, the hook, and the page never re-implement notification logic:

- **URLs**: `buildNotificationUrl` resolves every `NotificationSourceEntityType`
  to its canonical in-app route.
- **Construction**: `notificationId`, `createNotification`,
  `publishNotification`.
- **State**: `markRead`, `markUnread`, `archiveNotification`,
  `dismissNotification`, `unreadCount`, `countByStatus`.
- **Grouping**: `groupByCategory`, `groupByPriority`.
- **Targeting**: `targetsNotification`, `notificationsForUser`,
  `notificationsBySource`, `notificationsByChannel`,
  `notificationsByLifecycle`, `notificationsBySourceType`.
- **Search, filtering, ranking**: `searchNotifications`,
  `filterNotifications` (`NotificationFilter`), `sortNotifications`
  (`NotificationSort`: recent, priority, category).
- **Digests & delivery**: `digestCutoff`, `digestNotifications`,
  `shouldDeliver`, `buildEmailDigest`, `buildPushPayload`.
- **Statistics & analytics**: `notificationStatistics`,
  `notificationAnalytics`.

## Hook

`hooks/useNotifications.ts` exposes the notification state: the aggregate
portfolio, query/category/sort/unread-only filtering with `filtered` (via
`filterNotifications` + `sortNotifications`), free-text `searchResults` (via
`searchNotifications`), `grouped` categories (via `groupByCategory`), inbox
`stats`, per-notification `markAsRead`/`markAsUnread`/`dismiss`/`archive`
actions, alert acknowledgement (`acknowledgeAlert` + `activeAlerts`), and the
derived `statistics`, `analytics`, `preferences`, `templates`, `channels`,
`deliveries`, `digests`, `subscriptions`, `lifecycle`, and `alerts` slices.

## Dependency graph

```
Notifications module
  ├── lib/notifications.ts    (pure notification engine — new)
  ├── lib/said.ts             (createSaidIdentifier)
  ├── types/notifications.ts  (notification entity model — new)
  ├── types/research.ts       (ResearchLifecycleStageId)
  ├── types/discovery.ts      (DiscoveryEntityType)
  ├── constants/placeholder-notifications.ts (derived notification data — new)
  ├── constants/placeholder-researchers.ts   (researcher identities)
  ├── components/notifications/* (component library — new)
  ├── components/layout/*     (PageLayout, PageHeader)
  ├── components/ui/*         (Container, Button, SectionTitle, Alert, StatisticCard, Badge, Switch, Timeline, SearchBox, Select)
  ├── hooks/useNotifications.ts (notification state hook — new)
  ├── db/schema.sql           (notification tables — appended)
  └── app/notifications/page.tsx (route — new)
```

The module depends only on existing infrastructure plus its own new files.
Every notification references an existing canonical source record, so no data
is duplicated.

## Placeholder data

`constants/placeholder-notifications.ts` provides:

- **Notifications** (`NOTIFICATIONS`) — derived from `NotificationSeed` records
  that reference canonical source IDs across every one of the seventeen
  categories and across the research lifecycle stages, targeting the canonical
  `ojuri` researcher identity (plus `OTHER_NOTIFICATIONS` for the other targets:
  `smith`, `jscholar`, the University of Ibadan, and JNL-001).
- **Preferences** (`PREFERENCES`) — per-category, per-channel preferences with
  muted advertising/marketplace categories, sms/webhook routing where relevant,
  quiet hours, and daily digests for low-noise categories.
- **Templates** (`TEMPLATES`) — reusable templates across research, journals,
  funding, commerce, trust, advertising, datasets, conferences, and discovery.
- **Subscriptions** (`SUBSCRIPTIONS`) — standing event subscriptions for
  projects, journals, conferences, funding, datasets, services, and orders.
- **Deliveries** (`DELIVERIES`) — derived from the notifications by the engine
  across their channels, spanning every `NotificationDeliveryStatus`.
- **Digests** (`DAILY_DIGEST`, `WEEKLY_DIGEST`, `DIGESTS`) — computed by
  `digestNotifications` over the recency windows for the targets.
- **Alerts** (`ALERTS`) — time-critical alerts across funding, projects,
  commerce, and advertising.
- Derived aggregates: `NOTIFICATION_STATISTICS` (via
  `notificationStatistics`), `NOTIFICATION_ANALYTICS` (via
  `notificationAnalytics`), the aggregate `NOTIFICATION_PORTFOLIO`, curated
  slices (`ALL_NOTIFICATIONS`, `UNREAD_NOTIFICATIONS`, `RECENT_NOTIFICATIONS`,
  `URGENT_NOTIFICATIONS`, `LIFECYCLE_NOTIFICATIONS`), featured picks
  (`FEATURED_NOTIFICATION`, `FEATURED_ALERT`, `FEATURED_DIGEST`,
  `FEATURED_PREFERENCE`, `FEATURED_SUBSCRIPTION`, `FEATURED_TEMPLATE`), and
  defaults (`DEFAULT_NOTIFICATION_PRIORITY`, `DEFAULT_NOTIFICATION_CHANNEL`,
  `NOTIFICATION_DIGEST_FREQUENCIES`).

## Schema

`db/schema.sql` appends the notification tables (`notifications`,
`notification_preferences`, `notification_channels`, `notification_deliveries`,
`notification_templates`, `notification_digests`, `notification_digest_items`,
`notification_subscriptions`, `notification_events`). They reference existing
module identities (`target_username`, `target_user_id`, `target_said`,
`source_id`) as text ids where a record exists, and never duplicate
researchers, journals, conferences, institutions, publishers, funding,
datasets, manuscripts, projects, commerce, services, marketplace, advertising,
or discovery data.

## Future extensions

- The Activity Feed and Messaging phases built on top of the engine — the
  notification graph is their source of truth.
- Live delivery providers for email, push, mobile, desktop, SMS, and webhook
  connecting `NotificationDelivery` states to real rails.
- Target-specific inboxes (`/notifications/{target}`) and notification detail
  views reusing the existing cards.
- Digest scheduling and quiet-hour enforcement through `shouldDeliver` and
  `buildEmailDigest`/`buildPushPayload`.
- Persistence when the platform-wide persistence phase lands; the types in
  `types/notifications.ts` and the schema in `db/schema.sql` are the schema
  seed.
