import { createSaidIdentifier, SAID_PREFIX } from '@/lib/said';
import { VerificationLevel } from '@/types/identity';
import type {
  AcademicIdentity,
  ResearcherProfile,
  ResearcherStatistics,
} from '@/types/researcher';

/**
 * Researcher Identity utilities (Scholatia Phase 1.4).
 *
 * Username / subdomain preparation for the Researcher Identity Platform.
 *
 * Every researcher owns a permanent username (e.g. `ojuri`, `smith`, `adebayo`)
 * that today resolves to `/researchers/[username]` and is future-ready to be
 * served from a personal academic subdomain (`ojuri.scholatia.com`).
 *
 * DNS is intentionally NOT implemented. These utilities only prepare stable,
 * validated slugs and URL builders so the routing layer can switch to
 * subdomains without touching placeholder data.
 */

export const RESEARCHER_SUBDOMAIN_ROOT = 'scholatia.com';

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

/**
 * Generates a canonical researcher slug from any display name or username.
 * Lowercases, strips accents, collapses separators, and trims hyphens.
 */
export function generateResearcherSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates a researcher slug against the platform grammar:
 * 1-32 characters, lowercase alphanumeric, optional internal hyphens.
 */
export function validateResearcherSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export type ResearcherUrlMode = 'route' | 'subdomain';

/**
 * Builds the public URL for a researcher profile.
 *
 * Today this resolves to the Next.js route `/researchers/[username]`. When the
 * platform moves to per-researcher subdomains it will emit
 * `https://<username>.scholatia.com` instead — the caller only changes the
 * `mode` flag; placeholder data never changes.
 */
export function buildResearcherUrl(
  username: string,
  options: { mode?: ResearcherUrlMode } = {}
): string {
  const { mode = 'route' } = options;
  if (mode === 'subdomain') {
    return `https://${username}.${RESEARCHER_SUBDOMAIN_ROOT}`;
  }
  return `/researchers/${username}`;
}

/**
 * Formats a deterministic, unique-looking ORCID iD from a numeric index.
 * ORCID structure: 0000-000X-XXXX-XXXX.
 */
export function formatOrcid(index: number): string {
  const seed = (index * 7919 + 1825) % 10000;
  const a = (index * 31337) % 10000;
  const b = (seed * 977) % 10000;
  const pad = (value: number) => value.toString().padStart(4, '0');
  return `0000-0002-${pad(a)}-${pad(b)}`;
}

export function createAcademicIdentity(
  firstName: string,
  lastName: string,
  index: number,
  overrides: Partial<AcademicIdentity> = {}
): AcademicIdentity {
  return {
    said: createSaidIdentifier(index),
    displayName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    orcid: formatOrcid(index),
    verificationLevel: VerificationLevel.PublicationVerified,
    isVerified: true,
    memberSince: '2024-01-01',
    ...overrides,
  };
}

export function getResearcherByUsername(
  researchers: readonly ResearcherProfile[],
  username: string
): ResearcherProfile | undefined {
  return researchers.find((researcher) => researcher.username === username);
}

export function getResearcherBySaid(
  researchers: readonly ResearcherProfile[],
  said: string
): ResearcherProfile | undefined {
  return researchers.find((researcher) => researcher.identity.said === said);
}

export function summarizeResearcherPortfolio(
  researchers: readonly ResearcherProfile[]
): ResearcherStatistics {
  const countries = new Set(researchers.map((researcher) => researcher.country));
  const institutions = new Set(researchers.map((researcher) => researcher.position.institution));
  const disciplines = new Set(
    researchers.flatMap((researcher) => researcher.biography.areasOfExpertise)
  );

  return {
    totalResearchers: researchers.length,
    totalCountries: countries.size,
    totalInstitutions: institutions.size,
    totalDisciplines: disciplines.size,
    totalPublications: researchers.reduce(
      (sum, researcher) => sum + researcher.metrics.totalPublications,
      0
    ),
    totalCitations: researchers.reduce(
      (sum, researcher) => sum + researcher.metrics.totalCitations,
      0
    ),
    totalProjects: researchers.reduce(
      (sum, researcher) => sum + researcher.metrics.totalProjects,
      0
    ),
    totalDatasets: researchers.reduce(
      (sum, researcher) => sum + researcher.metrics.totalDatasets,
      0
    ),
    verifiedResearchers: researchers.filter((researcher) => researcher.verification.verified).length,
    avgTrustScore: Math.round(
      researchers.reduce((sum, researcher) => sum + researcher.verification.trustScore, 0) /
        Math.max(researchers.length, 1)
    ),
    totalFollowers: researchers.reduce(
      (sum, researcher) => sum + researcher.metrics.totalFollowers,
      0
    ),
    totalCollaborators: researchers.reduce(
      (sum, researcher) => sum + researcher.metrics.totalCollaborators,
      0
    ),
  };
}

export function formatResearchMetric(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export { SAID_PREFIX };
