/**
 * E-22 Career Engine — Mission 004-D (Wave 2).
 *
 * Pure career-intelligence helpers over `CareerGoal`, `CareerPlan`,
 * `CareerMilestone`, and `CareerSignal` (CRIE Ch. 32).
 */
import type {
  CareerGoal,
  CareerGoalStatus,
  CareerIntelligence,
  CareerMilestone,
  CareerPlan,
  CareerSignal,
  CareerSignalKind,
  LifecycleStageId,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function careerGoalId(label: string): string {
  return `career-goal-${slugOf(label)}`;
}

export interface CareerGoalInput {
  label: string;
  researcher: ResearcherRef;
  statement: string;
  horizonMonths: number;
  goalStatus?: CareerGoalStatus;
}

export function createCareerGoal(input: CareerGoalInput): CareerGoal {
  const now = nowIso();
  return {
    id: careerGoalId(input.label),
    researcher: input.researcher,
    statement: input.statement,
    goalStatus: input.goalStatus ?? 'proposed',
    horizonMonths: input.horizonMonths,
    createdAt: now,
    updatedAt: now,
  };
}

export interface CareerPlanInput {
  label: string;
  careerGoalId: string;
  milestones?: CareerMilestone[];
  planStatus?: CareerPlan['planStatus'];
}

export function createCareerPlan(input: CareerPlanInput): CareerPlan {
  const now = nowIso();
  return {
    id: `career-plan-${slugOf(input.label)}`,
    careerGoalId: input.careerGoalId,
    milestones: input.milestones ?? [],
    planStatus: input.planStatus ?? 'drafting',
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface CareerMilestoneInput {
  label: string;
  statement: string;
  due: string;
  lifecycleStageId?: LifecycleStageId;
  status?: CareerMilestone['status'];
}

export function careerMilestone(input: CareerMilestoneInput): CareerMilestone {
  return {
    id: `career-milestone-${slugOf(input.label)}`,
    statement: input.statement,
    lifecycleStageId: input.lifecycleStageId,
    due: input.due,
    status: input.status ?? 'planned',
  };
}

export interface CareerSignalInput {
  label: string;
  researcher: ResearcherRef;
  kind: CareerSignalKind;
  statement: string;
  confidenceValue?: number;
}

export function deriveCareerSignal(input: CareerSignalInput): CareerSignal {
  return {
    id: `career-signal-${slugOf(input.label)}`,
    researcher: input.researcher,
    kind: input.kind,
    statement: input.statement,
    confidence: confidence(input.confidenceValue ?? 0.5),
    derivedAt: nowIso(),
  };
}

export function careerIntelligenceFor(
  researcher: ResearcherRef,
  signals: readonly CareerSignal[],
): CareerIntelligence {
  return {
    researcher,
    signals: signals.filter((signal) => signal.researcher.username === researcher.username),
    generatedAt: nowIso(),
  };
}

export interface CareerStatistics {
  goals: number;
  activeGoals: number;
  plans: number;
  signals: number;
}

export function careerStatistics(
  goals: readonly CareerGoal[],
  plans: readonly CareerPlan[] = [],
  signals: readonly CareerSignal[] = [],
): CareerStatistics {
  return {
    goals: goals.length,
    activeGoals: goals.filter((goal) => goal.goalStatus === 'active').length,
    plans: plans.length,
    signals: signals.length,
  };
}
