import type { CareerStage, CurrencyCode } from '@/types/funding';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { ResearcherPositionType } from '@/types/researcher';

/**
 * The Academic Advertising & Sponsored Content Platform of the Scholatia
 * ecosystem.
 *
 * The Advertising module is the platform-wide monetization layer. It does NOT
 * introduce a new lifecycle stage and does NOT own its own records; every
 * advertisement promotes an existing Scholatia record (a researcher SAID, a
 * journal id, a conference id, a DOI, a grant id, a project id, an institution
 * SAID, a publisher id). The module is built so that **every academic object in
 * the ecosystem is promotable** — any future module exposes a single `Promote`
 * action through the shared `PromotableObject` reference and the engine in
 * `lib/ads.ts`, without duplicating any advertising logic.
 *
 * The platform supports two advertiser surfaces:
 *
 * - **Scholatia Promote** — verified Scholatia users promoting their own
 *   academic content (papers, journals, conferences, funding calls, datasets,
 *   books, institutions, projects, patents, profiles, courses, events).
 * - **Scholatia Ads** — external advertisers without academic profiles
 *   (universities, government agencies, NGOs, foundations, publishers,
 *   suppliers, software vendors, recruiters, scholarship providers, EdTech
 *   companies, professional associations, corporate sponsors).
 *
 * Every advertisement passes through the review pipeline (manual moderation,
 * AI moderation, academic integrity checks, spam detection, fraud detection)
 * before it is eligible for a placement.
 */

/** Every object inside Scholatia that can become a sponsored advertisement. */
export type PromotableEntityType =
  | 'research-paper'
  | 'preprint'
  | 'journal'
  | 'conference'
  | 'call-for-papers'
  | 'funding-opportunity'
  | 'dataset'
  | 'book'
  | 'book-chapter'
  | 'publisher'
  | 'institution'
  | 'research-centre'
  | 'research-laboratory'
  | 'research-project'
  | 'researcher-profile'
  | 'student-profile'
  | 'academic-event'
  | 'webinar'
  | 'workshop'
  | 'course'
  | 'job-vacancy'
  | 'scholarship'
  | 'fellowship'
  | 'grant'
  | 'patent'
  | 'startup'
  | 'marketplace-listing'
  | 'equipment'
  | 'software'
  | 'ai-tool'
  | 'academic-service';

/**
 * A live reference to a promotable object in any module. Every field is derived
 * from the original source record; `sourceId` and `url` keep the reference
 * live so the Advertising module never duplicates data.
 */
export interface PromotableObject {
  id: string;
  entityType: PromotableEntityType;
  /** Original source identity (SAID, journalId, conferenceId, DOI, grant id). */
  sourceId: string;
  title: string;
  summary: string;
  /** Canonical route to the original record within the app. */
  url: string;
  keywords: string[];
  discipline?: string;
  researchAreas: string[];
  authors?: string[];
  organizations?: string[];
  country?: string;
  /** Canonical lifecycle stage id of the source record, when applicable. */
  stageId?: ResearchLifecycleStageId;
  tags: string[];
  dateAdded: string;
}

/** Advertising objective, modeled on Meta Ads Manager and Google Ads objectives. */
export type AdObjective =
  | 'awareness'
  | 'reach'
  | 'website-visits'
  | 'conference-registration'
  | 'journal-submissions'
  | 'dataset-downloads'
  | 'book-sales'
  | 'grant-applications'
  | 'research-collaborations'
  | 'recruitment'
  | 'research-participants'
  | 'institution-branding'
  | 'publisher-branding'
  | 'course-enrolment'
  | 'scholarship-promotion'
  | 'funding-call-promotion'
  | 'marketplace-sales'
  | 'service-promotion'
  | 'lead-generation'
  | 'newsletter-subscriptions'
  | 'research-visibility'
  | 'citation-growth'
  | 'profile-visibility'
  | 'publication-promotion'
  | 'event-ticket-sales';

/** The disclosure label rendered on every promoted piece of content. */
export type SponsoredLabel =
  | 'Sponsored'
  | 'Promoted'
  | 'Featured'
  | 'Recommended'
  | 'Suggested'
  | 'Trending'
  | "Editor's Choice"
  | 'Popular Near You'
  | 'Recommended For You'
  | 'AI Recommendation'
  | 'Sponsored Research'
  | 'Sponsored Conference'
  | 'Sponsored Journal'
  | 'Sponsored Dataset';

/** Ad creative formats supported by the platform. */
export type AdFormat =
  | 'sponsored-post'
  | 'sponsored-search-result'
  | 'sponsored-researcher-profile'
  | 'sponsored-journal'
  | 'sponsored-conference'
  | 'sponsored-institution'
  | 'homepage-banner'
  | 'sidebar-advertisement'
  | 'newsletter-sponsorship'
  | 'featured-funding'
  | 'featured-book'
  | 'featured-software-tool'
  | 'sponsored-recommendation'
  | 'native-advertisement'
  | 'video-advertisement'
  | 'top-banner'
  | 'bottom-banner'
  | 'featured-carousel';

/** Natural surfaces where sponsored content appears across the platform. */
export type AdPlacement =
  | 'home-feed'
  | 'research-feed'
  | 'journal-pages'
  | 'conference-pages'
  | 'discovery'
  | 'marketplace'
  | 'funding-page'
  | 'researcher-profiles'
  | 'institution-pages'
  | 'publisher-pages'
  | 'search-results'
  | 'ai-recommendations'
  | 'email-newsletters'
  | 'push-notifications'
  | 'weekly-digests'
  | 'trending-widgets'
  | 'recommendation-panels'
  | 'sidebar-cards'
  | 'top-banners'
  | 'bottom-banners'
  | 'featured-carousel';

/** Revenue / pricing model for a campaign or ad set. */
export type AdPricingModel =
  | 'CPC'
  | 'CPM'
  | 'CPR'
  | 'CPS'
  | 'CPD'
  | 'CPL'
  | 'CPA'
  | 'Fixed'
  | 'Subscription'
  | 'Bundle';

/** Budget envelope for an ad set: daily/lifetime caps or fixed packages. */
export type AdBudgetMode =
  | 'daily'
  | 'lifetime'
  | 'fixed-package'
  | 'featured-subscription'
  | 'premium-bundle';

/** Payment rails available to advertisers. */
export type AdPaymentMethod =
  | 'Stripe'
  | 'Paystack'
  | 'Flutterwave'
  | 'PayPal'
  | 'Bank Transfer'
  | 'Wallet'
  | 'Credits'
  | 'Coupon'
  | 'Institutional Billing'
  | 'Publisher Billing'
  | 'Agency Billing';

/** Lifecycle status of a campaign or ad set. */
export type AdCampaignStatus =
  | 'draft'
  | 'in-review'
  | 'active'
  | 'paused'
  | 'ended'
  | 'rejected'
  | 'completed';

export type AdCreativeStatus = 'active' | 'paused' | 'in-review' | 'rejected';

/** Verification standing of an advertiser account. */
export type AdvertiserVerificationStatus = 'Verified' | 'Trusted' | 'Pending';

export type AdvertiserKind = 'scholatia-promote' | 'scholatia-ads';

export type AdvertiserAccountType = 'individual' | 'organization';

// ---------------------------------------------------------------------------
// Targeting
// ---------------------------------------------------------------------------

/** Academic rank used by the target audience engine. */
export type AdAcademicRank =
  | 'Student'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Postdoctoral Researcher'
  | 'Research Assistant'
  | 'Research Associate'
  | 'Research Scientist'
  | 'Lecturer'
  | 'Senior Lecturer'
  | 'Assistant Professor'
  | 'Associate Professor'
  | 'Professor'
  | 'Principal Investigator'
  | 'Industry Researcher'
  | 'Open to All';

/** Student level used by the target audience engine. */
export type AdStudentLevel = 'High School' | 'Undergraduate' | 'Postgraduate' | 'Masters' | 'Doctoral';

/** Industry sector targeting. */
export type AdSector =
  | 'industry'
  | 'government'
  | 'ngo'
  | 'private-sector'
  | 'publisher'
  | 'funding-agency'
  | 'membership-organisation'
  | 'education'
  | 'healthcare'
  | 'finance'
  | 'technology'
  | 'all-sectors';

/** Citation activity band used by the target audience engine. */
export type AdCitationLevel = 'none' | 'low' | 'medium' | 'high';

/** Lifecycle-contextual signals (grant history, conference attendance, etc.). */
export interface AdContextualSignals {
  hasPublications: boolean;
  hasGrants: boolean;
  attendedConferences: boolean;
  hasInstitutionAffiliation: boolean;
  hasOrcidProfile: boolean;
  journalReadership: string[];
  citationLevel: AdCitationLevel;
  hIndex?: number;
  totalCitations?: number;
}

/**
 * A complete definition of who should see a promotion. Every field is optional
 * so the same shape describes a broad reach campaign and a hyper-targeted
 * niche campaign. Targeting uses the Scholatia academic graph: disciplines,
 * institutions, departments, faculties, research interests, career stage,
 * academic rank, publication history, grant history, conference attendance,
 * citation activity, and the research lifecycle.
 */
export interface AdAudience {
  id: string;
  name: string;
  description?: string;
  countries: string[];
  states: string[];
  cities: string[];
  institutions: string[];
  departments: string[];
  faculties: string[];
  disciplines: string[];
  researchInterests: string[];
  orcidDisciplines: string[];
  researchKeywords: string[];
  academicRanks: AdAcademicRank[];
  studentLevels: AdStudentLevel[];
  careerStages: CareerStage[];
  languages: string[];
  sectors: AdSector[];
  researchLifecycleStages: ResearchLifecycleStageId[];
  ageRange?: { min: number; max: number };
  yearsOfExperience?: { min: number; max: number };
  hIndexRange?: { min: number; max: number };
  publicationHistory?: boolean;
  grantHistory?: boolean;
  conferenceAttendance?: boolean;
  journalReadership: string[];
  citationLevel?: AdCitationLevel;
  customAudienceIds: string[];
  lookalikeAudienceIds: string[];
  retargetingAudienceIds: string[];
  estimatedReach: number;
}

/**
 * The profile of a user the targeting engine decides against. Every field is
 * derived from the user's existing SAID identity, research profile, and
 * behavioural signals — the Advertising module never owns this data.
 */
export interface AdTargetProfile {
  id: string;
  name?: string;
  country?: string;
  institution?: string;
  department?: string;
  faculty?: string;
  disciplines: string[];
  researchInterests: string[];
  researchKeywords: string[];
  academicRank?: AdAcademicRank;
  careerStage?: CareerStage;
  studentLevel?: AdStudentLevel;
  languages: string[];
  sector?: AdSector;
  researchLifecycleStages: ResearchLifecycleStageId[];
  signals?: AdContextualSignals;
}

/** Audience source for a custom audience. */
export type CustomAudienceSource = 'upload' | 'platform' | 'api';

export interface CustomAudience {
  id: string;
  name: string;
  description?: string;
  source: CustomAudienceSource;
  criteria: string[];
  size: number;
  createdAt: string;
  advertiserId: string;
}

/** A lookalike audience seeded from an existing audience. */
export interface LookalikeAudience {
  id: string;
  name: string;
  seedAudienceId: string;
  similarityPercent: number;
  size: number;
  countries: string[];
}

/** A retargeting audience built from prior engagement. */
export interface RetargetingAudience {
  id: string;
  name: string;
  source: 'visitors' | 'engagers' | 'converters' | 'abandoners';
  lookbackDays: number;
  size: number;
}

// ---------------------------------------------------------------------------
// Advertisers & billing
// ---------------------------------------------------------------------------

export interface AdCompanyProfile {
  industry: string;
  website: string;
  country: string;
  city?: string;
  description: string;
  sizeBand?: string;
  representativeName?: string;
  representativeEmail?: string;
}

/** A single billing line record on an advertiser account. */
export interface AdPaymentRecord {
  id: string;
  amount: number;
  currency: CurrencyCode;
  method: AdPaymentMethod;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  billedAt: string;
  description: string;
  campaignId?: string;
  invoiceNumber?: string;
}

export interface AdBillingInfo {
  defaultMethod: AdPaymentMethod;
  methods: AdPaymentMethod[];
  billingEmail: string;
  taxId?: string;
  balance: number;
  creditBalance: number;
  autoRecharge: boolean;
  paymentHistory: AdPaymentRecord[];
}

export interface AdvertiserAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCtr: number;
  averageCpc: number;
  averageCpa: number;
  lifetimeValue: number;
}

/**
 * An advertiser account. `kind` distinguishes internal promotion
 * (`scholatia-promote`, tied to a verified SAID) from the external
 * `scholatia-ads` platform. The account bundles a company profile, billing
 * information, a campaign manager, the advertisement library, budget
 * management, payment history, and an analytics dashboard.
 */
export interface AdvertiserAccount {
  id: string;
  name: string;
  kind: AdvertiserKind;
  accountType: AdvertiserAccountType;
  /** SAID of the owner for `scholatia-promote` accounts. */
  said?: string;
  companyProfile?: AdCompanyProfile;
  billing: AdBillingInfo;
  campaignManagerId?: string;
  advertisementLibrary: string[];
  verificationStatus: AdvertiserVerificationStatus;
  trustScore: number;
  analytics: AdvertiserAnalytics;
  joinedAt: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Creatives, ad sets, campaigns
// ---------------------------------------------------------------------------

export interface AdCreative {
  id: string;
  name: string;
  headline: string;
  primaryText: string;
  description?: string;
  callToAction: string;
  mediaUrl?: string;
  format: AdFormat;
  /** The promotable object this creative advertises. */
  promotedObjectId: string;
  label: SponsoredLabel;
  status: AdCreativeStatus;
  reviewStatus: 'pending' | 'approved' | 'rejected';
}

export interface AdSchedule {
  startDate: string;
  endDate?: string;
  timezone?: string;
}

/** A budget envelope expressed in a single currency. */
export interface AdBudget {
  total: number;
  currency: CurrencyCode;
  mode: AdBudgetMode;
  dailyCap?: number;
  spent: number;
}

export interface AdSet {
  id: string;
  name: string;
  campaignId: string;
  audienceId: string;
  placements: AdPlacement[];
  pricingModel: AdPricingModel;
  /** Bid per pricing unit (e.g. per click for CPC, per 1,000 impressions for CPM). */
  bidAmount: number;
  currency: CurrencyCode;
  budget: AdBudget;
  schedule: AdSchedule;
  status: AdCampaignStatus;
  creatives: string[];
}

export interface AdCampaign {
  id: string;
  name: string;
  advertiserId: string;
  objective: AdObjective;
  status: AdCampaignStatus;
  adSets: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Placements
// ---------------------------------------------------------------------------

export type SponsoredPlacementStatus = 'live' | 'paused' | 'ended' | 'scheduled';

/** A live sponsored placement on a natural platform surface. */
export interface SponsoredPlacement {
  id: string;
  placement: AdPlacement;
  adSetId?: string;
  creativeId?: string;
  label: SponsoredLabel;
  /** Higher priority wins the auction within a surface. */
  priority: number;
  status: SponsoredPlacementStatus;
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  currency: CurrencyCode;
}

// ---------------------------------------------------------------------------
// AI optimization
// ---------------------------------------------------------------------------

/**
 * An AI-generated campaign recommendation. The engine proposes the best
 * audience, budget, duration, objective, and pricing model, together with the
 * expected reach, clicks, registrations, submissions, downloads, conversions,
 * quality score, and relevance score.
 */
export interface AdForecast {
  id: string;
  campaignId?: string;
  objective: AdObjective;
  recommendedAudienceId: string;
  recommendedBudget: { amount: number; currency: CurrencyCode };
  recommendedDurationDays: number;
  recommendedPricingModel: AdPricingModel;
  expectedReach: number;
  expectedImpressions: number;
  expectedClicks: number;
  expectedRegistrations: number;
  expectedSubmissions: number;
  expectedDownloads: number;
  expectedConversions: number;
  expectedCtr: number;
  expectedCpc: number;
  expectedCpa: number;
  /** 0-100 campaign quality score. */
  campaignQualityScore: number;
  /** 0-100 ad relevance score. */
  adRelevanceScore: number;
  estimatedRoi: number;
  confidence: 'high' | 'medium' | 'low';
  rationale: string[];
  date: string;
}

// ---------------------------------------------------------------------------
// Fraud prevention & review
// ---------------------------------------------------------------------------

export type AdFraudType =
  | 'fake-click'
  | 'bot-traffic'
  | 'duplicate-impression'
  | 'invalid-conversion'
  | 'click-farm'
  | 'abuse'
  | 'spam-campaign'
  | 'policy-violation';

export type AdFraudSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AdFraudStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface AdFraudSignal {
  id: string;
  campaignId: string;
  advertiserId: string;
  type: AdFraudType;
  severity: AdFraudSeverity;
  status: AdFraudStatus;
  detectedAt: string;
  description: string;
  evidence: string[];
  invalidClicks?: number;
  invalidImpressions?: number;
  invalidConversions?: number;
}

export type AdReviewCheck =
  | 'manual-moderation'
  | 'ai-moderation'
  | 'academic-integrity'
  | 'spam-detection'
  | 'fraud-detection';

export type AdReviewStatus = 'pending' | 'approved' | 'rejected' | 'needs-review';

export interface AdReviewRecord {
  id: string;
  targetId: string;
  targetKind: 'ad' | 'campaign' | 'creative' | 'advertiser';
  checks: AdReviewCheck[];
  status: AdReviewStatus;
  decidedBy?: string;
  decidedAt?: string;
  notes?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Metrics & analytics
// ---------------------------------------------------------------------------

/** Aggregate performance metrics for a campaign, ad set, or placement. */
export interface AdMetrics {
  impressions: number;
  reach: number;
  clicks: number;
  /** Percent. */
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  /** Percent. */
  conversionRate: number;
  engagement: number;
  downloads: number;
  registrations: number;
  submissions: number;
  bookmarks: number;
  followersGained: number;
  citationIncrease: number;
  profileVisits: number;
  bookPurchases: number;
  grantApplications: number;
  leads: number;
  spend: number;
  revenue: number;
  roi: number;
}

export interface AdFunnelStep {
  label: string;
  value: number;
  /** Percent of the previous step retained. */
  rate: number;
}

export interface AdTimeOfDayPoint {
  hour: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface AdDeviceStat {
  device: 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile';
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
}

export interface AdReferralStat {
  source: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface AdGeographyStat {
  country: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface AdDisciplineStat {
  discipline: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface AdDemographicStat {
  label: string;
  impressions: number;
  reach: number;
  clicks: number;
}

export interface AdHeatPoint {
  placement: AdPlacement;
  impressions: number;
  clicks: number;
  ctr: number;
}

/** The full analytics surface for one campaign. */
export interface AdCampaignAnalytics {
  campaignId: string;
  campaignName: string;
  metrics: AdMetrics;
  funnel: AdFunnelStep[];
  demographics: AdDemographicStat[];
  geography: AdGeographyStat[];
  disciplines: AdDisciplineStat[];
  timeOfDay: AdTimeOfDayPoint[];
  devices: AdDeviceStat[];
  referrals: AdReferralStat[];
  heatMap: AdHeatPoint[];
  /** Percent of the campaign budget consumed. */
  budgetUtilization: number;
}

export interface AdvertisingStatistics {
  totalCampaigns: number;
  activeCampaigns: number;
  pausedCampaigns: number;
  endedCampaigns: number;
  inReviewCampaigns: number;
  totalAdvertisers: number;
  internalAdvertisers: number;
  externalAdvertisers: number;
  totalPromotableObjects: number;
  promotableCategories: number;
  totalAudiences: number;
  totalPlacements: number;
  livePlacements: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  totalRevenue: number;
  avgCtr: number;
  avgCpc: number;
  avgCpa: number;
  avgQualityScore: number;
  openFraudSignals: number;
  reviewQueue: number;
}

export interface AdRevenueStat {
  objective: AdObjective;
  spend: number;
  revenue: number;
  roi: number;
}

export interface AdvertisingAnalytics {
  revenueByObjective: AdRevenueStat[];
  campaignsByStatus: { status: AdCampaignStatus; count: number }[];
  spendByPlacement: { placement: AdPlacement; spend: number }[];
  topCampaigns: { campaignId: string; campaignName: string; revenue: number; roi: number }[];
  audienceReachByDiscipline: { discipline: string; reach: number }[];
}

// ---------------------------------------------------------------------------
// Aggregate root
// ---------------------------------------------------------------------------

/**
 * Aggregate root of the Advertising module: the promotable catalog, advertiser
 * accounts, the Ads Manager structure (campaigns → ad sets → creatives), the
 * audience engine, placements, AI forecasts, fraud signals, the review queue,
 * and the analytics that summarize the whole marketplace.
 */
export interface AdvertisingPortfolio {
  statistics: AdvertisingStatistics;
  analytics: AdvertisingAnalytics;
  promotableObjects: PromotableObject[];
  advertisers: AdvertiserAccount[];
  campaigns: AdCampaign[];
  adSets: AdSet[];
  creatives: AdCreative[];
  audiences: AdAudience[];
  customAudiences: CustomAudience[];
  lookalikeAudiences: LookalikeAudience[];
  retargetingAudiences: RetargetingAudience[];
  placements: SponsoredPlacement[];
  forecasts: AdForecast[];
  fraudSignals: AdFraudSignal[];
  reviewQueue: AdReviewRecord[];
  campaignAnalytics: AdCampaignAnalytics[];
}

export const AD_PRICING_MODELS: readonly AdPricingModel[] = [
  'CPC',
  'CPM',
  'CPR',
  'CPS',
  'CPD',
  'CPL',
  'CPA',
  'Fixed',
  'Subscription',
  'Bundle',
] as const;

export const AD_PLACEMENTS: readonly AdPlacement[] = [
  'home-feed',
  'research-feed',
  'journal-pages',
  'conference-pages',
  'discovery',
  'marketplace',
  'funding-page',
  'researcher-profiles',
  'institution-pages',
  'publisher-pages',
  'search-results',
  'ai-recommendations',
  'email-newsletters',
  'push-notifications',
  'weekly-digests',
  'trending-widgets',
  'recommendation-panels',
  'sidebar-cards',
  'top-banners',
  'bottom-banners',
  'featured-carousel',
] as const;

export const AD_PAYMENT_METHODS: readonly AdPaymentMethod[] = [
  'Stripe',
  'Paystack',
  'Flutterwave',
  'PayPal',
  'Bank Transfer',
  'Wallet',
  'Credits',
  'Coupon',
  'Institutional Billing',
  'Publisher Billing',
  'Agency Billing',
] as const;

export const AD_SPONSORED_LABELS: readonly SponsoredLabel[] = [
  'Sponsored',
  'Promoted',
  'Featured',
  'Recommended',
  'Suggested',
  'Trending',
  "Editor's Choice",
  'Popular Near You',
  'Recommended For You',
  'AI Recommendation',
  'Sponsored Research',
  'Sponsored Conference',
  'Sponsored Journal',
  'Sponsored Dataset',
] as const;

export const AD_OBJECTIVES: readonly AdObjective[] = [
  'awareness',
  'reach',
  'website-visits',
  'conference-registration',
  'journal-submissions',
  'dataset-downloads',
  'book-sales',
  'grant-applications',
  'research-collaborations',
  'recruitment',
  'research-participants',
  'institution-branding',
  'publisher-branding',
  'course-enrolment',
  'scholarship-promotion',
  'funding-call-promotion',
  'marketplace-sales',
  'service-promotion',
  'lead-generation',
  'newsletter-subscriptions',
  'research-visibility',
  'citation-growth',
  'profile-visibility',
  'publication-promotion',
  'event-ticket-sales',
] as const;

export const AD_CAREER_STAGES: readonly CareerStage[] = [
  'undergraduate',
  'postgraduate',
  'masters',
  'doctoral',
  'postdoctoral',
  'early-career',
  'mid-career',
  'senior',
  'open-to-all',
] as const;

export const AD_ACADEMIC_RANKS: readonly AdAcademicRank[] = [
  'Student',
  'Undergraduate',
  'Postgraduate',
  'Postdoctoral Researcher',
  'Research Assistant',
  'Research Associate',
  'Research Scientist',
  'Lecturer',
  'Senior Lecturer',
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Principal Investigator',
  'Industry Researcher',
  'Open to All',
] as const;

export const AD_RESEARCHER_POSITIONS: readonly ResearcherPositionType[] = [
  'Distinguished Professor',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Principal Investigator',
  'Senior Research Scientist',
  'Research Scientist',
  'Postdoctoral Researcher',
  'Research Fellow',
  'Research Associate',
  'Research Assistant',
  'PhD Candidate',
  'Graduate Researcher',
  'Industry Researcher',
] as const;

export const AD_FRAUD_TYPES: readonly AdFraudType[] = [
  'fake-click',
  'bot-traffic',
  'duplicate-impression',
  'invalid-conversion',
  'click-farm',
  'abuse',
  'spam-campaign',
  'policy-violation',
] as const;

export const AD_REVIEW_CHECKS: readonly AdReviewCheck[] = [
  'manual-moderation',
  'ai-moderation',
  'academic-integrity',
  'spam-detection',
  'fraud-detection',
] as const;

/** Convenience type re-export so modules can type Promote actions uniformly. */
export type { CareerStage, CurrencyCode };
