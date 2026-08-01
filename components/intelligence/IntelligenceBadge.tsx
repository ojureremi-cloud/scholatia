import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatConfidence, formatSeverity } from './format';
import type {
  IntelligenceConfidence,
  IntelligenceInsightSeverity,
} from '@/types/intelligence';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const confidenceVariants: Record<IntelligenceConfidence, BadgeVariant> = {
  high: 'success',
  medium: 'info',
  low: 'warning',
};

const severityVariants: Record<IntelligenceInsightSeverity, BadgeVariant> = {
  info: 'info',
  positive: 'success',
  warning: 'warning',
  critical: 'danger',
};

export function ConfidenceBadge({ confidence }: { confidence: IntelligenceConfidence }) {
  return <Badge variant={confidenceVariants[confidence]}>{formatConfidence(confidence)}</Badge>;
}

export function SeverityBadge({ severity }: { severity: IntelligenceInsightSeverity }) {
  return <Badge variant={severityVariants[severity]}>{formatSeverity(severity)}</Badge>;
}
