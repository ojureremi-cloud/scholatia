'use client';

import React from 'react';
import type { TypingIndicator as TypingIndicatorType } from '@/types/messages';

type TypingIndicatorProps = {
  typing: TypingIndicatorType[];
};

export default function TypingIndicator({ typing }: TypingIndicatorProps) {
  if (typing.length === 0) return null;

  const names = typing.map((entry) => entry.participantName.split(' ')[0]).join(', ');

  return (
    <div className="flex items-center gap-2 px-1 py-2 text-xs text-slate-400">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
      </span>
      {names} is typing…
    </div>
  );
}
