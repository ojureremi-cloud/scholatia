/**
 * CRIE external connector types (fspec §2.14).
 *
 * `Connector` is a registered external AI capability adapter; `ConnectorCall`
 * is a logged external call with purpose and data scope. Connectors are
 * provider-neutral (P13) and sandboxed (CRIE Ch. 44).
 */
import type { Auditable, ProvenanceRef, ResearcherRef } from './base';

export type ConnectorCapability =
  | 'language'
  | 'embeddings'
  | 'ocr'
  | 'translation'
  | 'speech'
  | 'search'
  | 'vision'
  | 'reasoning';

export const CONNECTOR_CAPABILITIES: readonly ConnectorCapability[] = [
  'language',
  'embeddings',
  'ocr',
  'translation',
  'speech',
  'search',
  'vision',
  'reasoning',
];

export type RiskClass = 'low' | 'medium' | 'high' | 'critical';

export type ConnectorStatus = 'registered' | 'verified' | 'active' | 'suspended' | 'retired';

/** A registered external AI capability adapter. */
export interface Connector extends Auditable {
  id: string;
  provider: string;
  capability: ConnectorCapability;
  riskClass: RiskClass;
  status: ConnectorStatus;
  sandboxConfig: Record<string, unknown>;
}

export type ExternalCallPurpose =
  | 'perception'
  | 'generation'
  | 'retrieval'
  | 'verification'
  | 'translation'
  | 'analysis';

/** A logged external call with purpose and data scope. */
export interface ConnectorCall extends Auditable {
  id: string;
  connectorId: string;
  researcher: ResearcherRef;
  purpose: ExternalCallPurpose;
  dataScope: Record<string, unknown>;
  provenance: ProvenanceRef;
  cost?: number;
}
