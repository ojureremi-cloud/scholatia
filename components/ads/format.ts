import { AD_OBJECTIVE_LABELS, pricingModelUnit } from '@/lib/ads';
import type {
  AdBudgetMode,
  AdCampaignStatus,
  AdObjective,
  AdPricingModel,
  AdReviewStatus,
  PromotableEntityType,
  SponsoredLabel,
} from '@/types/ads';

export function formatCurrency(amount: number | undefined, currency: string): string {
  if (amount === undefined) return '—';
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

export function formatRoi(value: number): string {
  if (value <= 0) return `${Math.round(value)}%`;
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

export function formatObjectiveLabel(objective: AdObjective): string {
  return AD_OBJECTIVE_LABELS[objective] ?? objective;
}

export function formatPricingModel(model: AdPricingModel): string {
  return `${model} — ${pricingModelUnit(model)}`;
}

export function formatPricingModelShort(model: AdPricingModel): string {
  return model;
}

export function formatPlacement(placement: string): string {
  return placement
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatSponsoredLabel(label: SponsoredLabel): string {
  return label;
}

export function formatCampaignStatus(status: AdCampaignStatus): string {
  const labels: Record<AdCampaignStatus, string> = {
    draft: 'Draft',
    'in-review': 'In review',
    active: 'Active',
    paused: 'Paused',
    ended: 'Ended',
    rejected: 'Rejected',
    completed: 'Completed',
  };
  return labels[status];
}

export function formatReviewStatus(status: AdReviewStatus): string {
  const labels: Record<AdReviewStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    'needs-review': 'Needs review',
  };
  return labels[status];
}

export function formatBudgetMode(mode: AdBudgetMode): string {
  const labels: Record<AdBudgetMode, string> = {
    daily: 'Daily cap',
    lifetime: 'Lifetime',
    'fixed-package': 'Fixed package',
    'featured-subscription': 'Featured subscription',
    'premium-bundle': 'Premium bundle',
  };
  return labels[mode];
}

export function formatFraudSeverity(severity: string): string {
  const labels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return labels[severity] ?? severity;
}

export function formatFraudType(type: string): string {
  return type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatEntityType(entityType: PromotableEntityType): string {
  const labels: Record<PromotableEntityType, string> = {
    'research-paper': 'Research paper',
    preprint: 'Preprint',
    journal: 'Journal',
    conference: 'Conference',
    'call-for-papers': 'Call for papers',
    'funding-opportunity': 'Funding opportunity',
    dataset: 'Dataset',
    book: 'Book',
    'book-chapter': 'Book chapter',
    publisher: 'Publisher',
    institution: 'Institution',
    'research-centre': 'Research centre',
    'research-laboratory': 'Research laboratory',
    'research-project': 'Research project',
    'researcher-profile': 'Researcher profile',
    'student-profile': 'Student profile',
    'academic-event': 'Academic event',
    webinar: 'Webinar',
    workshop: 'Workshop',
    course: 'Course',
    'job-vacancy': 'Job vacancy',
    scholarship: 'Scholarship',
    fellowship: 'Fellowship',
    grant: 'Grant',
    patent: 'Patent',
    startup: 'Startup',
    'marketplace-listing': 'Marketplace listing',
    equipment: 'Equipment',
    software: 'Software',
    'ai-tool': 'AI tool',
    'academic-service': 'Academic service',
  };
  return labels[entityType] ?? entityType;
}

export function entityTypeIcon(entityType: PromotableEntityType): string {
  const icons: Record<PromotableEntityType, string> = {
    'research-paper': '📄',
    preprint: '📋',
    journal: '🗞️',
    conference: '🎤',
    'call-for-papers': '📣',
    'funding-opportunity': '💰',
    dataset: '📊',
    book: '📚',
    'book-chapter': '📖',
    publisher: '🏢',
    institution: '🏛️',
    'research-centre': '🔬',
    'research-laboratory': '🧪',
    'research-project': '🚀',
    'researcher-profile': '👩‍🔬',
    'student-profile': '🎓',
    'academic-event': '🗓️',
    webinar: '💻',
    workshop: '🛠️',
    course: '🎓',
    'job-vacancy': '💼',
    scholarship: '🎗️',
    fellowship: '🤝',
    grant: '💸',
    patent: '📜',
    startup: '🦄',
    'marketplace-listing': '🛒',
    equipment: '⚙️',
    software: '🖥️',
    'ai-tool': '🤖',
    'academic-service': '🧭',
  };
  return icons[entityType];
}
