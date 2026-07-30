import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import FeatureCard from '@/components/ui/FeatureCard';

const sections = [
  { href: '/profile', icon: '👤', title: 'Profile', description: 'View and manage your scholarly profile, biography, and professional links.' },
  { href: '/publications', icon: '📄', title: 'Publications', description: 'Track your publication history, citations, and research impact.' },
  { href: '/projects', icon: '🔬', title: 'Projects', description: 'Showcase your research projects, collaborations, and funded work.' },
  { href: '/orcid', icon: '🆔', title: 'ORCID', description: 'Link and manage your ORCID identifier for unique attribution.' },
  { href: '/education', icon: '🎓', title: 'Education', description: 'Academic qualifications, degrees, and certifications.' },
  { href: '/experience', icon: '💼', title: 'Experience', description: 'Professional and academic employment history.' },
  { href: '/skills', icon: '⚡', title: 'Skills', description: 'Research, technical, and professional competencies.' },
  { href: '/interests', icon: '🎯', title: 'Interests', description: 'Research fields, disciplines, and topics of interest.' },
  { href: '/awards', icon: '🏆', title: 'Awards', description: 'Honours, prizes, and recognitions received.' },
  { href: '/grants', icon: '💰', title: 'Grants', description: 'Research grants, fellowships, and funded projects.' },
  { href: '/affiliations', icon: '🏛️', title: 'Affiliations', description: 'Institutional and professional memberships.' },
  { href: '/collaborators', icon: '🤝', title: 'Collaborators', description: 'Network of research collaborators and co-authors.' },
  { href: '/settings', icon: '⚙️', title: 'Settings', description: 'Privacy, visibility, and profile preferences.' },
  { href: '/verification', icon: '✓', title: 'Verification', description: 'Identity verification, badges, and trust signals.' },
  { href: '/analytics', icon: '📊', title: 'Analytics', description: 'Profile views, citations, and impact statistics.' },
];

export default function IdentityPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholatia Academic Identity (SAID)"
          subtitle="Your unified scholarly identity across the global research ecosystem. Manage your profile, track your work, and build your academic reputation."
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
