import type {
  CollaborationAnalytics,
  CollaborationFilter,
  CollaborationInsight,
  CollaborationLogEventType,
  CollaborationMember,
  CollaborationMemberRole,
  CollaborationPortfolio,
  CollaborationSort,
  CollaborationStatistics,
  CollaborationTaskPriority,
  CollaborationTaskStatus,
  CollaborationWorkspace,
  CollaborationWorkspaceKind,
  CollaborationWorkspaceVisibility,
  WorkspaceDiscussion,
  WorkspaceDocument,
  WorkspaceInvitation,
  WorkspaceLogEntry,
  WorkspaceMeeting,
  WorkspaceMilestone,
  WorkspaceTask,
} from '@/types/collaboration';
import {
  COLLABORATION_DOCUMENT_TYPES,
  COLLABORATION_INVITATION_STATUSES,
  COLLABORATION_LOG_EVENT_TYPES,
  COLLABORATION_MEMBER_ROLES,
  COLLABORATION_MEMBER_STATUSES,
  COLLABORATION_MILESTONE_STATUSES,
  COLLABORATION_TASK_PRIORITIES,
  COLLABORATION_TASK_STATUSES,
  COLLABORATION_WORKSPACE_KINDS,
  COLLABORATION_WORKSPACE_STATUSES,
  COLLABORATION_WORKSPACE_VISIBILITIES,
} from '@/types/collaboration';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Collaboration Workspace Platform (Phase 2.2D).
 *
 * The pure collaboration workspace engine — no React, no side effects, no API
 * calls — deliberately API-shaped so every helper can be exported directly as
 * an endpoint in later phases (Mobile API, Enterprise API). It owns no external
 * records: members reference canonical researchers by `username`, milestones
 * carry the canonical `ResearchLifecycleStageId`, and a workspace may reference
 * a canonical source record (project, institution, conference, journal) through
 * `sourceId` + `sourceEntity`. All statistics and analytics are derived from
 * the typed graph, so no schema change is ever needed for new consuming
 * modules.
 */

// ---------------------------------------------------------------------------
// IDs & URLs
// ---------------------------------------------------------------------------

function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Canonical workspace id prefix. */
export function workspaceId(label: string): string {
  return `ws-${slugOf(label)}`;
}

/** Canonical workspace slug. */
export function buildWorkspaceSlug(label: string): string {
  return slugOf(label);
}

/** Canonical task id prefix. */
export function taskId(label: string): string {
  return `task-${slugOf(label)}`;
}

/** Canonical document id prefix. */
export function documentId(label: string): string {
  return `doc-${slugOf(label)}`;
}

/** Canonical meeting id prefix. */
export function meetingId(label: string): string {
  return `meet-${slugOf(label)}`;
}

/** Canonical milestone id prefix. */
export function milestoneId(label: string): string {
  return `ms-${slugOf(label)}`;
}

/** Canonical discussion id prefix. */
export function discussionId(label: string): string {
  return `disc-${slugOf(label)}`;
}

/** Canonical invitation id prefix. */
export function invitationId(label: string): string {
  return `inv-${slugOf(label)}`;
}

/** Canonical log entry id prefix. */
export function logEntryId(label: string): string {
  return `log-${slugOf(label)}`;
}

/** Canonical route to a workspace. */
export function workspaceUrl(workspace: CollaborationWorkspace): string {
  return `/collaboration/${workspace.slug}`;
}

/** Create a workspace from a partial input, filling canonical defaults. */
export function createWorkspace(input: {
  id: string;
  name: string;
  kind: CollaborationWorkspaceKind;
  description?: string;
  visibility?: CollaborationWorkspaceVisibility;
  status?: CollaborationWorkspace['status'];
  owner: string;
  ownerName?: string;
  sourceId?: string;
  sourceEntity?: CollaborationWorkspace['sourceEntity'];
  sourceTitle?: string;
  tags?: string[];
  members?: CollaborationMember[];
  createdAt?: string;
}): CollaborationWorkspace {
  return {
    id: input.id,
    slug: buildWorkspaceSlug(input.name),
    name: input.name,
    kind: input.kind,
    description: input.description ?? '',
    visibility: input.visibility ?? 'members',
    status: input.status ?? 'active',
    owner: input.owner,
    ownerName: input.ownerName,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    sourceTitle: input.sourceTitle,
    tags: input.tags ?? [],
    members: input.members ?? [],
    tasks: [],
    documents: [],
    meetings: [],
    milestones: [],
    discussions: [],
    invitations: [],
    log: [],
    createdAt: input.createdAt ?? new Date().toISOString(),
    updatedAt: input.createdAt ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

export function membersOf(workspace: CollaborationWorkspace): CollaborationMember[] {
  return workspace.members;
}

export function activeMembers(workspace: CollaborationWorkspace): CollaborationMember[] {
  return workspace.members.filter((member) => member.status === 'active');
}

export function memberCount(workspace: CollaborationWorkspace): number {
  return workspace.members.length;
}

export function memberOf(workspace: CollaborationWorkspace, username: string): CollaborationMember | undefined {
  return workspace.members.find((member) => member.username === username);
}

export function memberRoleOf(workspace: CollaborationWorkspace, username: string): CollaborationMemberRole | undefined {
  return memberOf(workspace, username)?.role;
}

/** Append a member (pure). */
export function addMember(
  workspace: CollaborationWorkspace,
  input: {
    username: string;
    name: string;
    avatar?: string;
    role?: CollaborationMemberRole;
    status?: CollaborationMember['status'];
    joinedAt?: string;
  },
): CollaborationWorkspace {
  return {
    ...workspace,
    members: [
      ...workspace.members,
      {
        username: input.username,
        name: input.name,
        avatar: input.avatar,
        role: input.role ?? 'member',
        status: input.status ?? 'active',
        joinedAt: input.joinedAt ?? new Date().toISOString(),
      },
    ],
  };
}

/** Remove a member (pure). */
export function removeMember(workspace: CollaborationWorkspace, username: string): CollaborationWorkspace {
  return {
    ...workspace,
    members: workspace.members.filter((member) => member.username !== username),
  };
}

/** Change a member's role (pure). */
export function changeMemberRole(
  workspace: CollaborationWorkspace,
  username: string,
  role: CollaborationMemberRole,
): CollaborationWorkspace {
  return {
    ...workspace,
    members: workspace.members.map((member) => (member.username === username ? { ...member, role } : member)),
  };
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export function tasksOf(workspace: CollaborationWorkspace): WorkspaceTask[] {
  return workspace.tasks;
}

export function tasksByStatus(workspace: CollaborationWorkspace, status: CollaborationTaskStatus): WorkspaceTask[] {
  return workspace.tasks.filter((task) => task.status === status);
}

export function tasksByPriority(
  workspace: CollaborationWorkspace,
  priority: CollaborationTaskPriority,
): WorkspaceTask[] {
  return workspace.tasks.filter((task) => task.priority === priority);
}

export function tasksForAssignee(workspace: CollaborationWorkspace, username: string): WorkspaceTask[] {
  return workspace.tasks.filter((task) => task.assignee === username);
}

export function openTasks(workspace: CollaborationWorkspace): WorkspaceTask[] {
  return workspace.tasks.filter((task) => task.status !== 'done');
}

export function completedTasks(workspace: CollaborationWorkspace): WorkspaceTask[] {
  return workspace.tasks.filter((task) => task.status === 'done');
}

export function overdueTasks(workspace: CollaborationWorkspace, now = new Date()): WorkspaceTask[] {
  return workspace.tasks.filter(
    (task) => task.status !== 'done' && task.dueDate && new Date(task.dueDate) < now,
  );
}

/** Append a task (pure). */
export function createTask(
  workspace: CollaborationWorkspace,
  input: {
    id: string;
    title: string;
    description?: string;
    status?: CollaborationTaskStatus;
    priority?: CollaborationTaskPriority;
    assignee?: string;
    assigneeName?: string;
    dueDate?: string;
    createdBy: string;
    createdAt?: string;
  },
): CollaborationWorkspace {
  return {
    ...workspace,
    tasks: [
      ...workspace.tasks,
      {
        id: input.id,
        workspaceId: workspace.id,
        title: input.title,
        description: input.description,
        status: input.status ?? 'todo',
        priority: input.priority ?? 'medium',
        assignee: input.assignee,
        assigneeName: input.assigneeName,
        dueDate: input.dueDate,
        createdBy: input.createdBy,
        createdAt: input.createdAt ?? new Date().toISOString(),
      },
    ],
  };
}

/** Update a task's status (pure). */
export function updateTaskStatus(
  workspace: CollaborationWorkspace,
  taskIdToUpdate: string,
  status: CollaborationTaskStatus,
): CollaborationWorkspace {
  return {
    ...workspace,
    tasks: workspace.tasks.map((task) =>
      task.id === taskIdToUpdate
        ? {
            ...task,
            status,
            completedAt: status === 'done' ? new Date().toISOString() : task.completedAt,
          }
        : task,
    ),
  };
}

/** Task progress as a fraction in [0, 1]. */
export function taskProgress(workspace: CollaborationWorkspace): number {
  if (workspace.tasks.length === 0) return 0;
  const done = workspace.tasks.filter((task) => task.status === 'done').length;
  return Math.round((done / workspace.tasks.length) * 1000) / 1000;
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export function documentsOf(workspace: CollaborationWorkspace): WorkspaceDocument[] {
  return workspace.documents;
}

export function documentsByType(
  workspace: CollaborationWorkspace,
  type: WorkspaceDocument['type'],
): WorkspaceDocument[] {
  return workspace.documents.filter((document) => document.type === type);
}

export function publishedDocuments(workspace: CollaborationWorkspace): WorkspaceDocument[] {
  return workspace.documents.filter((document) => document.status === 'published');
}

// ---------------------------------------------------------------------------
// Meetings
// ---------------------------------------------------------------------------

export function meetingsOf(workspace: CollaborationWorkspace): WorkspaceMeeting[] {
  return workspace.meetings;
}

export function meetingsByStatus(
  workspace: CollaborationWorkspace,
  status: WorkspaceMeeting['status'],
): WorkspaceMeeting[] {
  return workspace.meetings.filter((meeting) => meeting.status === status);
}

export function upcomingMeetings(workspace: CollaborationWorkspace, now = new Date()): WorkspaceMeeting[] {
  return workspace.meetings
    .filter((meeting) => meeting.status === 'scheduled' && new Date(meeting.scheduledAt) >= now)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export function milestonesOf(workspace: CollaborationWorkspace): WorkspaceMilestone[] {
  return workspace.milestones;
}

export function milestonesByStatus(
  workspace: CollaborationWorkspace,
  status: WorkspaceMilestone['status'],
): WorkspaceMilestone[] {
  return workspace.milestones.filter((milestone) => milestone.status === status);
}

export function milestonesByStage(
  workspace: CollaborationWorkspace,
  stageId: ResearchLifecycleStageId,
): WorkspaceMilestone[] {
  return workspace.milestones.filter((milestone) => milestone.stageId === stageId);
}

export function achievedMilestones(workspace: CollaborationWorkspace): WorkspaceMilestone[] {
  return workspace.milestones.filter((milestone) => milestone.status === 'achieved');
}

/** Milestone progress as a fraction in [0, 1]. */
export function milestoneProgress(workspace: CollaborationWorkspace): number {
  if (workspace.milestones.length === 0) return 0;
  const achieved = workspace.milestones.filter((milestone) => milestone.status === 'achieved').length;
  return Math.round((achieved / workspace.milestones.length) * 1000) / 1000;
}

// ---------------------------------------------------------------------------
// Discussions
// ---------------------------------------------------------------------------

export function discussionsOf(workspace: CollaborationWorkspace): WorkspaceDiscussion[] {
  return workspace.discussions;
}

export function discussionsByStatus(
  workspace: CollaborationWorkspace,
  status: WorkspaceDiscussion['status'],
): WorkspaceDiscussion[] {
  return workspace.discussions.filter((discussion) => discussion.status === status);
}

export function openDiscussions(workspace: CollaborationWorkspace): WorkspaceDiscussion[] {
  return workspace.discussions.filter((discussion) => discussion.status === 'open');
}

export function resolvedDiscussions(workspace: CollaborationWorkspace): WorkspaceDiscussion[] {
  return workspace.discussions.filter((discussion) => discussion.status === 'resolved');
}

export function repliesForDiscussion(discussion: WorkspaceDiscussion): WorkspaceDiscussion['replies'] {
  return discussion.replies;
}

export function replyCount(discussion: WorkspaceDiscussion): number {
  return discussion.replies.length;
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export function invitationsOf(workspace: CollaborationWorkspace): WorkspaceInvitation[] {
  return workspace.invitations;
}

export function invitationsByStatus(
  workspace: CollaborationWorkspace,
  status: WorkspaceInvitation['status'],
): WorkspaceInvitation[] {
  return workspace.invitations.filter((invitation) => invitation.status === status);
}

export function pendingInvitations(workspace: CollaborationWorkspace): WorkspaceInvitation[] {
  return workspace.invitations.filter((invitation) => invitation.status === 'pending');
}

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------

export function eventsForWorkspace(workspace: CollaborationWorkspace): WorkspaceLogEntry[] {
  return [...workspace.log].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function eventsByType(
  workspace: CollaborationWorkspace,
  type: CollaborationLogEventType,
): WorkspaceLogEntry[] {
  return workspace.log.filter((entry) => entry.type === type);
}

// ---------------------------------------------------------------------------
// Authorization
// ---------------------------------------------------------------------------

export function canViewWorkspace(workspace: CollaborationWorkspace, username: string): boolean {
  if (workspace.visibility === 'public') return true;
  return memberOf(workspace, username) !== undefined;
}

export function canEditWorkspace(workspace: CollaborationWorkspace, username: string): boolean {
  const role = memberRoleOf(workspace, username);
  return role === 'owner' || role === 'admin' || role === 'editor';
}

export function canManageWorkspace(workspace: CollaborationWorkspace, username: string): boolean {
  const role = memberRoleOf(workspace, username);
  return role === 'owner' || role === 'admin';
}

// ---------------------------------------------------------------------------
// Browse
// ---------------------------------------------------------------------------

export function workspacesForUser(
  workspaces: readonly CollaborationWorkspace[],
  username: string,
): CollaborationWorkspace[] {
  return workspaces.filter((workspace) => memberOf(workspace, username) !== undefined);
}

export function workspacesByKind(
  workspaces: readonly CollaborationWorkspace[],
  kind: CollaborationWorkspaceKind,
): CollaborationWorkspace[] {
  return workspaces.filter((workspace) => workspace.kind === kind);
}

export function workspacesByVisibility(
  workspaces: readonly CollaborationWorkspace[],
  visibility: CollaborationWorkspaceVisibility,
): CollaborationWorkspace[] {
  return workspaces.filter((workspace) => workspace.visibility === visibility);
}

export function filterWorkspaces(
  workspaces: readonly CollaborationWorkspace[],
  filter: CollaborationFilter = {},
): CollaborationWorkspace[] {
  return workspaces.filter((workspace) => {
    if (filter.kind && workspace.kind !== filter.kind) return false;
    if (filter.visibility && workspace.visibility !== filter.visibility) return false;
    if (filter.status && workspace.status !== filter.status) return false;
    if (filter.tagged && !workspace.tags.includes(filter.tagged)) return false;
    return true;
  });
}

export function sortWorkspaces(
  workspaces: readonly CollaborationWorkspace[],
  sort: CollaborationSort,
): CollaborationWorkspace[] {
  const sorted = [...workspaces];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'members':
      return sorted.sort((a, b) => memberCount(b) - memberCount(a) || a.name.localeCompare(b.name));
    case 'tasks':
      return sorted.sort(
        (a, b) => b.tasks.length - a.tasks.length || a.name.localeCompare(b.name),
      );
    case 'progress':
      return sorted.sort(
        (a, b) => taskProgress(b) - taskProgress(a) || a.name.localeCompare(b.name),
      );
    default:
      return sorted;
  }
}

export function searchWorkspaces(workspaces: readonly CollaborationWorkspace[], query: string): CollaborationWorkspace[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return workspaces.filter((workspace) =>
    `${workspace.name} ${workspace.description} ${workspace.tags.join(' ')} ${workspace.ownerName ?? ''} ${workspace.sourceTitle ?? ''}`
      .toLowerCase()
      .includes(needle),
  );
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export function collaborationInsights(
  workspaces: readonly CollaborationWorkspace[],
  options: { top?: number } = {},
): CollaborationInsight[] {
  const insights: CollaborationInsight[] = [];
  const active = workspaces.filter((workspace) => workspace.status === 'active');
  if (active.length > 0) {
    insights.push({
      id: 'collab-active-workspaces',
      title: 'Active collaboration',
      body: `${active.length} workspaces are active right now, spanning research groups, labs, institution spaces, and communities.`,
      type: 'summary',
    });
  }
  const byKind = COLLABORATION_WORKSPACE_KINDS.map((kind) => ({
    kind,
    count: workspaces.filter((workspace) => workspace.kind === kind).length,
  })).sort((a, b) => b.count - a.count);
  if (byKind[0] && byKind[0].count > 0) {
    insights.push({
      id: 'collab-leading-kind',
      title: 'Leading workspace kind',
      body: `${byKind[0].kind} workspaces lead the platform right now with ${byKind[0].count} active spaces.`,
      type: 'trend',
    });
  }
  const mostCollaborative = [...workspaces].sort((a, b) => memberCount(b) - memberCount(a))[0];
  if (mostCollaborative) {
    insights.push({
      id: 'collab-most-collaborative',
      title: 'Spotlight workspace',
      body: `"${mostCollaborative.name}" is the most collaborative workspace, bringing together ${memberCount(mostCollaborative)} researchers.`,
      type: 'spotlight',
      workspaceId: mostCollaborative.id,
    });
  }
  const overdue = workspaces.reduce((sum, workspace) => sum + overdueTasks(workspace).length, 0);
  if (overdue > 0) {
    insights.push({
      id: 'collab-overdue-tasks',
      title: 'Overdue tasks',
      body: `${overdue} tasks across your workspaces are past their due date — a focused sprint could clear the backlog.`,
      type: 'opportunity',
    });
  }
  const milestones = workspaces.flatMap((workspace) => workspace.milestones);
  if (milestones.length > 0) {
    insights.push({
      id: 'collab-milestones',
      title: 'Milestone coverage',
      body: `${milestones.length} milestones are tracked across the workspace graph, aligned to the canonical research lifecycle.`,
      type: 'summary',
    });
  }
  return insights.slice(0, options.top ?? 6);
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export function collaborationStatistics(
  workspaces: readonly CollaborationWorkspace[],
): CollaborationStatistics {
  const totalMembers = workspaces.reduce((sum, workspace) => sum + memberCount(workspace), 0);
  const totalTasks = workspaces.reduce((sum, workspace) => sum + workspace.tasks.length, 0);
  const totalDocuments = workspaces.reduce((sum, workspace) => sum + workspace.documents.length, 0);
  const totalMeetings = workspaces.reduce((sum, workspace) => sum + workspace.meetings.length, 0);
  const totalMilestones = workspaces.reduce((sum, workspace) => sum + workspace.milestones.length, 0);
  const totalDiscussions = workspaces.reduce((sum, workspace) => sum + workspace.discussions.length, 0);
  const totalInvitations = workspaces.reduce((sum, workspace) => sum + workspace.invitations.length, 0);
  const totalEvents = workspaces.reduce((sum, workspace) => sum + workspace.log.length, 0);
  const tags = new Set(workspaces.flatMap((workspace) => workspace.tags));

  const byKind = COLLABORATION_WORKSPACE_KINDS.map((kind) => {
    const matching = workspaces.filter((workspace) => workspace.kind === kind);
    return {
      kind,
      count: matching.length,
      members: matching.reduce((sum, workspace) => sum + memberCount(workspace), 0),
    };
  }).filter((stat) => stat.count > 0);

  const byVisibility = COLLABORATION_WORKSPACE_VISIBILITIES.map((visibility) => ({
    visibility,
    count: workspaces.filter((workspace) => workspace.visibility === visibility).length,
  })).filter((stat) => stat.count > 0);

  const byStatus = COLLABORATION_WORKSPACE_STATUSES.map((status) => ({
    status,
    count: workspaces.filter((workspace) => workspace.status === status).length,
  })).filter((stat) => stat.count > 0);

  const byTaskStatus = COLLABORATION_TASK_STATUSES.map((status) => ({
    status,
    count: workspaces.reduce(
      (sum, workspace) => sum + workspace.tasks.filter((task) => task.status === status).length,
      0,
    ),
  })).filter((stat) => stat.count > 0);

  const byMemberRole = COLLABORATION_MEMBER_ROLES.map((role) => ({
    role,
    count: workspaces.reduce(
      (sum, workspace) => sum + workspace.members.filter((member) => member.role === role).length,
      0,
    ),
  })).filter((stat) => stat.count > 0);

  return {
    totalWorkspaces: workspaces.length,
    totalMembers,
    totalTasks,
    totalDocuments,
    totalMeetings,
    totalMilestones,
    totalDiscussions,
    totalInvitations,
    totalEvents,
    totalTags: tags.size,
    completedTasks: byTaskStatus.find((stat) => stat.status === 'done')?.count ?? 0,
    openTasks:
      totalTasks - (byTaskStatus.find((stat) => stat.status === 'done')?.count ?? 0),
    publishedDocuments: workspaces.reduce(
      (sum, workspace) => sum + workspace.documents.filter((document) => document.status === 'published').length,
      0,
    ),
    achievedMilestones: workspaces.reduce(
      (sum, workspace) => sum + workspace.milestones.filter((milestone) => milestone.status === 'achieved').length,
      0,
    ),
    byKind,
    byVisibility,
    byStatus,
    byTaskStatus,
    byMemberRole,
  };
}

function allLogEntries(workspaces: readonly CollaborationWorkspace[]): WorkspaceLogEntry[] {
  return workspaces.flatMap((workspace) => workspace.log);
}

function groupEventsByDay(entries: readonly WorkspaceLogEntry[]): { date: string; count: number }[] {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    const date = new Date(entry.createdAt).toISOString().slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function collaborationAnalytics(
  workspaces: readonly CollaborationWorkspace[],
  now = new Date(),
): CollaborationAnalytics {
  const totalTasks = workspaces.reduce((sum, workspace) => sum + workspace.tasks.length, 0);
  const completedTasks = workspaces.reduce(
    (sum, workspace) => sum + workspace.tasks.filter((task) => task.status === 'done').length,
    0,
  );
  const totalMilestones = workspaces.reduce((sum, workspace) => sum + workspace.milestones.length, 0);
  const achieved = workspaces.reduce(
    (sum, workspace) => sum + workspace.milestones.filter((milestone) => milestone.status === 'achieved').length,
    0,
  );
  const totalProgress = workspaces.reduce((sum, workspace) => sum + taskProgress(workspace), 0);
  const overdueCount = workspaces.reduce((sum, workspace) => sum + overdueTasks(workspace, now).length, 0);
  const upcomingMeetingsCount = workspaces.reduce(
    (sum, workspace) => sum + upcomingMeetings(workspace, now).length,
    0,
  );
  const tags = new Map<string, number>();
  workspaces.forEach((workspace) =>
    workspace.tags.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1)),
  );
  const tasksByPriority = COLLABORATION_TASK_PRIORITIES.map((priority) => ({
    priority,
    count: workspaces.reduce(
      (sum, workspace) => sum + workspace.tasks.filter((task) => task.priority === priority).length,
      0,
    ),
  })).filter((stat) => stat.count > 0);
  const mostCollaborative = [...workspaces].sort((a, b) => memberCount(b) - memberCount(a))[0];

  return {
    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 1000) / 1000 : 0,
    milestoneCompletionRate: totalMilestones > 0 ? Math.round((achieved / totalMilestones) * 1000) / 1000 : 0,
    totalTaskProgress: workspaces.length > 0 ? Math.round((totalProgress / workspaces.length) * 1000) / 1000 : 0,
    overdueTasks: overdueCount,
    upcomingMeetings: upcomingMeetingsCount,
    avgMembersPerWorkspace:
      workspaces.length > 0
        ? Math.round((workspaces.reduce((sum, workspace) => sum + memberCount(workspace), 0) / workspaces.length) * 10) / 10
        : 0,
    avgTasksPerWorkspace:
      workspaces.length > 0
        ? Math.round((totalTasks / workspaces.length) * 10) / 10
        : 0,
    mostCollaborativeWorkspaceId: mostCollaborative?.id ?? '',
    topTags: [...tags.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
      .slice(0, 8),
    tasksByPriority,
    byDay: groupEventsByDay(allLogEntries(workspaces)),
  };
}

/** Build the aggregate root for the Collaboration Workspace Platform. */
export function buildCollaborationPortfolio(
  workspaces: readonly CollaborationWorkspace[],
  options: { now?: Date; top?: number } = {},
): CollaborationPortfolio {
  const now = options.now ?? new Date();
  const featured = workspaces
    .filter((workspace) => workspace.status === 'active')
    .sort((a, b) => memberCount(b) - memberCount(a))
    .slice(0, (options.top ?? 10) / 2);
  return {
    statistics: collaborationStatistics(workspaces),
    analytics: collaborationAnalytics(workspaces, now),
    workspaces: [...workspaces],
    members: workspaces.flatMap((workspace) => workspace.members),
    tasks: workspaces.flatMap((workspace) => workspace.tasks),
    documents: workspaces.flatMap((workspace) => workspace.documents),
    meetings: workspaces.flatMap((workspace) => workspace.meetings),
    milestones: workspaces.flatMap((workspace) => workspace.milestones),
    discussions: workspaces.flatMap((workspace) => workspace.discussions),
    invitations: workspaces.flatMap((workspace) => workspace.invitations),
    log: allLogEntries(workspaces).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    insights: collaborationInsights(workspaces, { top: options.top ?? 6 }),
    featured,
  };
}

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export {
  COLLABORATION_DOCUMENT_TYPES,
  COLLABORATION_INVITATION_STATUSES,
  COLLABORATION_LOG_EVENT_TYPES,
  COLLABORATION_MEMBER_ROLES,
  COLLABORATION_MEMBER_STATUSES,
  COLLABORATION_MILESTONE_STATUSES,
  COLLABORATION_TASK_PRIORITIES,
  COLLABORATION_TASK_STATUSES,
  COLLABORATION_WORKSPACE_KINDS,
  COLLABORATION_WORKSPACE_STATUSES,
  COLLABORATION_WORKSPACE_VISIBILITIES,
};
