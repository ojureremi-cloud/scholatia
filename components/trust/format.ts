import type {
  AcademicMilestone,
  AcademicTimelineEntry,
  BadgeTier,
  IntegrityEvent,
  IntegritySeverity,
  IntegrityStatus,
  PeerReviewModel,
  ReviewRecommendation,
  TrustConfidence,
  TrustEntityType,
  TrustRecommendation,
  TrustScoreGrade,
  TrustVerificationStatus,
} from '@/types/trust';
import {
  resolveIntegrityStatusLabel,
  resolveIntegrityTypeLabel,
  resolvePeerReviewModelLabel,
  resolveReviewRecommendationLabel,
} from '@/lib/trust';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export function formatScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
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

export function formatDateLabel(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTrustStatus(status: TrustVerificationStatus): string {
  const labels: Record<TrustVerificationStatus, string> = {
    unverified: 'Unverified',
    pending: 'Verification pending',
    verified: 'Verified',
    trusted: 'Trusted',
    revoked: 'Revoked',
  };
  return labels[status];
}

export function trustStatusVariant(status: TrustVerificationStatus): BadgeVariant {
  const variants: Record<TrustVerificationStatus, BadgeVariant> = {
    unverified: 'default',
    pending: 'warning',
    verified: 'info',
    trusted: 'success',
    revoked: 'danger',
  };
  return variants[status];
}

export function formatTrustGrade(grade: TrustScoreGrade): string {
  return `Grade ${grade}`;
}

export function formatTierLabel(tier: BadgeTier): string {
  const labels: Record<BadgeTier, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  };
  return labels[tier];
}

export function tierTextClass(tier: BadgeTier): string {
  const classes: Record<BadgeTier, string> = {
    bronze: 'text-amber-700',
    silver: 'text-slate-500',
    gold: 'text-yellow-600',
    platinum: 'text-sky-700',
  };
  return classes[tier];
}

export function formatConfidence(confidence: TrustConfidence): string {
  const labels: Record<TrustConfidence, string> = {
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence',
  };
  return labels[confidence];
}

export function confidenceVariant(confidence: TrustConfidence): BadgeVariant {
  const variants: Record<TrustConfidence, BadgeVariant> = {
    high: 'success',
    medium: 'info',
    low: 'warning',
  };
  return variants[confidence];
}

export function severityVariant(severity: IntegritySeverity): BadgeVariant {
  const variants: Record<IntegritySeverity, BadgeVariant> = {
    low: 'info',
    medium: 'warning',
    high: 'warning',
    critical: 'danger',
  };
  return variants[severity];
}

export function severityLabel(severity: IntegritySeverity): string {
  const labels: Record<IntegritySeverity, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return labels[severity];
}

export function integrityStatusVariant(status: IntegrityStatus): BadgeVariant {
  const variants: Record<IntegrityStatus, BadgeVariant> = {
    open: 'danger',
    resolved: 'success',
    'in-progress': 'warning',
    monitoring: 'info',
    'not-applicable': 'default',
  };
  return variants[status];
}

export function recommendationVariant(recommendation: ReviewRecommendation): BadgeVariant {
  const variants: Record<ReviewRecommendation, BadgeVariant> = {
    accept: 'success',
    'minor-revision': 'info',
    'major-revision': 'warning',
    reject: 'danger',
    withdraw: 'default',
  };
  return variants[recommendation];
}

export function reviewModelLabel(model: PeerReviewModel): string {
  return resolvePeerReviewModelLabel(model);
}

export function reviewRecommendationLabel(recommendation: ReviewRecommendation): string {
  return resolveReviewRecommendationLabel(recommendation);
}

export function integrityTypeLabel(type: IntegrityEvent['type']): string {
  return resolveIntegrityTypeLabel(type);
}

export function integrityStatusLabel(status: IntegrityStatus): string {
  return resolveIntegrityStatusLabel(status);
}

export const entityTypeLabels: Record<TrustEntityType, string> = {
  researcher: 'Researcher',
  institution: 'Institution',
  journal: 'Journal',
  conference: 'Conference',
  publisher: 'Publisher',
  reviewer: 'Reviewer',
};

export function entityTypeLabel(entityType: TrustEntityType): string {
  return entityTypeLabels[entityType];
}

export const entityTypeIcons: Record<TrustEntityType, string> = {
  researcher: '🔬',
  institution: '🏛️',
  journal: '📚',
  conference: '🎪',
  publisher: '🏢',
  reviewer: '⭐',
};

export function entityTypeIcon(entityType: TrustEntityType): string {
  return entityTypeIcons[entityType];
}

export function recommendationTypeLabel(type: TrustRecommendation['type']): string {
  const labels: Record<TrustRecommendation['type'], string> = {
    collaborator: 'Collaborator',
    journal: 'Journal',
    conference: 'Conference',
    reviewer: 'Reviewer',
    grant: 'Grant',
    citation: 'Citation',
  };
  return labels[type];
}

export function recommendationTypeIcon(type: TrustRecommendation['type']): string {
  const icons: Record<TrustRecommendation['type'], string> = {
    collaborator: '🤝',
    journal: '📚',
    conference: '🎪',
    reviewer: '⭐',
    grant: '💰',
    citation: '📑',
  };
  return icons[type];
}

export function recommendationTypeVariant(type: TrustRecommendation['type']): BadgeVariant {
  const variants: Record<TrustRecommendation['type'], BadgeVariant> = {
    collaborator: 'info',
    journal: 'default',
    conference: 'warning',
    reviewer: 'success',
    grant: 'success',
    citation: 'info',
  };
  return variants[type];
}

export function milestoneTypeIcon(type: AcademicMilestone['type']): string {
  const icons: Record<AcademicMilestone['type'], string> = {
    'first-publication': '📄',
    phd: '🎓',
    professorship: '🧑‍🏫',
    'first-grant': '💰',
    'editorial-appointment': '📝',
    fellowship: '🏅',
    award: '🏆',
    patent: '⚙️',
    keynote: '🎤',
    'citation-milestone': '📈',
  };
  return icons[type];
}

export function categoryLabel(category: AcademicTimelineEntry['category']): string {
  const labels: Record<AcademicTimelineEntry['category'], string> = {
    education: 'Education',
    employment: 'Employment',
    publication: 'Publication',
    grant: 'Grant',
    award: 'Award',
    milestone: 'Milestone',
  };
  return labels[category];
}
