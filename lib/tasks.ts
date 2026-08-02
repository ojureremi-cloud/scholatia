import type {
  Task,
  TaskAnalytics,
  TaskAssignment,
  TaskAssignmentStatus,
  TaskBoardColumn,
  TaskComment,
  TaskFilter,
  TaskHistoryEntry,
  TaskHistoryEventType,
  TaskPriority,
  TaskSort,
  TaskStatistics,
  TaskStatus,
} from '@/types/tasks';

/**
 * Scholatia Task Engine (Phase 2.2E SWTROP).
 *
 * The pure task engine — no React, no side effects, no API calls. Tasks are
 * aggregate roots with assignments, comments, and an append-only history that
 * feeds the AI readiness layer. Tasks attach to workflows through
 * `workflowId` or to any canonical source record through `sourceId` +
 * `sourceEntity`, so the engine is shared by every later module.
 */

// ---------------------------------------------------------------------------
// IDs
// ---------------------------------------------------------------------------

function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Canonical task id prefix. */
export function taskId(label: string): string {
  return `tk-${slugOf(label)}`;
}

/** Canonical task assignment id prefix. */
export function taskAssignmentId(label: string): string {
  return `tka-${slugOf(label)}`;
}

/** Canonical task comment id prefix. */
export function taskCommentId(label: string): string {
  return `tkc-${slugOf(label)}`;
}

/** Canonical task history id prefix. */
export function taskHistoryId(label: string): string {
  return `tkh-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Task aggregate
// ---------------------------------------------------------------------------

function taskEvent(
  task: Task,
  type: TaskHistoryEventType,
  actor: string,
  actorName: string,
  message: string,
  fromStatus?: TaskStatus,
  toStatus?: TaskStatus,
  now: string = new Date().toISOString(),
): TaskHistoryEntry {
  return {
    id: taskHistoryId(`${task.id}-${type}-${task.createdAt}`),
    taskId: task.id,
    type,
    actor,
    actorName,
    message,
    fromStatus,
    toStatus,
    createdAt: now,
  };
}

/** Create a new task aggregate. */
export function createTask(input: {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignee?: string;
  assigneeName?: string;
  workflowId?: string;
  sourceId?: string;
  sourceEntity?: string;
  tags?: string[];
  dueDate?: string;
  createdBy: string;
  createdByName?: string;
  createdAt?: string;
}): Task {
  return {
    id: taskId(input.title),
    title: input.title,
    description: input.description,
    status: 'todo',
    priority: input.priority ?? 'medium',
    assignee: input.assignee,
    assigneeName: input.assigneeName,
    workflowId: input.workflowId,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    tags: input.tags,
    dueDate: input.dueDate,
    createdBy: input.createdBy,
    createdByName: input.createdByName,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

/** Derived progress of a task, 0-100. */
export function taskProgress(task: Task): number {
  if (typeof task.progress === 'number') {
    return task.progress;
  }
  switch (task.status) {
    case 'todo':
      return 0;
    case 'in-progress':
      return 50;
    case 'blocked':
      return 25;
    case 'in-review':
      return 80;
    case 'done':
      return 100;
  }
}

/** Change a task status, appending history. */
export function updateTaskStatus(input: {
  task: Task;
  status: TaskStatus;
  actor: string;
  actorName: string;
  now?: string;
}): Task {
  const { task, status, actor, actorName } = input;
  if (task.status === status) {
    return task;
  }
  const now = input.now ?? new Date().toISOString();
  const history = [...(task.history ?? []), taskEvent(task, 'status-changed', actor, actorName, `${task.status} → ${status}`, task.status, status, now)];
  const base: Task = {
    ...task,
    status,
    updatedAt: now,
  };
  return withHistory(base, history, now);
}

function withHistory(task: Task, history: TaskHistoryEntry[], now: string): Task {
  return {
    ...task,
    startedAt: task.status === 'in-progress' ? task.startedAt ?? now : task.startedAt,
    completedAt: task.status === 'done' ? now : task.completedAt,
    progress: task.status === 'done' ? 100 : task.progress,
    history,
  } as Task;
}

/** Add a comment to a task, appending history. */
export function addTaskComment(input: {
  task: Task;
  author: string;
  authorName: string;
  body: string;
  now?: string;
}): { task: Task; comment: TaskComment } {
  const { task, author, authorName, body } = input;
  const now = input.now ?? new Date().toISOString();
  const comment: TaskComment = {
    id: taskCommentId(`${task.id}-${task.comments?.length ?? 0 + 1}`),
    taskId: task.id,
    author,
    authorName,
    body,
    createdAt: now,
  };
  const history = [...(task.history ?? []), taskEvent(task, 'comment-added', author, authorName, 'Comment added', undefined, undefined, now)];
  return { task: withHistory({ ...task, comments: [...(task.comments ?? []), comment] }, history, now), comment };
}

/** Assign a task to a researcher, creating an assignment record. */
export function assignTask(input: {
  task: Task;
  assignee: string;
  assigneeName?: string;
  role?: string;
  assignedBy: string;
  assignedByName?: string;
  now?: string;
}): { task: Task; assignment: TaskAssignment } {
  const { task, assignee, assignedBy } = input;
  const now = input.now ?? new Date().toISOString();
  const assignment: TaskAssignment = {
    id: taskAssignmentId(`${task.id}-${assignee}`),
    taskId: task.id,
    assignee,
    assigneeName: input.assigneeName,
    role: input.role,
    status: 'assigned',
    assignedBy,
    assignedByName: input.assignedByName,
    assignedAt: now,
  };
  const history = [...(task.history ?? []), taskEvent(task, 'assigned', assignedBy, input.assignedByName ?? assignedBy, `Assigned to ${assignee}`, undefined, undefined, now)];
  return {
    task: withHistory(
      { ...task, assignee, assigneeName: input.assigneeName, assignments: [...(task.assignments ?? []), assignment] },
      history,
      now,
    ),
    assignment,
  };
}

/** Update an assignment status. */
export function updateAssignmentStatus(assignment: TaskAssignment, status: TaskAssignmentStatus, now?: string): TaskAssignment {
  return {
    ...assignment,
    status,
    acceptedAt: status === 'accepted' ? assignment.acceptedAt ?? now ?? new Date().toISOString() : assignment.acceptedAt,
    completedAt: status === 'completed' ? now ?? new Date().toISOString() : assignment.completedAt,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Filter tasks by a partial filter. */
export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter((task) => {
    if (filter.status && task.status !== filter.status) {
      return false;
    }
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    if (filter.assignee && task.assignee !== filter.assignee) {
      return false;
    }
    if (filter.workflowId && task.workflowId !== filter.workflowId) {
      return false;
    }
    if (filter.tag && !(task.tags ?? []).includes(filter.tag)) {
      return false;
    }
    return true;
  });
}

/** Search tasks by title, description, and tags. */
export function searchTasks(tasks: Task[], query: string): Task[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  return tasks.filter((task) =>
    [task.title, task.description ?? '', ...(task.tags ?? [])].join(' ').toLowerCase().includes(needle),
  );
}

/** Sort tasks. */
export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'due':
      return sorted.sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
    case 'priority': {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 };
      return sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    }
  }
}

/** Tasks assigned to a researcher. */
export function tasksForAssignee(tasks: Task[], username: string): Task[] {
  return tasks.filter((task) => task.assignee === username);
}

/** Tasks belonging to a workflow. */
export function tasksForWorkflow(tasks: Task[], workflowId: string): Task[] {
  return tasks.filter((task) => task.workflowId === workflowId);
}

/** Open (not done) tasks. */
export function openTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status !== 'done');
}

/** Overdue tasks relative to a reference time. */
export function overdueTasks(tasks: Task[], now: string): Task[] {
  const reference = new Date(now).getTime();
  return tasks.filter((task) => task.status !== 'done' && task.dueDate && new Date(task.dueDate).getTime() < reference);
}

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

/** Derive task statistics. */
export function taskStatistics(tasks: Task[], now: string): TaskStatistics {
  const byStatus: TaskStatistics['byStatus'] = TASK_STATUSES.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  })).filter((stat) => stat.count > 0);
  const byPriority: TaskStatistics['byPriority'] = TASK_PRIORITIES.map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length,
  })).filter((stat) => stat.count > 0);
  const completed = tasks.filter((task) => task.status === 'done').length;
  return {
    totalTasks: tasks.length,
    openTasks: tasks.length - completed,
    completedTasks: completed,
    blockedTasks: tasks.filter((task) => task.status === 'blocked').length,
    inReview: tasks.filter((task) => task.status === 'in-review').length,
    overdueTasks: overdueTasks(tasks, now).length,
    completionRate: tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100),
    byStatus,
    byPriority,
  };
}

/** Derive task analytics. */
export function taskAnalytics(tasks: Task[], now: string): TaskAnalytics {
  const stats = taskStatistics(tasks, now);
  const assignees = new Map<string, { open: number; completed: number }>();
  tasks.forEach((task) => {
    if (!task.assignee) {
      return;
    }
    const entry = assignees.get(task.assignee) ?? { open: 0, completed: 0 };
    if (task.status === 'done') {
      entry.completed += 1;
    } else {
      entry.open += 1;
    }
    assignees.set(task.assignee, entry);
  });
  const byAssignee = [...assignees.entries()].map(([assignee, value]) => {
    const task = tasks.find((entry) => entry.assignee === assignee);
    return { assignee, assigneeName: task?.assigneeName, ...value };
  });
  const days = 7;
  const trend = Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - (days - 1 - index));
    const label = date.toISOString().slice(0, 10);
    return {
      date: label,
      created: tasks.filter((task) => task.createdAt.slice(0, 10) === label).length,
      completed: tasks.filter((task) => task.completedAt?.slice(0, 10) === label).length,
    };
  });
  return {
    byStatus: stats.byStatus,
    byPriority: stats.byPriority,
    byAssignee,
    completionRate: stats.completionRate,
    overdueRate: tasks.length === 0 ? 0 : Math.round((stats.overdueTasks / tasks.length) * 100),
    averageProgress: tasks.length === 0 ? 0 : Math.round(tasks.reduce((total, task) => total + taskProgress(task), 0) / tasks.length),
    trend,
  };
}

/** Build the kanban board view model. */
export function buildTaskBoard(tasks: Task[]): TaskBoardColumn[] {
  return TASK_STATUSES.map((status) => ({
    status,
    tasks: tasks
      .filter((task) => task.status === status)
      .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '')),
  }));
}

const TASK_STATUSES: readonly TaskStatus[] = ['todo', 'in-progress', 'blocked', 'in-review', 'done'];
const TASK_PRIORITIES: readonly TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
