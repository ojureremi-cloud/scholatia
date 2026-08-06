/**
 * E-18 Policy Engine — Mission 004-D (Wave 2).
 *
 * Pure governance helpers over `PolicyRule`, `PolicyVerdict`, `AuditRecord`,
 * and `ConsentRecord` (CRIE Chs. 61, 67). Every consequential action is
 * audited; every grant/refusal is explainable.
 */
import type {
  ActorType,
  AuditEventType,
  AuditRecord,
  ConsentRecord,
  ConsentScope,
  PermissionKey,
  PolicyRule,
  PolicyVerdict,
  ResearcherRef,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export function checkPolicy(rule: PolicyRule, actorType: ActorType): PolicyVerdict {
  if (!rule.appliesTo.includes(actorType)) {
    return { decision: 'refuse', rule: rule.id, reason: `Not applicable to actor type ${actorType}.` };
  }
  if (!rule.allow) {
    return { decision: 'refuse', rule: rule.id, reason: rule.description };
  }
  if (rule.approvalRequired) {
    return { decision: 'pending-approval', rule: rule.id, reason: `${rule.description} (approval required).` };
  }
  return { decision: 'grant', rule: rule.id, reason: rule.description };
}

export function policyVerdictFor(
  rules: readonly PolicyRule[],
  key: string,
  actorType: ActorType,
): PolicyVerdict {
  const rule = rules.find((candidate) => candidate.key === key);
  if (!rule) {
    return { decision: 'refuse', reason: `No policy rule for key ${key}.` };
  }
  return checkPolicy(rule, actorType);
}

export function auditId(label: string): string {
  return `audit-${slugOf(label)}`;
}

export interface AuditRecordInput {
  label: string;
  actorType: ActorType;
  actorId: string;
  eventType: AuditEventType;
  payload: Record<string, unknown>;
  researcher?: ResearcherRef;
}

export function recordAudit(input: AuditRecordInput): AuditRecord {
  const now = nowIso();
  return {
    id: auditId(input.label),
    researcher: input.researcher,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    payload: input.payload,
    occurredAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export function consentRecordId(label: string): string {
  return `consent-${slugOf(label)}`;
}

export interface ConsentRecordInput {
  label: string;
  researcher: ResearcherRef;
  consentScope: ConsentScope;
  dataUse?: string[];
  revocable?: boolean;
}

export function recordConsent(input: ConsentRecordInput): ConsentRecord {
  const now = nowIso();
  return {
    id: consentRecordId(input.label),
    researcher: input.researcher,
    consentScope: input.consentScope,
    granted: true,
    revocable: input.revocable ?? true,
    grantedAt: now,
    dataUse: input.dataUse ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function revokeConsent(record: ConsentRecord): ConsentRecord {
  const now = nowIso();
  return { ...record, granted: false, revokedAt: now, updatedAt: now };
}

export interface PolicyStatistics {
  rules: number;
  grants: number;
  refusals: number;
  pendingApproval: number;
}

export function policyStatistics(
  rules: readonly PolicyRule[],
  verdicts: readonly PolicyVerdict[] = [],
): PolicyStatistics {
  let grants = 0;
  let refusals = 0;
  let pendingApproval = 0;
  for (const verdict of verdicts) {
    if (verdict.decision === 'grant') grants += 1;
    if (verdict.decision === 'refuse') refusals += 1;
    if (verdict.decision === 'pending-approval') pendingApproval += 1;
  }
  return { rules: rules.length, grants, refusals, pendingApproval };
}

/** The set of CRIE permission keys enforced by the Policy Engine. */
export const CRIE_PERMISSION_KEYS: readonly PermissionKey[] = [
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
];

/** The default CRIE policy set (deny-by-default with explicit approvals). */
export const DEFAULT_CRIE_POLICIES: readonly PolicyRule[] = [
  {
    id: 'pol-01',
    key: 'crie:read',
    description: 'Read CRIE records.',
    appliesTo: ['researcher', 'institution', 'system', 'agent'],
    allow: true,
    approvalRequired: false,
  },
  {
    id: 'pol-02',
    key: 'crie:memory',
    description: 'Read/write memory.',
    appliesTo: ['researcher', 'agent'],
    allow: true,
    approvalRequired: true,
  },
  {
    id: 'pol-03',
    key: 'crie:connectors',
    description: 'Invoke external connectors.',
    appliesTo: ['researcher', 'agent'],
    allow: true,
    approvalRequired: true,
  },
  {
    id: 'pol-04',
    key: 'crie:federation',
    description: 'Exchange with federation members.',
    appliesTo: ['institution'],
    allow: true,
    approvalRequired: true,
  },
  {
    id: 'pol-05',
    key: 'crie:admin',
    description: 'Administer CRIE.',
    appliesTo: ['researcher'],
    allow: true,
    approvalRequired: true,
  },
  {
    id: 'pol-06',
    key: 'crie:override',
    description: 'Override an AI decision.',
    appliesTo: ['researcher'],
    allow: true,
    approvalRequired: false,
  },
];
