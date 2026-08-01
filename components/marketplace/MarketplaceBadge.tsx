import React from 'react';
import Badge from '@/components/ui/Badge';
import {
  formatBookingStatus,
  formatCategory,
  formatCouponStatus,
  formatDisputeSeverity,
  formatDisputeStatus,
  formatInventoryStatus,
  formatInvoiceStatus,
  formatListingStatus,
  formatListingType,
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  formatPromotionKind,
  formatRefundStatus,
  formatVendorType,
} from './format';
import type {
  MarketplaceBookingStatus,
  MarketplaceCategory,
  MarketplaceCouponStatus,
  MarketplaceDisputeSeverity,
  MarketplaceDisputeStatus,
  MarketplaceInvoiceStatus,
  MarketplaceListingStatus,
  MarketplaceListingType,
  MarketplaceOrderStatus,
  MarketplacePaymentMethod,
  MarketplacePaymentStatus,
  MarketplacePaymentStatusRecord,
  MarketplacePromotionKind,
  MarketplaceRefundStatus,
  MarketplaceVendorType,
} from '@/types/marketplace';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const orderVariants: Record<MarketplaceOrderStatus, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  'in-progress': 'info',
  delivered: 'success',
  completed: 'success',
  cancelled: 'default',
  refunded: 'default',
  disputed: 'danger',
};

const paymentVariants: Record<string, BadgeVariant> = {
  unpaid: 'default',
  pending: 'warning',
  processing: 'info',
  paid: 'success',
  completed: 'success',
  failed: 'danger',
  refunded: 'default',
  'partially-refunded': 'warning',
};

const bookingVariants: Record<MarketplaceBookingStatus, BadgeVariant> = {
  requested: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'default',
  'no-show': 'danger',
  rescheduled: 'warning',
};

const refundVariants: Record<MarketplaceRefundStatus, BadgeVariant> = {
  requested: 'warning',
  approved: 'info',
  rejected: 'danger',
  processing: 'info',
  completed: 'success',
};

const disputeVariants: Record<MarketplaceDisputeStatus, BadgeVariant> = {
  open: 'danger',
  investigating: 'warning',
  resolved: 'success',
  closed: 'default',
};

const severityVariants: Record<MarketplaceDisputeSeverity, BadgeVariant> = {
  low: 'info',
  medium: 'warning',
  high: 'warning',
  critical: 'danger',
};

const couponVariants: Record<MarketplaceCouponStatus, BadgeVariant> = {
  active: 'success',
  expired: 'default',
  disabled: 'default',
};

const listingStatusVariants: Record<MarketplaceListingStatus, BadgeVariant> = {
  draft: 'default',
  'pending-review': 'warning',
  active: 'success',
  paused: 'warning',
  'sold-out': 'default',
  archived: 'default',
};

const promotionVariants: Record<MarketplacePromotionKind, BadgeVariant> = {
  sale: 'success',
  'flash-sale': 'danger',
  bundle: 'info',
  'sponsored-feature': 'info',
  seasonal: 'warning',
  launch: 'warning',
};

const invoiceVariants: Record<MarketplaceInvoiceStatus, BadgeVariant> = {
  draft: 'default',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'default',
};

export function OrderStatusBadge({ status }: { status: MarketplaceOrderStatus }) {
  return <Badge variant={orderVariants[status]}>{formatOrderStatus(status)}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: MarketplacePaymentStatus | MarketplacePaymentStatusRecord }) {
  return <Badge variant={paymentVariants[status]}>{formatPaymentStatus(status)}</Badge>;
}

export function PaymentMethodBadge({ method }: { method: MarketplacePaymentMethod }) {
  return <Badge variant="default">{formatPaymentMethod(method)}</Badge>;
}

export function BookingStatusBadge({ status }: { status: MarketplaceBookingStatus }) {
  return <Badge variant={bookingVariants[status]}>{formatBookingStatus(status)}</Badge>;
}

export function RefundStatusBadge({ status }: { status: MarketplaceRefundStatus }) {
  return <Badge variant={refundVariants[status]}>{formatRefundStatus(status)}</Badge>;
}

export function DisputeStatusBadge({ status }: { status: MarketplaceDisputeStatus }) {
  return <Badge variant={disputeVariants[status]}>{formatDisputeStatus(status)}</Badge>;
}

export function DisputeSeverityBadge({ severity }: { severity: MarketplaceDisputeSeverity }) {
  return <Badge variant={severityVariants[severity]}>{formatDisputeSeverity(severity)}</Badge>;
}

export function CouponStatusBadge({ status }: { status: MarketplaceCouponStatus }) {
  return <Badge variant={couponVariants[status]}>{formatCouponStatus(status)}</Badge>;
}

export function ListingStatusBadge({ status }: { status: MarketplaceListingStatus }) {
  return <Badge variant={listingStatusVariants[status]}>{formatListingStatus(status)}</Badge>;
}

export function PromotionKindBadge({ kind }: { kind: MarketplacePromotionKind }) {
  return <Badge variant={promotionVariants[kind]}>{formatPromotionKind(kind)}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: MarketplaceInvoiceStatus }) {
  return <Badge variant={invoiceVariants[status]}>{formatInvoiceStatus(status)}</Badge>;
}

export function CategoryBadge({ category }: { category: MarketplaceCategory }) {
  return <Badge variant="info">{formatCategory(category)}</Badge>;
}

export function VendorTypeBadge({ type }: { type: MarketplaceVendorType }) {
  return <Badge variant="default">{formatVendorType(type)}</Badge>;
}

export function ListingTypeBadge({ type }: { type: MarketplaceListingType }) {
  return <Badge variant="default">{formatListingType(type)}</Badge>;
}

export function InventoryStatusBadge({ status }: { status: string }) {
  const variant: BadgeVariant =
    status === 'available' ? 'success' : status === 'limited' ? 'warning' : status === 'unavailable' ? 'danger' : 'info';
  return <Badge variant={variant}>{formatInventoryStatus(status)}</Badge>;
}

export function VerifiedVendorBadge({ verified }: { verified: boolean }) {
  return <Badge variant={verified ? 'success' : 'default'}>{verified ? 'Verified vendor' : 'Unverified'}</Badge>;
}
