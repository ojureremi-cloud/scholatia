import React from 'react';
import PeerReviewAssignmentCard from './PeerReviewAssignmentCard';
import ReviewHistoryCard from './ReviewHistoryCard';
import ReviewerAnalyticsPanel from './ReviewerAnalyticsPanel';
import type { PeerReviewInfrastructureReport } from '@/types/trust';

type PeerReviewInfrastructureProps = {
  report: PeerReviewInfrastructureReport;
};

export default function PeerReviewInfrastructure({ report }: PeerReviewInfrastructureProps) {
  return (
    <div>
      <div className="mb-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Peer review infrastructure</p>
        <p className="mt-3 text-base leading-8 text-slate-600">{report.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {report.models.map((model) => (
            <span key={model} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {model.replaceAll('-', ' ')}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ReviewerAnalyticsPanel analytics={report.analytics} />
        <div className="grid gap-6">
          {report.assignments.map((assignment) => (
            <PeerReviewAssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {report.history.map((entry) => (
          <ReviewHistoryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
