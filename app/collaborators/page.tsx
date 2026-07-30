import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function CollaboratorsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Collaborators"
          subtitle="Network of research collaborators and co-authors."
        />
      </Container>
    </PageLayout>
  );
}
