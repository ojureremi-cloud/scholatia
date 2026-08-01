import React from 'react';
import { ScorePill } from './TrustBadge';
import type { ReviewerReputation } from '@/types/trust';

type ReviewerCardProps = {
  reviewer: ReviewerReputation;
  featured?: boolean;
};

export default function ReviewerCard({ reviewer, featured = false }: ReviewerCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className={['font-semibold text-slate-900', featured ? 'text-2xl leading-8' : 'text-lg leading-7'].join(' ')}>
            {reviewer.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-400">{reviewer.reviewerId}</p>
        </div>
        <ScorePill score={reviewer.reputationScore} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{reviewer.reviewsCompleted}</p>
          <p className="text-xs text-slate-500">Reviews completed</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{reviewer.medianTurnaroundDays}d</p>
          <p className="text-xs text-slate-500">Median turnaround</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{Math.round(reviewer.qualityScore)}/100</p>
          <p className="text-xs text-slate-500">Quality score</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{Math.round(reviewer.punctualityScore)}/100</p>
          <p className="text-xs text-slate-500">Punctuality</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {reviewer.journalsServed.slice(0, 3).map((journal) => (
          <span key={journal} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {journal}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        {reviewer.expertiseMatch}/100 expertise match · {reviewer.conflictsAvoided} conflicts avoided
      </p>
    </article>
  );
}
