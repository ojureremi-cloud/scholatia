import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function GrantsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Grants"
          subtitle="Research grants, fellowships, and funded projects."
        />
      </Container>
    </PageLayout>
  );
}
