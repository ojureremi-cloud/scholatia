/**
 * CRIE enterprise & institutional intelligence types (fspec §2.15).
 *
 * `EnterpriseCognitiveModel` is the institution-level cognitive model;
 * `InstitutionalKnowledgeAsset` is a governed institutional knowledge asset
 * (IKOS); `InstitutionIntelligence` and `EnterpriseAnalytics` are derived,
 * explicitly cached, and never authoritative (CRIE Chs. 35, 59, 60).
 */
import type {
  AccessClass,
  Auditable,
  ConfidenceScore,
  Versioned,
} from './base';
import type { AnalyticsIndicator } from './analytics';

/** The institution-level cognitive model (CRIE Ch. 59). */
export interface EnterpriseCognitiveModel extends Auditable, Versioned {
  id: string;
  institutionId: string;
  strategicGoals: string[];
  strengthAreas: string[];
  researchEntityIds: string[];
}

export type IKAssetKind =
  | 'dataset'
  | 'report'
  | 'curriculum'
  | 'methodology'
  | 'patent'
  | 'know-how'
  | 'repository';

/** A governed institutional knowledge asset (IKOS, CRIE Ch. 60). */
export interface InstitutionalKnowledgeAsset extends Auditable, Versioned {
  id: string;
  institutionId: string;
  assetKind: IKAssetKind;
  title: string;
  accessClass: AccessClass;
  consentScope: string[];
  curator: string;
}

/** Derived aggregate institutional intelligence. */
export interface InstitutionIntelligence {
  institutionId: string;
  indicators: AnalyticsIndicator[];
  generatedAt: string;
  confidence: ConfidenceScore;
}

/** Derived enterprise analytics rollup (explicitly cached; never authoritative). */
export interface EnterpriseAnalytics {
  institutionId: string;
  scope: 'institution' | 'enterprise' | 'global';
  indicators: AnalyticsIndicator[];
  generatedAt: string;
}
