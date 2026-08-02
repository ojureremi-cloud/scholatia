import { ApprovalStatusBadge } from './ReviewBadges';
import { formatRelative } from './format';
import type { Approval, ApprovalHistoryEntry } from '@/types/reviews';

type ApprovalCardProps = {
  approval: Approval;
};

export function ApprovalCard({ approval }: ApprovalCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{approval.title}</h3>
        <ApprovalStatusBadge status={approval.status} />
      </div>

      {approval.requestedByName && (
        <p className="mt-1 text-xs text-slate-400">Requested by {approval.requestedByName}</p>
      )}

      {approval.description && (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{approval.description}</p>
      )}

      {approval.comment && (
        <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm italic text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          “{approval.comment}”
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
        <span>Requested {formatRelative(approval.createdAt)}</span>
        {approval.decidedAt ? <span>Decided {formatRelative(approval.decidedAt)}</span> : null}
        <span>{approval.approverRole ?? approval.approverName}</span>
      </div>
    </article>
  );
}

type ApprovalHistoryProps = {
  history: ApprovalHistoryEntry[];
};

export function ApprovalHistory({ history }: ApprovalHistoryProps) {
  return (
    <div className="relative space-y-6 pl-6">
      {history.map((entry, index) => (
        <div key={entry.id} className="relative border-l-2 border-slate-100 pb-2 pl-4 dark:border-slate-800">
          <span className="absolute -left-[27px] top-0 h-3 w-3 rounded-full border-2 border-white bg-indigo-500 dark:border-slate-900" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{entry.action}</span>
            <span className="text-xs text-slate-400">
              by {entry.actorName ?? entry.actor} · {formatRelative(entry.at)}
            </span>
          </div>
          {entry.comment && <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{entry.comment}</p>}
          {index === history.length - 1 ? null : <span className="sr-only">{index}</span>}
        </div>
      ))}
    </div>
  );
}
