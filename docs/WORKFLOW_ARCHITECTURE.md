# Scholatia Workflow, Task & Review Orchestration Platform (SWTROP) Architecture

## Purpose

SWTROP is the **generic template-driven orchestration layer** of Scholatia: the
workflow engine, the task engine, and the review & approval engine, computed by
pure engines with zero duplication. It is deliberately **not a task manager** —
it is the execution surface that SAES, Thesis Supervision, Journal Editorial,
Conference, Grants, Marketplace, and Services will consume in later phases.
Every thesis, journal submission, conference submission, grant, ethics review,
consultancy, institutional approval, and marketplace delivery is an **instance
of a template**; every actionable unit of work is a **task**; every round of
feedback is a **round-agnostic review cycle** with first-class voice review;
and every decision is an **approval** with an append-only history.

The three engines are **additive by design**:

- **Templates are data, never code.** A template defines stages, roles,
  deadlines, milestones, and transitions; an instance carries state. There are
  12 workflow template kinds and 16 workflow statuses.
- **Workflows reference, never duplicate.** Instances carry `sourceId` +
  `sourceEntity` and optionally `sourceTitle`, and may carry the canonical
  `ResearchLifecycleStageId` from `types/research.ts` on stages and milestones —
  the lifecycle engine is referenced by type id only and never mutated.
- **Reviews are universal and round-agnostic.** A cycle iterates
  `round 1, 2, 3 … n` until it completes. There is **no hard-coded
  "Review 1/2/3" anywhere in the engine**. Voice review is first-class: typed
  comments, voice comments, speech-to-text, optional original-audio retention,
  inline annotations, and voice replies.
- **Approvals are append-only.** Every action records an immutable history
  entry referencing its approval by id.
- **All statistics, analytics, insights, progress, and the portfolio are
  derived** from the typed aggregates by the engines, never hand-maintained.

The module reuses the existing design system and page patterns and the
Researchers, Institutions, Conferences, Journals, Collaboration, Lifecycle,
Discovery, Trust, Messaging, Notifications, Activity, RBAC, and Authentication
modules. It introduces no new packages, no duplicate records, no APIs, no
database writes, no server actions, and no external model dependency.

## Relationship to the Research Lifecycle

- The thesis, dissertation, and undergraduate workflows carry the canonical
  `ResearchLifecycleStageId` (`idea`, `concept-note`, `proposal`, `funding`,
  `project`, `dataset`, `analysis`, `manuscript`, `submission`, `peer-review`,
  `publication`, `conference`, `citation`, `impact`, `knowledge-transfer`) on
  stages and milestones, aligning orchestration with the platform-wide
  lifecycle. `ResearchLifecycleStageId` from `types/research.ts` is reused; the
  lifecycle engine is never mutated.
- Owners, assignees, reviewers, and approvers reference canonical researcher
  identities by `username` (e.g. `ojuri`, `smith`, `adebayo`, `maria`,
  `jscholar`, `tanaka`, `okonkwo`, `dube`, `rivers`, `kim`, `schneider`,
  `adesina`, `das`, `okafor`, `wang`, `mbatha`, `kovacs`, `almeida`,
  `hussain`, `ndlovu`, `gallo`, `yusuf`) — never by duplicated copies.

## Entity model

### Workflows — `types/workflows.ts`

| Entity | Description |
|---|---|
| `WorkflowTemplateKind` | The 12 template kinds — undergraduate-project, masters-dissertation, phd-thesis, journal-submission, conference-submission, book-publishing, grant-proposal, ethics-review, consultancy-project, institutional-approval, marketplace-delivery, service-delivery. |
| `WorkflowStatus` | The 16 workflow statuses — draft, assigned, accepted, in-progress, awaiting-review, revision-requested, revision-submitted, approved, rejected, paused, on-hold, escalated, delegated, archived, cancelled, completed. |
| `WorkflowStageKind` | The 8 stage natures — review, approval, task, milestone, submission, decision, notification, examination. |
| `WorkflowRole` | The 22 platform roles a stage can be assigned to — supervisor, co-supervisor, student, internal-examiner, external-examiner, committee-member, editor, associate-editor, handling-editor, reviewer, editorial-assistant, publisher, conference-chair, scientific-committee, principal-investigator, co-investigator, researcher, grant-officer, client, provider, author, institution-officer. |
| `WorkflowStageStatus` | The 10 stage statuses — not-started, in-progress, awaiting-review, revision-requested, revision-submitted, approved, rejected, skipped, completed, on-hold. |
| `WorkflowStageTemplate` | A stage definition inside a template, with kind, role, optional lifecycle `stageId`, estimated duration, and optionality. |
| `WorkflowTemplate` | A reusable, data-driven workflow definition. **Templates are never code.** |
| `WorkflowStage` | A concrete stage inside a live instance, with status, assignee, and timestamps. |
| `WorkflowTransition`, `WorkflowLogEntry` | Recorded status transitions and the append-only workflow log (27 canonical event types). |
| `WorkflowDeadline`, `WorkflowMilestone` | Deadlines (upcoming/due-soon/overdue/met/extended) with extension state, and milestones (planned/in-progress/achieved/missed) carrying the canonical lifecycle `stageId`. |
| `WorkflowInstance` | The aggregate root of a live workflow — stages, transitions, log, deadlines, milestones, assignees, tags, and source reference. |
| Workbench | `WorkbenchItemType` (14 kinds — note, brainstorm, outline, reference, pdf, dataset, clipping, screenshot, calculation, voice-note, ai-note, draft-section, draft-chapter, temp-file), `WorkbenchItemStatus` (draft/active/archived/promoted), `WorkbenchItem`, `WorkbenchVersion` (immutable snapshots), `Workbench` (the private surface of a researcher). |
| Artefacts | `ScholarlyArtefactType` (11 kinds), `ScholarlyArtefactStatus` (draft/in-progress/under-review/approved/published/archived), `ArtefactSectionStatus` (6 statuses), `ArtefactChapter`, `ArtefactSection`, `ScholarlyArtefact` (chapters + independently reviewable sections with word counts). |
| Derived views | `WorkflowStatistics`, `WorkflowAnalytics`, `WorkflowInsight`, `WorkflowPortfolio`, `WorkflowFilter`, `WorkflowSort`, plus the vocabularies `WORKFLOW_TEMPLATE_KINDS`, `WORKFLOW_STATUSES`, `WORKFLOW_STAGE_KINDS`, `WORKFLOW_ROLES`, `WORKFLOW_STAGE_STATUSES`, `WORKFLOW_*_LABELS`, `WORKFLOW_*_ICONS`, `WORKBENCH_ITEM_*`, `ARTEFACT_*`. |

### Tasks — `types/tasks.ts`

| Entity | Description |
|---|---|
| `TaskPriority`, `TaskStatus` | low/medium/high/urgent and todo/in-progress/blocked/in-review/done. |
| `TaskAssignmentStatus` | assigned/accepted/in-progress/completed/rejected/withdrawn. |
| `TaskHistoryEventType` | The 11 canonical append-only events — created, assigned, unassigned, accepted, status-changed, priority-changed, comment-added, blocked, unblocked, completed, reopened. |
| `Task` | The aggregate root — title, status, priority, assignee, optional `workflowId`, optional `sourceId` + `sourceEntity`, due date, timestamps, progress, assignments, comments, and append-only history. |
| `TaskAssignment`, `TaskComment`, `TaskHistoryEntry` | Assignments, comments, and the append-only audit trail. |
| Derived views | `TaskStatistics`, `TaskAnalytics`, `TaskBoardColumn`, `TaskFilter`, `TaskSort`, and the vocabularies `TASK_STATUSES`, `TASK_PRIORITIES`, `TASK_*_LABELS`, `TASK_*_ICONS`. |

### Reviews & Approvals — `types/reviews.ts`

| Entity | Description |
|---|---|
| `ReviewKind` | The 9 kinds — peer-review, editorial, supervisory, examination, ethics, grant, approval, voice, institutional. |
| `ReviewDecision` | The universal decision vocabulary — approve, reject, minor-revision, major-revision, escalate, delegate, return, withdraw, reopen, close. |
| `ReviewStatus` | draft/invited/accepted/in-progress/submitted/completed/cancelled. |
| `ReviewCommentType`, `VoiceNoteStatus` | general/summary/inline/reply/voice and recorded/transcribed/failed. |
| `ReviewComment`, `ReviewVoiceNote` | Comments (typed, inline, or replies via `parentCommentId`) and voice notes with transcript + optional original audio. |
| `Review` | A single review inside a cycle — kind, status, decision, comments, voice notes, source reference, timestamps. |
| `ReviewCycleStatus`, `ReviewCycle` | open/in-progress/completed/cancelled and the **universal round-agnostic cycle** (unbounded rounds). |
| `ApprovalKind` | The 12 kinds — topic, proposal, chapter, section, milestone, final, ethics, grant, submission, publication, institutional, general approval. |
| `ApprovalAction`, `ApprovalStatus` | The 10 action vocabulary and the 11 status lifecycle (pending through closed). |
| `Approval`, `ApprovalHistoryEntry` | A decision request and its append-only decision history. |
| Derived views | `ReviewStatistics`, `ReviewAnalytics`, `ApprovalStatistics`, and the vocabularies `REVIEW_*`, `APPROVAL_*`. |

## Pure engines

Three **pure, framework-free modules** — no React, no state, no side effects —
mirroring `lib/collaboration.ts`:

### `lib/workflows.ts`

- **IDs & URLs**: `workflowId`, `workflowUrl`, `workflowStageId`,
  `workflowTransitionId`, `workflowLogId`, `workflowDeadlineId`,
  `workflowMilestoneId`, `workbenchId`, `workbenchItemId`, `workbenchVersionId`,
  `artefactId`, `artefactChapterId`, `artefactSectionId`,
  `workflowTemplateId`.
- **Template instantiation**: `createWorkflowFromTemplate` assembles a live
  instance from a template.
- **Transitions**: `WORKFLOW_TRANSITIONS` (the status graph), `canTransition`,
  `transitionWorkflow` (append-only log) plus convenience transitions
  (`activateWorkflow`, `submitWorkflowForReview`, `approveWorkflow`,
  `requestWorkflowRevision`, `submitWorkflowRevision`, `completeWorkflow`).
- **Stages**: `currentStage`, `setStageStatus`, `completedStages`.
- **Progress & deadlines**: `workflowProgress`, `deadlineStatus`,
  `refreshDeadlines`, `addWorkflowDeadline`, `extendWorkflowDeadline`.
- **Milestones**: `addWorkflowMilestone`, `achieveWorkflowMilestone`.
- **Workbench**: `createWorkbenchItem`, `updateWorkbenchItem`,
  `archiveWorkbenchItem`, `promoteWorkbenchItem`.
- **Artefacts**: `createArtefactFromWorkbenchItem`, `addArtefactChapter`,
  `addArtefactSection`, `promoteArtefactToWorkflow`, `artefactWordCount`,
  `chapterProgress`, `setArtefactSectionStatus`, `setArtefactStatus`.
- **Browse & aggregates**: `filterWorkflows`, `searchWorkflows`,
  `sortWorkflows`, `workflowsForUser`, `workflowsAwaiting`,
  `workflowStatistics`, `workflowAnalytics`, `workflowInsights`,
  `buildWorkflowPortfolio`.

### `lib/tasks.ts`

- **IDs**: `taskId`, `taskAssignmentId`, `taskCommentId`, `taskHistoryId`.
- **Lifecycle**: `createTask`, `updateTaskStatus`, `assignTask`,
  `updateAssignmentStatus`, `addTaskComment` (append-only history),
  `taskProgress`.
- **Browse**: `filterTasks`, `searchTasks`, `sortTasks`, `tasksForAssignee`,
  `tasksForWorkflow`, `openTasks`, `overdueTasks`.
- **Aggregates**: `taskStatistics`, `taskAnalytics`, `buildTaskBoard`.

### `lib/reviews.ts`

- **IDs**: `reviewId`, `reviewCycleId`, `reviewCommentId`, `reviewVoiceNoteId`,
  `approvalId`, `approvalHistoryId`.
- **Cycles**: `createReviewCycle`, `advanceReviewCycle`, `completeReviewCycle`,
  `cancelReviewCycle`, `openNextReviewRound` (round is unbounded).
- **Reviews**: `createReview` (returns `{ cycle, review }`),
  `setReviewStatus`, `submitReview`, `addReviewComment`,
  `addReviewVoiceNote` (auto-appends a voice comment).
- **Approvals**: `createApproval`, `applyApprovalAction` plus the convenience
  actions `approveApproval`, `requestApprovalMinorRevision`, and ten more — all
  append to `approval.history`.
- **Aggregates**: `reviewStatistics`, `reviewAnalytics`.

`lib/index.ts` re-exports all three engines explicitly, avoiding the
`createTask` / `openTasks` / `overdueTasks` / `taskId` / `tasksForAssignee` /
`updateTaskStatus` / `taskProgress` collisions with the collaboration suite
(the clashing names remain reachable from `lib/tasks` and `lib/collaboration`
directly).

## State hooks

- `hooks/useWorkflow.ts` (registered in `hooks/index.ts` after `useCollaboration`)
  is the client state layer for the workflow centre: `workflows`, `filtered`,
  `searchResults`, `myWorkflows`, `awaiting`, `statistics`, `analytics`,
  `insights`, `portfolio`, `featured`, `templates`, the query/kind/status/sort
  controls, `workflowById`, `stageOf`, `progressOf`, and the actions
  `createFromTemplate`, `submitForReview`, `requestRevision`,
  `submitRevision`, `approve`, `complete`.
- `hooks/useTasks.ts` exposes `tasks`, `filtered`, `searchResults`, `myTasks`,
  `open`, `overdue`, `statistics`, `analytics`, `board` (derived via
  `buildTaskBoard`), the query/status/priority/sort controls, `taskById`,
  `progressOf`, and the actions `createNewTask`, `changeStatus`, `commentOn`.
- `hooks/useReviews.ts` exposes `cycles`, `approvals`, `statistics`,
  `analytics`, `history`, `activeCycles`, `completedCycles`, `myReviews`,
  `pendingReviews`, `pendingApprovals`, `decidedApprovals`, `cycleById`,
  `reviewById`, `approvalById`, and the actions `openCycle`,
  `submitCycleReview`, `completeCycle`, `openNextRound`, `createNewApproval`,
  `decideApproval`.

The current user is the canonical `ojuri` (Dr. Adebisi Ojurere).

## Component map

All SWTROP components live under `components/workflows/`,
`components/tasks/`, `components/reviews/`, and `components/workbench/`, each
with an `index.ts` barrel, consuming the existing UI primitives (`PageLayout`,
`PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`, `StatisticCard`,
`Badge`, `SearchBox`, `Select`):

| Area | Component | Purpose |
|---|---|---|
| Workflows | `WorkflowBadge`, `WorkflowStatusBadge`, `WorkflowPriorityBadge` | Kind, status, and priority badges. |
| Workflows | `WorkflowCard`, `WorkflowGrid` | The canonical workflow summary card (URL via `workflowUrl`, progress bar, stage counts) and responsive grid. |
| Workflows | `WorkflowBrowser` | The interactive workflow centre — search, kind/status/sort filters, status pills, and grid. |
| Workflows | `WorkflowStatistics`, `WorkflowAnalytics`, `WorkflowInsights` | Headline statistics, analytics, and derived AI insights. |
| Workflows | `WorkflowTimeline`, `WorkflowStages`, `WorkflowMilestones`, `WorkflowDeadlines` | The append-only audit trail, ordered stages with current-stage highlight, milestones, and deadlines. |
| Workflows | `WorkflowPortfolioCard`, `WorkflowTemplateCard`, `WorkflowTemplates` | Aggregate-root and template browsing. |
| Workflows | `WorkflowDetail` | The full instance — header, badges, transition action buttons, stages, deadlines, milestones, audit trail. |
| Tasks | `TaskStatusBadge`, `TaskPriorityBadge` | Status and priority badges. |
| Tasks | `TaskCard`, `TaskBoard`, `TaskBrowser` | The canonical task card, kanban board, and interactive task centre. |
| Tasks | `TaskStatistics`, `TaskAnalytics` | Headline statistics and analytics. |
| Reviews | `ReviewKindBadge`, `ReviewStatusBadge`, `ReviewDecisionBadge`, `ApprovalStatusBadge` | Kind, status, decision, and approval status badges. |
| Reviews | `ReviewCycleCard`, `ReviewBrowser`, `ReviewDetail` | Round-agnostic cycle cards, the review centre, and the full review aggregate (comments, replies, voice notes). |
| Reviews | `VoiceNoteCard` | A recorded voice note with transcript and optional audio retention. |
| Reviews | `ApprovalCard`, `ApprovalHistory` | Approval cards and the append-only decision timeline. |
| Reviews | `ReviewStatistics`, `ReviewAnalytics` | Headline statistics and analytics. |
| Workbench | `WorkbenchItemStatusBadge`, `ArtefactStatusBadge` | Item and artefact status badges. |
| Workbench | `WorkbenchItemCard`, `WorkbenchStatistics` | The private workbench item card and headline statistics. |
| Workbench | `ArtefactViewer` | The artefact aggregate — chapters, section statuses, derived word counts, and per-chapter progress. |
| All | `format.ts` per area | Formatting helpers (dates, numbers, labels, icons, variants) for the whole vocabulary. |

## Routes

- `app/workflows/page.tsx` and `app/workflows/[id]/page.tsx` — the workflow
  centre and the full instance view (dynamic segment `[id]` awaits `params` as a
  promise, per the Next 16.2.11 route convention in
  `node_modules/next/dist/docs`).
- `app/tasks/page.tsx` — the task centre, kanban board, and canonical task.
- `app/reviews/page.tsx` — the review centre, approval history, and canonical
  review.
- `app/workbench/page.tsx` — the private workbench and artefact viewer.

All pages are **Server Components** following the page convention
(`params`/`searchParams` are promises); interactive centres (`WorkflowBrowser`,
`TaskBrowser`, `ReviewBrowser`) are client components wired to their hooks.

## Database schema

`db/schema.sql` is **append-only**. Phase 2.2E appends the SWTROP suite after
the collaboration suite:

`workflow_templates` (templates as data; `stages` JSONB), `workflow_instances`
(aggregate root with kind/status/priority checks and `source_id` +
`source_entity`), `workflow_stages` (kind/status/role checks),
`workflow_transitions` (recorded status transitions), `workflow_logs` (the
append-only workflow audit log with the 27 canonical event types),
`workflow_deadlines` (status checks + extension state), `workflow_milestones`
(canonical lifecycle `stage_id`), `tasks` (status/priority checks and optional
`workflow_id`), `task_assignments`, `task_comments`, `task_history` (the
append-only task audit trail), `review_cycles` (round-agnostic with unbounded
`round`), `reviews` (kind/status/decision checks), `review_comments` (typed /
inline / reply via `parent_comment_id`), `review_voice_notes`,
`approvals` (kind/status checks), `approval_history` (append-only),
`workbench_items`, `workbench_versions`, `scholarly_artefacts`,
`artefact_chapters`, and `artefact_sections`. All derived counts and progress
are computed by the engines, not stored.

## Placeholder data

`constants/placeholder-workflows.ts` seeds 12 `WORKFLOW_TEMPLATES`, 11
`WORKFLOW_INSTANCES` (PhD thesis with all 13 stages through final approval,
internal examination in progress, round-4 revision cycle; masters, journal,
conference, grant, ethics, service, undergraduate, institutional, and
marketplace workflows — all activated through `assigned → accepted →
in-progress` and review-flow instances through submit → request-revision →
submit-revision → approve → complete), the derived `WORKFLOW_STATISTICS`,
`WORKFLOW_ANALYTICS`, `WORKFLOW_INSIGHTS`, `WORKFLOW_PORTFOLIO`,
`FEATURED_WORKFLOWS`, `CURRENT_WORKFLOW_USER`, `DEFAULT_WORKFLOW`,
`DEFAULT_WORKFLOW_TEMPLATE`, `DEFAULT_WORKFLOW_KIND`, the workbench
(`RESEARCH_WORKBENCH_DATA`, `DEFAULT_WORKBENCH`, 14 items with 2 promoted), and
the artefacts (`THESIS_ARTEFACT_DATA`, `MANUSCRIPT_ARTEFACT`, `ARTEFACTS`,
`DEFAULT_ARTEFACT`). Instances reference canonical source records — theses,
`JNL-001`, `CONF-001`, `INST-UI-001`, grants (`nsf` / `nih` / `horizon-europe` /
`wellcome`), the marketplace listing `listing-statistical-analysis`, and the
service order `ord-service-021`.

`constants/placeholder-tasks.ts` seeds 13 tasks derived via the engine
(`createTask` / `updateTaskStatus` / `addTaskComment(...).task`), tied to
workflows by `workflowId`, plus `TASKS`, `TASK_STATISTICS`, `TASK_ANALYTICS`,
`TASK_BOARD`, `MY_TASKS`, `DEFAULT_TASK`, `CURRENT_TASK_USER`.

`constants/placeholder-reviews.ts` seeds 5 review cycles (journal round 2,
conference completed-approved, thesis supervisory round 4 with two voice notes
and a reply, ethics completed-approved, grant open in-progress) and 5 approvals
(proposal approved, chapter pending, ethics approved via a minor-revision
round, publication pending, grant pending), plus `REVIEW_CYCLES`, `APPROVALS`,
`APPROVAL_HISTORY`, `REVIEW_STATISTICS`, `REVIEW_ANALYTICS`,
`DEFAULT_REVIEW`, `DEFAULT_REVIEW_CYCLE`, `DEFAULT_APPROVAL`,
`CURRENT_REVIEW_USER`.

## Conventions and boundaries

- `sourceId` + `sourceEntity` everywhere — workflows, tasks, reviews, and
  approvals reference, never duplicate.
- Templates are data, never code; the engine status graph requires transition
  chaining (`activate` runs `assigned → accepted → in-progress`).
- Review cycles are round-agnostic — no fixed Review 1/2/3 anywhere.
- Engine functions returning `{ task, ... }` / `{ review, ... }` / `{ cycle,
  review }` / `{ approval, ... }` objects are unwrapped with `.task` /
  `.review` / `.cycle` / `.approval` by consumers.
- `CURRENT_USER 'ojuri'` / `NOW '2026-08-01T12:00:00.000Z'` conventions;
  `researcherOf()` throws on missing researcher — canonical lookups never
  return partial records.
- Explicit/excluding barrel re-exports; task names that collide with the
  collaboration suite are reachable from `lib/tasks` directly.
- Components never own data and never call the placeholder data or business
  functions themselves — the browser wires the hook, the hook seeds from
  placeholder data.
- Verification: `npx tsc --noEmit` → `npm run lint` → `npm run build`.
- No new packages, no APIs, no database writes, no server actions.
