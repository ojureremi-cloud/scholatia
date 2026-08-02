import type { CareerStage, CurrencyCode } from '@/types/funding';
import type { DiscoveryEntityType, DiscoveryItem } from '@/types/discovery';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { ResearcherPositionType } from '@/types/researcher';
import type { IntelligenceConfidence } from '@/types/intelligence';
import type { AdPlacement, PromotableEntityType, SponsoredLabel } from '@/types/ads';

/**
 * The Scholatia Research Services Marketplace of the Scholatia ecosystem.
 *
 * The Research Services Marketplace is the platform-wide professional services
 * layer for academia: "Upwork + Fiverr + ResearchGate Consulting" specialised
 * for research itself. Researchers buy and sell writing, editing, statistical
 * analysis, qualitative analysis, grant writing, literature reviews, research
 * design, publication support, conference abstracts, data work, mentoring,
 * tutoring, and publication strategy — delivered by verified academic
 * providers.
 *
 * The module is **additive by design**: every provider reuses an existing
 * researcher identity (`researcherUsername` + `researcherSaid`) when
 * applicable, every service is promotable through the Advertising module and
 * searchable through the Discovery module, and every order, review, milestone,
 * and dispute flows through the Commerce and Trust modules without duplicating
 * records owned by another module. Services are sold through the Commerce
 * engine (pricing, payments, escrow) while delivery is tracked through the
 * Advertising module's placement analytics (impressions, clicks, inquiries,
 * conversions, CTR, CPC, ROI).
 */

/** The forty research-service categories offered on the platform. */
export type ServiceCategory =
  | 'academic-writing'
  | 'thesis-writing'
  | 'manuscript-preparation'
  | 'technical-writing'
  | 'editing-proofreading'
  | 'language-polishing'
  | 'formatting'
  | 'referencing-citations'
  | 'translation'
  | 'statistical-analysis'
  | 'biostatistics'
  | 'econometrics'
  | 'python-data-analysis'
  | 'machine-learning-modeling'
  | 'qualitative-analysis'
  | 'thematic-analysis'
  | 'nvivo-analysis'
  | 'interview-transcription'
  | 'grounded-theory'
  | 'grantwriting'
  | 'proposal-development'
  | 'budget-preparation'
  | 'funding-strategy'
  | 'literature-review'
  | 'systematic-review'
  | 'meta-analysis'
  | 'research-design'
  | 'methodology-consulting'
  | 'survey-design'
  | 'journal-selection'
  | 'submission-support'
  | 'response-to-reviewers'
  | 'abstract-writing'
  | 'poster-design'
  | 'data-cleaning'
  | 'data-visualisation'
  | 'academic-mentoring'
  | 'tutoring'
  | 'publication-strategy'
  | 'career-development';

/** Coarse grouping of the forty categories for navigation and aggregation. */
export type ServiceCategoryGroup =
  | 'writing'
  | 'editing'
  | 'statistics'
  | 'qualitative'
  | 'grants'
  | 'literature'
  | 'research'
  | 'publishing'
  | 'conference'
  | 'data'
  | 'mentoring'
  | 'consulting';

/** The provider types that can sell research services. */
export type ServiceProviderType =
  | 'researcher'
  | 'statistician'
  | 'methodologist'
  | 'qualitative-analyst'
  | 'data-analyst'
  | 'editor'
  | 'translator'
  | 'grantwriter'
  | 'academic-writer'
  | 'consultant'
  | 'mentor'
  | 'tutor'
  | 'designer';

/** What a service physically delivers. */
export type ServiceType =
  | 'writing'
  | 'editing'
  | 'analysis'
  | 'consultation'
  | 'tutoring'
  | 'mentoring'
  | 'review'
  | 'design'
  | 'translation'
  | 'training';

export type ServiceStatus = 'draft' | 'pending-review' | 'active' | 'paused' | 'archived';

export type ServicePriceInterval =
  | 'one-time'
  | 'per-hour'
  | 'per-project'
  | 'per-word'
  | 'per-page'
  | 'per-session'
  | 'per-day'
  | 'per-month';

/** A price in a declared currency. No conversion is ever implied. */
export interface ServicePrice {
  amount: number;
  currency: CurrencyCode;
  interval?: ServicePriceInterval;
  /** List price before discounts, when discounted. */
  compareAt?: number;
}

/** A discount applied to a service. */
export interface ServiceDiscount {
  percent?: number;
  fixed?: number;
  startsAt?: string;
  endsAt?: string;
}

/** A service package within a provider's tiered offer (Basic / Standard / Premium). */
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: ServicePrice;
  deliveryDays: number;
  revisions: number;
  includes: string[];
  popular?: boolean;
}

export interface ServiceRatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface ServiceRatingSummary {
  average: number;
  count: number;
  distribution: ServiceRatingDistribution;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  providerId: string;
  reviewerId?: string;
  reviewerName: string;
  reviewerSaid?: string;
  rating: number;
  title: string;
  comment: string;
  helpfulVotes: number;
  verifiedPurchase: boolean;
  date: string;
}

/** Provider trust badges shown on provider profiles and service cards. */
export type ServiceProviderBadge =
  | 'Verified Provider'
  | 'Top Rated'
  | 'Fast Response'
  | 'Institution Verified'
  | 'Academic Verified'
  | 'Quality Assured'
  | 'New Provider'
  | 'High Volume'
  | 'Expert'
  | 'Trusted';

export interface ServiceProviderSkill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ServiceProviderCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export type ServiceProviderAvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface ServiceProviderAvailability {
  status: ServiceProviderAvailabilityStatus;
  openSlots: number;
  nextAvailable: string;
  weeklyHours: number;
}

export interface ServicePortfolioItem {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  client?: string;
  year?: string;
  result?: string;
}

export interface ServiceTestimonial {
  id: string;
  providerId: string;
  clientName: string;
  clientRole?: string;
  clientInstitution?: string;
  rating: number;
  comment: string;
  serviceTitle?: string;
  date: string;
}

/**
 * A provider of research services. Reuses an existing researcher identity
 * (`researcherUsername` + `researcherSaid`) whenever the provider is a
 * Scholatia researcher so no identity is duplicated.
 */
export interface ServiceProvider {
  id: string;
  username: string;
  name: string;
  type: ServiceProviderType;
  avatar?: string;
  headline: string;
  tagline: string;
  description: string;
  country: string;
  city?: string;
  institution?: string;
  institutionId?: string;
  institutionSaid?: string;
  position?: ResearcherPositionType;
  department?: string;
  researcherUsername?: string;
  researcherSaid?: string;
  verified: boolean;
  trustScore: number;
  badges: ServiceProviderBadge[];
  rating: ServiceRatingSummary;
  responseTime: string;
  completedJobs: number;
  completedJobsValue: number;
  successRate: number;
  languages: string[];
  skills: ServiceProviderSkill[];
  certifications: ServiceProviderCertification[];
  specializations: string[];
  availability: ServiceProviderAvailability;
  portfolio: ServicePortfolioItem[];
  testimonials: ServiceTestimonial[];
  memberSince: string;
  joinedAt: string;
  followers: number;
  serviceCount: number;
}

/** Advertising boost tier for a promoted service. */
export type ServiceBoostLevel = 'standard' | 'pro' | 'premium';

/** Advertising performance metrics carried by a promoted service. */
export interface ServiceAdMetrics {
  impressions: number;
  clicks: number;
  inquiries: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roi: number;
}

export interface ServiceRequirement {
  id: string;
  label: string;
  description?: string;
  required: boolean;
}

/**
 * A research service listing. Every service belongs to a provider and is a
 * live reference to the source record it services (`sourceId` +
 * `sourceEntity`) when applicable — a project id, a dataset id, a grant id, a
 * manuscript id, a journal id, or a conference id.
 */
export interface Service {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: ServiceCategory;
  group: ServiceCategoryGroup;
  type: ServiceType;
  providerId: string;
  providerName: string;
  price: ServicePrice;
  discount?: ServiceDiscount;
  packages: ServicePackage[];
  rating: ServiceRatingSummary;
  reviewCount: number;
  completedJobs: number;
  inquiries: number;
  favorites: number;
  views: number;
  keywords: string[];
  researchAreas: string[];
  disciplines: string[];
  careerStages: CareerStage[];
  stageIds: ResearchLifecycleStageId[];
  deliveryDays: number;
  revisions: number;
  languages: string[];
  targetAudience: string[];
  skills: string[];
  requirements: ServiceRequirement[];
  featured: boolean;
  sponsored: boolean;
  promoted: boolean;
  boostLevel?: ServiceBoostLevel;
  sponsoredLabel?: SponsoredLabel;
  adCampaignId?: string;
  adPlacement?: AdPlacement;
  adMetrics?: ServiceAdMetrics;
  badges: ServiceProviderBadge[];
  status: ServiceStatus;
  url: string;
  dateAdded: string;
  lastUpdated: string;
  sourceId?: string;
  sourceEntity?: DiscoveryEntityType;
}

export type ServiceOrderStatus =
  | 'pending'
  | 'in-progress'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

export type ServicePaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded';

export interface ServiceOrderMilestone {
  id: string;
  orderId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completedAt?: string;
}

/**
 * A service order. Purchases flow through the Commerce engine while delivery
 * is tracked here milestone by milestone.
 */
export interface ServiceOrder {
  id: string;
  orderNumber: string;
  serviceId: string;
  packageId?: string;
  providerId: string;
  providerName: string;
  buyerId?: string;
  buyerName: string;
  buyerSaid?: string;
  amount: number;
  currency: CurrencyCode;
  status: ServiceOrderStatus;
  paymentStatus: ServicePaymentStatus;
  placedAt: string;
  deadline?: string;
  deliveredAt?: string;
  completedAt?: string;
  milestones: ServiceOrderMilestone[];
  notes?: string;
}

export type ServiceDisputeStatus = 'open' | 'investigating' | 'resolved' | 'closed';

export interface ServiceDispute {
  id: string;
  orderId: string;
  serviceId: string;
  providerId: string;
  openedBy: string;
  subject: string;
  description: string;
  status: ServiceDisputeStatus;
  openedAt: string;
  resolvedAt?: string;
  resolution?: string;
  refunded: boolean;
  refundAmount?: number;
  currency?: CurrencyCode;
}

// ---------------------------------------------------------------------------
// Analytics, statistics, and dashboards
// ---------------------------------------------------------------------------

export interface ServiceCategoryStat {
  category: ServiceCategory;
  group: ServiceCategoryGroup;
  services: number;
  orders: number;
  revenue: number;
}

export interface ServiceTopService {
  serviceId: string;
  title: string;
  views: number;
  inquiries: number;
  orders: number;
  revenue: number;
  rating: number;
}

export interface ServiceTopProvider {
  providerId: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

export interface ServiceStatistics {
  totalServices: number;
  activeServices: number;
  totalProviders: number;
  verifiedProviders: number;
  totalCategories: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalReviews: number;
  averageRating: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  onTimeDeliveryRate: number;
  totalDisputes: number;
  openDisputes: number;
  resolvedDisputes: number;
  totalMilestones: number;
  completedMilestones: number;
  totalTestimonials: number;
  totalPortfolioItems: number;
  totalCountries: number;
  totalInstitutions: number;
  featuredServices: number;
  sponsoredServices: number;
  promotedServices: number;
}

export interface ServiceMarketplaceAnalytics {
  impressions: number;
  views: number;
  inquiries: number;
  orders: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  repeatBuyers: number;
  topServices: ServiceTopService[];
  topProviders: ServiceTopProvider[];
  byCategory: ServiceCategoryStat[];
  byStatus: { status: ServiceOrderStatus; count: number }[];
  byCountry: { country: string; orders: number }[];
}

export interface ProviderStatistics {
  totalProviders: number;
  activeProviders: number;
  verifiedProviders: number;
  topRatedProviders: number;
  averageRating: number;
  totalCompletedJobs: number;
  totalRevenue: number;
  totalServices: number;
  totalCountries: number;
  totalInstitutions: number;
  totalCertifications: number;
  averageResponseTime: string;
}

/** AI recommendation surfaced by the Intelligence layer. */
export type ServiceRecommendationType =
  | 'provider'
  | 'service'
  | 'category'
  | 'package'
  | 'mentor'
  | 'editor'
  | 'statistician';

export interface ServiceRecommendation {
  id: string;
  type: ServiceRecommendationType;
  targetId: string;
  sourceId?: string;
  sourceEntity?: DiscoveryEntityType;
  title: string;
  summary: string;
  url: string;
  score: number;
  confidence: IntelligenceConfidence;
  reasons: string[];
  tags: string[];
  audience?: string;
  date: string;
}

/** Aggregate root of the Research Services Marketplace. */
export interface ServicePortfolio {
  statistics: ServiceStatistics;
  analytics: ServiceMarketplaceAnalytics;
  providers: ServiceProvider[];
  services: Service[];
  categories: ServiceCategory[];
  packages: ServicePackage[];
  reviews: ServiceReview[];
  testimonials: ServiceTestimonial[];
  portfolios: ServicePortfolioItem[];
  orders: ServiceOrder[];
  milestones: ServiceOrderMilestone[];
  disputes: ServiceDispute[];
  recommendations: ServiceRecommendation[];
  discoveryItems: DiscoveryItem[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  'academic-writing',
  'thesis-writing',
  'manuscript-preparation',
  'technical-writing',
  'editing-proofreading',
  'language-polishing',
  'formatting',
  'referencing-citations',
  'translation',
  'statistical-analysis',
  'biostatistics',
  'econometrics',
  'python-data-analysis',
  'machine-learning-modeling',
  'qualitative-analysis',
  'thematic-analysis',
  'nvivo-analysis',
  'interview-transcription',
  'grounded-theory',
  'grantwriting',
  'proposal-development',
  'budget-preparation',
  'funding-strategy',
  'literature-review',
  'systematic-review',
  'meta-analysis',
  'research-design',
  'methodology-consulting',
  'survey-design',
  'journal-selection',
  'submission-support',
  'response-to-reviewers',
  'abstract-writing',
  'poster-design',
  'data-cleaning',
  'data-visualisation',
  'academic-mentoring',
  'tutoring',
  'publication-strategy',
  'career-development',
];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  'academic-writing': 'Academic Writing',
  'thesis-writing': 'Thesis & Dissertation Writing',
  'manuscript-preparation': 'Manuscript Preparation',
  'technical-writing': 'Technical Writing',
  'editing-proofreading': 'Editing & Proofreading',
  'language-polishing': 'Language Polishing',
  formatting: 'Formatting & Typesetting',
  'referencing-citations': 'Referencing & Citations',
  translation: 'Academic Translation',
  'statistical-analysis': 'Statistical Analysis',
  biostatistics: 'Biostatistics',
  econometrics: 'Econometrics',
  'python-data-analysis': 'Python Data Analysis',
  'machine-learning-modeling': 'Machine Learning Modeling',
  'qualitative-analysis': 'Qualitative Analysis',
  'thematic-analysis': 'Thematic Analysis',
  'nvivo-analysis': 'NVivo Analysis',
  'interview-transcription': 'Interview & Focus Group Analysis',
  'grounded-theory': 'Grounded Theory',
  grantwriting: 'Grant Writing',
  'proposal-development': 'Proposal Development',
  'budget-preparation': 'Budget Preparation',
  'funding-strategy': 'Funding Strategy',
  'literature-review': 'Literature Review',
  'systematic-review': 'Systematic Review',
  'meta-analysis': 'Meta-Analysis',
  'research-design': 'Research Design',
  'methodology-consulting': 'Methodology Consulting',
  'survey-design': 'Survey Design',
  'journal-selection': 'Journal Selection',
  'submission-support': 'Submission Support',
  'response-to-reviewers': 'Response to Reviewers',
  'abstract-writing': 'Conference Abstract Writing',
  'poster-design': 'Poster & Figure Design',
  'data-cleaning': 'Data Cleaning',
  'data-visualisation': 'Data Visualisation',
  'academic-mentoring': 'Academic Mentoring',
  tutoring: 'Tutoring & Exam Prep',
  'publication-strategy': 'Publication Strategy',
  'career-development': 'Academic Career Development',
};

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  'academic-writing': '✍️',
  'thesis-writing': '📖',
  'manuscript-preparation': '📝',
  'technical-writing': '🛠️',
  'editing-proofreading': '🔍',
  'language-polishing': '✨',
  formatting: '📐',
  'referencing-citations': '🔗',
  translation: '🌐',
  'statistical-analysis': '📊',
  biostatistics: '🧬',
  econometrics: '📈',
  'python-data-analysis': '🐍',
  'machine-learning-modeling': '🤖',
  'qualitative-analysis': '💬',
  'thematic-analysis': '🗂️',
  'nvivo-analysis': '🧩',
  'interview-transcription': '🎙️',
  'grounded-theory': '🌱',
  grantwriting: '💰',
  'proposal-development': '📋',
  'budget-preparation': '🧮',
  'funding-strategy': '🎯',
  'literature-review': '📚',
  'systematic-review': '🔬',
  'meta-analysis': '📉',
  'research-design': '🧭',
  'methodology-consulting': '🔬',
  'survey-design': '📋',
  'journal-selection': '🗞️',
  'submission-support': '📤',
  'response-to-reviewers': '💌',
  'abstract-writing': '📄',
  'poster-design': '🖼️',
  'data-cleaning': '🧹',
  'data-visualisation': '📱',
  'academic-mentoring': '🎓',
  tutoring: '🧑‍🏫',
  'publication-strategy': '🚀',
  'career-development': '🪜',
};

export const SERVICE_CATEGORY_GROUPS: readonly ServiceCategoryGroup[] = [
  'writing',
  'editing',
  'statistics',
  'qualitative',
  'grants',
  'literature',
  'research',
  'publishing',
  'conference',
  'data',
  'mentoring',
  'consulting',
];

export const SERVICE_CATEGORY_GROUP_LABELS: Record<ServiceCategoryGroup, string> = {
  writing: 'Writing',
  editing: 'Editing',
  statistics: 'Statistics',
  qualitative: 'Qualitative',
  grants: 'Grants',
  literature: 'Literature',
  research: 'Research Design',
  publishing: 'Publishing',
  conference: 'Conference',
  data: 'Data',
  mentoring: 'Mentoring',
  consulting: 'Consulting',
};

export const SERVICE_CATEGORY_GROUP_ICONS: Record<ServiceCategoryGroup, string> = {
  writing: '✍️',
  editing: '🔍',
  statistics: '📊',
  qualitative: '💬',
  grants: '💰',
  literature: '📚',
  research: '🧭',
  publishing: '🗞️',
  conference: '🎤',
  data: '🧹',
  mentoring: '🎓',
  consulting: '🚀',
};

export const SERVICE_CATEGORY_TO_GROUP: Record<ServiceCategory, ServiceCategoryGroup> = {
  'academic-writing': 'writing',
  'thesis-writing': 'writing',
  'manuscript-preparation': 'writing',
  'technical-writing': 'writing',
  'editing-proofreading': 'editing',
  'language-polishing': 'editing',
  formatting: 'editing',
  'referencing-citations': 'editing',
  translation: 'editing',
  'statistical-analysis': 'statistics',
  biostatistics: 'statistics',
  econometrics: 'statistics',
  'python-data-analysis': 'statistics',
  'machine-learning-modeling': 'statistics',
  'qualitative-analysis': 'qualitative',
  'thematic-analysis': 'qualitative',
  'nvivo-analysis': 'qualitative',
  'interview-transcription': 'qualitative',
  'grounded-theory': 'qualitative',
  grantwriting: 'grants',
  'proposal-development': 'grants',
  'budget-preparation': 'grants',
  'funding-strategy': 'grants',
  'literature-review': 'literature',
  'systematic-review': 'literature',
  'meta-analysis': 'literature',
  'research-design': 'research',
  'methodology-consulting': 'research',
  'survey-design': 'research',
  'journal-selection': 'publishing',
  'submission-support': 'publishing',
  'response-to-reviewers': 'publishing',
  'abstract-writing': 'conference',
  'poster-design': 'conference',
  'data-cleaning': 'data',
  'data-visualisation': 'data',
  'academic-mentoring': 'mentoring',
  tutoring: 'mentoring',
  'publication-strategy': 'consulting',
  'career-development': 'consulting',
};

export const SERVICE_PROVIDER_TYPES: readonly ServiceProviderType[] = [
  'researcher',
  'statistician',
  'methodologist',
  'qualitative-analyst',
  'data-analyst',
  'editor',
  'translator',
  'grantwriter',
  'academic-writer',
  'consultant',
  'mentor',
  'tutor',
  'designer',
];

export const SERVICE_PROVIDER_TYPE_LABELS: Record<ServiceProviderType, string> = {
  researcher: 'Researcher',
  statistician: 'Statistician',
  methodologist: 'Methodologist',
  'qualitative-analyst': 'Qualitative Analyst',
  'data-analyst': 'Data Analyst',
  editor: 'Academic Editor',
  translator: 'Translator',
  grantwriter: 'Grant Writer',
  'academic-writer': 'Academic Writer',
  consultant: 'Consultant',
  mentor: 'Mentor',
  tutor: 'Tutor',
  designer: 'Designer',
};

export const SERVICE_TYPES: readonly ServiceType[] = [
  'writing',
  'editing',
  'analysis',
  'consultation',
  'tutoring',
  'mentoring',
  'review',
  'design',
  'translation',
  'training',
];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  writing: 'Writing',
  editing: 'Editing',
  analysis: 'Analysis',
  consultation: 'Consultation',
  tutoring: 'Tutoring',
  mentoring: 'Mentoring',
  review: 'Review',
  design: 'Design',
  translation: 'Translation',
  training: 'Training',
};

export const SERVICE_STATUSES: readonly ServiceStatus[] = ['draft', 'pending-review', 'active', 'paused', 'archived'];

export const SERVICE_PRICE_INTERVALS: readonly ServicePriceInterval[] = [
  'one-time',
  'per-hour',
  'per-project',
  'per-word',
  'per-page',
  'per-session',
  'per-day',
  'per-month',
];

export const SERVICE_BADGES: readonly ServiceProviderBadge[] = [
  'Verified Provider',
  'Top Rated',
  'Fast Response',
  'Institution Verified',
  'Academic Verified',
  'Quality Assured',
  'New Provider',
  'High Volume',
  'Expert',
  'Trusted',
];

export const SERVICE_ORDER_STATUSES: readonly ServiceOrderStatus[] = [
  'pending',
  'in-progress',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'disputed',
];

export const SERVICE_PAYMENT_STATUSES: readonly ServicePaymentStatus[] = ['unpaid', 'pending', 'paid', 'refunded'];

export const SERVICE_DISPUTE_STATUSES: readonly ServiceDisputeStatus[] = ['open', 'investigating', 'resolved', 'closed'];

export const SERVICE_BOOST_LEVELS: readonly ServiceBoostLevel[] = ['standard', 'pro', 'premium'];

export const SERVICE_RECOMMENDATION_TYPES: readonly ServiceRecommendationType[] = [
  'provider',
  'service',
  'category',
  'package',
  'mentor',
  'editor',
  'statistician',
];

export const SERVICE_DELIVERY_BASE_DAYS: Record<ServiceCategory, number> = {
  'academic-writing': 7,
  'thesis-writing': 14,
  'manuscript-preparation': 5,
  'technical-writing': 6,
  'editing-proofreading': 3,
  'language-polishing': 2,
  formatting: 2,
  'referencing-citations': 2,
  translation: 5,
  'statistical-analysis': 4,
  biostatistics: 4,
  econometrics: 5,
  'python-data-analysis': 4,
  'machine-learning-modeling': 7,
  'qualitative-analysis': 6,
  'thematic-analysis': 4,
  'nvivo-analysis': 5,
  'interview-transcription': 5,
  'grounded-theory': 7,
  grantwriting: 10,
  'proposal-development': 8,
  'budget-preparation': 3,
  'funding-strategy': 4,
  'literature-review': 6,
  'systematic-review': 12,
  'meta-analysis': 12,
  'research-design': 5,
  'methodology-consulting': 3,
  'survey-design': 4,
  'journal-selection': 2,
  'submission-support': 3,
  'response-to-reviewers': 4,
  'abstract-writing': 3,
  'poster-design': 3,
  'data-cleaning': 2,
  'data-visualisation': 3,
  'academic-mentoring': 2,
  tutoring: 1,
  'publication-strategy': 4,
  'career-development': 3,
};

/** Mapping from service category to the closest discovery entity type. */
export const SERVICE_TO_DISCOVERY_ENTITY: Record<ServiceCategory, DiscoveryEntityType> = {
  'academic-writing': 'manuscript',
  'thesis-writing': 'manuscript',
  'manuscript-preparation': 'manuscript',
  'technical-writing': 'project',
  'editing-proofreading': 'manuscript',
  'language-polishing': 'manuscript',
  formatting: 'manuscript',
  'referencing-citations': 'publication',
  translation: 'manuscript',
  'statistical-analysis': 'project',
  biostatistics: 'project',
  econometrics: 'project',
  'python-data-analysis': 'project',
  'machine-learning-modeling': 'project',
  'qualitative-analysis': 'project',
  'thematic-analysis': 'project',
  'nvivo-analysis': 'project',
  'interview-transcription': 'project',
  'grounded-theory': 'project',
  grantwriting: 'funding',
  'proposal-development': 'funding',
  'budget-preparation': 'funding',
  'funding-strategy': 'funding',
  'literature-review': 'publication',
  'systematic-review': 'publication',
  'meta-analysis': 'publication',
  'research-design': 'project',
  'methodology-consulting': 'project',
  'survey-design': 'project',
  'journal-selection': 'journal',
  'submission-support': 'journal',
  'response-to-reviewers': 'publication',
  'abstract-writing': 'conference',
  'poster-design': 'conference',
  'data-cleaning': 'dataset',
  'data-visualisation': 'dataset',
  'academic-mentoring': 'researcher',
  tutoring: 'project',
  'publication-strategy': 'publication',
  'career-development': 'researcher',
};

/** Entity type to register a service under in the Advertising module. */
export function servicePromotableEntityType(service: Service): PromotableEntityType {
  const entity = SERVICE_TO_DISCOVERY_ENTITY[service.category];
  if (entity === 'journal') return 'journal';
  if (entity === 'conference') return 'conference';
  if (entity === 'funding') return 'funding-opportunity';
  if (entity === 'dataset') return 'dataset';
  if (entity === 'researcher') return 'researcher-profile';
  if (entity === 'manuscript') return 'academic-service';
  return 'academic-service';
}
