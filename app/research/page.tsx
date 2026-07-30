import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function ResearchPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research"
          subtitle="Discover research projects, publications, and collaborations across the scholarly community."
        />
      </Container>
    </PageLayout>
  );
}
