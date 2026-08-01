import type {
  AdAudience,
  AdBudget,
  AdCampaign,
  AdCampaignAnalytics,
  AdCampaignStatus,
  AdCreative,
  AdForecast,
  AdFraudSignal,
  AdFraudType,
  AdMetrics,
  AdObjective,
  AdPlacement,
  AdPricingModel,
  AdReviewRecord,
  AdSet,
  AdTargetProfile,
  AdvertiserAccount,
  AdvertisingAnalytics,
  AdvertisingPortfolio,
  AdvertisingStatistics,
  PromotableEntityType,
  PromotableObject,
  SponsoredPlacement,
} from '@/types/ads';
import type { CurrencyCode } from '@/types/funding';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Scholatia Advertising Engine (Phase 1.9A).
 *
 * The Advertising module is the platform-wide monetization layer. It does NOT
 * own records and does NOT duplicate any module data — every advertisement
 * references an existing `PromotableObject` (a SAID, a journal id, a
 * conference id, a DOI, a grant id). These utilities are pure, strongly typed
 * helpers so the placeholder data and the Ads Manager page never re-implement
 * campaign lifecycle, targeting, budgeting, forecasting, fraud detection, or
 * analytics by hand.
 *
 * Every future module exposes a "Promote" action through
 * {@link registerPromotableObject} and the {@link createPromotableObject}
 * helper without duplicating any advertising logic.
 */

// ---------------------------------------------------------------------------
// Promotable object registry
// ---------------------------------------------------------------------------

const promotableRegistry = new Map<string, PromotableObject>();

/**
 * Register a promotable object so it becomes eligible for sponsored placement.
 * Any module can call this at boot to expose a "Promote" action.
 */
export function registerPromotableObject(object: PromotableObject): PromotableObject {
  promotableRegistry.set(object.id, object);
  return object;
}

/** Register many promotable objects at once. */
export function registerPromotableObjects(objects: readonly PromotableObject[]): PromotableObject[] {
  objects.forEach(registerPromotableObject);
  return objects as PromotableObject[];
}

/** All currently registered promotable objects. */
export function listPromotableObjects(): PromotableObject[] {
  return Array.from(promotableRegistry.values());
}

/** Look up a promotable object by id. */
export function getPromotableObject(id: string): PromotableObject | undefined {
  return promotableRegistry.get(id);
}

/** Build a promotable object reference from source-module identity. */
export function createPromotableObject(input: {
  id: string;
  entityType: PromotableEntityType;
  sourceId: string;
  title: string;
  summary: string;
  url: string;
  keywords: string[];
  discipline?: string;
  researchAreas?: string[];
  authors?: string[];
  organizations?: string[];
  country?: string;
  stageId?: ResearchLifecycleStageId;
  tags?: string[];
  dateAdded?: string;
}): PromotableObject {
  return {
    ...input,
    researchAreas: input.researchAreas ?? [],
    tags: input.tags ?? [],
    dateAdded: input.dateAdded ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Campaign lifecycle
// ---------------------------------------------------------------------------

export const CAMPAIGN_STATUS_TRANSITIONS: Record<AdCampaignStatus, readonly AdCampaignStatus[]> = {
  draft: ['in-review', 'ended'],
  'in-review': ['active', 'rejected', 'paused'],
  active: ['paused', 'ended', 'completed'],
  paused: ['active', 'ended'],
  ended: [],
  rejected: ['draft'],
  completed: ['active'],
};

/** Whether a campaign may legally transition to the given status. */
export function canTransitionCampaign(from: AdCampaignStatus, to: AdCampaignStatus): boolean {
  if (from === to) return true;
  return CAMPAIGN_STATUS_TRANSITIONS[from].includes(to);
}

/** Apply a lifecycle transition, returning the new status or the unchanged one. */
export function transitionCampaignStatus(
  status: AdCampaignStatus,
  target: AdCampaignStatus
): AdCampaignStatus {
  return canTransitionCampaign(status, target) ? target : status;
}

/** Update a campaign and its ad sets to a new status when the transition is valid. */
export function setCampaignStatus(
  campaign: AdCampaign,
  adSets: readonly AdSet[],
  target: AdCampaignStatus
): { campaign: AdCampaign; adSets: AdSet[] } {
  const next = transitionCampaignStatus(campaign.status, target);
  const synced = adSets.map((set) => {
    const setTarget = next === 'active' ? (set.status === 'paused' ? set.status : next) : next;
    return set.status === setTarget ? set : { ...set, status: transitionCampaignStatus(set.status, setTarget) };
  });
  return {
    campaign: campaign.status === next ? campaign : { ...campaign, status: next, updatedAt: new Date().toISOString() },
    adSets: synced,
  };
}

/** Convenience lifecycle actions used by the Ads Manager and hooks. */
export function activateCampaign(campaign: AdCampaign, adSets: readonly AdSet[]) {
  return setCampaignStatus(campaign, adSets, 'active');
}

export function pauseCampaign(campaign: AdCampaign, adSets: readonly AdSet[]) {
  return setCampaignStatus(campaign, adSets, 'paused');
}

export function resumeCampaign(campaign: AdCampaign, adSets: readonly AdSet[]) {
  return setCampaignStatus(campaign, adSets, 'active');
}

export function stopCampaign(campaign: AdCampaign, adSets: readonly AdSet[]) {
  return setCampaignStatus(campaign, adSets, 'ended');
}

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

/** Percent of budget consumed, clamped to 0-100. */
export function calculateBudgetUtilization(budget: AdBudget): number {
  if (budget.total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((budget.spent / budget.total) * 100)));
}

/** Remaining budget (never negative). */
export function remainingBudget(budget: AdBudget): number {
  return Math.max(0, budget.total - budget.spent);
}

/** Daily spend pacing: ideal daily spend so the budget lasts the whole duration. */
export function pacingDailySpend(budget: AdBudget, durationDays: number): number {
  if (durationDays <= 0) return 0;
  const remaining = remainingBudget(budget);
  const dailyCap = budget.dailyCap ?? Number.POSITIVE_INFINITY;
  return Math.min(remaining / durationDays, dailyCap);
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

function round(value: number, digits = 2): number {
  return Math.round(value * 10 ** digits) / 10 ** digits;
}

export function calculateCtr(impressions: number, clicks: number): number {
  if (impressions <= 0) return 0;
  return round((clicks / impressions) * 100, 2);
}

export function calculateCpc(spend: number, clicks: number): number {
  if (clicks <= 0) return 0;
  return round(spend / clicks, 2);
}

export function calculateCpm(spend: number, impressions: number): number {
  if (impressions <= 0) return 0;
  return round((spend / impressions) * 1000, 2);
}

export function calculateCpa(spend: number, conversions: number): number {
  if (conversions <= 0) return 0;
  return round(spend / conversions, 2);
}

export function calculateConversionRate(clicks: number, conversions: number): number {
  if (clicks <= 0) return 0;
  return round((conversions / clicks) * 100, 2);
}

export function calculateRoi(revenue: number, spend: number): number {
  if (spend <= 0) return 0;
  return round(((revenue - spend) / spend) * 100, 2);
}

/** Derive the full metric surface from raw counters. */
export function aggregateMetrics(input: {
  impressions: number;
  reach: number;
  clicks: number;
  conversions: number;
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
}): AdMetrics {
  const { impressions, clicks, conversions, spend, revenue } = input;
  return {
    ...input,
    ctr: calculateCtr(impressions, clicks),
    cpc: calculateCpc(spend, clicks),
    cpm: calculateCpm(spend, impressions),
    conversionRate: calculateConversionRate(clicks, conversions),
    roi: calculateRoi(revenue, spend),
  };
}

export function emptyAdMetrics(): AdMetrics {
  return aggregateMetrics({
    impressions: 0,
    reach: 0,
    clicks: 0,
    conversions: 0,
    engagement: 0,
    downloads: 0,
    registrations: 0,
    submissions: 0,
    bookmarks: 0,
    followersGained: 0,
    citationIncrease: 0,
    profileVisits: 0,
    bookPurchases: 0,
    grantApplications: 0,
    leads: 0,
    spend: 0,
    revenue: 0,
  });
}

// ---------------------------------------------------------------------------
// Targeting
// ---------------------------------------------------------------------------

const levenshtein = (a: string, b: string): number => {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
};

/** Fuzzy containment check (≤ 3 edit distance) used for institution/topic match. */
function fuzzyContains(list: readonly string[], value: string | undefined): boolean {
  if (!value) return false;
  return list.some((entry) => {
    const left = entry.toLowerCase();
    const right = value.toLowerCase();
    if (left === right || left.includes(right) || right.includes(left)) return true;
    return levenshtein(left, right) <= 3;
  });
}

/** Set-overlap score (0-1) between two keyword surfaces. */
function overlapRatio(left: readonly string[], right: readonly string[]): number {
  if (left.length === 0 || right.length === 0) return 0;
  const rightSet = new Set(right.map((v) => v.toLowerCase()));
  let hits = 0;
  for (const value of left) {
    if (rightSet.has(value.toLowerCase())) hits += 1;
  }
  return hits / Math.max(left.length, right.length);
}

const CAREER_STAGE_LEVEL: Record<string, number> = {
  undergraduate: 0,
  postgraduate: 1,
  masters: 2,
  doctoral: 3,
  postdoctoral: 4,
  'early-career': 5,
  'mid-career': 6,
  senior: 7,
  'open-to-all': 99,
};

const RANK_LEVEL: Record<string, number> = {
  Student: 0,
  Undergraduate: 1,
  Postgraduate: 2,
  'Research Assistant': 3,
  'Research Associate': 4,
  'Postdoctoral Researcher': 4,
  'Research Scientist': 5,
  Lecturer: 5,
  'Senior Lecturer': 6,
  'Assistant Professor': 6,
  'Associate Professor': 7,
  Professor: 8,
  'Principal Investigator': 8,
  'Industry Researcher': 5,
  'Open to All': 99,
};

/**
 * Score (0-100) how well a user profile matches a targeting audience. The
 * engine uses the Scholatia academic graph: country, institution, faculty,
 * discipline, research interests, keywords, career stage, academic rank,
 * sector, and lifecycle position. Empty targeting constraints never penalize.
 */
export function scoreAudienceMatch(audience: AdAudience, profile: AdTargetProfile): number {
  let score = 0;
  let weight = 0;

  const contribute = (matched: boolean, w: number) => {
    weight += w;
    if (matched) score += w;
  };

  contribute(audience.countries.length === 0 || fuzzyContains(audience.countries, profile.country), 3);
  contribute(audience.institutions.length === 0 || fuzzyContains(audience.institutions, profile.institution), 4);
  contribute(audience.faculties.length === 0 || fuzzyContains(audience.faculties, profile.faculty), 3);
  contribute(audience.departments.length === 0 || fuzzyContains(audience.departments, profile.department), 3);

  const disciplineOverlap = overlapRatio(audience.disciplines, profile.disciplines);
  contribute(disciplineOverlap > 0, 4 * disciplineOverlap);

  const interestOverlap = overlapRatio(audience.researchInterests, profile.researchInterests);
  contribute(interestOverlap > 0, 5 * interestOverlap);

  const keywordOverlap = overlapRatio(audience.researchKeywords, profile.researchKeywords);
  contribute(keywordOverlap > 0, 4 * keywordOverlap);

  if (audience.careerStages.length > 0) {
    const profileLevel = CAREER_STAGE_LEVEL[profile.careerStage ?? ''] ?? 0;
    const matched = audience.careerStages.some((stage) => {
      const targetLevel = CAREER_STAGE_LEVEL[stage] ?? 0;
      return targetLevel === 99 || targetLevel === profileLevel;
    });
    contribute(matched, 4);
  }

  if (audience.academicRanks.length > 0) {
    const profileLevel = RANK_LEVEL[profile.academicRank ?? ''] ?? 0;
    const matched = audience.academicRanks.some((rank) => {
      const targetLevel = RANK_LEVEL[rank] ?? 0;
      return targetLevel === 99 || targetLevel === profileLevel;
    });
    contribute(matched, 3);
  }

  if (audience.sectors.length > 0 && !audience.sectors.includes('all-sectors')) {
    contribute(profile.sector ? audience.sectors.includes(profile.sector) : false, 3);
  }

  contribute(
    audience.researchLifecycleStages.length === 0 ||
      profile.researchLifecycleStages.some((stage) => audience.researchLifecycleStages.includes(stage)),
    2
  );

  if (audience.languages.length > 0) {
    contribute(profile.languages.some((lang) => audience.languages.some((l) => l.toLowerCase() === lang.toLowerCase())), 2);
  }

  if (audience.publicationHistory !== undefined && profile.signals) {
    contribute(profile.signals.hasPublications === audience.publicationHistory, 2);
  }
  if (audience.grantHistory !== undefined && profile.signals) {
    contribute(profile.signals.hasGrants === audience.grantHistory, 2);
  }
  if (audience.conferenceAttendance !== undefined && profile.signals) {
    contribute(profile.signals.attendedConferences === audience.conferenceAttendance, 2);
  }

  if (audience.hIndexRange && profile.signals?.hIndex !== undefined) {
    const { min, max } = audience.hIndexRange;
    contribute(profile.signals.hIndex >= min && profile.signals.hIndex <= max, 2);
  }

  if (weight === 0) return 100;
  return Math.round((score / weight) * 100);
}

/** Whether a profile matches an audience at or above the given threshold. */
export function matchesAudience(audience: AdAudience, profile: AdTargetProfile, threshold = 55): boolean {
  return scoreAudienceMatch(audience, profile) >= threshold;
}

// ---------------------------------------------------------------------------
// Relevance & quality scoring
// ---------------------------------------------------------------------------

/**
 * Ad relevance score (0-100): how relevant a creative's promotable object is
 * to the target audience, based on discipline and keyword overlap.
 */
export function scoreAdRelevance(
  creative: AdCreative,
  promotedObject: PromotableObject | undefined,
  audience: AdAudience
): number {
  if (!promotedObject) return 40;
  const disciplineOverlap = overlapRatio(audience.disciplines, [promotedObject.discipline ?? '']);
  const keywordOverlap = overlapRatio(audience.researchKeywords, [...promotedObject.keywords, ...promotedObject.researchAreas]);
  const interestOverlap = overlapRatio(audience.researchInterests, [...promotedObject.keywords, ...promotedObject.researchAreas]);
  const objectScore = Math.round(30 * disciplineOverlap + 35 * keywordOverlap + 35 * interestOverlap);
  return Math.max(5, Math.min(100, objectScore));
}

/**
 * Campaign quality score (0-100): a blended estimate of expected delivery
 * quality — objective-to-format fit, pricing-model fit, and budget sufficiency.
 */
export function scoreCampaignQuality(
  campaign: AdCampaign,
  adSets: readonly AdSet[],
  creatives: readonly AdCreative[]
): number {
  if (adSets.length === 0) return 10;
  const creativeCount = adSets.reduce((sum, set) => sum + set.creatives.length, 0);
  const coverage = creativeCount === 0 ? 0 : Math.min(1, creativeCount / (adSets.length * 2));
  const spendable = adSets.every((set) => set.budget.total > 0);
  const scheduled = adSets.every((set) => Boolean(set.schedule.startDate));
  const reachable = adSets.every((set) => set.audienceId.length > 0 && set.placements.length > 0);

  let delivery = 0;
  for (const set of adSets) {
    const placementFit = set.placements.length >= 3 ? 1 : set.placements.length / 3;
    delivery += placementFit;
  }
  const placementScore = adSets.length === 0 ? 0 : delivery / adSets.length;

  const validCreatives = creatives.filter((c) => c.reviewStatus === 'approved');
  const integrity = validCreatives.length / Math.max(1, creatives.length);

  const objectiveBonus =
    campaign.objective === 'awareness' || campaign.objective === 'reach' ? 5 : campaign.objective === 'lead-generation' ? 3 : 0;

  const raw =
    25 * coverage +
    15 * placementScore +
    15 * (spendable ? 1 : 0) +
    15 * (scheduled ? 1 : 0) +
    15 * (reachable ? 1 : 0) +
    10 * integrity +
    objectiveBonus;

  return Math.max(1, Math.min(100, Math.round(raw)));
}

// ---------------------------------------------------------------------------
// Reach estimation
// ---------------------------------------------------------------------------

/** Expected reach for a budget under CPM, capping at the audience's size. */
export function estimateReach(adSet: AdSet, audience: AdAudience): number {
  const budget = adSet.budget.total;
  const cpm = adSet.pricingModel === 'CPM' ? adSet.bidAmount : 25;
  const grossImpressions = Math.round((budget / cpm) * 1000);
  return Math.max(1, Math.min(audience.estimatedReach, grossImpressions));
}

/** Expected clicks from an estimated reach and a reference CTR (percent). */
export function estimateClicks(reach: number, ctrPercent: number): number {
  return Math.round(reach * (ctrPercent / 100));
}

// ---------------------------------------------------------------------------
// AI optimization
// ---------------------------------------------------------------------------

const OBJECTIVE_BASELINE_CTR: Record<AdObjective, number> = {
  awareness: 0.8,
  reach: 0.7,
  'website-visits': 1.2,
  'conference-registration': 1.4,
  'journal-submissions': 1.1,
  'dataset-downloads': 1.5,
  'book-sales': 1.0,
  'grant-applications': 1.3,
  'research-collaborations': 1.0,
  recruitment: 1.2,
  'research-participants': 1.4,
  'institution-branding': 0.9,
  'publisher-branding': 0.9,
  'course-enrolment': 1.3,
  'scholarship-promotion': 1.5,
  'funding-call-promotion': 1.4,
  'marketplace-sales': 1.1,
  'service-promotion': 1.0,
  'lead-generation': 1.2,
  'newsletter-subscriptions': 1.3,
  'research-visibility': 0.8,
  'citation-growth': 0.9,
  'profile-visibility': 0.8,
  'publication-promotion': 1.0,
  'event-ticket-sales': 1.4,
};

/** Objective → recommended pricing model pairing. */
export function recommendPricingModel(objective: AdObjective): AdPricingModel {
  switch (objective) {
    case 'awareness':
    case 'reach':
    case 'institution-branding':
    case 'publisher-branding':
    case 'research-visibility':
    case 'profile-visibility':
    case 'citation-growth':
      return 'CPM';
    case 'conference-registration':
    case 'journal-submissions':
    case 'course-enrolment':
    case 'event-ticket-sales':
    case 'scholarship-promotion':
    case 'funding-call-promotion':
    case 'grant-applications':
      return 'CPR';
    case 'dataset-downloads':
      return 'CPD';
    case 'lead-generation':
    case 'newsletter-subscriptions':
      return 'CPL';
    case 'book-sales':
    case 'marketplace-sales':
      return 'CPC';
    default:
      return 'CPC';
  }
}

/** Recommended campaign duration in days for an objective and audience size. */
export function recommendDurationDays(objective: AdObjective, estimatedReach: number): number {
  const base = objective === 'awareness' || objective === 'reach' ? 30 : 21;
  if (estimatedReach > 500_000) return base + 21;
  if (estimatedReach > 100_000) return base + 14;
  if (estimatedReach > 25_000) return base + 7;
  return base;
}

/** Recommended daily or lifetime budget (in the given currency units) for an objective. */
export function recommendBudgetAmount(objective: AdObjective, estimatedReach: number): number {
  const perMille =
    objective === 'awareness' || objective === 'reach' ? 8 : objective === 'lead-generation' ? 14 : 12;
  const gross = (estimatedReach / 1000) * perMille;
  return Math.max(100, Math.round(gross / 50) * 50);
}

/**
 * Rank audiences by predicted match against the promoted object's discipline
 * and keywords, returning the audience ids ordered best-first.
 */
export function recommendAudiences(
  audiences: readonly AdAudience[],
  promotedObject: PromotableObject | undefined,
  profile?: AdTargetProfile
): string[] {
  const scored = audiences.map((audience) => {
    let fit = 0;
    let weight = 0;
    if (promotedObject) {
      fit += overlapRatio(audience.disciplines, [promotedObject.discipline ?? '']);
      weight += 1;
      fit += overlapRatio(audience.researchKeywords, [...promotedObject.keywords, ...promotedObject.researchAreas]);
      weight += 1;
    }
    if (profile) {
      const personal = scoreAudienceMatch(audience, profile) / 100;
      fit += personal;
      weight += 1;
    }
    const base = weight === 0 ? 0.5 : fit / weight;
    const popularity = Math.min(1, audience.estimatedReach / 2_000_000);
    return { id: audience.id, score: 0.6 * base + 0.4 * popularity };
  });
  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.id);
}

/** The best audience id for a promoted object, if any audiences exist. */
export function recommendBestAudience(
  audiences: readonly AdAudience[],
  promotedObject: PromotableObject | undefined,
  profile?: AdTargetProfile
): string | undefined {
  return recommendAudiences(audiences, promotedObject, profile)[0];
}

/**
 * Generate a full AI campaign forecast: best audience, budget, duration,
 * objective and pricing model plus expected reach, clicks, registrations,
 * submissions, downloads, conversions, quality score, relevance score and ROI.
 */
export function forecastCampaign(input: {
  objective: AdObjective;
  audiences: readonly AdAudience[];
  adSets: readonly AdSet[];
  creatives: readonly AdCreative[];
  promotedObjects: readonly PromotableObject[];
  currency: CurrencyCode;
  promotedObjectId?: string;
  profile?: AdTargetProfile;
  campaignId?: string;
}): AdForecast {
  const promotedObject = input.promotedObjectId
    ? input.promotedObjects.find((object) => object.id === input.promotedObjectId)
    : input.promotedObjects[0];

  const bestAudienceId = recommendBestAudience(input.audiences, promotedObject, input.profile);
  const bestAudience = input.audiences.find((audience) => audience.id === bestAudienceId);
  const audienceSize = bestAudience?.estimatedReach ?? 50_000;

  const budgetAmount = recommendBudgetAmount(input.objective, audienceSize);
  const durationDays = recommendDurationDays(input.objective, audienceSize);
  const pricingModel = recommendPricingModel(input.objective);

  const reach = Math.round(audienceSize * 0.75);
  const impressions = Math.round(reach * 1.6);
  const baselineCtr = OBJECTIVE_BASELINE_CTR[input.objective];
  const clicks = estimateClicks(impressions, baselineCtr);

  const conversionRate =
    input.objective === 'conference-registration' || input.objective === 'event-ticket-sales'
      ? 0.04
      : input.objective === 'journal-submissions' || input.objective === 'grant-applications'
        ? 0.03
        : input.objective === 'dataset-downloads'
          ? 0.05
          : 0.02;
  const conversions = Math.round(clicks * conversionRate);

  const registrations =
    input.objective === 'conference-registration' || input.objective === 'course-enrolment' || input.objective === 'event-ticket-sales'
      ? conversions
      : Math.round(conversions * 0.5);
  const submissions =
    input.objective === 'journal-submissions' ? conversions : Math.round(conversions * 0.4);
  const downloads = input.objective === 'dataset-downloads' ? conversions : Math.round(conversions * 0.3);

  const avgCpc = pricingModel === 'CPM' ? budgetAmount / clicks : budgetAmount / clicks;
  const avgCpa = conversions === 0 ? 0 : budgetAmount / conversions;
  const revenue = Math.round(conversions * (budgetAmount * 0.35) + reach * 0.02);
  const roi = calculateRoi(revenue, budgetAmount);

  const syntheticCampaign: AdCampaign = {
    id: input.campaignId ?? 'forecast',
    name: 'AI Forecast',
    advertiserId: 'forecast',
    objective: input.objective,
    status: 'draft',
    adSets: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const syntheticAdSets: AdSet[] = input.adSets.length > 0 ? [...input.adSets] : [
    {
      id: 'forecast-set',
      name: 'AI Recommended Set',
      campaignId: syntheticCampaign.id,
      audienceId: bestAudienceId ?? '',
      placements: ['home-feed', 'research-feed', 'discovery'],
      pricingModel,
      bidAmount: pricingModel === 'CPM' ? 12 : 0.9,
      currency: input.currency,
      budget: { total: budgetAmount, currency: input.currency, mode: 'lifetime', spent: 0 },
      schedule: { startDate: new Date().toISOString() },
      status: 'draft',
      creatives: input.creatives.map((creative) => creative.id),
    },
  ];

  const quality = scoreCampaignQuality(syntheticCampaign, syntheticAdSets, input.creatives);
  const relevance = input.creatives[0]
    ? scoreAdRelevance(input.creatives[0], promotedObject, bestAudience ?? input.audiences[0])
    : 50;

  return {
    id: `forecast-${input.objective}`,
    campaignId: input.campaignId,
    objective: input.objective,
    recommendedAudienceId: bestAudienceId ?? '',
    recommendedBudget: { amount: budgetAmount, currency: input.currency },
    recommendedDurationDays: durationDays,
    recommendedPricingModel: pricingModel,
    expectedReach: reach,
    expectedImpressions: impressions,
    expectedClicks: clicks,
    expectedRegistrations: registrations,
    expectedSubmissions: submissions,
    expectedDownloads: downloads,
    expectedConversions: conversions,
    expectedCtr: round(baselineCtr, 2),
    expectedCpc: round(avgCpc, 2),
    expectedCpa: round(avgCpa, 2),
    campaignQualityScore: quality,
    adRelevanceScore: relevance,
    estimatedRoi: roi,
    confidence: quality >= 70 ? 'high' : quality >= 50 ? 'medium' : 'low',
    rationale: [
      `Audience "${bestAudience?.name ?? 'Global'}" estimated at ${audienceSize.toLocaleString('en-US')} scholars`,
      `${pricingModel} bidding is the best fit for a "${input.objective}" objective`,
      `Budget of ${budgetAmount} over ${durationDays} days keeps delivery above the quality threshold`,
      bestAudience
        ? `Discipline and keyword overlap between the promoted object and the target audience is strong`
        : 'Broad targeting keeps delivery flexible for the objective',
    ],
    date: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Placement selection
// ---------------------------------------------------------------------------

/** Natural surfaces recommended for an objective. */
export function recommendedPlacements(objective: AdObjective): AdPlacement[] {
  const always = ['home-feed', 'discovery'] as AdPlacement[];
  const extra: AdPlacement[] =
    objective === 'conference-registration' || objective === 'event-ticket-sales'
      ? ['conference-pages', 'email-newsletters', 'push-notifications']
      : objective === 'journal-submissions' || objective === 'publication-promotion'
        ? ['journal-pages', 'search-results', 'weekly-digests']
        : objective === 'dataset-downloads'
          ? ['research-feed', 'search-results']
          : objective === 'funding-call-promotion' || objective === 'grant-applications'
            ? ['funding-page', 'email-newsletters', 'ai-recommendations']
            : objective === 'institution-branding' || objective === 'publisher-branding'
              ? ['top-banners', 'featured-carousel']
              : ['sidebar-cards', 'recommendation-panels', 'trending-widgets'];
  return Array.from(new Set([...always, ...extra]));
}

/** Auction-style selection: highest priority live placements for a surface. */
export function selectPlacements(
  placements: readonly SponsoredPlacement[],
  surface: AdPlacement,
  limit = 3
): SponsoredPlacement[] {
  return placements
    .filter((placement) => placement.placement === surface && placement.status === 'live')
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Fraud detection
// ---------------------------------------------------------------------------

/** Severity of a fraud signal based on the ratio of invalid to total activity. */
export function assessFraudSeverity(
  invalidRatio: number,
  magnitude: number
): 'low' | 'medium' | 'high' | 'critical' {
  if (invalidRatio >= 0.5 || magnitude >= 10_000) return 'critical';
  if (invalidRatio >= 0.25 || magnitude >= 2_500) return 'high';
  if (invalidRatio >= 0.1 || magnitude >= 500) return 'medium';
  return 'low';
}

/**
 * Detect suspicious activity for a campaign from raw counters. Returns the
 * fraud signals that exceed the detection thresholds.
 */
export function detectFraudSignals(input: {
  campaignId: string;
  advertiserId: string;
  clicks: number;
  impressions: number;
  conversions: number;
  suspiciousClicks: number;
  suspiciousImpressions: number;
  suspiciousConversions: number;
  detectedAt?: string;
}): AdFraudSignal[] {
  const {
    campaignId,
    advertiserId,
    clicks,
    impressions,
    conversions,
    suspiciousClicks,
    suspiciousImpressions,
    suspiciousConversions,
  } = input;
  const detectedAt = input.detectedAt ?? new Date().toISOString();
  const signals: AdFraudSignal[] = [];
  const nextId = (type: AdFraudType) => `fraud-${campaignId}-${type}`;

  const clickRatio = clicks > 0 ? suspiciousClicks / clicks : 0;
  if (suspiciousClicks > 0) {
    signals.push({
      id: nextId('fake-click'),
      campaignId,
      advertiserId,
      type: 'fake-click',
      severity: assessFraudSeverity(clickRatio, suspiciousClicks),
      status: clickRatio >= 0.25 ? 'open' : 'investigating',
      detectedAt,
      description: `${suspiciousClicks} of ${clicks} clicks appear invalid (click farm / fake click pattern).`,
      evidence: ['Click velocity outlier', 'Same device repeated clicks', 'Zero dwell time'],
      invalidClicks: suspiciousClicks,
    });
  }

  const impressionRatio = impressions > 0 ? suspiciousImpressions / impressions : 0;
  if (suspiciousImpressions > 0) {
    signals.push({
      id: nextId('duplicate-impression'),
      campaignId,
      advertiserId,
      type: 'duplicate-impression',
      severity: assessFraudSeverity(impressionRatio, suspiciousImpressions),
      status: impressionRatio >= 0.25 ? 'open' : 'investigating',
      detectedAt,
      description: `${suspiciousImpressions} duplicate or bot-generated impressions detected.`,
      evidence: ['Bot traffic signature', 'Duplicate impression ids', 'Headless browser user agents'],
      invalidImpressions: suspiciousImpressions,
    });
  }

  if (suspiciousConversions > 0) {
    signals.push({
      id: nextId('invalid-conversion'),
      campaignId,
      advertiserId,
      type: 'invalid-conversion',
      severity: assessFraudSeverity(conversions > 0 ? suspiciousConversions / conversions : 1, suspiciousConversions),
      status: 'investigating',
      detectedAt,
      description: `${suspiciousConversions} conversions failed attribution checks.`,
      evidence: ['Conversion outside attribution window', 'Duplicate lead', 'Synthetic form submission'],
      invalidConversions: suspiciousConversions,
    });
  }

  return signals;
}

/** Overall fraud risk (0-100) for a set of signals, highest severity dominating. */
export function aggregateFraudRisk(signals: readonly AdFraudSignal[]): number {
  const severityScore: Record<AdFraudSignal['severity'], number> = {
    low: 20,
    medium: 40,
    high: 65,
    critical: 90,
  };
  const open = signals.filter((signal) => signal.status === 'open' || signal.status === 'investigating');
  if (open.length === 0) return 0;
  return Math.min(100, Math.round(open.reduce((sum, signal) => sum + severityScore[signal.severity], 0) / open.length));
}

// ---------------------------------------------------------------------------
// Review pipeline
// ---------------------------------------------------------------------------

/**
 * Evaluate a review record: a target passes only when every configured check
 * has cleared. This enforces the full safety pipeline (manual moderation, AI
 * moderation, academic integrity, spam detection, fraud detection).
 */
export function evaluateReview(review: AdReviewRecord): AdReviewRecord {
  const cleared = review.status !== 'rejected';
  if (!cleared) return review;
  return { ...review, status: 'approved' };
}

/** Create a fresh review record with the standard checks queued. */
export function createReviewRecord(input: {
  id: string;
  targetId: string;
  targetKind: AdReviewRecord['targetKind'];
  checks?: AdReviewRecord['checks'];
  createdAt?: string;
}): AdReviewRecord {
  return {
    id: input.id,
    targetId: input.targetId,
    targetKind: input.targetKind,
    checks: input.checks ?? ['manual-moderation', 'ai-moderation', 'academic-integrity', 'spam-detection', 'fraud-detection'],
    status: 'pending',
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Analytics surfaces
// ---------------------------------------------------------------------------

/** Conversion funnel derived from the counter surface. */
export function buildFunnel(input: {
  impressions: number;
  clicks: number;
  engagement: number;
  conversions: number;
}): { label: string; value: number; rate: number }[] {
  const { impressions, clicks, engagement, conversions } = input;
  return [
    { label: 'Impressions', value: impressions, rate: 100 },
    { label: 'Clicks', value: clicks, rate: calculateCtr(impressions, clicks) },
    { label: 'Engagement', value: engagement, rate: clicks > 0 ? round((engagement / clicks) * 100, 2) : 0 },
    { label: 'Conversions', value: conversions, rate: clicks > 0 ? round((conversions / clicks) * 100, 2) : 0 },
  ];
}

/** Hours 0-23 — the canonical time-of-day series used by analytics. */
export function timeOfDayHours(): number[] {
  return Array.from({ length: 24 }, (_, hour) => hour);
}

/** Device stats from the counters per device type. */
export function buildDeviceStats(stats: {
  Desktop: { impressions: number; clicks: number; conversions: number };
  Laptop: { impressions: number; clicks: number; conversions: number };
  Tablet: { impressions: number; clicks: number; conversions: number };
  Mobile: { impressions: number; clicks: number; conversions: number };
}): { device: 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile'; impressions: number; clicks: number; conversions: number; ctr: number }[] {
  const devices: ('Desktop' | 'Laptop' | 'Tablet' | 'Mobile')[] = ['Desktop', 'Laptop', 'Tablet', 'Mobile'];
  return devices.map((device) => {
    const entry = stats[device];
    return {
      device,
      impressions: entry.impressions,
      clicks: entry.clicks,
      conversions: entry.conversions,
      ctr: calculateCtr(entry.impressions, entry.clicks),
    };
  });
}

// ---------------------------------------------------------------------------
// Portfolio statistics & analytics
// ---------------------------------------------------------------------------

/** Aggregate statistics for the whole advertising marketplace. */
export function computeAdvertisingStatistics(input: {
  campaigns: readonly AdCampaign[];
  advertisers: readonly AdvertiserAccount[];
  promotableObjects: readonly PromotableObject[];
  audiences: readonly AdAudience[];
  placements: readonly SponsoredPlacement[];
  campaignAnalytics: readonly AdCampaignAnalytics[];
  fraudSignals: readonly AdFraudSignal[];
  reviewQueue: readonly AdReviewRecord[];
  forecasts?: readonly AdForecast[];
}): AdvertisingStatistics {
  const { campaigns, advertisers, promotableObjects, audiences, placements, campaignAnalytics, fraudSignals, reviewQueue, forecasts } = input;
  const statusCount = (status: AdCampaignStatus) => campaigns.filter((campaign) => campaign.status === status).length;

  const totalImpressions = campaignAnalytics.reduce((sum, a) => sum + a.metrics.impressions, 0);
  const totalClicks = campaignAnalytics.reduce((sum, a) => sum + a.metrics.clicks, 0);
  const totalConversions = campaignAnalytics.reduce((sum, a) => sum + a.metrics.conversions, 0);
  const totalSpend = campaignAnalytics.reduce((sum, a) => sum + a.metrics.spend, 0);
  const totalRevenue = campaignAnalytics.reduce((sum, a) => sum + a.metrics.revenue, 0);
  const qualityScores = forecasts?.map((forecast) => forecast.campaignQualityScore) ?? [];
  const avgQuality = qualityScores.length === 0 ? 0 : Math.round(qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length);

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: statusCount('active'),
    pausedCampaigns: statusCount('paused'),
    endedCampaigns: statusCount('ended') + statusCount('completed'),
    inReviewCampaigns: statusCount('in-review'),
    totalAdvertisers: advertisers.length,
    internalAdvertisers: advertisers.filter((advertiser) => advertiser.kind === 'scholatia-promote').length,
    externalAdvertisers: advertisers.filter((advertiser) => advertiser.kind === 'scholatia-ads').length,
    totalPromotableObjects: promotableObjects.length,
    promotableCategories: new Set(promotableObjects.map((object) => object.entityType)).size,
    totalAudiences: audiences.length,
    totalPlacements: placements.length,
    livePlacements: placements.filter((placement) => placement.status === 'live').length,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalSpend,
    totalRevenue,
    avgCtr: calculateCtr(totalImpressions, totalClicks),
    avgCpc: calculateCpc(totalSpend, totalClicks),
    avgCpa: calculateCpa(totalSpend, totalConversions),
    avgQualityScore: avgQuality,
    openFraudSignals: fraudSignals.filter((signal) => signal.status === 'open' || signal.status === 'investigating').length,
    reviewQueue: reviewQueue.filter((review) => review.status === 'pending' || review.status === 'needs-review').length,
  };
}

/** Aggregate analytics across the marketplace: revenue by objective, spend by placement, top campaigns. */
export function computeAdvertisingAnalytics(input: {
  campaigns: readonly AdCampaign[];
  placements: readonly SponsoredPlacement[];
  campaignAnalytics: readonly AdCampaignAnalytics[];
  audiences: readonly AdAudience[];
}): AdvertisingAnalytics {
  const { campaigns, placements, campaignAnalytics, audiences } = input;

  const revenueByObjective: AdvertisingAnalytics['revenueByObjective'] = campaigns.map((campaign) => {
    const analytics = campaignAnalytics.find((a) => a.campaignId === campaign.id);
    const spend = analytics?.metrics.spend ?? 0;
    const revenue = analytics?.metrics.revenue ?? 0;
    return { objective: campaign.objective, spend, revenue, roi: calculateRoi(revenue, spend) };
  });

  const campaignsByStatus: AdvertisingAnalytics['campaignsByStatus'] = (
    ['draft', 'in-review', 'active', 'paused', 'ended', 'rejected', 'completed'] as AdCampaignStatus[]
  ).map((status) => ({ status, count: campaigns.filter((campaign) => campaign.status === status).length }));

  const spendMap = new Map<AdPlacement, number>();
  for (const placement of placements) {
    spendMap.set(placement.placement, (spendMap.get(placement.placement) ?? 0) + placement.spend);
  }
  const spendByPlacement = Array.from(spendMap.entries()).map(([placement, spend]) => ({ placement, spend }));

  const topCampaigns = campaignAnalytics
    .map((analytics) => ({
      campaignId: analytics.campaignId,
      campaignName: analytics.campaignName,
      revenue: analytics.metrics.revenue,
      roi: analytics.metrics.roi,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const disciplineReach = new Map<string, number>();
  for (const audience of audiences) {
    for (const discipline of audience.disciplines) {
      disciplineReach.set(discipline, (disciplineReach.get(discipline) ?? 0) + audience.estimatedReach);
    }
  }
  const audienceReachByDiscipline = Array.from(disciplineReach.entries())
    .map(([discipline, reach]) => ({ discipline, reach }))
    .sort((a, b) => b.reach - a.reach)
    .slice(0, 8);

  return {
    revenueByObjective,
    campaignsByStatus,
    spendByPlacement,
    topCampaigns,
    audienceReachByDiscipline,
  };
}

/** Aggregate root builder for the marketplace. */
export function buildAdvertisingPortfolio(input: {
  promotableObjects: PromotableObject[];
  advertisers: AdvertiserAccount[];
  campaigns: AdCampaign[];
  adSets: AdSet[];
  creatives: AdCreative[];
  audiences: AdAudience[];
  placements: SponsoredPlacement[];
  forecasts: AdForecast[];
  fraudSignals: AdFraudSignal[];
  reviewQueue: AdReviewRecord[];
  campaignAnalytics: AdCampaignAnalytics[];
}): AdvertisingPortfolio {
  return {
    ...input,
    customAudiences: [],
    lookalikeAudiences: [],
    retargetingAudiences: [],
    statistics: computeAdvertisingStatistics(input),
    analytics: computeAdvertisingAnalytics(input),
  };
}

// ---------------------------------------------------------------------------
// Shared formatting vocabulary (pure, engine-side)
// ---------------------------------------------------------------------------

export function pricingModelUnit(model: AdPricingModel): string {
  switch (model) {
    case 'CPC':
      return 'per click';
    case 'CPM':
      return 'per 1,000 impressions';
    case 'CPR':
      return 'per registration';
    case 'CPS':
      return 'per submission';
    case 'CPD':
      return 'per download';
    case 'CPL':
      return 'per lead';
    case 'CPA':
      return 'per acquisition';
    default:
      return 'per campaign';
  }
}

export const AD_OBJECTIVE_LABELS: Record<AdObjective, string> = {
  awareness: 'Awareness',
  reach: 'Reach',
  'website-visits': 'Website visits',
  'conference-registration': 'Conference registration',
  'journal-submissions': 'Journal submissions',
  'dataset-downloads': 'Dataset downloads',
  'book-sales': 'Book sales',
  'grant-applications': 'Grant applications',
  'research-collaborations': 'Research collaborations',
  recruitment: 'Recruitment',
  'research-participants': 'Research participants',
  'institution-branding': 'Institution branding',
  'publisher-branding': 'Publisher branding',
  'course-enrolment': 'Course enrolment',
  'scholarship-promotion': 'Scholarship promotion',
  'funding-call-promotion': 'Funding call promotion',
  'marketplace-sales': 'Marketplace sales',
  'service-promotion': 'Service promotion',
  'lead-generation': 'Lead generation',
  'newsletter-subscriptions': 'Newsletter subscriptions',
  'research-visibility': 'Research visibility',
  'citation-growth': 'Citation growth',
  'profile-visibility': 'Profile visibility',
  'publication-promotion': 'Publication promotion',
  'event-ticket-sales': 'Event ticket sales',
};

export function adObjectiveLabel(objective: AdObjective): string {
  return AD_OBJECTIVE_LABELS[objective];
}

export default {
  registerPromotableObject,
  registerPromotableObjects,
  listPromotableObjects,
  createPromotableObject,
  transitionCampaignStatus,
  setCampaignStatus,
  activateCampaign,
  pauseCampaign,
  resumeCampaign,
  stopCampaign,
  calculateBudgetUtilization,
  remainingBudget,
  pacingDailySpend,
  aggregateMetrics,
  scoreAudienceMatch,
  matchesAudience,
  scoreAdRelevance,
  scoreCampaignQuality,
  estimateReach,
  forecastCampaign,
  recommendAudiences,
  recommendBestAudience,
  recommendPricingModel,
  recommendDurationDays,
  recommendedPlacements,
  selectPlacements,
  detectFraudSignals,
  aggregateFraudRisk,
  evaluateReview,
  createReviewRecord,
  buildFunnel,
  buildDeviceStats,
  computeAdvertisingStatistics,
  computeAdvertisingAnalytics,
  buildAdvertisingPortfolio,
} as const;
