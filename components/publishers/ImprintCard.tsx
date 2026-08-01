'use client';

import React from 'react';
import type { Imprint } from '@/types/publisher';

type ImprintCardProps = {
  imprints: Imprint[];
  className?: string;
};

export default function ImprintCard({ imprints, className = '' }: ImprintCardProps) {
  if (imprints.length === 0) {
    return <p className="text-sm text-slate-500">No imprints recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {imprints.map((imprint) => (
        <div key={imprint.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{imprint.name}</p>
            {imprint.openAccess ? (
              <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                Open access
              </span>
            ) : null}
          </div>
          {imprint.foundedYear ? (
            <p className="mt-1 text-xs text-slate-500">Est. {imprint.foundedYear}</p>
          ) : null}
          {imprint.description ? <p className="mt-2 text-xs leading-5 text-slate-600">{imprint.description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {imprint.focusAreas.slice(0, 3).map((area) => (
              <span key={area} className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{area}</span>
            ))}
            {imprint.countries && imprint.countries.length > 0 ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                {imprint.countries.join(', ')}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
