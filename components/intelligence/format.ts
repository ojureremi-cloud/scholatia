import type {
  IntelligenceConfidence,
  IntelligenceInsightSeverity,
  IntelligenceInsightType,
} from '@/types/intelligence';

export function formatConfidence(confidence: IntelligenceConfidence): string {
  const labels: Record<IntelligenceConfidence, string> = {
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence',
  };
  return labels[confidence];
}

export function formatSeverity(severity: IntelligenceInsightSeverity): string {
  const labels: Record<IntelligenceInsightSeverity, string> = {
    info: 'Information',
    positive: 'Positive',
    warning: 'Warning',
    critical: 'Critical',
  };
  return labels[severity];
}

export function formatInsightType(type: IntelligenceInsightType): string {
  const labels: Record<IntelligenceInsightType, string> = {
    signal: 'Signal',
    warning: 'Warning',
    opportunity: 'Opportunity',
    trend: 'Trend',
    prediction: 'Prediction',
    gap: 'Gap',
    recommendation: 'Recommendation',
  };
  return labels[type];
}

export function formatScore(score: number): string {
  return `${Math.round(score)}/100`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatCurrency(amount: number | undefined, currency: string): string {
  if (amount === undefined) return 'Amount undisclosed';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
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

export function momentumLabel(momentum: number): string {
  if (momentum > 25) return 'Rising';
  if (momentum < -25) return 'Declining';
  return 'Stable';
}

export function momentumClass(momentum: number): string {
  if (momentum > 25) return 'text-emerald-600';
  if (momentum < -25) return 'text-rose-600';
  return 'text-slate-500';
}

export function momentumArrow(momentum: number): string {
  if (momentum > 25) return '↗';
  if (momentum < -25) return '↘';
  return '→';
}
