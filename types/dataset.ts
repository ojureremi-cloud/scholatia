import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Canonical research lifecycle stage that every dataset in Scholatia belongs to.
 * Datasets are stage 6 of the lifecycle, sitting between Research Project and Analysis.
 */
export const DATASET_LIFECYCLE_STAGE_ID: ResearchLifecycleStageId = 'dataset';

export type DatasetStatus =
  | 'published'
  | 'draft'
  | 'in-review'
  | 'archived'
  | 'deprecated';

export type DatasetVerificationStatus =
  | 'verified'
  | 'peer-reviewed'
  | 'in-review'
  | 'unverified';

export type DatasetAccessLevel =
  | 'open'
  | 'restricted'
  | 'embargoed'
  | 'controlled'
  | 'private';

export type DatasetContributorRole =
  | 'principal-investigator'
  | 'data-curator'
  | 'data-collector'
  | 'researcher'
  | 'analyst'
  | 'software-engineer'
  | 'verifier';

export type DatasetVersionStatus = 'published' | 'deprecated';

export interface DatasetLicense {
  id: string;
  name: string;
  abbreviation: string;
  url: string;
  type: 'open' | 'restricted' | 'proprietary';
  allowsCommercialUse: boolean;
  allowsDerivatives: boolean;
  attributionRequired: boolean;
  description: string;
}

export interface DatasetVersion {
  id: string;
  version: string;
  publishedAt: string;
  doi: string;
  sizeBytes: number;
  fileCount: number;
  format: string;
  status: DatasetVersionStatus;
  checksum?: string;
  changes?: string;
}

export interface DatasetCitation {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: string;
  doi: string;
  type: string;
  count: number;
}

export interface DatasetContributor {
  id: string;
  name: string;
  said: string;
  role: DatasetContributorRole;
  institution: string;
  orcid?: string;
}

export interface DatasetMetadata {
  summary: string;
  methodology: string;
  collectionPeriod?: string;
  temporalCoverage?: string;
  geographicCoverage?: string;
  language?: string;
  subjects: string[];
  fileFormats: string[];
  sizeBytes: number;
  fileCount: number;
  sampleSize?: number;
}

export interface DatasetRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

export interface DatasetRelationships {
  project?: DatasetRelationshipRef;
  grants: DatasetRelationshipRef[];
  publications: DatasetRelationshipRef[];
  institutions: string[];
  researchers: string[];
}

export interface DatasetStatistics {
  downloads: number;
  views: number;
  citations: number;
  versionCount: number;
  fileCount: number;
  sizeBytes: number;
  storageUsedGb: number;
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  /** Canonical research lifecycle stage id. Always 'dataset' for this module. */
  stageId: ResearchLifecycleStageId;
  status: DatasetStatus;
  access: DatasetAccessLevel;
  verification: DatasetVerificationStatus;
  doi: string;
  creator: string;
  institution: string;
  publishedAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  latestVersion: string;
  accessNote?: string;
  embargoEndsAt?: string;
  versions: DatasetVersion[];
  licenses: DatasetLicense[];
  citations: DatasetCitation[];
  contributors: DatasetContributor[];
  metadata: DatasetMetadata;
  relationships: DatasetRelationships;
  statistics: DatasetStatistics;
  tags: string[];
  collections: string[];
}

export interface DatasetCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  datasetCount: number;
}

export interface DatasetTimelineEntry {
  date: string;
  title: string;
  detail: string;
  type: 'Collection' | 'Version' | 'Verification' | 'Publication' | 'Project';
}

export interface DatasetAccessBreakdownEntry {
  label: DatasetAccessLevel;
  count: number;
}

export interface DatasetDownloadTrendPoint {
  period: string;
  downloads: number;
}

export interface DatasetAnalytics {
  totalDatasets: number;
  totalDownloads: number;
  downloadGrowthPercent: number;
  totalCitations: number;
  citationGrowthPercent: number;
  openDatasets: number;
  restrictedDatasets: number;
  storageUsedGb: number;
  doiCount: number;
  latestVersion: string;
  accessBreakdown: DatasetAccessBreakdownEntry[];
  topTags: string[];
  downloadTrend: DatasetDownloadTrendPoint[];
}
