'use client';

import React from 'react';
import { formatDate } from './format';
import type { Milestone } from '@/types/funding';

type MilestoneCardProps = {
  milestones: Milestone[];
  className?: string;
};

const statusVariant: Record<Milestone['status'], string> = {
  completed: 'bg-emerald-100 text-emerald-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  pending: 'bg-slate-100 text-slate-600',
};

export default function MilestoneCard({ milestones, className = '' }: MilestoneCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Milestones</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Key milestones</h3>
      <ul className="mt-5 space-y-3">
        {milestones.map((milestone) => (
          <li key={milestone.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
            <div>
              <p className="font-medium text-slate-900">{milestone.title}</p>
              {milestone.description ? <p className="mt-0.5 text-xs leading-5 text-slate-500">{milestone.description}</p> : null}
              {milestone.date ? <p className="mt-0.5 text-xs text-slate-400">{formatDate(milestone.date)}</p> : null}
            </div>
            <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusVariant[milestone.status]}`}>
              {milestone.status.replace(/-/g, ' ')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
