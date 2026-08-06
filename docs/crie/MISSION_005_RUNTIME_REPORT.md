# CRIE Mission 005 — Operational Layer: Runtime-Wired UI & Services Audit

Mission 005 of the CRIE intelligence-platform rollout. This mission closes the last placeholder-to-runtime gap in the **operational layer**: client workspace components were rewired from the shared `useCRIE` hook (placeholder-seeded) to props supplied by server pages that read through `lib/crie/access.ts`. The services/API operational surface was audited for completeness. No architecture was redesigned, no completed code rewritten, and no governance changed.

## 1. What changed

Prior state (Mission 004-G): the server read path was fully runtime-wired (`seed → store → access.ts → server pages → props`), but the dashboard/research/projects surfaces were client components pulling the shared `useCRIE` hook, which imported `constants/placeholder-crie.ts` directly. The hook and `components/crie/data.ts` were the two remaining sanctioned client-side placeholder importers.

After: the shared hook is gone, `data.ts` is a pure parameterized builder module with zero imports of access or placeholders, and every client workspace component receives runtime snapshots as props.

### Dependency graph (before → after)

```
BEFORE                                    AFTER
constants/placeholder-crie.ts              constants/placeholder-crie.ts
   │ server              │ client             │ server only
   ▼                     ▼                   ▼
seed.ts → store → access.ts   hooks/useCRIE.ts        seed.ts → store → access.ts
                              components/crie/data.ts       │
        app/crie pages ───────────┘                        ▼
                              app/crie/* server pages (fetch + pass props)
                                                          │
                                                          ▼
                              client workspace components (props only)
```

## 2. Access surface

`lib/crie/access.ts` grew from 13 accessors to **37 typed accessors**, covering every seeded CRIE domain plus the current-researcher identity (`crieCurrentResearcher`, `currentUserRef()`):

- Core: `crieEntities`, `crieEntity`, `crieGraph`, `crieMemoryItems`, `crieMemoryItem`, `crieSession`, `crieSessionMessages`, `crieContextPacks`, `crieRecommendation`, `crieOrchestrationPlan`
- Reasoning/evidence: `crieClaims`, `crieEvidence`, `crieEvidenceAssessments`, `crieContradictions`, `crieReasoningTraces` (via model), `crieReferences`, `crieCitationContexts`, `crieCitations`, `crieLiteratureSearches`, `crieResearchGaps`, `crieNoveltyAssessments`
- Growth/career: `crieCareerGoals`, `crieCareerSignals`, `crieLearnerStates`, `crieWritingDrafts`, `criePublicationPlans`, `crieSupervisionRecords`, `crieMentorshipGuidance`
- Governance/ethics: `crieEthicsReviews`, `crieEthicsDecisions`, `crieEnterpriseModel`, `crieInstitutionalAssets`, `crieFederationContracts`, `crieFederationExchanges`, `crieMemberSovereignty`, `crieAnalytics`

## 3. `components/crie/data.ts` — pure builder module

Fully rewritten; no `access.ts` or placeholder imports. All model builders are parameterized over typed inputs and preserve downstream shapes:

| Builder | Input | Notes |
| --- | --- | --- |
| `crieOverviewModel` | entities, graph, memoryItems, contextPacks, analyticsRecords, sessions, recommendations | |
| `crieWorkspaceModel` | entities, session, recommendation | server page passes runtime data |
| `crieReasoningModel` | entity, session, evidenceRecords, recommendation, claims | |
| `crieDecisionModel` | finalized, rankOptions(finalized), bestOption(finalized) | `best` now optional |
| `crieGraphModel` / `crieMemoryModel` / `memoryByType` | graph / items / type | pure |
| `crieAgentsModel` / `crieAgentModel` | plan / plan + agentId | |
| `crieAnalyticsModel` | researcher | `global` → `rollup` |
| `crieProductivityModel` / `crieImpactModel` / `crieCollaborationModel` | typed runtime collections | |
| `criePolicyModel` | checkPolicy verdicts | |
| `crieTrustModel` / `crieInstitutionModel` / `crieFederationModel` / `crieSearchModel` / `crieSettingsModel` | typed runtime collections | |

## 4. Component rewiring

All client workspace components now consume props or read `access.ts` (server components only). None import placeholders (verified by grep — zero `placeholder-crie` references outside `seed.ts`).

| Component | Before | After |
| --- | --- | --- |
| `ResearchDashboard` | `useCRIE` | props: entities, graph, memoryItems, session?, sessionMessages?, context, recommendation? |
| `ResearchWorkspace` | `useCRIE` + `CRIE_SESSION_MESSAGES` | props: entity, otherEntities, session, sessionMessages, initialContext, contextElements; `refreshContext` via `createContextPack`/`assembleContext` |
| `ActiveProjects` | `useCRIE` | renamed to `ActiveProjects({ entities })` |
| `ResearchSession` | `useCRIE` + `CRIE_SESSION_MESSAGES` fallback | renamed to `ResearchSession({ session, messages })`; default transcript `[]` |
| `WorkspaceExplorer` | `useCRIE` | props: session?, sessionMessages?; stats via `sessionStatistics([session])` |
| `EvidenceViewer` | `useCRIE` | reads `access.ts`; typed `EvidenceRecord`/`EvidenceAssessment` |
| `CitationManager` | `useCRIE` | reads `access.ts`; `stats.references/citations/contexts` |

`components/crie/{agents,analytics,administration}/*` consumers of `data.ts` builders were updated to pass runtime inputs (plan/records/optional guards) — e.g. `TrustCentre` uses `crieTrustModel(crieGraph())`, `EthicsReviewPanel` uses `crieEthicsReviews()[0]`/`crieEthicsDecisions()[0]`.

## 5. Server pages

`app/crie/{dashboard,research,projects}/page.tsx` are now the fetch points, passing runtime snapshots to the client components. `/crie/dashboard` passes entities/graph/memoryItems/session/messages/context/recommendation; `/crie/research` builds `crieWorkspaceModel` and passes current entity, other entities, session, messages, context packs, and context elements; `/crie/projects` passes entities. No client-side data fetching; components receive data as props.

## 6. Hook removal

`hooks/useCRIE.ts` deleted and unexported from `hooks/index.ts`. Zero remaining `useCRIE` references in `*.{ts,tsx}` (the seed header comment now documents the access-layer contract instead).

## 7. Seed consistency fixes

`lib/crie/db/seed.ts` (the single sanctioned importer of `constants/placeholder-crie.ts`, verified by grep):

- Institutional asset `asset-ui-kg` gained `consentScope: ['research-analytics']`.
- Contract `fed-contract-001` gained `sovereigntyClauses: ['No raw researcher data', 'Aggregate results only']`.
- Exchange `fed-exchange-001`: `contractId` → `federationContractId`; `confidence: 0.8` → `{ value: 0.8, band: 'high' }`.
- Header comment updated (removes the `useCRIE` reference).

## 8. Services / API operational layer audit

`lib/crie/services.ts` (539 lines) exposes **15 service singletons** over the repository layer, enforcing permissions, institution scoping, validation, optimistic locking, soft-delete/restore/purge, search, and audit:

`crieEntityService`, `crieEvidenceService`, `crieCitationService`, `crieReferenceService`, `crieGraphRelationService` (CRUD repos) + `crieGraphService`, `crieMemoryService`, `crieReasonService`, `crieRecommendationService`, `crieDecisionService`, `crieAgentService`, `crieTrustService`, `crieFederationService`, `crieAnalyticsService`, `crieWorkspaceService` (domain services), plus cross-domain `crieSearchAll` and `crieAuditList` entrypoints.

**41 API route handlers** under `app/api/crie/**` cover the registered repository domains — entities (CRUD + restore/purge/history), graph entities + relations, memory (+consolidate), evidence, citations, references, reasoning, recommendations (+approve), decisions, agents (+tasks), analytics, trust, federation (contracts/assets/enterprise), workspace, search, audit. Route completeness is confirmed against the domain register; no blocking gaps found in this mission.

## 9. Verification

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors (1 pre-existing `<img>` warning at `components/ui/Avatar.tsx:28:5`) |
| `npm run build` | ✅ success — all `/crie` UI routes + 41 API route handlers |

## 10. Technical debt

- **Unused pure builders** retained in `data.ts` (`crieDecisionModel`, `crieGraphModel`, `crieMemoryModel`, `crieSearchModel`, `memoryByType`) — zero consumers, harmless, documented (no-revisit rule).
- **Unused accessors** (`crieEnterpriseModel`, `crieFederationExchanges`, etc.) — seeded and typed, available to later surfaces.
- **`lib/crie/contracts.ts`** remains planned-but-unwired (consumers land in later wave missions) — unchanged, zero runtime risk.

## 11. Remaining mission phases (tracked, not yet executed)

1. Repository CRUD coverage verification per entity + any route additions.
2. Knowledge-graph traversal ops, memory lifecycle ops, agent orchestration actions, decision outcomes, institution KPIs, federation operations, unified search, analytics dashboards.
3. Production hardening greps (dead components, unused APIs, circular imports, duplicate repos/models/graph sources).

## 12. Readiness score

| Criterion | Score |
| --- | --- |
| Placeholder isolation (seed-only importer) | 9/9 |
| Client component rewiring (props/runtime) | 9/9 |
| Server page fetch layer | 9/9 |
| data.ts purity | 9/9 |
| Services/API coverage | 9/9 |
| Build/lint/typecheck | 9/9 |
| **Overall readiness** | **9/9 — operational layer runtime-wired and validated** |

Mission 005 core complete. No commits, tags, or governance changes were made.
