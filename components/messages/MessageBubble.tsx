'use client';

import React from 'react';
import AttachmentList from './AttachmentList';
import ReactionBar from './ReactionBar';
import ReadReceipts from './ReadReceipts';
import { deliveryTicks, formatRelative, formatTime } from './format';
import type { Message } from '@/types/messages';

type MessageBubbleProps = {
  message: Message;
  currentUserId: string;
  showSender?: boolean;
  senderAvatar?: string;
  onAddReaction?: (id: string, emoji: string) => void;
  onRemoveReaction?: (id: string, emoji: string) => void;
  onToggleStar?: (message: Message) => void;
  onTogglePin?: (id: string) => void;
  onDelete?: (id: string) => void;
  isPinned?: boolean;
  isStarred?: boolean;
};

export default function MessageBubble({
  message,
  currentUserId,
  showSender = true,
  senderAvatar,
  onAddReaction,
  onRemoveReaction,
  onToggleStar,
  onTogglePin,
  onDelete,
  isPinned = false,
  isStarred = false,
}: MessageBubbleProps) {
  const isOwn = message.senderId === currentUserId;
  const isDeleted = Boolean(message.deletedAt);

  return (
    <div className={['flex gap-3', isOwn ? 'flex-row-reverse' : ''].filter(Boolean).join(' ')}>
      {showSender ? (
        <div
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base',
            senderAvatar ? 'bg-slate-100' : 'bg-sky-100',
          ]
            .filter(Boolean)
            .join(' ')}
          title={message.senderName}
        >
          {senderAvatar ?? message.senderName.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
        </div>
      ) : null}

      <div className={['flex max-w-[75%] flex-col', isOwn ? 'items-end' : 'items-start'].filter(Boolean).join(' ')}>
        <div
          className={[
            'rounded-3xl border px-4 py-3 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
            isOwn ? 'rounded-tr-lg border-sky-200 bg-sky-50' : 'rounded-tl-lg border-slate-200 bg-white',
            isDeleted ? 'opacity-60' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {showSender && !isOwn ? <span className="font-semibold text-slate-700">{message.senderName}</span> : null}
            <span title={`${message.createdAt} UTC`}>{formatRelative(message.createdAt)} · {formatTime(message.createdAt)}</span>
            {message.editedAt ? <span>edited</span> : null}
            {isPinned ? <span title="Pinned">📌</span> : null}
            {isStarred ? <span title="Starred">⭐</span> : null}
          </div>

          {message.type !== 'system' ? <p className="mt-1 text-sm leading-relaxed text-slate-700">{message.body}</p> : null}

          {message.attachments.length > 0 ? <AttachmentList attachments={message.attachments} /> : null}

          {message.mentions.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.mentions.map((mention) => (
                <span key={`${mention.name}-${mention.username ?? ''}`} className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                  @{mention.username ?? mention.name}
                </span>
              ))}
            </div>
          ) : null}

          {message.hashtags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.hashtags.map((tag) => (
                <span key={tag} className="text-[11px] font-semibold text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <ReactionBar
            reactions={message.reactions}
            currentUserId={currentUserId}
            onAdd={onAddReaction ? (emoji) => onAddReaction(message.id, emoji) : undefined}
            onRemove={onRemoveReaction ? (emoji) => onRemoveReaction(message.id, emoji) : undefined}
          />
        </div>

        <div className="mt-1 flex items-center gap-2 px-1">
          {isOwn ? (
            <>
              <span className="text-[11px] text-slate-400">{deliveryTicks(message, currentUserId)}</span>
              <ReadReceipts readReceipts={message.readReceipts} currentUserId={currentUserId} />
            </>
          ) : null}

          {!isDeleted && !isOwn ? (
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
              {onToggleStar ? (
                <button
                  type="button"
                  onClick={() => onToggleStar(message)}
                  className="rounded-full px-2 py-0.5 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-amber-500"
                  title={isStarred ? 'Unstar' : 'Star'}
                >
                  {isStarred ? '★' : '☆'}
                </button>
              ) : null}
              {onTogglePin ? (
                <button
                  type="button"
                  onClick={() => onTogglePin(message.id)}
                  className="rounded-full px-2 py-0.5 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  title={isPinned ? 'Unpin' : 'Pin'}
                >
                  {isPinned ? '📌' : '📍'}
                </button>
              ) : null}
              {onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                  className="rounded-full px-2 py-0.5 text-[11px] text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                  title="Delete"
                >
                  ✕
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
