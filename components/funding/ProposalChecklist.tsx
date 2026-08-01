'use client';

import React from 'react';
import type { ProposalRequirement } from '@/types/funding';

type ProposalChecklistProps = {
  requirements: ProposalRequirement[];
  className?: string;
};

export default function ProposalChecklist({ requirements, className = '' }: ProposalChecklistProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Proposal</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Application requirements</h3>
      <ul className="mt-5 space-y-3">
        {requirements.map((requirement) => (
          <li key={requirement.id} className="flex items-start gap-3">
            <span
              className={[
                'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                requirement.required ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {requirement.required ? '✓' : '○'}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">{requirement.label}</p>
              {requirement.description ? <p className="mt-0.5 text-sm leading-5 text-slate-500">{requirement.description}</p> : null}
              {requirement.format ? (
                <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-slate-400">{requirement.format}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
