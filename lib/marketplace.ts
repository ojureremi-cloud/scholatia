import type {
  MarketplaceAnalytics,
  MarketplaceAvailability,
  MarketplaceAvailabilitySlot,
  MarketplaceBooking,
  MarketplaceBundle,
  MarketplaceCategory,
  MarketplaceCoupon,
  MarketplaceDispute,
  MarketplaceInvoiceLine,
  MarketplaceListing,
  MarketplaceListingStat,
  MarketplaceMessage,
  MarketplaceOrder,
  MarketplaceOrderItem,
  MarketplaceOrderStatus,
  MarketplacePayment,
  MarketplacePromotion,
  MarketplaceRefund,
  MarketplaceReview,
  MarketplaceRevenueDashboard,
  MarketplaceSalesDashboard,
  MarketplaceSalesDayPoint,
  MarketplaceStatistics,
  MarketplaceVendor,
  MarketplaceVendorStat,
} from '@/types/marketplace';
import { MARKETPLACE_CATEGORIES } from '@/types/marketplace';
import type { DiscoveryEntityType, DiscoveryItem } from '@/types/discovery';
import type { CurrencyCode } from '@/types/funding';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { PromotableObject } from '@/types/ads';
import { createPromotableObject } from '@/lib/ads';

/**
 * Scholatia Marketplace Engine (Phase 1.9B).
 *
 * The Marketplace is the platform-wide commercial and transactional layer. It
 * does NOT own records and does NOT duplicate any module data — every listing
 * references an existing source record (a researcher SAID, a journal id, a
 * conference id, a DOI, an institution SAID), every vendor references a
 * researcher identity when applicable, and every listing is simultaneously
 * promotable (Advertising module) and searchable (Discovery module). These
 * utilities are pure, strongly typed helpers so the placeholder data and the
 * Marketplace page never re-implement pricing, review aggregation, search,
 * order lifecycle, coupons, bundles, bookings, dashboards, or discovery mapping
 * by hand.
 */

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export const MARKETPLACE_STORE_ROOT = '/store';
export const MARKETPLACE_LISTING_ROOT = '/marketplace/listings';

/** Canonical in-app vendor store URL: /store/{slug}. */
export function buildStoreUrl(slug: string): string {
  return `${MARKETPLACE_STORE_ROOT}/${slug}`;
}

/** Future subdomain form of a store: https://{slug}.store.scholatia.com. */
export function buildStoreSubdomain(slug: string): string {
  return `https://${slug}.store.scholatia.com`;
}

/** Canonical in-app listing URL. */
export function buildListingUrl(id: string): string {
  return `${MARKETPLACE_LISTING_ROOT}/${id}`;
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/** Effective unit price after any discount, in the listing's currency. */
export function effectivePrice(listing: MarketplaceListing): number {
  const discount = listing.discount;
  if (!discount) return listing.price.amount;
  let effective = listing.price.amount;
  if (discount.fixed != null) {
    effective = Math.max(0, effective - discount.fixed);
  }
  if (discount.percent != null) {
    effective = effective * (1 - discount.percent / 100);
  }
  if (listing.price.compareAt != null && listing.price.compareAt > effective) {
    effective = listing.price.compareAt;
  }
  return Math.round(effective * 100) / 100;
}

/** List price (compare-at or stated amount). */
export function listPrice(listing: MarketplaceListing): number {
  return listing.price.compareAt ?? listing.price.amount;
}

/** Whole-number discount percent currently applied to a listing. */
export function discountPercentOf(listing: MarketplaceListing): number {
  const list = listPrice(listing);
  if (list <= 0) return 0;
  const effective = effectivePrice(listing);
  if (effective >= list) return 0;
  return Math.round(((list - effective) / list) * 100);
}

export function isOnSale(listing: MarketplaceListing): boolean {
  return listing.onSale || discountPercentOf(listing) > 0;
}

// ---------------------------------------------------------------------------
// Reviews & ratings
// ---------------------------------------------------------------------------

export function emptyRating() {
  return {
    average: 0,
    count: 0,
    distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
  };
}

/** Star distribution computed from a set of reviews. */
export function ratingDistributionFrom(reviews: readonly MarketplaceReview[]) {
  const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  for (const review of reviews) {
    const key = String(Math.min(5, Math.max(1, Math.round(review.rating)))) as '1' | '2' | '3' | '4' | '5';
    distribution[key] += 1;
  }
  return distribution;
}

/** Aggregate rating summary for any review set. */
export function ratingFromReviews(reviews: readonly MarketplaceReview[]) {
  if (reviews.length === 0) return emptyRating();
  const distribution = ratingDistributionFrom(reviews);
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return { average: Math.round(average * 10) / 10, count: reviews.length, distribution };
}

/** Reviews for a single listing, plus its aggregate rating. */
export function aggregateReviews(reviews: readonly MarketplaceReview[], listingId: string) {
  const listingReviews = reviews.filter((review) => review.listingId === listingId);
  return { reviews: listingReviews, summary: ratingFromReviews(listingReviews) };
}

// ---------------------------------------------------------------------------
// Search, filtering, ranking
// ---------------------------------------------------------------------------

export function listingKeywords(listing: MarketplaceListing): string[] {
  return Array.from(
    new Set([
      ...listing.keywords,
      ...listing.researchAreas,
      ...listing.skills,
      ...listing.tags,
      listing.category,
      listing.subcategory ?? '',
      listing.vendorName,
    ].filter(Boolean)),
  );
}

function tokensOf(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s\-_,.:/]+/)
    .filter((token) => token.length > 0);
}

/** 0-100 relevance score for a single listing against a free-text query. */
export function scoreListingRelevance(listing: MarketplaceListing, query: string): number {
  if (!query.trim()) return listing.rating.average * 5 + listing.orders;
  const tokens = tokensOf(query);
  if (tokens.length === 0) return 0;
  const haystack = [
    listing.title,
    listing.summary,
    listing.description,
    listing.vendorName,
    listing.category,
    listing.subcategory ?? '',
    ...listingKeywords(listing),
  ]
    .join(' ')
    .toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 30;
  }
  const matchRatio = score / (30 * tokens.length);
  const popularity = Math.min(25, listing.orders * 0.5 + listing.rating.average * 3 + listing.favorites * 0.25);
  return Math.min(100, Math.round(matchRatio * 75 + popularity));
}

export type MarketplaceListingFilter = {
  query?: string;
  category?: MarketplaceCategory | 'all';
  type?: MarketplaceListing['type'];
  minPrice?: number;
  maxPrice?: number;
  currency?: CurrencyCode;
  careerStage?: string;
  country?: string;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  sponsoredOnly?: boolean;
  onSaleOnly?: boolean;
  inStockOnly?: boolean;
};

/** Apply the marketplace filter set without re-implementing it in the UI. */
export function filterListings(listings: readonly MarketplaceListing[], filter: MarketplaceListingFilter = {}): MarketplaceListing[] {
  return listings.filter((listing) => {
    if (filter.query && scoreListingRelevance(listing, filter.query) <= 0) return false;
    if (filter.category && filter.category !== 'all' && listing.category !== filter.category) return false;
    if (filter.type && listing.type !== filter.type) return false;
    if (filter.currency && listing.price.currency !== filter.currency) return false;
    if (filter.minPrice != null && effectivePrice(listing) < filter.minPrice) return false;
    if (filter.maxPrice != null && effectivePrice(listing) > filter.maxPrice) return false;
    if (filter.careerStage && !listing.careerStages.includes(filter.careerStage as never)) return false;
    if (filter.country && listing.country !== filter.country) return false;
    if (filter.verifiedOnly && !listing.verifiedVendor) return false;
    if (filter.featuredOnly && !listing.featured) return false;
    if (filter.sponsoredOnly && !listing.sponsored) return false;
    if (filter.onSaleOnly && !isOnSale(listing)) return false;
    if (filter.inStockOnly && listing.inventory.status === 'unavailable') return false;
    return true;
  });
}

export type MarketplaceListingSort =
  | 'relevance'
  | 'recent'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popularity';

/** Sort a listing slice; relevance requires a query and falls back to recency. */
export function sortListings(listings: readonly MarketplaceListing[], sort: MarketplaceListingSort = 'relevance', query = ''): MarketplaceListing[] {
  const sorted = [...listings];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    case 'price-asc':
      return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case 'rating':
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
    case 'popularity':
      return sorted.sort((a, b) => b.orders + b.views * 0.1 - (a.orders + a.views * 0.1));
    case 'relevance':
    default:
      return sorted.sort((a, b) => scoreListingRelevance(b, query) - scoreListingRelevance(a, query));
  }
}

/** Free-text marketplace search: filter + rank + limit. */
export function searchListings(listings: readonly MarketplaceListing[], query: string, limit?: number): MarketplaceListing[] {
  const ranked = filterListings(listings, { query }).sort(
    (a, b) => scoreListingRelevance(b, query) - scoreListingRelevance(a, query),
  );
  return limit != null ? ranked.slice(0, limit) : ranked;
}

// ---------------------------------------------------------------------------
// Vendors & storefronts
// ---------------------------------------------------------------------------

export function vendorBySlug(vendors: readonly MarketplaceVendor[], slug: string): MarketplaceVendor | undefined {
  return vendors.find((vendor) => vendor.slug === slug);
}

export function listingsByVendor(listings: readonly MarketplaceListing[], vendorId: string): MarketplaceListing[] {
  return listings.filter((listing) => listing.vendorId === vendorId);
}

/** 0-100 vendor quality score from listings, reviews, verification, and volume. */
export function scoreVendorQuality(
  vendor: MarketplaceVendor,
  listings: readonly MarketplaceListing[],
  reviews: readonly MarketplaceReview[],
): number {
  const vendorListings = listingsByVendor(listings, vendor.id);
  const listingReviews = reviews.filter((review) => review.vendorId === vendor.id);
  const rating = ratingFromReviews(listingReviews);
  const verificationScore = vendor.verified ? 25 : 8;
  const ratingScore = Math.min(30, Math.round(rating.average * 6));
  const volumeScore = Math.min(20, vendor.completedOrders * 0.4);
  const listingScore = Math.min(15, vendorListings.length * 2.5);
  const responseScore = vendor.responseTime.includes('hour') ? 10 : 6;
  return Math.min(100, Math.round(verificationScore + ratingScore + volumeScore + listingScore + responseScore));
}

/** Rank vendors for a free-text query using their listings and categories. */
export function recommendVendors(
  vendors: readonly MarketplaceVendor[],
  listings: readonly MarketplaceListing[],
  query: string,
  limit?: number,
): MarketplaceVendor[] {
  const tokens = tokensOf(query);
  const scored = vendors
    .map((vendor) => {
      const vendorListings = listingsByVendor(listings, vendor.id);
      const haystack = [
        vendor.name,
        vendor.tagline,
        vendor.description,
        ...vendor.skills,
        ...vendor.categories,
        ...vendorListings.flatMap((listing) => listingKeywords(listing)),
      ]
        .join(' ')
        .toLowerCase();
      let matchScore = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) matchScore += 25;
      }
      const base = tokens.length ? (matchScore / (25 * tokens.length)) * 70 : 40;
      const quality = scoreVendorQuality(vendor, listings, []);
      return { vendor, score: Math.min(100, Math.round(base + quality * 0.3)) };
    })
    .sort((a, b) => b.score - a.score);
  const ranked = scored.map((entry) => entry.vendor);
  return limit != null ? ranked.slice(0, limit) : ranked;
}

/** Top-rated listings across the marketplace, with an optional query. */
export function recommendListings(
  listings: readonly MarketplaceListing[],
  query: string,
  limit?: number,
): MarketplaceListing[] {
  return searchListings(listings, query, limit ?? undefined);
}

// ---------------------------------------------------------------------------
// Orders, coupons, invoices, bundles
// ---------------------------------------------------------------------------

export const ORDER_STATUS_TRANSITIONS: Record<MarketplaceOrderStatus, readonly MarketplaceOrderStatus[]> = {
  pending: ['confirmed', 'cancelled', 'disputed'],
  confirmed: ['in-progress', 'delivered', 'cancelled', 'refunded', 'disputed'],
  'in-progress': ['delivered', 'cancelled', 'disputed'],
  delivered: ['completed', 'refunded', 'disputed'],
  completed: ['refunded', 'disputed'],
  cancelled: [],
  refunded: [],
  disputed: ['confirmed', 'refunded', 'completed', 'cancelled'],
};

export function canTransitionOrder(from: MarketplaceOrderStatus, to: MarketplaceOrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
}

export function orderSubtotal(items: readonly MarketplaceOrderItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100) / 100;
}

/** Apply order-level discount over the subtotal. */
export function orderTotal(items: readonly MarketplaceOrderItem[], discount = 0) {
  const subtotal = orderSubtotal(items);
  const discounted = Math.max(0, subtotal - discount);
  return {
    subtotal,
    discount,
    total: Math.round(discounted * 100) / 100,
  };
}

/**
 * Apply a coupon to a cart total. Returns `null` when the coupon cannot be
 * used (expired, disabled, usage cap reached, or below minimum spend).
 */
export function applyCoupon(coupon: MarketplaceCoupon, cartTotal: number, today = new Date().toISOString()): { discount: number; total: number } | null {
  if (coupon.status !== 'active') return null;
  if (coupon.usageLimit != null && coupon.timesUsed >= coupon.usageLimit) return null;
  if (coupon.validFrom > today || coupon.validUntil < today) return null;
  if (coupon.minimumSpend != null && cartTotal < coupon.minimumSpend) return null;
  const rawDiscount = coupon.type === 'percent' ? cartTotal * (coupon.value / 100) : coupon.value;
  const discount = coupon.maximumDiscount != null ? Math.min(rawDiscount, coupon.maximumDiscount) : rawDiscount;
  return { discount: Math.round(discount * 100) / 100, total: Math.max(0, cartTotal - discount) };
}

export function invoiceTotal(lines: readonly MarketplaceInvoiceLine[], taxRate = 0, fees = 0) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  return { subtotal, tax, fees, total: Math.round((subtotal + tax + fees) * 100) / 100 };
}

/** Combined list price of a bundle's items before discount. */
export function bundleListTotal(items: MarketplaceBundle['items'], listingMap: Map<string, MarketplaceListing>): number {
  return Math.round(
    items.reduce((sum, item) => sum + (listingMap.get(item.listingId)?.price.amount ?? 0) * item.quantity, 0) * 100,
  ) / 100;
}

export function computeBundlePrice(listTotal: number, discountPercent: number) {
  const price = Math.round(listTotal * (1 - discountPercent / 100) * 100) / 100;
  return { listTotal, discountPercent, price };
}

// ---------------------------------------------------------------------------
// Bookings & availability
// ---------------------------------------------------------------------------

export function isSlotAvailable(slot: MarketplaceAvailabilitySlot): boolean {
  return !slot.booked;
}

export function availableSlots(availability: MarketplaceAvailability): MarketplaceAvailabilitySlot[] {
  return (availability.openSlots ?? []).filter(isSlotAvailable);
}

// ---------------------------------------------------------------------------
// Messages & notifications
// ---------------------------------------------------------------------------

export function unreadCount(notifications: readonly { read: boolean }[]): number {
  return notifications.filter((notification) => !notification.read).length;
}

export function conversationBetween(
  conversations: readonly { id: string; participants: string[] }[],
  participantA: string,
  participantB: string,
) {
  return conversations.find((conversation) =>
    conversation.participants.includes(participantA) && conversation.participants.includes(participantB));
}

// ---------------------------------------------------------------------------
// Dashboards, analytics, statistics
// ---------------------------------------------------------------------------

function orderRevenue(orders: readonly MarketplaceOrder[]): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

/** Aggregate revenue by category from orders that reference listings. */
function categoryStats(
  listings: readonly MarketplaceListing[],
  orders: readonly MarketplaceOrder[],
): { category: MarketplaceCategory; listings: number; orders: number; revenue: number }[] {
  const listingById = new Map(listings.map((listing) => [listing.id, listing]));
  const stats = new Map<MarketplaceCategory, { category: MarketplaceCategory; listings: number; orders: number; revenue: number }>();
  for (const category of MARKETPLACE_CATEGORIES) {
    stats.set(category, { category, listings: 0, orders: 0, revenue: 0 });
  }
  for (const listing of listings) {
    const stat = stats.get(listing.category);
    if (stat) stat.listings += 1;
  }
  for (const order of orders) {
    const listing = listingById.get(order.listingId);
    const category = listing?.category;
    if (!category) continue;
    const stat = stats.get(category);
    if (stat) {
      stat.orders += 1;
      stat.revenue = Math.round((stat.revenue + order.total) * 100) / 100;
    }
  }
  return Array.from(stats.values()).filter((stat) => stat.listings > 0 || stat.orders > 0);
}

function topListingStats(listings: readonly MarketplaceListing[], orders: readonly MarketplaceOrder[], limit = 5): MarketplaceListingStat[] {
  const revenueByListing = new Map<string, number>();
  for (const order of orders) {
    revenueByListing.set(order.listingId, (revenueByListing.get(order.listingId) ?? 0) + order.total);
  }
  return [...listings]
    .sort((a, b) => (revenueByListing.get(b.id) ?? 0) - (revenueByListing.get(a.id) ?? 0))
    .slice(0, limit)
    .map((listing) => ({
      listingId: listing.id,
      title: listing.title,
      views: listing.views,
      favorites: listing.favorites,
      orders: listing.orders,
      revenue: Math.round((revenueByListing.get(listing.id) ?? 0) * 100) / 100,
      rating: listing.rating.average,
    }));
}

function topVendorStats(
  vendors: readonly MarketplaceVendor[],
  listings: readonly MarketplaceListing[],
  orders: readonly MarketplaceOrder[],
  limit = 5,
): MarketplaceVendorStat[] {
  const revenueByVendor = new Map<string, number>();
  const ordersByVendor = new Map<string, number>();
  for (const order of orders) {
    revenueByVendor.set(order.vendorId, (revenueByVendor.get(order.vendorId) ?? 0) + order.total);
    ordersByVendor.set(order.vendorId, (ordersByVendor.get(order.vendorId) ?? 0) + 1);
  }
  return [...vendors]
    .sort((a, b) => (revenueByVendor.get(b.id) ?? 0) - (revenueByVendor.get(a.id) ?? 0))
    .slice(0, limit)
    .map((vendor) => ({
      vendorId: vendor.id,
      name: vendor.name,
      orders: ordersByVendor.get(vendor.id) ?? 0,
      revenue: Math.round((revenueByVendor.get(vendor.id) ?? 0) * 100) / 100,
      rating: vendor.rating.average,
      verified: vendor.verified,
    }));
}

export function computeSalesDashboard(input: {
  orders: readonly MarketplaceOrder[];
  refunds: readonly MarketplaceRefund[];
  listings: readonly MarketplaceListing[];
  periodDays?: number;
}): MarketplaceSalesDashboard {
  const { orders, refunds, listings } = input;
  const totalRevenue = orderRevenue(orders);
  const refundedRevenue = refunds.filter((refund) => refund.status === 'completed').reduce((sum, refund) => sum + refund.amount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;
  const conversions = orders.filter((order) => order.status === 'completed' || order.status === 'delivered').length;
  const conversionRate = totalOrders > 0 ? Math.round((conversions / totalOrders) * 1000) / 10 : 0;
  const period = input.periodDays ?? 30;
  const today = new Date('2026-07-31');
  const byDay: MarketplaceSalesDayPoint[] = Array.from({ length: period }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (period - 1 - index));
    const iso = date.toISOString().slice(0, 10);
    const dayOrders = orders.filter((order) => order.placedAt.slice(0, 10) === iso);
    return {
      date: iso,
      revenue: Math.round(orderRevenue(dayOrders) * 100) / 100,
      orders: dayOrders.length,
    };
  });
  const firstHalfRevenue = byDay.slice(0, Math.floor(period / 2)).reduce((sum, point) => sum + point.revenue, 0);
  const secondHalfRevenue = byDay.slice(Math.floor(period / 2)).reduce((sum, point) => sum + point.revenue, 0);
  const growthPercent = firstHalfRevenue > 0 ? Math.round(((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100) : 0;
  return {
    totalRevenue,
    totalOrders,
    refundedRevenue,
    netRevenue: Math.round((totalRevenue - refundedRevenue) * 100) / 100,
    averageOrderValue,
    conversionRate,
    growthPercent,
    byDay,
    topProducts: topListingStats(listings, orders),
  };
}

export function computeRevenueDashboard(input: {
  orders: readonly MarketplaceOrder[];
  payments: readonly MarketplacePayment[];
  refunds: readonly MarketplaceRefund[];
  listings: readonly MarketplaceListing[];
  vendors: readonly MarketplaceVendor[];
}): MarketplaceRevenueDashboard {
  const { orders, payments, refunds, listings, vendors } = input;
  const grossRevenue = orderRevenue(orders);
  const platformFeeRate = 0.08;
  const platformFees = Math.round(grossRevenue * platformFeeRate * 100) / 100;
  const vendorPayouts = Math.round((grossRevenue - platformFees) * 100) / 100;
  const refunded = refunds.filter((refund) => refund.status === 'completed').reduce((sum, refund) => sum + refund.amount, 0);
  const byCountry = new Map<string, number>();
  for (const order of orders) {
    const vendor = vendors.find((entry) => entry.id === order.vendorId);
    const country = vendor?.country ?? 'Unknown';
    byCountry.set(country, (byCountry.get(country) ?? 0) + order.total);
  }
  const byMethod = new Map<MarketplacePayment['method'], number>();
  for (const payment of payments) {
    byMethod.set(payment.method, (byMethod.get(payment.method) ?? 0) + payment.amount);
  }
  return {
    grossRevenue,
    platformFees,
    vendorPayouts,
    refunds: Math.round(refunded * 100) / 100,
    netPlatformRevenue: Math.round((platformFees - refunded) * 100) / 100,
    byCategory: categoryStats(listings, orders),
    byCountry: Array.from(byCountry, ([country, revenue]) => ({ country, revenue: Math.round(revenue * 100) / 100 })),
    byMethod: Array.from(byMethod, ([method, revenue]) => ({ method, revenue: Math.round(revenue * 100) / 100 })),
  };
}

export function computeMarketplaceAnalytics(input: {
  vendors: readonly MarketplaceVendor[];
  listings: readonly MarketplaceListing[];
  orders: readonly MarketplaceOrder[];
  reviews: readonly MarketplaceReview[];
  bookings: readonly MarketplaceBooking[];
  disputes: readonly MarketplaceDispute[];
  messages: readonly MarketplaceMessage[];
  wishlists: readonly { listingIds: string[] }[];
}): MarketplaceAnalytics {
  const { vendors, listings, orders, reviews, bookings, disputes, messages } = input;
  const revenue = orderRevenue(orders);
  const impressions = listings.reduce((sum, listing) => sum + listing.views * 3, 0);
  const views = listings.reduce((sum, listing) => sum + listing.views, 0);
  const conversionRate = impressions > 0 ? Math.round((orders.length / impressions) * 10000) / 100 : 0;
  const averageOrderValue = orders.length > 0 ? Math.round((revenue / orders.length) * 100) / 100 : 0;
  const repeated = orders
    .reduce((counts, order) => counts.set(order.buyerName, (counts.get(order.buyerName) ?? 0) + 1), new Map<string, number>());
  const repeatCustomers = Array.from(repeated.values()).filter((count) => count > 1).length;
  const favorites = listings.reduce((sum, listing) => sum + listing.favorites, 0);
  return {
    impressions,
    views,
    orders: orders.length,
    revenue,
    conversionRate,
    averageOrderValue,
    repeatCustomers,
    favorites,
    reviews: reviews.length,
    disputes: disputes.length,
    messages: messages.length,
    bookings: bookings.length,
    byCategory: categoryStats(listings, orders),
    topListings: topListingStats(listings, orders),
    topVendors: topVendorStats(vendors, listings, orders),
  };
}

export function computeMarketplaceStatistics(input: {
  vendors: readonly MarketplaceVendor[];
  listings: readonly MarketplaceListing[];
  reviews: readonly MarketplaceReview[];
  orders: readonly MarketplaceOrder[];
  bookings: readonly MarketplaceBooking[];
  refunds: readonly MarketplaceRefund[];
  disputes: readonly MarketplaceDispute[];
  coupons: readonly MarketplaceCoupon[];
  promotions: readonly MarketplacePromotion[];
}): MarketplaceStatistics {
  const { vendors, listings, reviews, orders, bookings, refunds, disputes, coupons, promotions } = input;
  const today = new Date().toISOString().slice(0, 10);
  const revenue = orderRevenue(orders);
  const averageOrderValue = orders.length > 0 ? Math.round((revenue / orders.length) * 100) / 100 : 0;
  const impressions = listings.reduce((sum, listing) => sum + listing.views * 3, 0);
  const conversionRate = impressions > 0 ? Math.round((orders.length / impressions) * 10000) / 100 : 0;
  return {
    totalVendors: vendors.length,
    verifiedVendors: vendors.filter((vendor) => vendor.verified).length,
    totalListings: listings.length,
    activeListings: listings.filter((listing) => listing.status === 'active').length,
    totalCategories: MARKETPLACE_CATEGORIES.length,
    totalOrders: orders.length,
    completedOrders: orders.filter((order) => order.status === 'completed' || order.status === 'delivered').length,
    pendingOrders: orders.filter((order) => order.status === 'pending' || order.status === 'confirmed').length,
    totalRevenue: Math.round(revenue * 100) / 100,
    totalBookings: bookings.length,
    averageRating: reviews.length > 0 ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10 : 0,
    totalReviews: reviews.length,
    averageOrderValue,
    conversionRate,
    countries: new Set(vendors.map((vendor) => vendor.country)).size,
    featuredListings: listings.filter((listing) => listing.featured).length,
    sponsoredListings: listings.filter((listing) => listing.sponsored).length,
    totalCoupons: coupons.length,
    activePromotions: promotions.filter((promotion) => promotion.startsAt <= today && promotion.endsAt >= today).length,
    openDisputes: disputes.filter((dispute) => dispute.status === 'open' || dispute.status === 'investigating').length,
    completedRefunds: refunds.filter((refund) => refund.status === 'completed').length,
  };
}

// ---------------------------------------------------------------------------
// Discovery integration
// ---------------------------------------------------------------------------

/**
 * Map every marketplace category to the closest existing entity in the unified
 * discovery index. Additive by design — the Marketplace never owns the
 * Discovery index; it contributes searchable rows through the existing shapes.
 */
export const LISTING_TO_DISCOVERY_ENTITY: Record<MarketplaceCategory, DiscoveryEntityType> = {
  'research-services': 'project',
  'academic-writing': 'manuscript',
  'publication-services': 'publication',
  'conference-services': 'conference',
  education: 'project',
  'laboratory-services': 'project',
  equipment: 'project',
  'funding-services': 'funding',
  recruitment: 'project',
  consulting: 'project',
  'digital-products': 'dataset',
  'physical-products': 'publication',
};

/** Derive a unified searchable discovery row for a marketplace listing. */
export function toDiscoveryItem(listing: MarketplaceListing): DiscoveryItem {
  return {
    id: `marketplace-${listing.id}`,
    entityType: LISTING_TO_DISCOVERY_ENTITY[listing.category],
    sourceId: listing.id,
    title: listing.title,
    summary: listing.summary,
    description: listing.description,
    keywords: listingKeywords(listing),
    discipline: listing.category,
    researchAreas: listing.researchAreas,
    organizations: [listing.vendorName],
    country: listing.country,
    continent: undefined,
    year: listing.lastUpdated.slice(0, 4),
    status: listing.status,
    tags: [listing.category, ...listing.tags],
    score: Math.round(listing.rating.average * 5 + listing.orders * 0.25),
    url: listing.url,
    dateAdded: listing.dateAdded,
    stageId: listing.stageIds[0] as ResearchLifecycleStageId | undefined,
  };
}

export function toDiscoveryItems(listings: readonly MarketplaceListing[]): DiscoveryItem[] {
  return listings.map(toDiscoveryItem);
}

// ---------------------------------------------------------------------------
// Advertising integration
// ---------------------------------------------------------------------------

/** Entity type to register the listing under in the Advertising module. */
export function listingPromotableEntityType(listing: MarketplaceListing): PromotableObject['entityType'] {
  if (listing.category === 'equipment') return 'equipment';
  if (listing.category === 'education') return 'course';
  if (listing.category === 'recruitment') return 'job-vacancy';
  if (listing.category === 'digital-products' && listing.subcategory === 'datasets') return 'dataset';
  if (listing.category === 'digital-products') return 'software';
  if (listing.category === 'physical-products') return 'book';
  if (listing.category === 'research-services') return 'academic-service';
  return 'marketplace-listing';
}

/** Build a promotable object reference so any listing is boostable via Ads. */
export function listingPromotableObject(listing: MarketplaceListing): PromotableObject {
  return createPromotableObject({
    id: `promo-marketplace-${listing.id}`,
    entityType: listingPromotableEntityType(listing),
    sourceId: listing.id,
    title: listing.title,
    summary: listing.summary,
    url: listing.url,
    keywords: listingKeywords(listing),
    discipline: listing.category,
    researchAreas: listing.researchAreas,
    organizations: [listing.vendorName],
    country: listing.country,
    stageId: listing.stageIds[0] as ResearchLifecycleStageId | undefined,
    tags: ['marketplace-listing', listing.category, ...listing.tags],
    dateAdded: listing.dateAdded,
  });
}
