/**
 * CRIE orchestration types (fspec §2.14, §4.6).
 *
 * `OrchestrationPlan` is the task plan produced by the orchestrator;
 * `OrchestrationTask` is a task within the plan with dependency ordering and
 * human-in-the-loop approval gates; `OrchestrationCheckpoint` and
 * `OversightView` support oversight (CRIE Ch. 43).
 */
import type { Auditable, ResearcherRef, Versioned } from './base';
import type { AgentId } from './agents';

export type OrchestrationStatus = 'planned' | 'authorised' | 'executing' | 'verifying' | 'complete';

/** The task plan produced by the orchestrator. */
export interface OrchestrationPlan extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  sessionId?: string;
  intent: string;
  tasks: OrchestrationTask[];
  status: OrchestrationStatus;
  budgets: { tokens?: number; timeMin?: number; cost?: number };
}

export type OrchestrationTaskStatus =
  | 'pending'
  | 'running'
  | 'awaiting-approval'
  | 'done'
  | 'failed';

/** A task within an orchestration plan. */
export interface OrchestrationTask {
  id: string;
  agentId?: AgentId;
  service?: string;
  step: string;
  dependencyIds: string[];
  requiresApproval: boolean; // human-in-the-loop gates
  status: OrchestrationTaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

/** A human-in-the-loop checkpoint within an orchestration plan. */
export interface OrchestrationCheckpoint extends Auditable {
  id: string;
  orchestrationPlanId: string;
  taskId: string;
  requires: ResearcherRef;
  status: 'open' | 'approved' | 'rejected' | 'overridden';
  decidedAt?: string;
  rationale?: string;
}

/** A derived oversight snapshot of agent activity (E-04 `oversightView`). */
export interface OversightView {
  planId: string;
  openCheckpoints: OrchestrationCheckpoint[];
  awaitingApproval: OrchestrationTask[];
  running: OrchestrationTask[];
  failed: OrchestrationTask[];
  escalated: DelegationNotice[];
  generatedAt: string;
}

export interface DelegationNotice {
  taskId: string;
  fromAgentId?: AgentId;
  reason: string;
}
