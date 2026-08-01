import React from 'react';
import { CategoryBadge, VerifiedVendorBadge, VendorTypeBadge } from './MarketplaceBadge';
import { formatCompactNumber, formatDate, formatRating, formatStars } from './format';
import { buildStoreUrl } from '@/lib/marketplace';
import type { MarketplaceVendor } from '@/types/marketplace';

type VendorCardProps = {
  vendor: MarketplaceVendor;
  featured?: boolean;
};

export default function VendorCard({ vendor, featured = false }: VendorCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {vendor.avatar ? (
            <span className="text-2xl">{vendor.avatar}</span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-700">
              {vendor.name.charAt(0)}
            </span>
          )}
          <div>
            <h3 className="text-lg font-semibold leading-6 text-slate-900">{vendor.name}</h3>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{vendor.tagline}</p>
          </div>
        </div>
        <VendorTypeBadge type={vendor.type} />
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{vendor.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {vendor.badges.slice(0, 4).map((badge) => (
          <span key={badge} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-amber-500">{formatStars(vendor.rating.average)}</span>
        <span className="text-sm font-semibold text-slate-900">{formatRating(vendor.rating)}</span>
        <span className="text-xs text-slate-500">· {vendor.responseTime}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Trust</p>
          <p className="mt-1 font-semibold text-slate-900">{vendor.trustScore}/100</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Orders</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(vendor.completedOrders)} completed</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Location</p>
          <p className="mt-1 font-semibold text-slate-900">
            {vendor.city ? `${vendor.city}, ` : ''}
            {vendor.country}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Followers</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(vendor.followers)}</p>
        </div>
      </div>

      {vendor.institution || vendor.position ? (
        <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
          {vendor.position}
          {vendor.institution ? ` · ${vendor.institution}` : ''}
          {vendor.researcherUsername ? ` · @${vendor.researcherUsername}` : ''}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {vendor.categories.map((category) => (
          <CategoryBadge key={category} category={category} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Joined {formatDate(vendor.joinedAt)}</span>
        <VerifiedVendorBadge verified={vendor.verified} />
      </div>

      {featured ? (
        <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          <a href={buildStoreUrl(vendor.slug)}>Visit store</a>
        </div>
      ) : null}
    </article>
  );
}
