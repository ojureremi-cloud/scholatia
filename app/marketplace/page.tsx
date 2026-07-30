import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function MarketplacePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Marketplace"
          subtitle="Discover scholarly services, funding opportunities, and research tools."
        />
      </Container>
    </PageLayout>
  );
}
