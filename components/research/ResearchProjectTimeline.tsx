import { ResearchProject } from '@/types/research';
import { Timeline } from '@/components/ui/Timeline';
import SectionTitle from '@/components/ui/SectionTitle';
import { ResearchLifecycleBadge } from '@/components/ui/ResearchLifecycleBadge';

interface ResearchProjectTimelineProps {
  projects: ResearchProject[];
}

export const ResearchProjectTimeline = ({ projects }: ResearchProjectTimelineProps) => {
  // Sort projects by start date (most recent first)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Take the 4 most recent projects for the timeline
  const recentProjects = sortedProjects.slice(0, 4);

  return (
    <section className="space-y-6">
      <SectionTitle 
        eyebrow="Activity"
        title="Recent Research Activity" 
        description="Latest developments from our research community"
      />
      
      <Timeline>
        {recentProjects.map((project) => (
          <Timeline.Item 
            key={project.id} 
            date={new Date(project.startDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
            icon={<ResearchLifecycleBadge phase={project.currentPhase} className="h-8 w-8" />}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500">
                <span className="material-icons text-xs">science</span>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-slate-900">{project.title}</h3>
                <p className="text-sm text-slate-600">{project.leadName} • {project.institution}</p>
                <p className="text-xs text-slate-500">{project.currentPhase} phase</p>
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </section>
  );
};