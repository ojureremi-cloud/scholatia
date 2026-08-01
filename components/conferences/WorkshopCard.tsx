'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceWorkshop } from '@/types/conference';

type WorkshopCardProps = {
  workshop: ConferenceWorkshop;
  className?: string;
};

export default function WorkshopCard({ workshop, className = '' }: WorkshopCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{workshop.title}</p>
        <Badge variant="info">{workshop.format}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">Organisers: {workshop.organisers.join(', ')}</p>
      <p className="mt-1 text-sm text-slate-600">
        {workshop.date}
        {workshop.duration ? ` · ${workshop.duration}` : ''}
      </p>
      <p className="mt-1 text-sm text-slate-600">Theme: {workshop.theme}</p>
      {workshop.topics && workshop.topics.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {workshop.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"
            >
              {topic}
            </span>
          ))}
        </div>
      ) : null}
      {workshop.submissionDeadline ? (
        <p className="mt-2 text-xs text-slate-500">Submission deadline: {workshop.submissionDeadline}</p>
      ) : null}
      {workshop.paperCount !== undefined ? (
        <p className="mt-1 text-xs text-slate-500">{workshop.paperCount} papers accepted</p>
      ) : null}
    </div>
  );
}
