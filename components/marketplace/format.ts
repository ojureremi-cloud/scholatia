import { discountPercentOf, effectivePrice, isOnSale, listPrice } from '@/lib/marketplace';
import {
  MARKETPLACE_CATEGORY_ICONS,
  MARKETPLACE_CATEGORY_LABELS,
  MARKETPLACE_LISTING_TYPE_LABELS,
  MARKETPLACE_VENDOR_TYPE_LABELS,
} from '@/types/marketplace';
import type {
  MarketplaceBookingStatus,
  MarketplaceCategory,
  MarketplaceCouponStatus,
  MarketplaceDisputeSeverity,
  MarketplaceDisputeStatus,
  MarketplaceInvoiceStatus,
  MarketplaceListingStatus,
  MarketplaceListingType,
  MarketplaceNotificationType,
  MarketplaceOrderStatus,
  MarketplacePaymentMethod,
  MarketplacePaymentStatus,
  MarketplacePaymentStatusRecord,
  MarketplacePrice,
  MarketplacePriceInterval,
  MarketplacePromotionKind,
  MarketplaceRatingSummary,
  MarketplaceRecommendationType,
  MarketplaceRefundStatus,
  MarketplaceVendorType,
} from '@/types/marketplace';

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPrice(price: MarketplacePrice): string {
  const base = formatCurrency(price.amount, price.currency);
  return price.interval ? `${base} / ${formatInterval(price.interval)}` : base;
}

export function formatInterval(interval: MarketplacePriceInterval): string {
  return interval.replace(/-/g, ' ');
}

export function formatCategory(category: MarketplaceCategory): string {
  return MARKETPLACE_CATEGORY_LABELS[category] ?? category;
}

export function categoryIcon(category: MarketplaceCategory): string {
  return MARKETPLACE_CATEGORY_ICONS[category] ?? '🛒';
}

export function formatVendorType(type: MarketplaceVendorType): string {
  return MARKETPLACE_VENDOR_TYPE_LABELS[type] ?? type;
}

export function formatListingType(type: MarketplaceListingType): string {
  return MARKETPLACE_LISTING_TYPE_LABELS[type] ?? type;
}

export function formatRating(summary: MarketplaceRatingSummary): string {
  return summary.count > 0 ? `${summary.average.toFixed(1)} (${summary.count})` : 'No reviews';
}

/** Filled-star rendering for a rating average. */
export function formatStars(average: number): string {
  const rounded = Math.round(average);
  return `${'★'.repeat(Math.min(5, rounded))}${'☆'.repeat(Math.max(0, 5 - rounded))}`;
}

/** Effective, compare-at, and discount-percent for a listing card. */
export function listingPricing(listing: {
  price: MarketplacePrice;
  discount?: { percent?: number; fixed?: number };
}) {
  return {
    effective: effectivePrice(listing as Parameters<typeof effectivePrice>[0]),
    list: listPrice(listing as Parameters<typeof listPrice>[0]),
    percent: discountPercentOf(listing as Parameters<typeof discountPercentOf>[0]),
    onSale: isOnSale(listing as Parameters<typeof isOnSale>[0]),
  };
}

export function formatOrderStatus(status: MarketplaceOrderStatus): string {
  const labels: Record<MarketplaceOrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    'in-progress': 'In progress',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    disputed: 'Disputed',
  };
  return labels[status];
}

export function formatPaymentStatus(status: MarketplacePaymentStatus | MarketplacePaymentStatusRecord): string {
  const labels: Record<string, string> = {
    unpaid: 'Unpaid',
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    'partially-refunded': 'Partially refunded',
  };
  return labels[status];
}
export function formatPaymentMethod(method: MarketplacePaymentMethod): string {
  const labels: Record<MarketplacePaymentMethod, string> = {
    card: 'Card',
    'bank-transfer': 'Bank transfer',
    'mobile-money': 'Mobile money',
    paypal: 'PayPal',
    escrow: 'Escrow',
    wallet: 'Wallet',
    'institution-billing': 'Institution billing',
  };
  return labels[method];
}

export function formatBookingStatus(status: MarketplaceBookingStatus): string {
  const labels: Record<MarketplaceBookingStatus, string> = {
    requested: 'Requested',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'no-show': 'No show',
    rescheduled: 'Rescheduled',
  };
  return labels[status];
}

export function formatRefundStatus(status: MarketplaceRefundStatus): string {
  const labels: Record<MarketplaceRefundStatus, string> = {
    requested: 'Requested',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
    completed: 'Completed',
  };
  return labels[status];
}

export function formatDisputeStatus(status: MarketplaceDisputeStatus): string {
  const labels: Record<MarketplaceDisputeStatus, string> = {
    open: 'Open',
    investigating: 'Investigating',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status];
}

export function formatDisputeSeverity(severity: MarketplaceDisputeSeverity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function formatCouponStatus(status: MarketplaceCouponStatus): string {
  const labels: Record<MarketplaceCouponStatus, string> = {
    active: 'Active',
    expired: 'Expired',
    disabled: 'Disabled',
  };
  return labels[status];
}

export function formatListingStatus(status: MarketplaceListingStatus): string {
  const labels: Record<MarketplaceListingStatus, string> = {
    draft: 'Draft',
    'pending-review': 'Pending review',
    active: 'Active',
    paused: 'Paused',
    'sold-out': 'Sold out',
    archived: 'Archived',
  };
  return labels[status];
}

export function formatPromotionKind(kind: MarketplacePromotionKind): string {
  const labels: Record<MarketplacePromotionKind, string> = {
    sale: 'Sale',
    'flash-sale': 'Flash sale',
    bundle: 'Bundle',
    'sponsored-feature': 'Sponsored feature',
    seasonal: 'Seasonal',
    launch: 'Launch',
  };
  return labels[kind];
}

export function formatNotificationType(type: MarketplaceNotificationType): string {
  return type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatRecommendationType(type: MarketplaceRecommendationType): string {
  const labels: Record<MarketplaceRecommendationType, string> = {
    vendor: 'Vendor',
    listing: 'Listing',
    service: 'Service',
    product: 'Product',
    consultant: 'Consultant',
    collaborator: 'Collaborator',
    journal: 'Journal',
    reviewer: 'Reviewer',
    grant: 'Grant',
    conference: 'Conference',
    publisher: 'Publisher',
    storefront: 'Storefront',
  };
  return labels[type];
}

export function formatInventoryStatus(status: string): string {
  const labels: Record<string, string> = {
    available: 'Available',
    limited: 'Limited stock',
    unavailable: 'Unavailable',
    'pre-order': 'Pre-order',
  };
  return labels[status] ?? status;
}

export function formatInvoiceStatus(status: MarketplaceInvoiceStatus): string {
  const labels: Record<MarketplaceInvoiceStatus, string> = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
  };
  return labels[status];
}
