import type { ResearchLifecycleStageId } from '@/types/research';
import type { DiscoveryEntityType } from '@/types/discovery';

/**
 * Scholatia Messaging Platform (Phase 2.2B).
 *
 * The canonical scholarly messaging layer of the Scholatia ecosystem. It is NOT
 * a duplicate of the lightweight message model inside the Marketplace module:
 * every conversation and message below references canonical records and the
 * platform becomes the single source of truth that the Activity Feed, AI
 * assistants, and notification orchestration later build on.
 *
 * The model is AI-ready by design. Conversations carry structured context
 * (source entity + canonical id), messages carry structured attachments,
 * mentions, reactions, delivery/read state, edits, pins, stars, and hashtags,
 * and the engine derives summaries, action items, meeting notes, reply
 * suggestions, and collaboration opportunities from this structure — so future
 * AI assistants need no database schema changes.
 */

// ---------------------------------------------------------------------------
// Conversation model
// ---------------------------------------------------------------------------

/** The conversation kinds map 1:1 to the Scholatia modules they serve. */
export type ConversationType =
  | 'direct'
  | 'group'
  | 'institution'
  | 'publisher'
  | 'conference'
  | 'journal'
  | 'project'
  | 'grant'
  | 'marketplace'
  | 'service'
  | 'support';

/** Canonical conversation status for a member. */
export type ConversationStatus = 'active' | 'muted' | 'archived';

/** The member roles a conversation can assign. */
export type ConversationRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

/** The granular permissions a role can grant. */
export type ConversationPermission =
  | 'send'
  | 'read'
  | 'invite'
  | 'add-members'
  | 'remove-members'
  | 'manage-roles'
  | 'pin'
  | 'unpin'
  | 'mute'
  | 'archive'
  | 'edit-any'
  | 'delete-any'
  | 'upload-files'
  | 'manage-settings';

/** The entity vocabulary a conversation or attachment can reference. */
export type ConversationEntityType =
  | DiscoveryEntityType
  | 'order'
  | 'service'
  | 'listing'
  | 'campaign'
  | 'subscription'
  | 'review'
  | 'dispute'
  | 'milestone'
  | 'group'
  | 'community'
  | 'conversation';

/** Canonical reference to the record a conversation is about. */
export interface MessageContext {
  entityType: ConversationEntityType;
  id: string;
  title?: string;
  url?: string;
  /** Canonical lifecycle stage of the source record, when applicable. */
  stageId?: ResearchLifecycleStageId;
}

/** A participant is identified by a canonical platform id. */
export interface ConversationMember {
  id: string;
  username?: string;
  name: string;
  avatar?: string;
  role: ConversationRole;
  permissions: ConversationPermission[];
  joinedAt: string;
  muted?: boolean;
  archived?: boolean;
}

/** Granular delivery/notification settings for a conversation. */
export interface ConversationSettings {
  typingIndicators: boolean;
  readReceipts: boolean;
  reactionsEnabled: boolean;
  attachmentsEnabled: boolean;
  mentionsEnabled: boolean;
  searchEnabled: boolean;
  pinsEnabled: boolean;
  starsEnabled: boolean;
  hashtagsEnabled: boolean;
  aiAssistEnabled: boolean;
  messageRetentionDays?: number;
}

/** A standing topic/tag a conversation can subscribe to. */
export interface ConversationTopic {
  id: string;
  label: string;
  context?: MessageContext;
}

/** A single conversation of any kind. */
export interface Conversation {
  id: string;
  type: ConversationType;
  title?: string;
  description?: string;
  context?: MessageContext;
  members: ConversationMember[];
  topics?: ConversationTopic[];
  settings: ConversationSettings;
  status: ConversationStatus;
  pinnedMessageIds: string[];
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Message model
// ---------------------------------------------------------------------------

/** Delivery/lifecycle state of a message for its sender. */
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

/** The message kinds a conversation can carry. */
export type MessageType = 'text' | 'rich-text' | 'image' | 'document' | 'voice-note' | 'video-call' | 'system';

/** The attachment kinds reference canonical records or file blobs. */
export type MessageAttachmentType =
  | 'publication'
  | 'dataset'
  | 'project'
  | 'manuscript'
  | 'grant'
  | 'conference'
  | 'journal'
  | 'publisher'
  | 'institution'
  | 'order'
  | 'service'
  | 'listing'
  | 'image'
  | 'document'
  | 'voice-note'
  | 'video-call'
  | 'file';

/** An attachment references a canonical record or carries file metadata. */
export interface MessageAttachment {
  id: string;
  type: MessageAttachmentType;
  title: string;
  /** Canonical record reference, when the attachment is an entity. */
  entityId?: string;
  url?: string;
  /** File metadata, when the attachment is a blob. */
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  durationSeconds?: number;
}

/** A reaction to a message by one participant. */
export interface MessageReaction {
  emoji: string;
  actorId: string;
  actorName: string;
  createdAt: string;
}

/** A mention of a participant or entity inside a message. */
export interface MessageMention {
  username?: string;
  userId?: string;
  name: string;
  /** Optional entity reference for @-mentions of records. */
  entityType?: ConversationEntityType;
  entityId?: string;
}

/** Read receipt for a single recipient. */
export interface ReadReceipt {
  readerId: string;
  readerName: string;
  readAt: string;
}

/** A single message in a conversation. */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  type: MessageType;
  body: string;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  mentions: MessageMention[];
  hashtags: string[];
  status: MessageStatus;
  replyToId?: string;
  editedAt?: string;
  editCount: number;
  deletedAt?: string;
  deletedBy?: string;
  pinnedAt?: string;
  pinnedBy?: string;
  starredAt?: string;
  starredBy?: string;
  deliveredAt?: string;
  readReceipts: ReadReceipt[];
  /** AI-ready: structured signal space for derived insights. */
  metadata?: Record<string, string>;
  createdAt: string;
}

/** A live typing indicator (transient, never persisted). */
export interface TypingIndicator {
  conversationId: string;
  participantId: string;
  participantName: string;
  startedAt: string;
}

// ---------------------------------------------------------------------------
// Conversation feature state
// ---------------------------------------------------------------------------

/** A star is a per-user flag on a message. */
export interface StarredMessage {
  messageId: string;
  conversationId: string;
  starredBy: string;
  starredByName: string;
  starredAt: string;
}

/** A pin is a per-conversation flag on a message. */
export interface MessagePin {
  messageId: string;
  conversationId: string;
  pinnedBy: string;
  pinnedByName: string;
  pinnedAt: string;
}

/** Per-user archive state for a conversation. */
export interface MessageArchive {
  conversationId: string;
  archivedBy: string;
  archivedAt: string;
}

/** Per-user mute state for a conversation. */
export interface MessageMute {
  conversationId: string;
  mutedBy: string;
  mutedAt: string;
}

// ---------------------------------------------------------------------------
// AI-ready derived insights
// ---------------------------------------------------------------------------

export interface ActionItem {
  text: string;
  owner?: string;
  due?: string;
  sourceMessageId?: string;
}

export interface ConversationSummary {
  conversationId: string;
  title: string;
  participantCount: number;
  messageCount: number;
  period: { from: string; to: string };
  keyTopics: string[];
  actionItems: ActionItem[];
  openQuestions: string[];
  meetingNotes: string[];
  collaborationOpportunities: string[];
  suggestedReply?: string;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Statistics, analytics, portfolio
// ---------------------------------------------------------------------------

export interface ConversationTypeStat {
  type: ConversationType;
  count: number;
  unread: number;
}

export interface MessageTypeStat {
  type: MessageType;
  count: number;
}

export interface MessageStatusStat {
  status: MessageStatus;
  count: number;
}

export interface MessageStatistics {
  totalConversations: number;
  totalMessages: number;
  totalUnread: number;
  totalParticipants: number;
  totalAttachments: number;
  totalReactions: number;
  totalMentions: number;
  totalPinned: number;
  totalStarred: number;
  totalArchived: number;
  totalMuted: number;
  byType: ConversationTypeStat[];
  messageByType: MessageTypeStat[];
  messageByStatus: MessageStatusStat[];
}

export interface MessageAnalytics {
  messagesPerDay: number;
  activeConversations: number;
  mostActiveConversations: { conversationId: string; count: number }[];
  topParticipants: { participantId: string; name: string; count: number }[];
  attachmentByType: { type: MessageAttachmentType; count: number }[];
  mentionsPerMessage: number;
  averageReactions: number;
  replyRate: number;
  editRate: number;
}

/** Aggregate root of the Messaging Platform. */
export interface MessagePortfolio {
  statistics: MessageStatistics;
  analytics: MessageAnalytics;
  conversations: Conversation[];
  messages: Message[];
  starred: StarredMessage[];
  pinned: MessagePin[];
  archives: MessageArchive[];
  mutes: MessageMute[];
  typing: TypingIndicator[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const CONVERSATION_TYPES: readonly ConversationType[] = [
  'direct',
  'group',
  'institution',
  'publisher',
  'conference',
  'journal',
  'project',
  'grant',
  'marketplace',
  'service',
  'support',
];

export const CONVERSATION_TYPE_LABELS: Record<ConversationType, string> = {
  direct: 'Direct',
  group: 'Group',
  institution: 'Institution',
  publisher: 'Publisher',
  conference: 'Conference',
  journal: 'Journal',
  project: 'Project',
  grant: 'Grant',
  marketplace: 'Marketplace',
  service: 'Service',
  support: 'Support',
};

export const CONVERSATION_TYPE_ICONS: Record<ConversationType, string> = {
  direct: '💬',
  group: '👥',
  institution: '🎓',
  publisher: '🏛️',
  conference: '🎤',
  journal: '🗞️',
  project: '📁',
  grant: '💰',
  marketplace: '🛍️',
  service: '🛠️',
  support: '🎧',
};

export const CONVERSATION_STATUSES: readonly ConversationStatus[] = ['active', 'muted', 'archived'];

export const CONVERSATION_STATUS_LABELS: Record<ConversationStatus, string> = {
  active: 'Active',
  muted: 'Muted',
  archived: 'Archived',
};

export const CONVERSATION_ROLES: readonly ConversationRole[] = ['owner', 'admin', 'moderator', 'member', 'guest'];

export const CONVERSATION_ROLE_LABELS: Record<ConversationRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  moderator: 'Moderator',
  member: 'Member',
  guest: 'Guest',
};

export const CONVERSATION_PERMISSIONS: readonly ConversationPermission[] = [
  'send',
  'read',
  'invite',
  'add-members',
  'remove-members',
  'manage-roles',
  'pin',
  'unpin',
  'mute',
  'archive',
  'edit-any',
  'delete-any',
  'upload-files',
  'manage-settings',
];

export const CONVERSATION_PERMISSION_LABELS: Record<ConversationPermission, string> = {
  send: 'Send messages',
  read: 'Read messages',
  invite: 'Invite participants',
  'add-members': 'Add members',
  'remove-members': 'Remove members',
  'manage-roles': 'Manage roles',
  pin: 'Pin messages',
  unpin: 'Unpin messages',
  mute: 'Mute conversation',
  archive: 'Archive conversation',
  'edit-any': 'Edit any message',
  'delete-any': 'Delete any message',
  'upload-files': 'Upload files',
  'manage-settings': 'Manage settings',
};

export const MESSAGE_STATUSES: readonly MessageStatus[] = ['queued', 'sent', 'delivered', 'read', 'failed'];

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  queued: 'Queued',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Failed',
};

export const MESSAGE_TYPES: readonly MessageType[] = [
  'text',
  'rich-text',
  'image',
  'document',
  'voice-note',
  'video-call',
  'system',
];

export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  text: 'Text',
  'rich-text': 'Rich text',
  image: 'Image',
  document: 'Document',
  'voice-note': 'Voice note',
  'video-call': 'Video call',
  system: 'System',
};

export const MESSAGE_TYPE_ICONS: Record<MessageType, string> = {
  text: '💬',
  'rich-text': '📝',
  image: '🖼️',
  document: '📄',
  'voice-note': '🎙️',
  'video-call': '📹',
  system: '🔧',
};

export const MESSAGE_ATTACHMENT_TYPES: readonly MessageAttachmentType[] = [
  'publication',
  'dataset',
  'project',
  'manuscript',
  'grant',
  'conference',
  'journal',
  'publisher',
  'institution',
  'order',
  'service',
  'listing',
  'image',
  'document',
  'voice-note',
  'video-call',
  'file',
];

export const MESSAGE_ATTACHMENT_TYPE_LABELS: Record<MessageAttachmentType, string> = {
  publication: 'Publication',
  dataset: 'Dataset',
  project: 'Project',
  manuscript: 'Manuscript',
  grant: 'Grant',
  conference: 'Conference',
  journal: 'Journal',
  publisher: 'Publisher',
  institution: 'Institution',
  order: 'Order',
  service: 'Service',
  listing: 'Listing',
  image: 'Image',
  document: 'Document',
  'voice-note': 'Voice note',
  'video-call': 'Video call',
  file: 'File',
};

export const MESSAGE_ATTACHMENT_TYPE_ICONS: Record<MessageAttachmentType, string> = {
  publication: '📰',
  dataset: '🗄️',
  project: '📁',
  manuscript: '📄',
  grant: '💰',
  conference: '🎤',
  journal: '🗞️',
  publisher: '🏛️',
  institution: '🎓',
  order: '🧾',
  service: '🛠️',
  listing: '🛍️',
  image: '🖼️',
  document: '📎',
  'voice-note': '🎙️',
  'video-call': '📹',
  file: '📦',
};

export const MESSAGE_EMOJIS: readonly string[] = ['👍', '❤️', '🎉', '🔥', '👏', '💡', '🤝', '❓'];
