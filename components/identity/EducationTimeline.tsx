'use client';

import React from 'react';
import type { EducationEntry } from '@/types/identity';

type EducationTimelineProps = {
  education: EducationEntry[];
  className?: string;
};

export default function EducationTimeline({ education, className = '' }: EducationTimelineProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Education</p>
      <div className="mt-4 space-y-4">
        {education.length === 0 ? (
          <p className="text-sm text-slate-600">No education entries provided.</p>
        ) : (
          education.map((entry) => (
            <div key={`${entry.institution}-${entry.degree}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{entry.degree}</p>
              <p className="mt-1 text-sm text-slate-600">{entry.institution}</p>
              <p className="mt-1 text-sm text-slate-500">{entry.field}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
