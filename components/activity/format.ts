import {
  ACTIVITY_ATTACHMENT_TYPE_ICONS,
  ACTIVITY_ATTACHMENT_TYPE_LABELS,
  ACTIVITY_FEED_KIND_ICONS,
  ACTIVITY_FEED_KIND_LABELS,
  ACTIVITY_TYPE_ICONS,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_VISIBILITY_ICONS,
  ACTIVITY_VISIBILITY_LABELS,
} from '@/types/activity';
import type {
  ActivityAttachmentType,
  ActivityFeedKind,
  ActivityItem,
  ActivityType,
  ActivityVisibility,
} from '@/types/activity';
import { buildActivityUrl } from '@/lib/activity';

export function activityHref(activity: ActivityItem): string {
  return activity.url ?? buildActivityUrl(activity.source);
}

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

export function formatActivityType(type: ActivityType): string {
  return ACTIVITY_TYPE_LABELS[type] ?? type;
}

export function formatActivityTypeIcon(type: ActivityType): string {
  return ACTIVITY_TYPE_ICONS[type] ?? '📣';
}

export function formatActivityVisibility(visibility: ActivityVisibility): string {
  return ACTIVITY_VISIBILITY_LABELS[visibility] ?? visibility;
}

export function formatActivityVisibilityIcon(visibility: ActivityVisibility): string {
  return ACTIVITY_VISIBILITY_ICONS[visibility] ?? '🌍';
}

export function formatFeedKind(kind: ActivityFeedKind): string {
  return ACTIVITY_FEED_KIND_LABELS[kind] ?? kind;
}

export function formatFeedKindIcon(kind: ActivityFeedKind): string {
  return ACTIVITY_FEED_KIND_ICONS[kind] ?? '📣';
}

export function formatAttachmentType(type: ActivityAttachmentType): string {
  return ACTIVITY_ATTACHMENT_TYPE_LABELS[type] ?? type;
}

export function formatAttachmentTypeIcon(type: ActivityAttachmentType): string {
  return ACTIVITY_ATTACHMENT_TYPE_ICONS[type] ?? '📎';
}

export function typeVariant(type: ActivityType): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (type) {
    case 'publication':
    case 'citation':
    case 'dataset':
    case 'manuscript':
      return 'info';
    case 'conference':
    case 'journal':
    case 'publisher':
      return 'warning';
    case 'peer-review':
    case 'verification':
    case 'trust':
      return 'success';
    case 'funding':
    case 'grant':
    case 'subscription':
    case 'commerce':
      return 'success';
    case 'advertising':
    case 'marketplace-product':
    case 'marketplace-purchase':
    case 'research-service':
    case 'service-order':
      return 'warning';
    case 'announcement':
      return 'default';
    case 'security':
      return 'danger';
    default:
      return 'default';
  }
}

export function visibilityVariant(visibility: ActivityVisibility): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (visibility) {
    case 'public':
      return 'success';
    case 'institution':
    case 'collaborators':
    case 'followers':
      return 'info';
    case 'private':
    case 'restricted':
      return 'danger';
    default:
      return 'default';
  }
}

export function activityPreview(text: string): string {
  const body = text.replace(/\s+/g, ' ').trim();
  return body.length > 140 ? `${body.slice(0, 140)}…` : body;
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
