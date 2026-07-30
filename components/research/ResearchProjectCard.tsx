import { ProjectStatusBadge } from '@/components/ui/ProjectStatusBadge';
import { ProjectCategoryTag } from '@/components/ui/ProjectCategoryTag';
import { Link } from '@/components/ui/Link';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { ResearchProject } from '@/types/research';

interface ResearchProjectCardProps {
  project: ResearchProject;
}

export const ResearchProjectCard = ({ project }: ResearchProjectCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar 
            name={project.leadName}
            imageUrl={project.leadImage} 
            className="h-10 w-10"
          />
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 hover:underline">
              <Link href={`/research/${project.id}`}>{project.title}</Link>
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <ProjectCategoryTag category={project.category} />
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {project.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-sm text-slate-500">
                <span className="flex items-center">
                  <span className="material-icons text-xs mr-1">person</span>
                  {project.leadName}
                </span>
                <span className="flex items-center">
                  <span className="material-icons text-xs mr-1">calendar_today</span>
                  {new Date(project.startDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <Button variant="outline" size="sm" href={`/research/${project.id}`}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};