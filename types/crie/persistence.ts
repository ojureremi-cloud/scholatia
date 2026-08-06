import type { PermissionKey } from './governance';

export type CrieScope = 'research' | 'institution' | 'global' | 'system';

export type CrieActorType = 'researcher' | 'institution' | 'system' | 'agent' | 'service';

export interface AuthenticatedPrincipal {
  userId: string;
  username?: string;
  name?: string;
  roles: string[];
  verificationLevel: number;
  institutionId?: string;
  scope: CrieScope;
  permissions: PermissionKey[];
}

export interface CrieRecordBase {
  id: string;
  crieId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type CrieRecord = CrieRecordBase & Record<string, unknown>;

export type CrieFilterOperator =
  | 'eq'
  | 'neq'
  | 'in'
  | 'like'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'exists'
  | 'null';

export interface CrieFilter {
  field: string;
  operator: CrieFilterOperator;
  value?: unknown;
}

export interface CrieSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CriePagination {
  page: number;
  pageSize: number;
}

export interface CrieQuery {
  filters?: CrieFilter[];
  sort?: CrieSort[];
  pagination?: CriePagination;
  search?: string;
  cursor?: string;
  includeDeleted?: boolean;
}

export interface CriePage<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface CrieCursorPage<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export type CrieAction =
  | 'create'
  | 'read'
  | 'update'
  | 'archive'
  | 'restore'
  | 'soft-delete'
  | 'purge'
  | 'search'
  | 'version'
  | 'approval'
  | 'refusal'
  | 'export'
  | 'consolidate'
  | 'recall';

export interface CrieAuditEntry {
  id: string;
  actor: {
    userId: string;
    username?: string;
    actorType: CrieActorType;
  };
  resource: string;
  resourceId?: string;
  action: CrieAction;
  permission?: PermissionKey;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface CrieHistoryEntry {
  id: string;
  crieId: string;
  version: number;
  snapshot: CrieRecord;
  changedBy?: string;
  reason?: string;
  at: string;
}

export interface CrieIndexEntry {
  id: string;
  table: string;
  crieId: string;
  entityId: string;
  entityClass: string;
  title: string;
  description?: string;
  tokens: string[];
  confidence: number;
  facet?: string;
  indexedAt: string;
}

export interface CrieTableDefinition {
  table: string;
  fields: readonly string[];
  searchableFields?: readonly string[];
  searchTitle?: (row: CrieRecord) => string;
  searchDescription?: (row: CrieRecord) => string | undefined;
  facet?: (row: CrieRecord) => string | undefined;
  confidenceOf?: (row: CrieRecord) => number;
  allowPurge?: boolean;
}

export interface CrieServiceOperationResult<T extends CrieRecord = CrieRecord> {
  record: T;
  version: number;
}
