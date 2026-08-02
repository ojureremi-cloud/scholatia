'use client';

import React from 'react';
import { MESSAGE_EMOJIS } from '@/types/messages';
import type { MessageReaction } from '@/types/messages';

type ReactionBarProps = {
  reactions: MessageReaction[];
  currentUserId: string;
  onAdd?: (emoji: string) => void;
  onRemove?: (emoji: string) => void;
};

export default function ReactionBar({ reactions, currentUserId, onAdd, onRemove }: ReactionBarProps) {
  if (reactions.length === 0 && !onAdd) return null;

  const grouped = new Map<string, MessageReaction[]>();
  reactions.forEach((reaction) => {
    grouped.set(reaction.emoji, [...(grouped.get(reaction.emoji) ?? []), reaction]);
  });

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {Array.from(grouped.entries()).map(([emoji, entries]) => {
        const mine = entries.some((entry) => entry.actorId === currentUserId);
        return (
          <button
            key={emoji}
            type="button"
            title={entries.map((entry) => entry.actorName).join(', ')}
            onClick={() => (mine ? onRemove?.(emoji) : onAdd?.(emoji))}
            className={[
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition',
              mine ? 'border-sky-300 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span>{emoji}</span>
            <span className="font-semibold">{entries.length}</span>
          </button>
        );
      })}
      {onAdd ? (
        <div className="ml-1 flex items-center gap-1">
          {MESSAGE_EMOJIS.slice(0, 4).map((emoji) => (
            <button
              key={emoji}
              type="button"
              aria-label={`React with ${emoji}`}
              onClick={() => onAdd(emoji)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
