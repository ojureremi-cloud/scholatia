'use client';

import React, { useMemo } from 'react';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import TypingIndicator from './TypingIndicator';
import { formatDate } from './format';
import { messagesByDate } from '@/lib/messages';
import type { Conversation, Message, TypingIndicator as TypingIndicatorType } from '@/types/messages';

type MessageThreadProps = {
  conversation: Conversation;
  messages: Message[];
  typing: TypingIndicatorType[];
  currentUserId: string;
  onSend: (body: string) => void;
  onAddReaction?: (id: string, emoji: string) => void;
  onRemoveReaction?: (id: string, emoji: string) => void;
  onToggleStar?: (message: Message) => void;
  onTogglePin?: (id: string) => void;
  onDelete?: (id: string) => void;
  starredMessageIds?: Set<string>;
  aiSuggestion?: string;
  canSend?: boolean;
};

function avatarFor(conversation: Conversation, senderId: string): string | undefined {
  return conversation.members.find((member) => member.id === senderId)?.avatar;
}

export default function MessageThread({
  conversation,
  messages,
  typing,
  currentUserId,
  onSend,
  onAddReaction,
  onRemoveReaction,
  onToggleStar,
  onTogglePin,
  onDelete,
  starredMessageIds,
  aiSuggestion,
  canSend = true,
}: MessageThreadProps) {
  const grouped = useMemo(() => messagesByDate(messages), [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1 py-4">
        {grouped.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">No messages yet — start the conversation.</p>
        ) : (
          grouped.map((group) => (
            <div key={group.date}>
              <p className="my-4 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                {formatDate(group.date)}
              </p>
              <div className="space-y-4">
                {group.items.map((message) => {
                  const isPinned = conversation.pinnedMessageIds.includes(message.id);
                  const isStarred = starredMessageIds?.has(message.id) ?? false;
                  return (
                    <div key={message.id} className="group">
                      <MessageBubble
                        message={message}
                        currentUserId={currentUserId}
                        showSender
                        senderAvatar={avatarFor(conversation, message.senderId)}
                        onAddReaction={onAddReaction}
                        onRemoveReaction={onRemoveReaction}
                        onToggleStar={onToggleStar}
                        onTogglePin={onTogglePin}
                        onDelete={onDelete}
                        isPinned={isPinned}
                        isStarred={isStarred}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <TypingIndicator typing={typing} />
      </div>

      <div className="border-t border-slate-100 pt-3">
        <MessageComposer onSend={onSend} disabled={!canSend} aiSuggestion={aiSuggestion} />
      </div>
    </div>
  );
}
