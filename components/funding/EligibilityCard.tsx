'use client';

import React from 'react';
import type { Eligibility } from '@/types/funding';

type EligibilityCardProps = {
  eligibility: Eligibility;
  className?: string;
};

function ChipList({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{value}</span>
        ))}
      </div>
    </div>
  );
}

export default function EligibilityCard({ eligibility, className = '' }: EligibilityCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Eligibility</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Who can apply</h3>
      <div className="mt-5 space-y-4">
        <ChipList label="Career stages" values={eligibility.careerStages.map((stage) => stage.replace(/-/g, ' '))} />
        <ChipList label="Disciplines" values={eligibility.disciplines} />
        <ChipList label="Countries" values={eligibility.countries} />
        <ChipList label="Continents" values={eligibility.continents} />
        <ChipList label="Institution types" values={eligibility.institutionTypes} />
      </div>
      {eligibility.requirements.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Requirements</p>
          <ul className="mt-2 space-y-1">
            {eligibility.requirements.map((requirement) => (
              <li key={requirement} className="text-sm text-slate-600">• {requirement}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
        <span className="font-medium text-slate-700">Open to international applicants</span>
        <span className={eligibility.openToInternational ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
          {eligibility.openToInternational ? 'Yes' : 'No'}
        </span>
      </div>
      {eligibility.nationalityRestrictions ? (
        <p className="mt-3 text-sm text-slate-500">Restriction: {eligibility.nationalityRestrictions}</p>
      ) : null}
      {eligibility.exclusions && eligibility.exclusions.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Exclusions</p>
          <ul className="mt-1 space-y-1">
            {eligibility.exclusions.map((exclusion) => (
              <li key={exclusion} className="text-sm text-slate-600">• {exclusion}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
