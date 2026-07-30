import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function AffiliationsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Affiliations"
          subtitle="Institutional, organisational, and professional memberships."
        />
      </Container>
    </PageLayout>
  );
}
