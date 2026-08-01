'use client';

import React from 'react';
import type { Laboratory } from '@/types/institution';

type LaboratoryCardProps = {
  laboratory: Laboratory;
  className?: string;
};

const accessStyles: Record<Laboratory['accessLevel'], string> = {
  Open: 'bg-emerald-100 text-emerald-800',
  Restricted: 'bg-amber-100 text-amber-800',
  Controlled: 'bg-sky-100 text-sky-800',
  Private: 'bg-slate-100 text-slate-700',
};

export default function LaboratoryCard({ laboratory, className = '' }: LaboratoryCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
            {laboratory.departmentName ?? 'Laboratory'}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{laboratory.name}</h3>
        </div>
        <span
          className={[
            'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
            accessStyles[laboratory.accessLevel],
          ].join(' ')}
        >
          {laboratory.accessLevel}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">Director: {laboratory.director}</p>
      {laboratory.focusAreas.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Focus areas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {laboratory.focusAreas.map((area) => (
              <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {area}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {laboratory.equipment.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Equipment</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {laboratory.equipment.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {laboratory.establishedYear ? <span>Est. {laboratory.establishedYear}</span> : null}
        {laboratory.capacity !== undefined ? <span>Capacity: {laboratory.capacity}</span> : null}
      </div>
    </div>
  );
}
