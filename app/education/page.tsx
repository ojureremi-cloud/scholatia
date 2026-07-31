import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import Badge from '@/components/ui/Badge';
import { EducationTimeline } from '@/components/identity';
import { PLACEHOLDER_EDUCATION } from '@/constants/placeholder-profile';

const certifications = [
  'Responsible Research Conduct',
  'Research Data Management',
  'Open Science Practices',
  'Teaching in Higher Education',
];

export default function EducationPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Education"
          subtitle="Academic qualifications, degrees, and certifications."
        />
        <div className="mt-8 max-w-3xl">
          <EducationTimeline education={PLACEHOLDER_EDUCATION} />
        </div>
        <div className="mt-8 max-w-3xl">
          <SectionCard eyebrow="Certifications" title="Professional certifications" description="Formal qualifications beyond academic degrees.">
            <div className="flex flex-wrap gap-2">
              {certifications.map((certification) => (
                <Badge key={certification} variant="info">{certification}</Badge>
              ))}
            </div>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}
