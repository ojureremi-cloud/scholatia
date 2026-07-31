import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import StatisticCard from '@/components/ui/StatisticCard';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import { PublicationSummary, PublicationCard, CitationChart } from '@/components/identity';
import {
  WorkspaceProjectCard,
  DeadlineList,
  GrantOpportunityCard,
  CollaborationRequestCard,
  ResearchPipeline,
} from '@/components/research';
import {
  WORKSPACE_PROJECTS,
  WORKSPACE_PUBLICATIONS,
  RESEARCH_DEADLINES,
  GRANT_OPPORTUNITIES,
  COLLABORATION_REQUESTS,
  RESEARCH_PIPELINE,
  CITATION_METRICS,
} from '@/constants/placeholder-research';
import { PLACEHOLDER_CITATIONS } from '@/constants/placeholder-profile';

const activeProjects = WORKSPACE_PROJECTS.filter((project) => project.status === 'active');

const recentPublications = [...WORKSPACE_PUBLICATIONS]
  .sort((a, b) => b.year.localeCompare(a.year))
  .slice(0, 3);

export default function ResearchPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research"
          subtitle="Your central research workspace — track projects, publications, funding, and collaboration in one place."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/projects">
                Projects
              </Button>
              <Button variant="outline" size="sm" href="/publications">
                Publications
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Research statistics"
            description="An at-a-glance summary of your research activity and impact."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard title="Active Projects" value={`${activeProjects.length}`} trend="+1 vs last year" trendPositive icon="🔬" />
            <StatisticCard title="Total Publications" value={`${CITATION_METRICS.totalArticles}`} trend="+3 this year" trendPositive icon="📄" />
            <StatisticCard title="Total Citations" value={CITATION_METRICS.totalCitations.toLocaleString()} trend="+18% vs last year" trendPositive icon="📊" />
            <StatisticCard title="Total Funding" value="£1.1M" trend="+12% vs last year" trendPositive icon="💰" />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Impact"
            title="Citation summary"
            description="Publication and citation metrics across your scholarly record."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <PublicationSummary summary={CITATION_METRICS} />
            <SectionCard
              className="lg:col-span-2"
              eyebrow="Trends"
              title="Citations per year"
              description="Placeholder citation trends by publication year."
            >
              <CitationChart data={PLACEHOLDER_CITATIONS} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Projects"
            title="Active projects"
            description="Research projects currently in progress."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {activeProjects.map((project) => (
              <WorkspaceProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Publications"
            title="Recent publications"
            description="Your most recently published and accepted work."
          />
          <div className="mt-8 space-y-6">
            {recentPublications.map((publication) => (
              <PublicationCard key={publication.doi} {...publication} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Pipeline"
            title="Research pipeline"
            description="Where your research currently stands across the project lifecycle."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Lifecycle" title="Current stage by project">
              <ResearchPipeline stages={RESEARCH_PIPELINE} />
            </SectionCard>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <SectionTitle
              eyebrow="Deadlines"
              title="Upcoming deadlines"
              description="Submissions, grants, and reporting due soon."
            />
            <div className="mt-8">
              <SectionCard eyebrow="Calendar" title="Next due dates">
                <DeadlineList deadlines={RESEARCH_DEADLINES} />
              </SectionCard>
            </div>
          </section>

          <section>
            <SectionTitle
              eyebrow="Funding"
              title="Grant opportunities"
              description="Open funding calls relevant to your research areas."
            />
            <div className="mt-8">
              <SectionCard eyebrow="Funding calls" title="Open opportunities">
                <GrantOpportunityCard opportunities={GRANT_OPPORTUNITIES} />
              </SectionCard>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Network"
            title="Collaboration requests"
            description="Incoming requests to collaborate on shared research interests."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Inbox" title="Pending requests">
              <CollaborationRequestCard requests={COLLABORATION_REQUESTS} />
            </SectionCard>
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Workspace data is illustrative"
            description="Projects, publications, deadlines, grants, and collaboration requests shown here are placeholders. Live data will be connected to your Scholatia profile and research records."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
