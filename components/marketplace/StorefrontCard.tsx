import React from 'react';
import { CategoryBadge } from './MarketplaceBadge';
import { formatNumber } from './format';
import { buildStoreUrl } from '@/lib/marketplace';
import type { MarketplaceListing, MarketplaceStorefront } from '@/types/marketplace';

type StorefrontCardProps = {
  storefront: MarketplaceStorefront;
  listings?: readonly MarketplaceListing[];
  featured?: boolean;
};

export default function StorefrontCard({ storefront, listings = [], featured = false }: StorefrontCardProps) {
  const storeListings = listings.filter((listing) => storefront.listingIds.includes(listing.id));
  const featuredListings = storefront.featuredListingIds
    .map((id) => storeListings.find((listing) => listing.id === id))
    .filter((listing): listing is MarketplaceListing => Boolean(listing));

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-6 text-slate-900">{storefront.name}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            {formatNumber(storefront.listingIds.length)} listings
          </p>
        </div>
        {storefront.verified ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Verified store</span>
        ) : null}
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{storefront.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {storefront.categories.map((category) => (
          <CategoryBadge key={category} category={category} />
        ))}
      </div>

      {featuredListings.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Featured</p>
          <ul className="mt-2 space-y-1.5">
            {featuredListings.slice(0, 3).map((listing) => (
              <li key={listing.id} className="text-sm text-slate-700">
                {listing.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
        <div>
          <p className="font-medium uppercase tracking-[0.2em] text-slate-400">Returns</p>
          <p className="mt-1">{storefront.policies.returns}</p>
        </div>
        <div>
          <p className="font-medium uppercase tracking-[0.2em] text-slate-400">Refunds</p>
          <p className="mt-1">{storefront.policies.refunds}</p>
        </div>
        <div>
          <p className="font-medium uppercase tracking-[0.2em] text-slate-400">Delivery</p>
          <p className="mt-1">{storefront.policies.delivery}</p>
        </div>
        <div>
          <p className="font-medium uppercase tracking-[0.2em] text-slate-400">Terms</p>
          <p className="mt-1">{storefront.policies.terms}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <a href={buildStoreUrl(storefront.slug)} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          {storefront.url}
        </a>
      </div>

      {featured ? (
        <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          <a href={buildStoreUrl(storefront.slug)}>Open storefront</a>
        </div>
      ) : null}
    </article>
  );
}
