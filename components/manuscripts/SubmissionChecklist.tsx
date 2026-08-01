import React from 'react';
import Badge from '@/components/ui/Badge';
import type { SubmissionChecklistItem } from '@/types/manuscript';

type SubmissionChecklistProps = {
  items: SubmissionChecklistItem[];
};

export function SubmissionChecklist({ items }: SubmissionChecklistProps) {
  const completeCount = items.filter((item) => item.complete).length;
  const percentage = items.length > 0 ? Math.round((completeCount / items.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">
          {completeCount} of {items.length} complete
        </span>
        <div className="h-2 flex-1 rounded-full bg-slate-100" role="progressbar" aria-valuenow={completeCount} aria-valuemin={0} aria-valuemax={items.length} aria-label="Submission checklist progress">
          <div className="h-2 rounded-full bg-teal-600" style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
            <span
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}
              aria-hidden="true"
            >
              {item.complete ? '✓' : '○'}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                {item.required ? <Badge variant="default">Required</Badge> : null}
              </div>
              {item.detail ? <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p> : null}
              {item.note ? <p className="mt-0.5 text-xs text-amber-600">{item.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
