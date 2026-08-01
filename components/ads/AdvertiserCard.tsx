import React from 'react';
import { VerificationBadge } from './AdsBadge';
import { formatCompactNumber, formatCurrency, formatDate } from './format';
import type { AdvertiserAccount } from '@/types/ads';

type AdvertiserCardProps = {
  advertiser: AdvertiserAccount;
};

export default function AdvertiserCard({ advertiser }: AdvertiserCardProps) {
  const kindLabel = advertiser.kind === 'scholatia-promote' ? 'Scholatia Promote' : 'Scholatia Ads';
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{kindLabel}</span>
        <VerificationBadge status={advertiser.verificationStatus} />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{advertiser.name}</h3>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        {advertiser.accountType} account
      </p>
      {advertiser.companyProfile ? (
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{advertiser.companyProfile.description}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {advertiser.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Spend</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCurrency(advertiser.analytics.totalSpend, 'USD')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Campaigns</p>
          <p className="mt-1 font-semibold text-slate-900">
            {advertiser.analytics.activeCampaigns}/{advertiser.analytics.totalCampaigns} active
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Impressions</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(advertiser.analytics.totalImpressions)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Trust</p>
          <p className="mt-1 font-semibold text-slate-900">{advertiser.trustScore}/100</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Joined {formatDate(advertiser.joinedAt)}</span>
        <span className="font-semibold text-slate-700">{formatCurrency(advertiser.analytics.lifetimeValue, 'USD')} LTV</span>
      </div>
    </article>
  );
}
