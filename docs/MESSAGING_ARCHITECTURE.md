# Scholatia Messaging Platform Architecture

## Purpose

The Scholatia Messaging Platform (Phase 2.2B) is the **canonical scholarly
messaging layer** of the Scholatia ecosystem. It is a full conversational
platform — direct messages, group, institution, publisher, conference, journal,
project, grant, marketplace, service, and support conversations — that
**supersedes** the legacy lightweight `MarketplaceMessage`/`MarketplaceConversation`
model inside the Marketplace module. Every conversation and message below
references canonical records by ID, and the platform becomes the single source
of truth that the Activity Feed, AI assistants, and notification orchestration
later build on.

The platform is **additive by design**. It does **not** own records and does
**not** duplicate any module data:

- Every **conversation** carries a structured `context` — the canonical source
  entity (a researcher, journal, conference, institution, publisher, project,
  grant/`funding`, order, service, listing, or group) and its canonical id —
  and every **member** is a canonical researcher username or module id. It
  never duplicates a record owned by another module.
- Delivery is decomposed into per-recipient **statuses** and **read receipts**
  so no consuming module re-implements read tracking.
- Messages carry structured **attachments**, **mentions**, **reactions**,
  **hashtags**, **pins**, **stars**, edits, and deletions, and the engine
  derives **summaries**, **action items**, **meeting notes**, **reply
  suggestions**, and **collaboration opportunities** from this structure — so
  future AI assistants need no database schema changes.

The module reuses the existing design system, page patterns, and the Identity,
Trust, Research, Publications, Journals, Conferences, Funding, Marketplace,
Services, Commerce, Advertising, Discovery, Intelligence, Institutions, and
Knowledge Graph modules. It introduces no new packages, no duplicate records, no
APIs, no database writes, no server actions, and no external model dependency.

## Relationship to the Research Lifecycle

- The Messaging Platform is a platform-wide communication layer and does **not**
  own a lifecycle stage. Each conversation context may carry the canonical
  `ResearchLifecycleStageId` of its source record through `stageId` (manuscript
  discussions live at `manuscript`, journal correspondence at `peer-review`,
  conference logistics at `conference`, grant reporting at `funding`, and so
  on).
- `ResearchLifecycleStageId` from `types/research.ts` is reused; the lifecycle
  engine in `lib/lifecycle.ts` is referenced by type id only and is never
  mutated.
- `DiscoveryEntityType` from `types/discovery.ts` is the base of the
  `ConversationEntityType` vocabulary, extended with the commerce-facing and
  community records that are not part of the scholarly index (`order`,
  `service`, `listing`, `campaign`, `subscription`, `review`, `dispute`,
  `milestone`, `group`, `community`, `conversation`).
- Members reference canonical researcher identities by `username` and
  institution/journal/conference/publisher/order/service records by canonical
  id, never by duplicated copies.

## Entity model

Types live in `types/messages.ts`.

| Entity | Description |
|---|---|
| `ConversationType` | The eleven conversation kinds that map 1:1 to the Scholatia modules they serve — direct, group, institution, publisher, conference, journal, project, grant, marketplace, service, support. |
| `ConversationStatus`, `ConversationRole`, `ConversationPermission` | The lifecycle status for a member, the member role vocabulary (owner/admin/moderator/member/guest), and the granular permissions a role grants. |
| `ConversationEntityType` | `DiscoveryEntityType` plus the commerce-facing and community records (`order`, `service`, `listing`, `campaign`, `subscription`, `review`, `dispute`, `milestone`, `group`, `community`, `conversation`). |
| `MessageContext` | Canonical reference to the record a conversation is about — entity type, canonical id, optional title/url and lifecycle stage. |
| `ConversationMember`, `ConversationSettings`, `ConversationTopic` | A participant identified by canonical platform id with role + permissions, the granular delivery/notification settings, and a standing topic/tag a conversation can subscribe to. |
| `Conversation` | A single conversation of any kind with members, topics, settings, status, pinned message ids, last-message preview, and timestamps. |
| `MessageStatus`, `MessageType` | The delivery/lifecycle state of a message for its sender (queued → sent → delivered → read | failed) and the message kinds (text, rich-text, image, document, voice-note, video-call, system). |
| `MessageAttachmentType`, `MessageAttachment` | The attachment kinds referencing canonical records (publication, dataset, project, manuscript, grant, conference, journal, publisher, institution, order, service, listing) or file blobs (image, document, voice-note, video-call, file). |
| `MessageReaction`, `MessageMention`, `ReadReceipt` | A reaction by one participant, a mention of a participant or entity, and a per-recipient read receipt. |
| `Message` | A single message carrying attachments, reactions, mentions, hashtags, status, reply/read/edit/delete/pin/star state, and an AI-ready structured `metadata` signal space. |
| `TypingIndicator` | A live, transient typing indicator. |
| `StarredMessage`, `MessagePin`, `MessageArchive`, `MessageMute` | Per-user star, per-conversation pin, and per-user archive/mute state. |
| `ActionItem`, `ConversationSummary` | Engine-derived action items and the per-conversation AI summary (topics, action items, open questions, meeting notes, collaboration opportunities, suggested reply). |
| `ConversationTypeStat`, `MessageTypeStat`, `MessageStatusStat`, `MessageStatistics`, `MessageAnalytics` | Engine-derived per-type stats, headline statistics, and engagement analytics. |
| `MessagePortfolio` | The platform's aggregate root: statistics, analytics, conversations, messages, starred, pinned, archives, mutes, and typing. |
| Vocabularies | `CONVERSATION_TYPES`, `CONVERSATION_TYPE_LABELS`, `CONVERSATION_TYPE_ICONS`, `CONVERSATION_STATUSES`, `CONVERSATION_STATUS_LABELS`, `CONVERSATION_ROLES`, `CONVERSATION_ROLE_LABELS`, `CONVERSATION_PERMISSIONS`, `CONVERSATION_PERMISSION_LABELS`, `MESSAGE_STATUSES`, `MESSAGE_STATUS_LABELS`, `MESSAGE_TYPES`, `MESSAGE_TYPE_LABELS`, `MESSAGE_TYPE_ICONS`, `MESSAGE_ATTACHMENT_TYPES`, `MESSAGE_ATTACHMENT_TYPE_LABELS`, `MESSAGE_ATTACHMENT_TYPE_ICONS`, `MESSAGE_EMOJIS`. |

## Component map

All messaging components live in `components/messages/` and are re-exported from
`components/messages/index.ts`. They consume the existing UI primitives
(`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`,
`StatisticCard`, `Badge`, `Switch`, `SearchBox`, `Select`) and follow the same
conventions as `components/notifications/*`, `components/services/*`,
`components/marketplace/*`, and `components/commerce/*`.

| Component | Responsibility |
|---|---|
| `ConversationBadge` | Small conversation-type badge for the eleven kinds. |
| `MessageBadge` | Message type + status badges. |
| `MessageStatistics` | Headline engine statistics (conversations, messages, participants, attachments, reactions, pins, stars, archives, mutes). |
| `MessageAnalytics` | Engagement analytics (messages per day, reply/edit rate, reactions, busiest threads, attachment kinds). |
| `ConversationCard` | A single conversation in the inbox list — type/status badges, unread count, preview, participants, relative time. |
| `ConversationList` | The inbox conversation list wired to selection. |
| `ConversationSearchPanel` | Controlled search/filter/sort panel — free-text query, type select, sort select, unread-only switch. |
| `ConversationTypeTabs` | Controlled type filter chips (All + the eleven types with counts). |
| `MessageSearchResults` | Free-text message search results across all conversations. |
| `MessageBubble` | A single message bubble — sender, attachments, mentions, hashtags, reactions, delivery ticks, edit/delete/pin/star state, read receipts, hover actions. |
| `AttachmentList` | Structured attachment chips inside a message. |
| `ReactionBar` | Grouped reactions with add/remove for the current user. |
| `TypingIndicator` | Animated typing dots for live typing participants. |
| `ReadReceipts` | Read-receipt display for a message. |
| `MessageComposer` | Textarea + send with AI-suggested reply insertion and permission gating. |
| `MessageThread` | The active conversation pane — date-grouped messages, typing, and composer. |
| `MessageTimeline` | Messages grouped by date (reused by search results and the page). |
| `ConversationSummaryCard` | The engine-derived AI summary — topics, action items, open questions, suggested reply. |
| `ActionItemList` | Engine-extracted action items with owner/due annotations. |
| `StarredMessages` | Per-user starred messages with unstar action. |
| `PinnedMessages` | Per-conversation pinned messages with unpin action. |
| `MessagePortfolioCard` | The aggregate overview — conversation counts per type with unread, live typing, headline totals. |
| `ConversationBrowser` | Client composition owning `useMessages` once and wiring the search panel, type tabs, conversation list, and the active message thread with send/react/star/pin/delete actions. |
| `format` | Shared formatting helpers (`formatDate`, `formatTime`, `formatDateTime`, `formatRelative`, `formatNumber`, `formatPercent`, `formatDuration`, `formatConversationType`, `formatConversationTypeIcon`, `formatConversationStatus`, `formatRole`, `formatMessageType`, `formatMessageTypeIcon`, `formatMessageStatus`, `formatAttachmentType`, `formatAttachmentTypeIcon`, `conversationLink`, `messagePreview`, `typeVariant`, `statusVariant`, `messageStatusVariant`, `deliveryTicks`, `initialsOf`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/messages` | `app/messages/page.tsx` | Messaging statistics, analytics, conversations (search/filter/sort + two-pane thread with send/react/star/pin/delete), featured conversation summary + platform action items, pinned & starred messages, conversation portfolio, conversation-type coverage, archives & mutes, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it. Conversation detail, archives, and starred views remain future work;
`conversationUrl` already resolves every context entity type to its canonical
in-app route.

## Conversation flow

```
canonical record (researcher/journal/conference/…/order/service)
   → Conversation (context = canonical id, members by canonical id)
   → Message (sender, type, body, attachments, mentions, hashtags)
   → statuses + read receipts (delivered → read per recipient)
   → pins / stars / archives / mutes / typing (per conversation or per user)
   → derived insights (summary, action items, meeting notes, suggested reply)
```

- Every conversation references one canonical source record and its members are
  canonical platform ids; the platform owns no records.
- Delivery is decomposed per recipient into status and read receipts so the UI
  and later providers never re-implement read tracking.
- AI-ready insights are derived by the engine from the typed graph
  (`summarizeConversation`, `extractActionItems`, `extractMeetingNotes`,
  `collaborationOpportunities`, `suggestReply`) — no schema change is needed.
- Statistics and analytics are derived by the engine from the conversation and
  message sets, never hand-maintained.

## Engine utilities

`lib/messages.ts` provides pure, strongly typed engine helpers so the
placeholder data, the hook, and the page never re-implement messaging logic:

- **IDs & URLs**: `conversationId`, `messageId`, `buildConversationUrl`,
  `conversationUrl`.
- **Permissions**: `defaultPermissionsForRole`, `hasPermission`,
  `canUserSend` (archived/muted aware).
- **Construction**: `createConversation` (merges default settings + role
  permissions), `createMessage`, `sendMessage`.
- **Queries**: `messagesForConversation`, `conversationsForUser`,
  `findConversationBetween`, `unreadMessageCount`, `unreadConversationIds`,
  `messageStatusForUser`.
- **State**: `markDelivered`, `markRead`, `editMessage`, `deleteMessage`,
  `addReaction`, `removeReaction`, `pinMessage`, `unpinMessage`, `toggleStar`,
  `archiveConversation`, `unarchiveConversation`, `muteConversation`,
  `unmuteConversation`.
- **Mentions & hashtags**: `extractHashtags`, `extractMentions`,
  `hashtagsForConversation`.
- **Search, filtering, ranking**: `searchMessages`, `filterConversations`
  (`ConversationFilter`), `sortConversations` (`ConversationSort`: recent,
  unread, alphabetical, type), `groupConversationsByType`, `messagesByDate`.
- **Typing**: `isTyping`, `typingForConversation`.
- **AI-ready insights**: `extractActionItems`, `extractMeetingNotes`,
  `collaborationOpportunities`, `suggestReply`, `summarizeConversation`.
- **Statistics & analytics**: `messageStatistics`, `messageAnalytics`,
  `attachmentCount`.
- Re-exports: `MESSAGING_EMOJIS`, `MESSAGING_TYPES`, `CONVERSATION_ROLES`.

## Hook

`hooks/useMessages.ts` exposes the messaging state: the aggregate portfolio,
query/type/sort/unread-only filtering with `conversations` (via
`filterConversations` + `sortConversations`), free-text `searchResults` (via
`searchMessages`), the `activeConversation` + `activeMessages` + `activeTyping`
thread slice, inbox `stats`, per-message `reactToMessage`/`unreact`/
`editMessageById`/`deleteMessageById`/`pinMessageById`/`unpinMessageById`/
`toggleStarOnMessage` actions, per-conversation `archive`/`unarchive`/`mute`/
`unmute` actions, `openConversation` (auto-mark-read), `send` (append +
advance preview), `canSend`/`isArchived`/`isMuted` predicates, and the derived
`statistics`, `analytics`, `summaries`, `featuredSummary`, `actionItems`,
`starred`, `pinned`, `archives`, `mutes`, and `typing` slices.

## Dependency graph

```
Messaging Platform module
  ├── lib/messages.ts      (pure messaging engine — new)
  ├── types/messages.ts    (messaging entity model — new)
  ├── types/research.ts    (ResearchLifecycleStageId)
  ├── types/discovery.ts   (DiscoveryEntityType)
  ├── constants/placeholder-messages.ts (derived messaging data — new)
  ├── constants/placeholder-researchers.ts (researcher identities)
  ├── constants/placeholder-marketplace.ts (legacy lightweight model — referenced, not duplicated)
  ├── constants/placeholder-commerce.ts   (canonical orders)
  ├── constants/placeholder-services.ts   (canonical services)
  ├── components/messages/* (component library — new)
  ├── components/layout/*  (PageLayout, PageHeader)
  ├── components/ui/*      (Container, Button, SectionTitle, Alert, StatisticCard, Badge, Switch, SearchBox, Select)
  ├── hooks/useMessages.ts (messaging state hook — new)
  ├── db/schema.sql        (message tables — appended)
  └── app/messages/page.tsx (route — new)
```

The module depends only on existing infrastructure plus its own new files.
Every conversation references an existing canonical source record, so no data
is duplicated.

## Placeholder data

`constants/placeholder-messages.ts` provides:

- **Conversations** (`CONVERSATIONS`) — one per conversation kind across all
  eleven types, each referencing a canonical record: the direct line with
  `smith` around manuscript `MS-2026-0014`, the West Africa health-data group,
  the University of Ibadan (`INST-UI-001`) faculty reporting channel, Scholatia
  Press (`scholatia-press`), SIRI 2026 (`CONF-001`), SJOR (`JNL-001`), the
  `multilingual-parsing-framework` project, the `grant-nrc-2022-113` funding
  report, order `ord-2026-0001`, service `svc-editing-proofreading-1`, and the
  Scholatia Support channel.
- **Messages** (`MESSAGES`) — chronological per-conversation messages spanning
  every `MessageType` (text, rich-text, image, document, voice-note,
  video-call), every `MessageStatus`, structured attachments of every kind,
  reactions, mentions, hashtags, reply chains, read receipts, edits, and
  deletions.
- **Pins & stars** — `PINNED_MESSAGES` and `STARRED_MESSAGES` derived from the
  message graph (and reflected back into `conversation.pinnedMessageIds`).
- **State** — `ARCHIVES`, `MUTES`, and live `TYPING` indicators.
- Derived aggregates: `ALL_MESSAGES`, `UNREAD_CONVERSATION_IDS`,
  `UNREAD_MESSAGES`, `MESSAGING_STATISTICS` (via `messageStatistics`),
  `MESSAGING_ANALYTICS` (via `messageAnalytics`), the aggregate
  `MESSAGING_PORTFOLIO`, `MESSAGE_SUMMARIES` (via `summarizeConversation`),
  `DIRECT_CONVERSATION`, `FEATURED_CONVERSATION`, `FEATURED_MESSAGE`,
  `FEATURED_SUMMARY`, `FEATURED_ACTION_ITEMS`, `FEATURED_HASHTAGS`,
  `ALL_ACTION_ITEMS`, and defaults (`DEFAULT_MESSAGE_STATUS`,
  `FEATURED_MESSAGE_TYPE`, `FEATURED_LIFECYCLE_STAGE`).

## Schema

`db/schema.sql` appends the message tables (`message_conversations`,
`message_participants`, `messages`, `message_attachments`, `message_reactions`,
`message_mentions`, `message_reads`, `message_pins`, `message_archives`,
`message_settings`). They reference existing module identities
(`context_id`, `user_id`, `username`, `entity_id`, `sender_id`) as text ids
where a record exists, and never duplicate researchers, journals, conferences,
institutions, publishers, funding, datasets, manuscripts, projects, commerce,
services, marketplace, advertising, or discovery data.

## Future extensions

- The Activity Feed phase builds directly on this graph — conversations and
  messages are its source of truth.
- Notification orchestration connects message state transitions (new message,
  mention, reaction, pin, archive, mute) to the Unified Notification Engine.
- Realtime delivery (WebSocket presence, typing, and delivery), push, email,
  and mobile rails reusing the decomposed status + read-receipt model.
- AI assistants consume the derived summaries, action items, meeting notes, and
  reply suggestions with no schema change.
- Persistence when the platform-wide persistence phase lands; the types in
  `types/messages.ts` and the schema in `db/schema.sql` are the schema seed.
