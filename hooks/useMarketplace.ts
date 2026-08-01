'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  applyCoupon,
  canTransitionOrder,
  effectivePrice,
  filterListings,
  sortListings,
  unreadCount,
} from '@/lib/marketplace';
import type { MarketplaceListingSort } from '@/lib/marketplace';
import { MARKETPLACE_PORTFOLIO } from '@/constants/placeholder-marketplace';
import type {
  MarketplaceCategory,
  MarketplaceCoupon,
  MarketplaceListing,
  MarketplaceNotification,
  MarketplaceOrder,
  MarketplaceOrderStatus,
  MarketplaceWishlist,
} from '@/types/marketplace';

export default function useMarketplace() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | MarketplaceCategory>('all');
  const [sort, setSort] = useState<MarketplaceListingSort>('relevance');
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(MARKETPLACE_PORTFOLIO.listings.filter((listing) => listing.favorites > 40).slice(0, 6).map((listing) => listing.id)),
  );
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>(MARKETPLACE_PORTFOLIO.notifications);
  const [orders, setOrders] = useState<MarketplaceOrder[]>(MARKETPLACE_PORTFOLIO.orders);
  const [wishlists, setWishlists] = useState<MarketplaceWishlist[]>(MARKETPLACE_PORTFOLIO.wishlists);

  const filtered = useMemo(
    () => sortListings(filterListings(MARKETPLACE_PORTFOLIO.listings, { query, category, inStockOnly: true }), sort, query),
    [query, category, sort],
  );

  const toggleFavorite = useCallback((listingId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (listingId: string) => favorites.has(listingId),
    [favorites],
  );

  const toggleWishlist = useCallback(
    (wishlistId: string, listingId: string) => {
      setWishlists((current) =>
        current.map((wishlist) => {
          if (wishlist.id !== wishlistId) return wishlist;
          const has = wishlist.listingIds.includes(listingId);
          return {
            ...wishlist,
            listingIds: has
              ? wishlist.listingIds.filter((id) => id !== listingId)
              : [...wishlist.listingIds, listingId],
          };
        }),
      );
    },
    [],
  );

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }, []);

  const transitionOrder = useCallback((orderId: string, to: MarketplaceOrderStatus) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order;
        return canTransitionOrder(order.status, to) ? { ...order, status: to } : order;
      }),
    );
  }, []);

  const couponValue = useCallback(
    (coupon: MarketplaceCoupon, cartTotal: number) => applyCoupon(coupon, cartTotal),
    [],
  );

  const effectivePriceOf = useCallback((listing: MarketplaceListing) => effectivePrice(listing), []);

  return useMemo(
    () => ({
      portfolio: MARKETPLACE_PORTFOLIO,
      query,
      setQuery,
      category,
      setCategory,
      sort,
      setSort,
      filtered,
      favorites,
      isFavorite,
      toggleFavorite,
      wishlists,
      toggleWishlist,
      notifications,
      unread: unreadCount(notifications),
      markNotificationRead,
      markAllNotificationsRead,
      orders,
      transitionOrder,
      canTransition: canTransitionOrder,
      couponValue,
      effectivePriceOf,
    }),
    [
      query,
      category,
      sort,
      filtered,
      favorites,
      isFavorite,
      toggleFavorite,
      wishlists,
      toggleWishlist,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      orders,
      transitionOrder,
      couponValue,
      effectivePriceOf,
    ],
  );
}
