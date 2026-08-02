import React from 'react';
import { MilestoneStatusBadge } from './ServiceBadge';
import { formatDate, formatPercent } from './format';
import { milestoneProgress } from '@/lib/services';
import type { ServiceOrderMilestone } from '@/types/services';

type MilestoneTrackerProps = {
  milestones: ServiceOrderMilestone[];
};

export default function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
  const progress = milestoneProgress(milestones);

  if (milestones.length === 0) {
    return <p className="text-sm text-slate-500">No milestones tracked for this order.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-800">Delivery milestones</p>
        <span className="text-xs font-medium text-slate-500">{formatPercent(progress)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>
      <ul className="mt-4 space-y-3">
        {milestones.map((milestone) => (
          <li key={milestone.id} className="flex items-start justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
            <div>
              <p className="font-medium text-slate-800">{milestone.title}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Due {formatDate(milestone.dueDate)}
                {milestone.completedAt ? ` · completed ${formatDate(milestone.completedAt)}` : ''}
              </p>
            </div>
            <MilestoneStatusBadge status={milestone.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
