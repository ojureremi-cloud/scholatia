import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Workflow Engine — canonical types (Phase 2.2E SWTROP).
 *
 * The workflow engine is the platform-wide orchestration layer. Every later
 * module (SAES, Thesis Supervision, Journal Editorial, Conference Management,
 * Grants, Marketplace, Services, Institutions) consumes this engine instead of
 * building its own. It is deliberately template-driven: workflow templates are
 * data, so new workflow kinds require no engine modification.
 *
 * The workbench, scholarly artefacts, chapters, sections, milestones, and
 * deadlines are part of this engine's domain. Everything else is referenced
 * through the canonical `sourceId` + `sourceEntity` pattern — never duplicated.
 */

// ---------------------------------------------------------------------------
// Workflow templates & instances
// ---------------------------------------------------------------------------

/** The kinds of workflow the template catalogue can express. */
export type WorkflowTemplateKind =
  | 'undergraduate-project'
  | 'masters-dissertation'
  | 'phd-thesis'
  | 'journal-submission'
  | 'conference-submission'
  | 'book-publishing'
  | 'grant-proposal'
  | 'ethics-review'
  | 'consultancy-project'
  | 'institutional-approval'
  | 'marketplace-delivery'
  | 'service-delivery';

/** The universal lifecycle of a workflow instance. */
export type WorkflowStatus =
  | 'draft'
  | 'assigned'
  | 'accepted'
  | 'in-progress'
  | 'awaiting-review'
  | 'revision-requested'
  | 'revision-submitted'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'cancelled'
  | 'escalated'
  | 'delegated'
  | 'paused'
  | 'completed';

/** The urgency of a workflow instance. */
export type WorkflowPriority = 'low' | 'medium' | 'high' | 'urgent';

/** The lifecycle of a single stage inside a workflow. */
export type WorkflowStageStatus =
  | 'not-started'
  | 'in-progress'
  | 'awaiting-review'
  | 'revision-requested'
  | 'revision-submitted'
  | 'approved'
  | 'rejected'
  | 'skipped'
  | 'completed'
  | 'on-hold';

/** The nature of a workflow stage. */
export type WorkflowStageKind = 'review' | 'approval' | 'task' | 'milestone' | 'submission' | 'decision' | 'notification' | 'examination';

/** Platform roles a workflow stage can be assigned to. */
export type WorkflowRole =
  | 'supervisor'
  | 'co-supervisor'
  | 'student'
  | 'internal-examiner'
  | 'external-examiner'
  | 'committee-member'
  | 'editor'
  | 'associate-editor'
  | 'handling-editor'
  | 'reviewer'
  | 'editorial-assistant'
  | 'publisher'
  | 'conference-chair'
  | 'scientific-committee'
  | 'principal-investigator'
  | 'co-investigator'
  | 'researcher'
  | 'grant-officer'
  | 'client'
  | 'provider'
  | 'author'
  | 'institution-officer';

/** The event vocabulary of the append-only workflow log. */
export type WorkflowLogEventType =
  | 'created'
  | 'assigned'
  | 'accepted'
  | 'started'
  | 'status-changed'
  | 'stage-started'
  | 'stage-completed'
  | 'stage-skipped'
  | 'revision-requested'
  | 'revision-submitted'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'escalated'
  | 'delegated'
  | 'paused'
  | 'resumed'
  | 'deadline-set'
  | 'deadline-extended'
  | 'deadline-overdue'
  | 'milestone-reached'
  | 'comment-added'
  | 'notification-sent'
  | 'archived'
  | 'cancelled'
  | 'completed';

/** A stage definition inside a workflow template. */
export interface WorkflowStageTemplate {
  id: string;
  name: string;
  kind: WorkflowStageKind;
  order: number;
  role: WorkflowRole;
  description?: string;
  stageId?: ResearchLifecycleStageId;
  estimatedDurationDays?: number;
  optional?: boolean;
}

/** A reusable, data-driven workflow definition. Templates are never code. */
export interface WorkflowTemplate {
  id: string;
  name: string;
  kind: WorkflowTemplateKind;
  description: string;
  audience: string;
  ownerRole: WorkflowRole;
  stages: WorkflowStageTemplate[];
  tags: string[];
  sourceEntity?: string;
}

/** A concrete stage inside a live workflow instance. */
export interface WorkflowStage {
  id: string;
  workflowId: string;
  templateStageId?: string;
  name: string;
  kind: WorkflowStageKind;
  order: number;
  status: WorkflowStageStatus;
  role: WorkflowRole;
  assignee?: string;
  assigneeName?: string;
  description?: string;
  stageId?: ResearchLifecycleStageId;
  startedAt?: string;
  completedAt?: string;
  dueAt?: string;
  sourceId?: string;
  sourceEntity?: string;
}

/** A recorded status transition of a workflow instance. */
export interface WorkflowTransition {
  id: string;
  workflowId: string;
  fromStatus: WorkflowStatus;
  toStatus: WorkflowStatus;
  actor: string;
  actorName: string;
  comment?: string;
  at: string;
}

/** An entry in the append-only workflow log. */
export interface WorkflowLogEntry {
  id: string;
  workflowId: string;
  type: WorkflowLogEventType;
  actor: string;
  actorName: string;
  message: string;
  createdAt: string;
}

/** The lifecycle of a workflow deadline. */
export type WorkflowDeadlineStatus = 'upcoming' | 'due-soon' | 'overdue' | 'met' | 'extended';

/** A deadline attached to a workflow, with extension and reminder state. */
export interface WorkflowDeadline {
  id: string;
  workflowId: string;
  title: string;
  dueAt: string;
  status: WorkflowDeadlineStatus;
  extendedTo?: string;
  gracePeriodDays?: number;
  recurring?: boolean;
  reminderScheduleDays?: number[];
  sourceId?: string;
  sourceEntity?: string;
}

/** The lifecycle of a workflow milestone, aligned to the research lifecycle. */
export type WorkflowMilestoneStatus = 'planned' | 'in-progress' | 'achieved' | 'missed';

/** A milestone inside a workflow, aligned to a canonical lifecycle stage. */
export interface WorkflowMilestone {
  id: string;
  workflowId: string;
  title: string;
  description?: string;
  status: WorkflowMilestoneStatus;
  stageId: ResearchLifecycleStageId;
  targetDate?: string;
  achievedAt?: string;
  sourceId?: string;
  sourceEntity?: string;
}

/** A live workflow instance assembled from a template. */
export interface WorkflowInstance {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  kind: WorkflowTemplateKind;
  status: WorkflowStatus;
  priority: WorkflowPriority;
  owner: string;
  ownerName: string;
  currentStageId?: string;
  stages: WorkflowStage[];
  transitions: WorkflowTransition[];
  log: WorkflowLogEntry[];
  deadlines: WorkflowDeadline[];
  milestones: WorkflowMilestone[];
  assignees: WorkflowRole[];
  tags: string[];
  sourceId?: string;
  sourceEntity?: string;
  sourceTitle?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  dueAt?: string;
}

// ---------------------------------------------------------------------------
// Workbench
// ---------------------------------------------------------------------------

/** The kinds of private research workbench items. */
export type WorkbenchItemType =
  | 'note'
  | 'brainstorm'
  | 'outline'
  | 'reference'
  | 'pdf'
  | 'dataset'
  | 'clipping'
  | 'screenshot'
  | 'calculation'
  | 'voice-note'
  | 'ai-note'
  | 'draft-section'
  | 'draft-chapter'
  | 'temp-file';

/** The lifecycle of a workbench item. */
export type WorkbenchItemStatus = 'draft' | 'active' | 'archived' | 'promoted';

/** A private workbench item. Nothing enters a workflow until promoted. */
export interface WorkbenchItem {
  id: string;
  workbenchId: string;
  type: WorkbenchItemType;
  title: string;
  body?: string;
  content?: string;
  status: WorkbenchItemStatus;
  tags: string[];
  sourceId?: string;
  sourceEntity?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  promotedTo?: string;
  promotedAt?: string;
}

/** An immutable version snapshot of a workbench item. */
export interface WorkbenchVersion {
  id: string;
  itemId: string;
  version: number;
  title: string;
  body?: string;
  content?: string;
  note?: string;
  createdAt: string;
}

/** The private workbench of a researcher. */
export interface Workbench {
  id: string;
  owner: string;
  ownerName: string;
  items: WorkbenchItem[];
  versions: WorkbenchVersion[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Scholarly artefacts
// ---------------------------------------------------------------------------

/** The kinds of canonical scholarly artefacts the platform recognises. */
export type ScholarlyArtefactType =
  | 'manuscript'
  | 'thesis'
  | 'dissertation'
  | 'proposal'
  | 'report'
  | 'grant'
  | 'dataset'
  | 'book'
  | 'chapter'
  | 'conference-paper'
  | 'project';

/** The lifecycle of an artefact section or chapter. */
export type ArtefactSectionStatus =
  | 'draft'
  | 'in-progress'
  | 'awaiting-review'
  | 'revision-requested'
  | 'revision-submitted'
  | 'approved';

/** A section of an artefact, reviewable independently. */
export interface ArtefactSection {
  id: string;
  artefactId: string;
  title: string;
  order: number;
  status: ArtefactSectionStatus;
  content?: string;
  wordCount?: number;
  reviewer?: string;
  reviewerName?: string;
  createdAt: string;
  updatedAt: string;
}

/** A chapter of an artefact, composed of sections. */
export interface ArtefactChapter {
  id: string;
  artefactId: string;
  title: string;
  order: number;
  status: ArtefactSectionStatus;
  sections: ArtefactSection[];
  createdAt: string;
  updatedAt: string;
}

/** The lifecycle of a scholarly artefact. */
export type ScholarlyArtefactStatus = 'draft' | 'in-progress' | 'under-review' | 'approved' | 'published' | 'archived';

/** A canonical scholarly artefact owned by a researcher. */
export interface ScholarlyArtefact {
  id: string;
  title: string;
  description?: string;
  type: ScholarlyArtefactType;
  status: ScholarlyArtefactStatus;
  owner: string;
  ownerName: string;
  chapters: ArtefactChapter[];
  sections: ArtefactSection[];
  sourceId?: string;
  sourceEntity?: string;
  sourceTitle?: string;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
  promotedAt?: string;
}

// ---------------------------------------------------------------------------
// Derived view models
// ---------------------------------------------------------------------------

export interface WorkflowStatusStat {
  status: WorkflowStatus;
  count: number;
}

export interface WorkflowKindStat {
  kind: WorkflowTemplateKind;
  count: number;
}

export interface WorkflowDeadlineHealth {
  upcoming: number;
  dueSoon: number;
  overdue: number;
  met: number;
  extended: number;
}

export interface WorkflowStatistics {
  totalWorkflows: number;
  activeWorkflows: number;
  inProgress: number;
  awaitingReview: number;
  revisionRequested: number;
  completed: number;
  archived: number;
  byStatus: WorkflowStatusStat[];
  byKind: WorkflowKindStat[];
  totalStages: number;
  completedStages: number;
  overallProgress: number;
  overdueDeadlines: number;
  upcomingDeadlines: number;
  totalMilestones: number;
  achievedMilestones: number;
}

export interface WorkflowAnalytics {
  statusDistribution: WorkflowStatusStat[];
  kindDistribution: WorkflowKindStat[];
  completionRate: number;
  averageProgress: number;
  stageCompletionRate: number;
  deadlineHealth: WorkflowDeadlineHealth;
  escalated: number;
  delegated: number;
  averageStagesPerWorkflow: number;
  recentActivity: { date: string; count: number }[];
}

export interface WorkflowInsight {
  id: string;
  title: string;
  description: string;
  tone: 'positive' | 'neutral' | 'warning';
  tag: string;
}

export interface WorkflowPortfolio {
  workflows: WorkflowInstance[];
  templates: WorkflowTemplate[];
  statistics: WorkflowStatistics;
  analytics: WorkflowAnalytics;
  insights: WorkflowInsight[];
  featured: WorkflowInstance[];
  recent: WorkflowInstance[];
  log: WorkflowLogEntry[];
}

export type WorkflowSort = 'recent' | 'name' | 'status' | 'priority' | 'progress';

export interface WorkflowFilter {
  kind?: WorkflowTemplateKind;
  status?: WorkflowStatus;
  priority?: WorkflowPriority;
  assignee?: string;
  tag?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const WORKFLOW_TEMPLATE_KINDS: readonly WorkflowTemplateKind[] = [
  'undergraduate-project',
  'masters-dissertation',
  'phd-thesis',
  'journal-submission',
  'conference-submission',
  'book-publishing',
  'grant-proposal',
  'ethics-review',
  'consultancy-project',
  'institutional-approval',
  'marketplace-delivery',
  'service-delivery',
] as const;

export const WORKFLOW_KIND_LABELS: Record<WorkflowTemplateKind, string> = {
  'undergraduate-project': 'Undergraduate Project',
  'masters-dissertation': "Master's Dissertation",
  'phd-thesis': 'PhD Thesis',
  'journal-submission': 'Journal Submission',
  'conference-submission': 'Conference Submission',
  'book-publishing': 'Book Publishing',
  'grant-proposal': 'Grant Proposal',
  'ethics-review': 'Ethics Review',
  'consultancy-project': 'Consultancy Project',
  'institutional-approval': 'Institutional Approval',
  'marketplace-delivery': 'Marketplace Delivery',
  'service-delivery': 'Service Delivery',
};

export const WORKFLOW_KIND_ICONS: Record<WorkflowTemplateKind, string> = {
  'undergraduate-project': '🎓',
  'masters-dissertation': '📘',
  'phd-thesis': '🎯',
  'journal-submission': '📄',
  'conference-submission': '🗣️',
  'book-publishing': '📚',
  'grant-proposal': '💼',
  'ethics-review': '🛡️',
  'consultancy-project': '🧭',
  'institutional-approval': '🏛️',
  'marketplace-delivery': '🛍️',
  'service-delivery': '🔧',
};

export const WORKFLOW_STATUSES: readonly WorkflowStatus[] = [
  'draft',
  'assigned',
  'accepted',
  'in-progress',
  'awaiting-review',
  'revision-requested',
  'revision-submitted',
  'approved',
  'rejected',
  'published',
  'archived',
  'cancelled',
  'escalated',
  'delegated',
  'paused',
  'completed',
] as const;

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: 'Draft',
  assigned: 'Assigned',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  'awaiting-review': 'Awaiting Review',
  'revision-requested': 'Revision Requested',
  'revision-submitted': 'Revision Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
  archived: 'Archived',
  cancelled: 'Cancelled',
  escalated: 'Escalated',
  delegated: 'Delegated',
  paused: 'Paused',
  completed: 'Completed',
};

export const WORKFLOW_STATUS_ICONS: Record<WorkflowStatus, string> = {
  draft: '✏️',
  assigned: '📌',
  accepted: '🤝',
  'in-progress': '⚙️',
  'awaiting-review': '🔍',
  'revision-requested': '🔁',
  'revision-submitted': '📤',
  approved: '✅',
  rejected: '🚫',
  published: '🌐',
  archived: '🗃️',
  cancelled: '✖️',
  escalated: '🚨',
  delegated: '🧑‍💼',
  paused: '⏸️',
  completed: '🏁',
};

export const WORKFLOW_PRIORITIES: readonly WorkflowPriority[] = ['low', 'medium', 'high', 'urgent'] as const;

export const WORKFLOW_PRIORITY_LABELS: Record<WorkflowPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const WORKFLOW_PRIORITY_ICONS: Record<WorkflowPriority, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  urgent: '🔴',
};

export const WORKFLOW_STAGE_STATUSES: readonly WorkflowStageStatus[] = [
  'not-started',
  'in-progress',
  'awaiting-review',
  'revision-requested',
  'revision-submitted',
  'approved',
  'rejected',
  'skipped',
  'completed',
  'on-hold',
] as const;

export const WORKFLOW_STAGE_KINDS: readonly WorkflowStageKind[] = [
  'review',
  'approval',
  'task',
  'milestone',
  'submission',
  'decision',
  'notification',
  'examination',
] as const;

export const WORKFLOW_STAGE_KIND_LABELS: Record<WorkflowStageKind, string> = {
  review: 'Review',
  approval: 'Approval',
  task: 'Task',
  milestone: 'Milestone',
  submission: 'Submission',
  decision: 'Decision',
  notification: 'Notification',
  examination: 'Examination',
};

export const WORKFLOW_STAGE_KIND_ICONS: Record<WorkflowStageKind, string> = {
  review: '🔍',
  approval: '🖊️',
  task: '✅',
  milestone: '🏁',
  submission: '📤',
  decision: '⚖️',
  notification: '🔔',
  examination: '🎓',
};

export const WORKFLOW_ROLES: readonly WorkflowRole[] = [
  'supervisor',
  'co-supervisor',
  'student',
  'internal-examiner',
  'external-examiner',
  'committee-member',
  'editor',
  'associate-editor',
  'handling-editor',
  'reviewer',
  'editorial-assistant',
  'publisher',
  'conference-chair',
  'scientific-committee',
  'principal-investigator',
  'co-investigator',
  'researcher',
  'grant-officer',
  'client',
  'provider',
  'author',
  'institution-officer',
];

export const WORKFLOW_ROLE_LABELS: Record<WorkflowRole, string> = {
  supervisor: 'Supervisor',
  'co-supervisor': 'Co-Supervisor',
  student: 'Student',
  'internal-examiner': 'Internal Examiner',
  'external-examiner': 'External Examiner',
  'committee-member': 'Committee Member',
  editor: 'Editor',
  'associate-editor': 'Associate Editor',
  'handling-editor': 'Handling Editor',
  reviewer: 'Reviewer',
  'editorial-assistant': 'Editorial Assistant',
  publisher: 'Publisher',
  'conference-chair': 'Conference Chair',
  'scientific-committee': 'Scientific Committee',
  'principal-investigator': 'Principal Investigator',
  'co-investigator': 'Co-Investigator',
  researcher: 'Researcher',
  'grant-officer': 'Grant Officer',
  client: 'Client',
  provider: 'Provider',
  author: 'Author',
  'institution-officer': 'Institution Officer',
};

export const WORKFLOW_LOG_EVENT_TYPES: readonly WorkflowLogEventType[] = [
  'created',
  'assigned',
  'accepted',
  'started',
  'status-changed',
  'stage-started',
  'stage-completed',
  'stage-skipped',
  'revision-requested',
  'revision-submitted',
  'approved',
  'rejected',
  'published',
  'escalated',
  'delegated',
  'paused',
  'resumed',
  'deadline-set',
  'deadline-extended',
  'deadline-overdue',
  'milestone-reached',
  'comment-added',
  'notification-sent',
  'archived',
  'cancelled',
  'completed',
] as const;

export const WORKFLOW_DEADLINE_STATUSES: readonly WorkflowDeadlineStatus[] = [
  'upcoming',
  'due-soon',
  'overdue',
  'met',
  'extended',
] as const;

export const WORKFLOW_MILESTONE_STATUSES: readonly WorkflowMilestoneStatus[] = [
  'planned',
  'in-progress',
  'achieved',
  'missed',
] as const;

export const WORKFLOW_MILESTONE_STATUS_LABELS: Record<WorkflowMilestoneStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  achieved: 'Achieved',
  missed: 'Missed',
};

export const WORKFLOW_MILESTONE_STATUS_ICONS: Record<WorkflowMilestoneStatus, string> = {
  planned: '📋',
  'in-progress': '⚙️',
  achieved: '🏅',
  missed: '⏳',
};

export const WORKBENCH_ITEM_TYPES: readonly WorkbenchItemType[] = [
  'note',
  'brainstorm',
  'outline',
  'reference',
  'pdf',
  'dataset',
  'clipping',
  'screenshot',
  'calculation',
  'voice-note',
  'ai-note',
  'draft-section',
  'draft-chapter',
  'temp-file',
] as const;

export const WORKBENCH_ITEM_TYPE_LABELS: Record<WorkbenchItemType, string> = {
  note: 'Note',
  brainstorm: 'Brainstorm',
  outline: 'Outline',
  reference: 'Reference',
  pdf: 'PDF',
  dataset: 'Dataset',
  clipping: 'Clipping',
  screenshot: 'Screenshot',
  calculation: 'Calculation',
  'voice-note': 'Voice Note',
  'ai-note': 'AI Note',
  'draft-section': 'Draft Section',
  'draft-chapter': 'Draft Chapter',
  'temp-file': 'Temp File',
};

export const WORKBENCH_ITEM_TYPE_ICONS: Record<WorkbenchItemType, string> = {
  note: '📝',
  brainstorm: '💡',
  outline: '🧭',
  reference: '🔖',
  pdf: '📕',
  dataset: '🗂️',
  clipping: '✂️',
  screenshot: '📷',
  calculation: '🧮',
  'voice-note': '🎙️',
  'ai-note': '🤖',
  'draft-section': '📄',
  'draft-chapter': '📘',
  'temp-file': '📦',
};

export const WORKBENCH_ITEM_STATUSES: readonly WorkbenchItemStatus[] = [
  'draft',
  'active',
  'archived',
  'promoted',
] as const;

export const ARTEFACT_TYPES: readonly ScholarlyArtefactType[] = [
  'manuscript',
  'thesis',
  'dissertation',
  'proposal',
  'report',
  'grant',
  'dataset',
  'book',
  'chapter',
  'conference-paper',
  'project',
] as const;

export const ARTEFACT_TYPE_LABELS: Record<ScholarlyArtefactType, string> = {
  manuscript: 'Manuscript',
  thesis: 'Thesis',
  dissertation: 'Dissertation',
  proposal: 'Proposal',
  report: 'Report',
  grant: 'Grant',
  dataset: 'Dataset',
  book: 'Book',
  chapter: 'Chapter',
  'conference-paper': 'Conference Paper',
  project: 'Project',
};

export const ARTEFACT_TYPE_ICONS: Record<ScholarlyArtefactType, string> = {
  manuscript: '📄',
  thesis: '🎓',
  dissertation: '📘',
  proposal: '📋',
  report: '📊',
  grant: '💼',
  dataset: '🗂️',
  book: '📚',
  chapter: '📑',
  'conference-paper': '🗣️',
  project: '🧭',
};

export const ARTEFACT_SECTION_STATUSES: readonly ArtefactSectionStatus[] = [
  'draft',
  'in-progress',
  'awaiting-review',
  'revision-requested',
  'revision-submitted',
  'approved',
] as const;

export const ARTEFACT_STATUSES: readonly ScholarlyArtefactStatus[] = [
  'draft',
  'in-progress',
  'under-review',
  'approved',
  'published',
  'archived',
] as const;

export const ARTEFACT_STATUS_LABELS: Record<ScholarlyArtefactStatus, string> = {
  draft: 'Draft',
  'in-progress': 'In Progress',
  'under-review': 'Under Review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
};
