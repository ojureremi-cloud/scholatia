import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import Badge from '@/components/ui/Badge';
import { ResearchInterestTags } from '@/components/identity';
import { PLACEHOLDER_INTERESTS } from '@/constants/placeholder-profile';

export default function InterestsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research Interests"
          subtitle="Academic fields, disciplines, and research topics of interest."
        />
        <div className="mt-8 max-w-3xl">
          <ResearchInterestTags interests={PLACEHOLDER_INTERESTS.topics} />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <SectionCard eyebrow="Disciplines" title="Disciplines" description="Broad academic disciplines associated with your work.">
            <div className="flex flex-wrap gap-2">
              {PLACEHOLDER_INTERESTS.disciplines.map((discipline) => (
                <Badge key={discipline} variant="info">{discipline}</Badge>
              ))}
            </div>
          </SectionCard>
          <SectionCard eyebrow="Fields of study" title="Fields of study" description="Specialised fields of study within your disciplines.">
            <div className="flex flex-wrap gap-2">
              {PLACEHOLDER_INTERESTS.fieldsOfStudy.map((field) => (
                <Badge key={field} variant="info">{field}</Badge>
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="mt-8 max-w-3xl">
          <SectionCard eyebrow="Keywords" title="Profile keywords" description="Keywords that help other researchers find and understand your profile.">
            <div className="flex flex-wrap gap-2">
              {PLACEHOLDER_INTERESTS.keywords.map((keyword) => (
                <Badge key={keyword} variant="default">{keyword}</Badge>
              ))}
            </div>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}
