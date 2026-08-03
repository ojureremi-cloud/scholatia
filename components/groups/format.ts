import {
  GROUP_CATEGORY_ICONS,
  GROUP_CATEGORY_LABELS,
  GROUP_DISCUSSION_STATUS_ICONS,
  GROUP_DISCUSSION_STATUS_LABELS,
  GROUP_EVENT_MODE_LABELS,
  GROUP_EVENT_STATUS_ICONS,
  GROUP_EVENT_STATUS_LABELS,
  GROUP_EVENT_TYPE_ICONS,
  GROUP_EVENT_TYPE_LABELS,
  GROUP_MEDIA_KIND_ICONS,
  GROUP_MEDIA_KIND_LABELS,
  GROUP_MEMBER_STATUS_ICONS,
  GROUP_MEMBER_STATUS_LABELS,
  GROUP_PROJECT_STATUS_ICONS,
  GROUP_PROJECT_STATUS_LABELS,
  GROUP_PUBLICATION_STATUS_ICONS,
  GROUP_PUBLICATION_STATUS_LABELS,
  GROUP_PUBLICATION_TYPE_ICONS,
  GROUP_PUBLICATION_TYPE_LABELS,
  GROUP_RESOURCE_TYPE_ICONS,
  GROUP_RESOURCE_TYPE_LABELS,
  GROUP_ROLE_ICONS,
  GROUP_ROLE_LABELS,
  GROUP_VISIBILITY_ICONS,
  GROUP_VISIBILITY_LABELS,
} from '@/types/groups';
import type {
  GroupCategory,
  GroupDiscussionStatus,
  GroupEventMode,
  GroupEventStatus,
  GroupEventType,
  GroupMediaKind,
  GroupMemberStatus,
  GroupProjectStatus,
  GroupPublicationStatus,
  GroupPublicationType,
  GroupResourceType,
  GroupRole,
  GroupVisibility,
} from '@/types/groups';

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

export function formatCategory(category: GroupCategory): string {
  return GROUP_CATEGORY_LABELS[category] ?? category;
}

export function formatCategoryIcon(category: GroupCategory): string {
  return GROUP_CATEGORY_ICONS[category] ?? '👥';
}

export function formatVisibility(visibility: GroupVisibility): string {
  return GROUP_VISIBILITY_LABELS[visibility] ?? visibility;
}

export function formatVisibilityIcon(visibility: GroupVisibility): string {
  return GROUP_VISIBILITY_ICONS[visibility] ?? '🌍';
}

export function formatRole(role: GroupRole): string {
  return GROUP_ROLE_LABELS[role] ?? role;
}

export function formatRoleIcon(role: GroupRole): string {
  return GROUP_ROLE_ICONS[role] ?? '👤';
}

export function formatMemberStatus(status: GroupMemberStatus): string {
  return GROUP_MEMBER_STATUS_LABELS[status] ?? status;
}

export function formatMemberStatusIcon(status: GroupMemberStatus): string {
  return GROUP_MEMBER_STATUS_ICONS[status] ?? '👤';
}

export function formatPublicationType(type: GroupPublicationType): string {
  return GROUP_PUBLICATION_TYPE_LABELS[type] ?? type;
}

export function formatPublicationTypeIcon(type: GroupPublicationType): string {
  return GROUP_PUBLICATION_TYPE_ICONS[type] ?? '📄';
}

export function formatPublicationStatus(status: GroupPublicationStatus): string {
  return GROUP_PUBLICATION_STATUS_LABELS[status] ?? status;
}

export function formatPublicationStatusIcon(status: GroupPublicationStatus): string {
  return GROUP_PUBLICATION_STATUS_ICONS[status] ?? '✍️';
}

export function formatEventType(type: GroupEventType): string {
  return GROUP_EVENT_TYPE_LABELS[type] ?? type;
}

export function formatEventTypeIcon(type: GroupEventType): string {
  return GROUP_EVENT_TYPE_ICONS[type] ?? '🎤';
}

export function formatEventMode(mode: GroupEventMode): string {
  return GROUP_EVENT_MODE_LABELS[mode] ?? mode;
}

export function formatEventStatus(status: GroupEventStatus): string {
  return GROUP_EVENT_STATUS_LABELS[status] ?? status;
}

export function formatEventStatusIcon(status: GroupEventStatus): string {
  return GROUP_EVENT_STATUS_ICONS[status] ?? '📅';
}

export function formatResourceType(type: GroupResourceType): string {
  return GROUP_RESOURCE_TYPE_LABELS[type] ?? type;
}

export function formatResourceTypeIcon(type: GroupResourceType): string {
  return GROUP_RESOURCE_TYPE_ICONS[type] ?? '📝';
}

export function formatDiscussionStatus(status: GroupDiscussionStatus): string {
  return GROUP_DISCUSSION_STATUS_LABELS[status] ?? status;
}

export function formatDiscussionStatusIcon(status: GroupDiscussionStatus): string {
  return GROUP_DISCUSSION_STATUS_ICONS[status] ?? '💬';
}

export function formatProjectStatus(status: GroupProjectStatus): string {
  return GROUP_PROJECT_STATUS_LABELS[status] ?? status;
}

export function formatProjectStatusIcon(status: GroupProjectStatus): string {
  return GROUP_PROJECT_STATUS_ICONS[status] ?? '🚀';
}

export function formatMediaKind(kind: GroupMediaKind): string {
  return GROUP_MEDIA_KIND_LABELS[kind] ?? kind;
}

export function formatMediaKindIcon(kind: GroupMediaKind): string {
  return GROUP_MEDIA_KIND_ICONS[kind] ?? '🖼️';
}

export function categoryVariant(category: GroupCategory): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (category) {
    case 'research-group':
    case 'project-team':
      return 'info';
    case 'laboratory':
      return 'info';
    case 'department':
    case 'faculty':
    case 'institution':
      return 'success';
    case 'conference-working-group':
    case 'journal-editorial':
      return 'warning';
    case 'grant-team':
      return 'success';
    case 'interest-group':
    case 'professional-network':
      return 'default';
    default:
      return 'default';
  }
}

export function visibilityVariant(visibility: GroupVisibility): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (visibility) {
    case 'public':
      return 'success';
    case 'institution-only':
    case 'department-only':
      return 'info';
    case 'invitation-only':
      return 'warning';
    case 'private':
      return 'danger';
    default:
      return 'default';
  }
}

export function roleVariant(role: GroupRole): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (role) {
    case 'owner':
      return 'warning';
    case 'administrator':
      return 'info';
    case 'moderator':
      return 'info';
    case 'member':
      return 'success';
    case 'guest':
      return 'default';
    case 'visitor':
      return 'default';
    default:
      return 'default';
  }
}

export function memberStatusVariant(status: GroupMemberStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'invited':
      return 'info';
    case 'pending':
      return 'warning';
    case 'removed':
      return 'danger';
    default:
      return 'default';
  }
}

export function publicationStatusVariant(
  status: GroupPublicationStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'published':
      return 'success';
    case 'in-review':
      return 'warning';
    case 'draft':
      return 'default';
    default:
      return 'default';
  }
}

export function eventStatusVariant(status: GroupEventStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'scheduled':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

export function discussionStatusVariant(
  status: GroupDiscussionStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'open':
      return 'info';
    case 'resolved':
      return 'success';
    case 'closed':
      return 'default';
    default:
      return 'default';
  }
}

export function projectStatusVariant(
  status: GroupProjectStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'planning':
      return 'warning';
    case 'active':
      return 'info';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}

export function verificationVariant(
  status: string,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'Verified':
    case 'Trusted':
    case 'Accredited':
    case 'Government Recognised':
      return 'success';
    case 'Pending':
    case 'Email Verified':
    case 'Domain Verified':
    case 'Document Verified':
      return 'warning';
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
