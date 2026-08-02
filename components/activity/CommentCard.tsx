'use client';

import { useState } from 'react';
import { ReplyCard } from './ReplyCard';
import { formatRelative } from './format';
import type { ActivityComment } from '@/types/activity';

type CommentCardProps = {
  comment: ActivityComment;
  onReply?: (commentId: string, body: string) => void;
};

export function CommentCard({ comment, onReply }: CommentCardProps) {
  const [replying, setReplying] = useState(false);
  const [body, setBody] = useState('');

  const submit = () => {
    if (!body.trim() || !onReply) return;
    onReply(comment.id, body.trim());
    setBody('');
    setReplying(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-2">
        <span className="text-lg">{comment.author.avatar}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {comment.author.name}
            </span>
            <span className="text-xs text-slate-400">{formatRelative(comment.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{comment.body}</p>
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          )}
          {onReply && (
            <div className="mt-3">
              {replying ? (
                <div className="flex items-start gap-2">
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Write a reply…"
                    className="min-h-[64px] flex-1 resize-y rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={submit}
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplying(false)}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setReplying(true)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  Reply
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
