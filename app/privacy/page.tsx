import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import SectionCard from '@/components/ui/SectionCard';

const sections = [
  {
    title: 'Information we collect',
    body: 'Scholatia collects information that you provide when creating and maintaining your academic profile, including personal details, institutional affiliations, publications, projects and research activity. We also collect limited usage data to improve platform performance and security.',
  },
  {
    title: 'How we use your information',
    body: 'Your information is used to operate the Scholatia platform, verify academic identity, connect you with relevant research opportunities, and provide analytics and insights across the scholarly ecosystem. We do not sell your personal data.',
  },
  {
    title: 'Sharing of information',
    body: 'Information that you choose to make public on your profile is visible across the scholarly ecosystem. Private information is only shared in accordance with your visibility settings and applicable legal requirements.',
  },
  {
    title: 'Data security',
    body: 'Scholatia applies enterprise-grade security controls to protect your data, including encryption in transit and at rest, access controls, and continuous monitoring aligned with the Scholatia Academic Identity (SAID) trust framework.',
  },
  {
    title: 'Your rights',
    body: 'You may access, correct, or delete your personal information at any time through your account settings. You may also update your visibility and privacy preferences to control how your profile is presented.',
  },
  {
    title: 'Contact',
    body: 'For privacy-related enquiries, please contact the Scholatia support team using the contact details published on the platform.',
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Privacy Policy"
          subtitle="How Scholatia collects, uses, and protects your personal information."
          actions={<Badge>Informational</Badge>}
        />
        <div className="space-y-6">
          {sections.map((section) => (
            <SectionCard key={section.title} eyebrow="Privacy">
              <h3 className="text-xl font-semibold text-slate-900">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </SectionCard>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
