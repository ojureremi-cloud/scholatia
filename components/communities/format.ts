import {
  COMMUNITY_CATEGORY_ICONS,
  COMMUNITY_CATEGORY_LABELS,
  COMMUNITY_DISCUSSION_STATUS_ICONS,
  COMMUNITY_DISCUSSION_STATUS_LABELS,
  COMMUNITY_EVENT_MODE_LABELS,
  COMMUNITY_EVENT_STATUS_ICONS,
  COMMUNITY_EVENT_STATUS_LABELS,
  COMMUNITY_EVENT_TYPE_ICONS,
  COMMUNITY_EVENT_TYPE_LABELS,
  COMMUNITY_MEMBER_STATUS_ICONS,
  COMMUNITY_MEMBER_STATUS_LABELS,
  COMMUNITY_MENTORSHIP_STATUS_ICONS,
  COMMUNITY_MENTORSHIP_STATUS_LABELS,
  COMMUNITY_OPPORTUNITY_KIND_ICONS,
  COMMUNITY_OPPORTUNITY_KIND_LABELS,
  COMMUNITY_POLL_STATUS_ICONS,
  COMMUNITY_POLL_STATUS_LABELS,
  COMMUNITY_REPORT_KIND_ICONS,
  COMMUNITY_REPORT_KIND_LABELS,
  COMMUNITY_REPORT_STATUS_ICONS,
  COMMUNITY_REPORT_STATUS_LABELS,
  COMMUNITY_RESOURCE_TYPE_ICONS,
  COMMUNITY_RESOURCE_TYPE_LABELS,
  COMMUNITY_ROLE_ICONS,
  COMMUNITY_ROLE_LABELS,
  COMMUNITY_VISIBILITY_ICONS,
  COMMUNITY_VISIBILITY_LABELS,
} from '@/types/communities';
import type {
  CommunityCategory,
  CommunityDiscussionStatus,
  CommunityEventMode,
  CommunityEventStatus,
  CommunityEventType,
  CommunityMemberStatus,
  CommunityMentorshipStatus,
  CommunityOpportunityKind,
  CommunityPollStatus,
  CommunityReportKind,
  CommunityReportStatus,
  CommunityResourceType,
  CommunityRole,
  CommunityVisibility,
} from '@/types/communities';

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

export function formatCategory(category: CommunityCategory): string {
  return COMMUNITY_CATEGORY_LABELS[category] ?? category;
}

export function formatCategoryIcon(category: CommunityCategory): string {
  return COMMUNITY_CATEGORY_ICONS[category] ?? '🧩';
}

export function formatVisibility(visibility: CommunityVisibility): string {
  return COMMUNITY_VISIBILITY_LABELS[visibility] ?? visibility;
}

export function formatVisibilityIcon(visibility: CommunityVisibility): string {
  return COMMUNITY_VISIBILITY_ICONS[visibility] ?? '🌍';
}

export function formatRole(role: CommunityRole): string {
  return COMMUNITY_ROLE_LABELS[role] ?? role;
}

export function formatRoleIcon(role: CommunityRole): string {
  return COMMUNITY_ROLE_ICONS[role] ?? '👤';
}

export function formatMemberStatus(status: CommunityMemberStatus): string {
  return COMMUNITY_MEMBER_STATUS_LABELS[status] ?? status;
}

export function formatMemberStatusIcon(status: CommunityMemberStatus): string {
  return COMMUNITY_MEMBER_STATUS_ICONS[status] ?? '👤';
}

export function formatDiscussionStatus(status: CommunityDiscussionStatus): string {
  return COMMUNITY_DISCUSSION_STATUS_LABELS[status] ?? status;
}

export function formatDiscussionStatusIcon(status: CommunityDiscussionStatus): string {
  return COMMUNITY_DISCUSSION_STATUS_ICONS[status] ?? '💬';
}

export function formatResourceType(type: CommunityResourceType): string {
  return COMMUNITY_RESOURCE_TYPE_LABELS[type] ?? type;
}

export function formatResourceTypeIcon(type: CommunityResourceType): string {
  return COMMUNITY_RESOURCE_TYPE_ICONS[type] ?? '📦';
}

export function formatEventType(type: CommunityEventType): string {
  return COMMUNITY_EVENT_TYPE_LABELS[type] ?? type;
}

export function formatEventTypeIcon(type: CommunityEventType): string {
  return COMMUNITY_EVENT_TYPE_ICONS[type] ?? '🎤';
}

export function formatEventMode(mode: CommunityEventMode): string {
  return COMMUNITY_EVENT_MODE_LABELS[mode] ?? mode;
}

export function formatEventStatus(status: CommunityEventStatus): string {
  return COMMUNITY_EVENT_STATUS_LABELS[status] ?? status;
}

export function formatEventStatusIcon(status: CommunityEventStatus): string {
  return COMMUNITY_EVENT_STATUS_ICONS[status] ?? '📅';
}

export function formatPollStatus(status: CommunityPollStatus): string {
  return COMMUNITY_POLL_STATUS_LABELS[status] ?? status;
}

export function formatPollStatusIcon(status: CommunityPollStatus): string {
  return COMMUNITY_POLL_STATUS_ICONS[status] ?? '🗳️';
}

export function formatMentorshipStatus(status: CommunityMentorshipStatus): string {
  return COMMUNITY_MENTORSHIP_STATUS_LABELS[status] ?? status;
}

export function formatMentorshipStatusIcon(status: CommunityMentorshipStatus): string {
  return COMMUNITY_MENTORSHIP_STATUS_ICONS[status] ?? '🤝';
}

export function formatOpportunityKind(kind: CommunityOpportunityKind): string {
  return COMMUNITY_OPPORTUNITY_KIND_LABELS[kind] ?? kind;
}

export function formatOpportunityKindIcon(kind: CommunityOpportunityKind): string {
  return COMMUNITY_OPPORTUNITY_KIND_ICONS[kind] ?? '💼';
}

export function formatReportKind(kind: CommunityReportKind): string {
  return COMMUNITY_REPORT_KIND_LABELS[kind] ?? kind;
}

export function formatReportKindIcon(kind: CommunityReportKind): string {
  return COMMUNITY_REPORT_KIND_ICONS[kind] ?? '🚩';
}

export function formatReportStatus(status: CommunityReportStatus): string {
  return COMMUNITY_REPORT_STATUS_LABELS[status] ?? status;
}

export function formatReportStatusIcon(status: CommunityReportStatus): string {
  return COMMUNITY_REPORT_STATUS_ICONS[status] ?? '🚩';
}

export function categoryVariant(category: CommunityCategory): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (category) {
    case 'open-science':
    case 'sustainability':
      return 'success';
    case 'ai':
    case 'engineering':
    case 'health-sciences':
    case 'research':
      return 'info';
    case 'academic-society':
    case 'institutional':
      return 'success';
    case 'women-in-research':
    case 'regional':
      return 'warning';
    default:
      return 'default';
  }
}

export function visibilityVariant(visibility: CommunityVisibility): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (visibility) {
    case 'public':
      return 'success';
    case 'institution-only':
      return 'info';
    case 'invitation-only':
      return 'warning';
    case 'private':
      return 'danger';
    default:
      return 'default';
  }
}

export function roleVariant(role: CommunityRole): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (role) {
    case 'owner':
      return 'warning';
    case 'administrator':
    case 'moderator':
      return 'info';
    case 'contributor':
    case 'member':
      return 'success';
    case 'follower':
      return 'info';
    case 'visitor':
      return 'default';
    default:
      return 'default';
  }
}

export function memberStatusVariant(status: CommunityMemberStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
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

export function discussionStatusVariant(
  status: CommunityDiscussionStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'open':
      return 'info';
    case 'locked':
      return 'warning';
    case 'archived':
      return 'default';
    default:
      return 'default';
  }
}

export function eventStatusVariant(status: CommunityEventStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
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

export function pollStatusVariant(status: CommunityPollStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'open':
      return 'info';
    case 'closed':
      return 'default';
    default:
      return 'default';
  }
}

export function mentorshipStatusVariant(
  status: CommunityMentorshipStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'requested':
      return 'warning';
    case 'active':
      return 'success';
    case 'completed':
      return 'default';
    default:
      return 'default';
  }
}

export function reportStatusVariant(
  status: CommunityReportStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'open':
      return 'danger';
    case 'reviewed':
      return 'warning';
    case 'resolved':
      return 'success';
    case 'dismissed':
      return 'default';
    default:
      return 'default';
  }
}

export function verificationVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' {
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
