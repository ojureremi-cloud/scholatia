/**
 * CRIE research analytics types (fspec §2.12).
 *
 * `ResearchAnalytics` holds derived research health indicators scoped to a
 * researcher, project, institution, enterprise, or the global ecosystem.
 * All analytics are explicitly cached and never authoritative (CRIE Ch. 36).
 */
import type { ConfidenceScore } from './base';

export type AnalyticsScope =
  | 'researcher'
  | 'project'
  | 'institution'
  | 'enterprise'
  | 'global';

export const CRIE_ANALYTICS_SCOPES: readonly AnalyticsScope[] = [
  'researcher',
  'project',
  'institution',
  'enterprise',
  'global',
];

/** Derived research health indicators. */
export interface ResearchAnalytics {
  scope: AnalyticsScope;
  scopeId: string;
  indicators: AnalyticsIndicator[];
  generatedAt: string;
}

export type IndicatorKey =
  | 'publicationCount'
  | 'citationCount'
  | 'hIndex'
  | 'collaborationCount'
  | 'fundingTotal'
  | 'grantSuccessRate'
  | 'timeInStage'
  | 'stageAdvanceRate'
  | 'contradictionCount'
  | 'retractionCount'
  | 'openAccessRate'
  | 'mentorshipActive'
  | 'innovationScore'
  | 'expertiseMatch'
  | 'impactScore';

/** A single derived indicator. */
export interface AnalyticsIndicator {
  key: IndicatorKey;
  value: number;
  confidence: ConfidenceScore;
  evidenceVersion: number;
}

/** A rollup of analytics across scopes. */
export interface AnalyticsRollup {
  scope: AnalyticsScope;
  scopeId: string;
  indicators: AnalyticsIndicator[];
  generatedAt: string;
}
