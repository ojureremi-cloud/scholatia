# Scholatia Authentication & User Account Platform Architecture

## Purpose

Phase 1.1 delivers a complete authentication and user account platform for
Scholatia: secure registration, email verification, password-based sign in,
session management, password recovery/reset, logout, and profile management,
layered on the existing SAID identity model and protected by a 10-role RBAC
engine.

The platform is **additive**. It reuses the existing SAID identity vocabulary
(`lib/auth.ts`, `lib/said.ts`, `types/identity.ts`, `types/security.ts`), the
existing design system and auth page shells (`app/login`, `app/register`,
`app/forgot-password`, `app/reset-password`), and the existing client hooks
(`hooks/useAuth.ts`, `hooks/useSession.ts`, `hooks/usePermissions.ts`,
`hooks/useCurrentUser.ts`, `hooks/useRequireRole.ts`). It introduces a
persistence-ready schema (`db/schema.sql`), an in-memory repository that mirrors
it, typed API contracts, and Next.js route handlers — with no external
database, ORM, or third-party auth dependency.

## Authentication flow

```
Guest ──(register)──▶ PendingVerification ──(verify-email)──▶ Active/EmailVerified
                                                                    │
Guest ◀──(logout)─────────────────────────────────────────── Signed-in
```

1. **Register** — `POST /api/auth/register`. Validates input
   (`lib/auth/validation.ts`), hashes the password with scrypt
   (`lib/auth/password.ts`), creates a `UserRow` (Student role,
   `PendingVerification`, `Unverified`), a `ProfileRow`, a SAID record via
   `createSaidIdentifier`, and a single-use verification token. The response
   includes a `verificationUrl` (`/verify-email?token=...&email=...`).
   No email service is connected in Phase 1.1, so the link is returned inline.
2. **Verify email** — the `/verify-email` page (server component) and
   `GET/POST /api/auth/verify-email` both call `verifyEmail()`. The token is
   consumed, the user becomes `Active`/`EmailVerified`, and the linked SAID is
   marked verified. Tokens expire after 24h.
3. **Sign in** — `POST /api/auth/login`. `authenticateUser()` rejects
   `PendingVerification`/unverified users with `403 email_not_verified`.
   `createUserSession()` stores a session row and returns a signed session
   token (HMAC-SHA256, `lib/auth/tokens.ts`). The token is set as the
   `scholatia_session` cookie (`HttpOnly`, `Secure` in production,
   `SameSite=Lax`). Sessions default to 24h, or 30 days with "remember me".
4. **Session read** — `GET /api/auth/session` (and the route guard) resolve the
   cookie, verify the signature, and confirm the session row is unrevoked and
   unexpired via `getRequestSession()`.
5. **Password recovery** — `POST /api/auth/reset-password` with an email
   issues a 1h single-use reset token (demo `resetUrl` returned inline).
   The same endpoint with `token` + `newPassword` performs the reset, rehashes
   the password, and revokes all active sessions.
6. **Logout** — `POST /api/auth/logout` revokes the session and clears the
   cookie; `GET /api/auth/logout` redirects to `/login`.

## Route protection (Next.js 16 Proxy)

`proxy.ts` implements route protection using the Next.js 16 Proxy (the renamed
middleware). It protects `/dashboard`, `/settings`, `/identity`,
`/verification`, `/research`, `/projects`, `/manuscripts`, `/datasets`, and
`/collaborators`, redirecting unauthenticated visitors to
`/login?next=<pathname>`. The check is **optimistic** (signed-cookie validation
without a database lookup, per Next.js authentication guidance); API routes
perform the authoritative session and RBAC checks. Public auth routes
(`/login`, `/register`, `/forgot-password`, `/reset-password`,
`/verify-email`) are always reachable. The matcher excludes `/api`,
`_next/*`, and static assets.

## API surface

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/auth/register` | POST | Create account + SAID + verification token | public |
| `/api/auth/login` | POST | Verify credentials, create session, set cookie | public |
| `/api/auth/logout` | POST/GET | Revoke session, clear cookie | session |
| `/api/auth/verify-email` | GET/POST | Consume token, activate account | public |
| `/api/auth/reset-password` | POST | Issue/reset password tokens | public |
| `/api/auth/session` | GET | Current session + user + active sessions | session |
| `/api/profile` | GET/PATCH | Read/update own profile (`read:profile`/`write:profile`) | session + RBAC |

All handlers return a uniform envelope: `{ "data": ... }` on success or
`{ "error": { "code", "message", "fieldErrors? } }` on failure
(`lib/auth/response.ts`). Error codes are defined in `types/auth.ts`
(`AuthErrorCode`).

## Module map

| File | Responsibility |
|---|---|
| `types/auth.ts` | API request/response contracts, `AuthErrorCode`. |
| `types/schema.ts` | Row models mirroring `db/schema.sql`. |
| `lib/auth/password.ts` | scrypt hashing/verification, password strength. |
| `lib/auth/tokens.ts` | Cookie name, TTLs, random tokens, HMAC sign/verify. |
| `lib/auth/session.ts` | Cookie get/set/delete and token decode helpers. |
| `lib/auth/validation.ts` | Email normalization, register/login/reset validation. |
| `lib/auth/store.ts` | In-memory repository (global singleton, see below). |
| `lib/auth/service.ts` | Auth domain service: register, login, verify, reset, sessions. |
| `lib/auth/response.ts` | JSON envelope helpers and body parsing. |
| `db/schema.sql` | Production PostgreSQL DDL mirroring the repository. |
| `proxy.ts` | Next.js 16 route protection. |
| `app/api/auth/*` | Route handlers. |
| `components/security/*` | Client forms and `SessionControls`. |

## In-memory repository and the global singleton

Route handlers and server components compile into **separate server bundles**.
Module-scoped `Map`s would give each bundle its own copy of state and break the
register → verify-email page → login flow. The repository therefore stores all
state on a `globalThis`-scoped singleton (`__scholatiaStore` in
`lib/auth/store.ts`), shared across bundles within a single server process.
Moving to a real database requires only replacing the repository functions —
the service, API, and proxy layers are storage-agnostic.

## Client integration

- `components/security/SessionControls.tsx` fetches `GET /api/auth/session` on
  mount and renders either a user menu (Profile, Account settings, Sign out)
  or the Login/Register buttons. It is wired into `components/layout/Navbar.tsx`.
- The auth forms (`LoginForm`, `RegistrationForm`, `ForgotPasswordForm`,
  `ResetPasswordForm`, `PasswordResetForm`) post to the corresponding API
  routes, surface `fieldErrors`/messages, and navigate on success
  (`/login` honors the `next` parameter).
- Registration shows the demo verification link; both reset forms surface the
  demo reset link.

## Security considerations

- Passwords are hashed with scrypt (`salt:hash` encoding), never stored in
  plaintext.
- Verification and reset tokens are single-use, expire, and are only stored as
  SHA-256 hashes on the row (`tokenHash`).
- Session cookies are `HttpOnly`, `Secure` (production), `SameSite=Lax`, and
  signed with a server secret (`SESSION_SECRET`, dev fallback).
- Email comparison during verification is case/whitespace-normalized.
- Password reset revokes all existing sessions.
- RBAC decisions in `lib/rbac.ts` require an email-verified account for
  permissions other than `read:profile`.
