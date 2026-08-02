import React from 'react';
import Badge from '@/components/ui/Badge';
import {
  formatAvailabilityStatus,
  formatBoostLevel,
  formatCategory,
  formatDisputeStatus,
  formatGroup,
  formatMilestoneStatus,
  formatOrderStatus,
  formatPaymentStatus,
  formatProviderType,
  formatRecommendationType,
  formatServiceStatus,
  formatServiceType,
} from './format';
import type { ServiceMilestoneStatus } from './format';
import type {
  ServiceBoostLevel,
  ServiceCategory,
  ServiceCategoryGroup,
  ServiceDisputeStatus,
  ServiceOrderStatus,
  ServicePaymentStatus,
  ServiceProviderAvailabilityStatus,
  ServiceProviderBadge,
  ServiceProviderType,
  ServiceRecommendationType,
  ServiceStatus,
  ServiceType,
} from '@/types/services';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const serviceVariants: Record<ServiceStatus, BadgeVariant> = {
  draft: 'default',
  'pending-review': 'warning',
  active: 'success',
  paused: 'warning',
  archived: 'default',
};

const orderVariants: Record<ServiceOrderStatus, BadgeVariant> = {
  pending: 'warning',
  'in-progress': 'info',
  delivered: 'info',
  completed: 'success',
  cancelled: 'default',
  refunded: 'default',
  disputed: 'danger',
};

const paymentVariants: Record<ServicePaymentStatus, BadgeVariant> = {
  unpaid: 'default',
  pending: 'warning',
  paid: 'success',
  refunded: 'default',
};

const disputeVariants: Record<ServiceDisputeStatus, BadgeVariant> = {
  open: 'danger',
  investigating: 'warning',
  resolved: 'success',
  closed: 'default',
};

const milestoneVariants: Record<ServiceMilestoneStatus, BadgeVariant> = {
  pending: 'default',
  'in-progress': 'info',
  completed: 'success',
};

const availabilityVariants: Record<ServiceProviderAvailabilityStatus, BadgeVariant> = {
  available: 'success',
  busy: 'warning',
  unavailable: 'default',
};

const boostVariants: Record<ServiceBoostLevel, BadgeVariant> = {
  standard: 'info',
  pro: 'warning',
  premium: 'danger',
};

const providerBadgeVariants: Record<ServiceProviderBadge, BadgeVariant> = {
  'Verified Provider': 'success',
  'Top Rated': 'info',
  'Fast Response': 'success',
  'Institution Verified': 'info',
  'Academic Verified': 'info',
  'Quality Assured': 'success',
  'New Provider': 'warning',
  'High Volume': 'info',
  Expert: 'warning',
  Trusted: 'success',
};

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  return <Badge variant={serviceVariants[status]}>{formatServiceStatus(status)}</Badge>;
}

export function CategoryBadge({ category }: { category: ServiceCategory }) {
  return <Badge variant="default">{formatCategory(category)}</Badge>;
}

export function GroupBadge({ group }: { group: ServiceCategoryGroup }) {
  return <Badge variant="info">{formatGroup(group)}</Badge>;
}

export function ServiceTypeBadge({ type }: { type: ServiceType }) {
  return <Badge variant="default">{formatServiceType(type)}</Badge>;
}

export function ProviderTypeBadge({ type }: { type: ServiceProviderType }) {
  return <Badge variant="default">{formatProviderType(type)}</Badge>;
}

export function OrderStatusBadge({ status }: { status: ServiceOrderStatus }) {
  return <Badge variant={orderVariants[status]}>{formatOrderStatus(status)}</Badge>;
}

export function ServicePaymentStatusBadge({ status }: { status: ServicePaymentStatus }) {
  return <Badge variant={paymentVariants[status]}>{formatPaymentStatus(status)}</Badge>;
}

export function DisputeStatusBadge({ status }: { status: ServiceDisputeStatus }) {
  return <Badge variant={disputeVariants[status]}>{formatDisputeStatus(status)}</Badge>;
}

export function MilestoneStatusBadge({ status }: { status: ServiceMilestoneStatus }) {
  return <Badge variant={milestoneVariants[status]}>{formatMilestoneStatus(status)}</Badge>;
}

export function AvailabilityBadge({ status }: { status: ServiceProviderAvailabilityStatus }) {
  return <Badge variant={availabilityVariants[status]}>{formatAvailabilityStatus(status)}</Badge>;
}

export function BoostLevelBadge({ level }: { level: ServiceBoostLevel }) {
  return <Badge variant={boostVariants[level]}>{formatBoostLevel(level)}</Badge>;
}

export function RecommendationTypeBadge({ type }: { type: ServiceRecommendationType }) {
  return <Badge variant="info">{formatRecommendationType(type)}</Badge>;
}

export function ProviderBadgeTag({ badge }: { badge: ServiceProviderBadge }) {
  return <Badge variant={providerBadgeVariants[badge]}>{badge}</Badge>;
}

export function SponsoredBadge() {
  return <Badge variant="info">Sponsored</Badge>;
}

export function FeaturedBadge() {
  return <Badge variant="warning">Featured</Badge>;
}

export function DiscountBadge({ percent }: { percent: number }) {
  return <Badge variant="danger">-{percent}%</Badge>;
}
