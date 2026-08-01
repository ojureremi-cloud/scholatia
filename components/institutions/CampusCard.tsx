'use client';

import React from 'react';
import type { Campus } from '@/types/institution';

type CampusCardProps = {
  campus: Campus;
  className?: string;
};

export default function CampusCard({ campus, className = '' }: CampusCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">{campus.name}</h3>
      <p className="mt-1 text-sm text-slate-600">
        {campus.city}, {campus.country}
      </p>
      {campus.address ? <p className="mt-1 text-xs text-slate-500">{campus.address}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {campus.establishedYear ? <span>Est. {campus.establishedYear}</span> : null}
        {campus.areaHectares ? <span>{campus.areaHectares} ha</span> : null}
        {campus.studentCount !== undefined ? (
          <span>{campus.studentCount.toLocaleString('en-US')} students</span>
        ) : null}
      </div>
      {campus.faculties.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Faculties</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {campus.faculties.map((faculty) => (
              <span key={faculty} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {faculty}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {campus.facilities.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Facilities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {campus.facilities.map((facility) => (
              <span key={facility} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {facility}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
