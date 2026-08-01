'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceTutorial } from '@/types/conference';

type TutorialCardProps = {
  tutorial: ConferenceTutorial;
  className?: string;
};

export default function TutorialCard({ tutorial, className = '' }: TutorialCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{tutorial.title}</p>
        <Badge variant="default">{tutorial.level}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">Instructors: {tutorial.instructors.join(', ')}</p>
      <p className="mt-1 text-sm text-slate-600">
        {tutorial.date}
        {tutorial.duration ? ` · ${tutorial.duration}` : ''}
      </p>
      <p className="mt-1 text-sm text-slate-600">Format: {tutorial.format}</p>
      {tutorial.prerequisites ? (
        <p className="mt-2 text-xs text-slate-500">Prerequisites: {tutorial.prerequisites}</p>
      ) : null}
      {tutorial.capacity !== undefined ? (
        <p className="mt-1 text-xs text-slate-500">Capacity: {tutorial.capacity} attendees</p>
      ) : null}
    </div>
  );
}
