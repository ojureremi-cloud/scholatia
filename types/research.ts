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

export interface ResearchLifecycleStage {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
  icon: string;
}