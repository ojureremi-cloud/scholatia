import {
  CONVERSATION_ROLE_LABELS,
  CONVERSATION_STATUS_LABELS,
  CONVERSATION_TYPE_ICONS,
  CONVERSATION_TYPE_LABELS,
  MESSAGE_ATTACHMENT_TYPE_ICONS,
  MESSAGE_ATTACHMENT_TYPE_LABELS,
  MESSAGE_STATUS_LABELS,
  MESSAGE_TYPE_ICONS,
  MESSAGE_TYPE_LABELS,
} from '@/types/messages';
import type {
  ConversationRole,
  ConversationStatus,
  ConversationType,
  MessageAttachmentType,
  MessageStatus,
  MessageType,
} from '@/types/messages';
import { conversationUrl } from '@/lib/messages';
import type { Conversation, Message } from '@/types/messages';

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
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
  return `${Math.round(value)}%`;
}

/** Format a duration in seconds as m:ss. */
export function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '—';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

export function formatConversationType(type: ConversationType): string {
  return CONVERSATION_TYPE_LABELS[type] ?? type;
}

export function formatConversationTypeIcon(type: ConversationType): string {
  return CONVERSATION_TYPE_ICONS[type] ?? '💬';
}

export function formatConversationStatus(status: ConversationStatus): string {
  return CONVERSATION_STATUS_LABELS[status] ?? status;
}

export function formatRole(role: ConversationRole): string {
  return CONVERSATION_ROLE_LABELS[role] ?? role;
}

export function formatMessageType(type: MessageType): string {
  return MESSAGE_TYPE_LABELS[type] ?? type;
}

export function formatMessageTypeIcon(type: MessageType): string {
  return MESSAGE_TYPE_ICONS[type] ?? '💬';
}

export function formatMessageStatus(status: MessageStatus): string {
  return MESSAGE_STATUS_LABELS[status] ?? status;
}

export function formatAttachmentType(type: MessageAttachmentType): string {
  return MESSAGE_ATTACHMENT_TYPE_LABELS[type] ?? type;
}

export function formatAttachmentTypeIcon(type: MessageAttachmentType): string {
  return MESSAGE_ATTACHMENT_TYPE_ICONS[type] ?? '📎';
}

export function conversationLink(conversation: Conversation): string {
  return conversationUrl(conversation);
}

export function messagePreview(message: Message): string {
  const body = message.body.replace(/\s+/g, ' ').trim();
  return body.length > 100 ? `${body.slice(0, 100)}…` : body;
}

export function typeVariant(type: ConversationType): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (type) {
    case 'direct':
      return 'info';
    case 'group':
      return 'default';
    case 'institution':
      return 'info';
    case 'publisher':
      return 'default';
    case 'conference':
      return 'warning';
    case 'journal':
      return 'info';
    case 'project':
      return 'default';
    case 'grant':
      return 'success';
    case 'marketplace':
      return 'warning';
    case 'service':
      return 'info';
    case 'support':
      return 'danger';
    default:
      return 'default';
  }
}

export function statusVariant(status: ConversationStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'muted':
      return 'warning';
    case 'archived':
      return 'default';
    default:
      return 'default';
  }
}

export function messageStatusVariant(status: MessageStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'read':
      return 'success';
    case 'delivered':
      return 'info';
    case 'sent':
      return 'default';
    case 'queued':
      return 'default';
    case 'failed':
      return 'danger';
    default:
      return 'default';
  }
}

/** Compact delivery ticks for a message from the current user. */
export function deliveryTicks(message: Message, currentUserId: string): string {
  if (message.senderId !== currentUserId) return '';
  switch (message.status) {
    case 'failed':
      return '✕';
    case 'queued':
      return '🕓';
    case 'sent':
      return '✓';
    case 'delivered':
      return '✓✓';
    case 'read':
      return '✓✓';
    default:
      return '';
  }
}

/** Initials for a participant, for avatar-less rendering. */
export function initialsOf(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
