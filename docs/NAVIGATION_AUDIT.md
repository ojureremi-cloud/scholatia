# Scholatia Navigation Audit

**Phase 0.95 — Platform Stabilization & Navigation Completion**

Date of audit: 31 July 2026

## Scope

Every navigation surface in the application was audited:

- Header / Navbar
- Footer
- Mega navigation
- Responsive mobile navigation
- Cards and feature cards
- Buttons and CTA buttons
- Hero CTAs
- Dropdowns
- Quick links
- Dashboard links
- Internal links across pages and components

## Navigation surfaces

### 1. Navbar (`components/layout/Navbar.tsx`)

Rendered on the home page and on every page via `PageLayout`.

| Label | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| Home | `#home` | Yes (home section) | No | No | No |
| Conferences | `/conferences` | Yes (route) | No (fixed in 0.95) | Yes | Yes |
| Journals | `/journals` | Yes (route) | No (fixed in 0.95) | Yes | Yes |
| People | `#people` | Yes (home section) | No | No | No |
| Institutions | `#institutions` | Yes (home section) | No | No | No |
| About | `#about` | Yes (home section) | No | No | No |
| Contact | `#contact` | Yes (home section) | No | No | No |
| Login (button) | `/login` | Yes (route) | No (created in 0.95) | Yes | Yes |
| Register (button) | `/register` | Yes (route) | No (created in 0.95) | Yes | Yes |

Notes:

- `#conferences` and `#journals` previously had **no target element anywhere in the app** and were converted to the real `/conferences` and `/journals` routes.
- The remaining `#` anchors (`#home`, `#people`, `#institutions`, `#about`, `#contact`) are intentional one-page landing navigation and resolve to home-page sections. On internal pages they render but do not scroll; converting the full header/footer to routed navigation is a Phase 1.0 concern (see `PLATFORM_STABILIZATION.md`).

### 2. Footer (`components/layout/Footer.tsx`)

Rendered on the home page and on every page via `PageLayout`.

| Label | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| Conferences | `/conferences` | Yes (route) | No (fixed in 0.95) | Yes | Yes |
| Journals | `/journals` | Yes (route) | No (fixed in 0.95) | Yes | Yes |
| People | `#people` | Yes (home section) | No | No | No |
| Institutions | `#institutions` | Yes (home section) | No | No | No |
| About | `#about` | Yes (home section) | No | No | No |
| Contact | `#contact` | Yes (home section) | No | No | No |
| Privacy | `/privacy` | Yes (route) | No (created in 0.95) | No | No |
| Terms | `/terms` | Yes (route) | No (created in 0.95) | No | No |

### 3. Hero CTAs (`components/home/Hero.tsx`)

| Label | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| Explore Conferences | `/conferences` | Yes (route) | No (fixed in 0.95) | Yes | Yes |
| Find Journals | `/journals` | Yes (route) | No (fixed in 0.95) | Yes | Yes |

### 4. CallToAction (`components/home/CallToAction.tsx`)

| Label | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| Create Free Account | `/register` | Yes (route) | No (created in 0.95) | Yes | Yes |
| Explore Platform | `#services` | Yes (home section) | No | No | No |

### 5. Logo (`components/ui/Logo.tsx`)

| Label | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| Scholatia logo | `#home` | Yes (home section) | No | No | No |

### 6. Mega navigation (`components/layout/MegaNavigation.tsx`) — currently unused

| Label | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| Navigation items | `#` home sections | Yes (home sections) | No | No | No |
| Events | `#services` | Yes (home section) | No | No | Yes |
| Publishing | `#services` | Yes (home section) | No | No | Yes |
| Identity | `#services` | Yes (home section) | No | No | Yes |
| Discovery | `#services` | Yes (home section) | No | No | Yes |

Notes:

- `MegaNavigation` is defined but not rendered by any page. It remains available for Phase 1.0, where its module entries should point to `/events`, `/publishing`, `/identity`, and `/discovery`.

### 7. Responsive mobile navigation (`components/layout/ResponsiveMobileNavigation.tsx`) — currently unused

Same entries as the Navbar; the Conferences and Journals targets were corrected to `/conferences` and `/journals` via the shared `constants/config.ts`.

### 8. Identity hub (`app/identity/page.tsx`)

| Route | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- |
| `/profile` | Yes | No | No | No |
| `/publications` | Yes | No | No | No |
| `/projects` | Yes | No | No | No |
| `/education` | Yes | No | No | No |
| `/experience` | Yes | No | No | No |
| `/skills` | Yes | No | No | No |
| `/interests` | Yes | No | No | No |
| `/awards` | Yes | No | No | No |
| `/grants` | Yes | No | No | No |
| `/affiliations` | Yes | No | No | No |
| `/collaborators` | Yes | No | No | No |
| `/orcid` | Yes | No | No | No |
| `/verification` | Yes | No | No | No |
| `/analytics` | Yes | No | No | No |
| `/settings` | Yes | No | No | No |

### 9. Research module links

| Source | Target | Exists? | Broken? | Placeholder? | Needs implementation? |
| --- | --- | --- | --- | --- | --- |
| `ResearchProjectHeader` button | `/research/create` | Yes (route) | No (created in 0.95) | Yes | Yes |
| `ResearchProjectHeader` button | `/research` | Yes | No | No | No |
| `ResearchProjectCard` link | `/research/[id]` | Yes (route) | No (created in 0.95) | Yes | Yes |
| `/research` header action | `/projects` | Yes | No | No | No |
| `/research` header action | `/publications` | Yes | No | No | No |
| `/projects` header action | `/research` | Yes | No | No | No |
| `/manuscripts` header actions | `/projects`, `/research` | Yes | No | No | No |
| `/datasets` header actions | `/projects`, `/research` | Yes | No | No | No |

### 10. Security form links (previously dead `href="#"`)

| Source | Label | Target | Exists? | Broken? | Fixed in |
| --- | --- | --- | --- | --- | --- |
| `LoginForm` | Forgot password? | `/forgot-password` | Yes | No | 0.95 |
| `RegistrationForm` | Sign in | `/login` | Yes | No | 0.95 |
| `PasswordResetForm` | Return to sign in | `/login` | Yes | No | 0.95 |

### 11. Datasets download CTA

| Source | Target | Exists? | Broken? | Notes |
| --- | --- | --- | --- | --- |
| `DatasetDownloadCard` button | `#download` | No target element | Latent | Decorative CTA on the illustrative datasets page; no target section exists. Left unchanged because the datasets module is fully implemented and the button is an action (download) rather than a navigation link. Deferred to Phase 1.0. |

### 12. External links (verified, out of scope)

| Source | Target | Type |
| --- | --- | --- |
| `OrcidStatusCard` | `https://orcid.org/...` | External |
| `SocialLinksCard` / `AcademicLinksCard` / `/profile` | twitter.com, linkedin.com, scholar.google.com, researchgate.net | External |
| `Footer` social | linkedin.com, twitter.com | External |

## Navigation consistency

- Every internal navigation destination in the application now resolves to an existing route.
- No navigation destination results in a 404.
- Duplicate destinations removed: Conferences and Journals no longer point to dead `#` anchors; they resolve to `/conferences` and `/journals`.
- Naming consistency: labels match route slugs (`Conferences` → `/conferences`, `Journals` → `/journals`, `Login` → `/login`, `Register` → `/register`).
