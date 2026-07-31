import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import Badge from '@/components/ui/Badge';
import { PLACEHOLDER_SKILL_GROUPS } from '@/constants/placeholder-profile';

export default function SkillsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Skills"
          subtitle="Research, technical, and professional skills."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {PLACEHOLDER_SKILL_GROUPS.map((group) => (
            <SectionCard key={group.category} eyebrow="Skill group" title={group.category} description={group.description}>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
