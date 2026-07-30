import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function ConferencesPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Conferences"
          subtitle="Explore upcoming conferences, submit papers, and connect with fellow researchers."
        />
      </Container>
    </PageLayout>
  );
}
