import React from 'react';
import { VerifiedVendorBadge } from './MarketplaceBadge';
import { formatCompactNumber, formatCurrency, formatDate } from './format';
import type { MarketplaceGuestAdvertiser } from '@/types/marketplace';

type GuestAdvertiserCardProps = {
  advertiser: MarketplaceGuestAdvertiser;
};

export default function GuestAdvertiserCard({ advertiser }: GuestAdvertiserCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{advertiser.companyName}</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {advertiser.contactName} · {advertiser.country ?? '—'}
          </p>
        </div>
        <VerifiedVendorBadge verified={advertiser.verified} />
      </div>

      <div className="mt-2 space-y-1 text-xs text-slate-500">
        <p>{advertiser.email}</p>
        {advertiser.website ? <p>{advertiser.website}</p> : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Spend</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCurrency(advertiser.analytics.totalSpend, 'USD')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Campaigns</p>
          <p className="mt-1 font-semibold text-slate-900">{advertiser.analytics.activeCampaigns} active</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Conversions</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(advertiser.analytics.totalConversions)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">ROI</p>
          <p className="mt-1 font-semibold text-slate-900">{advertiser.analytics.roi}%</p>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-1 text-xs text-slate-500">
        <p>{advertiser.campaignIds.length} purchased campaigns</p>
        <p>Promotes {advertiser.promotedListingIds.length} listings</p>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">Joined {formatDate(advertiser.joinedAt)}</p>
    </article>
  );
}
