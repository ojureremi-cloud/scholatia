'use client';

import React from 'react';
import MessageBubble from './MessageBubble';
import { formatRelative } from './format';
import type { Message, StarredMessage } from '@/types/messages';

type StarredMessagesProps = {
  starred: StarredMessage[];
  messages: Message[];
  currentUserId: string;
  onAddReaction?: (id: string, emoji: string) => void;
  onRemoveReaction?: (id: string, emoji: string) => void;
  onUnstar?: (message: Message) => void;
};

export default function StarredMessages({
  starred,
  messages,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  onUnstar,
}: StarredMessagesProps) {
  const items = starred
    .map((entry) => messages.find((message) => message.id === entry.messageId))
    .filter((entry): entry is Message => Boolean(entry));

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No starred messages yet — star important messages to revisit them later.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((message) => (
        <div key={message.id} className="rounded-[1.75rem] border border-amber-200 bg-amber-50/40 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-amber-700">
              ⭐ Starred {formatRelative(starred.find((entry) => entry.messageId === message.id)?.starredAt)}
            </p>
            {onUnstar ? (
              <button
                type="button"
                onClick={() => onUnstar(message)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Unstar
              </button>
            ) : null}
          </div>
          <MessageBubble
            message={message}
            currentUserId={currentUserId}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            isStarred
          />
        </div>
      ))}
    </div>
  );
}
