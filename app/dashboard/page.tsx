import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function DashboardPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your research activity, submissions, and network."
        />
      </Container>
    </PageLayout>
  );
}
