/**
 * Scholatia Task Engine — canonical types (Phase 2.2E SWTROP).
 *
 * The generic task engine powers every workflow: any module can attach tasks
 * to a workflow (through `workflowId`), or stand alone (through
 * `sourceId` + `sourceEntity`). Tasks are aggregate roots with assignments,
 * comments, and an append-only history — the audit trail the AI readiness
 * layer requires.
 */

/** The urgency of a task. */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/** The lifecycle of a task. */
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'in-review' | 'done';

/** The lifecycle of a task assignment. */
export type TaskAssignmentStatus = 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'rejected' | 'withdrawn';

/** The event vocabulary of the append-only task history. */
export type TaskHistoryEventType =
  | 'created'
  | 'assigned'
  | 'unassigned'
  | 'accepted'
  | 'status-changed'
  | 'priority-changed'
  | 'comment-added'
  | 'blocked'
  | 'unblocked'
  | 'completed'
  | 'reopened';

/** A generic assignable task aggregate root. */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  assigneeName?: string;
  workflowId?: string;
  sourceId?: string;
  sourceEntity?: string;
  tags?: string[];
  dueDate?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
  startedAt?: string;
  completedAt?: string;
  progress?: number;
  assignments?: TaskAssignment[];
  comments?: TaskComment[];
  history?: TaskHistoryEntry[];
}

/** An assignment of a task to a researcher. */
export interface TaskAssignment {
  id: string;
  taskId: string;
  assignee: string;
  assigneeName?: string;
  role?: string;
  status: TaskAssignmentStatus;
  assignedBy: string;
  assignedByName?: string;
  assignedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

/** A comment attached to a task. */
export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  authorName: string;
  body: string;
  createdAt: string;
}

/** An entry in the append-only task history. */
export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  type: TaskHistoryEventType;
  actor: string;
  actorName: string;
  message: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Derived view models
// ---------------------------------------------------------------------------

export interface TaskStatusStat {
  status: TaskStatus;
  count: number;
}

export interface TaskPriorityStat {
  priority: TaskPriority;
  count: number;
}

export interface TaskAssigneeStat {
  assignee: string;
  assigneeName?: string;
  open: number;
  completed: number;
}

export interface TaskStatistics {
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  blockedTasks: number;
  inReview: number;
  overdueTasks: number;
  completionRate: number;
  byStatus: TaskStatusStat[];
  byPriority: TaskPriorityStat[];
}

export interface TaskAnalytics {
  byStatus: TaskStatusStat[];
  byPriority: TaskPriorityStat[];
  byAssignee: TaskAssigneeStat[];
  completionRate: number;
  overdueRate: number;
  averageProgress: number;
  trend: { date: string; created: number; completed: number }[];
}

export interface TaskBoardColumn {
  status: TaskStatus;
  tasks: Task[];
}

export type TaskSort = 'recent' | 'due' | 'priority' | 'title';

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  workflowId?: string;
  tag?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TASK_STATUSES: readonly TaskStatus[] = [
  'todo',
  'in-progress',
  'blocked',
  'in-review',
  'done',
] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  'in-review': 'In Review',
  done: 'Done',
};

export const TASK_STATUS_ICONS: Record<TaskStatus, string> = {
  todo: '⬜',
  'in-progress': '⚙️',
  blocked: '🚧',
  'in-review': '🔍',
  done: '✅',
};

export const TASK_PRIORITIES: readonly TaskPriority[] = ['low', 'medium', 'high', 'urgent'] as const;

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const TASK_PRIORITY_ICONS: Record<TaskPriority, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  urgent: '🔴',
};

export const TASK_ASSIGNMENT_STATUSES: readonly TaskAssignmentStatus[] = [
  'assigned',
  'accepted',
  'in-progress',
  'completed',
  'rejected',
  'withdrawn',
] as const;

export const TASK_HISTORY_EVENT_TYPES: readonly TaskHistoryEventType[] = [
  'created',
  'assigned',
  'unassigned',
  'accepted',
  'status-changed',
  'priority-changed',
  'comment-added',
  'blocked',
  'unblocked',
  'completed',
  'reopened',
] as const;
