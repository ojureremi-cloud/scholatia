import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function VerificationPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Verification"
          subtitle="Manage identity verification, badges, and trust signals."
        />
      </Container>
    </PageLayout>
  );
}
