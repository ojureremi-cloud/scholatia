import React from 'react';
import { formatDate, formatNumber } from './format';
import type { MarketplaceListing, MarketplaceWishlist } from '@/types/marketplace';

type WishlistCardProps = {
  wishlist: MarketplaceWishlist;
  listings?: readonly MarketplaceListing[];
};

export default function WishlistCard({ wishlist, listings = [] }: WishlistCardProps) {
  const wishlistListings = listings.filter((listing) => wishlist.listingIds.includes(listing.id));

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{wishlist.name}</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {wishlist.ownerId} · created {formatDate(wishlist.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatNumber(wishlist.listingIds.length)} saved
        </span>
      </div>

      <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
        {wishlistListings.map((listing) => (
          <li key={listing.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">{listing.title}</span>
            <span className="text-xs text-slate-400">♥ {listing.favorites}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {formatNumber(wishlist.listingIds.length - wishlistListings.length)} more saved items
      </p>
    </article>
  );
}
