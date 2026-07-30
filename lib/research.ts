import { ResearchProject, ResearchStatistics, ResearchLifecycleStage } from '@/types/research';

export const calculateResearchStatistics = (projects: ResearchProject[]): ResearchStatistics => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalFunding = projects.reduce((sum, p) => sum + (p.fundingAmount || 0), 0);
  
  const durations = projects
    .filter(p => p.endDate && p.startDate)
    .map(p => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate!);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30); // months
    });
  
  const avgProjectDuration = durations.length > 0 
    ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
    : 0;

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalFunding,
    avgProjectDuration
  };
};

export const getResearchLifecycleStages = (): ResearchLifecycleStage[] => [
  {
    id: 'ideation',
    name: 'Ideation',
    description: 'Initial concept development and hypothesis formation',
    order: 1,
    color: 'bg-blue-500',
    icon: '💡'
  },
  {
    id: 'funding',
    name: 'Funding',
    description: 'Securing financial support and resources',
    order: 2,
    color: 'bg-green-500',
    icon: '💰'
  },
  {
    id: 'execution',
    name: 'Execution',
    description: 'Active research implementation and data collection',
    order: 3,
    color: 'bg-yellow-500',
    icon: '⚙️'
  },
  {
    id: 'analysis',
    name: 'Analysis',
    description: 'Data processing, interpretation, and validation',
    order: 4,
    color: 'bg-purple-500',
    icon: '🔬'
  },
  {
    id: 'dissemination',
    name: 'Dissemination',
    description: 'Publication, presentation, and knowledge sharing',
    order: 5,
    color: 'bg-red-500',
    icon: '📢'
  }
];

export const filterProjectsByStatus = (projects: ResearchProject[], status: ResearchProject['status']): ResearchProject[] => {
  return projects.filter(project => project.status === status);
};

export const sortProjectsByDate = (projects: ResearchProject[], order: 'asc' | 'desc' = 'desc'): ResearchProject[] => {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};