'use client';

import React from 'react';
import MessageBubble from './MessageBubble';
import { formatRelative } from './format';
import type { Conversation, Message, MessagePin } from '@/types/messages';

type PinnedMessagesProps = {
  pinned: MessagePin[];
  messages: Message[];
  conversations: Conversation[];
  currentUserId: string;
  onAddReaction?: (id: string, emoji: string) => void;
  onRemoveReaction?: (id: string, emoji: string) => void;
  onUnpin?: (conversationId: string, messageId: string) => void;
};

export default function PinnedMessages({
  pinned,
  messages,
  conversations,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  onUnpin,
}: PinnedMessagesProps) {
  const items = pinned
    .map((entry) => {
      const message = messages.find((item) => item.id === entry.messageId);
      const conversation = conversations.find((item) => item.id === entry.conversationId);
      return { entry, message, conversation };
    })
    .filter((item): item is { entry: MessagePin; message: Message; conversation: Conversation } => Boolean(item.message && item.conversation));

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No pinned messages in this conversation.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map(({ entry, message, conversation }) => (
        <div key={entry.messageId} className="rounded-[1.75rem] border border-sky-200 bg-sky-50/40 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-sky-700">
              📌 Pinned in {conversation.title ?? conversation.id} · {formatRelative(entry.pinnedAt)}
            </p>
            {onUnpin ? (
              <button
                type="button"
                onClick={() => onUnpin(entry.conversationId, entry.messageId)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Unpin
              </button>
            ) : null}
          </div>
          <MessageBubble
            message={message}
            currentUserId={currentUserId}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            isPinned
          />
        </div>
      ))}
    </div>
  );
}
