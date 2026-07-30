import { useMemo, useState } from 'react';
import type { ResearchProject } from '@/types/research';
import { ResearchProjectCard } from './ResearchProjectCard';
import { ResearchProjectHeader } from './ResearchProjectHeader';
import { ResearchProjectStatistics } from './ResearchProjectStatistics';
import { ResearchProjectTimeline } from './ResearchProjectTimeline';
import { ResearchLifecycleCard } from './ResearchLifecycleCard';
import SectionTitle from '@/components/ui/SectionTitle';
import Pagination from '@/components/ui/Pagination';

export const ResearchDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const researchProjects = useMemo(() => {
    const allProjects: ResearchProject[] = [];
    return allProjects.filter(project => 
      project.category === 'research'
    );
  }, []);

  const totalPages = Math.ceil(researchProjects.length / projectsPerPage) || 1;
  const currentProjects = researchProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse">Loading research projects...</div>
      </div>
    );
  }

  return (
    <section className="space-y-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ResearchProjectHeader 
          totalProjects={researchProjects.length}
          activeProjects={researchProjects.filter(p => p.status === 'active').length}
          completedProjects={researchProjects.filter(p => p.status === 'completed').length}
        />
        
        <ResearchProjectStatistics projects={researchProjects} />
        
        <div className="space-y-8">
          <SectionTitle 
            eyebrow="Research Projects"
            title="Explore groundbreaking research projects from our global community"
          />
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentProjects.map(project => (
              <ResearchProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage}
              />
            </div>
          )}
          
          <SectionTitle 
            eyebrow="Research Lifecycle"
            title="Understanding the stages of academic research"
          />
          
          <ResearchLifecycleCard />
          
          <SectionTitle 
            eyebrow="Research Timeline"
            title="Recent milestones in academic research"
          />
          
          <ResearchProjectTimeline projects={researchProjects.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
};