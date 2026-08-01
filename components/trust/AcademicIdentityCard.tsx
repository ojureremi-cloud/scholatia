import React from 'react';
import OrcidCard from './OrcidCard';
import AffiliationCard from './AffiliationCard';
import AcademicMilestones from './AcademicMilestones';
import AcademicTimeline from './AcademicTimeline';
import type { AcademicIdentityReport } from '@/types/trust';

type AcademicIdentityCardProps = {
  report: AcademicIdentityReport;
};

export default function AcademicIdentityCard({ report }: AcademicIdentityCardProps) {
  return (
    <div>
      <div className="mb-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Academic identity</p>
        <p className="mt-3 text-base leading-8 text-slate-600">{report.summary}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <OrcidCard record={report.orcid} />
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Affiliation history</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {report.affiliations.map((affiliation) => (
              <AffiliationCard key={affiliation.id} affiliation={affiliation} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Career milestones</p>
          <div className="mt-6">
            <AcademicMilestones milestones={report.milestones} />
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Academic timeline</p>
          <div className="mt-6">
            <AcademicTimeline entries={report.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
