/**
 * CRIE federation types (fspec §2.15).
 *
 * `FederationContract` governs a federation relationship; `GovernedExchange`
 * is a governed exchange between sovereign members; `MemberSovereignty`
 * records the boundaries of member autonomy (CRIE Ch. 66).
 */
import type { Auditable, ConfidenceScore } from './base';

export type FederationContractType = 'research-data' | 'aggregate-analytics' | 'knowledge-exchange';

export type FederationStatus = 'negotiating' | 'active' | 'suspended' | 'terminated';

/** The agreement governing a federation relationship. */
export interface FederationContract extends Auditable {
  id: string;
  institutionId: string;
  memberInstitutionId: string;
  contractType: FederationContractType;
  status: FederationStatus;
  dataScope: string[];
  consentScope: string[];
  sovereigntyClauses: string[];
}

export type ExchangeType = 'query' | 'contribution' | 'aggregate' | 'signal';

/** A governed federation exchange. */
export interface GovernedExchange extends Auditable {
  id: string;
  federationContractId: string;
  exchangeType: ExchangeType;
  payloadRef: string;
  consentScope: string[];
  confidence: ConfidenceScore;
}

/** The sovereignty boundaries of a federation member. */
export interface MemberSovereignty {
  institutionId: string;
  governingContractIds: string[];
  reservedRights: string[];
  sharedSignals: string[];
  neverShared: string[];
}
