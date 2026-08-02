import {
  ANNOTATION_COMMENT_TYPE_LABELS,
  ANNOTATION_DECISION_LABELS,
  ANNOTATION_LOCATION_TARGET_LABELS,
  ANNOTATION_ROLE_LABELS,
  ANNOTATION_STATUS_LABELS,
  ANNOTATION_TYPE_ICONS,
  ANNOTATION_TYPE_LABELS,
} from '@/types/annotations';
import type {
  AnnotationCommentType,
  AnnotationDecision,
  AnnotationLocation,
  AnnotationLocationTarget,
  AnnotationRole,
  AnnotationStatus,
  AnnotationType,
} from '@/types/annotations';
import { locationBreadcrumb } from '@/lib/annotations';
import { THREAD_KIND_LABELS } from '@/types/comments';
import type { CommentThread } from '@/types/comments';

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
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

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

export function formatAnnotationType(type: AnnotationType): string {
  return ANNOTATION_TYPE_LABELS[type] ?? type;
}

export function annotationTypeIcon(type: AnnotationType): string {
  return ANNOTATION_TYPE_ICONS[type] ?? '📌';
}

export function annotationTypeVariant(
  type: AnnotationType,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (type) {
    case 'citation':
    case 'reference':
      return 'warning';
    case 'figure':
    case 'table':
    case 'equation':
    case 'dataset':
    case 'attachment':
      return 'info';
    case 'general-note':
    case 'document':
      return 'success';
    default:
      return 'default';
  }
}

export function formatAnnotationRole(role: AnnotationRole): string {
  return ANNOTATION_ROLE_LABELS[role] ?? role;
}

export function annotationRoleVariant(
  role: AnnotationRole,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (role) {
    case 'editor':
    case 'associate-editor':
    case 'conference-chair':
    case 'grant-reviewer':
    case 'institution-admin':
      return 'info';
    case 'supervisor':
    case 'co-supervisor':
    case 'examiner':
    case 'external-examiner':
      return 'success';
    case 'reviewer':
    case 'conference-reviewer':
      return 'warning';
    default:
      return 'default';
  }
}

export function formatAnnotationStatus(status: AnnotationStatus): string {
  return ANNOTATION_STATUS_LABELS[status] ?? status;
}

export function annotationStatusVariant(
  status: AnnotationStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'accepted':
    case 'resolved':
      return 'success';
    case 'open':
      return 'info';
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'archived':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatAnnotationDecision(decision: AnnotationDecision): string {
  return ANNOTATION_DECISION_LABELS[decision] ?? decision;
}

export function annotationDecisionVariant(
  decision: AnnotationDecision,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (decision) {
    case 'accept-suggestion':
    case 'accept-partially':
      return 'success';
    case 'reject-suggestion':
      return 'danger';
    case 'needs-discussion':
    case 'escalate':
      return 'warning';
    default:
      return 'default';
  }
}

export function formatAnnotationCommentType(type: AnnotationCommentType): string {
  return ANNOTATION_COMMENT_TYPE_LABELS[type] ?? type;
}

export function annotationCommentTypeIcon(type: AnnotationCommentType): string {
  switch (type) {
    case 'suggested-correction':
    case 'required-correction':
    case 'minor-revision':
    case 'major-revision':
      return '✏️';
    case 'question':
      return '❓';
    case 'recommendation':
      return '💡';
    case 'observation':
      return '👁️';
    case 'grammar':
    case 'language':
    case 'style':
      return '✍️';
    case 'citation-issue':
      return '🔖';
    case 'methodology-issue':
    case 'statistical-issue':
    case 'formatting-issue':
      return '⚠️';
    case 'ethical-concern':
      return '🛡️';
    case 'approval-note':
      return '✅';
    default:
      return '💬';
  }
}

export function formatLocationTarget(target: AnnotationLocationTarget): string {
  return ANNOTATION_LOCATION_TARGET_LABELS[target] ?? target;
}

export function formatLocation(location: AnnotationLocation): string {
  const breadcrumb = locationBreadcrumb(location);
  return breadcrumb.length > 0 ? breadcrumb.join(' › ') : formatLocationTarget(location.target);
}

export function formatThreadKind(kind: CommentThread['kind']): string {
  return THREAD_KIND_LABELS[kind] ?? kind;
}
