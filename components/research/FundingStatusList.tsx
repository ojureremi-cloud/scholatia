import React from 'react';
import Badge from '@/components/ui/Badge';
import type { FundingStatusEntry } from '@/constants/placeholder-research';

type FundingStatusListProps = {
  entries: FundingStatusEntry[];
};

const statusConfig: Record<FundingStatusEntry['status'], { label: string; variant: 'success' | 'warning' | 'default' }> = {
  funded: { label: 'Fully funded', variant: 'success' },
  partial: { label: 'Partially funded', variant: 'warning' },
  pending: { label: 'Funding pending', variant: 'default' },
};

export function FundingStatusList({ entries }: FundingStatusListProps) {
  return (
    <ul className="space-y-5">
      {entries.map((entry) => {
        const config = statusConfig[entry.status];
        return (
          <li key={entry.projectId}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">{entry.projectName}</h4>
                <p className="text-sm text-slate-600">{entry.funder}</p>
              </div>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Secured</span>
                <span className="font-semibold text-slate-900">
                  {entry.awarded} of {entry.requested}
                </span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-emerald-600"
                  style={{ width: `${entry.progress}%` }}
                  role="progressbar"
                  aria-valuenow={entry.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${entry.projectName} funding secured`}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
