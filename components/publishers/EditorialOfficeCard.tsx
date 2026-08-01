'use client';

import React from 'react';
import type { EditorialOffice } from '@/types/publisher';

type EditorialOfficeCardProps = {
  offices: EditorialOffice[];
  className?: string;
};

export default function EditorialOfficeCard({ offices, className = '' }: EditorialOfficeCardProps) {
  if (offices.length === 0) {
    return <p className="text-sm text-slate-500">No editorial offices recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {offices.map((office) => (
        <div key={office.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{office.city}</p>
              <p className="mt-1 text-xs text-slate-500">{office.country}</p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {office.continent}
            </span>
          </div>
          {office.focus ? <p className="mt-2 text-xs leading-5 text-slate-600">{office.focus}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {office.staffCount !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{office.staffCount} staff</span>
            ) : null}
            {office.region ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{office.region}</span>
            ) : null}
          </div>
          {office.roles.length > 0 ? (
            <p className="mt-3 text-xs text-slate-500">Roles: {office.roles.join(', ')}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
