# SCHOLATIA CORE PLATFORM MANIFEST

**Version 1.0**

**The Constitutional Architecture of Scholatia**

> This document is the definitive architectural constitution of Scholatia.
> It is the single source of truth for every future module, developer, AI
> coding assistant, contributor, and architectural decision.
>
> **Every future phase must conform to this document.**

---

## SECTION 1 — Vision

Scholatia is **the world's most comprehensive scholarly identity, research,
collaboration, publishing, discovery, intelligence, commerce, and innovation
ecosystem.**

Every module exists to strengthen one integrated academic ecosystem:

- **Identity** anchors the researcher.
- **Research** is the engine of scholarly work.
- **Discovery** makes the work findable.
- **Intelligence** turns the work into insight.
- **Trust** makes transactions reliable.
- **Commerce, Marketplace, and Services** make the ecosystem sustainable.
- **Innovation** emerges when every layer reinforces every other layer.

No module is an island. Every module serves the ecosystem, and the ecosystem
serves the researcher from idea to impact.

---

## SECTION 2 — Platform Principles

| # | Principle | Rule |
| --- | --- | --- |
| 1 | **Single Source of Truth** | One canonical definition per entity, constant, type, and lifecycle. Everything else references it. |
| 2 | **No Duplicate Data** | Entities are stored and owned exactly once. Other modules reference by ID — never copy fields. |
| 3 | **Pure Placeholder Architecture** | Placeholder data is realistic, typed, derivable, and never a substitute for the real engine. |
| 4 | **Strong Typing** | Every module ships strict TypeScript types in `types/`. No `any`. |
| 5 | **Module Independence** | Modules may be built, tested, and rendered independently. |
| 6 | **Cross Module References** | Modules integrate by referencing canonical IDs and utilities — never by duplicating logic. |
| 7 | **Immutable IDs** | Every entity ID is immutable once created. Never use array indexes as identity. |
| 8 | **Composable Components** | UI is built from small presentational components composed into larger ones. |
| 9 | **Pure Utility Libraries** | `lib/` contains pure functions only — no side effects, no DOM, no React, no API calls. |
| 10 | **No Business Logic Inside Components** | Components render. Hooks expose state. `lib/` computes. |
| 11 | **Documentation First** | No module is complete without its architecture documentation. |
| 12 | **Backward Compatibility** | Removing or renaming public APIs, types, and tables is a breaking change requiring a migration. |
| 13 | **Scalable Architecture** | Layered, typed, and dependency-clean so the platform scales in modules, not in sprawl. |
| 14 | **AI-first Development** | Repositories and docs are structured so AI coding assistants can audit, reuse, and extend without duplicating work. |
| 15 | **Offline-friendly Placeholder Layer** | Every module renders fully from static placeholder data — no backend required for development. |
| 16 | **Internationalisation Ready** | Text is centralized and format utilities are locale-aware (`en-US` default). |
| 17 | **Accessibility Ready** | Semantic markup, keyboard support, ARIA where needed, and contrast-safe design. |
| 18 | **Enterprise Ready** | RBAC, audit-friendly structure, and strict separation of concerns. |
| 19 | **Cloud Ready** | Stateless render, static prerendering, and pure data layers port cleanly to any host. |
| 20 | **API Ready** | `lib/` is written API-shaped: pure functions over typed models can be exported directly as endpoints. |

---

## SECTION 3 — Complete Module Map

**Legend:** ✅ Implemented · 🔲 Planned / future

| Module | Status | Scope |
| --- | --- | --- |
| Identity | ✅ | Researcher profile, identity, ORCID, affiliations, skills, experience, education, interests, awards, grants, verification |
| Research | ✅ | Research workspace, projects, publications, datasets, manuscripts, lifecycle positioning |
| Researchers | ✅ | Researcher directory, public researcher pages |
| Institutions | ✅ | Institution pages, institutional network, affiliations, verification |
| Publishers | ✅ | Publisher pages |
| Journals | ✅ | Journal pages, submissions, peer review, editorial boards |
| Conferences | ✅ | Conference pages, registration, committees, submissions, schedules |
| Projects | ✅ | Research project lifecycle |
| Funding | ✅ | Funding and grants |
| Discovery | ✅ | Search and discovery feed |
| Intelligence | ✅ | Trends, analytics, recommendations |
| Trust | ✅ | Trust scores and trust infrastructure |
| Advertising | ✅ | Ad campaigns, sponsored placements |
| Commerce | ✅ | Products, carts, orders, payments, subscriptions, escrow, settlement |
| Services | ✅ | Service providers, packages, orders, milestones, disputes |
| Marketplace | ✅ | Vendors, listings, orders, reviews, promotions |
| Education | ✅ | Education module |
| Analytics | ✅ | Platform analytics |
| Verification | ✅ | Email and identity verification |
| ORCID | ✅ | ORCID integration surface |
| Awards | ✅ | Awards and recognitions |
| Collaborators | ✅ | Collaboration network |
| Publishing | ✅ | Publishing surface |
| Datasets | ✅ | Dataset module |
| Manuscripts | ✅ | Manuscript workspace |
| Student Research | ✅ | Student research module |
| Skills | ✅ | Skills surface |
| Experience | ✅ | Experience surface |
| Events | ✅ | Events module |
| Institutional Network | ✅ | Institutional network module |
| Interests | ✅ | Interests surface |
| Affiliations | ✅ | Affiliations surface |
| Privacy | ✅ | Privacy policy surface |
| Settings | ✅ | User settings |
| Authentication | ✅ | Login, register, session, roles, permissions, RBAC |
| Notifications | 🔲 | User notifications engine |
| Messaging | 🔲 | User messaging |
| Groups | 🔲 | Research groups |
| Communities | 🔲 | Communities and forums |
| Learning | 🔲 | Learning and courses |
| Mobile API | 🔲 | Public mobile-first API |
| Enterprise API | 🔲 | Enterprise and licensing API |

---

## SECTION 4 — Canonical Data Ownership

Each entity is owned by exactly one module. Other modules may **reference** it
by ID but must **never duplicate** it.

| Entity | Owned by |
| --- | --- |
| User, Account, Session, Role, Permission | Authentication |
| Researcher, Public Profile, SAID | Identity |
| Affiliation, Skill, Experience, Education, Interest, Award, Grant | Identity |
| ORCID Record | Identity |
| Research Work, Publication, Citation | Research |
| Project | Research |
| Dataset | Research |
| Manuscript | Research |
| Institution | Institutions |
| Institutional Network | Institutions |
| Publisher | Publishers |
| Journal | Journals |
| Conference | Conferences |
| Grant / Funding Application | Funding |
| Trend | Intelligence |
| Search Index | Discovery |
| Trust Score | Trust |
| Campaign, Ad Set, Ad Creative, Sponsored Placement | Advertising |
| Vendor, Storefront, Listing | Marketplace |
| Product, Cart, Order, Invoice, Payment, Refund, Subscription, Escrow | Commerce |
| Service, Service Provider, Service Package, Service Order, Milestone, Dispute | Services |
| Analytics | Analytics |
| Verification Record | Verification |

---

## SECTION 5 — Cross Module Dependency Rules

Dependencies flow **downward only**. A module may depend on every module above
it, never on a module below it, and never on itself through a cycle.

```
Identity
   ↓
Research
   ↓
Discovery
   ↓
Intelligence
   ↓
Trust
   ↓
Advertising
   ↓
Commerce
   ↓
Services
```

Supporting rules:

- **Authentication / SAID** are the root foundation — every module may depend on them.
- **Publishers, Journals, Conferences, Projects, Funding, Datasets, Manuscripts** sit beside Research and consume the canonical lifecycle.
- **Marketplace** is a peer integration layer over Advertising, Trust, and Commerce — it references their entities, never re-defines them.
- **Circular dependencies are forbidden.** If a module needs a concept from a lower module, the concept moves up or is referenced via a canonical ID — it is never copied downward.

---

## SECTION 6 — Lifecycle Engine

The research lifecycle is defined **once** in `lib/lifecycle.ts` and consumed
by every module. **No module may redefine lifecycle.**

Canonical stages (15):

| Order | Stage | Completion category |
| --- | --- | --- |
| 1 | Idea | ideation |
| 2 | Concept Note | ideation |
| 3 | Proposal | ideation |
| 4 | Funding | resourcing |
| 5 | Project | execution |
| 6 | Dataset | execution |
| 7 | Analysis | execution |
| 8 | Manuscript | dissemination |
| 9 | Submission | dissemination |
| 10 | Peer Review | dissemination |
| 11 | Publication | dissemination |
| 12 | Conference | dissemination |
| 13 | Citation | impact |
| 14 | Impact | impact |
| 15 | Knowledge Transfer | impact |

The engine exposes `getStage`, `getNextStage`, `getPreviousStage`,
`getCompletionPercentage`, `isResearchComplete`, `validateStage`, and category
queries. Entities positioned in the lifecycle reference it by `stageIds` —
never by duplicate stage definitions.

---

## SECTION 7 — ID Standards

Every entity has an **immutable** ID. IDs are never re-used, never reassigned,
and never derived from array position.

| ID | Owner | Notes |
| --- | --- | --- |
| `userId` | Authentication | Stable account identity |
| `researcherUsername` | Identity | Public researcher identity |
| `said` | Identity | Scholatia public identifier |
| `researchId` | Research | Research workspace identity |
| `publisherId` | Publishers | |
| `journalId` | Journals | |
| `conferenceId` | Conferences | |
| `grantId` | Funding | |
| `campaignId` | Advertising | |
| `adSetId` / `adCreativeId` | Advertising | |
| `listingId` | Marketplace | |
| `productId` | Commerce | |
| `orderId` | Commerce | |
| `invoiceId` | Commerce | |
| `subscriptionId` | Commerce | |
| `serviceId` | Services | |
| `providerId` | Services | |
| `serviceOrderId` | Services | |
| `sourceId` + `sourceEntity` | Cross-module | Polymorphic reference to any owned entity |

Rules:

- Never use array indexes as identity.
- Cross-module references use `sourceId`/`sourceEntity` or the owning module's canonical ID.
- IDs are generated once and never mutated.

---

## SECTION 8 — Placeholder Rules

Placeholder data is a first-class, typed, static layer used for development and
rendering. It must:

- **look realistic** — plausible names, numbers, dates, and prose;
- **be strongly typed** — every placeholder export is typed by `types/`;
- **reuse existing IDs** — reference canonical researcher, service, product, and campaign IDs already defined elsewhere;
- **avoid duplication** — never re-declare data that the engine already derives;
- **be derivable** — aggregate statistics and analytics are computed from the placeholder records, not hard-coded where derivable;
- **not conflict** — IDs, slugs, and references must stay consistent across the platform.

Placeholder exports live in `constants/placeholder-*.ts`. Derived numbers
(statistics, analytics, ratings) are computed via `lib/` from the raw
placeholder records.

---

## SECTION 9 — Component Standards

Components are **presentational only.**

- Components receive props and render.
- Business logic lives in `lib/`.
- Hooks (`useX()`) expose state and derived data.
- **Components never own data** — they never import placeholder data, never call `lib` business functions themselves, and never mutate state that belongs to a module.
- The module page (`app/<module>/page.tsx`) is the single place that wires hooks + `lib` + placeholder data into the component tree.
- Components are composable: small primitives (badges, cards, sections) compose into larger layouts.
- UI primitives are shared from `components/ui/`; module components live in `components/<module>/`.

---

## SECTION 10 — Utility Standards

`lib/` utilities are **pure functions**:

- No side effects.
- No DOM access.
- No React.
- No API / network calls.
- Deterministic output for the same input.

Utility modules (`lib/`) currently include: `auth`, `said`, `institutions`,
`conferences`, `journals`, `research`, `lifecycle`, `researchers`,
`intelligence`, `ads`, `marketplace`, `commerce`, `services`, `trust` — each
exported through `lib/index.ts` and fully typed.

---

## SECTION 11 — Hook Standards

Every module may expose a `useX()` hook that wraps its data layer for
components:

| Hook concern | Example surface |
| --- | --- |
| Root accessor | `useServices()`, `useCommerce()`, `useMarketplace()`, `useTrust()` |
| Portfolio | `portfolio`, `featured`, `statistics` |
| Statistics | `statistics`, aggregate counts |
| Analytics | `analytics`, trends, performance |
| Featured | `featured` items and spotlight records |
| Filters | `query`, `category`, `group`, `priceRange`, `filters` |
| Sorting | `sort`, `sortOrder`, sort helpers |
| Recommendations | `recommendations`, related, bought-together |
| Helpers | selectors and derived-data helpers |

Hooks never import placeholder data directly when the module page owns the
wiring; they expose the state + actions a page or component needs. All hooks
are exported from `hooks/index.ts`.

---

## SECTION 12 — Documentation Standards

Every module requires, in `docs/`:

- **Architecture doc** — purpose, flow, and integration (`*_ARCHITECTURE.md`);
- **Type canon** — canonical types and their source module;
- **Placeholder documentation** — what data exists and how it is derived;
- **Dependency graph** — what the module imports and what imports it;
- **Route map** — every route the module owns;
- **Entity map** — entities owned vs. referenced;
- **Component map** — every component and what it renders;
- **Future extensions** — planned evolution.

The **Core Platform Manifest** (this document) is the constitutional layer
above all module docs. The **Route Matrix** (`ROUTE_MATRIX.md`) tracks every
route's status.

---

## SECTION 13 — Database Standards

`db/schema.sql` is the canonical schema.

- **Append only.** Never remove tables.
- Never rename tables without a migration.
- New modules append new tables; existing tables are extended only by migration.
- Tables follow `module_entity` naming (e.g., `commerce_orders`, `service_orders`, `ad_campaigns`).
- Cross-module references use canonical IDs or `sourceId`/`sourceEntity`.
- Every table carries indexes and typed comments consistent with the platform style.

---

## SECTION 14 — Coding Standards

- **Strict TypeScript** — strict mode, fully typed signatures.
- **No `any`** anywhere.
- **Named exports preferred** — default export only for React pages/components.
- **No duplicate interfaces** — shared types live in `types/` and are imported.
- **No duplicated enums** — constants and unions are defined once and reused.
- **Shared constants reused** — lifecycle stages, ID schemes, status unions, and config are referenced, never re-declared.
- Imports use the `@/` path alias (`@/types`, `@/lib`, `@/constants`, `@/hooks`, `@/components`).

---

## SECTION 15 — AI Development Rules

Every future AI prompt must:

1. **Audit existing code** — confirm what exists before writing anything.
2. **Reuse types** — import canonical types, never redefine them.
3. **Reuse placeholders** — consume existing `constants/placeholder-*.ts` records.
4. **Reuse IDs** — reference existing canonical IDs.
5. **Reuse lifecycle** — consume `lib/lifecycle.ts`; never redefine stages.
6. **Reuse hooks** — extend/consume `useX()` hooks instead of rebuilding state layers.
7. **Reuse utilities** — use `lib/` helpers; never duplicate logic.
8. **Avoid rebuilding existing functionality** — only fill confirmed gaps.
9. **Stop exactly at requested phase** — do not creep into later phases or refactor working code.
10. **Produce a completion report** — mirroring prior phase recovery reports.
11. **Run the verification suite** — `npx tsc --noEmit`, `npm run lint`, `npm run build`.

---

## SECTION 16 — Monetisation Architecture

Scholatia monetises through one **unified revenue ecosystem** — not separate
products:

| Revenue stream | Module(s) | Mechanism |
| --- | --- | --- |
| Advertising | Advertising | Campaigns, sponsored placements, ad sets/creatives |
| Commerce | Commerce | Product sales, carts, orders, payments, subscriptions, escrow, commissions, platform fees, settlements |
| Marketplace | Marketplace | Vendor listings, storefronts, marketplace orders |
| Services | Services | Service orders, packages, milestones, disputes |
| Subscriptions | Commerce | `commerce_subscription_plans`, `commerce_subscriptions` |
| Verification | Verification | Identity/email verification services |
| Publishing | Publishing | Publishing workflows |
| Research Services | Services | Research-as-a-service offerings |
| Institutional Licensing | Institutions | Institution-level plans and licensing |
| API Licensing | Mobile API / Enterprise API | Public and enterprise API access |
| Premium Analytics | Intelligence / Analytics | Advanced analytics tiers |
| Enterprise | Enterprise | Enterprise contracts and portals |

Each stream references the same users, orders, invoices, wallets, escrow, and
trust primitives — revenue data is derived, never duplicated.

---

## SECTION 17 — Future Expansion Roadmap

| Phase | Scope |
| --- | --- |
| 2.x | Notifications, Messaging |
| 3.x | Groups, Communities, Learning |
| 4.x | Mobile API, Enterprise API, Open API |
| 5.x | Knowledge Graph, Recommendation Engine, Semantic Search |
| 5.x+ | Citation Network, Research Graph |
| 5.x+ | Mobile Apps, Institution Portals, Publisher Portals |
| 5.x+ | Government Portals, Industry Portal |
| 5.x+ | AI Agents, Digital Twin |

Every future phase must conform to this manifest, reuse the existing
lifecycle, ID, placeholder, and component layers, and run the full
verification suite.

---

## SECTION 18 — Scholatia Design Philosophy

Scholatia is not a collection of independent applications.

Scholatia is **one integrated scholarly operating system.**

Every module is designed to reinforce every other module —
identity feeds research, research feeds discovery, discovery feeds
intelligence, intelligence feeds trust, and trust makes commerce, services,
and marketplace possible.

Every future architectural decision must preserve this principle.

---

*Version 1.0 — The Constitutional Architecture of Scholatia.*
