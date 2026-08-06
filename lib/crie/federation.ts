/**
 * E-21 Federation Engine — Mission 004-D (Wave 2).
 *
 * Pure federation helpers over `FederationContract`, `GovernedExchange`, and
 * `MemberSovereignty` (CRIE Ch. 66). Federation is reference-only: this
 * engine describes and governs exchanges between sovereign members; it never
 * performs networking or transfers data. Sovereignty boundaries and consent
 * scopes are always honoured.
 */
import type {
  ConfidenceScore,
  ExchangeType,
  FederationContract,
  FederationContractType,
  FederationStatus,
  GovernedExchange,
  MemberSovereignty,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function federationContractId(label: string): string {
  return `federation-${slugOf(label)}`;
}

export interface FederationContractInput {
  label: string;
  institutionId: string;
  memberInstitutionId: string;
  contractType: FederationContractType;
  dataScope: string[];
  consentScope: string[];
  sovereigntyClauses: string[];
  status?: FederationStatus;
}

export function createFederationContract(
  input: FederationContractInput,
): FederationContract {
  const now = nowIso();
  return {
    id: federationContractId(input.label),
    institutionId: input.institutionId,
    memberInstitutionId: input.memberInstitutionId,
    contractType: input.contractType,
    status: input.status ?? 'negotiating',
    dataScope: input.dataScope,
    consentScope: input.consentScope,
    sovereigntyClauses: input.sovereigntyClauses,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateContractStatus(
  contract: FederationContract,
  status: FederationStatus,
): FederationContract {
  const now = nowIso();
  return { ...contract, status, updatedAt: now };
}

export function contractsFor(
  contracts: readonly FederationContract[],
  institutionId: string,
): FederationContract[] {
  return contracts.filter(
    (contract) =>
      contract.institutionId === institutionId || contract.memberInstitutionId === institutionId,
  );
}

export function activeContracts(
  contracts: readonly FederationContract[],
): FederationContract[] {
  return contracts.filter((contract) => contract.status === 'active');
}

export function governedExchangeId(label: string): string {
  return `exchange-${slugOf(label)}`;
}

export interface GovernedExchangeInput {
  label: string;
  federationContractId: string;
  exchangeType: ExchangeType;
  payloadRef: string;
  consentScope: string[];
  confidenceValue?: number;
}

/** Record a governed exchange between federation members (reference-only). */
export function createGovernedExchange(input: GovernedExchangeInput): GovernedExchange {
  const now = nowIso();
  return {
    id: governedExchangeId(input.label),
    federationContractId: input.federationContractId,
    exchangeType: input.exchangeType,
    payloadRef: input.payloadRef,
    consentScope: input.consentScope,
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export function exchangesForContract(
  exchanges: readonly GovernedExchange[],
  federationContractId: string,
): GovernedExchange[] {
  return exchanges.filter((exchange) => exchange.federationContractId === federationContractId);
}

export function exchangesByType(
  exchanges: readonly GovernedExchange[],
  exchangeType: ExchangeType,
): GovernedExchange[] {
  return exchanges.filter((exchange) => exchange.exchangeType === exchangeType);
}

export function memberSovereigntyId(label: string): string {
  return `sovereignty-${slugOf(label)}`;
}

export interface MemberSovereigntyInput {
  label: string;
  institutionId: string;
  governingContractIds: string[];
  reservedRights: string[];
  sharedSignals: string[];
  neverShared: string[];
}

export function createMemberSovereignty(
  input: MemberSovereigntyInput,
): MemberSovereignty {
  return {
    institutionId: input.institutionId,
    governingContractIds: input.governingContractIds,
    reservedRights: input.reservedRights,
    sharedSignals: input.sharedSignals,
    neverShared: input.neverShared,
  };
}

export function sovereigntyFor(
  sovereignties: readonly MemberSovereignty[],
  institutionId: string,
): MemberSovereignty | undefined {
  return sovereignties.find((sovereignty) => sovereignty.institutionId === institutionId);
}

export interface FederationStatistics {
  contracts: number;
  activeContracts: number;
  exchanges: number;
  byContractType: Partial<Record<FederationContractType, number>>;
  byExchangeType: Partial<Record<ExchangeType, number>>;
}

export function federationStatistics(
  contracts: readonly FederationContract[],
  exchanges: readonly GovernedExchange[],
): FederationStatistics {
  const byContractType: Partial<Record<FederationContractType, number>> = {};
  const byExchangeType: Partial<Record<ExchangeType, number>> = {};
  let activeContractCount = 0;
  for (const contract of contracts) {
    byContractType[contract.contractType] = (byContractType[contract.contractType] ?? 0) + 1;
    if (contract.status === 'active') activeContractCount += 1;
  }
  for (const exchange of exchanges) {
    byExchangeType[exchange.exchangeType] = (byExchangeType[exchange.exchangeType] ?? 0) + 1;
  }
  return {
    contracts: contracts.length,
    activeContracts: activeContractCount,
    exchanges: exchanges.length,
    byContractType,
    byExchangeType,
  };
}

export function exchangeConfidence(exchange: GovernedExchange): ConfidenceScore {
  return exchange.confidence;
}
