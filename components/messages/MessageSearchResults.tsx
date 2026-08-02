'use client';

import React from 'react';
import MessageBubble from './MessageBubble';
import { formatMessageType, formatRelative } from './format';
import type { Conversation, Message } from '@/types/messages';

type MessageSearchResultsProps = {
  messages: Message[];
  conversations: Conversation[];
  query: string;
  currentUserId: string;
};

export default function MessageSearchResults({ messages, conversations, query, currentUserId }: MessageSearchResultsProps) {
  if (messages.length === 0) {
    return <p className="text-sm text-slate-400">No messages match &quot;{query}&quot;.</p>;
  }

  const conversationOf = (conversationId: string) => conversations.find((conversation) => conversation.id === conversationId);

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const conversation = conversationOf(message.conversationId);
        return (
          <div key={message.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-semibold text-sky-700">{conversation?.title ?? message.conversationId}</span>
              <span>
                {message.senderName} · {formatMessageType(message.type)} · {formatRelative(message.createdAt)}
              </span>
            </div>
            <MessageBubble message={message} currentUserId={currentUserId} showSender={false} />
          </div>
        );
      })}
    </div>
  );
}
