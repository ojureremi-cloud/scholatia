/**
 * E-27 Analytics Engine — Mission 004-D (Wave 2).
 *
 * Pure research-analytics helpers over `ResearchAnalytics`,
 * `AnalyticsIndicator`, and `AnalyticsRollup` (CRIE Ch. 36). All analytics
 * are explicitly cached and never authoritative.
 */
import type {
  AnalyticsIndicator,
  AnalyticsRollup,
  AnalyticsScope,
  IndicatorKey,
  ResearchAnalytics,
} from '@/types/crie';
import { confidence, nowIso, round } from './utils';

export function analyticsIndicator(
  key: IndicatorKey,
  value: number,
  evidenceVersion: number,
  confidenceValue = 0.5,
): AnalyticsIndicator {
  return {
    key,
    value: round(Math.max(0, Math.min(1, value))),
    confidence: confidence(confidenceValue),
    evidenceVersion,
  };
}

export interface ResearchAnalyticsInput {
  scope: AnalyticsScope;
  scopeId: string;
  indicators: AnalyticsIndicator[];
}

export function researchAnalytics(input: ResearchAnalyticsInput): ResearchAnalytics {
  return {
    scope: input.scope,
    scopeId: input.scopeId,
    indicators: input.indicators,
    generatedAt: nowIso(),
  };
}

export function indicatorByKey(
  analytics: ResearchAnalytics | AnalyticsRollup,
  key: IndicatorKey,
): AnalyticsIndicator | undefined {
  return analytics.indicators.find((indicator) => indicator.key === key);
}

export function analyticsForScope(
  analyticsList: readonly ResearchAnalytics[],
  scope: AnalyticsScope,
  scopeId?: string,
): ResearchAnalytics[] {
  return analyticsList.filter(
    (analytics) => analytics.scope === scope && (!scopeId || analytics.scopeId === scopeId),
  );
}

export function rollup(
  analyticsList: readonly ResearchAnalytics[],
  scope: AnalyticsScope,
  scopeId: string,
): AnalyticsRollup {
  const indicators: AnalyticsIndicator[] = [];
  const byKey = new Map<IndicatorKey, number[]>();
  for (const analytics of analyticsList) {
    for (const indicator of analytics.indicators) {
      const values = byKey.get(indicator.key) ?? [];
      values.push(indicator.value);
      byKey.set(indicator.key, values);
    }
  }
  for (const [key, values] of byKey) {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    indicators.push(analyticsIndicator(key, mean, 1));
  }
  return { scope, scopeId, indicators, generatedAt: nowIso() };
}

export interface AnalyticsStatistics {
  snapshots: number;
  indicators: number;
  averageIndicatorValue: number;
}

export function analyticsStatistics(
  analyticsList: readonly ResearchAnalytics[],
): AnalyticsStatistics {
  let indicatorTotal = 0;
  let valueTotal = 0;
  for (const analytics of analyticsList) {
    indicatorTotal += analytics.indicators.length;
    valueTotal += analytics.indicators.reduce((sum, indicator) => sum + indicator.value, 0);
  }
  return {
    snapshots: analyticsList.length,
    indicators: indicatorTotal,
    averageIndicatorValue: indicatorTotal === 0 ? 0 : round(valueTotal / indicatorTotal),
  };
}
