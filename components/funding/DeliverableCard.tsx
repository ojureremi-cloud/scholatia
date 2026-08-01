'use client';

import React from 'react';
import { formatDate } from './format';
import type { Deliverable } from '@/types/funding';

type DeliverableCardProps = {
  deliverables: Deliverable[];
  className?: string;
};

const statusVariant: Record<Deliverable['status'], string> = {
  completed: 'bg-emerald-100 text-emerald-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  planned: 'bg-slate-100 text-slate-600',
  delayed: 'bg-rose-100 text-rose-800',
};

const typeIcon: Record<Deliverable['type'], string> = {
  Report: '📄',
  Dataset: '📊',
  Publication: '📚',
  Software: '💻',
  Prototype: '🔧',
  Workshop: '🎤',
  'Policy Document': '🏛️',
  Other: '•',
};

export default function DeliverableCard({ deliverables, className = '' }: DeliverableCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Deliverables</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Expected outputs</h3>
      <ul className="mt-5 space-y-3">
        {deliverables.map((deliverable) => (
          <li key={deliverable.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
            <span className="mt-0.5 text-lg">{typeIcon[deliverable.type] ?? '•'}</span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-slate-900">{deliverable.title}</p>
                <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusVariant[deliverable.status]}`}>
                  {deliverable.status.replace(/-/g, ' ')}
                </span>
              </div>
              {deliverable.description ? <p className="mt-0.5 text-xs leading-5 text-slate-500">{deliverable.description}</p> : null}
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>{deliverable.type}</span>
                {deliverable.dueDate ? <span>· due {formatDate(deliverable.dueDate)}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
