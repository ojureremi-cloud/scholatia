import { PageLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import {
  ProfileHeader,
  IdentityCard,
  BiographyCard,
  ResearchInterestTags,
  SkillsCard,
  SocialLinksCard,
  AcademicLinksCard,
  EducationTimeline,
  EmploymentTimeline,
  ProfileStatistics,
  PublicationSummary,
  QrCodeCard,
  TrustBadge,
} from '@/components/identity';
import { VerificationLevel } from '@/types/identity';
import type { SAIDProfile } from '@/types/identity';

const placeholderProfile: SAIDProfile = {
  said: 'SAID-0000-0000-0000',
  displayName: 'Dr. Jane Scholar',
  accountCategory: 'Individual',
  accountType: 'Researcher',
  roles: ['Researcher', 'Reviewer'],
  verificationLevel: VerificationLevel.ORCIDLinked,
  biography: 'A dedicated researcher with over a decade of experience in computational linguistics and natural language processing. Passionate about bridging the gap between human language and machine understanding.',
  professionalSummary: 'Senior Researcher at the Institute for Computational Linguistics with expertise in multilingual NLP, syntax-semantics interface, and low-resource language processing.',
  researchInterests: ['Computational Linguistics', 'Natural Language Processing', 'Syntax-Semantics Interface', 'Low-Resource Languages', 'Multilingual NLP'],
  keywords: ['NLP', 'linguistics', 'machine learning', 'corpus linguistics'],
  disciplines: ['Computer Science', 'Linguistics'],
  fieldsOfStudy: ['Computational Linguistics', 'Artificial Intelligence'],
  education: [
    { institution: 'University of Cambridge', degree: 'PhD in Computational Linguistics', field: 'Computational Linguistics', startDate: '2010', endDate: '2013' },
    { institution: 'University of Oxford', degree: 'MSc in Linguistics', field: 'Linguistics', startDate: '2008', endDate: '2009' },
  ],
  employmentHistory: [
    { organisation: 'Institute for Computational Linguistics', role: 'Senior Researcher', startDate: '2015' },
    { organisation: 'Tech University', role: 'Research Associate', startDate: '2013', endDate: '2015' },
  ],
  institutionHistory: ['Institute for Computational Linguistics'],
  professionalMembership: ['ACL', 'LSA'],
  projects: ['Multilingual Parsing Framework', 'Low-Resource Language Toolkit'],
  awards: ['Best Paper Award ACL 2020'],
  patents: [],
  datasets: ['Multilingual Corpus v2'],
  software: [],
  books: [],
  bookChapters: [],
  conferencePapers: ['Syntax in Multilingual Contexts (ACL 2020)'],
  journalArticles: ['Neural Approaches to Syntax (JNLP 2021)'],
  preprints: [],
  technicalReports: [],
  grants: [],
  teachingExperience: [],
  courses: [],
  supervision: [],
  skills: ['Python', 'PyTorch', 'Statistical Modeling', 'Corpus Annotation', 'Multilingual NLP'],
  languages: ['English', 'French', 'German'],
  certifications: [],
  volunteerActivities: [],
  socialLinks: [
    { label: 'Twitter', href: 'https://twitter.com/jane_scholar' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/jane_scholar' },
  ],
  academicLinks: [
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=example' },
    { label: 'ResearchGate', href: 'https://researchgate.net/profile/Jane_Scholar' },
  ],
  privacy: 'Public',
  visibleTo: ['Public Profile'],
  trustMetrics: {
    trustScore: 85,
    verificationScore: 80,
    identityConfidence: 90,
    institutionConfidence: 85,
    publicationConfidence: 80,
    contributionScore: 75,
    communityReputation: 78,
    academicReputation: 82,
  },
  publicationSummary: {
    totalArticles: 24,
    totalCitations: 1560,
    hIndex: 12,
  },
  orcid: '0000-0002-1825-0097',
  country: 'United Kingdom',
  department: 'Computational Linguistics',
  institution: 'Institute for Computational Linguistics',
  isPublic: true,
};

export default function ProfilePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <ProfileHeader profile={placeholderProfile} />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <BiographyCard profile={placeholderProfile} />
            <EducationTimeline education={placeholderProfile.education} />
            <EmploymentTimeline employmentHistory={placeholderProfile.employmentHistory} />
          </div>
          <div className="space-y-8">
            <IdentityCard profile={placeholderProfile} />
            <ProfileStatistics profile={placeholderProfile} />
            <PublicationSummary summary={placeholderProfile.publicationSummary} />
            <ResearchInterestTags interests={placeholderProfile.researchInterests} />
            <SkillsCard skills={placeholderProfile.skills} />
            <SocialLinksCard links={placeholderProfile.socialLinks} />
            <AcademicLinksCard links={placeholderProfile.academicLinks} />
            <TrustBadge trustMetrics={placeholderProfile.trustMetrics} />
            <QrCodeCard profile={placeholderProfile} />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
