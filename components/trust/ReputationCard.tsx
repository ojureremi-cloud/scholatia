import React from 'react';
import { GradeBadge, ScorePill } from './TrustBadge';
import { entityTypeIcon, entityTypeLabel } from './format';
import type { ReputationReport } from '@/types/trust';

type ReputationCardProps = {
  report: ReputationReport;
  featured?: boolean;
};

function highlight(report: ReputationReport): string {
  if (report.researchImpact) {
    return `${report.researchImpact.totalCitations} citations · h-index ${report.researchImpact.hIndex} · ${report.researchImpact.percentile}th percentile`;
  }
  if (report.journalQuality) {
    return `Quality index ${report.journalQuality.qualityIndex}/100 · ${report.journalQuality.impactFactor ? `IF ${report.journalQuality.impactFactor}` : 'no IF'} · ${report.journalQuality.quartile ?? 'unranked'}`;
  }
  if (report.conferenceQuality) {
    return `CQI ${report.conferenceQuality.qualityIndex}/100 · ${report.conferenceQuality.acceptanceRate}% acceptance`;
  }
  if (report.institutionalReputation) {
    return `${report.institutionalReputation.publications} publications · h-index ${report.institutionalReputation.hIndex} · ${report.institutionalReputation.reputationScore}/100`;
  }
  if (report.reviewerReputation) {
    return `${report.reviewerReputation.reviewsCompleted} reviews · ${report.reviewerReputation.medianTurnaroundDays}d turnaround`;
  }
  if (report.editorialReputation) {
    return `${report.editorialReputation.manuscriptsHandled} manuscripts handled`;
  }
  return report.summary;
}

export default function ReputationCard({ report, featured = false }: ReputationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {entityTypeIcon(report.entityType)} {entityTypeLabel(report.entityType)}
        </span>
        <GradeBadge grade={report.trustScore.grade} />
      </div>
      <h3 className={['mt-3 font-semibold text-slate-900', featured ? 'text-2xl leading-8' : 'text-lg leading-7'].join(' ')}>
        {report.entityName}
      </h3>
      <div className="mt-2 flex items-center gap-3">
        <ScorePill score={report.trustScore.overall} />
        <span className="text-xs text-slate-400">{report.entityId}</span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{report.trustScore.summary}</p>
      <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">{highlight(report)}</p>
    </article>
  );
}
