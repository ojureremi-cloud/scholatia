'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type MessageComposerProps = {
  onSend: (body: string) => void;
  disabled?: boolean;
  placeholder?: string;
  aiSuggestion?: string;
};

export default function MessageComposer({ onSend, disabled = false, placeholder = 'Write a message…', aiSuggestion }: MessageComposerProps) {
  const [body, setBody] = useState('');

  function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setBody('');
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      {aiSuggestion ? (
        <button
          type="button"
          onClick={() => setBody(aiSuggestion)}
          className="mb-3 w-full rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-2 text-left text-xs text-sky-700 transition hover:bg-sky-50"
          title="Insert AI-suggested reply"
        >
          ✨ Suggested reply: {aiSuggestion}
        </button>
      ) : null}
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        rows={3}
        disabled={disabled}
        placeholder={disabled ? 'You do not have permission to send in this conversation.' : placeholder}
        className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">Enter to send · Shift+Enter for a new line</p>
        <Button variant="primary" size="sm" onClick={handleSend} disabled={!body.trim() || disabled}>
          Send →
        </Button>
      </div>
    </div>
  );
}
