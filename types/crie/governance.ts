/**
 * CRIE governance & audit types (fspec §2.15).
 *
 * `AuditRecord` is an append-only record of consequential action;
 * `ConsentRecord` governs data use; `PolicyRule` encodes a CRIE policy and
 * `PolicyDecision` the grant/refuse verdict (CRIE Chs. 61, 67).
 */
import type {
  Auditable,
  ConsentScope,
  ResearcherRef,
} from './base';

export type ActorType = 'researcher' | 'institution' | 'system' | 'agent' | 'service';

export type AuditEventType =
  | 'create'
  | 'update'
  | 'transition'
  | 'decision'
  | 'refusal'
  | 'approval'
  | 'override'
  | 'export'
  | 'consent-change'
  | 'federation-exchange'
  | 'agent-execution';

/** An append-only audit record of consequential action. */
export interface AuditRecord extends Auditable {
  id: string;
  researcher?: ResearcherRef;
  actorType: ActorType;
  actorId: string;
  eventType: AuditEventType;
  payload: Record<string, unknown>;
  occurredAt: string;
}

/** CRIE permission keys enforced by the Policy Engine (E-18). */
export type PermissionKey =
  | 'crie:read'
  | 'crie:context'
  | 'crie:memory'
  | 'crie:evidence'
  | 'crie:reason'
  | 'crie:recommend'
  | 'crie:decision'
  | 'crie:agents'
  | 'crie:connectors'
  | 'crie:federation'
  | 'crie:analytics'
  | 'crie:admin'
  | 'crie:approve'
  | 'crie:override';

/** A CRIE policy rule. */
export interface PolicyRule {
  id: string;
  key: string;
  description: string;
  appliesTo: ActorType[];
  allow: boolean;
  approvalRequired: boolean;
}

export type PolicyDecision = 'grant' | 'refuse' | 'pending-approval';

/** The outcome of a policy check. */
export interface PolicyVerdict {
  decision: PolicyDecision;
  rule?: string;
  reason?: string;
  auditRef?: string;
}

/** A consent record governing data use (CRIE Ch. 60). */
export interface ConsentRecord extends Auditable {
  id: string;
  researcher: ResearcherRef;
  consentScope: ConsentScope;
  granted: boolean;
  revocable: boolean;
  grantedAt: string;
  revokedAt?: string;
  dataUse: string[];
}
