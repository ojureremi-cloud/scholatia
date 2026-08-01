import { calculateGrandTotal, invoiceSubtotal, taxAmount } from '@/lib/commerce';
import {
  COMMERCE_PRODUCT_TYPE_LABELS,
  COMMERCE_SUBSCRIBER_TYPE_LABELS,
} from '@/types/commerce';
import type {
  CommerceBillingCycle,
  CommerceCommissionStatus,
  CommerceCouponStatus,
  CommerceEscrowStatus,
  CommerceInvoiceStatus,
  CommerceOrderStatus,
  CommercePaymentMethod,
  CommercePaymentStatus,
  CommercePrice,
  CommercePriceInterval,
  CommerceProductType,
  CommercePromotionKind,
  CommerceReceiptStatus,
  CommerceRefundReason,
  CommerceRefundStatus,
  CommerceSettlementStatus,
  CommerceSubscriberType,
  CommerceSubscriptionStatus,
  CommerceTransactionKind,
  CommerceWalletStatus,
  CommerceWalletTransactionType,
} from '@/types/commerce';

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

export function formatPrice(price: CommercePrice): string {
  const base = formatCurrency(price.amount, price.currency);
  return price.interval ? `${base} / ${formatInterval(price.interval)}` : base;
}

export function formatInterval(interval: CommercePriceInterval): string {
  return interval.replace(/-/g, ' ');
}

export function formatProductType(type: CommerceProductType): string {
  return COMMERCE_PRODUCT_TYPE_LABELS[type] ?? type;
}

export function formatOrderStatus(status: CommerceOrderStatus): string {
  const labels: Record<CommerceOrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    disputed: 'Disputed',
  };
  return labels[status];
}

export function formatPaymentStatus(status: CommercePaymentStatus): string {
  const labels: Record<CommercePaymentStatus, string> = {
    unpaid: 'Unpaid',
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    'partially-refunded': 'Partially refunded',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

export function formatPaymentMethod(method: CommercePaymentMethod): string {
  const labels: Record<CommercePaymentMethod, string> = {
    card: 'Card',
    'bank-transfer': 'Bank transfer',
    'mobile-money': 'Mobile money',
    paypal: 'PayPal',
    wallet: 'Wallet',
    credits: 'Credits',
    escrow: 'Escrow',
    'institution-billing': 'Institution billing',
    'apple-pay': 'Apple Pay',
    'google-pay': 'Google Pay',
  };
  return labels[method];
}

export function formatWalletStatus(status: CommerceWalletStatus): string {
  const labels: Record<CommerceWalletStatus, string> = {
    active: 'Active',
    frozen: 'Frozen',
    closed: 'Closed',
  };
  return labels[status];
}

export function formatWalletTransactionType(type: CommerceWalletTransactionType): string {
  return type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCouponStatus(status: CommerceCouponStatus): string {
  const labels: Record<CommerceCouponStatus, string> = {
    active: 'Active',
    expired: 'Expired',
    disabled: 'Disabled',
  };
  return labels[status];
}

export function formatPromotionKind(kind: CommercePromotionKind): string {
  return kind.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatRefundStatus(status: CommerceRefundStatus): string {
  const labels: Record<CommerceRefundStatus, string> = {
    requested: 'Requested',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
    completed: 'Completed',
  };
  return labels[status];
}

export function formatRefundReason(reason: CommerceRefundReason): string {
  return reason.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatInvoiceStatus(status: CommerceInvoiceStatus): string {
  const labels: Record<CommerceInvoiceStatus, string> = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

export function formatReceiptStatus(status: CommerceReceiptStatus): string {
  const labels: Record<CommerceReceiptStatus, string> = {
    issued: 'Issued',
    void: 'Void',
    duplicate: 'Duplicate',
  };
  return labels[status];
}

export function formatSubscriptionStatus(status: CommerceSubscriptionStatus): string {
  const labels: Record<CommerceSubscriptionStatus, string> = {
    trialing: 'Trialing',
    active: 'Active',
    'past-due': 'Past due',
    cancelled: 'Cancelled',
    expired: 'Expired',
    paused: 'Paused',
  };
  return labels[status];
}

export function formatSubscriberType(type: CommerceSubscriberType): string {
  return COMMERCE_SUBSCRIBER_TYPE_LABELS[type] ?? type;
}

export function formatBillingCycle(cycle: CommerceBillingCycle): string {
  const labels: Record<CommerceBillingCycle, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annual: 'Annual',
  };
  return labels[cycle];
}

export function formatCommissionStatus(status: CommerceCommissionStatus): string {
  const labels: Record<CommerceCommissionStatus, string> = {
    pending: 'Pending',
    due: 'Due',
    paid: 'Paid',
  };
  return labels[status];
}

export function formatEscrowStatus(status: CommerceEscrowStatus): string {
  const labels: Record<CommerceEscrowStatus, string> = {
    holding: 'Holding',
    released: 'Released',
    refunded: 'Refunded',
    disputed: 'Disputed',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

export function formatSettlementStatus(status: CommerceSettlementStatus): string {
  const labels: Record<CommerceSettlementStatus, string> = {
    scheduled: 'Scheduled',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  };
  return labels[status];
}

export function formatTransactionKind(kind: CommerceTransactionKind): string {
  const labels: Record<CommerceTransactionKind, string> = {
    purchase: 'Purchase',
    refund: 'Refund',
    subscription: 'Subscription',
    advertising: 'Advertising',
    boost: 'Boost',
    featured: 'Featured',
    sponsored: 'Sponsored',
    membership: 'Membership',
    'premium-analytics': 'Premium analytics',
    'api-access': 'API access',
    'enterprise-licensing': 'Enterprise licensing',
    payout: 'Payout',
    disbursement: 'Disbursement',
  };
  return labels[kind];
}

/** Itemised invoice totals derived through the commerce engine. */
export function invoiceSummary(input: {
  lines: { description: string; quantity: number; unitPrice: number; total: number }[];
  discount?: number;
  taxRatePercent?: number;
  fees?: number;
}) {
  const subtotal = invoiceSubtotal(input.lines);
  const discount = input.discount ?? 0;
  const tax = taxAmount(Math.max(0, subtotal - discount), input.taxRatePercent ?? 5);
  const fees = input.fees ?? 0;
  return { subtotal, discount, tax, fees, total: calculateGrandTotal({ subtotal, discount, tax, fees }) };
}
