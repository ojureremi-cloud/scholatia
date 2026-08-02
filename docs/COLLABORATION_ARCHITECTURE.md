# Scholatia Collaboration Workspace Platform Architecture

## Purpose

The Collaboration Workspace Platform is the **shared, role-governed surface
where research happens together** — research groups, research labs, project
workspaces, institution spaces, conference spaces, journal spaces, and
communities. A workspace is an aggregate of members, tasks, documents,
meetings, milestones, discussions, invitations, and an append-only activity
log, computed by a pure engine with zero duplication.

It is **not** messaging, **not** notifications, and **not** the activity feed:

- **Messaging** is the private 1:1 and group conversation layer between
  researchers (`components/messages`, `lib/messages`).
- **Notifications** are the delivery infrastructure every module emits into —
  routing decomposed into channels, templates, deliveries, digests, and
  subscriptions (`components/notifications`, `lib/notifications`).
- **Activity** is the platform-wide canonical event stream — the stream of
  *what happened* (`components/activity`, `lib/activity`).
- The **Workspace Platform** is the working surface both can attach to — the
  role-governed place a team plans, executes, and publishes from.

The engine is **additive by design**. It does **not** own records and does
**not** duplicate any module data:

- Members reference canonical researchers by `username` — never by duplicated
  copies.
- Milestones carry the canonical `ResearchLifecycleStageId` from
  `types/research.ts`; the lifecycle engine in `lib/lifecycle.ts` is referenced
  by type id only and is never mutated.
- A workspace may reference a canonical source record (a project, an
  institution, a conference, a journal, a publisher, a grant) through
  `sourceId` + `sourceEntity` — it never duplicates a record owned by another
  module.
- All statistics, analytics, insights, progress, and the portfolio are
  **derived** from the typed workspace graph by the engine, never
  hand-maintained.

The module reuses the existing design system, page patterns, and the
Researchers, Institutions, Conferences, Journals, Lifecycle, Discovery,
Trust, Messaging, Notifications, Activity, RBAC, and Authentication modules.
It introduces no new packages, no duplicate records, no APIs, no database
writes, no server actions, and no external model dependency.

## Relationship to the Research Lifecycle

- A workspace does **not** own a lifecycle stage; its **milestones** advance
  the canonical stages. Each milestone may carry the canonical
  `ResearchLifecycleStageId` (`idea`, `concept-note`, `proposal`, `funding`,
  `project`, `dataset`, `analysis`, `manuscript`, `submission`,
  `peer-review`, `publication`, `conference`, `citation`, `impact`,
  `knowledge-transfer`), aligning workspace delivery with the platform-wide
  lifecycle.
- `ResearchLifecycleStageId` from `types/research.ts` is reused; the lifecycle
  engine is referenced by type id only and is never mutated.
- Owners and members reference canonical researcher identities by `username`,
  never by duplicated copies.

## Entity model

Types live in `types/collaboration.ts`.

| Entity | Description |
|---|---|
| `CollaborationWorkspaceKind` | The seven workspace surfaces — research-group, research-lab, project-workspace, institution-space, conference-space, journal-space, community. |
| `CollaborationWorkspaceVisibility` | Who can see the workspace and its content — public, institution, members, private. |
| `CollaborationWorkspaceStatus` | Lifecycle state of the workspace itself — active, archived, paused. |
| `CollaborationMemberRole`, `CollaborationMemberStatus` | The permission levels a member holds (owner, admin, editor, member, viewer) and the membership lifecycle (active, invited, pending, removed). |
| `CollaborationMember` | A researcher member referenced by canonical `username`, with name, avatar, role, status, and `joinedAt`. |
| `CollaborationTaskStatus`, `CollaborationTaskPriority`, `WorkspaceTask` | Assignable tasks — todo / in-progress / in-review / done, low / medium / high / urgent, with assignee references and due dates. |
| `CollaborationDocumentType`, `CollaborationDocumentStatus`, `WorkspaceDocument` | Shared documents — note, protocol, report, dataset, manuscript, reference, guideline; draft / in-review / published, with author, version, and `updatedAt`. |
| `CollaborationMeetingStatus`, `WorkspaceMeeting` | Scheduled meetings — scheduled / completed / cancelled, with agenda and attendee references. |
| `CollaborationMilestoneStatus`, `WorkspaceMilestone` | Milestones aligned to the research lifecycle — planned / in-progress / achieved, carrying an optional canonical `stageId`. |
| `CollaborationDiscussionStatus`, `WorkspaceDiscussion`, `WorkspaceDiscussionReply` | Discussion threads — open / resolved / closed, with threaded replies. |
| `CollaborationInvitationStatus`, `WorkspaceInvitation` | Invitations to join in a given role — pending / accepted / declined / expired. |
| `CollaborationLogEventType`, `WorkspaceLogEntry` | The append-only activity log — created, member-added, member-removed, task-created, task-completed, document-published, milestone-achieved, meeting-scheduled, discussion-opened, invitation-sent. |
| `CollaborationWorkspace` | The aggregate root of a single workspace — the shared surface of a team. Derived counts and progress are engine-computed, never hand-maintained. |
| `CollaborationFilter`, `CollaborationSort` | The filter vocabulary (kind, visibility, status, tagged) and sort order (recent, name, members, tasks, progress). |
| `CollaborationKindStat`, `CollaborationVisibilityStat`, `CollaborationStatusStat`, `CollaborationTaskStatusStat`, `CollaborationTaskPriorityStat`, `CollaborationRoleStat`, `CollaborationDayStat`, `CollaborationStatistics`, `CollaborationAnalytics` | Engine-derived per-kind/visibility/status/task-status/priority/role/day stats, headline statistics, and analytics. |
| `CollaborationInsight` | A derived AI insight over the collaboration graph — trend, cluster, spotlight, summary, opportunity. |
| `CollaborationPortfolio` | The engine's aggregate root: statistics, analytics, workspaces, members, tasks, documents, meetings, milestones, discussions, invitations, log, insights, and featured workspaces. |
| Vocabularies | `COLLABORATION_WORKSPACE_KINDS`, `_KIND_LABELS`, `_KIND_ICONS`, `_VISIBILITIES`, `_VISIBILITY_LABELS`, `_VISIBILITY_ICONS`, `_STATUSES`, `_STATUS_LABELS`, `_STATUS_ICONS`, `_MEMBER_ROLES`, `_MEMBER_ROLE_LABELS`, `_MEMBER_ROLE_ICONS`, `_MEMBER_STATUSES`, `_TASK_STATUSES`, `_TASK_STATUS_LABELS`, `_TASK_STATUS_ICONS`, `_TASK_PRIORITIES`, `_TASK_PRIORITY_LABELS`, `_TASK_PRIORITY_ICONS`, `_DOCUMENT_TYPES`, `_DOCUMENT_TYPE_LABELS`, `_DOCUMENT_TYPE_ICONS`, `_DOCUMENT_STATUSES`, `_DOCUMENT_STATUS_LABELS`, `_DOCUMENT_STATUS_ICONS`, `_MEETING_STATUSES`, `_MEETING_STATUS_LABELS`, `_MEETING_STATUS_ICONS`, `_MILESTONE_STATUSES`, `_MILESTONE_STATUS_LABELS`, `_MILESTONE_STATUS_ICONS`, `_DISCUSSION_STATUSES`, `_DISCUSSION_STATUS_LABELS`, `_DISCUSSION_STATUS_ICONS`, `_INVITATION_STATUSES`, `_INVITATION_STATUS_LABELS`, `_INVITATION_STATUS_ICONS`, `_LOG_EVENT_TYPES`. |

## Pure engine

`lib/collaboration.ts` is a **pure, framework-free module** — no React, no
state, no side effects — mirroring the conventions of `lib/notifications.ts`
and `lib/activity.ts`:

- **IDs & URLs**: `workspaceId`, `taskId`, `documentId`, `meetingId`,
  `milestoneId`, `discussionId`, `invitationId`, `logEntryId`,
  `buildWorkspaceSlug`, `workspaceUrl`, `createWorkspace`.
- **Membership**: `membersOf`, `activeMembers`, `memberCount`, `memberOf`,
  `memberRoleOf`, `addMember`, `removeMember`, `changeMemberRole`.
- **Tasks**: `tasksOf`, `tasksByStatus`, `tasksByPriority`,
  `tasksForAssignee`, `openTasks`, `completedTasks`, `overdueTasks`,
  `createTask`, `updateTaskStatus`, `taskProgress`.
- **Documents**: `documentsOf`, `documentsByType`, `publishedDocuments`.
- **Meetings**: `meetingsOf`, `meetingsByStatus`, `upcomingMeetings`.
- **Milestones**: `milestonesOf`, `milestonesByStatus`, `milestonesByStage`,
  `achievedMilestones`, `milestoneProgress`.
- **Discussions**: `discussionsOf`, `discussionsByStatus`, `openDiscussions`,
  `resolvedDiscussions`, `repliesForDiscussion`, `replyCount`.
- **Invitations**: `invitationsOf`, `invitationsByStatus`, `pendingInvitations`.
- **Activity log**: `eventsForWorkspace`, `eventsByType`.
- **Authorization**: `canViewWorkspace`, `canEditWorkspace`,
  `canManageWorkspace` — the role-governed viewer layer.
- **Browse**: `workspacesForUser`, `workspacesByKind`,
  `workspacesByVisibility`, `filterWorkspaces`, `sortWorkspaces`,
  `searchWorkspaces`.
- **Aggregates**: `collaborationInsights`, `collaborationStatistics`,
  `collaborationAnalytics`, `buildCollaborationPortfolio`.

`lib/index.ts` re-exports the engine explicitly (mirroring `lib/notifications`
and `lib/activity`), avoiding collisions with the messaging and activity suites.

## State hook

`hooks/useCollaboration.ts` (registered in `hooks/index.ts` after `useActivity`)
is the client state layer for the workspace centre. It holds `workspaces` in
local state seeded from the placeholder graph and exposes:

- **View state**: `workspaces`, `visible` (authorized by `canViewWorkspace`),
  `filtered` (filtered + sorted), `searchResults`, `myWorkspaces`,
  `statistics`, `analytics`, `insights`, `featured`, `portfolio`.
- **Controls**: `query`/`setQuery`, `kind`/`setKind`, `visibility`/
  `setVisibility`, `status`/`setStatus`, `sort`/`setSort`.
- **Roles**: `roleOf`, `isMember`, `canEdit`, `canManage`.
- **Actions**: `setTaskStatus`, `addTaskTo`, `inviteMemberTo`,
  `ejectMemberFrom`, `changeRoleOfMember`, `createNewWorkspace`.
- **Identity**: `currentUser`, `currentUserName`.

The current user is the canonical `ojuri` (Dr. Adebisi Ojurere) of the
researchers module.

## Component map

All collaboration components live in `components/collaboration/` and are
re-exported from `components/collaboration/index.ts`. They consume the existing
UI primitives (`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`,
`Container`, `StatisticCard`, `Badge`, `SearchBox`, `Select`) and follow the
same conventions as `components/notifications/*` and `components/activity/*`:

| Component | Purpose |
|---|---|
| `WorkspaceStatistics` | Headline statistics grid (workspaces, members, tasks, documents, meetings). |
| `WorkspaceAnalytics` | Completion rates, overdue tasks, upcoming meetings, priority distribution, and the daily activity curve. |
| `WorkspaceCard` | The canonical workspace summary card — kind/status/visibility badges, description, source reference, tags, member count, task progress bar, and link to the workspace route. |
| `WorkspaceGrid` | Responsive grid of `WorkspaceCard`s with an empty state. |
| `WorkspaceBrowser` | The interactive workspace centre — search, kind/visibility/status filters, sort, member summary, and grid. |
| `WorkspaceDetail` | The full workspace aggregate — header, badges, tags, task + milestone progress, and role-aware tabs. |
| `WorkspaceMembers` | Member list with role badges, canonical `username`, and join dates. |
| `WorkspaceTasks` | Task list with status badges and an editable status select for editors. |
| `WorkspaceDocuments` | Shared document list with type and status badges, version, and author. |
| `WorkspaceMeetings` | Meeting list with status badges, schedule, agenda, and attendees. |
| `WorkspaceMilestones` | Milestone list with status badges and their canonical lifecycle stages. |
| `WorkspaceDiscussions` | Discussion threads with status badges and reply counts. |
| `WorkspaceInvitations` | Invitation list with role and status badges. |
| `WorkspaceTimeline` | Chronological vertical timeline of the append-only workspace log. |
| `WorkspaceInsights`, `WorkspacePortfolioCard` | AI insights and the aggregate-root summary. |
| `WorkspaceBadge`, `WorkspaceStatusBadge`, `WorkspaceVisibilityBadge` | Kind, status, and visibility badges. |
| `format.ts` | Formatting helpers (dates, numbers, labels, icons, variants) for the whole vocabulary. |

## Route

`app/collaboration/page.tsx` is a **Server Component** following the page
convention in `node_modules/next/dist/docs` (`params`/`searchParams` are
promises; a static page without request-time APIs prerenders). It mirrors
`app/activity/page.tsx`:

- Header with the hub description and cross-module navigation to Messages,
  Activity, Notifications, and Collaborators.
- Engine overview (`WorkspaceStatistics`) and derived intelligence
  (`WorkspaceAnalytics`).
- The interactive `WorkspaceBrowser` centre.
- The `WorkspaceDetail` spotlight (the default workspace aggregate).
- Collaboration intelligence (`WorkspaceInsights` + featured workspace
  details), the `WorkspaceTimeline`, and the `WorkspacePortfolioCard`
  aggregate root.
- A closing warning that all workspace data is illustrative and engine-derived.

Note: `app/collaborators/page.tsx` (Phase 0 placeholder, the researcher
directory) is unrelated and distinct from this route.

## Database schema

`db/schema.sql` is **append-only**. Phase 2.2D appends the workspace suite after
the activity suite:

`workspace` (aggregate root with kind/visibility/status checks and the
`source_id` + `source_entity` reference), `workspace_tags`,
`workspace_members` (canonical researcher references by `username`),
`workspace_tasks` (status/priority checks), `workspace_documents`
(type/status checks), `workspace_meetings`, `workspace_meeting_attendees`,
`workspace_milestones` (canonical lifecycle `stage_id`),
`workspace_discussions`, `workspace_discussion_replies`,
`workspace_invitations`, and `workspace_log` (the append-only activity log
with the ten canonical event types). All derived counts and progress are
computed by the engine, not stored.

## Placeholder data

`constants/placeholder-collaboration.ts` seeds eight workspaces covering all
seven workspace kinds, each a **canonical source reference** into the existing
placeholder modules — the West African Health Consortium (research-group,
`INST-UI-001`), the Multilingual Parsing Lab (research-lab), the Climate
Adaptation Project (project-workspace, `grant-dff-2021-087`), University of
Ibadan (institution-space, `INST-UI-001`), ACL 2026 (conference-space,
`CONF-001`), the Journal of Scholarly Open Research (journal-space, `JNL-001`),
the Open Science Community (community), and an archived Tropical Medicine
Archive (research-group, archived). Members resolve canonical researchers by
`username` via the throwing `researcherOf()` helper (`ojuri`, `smith`, `maria`,
`jscholar`, `tanaka`, `okonkwo`, `adesina`, `wang`, `dube`, `adebayo`), and
milestones carry canonical lifecycle stage IDs. The module exports
`WORKSPACES`, the derived `COLLABORATION_STATISTICS`, `COLLABORATION_ANALYTICS`,
`INSIGHTS`, `COLLABORATION_PORTFOLIO`, `FEATURED_WORKSPACES`,
`CURRENT_COLLABORATION_USER`, `DEFAULT_WORKSPACE_KIND`,
`DEFAULT_WORKSPACE_VISIBILITY`, and `DEFAULT_WORKSPACE`.

## Conventions and boundaries

- `sourceId` + `sourceEntity` everywhere — workspaces reference, never
  duplicate.
- Members reference canonical researcher `username`s; milestones carry the
  canonical `ResearchLifecycleStageId`.
- `CURRENT_USER 'ojuri'` / `NOW '2026-08-01T12:00:00.000Z'` conventions;
  `researcherOf()` throws on missing researcher — canonical lookups never
  return partial records.
- Explicit/excluding barrel re-exports; the collaboration engine is imported
  by name from `lib/collaboration`, never via `export *` collisions.
- Components never own data and never call the placeholder data or business
  functions themselves — the browser wires the hook, the hook seeds from
  placeholder data.
- No new packages, no APIs, no database writes, no server actions.
