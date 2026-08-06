/**
 * E-11 Institution Engine — Mission 004-D (Wave 2).
 *
 * Pure enterprise & institutional-intelligence helpers over
 * `EnterpriseCognitiveModel`, `InstitutionalKnowledgeAsset` (IKOS),
 * `InstitutionIntelligence`, and `EnterpriseAnalytics` (CRIE Chs. 35, 59, 60).
 * All intelligence is derived, explicitly cached, and never authoritative;
 * institutional isolation is preserved by reference (P9).
 */
import type {
  AccessClass,
  AnalyticsIndicator,
  EnterpriseAnalytics,
  EnterpriseCognitiveModel,
  IKAssetKind,
  InstitutionalKnowledgeAsset,
  InstitutionIntelligence,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function enterpriseModelId(label: string): string {
  return `ecm-${slugOf(label)}`;
}

export interface EnterpriseCognitiveModelInput {
  label: string;
  institutionId: string;
  strategicGoals: string[];
  strengthAreas: string[];
  researchEntityIds: string[];
}

export function createEnterpriseCognitiveModel(
  input: EnterpriseCognitiveModelInput,
): EnterpriseCognitiveModel {
  const now = nowIso();
  return {
    id: enterpriseModelId(input.label),
    institutionId: input.institutionId,
    strategicGoals: input.strategicGoals,
    strengthAreas: input.strengthAreas,
    researchEntityIds: input.researchEntityIds,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function institutionalAssetId(label: string): string {
  return `asset-${slugOf(label)}`;
}

export interface InstitutionalAssetInput {
  label: string;
  institutionId: string;
  assetKind: IKAssetKind;
  title: string;
  accessClass: AccessClass;
  consentScope: string[];
  curator: string;
}

export function createInstitutionalAsset(input: InstitutionalAssetInput): InstitutionalKnowledgeAsset {
  const now = nowIso();
  return {
    id: institutionalAssetId(input.label),
    institutionId: input.institutionId,
    assetKind: input.assetKind,
    title: input.title,
    accessClass: input.accessClass,
    consentScope: input.consentScope,
    curator: input.curator,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function assetsForInstitution(
  assets: readonly InstitutionalKnowledgeAsset[],
  institutionId: string,
): InstitutionalKnowledgeAsset[] {
  return assets.filter((asset) => asset.institutionId === institutionId);
}

export function assetsByKind(
  assets: readonly InstitutionalKnowledgeAsset[],
  assetKind: IKAssetKind,
): InstitutionalKnowledgeAsset[] {
  return assets.filter((asset) => asset.assetKind === assetKind);
}

export function publicAssets(
  assets: readonly InstitutionalKnowledgeAsset[],
): InstitutionalKnowledgeAsset[] {
  return assets.filter((asset) => asset.accessClass === 'public');
}

export function intelligenceFor(
  institutionId: string,
  indicators: AnalyticsIndicator[],
): InstitutionIntelligence {
  return {
    institutionId,
    indicators,
    generatedAt: nowIso(),
    confidence: confidence(0.5),
  };
}

export interface EnterpriseAnalyticsInput {
  institutionId: string;
  scope: EnterpriseAnalytics['scope'];
  indicators: AnalyticsIndicator[];
}

export function enterpriseRollup(input: EnterpriseAnalyticsInput): EnterpriseAnalytics {
  return {
    institutionId: input.institutionId,
    scope: input.scope,
    indicators: input.indicators,
    generatedAt: nowIso(),
  };
}

export interface InstitutionStatistics {
  models: number;
  assets: number;
  publicAssets: number;
  byAssetKind: Partial<Record<IKAssetKind, number>>;
}

export function institutionStatistics(
  models: readonly EnterpriseCognitiveModel[],
  assets: readonly InstitutionalKnowledgeAsset[],
): InstitutionStatistics {
  const byAssetKind: Partial<Record<IKAssetKind, number>> = {};
  let publicAssetCount = 0;
  for (const asset of assets) {
    byAssetKind[asset.assetKind] = (byAssetKind[asset.assetKind] ?? 0) + 1;
    if (asset.accessClass === 'public') publicAssetCount += 1;
  }
  return {
    models: models.length,
    assets: assets.length,
    publicAssets: publicAssetCount,
    byAssetKind,
  };
}
