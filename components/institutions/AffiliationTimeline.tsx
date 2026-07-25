'use client';

import React from 'react';
import type { InstitutionAffiliation } from '@/types/identity';

type AffiliationTimelineProps = {
  affiliations: InstitutionAffiliation[];
  className?: string;
};

export default function AffiliationTimeline({ affiliations, className = '' }: AffiliationTimelineProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Affiliation history</h3>
      <div className="mt-4 space-y-3">
        {affiliations.map((affiliation) => (
          <div key={`${affiliation.institutionId}-${affiliation.role}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{affiliation.role}</p>
            <p className="mt-1 text-sm text-slate-600">{affiliation.department ?? 'Department not specified'}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">{affiliation.startDate} → {affiliation.endDate ?? 'Present'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
