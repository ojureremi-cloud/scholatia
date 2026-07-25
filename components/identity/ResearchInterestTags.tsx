'use client';

import React from 'react';

type ResearchInterestTagsProps = {
  interests: string[];
  className?: string;
};

export default function ResearchInterestTags({ interests, className = '' }: ResearchInterestTagsProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Research interests</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {interests.length === 0 ? (
          <p className="text-sm text-slate-600">No interests provided.</p>
        ) : (
          interests.map((interest) => (
            <span key={interest} className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800">
              {interest}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
