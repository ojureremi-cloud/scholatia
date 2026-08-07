# CRIE Mission 009 — Intelligence Integration Layer Report

Mission 009 of the CRIE intelligence-platform rollout. This mission wires the
Mission 008 pure intelligence engines (E-31 graph reasoning, E-32 semantic
search, E-33 research recommendations, E-34 decision support, E-35 analytics
intelligence, E-36 research assistant, E-37 intelligence pipeline) into the
runtime platform: a read-only `app/api/crie/intelligence/**` endpoint surface
and additive derived-intelligence surfaces on the dashboard and analytics
pages. Integration-only: no architecture was redesigned, no engine was
rewritten, no engine logic was duplicated, and no governance changed.

## 1. What was added

| Layer | File | Change |
| --- | --- | --- |
| Route | `app/api/crie/intelligence/route.ts` | **New.** `GET` — unified pipeline report (E-37) over the seeded store: graph, memory, derived reasoning traces, base recommendation, cached analytics, derived answers. |
| Route | `app/api/crie/intelligence/search/route.ts` | **New.** `GET` — E-32 multi-factor semantic search (`semanticSearch`) with `q`, `limit`, `minConfidence`, `entityClasses`; explainable factors + statistics. |
| Route | `app/api/crie/intelligence/graph/route.ts` | **New.** `GET` — E-31 graph reasoning: `shortestPath` (`from`/`to`), `similarEntities` (`similar`), `propagateTrust` (`propagate`, `maxHops`), `discoverRelationships` (`discover`/`vs`), statistics. |
| Route | `app/api/crie/intelligence/analytics/route.ts` | **New.** `GET` — E-35 intelligence indicators with change tracking over the two latest cached analytics snapshots, strongest/rising subsets, statistics. |
| Route | `app/api/crie/intelligence/recommendations/route.ts` | **New.** `GET` — E-33 derived research recommendations (`recommendNextStep` + gap-driven `evidence-gap` recommendations from seeded gaps), ranked, with statistics. |
| Route | `app/api/crie/intelligence/assistant/route.ts` | **New.** `GET` — E-36 research assistant report: evidence-grounded answers, next-step recommendation, research-gap missing evidence, statistics. |
| Route | `app/api/crie/intelligence/decision/route.ts` | **New.** `POST` — E-34 decision support analysis over a caller-framed decision (options/pros-cons/risks/scores); pure computation, never persists, never decides (Article VIII). |
| Component | `components/crie/analytics/IntelligenceAnalytics.tsx` | **New.** Server component exposing E-35 indicators (strongest 5, rising, average, evidence version) on the analytics page. |
| Barrel | `components/crie/analytics/index.ts` | `export * from './IntelligenceAnalytics';` (additive, after `CollaborationAnalytics`). |
| Page | `app/crie/analytics/page.tsx` | Renders `<IntelligenceAnalytics />` between scope snapshots and productivity/impact/collaboration sections. |
| Page | `app/crie/dashboard/page.tsx` | Composes a derived-intelligence snapshot (top-5 E-35 indicators, E-33 next-step recommendation, E-31 similar entities) and passes it to `ResearchDashboard`. |
| Component | `components/crie/workspace/ResearchDashboard.tsx` | Additive optional `intelligence?: ResearchDashboardIntelligence` prop; renders a "Derived intelligence" panel (next-step recommendation, indicator cards, similar-entity links). |

## 2. Design invariants

- **Thin handlers over the read surface.** Every route calls
  `requirePrincipal`, reads through `lib/crie/access.ts` (the repository-backed
  read surface — never the placeholder constants), composes the pure Mission 008
  engines, and returns via `jsonCrie`/`crieErrorResponse`. No route writes, owns,
  or persists records.
- **Composition by reference.** The routes call the engines directly and pass
  seeded/derived inputs; the pipeline route reuses `intelligencePipeline`
  (E-37), which itself composes E-01/E-03/E-33/E-35/E-36. Reasoning traces for
  the pipeline are derived with the existing E-02 `createReasoningTrace` /
  `reasoningStep` helpers (reasoning traces are intentionally not seeded),
  and answers are derived from evidence records with E-36
  `createResearchAnswer` — no new engine logic was written.
- **Human authority preserved.** The decision route accepts a caller-framed
  decision and returns `decisionSupportAnalysis` only — CRIE supports, the
  researcher decides (Article VIII). Recommendations are derived, ranked, and
  dismissible.
- **Additive UI only.** `ResearchDashboard` gains one optional prop; the
  analytics barrel gains one export; no existing component, page, or route was
  redesigned and no visuals were changed.
- **ID/response conventions.** Responses reuse the existing `{ data }` envelope
  and CrieError mapping; engine IDs keep their CRIE prefixes (`intel-report-`,
  `research-rec-`, `decision-support-`, `answer-`, `assistant-report-`, …).

## 3. Endpoint surface

| Method | Path | Engines | Notes |
| --- | --- | --- | --- |
| GET | `/api/crie/intelligence` | E-37 | Pipeline stages (7), top indicators, answers, next-step recommendation. |
| GET | `/api/crie/intelligence/search?q=&limit=&minConfidence=&entityClasses=` | E-32 | Explainable multi-factor ranking over the RKG. |
| GET | `/api/crie/intelligence/graph?from=&to=&similar=&propagate=&discover=&vs=` | E-31 | Paths, similarities, trust propagation, relationship discovery. |
| GET | `/api/crie/intelligence/analytics?limit=` | E-35 | Indicator set with change tracking + strongest/rising. |
| GET | `/api/crie/intelligence/recommendations?entityId=` | E-33 | Next-step + gap-driven recommendations, ranked. |
| GET | `/api/crie/intelligence/assistant?entityId=` | E-36 | Grounded answers, gaps, recommendation, report confidence. |
| POST | `/api/crie/intelligence/decision` | E-34 | Body: `label`, `frame`, `objectives`, `constraints`, `options`, optional `scores`/`prosCons`/`risks`. |

All routes are dynamic (authenticated) and derived; none are cached as
authoritative data.

## 4. Verification results

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors; 1 pre-existing `<img>` warning at `components/ui/Avatar.tsx:28:5` (the only sanctioned warning) |
| `npm run build` | ✅ success — all 7 `/api/crie/intelligence` handlers bundled under `.next/server/app/api/crie/intelligence/**`; all `/crie` UI routes prerender |

## 5. Remaining technical debt (if any)

- Reasoning traces and decisions are not seeded, so the pipeline's `reasoning`
  stage is driven by derived E-02 traces and the `decision` stage reports
  `ok: false` honestly (no `crie_decisions` table exists). Deeper page wiring —
  multi-factor results inside the search explorer, path views inside
  `GraphView`, and assistant cards inside the research workspace — remains
  future work and is deliberately out of scope for this integration-only
  mission.
- No `TODO`/`FIXME`/`XXX`/`temporary`/`mock`/`stub`/`hack` markers were
  introduced in any new file.
- Mission 007/008 files (`lib/crie/db/*`, `lib/crie/access.ts`,
  `lib/crie/services.ts`, the Mission 008 engines and `types/crie/intelligence.ts`,
  the prior mission reports) remain in the working tree uncommitted from prior
  interrupted sessions; they are not part of this mission and were not
  re-modified beyond the additive dashboard/analytics wiring above.

## 6. Readiness score

| Criterion | Score |
| --- | --- |
| Thin authenticated handlers over the read surface | 9/9 |
| Composition by reference of Mission 008 engines | 9/9 |
| Additive UI surfaces (no redesign, no visual changes) | 9/9 |
| Human authority preserved (decision support only) | 9/9 |
| Endpoint coverage of all six engines + pipeline | 9/9 |
| Build/lint/typecheck | 9/9 |
| **Overall readiness** | **9/9 — intelligence integration layer complete and validated** |

Mission 009 complete. No commits, tags, merges, or governance changes were made.
