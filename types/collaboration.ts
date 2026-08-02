import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Collaboration Workspace Platform (Phase 2.2D).
 *
 * The collaboration workspace is where research happens together — research
 * groups, labs, project workspaces, institutional spaces, conference spaces,
 * journal spaces, and communities. It is **not** the notification engine
 * (delivery infrastructure), **not** messaging (private conversations), and
 * **not** the activity feed (the public event stream). A workspace is the
 * shared, role-governed place a team plans, executes, and publishes from:
 * members with roles, tasks, documents, meetings, milestones, discussions,
 * invitations, and an append-only activity log.
 *
 * The module owns no external records. Members reference canonical researchers
 * by `username`, milestones carry the canonical `ResearchLifecycleStageId`, and
 * a workspace may reference a canonical source record (a project, an
 * institution, a conference, a journal) through `sourceId` + `sourceEntity` —
 * it never duplicates a record owned by another module. Statistics and
 * analytics are derived from the typed graph by the pure engine in
 * `lib/collaboration.ts`.
 */

/** The workspace vocabulary — one kind per collaboration surface. */
export type CollaborationWorkspaceKind =
  | 'research-group'
  | 'research-lab'
  | 'project-workspace'
  | 'institution-space'
  | 'conference-space'
  | 'journal-space'
  | 'community';

/** Who can see the workspace and its content. */
export type CollaborationWorkspaceVisibility = 'public' | 'institution' | 'members' | 'private';

/** Lifecycle state of a workspace itself. */
export type CollaborationWorkspaceStatus = 'active' | 'archived' | 'paused';

/** The permission level a member holds inside a workspace. */
export type CollaborationMemberRole = 'owner' | 'admin' | 'editor' | 'member' | 'viewer';

/** Membership lifecycle of a researcher inside a workspace. */
export type CollaborationMemberStatus = 'active' | 'invited' | 'pending' | 'removed';

/** The lifecycle of a workspace task. */
export type CollaborationTaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';

/** The urgency of a workspace task. */
export type CollaborationTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/** The kinds of shared documents a workspace hosts. */
export type CollaborationDocumentType =
  | 'note'
  | 'protocol'
  | 'report'
  | 'dataset'
  | 'manuscript'
  | 'reference'
  | 'guideline';

/** The lifecycle of a shared document. */
export type CollaborationDocumentStatus = 'draft' | 'in-review' | 'published';

/** The lifecycle of a scheduled meeting. */
export type CollaborationMeetingStatus = 'scheduled' | 'completed' | 'cancelled';

/** The lifecycle of a workspace milestone, aligned to the research lifecycle. */
export type CollaborationMilestoneStatus = 'planned' | 'in-progress' | 'achieved';

/** The lifecycle of a workspace discussion. */
export type CollaborationDiscussionStatus = 'open' | 'resolved' | 'closed';

/** The lifecycle of a membership invitation. */
export type CollaborationInvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

/** The event vocabulary of the append-only workspace activity log. */
export type CollaborationLogEventType =
  | 'created'
  | 'member-added'
  | 'member-removed'
  | 'task-created'
  | 'task-completed'
  | 'document-published'
  | 'milestone-achieved'
  | 'meeting-scheduled'
  | 'discussion-opened'
  | 'invitation-sent';

/** A researcher member of a workspace, referenced by canonical username. */
export interface CollaborationMember {
  username: string;
  name: string;
  avatar?: string;
  role: CollaborationMemberRole;
  status: CollaborationMemberStatus;
  joinedAt: string;
}

/** A task inside a workspace, assignable to a member. */
export interface WorkspaceTask {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: CollaborationTaskStatus;
  priority: CollaborationTaskPriority;
  assignee?: string;
  assigneeName?: string;
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

/** A shared document hosted by a workspace. */
export interface WorkspaceDocument {
  id: string;
  workspaceId: string;
  title: string;
  type: CollaborationDocumentType;
  status: CollaborationDocumentStatus;
  author: string;
  authorName?: string;
  updatedAt: string;
  version: number;
}

/** A scheduled meeting with an agenda and attendee list. */
export interface WorkspaceMeeting {
  id: string;
  workspaceId: string;
  title: string;
  scheduledAt: string;
  status: CollaborationMeetingStatus;
  attendees: string[];
  agenda?: string;
}

/** A milestone, aligned to the canonical research lifecycle. */
export interface WorkspaceMilestone {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: CollaborationMilestoneStatus;
  /** Canonical research lifecycle stage this milestone advances. */
  stageId?: ResearchLifecycleStageId;
  targetDate?: string;
  achievedAt?: string;
}

/** A threaded reply inside a workspace discussion. */
export interface WorkspaceDiscussionReply {
  id: string;
  discussionId: string;
  author: string;
  authorName?: string;
  body: string;
  createdAt: string;
}

/** A discussion thread opened inside a workspace. */
export interface WorkspaceDiscussion {
  id: string;
  workspaceId: string;
  title: string;
  body?: string;
  author: string;
  authorName?: string;
  status: CollaborationDiscussionStatus;
  replies: WorkspaceDiscussionReply[];
  createdAt: string;
}

/** An invitation for a researcher to join a workspace in a given role. */
export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  invitedBy: string;
  invitedByName?: string;
  invitee: string;
  inviteeName?: string;
  role: CollaborationMemberRole;
  status: CollaborationInvitationStatus;
  createdAt: string;
}

/** An append-only entry in a workspace's activity log. */
export interface WorkspaceLogEntry {
  id: string;
  workspaceId: string;
  type: CollaborationLogEventType;
  actor: string;
  actorName?: string;
  message: string;
  createdAt: string;
}

/**
 * A single collaboration workspace — the aggregate of a team's shared surface.
 * Derived counts and progress are computed by the engine, never hand-maintained.
 */
export interface CollaborationWorkspace {
  id: string;
  slug: string;
  name: string;
  kind: CollaborationWorkspaceKind;
  description: string;
  visibility: CollaborationWorkspaceVisibility;
  status: CollaborationWorkspaceStatus;
  /** The canonical owner researcher username. */
  owner: string;
  ownerName?: string;
  /** Canonical source record this workspace serves, when applicable. */
  sourceId?: string;
  sourceEntity?: 'project' | 'institution' | 'conference' | 'journal' | 'publisher' | 'grant';
  sourceTitle?: string;
  tags: string[];
  members: CollaborationMember[];
  tasks: WorkspaceTask[];
  documents: WorkspaceDocument[];
  meetings: WorkspaceMeeting[];
  milestones: WorkspaceMilestone[];
  discussions: WorkspaceDiscussion[];
  invitations: WorkspaceInvitation[];
  log: WorkspaceLogEntry[];
  createdAt: string;
  updatedAt: string;
}

/** The filter vocabulary for browsing workspaces. */
export interface CollaborationFilter {
  kind?: CollaborationWorkspaceKind;
  visibility?: CollaborationWorkspaceVisibility;
  status?: CollaborationWorkspaceStatus;
  tagged?: string;
}

export type CollaborationSort = 'recent' | 'name' | 'members' | 'tasks' | 'progress';

// ---------------------------------------------------------------------------
// Statistics, analytics, portfolio
// ---------------------------------------------------------------------------

export interface CollaborationKindStat {
  kind: CollaborationWorkspaceKind;
  count: number;
  members: number;
}

export interface CollaborationVisibilityStat {
  visibility: CollaborationWorkspaceVisibility;
  count: number;
}

export interface CollaborationStatusStat {
  status: CollaborationWorkspaceStatus;
  count: number;
}

export interface CollaborationTaskStatusStat {
  status: CollaborationTaskStatus;
  count: number;
}

export interface CollaborationTaskPriorityStat {
  priority: CollaborationTaskPriority;
  count: number;
}

export interface CollaborationRoleStat {
  role: CollaborationMemberRole;
  count: number;
}

export interface CollaborationDayStat {
  date: string;
  count: number;
}

export interface CollaborationStatistics {
  totalWorkspaces: number;
  totalMembers: number;
  totalTasks: number;
  totalDocuments: number;
  totalMeetings: number;
  totalMilestones: number;
  totalDiscussions: number;
  totalInvitations: number;
  totalEvents: number;
  totalTags: number;
  completedTasks: number;
  openTasks: number;
  publishedDocuments: number;
  achievedMilestones: number;
  byKind: CollaborationKindStat[];
  byVisibility: CollaborationVisibilityStat[];
  byStatus: CollaborationStatusStat[];
  byTaskStatus: CollaborationTaskStatusStat[];
  byMemberRole: CollaborationRoleStat[];
}

export interface CollaborationAnalytics {
  taskCompletionRate: number;
  milestoneCompletionRate: number;
  totalTaskProgress: number;
  overdueTasks: number;
  upcomingMeetings: number;
  avgMembersPerWorkspace: number;
  avgTasksPerWorkspace: number;
  mostCollaborativeWorkspaceId: string;
  topTags: { tag: string; count: number }[];
  tasksByPriority: CollaborationTaskPriorityStat[];
  byDay: CollaborationDayStat[];
}

/** A derived AI insight over the collaboration graph. */
export interface CollaborationInsight {
  id: string;
  title: string;
  body: string;
  type: 'trend' | 'cluster' | 'spotlight' | 'summary' | 'opportunity';
  workspaceId?: string;
}

/** Aggregate root of the Collaboration Workspace Platform. */
export interface CollaborationPortfolio {
  statistics: CollaborationStatistics;
  analytics: CollaborationAnalytics;
  workspaces: CollaborationWorkspace[];
  members: CollaborationMember[];
  tasks: WorkspaceTask[];
  documents: WorkspaceDocument[];
  meetings: WorkspaceMeeting[];
  milestones: WorkspaceMilestone[];
  discussions: WorkspaceDiscussion[];
  invitations: WorkspaceInvitation[];
  log: WorkspaceLogEntry[];
  insights: CollaborationInsight[];
  featured: CollaborationWorkspace[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const COLLABORATION_WORKSPACE_KINDS: readonly CollaborationWorkspaceKind[] = [
  'research-group',
  'research-lab',
  'project-workspace',
  'institution-space',
  'conference-space',
  'journal-space',
  'community',
];

export const COLLABORATION_WORKSPACE_KIND_LABELS: Record<CollaborationWorkspaceKind, string> = {
  'research-group': 'Research Group',
  'research-lab': 'Research Lab',
  'project-workspace': 'Project Workspace',
  'institution-space': 'Institution Space',
  'conference-space': 'Conference Space',
  'journal-space': 'Journal Space',
  community: 'Community',
};

export const COLLABORATION_WORKSPACE_KIND_ICONS: Record<CollaborationWorkspaceKind, string> = {
  'research-group': '👥',
  'research-lab': '🧪',
  'project-workspace': '📁',
  'institution-space': '🎓',
  'conference-space': '🎤',
  'journal-space': '🗞️',
  community: '🌍',
};

export const COLLABORATION_WORKSPACE_VISIBILITIES: readonly CollaborationWorkspaceVisibility[] = [
  'public',
  'institution',
  'members',
  'private',
];

export const COLLABORATION_WORKSPACE_VISIBILITY_LABELS: Record<CollaborationWorkspaceVisibility, string> = {
  public: 'Public',
  institution: 'Institution',
  members: 'Members',
  private: 'Private',
};

export const COLLABORATION_WORKSPACE_VISIBILITY_ICONS: Record<CollaborationWorkspaceVisibility, string> = {
  public: '🌍',
  institution: '🎓',
  members: '👥',
  private: '🔒',
};

export const COLLABORATION_WORKSPACE_STATUSES: readonly CollaborationWorkspaceStatus[] = [
  'active',
  'archived',
  'paused',
];

export const COLLABORATION_WORKSPACE_STATUS_LABELS: Record<CollaborationWorkspaceStatus, string> = {
  active: 'Active',
  archived: 'Archived',
  paused: 'Paused',
};

export const COLLABORATION_WORKSPACE_STATUS_ICONS: Record<CollaborationWorkspaceStatus, string> = {
  active: '🟢',
  archived: '🗄️',
  paused: '⏸️',
};

export const COLLABORATION_MEMBER_ROLES: readonly CollaborationMemberRole[] = [
  'owner',
  'admin',
  'editor',
  'member',
  'viewer',
];

export const COLLABORATION_MEMBER_ROLE_LABELS: Record<CollaborationMemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  member: 'Member',
  viewer: 'Viewer',
};

export const COLLABORATION_MEMBER_ROLE_ICONS: Record<CollaborationMemberRole, string> = {
  owner: '👑',
  admin: '🛡️',
  editor: '✏️',
  member: '👤',
  viewer: '👁️',
};

export const COLLABORATION_MEMBER_STATUSES: readonly CollaborationMemberStatus[] = [
  'active',
  'invited',
  'pending',
  'removed',
];

export const COLLABORATION_TASK_STATUSES: readonly CollaborationTaskStatus[] = [
  'todo',
  'in-progress',
  'in-review',
  'done',
];

export const COLLABORATION_TASK_STATUS_LABELS: Record<CollaborationTaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
};

export const COLLABORATION_TASK_STATUS_ICONS: Record<CollaborationTaskStatus, string> = {
  todo: '📋',
  'in-progress': '🔧',
  'in-review': '🔍',
  done: '✅',
};

export const COLLABORATION_TASK_PRIORITIES: readonly CollaborationTaskPriority[] = [
  'low',
  'medium',
  'high',
  'urgent',
];

export const COLLABORATION_TASK_PRIORITY_LABELS: Record<CollaborationTaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const COLLABORATION_TASK_PRIORITY_ICONS: Record<CollaborationTaskPriority, string> = {
  low: '🔽',
  medium: '➖',
  high: '🔼',
  urgent: '🚨',
};

export const COLLABORATION_DOCUMENT_TYPES: readonly CollaborationDocumentType[] = [
  'note',
  'protocol',
  'report',
  'dataset',
  'manuscript',
  'reference',
  'guideline',
];

export const COLLABORATION_DOCUMENT_TYPE_LABELS: Record<CollaborationDocumentType, string> = {
  note: 'Note',
  protocol: 'Protocol',
  report: 'Report',
  dataset: 'Dataset',
  manuscript: 'Manuscript',
  reference: 'Reference',
  guideline: 'Guideline',
};

export const COLLABORATION_DOCUMENT_TYPE_ICONS: Record<CollaborationDocumentType, string> = {
  note: '📝',
  protocol: '🧬',
  report: '📊',
  dataset: '🗄️',
  manuscript: '📄',
  reference: '📚',
  guideline: '📜',
};

export const COLLABORATION_DOCUMENT_STATUSES: readonly CollaborationDocumentStatus[] = [
  'draft',
  'in-review',
  'published',
];

export const COLLABORATION_DOCUMENT_STATUS_LABELS: Record<CollaborationDocumentStatus, string> = {
  draft: 'Draft',
  'in-review': 'In Review',
  published: 'Published',
};

export const COLLABORATION_DOCUMENT_STATUS_ICONS: Record<CollaborationDocumentStatus, string> = {
  draft: '✍️',
  'in-review': '🔍',
  published: '✅',
};

export const COLLABORATION_MEETING_STATUSES: readonly CollaborationMeetingStatus[] = [
  'scheduled',
  'completed',
  'cancelled',
];

export const COLLABORATION_MEETING_STATUS_LABELS: Record<CollaborationMeetingStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const COLLABORATION_MEETING_STATUS_ICONS: Record<CollaborationMeetingStatus, string> = {
  scheduled: '📅',
  completed: '✔️',
  cancelled: '✖️',
};

export const COLLABORATION_MILESTONE_STATUSES: readonly CollaborationMilestoneStatus[] = [
  'planned',
  'in-progress',
  'achieved',
];

export const COLLABORATION_MILESTONE_STATUS_LABELS: Record<CollaborationMilestoneStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  achieved: 'Achieved',
};

export const COLLABORATION_MILESTONE_STATUS_ICONS: Record<CollaborationMilestoneStatus, string> = {
  planned: '🗺️',
  'in-progress': '🛠️',
  achieved: '🏁',
};

export const COLLABORATION_DISCUSSION_STATUSES: readonly CollaborationDiscussionStatus[] = [
  'open',
  'resolved',
  'closed',
];

export const COLLABORATION_DISCUSSION_STATUS_LABELS: Record<CollaborationDiscussionStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const COLLABORATION_DISCUSSION_STATUS_ICONS: Record<CollaborationDiscussionStatus, string> = {
  open: '💬',
  resolved: '✅',
  closed: '🔒',
};

export const COLLABORATION_INVITATION_STATUSES: readonly CollaborationInvitationStatus[] = [
  'pending',
  'accepted',
  'declined',
  'expired',
];

export const COLLABORATION_INVITATION_STATUS_LABELS: Record<CollaborationInvitationStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
};

export const COLLABORATION_INVITATION_STATUS_ICONS: Record<CollaborationInvitationStatus, string> = {
  pending: '⏳',
  accepted: '✅',
  declined: '🚫',
  expired: '⏰',
};

export const COLLABORATION_LOG_EVENT_TYPES: readonly CollaborationLogEventType[] = [
  'created',
  'member-added',
  'member-removed',
  'task-created',
  'task-completed',
  'document-published',
  'milestone-achieved',
  'meeting-scheduled',
  'discussion-opened',
  'invitation-sent',
];
