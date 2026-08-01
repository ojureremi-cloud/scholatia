import React from 'react';
import { formatDateLabel, milestoneTypeIcon } from './format';
import type { AcademicMilestone } from '@/types/trust';

type AcademicMilestonesProps = {
  milestones: AcademicMilestone[];
};

export default function AcademicMilestones({ milestones }: AcademicMilestonesProps) {
  return (
    <ol className="relative space-y-6 border-l-2 border-slate-100 pl-6">
      {milestones.map((milestone) => (
        <li key={milestone.id} className="relative">
          <span className="absolute -left-[1.875rem] top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-[10px] text-white ring-2 ring-slate-100">
            {milestoneTypeIcon(milestone.type)}
          </span>
          <p className="text-xs font-semibold text-slate-400">{formatDateLabel(milestone.date)}</p>
          <h4 className="mt-1 font-semibold text-slate-900">{milestone.title}</h4>
          <p className="mt-1 text-sm text-slate-600">{milestone.detail}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {milestone.verified ? 'Verified milestone' : 'Unverified'}
          </p>
        </li>
      ))}
    </ol>
  );
}
