import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import StatisticCard from '@/components/ui/StatisticCard';
import Alert from '@/components/ui/Alert';
import {
  ConferenceCard,
  ConferenceHeader,
  ConferenceStatistics,
  ConferenceBadge,
  ConferenceTimeline,
  CommitteeCard,
  RegistrationCard,
  SubmissionCard,
  SponsorCard,
  VenueCard,
  AcceptedPaperCard,
  KeynoteSpeakerCard,
  WorkshopCard,
  TutorialCard,
  SessionChairCard,
  PresentationScheduleCard,
  ConferenceProceedingsCard,
  BestPaperCard,
  TravelGrantCard,
  VisaInformationCard,
  ConferenceAnalyticsCard,
  ConferenceRelationshipCard,
  ConferenceWorkflowPanel,
} from '@/components/conferences';
import {
  CONFERENCES,
  FEATURED_CONFERENCE,
  KEYNOTE_SPEAKERS,
  TECHNICAL_PROGRAMME_COMMITTEE,
  ORGANISING_COMMITTEE,
  PRESENTATION_SESSIONS,
  WORKSHOPS,
  TUTORIALS,
  SESSION_CHAIRS,
  CONFERENCE_VENUES,
  CONFERENCE_PROCEDDINGS,
  BEST_PAPER_AWARDS,
  TRAVEL_GRANTS,
  CONFERENCE_PORTFOLIO_STATISTICS,
  CONFERENCE_PORTFOLIO_ANALYTICS,
  CONFERENCE_RELATIONSHIPS,
} from '@/constants/placeholder-conferences';

export default function ConferencesPage() {
  const featured = FEATURED_CONFERENCE;
  const featuredSessions = PRESENTATION_SESSIONS.filter(
    (entry) => entry.conference.conferenceId === featured.conferenceId
  );

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Conferences"
          subtitle="Explore the Scholatia conference portfolio across the Conference stage of the research lifecycle, from submissions and keynotes to proceedings and awards."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/manuscripts">
                Manuscripts
              </Button>
              <Button variant="outline" size="sm" href="/journals">
                Journals
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Conference portfolio statistics"
            description="An aggregate snapshot of the conference portfolio at stage 12 of the research lifecycle."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard
              title="Conferences"
              value={CONFERENCE_PORTFOLIO_STATISTICS.totalConferences.toString()}
              icon="🗓️"
            />
            <StatisticCard
              title="Upcoming"
              value={CONFERENCE_PORTFOLIO_STATISTICS.upcomingConferences.toString()}
              trend="Active and planned events"
              trendPositive
              icon="📌"
            />
            <StatisticCard
              title="Total submissions"
              value={CONFERENCE_PORTFOLIO_STATISTICS.totalSubmissions.toLocaleString('en-US')}
              icon="📨"
            />
            <StatisticCard
              title="Acceptance rate"
              value={`${CONFERENCE_PORTFOLIO_STATISTICS.acceptanceRate}%`}
              icon="🎯"
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={featured.title}
            description="Flagship conference profile with theme, committees, submissions, registration, venue, and the full dissemination ecosystem."
          />
          <div className="mt-8">
            <ConferenceHeader conference={featured} />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <ConferenceStatistics conference={featured} />
                <SectionCard eyebrow="Submission" title="Submission types">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.submissions.map((option) => (
                      <SubmissionCard key={option.type} option={option} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Registration" title="Registration options">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.registrations.map((option) => (
                      <RegistrationCard key={option.audience} option={option} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Programme" title="Conference tracks">
                  <div className="grid gap-4 md:grid-cols-2">
                    {featured.tracks.map((track) => (
                      <div key={track.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{track.name}</p>
                        {track.description ? (
                          <p className="mt-1 text-sm leading-6 text-slate-600">{track.description}</p>
                        ) : null}
                        {track.paperCount !== undefined ? (
                          <p className="mt-1 text-xs text-slate-500">{track.paperCount} papers</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
              <div className="space-y-6">
                <ConferenceTimeline conference={featured} />
                <SectionCard eyebrow="Status" title="Conference status">
                  <div className="space-y-3">
                    <ConferenceBadge conference={featured} />
                    <p className="text-sm leading-6 text-slate-600">
                      Verification status: {featured.verificationStatus}
                    </p>
                    <p className="text-sm leading-6 text-slate-600">
                      Trust score: {featured.trustScore}/100
                    </p>
                    <p className="text-sm leading-6 text-slate-600">
                      Submission status: {featured.submissionStatus}
                    </p>
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Venue" title="Conference venue">
                  <VenueCard conference={featured} />
                </SectionCard>
                <SectionCard eyebrow="Sponsors" title="Sponsors">
                  <div className="flex flex-wrap gap-2">
                    {featured.sponsors.map((name) => (
                      <SponsorCard key={name} name={name} />
                    ))}
                  </div>
                </SectionCard>
                {featured.visa ? (
                  <SectionCard eyebrow="Travel" title="Visa information">
                    <VisaInformationCard visa={featured.visa} />
                  </SectionCard>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Workflow"
            title="Submission and programme workflow"
            description="Submission deadlines, camera-ready deadlines, and the session programme of the featured conference."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Workflow" title="Conference workflow">
              <ConferenceWorkflowPanel conference={featured} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Portfolio"
            title="All conferences"
            description="Every conference in the Scholatia portfolio with theme, location, and dates."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {CONFERENCES.map((conference) => (
              <ConferenceCard key={conference.conferenceId} conference={conference} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Committees"
            title="Technical programme and organising committees"
            description="Programme chairs, scientific and review committees, local organising teams, and volunteers across the portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {TECHNICAL_PROGRAMME_COMMITTEE.map((entry) => (
              <CommitteeCard
                key={`${entry.conference.conferenceId}-${entry.member.role}-${entry.member.name}`}
                member={entry.member}
              />
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {ORGANISING_COMMITTEE.map((entry) => (
              <CommitteeCard
                key={`${entry.conference.conferenceId}-${entry.member.role}-${entry.member.name}`}
                member={entry.member}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Programme"
            title="Presentation schedule"
            description="Sessions from the featured conference with dates, rooms, chairs, and the papers presented in each."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {featuredSessions.map((entry) => (
              <PresentationScheduleCard
                key={entry.session.id}
                session={entry.session}
                papers={featured.acceptedPapers}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Papers"
            title="Accepted papers"
            description="Papers accepted at the featured conference, from acceptance through production."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {featured.acceptedPapers.map((paper) => (
              <AcceptedPaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Keynotes"
            title="Keynote speakers"
            description="Keynote talks across the conference portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {KEYNOTE_SPEAKERS.map((entry) => (
              <KeynoteSpeakerCard key={`${entry.conference.conferenceId}-${entry.speaker.id}`} speaker={entry.speaker} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Workshops"
            title="Workshops and doctoral consortia"
            description="Satellite events, workshops, and doctoral consortia attached to the conference portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {WORKSHOPS.map((entry) => (
              <WorkshopCard key={`${entry.conference.conferenceId}-${entry.workshop.id}`} workshop={entry.workshop} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Tutorials"
            title="Tutorials"
            description="Hands-on tutorials and lectures offered across the conference portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {TUTORIALS.map((entry) => (
              <TutorialCard key={`${entry.conference.conferenceId}-${entry.tutorial.id}`} tutorial={entry.tutorial} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Sessions"
            title="Session chairs"
            description="Researchers chairing sessions across the conference portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {SESSION_CHAIRS.map((entry) => (
              <SessionChairCard key={`${entry.conference.conferenceId}-${entry.chair.id}`} chair={entry.chair} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Venues"
            title="Conference venues"
            description="Venues, cities, and host countries across the conference portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {CONFERENCE_VENUES.map((entry) => (
              <VenueCard key={entry.conference.conferenceId} conference={entry.conference} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Proceedings"
            title="Conference proceedings"
            description="Published and planned proceedings volumes with publishers, DOIs, and indexing coverage."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {CONFERENCE_PROCEDDINGS.map((entry) => (
              <ConferenceProceedingsCard
                key={`${entry.conference.conferenceId}-${entry.proceedings.id}`}
                proceedings={entry.proceedings}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Awards"
            title="Best paper awards"
            description="Best paper, best student paper, best dataset, and honourable mention awards across the portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {BEST_PAPER_AWARDS.map((entry) => (
              <BestPaperCard key={`${entry.conference.conferenceId}-${entry.award.id}`} award={entry.award} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Travel"
            title="Travel grants"
            description="Travel and participation grants available across the conference portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {TRAVEL_GRANTS.map((entry) => (
              <TravelGrantCard key={`${entry.conference.conferenceId}-${entry.grant.id}`} grant={entry.grant} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Portfolio analytics"
            description="Aggregate submissions, acceptance, attendance, and programming metrics across the conference portfolio."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Analytics" title="Conference portfolio analytics">
              <ConferenceAnalyticsCard analytics={CONFERENCE_PORTFOLIO_ANALYTICS} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Connected research"
            description="Projects, datasets, manuscripts, publications, researchers, institutions, and funding connected to the conference portfolio."
          />
          <div className="mt-8">
            <ConferenceRelationshipCard relationships={CONFERENCE_RELATIONSHIPS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Conference data is illustrative"
            description="Conferences, tracks, papers, sessions, keynotes, workshops, tutorials, proceedings, awards, travel grants, visa guidance, and statistics shown here are placeholders. Live data will be connected to conference platforms, submission systems, repositories, and DOI registration."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
