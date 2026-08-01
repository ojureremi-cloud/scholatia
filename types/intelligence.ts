import type { DiscoveryEntityType } from '@/types/discovery';

/**
 * The Scholarly Intelligence Platform of the Scholatia ecosystem.
 *
 * The Intelligence module is the AI layer that observes the rest of the
 * ecosystem. It does NOT introduce a new lifecycle stage and does NOT own its
 * own records; instead it derives insights, recommendations, trends,
 * predictions, gaps, and a knowledge graph from the existing Researchers,
 * Journals, Conferences, Publishers, Institutions, Projects, Funding, Datasets,
 * Manuscripts, and Discovery placeholder modules. Every intelligence record
 * references the original source identity so nothing is duplicated.
 */

/** Calibration level reported alongside every derived signal. */
export type IntelligenceConfidence = 'high' | 'medium' | 'low';

export type IntelligenceInsightSeverity = 'info' | 'positive' | 'warning' | 'critical';

export type IntelligenceInsightType =
  | 'signal'
  | 'warning'
  | 'opportunity'
  | 'trend'
  | 'prediction'
  | 'gap'
  | 'recommendation';

/** A narrative insight generated from the derived signals. */
export interface IntelligenceInsight {
  id: string;
  title: string;
  summary: string;
  type: IntelligenceInsightType;
  severity: IntelligenceInsightSeverity;
  confidence: IntelligenceConfidence;
  /** The module the insight primarily speaks to, when applicable. */
  entityType?: DiscoveryEntityType;
  /** Original source identity (SAID, journalId, DOI, grant id). */
  sourceId?: string;
  tags: string[];
  date: string;
}

/** Compact researcher identity reused across intelligence surfaces. */
export interface ResearcherSummary {
  username: string;
  said: string;
  displayName: string;
  institution: string;
  country: string;
  discipline: string;
  researchAreas: string[];
  skills: string[];
  url: string;
  trustScore: number;
  hIndex: number;
  totalCitations: number;
}

/** Base recommendation against a specific source record. */
export interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  entityType: DiscoveryEntityType;
  /** Original source identity (SAID, journalId, conferenceId, DOI, grant id). */
  sourceId: string;
  url: string;
  /** Overall fit, 0-100. */
  score: number;
  confidence: IntelligenceConfidence;
  /** Human-readable reasons that contributed to the match. */
  reasons: string[];
  tags: string[];
  /** Display name of the researcher the recommendation is personalised for. */
  audience?: string;
  date: string;
}

/** Funding opportunity matched to a researcher profile. */
export interface FundingRecommendation extends Recommendation {
  entityType: 'funding';
  agencyName: string;
  category: string;
  grantType: string;
  careerStage: string;
  amountTypical?: number;
  currency: string;
  deadline: string;
  durationMonths: number;
  eligibility: string[];
  matchBreakdown: { criterion: string; score: number }[];
}

/** Journal matched to a manuscript or researcher's discipline. */
export interface JournalRecommendation extends Recommendation {
  entityType: 'journal';
  journalId: string;
  issn?: string;
  discipline: string;
  quartile?: string;
  impactFactor?: number;
  openAccess: string;
  reviewModel: string;
  fitScore: number;
}

/** Conference matched to a researcher's research areas. */
export interface ConferenceRecommendation extends Recommendation {
  entityType: 'conference';
  conferenceId: string;
  eventType: string;
  country: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  registrationStatus: string;
  submissionStatus: string;
  researchAreas: string[];
}

/** Dataset matched to a researcher's interests. */
export interface DatasetRecommendation extends Recommendation {
  entityType: 'dataset';
  datasetId: string;
  doi: string;
  discipline: string;
  downloads: number;
  citations: number;
  access: string;
  institution: string;
}

/** Institution matched to a researcher's discipline. */
export interface InstitutionRecommendation extends Recommendation {
  entityType: 'institution';
  institutionId: string;
  country: string;
  continent: string;
  discipline: string;
  trustScore: number;
  researchAreas: string[];
}

/** Momentum signal for a topic, derived from the unified index. */
export interface ResearchTrend {
  id: string;
  topic: string;
  discipline: string;
  /** Momentum from -100 (declining) to +100 (rising). */
  momentum: number;
  /** Projected growth rate, percent. */
  growthRate: number;
  timeframe: string;
  relatedKeywords: string[];
  /** Which index modules contributed to the signal. */
  signalSources: DiscoveryEntityType[];
  itemCount: number;
  recentCount: number;
  description: string;
  direction: 'rising' | 'stable' | 'declining';
}

/** A topic that is early in its adoption curve. */
export interface EmergingTopic {
  id: string;
  topic: string;
  discipline: string;
  /** 0-100 novelty of the topic. */
  novelty: number;
  /** 0-100 recent momentum. */
  momentum: number;
  /** 0-100 projected potential. */
  potential: number;
  adoptionStage: 'exploratory' | 'growing' | 'established';
  relatedKeywords: string[];
  sources: { entityType: DiscoveryEntityType; count: number }[];
  description: string;
}

/** A pairing of two researchers with complementary overlap. */
export interface CollaborationSuggestion {
  id: string;
  researcher: ResearcherSummary;
  partner: ResearcherSummary;
  sharedInterests: string[];
  complementarySkills: string[];
  /** 0-100 overlap of research interests. */
  overlapScore: number;
  /** 0-100 overall collaboration potential. */
  collaborationPotential: number;
  countries: string[];
  recommendation: string;
}

/** A single point on a citation projection curve. */
export interface CitationPredictionPoint {
  year: string;
  citations: number;
  predicted?: boolean;
}

/** Projected citation trajectory for a publication or researcher. */
export interface CitationPrediction {
  id: string;
  target: string;
  entityType: DiscoveryEntityType;
  sourceId: string;
  url: string;
  currentCitations: number;
  projectedCitations: number;
  horizonMonths: number;
  projectionDate: string;
  growthRate: number;
  confidence: IntelligenceConfidence;
  rationale: string;
  dataPoints: CitationPredictionPoint[];
}

/** A researcher matched to a topic with supporting evidence. */
export interface ExpertiseMatch {
  id: string;
  researcher: ResearcherSummary;
  topic: string;
  discipline: string;
  /** 0-100 topic expertise score. */
  score: number;
  evidence: string[];
  /** Optional gap in the researcher's coverage of the topic. */
  gap?: string;
}

/** An under-served topic within the ecosystem. */
export interface ResearchGap {
  id: string;
  topic: string;
  discipline: string;
  severity: 'high' | 'medium' | 'low';
  /** 0-100 opportunity to fill the gap. */
  opportunityScore: number;
  rationale: string;
  evidence: { entityType: DiscoveryEntityType; count: number }[];
  recommendations: string[];
}

/** One scenario in a forecast. */
export interface ForecastScenario {
  label: string;
  probability: number;
  growth: number;
  description: string;
}

/** A projection for a topic over a horizon. */
export interface ResearchForecast {
  id: string;
  topic: string;
  discipline: string;
  horizonMonths: number;
  projectedGrowth: number;
  confidence: IntelligenceConfidence;
  scenarios: ForecastScenario[];
  rationale: string;
}

/** A node in the ecosystem knowledge graph, referencing a source record. */
export interface KnowledgeGraphNode {
  id: string;
  label: string;
  entityType: DiscoveryEntityType;
  sourceId: string;
  url: string;
  /** Node importance, 0-100. */
  weight: number;
  /** Module grouping used for coloring. */
  group: string;
  detail?: string;
}

/** A directed relationship between two graph nodes. */
export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  /** 0-100 strength of the relationship. */
  weight: number;
}

export interface IntelligenceAnalytics {
  totalInsights: number;
  totalRecommendations: number;
  totalTrends: number;
  totalPredictions: number;
  averageConfidence: number;
  recommendationsByType: { entityType: DiscoveryEntityType; count: number }[];
  insightsBySeverity: { severity: IntelligenceInsightSeverity; count: number }[];
  trendsByDiscipline: { discipline: string; count: number }[];
  gapsBySeverity: { severity: 'high' | 'medium' | 'low'; count: number }[];
  topEmergingTopics: EmergingTopic[];
  modelMetrics: {
    recommendationHitRate: number;
    predictionAccuracy: number;
    coverage: number;
    averageLatency: string;
    freshness: string;
  };
}

export interface IntelligenceStatistics {
  totalInsights: number;
  totalRecommendations: number;
  totalTrends: number;
  totalEmergingTopics: number;
  totalCollaborationSuggestions: number;
  totalPredictions: number;
  totalExpertiseMatches: number;
  totalResearchGaps: number;
  totalGraphNodes: number;
  totalGraphEdges: number;
  trackedTopics: number;
  monitoredDisciplines: number;
  monitoredCountries: number;
  avgConfidence: number;
  avgRecommendationScore: number;
  topTopic: string;
  topDiscipline: string;
}

/**
 * Aggregate root of the module: every derived intelligence surface plus the
 * statistics and analytics that summarize it.
 */
export interface IntelligencePortfolio {
  statistics: IntelligenceStatistics;
  analytics: IntelligenceAnalytics;
  insights: IntelligenceInsight[];
  recommendations: Recommendation[];
  fundingRecommendations: FundingRecommendation[];
  journalRecommendations: JournalRecommendation[];
  conferenceRecommendations: ConferenceRecommendation[];
  datasetRecommendations: DatasetRecommendation[];
  institutionRecommendations: InstitutionRecommendation[];
  collaborationSuggestions: CollaborationSuggestion[];
  trends: ResearchTrend[];
  emergingTopics: EmergingTopic[];
  predictions: CitationPrediction[];
  expertiseMatches: ExpertiseMatch[];
  researchGaps: ResearchGap[];
  forecast: ResearchForecast[];
  graphNodes: KnowledgeGraphNode[];
  graphEdges: KnowledgeGraphEdge[];
}
