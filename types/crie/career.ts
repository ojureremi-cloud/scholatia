/**
 * CRIE career intelligence types (fspec §2.11).
 *
 * `CareerGoal`, `CareerPlan`, and `CareerIntelligence` drive career
 * intelligence; `CareerSignal` is a derived signal (CRIE Ch. 32).
 */
import type { Auditable, ConfidenceScore, ResearcherRef, Versioned } from './base';
import type { LifecycleStageId } from './cognitive';

export type CareerGoalStatus = 'proposed' | 'active' | 'achieved' | 'paused' | 'abandoned';

/** A career goal driving career intelligence. */
export interface CareerGoal extends Auditable {
  id: string;
  researcher: ResearcherRef;
  statement: string;
  goalStatus: CareerGoalStatus;
  horizonMonths: number;
}

/** A career plan with milestones. */
export interface CareerPlan extends Auditable, Versioned {
  id: string;
  careerGoalId: string;
  milestones: CareerMilestone[];
  planStatus: 'drafting' | 'active' | 'completed';
}

export interface CareerMilestone {
  id: string;
  statement: string;
  lifecycleStageId?: LifecycleStageId;
  due: string;
  status: 'planned' | 'in-progress' | 'achieved' | 'missed';
}

export type CareerSignalKind = 'opportunity' | 'trajectory' | 'gap' | 'alignment';

/** A derived career signal. */
export interface CareerSignal {
  id: string;
  researcher: ResearcherRef;
  kind: CareerSignalKind;
  statement: string;
  confidence: ConfidenceScore;
  derivedAt: string;
}

/** Derived career signals (opportunities, trajectories). */
export interface CareerIntelligence {
  researcher: ResearcherRef;
  signals: CareerSignal[];
  generatedAt: string;
}
