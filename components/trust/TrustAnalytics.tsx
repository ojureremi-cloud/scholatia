import React from 'react';
import ReviewerLeaderboard from './ReviewerLeaderboard';
import {
  entityTypeLabel,
  formatTierLabel,
  integrityTypeLabel,
  recommendationTypeLabel,
} from './format';
import type { TrustAnalytics } from '@/types/trust';

type TrustAnalyticsProps = {
  analytics: TrustAnalytics;
};

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-sky-600" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

export default function TrustAnalytics({ analytics }: TrustAnalyticsProps) {
  const maxVerification = Math.max(...analytics.verificationByEntityType.map((entry) => entry.total), 1);
  const maxTier = Math.max(...analytics.badgesByTier.map((entry) => entry.count), 1);
  const maxBand = Math.max(...analytics.reputationDistribution.map((entry) => entry.count), 1);
  const maxIntegrity = Math.max(...analytics.integrityByType.map((entry) => entry.count), 1);
  const maxRecommendation = Math.max(...analytics.recommendationByType.map((entry) => entry.count), 1);
  const maxJournal = Math.max(...analytics.topReviewedJournals.map((entry) => entry.reviews), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Verification by entity type</p>
        <div className="mt-5 space-y-4">
          {analytics.verificationByEntityType.map((entry) => (
            <div key={entry.entityType}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-700">{entityTypeLabel(entry.entityType)}</span>
                <span className="text-slate-500">
                  {entry.verified} verified · {entry.trusted} trusted · {entry.total} total
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${(entry.total / maxVerification) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Badges by tier</p>
        <div className="mt-5 space-y-4">
          {analytics.badgesByTier.map((entry) => (
            <BarRow key={entry.tier} label={formatTierLabel(entry.tier)} value={entry.count} max={maxTier} />
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Trust score distribution</p>
        <div className="mt-5 space-y-4">
          {analytics.reputationDistribution.map((entry) => (
            <BarRow key={entry.band} label={`Grade ${entry.band}`} value={entry.count} max={maxBand} />
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Integrity by type</p>
        <div className="mt-5 space-y-4">
          {analytics.integrityByType.map((entry) => (
            <BarRow key={entry.type} label={integrityTypeLabel(entry.type)} value={entry.count} max={maxIntegrity} />
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recommendations by type</p>
        <div className="mt-5 space-y-4">
          {analytics.recommendationByType.map((entry) => (
            <BarRow key={entry.type} label={recommendationTypeLabel(entry.type)} value={entry.count} max={maxRecommendation} />
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Most reviewed journals</p>
        <div className="mt-5 space-y-4">
          {analytics.topReviewedJournals.map((entry) => (
            <BarRow key={entry.journalName} label={entry.journalName} value={entry.reviews} max={maxJournal} />
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        <ReviewerLeaderboard reviewers={analytics.reviewerLeaderboard} />
      </div>
    </div>
  );
}
