import type {
  ResearchCompletionCategory,
  ResearchLifecycleStage,
  ResearchLifecycleStageId,
} from '@/types/research';

/**
 * The canonical Scholatia research lifecycle.
 *
 * This is the single source of truth for every research lifecycle definition in
 * the platform. All modules (Research Workspace, Projects, Publications,
 * Journals, Conferences, Analytics, Marketplace, AI assistants, Notifications,
 * Dashboards, Workflow automation) must consume this lifecycle rather than
 * maintaining independent stage definitions.
 */
export const RESEARCH_LIFECYCLE_STAGES: readonly ResearchLifecycleStage[] = [
  {
    id: 'idea',
    name: 'Idea',
    title: 'Idea',
    description: 'Initial concept development and hypothesis formation',
    order: 1,
    icon: '💡',
    color: 'bg-indigo-500',
    completionCategory: 'ideation',
  },
  {
    id: 'concept-note',
    name: 'Concept Note',
    title: 'Concept Note',
    description: 'Structured articulation of the research problem, aims, and scope',
    order: 2,
    icon: '📝',
    color: 'bg-violet-500',
    completionCategory: 'ideation',
  },
  {
    id: 'proposal',
    name: 'Proposal',
    title: 'Proposal',
    description: 'Formal research proposal and funding application preparation',
    order: 3,
    icon: '📄',
    color: 'bg-purple-500',
    completionCategory: 'ideation',
  },
  {
    id: 'funding',
    name: 'Funding',
    title: 'Funding',
    description: 'Securing financial support and resources',
    order: 4,
    icon: '💰',
    color: 'bg-green-500',
    completionCategory: 'resourcing',
  },
  {
    id: 'project',
    name: 'Project',
    title: 'Project',
    description: 'Active research implementation and data collection',
    order: 5,
    icon: '🧪',
    color: 'bg-amber-500',
    completionCategory: 'execution',
  },
  {
    id: 'dataset',
    name: 'Dataset',
    title: 'Dataset',
    description: 'Collection, curation, and publication of research data',
    order: 6,
    icon: '📊',
    color: 'bg-teal-500',
    completionCategory: 'execution',
  },
  {
    id: 'analysis',
    name: 'Analysis',
    title: 'Analysis',
    description: 'Data processing, interpretation, and validation',
    order: 7,
    icon: '🔬',
    color: 'bg-purple-500',
    completionCategory: 'execution',
  },
  {
    id: 'manuscript',
    name: 'Manuscript',
    title: 'Manuscript',
    description: 'Preparation of the research manuscript for dissemination',
    order: 8,
    icon: '✍️',
    color: 'bg-cyan-500',
    completionCategory: 'dissemination',
  },
  {
    id: 'submission',
    name: 'Submission',
    title: 'Submission',
    description: 'Submission of the manuscript to a journal or conference',
    order: 9,
    icon: '📨',
    color: 'bg-blue-500',
    completionCategory: 'dissemination',
  },
  {
    id: 'peer-review',
    name: 'Peer Review',
    title: 'Peer Review',
    description: 'Independent expert evaluation and revision of the work',
    order: 10,
    icon: '👥',
    color: 'bg-orange-500',
    completionCategory: 'dissemination',
  },
  {
    id: 'publication',
    name: 'Publication',
    title: 'Publication',
    description: 'Formal publication of the accepted research output',
    order: 11,
    icon: '📚',
    color: 'bg-emerald-500',
    completionCategory: 'dissemination',
  },
  {
    id: 'conference',
    name: 'Conference',
    title: 'Conference',
    description: 'Presentation and dissemination at academic conferences',
    order: 12,
    icon: '🎤',
    color: 'bg-rose-500',
    completionCategory: 'dissemination',
  },
  {
    id: 'citation',
    name: 'Citation',
    title: 'Citation',
    description: 'Scholarly recognition and citation of the published work',
    order: 13,
    icon: '📖',
    color: 'bg-sky-500',
    completionCategory: 'impact',
  },
  {
    id: 'impact',
    name: 'Impact',
    title: 'Impact',
    description: 'Societal, economic, and scholarly influence of the research',
    order: 14,
    icon: '🌍',
    color: 'bg-fuchsia-500',
    completionCategory: 'impact',
  },
  {
    id: 'knowledge-transfer',
    name: 'Knowledge Transfer',
    title: 'Knowledge Transfer',
    description: 'Translation and exchange of research outcomes to wider audiences',
    order: 15,
    icon: '🤝',
    color: 'bg-slate-700',
    completionCategory: 'impact',
  },
] as const;

const STAGE_BY_ID: ReadonlyMap<ResearchLifecycleStageId, ResearchLifecycleStage> = new Map(
  RESEARCH_LIFECYCLE_STAGES.map((stage) => [stage.id, stage])
);

const TOTAL_STAGES = RESEARCH_LIFECYCLE_STAGES.length;

export const getAllStages = (): ResearchLifecycleStage[] => [...RESEARCH_LIFECYCLE_STAGES];

export const getStage = (
  stageId: ResearchLifecycleStageId
): ResearchLifecycleStage | undefined => STAGE_BY_ID.get(stageId);

export const getStageByOrder = (order: number): ResearchLifecycleStage | undefined =>
  RESEARCH_LIFECYCLE_STAGES.find((stage) => stage.order === order);

export const getNextStage = (
  stageId: ResearchLifecycleStageId
): ResearchLifecycleStage | undefined => {
  const stage = getStage(stageId);
  if (!stage) return undefined;
  return getStageByOrder(stage.order + 1);
};

export const getPreviousStage = (
  stageId: ResearchLifecycleStageId
): ResearchLifecycleStage | undefined => {
  const stage = getStage(stageId);
  if (!stage) return undefined;
  return getStageByOrder(stage.order - 1);
};

export const isFirstStage = (stageId: ResearchLifecycleStageId): boolean =>
  getStage(stageId)?.order === 1;

export const isLastStage = (stageId: ResearchLifecycleStageId): boolean =>
  getStage(stageId)?.order === TOTAL_STAGES;

export const getCompletionPercentage = (stageId: ResearchLifecycleStageId): number => {
  const stage = getStage(stageId);
  if (!stage) return 0;
  return Math.round((stage.order / TOTAL_STAGES) * 100);
};

export const isResearchComplete = (stageId: ResearchLifecycleStageId): boolean => {
  const stage = getStage(stageId);
  if (!stage) return false;
  return stage.order >= TOTAL_STAGES;
};

export const isInLifecycle = (stageId: string): stageId is ResearchLifecycleStageId =>
  STAGE_BY_ID.has(stageId as ResearchLifecycleStageId);

export const getStagesByCategory = (
  category: ResearchCompletionCategory
): ResearchLifecycleStage[] =>
  RESEARCH_LIFECYCLE_STAGES.filter((stage) => stage.completionCategory === category);

export interface StageValidationResult {
  valid: boolean;
  stage?: ResearchLifecycleStage;
  nextStage?: ResearchLifecycleStage;
  previousStage?: ResearchLifecycleStage;
  completionPercentage: number;
  researchComplete: boolean;
}

export const validateStage = (stageId: ResearchLifecycleStageId): StageValidationResult => {
  const stage = getStage(stageId);
  return {
    valid: Boolean(stage),
    stage,
    nextStage: stage ? getNextStage(stageId) : undefined,
    previousStage: stage ? getPreviousStage(stageId) : undefined,
    completionPercentage: getCompletionPercentage(stageId),
    researchComplete: isResearchComplete(stageId),
  };
};

export const ResearchLifecycleEngine = {
  getAllStages,
  getStage,
  getStageByOrder,
  getNextStage,
  getPreviousStage,
  isFirstStage,
  isLastStage,
  isInLifecycle,
  getCompletionPercentage,
  isResearchComplete,
  getStagesByCategory,
  validateStage,
} as const;

export default ResearchLifecycleEngine;
