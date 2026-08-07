/**
 * E-35 Analytics Intelligence Engine — Mission 008.
 *
 * Pure derived-intelligence helpers over cached `ResearchAnalytics` (CRIE Ch.
 * 36): labelled `IntelligenceIndicator`s with change tracking across
 * snapshots. All analytics are explicitly cached and never authoritative.
 */
import type {
  AnalyticsIndicator,
  IndicatorKey,
  IntelligenceIndicator,
  IntelligenceIndicatorKey,
  ResearchAnalytics,
} from '@/types/crie';
import { confidence, round, slugOf } from './utils';

export const INTELLIGENCE_INDICATOR_LABELS: Record<IntelligenceIndicatorKey, string> = {
  'research-output': 'Research output',
  'citation-impact': 'Citation impact',
  collaboration: 'Collaboration',
  funding: 'Funding',
  progress: 'Stage progress',
  readiness: 'Publication readiness',
  novelty: 'Novelty',
  'expertise-match': 'Expertise match',
};

/** The cached analytics indicator each intelligence indicator derives from. */
export const INTELLIGENCE_INDICATOR_SOURCES: Record<IntelligenceIndicatorKey, IndicatorKey> = {
  'research-output': 'publicationCount',
  'citation-impact': 'citationCount',
  collaboration: 'collaborationCount',
  funding: 'fundingTotal',
  progress: 'stageAdvanceRate',
  readiness: 'impactScore',
  novelty: 'contradictionCount',
  'expertise-match': 'expertiseMatch',
};

export function intelligenceIndicatorId(label: string): string {
  return `intel-indicator-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Indicator derivation
// ---------------------------------------------------------------------------

/** Derive an intelligence indicator from a raw value with change tracking. */
export function intelligenceIndicator(
  key: IntelligenceIndicatorKey,
  value: number,
  previousValue?: number,
  evidenceVersion = 1,
): IntelligenceIndicator {
  const clamped = round(Math.max(0, Math.min(1, value)));
  const change = previousValue === undefined ? 0 : round(clamped - previousValue);
  return {
    key,
    label: INTELLIGENCE_INDICATOR_LABELS[key],
    value: clamped,
    change,
    confidence: confidence(clamped, `derived ${key} indicator`),
    evidenceVersion,
  };
}

/** Derive an indicator from a matching cached analytics indicator. */
export function fromAnalyticsIndicator(
  key: IntelligenceIndicatorKey,
  source: AnalyticsIndicator | undefined,
  previousValue?: number,
): IntelligenceIndicator {
  return intelligenceIndicator(key, source?.value ?? 0, previousValue, source?.evidenceVersion ?? 1);
}

/** Derive the indicator set for a scope from its cached analytics. */
export function indicatorsFromAnalytics(
  analytics: ResearchAnalytics,
  previous: ResearchAnalytics | undefined,
): IntelligenceIndicator[] {
  const previousBySource = new Map(
    (previous?.indicators ?? []).map((indicator) => [indicator.key, indicator.value]),
  );
  const keys: IntelligenceIndicatorKey[] = [
    'research-output',
    'citation-impact',
    'collaboration',
    'funding',
    'progress',
    'readiness',
    'novelty',
    'expertise-match',
  ];
  return keys.map((key) => {
    const source = analytics.indicators.find(
      (indicator) => indicator.key === INTELLIGENCE_INDICATOR_SOURCES[key],
    );
    return fromAnalyticsIndicator(key, source, previousBySource.get(INTELLIGENCE_INDICATOR_SOURCES[key]));
  });
}

// ---------------------------------------------------------------------------
// Indicator helpers
// ---------------------------------------------------------------------------

export function intelligenceIndicatorByKey(
  indicators: readonly IntelligenceIndicator[],
  key: IntelligenceIndicatorKey,
): IntelligenceIndicator | undefined {
  return indicators.find((indicator) => indicator.key === key);
}

export function strongestIndicators(
  indicators: readonly IntelligenceIndicator[],
  limit = 3,
): IntelligenceIndicator[] {
  return [...indicators].sort((a, b) => b.value - a.value).slice(0, Math.max(0, limit));
}

export function risingIndicators(indicators: readonly IntelligenceIndicator[]): IntelligenceIndicator[] {
  return indicators.filter((indicator) => indicator.change > 0);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface AnalyticsIntelligenceStatistics {
  indicators: number;
  averageValue: number;
  rising: number;
}

export function analyticsIntelligenceStatistics(
  indicators: readonly IntelligenceIndicator[],
): AnalyticsIntelligenceStatistics {
  const valueTotal = indicators.reduce((sum, indicator) => sum + indicator.value, 0);
  return {
    indicators: indicators.length,
    averageValue: indicators.length === 0 ? 0 : round(valueTotal / indicators.length),
    rising: indicators.filter((indicator) => indicator.change > 0).length,
  };
}
