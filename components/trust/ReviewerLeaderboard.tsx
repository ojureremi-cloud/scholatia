import React from 'react';
import { ScorePill } from './TrustBadge';
import type { ReviewerReputation } from '@/types/trust';

type ReviewerLeaderboardProps = {
  reviewers: ReviewerReputation[];
};

export default function ReviewerLeaderboard({ reviewers }: ReviewerLeaderboardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Reviewer leaderboard</p>
      <ol className="mt-4 space-y-3">
        {reviewers.map((reviewer, index) => (
          <li key={reviewer.reviewerId} className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800">{reviewer.name}</p>
              <p className="text-xs text-slate-500">
                {reviewer.reviewsCompleted} reviews · {reviewer.medianTurnaroundDays}d · {Math.round(reviewer.qualityScore)}/100 quality
              </p>
            </div>
            <ScorePill score={reviewer.reputationScore} />
          </li>
        ))}
      </ol>
    </article>
  );
}
