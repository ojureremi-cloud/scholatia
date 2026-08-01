import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Button from '@/components/ui/Button';
import {
  AcademicIdentityCard,
  AcademicImpactCard,
  AcademicSkills,
  AwardCard,
  CitationMetricsCard,
  CollaborationNetwork,
  ConferenceCard,
  ContactCard,
  DatasetCard,
  EditorialAppointments,
  EducationCard,
  EmploymentCard,
  GrantCard,
  IdentitySummaryCard,
  InnovationCard,
  JournalCard,
  LanguageCard,
  MembershipCard,
  PatentCard,
  ProfileCompletionCard,
  ProjectCard,
  PublicationCard,
  PublicationTrendChart,
  RecentActivityCard,
  ResearchAnalyticsCard,
  ResearchInterestCard,
  ResearchMetrics,
  ResearchPortfolio,
  ResearchRelationshipCard,
  ResearchTimeline,
  ResearchVisibilityCard,
  ResearcherBiography,
  ResearcherCard,
  ResearcherHeader,
  SocialProfileCard,
  StartupCard,
  SupervisionCard,
  TeachingCard,
  VerificationCard,
} from '@/components/researchers';
import { getResearcherByUsername } from '@/lib/researchers';
import { RESEARCHERS } from '@/constants/placeholder-researchers';

type ResearcherProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ResearcherProfilePage({ params }: ResearcherProfilePageProps) {
  const { username } = await params;
  const researcher = getResearcherByUsername(RESEARCHERS, username);

  if (!researcher) {
    return (
      <PageLayout>
        <Container className="py-16 sm:py-24">
          <PageHeader
            title="Researcher not found"
            subtitle={`No researcher profile exists for "${username}".`}
            actions={
              <Button variant="secondary" size="sm" href="/researchers">
                Back to Researchers
              </Button>
            }
          />
          <Alert
            variant="danger"
            title="Unknown researcher"
            description={`The username "${username}" does not match any researcher in the Scholatia identity portfolio. Check the directory or return to the researcher homepage.`}
          />
        </Container>
      </PageLayout>
    );
  }

  const related = RESEARCHERS.filter(
    (candidate) =>
      candidate.username !== researcher.username &&
      (candidate.country === researcher.country ||
        candidate.biography.areasOfExpertise.some((area) =>
          researcher.biography.areasOfExpertise.includes(area)
        ))
  ).slice(0, 3);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title={researcher.displayName}
          subtitle={`${researcher.headline ?? researcher.position.title} • ${researcher.position.institution}. Personal academic website: ${researcher.username}.scholatia.com (route: /researchers/${researcher.username}).`}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">{researcher.verification.verificationStatus}</Badge>
              <Button variant="secondary" size="sm" href="/researchers">
                Researchers
              </Button>
            </div>
          }
        />

        <ResearcherHeader researcher={researcher} />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ResearcherBiography researcher={researcher} />
            <SectionCard eyebrow="Identity" title="Academic identity">
              <AcademicIdentityCard researcher={researcher} />
            </SectionCard>
            <SectionTitle eyebrow="Metrics" title="Research metrics" />
            <ResearchMetrics researcher={researcher} />
            <SectionCard eyebrow="Portfolio" title="Research portfolio">
              <ResearchPortfolio researcher={researcher} />
            </SectionCard>
            <div className="grid gap-6 lg:grid-cols-2">
              <CitationMetricsCard researcher={researcher} />
              <AcademicImpactCard researcher={researcher} />
            </div>
            <SectionCard eyebrow="Interests" title="Research interests and areas">
              <ResearchInterestCard researcher={researcher} />
            </SectionCard>
            <div className="grid gap-6 lg:grid-cols-2">
              <AcademicSkills researcher={researcher} />
              <LanguageCard researcher={researcher} />
            </div>
            <SectionCard eyebrow="Memberships" title="Memberships and certifications">
              <MembershipCard researcher={researcher} />
            </SectionCard>
            <div className="grid gap-6 lg:grid-cols-2">
              <EducationCard researcher={researcher} />
              <EmploymentCard researcher={researcher} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ProjectCard researcher={researcher} />
              <DatasetCard researcher={researcher} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <PublicationCard researcher={researcher} />
              <JournalCard researcher={researcher} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ConferenceCard researcher={researcher} />
              <GrantCard researcher={researcher} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <AwardCard researcher={researcher} />
              <PatentCard researcher={researcher} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <InnovationCard researcher={researcher} />
              <StartupCard researcher={researcher} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <TeachingCard researcher={researcher} />
              <SupervisionCard researcher={researcher} />
            </div>
            <SectionCard eyebrow="Editorial" title="Editorial appointments">
              <EditorialAppointments researcher={researcher} />
            </SectionCard>
            <SectionCard eyebrow="Network" title="Collaboration network">
              <CollaborationNetwork researcher={researcher} />
            </SectionCard>
            <ResearchTimeline researcher={researcher} />
            <SectionCard eyebrow="Relationships" title="Connected research">
              <ResearchRelationshipCard researcher={researcher} />
            </SectionCard>
          </div>
          <div className="space-y-6">
            <IdentitySummaryCard researcher={researcher} />
            <PublicationTrendChart researcher={researcher} />
            <SectionCard eyebrow="Visibility" title="Research visibility">
              <ResearchVisibilityCard researcher={researcher} />
            </SectionCard>
            <SectionCard eyebrow="Analytics" title="Researcher analytics">
              <ResearchAnalyticsCard researcher={researcher} />
            </SectionCard>
            <SectionCard eyebrow="Verification" title="Identity verification">
              <VerificationCard researcher={researcher} />
            </SectionCard>
            <SectionCard eyebrow="Completion" title="Profile completion">
              <ProfileCompletionCard researcher={researcher} />
            </SectionCard>
            <SectionCard eyebrow="Activity" title="Recent activity">
              <RecentActivityCard researcher={researcher} />
            </SectionCard>
            <SectionCard eyebrow="Contact" title="Contact and social profiles">
              <ContactCard researcher={researcher} />
              <div className="mt-6">
                <SocialProfileCard researcher={researcher} />
              </div>
            </SectionCard>
          </div>
        </div>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Related"
            title="Related researchers"
            description="Researchers from the same country or with overlapping areas of expertise."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {related.map((candidate) => (
              <ResearcherCard key={candidate.username} researcher={candidate} />
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Researcher data is illustrative"
            description="This profile is a placeholder populated from the Scholatia researcher portfolio. Live data will be connected to ORCID, institutional registries, Crossref, and the Scholatia identity verification system."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
