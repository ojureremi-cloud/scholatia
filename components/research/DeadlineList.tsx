import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ResearchDeadline } from '@/constants/placeholder-research';

type DeadlineListProps = {
  deadlines: ResearchDeadline[];
};

const typeVariant: Record<ResearchDeadline['type'], 'info' | 'success' | 'default' | 'warning'> = {
  Submission: 'info',
  Grant: 'success',
  Event: 'default',
  Report: 'warning',
};

const priorityVariant: Record<ResearchDeadline['priority'], 'danger' | 'warning' | 'default'> = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

function formatDate(date: string) {
  const parsed = new Date(date);
  return {
    day: parsed.toLocaleDateString(undefined, { day: 'numeric' }),
    month: parsed.toLocaleDateString(undefined, { month: 'short' }),
    full: parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

export function DeadlineList({ deadlines }: DeadlineListProps) {
  return (
    <ul className="space-y-4">
      {deadlines.map((deadline) => {
        const date = formatDate(deadline.date);
        return (
          <li
            key={deadline.id}
            className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:flex-1">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <span className="text-lg font-semibold leading-none text-slate-900">{date.day}</span>
                <span className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{date.month}</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{deadline.title}</h4>
                <p className="text-sm text-slate-600">{deadline.venue}</p>
                <p className="text-xs text-slate-500">{date.full}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Badge variant={typeVariant[deadline.type]}>{deadline.type}</Badge>
              <Badge variant={priorityVariant[deadline.priority]}>
                {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)} priority
              </Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
