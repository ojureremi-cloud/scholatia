import React from 'react';
import Badge from '@/components/ui/Badge';
import type { VerificationChecklistItem } from '@/constants/placeholder-profile';

type VerificationChecklistProps = {
  items: VerificationChecklistItem[];
};

const statusConfig: Record<VerificationChecklistItem['status'], { label: string; variant: 'success' | 'warning' | 'default' }> = {
  verified: { label: 'Verified', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  'not-started': { label: 'Not started', variant: 'default' },
};

export default function VerificationChecklist({ items }: VerificationChecklistProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const config = statusConfig[item.status];
        return (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span
                className={[
                  'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  item.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-500',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.status === 'verified' ? '✓' : item.status === 'pending' ? '…' : '○'}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      })}
    </div>
  );
}
