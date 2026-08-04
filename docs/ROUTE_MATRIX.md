# Scholatia Route Matrix

**Phase 0.95 — Platform Stabilization & Navigation Completion**

Status legend:

- **Implemented** — real, working page with substantive content sections.
- **Placeholder** — architecture-ready page (may be fully implemented, partial, or a lightweight placeholder).
- **Missing** — referenced in the UI but no `app/<route>/page.tsx` exists.

Every row below was verified against the actual App Router (`app/<route>/page.tsx`).

## Identity & profile

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/profile` | Implemented | Yes | No | No |
| `/identity` | Implemented | Yes | No | No |
| `/publications` | Implemented | Yes | No | No |
| `/projects` | Implemented | Yes | No | No |
| `/education` | Placeholder (partial) | No | Yes | No |
| `/experience` | Placeholder (partial) | No | Yes | No |
| `/skills` | Placeholder (partial) | No | Yes | No |
| `/interests` | Placeholder (partial) | No | Yes | No |
| `/awards` | Placeholder (partial) | No | Yes | No |
| `/grants` | Placeholder (partial) | No | Yes | No |
| `/affiliations` | Placeholder (partial) | No | Yes | No |
| `/collaborators` | Placeholder (partial) | No | Yes | No |
| `/orcid` | Placeholder (partial) | No | Yes | No |
| `/verification` | Placeholder (partial) | No | Yes | No |
| `/analytics` | Placeholder (partial) | No | Yes | No |
| `/settings` | Placeholder (partial) | No | Yes | No |

## Research

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/research` | Implemented | Yes | No | No |
| `/research/create` | Placeholder (created 0.95) | No | Yes | No |
| `/research/[id]` | Placeholder (created 0.95) | No | Yes | No |
| `/manuscripts` | Implemented | Yes | No | No |
| `/datasets` | Implemented | Yes | No | No |

## Platform modules

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/dashboard` | Placeholder (full) | No | Yes | No |
| `/conferences` | Placeholder (full) | No | Yes | No |
| `/journals` | Placeholder (full) | No | Yes | No |
| `/institutions` | Placeholder (full) | No | Yes | No |
| `/marketplace` | Placeholder (full) | No | Yes | No |
| `/events` | Placeholder (created 0.95) | No | Yes | No |
| `/publishers` | Placeholder (created 0.95) | No | Yes | No |
| `/funding` | Placeholder (created 0.95) | No | Yes | No |
| `/publishing` | Placeholder (created 0.95) | No | Yes | No |
| `/intelligence` | Placeholder (created 0.95) | No | Yes | No |
| `/discovery` | Placeholder (created 0.95) | No | Yes | No |
| `/student-research` | Placeholder (created 0.95) | No | Yes | No |
| `/institutional-network` | Placeholder (created 0.95) | No | Yes | No |
| `/trust` | Placeholder (created 0.95) | No | Yes | No |

## Authentication (created 0.95)

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/login` | Placeholder | No | Yes | No |
| `/register` | Placeholder | No | Yes | No |
| `/forgot-password` | Placeholder | No | Yes | No |
| `/reset-password` | Placeholder | No | Yes | No |

## Legal & support

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/privacy` | Implemented (created 0.95) | Yes | No | No |
| `/terms` | Implemented (created 0.95) | Yes | No | No |

## Root

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/` (home) | Implemented | Yes | No | No |

## Academic Groups (Phase 2.2G)

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/groups` | Implemented | Yes | No | No |
| `/groups/[id]` | Implemented (by slug) | Yes | No | No |
| `/groups/create` | Implemented | Yes | No | No |

## Scholarly Communities (Phase 2.2G.2)

| Route | Status | Implemented | Placeholder | Missing |
| --- | --- | --- | --- | --- |
| `/communities` | Implemented | Yes | No | No |
| `/communities/[slug]` | Implemented (by slug) | Yes | No | No |
| `/communities/create` | Implemented | Yes | No | No |
| `/community-directory` | Implemented | Yes | No | No |
| `/community-feed` | Implemented | Yes | No | No |

## Summary

| Metric | Count |
| --- | --- |
| Total routes after 0.95 | 41 |
| Implemented | 10 |
| Placeholder (partial) | 12 |
| Placeholder (full) | 5 |
| Placeholder (created in 0.95) | 14 |
| Missing (404) | 0 |

> Phase 2.2G added three implemented Academic Groups routes on top of the
> Phase 0.95 totals above.
>
> Phase 2.2G.2 added five implemented Scholarly Communities routes
> (`/communities`, `/communities/[slug]`, `/communities/create`,
> `/community-directory`, `/community-feed`) on top of the Phase 2.2G totals.
