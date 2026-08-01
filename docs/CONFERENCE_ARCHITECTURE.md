# Scholatia Conference Ecosystem Architecture

## Purpose

The Conference module implements **stage 12 (Conference)** of the canonical
Scholatia research lifecycle as a full dissemination ecosystem. It provides a
route (`/conferences`), a component library (`components/conferences/`), a
placeholder data model (`constants/placeholder-conferences.ts`), and strong
TypeScript types (`types/conference.ts`) for describing a scholarly conference
across its entire lifecycle: profile and identity, committee, tracks, accepted
papers, presentation schedule, keynote speakers, workshops, tutorials, session
chairs, registration, sponsors, venue, proceedings, best paper awards, travel
grants, visa information, analytics, and relationships to the wider SAID
ecosystem.

The module is **additive**: it layers stage-12 sub-models on top of the
existing `ConferenceProfile` domain object (`types/identity.ts`,
`lib/conferences.ts`) without creating a new conference model, reuses every
existing conference component and hook, and introduces no duplicate lifecycle
definitions, no APIs, no database, no server actions, and no external packages.

## Relationship to the Research Lifecycle

- Conferences sit at **stage 12 of 15** in the canonical research lifecycle,
  between **Publication (11)** and **Citation (13)**, sourced from
  `RESEARCH_LIFECYCLE_STAGES` in `lib/lifecycle.ts`.
- `CONFERENCE_LIFECYCLE_STAGE_ID = 'conference'` (`types/conference.ts`) is the
  canonical stage id, and `constants/placeholder-conferences.ts` derives the
  stage object plus the previous/next stages from the
  `ResearchLifecycleEngine`:

  ```
  Publication (11) → Conference (12) → Citation (13)
  ```

- `ConferenceTimeline` renders the previous/current/next lifecycle stages by
  calling `ResearchLifecycleEngine.getStage` /
  `getPreviousStage` / `getNextStage` at render time — lifecycle logic is never
  hardcoded in the conference module.
- Relationships are declared against the SAID ecosystem: projects, datasets,
  manuscripts, journal publications, researchers (SAID identifiers),
  institutions, and funding — the same relationship pattern established by the
  Manuscript, Dataset, and Journal modules, surfaced on `/conferences` through
  `ConferenceRelationshipCard`.

## Entity model

Stage-12 sub-models live in `types/conference.ts`; the conference aggregate
itself stays the existing `ConferenceProfile`.

| Entity | Description |
|---|---|
| `ConferenceRecord` | A `ConferenceProfile` enriched with the stage-12 ecosystem: tracks, accepted papers, sessions, keynote speakers, workshops, tutorials, session chairs, proceedings, best paper awards, travel grants, visa information, analytics, and submission/camera-ready deadlines. |
| `ConferenceTrack` | A named track with description, chairs, and paper count. |
| `ConferenceAcceptedPaper` | Accepted paper with submission type, track, status (`Accepted \| In Production \| Published`), session slot, room, page range, DOI, proceedings, and optional best-paper award link. |
| `ConferenceSession` | Programme session with type (`Keynote \| Oral \| Poster \| Panel \| Demo \| Workshop \| Tutorial`), date, time window, room, mode, chairs, and referenced paper ids. |
| `ConferenceKeynoteSpeaker` | Keynote name, affiliation, talk title, and abstract. |
| `ConferenceWorkshop` | Workshop, doctoral consortium, or symposium with organisers, date, format, theme, topics, submission deadline, and paper count. |
| `ConferenceTutorial` | Tutorial with instructors, date, level, format, prerequisites, and capacity. |
| `SessionChair` | Chair name, affiliation, track, and session. |
| `ConferenceProceedings` | Published/in-production/planned proceedings volume: publisher, ISSN/eISSN, DOI prefix, volume, year, paper count, editors, indexing coverage. |
| `BestPaperAward` | Award category, title, authors, paper link, and prize. |
| `TravelGrant` | Grant name, amount, region, eligibility, deadline, status, and funding partner. |
| `VisaInformation` | Country, invitation-letter availability, processing time, requirements, and support contact. |
| `ConferenceAnalytics` | Submissions, acceptance, attendance, countries, keynotes, papers, workshops, tutorials, demos, sponsors, travel grants, awards, and optional participant satisfaction. |
| `ConferenceRelationshipRef` | A single connected entity: id, title, optional detail. |
| `ConferenceRelationships` | Grouped relationships: `projects`, `datasets`, `manuscripts`, `publications`, `researchers`, `institutions`, `funding`. |
| `ConferencePortfolioStatistics` | Portfolio aggregates: conference counts, submissions, acceptance rate, attendees, keynotes, workshops, tutorials, sponsors, countries, and average trust score. |

### Conference workflow flow

A paper moves from submission through acceptance, presentation, and into the
proceedings; the programme is organised into dated sessions per track:

```
Call for papers → Submission → Peer review → Acceptance
  → Camera ready → Sessions / presentation → Best paper awards
  → Proceedings (DOI) → Citation (stage 13)
```

## Conference integration

The module **extends and reuses the existing conferences domain rather than
re-modeling it**:

- `createConferenceProfile` (`lib/conferences.ts`) remains the single factory
  for the conference aggregate; `makeConference` in
  `constants/placeholder-conferences.ts` layers the stage-12 sub-models on top
  and derives default `ConferenceAnalytics` from the supplied records.
- `hooks/useConferenceSchedule.ts` (new) surfaces sessions, papers, and
  session lookup helpers for a `ConferenceRecord`, feeding the new
  `ConferenceWorkflowPanel` client component — the same hook-driven pattern
  established by the manuscript and journal modules.
- Committees, registrations, submissions, sponsors, venues, and the conference
  header reuse the existing `CommitteeCard`, `RegistrationCard`,
  `SubmissionCard`, `SponsorCard`, `VenueCard`, `ConferenceHeader`,
  `ConferenceStatistics`, `ConferenceBadge`, and `ConferenceCard` components
  against `ConferenceProfile` data.

## Component map

All conference components live in `components/conferences/` and are re-exported
from `components/conferences/index.ts` and `features/conferences/index.ts`.
They consume existing UI primitives (`PageLayout`, `PageHeader`, `SectionCard`,
`SectionTitle`, `StatisticCard`, `Alert`, `Badge`, `Button`).

### Reused (existing)

| Component | Responsibility |
|---|---|
| `ConferenceCard` | Compact portfolio card: event type, title, location. |
| `ConferenceHeader` | Featured-conference hero: code, title, description, actions. |
| `ConferenceStatistics` | Registration, submission, and trust-score counts. |
| `ConferenceBadge` | Registration-status pill. |
| `CommitteeCard` | A single committee member (role, name, affiliation). |
| `RegistrationCard` | A single registration option (audience, fee, status). |
| `SubmissionCard` | A single submission type (type, required, deadline). |
| `SpeakerCard` | A single speaker name. |
| `SponsorCard` | A single sponsor name. |
| `VenueCard` | Venue, city, and country. |
| `ScheduleCard` | A single schedule item. |

### Added (new)

| Component | Responsibility |
|---|---|
| `ConferenceTimeline` | Event dates plus the previous/current/next research lifecycle stages derived from `ResearchLifecycleEngine`. |
| `AcceptedPaperCard` | Accepted paper title, authors, submission type, track, status badge, award, and DOI. |
| `ConferenceProceedingsCard` | Proceedings volume with publisher, ISSN/eISSN, DOI prefix, editors, publication status, and indexing tags. |
| `BestPaperCard` | Best paper award category badge, title, authors, and prize. |
| `WorkshopCard` | Workshop/consortium details with format badge, organisers, topics, deadline, and paper count. |
| `TutorialCard` | Tutorial details with level badge, instructors, format, prerequisites, and capacity. |
| `ConferenceAnalyticsCard` | Submission/acceptance/attendance/programme metric tiles and optional participant satisfaction. |
| `ConferenceRelationshipCard` | Grouped relationship cards for projects, datasets, manuscripts, publications, researchers, institutions, and funding. |
| `PresentationScheduleCard` | A dated session with type badge, time, room, mode, chairs, and its accepted papers. |
| `SessionChairCard` | Chair name, affiliation, track, and session. |
| `TravelGrantCard` | Grant amount, region, eligibility, deadline, status badge, and funding partner. |
| `VisaInformationCard` | Country, invitation-letter availability, processing time, requirements, and support contact. |
| `ConferenceWorkflowPanel` | Client component using `useConferenceSchedule` to render submission/camera-ready deadlines and the dated session programme. |
| `KeynoteSpeakerCard` | Keynote badge, speaker, affiliation, talk title, and abstract. |

## Route map

| Route | Page | Section |
|---|---|---|
| `/conferences` | `app/conferences/page.tsx` | Portfolio statistics, featured conference (header, statistics, submission types, registration options, tracks, timeline, status, venue, sponsors, visa information), submission and programme workflow, all conferences, technical programme and organising committees, presentation schedule, accepted papers, keynote speakers, workshops, tutorials, session chairs, venues, proceedings, best paper awards, travel grants, portfolio analytics, connected research relationships, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern
used by `/research` → `/projects` → `/datasets` → `/manuscripts` → `/journals`.

## Dependency graph

```
Conference module
  ├── lib/conferences.ts          (createConferenceProfile — reused)
  ├── lib/lifecycle.ts            (ResearchLifecycleEngine — stage 12 source)
  ├── hooks/useConferenceSchedule.ts  (per-conference sessions and papers — new)
  ├── types/conference.ts         (ConferenceRecord + stage-12 sub-model types — new)
  ├── types/identity.ts           (ConferenceProfile — reused, unchanged)
  ├── constants/placeholder-conferences.ts  (placeholder portfolio + derived exports — new)
  ├── constants/placeholder-manuscripts.ts  (manuscript + author + grant sources)
  ├── constants/placeholder-datasets.ts     (dataset + contributor sources)
  ├── constants/placeholder-research.ts     (project + publication sources)
  ├── components/conferences/*    (11 reused components + 14 new)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, SectionCard, StatisticCard, Alert, Badge)
  └── app/conferences/page.tsx    (route — expanded)
```

The module depends only on existing infrastructure plus its own new files. It
has no dependents, so it can be removed or refactored without affecting other
modules.

## Placeholder data

`constants/placeholder-conferences.ts` provides:

- **10 conference records** (SIRI 2026, SCHOLING 2026, HAIR 2026, CLIM 2026,
  RIOS 2026, EDUT 2026, DEG 2026, SLD 2026, SES 2026, SDC 2026) built from
  `createConferenceProfile` via `makeConference`, spanning international
  conferences, a regional conference, a symposium, a workshop, and a virtual
  doctoral consortium across 10 host countries.
- Full `ConferenceProfile` data per conference: committees (including
  technical programme and organising roles), registration types, submission
  types, sponsors, partners, venues, countries, cities, timezones, verification
  status, and trust scores.
- Stage-12 sub-models per conference: tracks, accepted papers, sessions,
  keynote speakers, workshops, tutorials, session chairs, proceedings, best
  paper awards, travel grants, visa information, and analytics, plus
  submission and camera-ready deadlines.
- Derived exports for the page and future reuse: `CONFERENCES`,
  `FEATURED_CONFERENCE`, `RECENT_CONFERENCES`, `UPCOMING_CONFERENCES`,
  `KEYNOTE_SPEAKERS`, `COMMITTEE_MEMBERS`, `TECHNICAL_PROGRAMME_COMMITTEE`,
  `ORGANISING_COMMITTEE`, `ACCEPTED_PAPERS`, `PRESENTATION_SESSIONS`,
  `CONFERENCE_TRACKS`, `WORKSHOPS`, `TUTORIALS`, `SESSION_CHAIRS`,
  `REGISTRATION_OPTIONS`, `CONFERENCE_SPONSORS`, `CONFERENCE_VENUES`,
  `CONFERENCE_PROCEDDINGS`, `BEST_PAPER_AWARDS`, `TRAVEL_GRANTS`,
  `CONFERENCE_PORTFOLIO_STATISTICS`, `CONFERENCE_PORTFOLIO_ANALYTICS`, and
  `CONFERENCE_RELATIONSHIPS`.
- `CONFERENCE_RELATIONSHIPS` cross-references the existing placeholder
  modules: workspace projects, datasets, manuscripts, journal publications,
  manuscript authors and dataset contributors (with SAID identifiers),
  institutions, and grants.
- `CONFERENCE_LIFECYCLE_STAGE`, `CONFERENCE_PREVIOUS_STAGE`, and
  `CONFERENCE_NEXT_STAGE` are derived from `ResearchLifecycleEngine`, never
  hardcoded.

## Future extensions

- Live integration with conference submission platforms, programme committees,
  and paper review tooling.
- DOI minting for conference papers and proceedings via the proceedings
  `doiPrefix` and Crossref registration.
- Per-conference detail route (`/conferences/[id]`) sharing the existing
  component library.
- Paper-level routes (`/conferences/[id]/papers/[...slug]`) for accepted paper
  cards and presentation details.
- Registration and ticketing flows (fee payment, capacity management,
  invitation letters) building on `RegistrationCard`.
- Citation signals flowing from stage 13 into conference analytics.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands — see the "Future database tables" section in `docs/architecture.md`;
  the types in `types/conference.ts` are the schema seed, and the stage-12
  fields remain owned by the conference domain rather than being duplicated
  elsewhere.
- Pagination and filtering (by event type, country, trust score, date range)
  on `/conferences`.
