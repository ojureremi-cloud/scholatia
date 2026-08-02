import type {
  ProviderStatistics,
  Service,
  ServiceCategory,
  ServiceCategoryStat,
  ServiceMarketplaceAnalytics,
  ServiceOrder,
  ServiceOrderMilestone,
  ServiceOrderStatus,
  ServicePackage,
  ServicePortfolioItem,
  ServiceProvider,
  ServiceRatingDistribution,
  ServiceRatingSummary,
  ServiceRecommendation,
  ServiceReview,
  ServiceStatistics,
  ServiceTopProvider,
  ServiceTopService,
} from '@/types/services';
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_TO_GROUP,
  SERVICE_TO_DISCOVERY_ENTITY,
  servicePromotableEntityType,
} from '@/types/services';
import type { DiscoveryItem } from '@/types/discovery';
import type { CurrencyCode } from '@/types/funding';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { PromotableObject } from '@/types/ads';
import { createPromotableObject } from '@/lib/ads';

/**
 * Scholatia Research Services Engine (Phase 2.1).
 *
 * The Research Services Marketplace is the platform-wide professional services
 * layer for academia. It does NOT own records and does NOT duplicate any module
 * data — every provider reuses an existing researcher identity when applicable,
 * every service is promotable through the Advertising module and searchable
 * through the Discovery module, and every order, review, milestone, and dispute
 * is derived from the pure helpers below. These utilities are strongly typed so
 * the placeholder data and the Services page never re-implement pricing,
 * review aggregation, search, ranking, bundling, estimation, or analytics by
 * hand.
 */

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export const SERVICE_ROOT = '/services';
export const SERVICE_PROVIDER_ROOT = '/services/providers';

/** Canonical in-app provider URL: /services/providers/{username}. */
export function buildProviderUrl(username: string): string {
  return `${SERVICE_PROVIDER_ROOT}/${username}`;
}

/** Canonical in-app service URL: /services/{id}. */
export function buildServiceUrl(id: string): string {
  return `${SERVICE_ROOT}/${id}`;
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/** Effective unit price after any discount, in the service's currency. */
export function effectiveServicePrice(service: Service, pkg?: ServicePackage): number {
  const price = pkg?.price ?? service.price;
  const discount = service.discount;
  if (!discount) return price.amount;
  let effective = price.amount;
  if (discount.fixed != null) {
    effective = Math.max(0, effective - discount.fixed);
  }
  if (discount.percent != null) {
    effective = effective * (1 - discount.percent / 100);
  }
  return Math.round(effective * 100) / 100;
}

/** List price (compare-at or stated amount) for a service or package. */
export function serviceListPrice(service: Service, pkg?: ServicePackage): number {
  const price = pkg?.price ?? service.price;
  return price.compareAt ?? price.amount;
}

/** Whole-number discount percent currently applied to a service. */
export function serviceDiscountPercent(service: Service, pkg?: ServicePackage): number {
  const list = serviceListPrice(service, pkg);
  if (list <= 0) return 0;
  const effective = effectiveServicePrice(service, pkg);
  if (effective >= list) return 0;
  return Math.round(((list - effective) / list) * 100);
}

export function isServiceDiscounted(service: Service, pkg?: ServicePackage): boolean {
  return serviceDiscountPercent(service, pkg) > 0;
}

/** Base price of the least expensive package, when packages exist. */
export function serviceFromPrice(service: Service): number {
  if (service.packages.length === 0) return service.price.amount;
  return Math.min(...service.packages.map((pkg) => pkg.price.amount));
}

/** The standard (middle) package of a service, when packages exist. */
export function standardPackage(service: Service): ServicePackage | undefined {
  if (service.packages.length === 0) return undefined;
  return service.packages.find((pkg) => pkg.name.toLowerCase() === 'standard') ?? service.packages[0];
}

// ---------------------------------------------------------------------------
// Delivery estimation
// ---------------------------------------------------------------------------

/**
 * Estimated delivery window in days for a service. Scales the base category
 * turnaround by revisions and the selected package.
 */
export function estimateDelivery(service: Service, pkg?: ServicePackage): { days: number; range: string } {
  const base = service.deliveryDays;
  const revisions = pkg?.revisions ?? service.revisions;
  const scaled = Math.max(1, base + Math.max(0, revisions - 1) * 1);
  return { days: scaled, range: `${scaled}-${scaled + 2} days` };
}

// ---------------------------------------------------------------------------
// Reviews & ratings
// ---------------------------------------------------------------------------

export function emptyServiceRating(): ServiceRatingSummary {
  return {
    average: 0,
    count: 0,
    distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
  };
}

/** Star distribution computed from a set of reviews. */
export function serviceRatingDistribution(reviews: readonly ServiceReview[]): ServiceRatingDistribution {
  const distribution: ServiceRatingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  for (const review of reviews) {
    const key = String(Math.min(5, Math.max(1, Math.round(review.rating)))) as '1' | '2' | '3' | '4' | '5';
    distribution[key] += 1;
  }
  return distribution;
}

/** Aggregate rating summary for any review set. */
export function calculateRatings(reviews: readonly ServiceReview[]): ServiceRatingSummary {
  if (reviews.length === 0) return emptyServiceRating();
  const distribution = serviceRatingDistribution(reviews);
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return { average: Math.round(average * 10) / 10, count: reviews.length, distribution };
}

/** Reviews for a single service, plus its aggregate rating. */
export function aggregateServiceReviews(reviews: readonly ServiceReview[], serviceId: string) {
  const serviceReviews = reviews.filter((review) => review.serviceId === serviceId);
  return { reviews: serviceReviews, summary: calculateRatings(serviceReviews) };
}

/** Reviews for a single provider, plus its aggregate rating. */
export function providerRatings(reviews: readonly ServiceReview[], providerId: string) {
  const providerReviews = reviews.filter((review) => review.providerId === providerId);
  return { reviews: providerReviews, summary: calculateRatings(providerReviews) };
}

// ---------------------------------------------------------------------------
// Search, filtering, ranking
// ---------------------------------------------------------------------------

export function serviceKeywords(service: Service): string[] {
  return Array.from(
    new Set([
      ...service.keywords,
      ...service.researchAreas,
      ...service.disciplines,
      ...service.skills,
      ...service.languages,
      service.category,
      service.providerName,
    ].filter(Boolean)),
  );
}

function tokensOf(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s\-_,.:/]+/)
    .filter((token) => token.length > 0);
}

/** 0-100 relevance score for a single service against a free-text query. */
export function scoreServiceRelevance(service: Service, query: string): number {
  if (!query.trim()) return service.rating.average * 5 + service.completedJobs;
  const tokens = tokensOf(query);
  if (tokens.length === 0) return 0;
  const haystack = [
    service.title,
    service.summary,
    service.description,
    service.providerName,
    service.category,
    ...serviceKeywords(service),
  ]
    .join(' ')
    .toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 30;
  }
  const matchRatio = score / (30 * tokens.length);
  const popularity = Math.min(25, service.completedJobs * 0.5 + service.rating.average * 3 + service.favorites * 0.25);
  return Math.min(100, Math.round(matchRatio * 75 + popularity));
}

export type ServiceFilter = {
  query?: string;
  category?: ServiceCategory | 'all';
  group?: string;
  providerId?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: CurrencyCode;
  careerStage?: string;
  deliveryMaxDays?: number;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  sponsoredOnly?: boolean;
  promotedOnly?: boolean;
  language?: string;
};

/** Apply the service filter set without re-implementing it in the UI. */
export function filterServices(services: readonly Service[], filter: ServiceFilter = {}): Service[] {
  return services.filter((service) => {
    if (filter.query && scoreServiceRelevance(service, filter.query) <= 0) return false;
    if (filter.category && filter.category !== 'all' && service.category !== filter.category) return false;
    if (filter.group && SERVICE_CATEGORY_TO_GROUP[service.category] !== filter.group) return false;
    if (filter.providerId && service.providerId !== filter.providerId) return false;
    if (filter.currency && service.price.currency !== filter.currency) return false;
    if (filter.minPrice != null && effectiveServicePrice(service) < filter.minPrice) return false;
    if (filter.maxPrice != null && effectiveServicePrice(service) > filter.maxPrice) return false;
    if (filter.careerStage && !service.careerStages.includes(filter.careerStage as never)) return false;
    if (filter.deliveryMaxDays != null && service.deliveryDays > filter.deliveryMaxDays) return false;
    if (filter.verifiedOnly && !service.badges.includes('Verified Provider')) return false;
    if (filter.featuredOnly && !service.featured) return false;
    if (filter.sponsoredOnly && !service.sponsored) return false;
    if (filter.promotedOnly && !service.promoted) return false;
    if (filter.language && !service.languages.includes(filter.language)) return false;
    return true;
  });
}

export type ServiceSort =
  | 'relevance'
  | 'recent'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popularity'
  | 'delivery';

/** Sort a service slice; relevance requires a query and falls back to recency. */
export function sortServices(services: readonly Service[], sort: ServiceSort = 'relevance', query = ''): Service[] {
  const sorted = [...services];
  switch (sort) {
    case 'recent':
      return sorted.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    case 'price-asc':
      return sorted.sort((a, b) => effectiveServicePrice(a) - effectiveServicePrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => effectiveServicePrice(b) - effectiveServicePrice(a));
    case 'rating':
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
    case 'popularity':
      return sorted.sort((a, b) => b.completedJobs + b.views * 0.1 - (a.completedJobs + a.views * 0.1));
    case 'delivery':
      return sorted.sort((a, b) => a.deliveryDays - b.deliveryDays);
    case 'relevance':
    default:
      return sorted.sort((a, b) => scoreServiceRelevance(b, query) - scoreServiceRelevance(a, query));
  }
}

/** Free-text service search: filter + rank + limit. */
export function searchServices(services: readonly Service[], query: string, limit?: number): Service[] {
  const ranked = filterServices(services, { query }).sort(
    (a, b) => scoreServiceRelevance(b, query) - scoreServiceRelevance(a, query),
  );
  return limit != null ? ranked.slice(0, limit) : ranked;
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

/** Recommend services for a free-text need, ranking by relevance and quality. */
export function recommendServices(
  services: readonly Service[],
  query: string,
  limit?: number,
  excludeIds: readonly string[] = [],
): Service[] {
  const pool = services.filter((service) => !excludeIds.includes(service.id));
  const ranked = filterServices(pool, { query }).sort(
    (a, b) => scoreServiceRelevance(b, query) - scoreServiceRelevance(a, query),
  );
  return limit != null ? ranked.slice(0, limit) : ranked;
}

/** Top-rated services across the marketplace. */
export function topRated(services: readonly Service[], limit?: number): Service[] {
  const ranked = [...services].sort((a, b) => b.rating.average - a.rating.average || b.reviewCount - a.reviewCount);
  return limit != null ? ranked.slice(0, limit) : ranked;
}

/** Newest services on the marketplace. */
export function newest(services: readonly Service[], limit?: number): Service[] {
  const ranked = [...services].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  return limit != null ? ranked.slice(0, limit) : ranked;
}

/** Featured services flagged for the marketplace highlight. */
export function featuredServices(services: readonly Service[], limit?: number): Service[] {
  const featured = services.filter((service) => service.featured);
  return limit != null ? featured.slice(0, limit) : featured;
}

/** Services related to a given service by shared category, skills, or areas. */
export function relatedServices(services: readonly Service[], service: Service, limit = 4): Service[] {
  const scored = services
    .filter((candidate) => candidate.id !== service.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === service.category) score += 40;
      const sharedAreas = candidate.researchAreas.filter((area) => service.researchAreas.includes(area)).length;
      score += sharedAreas * 10;
      const sharedSkills = candidate.skills.filter((skill) => service.skills.includes(skill)).length;
      score += sharedSkills * 8;
      if (candidate.providerId === service.providerId) score += 15;
      score += candidate.rating.average * 2;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.candidate);
  return scored.slice(0, limit);
}

/** Services frequently purchased alongside a given service. */
export function frequentlyBoughtTogether(services: readonly Service[], service: Service, limit = 3): Service[] {
  const scored = services
    .filter((candidate) => candidate.id !== service.id)
    .map((candidate) => {
      const sameCategory = candidate.category === service.category ? 30 : 0;
      const complementaryGroup = candidate.group !== service.group ? 20 : 0;
      const sameCareer = candidate.careerStages.filter((stage) => service.careerStages.includes(stage)).length * 8;
      const popularity = candidate.completedJobs * 0.5;
      return { candidate, score: sameCategory + complementaryGroup + sameCareer + popularity };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.candidate);
  return scored.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

export function providerByUsername(providers: readonly ServiceProvider[], username: string): ServiceProvider | undefined {
  return providers.find((provider) => provider.username === username);
}

export function servicesByProvider(services: readonly Service[], providerId: string): Service[] {
  return services.filter((service) => service.providerId === providerId);
}

export function providerPortfolio(provider: ServiceProvider): ServicePortfolioItem[] {
  return provider.portfolio;
}

export function providerSkillNames(provider: ServiceProvider): string[] {
  return provider.skills.map((skill) => skill.name);
}

/** 0-100 provider quality score from services, reviews, and verification. */
export function scoreProviderQuality(
  provider: ServiceProvider,
  services: readonly Service[],
  reviews: readonly ServiceReview[],
): number {
  const providerServices = servicesByProvider(services, provider.id);
  const providerReviews = reviews.filter((review) => review.providerId === provider.id);
  const rating = calculateRatings(providerReviews);
  const verificationScore = provider.verified ? 25 : 8;
  const ratingScore = Math.min(30, Math.round(rating.average * 6));
  const volumeScore = Math.min(20, provider.completedJobs * 0.4);
  const serviceScore = Math.min(15, providerServices.length * 2.5);
  const responseScore = provider.responseTime.includes('hour') ? 10 : 6;
  return Math.min(100, Math.round(verificationScore + ratingScore + volumeScore + serviceScore + responseScore));
}

/** Rank providers for a free-text query using their services and skills. */
export function recommendProviders(
  providers: readonly ServiceProvider[],
  services: readonly Service[],
  query: string,
  limit?: number,
): ServiceProvider[] {
  const tokens = tokensOf(query);
  const scored = providers
    .map((provider) => {
      const providerServices = servicesByProvider(services, provider.id);
      const haystack = [
        provider.name,
        provider.headline,
        provider.tagline,
        provider.description,
        ...providerSkillNames(provider),
        ...provider.specializations,
        ...providerServices.flatMap((service) => serviceKeywords(service)),
      ]
        .join(' ')
        .toLowerCase();
      let matchScore = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) matchScore += 25;
      }
      const base = tokens.length ? (matchScore / (25 * tokens.length)) * 70 : 40;
      const quality = scoreProviderQuality(provider, services, []);
      return { provider, score: Math.min(100, Math.round(base + quality * 0.3)) };
    })
    .sort((a, b) => b.score - a.score);
  const ranked = scored.map((entry) => entry.provider);
  return limit != null ? ranked.slice(0, limit) : ranked;
}

export type ProviderSort = 'rating' | 'popularity' | 'completed-jobs' | 'response-time' | 'newest';

/** Sort a provider slice by the requested ranking signal. */
export function sortProviders(
  providers: readonly ServiceProvider[],
  sort: ProviderSort = 'rating',
): ServiceProvider[] {
  const sorted = [...providers];
  switch (sort) {
    case 'popularity':
      return sorted.sort((a, b) => b.followers - a.followers);
    case 'completed-jobs':
      return sorted.sort((a, b) => b.completedJobs - a.completedJobs);
    case 'response-time':
      return sorted.sort((a, b) => a.responseTime.localeCompare(b.responseTime));
    case 'newest':
      return sorted.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
    case 'rating':
    default:
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
  }
}

/** The subset of providers whose current availability allows new work. */
export function availableProviders(providers: readonly ServiceProvider[]): ServiceProvider[] {
  return providers.filter((provider) => provider.availability.status === 'available');
}

// ---------------------------------------------------------------------------
// Bundles
// ---------------------------------------------------------------------------

export interface ServiceBundle {
  id: string;
  name: string;
  description: string;
  services: Service[];
  listTotal: number;
  discountPercent: number;
  price: number;
  currency: CurrencyCode;
}

/** Build a curated bundle from a set of services, always by reference. */
export function bundleServices(services: readonly Service[], serviceIds: readonly string[], discountPercent = 10): ServiceBundle {
  const bundled = services.filter((service) => serviceIds.includes(service.id));
  const currency = bundled[0]?.price.currency ?? 'USD';
  const listTotal = Math.round(bundled.reduce((sum, service) => sum + effectiveServicePrice(service), 0) * 100) / 100;
  const price = Math.round(listTotal * (1 - discountPercent / 100) * 100) / 100;
  return {
    id: `bundle-${serviceIds.join('-').slice(0, 48)}`,
    name: 'Research Services Bundle',
    description: 'A curated combination of research services priced below their individual totals.',
    services: bundled,
    listTotal,
    discountPercent,
    price,
    currency,
  };
}

// ---------------------------------------------------------------------------
// Milestones, orders, disputes
// ---------------------------------------------------------------------------

export function milestoneProgress(milestones: readonly ServiceOrderMilestone[]): number {
  if (milestones.length === 0) return 0;
  return Math.round((milestones.filter((milestone) => milestone.status === 'completed').length / milestones.length) * 100);
}

export function orderMilestones(orders: readonly ServiceOrder[], orderId: string): ServiceOrderMilestone[] {
  const order = orders.find((entry) => entry.id === orderId);
  return order?.milestones ?? [];
}

export const SERVICE_ORDER_STATUS_TRANSITIONS: Record<ServiceOrderStatus, readonly ServiceOrderStatus[]> = {
  pending: ['in-progress', 'cancelled', 'disputed'],
  'in-progress': ['delivered', 'cancelled', 'disputed'],
  delivered: ['completed', 'refunded', 'disputed'],
  completed: ['refunded', 'disputed'],
  cancelled: [],
  refunded: [],
  disputed: ['in-progress', 'refunded', 'completed', 'cancelled'],
};

export function canTransitionServiceOrder(from: ServiceOrderStatus, to: ServiceOrderStatus): boolean {
  return SERVICE_ORDER_STATUS_TRANSITIONS[from].includes(to);
}

// ---------------------------------------------------------------------------
// Statistics, analytics
// ---------------------------------------------------------------------------

function orderRevenue(orders: readonly ServiceOrder[]): number {
  return orders.reduce((sum, order) => sum + order.amount, 0);
}

function categoryStats(
  services: readonly Service[],
  orders: readonly ServiceOrder[],
): ServiceCategoryStat[] {
  const serviceById = new Map(services.map((service) => [service.id, service]));
  const stats = new Map<ServiceCategory, ServiceCategoryStat>();
  for (const service of services) {
    const existing = stats.get(service.category);
    if (existing) {
      existing.services += 1;
    } else {
      stats.set(service.category, {
        category: service.category,
        group: SERVICE_CATEGORY_TO_GROUP[service.category],
        services: 1,
        orders: 0,
        revenue: 0,
      });
    }
  }
  for (const order of orders) {
    const service = serviceById.get(order.serviceId);
    if (!service) continue;
    const stat = stats.get(service.category);
    if (stat) {
      stat.orders += 1;
      stat.revenue = Math.round((stat.revenue + order.amount) * 100) / 100;
    }
  }
  return Array.from(stats.values()).filter((stat) => stat.services > 0 || stat.orders > 0);
}

function topServiceStats(services: readonly Service[], orders: readonly ServiceOrder[], limit = 5): ServiceTopService[] {
  const revenueByService = new Map<string, number>();
  const ordersByService = new Map<string, number>();
  for (const order of orders) {
    revenueByService.set(order.serviceId, (revenueByService.get(order.serviceId) ?? 0) + order.amount);
    ordersByService.set(order.serviceId, (ordersByService.get(order.serviceId) ?? 0) + 1);
  }
  return [...services]
    .sort((a, b) => (revenueByService.get(b.id) ?? 0) - (revenueByService.get(a.id) ?? 0))
    .slice(0, limit)
    .map((service) => ({
      serviceId: service.id,
      title: service.title,
      views: service.views,
      inquiries: service.inquiries,
      orders: ordersByService.get(service.id) ?? 0,
      revenue: Math.round((revenueByService.get(service.id) ?? 0) * 100) / 100,
      rating: service.rating.average,
    }));
}

function topProviderStats(
  providers: readonly ServiceProvider[],
  orders: readonly ServiceOrder[],
  limit = 5,
): ServiceTopProvider[] {
  const revenueByProvider = new Map<string, number>();
  const ordersByProvider = new Map<string, number>();
  for (const order of orders) {
    revenueByProvider.set(order.providerId, (revenueByProvider.get(order.providerId) ?? 0) + order.amount);
    ordersByProvider.set(order.providerId, (ordersByProvider.get(order.providerId) ?? 0) + 1);
  }
  return [...providers]
    .sort((a, b) => (revenueByProvider.get(b.id) ?? 0) - (revenueByProvider.get(a.id) ?? 0))
    .slice(0, limit)
    .map((provider) => ({
      providerId: provider.id,
      name: provider.name,
      orders: ordersByProvider.get(provider.id) ?? 0,
      revenue: Math.round((revenueByProvider.get(provider.id) ?? 0) * 100) / 100,
      rating: provider.rating.average,
    }));
}

export function providerStatistics(input: {
  providers: readonly ServiceProvider[];
  services: readonly Service[];
  reviews: readonly ServiceReview[];
  orders: readonly ServiceOrder[];
}): ProviderStatistics {
  const { providers, services, reviews, orders } = input;
  const active = providers.filter((provider) => provider.availability.status === 'available');
  const rated = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const certifications = providers.reduce((sum, provider) => sum + provider.certifications.length, 0);
  const institutions = new Set(
    providers.map((provider) => provider.institution).filter((entry): entry is string => Boolean(entry)),
  );
  return {
    totalProviders: providers.length,
    activeProviders: active.length,
    verifiedProviders: providers.filter((provider) => provider.verified).length,
    topRatedProviders: providers.filter((provider) => provider.rating.average >= 4.8).length,
    averageRating: Math.round(rated * 10) / 10,
    totalCompletedJobs: providers.reduce((sum, provider) => sum + provider.completedJobs, 0),
    totalRevenue: Math.round(orderRevenue(orders) * 100) / 100,
    totalServices: services.length,
    totalCountries: new Set(providers.map((provider) => provider.country)).size,
    totalInstitutions: institutions.size,
    totalCertifications: certifications,
    averageResponseTime: 'Within 1 working day',
  };
}

export function serviceStatistics(input: {
  services: readonly Service[];
  providers: readonly ServiceProvider[];
  reviews: readonly ServiceReview[];
  orders: readonly ServiceOrder[];
  milestones: readonly ServiceOrderMilestone[];
  disputes: readonly ServiceOrder[];
  testimonials: readonly unknown[];
  portfolios: readonly unknown[];
}): ServiceStatistics {
  const { services, providers, reviews, orders, milestones, disputes, testimonials, portfolios } = input;
  const revenue = orderRevenue(orders);
  const completed = orders.filter((order) => order.status === 'completed' || order.status === 'delivered');
  const onTime = completed.filter((order) => order.deliveredAt && (!order.deadline || order.deliveredAt <= order.deadline));
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 10) / 10
    : 0;
  return {
    totalServices: services.length,
    activeServices: services.filter((service) => service.status === 'active').length,
    totalProviders: providers.length,
    verifiedProviders: providers.filter((provider) => provider.verified).length,
    totalCategories: SERVICE_CATEGORIES.length,
    totalOrders: orders.length,
    completedOrders: completed.length,
    pendingOrders: orders.filter((order) => order.status === 'pending' || order.status === 'in-progress').length,
    totalReviews,
    averageRating,
    totalRevenue: Math.round(revenue * 100) / 100,
    averageOrderValue: orders.length > 0 ? Math.round((revenue / orders.length) * 100) / 100 : 0,
    completionRate: orders.length > 0 ? Math.round((completed.length / orders.length) * 100) : 0,
    onTimeDeliveryRate: completed.length > 0 ? Math.round((onTime.length / completed.length) * 100) : 0,
    totalDisputes: disputes.length,
    openDisputes: disputes.filter((order) => order.status === 'disputed').length,
    resolvedDisputes: disputes.filter((order) => order.status === 'completed' || order.status === 'refunded').length,
    totalMilestones: milestones.length,
    completedMilestones: milestones.filter((milestone) => milestone.status === 'completed').length,
    totalTestimonials: testimonials.length,
    totalPortfolioItems: portfolios.length,
    totalCountries: new Set(providers.map((provider) => provider.country)).size,
    totalInstitutions: new Set(providers.map((provider) => provider.institution).filter(Boolean)).size,
    featuredServices: services.filter((service) => service.featured).length,
    sponsoredServices: services.filter((service) => service.sponsored).length,
    promotedServices: services.filter((service) => service.promoted).length,
  };
}

export function marketplaceAnalytics(input: {
  services: readonly Service[];
  providers: readonly ServiceProvider[];
  orders: readonly ServiceOrder[];
  reviews: readonly ServiceReview[];
}): ServiceMarketplaceAnalytics {
  const { services, providers, orders } = input;
  const revenue = orderRevenue(orders);
  const impressions = services.reduce((sum, service) => sum + service.views * 3 + (service.adMetrics?.impressions ?? 0), 0);
  const views = services.reduce((sum, service) => sum + service.views, 0);
  const inquiries = services.reduce((sum, service) => sum + service.inquiries, 0);
  const conversions = orders.length;
  const conversionRate = inquiries > 0 ? Math.round((conversions / inquiries) * 10000) / 100 : 0;
  const averageOrderValue = orders.length > 0 ? Math.round((revenue / orders.length) * 100) / 100 : 0;
  const repeated = orders.reduce(
    (counts, order) => counts.set(order.buyerName, (counts.get(order.buyerName) ?? 0) + 1),
    new Map<string, number>(),
  );
  const repeatBuyers = Array.from(repeated.values()).filter((count) => count > 1).length;
  const byStatus = new Map<ServiceOrderStatus, number>();
  for (const order of orders) {
    byStatus.set(order.status, (byStatus.get(order.status) ?? 0) + 1);
  }
  const byCountry = new Map<string, number>();
  const providerById = new Map(providers.map((provider) => [provider.id, provider]));
  for (const order of orders) {
    const country = providerById.get(order.providerId)?.country ?? 'Unknown';
    byCountry.set(country, (byCountry.get(country) ?? 0) + 1);
  }
  return {
    impressions,
    views,
    inquiries,
    orders: orders.length,
    conversions,
    conversionRate,
    revenue: Math.round(revenue * 100) / 100,
    averageOrderValue,
    repeatBuyers,
    topServices: topServiceStats(services, orders),
    topProviders: topProviderStats(providers, orders),
    byCategory: categoryStats(services, orders),
    byStatus: Array.from(byStatus, ([status, count]) => ({ status, count })),
    byCountry: Array.from(byCountry, ([country, count]) => ({ country, orders: count })),
  };
}

export function buildServiceRecommendation(input: {
  id: string;
  type: ServiceRecommendation['type'];
  targetId: string;
  sourceId?: string;
  sourceEntity?: ServiceRecommendation['sourceEntity'];
  title: string;
  summary: string;
  url: string;
  score: number;
  confidence: ServiceRecommendation['confidence'];
  reasons: string[];
  tags: string[];
  audience?: string;
  date?: string;
}): ServiceRecommendation {
  return {
    id: input.id,
    type: input.type,
    targetId: input.targetId,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    title: input.title,
    summary: input.summary,
    url: input.url,
    score: input.score,
    confidence: input.confidence,
    reasons: input.reasons,
    tags: input.tags,
    audience: input.audience,
    date: input.date ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Discovery integration
// ---------------------------------------------------------------------------

/** Derive a unified searchable discovery row for a service. */
export function toDiscoveryItem(service: Service): DiscoveryItem {
  return {
    id: `service-${service.id}`,
    entityType: service.sourceEntity ?? SERVICE_TO_DISCOVERY_ENTITY[service.category],
    sourceId: service.id,
    title: service.title,
    summary: service.summary,
    description: service.description,
    keywords: serviceKeywords(service),
    discipline: service.category,
    researchAreas: service.researchAreas,
    organizations: [service.providerName],
    country: undefined,
    continent: undefined,
    year: service.dateAdded.slice(0, 4),
    status: service.status,
    tags: [service.category, ...service.keywords],
    score: Math.round(service.rating.average * 5 + service.completedJobs * 0.25),
    url: service.url,
    dateAdded: service.dateAdded,
    stageId: service.stageIds[0] as ResearchLifecycleStageId | undefined,
  };
}

export function toDiscoveryItems(services: readonly Service[]): DiscoveryItem[] {
  return services.map(toDiscoveryItem);
}

// ---------------------------------------------------------------------------
// Advertising integration
// ---------------------------------------------------------------------------

/** Build a promotable object reference so any service is boostable via Ads. */
export function servicePromotableObject(service: Service): PromotableObject {
  return createPromotableObject({
    id: `promo-service-${service.id}`,
    entityType: servicePromotableEntityType(service),
    sourceId: service.id,
    title: service.title,
    summary: service.summary,
    url: service.url,
    keywords: serviceKeywords(service),
    discipline: service.category,
    researchAreas: service.researchAreas,
    organizations: [service.providerName],
    country: undefined,
    stageId: service.stageIds[0] as ResearchLifecycleStageId | undefined,
    tags: ['research-service', service.category, ...service.skills],
    dateAdded: service.dateAdded,
  });
}
