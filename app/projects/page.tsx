import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import StatisticCard from '@/components/ui/StatisticCard';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import {
  WorkspaceProjectCard,
  FundingStatusList,
  ResearchTeamCard,
  ProjectTimeline,
} from '@/components/research';
import {
  WORKSPACE_PROJECTS,
  FUNDING_STATUS,
  RESEARCH_TEAM,
  PROJECT_TIMELINE,
} from '@/constants/placeholder-research';

const projectsByStatus = (status: 'active' | 'completed' | 'draft') =>
  WORKSPACE_PROJECTS.filter((project) => project.status === status);

const activeProjects = projectsByStatus('active');
const completedProjects = projectsByStatus('completed');
const draftProjects = projectsByStatus('draft');

export default function ProjectsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Projects"
          subtitle="Manage your research projects, funding, milestones, and team in one workspace."
          actions={
            <Button variant="outline" size="sm" href="/research">
              Research dashboard
            </Button>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Project statistics"
            description="A snapshot of your project portfolio and secured funding."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard title="Active Projects" value={`${activeProjects.length}`} trend="+1 vs last year" trendPositive icon="🔬" />
            <StatisticCard title="Completed Projects" value={`${completedProjects.length}`} trend="+1 this year" trendPositive icon="✅" />
            <StatisticCard title="Draft Projects" value={`${draftProjects.length}`} trend="In preparation" icon="📝" />
            <StatisticCard title="Total Funding" value="£1.1M" trend="+12% vs last year" trendPositive icon="💰" />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Funding"
            title="Funding status"
            description="Funding secured against each project and remaining requirements."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Budget" title="Secured versus requested">
              <FundingStatusList entries={FUNDING_STATUS} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Active"
            title="Active projects"
            description="Projects currently in progress or awaiting ongoing delivery."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {activeProjects.map((project) => (
              <WorkspaceProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Completed"
            title="Completed projects"
            description="Delivered projects with final milestones and reports closed out."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {completedProjects.map((project) => (
              <WorkspaceProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Draft"
            title="Draft projects"
            description="Early-stage ideas and proposals being scoped and prepared."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {draftProjects.map((project) => (
              <WorkspaceProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Timeline"
            title="Project timeline"
            description="Key milestones and outputs across your research projects."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Milestones" title="Recent project activity">
              <ProjectTimeline entries={PROJECT_TIMELINE} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Team"
            title="Research team"
            description="Collaborators, researchers, and staff contributing to your projects."
          />
          <div className="mt-8">
            <ResearchTeamCard members={RESEARCH_TEAM} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Project data is illustrative"
            description="Projects, funding, timelines, and team members shown here are placeholders. Live data will be connected to your Scholatia profile and research records."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
