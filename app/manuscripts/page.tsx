import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import {
  ManuscriptCard,
  ManuscriptStatistics,
  ManuscriptTimeline,
  SubmissionStatusCard,
  JournalTargetCard,
  ReviewerAssignmentCard,
  RevisionHistoryCard,
  DecisionHistoryCard,
  PeerReviewSummaryCard,
  SubmissionChecklist,
  ManuscriptMetadataCard,
  AuthorContributionCard,
  ManuscriptRelationshipCard,
  PublicationReadinessCard,
} from '@/components/manuscripts';
import {
  MANUSCRIPTS,
  MANUSCRIPT_STATISTICS,
  MANUSCRIPT_TIMELINE_ENTRIES,
  RECENT_MANUSCRIPTS,
  FEATURED_MANUSCRIPT,
  FEATURED_PEER_REVIEW_SUMMARY,
} from '@/constants/placeholder-manuscripts';

export default function ManuscriptsPage() {
  const featured = FEATURED_MANUSCRIPT;

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Manuscripts"
          subtitle="Prepare, submit, and track manuscripts across the Manuscript, Submission, and Peer Review stages of the research lifecycle."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/projects">
                Projects
              </Button>
              <Button variant="outline" size="sm" href="/research">
                Research dashboard
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Manuscript statistics"
            description="An aggregate snapshot of your manuscript pipeline across stages 8–10 of the research lifecycle."
          />
          <div className="mt-8">
            <ManuscriptStatistics statistics={MANUSCRIPT_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Overview"
            title="All manuscripts"
            description="Every manuscript in the Scholatia portfolio, ordered by current status."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {MANUSCRIPTS.map((manuscript) => (
              <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={`Inside: ${featured.title}`}
            description="Submission status, reviewer assignments, decisions, revisions, metadata, relationships, and publication readiness for a single manuscript."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <SectionCard eyebrow="Status" title="Submission status" description="Current journal submission and its progress through the journal workflow.">
                <SubmissionStatusCard manuscript={featured} />
              </SectionCard>
              <SectionCard eyebrow="Targets" title="Target journals" description="Journals identified, prepared, or submitted to for this manuscript.">
                <JournalTargetCard journals={featured.targetJournals} />
              </SectionCard>
              <SectionCard eyebrow="Revisions" title="Revision history" description="Revision rounds applied in response to editorial and reviewer feedback.">
                <RevisionHistoryCard revisions={featured.revisions} />
              </SectionCard>
              <SectionCard eyebrow="Readiness" title="Publication readiness" description="Checklist and score reflecting readiness for formal publication.">
                <PublicationReadinessCard readiness={featured.readiness} />
              </SectionCard>
            </div>
            <div className="space-y-8">
              <SectionCard eyebrow="Review" title="Peer review summary" description="Aggregate review round and reviewer activity across the manuscript.">
                <PeerReviewSummaryCard summary={FEATURED_PEER_REVIEW_SUMMARY} />
              </SectionCard>
              <SectionCard eyebrow="Review" title="Reviewer assignments" description="Assigned reviewers, round participation, and review summaries.">
                <ReviewerAssignmentCard manuscript={featured} />
              </SectionCard>
              <SectionCard eyebrow="Review" title="Editorial decisions" description="Decisions recorded across every review round and submission.">
                <DecisionHistoryCard manuscript={featured} />
              </SectionCard>
              <SectionCard eyebrow="Submission" title="Submission checklist" description="Required items completed before the manuscript can be submitted.">
                <SubmissionChecklist items={featured.checklist} />
              </SectionCard>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Manuscript"
            title="Manuscript metadata"
            description="Abstract, keywords, subjects, and structural details of the featured manuscript."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Metadata" title={featured.title}>
              <ManuscriptMetadataCard manuscript={featured} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Authorship"
            title="Authors and contributions"
            description="Authors with SAID and ORCID identifiers, plus CRediT-style contribution roles."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Credits" title="Author contributions">
              <AuthorContributionCard manuscript={featured} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Related research"
            description="Research project, datasets, grants, publications, and researchers connected to the featured manuscript."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Context" title={featured.title}>
              <ManuscriptRelationshipCard manuscript={featured} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Timeline"
            title="Manuscript timeline"
            description="Key drafting, submission, review, revision, decision, and publication events across manuscripts."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Lifecycle" title="Recent manuscript activity">
              <ManuscriptTimeline entries={MANUSCRIPT_TIMELINE_ENTRIES} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recent"
            title="Recently updated"
            description="The most recently created and updated manuscripts."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {RECENT_MANUSCRIPTS.map((manuscript) => (
              <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Manuscript data is illustrative"
            description="Manuscripts, journals, submissions, reviews, decisions, revisions, metadata, and statistics shown here are placeholders. Live data will be connected to journal systems, repositories, DOIs, and your Scholatia records."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
