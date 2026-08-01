import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import StatisticCard from '@/components/ui/StatisticCard';
import Alert from '@/components/ui/Alert';
import {
  JournalCard,
  JournalHeader,
  JournalStatistics,
  JournalBadge,
  EditorialBoardCard,
  SubmissionStatusCard,
  PeerReviewCard,
  ReviewerCard,
  PublicationTimeline,
  ArticleCard,
  IssueCard,
  VolumeCard,
  CallForPapersCard,
  EditorialDecisionStatistics,
  JournalImpactCard,
  PublicationQueue,
  IssueSchedule,
  JournalPolicyCard,
  OpenAccessCard,
  IndexingCard,
  JournalAnalytics,
  JournalRelationships,
  JournalWorkflowPanel,
} from '@/components/journals';
import {
  JOURNALS,
  FEATURED_JOURNAL,
  CURRENT_ISSUES,
  RECENT_ISSUES,
  JOURNAL_VOLUMES,
  ACCEPTED_ARTICLES,
  PUBLISHED_ARTICLES,
  JOURNAL_REVIEWERS,
  CALLS_FOR_PAPERS,
  JOURNAL_PORTFOLIO_STATISTICS,
  JOURNAL_PORTFOLIO_EDITORIAL_STATS,
  JOURNAL_RELATIONSHIPS,
} from '@/constants/placeholder-journals';

export default function JournalsPage() {
  const featured = FEATURED_JOURNAL;

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Journals"
          subtitle="Explore the Scholatia journal portfolio, track submissions, and manage peer review and publication workflows."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/manuscripts">
                Manuscripts
              </Button>
              <Button variant="outline" size="sm" href="/projects">
                Projects
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Journal portfolio statistics"
            description="An aggregate snapshot of the journal portfolio across the Publishing stages 8–11 of the research lifecycle."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard
              title="Journals"
              value={JOURNAL_PORTFOLIO_STATISTICS.totalJournals.toString()}
              icon="📰"
            />
            <StatisticCard
              title="Published articles"
              value={JOURNAL_PORTFOLIO_STATISTICS.publishedArticles.toString()}
              icon="✅"
            />
            <StatisticCard
              title="Open access journals"
              value={JOURNAL_PORTFOLIO_STATISTICS.openAccessJournals.toString()}
              trend="Diamond and gold OA included"
              trendPositive
              icon="🌍"
            />
            <StatisticCard
              title="Open calls for papers"
              value={JOURNAL_PORTFOLIO_STATISTICS.activeCallsForPapers.toString()}
              icon="📣"
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Editorial decisions"
            title="Portfolio editorial statistics"
            description="Submission, review, revision, acceptance, and production volumes plus decision rates across the portfolio."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Statistics" title="Editorial decision overview">
              <EditorialDecisionStatistics statistics={JOURNAL_PORTFOLIO_EDITORIAL_STATS} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={featured.journalTitle}
            description="Flagship journal profile with publishing model, metrics, editorial operations, and scholarly publishing workflow."
          />
          <div className="mt-8">
            <JournalHeader journal={featured} />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <JournalStatistics journal={featured} />
                <PublicationTimeline journal={featured} />
              </div>
              <div className="space-y-6">
                <SectionCard eyebrow="Model" title="Open access status">
                  <OpenAccessCard journal={featured} />
                </SectionCard>
                <SectionCard eyebrow="Verification" title="Review model">
                  <div className="space-y-3">
                    <JournalBadge journal={featured} />
                    <p className="text-sm leading-6 text-slate-600">
                      Verification status: {featured.verificationStatus}
                    </p>
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Portfolio"
            title="All journals"
            description="Every journal in the Scholatia portfolio with publishing model, publisher, and country of origin."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {JOURNALS.map((journal) => (
              <JournalCard key={journal.journalId} journal={journal} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Editorial board"
            title="Featured journal editors"
            description="Editorial structure of the featured journal, from editors-in-chief through associate editors."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featured.editorialStructure.map((member) => (
              <EditorialBoardCard key={`${member.role}-${member.name}`} member={member} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Editorial operations"
            title="Submission and peer review pipeline"
            description="Accepted submission types, peer review modes, and the full editorial workflow of the featured journal."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <SectionCard eyebrow="Submission" title="Submission types">
                <SubmissionStatusCard journal={featured} />
              </SectionCard>
              <SectionCard eyebrow="Review" title="Peer review modes">
                <PeerReviewCard journal={featured} />
              </SectionCard>
            </div>
            <SectionCard eyebrow="Workflow" title="Editorial workflow">
              <JournalWorkflowPanel journal={featured} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Reviewers"
            title="Reviewer assignments"
            description="Reviewers across the journal portfolio available for review assignment and editorial evaluation."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {JOURNAL_REVIEWERS.map((entry) => (
              <ReviewerCard key={`${entry.journal.journalId}-${entry.reviewer}`} name={entry.reviewer} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Current"
            title="Current issues"
            description="The latest issues across the journal portfolio, from published to in-production."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {CURRENT_ISSUES.map((entry) => (
              <IssueCard key={`${entry.journal.journalId}-${entry.issue.issueNumber}`} issue={entry.issue} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Archive"
            title="Journal volumes"
            description="Annual volumes published across the journal portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {JOURNAL_VOLUMES.map((entry) => (
              <VolumeCard
                key={`${entry.journal.journalId}-${entry.volume.volumeNumber}`}
                volume={entry.volume}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Production"
            title="Accepted and published articles"
            description="Articles accepted and in production, alongside those formally published with DOIs across the portfolio."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <SectionCard eyebrow="Accepted" title="Accepted articles">
                <div className="grid gap-4">
                  {ACCEPTED_ARTICLES.map((entry) => (
                    <ArticleCard
                      key={`${entry.journal.journalId}-${entry.article.title}`}
                      article={entry.article}
                    />
                  ))}
                </div>
              </SectionCard>
            </div>
            <div>
              <SectionCard eyebrow="Published" title="Published articles">
                <div className="grid gap-4">
                  {PUBLISHED_ARTICLES.map((entry) => (
                    <ArticleCard
                      key={`${entry.journal.journalId}-${entry.article.title}`}
                      article={entry.article}
                    />
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Submissions"
            title="Calls for papers"
            description="Open and upcoming calls for papers across the journal portfolio, including special issues."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Calls" title="Open calls for papers">
              <CallForPapersCard calls={CALLS_FOR_PAPERS.map((entry) => entry.call)} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Production"
            title="Publication queue and issue schedule"
            description="Articles in production, scheduled publication dates, and planned issue timelines for the featured journal."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <SectionCard eyebrow="Queue" title="Publication queue">
              <PublicationQueue entries={featured.publicationQueue ?? []} />
            </SectionCard>
            <SectionCard eyebrow="Schedule" title="Issue schedule">
              <IssueSchedule entries={featured.issueSchedule ?? []} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Policy"
            title="Journal policy and metrics"
            description="Publishing policies, impact metrics, indexing coverage, and analytics for the featured journal."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <SectionCard eyebrow="Policy" title="Publishing policy">
                <JournalPolicyCard journal={featured} />
              </SectionCard>
            </div>
            <div className="space-y-8">
              <SectionCard eyebrow="Impact" title="Impact metrics">
                <JournalImpactCard journal={featured} />
              </SectionCard>
              <SectionCard eyebrow="Indexing" title="Indexing coverage">
                <IndexingCard journal={featured} />
              </SectionCard>
              <SectionCard eyebrow="Analytics" title="Journal analytics">
                {featured.analytics ? (
                  <JournalAnalytics analytics={featured.analytics} />
                ) : (
                  <p className="text-sm leading-6 text-slate-500">No analytics are currently available.</p>
                )}
              </SectionCard>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Connected research"
            description="Manuscripts, datasets, projects, authors, institutions, grants, and publications connected to the journal portfolio."
          />
          <div className="mt-8">
            <JournalRelationships relationships={JOURNAL_RELATIONSHIPS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recent"
            title="Recently published issues"
            description="The most recently published issues across the journal portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {RECENT_ISSUES.map((entry) => (
              <IssueCard
                key={`${entry.journal.journalId}-${entry.issue.issueNumber}`}
                issue={entry.issue}
              />
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Journal data is illustrative"
            description="Journals, issues, volumes, articles, editorial staff, metrics, calls for papers, production queues, policies, and statistics shown here are placeholders. Live data will be connected to journal platforms, repositories, indexing services, and DOIs."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
