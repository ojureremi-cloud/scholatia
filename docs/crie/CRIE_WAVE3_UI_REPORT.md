# CRIE Wave 3 — User Presentation Layer (UI) Report

Mission 004-E — Phase 3 of the CRIE rollout on Scholatia. This report covers the reusable user-presentation component library under `components/crie/` and the routes under `app/crie/` that present the Wave 2 (Mission 004-D) engines and seed data to the researcher.

## 1. Scope and guardrails

- **Consumed as-is (never modified):** `lib/crie/*` (engines), `types/crie/*` (types), `constants/placeholder-crie.ts` (seed constants), `hooks/useCRIE.ts`, `db/schema.sql`, and all governance docs.
- **Not implemented:** no AI/LLM calls, no external API connections, no server actions. All data flows through seeded constants and pure engines.
- **No governance changes** were made (no commits, tags, or governance-document edits).

## 2. Component inventory

**65 components** across 8 groups (matching the wave-3 objective):

| Group | Path | Count |
| --- | --- | --- |
| Core | `components/crie/core/` | 12 |
| Workspace | `components/crie/workspace/` | 13 |
| Knowledge | `components/crie/knowledge/` | 7 |
| Memory | `components/crie/memory/` | 7 |
| Reasoning | `components/crie/reasoning/` | 7 |
| Agents | `components/crie/agents/` | 7 |
| Analytics | `components/crie/analytics/` | 6 |
| Administration | `components/crie/administration/` | 6 |

Supporting files at `components/crie/`:

- `primitives.tsx` — tonal `Chip`, `Panel`, `Row`, `Stack`, `ProgressBar`, `ConfidenceMeter`, `ListItem`, `Button`.
- `format.ts` — date/number/percent formatters; lifecycle/entity-class/memory-type/autonomy/agent/reasoning label + icon helpers; confidence/stage/status tones; all `crie*Url()` builders plus `researchEntityUrl`, `projectUrl`, `graphEntityUrl`, `agentUrl`, `memoryUrl`, `kgEntityLabel`.
- `data.ts` — derivation helpers composing seed constants with pure engines (`crieOverviewModel`, `crieWorkspaceModel`, `crieReasoningModel`, `crieDecisionModel`, `crieGraphModel`, `crieMemoryModel`, `crieAgentsModel`/`crieAgentModel`, `crieAnalyticsModel`, `crieProductivityModel`, `crieImpactModel`, `crieCollaborationModel`, `criePolicyModel`, `crieTrustModel`, `crieInstitutionModel`, `crieFederationModel`, `crieSearchModel`, `crieSettingsModel`), plus type re-exports (`CRIEDecisionCapability`, `CRIELifecycleStageId`, `CRIEReasoningParadigm`, `CRIEAgentView`).
- Group barrels (`core/index.ts`, `workspace/index.ts`, …) and a top-level `components/crie/index.ts`.

## 3. Routes under `app/crie/`

**15 static routes:**

| Route | Surface |
| --- | --- |
| `/crie` | redirects to `/crie/dashboard` |
| `/crie/dashboard` | `ResearchDashboard` (uses `useCRIE`) |
| `/crie/research` | `ResearchWorkspace` (uses `useCRIE`) |
| `/crie/projects` | `ActiveProjects` |
| `/crie/knowledge` | `KnowledgeGraphOverview` + `EntityList` |
| `/crie/graph` | `GraphView` |
| `/crie/memory` | `MemoryOverview` + `MemoryList` + `MemoryRecall` |
| `/crie/reasoning` | `ReasoningOverview` + `ReasoningTraceList` + `ReasoningConclusions` |
| `/crie/agents` | `AgentsOverview` + `AutonomyLevels` |
| `/crie/analytics` | `AnalyticsOverview` + `ProductivityAnalytics` + `ImpactAnalytics` + `CollaborationAnalytics` |
| `/crie/institutions` | `InstitutionsAdmin` |
| `/crie/federation` | `FederationAdmin` |
| `/crie/trust` | `TrustCentre` |
| `/crie/search` | client page: `CRIESearch` + ranked results via `searchGraph`/`searchStatistics` |
| `/crie/settings` | `SettingsOverview` + `PolicyCentre` + `EthicsReviewPanel` |

**5 dynamic routes** (Next.js 16 async `params`, `notFound()` on miss):

| Route | Lookup | Surface |
| --- | --- | --- |
| `/crie/research/[slug]` | `CRIE_ENTITIES` by `id` | `ResearchTimeline` + `ResearchEntityPanel` + `ResearchCanvas` + `ResearchSession` |
| `/crie/projects/[slug]` | `CRIE_ENTITIES` by `id` | `ResearchTimeline` + `ResearchEntityPanel` |
| `/crie/graph/[entity]` | `CRIE_KNOWLEDGE_GRAPH.entities` by `crieId` | `EntityDetail` (+ entity relations), `EntityTimeline`, `EntitySources` |
| `/crie/agents/[agent]` | `crieAgentModel(agentId)` | `AgentDetail` + `AgentTaskList` |
| `/crie/memory/[memory]` | `CRIE_MEMORY_ITEMS` by `id` | `MemoryDetail` |

## 4. Verification

All three gates pass:

- `npx tsc --noEmit` — clean, 0 errors.
- `npm run lint` — 0 errors, 0 warnings (only pre-existing `<img>` warning in `components/ui/Avatar.tsx`).
- `npm run build` — compiled successfully; all 99 pages generated; all 20 `/crie` routes registered (15 static `○`, 5 dynamic `ƒ`).

## 5. Notes and decisions

- **Next.js 16 async params** enforced on all dynamic routes (`params: Promise<{ slug: string }>` + `await props.params`).
- `format.ts` `confidenceTone` returns `BadgeTone` (imported from `@/components/ui`) and is passed to `Chip` without cast — `ChipTone` is structurally identical.
- `agentLabel()` in `format.ts` uses a local fallback map keyed by `AgentId` plus a generic `agent-<id>` fallback (no agent-label constant exists in `types/crie/agents.ts`).
- `EntityTimeline` and `EntitySources` accept the full entity array (`entities: KGEntity[]`), so the graph entity page passes the whole graph.
- `/crie/search` is a client component page composing `CRIEStats`/`CRIESearch`/result list and ranking live through the pure `searchGraph` engine.
- The current researcher is `ojuri` (matches `useCRIE`'s `CURRENT_USERNAME`); `ActiveProjects` splits "Your projects" vs "Collaborators' projects" on that username.
