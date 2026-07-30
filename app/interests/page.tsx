import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function InterestsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research Interests"
          subtitle="Academic fields, disciplines, and research topics of interest."
        />
      </Container>
    </PageLayout>
  );
}
