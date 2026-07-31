import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import StatisticCard from '@/components/ui/StatisticCard';
import { ProjectCard } from '@/components/identity';
import { PLACEHOLDER_PROJECTS } from '@/constants/placeholder-profile';

export default function ProjectsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Projects"
          subtitle="Showcase your research projects, collaborations, and funded work."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <StatisticCard title="Active Projects" value="2" />
          <StatisticCard title="Active Collaborators" value="6" />
          <StatisticCard title="Projects Completed" value="1" />
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {PLACEHOLDER_PROJECTS.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
