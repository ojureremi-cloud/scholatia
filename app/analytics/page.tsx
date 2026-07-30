import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function AnalyticsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Analytics"
          subtitle="Profile views, citation metrics, and research impact statistics."
        />
      </Container>
    </PageLayout>
  );
}
