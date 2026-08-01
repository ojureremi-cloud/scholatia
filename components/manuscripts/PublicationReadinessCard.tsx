import React from 'react';
import Badge from '@/components/ui/Badge';
import type { PublicationReadiness } from '@/types/manuscript';

const statusVariant: Record<PublicationReadiness['status'], 'success' | 'warning' | 'danger'> = {
  ready: 'success',
  'in-progress': 'warning',
  'not-ready': 'danger',
};

type PublicationReadinessCardProps = {
  readiness: PublicationReadiness;
};

export function PublicationReadinessCard({ readiness }: PublicationReadinessCardProps) {
  const completeCount = readiness.checks.filter((check) => check.complete).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Readiness score</span>
        <span className="text-2xl font-semibold text-slate-900">{readiness.score}%</span>
        <Badge variant={statusVariant[readiness.status]}>{readiness.status.replace(/-/g, ' ')}</Badge>
      </div>
      <div className="h-2 rounded-full bg-slate-100" role="progressbar" aria-valuenow={readiness.score} aria-valuemin={0} aria-valuemax={100} aria-label="Publication readiness score">
        <div className="h-2 rounded-full bg-teal-600" style={{ width: `${readiness.score}%` }} />
      </div>
      <div className="space-y-2">
        {readiness.checks.map((check) => (
          <div key={check.label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
            <span
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                check.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}
              aria-hidden="true"
            >
              {check.complete ? '✓' : '○'}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{check.label}</p>
              {check.note ? <p className="mt-0.5 text-xs text-amber-600">{check.note}</p> : null}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500">
        {completeCount} of {readiness.checks.length} checks complete
      </p>
    </div>
  );
}
