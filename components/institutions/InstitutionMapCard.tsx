'use client';

import React from 'react';
import type { Campus, Institution } from '@/types/institution';

type InstitutionMapCardProps = {
  institution: Institution;
  className?: string;
};

export default function InstitutionMapCard({ institution, className = '' }: InstitutionMapCardProps) {
  const { profile } = institution;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Campus locations</h3>
      <p className="mt-2 text-sm text-slate-600">
        {profile.city ?? 'City not specified'}, {profile.country ?? 'Country not specified'}
      </p>
      <div className="mt-5 space-y-4">
        {institution.campuses.map((campus: Campus) => (
          <div key={campus.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">📍 {campus.name}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {campus.address ?? `${campus.city}, ${campus.country}`}
                </p>
              </div>
              {campus.coordinates ? (
                <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                  {campus.coordinates.latitude.toFixed(3)}, {campus.coordinates.longitude.toFixed(3)}
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              {campus.establishedYear ? <span>Est. {campus.establishedYear}</span> : null}
              {campus.areaHectares ? <span>{campus.areaHectares} ha</span> : null}
              {campus.studentCount !== undefined ? (
                <span>{campus.studentCount.toLocaleString('en-US')} students</span>
              ) : null}
            </div>
            {campus.facilities.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Facilities</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {campus.facilities.map((facility) => (
                    <span key={facility} className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
