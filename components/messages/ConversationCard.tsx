'use client';

import React from 'react';
import { formatConversationStatus, formatConversationType, formatConversationTypeIcon, formatRelative, statusVariant } from './format';
import Badge from '@/components/ui/Badge';
import ConversationBadge from './ConversationBadge';
import type { Conversation } from '@/types/messages';

type ConversationCardProps = {
  conversation: Conversation;
  unreadCount?: number;
  isActive?: boolean;
  onSelect?: (id: string) => void;
};

function memberIcon(conversation: Conversation): string {
  return conversation.members.find((member) => member.avatar)?.avatar ?? formatConversationTypeIcon(conversation.type);
}

export default function ConversationCard({ conversation, unreadCount = 0, isActive = false, onSelect }: ConversationCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(conversation.id)}
      className={[
        'w-full rounded-[1.75rem] border bg-white p-5 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition',
        isActive ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200 hover:border-sky-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
            {memberIcon(conversation)}
          </span>
          <div>
            <p className="font-semibold text-slate-900">{conversation.title ?? conversation.id}</p>
            <p className="text-xs text-slate-400">
              {formatConversationType(conversation.type)} · {formatConversationStatus(conversation.status)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className="text-xs text-slate-400">{formatRelative(conversation.lastMessageAt ?? conversation.createdAt)}</p>
          {unreadCount > 0 ? (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-600 px-2 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-500">{conversation.lastMessagePreview ?? conversation.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConversationBadge type={conversation.type} />
        <Badge variant={statusVariant(conversation.status)}>{formatConversationStatus(conversation.status)}</Badge>
        <span className="ml-auto text-xs text-slate-400">{conversation.members.length} participants</span>
      </div>
    </button>
  );
}
