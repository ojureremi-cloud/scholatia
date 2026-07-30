import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';

interface ResearchProjectHeaderProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

export const ResearchProjectHeader = ({ totalProjects, activeProjects, completedProjects }: ResearchProjectHeaderProps) => {
  return (
    <PageHeader 
      title="Research Projects"
      subtitle={`Explore groundbreaking research projects from our global scholarly community (${totalProjects} total, ${activeProjects} active, ${completedProjects} completed)`}
      actions={
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" href="/research/create">
            Create Research Project
          </Button>
          <Button variant="secondary" size="sm" href="/research">
            Browse All Projects
          </Button>
        </div>
      }
    />
  );
};