'use client';

import React from 'react';
import type { Faculty } from '@/types/institution';

type FacultyCardProps = {
  faculty: Faculty;
  className?: string;
};

export default function FacultyCard({ faculty, className = '' }: FacultyCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{faculty.shortName ?? 'Faculty'}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{faculty.name}</h3>
      <p className="mt-1 text-sm text-slate-600">Dean: {faculty.dean}</p>
      {faculty.establishedYear ? <p className="mt-1 text-xs text-slate-500">Established {faculty.establishedYear}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xl font-semibold text-slate-900">{faculty.studentCount ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Students</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xl font-semibold text-slate-900">{faculty.academicStaffCount ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Academic staff</p>
        </div>
      </div>
      {faculty.researchFocus.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Research focus</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {faculty.researchFocus.map((focus) => (
              <span key={focus} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {focus}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
