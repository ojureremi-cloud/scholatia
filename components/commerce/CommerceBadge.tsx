import React from 'react';
import Badge from '@/components/ui/Badge';
import {
  formatBillingCycle,
  formatBundleStatus,
  formatCommissionStatus,
  formatCouponStatus,
  formatEscrowStatus,
  formatInvoiceStatus,
  formatLicenseStatus,
  formatOrderStatus,
  formatParticipantType,
  formatPaymentMethod,
  formatPaymentStatus,
  formatPricingModel,
  formatProductType,
  formatPromotionKind,
  formatReceiptStatus,
  formatRefundReason,
  formatRefundStatus,
  formatRelationshipKind,
  formatSettlementStatus,
  formatSubscriberType,
  formatSubscriptionStatus,
  formatTransactionKind,
  formatWalletStatus,
  formatWalletTransactionType,
} from './format';
import type {
  CommerceBillingCycle,
  CommerceBundleStatus,
  CommerceCommissionStatus,
  CommerceCouponStatus,
  CommerceEscrowStatus,
  CommerceInvoiceStatus,
  CommerceLicenseStatus,
  CommerceOrderStatus,
  CommercePaymentMethod,
  CommercePaymentStatus,
  CommercePricingModel,
  CommerceProductType,
  CommercePromotionKind,
  CommerceReceiptStatus,
  CommerceRefundReason,
  CommerceRefundStatus,
  CommerceRelationshipKind,
  CommerceRevenueParticipantType,
  CommerceSettlementStatus,
  CommerceSubscriberType,
  CommerceSubscriptionStatus,
  CommerceTransactionKind,
  CommerceWalletStatus,
  CommerceWalletTransactionType,
} from '@/types/commerce';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const orderVariants: Record<CommerceOrderStatus, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  completed: 'success',
  cancelled: 'default',
  refunded: 'default',
  disputed: 'danger',
};

const paymentVariants: Record<CommercePaymentStatus, BadgeVariant> = {
  unpaid: 'default',
  pending: 'warning',
  processing: 'info',
  paid: 'success',
  failed: 'danger',
  refunded: 'default',
  'partially-refunded': 'warning',
  cancelled: 'default',
};

const walletVariants: Record<CommerceWalletStatus, BadgeVariant> = {
  active: 'success',
  frozen: 'warning',
  closed: 'default',
};

const subscriptionVariants: Record<CommerceSubscriptionStatus, BadgeVariant> = {
  trialing: 'info',
  active: 'success',
  'past-due': 'danger',
  cancelled: 'default',
  expired: 'default',
  paused: 'warning',
};

const couponVariants: Record<CommerceCouponStatus, BadgeVariant> = {
  active: 'success',
  expired: 'default',
  disabled: 'default',
};

const promotionVariants: Record<CommercePromotionKind, BadgeVariant> = {
  sale: 'success',
  'flash-sale': 'danger',
  seasonal: 'warning',
  launch: 'warning',
  bundle: 'info',
  featured: 'info',
  sponsored: 'info',
  boosted: 'info',
};

const refundVariants: Record<CommerceRefundStatus, BadgeVariant> = {
  requested: 'warning',
  approved: 'info',
  rejected: 'danger',
  processing: 'info',
  completed: 'success',
};

const invoiceVariants: Record<CommerceInvoiceStatus, BadgeVariant> = {
  draft: 'default',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'default',
};

const receiptVariants: Record<CommerceReceiptStatus, BadgeVariant> = {
  issued: 'success',
  void: 'default',
  duplicate: 'warning',
};

const escrowVariants: Record<CommerceEscrowStatus, BadgeVariant> = {
  holding: 'warning',
  released: 'success',
  refunded: 'default',
  disputed: 'danger',
  cancelled: 'default',
};

const settlementVariants: Record<CommerceSettlementStatus, BadgeVariant> = {
  scheduled: 'info',
  processing: 'warning',
  completed: 'success',
  failed: 'danger',
};

const commissionVariants: Record<CommerceCommissionStatus, BadgeVariant> = {
  pending: 'warning',
  due: 'info',
  paid: 'success',
};

export function OrderStatusBadge({ status }: { status: CommerceOrderStatus }) {
  return <Badge variant={orderVariants[status]}>{formatOrderStatus(status)}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: CommercePaymentStatus }) {
  return <Badge variant={paymentVariants[status]}>{formatPaymentStatus(status)}</Badge>;
}

export function PaymentMethodBadge({ method }: { method: CommercePaymentMethod }) {
  return <Badge variant="default">{formatPaymentMethod(method)}</Badge>;
}

export function ProductTypeBadge({ type }: { type: CommerceProductType }) {
  return <Badge variant="default">{formatProductType(type)}</Badge>;
}

export function WalletStatusBadge({ status }: { status: CommerceWalletStatus }) {
  return <Badge variant={walletVariants[status]}>{formatWalletStatus(status)}</Badge>;
}

export function WalletTransactionTypeBadge({ type }: { type: CommerceWalletTransactionType }) {
  return <Badge variant="default">{formatWalletTransactionType(type)}</Badge>;
}

export function SubscriptionStatusBadge({ status }: { status: CommerceSubscriptionStatus }) {
  return <Badge variant={subscriptionVariants[status]}>{formatSubscriptionStatus(status)}</Badge>;
}

export function SubscriberTypeBadge({ type }: { type: CommerceSubscriberType }) {
  return <Badge variant="info">{formatSubscriberType(type)}</Badge>;
}

export function BillingCycleBadge({ cycle }: { cycle: CommerceBillingCycle }) {
  return <Badge variant="default">{formatBillingCycle(cycle)}</Badge>;
}

export function CouponStatusBadge({ status }: { status: CommerceCouponStatus }) {
  return <Badge variant={couponVariants[status]}>{formatCouponStatus(status)}</Badge>;
}

export function PromotionKindBadge({ kind }: { kind: CommercePromotionKind }) {
  return <Badge variant={promotionVariants[kind]}>{formatPromotionKind(kind)}</Badge>;
}

export function RefundStatusBadge({ status }: { status: CommerceRefundStatus }) {
  return <Badge variant={refundVariants[status]}>{formatRefundStatus(status)}</Badge>;
}

export function RefundReasonBadge({ reason }: { reason: CommerceRefundReason }) {
  return <Badge variant="default">{formatRefundReason(reason)}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: CommerceInvoiceStatus }) {
  return <Badge variant={invoiceVariants[status]}>{formatInvoiceStatus(status)}</Badge>;
}

export function ReceiptStatusBadge({ status }: { status: CommerceReceiptStatus }) {
  return <Badge variant={receiptVariants[status]}>{formatReceiptStatus(status)}</Badge>;
}

export function EscrowStatusBadge({ status }: { status: CommerceEscrowStatus }) {
  return <Badge variant={escrowVariants[status]}>{formatEscrowStatus(status)}</Badge>;
}

export function SettlementStatusBadge({ status }: { status: CommerceSettlementStatus }) {
  return <Badge variant={settlementVariants[status]}>{formatSettlementStatus(status)}</Badge>;
}

export function CommissionStatusBadge({ status }: { status: CommerceCommissionStatus }) {
  return <Badge variant={commissionVariants[status]}>{formatCommissionStatus(status)}</Badge>;
}

export function TransactionKindBadge({ kind }: { kind: CommerceTransactionKind }) {
  return <Badge variant="default">{formatTransactionKind(kind)}</Badge>;
}

const bundleVariants: Record<CommerceBundleStatus, BadgeVariant> = {
  active: 'success',
  draft: 'default',
  expired: 'default',
};

const licenseVariants: Record<CommerceLicenseStatus, BadgeVariant> = {
  active: 'success',
  suspended: 'warning',
  expired: 'default',
  cancelled: 'default',
};

const participantVariants: Record<CommerceRevenueParticipantType, BadgeVariant> = {
  institution: 'info',
  publisher: 'info',
  researcher: 'success',
  vendor: 'warning',
};

export function BundleStatusBadge({ status }: { status: CommerceBundleStatus }) {
  return <Badge variant={bundleVariants[status]}>{formatBundleStatus(status)}</Badge>;
}

export function LicenseStatusBadge({ status }: { status: CommerceLicenseStatus }) {
  return <Badge variant={licenseVariants[status]}>{formatLicenseStatus(status)}</Badge>;
}

export function PricingModelBadge({ model }: { model: CommercePricingModel }) {
  return <Badge variant="default">{formatPricingModel(model)}</Badge>;
}

export function ParticipantTypeBadge({ type }: { type: CommerceRevenueParticipantType }) {
  return <Badge variant={participantVariants[type]}>{formatParticipantType(type)}</Badge>;
}

export function RelationshipKindBadge({ kind }: { kind: CommerceRelationshipKind }) {
  return <Badge variant="info">{formatRelationshipKind(kind)}</Badge>;
}
