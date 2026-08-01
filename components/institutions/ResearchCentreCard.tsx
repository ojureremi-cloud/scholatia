'use client';

import React from 'react';
import type { ResearchCentre } from '@/types/institution';

type ResearchCentreCardProps = {
  centre: ResearchCentre;
  className?: string;
};

function formatFunding(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResearchCentreCard({ centre, className = '' }: ResearchCentreCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
            {centre.acronym ?? 'Research centre'}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{centre.name}</h3>
        </div>
        {centre.establishedYear ? (
          <span className="flex-shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {centre.establishedYear}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-slate-600">Director: {centre.director}</p>
      {centre.description ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{centre.description}</p>
      ) : null}
      {centre.researchThemes.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Research themes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {centre.researchThemes.map((theme) => (
              <span key={theme} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                {theme}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-lg font-semibold text-slate-900">{centre.staffCount ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Staff</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-lg font-semibold text-slate-900">{centre.activeProjects ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Projects</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-lg font-semibold text-slate-900">{centre.publications ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Publications</p>
        </div>
      </div>
      {centre.fundingAwarded ? (
        <p className="mt-4 text-sm text-slate-600">Funding awarded: {formatFunding(centre.fundingAwarded)}</p>
      ) : null}
    </div>
  );
}
