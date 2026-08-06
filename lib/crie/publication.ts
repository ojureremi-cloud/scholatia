/**
 * E-17 Publication Engine — Mission 004-D (Wave 2).
 *
 * Pure publication helpers over `PublicationPlan`, `SubmissionPackage`,
 * `ReadinessCheck`, `JournalProfile`, `JournalMatch`, and `ConferenceMatch`
 * (CRIE Chs. 26–28).
 */
import type {
  ConferenceMatch,
  JournalMatch,
  PackageStatus,
  ProvenanceRef,
  PublicationPlan,
  PublicationPlanStatus,
  PublicationTargetType,
  ReadinessCheck,
  ResearcherRef,
  SubmissionPackage,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function publicationPlanId(label: string): string {
  return `pub-plan-${slugOf(label)}`;
}

export interface PublicationPlanInput {
  label: string;
  researchEntityId: string;
  owner: ResearcherRef;
  targetType: PublicationTargetType;
  targets?: string[];
  status?: PublicationPlanStatus;
}

export function createPublicationPlan(input: PublicationPlanInput): PublicationPlan {
  const now = nowIso();
  return {
    id: publicationPlanId(input.label),
    researchEntityId: input.researchEntityId,
    owner: input.owner,
    targetType: input.targetType,
    status: input.status ?? 'drafting',
    targets: input.targets ?? [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface SubmissionPackageInput {
  label: string;
  publicationPlanId: string;
  manuscriptId?: string;
  coverLetter?: string;
  metadata?: Record<string, unknown>;
  readiness?: ReadinessCheck[];
  packageStatus?: PackageStatus;
}

export function assemblePackage(input: SubmissionPackageInput): SubmissionPackage {
  const now = nowIso();
  return {
    id: `package-${slugOf(input.label)}`,
    publicationPlanId: input.publicationPlanId,
    packageStatus: input.packageStatus ?? 'assembling',
    manuscriptId: input.manuscriptId,
    coverLetter: input.coverLetter,
    metadata: input.metadata ?? {},
    readiness: input.readiness ?? [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function readinessChecks(checks: readonly ReadinessCheck[]): readonly ReadinessCheck[] {
  return checks;
}

export function packageReady(pack: SubmissionPackage): boolean {
  return pack.readiness.length > 0 && pack.readiness.every((check) => check.passed);
}

export interface JournalMatchInput {
  label: string;
  publicationPlanId: string;
  journalProfileId: string;
  fitScore: number;
  rationale: string;
  confidenceValue?: number;
}

export function matchJournal(input: JournalMatchInput): JournalMatch {
  const now = nowIso();
  return {
    id: `journal-match-${slugOf(input.label)}`,
    publicationPlanId: input.publicationPlanId,
    journalProfileId: input.journalProfileId,
    fitScore: round(Math.max(0, Math.min(1, input.fitScore))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export interface ConferenceMatchInput {
  label: string;
  researchEntityId: string;
  conferenceId: string;
  fitScore: number;
  rationale: string;
  provenance: ProvenanceRef;
  confidenceValue?: number;
}

export function matchConference(input: ConferenceMatchInput): ConferenceMatch {
  const now = nowIso();
  return {
    id: `conference-match-${slugOf(input.label)}`,
    researchEntityId: input.researchEntityId,
    conferenceId: input.conferenceId,
    fitScore: round(Math.max(0, Math.min(1, input.fitScore))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    rationale: input.rationale,
    provenance: input.provenance,
    createdAt: now,
    updatedAt: now,
  };
}

export interface PublicationStatistics {
  plans: number;
  readyPackages: number;
  journalMatches: number;
  conferenceMatches: number;
}

export function publicationStatistics(
  plans: readonly PublicationPlan[],
  packages: readonly SubmissionPackage[] = [],
  journalMatches: readonly JournalMatch[] = [],
  conferenceMatches: readonly ConferenceMatch[] = [],
): PublicationStatistics {
  const readyPackages = packages.filter(packageReady).length;
  return {
    plans: plans.length,
    readyPackages,
    journalMatches: journalMatches.length,
    conferenceMatches: conferenceMatches.length,
  };
}
