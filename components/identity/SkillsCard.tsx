'use client';

import React from 'react';

type SkillsCardProps = {
  skills: string[];
  className?: string;
};

export default function SkillsCard({ skills, className = '' }: SkillsCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Skills</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-slate-600">No skills listed yet.</p>
        ) : (
          skills.map((skill) => (
            <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {skill}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
