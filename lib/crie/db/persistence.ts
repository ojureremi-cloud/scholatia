/**
 * CRIE persistence services — Mission 006 (persistence layer).
 *
 * Composes the database adapter, the repository registry, and the operational
 * managers that the CRIE architecture specifies: transaction management,
 * versioning, history, audit recording, soft delete, and restore. The
 * `PersistenceCoordinator` is the single entry point for programmatic
 * persistence work; the access layer and the domain services build on it.
 *
 * All managers are thin façades over the primitive modules in `lib/crie/db/`
 * and do not duplicate engine logic or alter any existing public interface.
 */
import type {
  AuthenticatedPrincipal,
  CrieAction,
  CrieAuditEntry,
  CrieFilter,
  CrieHistoryEntry,
  CriePage,
  CrieQuery,
  CrieRecord,
} from '@/types/crie';
import { getCrieDatabaseAdapter, type CrieDatabaseAdapter } from './adapter';
import { exportAudit, listAudit, writeAudit, type WriteAuditInput } from './audit';
import { CrieNotFoundError } from './errors';
import { applySoftDelete, isActive, restoreRow } from './softDelete';
import { ensureCrieSeeded } from './seed';
import { beginTransaction, inTransaction, runInTransaction, type CrieTransaction } from './transactions';
import { assertVersion, recordVersion, snapshotAtVersion, versionHistory } from './versioning';
import type { CrieActorInput, CrieCreateInput, CrieRepository, CrieUpdateInput } from './repository';
import * as R from './repositories';

export type { CrieActorInput, CrieCreateInput, CrieRepository, CrieUpdateInput };

// ---------------------------------------------------------------------------
// Repository factory (registry of every table repository + domain aliases)
// ---------------------------------------------------------------------------

export class RepositoryFactory {
  private readonly registry = new Map<string, CrieRepository>();

  register<T extends CrieRecord = CrieRecord>(name: string, repository: CrieRepository<T>): this {
    this.registry.set(name, repository);
    return this;
  }

  get<T extends CrieRecord = CrieRecord>(name: string): CrieRepository<T> {
    const repository = this.registry.get(name);
    if (!repository) throw new CrieNotFoundError('repository', name);
    return repository as unknown as CrieRepository<T>;
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  names(): string[] {
    return [...this.registry.keys()];
  }

  size(): number {
    return this.registry.size;
  }
}

// ---------------------------------------------------------------------------
// Transaction manager — atomic multi-entity operations.
// ---------------------------------------------------------------------------

export class TransactionManager {
  run<T>(work: () => T): T {
    return runInTransaction(work);
  }

  begin(): CrieTransaction {
    return beginTransaction();
  }

  active(): boolean {
    return inTransaction();
  }
}

// ---------------------------------------------------------------------------
// Version manager — optimistic locking + immutable version history.
// ---------------------------------------------------------------------------

export class VersionManager {
  current(row: CrieRecord): number {
    return row.version;
  }

  next(row: CrieRecord): number {
    return row.version + 1;
  }

  assert(row: CrieRecord, expectedVersion?: number): void {
    assertVersion(row, expectedVersion);
  }

  record(row: CrieRecord, changedBy?: string, reason?: string): CrieHistoryEntry {
    return recordVersion(row, changedBy, reason);
  }
}

export class HistoryManager {
  record(row: CrieRecord, changedBy?: string, reason?: string): CrieHistoryEntry {
    return recordVersion(row, changedBy, reason);
  }

  list(id: string): CrieHistoryEntry[] {
    return versionHistory(id);
  }

  snapshot(id: string, version: number): CrieRecord | undefined {
    return snapshotAtVersion(id, version);
  }
}

// ---------------------------------------------------------------------------
// Audit recorder — append-only audit trail for every mutation.
// ---------------------------------------------------------------------------

export class AuditRecorder {
  record(input: WriteAuditInput): CrieAuditEntry {
    return writeAudit(input);
  }

  list(options: {
    actorId?: string;
    resource?: string;
    resourceId?: string;
    action?: CrieAction;
    limit?: number;
  } = {}): CrieAuditEntry[] {
    return listAudit(options);
  }

  export(): CrieAuditEntry[] {
    return exportAudit();
  }
}

// ---------------------------------------------------------------------------
// Soft delete & restore managers — never physically delete by default.
// ---------------------------------------------------------------------------

export class SoftDeleteManager {
  delete(row: CrieRecord): CrieRecord {
    return applySoftDelete(row);
  }

  restore(row: CrieRecord): CrieRecord {
    return restoreRow(row);
  }

  isActive(row: CrieRecord): boolean {
    return isActive(row);
  }

  /** Purge is explicit and gated by the table definition. */
  purge(repository: CrieRepository, id: string, principal: AuthenticatedPrincipal): void {
    repository.purge({ id, principal });
  }
}

export class RestoreManager {
  restore<T extends CrieRecord = CrieRecord>(
    repository: CrieRepository<T>,
    id: string,
    principal: AuthenticatedPrincipal,
    reason?: string,
  ): T {
    return repository.restore({ id, principal, reason } as CrieActorInput);
  }

  /** Rows currently soft-deleted for a repository. */
  deleted<T extends CrieRecord = CrieRecord>(repository: CrieRepository<T>, query: CrieQuery = {}): CriePage<T> {
    return repository.list({
      ...query,
      includeDeleted: true,
      filters: [...(query.filters ?? []), { field: 'deletedAt', operator: 'exists' } as CrieFilter],
    });
  }
}

// ---------------------------------------------------------------------------
// Unit of work — one atomic batch of repository operations.
// ---------------------------------------------------------------------------

export class UnitOfWork {
  constructor(private readonly transactions: TransactionManager) {}

  run<T>(work: () => T): T {
    return this.transactions.run(work);
  }

  begin(): CrieTransaction {
    return this.transactions.begin();
  }
}

// ---------------------------------------------------------------------------
// Domain repositories (Mission 006 names over the table repositories)
// ---------------------------------------------------------------------------

export class CrieKnowledgeRepository {
  constructor(
    private readonly entities: CrieRepository,
    private readonly relations: CrieRepository,
  ) {}

  entity(id: string): CrieRecord | undefined {
    return this.entities.getById(id);
  }

  entityByCrieId(crieId: string): CrieRecord | undefined {
    return this.entities.getByCrieId(crieId);
  }

  relation(id: string): CrieRecord | undefined {
    return this.relations.getById(id);
  }

  entitiesAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.entities.list(query);
  }

  relationsAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.relations.list(query);
  }

  graph(): { entities: CrieRecord[]; relations: CrieRecord[] } {
    return { entities: this.entities.all({}), relations: this.relations.all({}) };
  }

  /** Relations incident to a knowledge-graph entity (by entity id). */
  neighbors(entityId: string): CrieRecord[] {
    const entity = this.entities.getById(entityId);
    if (!entity) return [];
    const crieId = String(entity.crieId);
    return this.relations.all({}).filter((relation) => {
      const subject = (relation as CrieRecord).subject as { crieId?: string } | undefined;
      const object = (relation as CrieRecord).object as { crieId?: string } | undefined;
      return subject?.crieId === crieId || object?.crieId === crieId;
    });
  }
}

/** Decisions are approved recommendations — same persistence table, status-gated. */
export class CrieDecisionRepository {
  constructor(private readonly recommendations: CrieRepository) {}

  list(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.recommendations.list({
      ...query,
      filters: [...(query.filters ?? []), { field: 'status', operator: 'eq', value: 'approved' }],
    });
  }

  get(id: string): CrieRecord | undefined {
    const record = this.recommendations.getById(id);
    return record && record.status === 'approved' ? record : undefined;
  }

  create(data: Record<string, unknown>, principal: AuthenticatedPrincipal): CrieRecord {
    return this.recommendations.create({ data: { ...data, status: 'approved' }, principal } as CrieCreateInput);
  }

  update(id: string, patch: Record<string, unknown>, principal: AuthenticatedPrincipal, expectedVersion?: number): CrieRecord {
    return this.recommendations.update({ id, patch, principal, expectedVersion } as CrieUpdateInput);
  }

  softDelete(id: string, principal: AuthenticatedPrincipal, reason?: string): CrieRecord {
    return this.recommendations.softDelete({ id, principal, reason });
  }

  restore(id: string, principal: AuthenticatedPrincipal, reason?: string): CrieRecord {
    return this.recommendations.restore({ id, principal, reason });
  }

  history(id: string): CrieHistoryEntry[] {
    return this.recommendations.history(id);
  }
}

/** Federation domain spanning contracts, assets, enterprise models, exchanges, sovereignty. */
export class CrieFederationRepository {
  constructor(
    private readonly contracts: CrieRepository,
    private readonly assets: CrieRepository,
    private readonly enterpriseModels: CrieRepository,
    private readonly exchanges: CrieRepository,
    private readonly sovereignty: CrieRepository,
  ) {}

  contractsAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.contracts.list(query);
  }

  contract(id: string): CrieRecord | undefined {
    return this.contracts.getById(id);
  }

  assetsAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.assets.list(query);
  }

  asset(id: string): CrieRecord | undefined {
    return this.assets.getById(id);
  }

  enterpriseModelsAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.enterpriseModels.list(query);
  }

  exchangesAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.exchanges.list(query);
  }

  sovereigntyAll(query: CrieQuery = {}): CriePage<CrieRecord> {
    return this.sovereignty.list(query);
  }
}

// ---------------------------------------------------------------------------
// Named domain repository instances (Mission 006 repository contract).
// ---------------------------------------------------------------------------

export const crieResearchEntityRepository = R.crieEntityRepository;
export const crieKnowledgeRepository = new CrieKnowledgeRepository(R.crieKgEntityRepository, R.crieKgRelationRepository);
export const crieDecisionRepository = new CrieDecisionRepository(R.crieRecommendationRepository);
export const crieFederationRepository = new CrieFederationRepository(
  R.crieFederationContractRepository,
  R.crieInstitutionalAssetRepository,
  R.crieEnterpriseModelRepository,
  R.crieFederationExchangeRepository,
  R.crieMemberSovereigntyRepository,
);

// ---------------------------------------------------------------------------
// Persistence coordinator — single entry point.
// ---------------------------------------------------------------------------

export class PersistenceCoordinator {
  readonly adapter: CrieDatabaseAdapter;
  readonly repositories: RepositoryFactory;
  readonly transactions: TransactionManager;
  readonly versions: VersionManager;
  readonly history: HistoryManager;
  readonly audit: AuditRecorder;
  readonly softDelete: SoftDeleteManager;
  readonly restore: RestoreManager;

  constructor() {
    this.adapter = getCrieDatabaseAdapter();
    this.repositories = new RepositoryFactory();
    this.transactions = new TransactionManager();
    this.versions = new VersionManager();
    this.history = new HistoryManager();
    this.audit = new AuditRecorder();
    this.softDelete = new SoftDeleteManager();
    this.restore = new RestoreManager();
    registerDefaultRepositories(this.repositories);
  }

  repository<T extends CrieRecord = CrieRecord>(name: string): CrieRepository<T> {
    return this.repositories.get<T>(name);
  }

  unitOfWork(): UnitOfWork {
    return new UnitOfWork(this.transactions);
  }

  transaction<T>(work: () => T): T {
    return this.transactions.run(work);
  }

  seed(): void {
    ensureCrieSeeded();
  }
}

// ---------------------------------------------------------------------------
// Default registry — every table repository by table name + domain aliases.
// ---------------------------------------------------------------------------

const SYSTEM_PRINCIPAL: AuthenticatedPrincipal = {
  userId: 'system',
  username: 'system',
  name: 'CRIE System',
  roles: ['system'],
  verificationLevel: 3,
  scope: 'system',
  permissions: [
    'crie:read',
    'crie:context',
    'crie:memory',
    'crie:evidence',
    'crie:reason',
    'crie:recommend',
    'crie:decision',
    'crie:agents',
    'crie:connectors',
    'crie:federation',
    'crie:analytics',
    'crie:admin',
    'crie:approve',
    'crie:override',
  ],
};

export function systemPrincipal(): AuthenticatedPrincipal {
  return { ...SYSTEM_PRINCIPAL };
}

const TABLE_REPOSITORIES: readonly CrieRepository[] = [
  R.crieEntityRepository,
  R.crieKgEntityRepository,
  R.crieKgRelationRepository,
  R.crieEvidenceRepository,
  R.crieCitationRepository,
  R.crieReferenceRepository,
  R.crieMemoryRepository,
  R.crieReasoningRepository,
  R.crieAgentRepository,
  R.crieAgentTaskRepository,
  R.crieRecommendationRepository,
  R.crieTrustRepository,
  R.crieEnterpriseModelRepository,
  R.crieInstitutionalAssetRepository,
  R.crieFederationContractRepository,
  R.crieWorkspaceRepository,
  R.crieAnalyticsRepository,
  R.crieContextPackRepository,
  R.crieContextElementRepository,
  R.crieSessionRepository,
  R.crieSessionGoalRepository,
  R.crieSessionMessageRepository,
  R.crieClaimRepository,
  R.crieEvidenceAssessmentRepository,
  R.crieContradictionRepository,
  R.crieCitationContextRepository,
  R.crieLiteratureSearchRepository,
  R.crieResearchGapRepository,
  R.crieNoveltyAssessmentRepository,
  R.crieConsentRecordRepository,
  R.criePolicyAuditRepository,
  R.crieRefusalRepository,
  R.crieEthicsReviewRepository,
  R.crieEthicsDecisionRepository,
  R.crieOrchestrationPlanRepository,
  R.criePublicationPlanRepository,
  R.crieJournalMatchRepository,
  R.crieConferenceMatchRepository,
  R.crieGrantOpportunityRepository,
  R.crieGrantProposalRepository,
  R.crieCareerGoalRepository,
  R.crieCareerSignalRepository,
  R.crieLearnerStateRepository,
  R.crieLearningRecommendationRepository,
  R.crieWritingDraftRepository,
  R.crieSupervisionRecordRepository,
  R.crieMentorshipGuidanceRepository,
  R.crieMentoringSessionRepository,
  R.crieWorkspacePaneRepository,
  R.crieFederationExchangeRepository,
  R.crieMemberSovereigntyRepository,
  R.crieSaidIdentityRepository,
];

const DOMAIN_REPOSITORIES: Record<string, CrieRepository> = {
  'research-entity': R.crieEntityRepository,
  memory: R.crieMemoryRepository,
  evidence: R.crieEvidenceRepository,
  citation: R.crieCitationRepository,
  recommendation: R.crieRecommendationRepository,
  agent: R.crieAgentRepository,
  analytics: R.crieAnalyticsRepository,
  trust: R.crieTrustRepository,
};

function registerDefaultRepositories(factory: RepositoryFactory): void {
  for (const repository of TABLE_REPOSITORIES) {
    factory.register(repository.table, repository);
  }
  for (const [name, repository] of Object.entries(DOMAIN_REPOSITORIES)) {
    factory.register(name, repository);
  }
  factory.register('knowledge', crieKnowledgeRepository as unknown as CrieRepository);
  factory.register('decision', crieDecisionRepository as unknown as CrieRepository);
  factory.register('federation', crieFederationRepository as unknown as CrieRepository);
}

export const criePersistence = new PersistenceCoordinator();
