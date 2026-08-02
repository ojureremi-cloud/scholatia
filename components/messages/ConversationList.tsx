'use client';

import React from 'react';
import ConversationCard from './ConversationCard';
import type { Conversation } from '@/types/messages';

type ConversationListProps = {
  conversations: Conversation[];
  unreadByConversation?: Map<string, number>;
  activeConversationId?: string;
  onSelect?: (id: string) => void;
};

export default function ConversationList({
  conversations,
  unreadByConversation,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
        No conversations match this filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          unreadCount={unreadByConversation?.get(conversation.id) ?? 0}
          isActive={conversation.id === activeConversationId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
