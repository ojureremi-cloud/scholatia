'use client';

import React, { useMemo } from 'react';
import MessageBubble from './MessageBubble';
import { formatDate } from './format';
import { messagesByDate } from '@/lib/messages';
import type { Conversation, Message } from '@/types/messages';

type MessageTimelineProps = {
  conversation?: Conversation;
  messages: Message[];
  currentUserId: string;
  onAddReaction?: (id: string, emoji: string) => void;
  onRemoveReaction?: (id: string, emoji: string) => void;
  starredMessageIds?: Set<string>;
  limit?: number;
};

export default function MessageTimeline({
  conversation,
  messages,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  starredMessageIds,
  limit,
}: MessageTimelineProps) {
  const visible = useMemo(() => (limit ? [...messages].slice(-limit) : messages), [messages, limit]);
  const grouped = useMemo(() => messagesByDate(visible), [visible]);

  function avatarFor(senderId: string): string | undefined {
    return conversation?.members.find((member) => member.id === senderId)?.avatar;
  }

  return (
    <div className="space-y-4">
      {grouped.length === 0 ? (
        <p className="text-sm text-slate-400">No messages yet.</p>
      ) : (
        grouped.map((group) => (
          <div key={group.date}>
            <p className="my-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {formatDate(group.date)}
            </p>
            <div className="space-y-4">
              {group.items.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  currentUserId={currentUserId}
                  senderAvatar={avatarFor(message.senderId)}
                  onAddReaction={onAddReaction}
                  onRemoveReaction={onRemoveReaction}
                  isStarred={starredMessageIds?.has(message.id) ?? false}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
