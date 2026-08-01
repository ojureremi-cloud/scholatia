import type {
  CommerceBillingAddress,
  CommerceBundle,
  CommerceCart,
  CommerceCommission,
  CommerceCoupon,
  CommerceCurrency,
  CommerceEscrow,
  CommerceExchangeRate,
  CommerceFinancialReport,
  CommerceGatewayProvider,
  CommerceInvoice,
  CommerceLicense,
  CommerceLifecycleCoverage,
  CommerceOrder,
  CommerceParticipantEarnings,
  CommercePayment,
  CommercePaymentIntent,
  CommercePaymentProvider,
  CommercePlatformAnalytics,
  CommercePlatformFee,
  CommercePortfolio,
  CommerceProduct,
  CommerceProductType,
  CommerceProductVariant,
  CommercePromotion,
  CommercePurchaseRecord,
  CommerceReceipt,
  CommerceRefund,
  CommerceRelationship,
  CommerceRevenueParticipantType,
  CommerceRevenueReport,
  CommerceSettlement,
  CommerceStatistics,
  CommerceSubscription,
  CommerceSubscriptionPlan,
  CommerceSubscriberType,
  CommerceTaxRate,
  CommerceTransaction,
  CommerceVendorEarnings,
  CommerceWallet,
  CommerceWalletTransaction,
} from '@/types/commerce';
import { COMMERCE_CURRENT_DATE, COMMERCE_CURRENCIES } from '@/types/commerce';
import type { CurrencyCode } from '@/types/funding';
import type { AdCampaign } from '@/types/ads';

import {
  buildCommercePortfolio,
  calculateBoostCost,
  calculateBundlePrice,
  calculateMarketplaceCommission,
  calculateOrder,
  calculateSubscriptionCost,
  computeCommerceStatistics,
  computeFinancialReports,
  computePlatformAnalytics,
  computeRevenueReport,
  estimatePromotionReach,
  generateInvoiceNumber,
  generateReceipt,
  providerCapabilities,
  purchaseHistoryFromOrders,
  recomputeWalletBalance,
} from '@/lib/commerce';

import { MARKETPLACE_PORTFOLIO } from '@/constants/placeholder-marketplace';
import { ADVERTISING_PORTFOLIO } from '@/constants/placeholder-ads';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { PUBLISHERS } from '@/constants/placeholder-publishers';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { DATASETS } from '@/constants/placeholder-datasets';
import { DISCOVERY_ITEMS } from '@/constants/placeholder-discovery';

/**
 * Placeholder data for the Scholatia Commerce & Marketplace Engine (Phase 1.9B).
 *
 * The Commerce module is the **financial operating system** of the Scholatia
 * ecosystem. Every product, order, invoice, receipt, wallet transaction,
 * subscription, commission, escrow, settlement, and revenue line below is
 * either derived from existing placeholder modules (Marketplace vendors and
 * listings, Advertising campaigns and placements, Researchers, Institutions,
 * Publishers, Journals, Conferences) or computed by the pure engine in
 * `lib/commerce.ts`. No data is duplicated and no real payment API is used —
 * the gateway abstraction models Paystack, Flutterwave, Stripe, PayPal, Wise,
 * bank transfer, Apple Pay, and Google Pay without live credentials.
 */

const USD: CurrencyCode = 'USD';
const GBP: CurrencyCode = 'GBP';

// ---------------------------------------------------------------------------
// Shared derivation helpers
// ---------------------------------------------------------------------------

function researcherName(username: string): string {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  return found?.displayName ?? username;
}

function marketplaceVendor(vendorId: string) {
  return MARKETPLACE_PORTFOLIO.vendors.find((vendor) => vendor.id === vendorId);
}

function campaignOf(campaignId: string): AdCampaign | undefined {
  return ADVERTISING_PORTFOLIO.campaigns.find((campaign) => campaign.id === campaignId);
}

// ---------------------------------------------------------------------------
// Products & services catalog
// ---------------------------------------------------------------------------

interface ProductSeed {
  id: string;
  sku: string;
  name: string;
  summary: string;
  description: string;
  type: CommerceProductType;
  category: string;
  price: number;
  currency: CurrencyCode;
  interval?: 'one-time' | 'per-hour' | 'per-project' | 'per-month' | 'per-year' | 'per-credit' | 'per-seat' | 'per-word' | 'per-day';
  compareAt?: number;
  stock?: number;
  vendorId?: string;
  vendorName?: string;
  sourceId?: string;
  sourceEntity?: string;
  featured?: boolean;
  tags?: string[];
}

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    id: 'prod-statistical-analysis',
    sku: 'SRV-1001',
    name: 'Statistical Analysis Service',
    summary: 'Full statistical analysis for your research data with a complete methods report.',
    description: 'Clean, analyse, and report on your dataset using SPSS, R, or Python with a peer-reviewed methodology write-up.',
    type: 'service',
    category: 'research-services',
    price: 250,
    currency: USD,
    interval: 'per-project',
    compareAt: 320,
    vendorId: 'vendor-ibadan-statistics-lab',
    vendorName: 'Ibadan Statistics Lab',
    sourceId: 'listing-statistical-analysis',
    sourceEntity: 'marketplace-listing',
    featured: true,
    tags: ['statistics', 'spss', 'r', 'analysis'],
  },
  {
    id: 'prod-academic-editing',
    sku: 'SRV-1002',
    name: 'Academic Editing & Proofreading',
    summary: 'Language polishing and journal formatting for a manuscript before submission.',
    description: 'Native-level editing, proofreading, and journal-style formatting (APA, MLA, Chicago, Vancouver).',
    type: 'service',
    category: 'academic-writing',
    price: 0.03,
    currency: USD,
    interval: 'per-word',
    compareAt: 0.04,
    vendorId: 'vendor-dr-smith',
    vendorName: 'Dr. Sarah Mitchell',
    sourceId: 'listing-academic-editing',
    sourceEntity: 'marketplace-listing',
    featured: true,
    tags: ['editing', 'proofreading', 'manuscript'],
  },
  {
    id: 'prod-spss-masterclass',
    sku: 'CRS-2001',
    name: 'SPSS Masterclass',
    summary: 'Live workshop covering data entry, cleaning, and advanced statistical tests.',
    description: 'A 6-hour hands-on workshop for researchers moving from basics to multivariate statistics.',
    type: 'course',
    category: 'education',
    price: 180,
    currency: USD,
    interval: 'per-seat',
    vendorId: 'vendor-ibadan-statistics-lab',
    vendorName: 'Ibadan Statistics Lab',
    sourceId: 'listing-statistical-analysis',
    sourceEntity: 'marketplace-listing',
    tags: ['spss', 'workshop', 'training'],
  },
  {
    id: 'prod-lab-equipment',
    sku: 'EQP-3001',
    name: 'Lab Equipment Rental',
    summary: 'Rent calibrated laboratory equipment for your research project.',
    description: 'Short-term rental of calibrated instruments with technician onboarding and support.',
    type: 'equipment',
    category: 'laboratory-services',
    price: 85,
    currency: USD,
    interval: 'per-day',
    vendorId: 'vendor-university-of-ibadan',
    vendorName: 'University of Ibadan',
    sourceEntity: 'marketplace-listing',
    tags: ['lab', 'equipment', 'rental'],
  },
  {
    id: 'prod-research-dataset',
    sku: 'DIG-4001',
    name: 'Curated Research Dataset',
    summary: 'Clean, documented, reusable dataset with a data descriptor.',
    description: 'A fully documented research dataset ready for secondary analysis and citation.',
    type: 'digital-product',
    category: 'digital-products',
    price: 120,
    currency: USD,
    compareAt: 150,
    vendorId: 'vendor-dr-smith',
    vendorName: 'Dr. Sarah Mitchell',
    sourceEntity: 'dataset',
    featured: true,
    tags: ['dataset', 'data', 'open-data'],
  },
  {
    id: 'prod-stats-textbook',
    sku: 'PHY-5001',
    name: 'Statistics for Researchers (Paperback)',
    summary: 'A practical textbook covering applied statistics for the research lifecycle.',
    description: 'Print edition shipped worldwide with a companion workbook.',
    type: 'physical-product',
    category: 'physical-products',
    price: 45,
    currency: USD,
    compareAt: 55,
    stock: 40,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia Press',
    sourceEntity: 'publication',
    tags: ['book', 'statistics', 'textbook'],
  },
  {
    id: 'prod-grant-writing',
    sku: 'SRV-1003',
    name: 'Grant Writing & Proposal Review',
    summary: 'End-to-end grant proposal development or expert review of a draft.',
    description: 'Narrative, budget, and impact sections built for funder guidelines, plus reviewer-style feedback.',
    type: 'service',
    category: 'funding-services',
    price: 400,
    currency: USD,
    interval: 'per-project',
    vendorId: 'vendor-adebayo-energy-consulting',
    vendorName: 'Adebayo Energy Consulting',
    sourceEntity: 'funding',
    featured: true,
    tags: ['grant', 'proposal', 'funding'],
  },
  {
    id: 'prod-gis-analysis',
    sku: 'SRV-1004',
    name: 'GIS & Spatial Analysis',
    summary: 'Spatial mapping and analysis for health, agriculture, and urban research.',
    description: 'From shapefiles to publication-ready maps with reproducible scripts.',
    type: 'service',
    category: 'research-services',
    price: 320,
    currency: USD,
    interval: 'per-project',
    vendorId: 'vendor-ibadan-statistics-lab',
    vendorName: 'Ibadan Statistics Lab',
    sourceId: 'listing-gis-spatial-analysis',
    sourceEntity: 'marketplace-listing',
    tags: ['gis', 'spatial', 'mapping'],
  },
  {
    id: 'prod-consultation',
    sku: 'SRV-1005',
    name: 'Research Consultation (1 hour)',
    summary: 'One-to-one expert consultation on research design or analysis.',
    description: 'A focused 60-minute session with an expert statistician or methodology reviewer.',
    type: 'service',
    category: 'consulting',
    price: 60,
    currency: USD,
    interval: 'per-hour',
    vendorId: 'vendor-dr-smith',
    vendorName: 'Dr. Sarah Mitchell',
    tags: ['consultation', 'mentoring'],
  },
  {
    id: 'prod-curriculum-design',
    sku: 'DIG-4002',
    name: 'Curriculum Design Toolkit',
    summary: 'Reusable templates and rubrics for course and programme design.',
    description: 'A digital toolkit with syllabus templates, assessment rubrics, and learning-outcome mappings.',
    type: 'digital-product',
    category: 'digital-products',
    price: 75,
    currency: USD,
    vendorId: 'vendor-oxford-academic-services',
    vendorName: 'Oxford Academic Services',
    tags: ['curriculum', 'teaching', 'templates'],
  },
  {
    id: 'prod-ai-discovery-analytics',
    sku: 'DIG-9001',
    name: 'AI Discovery Analytics',
    summary: 'AI-generated intelligence over your discovery and engagement footprint.',
    description: 'Tailored analytics over your discovery, citation, and engagement signals that surface funding and collaboration opportunities.',
    type: 'digital-product',
    category: 'research-analytics',
    price: 40,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceId: DISCOVERY_ITEMS[0]?.id,
    sourceEntity: 'discovery-item',
    tags: ['analytics', 'ai'],
  },
  {
    id: 'prod-dataset-download',
    sku: 'DIG-4003',
    name: 'Licensed Dataset Download',
    summary: 'Instant download access to a published, verified research dataset.',
    description: 'Full download of a verified dataset with its metadata and accompanying documentation.',
    type: 'digital-product',
    category: 'research-data',
    price: 14,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceId: DATASETS[0]?.id,
    sourceEntity: 'dataset',
    tags: ['dataset', 'data'],
  },
  {
    id: 'prod-boost-growth',
    sku: 'BOO-6001',
    name: 'Growth Boost (7 days)',
    summary: 'Boost a post or listing to a wide academic audience for 7 days.',
    description: 'Sponsored amplification of a promoted object through the Advertising module.',
    type: 'boosted-post',
    category: 'advertising',
    price: 40,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceEntity: 'promotable-object',
    featured: true,
    tags: ['boost', 'reach', 'promotion'],
  },
  {
    id: 'prod-featured-listing',
    sku: 'FEA-7001',
    name: 'Featured Listing Placement',
    summary: 'Place a marketplace listing in the featured carousel for 14 days.',
    description: 'Front-and-centre placement in the marketplace and discovery surfaces.',
    type: 'featured-listing',
    category: 'advertising',
    price: 65,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceEntity: 'marketplace-listing',
    tags: ['featured', 'placement'],
  },
  {
    id: 'prod-sponsored-listing',
    sku: 'SPO-7002',
    name: 'Sponsored Listing Campaign',
    summary: 'Sponsored placement across home, research, and discovery feeds.',
    description: 'A managed sponsored campaign for a listing using the advertising auction.',
    type: 'sponsored-listing',
    category: 'advertising',
    price: 150,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceEntity: 'marketplace-listing',
    tags: ['sponsored', 'campaign'],
  },
  {
    id: 'prod-vendor-membership-pro',
    sku: 'MEM-8001',
    name: 'Vendor Membership — Pro',
    summary: 'Priority support, lower commission, and advanced storefront tools.',
    description: 'Monthly membership that reduces marketplace commission and unlocks store analytics.',
    type: 'vendor-membership',
    category: 'membership',
    price: 29,
    currency: USD,
    interval: 'per-month',
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    tags: ['membership', 'vendor'],
  },
  {
    id: 'prod-premium-analytics',
    sku: 'ANA-9001',
    name: 'Premium Analytics — Researcher',
    summary: 'Deep citation, collaboration, and visibility analytics for a researcher.',
    description: 'Monthly premium analytics across your research output and audience.',
    type: 'premium-analytics',
    category: 'analytics',
    price: 12,
    currency: USD,
    interval: 'per-month',
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    tags: ['analytics', 'premium'],
  },
  {
    id: 'prod-api-access',
    sku: 'API-0001',
    name: 'API Access — Read',
    summary: 'Programmatic read access to public Scholatia data.',
    description: 'Rate-limited read API access with documentation and a sandbox key.',
    type: 'api-access',
    category: 'platform',
    price: 99,
    currency: USD,
    interval: 'per-month',
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    tags: ['api', 'integration'],
  },
  {
    id: 'prod-enterprise-license',
    sku: 'ENT-0002',
    name: 'Enterprise License — Institution',
    summary: 'Unlimited institutional access to Scholatia services and API.',
    description: 'Annual enterprise licensing for a university or research organisation.',
    type: 'enterprise-license',
    category: 'platform',
    price: 6000,
    currency: USD,
    interval: 'per-year',
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    featured: true,
    tags: ['enterprise', 'license', 'institution'],
  },
  {
    id: 'prod-cfp-campaign',
    sku: 'ADV-0003',
    name: 'Call for Papers Campaign',
    summary: 'Promote a journal call for papers to the right researchers.',
    description: 'A managed awareness campaign across journal pages and email digests.',
    type: 'advertising-campaign',
    category: 'advertising',
    price: 220,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceId: campaignOf('cam-journal-launch')?.id,
    sourceEntity: 'ad-campaign',
    tags: ['cfp', 'campaign', 'journal'],
  },
  {
    id: 'prod-conference-campaign',
    sku: 'ADV-0004',
    name: 'Conference Promotion Package',
    summary: 'Drive registrations and abstract submissions for a conference.',
    description: 'A managed promotion across conference pages, email, and push notifications.',
    type: 'advertising-campaign',
    category: 'advertising',
    price: 310,
    currency: USD,
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia',
    sourceEntity: 'conference',
    tags: ['conference', 'campaign', 'promotion'],
  },
];

export const PRODUCTS: CommerceProduct[] = PRODUCT_SEEDS.map((seed) => ({
  id: seed.id,
  sku: seed.sku,
  name: seed.name,
  summary: seed.summary,
  description: seed.description,
  type: seed.type,
  category: seed.category,
  price: {
    amount: seed.price,
    currency: seed.currency,
    ...(seed.interval ? { interval: seed.interval } : {}),
    ...(seed.compareAt ? { compareAt: seed.compareAt } : {}),
  },
  ...(seed.stock != null ? { stock: seed.stock } : {}),
  ...(seed.vendorId ? { vendorId: seed.vendorId } : {}),
  ...(seed.vendorName ? { vendorName: seed.vendorName } : {}),
  ...(seed.sourceId ? { sourceId: seed.sourceId } : {}),
  ...(seed.sourceEntity ? { sourceEntity: seed.sourceEntity } : {}),
  status: 'active',
  tags: seed.tags ?? [],
  featured: seed.featured ?? false,
  createdDate: `${COMMERCE_CURRENT_DATE.slice(0, 4)}-01-15`,
  lastUpdated: COMMERCE_CURRENT_DATE,
}));

const productById = new Map(PRODUCTS.map((product) => [product.id, product]));

// ---------------------------------------------------------------------------
// Shopping carts
// ---------------------------------------------------------------------------

export const CARTS: CommerceCart[] = [
  {
    id: 'cart-ojuri',
    ownerId: 'ojuri',
    items: [
      { productId: 'prod-statistical-analysis', name: 'Statistical Analysis Service', sku: 'SRV-1001', quantity: 1, unitPrice: 250, currency: USD, vendorId: 'vendor-ibadan-statistics-lab' },
      { productId: 'prod-academic-editing', name: 'Academic Editing & Proofreading', sku: 'SRV-1002', quantity: 3000, unitPrice: 0.03, currency: USD, vendorId: 'vendor-dr-smith' },
      { productId: 'prod-consultation', name: 'Research Consultation (1 hour)', sku: 'SRV-1005', quantity: 1, unitPrice: 60, currency: USD, vendorId: 'vendor-dr-smith' },
    ],
    couponCode: 'RESEARCH10',
    updatedAt: `${COMMERCE_CURRENT_DATE}T09:30:00.000Z`,
  },
  {
    id: 'cart-uni-ibadan',
    ownerId: 'SAID-INST-0000',
    items: [
      { productId: 'prod-enterprise-license', name: 'Enterprise License — Institution', sku: 'ENT-0002', quantity: 1, unitPrice: 6000, currency: USD, vendorId: 'vendor-scholatia-press' },
      { productId: 'prod-premium-analytics', name: 'Premium Analytics — Researcher', sku: 'ANA-9001', quantity: 200, unitPrice: 12, currency: USD, vendorId: 'vendor-scholatia-press' },
    ],
    updatedAt: `${COMMERCE_CURRENT_DATE}T11:00:00.000Z`,
  },
];

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export const COUPONS: CommerceCoupon[] = [
  {
    id: 'coup-research10',
    code: 'RESEARCH10',
    title: '10% off research services',
    description: 'Ten percent off any research, writing, or laboratory service in the marketplace.',
    type: 'percent',
    value: 10,
    appliesTo: 'cart',
    minimumSpend: 100,
    maximumDiscount: 50,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageLimit: 500,
    timesUsed: 142,
    status: 'active',
  },
  {
    id: 'coup-institution20',
    code: 'INSTITUTION20',
    title: '20% off institutional plans',
    description: 'Twenty percent off any annual institutional subscription plan.',
    type: 'percent',
    value: 20,
    appliesTo: 'subscription',
    minimumSpend: 500,
    maximumDiscount: 2000,
    validFrom: '2026-03-01',
    validUntil: '2026-12-31',
    usageLimit: 100,
    timesUsed: 27,
    status: 'active',
  },
  {
    id: 'coup-flash30',
    code: 'FLASH30',
    title: 'Flash sale: £30 off',
    description: 'Thirty dollars off the first 200 cart orders during the summer flash sale.',
    type: 'fixed',
    value: 30,
    appliesTo: 'cart',
    minimumSpend: 150,
    maximumDiscount: 30,
    validFrom: '2026-07-01',
    validUntil: '2026-08-31',
    usageLimit: 200,
    timesUsed: 58,
    status: 'active',
  },
  {
    id: 'coup-vendorpro',
    code: 'VENDORPRO',
    title: 'Vendor Pro onboarding',
    description: 'Fifty percent off the first month of a Pro vendor membership.',
    type: 'percent',
    value: 50,
    appliesTo: 'product',
    targetId: 'prod-vendor-membership-pro',
    maximumDiscount: 15,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    timesUsed: 63,
    status: 'active',
  },
  {
    id: 'coup-welcome15',
    code: 'WELCOME15',
    title: 'Welcome credit',
    description: 'Fifteen percent off your first order on the marketplace.',
    type: 'percent',
    value: 15,
    appliesTo: 'cart',
    maximumDiscount: 40,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 388,
    status: 'active',
  },
  {
    id: 'coup-summer2025',
    code: 'SUMMER2025',
    title: 'Summer 2025 campaign',
    description: 'A past-season coupon kept for historical analytics.',
    type: 'percent',
    value: 15,
    appliesTo: 'cart',
    validFrom: '2025-06-01',
    validUntil: '2025-08-31',
    timesUsed: 120,
    status: 'expired',
  },
];

const couponByCode = new Map(COUPONS.map((coupon) => [coupon.code, coupon]));

// ---------------------------------------------------------------------------
// Promotions
// ---------------------------------------------------------------------------

export const PROMOTIONS: CommercePromotion[] = [
  {
    id: 'promo-summer-sale',
    name: 'Summer Research Sale',
    description: 'Seasonal discounts across research services and digital products.',
    kind: 'seasonal',
    discount: { kind: 'percent', value: 15 },
    startsAt: '2026-07-01',
    endsAt: '2026-08-31',
    productIds: ['prod-statistical-analysis', 'prod-research-dataset', 'prod-grant-writing', 'prod-gis-analysis'],
  },
  {
    id: 'promo-flash-72h',
    name: '72-Hour Flash Sale',
    description: 'Flash discount on consulting and editing services.',
    kind: 'flash-sale',
    discount: { kind: 'percent', value: 25 },
    startsAt: '2026-07-25',
    endsAt: '2026-07-28',
    productIds: ['prod-consultation', 'prod-academic-editing'],
  },
  {
    id: 'promo-launch-curriculum',
    name: 'Curriculum Toolkit Launch',
    description: 'Launch pricing on the new curriculum design toolkit.',
    kind: 'launch',
    discount: { kind: 'percent', value: 20 },
    startsAt: '2026-07-01',
    endsAt: '2026-09-30',
    productIds: ['prod-curriculum-design'],
  },
  {
    id: 'promo-boosted-sprint',
    name: 'Boosted Research Sprint',
    description: 'Amplified reach for boosting research outputs this quarter.',
    kind: 'boosted',
    discount: { kind: 'percent', value: 10 },
    budget: 250,
    startsAt: '2026-07-01',
    endsAt: '2026-09-30',
    productIds: ['prod-boost-growth', 'prod-featured-listing', 'prod-sponsored-listing'],
  },
  {
    id: 'promo-featured-institutions',
    name: 'Featured Institutional Deals',
    description: 'Feature placement discounts for institutional buyers.',
    kind: 'featured',
    discount: { kind: 'percent', value: 12 },
    budget: 400,
    startsAt: '2026-07-01',
    endsAt: '2026-12-31',
    productIds: ['prod-enterprise-license', 'prod-api-access', 'prod-premium-analytics'],
  },
  {
    id: 'promo-vendor-launch',
    name: 'Vendor Member Launch',
    description: 'Launch incentive on Pro vendor memberships.',
    kind: 'launch',
    discount: { kind: 'percent', value: 30 },
    startsAt: '2026-07-01',
    endsAt: '2026-10-31',
    productIds: ['prod-vendor-membership-pro'],
  },
];

// ---------------------------------------------------------------------------
// Orders (derived through the engine)
// ---------------------------------------------------------------------------

interface OrderSeed {
  id: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail?: string;
  vendorId?: string;
  items: { productId: string; quantity: number }[];
  couponCode?: string;
  status: CommerceOrder['status'];
  paymentStatus: CommerceOrder['paymentStatus'];
  paymentMethod?: CommerceOrder['paymentMethod'];
  placedAt: string;
  completedAt?: string;
  notes?: string;
}

const ORDER_SEEDS: OrderSeed[] = [
  {
    id: 'ord-2026-0001',
    buyerId: 'ojuri',
    buyerName: researcherName('ojuri'),
    buyerEmail: 'ojuri@university.edu',
    vendorId: 'vendor-ibadan-statistics-lab',
    items: [{ productId: 'prod-statistical-analysis', quantity: 1 }],
    couponCode: 'RESEARCH10',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    placedAt: '2026-07-02T10:00:00.000Z',
    completedAt: '2026-07-12T14:00:00.000Z',
  },
  {
    id: 'ord-2026-0002',
    buyerId: 'smith',
    buyerName: researcherName('smith'),
    buyerEmail: 'smith@oxford.ac.uk',
    vendorId: 'vendor-dr-smith',
    items: [{ productId: 'prod-academic-editing', quantity: 12000 }],
    couponCode: 'WELCOME15',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    placedAt: '2026-06-18T09:15:00.000Z',
    completedAt: '2026-06-25T11:00:00.000Z',
  },
  {
    id: 'ord-2026-0003',
    buyerId: 'adebayo',
    buyerName: researcherName('adebayo'),
    vendorId: 'vendor-university-of-ibadan',
    items: [{ productId: 'prod-lab-equipment', quantity: 5 }],
    status: 'processing',
    paymentStatus: 'processing',
    paymentMethod: 'escrow',
    placedAt: '2026-07-28T13:30:00.000Z',
  },
  {
    id: 'ord-2026-0004',
    buyerId: 'maria',
    buyerName: researcherName('maria'),
    vendorId: 'vendor-dr-smith',
    items: [{ productId: 'prod-research-dataset', quantity: 1 }, { productId: 'prod-stats-textbook', quantity: 2 }],
    couponCode: 'FLASH30',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    placedAt: '2026-07-15T16:00:00.000Z',
    completedAt: '2026-07-16T09:00:00.000Z',
  },
  {
    id: 'ord-2026-0005',
    buyerId: 'jscholar',
    buyerName: researcherName('jscholar'),
    vendorId: 'vendor-adebayo-energy-consulting',
    items: [{ productId: 'prod-grant-writing', quantity: 1 }],
    status: 'disputed',
    paymentStatus: 'partially-refunded',
    paymentMethod: 'bank-transfer',
    placedAt: '2026-06-30T12:00:00.000Z',
    notes: 'Scope clarification pending between buyer and vendor.',
  },
  {
    id: 'ord-2026-0006',
    buyerId: 'ojuri',
    buyerName: researcherName('ojuri'),
    vendorId: 'vendor-ibadan-statistics-lab',
    items: [{ productId: 'prod-gis-analysis', quantity: 1 }],
    couponCode: 'RESEARCH10',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'mobile-money',
    placedAt: '2026-05-20T08:00:00.000Z',
    completedAt: '2026-06-02T10:00:00.000Z',
  },
  {
    id: 'ord-2026-0007',
    buyerId: 'maria',
    buyerName: researcherName('maria'),
    vendorId: 'vendor-dr-smith',
    items: [{ productId: 'prod-consultation', quantity: 2 }],
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    placedAt: '2026-07-29T17:45:00.000Z',
  },
  {
    id: 'ord-2026-0008',
    buyerId: 'SAID-INST-0000',
    buyerName: INSTITUTIONS[0]?.profile.institutionName ?? 'University of Ibadan',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-enterprise-license', quantity: 1 }],
    couponCode: 'INSTITUTION20',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'institution-billing',
    placedAt: '2026-06-01T09:00:00.000Z',
    completedAt: '2026-06-01T09:05:00.000Z',
  },
  {
    id: 'ord-2026-0009',
    buyerId: 'scholatia-press',
    buyerName: PUBLISHERS[0]?.name ?? 'Scholatia Press',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-cfp-campaign', quantity: 1 }, { productId: 'prod-boost-growth', quantity: 2 }],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    placedAt: '2026-07-05T14:20:00.000Z',
    completedAt: '2026-07-05T14:22:00.000Z',
  },
  {
    id: 'ord-2026-0010',
    buyerId: 'JNL-001',
    buyerName: JOURNALS[0]?.journalTitle ?? 'Scholatia Journal of Open Research',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-sponsored-listing', quantity: 1 }, { productId: 'prod-premium-analytics', quantity: 1 }],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'credits',
    placedAt: '2026-07-10T11:10:00.000Z',
    completedAt: '2026-07-10T11:12:00.000Z',
  },
  {
    id: 'ord-2026-0011',
    buyerId: 'siri-conf',
    buyerName: CONFERENCES[0]?.title ?? 'Scholatia International Conference',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-conference-campaign', quantity: 1 }],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'bank-transfer',
    placedAt: '2026-07-18T08:40:00.000Z',
    completedAt: '2026-07-20T09:00:00.000Z',
  },
  {
    id: 'ord-2026-0012',
    buyerId: 'smith',
    buyerName: researcherName('smith'),
    vendorId: 'vendor-ibadan-statistics-lab',
    items: [{ productId: 'prod-spss-masterclass', quantity: 3 }],
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'apple-pay',
    placedAt: '2026-07-30T19:00:00.000Z',
  },
  {
    id: 'ord-2026-0013',
    buyerId: 'jscholar',
    buyerName: researcherName('jscholar'),
    vendorId: 'vendor-oxford-academic-services',
    items: [{ productId: 'prod-curriculum-design', quantity: 1 }],
    status: 'refunded',
    paymentStatus: 'refunded',
    paymentMethod: 'card',
    placedAt: '2026-07-08T10:00:00.000Z',
    completedAt: '2026-07-22T12:00:00.000Z',
    notes: 'Refunded after delivery issue.',
  },
  {
    id: 'ord-2026-0014',
    buyerId: 'adv-scholatia-open-research-press',
    buyerName: 'Scholatia Open Research Press',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-featured-listing', quantity: 2 }],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    placedAt: '2026-07-22T13:00:00.000Z',
    completedAt: '2026-07-22T13:05:00.000Z',
  },
  {
    id: 'ord-2026-0015',
    buyerId: 'ojuri',
    buyerName: researcherName('ojuri'),
    buyerEmail: 'ojuri@university.edu',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-ai-discovery-analytics', quantity: 1 }],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'credits',
    placedAt: '2026-07-25T09:30:00.000Z',
    completedAt: '2026-07-25T09:31:00.000Z',
  },
  {
    id: 'ord-2026-0016',
    buyerId: 'jscholar',
    buyerName: researcherName('jscholar'),
    buyerEmail: 'jscholar@university.edu',
    vendorId: 'vendor-scholatia-press',
    items: [{ productId: 'prod-dataset-download', quantity: 1 }],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    placedAt: '2026-07-20T10:45:00.000Z',
    completedAt: '2026-07-20T10:46:00.000Z',
  },
];

export const ORDERS: CommerceOrder[] = ORDER_SEEDS.map((seed, index) => {
  const items = seed.items.map(({ productId, quantity }) => {
    const product = productById.get(productId);
    if (!product) throw new Error(`Missing commerce product seed: ${productId}`);
    const unitPrice = product.price.amount;
    return { productId, name: product.name, sku: product.sku, quantity, unitPrice, currency: product.price.currency as CurrencyCode };
  });
  const coupon = seed.couponCode ? couponByCode.get(seed.couponCode) : undefined;
  const calc = calculateOrder(items, { coupon, taxRatePercent: 5, currency: items[0]?.currency });
  return {
    id: seed.id,
    orderNumber: `ORD-2026-${String(index + 1).padStart(4, '0')}`,
    buyerId: seed.buyerId,
    buyerName: seed.buyerName,
    buyerEmail: seed.buyerEmail,
    items: calc.items,
    subtotal: calc.subtotal,
    discount: calc.discount,
    couponCode: calc.couponCode,
    tax: calc.tax,
    platformFee: calc.platformFee,
    total: calc.total,
    currency: calc.currency,
    status: seed.status,
    paymentStatus: seed.paymentStatus,
    paymentMethod: seed.paymentMethod,
    invoiceId: `inv-${seed.id}`,
    receiptId: seed.paymentStatus === 'paid' ? `rcp-${seed.id}` : undefined,
    placedAt: seed.placedAt,
    completedAt: seed.completedAt,
    notes: seed.notes,
  };
});

// ---------------------------------------------------------------------------
// Invoices & receipts
// ---------------------------------------------------------------------------

export const INVOICES: CommerceInvoice[] = ORDERS.slice(0, 10).map((order, index) => ({
  id: `inv-${order.id}`,
  invoiceNumber: generateInvoiceNumber(index + 1, 2026),
  orderId: order.id,
  buyerId: order.buyerId,
  buyerName: order.buyerName,
  lines: order.items.map((item) => ({ description: item.name, quantity: item.quantity, unitPrice: item.unitPrice, total: item.total })),
  subtotal: order.subtotal,
  discount: order.discount,
  taxLines: [{ name: 'VAT', ratePercent: 5, amount: order.tax, jurisdiction: 'Global' }],
  tax: order.tax,
  fees: order.platformFee,
  total: order.total,
  currency: order.currency,
  status: order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus === 'pending' || order.paymentStatus === 'processing' ? 'sent' : 'draft',
  issuedAt: order.placedAt,
  dueAt: new Date(new Date(order.placedAt).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  paidAt: order.completedAt,
}));

export const RECEIPTS: CommerceReceipt[] = ORDERS.filter((order) => order.paymentStatus === 'paid').map((order, index) =>
  generateReceipt({
    order,
    sequenceNumber: index + 1,
    invoiceId: order.invoiceId,
    paidAt: order.completedAt ?? order.placedAt,
  }),
);

// ---------------------------------------------------------------------------
// Payments & payment intents
// ---------------------------------------------------------------------------

export const PAYMENTS: CommercePayment[] = ORDERS.filter((order) => order.paymentStatus === 'paid')
  .map((order, index) => ({
    id: `pay-${order.id}`,
    orderId: order.id,
    invoiceId: order.invoiceId,
    amount: order.total,
    currency: order.currency,
    method: order.paymentMethod ?? 'card',
    provider: order.paymentMethod === 'wallet' ? 'Wallet' : order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod === 'apple-pay' ? 'Apple Pay' : order.paymentMethod === 'mobile-money' ? 'Paystack' : order.paymentMethod === 'escrow' ? 'Stripe' : order.paymentMethod === 'credits' ? 'Credits' : order.paymentMethod === 'institution-billing' ? 'Bank Transfer' : 'Stripe',
    status: 'paid',
    escrowed: order.paymentMethod === 'escrow',
    reference: `PAY-2026-${String(index + 1).padStart(5, '0')}`,
    date: order.completedAt ?? order.placedAt,
  }));

export const PAYMENT_INTENTS: CommercePaymentIntent[] = [
  {
    id: 'intent-statistical-analysis',
    orderId: 'ord-2026-0001',
    amount: 214.5,
    currency: USD,
    method: 'card',
    provider: 'Paystack',
    description: 'Statistical Analysis Service',
    metadata: { orderNumber: 'ORD-2026-0001' },
    status: 'captured',
    createdAt: '2026-07-02T10:00:05.000Z',
  },
  {
    id: 'intent-enterprise',
    orderId: 'ord-2026-0008',
    amount: 4800,
    currency: USD,
    method: 'institution-billing',
    provider: 'Wise',
    description: 'Enterprise License — Institution',
    metadata: { orderNumber: 'ORD-2026-0008' },
    status: 'captured',
    createdAt: '2026-06-01T09:00:02.000Z',
  },
  {
    id: 'intent-spss-masterclass',
    orderId: 'ord-2026-0012',
    amount: 540,
    currency: USD,
    method: 'apple-pay',
    provider: 'Stripe',
    description: 'SPSS Masterclass ×3',
    metadata: { orderNumber: 'ORD-2026-0012' },
    status: 'authorized',
    createdAt: '2026-07-30T19:00:03.000Z',
  },
];

// ---------------------------------------------------------------------------
// Refunds
// ---------------------------------------------------------------------------

export const REFUNDS: CommerceRefund[] = [
  {
    id: 'refund-curriculum',
    refundNumber: 'REF-2026-0001',
    orderId: 'ord-2026-0013',
    paymentId: 'pay-ord-2026-0013',
    amount: 75,
    currency: USD,
    reason: 'service-not-rendered',
    note: 'Digital toolkit licence failed to activate on delivery.',
    status: 'completed',
    requestedAt: '2026-07-09T09:00:00.000Z',
    decidedAt: '2026-07-12T10:00:00.000Z',
    decidedBy: 'support',
  },
  {
    id: 'refund-grant-partial',
    refundNumber: 'REF-2026-0002',
    orderId: 'ord-2026-0005',
    paymentId: 'pay-ord-2026-0005',
    amount: 100,
    currency: USD,
    reason: 'not-as-described',
    note: 'Partial refund while dispute is investigated.',
    status: 'processing',
    requestedAt: '2026-07-20T14:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Subscription plans & subscriptions
// ---------------------------------------------------------------------------

export const SUBSCRIPTION_PLANS: CommerceSubscriptionPlan[] = [
  {
    id: 'plan-researcher-pro',
    name: 'Researcher Pro',
    description: 'Premium analytics, unlimited boosting discounts, and priority support for researchers.',
    subscriberType: 'researcher',
    price: { amount: 12, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Premium analytics', 'Boost discounts', 'Advanced profiles', 'Priority support'],
    featured: true,
    status: 'active',
  },
  {
    id: 'plan-institution-membership',
    name: 'Institution Membership',
    description: 'Unified access, enterprise analytics, and API for an entire institution.',
    subscriberType: 'institution',
    price: { amount: 4000, currency: USD, interval: 'per-year' },
    billingCycle: 'annual',
    features: ['Unlimited members', 'Enterprise API', 'Institutional analytics', 'Dedicated support'],
    featured: true,
    status: 'active',
  },
  {
    id: 'plan-publisher-portfolio',
    name: 'Publisher Portfolio',
    description: 'Portfolio analytics and discovery boost for publishers.',
    subscriberType: 'publisher',
    price: { amount: 350, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Portfolio analytics', 'Discovery boost', 'Sales reporting'],
    featured: false,
    status: 'active',
  },
  {
    id: 'plan-journal-indexing',
    name: 'Journal Indexing Plan',
    description: 'Indexing, article analytics, and reviewer matching for journals.',
    subscriberType: 'journal',
    price: { amount: 180, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Indexing reports', 'Article analytics', 'Reviewer matching'],
    featured: false,
    status: 'active',
  },
  {
    id: 'plan-conference-organizer',
    name: 'Conference Organizer Plan',
    description: 'Submissions, registrations, and promotion analytics for conference organisers.',
    subscriberType: 'conference',
    price: { amount: 220, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Submission analytics', 'Registration tracking', 'Promotion packages'],
    featured: false,
    status: 'active',
  },
  {
    id: 'plan-company-talent',
    name: 'Company Talent Plan',
    description: 'Recruitment and research collaboration analytics for companies.',
    subscriberType: 'company',
    price: { amount: 290, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Talent analytics', 'Collaboration matching', 'Recruitment ads'],
    featured: false,
    status: 'active',
  },
  {
    id: 'plan-advertiser-boost',
    name: 'Advertiser Boost',
    description: 'Volume ad spend discounts and forecasting for advertisers.',
    subscriberType: 'advertiser',
    price: { amount: 99, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Spend discounts', 'AI forecasting', 'Audience insights'],
    featured: false,
    status: 'active',
  },
  {
    id: 'plan-vendor-pro',
    name: 'Vendor Pro',
    description: 'Reduced commission and advanced storefront tools for marketplace vendors.',
    subscriberType: 'marketplace-vendor',
    price: { amount: 29, currency: USD, interval: 'per-month' },
    billingCycle: 'monthly',
    features: ['Reduced commission', 'Store analytics', 'Priority support'],
    featured: true,
    status: 'active',
  },
];

const planById = new Map(SUBSCRIPTION_PLANS.map((plan) => [plan.id, plan]));

interface SubscriptionSeed {
  id: string;
  subscriberId: string;
  subscriberName: string;
  subscriberType: CommerceSubscriberType;
  planId: string;
  status: CommerceSubscription['status'];
  startedAt: string;
  nextBillingAt: string;
  cancelledAt?: string;
  autoRenew: boolean;
  seats?: number;
}

const SUBSCRIPTION_SEEDS: SubscriptionSeed[] = [
  { id: 'sub-ojuri-pro', subscriberId: 'ojuri', subscriberName: researcherName('ojuri'), subscriberType: 'researcher', planId: 'plan-researcher-pro', status: 'active', startedAt: '2026-03-01', nextBillingAt: '2026-08-01', autoRenew: true },
  { id: 'sub-uni-ibadan', subscriberId: 'SAID-INST-0000', subscriberName: INSTITUTIONS[0]?.profile.institutionName ?? 'University of Ibadan', subscriberType: 'institution', planId: 'plan-institution-membership', status: 'active', startedAt: '2026-01-01', nextBillingAt: '2027-01-01', autoRenew: true },
  { id: 'sub-scholatia-press', subscriberId: 'scholatia-press', subscriberName: PUBLISHERS[0]?.name ?? 'Scholatia Press', subscriberType: 'publisher', planId: 'plan-publisher-portfolio', status: 'active', startedAt: '2026-02-01', nextBillingAt: '2026-08-01', autoRenew: true },
  { id: 'sub-sjor', subscriberId: 'JNL-001', subscriberName: JOURNALS[0]?.journalTitle ?? 'Scholatia Journal of Open Research', subscriberType: 'journal', planId: 'plan-journal-indexing', status: 'active', startedAt: '2026-04-01', nextBillingAt: '2026-08-01', autoRenew: true },
  { id: 'sub-siri-conf', subscriberId: 'siri-conf', subscriberName: CONFERENCES[0]?.title ?? 'Scholatia International Conference', subscriberType: 'conference', planId: 'plan-conference-organizer', status: 'active', startedAt: '2026-05-01', nextBillingAt: '2026-08-01', autoRenew: true },
  { id: 'sub-afrilabs', subscriberId: 'adv-scholatia-open-research-press', subscriberName: 'Scholatia Open Research Press', subscriberType: 'advertiser', planId: 'plan-advertiser-boost', status: 'active', startedAt: '2026-06-01', nextBillingAt: '2026-08-01', autoRenew: true },
  { id: 'sub-vendor-pro', subscriberId: 'vendor-ibadan-statistics-lab', subscriberName: 'Ibadan Statistics Lab', subscriberType: 'marketplace-vendor', planId: 'plan-vendor-pro', status: 'active', startedAt: '2026-06-15', nextBillingAt: '2026-08-01', autoRenew: true },
  { id: 'sub-company-tech', subscriberId: 'adv-scholar-profile', subscriberName: 'ScholarAI', subscriberType: 'company', planId: 'plan-company-talent', status: 'past-due', startedAt: '2026-05-01', nextBillingAt: '2026-07-01', autoRenew: true },
  { id: 'sub-elsevier', subscriberId: 'elsevier', subscriberName: PUBLISHERS[1]?.name ?? 'Elsevier', subscriberType: 'publisher', planId: 'plan-publisher-portfolio', status: 'cancelled', startedAt: '2026-01-01', nextBillingAt: '2026-07-01', cancelledAt: '2026-07-01', autoRenew: false },
];

export const SUBSCRIPTIONS: CommerceSubscription[] = SUBSCRIPTION_SEEDS.map((seed) => {
  const plan = planById.get(seed.planId);
  if (!plan) throw new Error(`Missing subscription plan seed: ${seed.planId}`);
  const cost = calculateSubscriptionCost({ plan, seats: seed.seats });
  return {
    id: seed.id,
    subscriberId: seed.subscriberId,
    subscriberName: seed.subscriberName,
    subscriberType: seed.subscriberType,
    planId: seed.planId,
    planName: plan.name,
    price: cost.perCycle,
    currency: plan.price.currency as CurrencyCode,
    billingCycle: plan.billingCycle,
    status: seed.status,
    startedAt: seed.startedAt,
    nextBillingAt: seed.nextBillingAt,
    cancelledAt: seed.cancelledAt,
    autoRenew: seed.autoRenew,
    ...(seed.seats ? { seats: seed.seats } : {}),
  };
});

// ---------------------------------------------------------------------------
// Wallets & wallet transactions
// ---------------------------------------------------------------------------

interface WalletSeed {
  id: string;
  ownerId: string;
  ownerName: string;
  currency: CurrencyCode;
  status: CommerceWallet['status'];
  createdAt: string;
}

const WALLET_SEEDS: WalletSeed[] = [
  { id: 'wallet-ojuri', ownerId: 'ojuri', ownerName: researcherName('ojuri'), currency: USD, status: 'active', createdAt: '2026-01-10' },
  { id: 'wallet-ibadan-lab', ownerId: 'vendor-ibadan-statistics-lab', ownerName: 'Ibadan Statistics Lab', currency: USD, status: 'active', createdAt: '2026-01-15' },
  { id: 'wallet-uni-ibadan', ownerId: 'SAID-INST-0000', ownerName: INSTITUTIONS[0]?.profile.institutionName ?? 'University of Ibadan', currency: USD, status: 'active', createdAt: '2026-01-20' },
  { id: 'wallet-dr-smith', ownerId: 'smith', ownerName: researcherName('smith'), currency: GBP, status: 'active', createdAt: '2026-02-01' },
];

export const WALLET_TRANSACTIONS: CommerceWalletTransaction[] = [
  // Ojuri's researcher wallet
  { id: 'wlt-ojuri-1', walletId: 'wallet-ojuri', reference: 'WLT-2026-0001', type: 'credit', amount: 500, direction: 'credit', balanceAfter: 500, currency: USD, description: 'Welcome wallet top-up', status: 'completed', createdAt: '2026-01-10T09:00:00.000Z' },
  { id: 'wlt-ojuri-2', walletId: 'wallet-ojuri', reference: 'WLT-2026-0002', type: 'marketplace-purchase', amount: 225, direction: 'debit', balanceAfter: 275, currency: USD, description: 'Statistical Analysis Service', sourceId: 'ord-2026-0001', sourceEntity: 'order', status: 'completed', createdAt: '2026-07-02T10:00:00.000Z' },
  { id: 'wlt-ojuri-3', walletId: 'wallet-ojuri', reference: 'WLT-2026-0003', type: 'subscription-payment', amount: 12, direction: 'debit', balanceAfter: 263, currency: USD, description: 'Researcher Pro — July', sourceId: 'sub-ojuri-pro', sourceEntity: 'subscription', status: 'completed', createdAt: '2026-07-01T00:00:00.000Z' },
  // Ibadan Statistics Lab vendor wallet
  { id: 'wlt-lab-1', walletId: 'wallet-ibadan-lab', reference: 'WLT-2026-0004', type: 'commission-payout', amount: 206, direction: 'credit', balanceAfter: 206, currency: USD, description: 'Commission payout — Statistical Analysis Service', sourceId: 'ord-2026-0001', sourceEntity: 'order', status: 'completed', createdAt: '2026-07-14T12:00:00.000Z' },
  { id: 'wlt-lab-2', walletId: 'wallet-ibadan-lab', reference: 'WLT-2026-0005', type: 'commission-payout', amount: 294.4, direction: 'credit', balanceAfter: 500.4, currency: USD, description: 'Commission payout — GIS Analysis', sourceId: 'ord-2026-0006', sourceEntity: 'order', status: 'completed', createdAt: '2026-06-05T12:00:00.000Z' },
  { id: 'wlt-lab-3', walletId: 'wallet-ibadan-lab', reference: 'WLT-2026-0006', type: 'debit', amount: 60, direction: 'debit', balanceAfter: 440.4, currency: USD, description: 'Withdrawal to bank account', status: 'completed', createdAt: '2026-06-20T09:00:00.000Z' },
  // University wallet
  { id: 'wlt-uni-1', walletId: 'wallet-uni-ibadan', reference: 'WLT-2026-0007', type: 'credit', amount: 5000, direction: 'credit', balanceAfter: 5000, currency: USD, description: 'Institutional budget allocation', status: 'completed', createdAt: '2026-01-20T09:00:00.000Z' },
  { id: 'wlt-uni-2', walletId: 'wallet-uni-ibadan', reference: 'WLT-2026-0008', type: 'marketplace-purchase', amount: 4800, direction: 'debit', balanceAfter: 200, currency: USD, description: 'Enterprise License — Institution', sourceId: 'ord-2026-0008', sourceEntity: 'order', status: 'completed', createdAt: '2026-06-01T09:00:00.000Z' },
  // Dr Smith wallet
  { id: 'wlt-smith-1', walletId: 'wallet-dr-smith', reference: 'WLT-2026-0009', type: 'commission-payout', amount: 309.6, direction: 'credit', balanceAfter: 309.6, currency: GBP, description: 'Commission payout — Academic Editing', sourceId: 'ord-2026-0002', sourceEntity: 'order', status: 'completed', createdAt: '2026-06-27T12:00:00.000Z' },
  { id: 'wlt-smith-2', walletId: 'wallet-dr-smith', reference: 'WLT-2026-0010', type: 'refund', amount: 75, direction: 'debit', balanceAfter: 234.6, currency: USD, description: 'Refund — Curriculum Design Toolkit', sourceId: 'refund-curriculum', sourceEntity: 'refund', status: 'completed', createdAt: '2026-07-12T10:00:00.000Z' },
  { id: 'wlt-smith-3', walletId: 'wallet-dr-smith', reference: 'WLT-2026-0011', type: 'disbursement', amount: 100, direction: 'credit', balanceAfter: 334.6, currency: USD, description: 'Grant disbursement — Early-career research fund', sourceId: 'grant-early-career', sourceEntity: 'grant', status: 'pending', createdAt: '2026-07-31T08:00:00.000Z' },
];

export const WALLETS: CommerceWallet[] = WALLET_SEEDS.map((seed) =>
  recomputeWalletBalance(
    { ...seed },
    WALLET_TRANSACTIONS.filter((transaction) => transaction.walletId === seed.id),
  ),
);

// ---------------------------------------------------------------------------
// Commissions & vendor earnings
// ---------------------------------------------------------------------------

export const COMMISSIONS: CommerceCommission[] = ORDERS.filter((order) => order.status !== 'pending')
  .map((order) => {
    const vendorId = vendorIdOfOrder(order);
    const commission = calculateMarketplaceCommission({ grossAmount: order.total });
    return {
      id: `comm-${order.id}`,
      orderId: order.id,
      vendorId,
      grossAmount: order.total,
      ratePercent: commission.ratePercent,
      amount: commission.amount,
      currency: order.currency,
      status: order.status === 'completed' ? 'paid' : 'pending',
      createdAt: order.placedAt,
      paidAt: order.completedAt,
    };
  });

function vendorIdOfOrder(order: CommerceOrder): string {
  return order.id === 'ord-2026-0001' || order.id === 'ord-2026-0006' || order.id === 'ord-2026-0012'
    ? 'vendor-ibadan-statistics-lab'
    : order.id === 'ord-2026-0002' || order.id === 'ord-2026-0004' || order.id === 'ord-2026-0007'
      ? 'vendor-dr-smith'
      : order.id === 'ord-2026-0003'
        ? 'vendor-university-of-ibadan'
        : order.id === 'ord-2026-0005'
          ? 'vendor-adebayo-energy-consulting'
          : order.id === 'ord-2026-0013'
            ? 'vendor-oxford-academic-services'
            : 'vendor-scholatia-press';
}

export const VENDOR_EARNINGS: CommerceVendorEarnings[] = [
  'vendor-ibadan-statistics-lab',
  'vendor-dr-smith',
  'vendor-scholatia-press',
  'vendor-adebayo-energy-consulting',
].map((vendorId) => {
  const vendor = marketplaceVendor(vendorId);
  const vendorOrders = ORDERS.filter((order) => vendorIdOfOrder(order) === vendorId);
  const grossSales = vendorOrders.reduce((sum, order) => sum + order.total, 0);
  const commissions = vendorOrders.reduce((sum, order) => sum + calculateMarketplaceCommission({ grossAmount: order.total }).amount, 0);
  const platformFees = vendorOrders.reduce((sum, order) => sum + order.platformFee, 0);
  const refunded = REFUNDS.filter((refund) => refund.orderId === 'ord-2026-0013' && vendorIdOfOrder(ORDERS.find((order) => order.id === refund.orderId)!) === vendorId).reduce((sum, refund) => sum + refund.amount, 0);
  const netEarnings = grossSales - commissions - platformFees - refunded;
  const pending = vendorOrders.filter((order) => order.status === 'processing').reduce((sum, order) => sum + order.total, 0);
  return {
    id: `earnings-${vendorId}`,
    vendorId,
    vendorName: vendor?.name ?? vendorId,
    currency: USD,
    grossSales,
    commissions,
    platformFees,
    refunds: refunded,
    adjustments: 0,
    netEarnings,
    availableBalance: netEarnings - pending,
    pendingBalance: pending,
    lifetimeEarnings: netEarnings,
    periodStart: '2026-06-01',
    periodEnd: '2026-07-31',
  };
});

// ---------------------------------------------------------------------------
// Escrows & settlements
// ---------------------------------------------------------------------------

export const ESCROWS: CommerceEscrow[] = [
  {
    id: 'escrow-2026-0003',
    orderId: 'ord-2026-0003',
    buyerId: 'adebayo',
    vendorId: 'vendor-university-of-ibadan',
    amount: ORDERS.find((order) => order.id === 'ord-2026-0003')?.total ?? 425,
    currency: USD,
    status: 'holding',
    heldAt: '2026-07-28T13:30:00.000Z',
    note: 'Funds held until equipment delivery is confirmed.',
  },
  {
    id: 'escrow-2026-0005',
    orderId: 'ord-2026-0005',
    buyerId: 'jscholar',
    vendorId: 'vendor-adebayo-energy-consulting',
    amount: ORDERS.find((order) => order.id === 'ord-2026-0005')?.total ?? 400,
    currency: USD,
    status: 'disputed',
    heldAt: '2026-06-30T12:00:00.000Z',
    note: 'Dispute investigation in progress; partial refund approved.',
  },
  {
    id: 'escrow-2026-0001',
    orderId: 'ord-2026-0001',
    buyerId: 'ojuri',
    vendorId: 'vendor-ibadan-statistics-lab',
    amount: ORDERS.find((order) => order.id === 'ord-2026-0001')?.total ?? 225,
    currency: USD,
    status: 'released',
    heldAt: '2026-07-02T10:00:00.000Z',
    releasedAt: '2026-07-12T14:00:00.000Z',
    releasedTo: 'vendor-ibadan-statistics-lab',
  },
];

export const SETTLEMENTS: CommerceSettlement[] = [
  {
    id: 'settle-2026-0001',
    vendorId: 'vendor-ibadan-statistics-lab',
    vendorName: 'Ibadan Statistics Lab',
    reference: 'SET-2026-0001',
    amount: 206,
    currency: USD,
    provider: 'Paystack',
    status: 'completed',
    scheduledAt: '2026-07-14T12:00:00.000Z',
    completedAt: '2026-07-15T12:00:00.000Z',
  },
  {
    id: 'settle-2026-0002',
    vendorId: 'vendor-dr-smith',
    vendorName: 'Dr. Sarah Mitchell',
    reference: 'SET-2026-0002',
    amount: 309.6,
    currency: GBP,
    provider: 'Wise',
    status: 'completed',
    scheduledAt: '2026-06-27T12:00:00.000Z',
    completedAt: '2026-06-28T12:00:00.000Z',
  },
  {
    id: 'settle-2026-0003',
    vendorId: 'vendor-ibadan-statistics-lab',
    vendorName: 'Ibadan Statistics Lab',
    reference: 'SET-2026-0003',
    amount: 294.4,
    currency: USD,
    provider: 'Flutterwave',
    status: 'processing',
    scheduledAt: '2026-08-01T12:00:00.000Z',
  },
  {
    id: 'settle-2026-0004',
    vendorId: 'vendor-scholatia-press',
    vendorName: 'Scholatia Press',
    reference: 'SET-2026-0004',
    amount: 520,
    currency: USD,
    provider: 'Bank Transfer',
    status: 'scheduled',
    scheduledAt: '2026-08-03T12:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Transactions (ledger for revenue reporting)
// ---------------------------------------------------------------------------

export const TRANSACTIONS: CommerceTransaction[] = [
  { id: 'tx-2026-0001', reference: 'TXN-2026-0001', kind: 'purchase', amount: 225, currency: USD, status: 'paid', method: 'card', provider: 'Paystack', orderId: 'ord-2026-0001', description: 'Statistical Analysis Service', createdAt: '2026-07-02T10:00:00.000Z' },
  { id: 'tx-2026-0002', reference: 'TXN-2026-0002', kind: 'purchase', amount: 309.6, currency: GBP, status: 'paid', method: 'wallet', provider: 'Wallet', orderId: 'ord-2026-0002', description: 'Academic Editing & Proofreading', createdAt: '2026-06-18T09:15:00.000Z' },
  { id: 'tx-2026-0003', reference: 'TXN-2026-0003', kind: 'purchase', amount: 160, currency: USD, status: 'paid', method: 'paypal', provider: 'PayPal', orderId: 'ord-2026-0004', description: 'Research Dataset + Statistics Textbook', createdAt: '2026-07-15T16:00:00.000Z' },
  { id: 'tx-2026-0004', reference: 'TXN-2026-0004', kind: 'purchase', amount: 288, currency: USD, status: 'paid', method: 'mobile-money', provider: 'Flutterwave', orderId: 'ord-2026-0006', description: 'GIS & Spatial Analysis', createdAt: '2026-05-20T08:00:00.000Z' },
  { id: 'tx-2026-0005', reference: 'TXN-2026-0005', kind: 'purchase', amount: 4800, currency: USD, status: 'paid', method: 'institution-billing', provider: 'Wise', orderId: 'ord-2026-0008', description: 'Enterprise License — Institution', createdAt: '2026-06-01T09:00:00.000Z' },
  { id: 'tx-2026-0006', reference: 'TXN-2026-0006', kind: 'subscription', amount: 12, currency: USD, status: 'paid', method: 'wallet', provider: 'Wallet', subscriptionId: 'sub-ojuri-pro', description: 'Researcher Pro — July', createdAt: '2026-07-01T00:00:00.000Z' },
  { id: 'tx-2026-0007', reference: 'TXN-2026-0007', kind: 'subscription', amount: 4000, currency: USD, status: 'paid', method: 'institution-billing', provider: 'Wise', subscriptionId: 'sub-uni-ibadan', description: 'Institution Membership — annual', createdAt: '2026-01-01T09:00:00.000Z' },
  { id: 'tx-2026-0008', reference: 'TXN-2026-0008', kind: 'advertising', amount: 220, currency: USD, status: 'paid', method: 'card', provider: 'Stripe', orderId: 'ord-2026-0009', description: 'Call for Papers Campaign', createdAt: '2026-07-05T14:20:00.000Z' },
  { id: 'tx-2026-0009', reference: 'TXN-2026-0009', kind: 'boost', amount: 80, currency: USD, status: 'paid', method: 'card', provider: 'Stripe', orderId: 'ord-2026-0009', description: 'Growth Boost ×2', createdAt: '2026-07-05T14:21:00.000Z' },
  { id: 'tx-2026-0010', reference: 'TXN-2026-0010', kind: 'sponsored', amount: 150, currency: USD, status: 'paid', method: 'credits', provider: 'Credits', orderId: 'ord-2026-0010', description: 'Sponsored Listing Campaign', createdAt: '2026-07-10T11:10:00.000Z' },
  { id: 'tx-2026-0011', reference: 'TXN-2026-0011', kind: 'premium-analytics', amount: 12, currency: USD, status: 'paid', method: 'credits', provider: 'Credits', orderId: 'ord-2026-0010', description: 'Premium Analytics — Researcher', createdAt: '2026-07-10T11:11:00.000Z' },
  { id: 'tx-2026-0012', reference: 'TXN-2026-0012', kind: 'membership', amount: 29, currency: USD, status: 'paid', method: 'wallet', provider: 'Wallet', description: 'Vendor Pro membership', createdAt: '2026-06-15T00:00:00.000Z' },
  { id: 'tx-2026-0013', reference: 'TXN-2026-0013', kind: 'refund', amount: 75, currency: USD, status: 'refunded', method: 'card', provider: 'Stripe', orderId: 'ord-2026-0013', description: 'Refund — Curriculum Design Toolkit', createdAt: '2026-07-12T10:00:00.000Z' },
  { id: 'tx-2026-0014', reference: 'TXN-2026-0014', kind: 'disbursement', amount: 100, currency: USD, status: 'pending', method: 'wallet', provider: 'Wallet', description: 'Grant disbursement — Early-career research fund', createdAt: '2026-07-31T08:00:00.000Z' },
  { id: 'tx-2026-0015', reference: 'TXN-2026-0015', kind: 'featured', amount: 130, currency: USD, status: 'paid', method: 'wallet', provider: 'Wallet', orderId: 'ord-2026-0014', description: 'Featured Listing ×2', createdAt: '2026-07-22T13:00:00.000Z' },
  { id: 'tx-2026-0016', reference: 'TXN-2026-0016', kind: 'purchase', amount: 310, currency: USD, status: 'paid', method: 'bank-transfer', provider: 'Bank Transfer', orderId: 'ord-2026-0011', description: 'Conference Promotion Package', createdAt: '2026-07-18T08:40:00.000Z' },
  { id: 'tx-2026-0017', reference: 'TXN-2026-0017', kind: 'ai-services', amount: 40, currency: USD, status: 'paid', method: 'credits', provider: 'Credits', orderId: 'ord-2026-0015', description: 'AI discovery analytics — researcher', createdAt: '2026-07-25T09:30:00.000Z' },
  { id: 'tx-2026-0018', reference: 'TXN-2026-0018', kind: 'ai-services', amount: 120, currency: USD, status: 'paid', method: 'card', provider: 'Stripe', description: 'Trust analytics & reputation intelligence', createdAt: '2026-07-27T14:00:00.000Z' },
  { id: 'tx-2026-0019', reference: 'TXN-2026-0019', kind: 'digital-download', amount: 14, currency: USD, status: 'paid', method: 'wallet', provider: 'Wallet', orderId: 'ord-2026-0016', description: `Dataset download — ${DATASETS[0]?.title ?? 'UD Treebanks'}`, createdAt: '2026-07-20T10:45:00.000Z' },
  { id: 'tx-2026-0020', reference: 'TXN-2026-0020', kind: 'digital-download', amount: 22, currency: USD, status: 'paid', method: 'card', provider: 'Stripe', description: 'Licensed dataset bundle download', createdAt: '2026-07-28T16:20:00.000Z' },
];

// ---------------------------------------------------------------------------
// Tax rates, platform fees, gateway providers, billing addresses
// ---------------------------------------------------------------------------

export const TAX_RATES: CommerceTaxRate[] = [
  { id: 'tax-vat-global', name: 'VAT', jurisdiction: 'Global', ratePercent: 5, appliesTo: 'digital' },
  { id: 'tax-vat-uk', name: 'UK VAT', jurisdiction: 'United Kingdom', ratePercent: 20, appliesTo: 'all' },
  { id: 'tax-vat-ng', name: 'Nigerian VAT', jurisdiction: 'Nigeria', ratePercent: 7.5, appliesTo: 'all' },
  { id: 'tax-gst-za', name: 'South African VAT', jurisdiction: 'South Africa', ratePercent: 15, appliesTo: 'all' },
];

export const PLATFORM_FEES: CommercePlatformFee[] = [
  { id: 'fee-marketplace', scope: 'marketplace', ratePercent: 8, description: 'Marketplace commission on every completed order' },
  { id: 'fee-advertising', scope: 'advertising', ratePercent: 10, description: 'Platform fee on advertising spend' },
  { id: 'fee-subscription', scope: 'subscription', ratePercent: 5, description: 'Processing fee on subscription payments' },
  { id: 'fee-payout', scope: 'payout', ratePercent: 1.5, minimum: 1, description: 'Withdrawal fee on vendor payouts' },
  { id: 'fee-disbursement', scope: 'disbursement', ratePercent: 2, description: 'Fee on grant disbursements' },
];

const PROVIDER_META: { provider: CommercePaymentProvider; displayName: string; enabled: boolean; sandbox: boolean }[] = [
  { provider: 'Paystack', displayName: 'Paystack', enabled: true, sandbox: true },
  { provider: 'Flutterwave', displayName: 'Flutterwave', enabled: true, sandbox: true },
  { provider: 'Stripe', displayName: 'Stripe', enabled: true, sandbox: true },
  { provider: 'PayPal', displayName: 'PayPal', enabled: true, sandbox: true },
  { provider: 'Razorpay', displayName: 'Razorpay', enabled: true, sandbox: true },
  { provider: 'Wise', displayName: 'Wise', enabled: true, sandbox: true },
  { provider: 'Bank Transfer', displayName: 'Bank Transfer', enabled: true, sandbox: true },
  { provider: 'Institutional Invoice', displayName: 'Institutional Invoice', enabled: true, sandbox: true },
  { provider: 'Apple Pay', displayName: 'Apple Pay', enabled: false, sandbox: true },
  { provider: 'Google Pay', displayName: 'Google Pay', enabled: false, sandbox: true },
  { provider: 'Wallet', displayName: 'Scholatia Wallet', enabled: true, sandbox: false },
  { provider: 'Credits', displayName: 'Scholatia Credits', enabled: true, sandbox: false },
];

export const GATEWAY_PROVIDERS: CommerceGatewayProvider[] = PROVIDER_META.map((meta) => ({
  id: `gateway-${meta.provider.toLowerCase().replace(/\s+/g, '-')}`,
  provider: meta.provider,
  displayName: meta.displayName,
  enabled: meta.enabled,
  sandbox: meta.sandbox,
  capabilities: providerCapabilities(meta.provider),
  supportedMethods: providerCapabilities(meta.provider).methods,
}));

export const BILLING_ADDRESSES: CommerceBillingAddress[] = [
  { id: 'addr-ojuri-1', fullName: researcherName('ojuri'), line1: 'Department of Computer Science', line2: 'University of Ibadan', city: 'Ibadan', state: 'Oyo', country: 'Nigeria', phone: '+2348010000000', email: 'ojuri@university.edu', isDefault: true },
  { id: 'addr-uni-ibadan-1', fullName: 'University of Ibadan', line1: 'Ojoo Road', city: 'Ibadan', state: 'Oyo', postalCode: '200005', country: 'Nigeria', email: 'finance@university.edu', isDefault: true },
  { id: 'addr-smith-1', fullName: researcherName('smith'), line1: 'Department of Statistics', city: 'Oxford', country: 'United Kingdom', postalCode: 'OX1 3TG', email: 'smith@oxford.ac.uk', isDefault: true },
  { id: 'addr-press-1', fullName: 'Scholatia Press', line1: 'Scholatia HQ', city: 'London', country: 'United Kingdom', postalCode: 'SW1A 1AA', email: 'billing@scholatia.com', isDefault: true },
];

// ---------------------------------------------------------------------------
// Boost & promotion-reach previews
// ---------------------------------------------------------------------------

const BOOST_PREVIEW_SEEDS: { tierId: string; audienceSize: number }[] = [
  { tierId: 'boost-starter', audienceSize: 12000 },
  { tierId: 'boost-growth', audienceSize: 12000 },
  { tierId: 'boost-scale', audienceSize: 12000 },
  { tierId: 'boost-premium', audienceSize: 12000 },
];

export const BOOST_PREVIEWS = BOOST_PREVIEW_SEEDS.map((seed) => calculateBoostCost(seed));

export const PROMOTION_REACH_PREVIEWS = PROMOTIONS.map((promotion) =>
  estimatePromotionReach({ promotion, audienceSize: 120000 }),
);

// ---------------------------------------------------------------------------
// Statistics, analytics, revenue report
// ---------------------------------------------------------------------------

const vendorIds = new Set<string>();
ORDERS.forEach((order) => vendorIds.add(vendorIdOfOrder(order)));

export const COMMERCE_STATISTICS: CommerceStatistics = computeCommerceStatistics({
  products: PRODUCTS,
  orders: ORDERS,
  refunds: REFUNDS,
  subscriptions: SUBSCRIPTIONS,
  coupons: COUPONS,
  promotions: PROMOTIONS,
  wallets: WALLETS,
  escrows: ESCROWS,
  settlements: SETTLEMENTS,
  vendors: Array.from(vendorIds, (id) => ({ id })),
  gatewayProviders: GATEWAY_PROVIDERS,
});

export const COMMERCE_ANALYTICS: CommercePlatformAnalytics = computePlatformAnalytics({
  orders: ORDERS,
  payments: PAYMENTS,
  refunds: REFUNDS,
  subscriptions: SUBSCRIPTIONS,
  wallets: WALLETS,
  escrows: ESCROWS,
  settlements: SETTLEMENTS,
  coupons: COUPONS,
  products: PRODUCTS,
});

export const COMMERCE_REVENUE_REPORT: CommerceRevenueReport = computeRevenueReport({
  transactions: TRANSACTIONS,
  orders: ORDERS,
  payments: PAYMENTS,
  refunds: REFUNDS,
  subscriptions: SUBSCRIPTIONS,
});

// ---------------------------------------------------------------------------
// Financial reports (Phase 2.0)
// ---------------------------------------------------------------------------

export const FINANCIAL_REPORTS: CommerceFinancialReport[] = computeFinancialReports(COMMERCE_REVENUE_REPORT, USD);

export const FEATURED_FINANCIAL_REPORT: CommerceFinancialReport = FINANCIAL_REPORTS[FINANCIAL_REPORTS.length - 1];

// ---------------------------------------------------------------------------
// Currencies, exchange rates, pricing models (Phase 1.9D)
// ---------------------------------------------------------------------------

export { COMMERCE_CURRENCIES };

export const COMMERCE_EXCHANGE_RATES: CommerceExchangeRate[] = [
  { id: 'fx-usd-gbp', from: 'USD', to: 'GBP', rate: 0.78, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-gbp-usd', from: 'GBP', to: 'USD', rate: 1.28, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-usd-eur', from: 'USD', to: 'EUR', rate: 0.92, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-usd-ngn', from: 'USD', to: 'NGN', rate: 1540, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-usd-zar', from: 'USD', to: 'ZAR', rate: 18.4, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-usd-ghs', from: 'USD', to: 'GHS', rate: 14.9, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-usd-kes', from: 'USD', to: 'KES', rate: 129.2, updatedAt: '2026-07-31T00:00:00.000Z' },
  { id: 'fx-usd-jpy', from: 'USD', to: 'JPY', rate: 151.6, updatedAt: '2026-07-31T00:00:00.000Z' },
];

// ---------------------------------------------------------------------------
// Bundles, product variants, licences
// ---------------------------------------------------------------------------

export const COMMERCE_BUNDLES: CommerceBundle[] = [
  calculateBundlePrice({
    bundle: {
      id: 'bundle-analysis-suite',
      name: 'Analysis Suite',
      description: 'Statistical analysis service plus the SPSS masterclass and the statistics textbook.',
      productIds: ['prod-statistical-analysis', 'prod-spss-masterclass', 'prod-stats-textbook'],
      currency: USD,
      status: 'active',
      featured: true,
      tags: ['analysis', 'training'],
    },
    products: PRODUCTS,
    bundlePrice: 420,
  }),
  calculateBundlePrice({
    bundle: {
      id: 'bundle-research-starter',
      name: 'Research Starter Kit',
      description: 'A curated dataset, the statistics textbook, and a consultation hour to get going.',
      productIds: ['prod-research-dataset', 'prod-stats-textbook', 'prod-consultation'],
      currency: USD,
      status: 'active',
      featured: true,
      tags: ['starter', 'data'],
    },
    products: PRODUCTS,
    bundlePrice: 240,
  }),
  calculateBundlePrice({
    bundle: {
      id: 'bundle-grant-readiness',
      name: 'Grant Readiness Pack',
      description: 'Grant writing support plus a live SPSS masterclass seat.',
      productIds: ['prod-grant-writing', 'prod-spss-masterclass'],
      currency: USD,
      status: 'active',
      featured: false,
      tags: ['grants', 'training'],
    },
    products: PRODUCTS,
    bundlePrice: 220,
  }),
  calculateBundlePrice({
    bundle: {
      id: 'bundle-conference-marketing',
      name: 'Conference Marketing Kit',
      description: 'Call for papers campaign, featured listing, and a growth boost.',
      productIds: ['prod-cfp-campaign', 'prod-featured-listing', 'prod-boost-growth'],
      currency: USD,
      status: 'draft',
      featured: false,
      tags: ['conference', 'promotion'],
    },
    products: PRODUCTS,
    bundlePrice: 240,
  }),
];

export const COMMERCE_PRODUCT_VARIANTS: CommerceProductVariant[] = [
  { id: 'variant-spss-self-paced', productId: 'prod-spss-masterclass', sku: 'CRS-2001-SELF', name: 'Self-paced cohort', attributes: { mode: 'self-paced', cohort: '2026-Q3' }, unitPrice: 120, currency: USD, stock: 120, status: 'active' },
  { id: 'variant-spss-live', productId: 'prod-spss-masterclass', sku: 'CRS-2001-LIVE', name: 'Live cohort', attributes: { mode: 'live', cohort: '2026-Q3' }, unitPrice: 180, currency: USD, stock: 40, status: 'active' },
  { id: 'variant-consult-60', productId: 'prod-consultation', sku: 'SRV-1005-60', name: '60-minute session', attributes: { duration: '60min', format: 'video' }, unitPrice: 60, currency: USD, status: 'active' },
  { id: 'variant-consult-90', productId: 'prod-consultation', sku: 'SRV-1005-90', name: '90-minute session', attributes: { duration: '90min', format: 'video' }, unitPrice: 90, currency: USD, status: 'active' },
  { id: 'variant-enterprise-25', productId: 'prod-enterprise-license', sku: 'ENT-0002-25', name: 'Up to 25 seats', attributes: { seats: '25', term: 'annual' }, unitPrice: 6000, currency: USD, status: 'active' },
  { id: 'variant-enterprise-100', productId: 'prod-enterprise-license', sku: 'ENT-0002-100', name: 'Up to 100 seats', attributes: { seats: '100', term: 'annual' }, unitPrice: 18000, currency: USD, status: 'active' },
  { id: 'variant-dataset-community', productId: 'prod-research-dataset', sku: 'DIG-4001-COMMUNITY', name: 'Community access', attributes: { tier: 'community' }, unitPrice: 0, currency: USD, status: 'active' },
  { id: 'variant-dataset-full', productId: 'prod-research-dataset', sku: 'DIG-4001-FULL', name: 'Full research license', attributes: { tier: 'research' }, unitPrice: 180, currency: USD, status: 'active' },
];

export const COMMERCE_LICENSES: CommerceLicense[] = [
  {
    id: 'lic-enterprise-university',
    licenseNumber: 'LIC-ENT-2026-0001',
    productId: 'prod-enterprise-license',
    productName: productById.get('prod-enterprise-license')?.name ?? 'Enterprise License — Institution',
    licenseeId: 'SAID-INST-0000',
    licenseeName: INSTITUTIONS[0]?.profile.institutionName ?? 'University of Ibadan',
    licenseeType: 'institution',
    seats: 100,
    termMonths: 12,
    price: 4800,
    currency: USD,
    status: 'active',
    startsAt: '2026-06-01',
    expiresAt: '2027-05-31',
    issuedAt: '2026-06-01',
  },
  {
    id: 'lic-publisher-api',
    licenseNumber: 'LIC-API-2026-0002',
    productId: 'prod-api-access',
    productName: productById.get('prod-api-access')?.name ?? 'API Access',
    licenseeId: 'scholatia-press',
    licenseeName: PUBLISHERS[0]?.name ?? 'Scholatia Press',
    licenseeType: 'publisher',
    seats: 25,
    termMonths: 12,
    price: 6000,
    currency: USD,
    status: 'active',
    startsAt: '2026-03-01',
    expiresAt: '2027-02-28',
    issuedAt: '2026-03-01',
  },
  {
    id: 'lic-journal-analytics',
    licenseNumber: 'LIC-ANA-2026-0003',
    productId: 'prod-premium-analytics',
    productName: productById.get('prod-premium-analytics')?.name ?? 'Premium Analytics',
    licenseeId: 'JNL-001',
    licenseeName: JOURNALS[0]?.journalTitle ?? 'Scholatia Journal of Open Research',
    licenseeType: 'journal',
    seats: 12,
    termMonths: 12,
    price: 1440,
    currency: USD,
    status: 'expired',
    startsAt: '2025-06-01',
    expiresAt: '2026-05-31',
    issuedAt: '2025-06-01',
  },
  {
    id: 'lic-conference-analytics',
    licenseNumber: 'LIC-ANA-2026-0004',
    productId: 'prod-premium-analytics',
    productName: productById.get('prod-premium-analytics')?.name ?? 'Premium Analytics',
    licenseeId: 'siri-conf',
    licenseeName: CONFERENCES[0]?.title ?? 'Scholatia International Conference',
    licenseeType: 'conference',
    seats: 20,
    termMonths: 6,
    price: 720,
    currency: USD,
    status: 'active',
    startsAt: '2026-04-01',
    expiresAt: '2026-09-30',
    issuedAt: '2026-04-01',
  },
  {
    id: 'lic-researcher-dataset',
    licenseNumber: 'LIC-DAT-2026-0005',
    productId: 'prod-research-dataset',
    productName: productById.get('prod-research-dataset')?.name ?? 'Curated Research Dataset',
    licenseeId: 'ojuri',
    licenseeName: researcherName('ojuri'),
    licenseeType: 'researcher',
    seats: 1,
    termMonths: 12,
    price: 180,
    currency: USD,
    status: 'active',
    startsAt: '2026-07-15',
    expiresAt: '2027-07-14',
    issuedAt: '2026-07-15',
  },
];

// ---------------------------------------------------------------------------
// Purchase history, participant earnings, relationships, lifecycle coverage
// ---------------------------------------------------------------------------

export const COMMERCE_PURCHASE_HISTORY: CommercePurchaseRecord[] = purchaseHistoryFromOrders(ORDERS).map((record) => {
  const product = productById.get(record.productId);
  return {
    ...record,
    productType: product?.type ?? record.productType,
    ...(product?.sourceId ? { sourceEntity: product.sourceId } : {}),
  };
});

const PARTICIPANT_SEEDS: { buyerId: string; participantType: CommerceRevenueParticipantType; participantName: string }[] = [
  { buyerId: 'ojuri', participantType: 'researcher', participantName: researcherName('ojuri') },
  { buyerId: 'smith', participantType: 'researcher', participantName: researcherName('smith') },
  { buyerId: 'adebayo', participantType: 'researcher', participantName: researcherName('adebayo') },
  { buyerId: 'maria', participantType: 'researcher', participantName: researcherName('maria') },
  { buyerId: 'jscholar', participantType: 'researcher', participantName: researcherName('jscholar') },
  { buyerId: 'SAID-INST-0000', participantType: 'institution', participantName: INSTITUTIONS[0]?.profile.institutionName ?? 'University of Ibadan' },
  { buyerId: 'siri-conf', participantType: 'institution', participantName: CONFERENCES[0]?.title ?? 'Scholatia International Conference' },
  { buyerId: 'scholatia-press', participantType: 'publisher', participantName: PUBLISHERS[0]?.name ?? 'Scholatia Press' },
  { buyerId: 'JNL-001', participantType: 'publisher', participantName: JOURNALS[0]?.journalTitle ?? 'Scholatia Journal of Open Research' },
  { buyerId: 'adv-scholatia-open-research-press', participantType: 'publisher', participantName: 'Scholatia Open Research Press' },
];

export const COMMERCE_PARTICIPANT_EARNINGS: CommerceParticipantEarnings[] = PARTICIPANT_SEEDS.map((seed) => {
  const participantOrders = ORDERS.filter((order) => order.buyerId === seed.buyerId);
  const grossRevenue = participantOrders.reduce((sum, order) => sum + order.total, 0);
  const platformFees = participantOrders.reduce((sum, order) => sum + order.platformFee, 0);
  const refunded = REFUNDS.filter((refund) => participantOrders.some((order) => order.id === refund.orderId)).reduce((sum, refund) => sum + refund.amount, 0);
  const commissions = 0;
  const netRevenue = grossRevenue - platformFees - commissions - refunded;
  const pending = participantOrders.filter((order) => order.status === 'processing').reduce((sum, order) => sum + order.total, 0);
  return {
    id: `earn-${seed.buyerId}`,
    participantType: seed.participantType,
    participantId: seed.buyerId,
    participantName: seed.participantName,
    currency: USD,
    grossRevenue,
    platformFees,
    commissions,
    refunds: refunded,
    netRevenue,
    availableBalance: netRevenue - pending,
    pendingBalance: pending,
    lifetimeRevenue: grossRevenue,
    periodStart: '2026-01-01',
    periodEnd: '2026-07-31',
  };
});

export const COMMERCE_RELATIONSHIPS: CommerceRelationship[] = [
  { id: 'rel-ojuri-buys-analysis', kind: 'buys', fromEntity: 'researcher', fromId: 'ojuri', toEntity: 'order', toId: 'ord-2026-0001', description: 'Purchased Statistical Analysis Service' },
  { id: 'rel-institution-buys-license', kind: 'buys', fromEntity: 'institution', fromId: 'SAID-INST-0000', toEntity: 'order', toId: 'ord-2026-0008', description: 'Purchased Enterprise License — Institution' },
  { id: 'rel-journal-buys-sponsorship', kind: 'buys', fromEntity: 'journal', fromId: 'JNL-001', toEntity: 'order', toId: 'ord-2026-0010', description: 'Sponsored listing plus premium analytics' },
  { id: 'rel-institution-subscribes', kind: 'subscribes', fromEntity: 'institution', fromId: 'SAID-INST-0000', toEntity: 'subscription', toId: 'sub-uni-ibadan', description: 'Institution Membership — annual' },
  { id: 'rel-ojuri-subscribes', kind: 'subscribes', fromEntity: 'researcher', fromId: 'ojuri', toEntity: 'subscription', toId: 'sub-ojuri-pro', description: 'Researcher Pro plan' },
  { id: 'rel-lab-sells-analysis', kind: 'sells', fromEntity: 'vendor', fromId: 'vendor-ibadan-statistics-lab', toEntity: 'order', toId: 'ord-2026-0001', description: 'Sold statistical analysis service' },
  { id: 'rel-lab-settles', kind: 'settles', fromEntity: 'vendor', fromId: 'vendor-ibadan-statistics-lab', toEntity: 'settlement', toId: 'settle-2026-0001', description: 'Settlement of commission payouts' },
  { id: 'rel-publisher-promotes', kind: 'promotes', fromEntity: 'publisher', fromId: 'adv-scholatia-open-research-press', toEntity: 'order', toId: 'ord-2026-0014', description: 'Featured listing promotion' },
  { id: 'rel-platform-disburses', kind: 'disburses', fromEntity: 'platform', fromId: 'scholatia', toEntity: 'transaction', toId: 'tx-2026-0014', description: 'Grant disbursement to early-career research fund' },
  { id: 'rel-institution-licensed', kind: 'licenses', fromEntity: 'institution', fromId: 'SAID-INST-0000', toEntity: 'license', toId: 'lic-enterprise-university', description: 'Enterprise license for institution' },
];

export const COMMERCE_LIFECYCLE_COVERAGE: CommerceLifecycleCoverage[] = [
  { stage: 'idea', stageName: 'Idea', revenueStream: 'AI services', surfaces: ['AI discovery analytics'], exampleProductIds: ['prod-ai-discovery-analytics'] },
  { stage: 'concept-note', stageName: 'Concept Note', revenueStream: 'Consultancy', surfaces: ['Research consultation'], exampleProductIds: ['prod-consultation'] },
  { stage: 'proposal', stageName: 'Proposal', revenueStream: 'Professional services', surfaces: ['Grant writing & proposal review'], exampleProductIds: ['prod-grant-writing'] },
  { stage: 'funding', stageName: 'Funding', revenueStream: 'Disbursements', surfaces: ['Grant disbursements', 'Institution membership'], exampleProductIds: ['prod-enterprise-license'] },
  { stage: 'project', stageName: 'Project', revenueStream: 'Subscriptions', surfaces: ['Researcher Pro', 'Workspace projects'], exampleProductIds: ['prod-vendor-membership-pro'] },
  { stage: 'dataset', stageName: 'Dataset', revenueStream: 'Digital downloads', surfaces: ['Dataset downloads', 'Licensed dataset access'], exampleProductIds: ['prod-research-dataset', 'prod-dataset-download'] },
  { stage: 'analysis', stageName: 'Analysis', revenueStream: 'Marketplace', surfaces: ['Statistical analysis', 'GIS & spatial analysis'], exampleProductIds: ['prod-statistical-analysis', 'prod-gis-analysis'] },
  { stage: 'manuscript', stageName: 'Manuscript', revenueStream: 'Marketplace', surfaces: ['Academic editing & proofreading'], exampleProductIds: ['prod-academic-editing'] },
  { stage: 'submission', stageName: 'Submission', revenueStream: 'Marketplace', surfaces: ['Publication support services'], exampleProductIds: ['prod-academic-editing'] },
  { stage: 'peer-review', stageName: 'Peer Review', revenueStream: 'Subscriptions', surfaces: ['Journal analytics'], exampleProductIds: ['prod-premium-analytics'] },
  { stage: 'publication', stageName: 'Publication', revenueStream: 'Advertising', surfaces: ['Call for papers', 'Featured listings'], exampleProductIds: ['prod-cfp-campaign', 'prod-featured-listing'] },
  { stage: 'conference', stageName: 'Conference', revenueStream: 'Advertising', surfaces: ['Conference campaigns', 'Sponsored placements'], exampleProductIds: ['prod-conference-campaign', 'prod-sponsored-listing'] },
  { stage: 'citation', stageName: 'Citation', revenueStream: 'Premium analytics', surfaces: ['Citation & impact analytics'], exampleProductIds: ['prod-premium-analytics'] },
  { stage: 'impact', stageName: 'Impact', revenueStream: 'AI services', surfaces: ['Trust & reputation intelligence'], exampleProductIds: ['prod-ai-discovery-analytics'] },
  { stage: 'knowledge-transfer', stageName: 'Knowledge Transfer', revenueStream: 'Digital products', surfaces: ['Curriculum toolkits', 'Training courses'], exampleProductIds: ['prod-curriculum-design', 'prod-spss-masterclass'] },
];

// ---------------------------------------------------------------------------
// Featured exports
// ---------------------------------------------------------------------------

export const FEATURED_PRODUCT: CommerceProduct = PRODUCTS.find((product) => product.id === 'prod-statistical-analysis') ?? PRODUCTS[0];
export const FEATURED_CART: CommerceCart = CARTS[0];
export const FEATURED_ORDER: CommerceOrder = ORDERS.find((order) => order.id === 'ord-2026-0001') ?? ORDERS[0];
export const FEATURED_INVOICE: CommerceInvoice = INVOICES[0];
export const FEATURED_RECEIPT: CommerceReceipt = RECEIPTS[0];
export const FEATURED_WALLET: CommerceWallet = WALLETS.find((wallet) => wallet.id === 'wallet-ibadan-lab') ?? WALLETS[0];
export const FEATURED_SUBSCRIPTION: CommerceSubscription = SUBSCRIPTIONS.find((subscription) => subscription.id === 'sub-uni-ibadan') ?? SUBSCRIPTIONS[0];
export const FEATURED_SUBSCRIPTION_PLAN: CommerceSubscriptionPlan = SUBSCRIPTION_PLANS.find((plan) => plan.id === 'plan-institution-membership') ?? SUBSCRIPTION_PLANS[0];
export const FEATURED_COUPON: CommerceCoupon = COUPONS.find((coupon) => coupon.code === 'RESEARCH10') ?? COUPONS[0];
export const FEATURED_PROMOTION: CommercePromotion = PROMOTIONS.find((promotion) => promotion.id === 'promo-summer-sale') ?? PROMOTIONS[0];
export const FEATURED_ESCROW: CommerceEscrow = ESCROWS.find((escrow) => escrow.status === 'holding') ?? ESCROWS[0];
export const FEATURED_SETTLEMENT: CommerceSettlement = SETTLEMENTS.find((settlement) => settlement.status === 'processing') ?? SETTLEMENTS[0];
export const FEATURED_COMMISSION: CommerceCommission = COMMISSIONS[0];
export const FEATURED_VENDOR_EARNINGS: CommerceVendorEarnings = VENDOR_EARNINGS[0];
export const FEATURED_TRANSACTION: CommerceTransaction = TRANSACTIONS.find((transaction) => transaction.kind === 'subscription') ?? TRANSACTIONS[0];
export const FEATURED_PAYMENT: CommercePayment = PAYMENTS[0];
export const FEATURED_GATEWAY: CommerceGatewayProvider = GATEWAY_PROVIDERS.find((provider) => provider.provider === 'Paystack') ?? GATEWAY_PROVIDERS[0];
export const FEATURED_CURRENCY: CommerceCurrency = COMMERCE_CURRENCIES[0];
export const FEATURED_EXCHANGE_RATE: CommerceExchangeRate = COMMERCE_EXCHANGE_RATES[0];
export const FEATURED_BUNDLE: CommerceBundle = COMMERCE_BUNDLES[0];
export const FEATURED_PRODUCT_VARIANT: CommerceProductVariant = COMMERCE_PRODUCT_VARIANTS[0];
export const FEATURED_LICENSE: CommerceLicense = COMMERCE_LICENSES[0];
export const FEATURED_PURCHASE_RECORD: CommercePurchaseRecord = COMMERCE_PURCHASE_HISTORY[0];
export const FEATURED_PARTICIPANT_EARNINGS: CommerceParticipantEarnings = COMMERCE_PARTICIPANT_EARNINGS[0];

export const COMMERCE_PORTFOLIO: CommercePortfolio = buildCommercePortfolio({
  products: PRODUCTS,
  carts: CARTS,
  orders: ORDERS,
  invoices: INVOICES,
  receipts: RECEIPTS,
  payments: PAYMENTS,
  paymentIntents: PAYMENT_INTENTS,
  refunds: REFUNDS,
  coupons: COUPONS,
  promotions: PROMOTIONS,
  wallets: WALLETS,
  walletTransactions: WALLET_TRANSACTIONS,
  subscriptions: SUBSCRIPTIONS,
  subscriptionPlans: SUBSCRIPTION_PLANS,
  commissions: COMMISSIONS,
  escrows: ESCROWS,
  vendorEarnings: VENDOR_EARNINGS,
  settlements: SETTLEMENTS,
  transactions: TRANSACTIONS,
  taxRates: TAX_RATES,
  platformFees: PLATFORM_FEES,
  gatewayProviders: GATEWAY_PROVIDERS,
  billingAddresses: BILLING_ADDRESSES,
  currencies: [...COMMERCE_CURRENCIES],
  exchangeRates: COMMERCE_EXCHANGE_RATES,
  bundles: COMMERCE_BUNDLES,
  productVariants: COMMERCE_PRODUCT_VARIANTS,
  licenses: COMMERCE_LICENSES,
  purchaseHistory: COMMERCE_PURCHASE_HISTORY,
  participantEarnings: COMMERCE_PARTICIPANT_EARNINGS,
  relationships: COMMERCE_RELATIONSHIPS,
  lifecycleCoverage: COMMERCE_LIFECYCLE_COVERAGE,
  vendors: Array.from(vendorIds, (id) => ({ id })),
});
