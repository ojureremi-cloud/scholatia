import { formatCurrency } from '@/lib/commerce';
import {
  SERVICE_CATEGORY_GROUP_LABELS,
  SERVICE_CATEGORY_LABELS,
  SERVICE_PROVIDER_TYPE_LABELS,
  SERVICE_TYPE_LABELS,
} from '@/types/services';
import type {
  ServiceBoostLevel,
  ServiceCategory,
  ServiceCategoryGroup,
  ServiceDisputeStatus,
  ServiceOrderStatus,
  ServicePaymentStatus,
  ServicePrice,
  ServicePriceInterval,
  ServiceProviderAvailabilityStatus,
  ServiceProviderType,
  ServiceRecommendationType,
  ServiceStatus,
  ServiceType,
} from '@/types/services';

export { formatCurrency };

export type ServiceMilestoneStatus = 'pending' | 'in-progress' | 'completed';

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

export function formatPrice(price: ServicePrice): string {
  const base = formatCurrency(price.amount, price.currency);
  return price.interval ? `${base} / ${formatInterval(price.interval)}` : base;
}

export function formatInterval(interval: ServicePriceInterval): string {
  return interval.replace(/-/g, ' ');
}

export function formatCategory(category: ServiceCategory): string {
  return SERVICE_CATEGORY_LABELS[category] ?? category;
}

export function formatGroup(group: ServiceCategoryGroup): string {
  return SERVICE_CATEGORY_GROUP_LABELS[group] ?? group;
}

export function formatServiceType(type: ServiceType): string {
  return SERVICE_TYPE_LABELS[type] ?? type;
}

export function formatProviderType(type: ServiceProviderType): string {
  return SERVICE_PROVIDER_TYPE_LABELS[type] ?? type;
}

export function formatServiceStatus(status: ServiceStatus): string {
  const labels: Record<ServiceStatus, string> = {
    draft: 'Draft',
    'pending-review': 'Pending review',
    active: 'Active',
    paused: 'Paused',
    archived: 'Archived',
  };
  return labels[status];
}

export function formatOrderStatus(status: ServiceOrderStatus): string {
  const labels: Record<ServiceOrderStatus, string> = {
    pending: 'Pending',
    'in-progress': 'In progress',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    disputed: 'Disputed',
  };
  return labels[status];
}

export function formatPaymentStatus(status: ServicePaymentStatus): string {
  const labels: Record<ServicePaymentStatus, string> = {
    unpaid: 'Unpaid',
    pending: 'Pending',
    paid: 'Paid',
    refunded: 'Refunded',
  };
  return labels[status];
}

export function formatDisputeStatus(status: ServiceDisputeStatus): string {
  const labels: Record<ServiceDisputeStatus, string> = {
    open: 'Open',
    investigating: 'Investigating',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status];
}

export function formatBoostLevel(level: ServiceBoostLevel): string {
  const labels: Record<ServiceBoostLevel, string> = {
    standard: 'Standard',
    pro: 'Pro',
    premium: 'Premium',
  };
  return labels[level];
}

export function formatMilestoneStatus(status: ServiceMilestoneStatus): string {
  const labels: Record<ServiceMilestoneStatus, string> = {
    pending: 'Pending',
    'in-progress': 'In progress',
    completed: 'Completed',
  };
  return labels[status];
}

export function formatAvailabilityStatus(status: ServiceProviderAvailabilityStatus): string {
  const labels: Record<ServiceProviderAvailabilityStatus, string> = {
    available: 'Available now',
    busy: 'Busy',
    unavailable: 'Unavailable',
  };
  return labels[status];
}

export function formatRecommendationType(type: ServiceRecommendationType): string {
  return type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatRating(rating: number): string {
  return `${rating.toFixed(1)}/5`;
}
