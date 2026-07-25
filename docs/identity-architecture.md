# Scholatia Identity & Trust Architecture

## Scholatia Academic Identity (SAID)

Scholatia Academic Identity (SAID) is the universal permanent identity layer for every user.

- Each member receives a unique `SAID`.
- Example format: `SAID-000000001`.
- SAID remains constant regardless of institution, country, employer, degree or research field.

## Account categories

### Individual Accounts

- Student
- Researcher
- Lecturer
- Professor
- Industry Professional
- Reviewer
- Editor
- Mentor

### Organisation Accounts

- Institution
- Journal
- Conference
- Publisher
- Funding Organisation
- Professional Association

## Verification levels

The architecture supports verification levels from 0 to 6:

- Level 0: Unverified
- Level 1: Email Verified
- Level 2: Phone Verified
- Level 3: Institution Verified
- Level 4: Identity Verified
- Level 5: Research Verified
- Level 6: Fully Trusted Scholatia Member

## Trust framework

The trust framework will be built around a trust score and supporting data model.
It should later consider:

- Academic verification
- Publication history
- Peer review activity
- Editorial service
- Conference participation
- Institution affiliation
- Research integrity
- Community contributions
- Verification level
- Professional endorsements

## Reusable component architecture

Prepare reusable components for the identity ecosystem:

- `IdentityCard`
- `VerificationBadge`
- `TrustBadge`
- `RoleBadge`
- `InstitutionBadge`

## Security architecture support

The future architecture must support:

- Role-Based Access Control (RBAC)
- Audit logs
- Identity verification
- Permission groups
- Multi-factor authentication readiness

## File organization

- `types/identity.ts` for shared identity, verification and trust type definitions
- `components/ui/` for reusable identity and trust UI primitives
- `docs/identity-architecture.md` for architecture guidance
