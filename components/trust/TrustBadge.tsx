import React from 'react';
import Badge from '@/components/ui/Badge';
import {
  confidenceVariant,
  formatConfidence,
  formatTierLabel,
  formatTrustGrade,
  formatTrustStatus,
  integrityStatusLabel,
  integrityStatusVariant,
  reviewModelLabel,
  reviewRecommendationLabel,
  recommendationVariant,
  severityLabel,
  severityVariant,
  tierTextClass,
  trustStatusVariant,
} from './format';
import type { BadgeVariant } from './format';
import type {
  BadgeTier,
  IntegritySeverity,
  IntegrityStatus,
  PeerReviewModel,
  ReviewRecommendation,
  TrustConfidence,
  TrustScoreGrade,
  TrustVerificationStatus,
} from '@/types/trust';

export function StatusBadge({ status }: { status: TrustVerificationStatus }) {
  return <Badge variant={trustStatusVariant(status)}>{formatTrustStatus(status)}</Badge>;
}

export function GradeBadge({ grade }: { grade: TrustScoreGrade }) {
  return <Badge>{formatTrustGrade(grade)}</Badge>;
}

export function ConfidenceBadge({ confidence }: { confidence: TrustConfidence }) {
  return <Badge variant={confidenceVariant(confidence)}>{formatConfidence(confidence)}</Badge>;
}

export function TierBadge({ tier }: { tier: BadgeTier }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold ${tierTextClass(tier)}`}>
      {formatTierLabel(tier)}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: IntegritySeverity }) {
  return <Badge variant={severityVariant(severity)}>{severityLabel(severity)}</Badge>;
}

export function IntegrityStatusBadge({ status }: { status: IntegrityStatus }) {
  return <Badge variant={integrityStatusVariant(status)}>{integrityStatusLabel(status)}</Badge>;
}

export function RecommendationBadge({ recommendation }: { recommendation: ReviewRecommendation }) {
  return <Badge variant={recommendationVariant(recommendation)}>{reviewRecommendationLabel(recommendation)}</Badge>;
}

export function ReviewModelBadge({ model }: { model: PeerReviewModel }) {
  return <Badge variant="info">{reviewModelLabel(model)}</Badge>;
}

export function ScorePill({ score }: { score: number }) {
  const variant: BadgeVariant = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger';
  return <Badge variant={variant}>{Math.round(score)}/100</Badge>;
}
