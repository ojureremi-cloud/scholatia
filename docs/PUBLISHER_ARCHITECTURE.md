# Scholatia Publisher Platform Architecture

## Purpose

The Publisher Platform implements the scholarly publishing layer of the
Scholatia ecosystem. It is the platform-wide layer under which journals,
conferences, and proceedings are published. The module does **not** introduce a
new lifecycle stage; instead it sits across the existing **publication stage
(stage 11)** and **conference stage (stage 12)** of the canonical
`ResearchLifecycleEngine`, reusing that engine and every existing placeholder
module for cross-module references.

The module provides a route, a component library, a placeholder data model, and
strong TypeScript types for describing the full publishing ecosystem:
publishers, publishing divisions, imprints, book series, editorial offices,
publishing policies, publishing metrics, journal and conference portfolios,
conference proceedings, books, publisher timelines, publishing relationships,
publisher analytics, publisher statistics, and publisher portfolios.

The module is **additive**: it reuses the existing design system, existing page
patterns, existing placeholder modules, and the existing
`ResearchLifecycleEngine`. It introduces no duplicate lifecycle definitions, no
APIs, no database, no server actions, no authentication changes, and no
external packages.

## Relationship to the Research Lifecycle

- The Publisher Platform is a cross-module layer, like Institutions, and does
  NOT own a lifecycle stage. It spans the stages where publishers operate:
  journals and their workflows (submission stage 10, publication stage 11) and
  conferences and their proceedings (conference stage 12).
- The stage definitions remain sourced from the `ResearchLifecycleEngine`
  (`lib/lifecycle.ts`); the publisher module never redefines the lifecycle.
- Every journal, conference, and proceedings reference is reused from the
  existing `JOURNALS` and `CONFERENCES` placeholder records. Journals published
  by Scholatia Press and the University of Hawaiʻi Press, and proceedings
  published by Scholatia Press, the University of Ghana Press, and the
  University of Hawaiʻi Press, are **derived** from those records via the
  `publisher` field — no data is duplicated.
- Cross-module relationships are declared per publisher and at the portfolio
  level against the SAID ecosystem: Projects, Datasets, Manuscripts, Journals,
  Conferences, Proceedings, Publications, Researchers (SAID identifiers),
  Institutions, and Grants (reusing `FUNDING_GRANTS`).

## Entity model

Types live in `types/publisher.ts`.

| Entity | Description |
|---|---|
| `Publisher` | Aggregate root: identity (id, name, short name, acronym, logo), type, headquarters, city, country, continent, countries served, founding year, description, mission, website, verification status, trust score, open access flag, publishing divisions, imprints, book series, editorial offices, publishing policies, publishing metrics, journal portfolio, conference portfolio, proceedings, books, timeline, cross-module relationships. |
| `PublisherType` | `commercial`, `university-press`, `learned-society`, `open-access`, `non-profit`, `institutional`. |
| `PublisherVerificationStatus` | `Verified`, `Trusted`, `Pending` — mirrors the `InstitutionVerificationStatus` vocabulary. |
| `PublishingDivision` | An operating division: id, name, type (Journals/Books/Conferences/Open Access/Education/Reference), description, optional countries, output count. |
| `Imprint` | A publishing brand: id, name, founding year, focus areas, description, countries, open access flag. |
| `BookSeries` | A named series: id, name, discipline, description, editors, volumes, active flag, open access flag. |
| `PublisherJournalRef` | A journal portfolio entry reusing journal identity: journal id, title, ISSN, discipline, open access status (`OpenAccessStatus` from `types/identity.ts`), quartile (`JournalQuartile`), impact factor, country. |
| `PublisherConferenceRef` | A conference portfolio entry: conference id, title, event type, city, country, date. |
| `ProceedingsRef` | A proceedings record: proceedings id, title, conference id/name, year, volume, paper count, ISSN, DOI prefix, publication status (`Published`/`In Production`/`Planned`). |
| `PublisherBook` | A published book: id, title, authors, series, year, pages, ISBN, type (Monograph/Edited Volume/Textbook/Reference Work/Handbook/Proceedings), open access flag. |
| `EditorialOffice` | A physical publishing office: id, city, country, continent, region, roles, staff count, focus. |
| `PublishingPolicy` | A policy: id, name, type (Open Access/Peer Review/Research Integrity/Ethics/Data Sharing/Copyright/Licensing/Plagiarism/Diversity/Transparency/Transformative Agreements), status (`Active`/`Under Review`/`Draft`), effective date, scope, description. |
| `PublishingMetrics` | Per-publisher operational numbers: journals, conferences, proceedings, book series, books, articles published, citations, downloads, open access share, acceptance rate, editorial offices, countries served, annual revenue, currency (`CurrencyCode` from `types/funding.ts`). |
| `PublisherRelationship` | Modeled as `PublisherRelationships` plus `PublisherRelationshipRef`: journals, conferences, proceedings, manuscripts, datasets, projects, publications, researchers, institutions, grants. |
| `PublisherTimelineEntry` | A milestone: date, title, detail, type (Founded/Publication/Partnership/Anniversary/Acquisition/Launch/Award). |
| `PublisherAnalytics` | Portfolio aggregates: totals by output type, editorial offices, countries and continents served, articles/citations/downloads, average trust score, open access share, publishers by type, publishers by continent, output by division. |
| `PublisherStatistics` | Statistic-card level aggregates: totals, verified/trusted/open-access publisher counts, articles/citations/downloads, average acceptance rate, average trust score. |
| `PublisherPortfolio` | Aggregate root of the module: statistics, analytics, publishers, featured publisher, relationships, categories. |

### Publisher types

```
commercial ──────────────── Elsevier, Springer Nature, Wiley, T&F, Emerald, Sage
university-press ────────── Oxford University Press, U Hawaiʻi Press, U Ghana Press
learned-society ─────────── IEEE, ACM
open-access ─────────────── Scholatia Press
```

## Component map

All publisher components live in `components/publishers/` and are re-exported
from `components/publishers/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Badge`, `Button`) and follow the same conventions
as `components/funding/*` and `components/institutions/*`.

| Component | Responsibility |
|---|---|
| `PublisherBadge` | Verification status (`Verified`/`Trusted`/`Pending`) to `Badge` variant mapping shared across cards. |
| `PublisherCard` | Compact publisher card: logo, name, verification badge, description, type, open access flag, journal count, trust score, founded year, countries served. |
| `PublisherHeader` | Full publisher header: logo, name, type, headquarters, founded year, verification badge, trust score, mission, countries served, headline metrics, website. |
| `PublisherStatistics` | `StatisticCard` grid: publishers, journals, conferences, books, editorial offices, countries served, articles published, average trust score. |
| `PublisherAnalytics` | Four-panel analytics: outcomes (average trust, open access share, articles, downloads), publishers by type, publishers by continent, output by division. |
| `PublisherMetrics` | Per-publisher metric tiles (journals, conferences, proceedings, book series, books, offices, articles, citations, downloads, open access share, acceptance rate, countries). |
| `PublishingPortfolio` | Composite view: portfolio statistics, featured publishers, and portfolio summary. |
| `PublisherDirectory` | Table of every publisher: type, headquarters, journal and conference counts, trust score, verification status. |
| `JournalPortfolio` | Grid of journal portfolio entries with quartile badge, impact factor, open access status, ISSN, country. |
| `ConferencePortfolio` | Grid of conference portfolio entries with event type and date. |
| `ProceedingsCard` | Grid of proceedings with publication status, year, paper count, ISSN, DOI prefix. |
| `BookSeriesCard` | Grid of book series with discipline, volumes, active and open access flags, editors. |
| `BookCard` | Grid of books with type, authors, year, pages, ISBN, series. |
| `EditorialOfficeCard` | Grid of editorial offices with continent, roles, staff count, region. |
| `PublishingPolicyCard` | Grid of publishing policies with type, status badge, effective date, scope. |
| `PublishingDivisionCard` | Grid of publishing divisions with type, output count, countries. |
| `ImprintCard` | Grid of imprints with founding year, focus areas, countries, open access flag. |
| `PublisherRelationshipCard` | Grid of cross-module relationship groups (journals, conferences, proceedings, manuscripts, datasets, projects, publications, researchers, institutions, grants). |
| `PublisherTimeline` | Publisher milestones rendered through the shared `Timeline` primitive. |
| `PublisherMap` | Publishers by continent distribution with counts. |
| `format` | Shared formatting helpers (`formatDate`, `formatCompactNumber`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/publishers` | `app/publishers/page.tsx` | Portfolio statistics, Scholatia Press spotlight (header, metrics, divisions, imprints, book series, journal portfolio, conference portfolio, proceedings, books, editorial offices, policies, timeline), publisher directory, journal portfolios across the portfolio, conference portfolios, proceedings, editorial offices, publishing policies, books, analytics, global publishing map, cross-module relationships, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern used
by `/research` → `/journals` → `/conferences`. Publisher detail routes
(`/publishers/[id]`) are intentionally left for a future phase; the component
library and placeholder data are already shaped for them.

## Dependency graph

```
Publisher module
  ├── lib/lifecycle.ts            (ResearchLifecycleEngine — stages 10–12 consulted)
  ├── types/identity.ts           (JournalProfile, JournalQuartile, OpenAccessStatus)
  ├── types/conference.ts         (ConferenceRecord, ConferenceProceedings)
  ├── types/funding.ts            (CurrencyCode)
  ├── types/publisher.ts          (publisher entity model — new)
  ├── constants/placeholder-publishers.ts  (placeholder data + derived aggregates — new)
  ├── constants/placeholder-research.ts    (projects, publications, research team)
  ├── constants/placeholder-datasets.ts    (datasets)
  ├── constants/placeholder-manuscripts.ts (manuscripts)
  ├── constants/placeholder-journals.ts    (journals — journal portfolio derivation)
  ├── constants/placeholder-conferences.ts (conferences — proceedings derivation)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── constants/placeholder-funding.ts     (grants)
  ├── components/publishers/*     (component library — new)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, SectionCard, Alert, StatisticCard, Timeline, Badge)
  └── app/publishers/page.tsx     (route — new)
```

The module depends only on existing infrastructure plus its own new files. Every
cross-module reference reuses existing placeholder identity (project ids, SAID
identifiers, dataset DOIs, journal ids, conference ids, grant ids) so no data is
duplicated.

## Placeholder data

`constants/placeholder-publishers.ts` provides:

- **12 publishers** spanning commercial, university press, learned society, and
  open access publishers: Scholatia Press (the featured publisher), Elsevier,
  Springer Nature, Wiley, Taylor & Francis, Emerald, Sage, IEEE, ACM, Oxford
  University Press, University of Hawaiʻi Press, and University of Ghana Press.
  Each carries a logo placeholder, headquarters, countries served, publishing
  divisions, imprints, book series, editorial offices, publishing policies,
  publishing metrics, a representative journal/conference/proceedings/books
  portfolio, a timeline, and cross-module relationships.
- **Derived journal portfolios**: the journals of Scholatia Press and the
  University of Hawaiʻi Press are derived directly from the existing `JOURNALS`
  records via the `publisher` field.
- **Derived conference and proceedings portfolios**: the conferences and
  proceedings of Scholatia Press, the University of Ghana Press, and the
  University of Hawaiʻi Press are derived from the existing `CONFERENCES`
  records via the `proceedings.publisher` field.
- Representative portfolios for the international publishers (e.g. Nature for
  Springer Nature, The Lancet and Cell for Elsevier, IEEE TPAMI for IEEE) with
  quartile, impact factor, and open access status.
- Relationship pools derived from existing placeholder identity (projects,
  datasets, manuscripts, journals, conferences, proceedings, publications,
  researchers, institutions, grants) and distributed per publisher via the same
  `sliceRotate` pattern used by the institutions, funding, and researchers
  modules.
- Derived aggregates: `PUBLISHER_PORTFOLIO_STATISTICS`,
  `PUBLISHER_PORTFOLIO_ANALYTICS`, `PUBLISHER_PORTFOLIO`, `FEATURED_PUBLISHER`,
  `PUBLISHER_RELATIONSHIPS`, `PUBLISHER_CATEGORIES`.

## Future extensions

- Publisher detail routes (`/publishers/[id]`) and per-publisher journal,
  conference, proceedings, and book landing pages sharing the existing
  component library.
- Editorial workflow tooling (submission, peer review coordination, production
  queues) tied to the existing manuscript, journal, and conference modules.
- Rights and licensing management built on the `PublishingPolicy` vocabulary.
- Crossref/ISSN registry integration replacing the representative journal
  portfolio and deriving true publication counts.
- Publisher revenue and open access transformation reporting feeding the
  research lifecycle coverage model.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/publisher.ts` are the schema seed.
