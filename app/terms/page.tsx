import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import SectionCard from '@/components/ui/SectionCard';

const sections = [
  {
    title: 'Acceptance of terms',
    body: 'By accessing or using Scholatia, you agree to be bound by these terms of service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the platform.',
  },
  {
    title: 'Account responsibilities',
    body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate and complete information when creating your Scholatia Academic Identity.',
  },
  {
    title: 'Acceptable use',
    body: 'You agree to use Scholatia for legitimate scholarly purposes and to refrain from submitting false information, misrepresenting your identity or credentials, infringing intellectual property rights, or engaging in any activity that disrupts the platform or its users.',
  },
  {
    title: 'Content ownership',
    body: 'You retain ownership of the content you contribute to your profile. By publishing content on Scholatia, you grant the platform a limited license to display and distribute that content in connection with the services provided.',
  },
  {
    title: 'Intellectual property',
    body: 'The Scholatia platform, including its design, branding, and underlying software, is the intellectual property of Scholatia. Nothing in these terms grants you a right to use Scholatia marks or proprietary technology without written permission.',
  },
  {
    title: 'Limitation of liability',
    body: 'Scholatia is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Scholatia disclaims all warranties and shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
  },
  {
    title: 'Changes to terms',
    body: 'Scholatia may update these terms from time to time. Continued use of the platform after changes are published constitutes acceptance of the revised terms.',
  },
  {
    title: 'Contact',
    body: 'For questions about these terms, please contact the Scholatia support team using the contact details published on the platform.',
  },
];

export default function TermsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Terms of Service"
          subtitle="The terms governing your use of the Scholatia platform."
          actions={<Badge>Informational</Badge>}
        />
        <div className="space-y-6">
          {sections.map((section) => (
            <SectionCard key={section.title} eyebrow="Terms">
              <h3 className="text-xl font-semibold text-slate-900">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </SectionCard>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
