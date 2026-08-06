/**
 * E-04 Agent Coordinator Engine — Mission 004-D (Wave 2).
 *
 * Pure orchestration helpers over `OrchestrationPlan`, `OrchestrationTask`,
 * and `OrchestrationCheckpoint`. Keeps human-in-the-loop gates explicit and
 * derives the `OversightView` snapshot (CRIE Ch. 43).
 */
import type {
  AgentId,
  DelegationNotice,
  OrchestrationCheckpoint,
  OrchestrationPlan,
  OrchestrationStatus,
  OrchestrationTask,
  OrchestrationTaskStatus,
  OversightView,
  ResearcherRef,
  TaskPriority,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export function orchestrationPlanId(label: string): string {
  return `orchestration-${slugOf(label)}`;
}

export interface OrchestrationTaskInput {
  step: string;
  agentId?: AgentId;
  service?: string;
  dependencyIds?: string[];
  requiresApproval?: boolean;
  priority?: TaskPriority;
  status?: OrchestrationTaskStatus;
}

export function orchestrationTask(input: OrchestrationTaskInput, index: number): OrchestrationTask {
  return {
    id: `task-${index + 1}`,
    agentId: input.agentId,
    service: input.service,
    step: input.step,
    dependencyIds: input.dependencyIds ?? [],
    requiresApproval: input.requiresApproval ?? false,
    status: input.status ?? 'pending',
    priority: input.priority ?? 'medium',
  };
}

export interface OrchestrationPlanInput {
  owner: ResearcherRef;
  intent: string;
  sessionId?: string;
  tasks?: OrchestrationTask[];
  budgets?: { tokens?: number; timeMin?: number; cost?: number };
  status?: OrchestrationStatus;
}

export function createOrchestrationPlan(input: OrchestrationPlanInput): OrchestrationPlan {
  const now = nowIso();
  return {
    id: orchestrationPlanId(input.intent),
    owner: input.owner,
    sessionId: input.sessionId,
    intent: input.intent,
    tasks: input.tasks ?? [],
    status: input.status ?? 'planned',
    budgets: input.budgets ?? {},
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function planForSession(
  plans: readonly OrchestrationPlan[],
  sessionId: string,
): OrchestrationPlan[] {
  return plans.filter((plan) => plan.sessionId === sessionId);
}

export function awaitingApproval(plan: OrchestrationPlan): OrchestrationTask[] {
  return plan.tasks.filter((task) => task.status === 'awaiting-approval');
}

export function runningTasks(plan: OrchestrationPlan): OrchestrationTask[] {
  return plan.tasks.filter((task) => task.status === 'running');
}

export function failedTasks(plan: OrchestrationPlan): OrchestrationTask[] {
  return plan.tasks.filter((task) => task.status === 'failed');
}

export function oversightView(
  plan: OrchestrationPlan,
  checkpoints: readonly OrchestrationCheckpoint[],
  escalated: DelegationNotice[] = [],
): OversightView {
  return {
    planId: plan.id,
    openCheckpoints: checkpoints.filter((checkpoint) => checkpoint.status === 'open'),
    awaitingApproval: awaitingApproval(plan),
    running: runningTasks(plan),
    failed: failedTasks(plan),
    escalated,
    generatedAt: nowIso(),
  };
}

export interface OrchestrationStatistics {
  total: number;
  totalTasks: number;
  awaitingApprovalTasks: number;
  byStatus: Partial<Record<OrchestrationStatus, number>>;
}

export function orchestrationStatistics(plans: readonly OrchestrationPlan[]): OrchestrationStatistics {
  const byStatus: Partial<Record<OrchestrationStatus, number>> = {};
  let totalTasks = 0;
  let awaitingApprovalTasks = 0;
  for (const plan of plans) {
    byStatus[plan.status] = (byStatus[plan.status] ?? 0) + 1;
    totalTasks += plan.tasks.length;
    awaitingApprovalTasks += awaitingApproval(plan).length;
  }
  return { total: plans.length, totalTasks, awaitingApprovalTasks, byStatus };
}
