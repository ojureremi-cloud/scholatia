import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function EducationPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Education"
          subtitle="Academic qualifications, degrees, and certifications."
        />
      </Container>
    </PageLayout>
  );
}
