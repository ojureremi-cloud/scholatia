import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatCampaignStatus, formatFraudSeverity, formatReviewStatus } from './format';
import type {
  AdCampaignStatus,
  AdFraudSeverity,
  AdObjective,
  AdReviewStatus,
  SponsoredLabel,
  AdvertiserVerificationStatus,
} from '@/types/ads';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const statusVariants: Record<AdCampaignStatus, BadgeVariant> = {
  draft: 'default',
  'in-review': 'info',
  active: 'success',
  paused: 'warning',
  ended: 'default',
  rejected: 'danger',
  completed: 'default',
};

const reviewVariants: Record<AdReviewStatus, BadgeVariant> = {
  pending: 'info',
  approved: 'success',
  rejected: 'danger',
  'needs-review': 'warning',
};

const fraudVariants: Record<AdFraudSeverity, BadgeVariant> = {
  low: 'info',
  medium: 'warning',
  high: 'warning',
  critical: 'danger',
};

const verificationVariants: Record<AdvertiserVerificationStatus, BadgeVariant> = {
  Verified: 'success',
  Trusted: 'success',
  Pending: 'warning',
};

const labelVariant: BadgeVariant = 'info';
const objectiveVariant: BadgeVariant = 'default';

export function CampaignStatusBadge({ status }: { status: AdCampaignStatus }) {
  return <Badge variant={statusVariants[status]}>{formatCampaignStatus(status)}</Badge>;
}

export function ReviewStatusBadge({ status }: { status: AdReviewStatus }) {
  return <Badge variant={reviewVariants[status]}>{formatReviewStatus(status)}</Badge>;
}

export function FraudSeverityBadge({ severity }: { severity: AdFraudSeverity }) {
  return <Badge variant={fraudVariants[severity]}>{formatFraudSeverity(severity)}</Badge>;
}

export function VerificationBadge({ status }: { status: AdvertiserVerificationStatus }) {
  return <Badge variant={verificationVariants[status]}>{status}</Badge>;
}

export function SponsoredLabelBadge({ label }: { label: SponsoredLabel }) {
  return <Badge variant={labelVariant}>{label}</Badge>;
}

export function ObjectiveBadge({ objective }: { objective: AdObjective }) {
  return <Badge variant={objectiveVariant}>{objective}</Badge>;
}
