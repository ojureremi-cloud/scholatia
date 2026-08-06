/**
 * CRIE innovation types (fspec §2.10).
 *
 * `InnovationOpportunity` is an innovation opportunity analysis (CRIE Ch. 31).
 */
import type { Auditable, ConfidenceScore } from './base';

export type InnovationOpportunityType =
  | 'product'
  | 'service'
  | 'startup'
  | 'licensing'
  | 'partnership'
  | 'open-source';

/** An innovation opportunity analysis. */
export interface InnovationOpportunity extends Auditable {
  id: string;
  researchEntityId: string;
  opportunityType: InnovationOpportunityType;
  title: string;
  score: number; // 0..1
  confidence: ConfidenceScore;
  rationale: string;
  marketSignal?: string;
}
