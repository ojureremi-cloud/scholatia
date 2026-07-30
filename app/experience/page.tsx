import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function ExperiencePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Experience"
          subtitle="Professional and academic employment history."
        />
      </Container>
    </PageLayout>
  );
}
