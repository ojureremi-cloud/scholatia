import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function AwardsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Awards"
          subtitle="Honours, prizes, and recognitions received."
        />
      </Container>
    </PageLayout>
  );
}
