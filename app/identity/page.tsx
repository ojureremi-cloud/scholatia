import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import FeatureCard from '@/components/ui/FeatureCard';
import StatisticCard from '@/components/ui/StatisticCard';
import SectionTitle from '@/components/ui/SectionTitle';
import Divider from '@/components/ui/Divider';

const sections = [
  { href: '/profile', icon: '👤', title: 'Profile', description: 'View and manage your scholarly profile, biography, and professional links.' },
  { href: '/publications', icon: '📄', title: 'Publications', description: 'Track your publication history, citations, and research impact.' },
  { href: '/projects', icon: '🔬', title: 'Projects', description: 'Showcase your research projects, collaborations, and funded work.' },
  { href: '/education', icon: '🎓', title: 'Education', description: 'Academic qualifications, degrees, and certifications.' },
  { href: '/experience', icon: '💼', title: 'Experience', description: 'Professional and academic employment history.' },
  { href: '/skills', icon: '⚡', title: 'Skills', description: 'Research, technical, and professional competencies.' },
  { href: '/interests', icon: '🎯', title: 'Interests', description: 'Research fields, disciplines, and topics of interest.' },
  { href: '/awards', icon: '🏆', title: 'Awards', description: 'Honours, prizes, and recognitions received.' },
  { href: '/grants', icon: '💰', title: 'Grants', description: 'Research grants, fellowships, and funded projects.' },
  { href: '/affiliations', icon: '🏛️', title: 'Affiliations', description: 'Institutional and professional memberships.' },
  { href: '/collaborators', icon: '🤝', title: 'Collaborators', description: 'Network of research collaborators and co-authors.' },
  { href: '/orcid', icon: '🆔', title: 'ORCID', description: 'Link and manage your ORCID identifier for unique attribution.' },
  { href: '/verification', icon: '✓', title: 'Verification', description: 'Identity verification, badges, and trust signals.' },
  { href: '/analytics', icon: '📊', title: 'Analytics', description: 'Profile views, citations, and impact statistics.' },
  { href: '/settings', icon: '⚙️', title: 'Settings', description: 'Privacy, visibility, and profile preferences.' },
];

export default function IdentityPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholatia Academic Identity (SAID)"
          subtitle="Your unified scholarly identity across the global research ecosystem. Manage your profile, track your work, and build your academic reputation."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <StatisticCard title="Identity Sections" value="15" icon="📋" />
          <StatisticCard title="Linked Services" value="No limit" icon="🔗" />
          <StatisticCard title="Trust Level" value="Verifiable" icon="✓" />
        </div>

        <div className="mt-16">
          <SectionTitle
            eyebrow="About SAID"
            title="Your trusted digital identity across Scholatia"
            description="Scholatia Academic Identity (SAID) provides a unified, verifiable digital identity that accompanies you throughout your academic journey. From publications and projects to affiliations and collaborations, SAID connects every facet of your scholarly life — giving you full control over how your academic presence is presented and verified across the global research ecosystem."
          />
        </div>

        <Divider className="my-16" />

        <SectionTitle
          eyebrow="Navigate"
          title="Browse your identity sections"
          description="Access every aspect of your academic identity from one central dashboard."
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <a key={section.href} href={section.href} className="block no-underline">
              <FeatureCard
                icon={section.icon}
                title={section.title}
                description={section.description}
              />
            </a>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
