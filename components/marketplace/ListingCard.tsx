import React from 'react';
import { CategoryBadge, InventoryStatusBadge, ListingTypeBadge, VerifiedVendorBadge } from './MarketplaceBadge';
import { formatCompactNumber, formatCurrency, formatDate, formatRating, formatStars, listingPricing } from './format';
import type { MarketplaceListing } from '@/types/marketplace';

type ListingCardProps = {
  listing: MarketplaceListing;
  featured?: boolean;
};

export default function ListingCard({ listing, featured = false }: ListingCardProps) {
  const pricing = listingPricing(listing);
  const discount = pricing.percent > 0 ? pricing.percent : listing.discount?.percent ?? 0;

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CategoryBadge category={listing.category} />
          <ListingTypeBadge type={listing.type} />
        </div>
        <div className="flex items-center gap-2">
          {listing.featured ? (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Featured</span>
          ) : null}
          {listing.sponsored ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">Sponsored</span>
          ) : null}
          {listing.bestSeller ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Best seller</span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{listing.title}</h3>
      <a
        href={`/researchers?q=${encodeURIComponent(listing.vendorName)}`}
        className="mt-1 text-sm font-medium text-sky-700 hover:text-sky-800"
      >
        {listing.vendorName}
      </a>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{listing.summary}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-amber-500">{formatStars(listing.rating.average)}</span>
        <span className="text-sm font-semibold text-slate-900">{formatRating(listing.rating)}</span>
        <span className="text-xs text-slate-500">· {formatCompactNumber(listing.orders)} orders</span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          {pricing.onSale && discount > 0 ? (
            <>
              <p className="text-xs text-slate-400 line-through">
                {formatCurrency(pricing.list, listing.price.currency)}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(pricing.effective, listing.price.currency)}
              </p>
            </>
          ) : (
            <p className="text-lg font-semibold text-slate-900">
              {formatCurrency(listing.price.amount, listing.price.currency)}
            </p>
          )}
          {listing.price.interval ? (
            <p className="text-xs text-slate-400">/ {listing.price.interval.replace(/-/g, ' ')}</p>
          ) : null}
        </div>
        {pricing.onSale && discount > 0 ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            {discount}% off
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <InventoryStatusBadge status={listing.inventory.status} />
        {listing.inventory.deliveryDays ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {listing.inventory.deliveryDays}-day delivery
          </span>
        ) : null}
        <VerifiedVendorBadge verified={listing.verifiedVendor} />
      </div>

      {listing.researchAreas.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.researchAreas.slice(0, 3).map((area) => (
            <span key={area} className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {area}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Added {formatDate(listing.dateAdded)}</span>
        <span>{formatCompactNumber(listing.views)} views · {formatCompactNumber(listing.favorites)} ♥</span>
      </div>

      {featured ? (
        <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          <a href={listing.url}>View listing</a>
        </div>
      ) : null}
    </article>
  );
}
