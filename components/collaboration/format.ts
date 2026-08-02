import {
  COLLABORATION_DOCUMENT_STATUS_ICONS,
  COLLABORATION_DOCUMENT_STATUS_LABELS,
  COLLABORATION_DOCUMENT_TYPE_ICONS,
  COLLABORATION_DOCUMENT_TYPE_LABELS,
  COLLABORATION_DISCUSSION_STATUS_ICONS,
  COLLABORATION_DISCUSSION_STATUS_LABELS,
  COLLABORATION_INVITATION_STATUS_ICONS,
  COLLABORATION_INVITATION_STATUS_LABELS,
  COLLABORATION_MEETING_STATUS_ICONS,
  COLLABORATION_MEETING_STATUS_LABELS,
  COLLABORATION_MEMBER_ROLE_ICONS,
  COLLABORATION_MEMBER_ROLE_LABELS,
  COLLABORATION_MILESTONE_STATUS_ICONS,
  COLLABORATION_MILESTONE_STATUS_LABELS,
  COLLABORATION_TASK_PRIORITY_ICONS,
  COLLABORATION_TASK_PRIORITY_LABELS,
  COLLABORATION_TASK_STATUS_ICONS,
  COLLABORATION_TASK_STATUS_LABELS,
  COLLABORATION_WORKSPACE_KIND_ICONS,
  COLLABORATION_WORKSPACE_KIND_LABELS,
  COLLABORATION_WORKSPACE_STATUS_ICONS,
  COLLABORATION_WORKSPACE_STATUS_LABELS,
  COLLABORATION_WORKSPACE_VISIBILITY_ICONS,
  COLLABORATION_WORKSPACE_VISIBILITY_LABELS,
} from '@/types/collaboration';
import type {
  CollaborationDocumentStatus,
  CollaborationDocumentType,
  CollaborationDiscussionStatus,
  CollaborationInvitationStatus,
  CollaborationMeetingStatus,
  CollaborationMemberRole,
  CollaborationMilestoneStatus,
  CollaborationTaskPriority,
  CollaborationTaskStatus,
  CollaborationWorkspaceKind,
  CollaborationWorkspaceStatus,
  CollaborationWorkspaceVisibility,
} from '@/types/collaboration';

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string | undefined): string {
  return `${formatDate(iso)} at ${formatTime(iso)}`;
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

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatKind(kind: CollaborationWorkspaceKind): string {
  return COLLABORATION_WORKSPACE_KIND_LABELS[kind] ?? kind;
}

export function formatKindIcon(kind: CollaborationWorkspaceKind): string {
  return COLLABORATION_WORKSPACE_KIND_ICONS[kind] ?? '👥';
}

export function formatVisibility(visibility: CollaborationWorkspaceVisibility): string {
  return COLLABORATION_WORKSPACE_VISIBILITY_LABELS[visibility] ?? visibility;
}

export function formatVisibilityIcon(visibility: CollaborationWorkspaceVisibility): string {
  return COLLABORATION_WORKSPACE_VISIBILITY_ICONS[visibility] ?? '🌍';
}

export function formatWorkspaceStatus(status: CollaborationWorkspaceStatus): string {
  return COLLABORATION_WORKSPACE_STATUS_LABELS[status] ?? status;
}

export function formatWorkspaceStatusIcon(status: CollaborationWorkspaceStatus): string {
  return COLLABORATION_WORKSPACE_STATUS_ICONS[status] ?? '🟢';
}

export function formatRole(role: CollaborationMemberRole): string {
  return COLLABORATION_MEMBER_ROLE_LABELS[role] ?? role;
}

export function formatRoleIcon(role: CollaborationMemberRole): string {
  return COLLABORATION_MEMBER_ROLE_ICONS[role] ?? '👤';
}

export function formatTaskStatus(status: CollaborationTaskStatus): string {
  return COLLABORATION_TASK_STATUS_LABELS[status] ?? status;
}

export function formatTaskStatusIcon(status: CollaborationTaskStatus): string {
  return COLLABORATION_TASK_STATUS_ICONS[status] ?? '📋';
}

export function formatTaskPriority(priority: CollaborationTaskPriority): string {
  return COLLABORATION_TASK_PRIORITY_LABELS[priority] ?? priority;
}

export function formatTaskPriorityIcon(priority: CollaborationTaskPriority): string {
  return COLLABORATION_TASK_PRIORITY_ICONS[priority] ?? '➖';
}

export function formatDocumentType(type: CollaborationDocumentType): string {
  return COLLABORATION_DOCUMENT_TYPE_LABELS[type] ?? type;
}

export function formatDocumentTypeIcon(type: CollaborationDocumentType): string {
  return COLLABORATION_DOCUMENT_TYPE_ICONS[type] ?? '📄';
}

export function formatDocumentStatus(status: CollaborationDocumentStatus): string {
  return COLLABORATION_DOCUMENT_STATUS_LABELS[status] ?? status;
}

export function formatDocumentStatusIcon(status: CollaborationDocumentStatus): string {
  return COLLABORATION_DOCUMENT_STATUS_ICONS[status] ?? '✍️';
}

export function formatMeetingStatus(status: CollaborationMeetingStatus): string {
  return COLLABORATION_MEETING_STATUS_LABELS[status] ?? status;
}

export function formatMeetingStatusIcon(status: CollaborationMeetingStatus): string {
  return COLLABORATION_MEETING_STATUS_ICONS[status] ?? '📅';
}

export function formatMilestoneStatus(status: CollaborationMilestoneStatus): string {
  return COLLABORATION_MILESTONE_STATUS_LABELS[status] ?? status;
}

export function formatMilestoneStatusIcon(status: CollaborationMilestoneStatus): string {
  return COLLABORATION_MILESTONE_STATUS_ICONS[status] ?? '🗺️';
}

export function formatDiscussionStatus(status: CollaborationDiscussionStatus): string {
  return COLLABORATION_DISCUSSION_STATUS_LABELS[status] ?? status;
}

export function formatDiscussionStatusIcon(status: CollaborationDiscussionStatus): string {
  return COLLABORATION_DISCUSSION_STATUS_ICONS[status] ?? '💬';
}

export function formatInvitationStatus(status: CollaborationInvitationStatus): string {
  return COLLABORATION_INVITATION_STATUS_LABELS[status] ?? status;
}

export function formatInvitationStatusIcon(status: CollaborationInvitationStatus): string {
  return COLLABORATION_INVITATION_STATUS_ICONS[status] ?? '⏳';
}

export function kindVariant(kind: CollaborationWorkspaceKind): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (kind) {
    case 'research-lab':
    case 'project-workspace':
      return 'info';
    case 'conference-space':
    case 'journal-space':
      return 'warning';
    case 'institution-space':
      return 'success';
    case 'community':
      return 'success';
    default:
      return 'default';
  }
}

export function statusVariant(status: CollaborationWorkspaceStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'paused':
      return 'warning';
    case 'archived':
      return 'default';
    default:
      return 'default';
  }
}

export function visibilityVariant(
  visibility: CollaborationWorkspaceVisibility,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (visibility) {
    case 'public':
      return 'success';
    case 'institution':
    case 'members':
      return 'info';
    case 'private':
      return 'danger';
    default:
      return 'default';
  }
}

export function taskStatusVariant(status: CollaborationTaskStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'done':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'in-review':
      return 'warning';
    case 'todo':
      return 'default';
    default:
      return 'default';
  }
}

export function priorityVariant(priority: CollaborationTaskPriority): 'default' | 'success' | 'warning' | 'danger' | 'info' {
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

export function roleVariant(role: CollaborationMemberRole): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (role) {
    case 'owner':
      return 'warning';
    case 'admin':
      return 'info';
    case 'editor':
      return 'success';
    case 'member':
      return 'default';
    case 'viewer':
      return 'default';
    default:
      return 'default';
  }
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
