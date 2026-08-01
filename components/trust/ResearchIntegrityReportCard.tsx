import React from 'react';
import IntegrityEventCard from './IntegrityEventCard';
import IntegrityTimeline from './IntegrityTimeline';
import { formatPercent } from './format';
import type { ResearchIntegrityReport } from '@/types/trust';

type ResearchIntegrityReportCardProps = {
  report: ResearchIntegrityReport;
};

export default function ResearchIntegrityReportCard({ report }: ResearchIntegrityReportCardProps) {
  const ratio = report.totalEvents ? Math.round((report.resolvedEvents / report.totalEvents) * 100) : 0;
  return (
    <div>
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-4xl font-semibold text-slate-900">{report.totalEvents}</p>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Tracked events</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-4xl font-semibold text-slate-900">{report.openEvents}</p>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Open / active</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-4xl font-semibold text-slate-900">{formatPercent(ratio)}</p>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Resolved rate</p>
        </div>
      </div>
      <div className="mb-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Research integrity</p>
        <p className="mt-3 text-base leading-8 text-slate-600">{report.summary}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {report.events.map((event) => (
            <IntegrityEventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Integrity timeline</p>
          <div className="mt-6">
            <IntegrityTimeline entries={report.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
