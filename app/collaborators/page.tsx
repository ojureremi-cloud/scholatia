import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import StatisticCard from '@/components/ui/StatisticCard';
import { CollaboratorCard } from '@/components/identity';
import { PLACEHOLDER_COLLABORATORS } from '@/constants/placeholder-profile';

export default function CollaboratorsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Collaborators"
          subtitle="Network of research collaborators and co-authors."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <StatisticCard title="Active Collaborators" value="6" />
          <StatisticCard title="Institutions" value="4" />
          <StatisticCard title="Joint Publications" value="30" />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PLACEHOLDER_COLLABORATORS.map((collaborator) => (
            <CollaboratorCard key={collaborator.name} {...collaborator} />
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
