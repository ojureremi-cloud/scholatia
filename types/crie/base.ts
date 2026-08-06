/**
 * CRIE reusable base models (fspec §4.1).
 *
 * These are the foundational types shared by every CRIE domain module:
 * stable CRIE graph identifiers, canonical researcher references, audit and
 * versioning fields, provenance by construction (P3), and calibrated
 * confidence (P11, L5). They mirror the CRIE database conventions in
 * `db/schema.sql` (CRIE-IDs, UUIDs, `TIMESTAMPTZ` audit fields, soft delete,
 * versioning) and are reference-based: no module record is ever duplicated.
 */

import type { KGEntityClass } from './knowledge';

/** Stable CRIE graph identifier (CRIE-ID) — never duplicated. */
export interface CrieIdRef {
  crieId: string;
  entityClass: KGEntityClass;
}

/** Canonical researcher reference — never duplicated. */
export interface ResearcherRef {
  username: string; // canonical researcher username (SAID)
  name?: string;
  avatarUrl?: string;
}

/** Canonical principal — a human or system actor that CRIE serves or guards. */
export interface PrincipalRef {
  kind: PrincipalKind;
  id: string;
  name?: string;
}

/** The kinds of principals recognised by the CRIE governance layer. */
export type PrincipalKind =
  | 'researcher'
  | 'institution'
  | 'system'
  | 'agent'
  | 'service';

/** Shared audit fields (mirrors db/schema.sql). */
export interface Auditable {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/** Soft-deletable + versioned record. */
export interface Versioned {
  version: number; // default 1
  deletedAt?: string | null; // soft delete
}

/** Provenance by construction (P3). */
export interface ProvenanceRef {
  sourceType: string; // document, dataset, system, human, agent
  sourceId: string;
  actorUsername?: string;
  assertedAt: string;
  method: 'extraction' | 'inference' | 'human-curation';
  version: number;
}

/** Calibrated epistemic weight (P11, L5). */
export interface ConfidenceScore {
  value: number; // 0..1 calibrated
  band: ConfidenceBand;
  basis?: string; // provenance pointer
}

export type ConfidenceBand =
  | 'very-low'
  | 'low'
  | 'medium'
  | 'high'
  | 'very-high';

/** Alias used across the CRIE domain model for calibrated epistemic weight. */
export type ConfidenceValue = ConfidenceScore;

/** Canonical lifecycle state of knowledge entities. */
export type EntityLifecycleState =
  | 'proposed'
  | 'confirmed'
  | 'deprecated'
  | 'superseded';

/** Access classes governing who may read a CRIE record (CRIE Ch. 60). */
export type AccessClass =
  | 'public'
  | 'institution'
  | 'collaborators'
  | 'researcher'
  | 'private';

/** Consent scopes governing data use (CRIE Ch. 60; `crie_consent_record`). */
export type ConsentScope =
  | 'research-analytics'
  | 'learning-signals'
  | 'memory'
  | 'context'
  | 'digital-twin'
  | 'federation'
  | 'career'
  | 'publication-assist'
  | 'grant-assist'
  | 'none';

/** CRIE capability labels for human surfaces (Partial because not all have labels). */
export const CRIE_BASE_LABELS: Record<PrincipalKind, string> = {
  researcher: 'Researcher',
  institution: 'Institution',
  system: 'System principal',
  agent: 'Agent',
  service: 'External service',
};
