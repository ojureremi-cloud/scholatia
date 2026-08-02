import {
  APPROVAL_ACTION_LABELS,
  APPROVAL_KIND_LABELS,
  APPROVAL_STATUS_LABELS,
  REVIEW_COMMENT_TYPE_LABELS,
  REVIEW_DECISION_LABELS,
  REVIEW_KIND_ICONS,
  REVIEW_KIND_LABELS,
  REVIEW_STATUS_LABELS,
} from '@/types/reviews';
import type {
  ApprovalAction,
  ApprovalKind,
  ApprovalStatus,
  ReviewCommentType,
  ReviewDecision,
  ReviewKind,
  ReviewStatus,
} from '@/types/reviews';

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

export function formatReviewKind(kind: ReviewKind): string {
  return REVIEW_KIND_LABELS[kind] ?? kind;
}

export function formatReviewKindIcon(kind: ReviewKind): string {
  return REVIEW_KIND_ICONS[kind] ?? '🔬';
}

export function reviewKindVariant(kind: ReviewKind): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (kind) {
    case 'approval':
    case 'institutional':
      return 'success';
    case 'grant':
    case 'editorial':
      return 'warning';
    case 'supervisory':
    case 'ethics':
    case 'examination':
      return 'info';
    default:
      return 'default';
  }
}

export function formatReviewStatus(status: ReviewStatus): string {
  return REVIEW_STATUS_LABELS[status] ?? status;
}

export function reviewStatusVariant(status: ReviewStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
    case 'accepted':
      return 'info';
    case 'invited':
    case 'submitted':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatReviewDecision(decision: ReviewDecision): string {
  return REVIEW_DECISION_LABELS[decision] ?? decision;
}

export function reviewDecisionVariant(decision: ReviewDecision): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (decision) {
    case 'approve':
      return 'success';
    case 'minor-revision':
      return 'warning';
    case 'major-revision':
    case 'reject':
      return 'danger';
    case 'escalate':
      return 'danger';
    case 'delegate':
    case 'return':
    case 'reopen':
      return 'info';
    case 'withdraw':
    case 'close':
      return 'default';
    default:
      return 'default';
  }
}

export function formatCommentType(type: ReviewCommentType): string {
  return REVIEW_COMMENT_TYPE_LABELS[type] ?? type;
}

export function commentTypeIcon(type: ReviewCommentType): string {
  switch (type) {
    case 'voice':
      return '🎙️';
    case 'inline':
      return '📌';
    case 'reply':
      return '↩️';
    case 'summary':
      return '📝';
    default:
      return '💬';
  }
}

export function formatApprovalStatus(status: ApprovalStatus): string {
  return APPROVAL_STATUS_LABELS[status] ?? status;
}

export function approvalStatusVariant(status: ApprovalStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
    case 'minor-revision':
    case 'major-revision':
    case 'delegated':
    case 'returned':
    case 'reopened':
      return 'warning';
    case 'rejected':
      return 'danger';
    case 'escalated':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatApprovalKind(kind: ApprovalKind): string {
  return APPROVAL_KIND_LABELS[kind] ?? kind;
}

export function formatApprovalAction(action: ApprovalAction): string {
  return APPROVAL_ACTION_LABELS[action] ?? action;
}
