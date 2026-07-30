import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { PublicationSummary } from '@/components/identity';

const placeholderSummary = {
  totalArticles: 24,
  totalCitations: 1560,
  hIndex: 12,
};

const articles = [
  {
    title: 'Neural Approaches to Syntax in Multilingual Contexts',
    journal: 'Journal of Natural Language Processing',
    year: '2023',
    authors: ['J. Scholar', 'A. Mentor', 'B. Collaborator'],
    citations: 45,
  },
  {
    title: 'Low-Resource Language Parsing with Cross-Lingual Transfer',
    journal: 'Computational Linguistics Journal',
    year: '2022',
    authors: ['J. Scholar', 'C. Researcher'],
    citations: 120,
  },
  {
    title: 'A Corpus Study of Syntactic Variation in Under-Resourced Languages',
    journal: 'Language Resources and Evaluation',
    year: '2021',
    authors: ['J. Scholar', 'D. Linguist'],
    citations: 89,
  },
];

export default function PublicationsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Publications"
          subtitle="Track your publication history, citations, and research impact."
        />
        <div className="mt-8">
          <PublicationSummary summary={placeholderSummary} />
        </div>
        <div className="mt-12 space-y-6">
          {articles.map((article) => (
            <Card key={article.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{article.journal}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{article.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{article.authors.join(', ')} • {article.year}</p>
              <p className="mt-1 text-sm text-slate-500">Citations: {article.citations}</p>
            </Card>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
