import {
  WORKFLOW_KIND_ICONS,
  WORKFLOW_KIND_LABELS,
  WORKFLOW_MILESTONE_STATUS_ICONS,
  WORKFLOW_MILESTONE_STATUS_LABELS,
  WORKFLOW_PRIORITY_ICONS,
  WORKFLOW_PRIORITY_LABELS,
  WORKFLOW_ROLE_LABELS,
  WORKFLOW_STAGE_KIND_ICONS,
  WORKFLOW_STAGE_KIND_LABELS,
  WORKFLOW_STATUS_ICONS,
  WORKFLOW_STATUS_LABELS,
} from '@/types/workflows';
import type {
  WorkflowDeadlineStatus,
  WorkflowMilestoneStatus,
  WorkflowPriority,
  WorkflowRole,
  WorkflowStageKind,
  WorkflowStageStatus,
  WorkflowStatus,
  WorkflowTemplateKind,
  WorkflowLogEventType,
} from '@/types/workflows';

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

/** Human-relative time, e.g. "2h ago". Falls back to a formatted date. */
export function formatRelative(iso: string | undefined, now = new Date()): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(iso);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatKind(kind: WorkflowTemplateKind): string {
  return WORKFLOW_KIND_LABELS[kind] ?? kind;
}

export function formatKindIcon(kind: WorkflowTemplateKind): string {
  return WORKFLOW_KIND_ICONS[kind] ?? '🧩';
}

export function formatKindVariant(kind: WorkflowTemplateKind): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (kind) {
    case 'undergraduate-project':
    case 'masters-dissertation':
    case 'phd-thesis':
    case 'book-publishing':
      return 'info';
    case 'journal-submission':
    case 'conference-submission':
    case 'grant-proposal':
      return 'warning';
    case 'ethics-review':
    case 'institutional-approval':
      return 'success';
    case 'marketplace-delivery':
    case 'service-delivery':
    case 'consultancy-project':
      return 'default';
    default:
      return 'default';
  }
}

export function formatStatus(status: WorkflowStatus): string {
  return WORKFLOW_STATUS_LABELS[status] ?? status;
}

export function formatStatusIcon(status: WorkflowStatus): string {
  return WORKFLOW_STATUS_ICONS[status] ?? '🟢';
}

export function statusVariant(status: WorkflowStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'approved':
    case 'published':
    case 'completed':
    case 'accepted':
      return 'success';
    case 'in-progress':
    case 'revision-submitted':
    case 'assigned':
      return 'info';
    case 'awaiting-review':
    case 'revision-requested':
    case 'escalated':
    case 'delegated':
    case 'paused':
      return 'warning';
    case 'rejected':
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatPriority(priority: WorkflowPriority): string {
  return WORKFLOW_PRIORITY_LABELS[priority] ?? priority;
}

export function formatPriorityIcon(priority: WorkflowPriority): string {
  return WORKFLOW_PRIORITY_ICONS[priority] ?? '➖';
}

export function priorityVariant(priority: WorkflowPriority): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (priority) {
    case 'low':
      return 'default';
    case 'medium':
      return 'info';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatStageStatus(status: WorkflowStageStatus): string {
  switch (status) {
    case 'not-started':
      return 'Not Started';
    case 'in-progress':
      return 'In Progress';
    case 'awaiting-review':
      return 'Awaiting Review';
    case 'revision-requested':
      return 'Revision Requested';
    case 'revision-submitted':
      return 'Revision Submitted';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'skipped':
      return 'Skipped';
    case 'completed':
      return 'Completed';
    case 'on-hold':
      return 'On Hold';
    default:
      return status;
  }
}

export function stageStatusVariant(status: WorkflowStageStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'completed':
    case 'approved':
      return 'success';
    case 'in-progress':
    case 'revision-submitted':
      return 'info';
    case 'awaiting-review':
    case 'revision-requested':
    case 'on-hold':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatStageKind(kind: WorkflowStageKind): string {
  return WORKFLOW_STAGE_KIND_LABELS[kind] ?? kind;
}

export function formatStageKindIcon(kind: WorkflowStageKind): string {
  return WORKFLOW_STAGE_KIND_ICONS[kind] ?? '📌';
}

export function formatRole(role: WorkflowRole): string {
  return WORKFLOW_ROLE_LABELS[role] ?? role;
}

export function formatDeadlineStatus(status: WorkflowDeadlineStatus): string {
  switch (status) {
    case 'upcoming':
      return 'Upcoming';
    case 'due-soon':
      return 'Due Soon';
    case 'overdue':
      return 'Overdue';
    case 'met':
      return 'Met';
    case 'extended':
      return 'Extended';
    default:
      return status;
  }
}

export function deadlineVariant(status: WorkflowDeadlineStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'met':
      return 'success';
    case 'upcoming':
      return 'default';
    case 'due-soon':
    case 'extended':
      return 'warning';
    case 'overdue':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatMilestoneStatus(status: WorkflowMilestoneStatus): string {
  return WORKFLOW_MILESTONE_STATUS_LABELS[status] ?? status;
}

export function formatMilestoneStatusIcon(status: WorkflowMilestoneStatus): string {
  return WORKFLOW_MILESTONE_STATUS_ICONS[status] ?? '📋';
}

export function milestoneVariant(status: WorkflowMilestoneStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'achieved':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'planned':
      return 'default';
    case 'missed':
      return 'danger';
    default:
      return 'default';
  }
}

const LOG_EVENT_LABELS: Partial<Record<WorkflowLogEventType, string>> = {
  'stage-started': 'Stage started',
  'stage-completed': 'Stage completed',
  'stage-skipped': 'Stage skipped',
  'deadline-set': 'Deadline set',
  'deadline-extended': 'Deadline extended',
  'deadline-overdue': 'Deadline overdue',
  'milestone-reached': 'Milestone reached',
  'comment-added': 'Comment added',
  'notification-sent': 'Notification sent',
};

export function formatLogEvent(type: WorkflowLogEventType): string {
  return LOG_EVENT_LABELS[type] ?? type;
}
