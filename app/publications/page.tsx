import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import { PublicationSummary, CitationChart } from '@/components/identity';
import { PublicationTypeSection, PublicationTimeline } from '@/components/research';
import {
  WORKSPACE_PUBLICATIONS,
  PUBLICATION_TIMELINE,
  CITATION_METRICS,
  CITATION_BREAKDOWN,
} from '@/constants/placeholder-research';
import { PLACEHOLDER_CITATIONS } from '@/constants/placeholder-profile';

const publicationsByType = (type: string) =>
  WORKSPACE_PUBLICATIONS.filter((publication) => publication.type === type);

const journalArticles = publicationsByType('Journal Article');
const conferencePapers = publicationsByType('Conference Paper');
const books = publicationsByType('Book');
const bookChapters = publicationsByType('Book Chapter');
const workingPapers = publicationsByType('Working Paper');
const preprints = publicationsByType('Preprint');

export default function PublicationsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Publications"
          subtitle="Track your publication history, citation impact, and research output across every format."
        />

        <section>
          <SectionTitle
            eyebrow="Impact"
            title="Citation metrics"
            description="Citation-based measures of your research impact and visibility."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-8">
              <PublicationSummary summary={CITATION_METRICS} />
            </div>
            <SectionCard
              className="lg:col-span-2"
              eyebrow="Trends"
              title="Citations per year"
              description="Placeholder citation trends by publication year."
            >
              <CitationChart data={PLACEHOLDER_CITATIONS} />
            </SectionCard>
          </div>
          <div className="mt-8">
            <SectionCard
              eyebrow="Share"
              title="Citations by type"
              description="Share of total citations attributed to each publication format."
            >
              <div className="space-y-4">
                {CITATION_BREAKDOWN.map((entry) => (
                  <div key={entry.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{entry.label}</span>
                      <span className="font-semibold text-slate-900">{entry.percentage}%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-sky-600"
                        style={{ width: `${entry.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={entry.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${entry.label} share of citations`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <PublicationTypeSection
            eyebrow="Peer reviewed"
            title="Journal articles"
            description="Articles published in peer-reviewed academic journals."
            publications={journalArticles}
          />
        </section>

        <section className="mt-16">
          <PublicationTypeSection
            eyebrow="Peer reviewed"
            title="Conference papers"
            description="Papers presented and published at academic conferences."
            publications={conferencePapers}
          />
        </section>

        <section className="mt-16">
          <PublicationTypeSection
            eyebrow="Authored"
            title="Books"
            description="Authored and edited academic books."
            publications={books}
          />
        </section>

        <section className="mt-16">
          <PublicationTypeSection
            eyebrow="Authored"
            title="Book chapters"
            description="Chapters contributed to edited academic volumes."
            publications={bookChapters}
          />
        </section>

        <section className="mt-16">
          <PublicationTypeSection
            eyebrow="In development"
            title="Working papers"
            description="Work in progress shared for early feedback and discussion."
            publications={workingPapers}
          />
        </section>

        <section className="mt-16">
          <PublicationTypeSection
            eyebrow="Early access"
            title="Preprints"
            description="Manuscripts made available online before formal peer review."
            publications={preprints}
          />
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Timeline"
            title="Publication timeline"
            description="Your publications ordered chronologically by year of release."
          />
          <div className="mt-8">
            <SectionCard eyebrow="By year" title="Chronology of outputs">
              <PublicationTimeline entries={PUBLICATION_TIMELINE} />
            </SectionCard>
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Publication data is illustrative"
            description="Publications, citation counts, and metrics shown here are placeholders. Live records will be connected to your ORCID and publication metadata."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
