import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  ApprovalHistory,
  ReviewAnalytics,
  ReviewBrowser,
  ReviewDetail,
  ReviewStatistics,
} from '@/components/reviews';
import {
  APPROVAL_HISTORY,
  DEFAULT_REVIEW,
  REVIEW_ANALYTICS,
  REVIEW_STATISTICS,
} from '@/constants/placeholder-reviews';

export default function ReviewsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Review & Approval Orchestration"
          subtitle="The universal, round-agnostic review engine of SWTROP — peer review, editorial review, supervisory review, examination, ethics review, grant review, and approval all share one cycle, computed by the pure engine in lib/reviews.ts. Cycles never assume a fixed number of rounds, voice review is first-class (typed comments, voice notes, speech-to-text, optional original-audio retention, inline annotations, and voice replies), and approvals carry an append-only decision history. There is no hard-coded 'Review 1/2/3' anywhere in the engine."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/workflows">
                Workflows
              </Button>
              <Button variant="secondary" size="sm" href="/tasks">
                Tasks
              </Button>
              <Button variant="outline" size="sm" href="/workbench">
                Workbench
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Review statistics"
            description="Headline signals across the review graph — total reviews, completion rates, invitation volume, approval and revision rates, and average review rounds."
          />
          <div className="mt-8">
            <ReviewStatistics statistics={REVIEW_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Review analytics"
            description="Decision mix, round distribution, approval health, and voice review adoption — all derived by the engine."
          />
          <div className="mt-8">
            <ReviewAnalytics analytics={REVIEW_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Review centre"
            description="Active review cycles, pending approvals, and reviews assigned to you — each cycle is round-agnostic and each approval is append-only."
          />
          <div className="mt-8">
            <ReviewBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title="Inside a review"
            description="The canonical review aggregate — kind, status, decision, typed comments, inline annotations, replies, and first-class voice notes."
          />
          <div className="mt-8">
            <ReviewDetail review={DEFAULT_REVIEW} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Audit trail"
            title="Approval history"
            description="The append-only decision history of the approval engine — every action, actor, and transition, in order."
          />
          <div className="mt-8">
            <ApprovalHistory history={APPROVAL_HISTORY} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Review data is illustrative"
            description="All review cycles, reviews, comments, voice notes, approvals, and history entries are placeholder data computed by the pure engine in lib/reviews.ts. Cycles reference workflows, artefacts, and source records through IDs only. Live ingestion will connect the engine to peer-review, editorial, supervisory, ethics, and grant events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
