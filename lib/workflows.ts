import type {
  ArtefactChapter,
  ArtefactSection,
  ScholarlyArtefact,
  ScholarlyArtefactStatus,
  Workbench,
  WorkbenchItem,
  WorkbenchItemType,
  WorkbenchVersion,
  WorkflowAnalytics,
  WorkflowDeadline,
  WorkflowFilter,
  WorkflowInsight,
  WorkflowInstance,
  WorkflowLogEntry,
  WorkflowLogEventType,
  WorkflowMilestone,
  WorkflowPortfolio,
  WorkflowPriority,
  WorkflowSort,
  WorkflowStage,
  WorkflowStageStatus,
  WorkflowStatistics,
  WorkflowStatus,
  WorkflowTemplate,
  WorkflowTemplateKind,
  WorkflowTransition,
} from '@/types/workflows';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Workflow Engine (Phase 2.2E SWTROP).
 *
 * The pure orchestration engine of the platform — no React, no side effects,
 * no API calls — deliberately API-shaped so every helper can be exported
 * directly as an endpoint in later phases (Mobile API, Enterprise API). It is
 * template-driven (workflow templates are data, never code), records an
 * append-only audit trail (transitions, log, milestones, deadlines), and owns
 * no external records: everything outside the engine is referenced through
 * `sourceId` + `sourceEntity`. The workbench, promotion engine, artefacts,
 * chapters, sections, milestones, and deadlines all live here.
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

/** Canonical workflow template id prefix. */
export function workflowTemplateId(label: string): string {
  return `wft-${slugOf(label)}`;
}

/** Canonical workflow instance id prefix. */
export function workflowId(label: string): string {
  return `wf-${slugOf(label)}`;
}

/** Canonical workflow stage id prefix. */
export function workflowStageId(workflowIdValue: string, label: string): string {
  return `${workflowIdValue}-stage-${slugOf(label)}`;
}

/** Canonical workflow transition id prefix. */
export function workflowTransitionId(label: string): string {
  return `wftr-${slugOf(label)}`;
}

/** Canonical workflow log entry id prefix. */
export function workflowLogId(label: string): string {
  return `wfl-${slugOf(label)}`;
}

/** Canonical workflow deadline id prefix. */
export function workflowDeadlineId(label: string): string {
  return `wfd-${slugOf(label)}`;
}

/** Canonical workflow milestone id prefix. */
export function workflowMilestoneId(label: string): string {
  return `wfm-${slugOf(label)}`;
}

/** Canonical workbench id prefix. */
export function workbenchId(label: string): string {
  return `wb-${slugOf(label)}`;
}

/** Canonical workbench item id prefix. */
export function workbenchItemId(label: string): string {
  return `wbi-${slugOf(label)}`;
}

/** Canonical workbench version id prefix. */
export function workbenchVersionId(label: string): string {
  return `wbv-${slugOf(label)}`;
}

/** Canonical artefact id prefix. */
export function artefactId(label: string): string {
  return `art-${slugOf(label)}`;
}

/** Canonical artefact chapter id prefix. */
export function artefactChapterId(label: string): string {
  return `artc-${slugOf(label)}`;
}

/** Canonical artefact section id prefix. */
export function artefactSectionId(label: string): string {
  return `arts-${slugOf(label)}`;
}

/** Canonical workflow route. */
export function workflowUrl(workflow: Pick<WorkflowInstance, 'id'>): string {
  return `/workflows/${workflow.id}`;
}

// ---------------------------------------------------------------------------
// Template instantiation
// ---------------------------------------------------------------------------

/** Instantiate a live workflow from a template. */
export function createWorkflowFromTemplate(input: {
  template: WorkflowTemplate;
  owner: string;
  ownerName: string;
  title?: string;
  description?: string;
  priority?: WorkflowPriority;
  sourceId?: string;
  sourceEntity?: string;
  sourceTitle?: string;
  now: string;
}): WorkflowInstance {
  const { template, owner, ownerName, now } = input;
  const id = workflowId(input.title ?? template.name);
  const stages: WorkflowStage[] = template.stages.map((stage) => ({
    id: workflowStageId(id, stage.id),
    workflowId: id,
    templateStageId: stage.id,
    name: stage.name,
    kind: stage.kind,
    order: stage.order,
    status: 'not-started',
    role: stage.role,
    description: stage.description,
    stageId: stage.stageId,
    dueAt: stage.estimatedDurationDays ? addDays(now, stage.estimatedDurationDays) : undefined,
  }));

  const log: WorkflowLogEntry[] = [
    {
      id: workflowLogId(`${id}-created`),
      workflowId: id,
      type: 'created',
      actor: owner,
      actorName: ownerName,
      message: `Workflow "${input.title ?? template.name}" created from template`,
      createdAt: now,
    },
  ];

  return {
    id,
    templateId: template.id,
    title: input.title ?? template.name,
    description: input.description ?? template.description,
    kind: template.kind,
    status: 'draft',
    priority: input.priority ?? 'medium',
    owner,
    ownerName,
    currentStageId: stages[0]?.id,
    stages,
    transitions: [],
    log,
    deadlines: [],
    milestones: [],
    assignees: [],
    tags: [...template.tags],
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    sourceTitle: input.sourceTitle,
    createdAt: now,
    updatedAt: now,
    dueAt: addDays(now, Math.max(...template.stages.map((stage) => stage.estimatedDurationDays ?? 0))),
  };
}

function addDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

// ---------------------------------------------------------------------------
// Transition engine
// ---------------------------------------------------------------------------

/** The allowed status graph of the universal workflow lifecycle. */
export const WORKFLOW_TRANSITIONS: Readonly<Record<WorkflowStatus, readonly WorkflowStatus[]>> = {
  draft: ['assigned', 'in-progress', 'cancelled', 'archived'],
  assigned: ['accepted', 'delegated', 'cancelled'],
  accepted: ['in-progress', 'paused', 'cancelled'],
  'in-progress': ['awaiting-review', 'paused', 'escalated', 'cancelled'],
  'awaiting-review': ['revision-requested', 'approved', 'rejected', 'escalated'],
  'revision-requested': ['revision-submitted', 'cancelled'],
  'revision-submitted': ['awaiting-review', 'approved', 'rejected'],
  approved: ['published', 'completed', 'archived'],
  rejected: ['in-progress', 'archived', 'cancelled'],
  published: ['completed', 'archived'],
  archived: ['in-progress', 'completed'],
  cancelled: [],
  escalated: ['in-progress', 'awaiting-review', 'cancelled'],
  delegated: ['accepted', 'cancelled'],
  paused: ['in-progress', 'cancelled'],
  completed: [],
};

/** Whether a workflow may legally transition between two statuses. */
export function canTransition(from: WorkflowStatus, to: WorkflowStatus): boolean {
  return WORKFLOW_TRANSITIONS[from].includes(to);
}

function appendLog(workflow: WorkflowInstance, entry: Omit<WorkflowLogEntry, 'id' | 'workflowId'>): WorkflowLogEntry {
  return {
    id: workflowLogId(`${workflow.id}-${entry.type}-${workflow.log.length + 1}`),
    workflowId: workflow.id,
    ...entry,
  };
}

/** Apply a status transition, appending the audit trail. */
export function transitionWorkflow(input: {
  workflow: WorkflowInstance;
  to: WorkflowStatus;
  actor: string;
  actorName: string;
  comment?: string;
  now: string;
}): WorkflowInstance {
  const { workflow, to, actor, actorName, comment, now } = input;
  if (!canTransition(workflow.status, to)) {
    return workflow;
  }
  const transition: WorkflowTransition = {
    id: workflowTransitionId(`${workflow.id}-${workflow.transitions.length + 1}`),
    workflowId: workflow.id,
    fromStatus: workflow.status,
    toStatus: to,
    actor,
    actorName,
    comment,
    at: now,
  };
  const logEntry = appendLog(workflow, {
    type: statusEventType(to),
    actor,
    actorName,
    message: comment ? `${workflow.status} → ${to}: ${comment}` : `${workflow.status} → ${to}`,
    createdAt: now,
  });
  return {
    ...workflow,
    status: to,
    transitions: [...workflow.transitions, transition],
    log: [...workflow.log, logEntry],
    updatedAt: now,
    startedAt: workflow.startedAt ?? (to === 'in-progress' ? now : undefined),
    completedAt: to === 'completed' ? now : workflow.completedAt,
  };
}

function statusEventType(status: WorkflowStatus): WorkflowLogEventType {
  switch (status) {
    case 'assigned':
      return 'assigned';
    case 'accepted':
      return 'accepted';
    case 'awaiting-review':
      return 'status-changed';
    case 'revision-requested':
      return 'revision-requested';
    case 'revision-submitted':
      return 'revision-submitted';
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'published':
      return 'published';
    case 'archived':
      return 'archived';
    case 'cancelled':
      return 'cancelled';
    case 'escalated':
      return 'escalated';
    case 'delegated':
      return 'delegated';
    case 'paused':
      return 'paused';
    case 'completed':
      return 'completed';
    case 'in-progress':
      return 'started';
    default:
      return 'status-changed';
  }
}

/** Convenience transitions. */
export const submitWorkflowForReview = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'awaiting-review', actor, actorName, now });

export const requestWorkflowRevision = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  comment: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'revision-requested', actor, actorName, comment, now });

export const submitWorkflowRevision = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'revision-submitted', actor, actorName, now });

export const approveWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  comment?: string,
  now: string = new Date().toISOString(),
): WorkflowInstance => transitionWorkflow({ workflow, to: 'approved', actor, actorName, comment, now });

export const rejectWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  comment: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'rejected', actor, actorName, comment, now });

export const publishWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'published', actor, actorName, now });

export const escalateWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  comment: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'escalated', actor, actorName, comment, now });

export const delegateWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'delegated', actor, actorName, now });

export const pauseWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'paused', actor, actorName, now });

export const resumeWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'in-progress', actor, actorName, now });

export const archiveWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'archived', actor, actorName, now });

export const cancelWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  comment?: string,
  now: string = new Date().toISOString(),
): WorkflowInstance => transitionWorkflow({ workflow, to: 'cancelled', actor, actorName, comment, now });

export const completeWorkflow = (
  workflow: WorkflowInstance,
  actor: string,
  actorName: string,
  now: string,
): WorkflowInstance => transitionWorkflow({ workflow, to: 'completed', actor, actorName, now });

// ---------------------------------------------------------------------------
// Stage engine
// ---------------------------------------------------------------------------

/** The current active stage — the first stage not yet completed or skipped. */
export function currentStage(workflow: WorkflowInstance): WorkflowStage | undefined {
  return [...workflow.stages]
    .sort((a, b) => a.order - b.order)
    .find((stage) => stage.status !== 'completed' && stage.status !== 'skipped');
}

/** Set a stage status, keeping the workflow in sync where applicable. */
export function setStageStatus(input: {
  workflow: WorkflowInstance;
  stageId: string;
  status: WorkflowStageStatus;
  actor: string;
  actorName: string;
  comment?: string;
  now: string;
}): WorkflowInstance {
  const { workflow, stageId, status, actor, actorName, comment, now } = input;
  const stage = workflow.stages.find((entry) => entry.id === stageId);
  if (!stage) {
    return workflow;
  }
  const nextStageStatus: WorkflowStageStatus = status === 'completed' || status === 'skipped' ? 'completed' : status;
  const event: WorkflowLogEventType = status === 'skipped' ? 'stage-skipped' : status === 'completed' ? 'stage-completed' : 'stage-started';
  const logEntry = appendLog(workflow, {
    type: event,
    actor,
    actorName,
    message: comment ?? `Stage "${stage.name}" → ${status}`,
    createdAt: now,
  });
  const updated = {
    ...workflow,
    stages: workflow.stages.map((entry) =>
      entry.id === stageId
        ? {
            ...entry,
            status: nextStageStatus,
            startedAt: entry.startedAt ?? now,
            completedAt: nextStageStatus === 'completed' ? now : entry.completedAt,
          }
        : entry,
    ),
    log: [...workflow.log, logEntry],
    updatedAt: now,
  };
  return {
    ...updated,
    currentStageId: currentStage(updated)?.id,
  };
}

/** Overall progress of a workflow, 0-1. */
export function workflowProgress(workflow: WorkflowInstance): number {
  if (workflow.stages.length === 0) {
    return workflow.status === 'completed' ? 1 : 0;
  }
  const completed = workflow.stages.filter((stage) => stage.status === 'completed').length;
  return completed / workflow.stages.length;
}

/** Completed stage count. */
export function completedStages(workflow: WorkflowInstance): number {
  return workflow.stages.filter((stage) => stage.status === 'completed').length;
}

// ---------------------------------------------------------------------------
// Deadline engine
// ---------------------------------------------------------------------------

/** Compute the derived deadline status against a reference time. */
export function deadlineStatus(
  deadline: Pick<WorkflowDeadline, 'dueAt' | 'extendedTo' | 'gracePeriodDays' | 'status'>,
  now: string,
): WorkflowDeadline['status'] {
  if (deadline.status === 'met') {
    return 'met';
  }
  const due = new Date(deadline.extendedTo ?? deadline.dueAt);
  const reference = new Date(now);
  if (deadline.extendedTo) {
    return due.getTime() < reference.getTime() ? 'overdue' : 'extended';
  }
  const graceMs = (deadline.gracePeriodDays ?? 0) * 24 * 60 * 60 * 1000;
  if (due.getTime() < reference.getTime() - graceMs) {
    return 'overdue';
  }
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  return due.getTime() - reference.getTime() <= threeDays ? 'due-soon' : 'upcoming';
}

/** Refresh every deadline status on a workflow. */
export function refreshDeadlines(workflow: WorkflowInstance, now: string): WorkflowInstance {
  return {
    ...workflow,
    deadlines: workflow.deadlines.map((deadline) => ({ ...deadline, status: deadlineStatus(deadline, now) })),
  };
}

/** Attach a new deadline to a workflow. */
export function addWorkflowDeadline(input: {
  workflow: WorkflowInstance;
  title: string;
  dueAt: string;
  gracePeriodDays?: number;
  recurring?: boolean;
  reminderScheduleDays?: number[];
  sourceId?: string;
  sourceEntity?: string;
  actor: string;
  actorName: string;
  now: string;
}): WorkflowInstance {
  const { workflow, title, dueAt, actor, actorName, now, sourceId, sourceEntity } = input;
  const deadline: WorkflowDeadline = {
    id: workflowDeadlineId(title),
    workflowId: workflow.id,
    title,
    dueAt,
    status: 'upcoming',
    gracePeriodDays: input.gracePeriodDays,
    recurring: input.recurring,
    reminderScheduleDays: input.reminderScheduleDays,
    sourceId,
    sourceEntity,
  };
  deadline.status = deadlineStatus(deadline, now);
  const logEntry = appendLog(workflow, {
    type: 'deadline-set',
    actor,
    actorName,
    message: `Deadline "${title}" set for ${new Date(dueAt).toISOString().slice(0, 10)}`,
    createdAt: now,
  });
  return { ...workflow, deadlines: [...workflow.deadlines, deadline], log: [...workflow.log, logEntry], updatedAt: now };
}

/** Extend a deadline, appending the audit trail. */
export function extendWorkflowDeadline(input: {
  workflow: WorkflowInstance;
  deadlineId: string;
  extendedTo: string;
  actor: string;
  actorName: string;
  now: string;
}): WorkflowInstance {
  const { workflow, deadlineId, extendedTo, actor, actorName, now } = input;
  const deadline = workflow.deadlines.find((entry) => entry.id === deadlineId);
  if (!deadline) {
    return workflow;
  }
  const logEntry = appendLog(workflow, {
    type: 'deadline-extended',
    actor,
    actorName,
    message: `Deadline "${deadline.title}" extended to ${new Date(extendedTo).toISOString().slice(0, 10)}`,
    createdAt: now,
  });
  return {
    ...workflow,
    deadlines: workflow.deadlines.map((entry) =>
      entry.id === deadlineId
        ? { ...entry, extendedTo, status: 'extended' }
        : entry,
    ),
    log: [...workflow.log, logEntry],
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Milestone engine
// ---------------------------------------------------------------------------

/** Add a milestone to a workflow, aligned to a canonical lifecycle stage. */
export function addWorkflowMilestone(input: {
  workflow: WorkflowInstance;
  title: string;
  stageId: ResearchLifecycleStageId;
  description?: string;
  targetDate?: string;
  sourceId?: string;
  sourceEntity?: string;
}): WorkflowInstance {
  const { workflow, title, stageId } = input;
  const milestone: WorkflowMilestone = {
    id: workflowMilestoneId(`${workflow.id}-${title}`),
    workflowId: workflow.id,
    title,
    description: input.description,
    status: 'planned',
    stageId,
    targetDate: input.targetDate,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
  };
  return { ...workflow, milestones: [...workflow.milestones, milestone], updatedAt: input.targetDate ?? workflow.updatedAt };
}

/** Mark a milestone achieved, appending the audit trail. */
export function achieveWorkflowMilestone(input: {
  workflow: WorkflowInstance;
  milestoneId: string;
  actor: string;
  actorName: string;
  now: string;
}): WorkflowInstance {
  const { workflow, milestoneId, actor, actorName, now } = input;
  const milestone = workflow.milestones.find((entry) => entry.id === milestoneId);
  if (!milestone || milestone.status === 'achieved') {
    return workflow;
  }
  const logEntry = appendLog(workflow, {
    type: 'milestone-reached',
    actor,
    actorName,
    message: `Milestone "${milestone.title}" achieved`,
    createdAt: now,
  });
  return {
    ...workflow,
    milestones: workflow.milestones.map((entry) =>
      entry.id === milestoneId ? { ...entry, status: 'achieved', achievedAt: now } : entry,
    ),
    log: [...workflow.log, logEntry],
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Workbench & promotion engine
// ---------------------------------------------------------------------------

/** Create a private workbench item. */
export function createWorkbenchItem(input: {
  workbench: Workbench;
  type: WorkbenchItemType;
  title: string;
  body?: string;
  content?: string;
  tags?: string[];
  sourceId?: string;
  sourceEntity?: string;
  now: string;
}): Workbench {
  const { workbench, type, title, now } = input;
  const item: WorkbenchItem = {
    id: workbenchItemId(title),
    workbenchId: workbench.id,
    type,
    title,
    body: input.body,
    content: input.content,
    status: 'draft',
    tags: input.tags ?? [],
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  return { ...workbench, items: [item, ...workbench.items], updatedAt: now };
}

/** Update an item, snapshotting the previous version for the audit trail. */
export function updateWorkbenchItem(input: {
  workbench: Workbench;
  itemId: string;
  title?: string;
  body?: string;
  content?: string;
  tags?: string[];
  note?: string;
  now: string;
}): Workbench {
  const { workbench, itemId, now } = input;
  const item = workbench.items.find((entry) => entry.id === itemId);
  if (!item) {
    return workbench;
  }
  const nextVersion = item.version + 1;
  const snapshot: WorkbenchVersion = {
    id: workbenchVersionId(`${itemId}-v${item.version}`),
    itemId,
    version: item.version,
    title: item.title,
    body: item.body,
    content: item.content,
    note: input.note,
    createdAt: now,
  };
  return {
    ...workbench,
    items: workbench.items.map((entry) =>
      entry.id === itemId
        ? {
            ...entry,
            title: input.title ?? entry.title,
            body: input.body ?? entry.body,
            content: input.content ?? entry.content,
            tags: input.tags ?? entry.tags,
            version: nextVersion,
            updatedAt: now,
          }
        : entry,
    ),
    versions: [snapshot, ...workbench.versions],
    updatedAt: now,
  };
}

/** Archive a workbench item. */
export function archiveWorkbenchItem(workbench: Workbench, itemId: string): Workbench {
  return {
    ...workbench,
    items: workbench.items.map((entry) => (entry.id === itemId ? { ...entry, status: 'archived' } : entry)),
    updatedAt: workbench.updatedAt,
  };
}

/** Mark a workbench item as promoted to an artefact or workflow. */
export function promoteWorkbenchItem(input: {
  workbench: Workbench;
  itemId: string;
  promotedTo: string;
  now: string;
}): Workbench {
  const { workbench, itemId, promotedTo, now } = input;
  return {
    ...workbench,
    items: workbench.items.map((entry) =>
      entry.id === itemId
        ? { ...entry, status: 'promoted', promotedTo, promotedAt: now, updatedAt: now }
        : entry,
    ),
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Artefact & chapter/section engine
// ---------------------------------------------------------------------------

/** Build a canonical artefact from a promoted workbench item. */
export function createArtefactFromWorkbenchItem(input: {
  workbench: Workbench;
  itemId: string;
  type: ScholarlyArtefact['type'];
  title?: string;
  owner: string;
  ownerName: string;
  now: string;
}): { workbench: Workbench; artefact: ScholarlyArtefact } {
  const { workbench, itemId, now, owner, ownerName } = input;
  const item = workbench.items.find((entry) => entry.id === itemId);
  if (!item) {
    throw new Error(`Missing workbench item: ${itemId}`);
  }
  const artefactType = input.type;
  const artefact: ScholarlyArtefact = {
    id: artefactId(item.title),
    title: input.title ?? item.title,
    description: item.body,
    type: artefactType,
    status: 'draft',
    owner,
    ownerName,
    chapters: [],
    sections: [],
    sourceId: item.sourceId,
    sourceEntity: item.sourceEntity ?? 'workbench',
    sourceTitle: item.title,
    createdAt: now,
    updatedAt: now,
  };
  return { workbench: promoteWorkbenchItem({ workbench, itemId, promotedTo: artefact.id, now }), artefact };
}

/** Append a chapter to an artefact. */
export function addArtefactChapter(input: {
  artefact: ScholarlyArtefact;
  title: string;
  now: string;
}): ScholarlyArtefact {
  const { artefact, title, now } = input;
  const order = artefact.chapters.length + 1;
  const chapter: ArtefactChapter = {
    id: artefactChapterId(`${artefact.id}-${title}`),
    artefactId: artefact.id,
    title,
    order,
    status: 'draft',
    sections: [],
    createdAt: now,
    updatedAt: now,
  };
  return { ...artefact, chapters: [...artefact.chapters, chapter], updatedAt: now };
}

/** Append a section to a chapter. */
export function addArtefactSection(input: {
  artefact: ScholarlyArtefact;
  chapterId: string;
  title: string;
  content?: string;
  now: string;
}): ScholarlyArtefact {
  const { artefact, chapterId, title, now } = input;
  const chapter = artefact.chapters.find((entry) => entry.id === chapterId);
  if (!chapter) {
    return artefact;
  }
  const section: ArtefactSection = {
    id: artefactSectionId(`${artefact.id}-${title}`),
    artefactId: artefact.id,
    title,
    order: chapter.sections.length + 1,
    status: 'draft',
    content: input.content,
    wordCount: input.content ? wordCountOf(input.content) : 0,
    createdAt: now,
    updatedAt: now,
  };
  return {
    ...artefact,
    chapters: artefact.chapters.map((entry) =>
      entry.id === chapterId ? { ...entry, sections: [...entry.sections, section], updatedAt: now } : entry,
    ),
    updatedAt: now,
  };
}

/** Promote a canonical artefact into a live workflow from a template. */
export function promoteArtefactToWorkflow(input: {
  artefact: ScholarlyArtefact;
  template: WorkflowTemplate;
  priority?: WorkflowPriority;
  now: string;
}): { artefact: ScholarlyArtefact; workflow: WorkflowInstance } {
  const { artefact, template, now } = input;
  const workflow = createWorkflowFromTemplate({
    template,
    owner: artefact.owner,
    ownerName: artefact.ownerName,
    title: artefact.title,
    description: artefact.description,
    priority: input.priority,
    sourceId: artefact.id,
    sourceEntity: 'artefact',
    sourceTitle: artefact.title,
    now,
  });
  return {
    artefact: { ...artefact, status: 'under-review', promotedAt: now, updatedAt: now },
    workflow,
  };
}

function wordCountOf(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

/** Total word count of an artefact. */
export function artefactWordCount(artefact: ScholarlyArtefact): number {
  const sections = artefact.sections.concat(artefact.chapters.flatMap((chapter) => chapter.sections));
  return sections.reduce((total, section) => total + (section.wordCount ?? 0), 0);
}

/** Progress of a chapter, 0-1, based on approved sections. */
export function chapterProgress(chapter: ArtefactChapter): number {
  if (chapter.sections.length === 0) {
    return 0;
  }
  return chapter.sections.filter((section) => section.status === 'approved').length / chapter.sections.length;
}

/** Set an artefact section status. */
export function setArtefactSectionStatus(input: {
  artefact: ScholarlyArtefact;
  sectionId: string;
  status: ArtefactSection['status'];
  reviewer?: string;
  reviewerName?: string;
  now: string;
}): ScholarlyArtefact {
  const { artefact, sectionId, status, now } = input;
  const mapSection = (section: ArtefactSection): ArtefactSection =>
    section.id === sectionId
      ? { ...section, status, reviewer: input.reviewer ?? section.reviewer, reviewerName: input.reviewerName ?? section.reviewerName, updatedAt: now }
      : section;
  return {
    ...artefact,
    sections: artefact.sections.map(mapSection),
    chapters: artefact.chapters.map((chapter) => ({
      ...chapter,
      sections: chapter.sections.map(mapSection),
      status: deriveChapterStatus(chapter),
      updatedAt: now,
    })),
    updatedAt: now,
  };
}

function deriveChapterStatus(chapter: ArtefactChapter): ArtefactChapter['status'] {
  const statuses = chapter.sections.map((section) => section.status);
  if (statuses.length > 0 && statuses.every((status) => status === 'approved')) {
    return 'approved';
  }
  if (statuses.some((status) => status === 'revision-requested')) {
    return 'revision-requested';
  }
  if (statuses.some((status) => status === 'awaiting-review')) {
    return 'awaiting-review';
  }
  if (statuses.some((status) => status === 'in-progress')) {
    return 'in-progress';
  }
  return chapter.status;
}

/** Set the overall status of an artefact. */
export function setArtefactStatus(
  artefact: ScholarlyArtefact,
  status: ScholarlyArtefactStatus,
  now: string,
): ScholarlyArtefact {
  return { ...artefact, status, updatedAt: now };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Filter workflows by a partial filter. */
export function filterWorkflows(workflows: WorkflowInstance[], filter: WorkflowFilter): WorkflowInstance[] {
  return workflows.filter((workflow) => {
    if (filter.kind && workflow.kind !== filter.kind) {
      return false;
    }
    if (filter.status && workflow.status !== filter.status) {
      return false;
    }
    if (filter.priority && workflow.priority !== filter.priority) {
      return false;
    }
    if (filter.assignee) {
      const assigned = workflow.stages.some(
        (stage) => stage.assignee === filter.assignee || (stage.assignee ?? '').startsWith(filter.assignee ?? ''),
      );
      if (!assigned && workflow.owner !== filter.assignee) {
        return false;
      }
    }
    if (filter.tag && !workflow.tags.includes(filter.tag)) {
      return false;
    }
    return true;
  });
}

/** Search workflows by title, description, and tags. */
export function searchWorkflows(workflows: WorkflowInstance[], query: string): WorkflowInstance[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  return workflows.filter((workflow) =>
    [workflow.title, workflow.description ?? '', workflow.sourceTitle ?? '', ...workflow.tags]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
}

/** Sort workflows. */
export function sortWorkflows(workflows: WorkflowInstance[], sort: WorkflowSort): WorkflowInstance[] {
  const sorted = [...workflows];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    case 'priority': {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 };
      return sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    case 'progress':
      return sorted.sort((a, b) => workflowProgress(b) - workflowProgress(a));
  }
}

/** Workflows owned by or involving a researcher. */
export function workflowsForUser(workflows: WorkflowInstance[], username: string): WorkflowInstance[] {
  return workflows.filter(
    (workflow) =>
      workflow.owner === username ||
      workflow.stages.some((stage) => stage.assignee === username),
  );
}

/** Workflows currently awaiting a given researcher's action. */
export function workflowsAwaiting(workflows: WorkflowInstance[], username: string): WorkflowInstance[] {
  return workflows.filter((workflow) => {
    const active = currentStage(workflow);
    return active?.assignee === username || workflow.owner === username;
  });
}

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

/** Derive workflow statistics. */
export function workflowStatistics(workflows: WorkflowInstance[], now: string): WorkflowStatistics {
  const totalStages = workflows.reduce((total, workflow) => total + workflow.stages.length, 0);
  const completed = workflows.reduce((total, workflow) => total + completedStages(workflow), 0);
  const deadlines = workflows.flatMap((workflow) => workflow.deadlines.map((deadline) => deadlineStatus(deadline, now)));
  const milestones = workflows.flatMap((workflow) => workflow.milestones);
  return {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter((workflow) => !['completed', 'archived', 'cancelled'].includes(workflow.status)).length,
    inProgress: workflows.filter((workflow) => workflow.status === 'in-progress').length,
    awaitingReview: workflows.filter((workflow) => workflow.status === 'awaiting-review').length,
    revisionRequested: workflows.filter((workflow) => workflow.status === 'revision-requested').length,
    completed: workflows.filter((workflow) => workflow.status === 'completed').length,
    archived: workflows.filter((workflow) => workflow.status === 'archived').length,
    byStatus: statusDistribution(workflows),
    byKind: kindDistribution(workflows),
    totalStages,
    completedStages: completed,
    overallProgress: totalStages === 0 ? 0 : Math.round((completed / totalStages) * 100),
    overdueDeadlines: deadlines.filter((status) => status === 'overdue').length,
    upcomingDeadlines: deadlines.filter((status) => status === 'upcoming' || status === 'due-soon').length,
    totalMilestones: milestones.length,
    achievedMilestones: milestones.filter((milestone) => milestone.status === 'achieved').length,
  };
}

function statusDistribution(workflows: WorkflowInstance[]): WorkflowStatistics['byStatus'] {
  const counts = new Map<WorkflowStatus, number>();
  workflows.forEach((workflow) => counts.set(workflow.status, (counts.get(workflow.status) ?? 0) + 1));
  return [...counts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

function kindDistribution(workflows: WorkflowInstance[]): WorkflowStatistics['byKind'] {
  const counts = new Map<WorkflowTemplateKind, number>();
  workflows.forEach((workflow) => counts.set(workflow.kind, (counts.get(workflow.kind) ?? 0) + 1));
  return [...counts.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
}

/** Derive workflow analytics. */
export function workflowAnalytics(workflows: WorkflowInstance[], now: string): WorkflowAnalytics {
  const stats = workflowStatistics(workflows, now);
  const deadlines = workflows.flatMap((workflow) => workflow.deadlines.map((deadline) => deadlineStatus(deadline, now)));
  const days = 7;
  const recentActivity = Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - (days - 1 - index));
    const label = date.toISOString().slice(0, 10);
    const count = workflows.reduce(
      (total, workflow) =>
        total + workflow.log.filter((entry) => entry.createdAt.slice(0, 10) === label).length,
      0,
    );
    return { date: label, count };
  });
  return {
    statusDistribution: stats.byStatus,
    kindDistribution: stats.byKind,
    completionRate: stats.totalWorkflows === 0 ? 0 : Math.round((stats.completed / stats.totalWorkflows) * 100),
    averageProgress: stats.overallProgress,
    stageCompletionRate: stats.totalStages === 0 ? 0 : Math.round((stats.completedStages / stats.totalStages) * 100),
    deadlineHealth: {
      upcoming: deadlines.filter((status) => status === 'upcoming').length,
      dueSoon: deadlines.filter((status) => status === 'due-soon').length,
      overdue: deadlines.filter((status) => status === 'overdue').length,
      met: deadlines.filter((status) => status === 'met').length,
      extended: deadlines.filter((status) => status === 'extended').length,
    },
    escalated: workflows.filter((workflow) => workflow.status === 'escalated').length,
    delegated: workflows.filter((workflow) => workflow.status === 'delegated').length,
    averageStagesPerWorkflow:
      workflows.length === 0 ? 0 : Math.round((stats.totalStages / workflows.length) * 10) / 10,
    recentActivity,
  };
}

/** Derive AI-readable insights over the workflow graph. */
export function workflowInsights(workflows: WorkflowInstance[]): WorkflowInsight[] {
  const insights: WorkflowInsight[] = [];
  const overdue = workflows.filter((workflow) =>
    workflow.deadlines.some((deadline) => deadline.status === 'overdue'),
  );
  if (overdue.length > 0) {
    insights.push({
      id: 'insight-overdue-deadlines',
      title: 'Overdue deadlines need attention',
      description: `${overdue.length} workflow${overdue.length === 1 ? '' : 's'} ha${overdue.length === 1 ? 's' : 've'} at least one overdue deadline. Review scheduling before escalation.`,
      tone: 'warning',
      tag: 'deadlines',
    });
  }
  const awaiting = workflows.filter((workflow) => workflow.status === 'awaiting-review');
  if (awaiting.length > 0) {
    insights.push({
      id: 'insight-awaiting-review',
      title: 'Awaiting review',
      description: `${awaiting.length} workflow${awaiting.length === 1 ? '' : 's'} awaiting review by assigned reviewers.`,
      tone: 'neutral',
      tag: 'review',
    });
  }
  const onTrack = workflows.filter((workflow) => workflow.status === 'in-progress').length;
  if (onTrack >= 3) {
    insights.push({
      id: 'insight-healthy-pipeline',
      title: 'Healthy in-progress pipeline',
      description: `${onTrack} workflows currently in progress with no reported blockers.`,
      tone: 'positive',
      tag: 'pipeline',
    });
  }
  const paused = workflows.filter((workflow) => workflow.status === 'paused');
  if (paused.length > 0) {
    insights.push({
      id: 'insight-paused-workflows',
      title: 'Paused workflows can be resumed',
      description: `${paused.length} workflow${paused.length === 1 ? '' : 's'} paused. Re-confirm intent to avoid stalls.`,
      tone: 'neutral',
      tag: 'resume',
    });
  }
  return insights;
}

/** Build the workflow portfolio aggregate root. */
export function buildWorkflowPortfolio(
  workflows: WorkflowInstance[],
  templates: WorkflowTemplate[],
  options: { now: string; top?: number },
): WorkflowPortfolio {
  const { now, top = 4 } = options;
  const recent = [...workflows]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, top);
  const log = [...workflows]
    .flatMap((workflow) => workflow.log)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, top * 3);
  return {
    workflows,
    templates,
    statistics: workflowStatistics(workflows, now),
    analytics: workflowAnalytics(workflows, now),
    insights: workflowInsights(workflows),
    featured: recent,
    recent,
    log,
  };
}
