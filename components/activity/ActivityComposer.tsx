'use client';

import { useState } from 'react';

type ActivityComposerProps = {
  onSubmit: (body: string) => void;
  placeholder?: string;
};

export function ActivityComposer({ onSubmit, placeholder = 'Share an update with your community…' }: ActivityComposerProps) {
  const [body, setBody] = useState('');

  const submit = () => {
    if (!body.trim()) return;
    onSubmit(body.trim());
    setBody('');
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">Supports #hashtags and @mentions</p>
        <button
          type="button"
          onClick={submit}
          disabled={!body.trim()}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
