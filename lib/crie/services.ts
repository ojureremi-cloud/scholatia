/**
 * CRIE data services — Mission 004-F (Wave 4).
 *
 * Thin, policy-enforcing façade over the persistence repositories. Every
 * service method takes an `AuthenticatedPrincipal` (never a hardcoded user)
 * and enforces:
 *   - permission gating   (fspec Ch. 9 PermissionKey vocabulary)
 *   - institution scope   (research principals cannot cross institutions)
 *   - ownership rules     (research principals manage only their own records)
 *   - optimistic locking  (expectedVersion on update)
 */
import type {
  AuthenticatedPrincipal,
  CrieAction,
  CrieAuditEntry,
  CrieFilter,
  CrieHistoryEntry,
  CrieIndexEntry,
  CriePage,
  CrieQuery,
  CrieRecord,
  PermissionKey,
} from '@/types/crie';
import type { CrieCreateInput, CrieRepository, CrieUpdateInput } from './db/repository';
import {
  CrieInstitutionScopeError,
  CrieNotFoundError,
  CriePermissionError,
  CrieValidationError,
} from './db/errors';
import { ensureCrieSeeded } from './db/seed';
import { queryIndex } from './db/indexes';
import { listAudit } from './db/audit';
import { runInTransaction } from './db/transactions';
import {
  crieAgentRepository,
  crieAgentTaskRepository,
  crieAnalyticsRepository,
  crieCitationRepository,
  crieEntityRepository,
  crieEnterpriseModelRepository,
  crieEvidenceRepository,
  crieFederationContractRepository,
  crieInstitutionalAssetRepository,
  crieKgEntityRepository,
  crieKgRelationRepository,
  crieMemoryRepository,
  crieReasoningRepository,
  crieRecommendationRepository,
  crieReferenceRepository,
  crieTrustRepository,
  crieWorkspaceRepository,
} from './db/repositories';

export interface CrieAccessPolicy {
  readPermission: PermissionKey;
  writePermission: PermissionKey;
  adminPermission?: PermissionKey;
  ownershipField?: string;
  institutionField?: string;
  readOwnedOnly?: boolean;
  required?: readonly string[];
}

export class CrieService {
  protected readonly repository: CrieRepository;
  protected readonly policy: CrieAccessPolicy;
  readonly name: string;

  constructor(name: string, repository: CrieRepository, policy: CrieAccessPolicy) {
    this.name = name;
    this.repository = repository;
    this.policy = policy;
  }

  protected assertPermission(principal: AuthenticatedPrincipal, permission?: PermissionKey): void {
    const required = permission ?? this.policy.readPermission;
    if (!principal.permissions.includes(required)) {
      throw new CriePermissionError(required, `Principal is not permitted to ${required}.`);
    }
  }

  protected assertWrite(principal: AuthenticatedPrincipal): void {
    this.assertPermission(principal, this.policy.writePermission);
  }

  protected assertAdmin(principal: AuthenticatedPrincipal): void {
    this.assertPermission(principal, this.policy.adminPermission ?? this.policy.writePermission);
  }

  protected validateInstitution(principal: AuthenticatedPrincipal, record: CrieRecord): void {
    const field = this.policy.institutionField;
    if (!field || !principal.institutionId) return;
    const value = record[field];
    if (value != null && String(value) !== principal.institutionId) {
      throw new CrieInstitutionScopeError(String(value));
    }
  }

  protected ownerValue(record: CrieRecord): string | undefined {
    const field = this.policy.ownershipField;
    if (!field) return undefined;
    const value = record[field];
    return value == null ? undefined : String(value);
  }

  protected canManage(principal: AuthenticatedPrincipal, record: CrieRecord): boolean {
    if (principal.scope === 'system') return true;
    if (principal.scope === 'institution') {
      const field = this.policy.institutionField;
      if (field && record[field] != null && principal.institutionId) {
        return String(record[field]) === principal.institutionId;
      }
    }
    const owner = this.ownerValue(record);
    if (owner) return principal.scope === 'research' ? owner === principal.username : false;
    return principal.scope !== 'research';
  }

  protected assertCanManage(principal: AuthenticatedPrincipal, record: CrieRecord): void {
    if (!this.canManage(principal, record)) {
      throw new CriePermissionError(
        this.policy.writePermission,
        `You do not have permission to modify this ${this.name} record.`,
      );
    }
  }

  protected scopeFilters(principal: AuthenticatedPrincipal): CrieFilter[] {
    if (principal.scope === 'system') return [];
    const institution = this.policy.institutionField;
    if (institution && principal.institutionId) {
      return [{ field: institution, operator: 'eq', value: principal.institutionId }];
    }
    if (this.policy.readOwnedOnly && this.policy.ownershipField) {
      return [{ field: this.policy.ownershipField, operator: 'eq', value: principal.username }];
    }
    return [];
  }

  protected assertRequired(data: Record<string, unknown>): void {
    for (const key of this.policy.required ?? []) {
      const value = data[key];
      if (value == null || value === '') {
        throw new CrieValidationError(
          { [key]: 'required' },
          `Field "${key}" is required to create a ${this.name} record.`,
        );
      }
    }
  }

  create(data: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    this.assertRequired(data);
    this.validateInstitution(principal, data as CrieRecord);
    const normalized: Record<string, unknown> = { ...data };
    if (this.policy.ownershipField === 'owner' && normalized.owner == null) {
      normalized.owner = principal.username;
    }
    return this.repository.create({ data: normalized, principal } as CrieCreateInput);
  }

  get(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertPermission(principal);
    const record = this.repository.getOrThrow(id);
    this.assertCanManage(principal, record);
    return record;
  }

  list(query: CrieQuery, principal: AuthenticatedPrincipal): CriePage<CrieRecord> {
    this.assertPermission(principal);
    const filters = [...(query.filters ?? []), ...this.scopeFilters(principal)];
    return this.repository.list({ ...query, filters });
  }

  all(query: CrieQuery, principal: AuthenticatedPrincipal): CrieRecord[] {
    this.assertPermission(principal);
    const filters = [...(query.filters ?? []), ...this.scopeFilters(principal)];
    return this.repository.all({ ...query, filters });
  }

  update(
    id: string,
    patch: Record<string, unknown>,
    principal: AuthenticatedPrincipal,
    expectedVersion?: number,
  ): CrieRecord {
    this.assertWrite(principal);
    const existing = this.repository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    this.validateInstitution(principal, { ...existing, ...patch });
    return this.repository.update({ id, patch, principal, expectedVersion } as CrieUpdateInput);
  }

  remove(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    const existing = this.repository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    return this.repository.archive({ id, principal });
  }

  restore(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    const existing = this.repository.getIncludingDeleted(id);
    if (!existing) throw new CrieNotFoundError(this.name, id);
    this.assertCanManage(principal, existing);
    return this.repository.restore({ id, principal });
  }

  purge(id: string, principal: AuthenticatedPrincipal): void {
    this.assertAdmin(principal);
    const existing = this.repository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    this.repository.purge({ id, principal });
  }

  search(
    terms: string[],
    query: CrieQuery,
    principal: AuthenticatedPrincipal,
    limit = 20,
  ): CriePage<CrieRecord> {
    this.assertPermission(principal);
    const filters = [...(query.filters ?? []), ...this.scopeFilters(principal)];
    return this.repository.search(terms, { ...query, filters }, limit);
  }

  history(id: string, principal: AuthenticatedPrincipal): CrieHistoryEntry[] {
    this.assertPermission(principal);
    const existing = this.repository.getIncludingDeleted(id);
    if (!existing) throw new CrieNotFoundError(this.name, id);
    this.assertCanManage(principal, existing);
    return this.repository.history(id);
  }
}

// ---------------------------------------------------------------------------
// Graph service — relations must reference persisted graph entities.
// ---------------------------------------------------------------------------

export class CrieGraphService extends CrieService {
  constructor() {
    super('graph', crieKgEntityRepository, {
      readPermission: 'crie:context',
      writePermission: 'crie:context',
      ownershipField: 'owner',
      required: ['label', 'entityClass'],
    });
  }

  listRelations(query: CrieQuery, principal: AuthenticatedPrincipal): CriePage<CrieRecord> {
    this.assertPermission(principal, 'crie:context');
    const filters = [...(query.filters ?? []), ...this.scopeFilters(principal)];
    return crieKgRelationRepository.list({ ...query, filters });
  }

  createRelation(data: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    return runInTransaction(() => {
      this.assertWrite(principal);
      const subjectRef = data.subject as { crieId?: unknown };
      const objectRef = data.object as { crieId?: unknown };
      if (typeof subjectRef?.crieId !== 'string' || typeof objectRef?.crieId !== 'string') {
        throw new CrieValidationError(
          { subject: 'required', object: 'required' },
          'A relation requires subject.crieId and object.crieId.',
        );
      }
      const subject = crieKgEntityRepository.getByCrieId(subjectRef.crieId);
      const object = crieKgEntityRepository.getByCrieId(objectRef.crieId);
      if (!subject) {
        throw new CrieValidationError({ subject: 'not_found' }, `Subject entity ${subjectRef.crieId} does not exist.`);
      }
      if (!object) {
        throw new CrieValidationError({ object: 'not_found' }, `Object entity ${objectRef.crieId} does not exist.`);
      }
      this.validateInstitution(principal, data as CrieRecord);
      return crieKgRelationRepository.create({
        data: { ...data, owner: principal.username },
        principal,
      } as CrieCreateInput);
    });
  }

  getRelation(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertPermission(principal, 'crie:context');
    const record = crieKgRelationRepository.getOrThrow(id);
    this.assertCanManage(principal, record);
    return record;
  }
}

/** Record-level operations on knowledge graph relations (via graph policy). */
export const crieGraphRelationService = new CrieService('relation', crieKgRelationRepository, {
  readPermission: 'crie:context',
  writePermission: 'crie:context',
  ownershipField: 'owner',
});

// ---------------------------------------------------------------------------
// Memory service — recall + write + consolidation.
// ---------------------------------------------------------------------------

export class CrieMemoryService extends CrieService {
  constructor() {
    super('memory', crieMemoryRepository, {
      readPermission: 'crie:memory',
      writePermission: 'crie:memory',
      ownershipField: 'owner',
      readOwnedOnly: true,
      required: ['content', 'memoryType'],
    });
  }

  recall(query: CrieQuery, principal: AuthenticatedPrincipal): CriePage<CrieRecord> {
    return this.list(query, principal);
  }

  consolidate(recordIds: string[], principal: AuthenticatedPrincipal): CrieRecord {
    return runInTransaction(() => {
      this.assertWrite(principal);
      if (!recordIds.length) {
        throw new CrieValidationError({ recordIds: 'required' }, 'consolidate requires at least one record id.');
      }
      const consolidated = recordIds.map((id) => this.repository.getOrThrow(id));
      for (const record of consolidated) this.assertCanManage(principal, record);
      const title = consolidated
        .map((r) => String(r.content ?? r.crieId).slice(0, 64))
        .join(' · ')
        .slice(0, 200);
      return crieReasoningRepository.create({
        data: {
          memoryType: 'consolidation',
          content: title,
          accessPolicy: 'private',
          provenance: [{ kind: 'consolidation', refs: recordIds }],
          sessionId: principal.username,
          researchEntityId: null,
          happenedAt: new Date().toISOString(),
          owner: principal.username,
          consolidated: true,
          consolidationId: recordIds.join('+'),
        },
        principal,
      } as CrieCreateInput);
    });
  }
}

// ---------------------------------------------------------------------------
// Reason service — plan traces, step artifacts, recommendation register.
// ---------------------------------------------------------------------------

export class CrieReasonService extends CrieService {
  constructor() {
    super('reasoning', crieReasoningRepository, {
      readPermission: 'crie:reason',
      writePermission: 'crie:reason',
      ownershipField: 'owner',
      required: ['label', 'paradigm'],
    });
  }
}

export class CrieRecommendationService extends CrieService {
  constructor() {
    super('recommendation', crieRecommendationRepository, {
      readPermission: 'crie:recommend',
      writePermission: 'crie:recommend',
      ownershipField: 'owner',
      required: ['label', 'kind'],
    });
  }

  approve(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertPermission(principal, 'crie:approve');
    const existing = this.repository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    return this.repository.update({ id, patch: { status: 'approved' }, principal } as CrieUpdateInput);
  }
}

// ---------------------------------------------------------------------------
// Decision service — decisions are recommended-then-approved.
// ---------------------------------------------------------------------------

export class CrieDecisionService extends CrieService {
  constructor() {
    super('decision', crieRecommendationRepository, {
      readPermission: 'crie:decision',
      writePermission: 'crie:decision',
      ownershipField: 'owner',
    });
  }
}

// ---------------------------------------------------------------------------
// Agent service — agent lifecycle + task management.
// ---------------------------------------------------------------------------

export class CrieAgentService extends CrieService {
  constructor() {
    super('agent', crieAgentRepository, {
      readPermission: 'crie:agents',
      writePermission: 'crie:agents',
      ownershipField: 'owner',
      required: ['agentId', 'name'],
    });
  }

  listTasks(query: CrieQuery, principal: AuthenticatedPrincipal): CriePage<CrieRecord> {
    this.assertPermission(principal, 'crie:agents');
    const filters = [...(query.filters ?? []), ...this.scopeFilters(principal)];
    return crieAgentTaskRepository.list({ ...query, filters });
  }

  createTask(data: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    return crieAgentTaskRepository.create({
      data: { ...data, owner: principal.username },
      principal,
    } as CrieCreateInput);
  }

  updateTask(id: string, patch: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    const existing = crieAgentTaskRepository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    return crieAgentTaskRepository.update({ id, patch, principal } as CrieUpdateInput);
  }

  getTask(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertPermission(principal, 'crie:agents');
    const existing = crieAgentTaskRepository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    return existing;
  }

  removeTask(id: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    const existing = crieAgentTaskRepository.getOrThrow(id);
    this.assertCanManage(principal, existing);
    return crieAgentTaskRepository.archive({ id, principal });
  }
}

// ---------------------------------------------------------------------------
// Trust service — scored counterparties for recommendation confidence.
// ---------------------------------------------------------------------------

export class CrieTrustService extends CrieService {
  constructor() {
    super('trust', crieTrustRepository, {
      readPermission: 'crie:recommend',
      writePermission: 'crie:admin',
      required: ['entityType', 'entityId'],
    });
  }
}

// ---------------------------------------------------------------------------
// Federation service — institutional assets, enterprise models, contracts.
// ---------------------------------------------------------------------------

export class CrieFederationService extends CrieService {
  constructor() {
    super('federation', crieFederationContractRepository, {
      readPermission: 'crie:federation',
      writePermission: 'crie:federation',
      adminPermission: 'crie:admin',
      institutionField: 'institutionId',
      required: ['contractType', 'institutionId', 'memberInstitutionId'],
    });
  }

  listAssets(query: CrieQuery, principal: AuthenticatedPrincipal): CriePage<CrieRecord> {
    this.assertPermission(principal, 'crie:federation');
    const filters = [...(query.filters ?? []), ...this.scopeFilters(principal)];
    return crieInstitutionalAssetRepository.list({ ...query, filters });
  }

  createAsset(data: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertWrite(principal);
    this.validateInstitution(principal, data as CrieRecord);
    return crieInstitutionalAssetRepository.create({
      data: { ...data, owner: principal.username },
      principal,
    } as CrieCreateInput);
  }

  getEnterpriseModel(institutionId: string, principal: AuthenticatedPrincipal): CrieRecord {
    this.assertPermission(principal, 'crie:federation');
    const record = crieEnterpriseModelRepository
      .all({})
      .find((m) => String(m.institutionId) === institutionId);
    if (!record) throw new CrieNotFoundError('enterprise model', institutionId);
    return record;
  }
}

// ---------------------------------------------------------------------------
// Analytics service — aggregated indicator snapshots.
// ---------------------------------------------------------------------------

export class CrieAnalyticsService extends CrieService {
  constructor() {
    super('analytics', crieAnalyticsRepository, {
      readPermission: 'crie:analytics',
      writePermission: 'crie:admin',
      required: ['scope'],
    });
  }
}

// ---------------------------------------------------------------------------
// Workspace service — the researcher's own persistent workspace.
// ---------------------------------------------------------------------------

export class CrieWorkspaceService extends CrieService {
  constructor() {
    super('workspace', crieWorkspaceRepository, {
      readPermission: 'crie:context',
      writePermission: 'crie:context',
      ownershipField: 'researcher',
      readOwnedOnly: true,
    });
  }

  getOwnWorkspace(principal: AuthenticatedPrincipal): CrieRecord | undefined {
    this.assertPermission(principal);
    return this.all({}, principal).find((w) => String(w.researcher) === principal.username);
  }

  upsertOwn(data: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    return runInTransaction(() => {
      this.assertWrite(principal);
      const existing = this.getOwnWorkspace(principal);
      if (existing) {
        const patch = { ...data, researcher: principal.username };
        return this.repository.update({ id: existing.id, patch, principal } as CrieUpdateInput);
      }
      return this.repository.create({
        data: { ...data, researcher: principal.username },
        principal,
      } as CrieCreateInput);
    });
  }
}

// ---------------------------------------------------------------------------
// Public instance accessors.
// ---------------------------------------------------------------------------

export const crieEntityService = new CrieService('entity', crieEntityRepository, {
  readPermission: 'crie:context',
  writePermission: 'crie:context',
  ownershipField: 'owner',
  required: ['title', 'kind'],
});

export const crieEvidenceService = new CrieService('evidence', crieEvidenceRepository, {
  readPermission: 'crie:evidence',
  writePermission: 'crie:evidence',
  ownershipField: 'owner',
  required: ['label', 'evidenceType'],
});

export const crieCitationService = new CrieService('citation', crieCitationRepository, {
  readPermission: 'crie:evidence',
  writePermission: 'crie:evidence',
  ownershipField: 'owner',
  required: ['label'],
});

export const crieReferenceService = new CrieService('reference', crieReferenceRepository, {
  readPermission: 'crie:evidence',
  writePermission: 'crie:evidence',
  ownershipField: 'owner',
  required: ['title'],
});

export const crieGraphService = new CrieGraphService();
export const crieMemoryService = new CrieMemoryService();
export const crieReasonService = new CrieReasonService();
export const crieRecommendationService = new CrieRecommendationService();
export const crieDecisionService = new CrieDecisionService();
export const crieAgentService = new CrieAgentService();
export const crieTrustService = new CrieTrustService();
export const crieFederationService = new CrieFederationService();
export const crieAnalyticsService = new CrieAnalyticsService();
export const crieWorkspaceService = new CrieWorkspaceService();

// ---------------------------------------------------------------------------
// Cross-domain entrypoints for the search + audit endpoints.
// ---------------------------------------------------------------------------

export function crieSearchAll(
  terms: string[],
  options: { table?: string; facet?: string; limit?: number } = {},
): CrieIndexEntry[] {
  ensureCrieSeeded();
  return queryIndex({ terms, table: options.table, facet: options.facet, limit: options.limit ?? 20 });
}

export function crieAuditList(
  principal: AuthenticatedPrincipal,
  options: { resourceId?: string; resource?: string; action?: CrieAction; actorId?: string; limit?: number } = {},
): CrieAuditEntry[] {
  if (!principal.permissions.includes('crie:admin')) {
    throw new CriePermissionError('crie:admin', 'Audit trail requires the crie:admin permission.');
  }
  return listAudit(options);
}
