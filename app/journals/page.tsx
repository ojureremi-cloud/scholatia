import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function JournalsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Journals"
          subtitle="Browse scholarly journals, track submissions, and manage peer review workflows."
        />
      </Container>
    </PageLayout>
  );
}
