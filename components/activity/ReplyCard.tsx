import { formatRelative, formatDateTime } from './format';
import type { ActivityReply } from '@/types/activity';

type ReplyCardProps = {
  reply: ActivityReply;
};

export function ReplyCard({ reply }: ReplyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-start gap-2">
        <span className="text-base">{reply.author.avatar}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{reply.author.name}</span>
            <span className="text-xs text-slate-400" title={formatDateTime(reply.createdAt)}>
              {formatRelative(reply.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{reply.body}</p>
        </div>
      </div>
    </div>
  );
}
