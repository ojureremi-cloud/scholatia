/**
 * E-22 Identity Engine — Mission 004-D (Wave 2).
 *
 * Pure identity helpers that resolve canonical researchers (username/SAID)
 * into CRIE principals (CRIE Ch. 46; fspec Ch. 5). CRIE never duplicates
 * authentication logic: canonical identities come from the platform Identity
 * and Auth modules (`lib/auth/*`, `lib/said.ts`), and this engine only
 * projects reference-shaped `ResearcherRef` / `PrincipalRef` records.
 */
import type {
  PrincipalKind,
  PrincipalRef,
  ResearcherRef,
} from '@/types/crie';
import type { ScholatiaAcademicIdentity } from '@/types/identity';
import { createSaidIdentifier, SAID_FORMAT, SAID_PREFIX } from '@/lib/said';

export function researcherRef(username: string, name?: string): ResearcherRef {
  return { username, name };
}

/** Resolve the canonical researcher projection of a SAID academic identity. */
export function researcherOf(identity: ScholatiaAcademicIdentity): ResearcherRef {
  return { username: identity.said, name: identity.displayName };
}

export function principalRef(kind: PrincipalKind, id: string, name?: string): PrincipalRef {
  return { kind, id, name };
}

/** Project an academic identity as a researcher principal (never copied). */
export function criePrincipalOf(identity: ScholatiaAcademicIdentity): PrincipalRef {
  return principalRef('researcher', identity.said, identity.displayName);
}

/** Reuse the canonical SAID minting helper for seed identities. */
export function saidIdentifier(index: number): string {
  return createSaidIdentifier(index);
}

export interface IdentityVerification {
  verified: boolean;
  level: number;
  trustScore?: number;
}

/** Derived verification posture of a canonical identity (never authoritative). */
export function identityVerification(identity: ScholatiaAcademicIdentity): IdentityVerification {
  return {
    verified: identity.isVerified,
    level: identity.verificationLevel,
    trustScore: identity.trustScore,
  };
}

export interface IdentitySummary {
  total: number;
  verified: number;
  withTrustScore: number;
  averageTrustScore: number;
}

/** Derived aggregate over canonical identities (explicitly cached). */
export function identitySummary(
  identities: readonly ScholatiaAcademicIdentity[],
): IdentitySummary {
  let verified = 0;
  let withTrustScore = 0;
  let trustTotal = 0;
  for (const identity of identities) {
    if (identity.isVerified) verified += 1;
    if (identity.trustScore !== undefined) {
      withTrustScore += 1;
      trustTotal += identity.trustScore;
    }
  }
  return {
    total: identities.length,
    verified,
    withTrustScore,
    averageTrustScore: withTrustScore === 0 ? 0 : Math.round(trustTotal / withTrustScore),
  };
}

export const CRIE_SAID_FORMAT = SAID_FORMAT;
export const CRIE_SAID_PREFIX = SAID_PREFIX;
