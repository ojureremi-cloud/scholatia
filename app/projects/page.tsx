import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const projects = [
  {
    name: 'Multilingual Parsing Framework',
    description: 'A cross-lingual dependency parsing framework supporting over 50 languages with transfer learning from high-resource to low-resource languages.',
    role: 'Principal Investigator',
    status: 'Active',
    period: '2022 - Present',
  },
  {
    name: 'Low-Resource Language Toolkit',
    description: 'Developing open-source tools and annotated corpora for under-represented languages to enable NLP research in low-resource settings.',
    role: 'Co-Investigator',
    status: 'Active',
    period: '2021 - Present',
  },
  {
    name: 'Syntax-Semantics Interface in Typologically Diverse Languages',
    description: 'Investigating the mapping between syntactic structures and semantic interpretations across languages with different typological profiles.',
    role: 'Researcher',
    status: 'Completed',
    period: '2018 - 2021',
  },
];

export default function ProjectsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Projects"
          subtitle="Showcase your research projects, collaborations, and funded work."
        />
        <div className="mt-12 space-y-6">
          {projects.map((project) => (
            <Card key={project.name}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{project.description}</p>
                  <p className="mt-3 text-sm text-slate-500">{project.role} • {project.period}</p>
                </div>
                <Badge variant={project.status === 'Active' ? 'success' : 'default'}>{project.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
