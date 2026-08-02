import type {
  ActionItem,
  Conversation,
  ConversationMember,
  ConversationPermission,
  ConversationRole,
  ConversationSettings,
  ConversationSummary,
  ConversationType,
  ConversationTypeStat,
  Message,
  MessageAnalytics,
  MessageArchive,
  MessageAttachment,
  MessageContext,
  MessageMute,
  MessagePin,
  MessageReaction,
  MessageStatistics,
  MessageStatus,
  MessageType,
  StarredMessage,
  TypingIndicator,
} from '@/types/messages';
import {
  CONVERSATION_PERMISSIONS,
  CONVERSATION_ROLES,
  CONVERSATION_TYPES,
  MESSAGE_ATTACHMENT_TYPES,
  MESSAGE_EMOJIS,
  MESSAGE_TYPES,
} from '@/types/messages';


/**
 * Scholatia Messaging Platform (Phase 2.2B).
 *
 * The pure messaging engine — no React, no side effects, no API calls — and
 * deliberately API-shaped so every helper can be exported directly as an
 * endpoint in later phases (Realtime, Mobile, Enterprise). It owns no records:
 * conversations and messages reference canonical records by ID, delivery is
 * decomposed into status + read receipts, and AI-ready insights (summaries,
 * action items, meeting notes, reply suggestions, collaboration
 * opportunities) are derived from the typed model so no schema change is ever
 * needed.
 */

/** Canonical conversation id prefix. */
export function conversationId(label: string): string {
  return `conv-${label.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`;
}

/** Canonical message id prefix. */
export function messageId(label: string): string {
  return `msg-${label.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`;
}

/** Canonical route resolution for a conversation's context record. */
export function buildConversationUrl(context: MessageContext): string {
  switch (context.entityType) {
    case 'researcher':
      return context.id ? `/researchers/${context.id}` : '/researchers';
    case 'journal':
      return '/journals';
    case 'conference':
      return '/conferences';
    case 'institution':
      return '/institutions';
    case 'publisher':
      return '/publishers';
    case 'project':
      return `/research/${context.id}`;
    case 'publication':
      return '/publications';
    case 'dataset':
      return '/datasets';
    case 'manuscript':
      return '/manuscripts';
    case 'funding':
      return '/funding';
    case 'order':
      return '/commerce';
    case 'service':
      return `/services`;
    case 'listing':
      return '/marketplace';
    case 'campaign':
      return '/advertising';
    case 'subscription':
      return '/commerce';
    case 'review':
      return '/marketplace';
    case 'dispute':
      return '/marketplace';
    case 'milestone':
      return '/services';
    case 'conversation':
    default:
      return '/messages';
  }
}

export function conversationUrl(conversation: Conversation): string {
  return conversation.context?.url ?? `/messages?conversation=${conversation.id}`;
}

const DEFAULT_SETTINGS: ConversationSettings = {
  typingIndicators: true,
  readReceipts: true,
  reactionsEnabled: true,
  attachmentsEnabled: true,
  mentionsEnabled: true,
  searchEnabled: true,
  pinsEnabled: true,
  starsEnabled: true,
  hashtagsEnabled: true,
  aiAssistEnabled: true,
};

const ROLE_DEFAULTS: Record<ConversationRole, readonly ConversationPermission[]> = {
  owner: CONVERSATION_PERMISSIONS,
  admin: CONVERSATION_PERMISSIONS,
  moderator: [
    'send',
    'read',
    'invite',
    'add-members',
    'remove-members',
    'pin',
    'unpin',
    'mute',
    'archive',
    'edit-any',
    'delete-any',
    'upload-files',
  ],
  member: ['send', 'read', 'invite', 'pin', 'unpin', 'mute', 'archive', 'upload-files'],
  guest: ['send', 'read'],
};

export function defaultPermissionsForRole(role: ConversationRole): ConversationPermission[] {
  return [...ROLE_DEFAULTS[role]];
}

export function hasPermission(
  conversation: Conversation,
  userId: string,
  permission: ConversationPermission,
): boolean {
  const member = conversation.members.find((entry) => entry.id === userId);
  if (!member) return false;
  if (member.permissions.includes('manage-settings')) return true;
  return member.permissions.includes(permission);
}

export function canUserSend(conversation: Conversation, userId: string): boolean {
  if (conversation.status === 'archived') return false;
  const member = conversation.members.find((entry) => entry.id === userId);
  if (!member) return false;
  if (member.muted) return false;
  return hasPermission(conversation, userId, 'send');
}

export function createConversation(input: {
  id: string;
  type: ConversationType;
  title?: string;
  description?: string;
  context?: MessageContext;
  members: ConversationMember[];
  topics?: Conversation['topics'];
  settings?: Partial<ConversationSettings>;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
}): Conversation {
  const members = input.members.map((member) => ({
    ...member,
    permissions: member.permissions.length ? member.permissions : defaultPermissionsForRole(member.role),
  }));
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description: input.description,
    context: input.context,
    members,
    topics: input.topics,
    settings: { ...DEFAULT_SETTINGS, ...input.settings },
    status: 'active',
    pinnedMessageIds: [],
    lastMessageAt: input.lastMessageAt,
    lastMessagePreview: input.lastMessagePreview,
    createdAt: input.createdAt,
  };
}

export function createMessage(input: {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  type?: MessageType;
  body: string;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  mentions?: Message['mentions'];
  hashtags?: string[];
  replyToId?: string;
  createdAt: string;
}): Message {
  return {
    id: input.id,
    conversationId: input.conversationId,
    senderId: input.senderId,
    senderName: input.senderName,
    senderUsername: input.senderUsername,
    type: input.type ?? 'text',
    body: input.body,
    attachments: input.attachments ?? [],
    reactions: input.reactions ?? [],
    mentions: input.mentions ?? [],
    hashtags: input.hashtags ?? [],
    status: 'sent',
    replyToId: input.replyToId,
    editCount: 0,
    readReceipts: [],
    metadata: {},
    createdAt: input.createdAt,
  };
}

/** Send a message into a conversation and advance the conversation preview. */
export function sendMessage(conversation: Conversation, message: Message): Conversation {
  return {
    ...conversation,
    lastMessageAt: message.createdAt,
    lastMessagePreview: message.body.slice(0, 140),
  };
}

export function messagesForConversation(messages: readonly Message[], conversationId: string): Message[] {
  return messages
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** All conversations a user is a member of. */
export function conversationsForUser(conversations: readonly Conversation[], userId: string): Conversation[] {
  return conversations.filter((conversation) => conversation.members.some((member) => member.id === userId));
}

/** Find a direct conversation between two participants of a given kind. */
export function findConversationBetween(
  conversations: readonly Conversation[],
  participantA: string,
  participantB: string,
  type: ConversationType = 'direct',
): Conversation | undefined {
  return conversations.find(
    (conversation) =>
      conversation.type === type &&
      conversation.members.some((member) => member.id === participantA) &&
      conversation.members.some((member) => member.id === participantB),
  );
}

/** Count of messages from others not yet read by the user. */
export function unreadMessageCount(messages: readonly Message[], userId: string): number {
  return messages.filter(
    (message) =>
      message.senderId !== userId &&
      message.status !== 'failed' &&
      !message.readReceipts.some((receipt) => receipt.readerId === userId),
  ).length;
}

/** Conversations that contain at least one unread message for the user. */
export function unreadConversationIds(messages: readonly Message[], userId: string): Set<string> {
  const ids = new Set<string>();
  messages.forEach((message) => {
    if (
      message.senderId !== userId &&
      message.status !== 'failed' &&
      !message.readReceipts.some((receipt) => receipt.readerId === userId)
    ) {
      ids.add(message.conversationId);
    }
  });
  return ids;
}

export function markDelivered(messages: readonly Message[], conversationId: string, readerId: string): Message[] {
  const now = new Date().toISOString();
  return messages.map((message) => {
    if (message.conversationId !== conversationId || message.senderId === readerId) return message;
    if (message.status === 'sent' || message.status === 'queued') {
      return { ...message, status: 'delivered', deliveredAt: message.deliveredAt ?? now };
    }
    return message;
  });
}

export function markRead(messages: readonly Message[], conversationId: string, readerId: string): Message[] {
  const now = new Date().toISOString();
  return messages.map((message) => {
    if (message.conversationId !== conversationId || message.senderId === readerId) return message;
    if (message.readReceipts.some((receipt) => receipt.readerId === readerId)) return message;
    return {
      ...message,
      status: 'read',
      readReceipts: [...message.readReceipts, { readerId, readerName: readerId, readAt: now }],
    };
  });
}

export function messageStatusForUser(message: Message, readerId: string): MessageStatus {
  if (message.senderId === readerId) return message.status;
  if (message.readReceipts.some((receipt) => receipt.readerId === readerId)) return 'read';
  if (message.deliveredAt) return 'delivered';
  return 'sent';
}

export function editMessage(messages: readonly Message[], id: string, newBody: string): Message[] {
  const now = new Date().toISOString();
  return messages.map((message) =>
    message.id === id
      ? {
          ...message,
          body: newBody,
          editedAt: now,
          editCount: message.editCount + 1,
          metadata: { ...message.metadata, edited: 'true' },
        }
      : message,
  );
}

export function deleteMessage(messages: readonly Message[], id: string, deletedBy: string): Message[] {
  const now = new Date().toISOString();
  return messages.map((message) =>
    message.id === id
      ? {
          ...message,
          body: 'This message was deleted.',
          deletedAt: now,
          deletedBy,
          attachments: [],
          reactions: [],
          mentions: [],
        }
      : message,
  );
}

export function addReaction(messages: readonly Message[], id: string, reaction: MessageReaction): Message[] {
  const now = reaction.createdAt || new Date().toISOString();
  return messages.map((message) => {
    if (message.id !== id) return message;
    const existing = message.reactions.filter(
      (entry) => !(entry.emoji === reaction.emoji && entry.actorId === reaction.actorId),
    );
    return { ...message, reactions: [...existing, { ...reaction, createdAt: now }] };
  });
}

export function removeReaction(messages: readonly Message[], id: string, actorId: string, emoji: string): Message[] {
  return messages.map((message) =>
    message.id === id
      ? { ...message, reactions: message.reactions.filter((entry) => !(entry.emoji === emoji && entry.actorId === actorId)) }
      : message,
  );
}

export function pinMessage(conversations: readonly Conversation[], conversationId: string, messageIdToPin: string): Conversation[] {
  return conversations.map((conversation) => {
    if (conversation.id !== conversationId) return conversation;
    if (conversation.pinnedMessageIds.includes(messageIdToPin)) return conversation;
    return { ...conversation, pinnedMessageIds: [...conversation.pinnedMessageIds, messageIdToPin] };
  });
}

export function unpinMessage(conversations: readonly Conversation[], conversationId: string, messageIdToUnpin: string): Conversation[] {
  return conversations.map((conversation) =>
    conversation.id === conversationId
      ? { ...conversation, pinnedMessageIds: conversation.pinnedMessageIds.filter((id) => id !== messageIdToUnpin) }
      : conversation,
  );
}

export function toggleStar(
  starred: readonly StarredMessage[],
  message: Message,
  userId: string,
  userName: string,
  now = new Date().toISOString(),
): StarredMessage[] {
  const existing = starred.find((entry) => entry.messageId === message.id && entry.starredBy === userId);
  if (existing) return starred.filter((entry) => entry !== existing);
  return [...starred, { messageId: message.id, conversationId: message.conversationId, starredBy: userId, starredByName: userName, starredAt: now }];
}

export function archiveConversation(archives: readonly MessageArchive[], conversationId: string, userId: string): MessageArchive[] {
  const now = new Date().toISOString();
  if (archives.some((entry) => entry.conversationId === conversationId && entry.archivedBy === userId)) return [...archives];
  return [...archives, { conversationId, archivedBy: userId, archivedAt: now }];
}

export function unarchiveConversation(archives: readonly MessageArchive[], conversationId: string, userId: string): MessageArchive[] {
  return archives.filter((entry) => !(entry.conversationId === conversationId && entry.archivedBy === userId));
}

export function muteConversation(mutes: readonly MessageMute[], conversationId: string, userId: string): MessageMute[] {
  const now = new Date().toISOString();
  if (mutes.some((entry) => entry.conversationId === conversationId && entry.mutedBy === userId)) return [...mutes];
  return [...mutes, { conversationId, mutedBy: userId, mutedAt: now }];
}

export function unmuteConversation(mutes: readonly MessageMute[], conversationId: string, userId: string): MessageMute[] {
  return mutes.filter((entry) => !(entry.conversationId === conversationId && entry.mutedBy === userId));
}

// ---------------------------------------------------------------------------
// Mentions & hashtags
// ---------------------------------------------------------------------------

export function extractHashtags(body: string): string[] {
  return Array.from(new Set((body.match(/#[\p{L}\p{N}_-]+/gu) ?? []).map((tag) => tag.slice(1).toLowerCase())));
}

/** Extract @username mentions and resolve them against conversation members. */
export function extractMentions(body: string, members: readonly ConversationMember[]): Message['mentions'] {
  const names = Array.from(new Set(body.match(/@[\p{L}\p{N}_.-]+/gu) ?? []).values()).map((mention) => mention.slice(1));
  return members
    .filter((member) => names.some((name) => name.toLowerCase() === member.username?.toLowerCase() || name.toLowerCase() === member.name.toLowerCase()))
    .map((member) => ({
      username: member.username,
      userId: member.id,
      name: member.name,
    }));
}

export function hashtagsForConversation(messages: readonly Message[], conversationId: string): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  messages
    .filter((message) => message.conversationId === conversationId)
    .forEach((message) => message.hashtags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Search, filtering, sorting, grouping
// ---------------------------------------------------------------------------

export function searchMessages(messages: readonly Message[], query: string): Message[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [...messages];
  return messages.filter((message) => {
    const haystack = [
      message.body,
      message.senderName,
      message.conversationId,
      ...message.hashtags,
      ...message.attachments.map((attachment) => attachment.title),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(trimmed);
  });
}

export type ConversationFilter = {
  type?: ConversationType | 'all';
  query?: string;
  status?: Conversation['status'] | 'all';
};

export function filterConversations(
  conversations: readonly Conversation[],
  filter: ConversationFilter = {},
): Conversation[] {
  return conversations.filter((conversation) => {
    if (filter.type && filter.type !== 'all' && conversation.type !== filter.type) return false;
    if (filter.status && filter.status !== 'all' && conversation.status !== filter.status) return false;
    if (filter.query) {
      const haystack = [conversation.title ?? '', conversation.description ?? '', conversation.id]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(filter.query.toLowerCase())) return false;
    }
    return true;
  });
}

export type ConversationSort = 'recent' | 'unread' | 'alphabetical' | 'type';

export function sortConversations(
  conversations: readonly Conversation[],
  sort: ConversationSort = 'recent',
  unreadByConversation?: Map<string, number>,
): Conversation[] {
  const sorted = [...conversations];
  switch (sort) {
    case 'alphabetical':
      return sorted.sort((a, b) => (a.title ?? a.id).localeCompare(b.title ?? b.id));
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type) || b.createdAt.localeCompare(a.createdAt));
    case 'unread': {
      return sorted.sort((a, b) => {
        const aUnread = unreadByConversation?.get(a.id) ?? 0;
        const bUnread = unreadByConversation?.get(b.id) ?? 0;
        return bUnread - aUnread || (b.lastMessageAt ?? b.createdAt).localeCompare(a.lastMessageAt ?? a.createdAt);
      });
    }
    case 'recent':
    default:
      return sorted.sort((a, b) => (b.lastMessageAt ?? b.createdAt).localeCompare(a.lastMessageAt ?? a.createdAt));
  }
}

export function groupConversationsByType(
  conversations: readonly Conversation[],
): { type: ConversationType; label: string; items: Conversation[] }[] {
  const order: ConversationType[] = [
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
  return order
    .map((type) => ({
      type,
      label: type,
      items: conversations.filter((conversation) => conversation.type === type),
    }))
    .filter((group) => group.items.length > 0);
}

export function messagesByDate(messages: readonly Message[]): { date: string; items: Message[] }[] {
  const groups = new Map<string, Message[]>();
  messages.forEach((message) => {
    const date = message.createdAt.slice(0, 10);
    groups.set(date, [...(groups.get(date) ?? []), message]);
  });
  return Array.from(groups.entries())
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// Typing indicators
// ---------------------------------------------------------------------------

export function isTyping(typing: readonly TypingIndicator[], conversationId: string, participantId: string): boolean {
  return typing.some((entry) => entry.conversationId === conversationId && entry.participantId === participantId);
}

export function typingForConversation(typing: readonly TypingIndicator[], conversationId: string): TypingIndicator[] {
  return typing.filter((entry) => entry.conversationId === conversationId);
}

// ---------------------------------------------------------------------------
// AI-ready derived insights (no schema change required)
// ---------------------------------------------------------------------------

const ACTION_PATTERNS = /\b(will|must|need to|has to|please|to-do|action item|deadline|by [a-z]+)\b/i;

export function extractActionItems(messages: readonly Message[]): ActionItem[] {
  const items: ActionItem[] = [];
  messages.forEach((message) => {
    if (message.deletedAt) return;
    if (!ACTION_PATTERNS.test(message.body)) return;
    const sentences = message.body.split(/(?<=[.!?])\s+/).filter((sentence) => ACTION_PATTERNS.test(sentence));
    sentences.forEach((sentence) => {
      items.push({
        text: sentence.trim(),
        owner: message.senderName,
        sourceMessageId: message.id,
      });
    });
  });
  return items;
}

export function extractMeetingNotes(messages: readonly Message[]): string[] {
  return messages
    .filter((message) => !message.deletedAt)
    .filter((message) => /^(agenda|decision|outcome|summary|minutes|meeting)/i.test(message.body.trim()))
    .map((message) => message.body.trim())
    .slice(0, 8);
}

export function collaborationOpportunities(conversation: Conversation): string[] {
  const members = conversation.members.filter((member) => member.role !== 'guest');
  if (conversation.type === 'direct' && members.length >= 2) {
    return [`Direct line between ${members[0].name} and ${members[1].name} — a standing collaboration channel.`];
  }
  if (conversation.context) {
    return [`Shared ${conversation.context.entityType} context (${conversation.context.id}) available for joint follow-up.`];
  }
  return [];
}

export function suggestReply(conversation: Conversation, messages: readonly Message[]): string {
  const last = [...messages]
    .filter((message) => message.conversationId === conversation.id && !message.deletedAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (!last) return 'Start the conversation with a clear agenda.';
  if (/\?$/.test(last.body.trim())) {
    return 'Thanks for the update — let me check and get back to you by end of day.';
  }
  if (conversation.type === 'support') {
    return 'We have escalated this to the relevant team and will follow up shortly.';
  }
  if (conversation.type === 'marketplace' || conversation.type === 'service') {
    return 'Understood — I will confirm the deliverables and timelines on the order.';
  }
  return `Thanks ${last.senderName.split(' ')[0]} — acknowledging and will respond in detail shortly.`;
}

export function summarizeConversation(conversation: Conversation, messages: readonly Message[]): ConversationSummary {
  const ordered = messagesForConversation(messages, conversation.id);
  const active = ordered.filter((message) => !message.deletedAt);
  const actionItems = extractActionItems(active);
  const keyTopics = Array.from(
    new Set(active.flatMap((message) => message.hashtags).map((tag) => `#${tag}`)),
  ).slice(0, 6);
  const openQuestions = active
    .filter((message) => /\?$/.test(message.body.trim()))
    .map((message) => message.body.trim())
    .slice(0, 5);
  return {
    conversationId: conversation.id,
    title: conversation.title ?? conversation.id,
    participantCount: conversation.members.length,
    messageCount: active.length,
    period: {
      from: ordered[0]?.createdAt ?? conversation.createdAt,
      to: ordered[ordered.length - 1]?.createdAt ?? conversation.createdAt,
    },
    keyTopics,
    actionItems: actionItems.slice(0, 6),
    openQuestions,
    meetingNotes: extractMeetingNotes(active),
    collaborationOpportunities: collaborationOpportunities(conversation),
    suggestedReply: suggestReply(conversation, messages),
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export function messageStatistics(input: {
  conversations: readonly Conversation[];
  messages: readonly Message[];
  starred: readonly StarredMessage[];
  pinned: readonly MessagePin[];
  archives: readonly MessageArchive[];
  mutes: readonly MessageMute[];
}): MessageStatistics {
  const { conversations, messages, starred, pinned, archives, mutes } = input;
  const unreadIds = new Set(Array.from(unreadConversationIds(messages, 'ojuri')));
  const byType: ConversationTypeStat[] = CONVERSATION_TYPES.map((type) => {
    const ids = conversations.filter((conversation) => conversation.type === type).map((conversation) => conversation.id);
    return { type, count: ids.length, unread: ids.filter((id) => unreadIds.has(id)).length };
  }).filter((stat) => stat.count > 0);
  return {
    totalConversations: conversations.length,
    totalMessages: messages.length,
    totalUnread: unreadMessageCount(messages, 'ojuri'),
    totalParticipants: Array.from(new Set(conversations.flatMap((conversation) => conversation.members.map((member) => member.id)))).length,
    totalAttachments: messages.reduce((sum, message) => sum + message.attachments.length, 0),
    totalReactions: messages.reduce((sum, message) => sum + message.reactions.length, 0),
    totalMentions: messages.reduce((sum, message) => sum + message.mentions.length, 0),
    totalPinned: pinned.length,
    totalStarred: starred.length,
    totalArchived: archives.length,
    totalMuted: mutes.length,
    byType,
    messageByType: MESSAGE_TYPES.map((type) => ({
      type,
      count: messages.filter((message) => message.type === type).length,
    })).filter((stat) => stat.count > 0),
    messageByStatus: (['queued', 'sent', 'delivered', 'read', 'failed'] as MessageStatus[]).map((status) => ({
      status,
      count: messages.filter((message) => message.status === status).length,
    })).filter((stat) => stat.count > 0),
  };
}

export function messageAnalytics(input: {
  conversations: readonly Conversation[];
  messages: readonly Message[];
}): MessageAnalytics {
  const { conversations, messages } = input;
  const byConversation = new Map<string, number>();
  messages.forEach((message) => byConversation.set(message.conversationId, (byConversation.get(message.conversationId) ?? 0) + 1));
  const mostActiveConversations = Array.from(byConversation.entries())
    .map(([conversationId, count]) => ({ conversationId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const byParticipant = new Map<string, { name: string; count: number }>();
  messages.forEach((message) => {
    const entry = byParticipant.get(message.senderId) ?? { name: message.senderName, count: 0 };
    entry.count += 1;
    byParticipant.set(message.senderId, entry);
  });
  const topParticipants = Array.from(byParticipant.entries())
    .map(([participantId, value]) => ({ participantId, name: value.name, count: value.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const attachmentByType = MESSAGE_ATTACHMENT_TYPES.map((type) => ({
    type,
    count: messages.reduce((sum, message) => sum + message.attachments.filter((attachment) => attachment.type === type).length, 0),
  })).filter((stat) => stat.count > 0);
  const replied = messages.filter((message) => message.replyToId).length;
  const edited = messages.filter((message) => message.editCount > 0).length;
  return {
    messagesPerDay: messages.length > 0 ? Math.max(1, Math.round(messages.length / 30)) : 0,
    activeConversations: conversations.filter((conversation) => conversation.status === 'active').length,
    mostActiveConversations,
    topParticipants,
    attachmentByType,
    mentionsPerMessage: messages.length > 0 ? messages.reduce((sum, message) => sum + message.mentions.length, 0) / messages.length : 0,
    averageReactions: messages.length > 0 ? messages.reduce((sum, message) => sum + message.reactions.length, 0) / messages.length : 0,
    replyRate: messages.length > 0 ? Math.round((replied / messages.length) * 100) : 0,
    editRate: messages.length > 0 ? Math.round((edited / messages.length) * 100) : 0,
  };
}

export function attachmentCount(messages: readonly Message[], conversationId: string): number {
  return messages
    .filter((message) => message.conversationId === conversationId)
    .reduce((sum, message) => sum + message.attachments.length, 0);
}

export const MESSAGING_EMOJIS: readonly string[] = MESSAGE_EMOJIS;
export const MESSAGING_TYPES: readonly MessageType[] = MESSAGE_TYPES;
export { CONVERSATION_ROLES };
