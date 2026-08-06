import type { CrieAction, CrieActorType, CrieAuditEntry, PermissionKey } from '@/types/crie';
import { getCrieStore } from './store';
import { nowIso } from './utils';

export interface WriteAuditInput {
  userId: string;
  username?: string;
  actorType: CrieActorType;
  resource: string;
  resourceId?: string;
  action: CrieAction;
  permission?: PermissionKey;
  payload?: Record<string, unknown>;
}

export function auditId(resource: string, resourceId: string | undefined, action: CrieAction): string {
  const base = `${resource}:${resourceId ?? 'list'}:${action}`;
  return `crie-audit-${base.replace(/[^a-z0-9-]/gi, '-')}-${Date.now()}`;
}

export function writeAudit(input: WriteAuditInput): CrieAuditEntry {
  const entry: CrieAuditEntry = {
    id: auditId(input.resource, input.resourceId, input.action),
    actor: {
      userId: input.userId,
      username: input.username,
      actorType: input.actorType,
    },
    resource: input.resource,
    resourceId: input.resourceId,
    action: input.action,
    permission: input.permission,
    payload: input.payload ?? {},
    occurredAt: nowIso(),
  };
  getCrieStore().audit.push(entry);
  return entry;
}

export function listAudit(
  options: {
    actorId?: string;
    resource?: string;
    resourceId?: string;
    action?: CrieAction;
    limit?: number;
  } = {},
): CrieAuditEntry[] {
  const store = getCrieStore();
  let entries = store.audit;
  if (options.actorId) entries = entries.filter((entry) => entry.actor.userId === options.actorId);
  if (options.resource) entries = entries.filter((entry) => entry.resource === options.resource);
  if (options.resourceId) entries = entries.filter((entry) => entry.resourceId === options.resourceId);
  if (options.action) entries = entries.filter((entry) => entry.action === options.action);
  const sorted = [...entries].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return typeof options.limit === 'number' && options.limit >= 0 ? sorted.slice(0, options.limit) : sorted;
}

export function exportAudit(): CrieAuditEntry[] {
  return [...getCrieStore().audit].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
}
