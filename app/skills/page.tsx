import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function SkillsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Skills"
          subtitle="Research, technical, and professional skills."
        />
      </Container>
    </PageLayout>
  );
}
