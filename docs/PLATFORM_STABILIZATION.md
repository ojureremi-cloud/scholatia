# Scholatia Platform Stabilization

**Phase 0.95 — Platform Stabilization & Navigation Completion**

## Objective

Stabilize the Scholatia platform before Phase 1.0. This phase eliminated broken
navigation, removed all 404s caused by missing routes, verified navigation
consistency, and prepared the application for the Journals Platform.

This was a stabilization phase — no authentication, no APIs, no databases, no
architecture changes. All changes were additive or navigation repairs.

## Navigation coverage

Every navigation surface was audited:

- Header / Navbar
- Footer
- Hero CTAs
- Call to action
- Logo
- Mega navigation (unused, documented)
- Responsive mobile navigation (unused, documented)
- Identity hub cards
- Research module links
- Security form links
- Cross-page header action buttons

Complete detail: `docs/NAVIGATION_AUDIT.md`.

## Implemented routes

Routes with real, substantive content (present before 0.95):

| Route | Module |
| --- | --- |
| `/` | Home landing page |
| `/profile` | Profile |
| `/identity` | Scholatia Academic Identity (SAID) hub |
| `/publications` | Publications |
| `/projects` | Projects |
| `/research` | Research workspace |
| `/manuscripts` | Manuscripts |
| `/datasets` | Datasets |

Routes created with real content in 0.95:

| Route | Module |
| --- | --- |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Placeholder routes

**Existing placeholders (partial)** — architecture-ready, driven by placeholder
constants, awaiting live data:

`/education`, `/experience`, `/skills`, `/interests`, `/awards`, `/grants`,
`/affiliations`, `/collaborators`, `/orcid`, `/verification`, `/analytics`,
`/settings`

**Existing placeholders (full)** — `PageLayout` + `PageHeader` only:

`/dashboard`, `/conferences`, `/journals`, `/institutions`, `/marketplace`

**Placeholders created in 0.95** — lightweight `Coming Soon` / `Under
Development` pages using `PageLayout`, `PageHeader`, `Container`, `SectionCard`,
`Alert`, and `Badge` in the existing design language:

| Route | Module |
| --- | --- |
| `/login` | Authentication placeholder |
| `/register` | Registration placeholder |
| `/forgot-password` | Password recovery placeholder |
| `/reset-password` | Password reset placeholder |
| `/research/create` | Create research project placeholder |
| `/research/[id]` | Research project detail placeholder |
| `/student-research` | Student Research module |
| `/publishers` | Publisher module |
| `/funding` | Funding Organisations module |
| `/institutional-network` | Institutional Network module |
| `/publishing` | Scholarly Publishing Platform |
| `/intelligence` | Scholarly Intelligence Platform |
| `/discovery` | Scholarly Discovery Marketplace |
| `/events` | Scholarly Events |

## 404s eliminated

Sixteen routes previously returned 404 for navigation destinations:

1. `/login` — Navbar Login button
2. `/register` — Navbar Register button + CallToAction CTA
3. `/forgot-password` — LoginForm "Forgot password?" link
4. `/reset-password` — Step 4 requirement
5. `/privacy` — Footer link
6. `/terms` — Footer link
7. `/research/create` — ResearchProjectHeader "Create Research Project" button
8. `/research/[id]` — ResearchProjectCard project links
9. `/student-research`
10. `/publishers`
11. `/funding`
12. `/institutional-network`
13. `/publishing`
14. `/intelligence`
15. `/discovery`
16. `/events`

## Navigation repairs (no redesign)

- `#conferences` and `#journals` were dead anchors (no target element existed
  anywhere). Converted to `/conferences` and `/journals` in the Navbar, Footer,
  Hero CTAs, and shared navigation constants (`constants/config.ts`,
  `constants/index.ts`).
- Dead `href="#"` links in security forms now point to valid routes:
  `LoginForm` → `/forgot-password`, `RegistrationForm` → `/login`,
  `PasswordResetForm` → `/login`.

## Remaining home-page anchors (known, intentional)

The landing page uses one-page section anchors that remain valid on the home
page: `#home`, `#people`, `#institutions`, `#about`, `#contact`, `#services`.
On internal pages the shared Navbar/Footer render these anchors without scroll
targets; converting the global header/footer to fully routed navigation is a
Phase 1.0 task (see below). The `#download` CTA on the datasets page is a
decorative action button with no target section and is deferred to Phase 1.0.

## Future routes

Planned for Phase 1.0 onward (some reserved by this phase as placeholders):

- Full authentication flows backed by the Scholatia authentication layer
- Journals Platform (`/journals` and the Scholarly Publishing Platform)
- Conference and event management (`/conferences`, `/events`)
- Institution management (`/institutions`, `/institutional-network`)
- Directory and discovery features (`/discovery`, `/marketplace`)
- Student research workspace (`/student-research`)
- Publisher workspace (`/publishers`, `/publishing`)
- Funding organisation workspace (`/funding`)
- Scholarly Intelligence Platform (`/intelligence`)
- Route conversion of home-page section anchors into platform-wide navigation

## Remaining work before Phase 1.0

- No remaining 404s in the application navigation.
- Optional: convert the global Navbar/Footer from home-page section anchors to
  routed platform navigation for full cross-page consistency.
- Optional: give the `#download` CTA on the datasets page a target or convert
  it to an action button.
- Optional: wire the unused `MegaNavigation` / `ResponsiveMobileNavigation`
  components into the global layout with routed destinations.

## Files created

### Pages

- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/forgot-password/page.tsx`
- `app/reset-password/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/research/create/page.tsx`
- `app/research/[id]/page.tsx`
- `app/student-research/page.tsx`
- `app/publishers/page.tsx`
- `app/funding/page.tsx`
- `app/institutional-network/page.tsx`
- `app/publishing/page.tsx`
- `app/intelligence/page.tsx`
- `app/discovery/page.tsx`
- `app/events/page.tsx`

### Components

- `components/layout/ModulePlaceholder.tsx` (shared placeholder layout)

### Documentation

- `docs/NAVIGATION_AUDIT.md`
- `docs/ROUTE_MATRIX.md`
- `docs/PLATFORM_STABILIZATION.md`

## Files modified

- `components/layout/Navbar.tsx` — Conferences/Journals anchors → routes
- `components/layout/Footer.tsx` — Conferences/Journals anchors → routes
- `components/layout/index.ts` — export `ModulePlaceholder`
- `components/home/Hero.tsx` — Conferences/Journals CTAs → routes
- `components/security/LoginForm.tsx` — `href="#"` → `/forgot-password`
- `components/security/RegistrationForm.tsx` — `href="#"` → `/login`
- `components/security/PasswordResetForm.tsx` — `href="#"` → `/login`
- `constants/config.ts` — Conferences/Journals anchors → routes
- `constants/index.ts` — Conferences/Journals anchors → routes

## Verification

- `npm run lint` — passes. Single pre-existing warning only
  (`Avatar.tsx` `<img>` element).
- `npm run build` — passes.

## Platform readiness assessment

The Scholatia platform is **ready for Phase 1.0**:

- **Navigation:** every internal destination resolves; zero 404s from
  navigation.
- **Routes:** 41 routes total — 10 implemented, 12 partial placeholders,
  5 full placeholders, 14 new placeholders created this phase.
- **Design:** all placeholder pages reuse the existing design language
  (`PageLayout`, `PageHeader`, `Container`, `SectionCard`, `Alert`, `Badge`).
- **Architecture:** unchanged. No authentication, APIs, or databases
  introduced.
- **Journals Platform preparation:** the `Journals` navigation destination
  resolves to `/journals`, and the Scholarly Publishing Platform placeholder
  (`/publishing`) is in place.

Phase 0.95 is complete. Phase 1.0 has not been started.
