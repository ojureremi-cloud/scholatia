import type { CareerStage, CurrencyCode } from '@/types/funding';
import type { DiscoveryEntityType, DiscoveryItem } from '@/types/discovery';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { ResearcherPositionType } from '@/types/researcher';
import type { IntelligenceConfidence } from '@/types/intelligence';

/**
 * The Scholatia Academic Marketplace of the Scholatia ecosystem.
 *
 * The Marketplace module is the platform-wide commercial and transactional
 * layer: "Amazon + LinkedIn + Upwork + Fiverr + Alibaba + ResearchGate
 * Marketplace" for academia. It does NOT introduce a new lifecycle stage; it
 * sits across every existing stage (funding, project, dataset, analysis,
 * manuscript, submission, peer-review, publication, conference, citation,
 * impact, knowledge-transfer) and connects back to the Researchers, Journals,
 * Conferences, Publishers, Institutions, Discovery, Intelligence, Advertising,
 * RBAC, and Authentication modules for every cross-module reference.
 *
 * The module is additive by design — every listing, vendor, storefront, order,
 * invoice, payment, refund, dispute, coupon, promotion, bundle, booking,
 * message, and notification references existing source records and never
 * duplicates data owned by another module. Every listing is promotable through
 * the Advertising module and searchable through the Discovery module.
 */

/** The twelve marketplace category families. */
export type MarketplaceCategory =
  | 'research-services'
  | 'academic-writing'
  | 'publication-services'
  | 'conference-services'
  | 'education'
  | 'laboratory-services'
  | 'equipment'
  | 'funding-services'
  | 'recruitment'
  | 'consulting'
  | 'digital-products'
  | 'physical-products';

/** The seventeen vendor types that can open a storefront. */
export type MarketplaceVendorType =
  | 'researcher'
  | 'student'
  | 'university'
  | 'publisher'
  | 'conference-organizer'
  | 'laboratory'
  | 'company'
  | 'government-agency'
  | 'ngo'
  | 'freelancer'
  | 'consultant'
  | 'startup'
  | 'professional-society'
  | 'library'
  | 'bookstore'
  | 'software-vendor'
  | 'equipment-manufacturer';

/** What a listing physically represents. */
export type MarketplaceListingType =
  | 'service'
  | 'digital-product'
  | 'physical-product'
  | 'equipment'
  | 'course'
  | 'job';

export type MarketplaceListingStatus =
  | 'draft'
  | 'pending-review'
  | 'active'
  | 'paused'
  | 'sold-out'
  | 'archived';

export type MarketplacePriceInterval =
  | 'one-time'
  | 'per-hour'
  | 'per-project'
  | 'per-word'
  | 'per-page'
  | 'per-session'
  | 'per-student'
  | 'monthly'
  | 'per-credit';

/** A price in a declared currency. No conversion is ever implied. */
export interface MarketplacePrice {
  amount: number;
  currency: CurrencyCode;
  interval?: MarketplacePriceInterval;
  /** List price before discounts, when discounted. */
  compareAt?: number;
}

/** A discount applied to a listing, promotion, or coupon. */
export interface MarketplaceDiscount {
  /** Percent off the list price (0-100), when percent-based. */
  percent?: number;
  /** Absolute amount off, when fixed. */
  fixed?: number;
  startsAt?: string;
  endsAt?: string;
}

/** Inventory / deliverability state of a listing. */
export interface MarketplaceAvailability {
  status: 'available' | 'limited' | 'unavailable' | 'pre-order';
  quantity?: number;
  /** Estimated delivery or turnaround in days. */
  deliveryDays?: number;
  recurring?: boolean;
  /** Bookable services expose open slots. */
  openSlots?: MarketplaceAvailabilitySlot[];
}

export interface MarketplaceAvailabilitySlot {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone?: string;
  booked: boolean;
  price?: MarketplacePrice;
}

/** Star rating distribution across 1-5. */
export interface MarketplaceRatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface MarketplaceRatingSummary {
  average: number;
  count: number;
  distribution: MarketplaceRatingDistribution;
}

export interface MarketplaceReview {
  id: string;
  listingId: string;
  vendorId: string;
  reviewerId?: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  helpfulVotes: number;
  reported: boolean;
  verifiedPurchase: boolean;
  /** Original source identity of the reviewer (SAID), when a Scholatia user. */
  reviewerSaid?: string;
  date: string;
}

/** Vendor trust badges shown on the storefront. */
export type MarketplaceVendorBadge =
  | 'Verified Vendor'
  | 'Top Rated'
  | 'Fast Response'
  | 'Institution Verified'
  | 'Academic Verified'
  | 'Quality Assured'
  | 'New Vendor'
  | 'High Volume'
  | 'Local Expert'
  | 'Global Reach'
  | 'Editorial Pick';

export interface MarketplacePortfolioItem {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  url?: string;
  client?: string;
  year?: string;
}

export interface MarketplaceVendor {
  id: string;
  /** Stable username-style slug used for the store URL: /store/{slug}. */
  slug: string;
  name: string;
  type: MarketplaceVendorType;
  avatar?: string;
  tagline: string;
  description: string;
  country: string;
  city?: string;
  website?: string;
  email?: string;
  verified: boolean;
  trustScore: number;
  badges: MarketplaceVendorBadge[];
  rating: MarketplaceRatingSummary;
  responseTime: string;
  completedOrders: number;
  yearsActive: string;
  joinedAt: string;
  followers: number;
  /** Live reference to a researcher identity when the vendor is a researcher. */
  researcherUsername?: string;
  researcherSaid?: string;
  position?: ResearcherPositionType;
  institution?: string;
  skills: string[];
  categories: MarketplaceCategory[];
  portfolio: MarketplacePortfolioItem[];
}

export interface MarketplaceStorefront {
  vendorId: string;
  slug: string;
  name: string;
  /** Canonical vendor store URL (future store.scholatia.com). */
  url: string;
  description: string;
  cover?: string;
  categories: MarketplaceCategory[];
  featuredListingIds: string[];
  listingIds: string[];
  verified: boolean;
  policies: {
    returns: string;
    refunds: string;
    delivery: string;
    terms: string;
  };
}

export interface MarketplaceListing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  title: string;
  summary: string;
  description: string;
  category: MarketplaceCategory;
  subcategory?: string;
  type: MarketplaceListingType;
  price: MarketplacePrice;
  discount?: MarketplaceDiscount;
  keywords: string[];
  researchAreas: string[];
  targetAudience: string[];
  careerStages: CareerStage[];
  skills: string[];
  /** Lifecycle stages the listing serves (e.g. statistical analysis → analysis). */
  stageIds: ResearchLifecycleStageId[];
  inventory: MarketplaceAvailability;
  rating: MarketplaceRatingSummary;
  reviewCount: number;
  favorites: number;
  orders: number;
  views: number;
  featured: boolean;
  sponsored: boolean;
  bestSeller: boolean;
  onSale: boolean;
  verifiedVendor: boolean;
  badges: MarketplaceVendorBadge[];
  country?: string;
  tags: string[];
  status: MarketplaceListingStatus;
  /** Canonical listing URL within the app. */
  url: string;
  dateAdded: string;
  lastUpdated: string;
  /** Live reference to the source record the listing sells or services. */
  sourceId?: string;
  sourceEntity?: DiscoveryEntityType;
}

export type MarketplaceOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

export type MarketplacePaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially-refunded';

export interface MarketplaceOrderItem {
  listingId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  listingId: string;
  vendorId: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail?: string;
  items: MarketplaceOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
  status: MarketplaceOrderStatus;
  paymentStatus: MarketplacePaymentStatus;
  placedAt: string;
  completedAt?: string;
  scheduledDelivery?: string;
  notes?: string;
}

export interface MarketplaceInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type MarketplaceInvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface MarketplaceInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  vendorId: string;
  buyerId?: string;
  buyerName: string;
  lines: MarketplaceInvoiceLine[];
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: CurrencyCode;
  status: MarketplaceInvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
}

export type MarketplacePaymentMethod =
  | 'card'
  | 'bank-transfer'
  | 'mobile-money'
  | 'paypal'
  | 'escrow'
  | 'wallet'
  | 'institution-billing';

export type MarketplacePaymentStatusRecord =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface MarketplacePayment {
  id: string;
  orderId: string;
  invoiceId?: string;
  amount: number;
  currency: CurrencyCode;
  method: MarketplacePaymentMethod;
  status: MarketplacePaymentStatusRecord;
  escrowed: boolean;
  reference?: string;
  date: string;
}

export type MarketplaceRefundStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed';

export interface MarketplaceRefund {
  id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: CurrencyCode;
  reason: string;
  status: MarketplaceRefundStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

export type MarketplaceDisputeStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type MarketplaceDisputeSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface MarketplaceDisputeMessage {
  id: string;
  from: string;
  body: string;
  sentAt: string;
}

export interface MarketplaceDispute {
  id: string;
  orderId: string;
  listingId: string;
  openedBy: string;
  subject: string;
  description: string;
  status: MarketplaceDisputeStatus;
  severity: MarketplaceDisputeSeverity;
  messages: MarketplaceDisputeMessage[];
  openedAt: string;
  resolvedAt?: string;
}

export type MarketplaceCouponType = 'percent' | 'fixed';
export type MarketplaceCouponAppliesTo = 'listing' | 'vendor' | 'category' | 'cart';
export type MarketplaceCouponStatus = 'active' | 'expired' | 'disabled';

export interface MarketplaceCoupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: MarketplaceCouponType;
  value: number;
  appliesTo: MarketplaceCouponAppliesTo;
  targetId?: string;
  minimumSpend?: number;
  maximumDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  timesUsed: number;
  status: MarketplaceCouponStatus;
}

export type MarketplacePromotionKind =
  | 'sale'
  | 'flash-sale'
  | 'bundle'
  | 'sponsored-feature'
  | 'seasonal'
  | 'launch';

export interface MarketplacePromotion {
  id: string;
  name: string;
  description: string;
  kind: MarketplacePromotionKind;
  discount: MarketplaceDiscount;
  startsAt: string;
  endsAt: string;
  listingIds: string[];
}

export interface MarketplaceBundleItem {
  listingId: string;
  title: string;
  quantity: number;
}

export interface MarketplaceBundle {
  id: string;
  name: string;
  description: string;
  items: MarketplaceBundleItem[];
  /** Combined list price of the items before bundle discount. */
  listTotal: number;
  discountPercent: number;
  price: MarketplacePrice;
  status: 'active' | 'expired' | 'disabled';
}

export type MarketplaceBookingStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'rescheduled';

export interface MarketplaceBooking {
  id: string;
  listingId: string;
  vendorId: string;
  buyerId?: string;
  buyerName: string;
  scheduledFor: string;
  durationMinutes: number;
  timezone?: string;
  location: 'online' | 'onsite';
  status: MarketplaceBookingStatus;
  price: MarketplacePrice;
  notes?: string;
  createdAt: string;
}

export interface MarketplaceMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  sentAt: string;
  readAt?: string;
}

export interface MarketplaceConversation {
  id: string;
  participants: string[];
  subject?: string;
  listingId?: string;
  orderId?: string;
  messages: MarketplaceMessage[];
  lastActivityAt: string;
}

export type MarketplaceNotificationType =
  | 'order-update'
  | 'payment-received'
  | 'refund'
  | 'dispute'
  | 'message'
  | 'review-received'
  | 'booking-reminder'
  | 'promotion'
  | 'price-drop'
  | 'back-in-stock';

export interface MarketplaceNotification {
  id: string;
  recipientId: string;
  type: MarketplaceNotificationType;
  title: string;
  body: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface MarketplaceWishlist {
  id: string;
  ownerId: string;
  name: string;
  listingIds: string[];
  createdAt: string;
}

export interface MarketplaceRecentlyViewed {
  ownerId: string;
  listingIds: string[];
  viewedAt: string;
}

/** A guest advertiser without a Scholatia account (Scholatia Ads surface). */
export interface MarketplaceGuestAdvertiser {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  country?: string;
  website?: string;
  verified: boolean;
  /** Ad campaign ids the guest has purchased (Advertising module). */
  campaignIds: string[];
  /** Ids of the listings / services they promote. */
  promotedListingIds: string[];
  joinedAt: string;
  analytics: {
    activeCampaigns: number;
    totalSpend: number;
    totalConversions: number;
    roi: number;
  };
}

// ---------------------------------------------------------------------------
// Analytics, statistics, and dashboards
// ---------------------------------------------------------------------------

export interface MarketplaceCategoryStat {
  category: MarketplaceCategory;
  listings: number;
  orders: number;
  revenue: number;
}

export interface MarketplaceListingStat {
  listingId: string;
  title: string;
  views: number;
  favorites: number;
  orders: number;
  revenue: number;
  rating: number;
}

export interface MarketplaceVendorStat {
  vendorId: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
  verified: boolean;
}

export interface MarketplaceSalesDayPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface MarketplaceSalesDashboard {
  totalRevenue: number;
  totalOrders: number;
  refundedRevenue: number;
  netRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  growthPercent: number;
  byDay: MarketplaceSalesDayPoint[];
  topProducts: MarketplaceListingStat[];
}

export interface MarketplaceRevenueDashboard {
  grossRevenue: number;
  platformFees: number;
  vendorPayouts: number;
  refunds: number;
  netPlatformRevenue: number;
  byCategory: MarketplaceCategoryStat[];
  byCountry: { country: string; revenue: number }[];
  byMethod: { method: MarketplacePaymentMethod; revenue: number }[];
}

export interface MarketplaceAnalytics {
  impressions: number;
  views: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  repeatCustomers: number;
  favorites: number;
  reviews: number;
  disputes: number;
  messages: number;
  bookings: number;
  byCategory: MarketplaceCategoryStat[];
  topListings: MarketplaceListingStat[];
  topVendors: MarketplaceVendorStat[];
}

export interface MarketplaceStatistics {
  totalVendors: number;
  verifiedVendors: number;
  totalListings: number;
  activeListings: number;
  totalCategories: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  totalReviews: number;
  averageOrderValue: number;
  conversionRate: number;
  countries: number;
  featuredListings: number;
  sponsoredListings: number;
  totalCoupons: number;
  activePromotions: number;
  openDisputes: number;
  completedRefunds: number;
}

/** AI recommendation surfaced by the Intelligence layer. */
export type MarketplaceRecommendationType =
  | 'vendor'
  | 'listing'
  | 'service'
  | 'product'
  | 'consultant'
  | 'collaborator'
  | 'journal'
  | 'reviewer'
  | 'grant'
  | 'conference'
  | 'publisher'
  | 'storefront';

export interface MarketplaceRecommendation {
  id: string;
  type: MarketplaceRecommendationType;
  /** Id of the recommended marketplace record (vendorId / listingId / sourceId). */
  targetId: string;
  /** Original source identity when the recommendation bridges a non-marketplace module. */
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

export interface MarketplacePortfolio {
  statistics: MarketplaceStatistics;
  analytics: MarketplaceAnalytics;
  salesDashboard: MarketplaceSalesDashboard;
  revenueDashboard: MarketplaceRevenueDashboard;
  vendors: MarketplaceVendor[];
  storefronts: MarketplaceStorefront[];
  listings: MarketplaceListing[];
  reviews: MarketplaceReview[];
  orders: MarketplaceOrder[];
  invoices: MarketplaceInvoice[];
  payments: MarketplacePayment[];
  refunds: MarketplaceRefund[];
  disputes: MarketplaceDispute[];
  coupons: MarketplaceCoupon[];
  promotions: MarketplacePromotion[];
  bundles: MarketplaceBundle[];
  bookings: MarketplaceBooking[];
  conversations: MarketplaceConversation[];
  notifications: MarketplaceNotification[];
  wishlists: MarketplaceWishlist[];
  guestAdvertisers: MarketplaceGuestAdvertiser[];
  recommendations: MarketplaceRecommendation[];
  discoveryItems: DiscoveryItem[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const MARKETPLACE_CATEGORIES: readonly MarketplaceCategory[] = [
  'research-services',
  'academic-writing',
  'publication-services',
  'conference-services',
  'education',
  'laboratory-services',
  'equipment',
  'funding-services',
  'recruitment',
  'consulting',
  'digital-products',
  'physical-products',
];

export const MARKETPLACE_CATEGORY_LABELS: Record<MarketplaceCategory, string> = {
  'research-services': 'Research Services',
  'academic-writing': 'Academic Writing',
  'publication-services': 'Publication Services',
  'conference-services': 'Conference Services',
  education: 'Education & Training',
  'laboratory-services': 'Laboratory Services',
  equipment: 'Equipment & Instruments',
  'funding-services': 'Funding & Grants',
  recruitment: 'Jobs & Recruitment',
  consulting: 'Consulting',
  'digital-products': 'Digital Products',
  'physical-products': 'Physical Products',
};

export const MARKETPLACE_CATEGORY_ICONS: Record<MarketplaceCategory, string> = {
  'research-services': '🔬',
  'academic-writing': '✍️',
  'publication-services': '📚',
  'conference-services': '🎤',
  education: '🎓',
  'laboratory-services': '🧪',
  equipment: '⚙️',
  'funding-services': '💰',
  recruitment: '💼',
  consulting: '🤝',
  'digital-products': '💾',
  'physical-products': '📦',
};

export const MARKETPLACE_SUBCATEGORIES: Record<MarketplaceCategory, readonly string[]> = {
  'research-services': [
    'statistical-analysis',
    'spss',
    'r-programming',
    'python',
    'stata',
    'nvivo',
    'atlas-ti',
    'matlab',
    'gis',
    'machine-learning',
    'data-cleaning',
    'research-design',
    'literature-review',
    'systematic-review',
    'meta-analysis',
  ],
  'academic-writing': [
    'editing',
    'proofreading',
    'formatting',
    'language-polishing',
    'translation',
    'journal-formatting',
    'apa',
    'mla',
    'chicago',
    'vancouver',
    'thesis-writing',
    'manuscript-writing',
  ],
  'publication-services': [
    'journal-selection',
    'submission-support',
    'manuscript-review',
    'cover-letter',
    'response-to-reviewers',
    'publication-consulting',
    'figure-design',
  ],
  'conference-services': [
    'abstract-review',
    'poster-design',
    'presentation-coaching',
    'registration-assistance',
    'visa-support',
    'travel-planning',
  ],
  education: [
    'online-courses',
    'workshops',
    'training-programmes',
    'certifications',
    'coaching',
    'webinars',
    'tutoring',
  ],
  'laboratory-services': [
    'lab-testing',
    'sample-analysis',
    'sequencing',
    'microscopy',
    'instrument-booking',
    'assay-development',
  ],
  equipment: [
    'lab-equipment',
    'scientific-instruments',
    'books',
    'software-licenses',
    'research-tools',
  ],
  'funding-services': [
    'grant-writing',
    'proposal-review',
    'budget-preparation',
    'grant-consulting',
    'funding-search',
  ],
  recruitment: [
    'jobs',
    'internships',
    'fellowships',
    'phd-positions',
    'postdoc-positions',
    'research-assistants',
  ],
  consulting: [
    'university-consulting',
    'government-consulting',
    'ngo-consulting',
    'industry-consulting',
    'healthcare-consulting',
    'agriculture-consulting',
    'technology-consulting',
  ],
  'digital-products': [
    'templates',
    'research-instruments',
    'questionnaires',
    'datasets',
    'software',
    'code',
    'ebooks',
    'video-courses',
    'training-manuals',
  ],
  'physical-products': [
    'books',
    'lab-equipment',
    'scientific-kits',
    'educational-materials',
  ],
};

export const MARKETPLACE_VENDOR_TYPES: readonly MarketplaceVendorType[] = [
  'researcher',
  'student',
  'university',
  'publisher',
  'conference-organizer',
  'laboratory',
  'company',
  'government-agency',
  'ngo',
  'freelancer',
  'consultant',
  'startup',
  'professional-society',
  'library',
  'bookstore',
  'software-vendor',
  'equipment-manufacturer',
];

export const MARKETPLACE_VENDOR_TYPE_LABELS: Record<MarketplaceVendorType, string> = {
  researcher: 'Researcher',
  student: 'Student',
  university: 'University',
  publisher: 'Publisher',
  'conference-organizer': 'Conference Organizer',
  laboratory: 'Laboratory',
  company: 'Company',
  'government-agency': 'Government Agency',
  ngo: 'NGO',
  freelancer: 'Freelancer',
  consultant: 'Consultant',
  startup: 'Startup',
  'professional-society': 'Professional Society',
  library: 'Library',
  bookstore: 'Bookstore',
  'software-vendor': 'Software Vendor',
  'equipment-manufacturer': 'Equipment Manufacturer',
};

export const MARKETPLACE_LISTING_TYPES: readonly MarketplaceListingType[] = [
  'service',
  'digital-product',
  'physical-product',
  'equipment',
  'course',
  'job',
];

export const MARKETPLACE_LISTING_TYPE_LABELS: Record<MarketplaceListingType, string> = {
  service: 'Service',
  'digital-product': 'Digital Product',
  'physical-product': 'Physical Product',
  equipment: 'Equipment',
  course: 'Course',
  job: 'Job',
};

export const MARKETPLACE_VENDOR_BADGES: readonly MarketplaceVendorBadge[] = [
  'Verified Vendor',
  'Top Rated',
  'Fast Response',
  'Institution Verified',
  'Academic Verified',
  'Quality Assured',
  'New Vendor',
  'High Volume',
  'Local Expert',
  'Global Reach',
  'Editorial Pick',
];

export const MARKETPLACE_ORDER_STATUSES: readonly MarketplaceOrderStatus[] = [
  'pending',
  'confirmed',
  'in-progress',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'disputed',
];

export const MARKETPLACE_PAYMENT_METHODS: readonly MarketplacePaymentMethod[] = [
  'card',
  'bank-transfer',
  'mobile-money',
  'paypal',
  'escrow',
  'wallet',
  'institution-billing',
];
