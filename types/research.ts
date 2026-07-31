export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  principalInvestigator: string;
  institution: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'planned' | 'on-hold';
  fundingAmount?: number;
  fundingSource?: string;
  keywords: string[];
  publications: number;
  collaborators: number;
  category: string;
  leadImage: string;
  leadName: string;
  currentPhase: string;
}

export interface ResearchStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalFunding: number;
  avgProjectDuration: number; // in months
}

/**
 * Canonical research lifecycle stage identifiers.
 * These are the platform-wide standard stage IDs that every module consumes.
 */
export type ResearchLifecycleStageId =
  | 'idea'
  | 'concept-note'
  | 'proposal'
  | 'funding'
  | 'project'
  | 'dataset'
  | 'analysis'
  | 'manuscript'
  | 'submission'
  | 'peer-review'
  | 'publication'
  | 'conference'
  | 'citation'
  | 'impact'
  | 'knowledge-transfer';

/**
 * Coarse grouping of lifecycle stages for reporting and aggregation.
 */
export type ResearchCompletionCategory =
  | 'ideation'
  | 'resourcing'
  | 'execution'
  | 'dissemination'
  | 'impact';

export interface ResearchLifecycleStage {
  id: ResearchLifecycleStageId;
  /** Backward-compatible alias for {@link title}. */
  name: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  color: string;
  completionCategory: ResearchCompletionCategory;
}