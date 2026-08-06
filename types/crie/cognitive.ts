/**
 * CRIE cognitive & research lifecycle types (fspec §2.1, §4.2).
 *
 * `ResearchEntity` is the root cognitive object of CRIE — a research effort
 * (project, study, thesis, paper, grant programme, patent, innovation). Its
 * living `ResearchCognitiveModel` holds questions, hypotheses, aims, concept
 * map, and a status vector. The fourteen canonical lifecycle stages are the
 * CRIE spine (CRIE Ch. 8) and are distinct from the platform-wide
 * `ResearchLifecycleStageId` consumed by other modules.
 */
import type {
  Auditable,
  ConfidenceScore,
  ResearcherRef,
  Versioned,
} from './base';
import type { EvidenceChain } from './reasoning';

/** Root cognitive object (CRIE Ch. 3). */
export interface ResearchEntity extends Auditable, Versioned {
  id: string;
  kind:
    | 'project'
    | 'study'
    | 'thesis'
    | 'paper'
    | 'grant-programme'
    | 'patent'
    | 'innovation';
  owner: ResearcherRef;
  title: string;
  model: ResearchCognitiveModel; // composition
}

export type ResearchEntityKind = ResearchEntity['kind'];

/** The living cognitive model of an entity (CRIE Ch. 3). */
export interface ResearchCognitiveModel extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  stage: LifecycleStageId;
  questions: ResearchQuestion[];
  hypotheses: Hypothesis[];
  aims: ResearchAim[];
  conceptMap: ConceptMap;
  statusVector: StatusVector;
}

/** Versioned snapshot of a cognitive model (CRIE Ch. 3). */
export interface CognitiveModelVersion extends Auditable {
  id: string;
  cognitiveModelId: string;
  version: number;
  snapshot: ResearchCognitiveModel;
}

/** The 14 canonical lifecycle stages (CRIE Ch. 8). */
export type LifecycleStageId =
  | 'idea'
  | 'problem'
  | 'objectives'
  | 'questions'
  | 'hypotheses'
  | 'literature'
  | 'framework'
  | 'methodology'
  | 'instrument'
  | 'analysis'
  | 'interpretation'
  | 'publication'
  | 'impact'
  | 'preservation';

export const LIFECYCLE_STAGE_IDS: readonly LifecycleStageId[] = [
  'idea',
  'problem',
  'objectives',
  'questions',
  'hypotheses',
  'literature',
  'framework',
  'methodology',
  'instrument',
  'analysis',
  'interpretation',
  'publication',
  'impact',
  'preservation',
];

export const CRIE_LIFECYCLE_STAGE_LABELS: Record<LifecycleStageId, string> = {
  idea: 'Idea',
  problem: 'Problem',
  objectives: 'Objectives',
  questions: 'Questions',
  hypotheses: 'Hypotheses',
  literature: 'Literature',
  framework: 'Framework',
  methodology: 'Methodology',
  instrument: 'Instrument',
  analysis: 'Analysis',
  interpretation: 'Interpretation',
  publication: 'Publication',
  impact: 'Impact',
  preservation: 'Preservation',
};

export const CRIE_LIFECYCLE_STAGE_ICONS: Record<LifecycleStageId, string> = {
  idea: '💡',
  problem: '❓',
  objectives: '🎯',
  questions: '❔',
  hypotheses: '🔬',
  literature: '📚',
  framework: '🕸️',
  methodology: '🧪',
  instrument: '🛠️',
  analysis: '📊',
  interpretation: '🧠',
  publication: '📝',
  impact: '🌍',
  preservation: '🗃️',
};

/** The researcher's position in the lifecycle, with dwell time. */
export interface StageInstance {
  lifecycleStageId: LifecycleStageId;
  startedAt: string;
  dwellMinutes?: number;
}

export type TransitionType = 'forward' | 'loop' | 'revert';

/** Recorded traversal between lifecycle stages (including loops). */
export interface StageTransition extends Auditable {
  from: LifecycleStageId;
  to: LifecycleStageId;
  transitionType: TransitionType;
}

export type ResearchQuestionStatus = 'open' | 'answered' | 'superseded';

/** A question on an entity, feeding the cognitive model. */
export interface ResearchQuestion extends Auditable {
  id: string;
  text: string;
  status: ResearchQuestionStatus;
}

export type HypothesisStatus =
  | 'proposed'
  | 'under-test'
  | 'supported'
  | 'refuted'
  | 'unresolved';

/** A candidate explanation or prediction under evaluation. */
export interface Hypothesis extends Auditable, Versioned {
  id: string;
  statement: string;
  questionId?: string;
  status: HypothesisStatus;
  evidenceChains: EvidenceChain[]; // composition
}

/** A declared aim of the research entity. */
export interface ResearchAim extends Auditable {
  id: string;
  statement: string;
  aimOrder: number;
}

/** The typed map of concepts relevant to the entity. */
export interface ConceptMap {
  id: string;
  nodes: ConceptMapNode[];
  edges: ConceptMapEdge[];
}

export interface ConceptMapNode {
  id: string;
  label: string;
  conceptId?: string;
}

export interface ConceptMapEdge {
  id: string;
  from: string; // node id
  to: string;
  relation: string;
}

/** The derived status vector of a cognitive model (CRIE Ch. 3). */
export interface StatusVector {
  stageProgress: Partial<Record<LifecycleStageId, number>>;
  confidence: ConfidenceScore;
  updatedAt: string;
}

/** A plan with goals, milestones, tasks, and dependencies (CRIE Ch. 8). */
export interface ResearchPlan extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  goals: ResearchGoal[];
  milestones: ResearchMilestone[];
  timeline: ResearchTimeline;
}

export interface ResearchGoal {
  id: string;
  statement: string;
}

export type ResearchMilestoneStatus =
  | 'planned'
  | 'in-progress'
  | 'achieved'
  | 'missed';

export interface ResearchMilestone {
  id: string;
  lifecycleStageId: LifecycleStageId;
  status: ResearchMilestoneStatus;
}

export interface ResearchTimeline {
  items: TimelineEntry[];
}

export interface TimelineEntry {
  milestoneId: string;
  estimate: string;
  actual?: string;
}
