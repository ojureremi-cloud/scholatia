'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  addReaction,
  archiveConversation,
  deleteMessage,
  editMessage,
  filterConversations,
  hasPermission,
  markRead,
  messagesForConversation,
  muteConversation,
  pinMessage,
  removeReaction,
  searchMessages,
  sortConversations,
  toggleStar,
  typingForConversation,
  unarchiveConversation,
  unreadConversationIds,
  unmuteConversation,
  unpinMessage,
} from '@/lib/messages';
import type { ConversationFilter, ConversationSort } from '@/lib/messages';
import {
  ALL_ACTION_ITEMS,
  ALL_MESSAGES,
  ARCHIVES,
  CONVERSATIONS,
  FEATURED_CONVERSATION,
  FEATURED_SUMMARY,
  MESSAGE_SUMMARIES,
  MESSAGING_ANALYTICS,
  MESSAGING_PORTFOLIO,
  MESSAGING_STATISTICS,
  MUTES,
  PINNED_MESSAGES,
  STARRED_MESSAGES,
  TYPING,
} from '@/constants/placeholder-messages';
import type { ConversationType } from '@/types/messages';

const CURRENT_USER = 'ojuri';

export default function useMessages() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [messages, setMessages] = useState(ALL_MESSAGES);
  const [starred, setStarred] = useState(STARRED_MESSAGES);
  const [pinned, setPinned] = useState(PINNED_MESSAGES);
  const [archives, setArchives] = useState(ARCHIVES);
  const [mutes, setMutes] = useState(MUTES);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | ConversationType>('all');
  const [sort, setSort] = useState<ConversationSort>('recent');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(FEATURED_CONVERSATION.id);

  const unreadByConversation = useMemo(() => {
    const map = new Map<string, number>();
    messages.forEach((message) => {
      if (message.senderId === CURRENT_USER) return;
      if (message.readReceipts.some((receipt) => receipt.readerId === CURRENT_USER)) return;
      map.set(message.conversationId, (map.get(message.conversationId) ?? 0) + 1);
    });
    return map;
  }, [messages]);

  const filtered = useMemo(() => {
    const filter: ConversationFilter = { type };
    if (showUnreadOnly) {
      const unreadIds = unreadConversationIds(messages, CURRENT_USER);
      return sortConversations(
        conversations.filter((conversation) => unreadIds.has(conversation.id) || unreadByConversation.has(conversation.id)),
        sort,
        unreadByConversation,
      );
    }
    return sortConversations(filterConversations(conversations, filter), sort, unreadByConversation);
  }, [conversations, messages, type, sort, showUnreadOnly, unreadByConversation]);

  const searchResults = useMemo(
    () => (query.trim() ? searchMessages(messages, query) : []),
    [query, messages],
  );

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const activeMessages = useMemo(
    () => (activeConversation ? messagesForConversation(messages, activeConversation.id) : []),
    [messages, activeConversation],
  );

  const activeTyping = useMemo(
    () => (activeConversation ? typingForConversation(TYPING, activeConversation.id) : []),
    [activeConversation],
  );

  const stats = useMemo(
    () => ({
      total: conversations.length,
      unread: unreadByConversation.size,
      starred: starred.length,
      pinned: pinned.length,
      archived: archives.length,
      muted: mutes.length,
    }),
    [conversations, unreadByConversation, starred, pinned, archives, mutes],
  );

  const openConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setMessages((current) => (current.some((item) => item.conversationId === id) ? markRead(current, id, CURRENT_USER) : current));
  }, []);

  const markConversationRead = useCallback((id: string) => setMessages((current) => markRead(current, id, CURRENT_USER)), []);
  const reactToMessage = useCallback(
    (id: string, emoji: string) =>
      setMessages((current) =>
        addReaction(current, id, {
          emoji,
          actorId: CURRENT_USER,
          actorName: 'Dr. Adebisi Ojurere',
          createdAt: new Date().toISOString(),
        }),
      ),
    [],
  );
  const unreact = useCallback((id: string, emoji: string) => setMessages((current) => removeReaction(current, id, CURRENT_USER, emoji)), []);
  const editMessageById = useCallback((id: string, body: string) => setMessages((current) => editMessage(current, id, body)), []);
  const deleteMessageById = useCallback((id: string) => setMessages((current) => deleteMessage(current, id, CURRENT_USER)), []);

  const pinMessageById = useCallback(
    (conversationId: string, messageId: string) => {
      setConversations((current) => pinMessage(current, conversationId, messageId));
      setPinned((current) =>
        current.some((entry) => entry.messageId === messageId && entry.pinnedBy === CURRENT_USER)
          ? current
          : [...current, { messageId, conversationId, pinnedBy: CURRENT_USER, pinnedByName: 'Dr. Adebisi Ojurere', pinnedAt: new Date().toISOString() }],
      );
    },
    [],
  );
  const unpinMessageById = useCallback(
    (conversationId: string, messageId: string) => {
      setConversations((current) => unpinMessage(current, conversationId, messageId));
      setPinned((current) => current.filter((entry) => !(entry.messageId === messageId && entry.pinnedBy === CURRENT_USER)));
    },
    [],
  );

  const toggleStarOnMessage = useCallback(
    (message: (typeof ALL_MESSAGES)[number]) =>
      setStarred((current) => toggleStar(current, message, CURRENT_USER, 'Dr. Adebisi Ojurere')),
    [],
  );

  const archive = useCallback((id: string) => setArchives((current) => archiveConversation(current, id, CURRENT_USER)), []);
  const unarchive = useCallback((id: string) => setArchives((current) => unarchiveConversation(current, id, CURRENT_USER)), []);
  const mute = useCallback((id: string) => setMutes((current) => muteConversation(current, id, CURRENT_USER)), []);
  const unmute = useCallback((id: string) => setMutes((current) => unmuteConversation(current, id, CURRENT_USER)), []);

  const toggleUnreadOnly = useCallback(() => setShowUnreadOnly((current) => !current), []);

  const canSend = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find((entry) => entry.id === conversationId);
      return conversation ? hasPermission(conversation, CURRENT_USER, 'send') : false;
    },
    [conversations],
  );

  const send = useCallback(
    (body: string) => {
      if (!activeConversationId) return;
      const now = new Date().toISOString();
      setMessages((current) => [
        ...current,
        {
          id: `msg-${Date.now()}`,
          conversationId: activeConversationId,
          senderId: CURRENT_USER,
          senderName: 'Dr. Adebisi Ojurere',
          senderUsername: CURRENT_USER,
          type: 'text',
          body,
          attachments: [],
          reactions: [],
          mentions: [],
          hashtags: [],
          status: 'sent',
          editCount: 0,
          readReceipts: [],
          metadata: {},
          createdAt: now,
        },
      ]);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, lastMessageAt: now, lastMessagePreview: body.slice(0, 140) }
            : conversation,
        ),
      );
    },
    [activeConversationId],
  );

  const starredMessageIds = useMemo(() => new Set(starred.map((entry) => entry.messageId)), [starred]);

  const isArchived = useCallback((conversationId: string) => archives.some((entry) => entry.conversationId === conversationId), [archives]);
  const isMuted = useCallback((conversationId: string) => mutes.some((entry) => entry.conversationId === conversationId), [mutes]);

  return useMemo(
    () => ({
      portfolio: MESSAGING_PORTFOLIO,
      conversations: filtered,
      allConversations: conversations,
      searchResults,
      activeConversation,
      activeMessages,
      activeTyping,
      stats,
      summaries: MESSAGE_SUMMARIES,
      featuredSummary: FEATURED_SUMMARY,
      featuredConversation: FEATURED_CONVERSATION,
      actionItems: ALL_ACTION_ITEMS,
      query,
      setQuery,
      type,
      setType,
      sort,
      setSort,
      showUnreadOnly,
      toggleUnreadOnly,
      openConversation,
      markConversationRead,
      reactToMessage,
      unreact,
      editMessageById,
      deleteMessageById,
      pinMessageById,
      unpinMessageById,
      toggleStarOnMessage,
      archive,
      unarchive,
      mute,
      unmute,
      canSend,
      send,
      isArchived,
      isMuted,
      activeConversationId,
      setActiveConversationId,
      starredMessageIds,
      unreadByConversation,
      starred,
      pinned,
      archives,
      mutes,
      typing: TYPING,
      statistics: MESSAGING_STATISTICS,
      analytics: MESSAGING_ANALYTICS,
    }),
    [
      filtered,
      conversations,
      searchResults,
      activeConversation,
      activeMessages,
      activeTyping,
      stats,
      query,
      type,
      sort,
      showUnreadOnly,
      toggleUnreadOnly,
      openConversation,
      markConversationRead,
      reactToMessage,
      unreact,
      editMessageById,
      deleteMessageById,
      pinMessageById,
      unpinMessageById,
      toggleStarOnMessage,
      archive,
      unarchive,
      mute,
      unmute,
      canSend,
      send,
      isArchived,
      isMuted,
      activeConversationId,
      setActiveConversationId,
      starredMessageIds,
      unreadByConversation,
      starred,
      pinned,
      archives,
      mutes,
    ],
  );
}
