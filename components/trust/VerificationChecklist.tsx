import React from 'react';
import type { VerificationCheck } from '@/types/trust';

type VerificationChecklistProps = {
  checks: VerificationCheck[];
};

const statusStyles: Record<VerificationCheck['status'], { icon: string; label: string; className: string }> = {
  verified: { icon: '✓', label: 'Verified', className: 'bg-emerald-50 text-emerald-700' },
  pending: { icon: '◷', label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  'in-review': { icon: '↻', label: 'In review', className: 'bg-sky-50 text-sky-700' },
  'not-started': { icon: '○', label: 'Not started', className: 'bg-slate-50 text-slate-500' },
};

export function VerificationChecklist({ checks }: VerificationChecklistProps) {
  return (
    <ul className="space-y-2.5">
      {checks.map((check) => {
        const status = statusStyles[check.status];
        return (
          <li key={check.id} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${status.className}`}>
              {status.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-800">{check.label}</p>
                <span className="text-xs font-medium text-slate-400">{status.label}</span>
              </div>
              {check.evidence && check.evidence.length > 0 ? (
                <p className="mt-0.5 truncate text-xs text-slate-500">{check.evidence.join(' · ')}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default VerificationChecklist;
