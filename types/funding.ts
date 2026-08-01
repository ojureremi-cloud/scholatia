import type { GrantRole } from '@/types/researcher';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Canonical research lifecycle stage that every funding record in Scholatia
 * belongs to. Funding is stage 4 of the lifecycle, sitting immediately before
 * the Research Project stage (stage 5).
 */
export const FUNDING_LIFECYCLE_STAGE_ID: ResearchLifecycleStageId = 'funding';

/**
 * Currencies used across the Scholatia funding ecosystem. Multi-currency by
 * design: agencies, opportunities, awards, and budgets each declare their own
 * currency so no conversion is ever implied at the placeholder layer.
 */
export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'NGN'
  | 'ZAR'
  | 'JPY'
  | 'CNY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'KES'
  | 'EGP'
  | 'GHS'
  | 'BRL'
  | 'INR';

export type FundingAgencyType =
  | 'government'
  | 'intergovernmental'
  | 'international-organisation'
  | 'foundation'
  | 'philanthropic'
  | 'non-profit'
  | 'industry'
  | 'institutional'
  | 'venture'
  | 'consortium';

/**
 * Coarse category of funding, used for portfolio aggregation and navigation.
 * Covers the full ecosystem: grants, fellowships, scholarships, research
 * funds, seed funding, innovation funds, industry funding, government funding,
 * NGO funding, international funding, institutional funding, and venture
 * research funding.
 */
export type GrantCategory =
  | 'research-grant'
  | 'fellowship'
  | 'scholarship'
  | 'seed-funding'
  | 'innovation-fund'
  | 'industry-funding'
  | 'government-funding'
  | 'ngo-funding'
  | 'international-funding'
  | 'institutional-funding'
  | 'venture-research-funding';

export type GrantType =
  | 'research-grant'
  | 'fellowship'
  | 'scholarship'
  | 'seed'
  | 'innovation'
  | 'travel-grant'
  | 'equipment-grant'
  | 'doctoral-research'
  | 'postdoctoral-research'
  | 'collaborative'
  | 'capacity-building'
  | 'infrastructure';

/**
 * Aggregate status of a funding record. `under-review`, `awarded`, and
 * `declined` reflect the application pipeline; `completed` and `on-hold`
 * reflect an awarded grant in execution.
 */
export type FundingStatus =
  | 'open'
  | 'closed'
  | 'upcoming'
  | 'under-review'
  | 'awarded'
  | 'declined'
  | 'withdrawn'
  | 'completed'
  | 'on-hold';

/**
 * Fine-grained stage of the funding application pipeline, tracked alongside
 * the aggregate {@link FundingStatus}.
 */
export type ApplicationStage =
  | 'discovery'
  | 'expression-of-interest'
  | 'drafting'
  | 'submitted'
  | 'under-review'
  | 'interviews'
  | 'decision'
  | 'awarded'
  | 'declined'
  | 'withdrawn';

export type CareerStage =
  | 'undergraduate'
  | 'postgraduate'
  | 'masters'
  | 'doctoral'
  | 'postdoctoral'
  | 'early-career'
  | 'mid-career'
  | 'senior'
  | 'open-to-all';

export interface FundingRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

/**
 * Cross-module references owned by a funding record. Every entry reuses
 * existing placeholder identity (a project id, a SAID, a dataset DOI, a
 * journal id, a conference id) so no data is duplicated.
 */
export interface FundingRelationships {
  projects: FundingRelationshipRef[];
  researchers: FundingRelationshipRef[];
  institutions: FundingRelationshipRef[];
  datasets: FundingRelationshipRef[];
  manuscripts: FundingRelationshipRef[];
  journals: FundingRelationshipRef[];
  conferences: FundingRelationshipRef[];
  publications: FundingRelationshipRef[];
  agencies: FundingRelationshipRef[];
}

export type FundingDeadlineType =
  | 'Application'
  | 'Expression of Interest'
  | 'Full Proposal'
  | 'Interviews'
  | 'Decision'
  | 'Award'
  | 'Report';

export type DeadlinePriority = 'high' | 'medium' | 'low';

export interface FundingDeadline {
  id: string;
  title: string;
  agency: string;
  opportunityId?: string;
  type: FundingDeadlineType;
  date: string;
  priority: DeadlinePriority;
}

export interface FundingCalendarEntry {
  id: string;
  date: string;
  title: string;
  agency: string;
  opportunityId?: string;
  /** Derived `YYYY-MM` bucket used to group calendar entries by month. */
  month: string;
  type: FundingDeadlineType;
  priority: DeadlinePriority;
}

export type FundingTimelineEntryType =
  | 'Discovery'
  | 'Application'
  | 'Review'
  | 'Decision'
  | 'Award'
  | 'Milestone'
  | 'Reporting'
  | 'Completion';

export interface FundingTimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: FundingTimelineEntryType;
}

export interface FundingTimeline {
  entries: FundingTimelineEntry[];
}

export interface Eligibility {
  careerStages: CareerStage[];
  disciplines: string[];
  countries: string[];
  continents: string[];
  institutionTypes: string[];
  nationalityRestrictions?: string;
  openToInternational: boolean;
  requirements: string[];
  exclusions?: string[];
}

export interface ProposalRequirement {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  format?: string;
}

export interface EvaluationCriterion {
  id: string;
  label: string;
  /** Percentage weight of the criterion in the overall evaluation. */
  weight: number;
  description?: string;
}

/**
 * A monetary envelope expressed in a single {@link CurrencyCode}. Fields are
 * optional so the same shape describes a call, a budget line, and an award.
 */
export interface FundingAmount {
  currency: CurrencyCode;
  min?: number;
  max?: number;
  typical?: number;
  totalAvailable?: number;
}

export interface FundingAgencyContact {
  email?: string;
  phone?: string;
  address?: string;
  website: string;
  applicationPortal?: string;
  grantsOffice?: string;
}

export interface GrantCall {
  id: string;
  programmeId?: string;
  agencyId: string;
  title: string;
  description: string;
  category: GrantCategory;
  status: 'open' | 'closed' | 'upcoming';
  openedAt?: string;
  deadline: string;
  decisionDate?: string;
  durationMonths: number;
  funding: FundingAmount;
  eligibility: Eligibility;
  researchAreas: string[];
  evaluationCriteria: EvaluationCriterion[];
  proposalRequirements: ProposalRequirement[];
  contact?: FundingAgencyContact;
  howToApply?: string;
  website?: string;
}

export interface FundingProgramme {
  id: string;
  agencyId: string;
  name: string;
  description: string;
  category: GrantCategory;
  focusAreas: string[];
  durationMonths?: number;
  funding?: FundingAmount;
  calls: GrantCall[];
}

export interface FundingAgency {
  id: string;
  name: string;
  acronym: string;
  type: FundingAgencyType;
  country: string;
  region: string;
  continent: string;
  logo: string;
  website: string;
  foundedYear?: number;
  description: string;
  mission?: string;
  focusAreas: string[];
  disciplines: string[];
  annualBudget?: number;
  currency?: CurrencyCode;
  averageAwardSize?: number;
  openOpportunities?: number;
  verificationStatus: 'Verified' | 'Trusted' | 'Pending';
  trustScore: number;
  contact: FundingAgencyContact;
  programmes: FundingProgramme[];
}

export interface BudgetItem {
  id: string;
  label: string;
  category:
    | 'Personnel'
    | 'Equipment'
    | 'Travel'
    | 'Consumables'
    | 'Software'
    | 'Dissemination'
    | 'Overheads'
    | 'Other';
  amount: number;
  currency: CurrencyCode;
  description?: string;
}

export interface Budget {
  id: string;
  totalRequested: number;
  totalAwarded?: number;
  currency: CurrencyCode;
  items: BudgetItem[];
  notes?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  type:
    | 'Report'
    | 'Dataset'
    | 'Publication'
    | 'Software'
    | 'Prototype'
    | 'Workshop'
    | 'Policy Document'
    | 'Other';
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  dueDate?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface PrincipalInvestigator {
  id: string;
  name: string;
  said: string;
  orcid?: string;
  institution: string;
  role: GrantRole;
  email?: string;
}

export interface CoInvestigator {
  id: string;
  name: string;
  said: string;
  orcid?: string;
  institution: string;
  role: GrantRole;
  contribution?: string;
}

export interface PartnerInstitution {
  id: string;
  name: string;
  said?: string;
  country: string;
  role: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  sector: string;
  country: string;
  contribution?: string;
  fundingContribution?: number;
  currency?: CurrencyCode;
}

export interface Award {
  id: string;
  grantId: string;
  opportunityId?: string;
  agencyId: string;
  agencyName: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  awardedAt: string;
  durationMonths: number;
  status: 'active' | 'completed' | 'terminated' | 'pending';
  grantNumber?: string;
  principalInvestigator: string;
  institution: string;
  researchAreas: string[];
  partnerInstitutions: PartnerInstitution[];
  fundedResearch: string;
}

/**
 * The aggregate funding record. Mirrors the lifecycle position of the module
 * (stage 4) and embeds the full funding ecosystem: opportunity context,
 * eligibility, budget, deliverables, milestones, timeline, team, partners,
 * evaluation criteria, proposal requirements, reporting obligations, and
 * cross-module relationships.
 */
export interface Grant {
  id: string;
  opportunityId?: string;
  agencyId: string;
  agencyName: string;
  programmeId?: string;
  title: string;
  summary: string;
  category: GrantCategory;
  grantType: GrantType;
  status: FundingStatus;
  applicationStage: ApplicationStage;
  careerStage: CareerStage;
  researchAreas: string[];
  durationMonths: number;
  funding: FundingAmount;
  requestedAmount?: number;
  awardedAmount?: number;
  startDate?: string;
  endDate?: string;
  applicationOpenedAt?: string;
  applicationDeadline?: string;
  decisionDate?: string;
  awardedAt?: string;
  principalInvestigator: PrincipalInvestigator;
  coInvestigators: CoInvestigator[];
  partnerInstitutions: PartnerInstitution[];
  industryPartners: IndustryPartner[];
  budget: Budget;
  deliverables: Deliverable[];
  milestones: Milestone[];
  timeline: FundingTimeline;
  eligibility: Eligibility;
  evaluationCriteria: EvaluationCriterion[];
  proposalRequirements: ProposalRequirement[];
  grantNumber?: string;
  reporting: string[];
  relationships: FundingRelationships;
  tags: string[];
}

export interface FundingOpportunity {
  id: string;
  title: string;
  summary: string;
  agencyId: string;
  agencyName: string;
  programmeId?: string;
  category: GrantCategory;
  grantType: GrantType;
  status: 'open' | 'closed' | 'upcoming';
  careerStage: CareerStage;
  openedAt?: string;
  deadline: string;
  decisionDate?: string;
  durationMonths: number;
  funding: FundingAmount;
  eligibility: Eligibility;
  researchAreas: string[];
  countries: string[];
  continents: string[];
  evaluationCriteria: EvaluationCriterion[];
  proposalRequirements: ProposalRequirement[];
  contact: FundingAgencyContact;
  howToApply?: string;
  links: FundingRelationships;
  tags: string[];
  createdAt: string;
}

export interface FundingRound {
  id: string;
  name: string;
  openedAt?: string;
  closedAt?: string;
  decisionDate?: string;
  status: 'open' | 'closed' | 'upcoming' | 'decision-pending';
  applicationsReceived?: number;
  applicationsAwarded?: number;
  totalBudget?: number;
  currency?: CurrencyCode;
}

export interface FundingCycle {
  id: string;
  programmeId?: string;
  name: string;
  year: number;
  status: 'planned' | 'open' | 'closed' | 'completed';
  totalBudget?: number;
  currency?: CurrencyCode;
  rounds: FundingRound[];
}

export interface CategoryFundingStat {
  category: GrantCategory;
  count: number;
  value: number;
}

export interface ContinentFundingStat {
  continent: string;
  count: number;
  value: number;
}

export interface DisciplineApplicationStat {
  discipline: string;
  count: number;
}

export interface FundingAnalytics {
  totalOpportunities: number;
  openOpportunities: number;
  upcomingOpportunities: number;
  closedOpportunities: number;
  totalAgencies: number;
  totalAwarded: number;
  totalRequested: number;
  successRate: number;
  averageAwardSize: number;
  awardCurrency: CurrencyCode;
  awardsByCategory: CategoryFundingStat[];
  fundingByContinent: ContinentFundingStat[];
  applicationsByDiscipline: DisciplineApplicationStat[];
  budgetUtilisation: number;
}

export interface FundingStatistics {
  totalOpportunities: number;
  openOpportunities: number;
  upcomingOpportunities: number;
  totalAgencies: number;
  totalAwarded: number;
  totalRequested: number;
  activeGrants: number;
  pendingApplications: number;
  totalCountries: number;
  totalContinents: number;
  totalDisciplines: number;
  totalCategories: number;
  scholarshipCount: number;
  fellowshipCount: number;
  grantCount: number;
  averageDurationMonths: number;
  averageAwardSize: number;
  currency: CurrencyCode;
  careerStagesCovered: number;
}

export interface FundingPortfolio {
  statistics: FundingStatistics;
  analytics: FundingAnalytics;
  agencies: FundingAgency[];
  opportunities: FundingOpportunity[];
  grants: Grant[];
  awards: Award[];
  relationships: FundingRelationships;
  deadlines: FundingDeadline[];
  categories: GrantCategory[];
}

/**
 * A lifecycle coverage row for the funding platform, derived from the
 * canonical `ResearchLifecycleEngine`. Funding occupies stage 4 of the
 * lifecycle; the platform never redefines the lifecycle itself.
 */
export interface FundingLifecycleCoverage {
  stageId: ResearchLifecycleStageId;
  name: string;
  description: string;
  icon: string;
  order: number;
  completionPercentage: number;
  previousStage: string | null;
  nextStage: string | null;
}
