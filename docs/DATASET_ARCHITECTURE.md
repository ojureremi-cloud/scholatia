# Scholatia Dataset Architecture

## Purpose

The Dataset module implements **stage 6 (Dataset)** of the canonical Scholatia
research lifecycle. It is the mid-lifecycle output module that bridges two
already-existing modules — Research Projects (stage 5) and Analysis (stage 7).
It provides a route, a component library, a placeholder data model, and strong
TypeScript types for describing a research dataset: its versions, licenses,
contributors, citations, downloads, DOIs, related projects, related
publications, related grants, related institutions, tags, access level, and
verification status.

The module is **additive**: it reuses the existing design system, existing page
patterns, and the existing ResearchLifecycleEngine. It introduces no duplicate
lifecycle definitions, no APIs, no database, no server actions, and no external
packages.

## Relationship to the Research Lifecycle

- Datasets are always attached to the canonical stage id `dataset`
  (`ResearchLifecycleStageId = 'dataset'`, order 6), via
  `Dataset.stageId` and the exported constant `DATASET_LIFECYCLE_STAGE_ID`.
- The stage definition is sourced at runtime from the
  `ResearchLifecycleEngine` (`lib/lifecycle.ts`), never hardcoded in the module:
  - `constants/placeholder-datasets.ts` derives `DATASET_LIFECYCLE_STAGE` from
    `ResearchLifecycleEngine.getStage('dataset')`.
  - `DatasetTimeline` resolves the previous stage (`project`) and next stage
    (`analysis`) through `ResearchLifecycleEngine.getPreviousStage` /
    `getNextStage`, rendering `Project → Dataset → Analysis`.
- Lifecycle position summary:

  ```
  Research Project (5) → Dataset (6) → Analysis (7)
  ```

- Relationships are declared per dataset against the SAID ecosystem:
  Research Project, Publication, Grant, Institution, and Researcher (SAID
  identifiers).

## Entity model

Types live in `types/dataset.ts`.

| Entity | Description |
|---|---|
| `Dataset` | Aggregate root: identity, status, access, verification, DOI, creator, institution, dates, versions, licenses, citations, contributors, metadata, relationships, statistics, tags, collections. Always carries `stageId: ResearchLifecycleStageId = 'dataset'`. |
| `DatasetVersion` | A published release: version string, publication date, per-version DOI, size, file count, format, status, optional checksum and change notes. |
| `DatasetLicense` | Legal terms: name, abbreviation, URL, type (open/restricted/proprietary), commercial-use and derivative flags, attribution requirement, description. |
| `DatasetAccess` | Modeled as `DatasetAccessLevel` (`open`, `restricted`, `embargoed`, `controlled`, `private`) plus `accessNote` and `embargoEndsAt`. |
| `DatasetCitation` | A citing work: title, authors, venue, year, DOI, type, and citation count. |
| `DatasetContributor` | A credited person with role, SAID identifier, institution, and optional ORCID. |
| `DatasetMetadata` | Provenance and file details: summary, methodology, collection/temporal/geographic coverage, language, subjects, formats, size, files, sample size. |
| `DatasetRelationship` | Modeled as `DatasetRelationships`: optional project reference, grants, publications, institutions, and researcher SAIDs. |
| `DatasetStatistics` | Downloads, views, citations, version count, file count, size, storage used. |
| `DatasetStatus` | `published`, `draft`, `in-review`, `archived`, `deprecated`. |
| `DatasetVerification` | Modeled as `DatasetVerificationStatus` (`verified`, `peer-reviewed`, `in-review`, `unverified`) plus `verifiedAt`. |
| `DatasetCollection` | A named grouping of datasets with icon and count. |
| `DatasetTimelineEntry` | A timeline event (Collection, Version, Verification, Publication, Project). |
| `DatasetAnalytics` | Portfolio-level aggregates: totals, access breakdown, top tags, download trend. |

### Dataset status flow

```
draft → in-review → published → (deprecated | archived)
```

## Component map

All dataset components live in `components/datasets/` and are re-exported from
`components/datasets/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Badge`, `Button`) and existing patterns from
`components/research/*`.

| Component | Responsibility |
|---|---|
| `DatasetCard` | Compact card: access/status/verification badges, description, tags, and download/citation/version/size metrics. |
| `DatasetSummary` | Analytics panel: access-level breakdown, monthly download trend, top tags. |
| `DatasetStatistics` | `StatisticCard` grid: totals, open/restricted counts, downloads, citations, DOIs, latest version, storage. |
| `DatasetTimeline` | Lifecycle banner (`Project → Dataset → Analysis`) plus chronological dataset events. |
| `DatasetVersionHistory` | Versioned releases with dates, DOIs, size, files, and change notes. |
| `DatasetMetadataCard` | Provenance, methodology, coverage, subjects, formats, size, and file details. |
| `DatasetAccessCard` | Access level, access notes, embargo end date, institution, latest version. |
| `DatasetContributorCard` | Contributor rows with role badges, SAID identifiers, institutions, ORCIDs. |
| `DatasetCitationCard` | Recommended citation plus the works citing the dataset. |
| `DatasetDownloadCard` | Download/views/files statistics, formats, latest-version download action, per-version DOIs. |
| `DatasetLicenseCard` | License terms and reuse allowances. |
| `DatasetVerificationCard` | Verification status, description, verified date, and completed checks. |
| `DatasetCollectionCard` | Collection grid with dataset counts. |
| `DatasetRelationshipCard` | Project/grants/institutions and publications (and researcher SAIDs in the combined view). |
| `DatasetTagList` | Reusable tag chip list used by cards, metadata, and analytics. |
| `format` | Shared formatting helpers (`formatBytes`, `formatCompactNumber`, `formatDate`, `formatShortDate`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/datasets` | `app/datasets/page.tsx` | Statistics, overview (all datasets), collections, spotlight (metadata, access, licensing, verification, versions, downloads, contributors, citations), related projects, related publications, timeline, recent datasets, analytics, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern used
by `/research` → `/projects` → `/publications`.

## Dependency graph

```
Dataset module
  ├── lib/lifecycle.ts        (ResearchLifecycleEngine — stage 6, stage 5, stage 7)
  ├── types/research.ts       (ResearchLifecycleStageId)
  ├── types/dataset.ts        (dataset entity model — new)
  ├── constants/placeholder-datasets.ts  (placeholder data + derived analytics — new)
  ├── components/datasets/*   (component library — new)
  ├── components/layout/*     (PageLayout, PageHeader)
  ├── components/ui/*         (Container, Button, SectionTitle, SectionCard, Alert, StatisticCard, Timeline, Badge)
  └── app/datasets/page.tsx   (route — new)
```

The module depends only on existing infrastructure plus its own new files. It
has no dependents, so it can be removed or refactored without affecting other
modules.

## Placeholder data

`constants/placeholder-datasets.ts` provides:

- **10 datasets** spanning every status (`published`, `draft`, `in-review`,
  `archived`) and every access level (`open`, `restricted`, `embargoed`,
  `controlled`, `private`).
- Multiple versions per dataset (up to 3), each with its own DOI, size, file
  count, format, and change notes.
- Licenses (CC-BY-4.0, CC-BY-NC-4.0, CC-BY-NC-ND-4.0, CC0-1.0, consortium,
  community, and end-user agreements).
- Contributors with SAID identifiers (`SAID-0000-0000-0001` …) and ORCIDs.
- Citations, downloads, views, DOIs, and storage figures.
- Related projects, publications, grants, institutions, and researcher SAIDs
  that cross-reference the existing placeholder modules
  (`constants/placeholder-research.ts`, `constants/placeholder-profile.ts`).
- Tags, collections, a download trend, and a dataset timeline.
- Derived aggregates: `DATASET_ANALYTICS`, `RECENT_DATASETS`,
  `FEATURED_DATASET`, `DATASET_COLLECTIONS`, `DATASET_TIMELINE_ENTRIES`.

## Future extensions

- Live repository/DOI sync (Zenodo, Figshare, institutional repositories).
- Data access request workflow for restricted and controlled datasets.
- Per-dataset audit trail and change control across versions.
- Data availability statements linked into manuscript and submission stages
  (stages 8–9).
- Altmetrics and dataset-level impact analytics feeding stage 14.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/dataset.ts` are the schema seed.
- Pagination and filtering (by access, status, collection, tag) on `/datasets`.
- Dataset detail route (`/datasets/[id]`) sharing the existing component
  library.
