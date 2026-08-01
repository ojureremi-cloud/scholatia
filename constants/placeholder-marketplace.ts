import type {
  MarketplaceAvailability,
  MarketplaceBooking,
  MarketplaceBundle,
  MarketplaceCategory,
  MarketplaceCoupon,
  MarketplaceDiscount,
  MarketplaceDispute,
  MarketplaceGuestAdvertiser,
  MarketplaceInvoice,
  MarketplaceListing,
  MarketplaceListingType,
  MarketplaceMessage,
  MarketplaceNotification,
  MarketplaceOrder,
  MarketplaceOrderStatus,
  MarketplacePayment,
  MarketplacePaymentMethod,
  MarketplacePortfolio,
  MarketplacePortfolioItem,
  MarketplacePrice,
  MarketplacePromotion,
  MarketplaceRecommendation,
  MarketplaceRefund,
  MarketplaceReview,
  MarketplaceStatistics,
  MarketplaceStorefront,
  MarketplaceVendor,
  MarketplaceVendorBadge,
  MarketplaceVendorType,
  MarketplaceWishlist,
} from '@/types/marketplace';
import type { DiscoveryEntityType, DiscoveryItem } from '@/types/discovery';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { CareerStage } from '@/types/funding';
import type { PromotableObject } from '@/types/ads';
import type { ResearcherProfile, ResearcherPositionType } from '@/types/researcher';

import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { PUBLISHERS } from '@/constants/placeholder-publishers';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { JOURNALS } from '@/constants/placeholder-journals';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { FUNDING_OPPORTUNITIES } from '@/constants/placeholder-funding';
import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS, RESEARCH_TEAM } from '@/constants/placeholder-research';

import {
  buildListingUrl,
  buildStoreUrl,
  computeMarketplaceAnalytics,
  computeMarketplaceStatistics,
  computeRevenueDashboard,
  computeSalesDashboard,
  effectivePrice,
  listingPromotableObject,
  ratingFromReviews,
  scoreListingRelevance,
  searchListings,
  toDiscoveryItems,
} from '@/lib/marketplace';
import { registerPromotableObjects } from '@/lib/ads';

/**
 * Placeholder data for the Scholatia Academic Marketplace (Phase 1.9B).
 *
 * The Marketplace is the platform-wide commercial and transactional layer. It
 * does NOT own records and does NOT duplicate any module data — every vendor
 * references a researcher identity when applicable, and every listing
 * references the original source record it sells or services (a project id, a
 * dataset id, a journal id, a conference id, a funding opportunity id, a
 * manuscript id, a publisher id, a publication DOI). Vendors, storefronts,
 * listings, reviews, orders, invoices, payments, refunds, disputes, coupons,
 * promotions, bundles, bookings, messages, notifications, wishlists, guest
 * advertisers, and AI recommendations are all derived from the existing
 * placeholder modules and computed by the pure engine in `lib/marketplace.ts`.
 */

const CURRENT_DATE = '2026-07-31';

// ---------------------------------------------------------------------------
// Shared derivation helpers
// ---------------------------------------------------------------------------

function researcherOf(username: string): ResearcherProfile {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  if (!found) {
    throw new Error(`Missing researcher seed: ${username}`);
  }
  return found;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Deterministically produce `count` star ratings near a target average. */
function ratingsFor(average: number, count: number): number[] {
  const high = Math.round(average);
  const low = Math.max(1, high - 1);
  const highCount = Math.min(count, Math.round((average - low) * count));
  return Array.from({ length: count }, (_, index) => (index < highCount ? high : low));
}

const REVIEWER_NAMES = [
  'Dr. Amina Bello',
  'Prof. Kwame Mensah',
  'Ms. Fatima Zahra',
  'Dr. Carlos Mendes',
  'Mr. David Okafor',
  'Dr. Sarah Mitchell',
  'Prof. Wei Zhang',
  'Dr. Grace Adeyemi',
  'Mr. Peter Njoroge',
  'Dr. Lena Fischer',
];

const REVIEW_TITLES = [
  'Excellent service, delivered on time.',
  'High quality work and clear communication.',
  'Would recommend to any research team.',
  'Very responsive and professional.',
];

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------

type VendorSeed = {
  id: string;
  slug: string;
  name: string;
  type: MarketplaceVendorType;
  tagline: string;
  description: string;
  country: string;
  city?: string;
  website?: string;
  email?: string;
  verified: boolean;
  badges: MarketplaceVendorBadge[];
  responseTime: string;
  completedOrders: number;
  yearsActive: string;
  joinedAt: string;
  followers: number;
  researcherUsername?: string;
  position?: ResearcherPositionType;
  institution?: string;
  skills: string[];
  categories: MarketplaceCategory[];
  portfolio: MarketplacePortfolioItem[];
  rating: { average: number; count: number };
};

function makeVendor(seed: VendorSeed, index: number): MarketplaceVendor {
  const researcher = seed.researcherUsername ? researcherOf(seed.researcherUsername) : undefined;
  const position: ResearcherPositionType = seed.position ?? researcher?.position.title ?? 'Industry Researcher';
  const institution = seed.institution ?? researcher?.position.institution;
  const ratingProfile = ratingsFor(seed.rating.average, seed.rating.count);
  const rating = ratingFromReviews(
    ratingProfile.map((value, i) => ({
      id: `seed-review-${seed.id}-${i}`,
      listingId: `seed-${seed.id}`,
      vendorId: seed.id,
      reviewerName: REVIEWER_NAMES[(index + i) % REVIEWER_NAMES.length],
      rating: value,
      title: REVIEW_TITLES[i % REVIEW_TITLES.length],
      comment: 'Consistent quality across engagements.',
      helpfulVotes: (i * 3) % 40,
      reported: false,
      verifiedPurchase: i % 5 !== 4,
      date: '2026-05-10',
    })),
  );
  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    type: seed.type,
    avatar: researcher?.avatar,
    tagline: seed.tagline,
    description: seed.description,
    country: seed.country,
    city: seed.city,
    website: seed.website ?? researcher?.socialLinks.personalWebsite,
    email: seed.email,
    verified: seed.verified,
    trustScore: Math.min(100, 62 + (index * 3) % 36),
    badges: seed.badges,
    rating,
    responseTime: seed.responseTime,
    completedOrders: seed.completedOrders,
    yearsActive: seed.yearsActive,
    joinedAt: seed.joinedAt,
    followers: seed.followers,
    researcherUsername: seed.researcherUsername,
    researcherSaid: researcher?.identity.said,
    position,
    institution,
    skills: seed.skills,
    categories: seed.categories,
    portfolio: seed.portfolio,
  };
}

const VENDOR_SEEDS: VendorSeed[] = [
  {
    id: 'vendor-ibadan-statistics-lab',
    slug: 'ibadan-statistics-lab',
    name: 'Ibadan Statistics Lab',
    type: 'laboratory',
    researcherUsername: 'ojuri',
    tagline: 'Biostatistics, research design, and data analysis for health research across West Africa.',
    description:
      'A specialist statistical service run by the University of Ibadan Public Health faculty. Statistical analysis in Stata and R, NVivo and ATLAS.ti qualitative coding, systematic reviews, and survey design for researchers, students, and institutions.',
    country: 'Nigeria',
    city: 'Ibadan',
    verified: true,
    badges: ['Verified Vendor', 'Top Rated', 'Institution Verified'],
    responseTime: 'Within 3 hours',
    completedOrders: 248,
    yearsActive: '2019 - Present',
    joinedAt: '2019-03-12',
    followers: 3200,
    skills: ['Biostatistics', 'Stata', 'R', 'NVivo', 'ATLAS.ti', 'Epidemiology', 'Survey design'],
    categories: ['research-services', 'academic-writing', 'education', 'digital-products'],
    portfolio: [
      { id: 'port-stat-1', title: 'National Malaria Surveillance Study', description: 'Full statistical design and analysis for a multi-site surveillance programme.', category: 'research-services', client: 'Ministry of Health', year: '2025' },
      { id: 'port-stat-2', title: 'Maternal Health Trial Analysis', description: 'Regression and survival modelling for a maternal health intervention trial.', category: 'research-services', client: 'Gates Foundation', year: '2024' },
      { id: 'port-stat-3', title: 'Community Surveillance Dashboard', description: 'Interactive dashboard and data pipeline for community health surveillance.', category: 'digital-products', client: 'University of Ibadan', year: '2023' },
    ],
    rating: { average: 4.9, count: 41 },
  },
  {
    id: 'vendor-dr-smith',
    slug: 'dr-smith',
    name: 'Dr. Smith — Historical Research & Writing',
    type: 'researcher',
    researcherUsername: 'smith',
    tagline: 'Medieval history research, academic editing, and scholarly writing services.',
    description:
      'Professor of Medieval History at the University of Cambridge offering academic editing, proofreading, paleography, and historical research consulting for historians and digital humanities projects.',
    country: 'United Kingdom',
    city: 'Cambridge',
    verified: true,
    badges: ['Verified Vendor', 'Top Rated', 'Academic Verified'],
    responseTime: 'Within 1 day',
    completedOrders: 156,
    yearsActive: '2020 - Present',
    joinedAt: '2020-01-20',
    followers: 2100,
    skills: ['Medieval History', 'Editing', 'Proofreading', 'Paleography', 'Academic Writing', 'Digital Humanities'],
    categories: ['academic-writing', 'research-services', 'consulting'],
    portfolio: [
      { id: 'port-smith-1', title: 'Cambridge Digital Manuscripts', description: 'Editorial support and paleography for the open manuscript catalogue.', category: 'research-services', client: 'University of Cambridge', year: '2024' },
      { id: 'port-smith-2', title: 'Monastic Cartularies Monograph', description: 'Structural editing and scholarly review of a monograph in preparation.', category: 'academic-writing', client: 'Oxford University Press', year: '2025' },
    ],
    rating: { average: 4.8, count: 33 },
  },
  {
    id: 'vendor-oxford-academic-services',
    slug: 'oxford-academic-services',
    name: 'Oxford Academic Services',
    type: 'company',
    tagline: 'End-to-end publication, writing, and funding support for researchers worldwide.',
    description:
      'A full-service academic consultancy: journal selection and submission, manuscript pre-review, cover letters, response to reviewers, thesis editing, conference services, grant writing, and research strategy for universities, laboratories, and individual researchers.',
    country: 'United Kingdom',
    city: 'Oxford',
    verified: true,
    badges: ['Verified Vendor', 'Fast Response', 'Quality Assured'],
    responseTime: 'Within 2 hours',
    completedOrders: 412,
    yearsActive: '2018 - Present',
    joinedAt: '2018-06-01',
    followers: 5400,
    skills: ['Journal Selection', 'Submission Support', 'Manuscript Review', 'Grant Writing', 'Thesis Editing', 'Publication Strategy'],
    categories: ['publication-services', 'academic-writing', 'conference-services', 'funding-services', 'consulting'],
    portfolio: [
      { id: 'port-oas-1', title: 'Global Manuscript Support Programme', description: 'Submission and revision support for over 300 manuscripts since 2018.', category: 'publication-services', client: 'Multiple universities', year: '2026' },
      { id: 'port-oas-2', title: 'Institutional Publication Strategy', description: 'Publication strategy and journal portfolio advisory for a consortium of African universities.', category: 'consulting', client: 'University consortium', year: '2025' },
    ],
    rating: { average: 4.9, count: 87 },
  },
  {
    id: 'vendor-adebayo-energy-consulting',
    slug: 'adebayo-energy-consulting',
    name: 'Adebayo Energy Consulting',
    type: 'consultant',
    researcherUsername: 'adebayo',
    tagline: 'Power systems engineering, MATLAB simulation, and renewable energy consulting.',
    description:
      'Distinguished Professor of Electrical Engineering offering power systems analysis, MATLAB and Simulink modelling, microgrid design, renewable energy consulting, and energy policy advisory for governments, utilities, and startups.',
    country: 'Nigeria',
    city: 'Lagos',
    verified: true,
    badges: ['Verified Vendor', 'Institution Verified', 'Local Expert'],
    responseTime: 'Within 1 day',
    completedOrders: 118,
    yearsActive: '2021 - Present',
    joinedAt: '2021-02-15',
    followers: 1800,
    skills: ['Power Systems', 'MATLAB', 'Simulink', 'Renewable Energy', 'Microgrids', 'GIS'],
    categories: ['consulting', 'research-services', 'education', 'physical-products'],
    portfolio: [
      { id: 'port-adebayo-1', title: 'Smart Grid Integration Study', description: 'Grid integration and stability modelling for West African megacity networks.', category: 'consulting', client: 'National Grid', year: '2025' },
      { id: 'port-adebayo-2', title: 'National Solar Microgrid Programme', description: 'Technical design and modelling for a national solar microgrid programme.', category: 'research-services', client: 'Government', year: '2024' },
    ],
    rating: { average: 4.7, count: 25 },
  },
  {
    id: 'vendor-university-of-ibadan',
    slug: 'university-of-ibadan',
    name: 'University of Ibadan',
    type: 'university',
    tagline: 'Courses, laboratory services, research instruments, and recruitment from Nigeria\u2019s premier university.',
    description:
      'The institutional storefront of the University of Ibadan. Short courses, laboratory testing and instrument booking, research equipment, and student and research positions across the faculties.',
    country: 'Nigeria',
    city: 'Ibadan',
    verified: true,
    badges: ['Verified Vendor', 'Institution Verified', 'High Volume'],
    responseTime: 'Within 1 day',
    completedOrders: 680,
    yearsActive: '2017 - Present',
    joinedAt: '2017-09-01',
    followers: 9800,
    skills: ['Public Health', 'Engineering', 'Laboratory', 'Teaching', 'Research'],
    categories: ['education', 'laboratory-services', 'equipment', 'recruitment', 'digital-products'],
    portfolio: [
      { id: 'port-ui-1', title: 'Faculty Short Course Programme', description: 'Continuing education short courses across medicine, engineering, and science.', category: 'education', client: 'Students & professionals', year: '2026' },
    ],
    rating: { average: 4.6, count: 120 },
  },
  {
    id: 'vendor-scholatia-press',
    slug: 'scholatia-press',
    name: 'Scholatia Press',
    type: 'publisher',
    tagline: 'Open access publishing, book sales, and publication services.',
    description:
      'The open access publisher behind the Scholatia journal and conference portfolio. Books, open access publishing services, and compiled research compendia for researchers and libraries.',
    country: 'United Kingdom',
    city: 'London',
    verified: true,
    badges: ['Verified Vendor', 'Quality Assured', 'Global Reach'],
    responseTime: 'Within 1 day',
    completedOrders: 520,
    yearsActive: '2016 - Present',
    joinedAt: '2016-05-10',
    followers: 6100,
    skills: ['Open Access', 'Publishing', 'Book Sales', 'Journal Services', 'Compendia'],
    categories: ['publication-services', 'physical-products', 'digital-products'],
    portfolio: [
      { id: 'port-sp-1', title: 'Open Access Journal Portfolio', description: 'Publishing for the Scholatia open access journal ecosystem.', category: 'publication-services', client: 'Scholatia ecosystem', year: '2026' },
    ],
    rating: { average: 4.8, count: 66 },
  },
  {
    id: 'vendor-research-gateway-conferences',
    slug: 'research-gateway-conferences',
    name: 'Research Gateway Conferences',
    type: 'conference-organizer',
    tagline: 'Conference registration, poster design, and presentation services.',
    description:
      'The conference organising arm of the Scholatia conference portfolio. Abstract review, poster and slide design, presentation coaching, registration assistance, and visa support for global academic events.',
    country: 'United Kingdom',
    city: 'London',
    verified: true,
    badges: ['Verified Vendor', 'Fast Response', 'Global Reach'],
    responseTime: 'Within 4 hours',
    completedOrders: 310,
    yearsActive: '2018 - Present',
    joinedAt: '2018-03-01',
    followers: 4400,
    skills: ['Conference Organisation', 'Poster Design', 'Presentation Coaching', 'Visa Support', 'Registration'],
    categories: ['conference-services', 'education'],
    portfolio: [
      { id: 'port-rgc-1', title: 'International Research Conference', description: 'Registration, abstract management, and poster production for a flagship annual conference.', category: 'conference-services', client: 'Scholatia', year: '2026' },
    ],
    rating: { average: 4.7, count: 52 },
  },
  {
    id: 'vendor-africa-genomics-lab',
    slug: 'africa-genomics-lab',
    name: 'Africa Genomics Laboratory',
    type: 'laboratory',
    tagline: 'Sequencing, sample analysis, and laboratory testing services.',
    description:
      'A diagnostic and research laboratory offering DNA sequencing, genotyping, microscopy, and water and soil sample analysis for academic and clinical researchers.',
    country: 'South Africa',
    city: 'Cape Town',
    verified: true,
    badges: ['Verified Vendor', 'Top Rated', 'Quality Assured'],
    responseTime: 'Within 6 hours',
    completedOrders: 195,
    yearsActive: '2019 - Present',
    joinedAt: '2019-08-12',
    followers: 2600,
    skills: ['DNA Sequencing', 'Genotyping', 'Microscopy', 'Sample Analysis', 'Diagnostics'],
    categories: ['laboratory-services', 'research-services'],
    portfolio: [
      { id: 'port-agl-1', title: 'Malaria Parasite Genotyping', description: 'Sequencing and genotyping support for a malaria elimination consortium.', category: 'laboratory-services', client: 'Research consortium', year: '2025' },
    ],
    rating: { average: 4.8, count: 39 },
  },
  {
    id: 'vendor-cape-town-bookstore',
    slug: 'cape-town-bookstore',
    name: 'Cape Town Academic Bookstore',
    type: 'bookstore',
    tagline: 'Scholarly books, textbooks, and scientific kits.',
    description:
      'An academic bookstore supplying textbooks, scholarly monographs, statistical manuals, and scientific kits with campus and international delivery.',
    country: 'South Africa',
    city: 'Cape Town',
    verified: true,
    badges: ['Verified Vendor', 'High Volume'],
    responseTime: 'Within 1 day',
    completedOrders: 740,
    yearsActive: '2015 - Present',
    joinedAt: '2015-04-01',
    followers: 3900,
    skills: ['Books', 'Textbooks', 'Scientific Kits', 'Distribution'],
    categories: ['physical-products', 'digital-products'],
    portfolio: [
      { id: 'port-ctb-1', title: 'University Textbook Supply', description: 'Textbook supply for a consortium of five African universities.', category: 'physical-products', client: 'University consortium', year: '2026' },
    ],
    rating: { average: 4.5, count: 140 },
  },
  {
    id: 'vendor-openlab-instruments',
    slug: 'openlab-instruments',
    name: 'OpenLab Instruments',
    type: 'equipment-manufacturer',
    tagline: 'Laboratory equipment and scientific instruments, with rental and booking.',
    description:
      'A manufacturer and rental provider of laboratory equipment and scientific instruments: spectrophotometers, centrifuges, and precision measurement devices for research laboratories.',
    country: 'Germany',
    city: 'Berlin',
    verified: true,
    badges: ['Verified Vendor', 'Global Reach', 'Quality Assured'],
    responseTime: 'Within 1 day',
    completedOrders: 265,
    yearsActive: '2017 - Present',
    joinedAt: '2017-11-20',
    followers: 2200,
    skills: ['Spectrophotometry', 'Centrifuges', 'Laboratory Equipment', 'Rental', 'Maintenance'],
    categories: ['equipment', 'laboratory-services'],
    portfolio: [
      { id: 'port-oi-1', title: 'University Lab Instrument Programme', description: 'Supply and maintenance of laboratory instruments for a national university network.', category: 'equipment', client: 'University network', year: '2025' },
    ],
    rating: { average: 4.6, count: 47 },
  },
  {
    id: 'vendor-academia-software',
    slug: 'academia-software',
    name: 'Academia Software',
    type: 'software-vendor',
    tagline: 'Research software, AI tools, and academic platform licences.',
    description:
      'A research software vendor selling academic licences for statistical, simulation, and AI tooling — MATLAB, Python toolkits, reference managers, and research dashboards — with institutional volume pricing.',
    country: 'United States',
    city: 'Boston',
    verified: true,
    badges: ['Verified Vendor', 'Fast Response', 'Global Reach'],
    responseTime: 'Within 3 hours',
    completedOrders: 388,
    yearsActive: '2016 - Present',
    joinedAt: '2016-02-01',
    followers: 5100,
    skills: ['Research Software', 'MATLAB', 'Python', 'AI Tools', 'Licences', 'Dashboards'],
    categories: ['digital-products', 'equipment'],
    portfolio: [
      { id: 'port-as-1', title: 'Campus-wide Licences', description: 'Academic licensing agreements serving 40+ institutions.', category: 'digital-products', client: '40+ institutions', year: '2026' },
    ],
    rating: { average: 4.7, count: 61 },
  },
  {
    id: 'vendor-grantcraft-consulting',
    slug: 'grantcraft-consulting',
    name: 'GrantCraft Consulting',
    type: 'consultant',
    tagline: 'Grant writing, proposal review, and funding strategy.',
    description:
      'A funding consultancy specialising in grant writing, proposal review, budget preparation, and funding opportunity search for early-career researchers, labs, and research offices.',
    country: 'Kenya',
    city: 'Nairobi',
    verified: true,
    badges: ['Verified Vendor', 'Top Rated'],
    responseTime: 'Within 1 day',
    completedOrders: 178,
    yearsActive: '2020 - Present',
    joinedAt: '2020-07-01',
    followers: 2900,
    skills: ['Grant Writing', 'Proposal Review', 'Budget Preparation', 'Funding Search', 'Grant Consulting'],
    categories: ['funding-services', 'consulting'],
    portfolio: [
      { id: 'port-gc-1', title: 'Africa Research Fund Applications', description: 'Proposal development for national and international research funds across Africa.', category: 'funding-services', client: 'Researchers & labs', year: '2026' },
    ],
    rating: { average: 4.9, count: 44 },
  },
  {
    id: 'vendor-research-talent-hub',
    slug: 'research-talent-hub',
    name: 'Research Talent Hub',
    type: 'company',
    tagline: 'Research assistant, PhD, postdoc, and internship recruitment.',
    description:
      'A research recruitment agency placing research assistants, PhD and postdoctoral researchers, and graduate interns with laboratories, universities, and research programmes.',
    country: 'Netherlands',
    city: 'Amsterdam',
    verified: true,
    badges: ['Verified Vendor', 'Fast Response', 'Global Reach'],
    responseTime: 'Within 4 hours',
    completedOrders: 214,
    yearsActive: '2019 - Present',
    joinedAt: '2019-05-15',
    followers: 3300,
    skills: ['Recruitment', 'PhD Positions', 'Postdoc Positions', 'Internships', 'Research Assistants'],
    categories: ['recruitment', 'consulting'],
    portfolio: [
      { id: 'port-rth-1', title: 'Pan-European Lab Placements', description: 'Recruitment for a network of research laboratories across Europe.', category: 'recruitment', client: 'Lab network', year: '2025' },
    ],
    rating: { average: 4.6, count: 38 },
  },
  {
    id: 'vendor-african-dev-network',
    slug: 'african-dev-network',
    name: 'African Development Research Network',
    type: 'ngo',
    tagline: 'Research consulting and capacity building for governments and NGOs.',
    description:
      'A non-profit research network providing monitoring and evaluation, policy research, capacity building, and research team assembly for governments, NGOs, and development partners across Africa.',
    country: 'Ghana',
    city: 'Accra',
    verified: true,
    badges: ['Verified Vendor', 'Institution Verified', 'Local Expert'],
    responseTime: 'Within 1 day',
    completedOrders: 142,
    yearsActive: '2018 - Present',
    joinedAt: '2018-01-01',
    followers: 2400,
    skills: ['Monitoring & Evaluation', 'Policy Research', 'Capacity Building', 'Research Teams', 'NGO Consulting'],
    categories: ['consulting', 'funding-services', 'education'],
    portfolio: [
      { id: 'port-adn-1', title: 'National M&E Framework', description: 'Monitoring and evaluation framework for a national health programme.', category: 'consulting', client: 'Government', year: '2025' },
    ],
    rating: { average: 4.7, count: 29 },
  },
  {
    id: 'vendor-stem-tutors',
    slug: 'stem-tutors',
    name: 'STEM Tutors Collective',
    type: 'freelancer',
    tagline: 'Online courses, tutoring, and exam preparation.',
    description:
      'A collective of graduate tutors delivering statistics, mathematics, and science tutoring, workshop series, and exam preparation for undergraduate and postgraduate students.',
    country: 'United Kingdom',
    city: 'Manchester',
    verified: true,
    badges: ['Verified Vendor', 'Fast Response'],
    responseTime: 'Within 2 hours',
    completedOrders: 96,
    yearsActive: '2021 - Present',
    joinedAt: '2021-09-01',
    followers: 1500,
    skills: ['Statistics Tutoring', 'Mathematics', 'Exam Preparation', 'Workshops', 'STEM'],
    categories: ['education', 'consulting'],
    portfolio: [
      { id: 'port-st-1', title: 'Statistics Masterclass Series', description: 'Exam-preparation masterclasses for postgraduate statistics modules.', category: 'education', client: 'University students', year: '2025' },
    ],
    rating: { average: 4.8, count: 22 },
  },
  {
    id: 'vendor-kovacs-data-science',
    slug: 'kovacs-data-science',
    name: 'Kov\u00e1cs Data Science',
    type: 'freelancer',
    researcherUsername: 'kovacs',
    tagline: 'Python, machine learning, and statistical analysis for research teams.',
    description:
      'A data science consultancy offering Python and machine learning analysis, R and Python pipelines, research software engineering, and online courses for research groups.',
    country: 'Hungary',
    city: 'Budapest',
    verified: true,
    badges: ['Verified Vendor', 'Top Rated', 'Academic Verified'],
    responseTime: 'Within 6 hours',
    completedOrders: 131,
    yearsActive: '2020 - Present',
    joinedAt: '2020-10-01',
    followers: 1900,
    skills: ['Python', 'Machine Learning', 'R', 'Statistical Analysis', 'Data Pipelines', 'Research Software'],
    categories: ['research-services', 'digital-products', 'education'],
    portfolio: [
      { id: 'port-kds-1', title: 'NLP Corpus Pipeline', description: 'Machine learning pipelines for multilingual NLP corpora.', category: 'research-services', client: 'Linguistics lab', year: '2025' },
    ],
    rating: { average: 4.9, count: 31 },
  },
  {
    id: 'vendor-ghana-research-society',
    slug: 'ghana-research-society',
    name: 'Ghana Research Society',
    type: 'professional-society',
    tagline: 'Professional society services: memberships, workshops, and accreditation.',
    description:
      'The professional society for Ghanaian researchers. Workshop series, abstract review, conference services, and professional accreditation for members.',
    country: 'Ghana',
    city: 'Accra',
    verified: true,
    badges: ['Verified Vendor', 'Institution Verified'],
    responseTime: 'Within 1 day',
    completedOrders: 74,
    yearsActive: '2022 - Present',
    joinedAt: '2022-02-01',
    followers: 1200,
    skills: ['Professional Society', 'Workshops', 'Abstract Review', 'Accreditation', 'Membership'],
    categories: ['education', 'conference-services'],
    portfolio: [
      { id: 'port-grs-1', title: 'Annual Research Symposium', description: 'Abstract review and workshop delivery for the annual research symposium.', category: 'conference-services', client: 'Members', year: '2025' },
    ],
    rating: { average: 4.5, count: 17 },
  },
  {
    id: 'vendor-youth-science-startup',
    slug: 'youth-science-startup',
    name: 'Youth Science Startup',
    type: 'startup',
    tagline: 'Science kits, educational materials, and innovation services.',
    description:
      'An ed-tech startup producing science kits, educational materials, and junior research programmes for schools and young researchers across the continent.',
    country: 'Nigeria',
    city: 'Lagos',
    verified: true,
    badges: ['Verified Vendor', 'New Vendor'],
    responseTime: 'Within 1 day',
    completedOrders: 58,
    yearsActive: '2023 - Present',
    joinedAt: '2023-04-01',
    followers: 900,
    skills: ['Science Kits', 'Educational Materials', 'Innovation', 'STEM Education'],
    categories: ['physical-products', 'equipment', 'education'],
    portfolio: [
      { id: 'port-yss-1', title: 'School STEM Programme', description: 'Hands-on science kits for a national school STEM programme.', category: 'physical-products', client: 'Schools', year: '2025' },
    ],
    rating: { average: 4.7, count: 14 },
  },
  {
    id: 'vendor-ministry-innovation',
    slug: 'ministry-innovation',
    name: 'Ministry of Innovation & Research',
    type: 'government-agency',
    tagline: 'Government research funding, consulting, and policy services.',
    description:
      'The government agency offering funding opportunity search, research policy consulting, and public research services for universities and national research institutions.',
    country: 'Kenya',
    city: 'Nairobi',
    verified: true,
    badges: ['Verified Vendor', 'Institution Verified'],
    responseTime: 'Within 3 days',
    completedOrders: 42,
    yearsActive: '2021 - Present',
    joinedAt: '2021-01-01',
    followers: 1600,
    skills: ['Research Funding', 'Policy Consulting', 'Public Research', 'Grants'],
    categories: ['funding-services', 'consulting'],
    portfolio: [
      { id: 'port-mi-1', title: 'National Research Agenda', description: 'Policy and funding advisory for the national research agenda.', category: 'consulting', client: 'Government', year: '2024' },
    ],
    rating: { average: 4.4, count: 9 },
  },
  {
    id: 'vendor-university-library',
    slug: 'university-library',
    name: 'University Research Library',
    type: 'library',
    tagline: 'Librarian services, literature reviews, and research support.',
    description:
      'The research library offering systematic literature search, librarian consultations, citation support, and research methodology guidance for faculty and postgraduate students.',
    country: 'Canada',
    city: 'Toronto',
    verified: true,
    badges: ['Verified Vendor', 'Quality Assured'],
    responseTime: 'Within 1 day',
    completedOrders: 88,
    yearsActive: '2020 - Present',
    joinedAt: '2020-08-01',
    followers: 1400,
    skills: ['Literature Review', 'Systematic Search', 'Citation Support', 'Librarian Services', 'Methodology'],
    categories: ['research-services', 'academic-writing', 'education'],
    portfolio: [
      { id: 'port-url-1', title: 'Systematic Review Support', description: 'Search strategy and screening support for systematic reviews.', category: 'research-services', client: 'Faculty & students', year: '2025' },
    ],
    rating: { average: 4.8, count: 19 },
  },
  {
    id: 'vendor-graduate-student-services',
    slug: 'graduate-student-services',
    name: 'Graduate Student Services',
    type: 'student',
    tagline: 'Affordable editing, formatting, and survey design by trained postgraduate students.',
    description:
      'A collective of vetted postgraduate students offering affordable editing, proofreading, journal formatting, translation, and survey questionnaire design to peers and early-career researchers.',
    country: 'South Africa',
    city: 'Johannesburg',
    verified: true,
    badges: ['Verified Vendor', 'Fast Response', 'Academic Verified'],
    responseTime: 'Within 3 hours',
    completedOrders: 173,
    yearsActive: '2020 - Present',
    joinedAt: '2020-03-01',
    followers: 2100,
    skills: ['Editing', 'Proofreading', 'Journal Formatting', 'Translation', 'Survey Design'],
    categories: ['academic-writing', 'research-services', 'digital-products'],
    portfolio: [
      { id: 'port-gss-1', title: 'Postgraduate Editing Pool', description: 'Peer editing and formatting services for postgraduate dissertations.', category: 'academic-writing', client: 'Postgraduate students', year: '2026' },
    ],
    rating: { average: 4.6, count: 34 },
  },
];

export const VENDORS: MarketplaceVendor[] = VENDOR_SEEDS.map((seed, index) => makeVendor(seed, index));

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

type ListingSeed = {
  id: string;
  vendorId: string;
  title: string;
  summary: string;
  description?: string;
  category: MarketplaceCategory;
  subcategory: string;
  type: MarketplaceListingType;
  price: MarketplacePrice;
  discount?: MarketplaceDiscount;
  keywords: string[];
  skills?: string[];
  researchAreas?: string[];
  stageIds?: ResearchLifecycleStageId[];
  rating: { average: number; count: number };
  featured?: boolean;
  sponsored?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  favorites?: number;
  orders?: number;
  inventory?: Partial<MarketplaceAvailability>;
  sourceId?: string;
  sourceEntity?: DiscoveryEntityType;
  targetAudience?: string[];
  careerStages?: CareerStage[];
  tags?: string[];
  dateAdded?: string;
  lastUpdated?: string;
};

const LISTING_SEEDS: ListingSeed[] = [
  {
    id: 'listing-statistical-analysis',
    vendorId: 'vendor-ibadan-statistics-lab',
    title: 'Statistical Analysis & Biostatistics (Stata, R)',
    summary: 'Complete statistical analysis for health and social research: study design, cleaning, modelling, and reporting.',
    category: 'research-services',
    subcategory: 'statistical-analysis',
    type: 'service',
    price: { amount: 250, currency: 'GBP', interval: 'per-project' },
    discount: { percent: 15, endsAt: '2026-08-15' },
    keywords: ['statistical analysis', 'biostatistics', 'stata', 'r', 'regression', 'epidemiology'],
    skills: ['Stata', 'R', 'Regression', 'Survival Analysis'],
    researchAreas: ['Public Health', 'Epidemiology', 'Maternal Health'],
    stageIds: ['dataset', 'analysis'],
    rating: { average: 4.9, count: 18 },
    featured: true,
    sponsored: true,
    bestSeller: true,
    onSale: true,
    inventory: { status: 'available', quantity: 12, deliveryDays: 7 },
    sourceId: WORKSPACE_PROJECTS[0].id,
    sourceEntity: 'project',
    targetAudience: ['Researchers', 'Postgraduate students', 'Lecturers'],
    careerStages: ['masters', 'doctoral', 'postdoctoral', 'early-career', 'mid-career'],
    tags: ['stata', 'r', 'biostatistics'],
  },
  {
    id: 'listing-python-ml-analysis',
    vendorId: 'vendor-kovacs-data-science',
    title: 'Python & Machine Learning Analysis',
    summary: 'Machine learning pipelines, model building, and Python analysis for research datasets of any size.',
    category: 'research-services',
    subcategory: 'machine-learning',
    type: 'service',
    price: { amount: 300, currency: 'GBP', interval: 'per-project' },
    keywords: ['python', 'machine learning', 'nlp', 'data science', 'modelling'],
    skills: ['Python', 'Machine Learning', 'NLP', 'Data Pipelines'],
    stageIds: ['dataset', 'analysis'],
    rating: { average: 4.9, count: 11 },
    featured: true,
    inventory: { status: 'available', quantity: 10, deliveryDays: 10 },
    sourceId: MANUSCRIPTS[0].id,
    sourceEntity: 'manuscript',
    targetAudience: ['Research teams', 'Labs', 'Postgraduate students'],
    tags: ['python', 'machine learning'],
  },
  {
    id: 'listing-qualitative-analysis',
    vendorId: 'vendor-ibadan-statistics-lab',
    title: 'NVivo & ATLAS.ti Qualitative Coding',
    summary: 'Qualitative data management, thematic coding, and analysis in NVivo and ATLAS.ti for interview and focus group data.',
    category: 'research-services',
    subcategory: 'nvivo',
    type: 'service',
    price: { amount: 180, currency: 'GBP', interval: 'per-project' },
    keywords: ['nvivo', 'atlas.ti', 'qualitative', 'thematic analysis', 'interviews'],
    skills: ['NVivo', 'ATLAS.ti', 'Thematic Analysis'],
    researchAreas: ['Social Sciences', 'Public Health'],
    stageIds: ['dataset', 'analysis'],
    rating: { average: 4.8, count: 9 },
    inventory: { status: 'available', quantity: 8, deliveryDays: 6 },
    targetAudience: ['Researchers', 'Postgraduate students'],
    tags: ['nvivo', 'atlas.ti'],
  },
  {
    id: 'listing-gis-spatial-analysis',
    vendorId: 'vendor-adebayo-energy-consulting',
    title: 'GIS & Spatial Analysis for Research',
    summary: 'GIS mapping, spatial statistics, and geospatial analysis for energy, environment, and health research.',
    category: 'research-services',
    subcategory: 'gis',
    type: 'service',
    price: { amount: 350, currency: 'GBP', interval: 'per-project' },
    keywords: ['gis', 'spatial analysis', 'mapping', 'geospatial'],
    skills: ['GIS', 'Spatial Analysis', 'Mapping'],
    stageIds: ['analysis'],
    rating: { average: 4.7, count: 7 },
    sponsored: true,
    inventory: { status: 'available', quantity: 6, deliveryDays: 12 },
    targetAudience: ['Researchers', 'NGOs', 'Government agencies'],
    tags: ['gis', 'spatial'],
  },
  {
    id: 'listing-systematic-review',
    vendorId: 'vendor-ibadan-statistics-lab',
    title: 'Systematic Review & Meta-Analysis',
    summary: 'Full systematic review and meta-analysis support: protocol, search, screening, extraction, and synthesis.',
    category: 'research-services',
    subcategory: 'systematic-review',
    type: 'service',
    price: { amount: 400, currency: 'GBP', interval: 'per-project' },
    keywords: ['systematic review', 'meta-analysis', 'protocol', 'screening'],
    skills: ['Systematic Review', 'Meta-Analysis', 'PRISMA'],
    researchAreas: ['Public Health', 'Medicine'],
    stageIds: ['manuscript', 'analysis'],
    rating: { average: 4.9, count: 6 },
    bestSeller: true,
    inventory: { status: 'available', quantity: 5, deliveryDays: 21 },
    targetAudience: ['Researchers', 'Clinicians'],
    tags: ['systematic review', 'meta-analysis'],
  },
  {
    id: 'listing-academic-editing',
    vendorId: 'vendor-dr-smith',
    title: 'Academic Editing & Proofreading',
    summary: 'Substantive and line editing with proofreading for journal articles, theses, and monographs.',
    category: 'academic-writing',
    subcategory: 'editing',
    type: 'service',
    price: { amount: 0.04, currency: 'GBP', interval: 'per-word' },
    keywords: ['editing', 'proofreading', 'academic writing', 'language polishing'],
    skills: ['Editing', 'Proofreading', 'Academic Writing'],
    stageIds: ['manuscript', 'submission'],
    rating: { average: 4.8, count: 15 },
    featured: true,
    bestSeller: true,
    inventory: { status: 'available', deliveryDays: 5 },
    sourceId: MANUSCRIPTS[1].id,
    sourceEntity: 'manuscript',
    targetAudience: ['Researchers', 'Postgraduate students', 'Authors'],
    careerStages: ['doctoral', 'postdoctoral', 'early-career', 'mid-career', 'senior'],
    tags: ['editing', 'proofreading'],
  },
  {
    id: 'listing-journal-formatting',
    vendorId: 'vendor-oxford-academic-services',
    title: 'Journal Formatting (APA, MLA, Chicago, Vancouver)',
    summary: 'Reference and manuscript formatting to any target journal style guide, including APA, MLA, Chicago, and Vancouver.',
    category: 'academic-writing',
    subcategory: 'journal-formatting',
    type: 'service',
    price: { amount: 60, currency: 'GBP', interval: 'per-project' },
    keywords: ['formatting', 'apa', 'mla', 'chicago', 'vancouver', 'references'],
    skills: ['APA', 'MLA', 'Chicago', 'Vancouver', 'References'],
    stageIds: ['submission'],
    rating: { average: 4.7, count: 21 },
    inventory: { status: 'available', deliveryDays: 3 },
    targetAudience: ['Authors', 'Postgraduate students'],
    careerStages: ['doctoral', 'postdoctoral', 'early-career'],
    tags: ['formatting', 'apa'],
  },
  {
    id: 'listing-academic-translation',
    vendorId: 'vendor-graduate-student-services',
    title: 'Academic Translation (English, French, Yoruba)',
    summary: 'Translation of abstracts, manuscripts, and research materials between English, French, and Yoruba.',
    category: 'academic-writing',
    subcategory: 'translation',
    type: 'service',
    price: { amount: 0.08, currency: 'GBP', interval: 'per-word' },
    keywords: ['translation', 'french', 'yoruba', 'english', 'language'],
    skills: ['Translation', 'French', 'Yoruba', 'English'],
    stageIds: ['manuscript'],
    rating: { average: 4.6, count: 10 },
    inventory: { status: 'available', deliveryDays: 4 },
    targetAudience: ['Authors', 'Researchers'],
    tags: ['translation'],
  },
  {
    id: 'listing-thesis-editing',
    vendorId: 'vendor-oxford-academic-services',
    title: 'Thesis & Dissertation Editing',
    summary: 'Comprehensive thesis editing covering structure, clarity, and language, with a full editor report.',
    category: 'academic-writing',
    subcategory: 'thesis-writing',
    type: 'service',
    price: { amount: 300, currency: 'GBP', interval: 'per-project' },
    keywords: ['thesis', 'dissertation', 'editing', 'structure'],
    skills: ['Thesis Editing', 'Structure', 'Language'],
    stageIds: ['manuscript'],
    rating: { average: 4.8, count: 13 },
    sponsored: true,
    inventory: { status: 'available', quantity: 6, deliveryDays: 14 },
    targetAudience: ['Doctoral students', 'Masters students'],
    careerStages: ['masters', 'doctoral'],
    tags: ['thesis', 'dissertation'],
  },
  {
    id: 'listing-journal-selection',
    vendorId: 'vendor-oxford-academic-services',
    title: 'Journal Selection & Submission Support',
    summary: 'Target-journal shortlisting, author guidelines, and end-to-end submission support.',
    category: 'publication-services',
    subcategory: 'journal-selection',
    type: 'service',
    price: { amount: 120, currency: 'GBP', interval: 'per-project' },
    keywords: ['journal selection', 'submission', 'author guidelines', 'scopus', 'wos'],
    skills: ['Journal Selection', 'Submission Support', 'Publishing'],
    stageIds: ['submission'],
    rating: { average: 4.9, count: 24 },
    featured: true,
    inventory: { status: 'available', deliveryDays: 5 },
    sourceId: JOURNALS[0].journalId,
    sourceEntity: 'journal',
    targetAudience: ['Researchers', 'Authors'],
    tags: ['journal selection', 'submission'],
  },
  {
    id: 'listing-manuscript-pre-review',
    vendorId: 'vendor-scholatia-press',
    title: 'Manuscript Pre-Review & Cover Letter',
    summary: 'Independent manuscript pre-review with a detailed report and a ready-to-send cover letter.',
    category: 'publication-services',
    subcategory: 'manuscript-review',
    type: 'service',
    price: { amount: 150, currency: 'GBP', interval: 'per-project' },
    keywords: ['manuscript review', 'cover letter', 'pre-review', 'feedback'],
    skills: ['Manuscript Review', 'Cover Letter', 'Editorial Feedback'],
    stageIds: ['submission', 'peer-review'],
    rating: { average: 4.8, count: 19 },
    bestSeller: true,
    inventory: { status: 'available', deliveryDays: 7 },
    targetAudience: ['Researchers', 'Authors'],
    tags: ['manuscript review'],
  },
  {
    id: 'listing-response-to-reviewers',
    vendorId: 'vendor-oxford-academic-services',
    title: 'Response to Reviewers',
    summary: 'Structured point-by-point response drafting to maximise acceptance on revision rounds.',
    category: 'publication-services',
    subcategory: 'response-to-reviewers',
    type: 'service',
    price: { amount: 140, currency: 'GBP', interval: 'per-project' },
    keywords: ['response to reviewers', 'revision', 'rebuttal', 'peer review'],
    skills: ['Response to Reviewers', 'Revision', 'Rebutal Strategy'],
    stageIds: ['peer-review', 'manuscript'],
    rating: { average: 4.9, count: 16 },
    inventory: { status: 'available', deliveryDays: 5 },
    targetAudience: ['Researchers', 'Authors'],
    tags: ['response to reviewers'],
  },
  {
    id: 'listing-poster-design',
    vendorId: 'vendor-research-gateway-conferences',
    title: 'Conference Poster & Slide Design',
    summary: 'Professionally designed research posters and presentation slides ready for any conference template.',
    category: 'conference-services',
    subcategory: 'poster-design',
    type: 'service',
    price: { amount: 75, currency: 'GBP', interval: 'per-project' },
    keywords: ['poster', 'slide design', 'conference', 'presentation'],
    skills: ['Poster Design', 'Slide Design', 'Presentation'],
    stageIds: ['conference'],
    rating: { average: 4.7, count: 20 },
    inventory: { status: 'available', deliveryDays: 4 },
    targetAudience: ['Researchers', 'Students'],
    tags: ['poster', 'conference'],
  },
  {
    id: 'listing-conference-visa-support',
    vendorId: 'vendor-research-gateway-conferences',
    title: 'Conference Registration & Visa Support',
    summary: 'Registration handling, invitation letters, and visa application support for international conferences.',
    category: 'conference-services',
    subcategory: 'visa-support',
    type: 'service',
    price: { amount: 90, currency: 'GBP', interval: 'per-project' },
    keywords: ['visa', 'registration', 'invitation letter', 'travel'],
    skills: ['Visa Support', 'Registration', 'Travel Planning'],
    stageIds: ['conference'],
    rating: { average: 4.6, count: 12 },
    inventory: {
      status: 'available',
      deliveryDays: 2,
      openSlots: [
        { id: 'slot-visa-1', startsAt: '2026-08-05T09:00:00Z', endsAt: '2026-08-05T10:00:00Z', booked: false },
        { id: 'slot-visa-2', startsAt: '2026-08-07T09:00:00Z', endsAt: '2026-08-07T10:00:00Z', booked: true },
        { id: 'slot-visa-3', startsAt: '2026-08-09T09:00:00Z', endsAt: '2026-08-09T10:00:00Z', booked: false },
      ],
    },
    sourceId: CONFERENCES[0].conferenceId,
    sourceEntity: 'conference',
    targetAudience: ['Researchers', 'Students'],
    tags: ['visa', 'registration'],
  },
  {
    id: 'listing-abstract-review',
    vendorId: 'vendor-ghana-research-society',
    title: 'Abstract Review & Feedback',
    summary: 'Structured abstract review with scoring and actionable feedback before submission.',
    category: 'conference-services',
    subcategory: 'abstract-review',
    type: 'service',
    price: { amount: 45, currency: 'GBP', interval: 'per-project' },
    keywords: ['abstract review', 'feedback', 'conference'],
    skills: ['Abstract Review', 'Feedback'],
    stageIds: ['conference'],
    rating: { average: 4.5, count: 8 },
    inventory: { status: 'available', deliveryDays: 3 },
    targetAudience: ['Researchers', 'Students'],
    tags: ['abstract review'],
  },
  {
    id: 'listing-epidemiology-course',
    vendorId: 'vendor-ibadan-statistics-lab',
    title: 'Advanced Epidemiology Short Course',
    summary: 'A five-day advanced epidemiology short course covering study design, bias, and surveillance.',
    category: 'education',
    subcategory: 'online-courses',
    type: 'course',
    price: { amount: 180, currency: 'GBP', interval: 'per-student' },
    keywords: ['epidemiology', 'short course', 'study design', 'surveillance'],
    skills: ['Epidemiology', 'Study Design', 'Teaching'],
    researchAreas: ['Public Health', 'Epidemiology'],
    stageIds: ['analysis', 'funding'],
    rating: { average: 4.8, count: 17 },
    featured: true,
    onSale: true,
    discount: { percent: 20, endsAt: '2026-08-31' },
    inventory: { status: 'available', quantity: 30, deliveryDays: 0, recurring: true },
    targetAudience: ['Researchers', 'Health professionals', 'Students'],
    careerStages: ['masters', 'doctoral', 'early-career', 'mid-career'],
    tags: ['epidemiology', 'course'],
  },
  {
    id: 'listing-spss-stata-workshop',
    vendorId: 'vendor-university-of-ibadan',
    title: 'SPSS & Stata Research Methods Workshop',
    summary: 'Hands-on workshop covering SPSS and Stata for data management, analysis, and reporting.',
    category: 'education',
    subcategory: 'workshops',
    type: 'course',
    price: { amount: 120, currency: 'GBP', interval: 'per-student' },
    keywords: ['spss', 'stata', 'workshop', 'research methods'],
    skills: ['SPSS', 'Stata', 'Research Methods'],
    stageIds: ['analysis'],
    rating: { average: 4.6, count: 28 },
    sponsored: true,
    inventory: { status: 'available', quantity: 40, deliveryDays: 0, recurring: true },
    targetAudience: ['Students', 'Researchers'],
    careerStages: ['postgraduate', 'masters', 'doctoral'],
    tags: ['spss', 'stata'],
  },
  {
    id: 'listing-python-bootcamp',
    vendorId: 'vendor-kovacs-data-science',
    title: 'Python for Research Bootcamp',
    summary: 'A practical bootcamp taking researchers from Python basics to analysis, visualisation, and automation.',
    category: 'education',
    subcategory: 'training-programmes',
    type: 'course',
    price: { amount: 250, currency: 'GBP', interval: 'per-student' },
    keywords: ['python', 'bootcamp', 'data science', 'automation'],
    skills: ['Python', 'Pandas', 'Visualisation', 'Automation'],
    stageIds: ['analysis', 'dataset'],
    rating: { average: 4.9, count: 14 },
    bestSeller: true,
    inventory: { status: 'available', quantity: 25, deliveryDays: 0, recurring: true },
    targetAudience: ['Researchers', 'Students'],
    careerStages: ['postgraduate', 'doctoral', 'early-career'],
    tags: ['python', 'bootcamp'],
  },
  {
    id: 'listing-power-systems-course',
    vendorId: 'vendor-adebayo-energy-consulting',
    title: 'Power Systems Modelling Course',
    summary: 'MATLAB and Simulink modelling of power systems, from load flow to transient stability.',
    category: 'education',
    subcategory: 'certifications',
    type: 'course',
    price: { amount: 220, currency: 'GBP', interval: 'per-student' },
    keywords: ['matlab', 'simulink', 'power systems', 'modelling'],
    skills: ['MATLAB', 'Simulink', 'Power Systems'],
    stageIds: ['analysis'],
    rating: { average: 4.7, count: 11 },
    inventory: { status: 'available', quantity: 15, deliveryDays: 0, recurring: true },
    targetAudience: ['Engineering students', 'Researchers'],
    tags: ['matlab', 'power systems'],
  },
  {
    id: 'listing-statistics-tutoring',
    vendorId: 'vendor-stem-tutors',
    title: '1:1 Statistics Tutoring',
    summary: 'Personal statistics tutoring sessions covering any topic from descriptive stats to advanced regression.',
    category: 'education',
    subcategory: 'tutoring',
    type: 'service',
    price: { amount: 30, currency: 'GBP', interval: 'per-hour' },
    keywords: ['tutoring', 'statistics', 'regression', 'exams'],
    skills: ['Statistics', 'Tutoring', 'Exam Preparation'],
    stageIds: ['analysis'],
    rating: { average: 4.8, count: 22 },
    inventory: {
      status: 'available',
      deliveryDays: 1,
      openSlots: [
        { id: 'slot-tutor-1', startsAt: '2026-08-04T15:00:00Z', endsAt: '2026-08-04T16:00:00Z', booked: false, price: { amount: 30, currency: 'GBP', interval: 'per-hour' } },
        { id: 'slot-tutor-2', startsAt: '2026-08-06T15:00:00Z', endsAt: '2026-08-06T16:00:00Z', booked: true, price: { amount: 30, currency: 'GBP', interval: 'per-hour' } },
        { id: 'slot-tutor-3', startsAt: '2026-08-08T15:00:00Z', endsAt: '2026-08-08T16:00:00Z', booked: false, price: { amount: 30, currency: 'GBP', interval: 'per-hour' } },
      ],
    },
    targetAudience: ['Students', 'Postgraduate students'],
    careerStages: ['undergraduate', 'postgraduate', 'masters', 'doctoral'],
    tags: ['tutoring', 'statistics'],
  },
  {
    id: 'listing-dna-sequencing',
    vendorId: 'vendor-africa-genomics-lab',
    title: 'DNA Sequencing & Genotyping',
    summary: 'Sanger and next-generation sequencing with genotyping analysis for academic and clinical samples.',
    category: 'laboratory-services',
    subcategory: 'sequencing',
    type: 'service',
    price: { amount: 90, currency: 'GBP', interval: 'per-project' },
    keywords: ['sequencing', 'genotyping', 'dna', 'ngs'],
    skills: ['DNA Sequencing', 'Genotyping', 'NGS'],
    researchAreas: ['Genomics', 'Molecular Biology'],
    stageIds: ['dataset', 'analysis'],
    rating: { average: 4.8, count: 16 },
    featured: true,
    sponsored: true,
    inventory: { status: 'available', quantity: 200, deliveryDays: 10 },
    targetAudience: ['Labs', 'Researchers', 'Clinicians'],
    tags: ['sequencing', 'genomics'],
  },
  {
    id: 'listing-microscopy-imaging',
    vendorId: 'vendor-university-of-ibadan',
    title: 'Microscopy & Imaging Services',
    summary: 'Access to advanced microscopy and imaging with trained operators and image analysis support.',
    category: 'laboratory-services',
    subcategory: 'microscopy',
    type: 'service',
    price: { amount: 40, currency: 'GBP', interval: 'per-session' },
    keywords: ['microscopy', 'imaging', 'fluorescence', 'sample'],
    skills: ['Microscopy', 'Imaging', 'Image Analysis'],
    researchAreas: ['Cell Biology', 'Pathology'],
    stageIds: ['dataset'],
    rating: { average: 4.5, count: 13 },
    inventory: { status: 'available', quantity: 60, deliveryDays: 3 },
    targetAudience: ['Researchers', 'Students'],
    tags: ['microscopy', 'imaging'],
  },
  {
    id: 'listing-sample-analysis',
    vendorId: 'vendor-africa-genomics-lab',
    title: 'Water & Soil Sample Analysis',
    summary: 'Environmental testing of water and soil samples for contamination, nutrients, and research datasets.',
    category: 'laboratory-services',
    subcategory: 'sample-analysis',
    type: 'service',
    price: { amount: 55, currency: 'GBP', interval: 'per-project' },
    keywords: ['water', 'soil', 'sample analysis', 'environmental'],
    skills: ['Sample Analysis', 'Environmental Testing'],
    researchAreas: ['Environmental Science', 'Agriculture'],
    stageIds: ['dataset'],
    rating: { average: 4.7, count: 9 },
    inventory: { status: 'available', quantity: 150, deliveryDays: 7 },
    targetAudience: ['Researchers', 'NGOs', 'Farmers'],
    tags: ['water', 'soil'],
  },
  {
    id: 'listing-spectrophotometer-rental',
    vendorId: 'vendor-openlab-instruments',
    title: 'Portable Spectrophotometer Rental',
    summary: 'Monthly rental of calibrated portable spectrophotometers with support and calibration certificates.',
    category: 'equipment',
    subcategory: 'lab-equipment',
    type: 'equipment',
    price: { amount: 220, currency: 'GBP', interval: 'monthly' },
    keywords: ['spectrophotometer', 'rental', 'equipment', 'calibration'],
    skills: ['Spectrophotometry', 'Rental'],
    researchAreas: ['Chemistry', 'Biology', 'Environmental Science'],
    stageIds: ['dataset', 'analysis'],
    rating: { average: 4.6, count: 10 },
    inventory: { status: 'available', quantity: 12, deliveryDays: 5 },
    sourceId: WORKSPACE_PROJECTS[2].id,
    sourceEntity: 'project',
    targetAudience: ['Labs', 'Researchers'],
    tags: ['spectrophotometer', 'rental'],
  },
  {
    id: 'listing-centrifuge-hire',
    vendorId: 'vendor-openlab-instruments',
    title: 'Centrifuge & Lab Instrument Hire',
    summary: 'Short- and long-term hire of centrifuges and supporting laboratory instruments with maintenance.',
    category: 'equipment',
    subcategory: 'lab-equipment',
    type: 'equipment',
    price: { amount: 300, currency: 'GBP', interval: 'monthly' },
    keywords: ['centrifuge', 'hire', 'instrument', 'laboratory'],
    skills: ['Centrifuges', 'Instrument Hire'],
    researchAreas: ['Biochemistry', 'Molecular Biology'],
    stageIds: ['dataset'],
    rating: { average: 4.5, count: 7 },
    inventory: { status: 'limited', quantity: 4, deliveryDays: 7 },
    targetAudience: ['Labs', 'Researchers'],
    tags: ['centrifuge', 'hire'],
  },
  {
    id: 'listing-software-licence',
    vendorId: 'vendor-academia-software',
    title: 'Academic Software Licence (MATLAB & Python)',
    summary: 'Academic licences for MATLAB, Python toolkits, and research dashboards with volume pricing.',
    category: 'equipment',
    subcategory: 'software-licenses',
    type: 'digital-product',
    price: { amount: 199, currency: 'USD', interval: 'one-time' },
    keywords: ['software licence', 'matlab', 'python', 'academic'],
    skills: ['MATLAB', 'Python', 'Licences'],
    stageIds: ['analysis'],
    rating: { average: 4.7, count: 24 },
    sponsored: true,
    inventory: { status: 'available', deliveryDays: 1 },
    targetAudience: ['Researchers', 'Students', 'Institutions'],
    tags: ['software', 'licence'],
  },
  {
    id: 'listing-grant-writing',
    vendorId: 'vendor-grantcraft-consulting',
    title: 'Grant Writing Service',
    summary: 'End-to-end grant writing: narrative, aims, methods, and budget justification for funders worldwide.',
    category: 'funding-services',
    subcategory: 'grant-writing',
    type: 'service',
    price: { amount: 450, currency: 'GBP', interval: 'per-project' },
    keywords: ['grant writing', 'proposal', 'funding', 'narrative'],
    skills: ['Grant Writing', 'Proposal Development'],
    stageIds: ['funding'],
    rating: { average: 4.9, count: 18 },
    featured: true,
    bestSeller: true,
    inventory: { status: 'available', quantity: 8, deliveryDays: 21 },
    sourceId: FUNDING_OPPORTUNITIES[0].id,
    sourceEntity: 'funding',
    targetAudience: ['Early-career researchers', 'Labs', 'Research offices'],
    careerStages: ['doctoral', 'postdoctoral', 'early-career', 'mid-career'],
    tags: ['grant writing', 'proposal'],
  },
  {
    id: 'listing-proposal-review',
    vendorId: 'vendor-grantcraft-consulting',
    title: 'Proposal Review & Budget Preparation',
    summary: 'Independent proposal review with scoring and budget preparation aligned to funder templates.',
    category: 'funding-services',
    subcategory: 'proposal-review',
    type: 'service',
    price: { amount: 200, currency: 'GBP', interval: 'per-project' },
    keywords: ['proposal review', 'budget', 'grant', 'feedback'],
    skills: ['Proposal Review', 'Budget Preparation'],
    stageIds: ['funding'],
    rating: { average: 4.8, count: 12 },
    inventory: {
      status: 'available',
      deliveryDays: 7,
      openSlots: [
        { id: 'slot-pr-1', startsAt: '2026-08-06T10:00:00Z', endsAt: '2026-08-06T11:00:00Z', booked: false },
        { id: 'slot-pr-2', startsAt: '2026-08-08T10:00:00Z', endsAt: '2026-08-08T11:00:00Z', booked: false },
      ],
    },
    targetAudience: ['Researchers', 'Research offices'],
    careerStages: ['doctoral', 'postdoctoral', 'early-career', 'mid-career'],
    tags: ['proposal review', 'budget'],
  },
  {
    id: 'listing-funding-search',
    vendorId: 'vendor-ministry-innovation',
    title: 'Funding Opportunity Search',
    summary: 'Curated funding opportunity matching to your research profile, priorities, and career stage.',
    category: 'funding-services',
    subcategory: 'funding-search',
    type: 'service',
    price: { amount: 95, currency: 'GBP', interval: 'per-project' },
    keywords: ['funding search', 'opportunities', 'grants', 'matching'],
    skills: ['Funding Search', 'Opportunity Matching'],
    stageIds: ['funding'],
    rating: { average: 4.4, count: 6 },
    inventory: { status: 'available', deliveryDays: 3 },
    targetAudience: ['Researchers', 'Students'],
    tags: ['funding search'],
  },
  {
    id: 'listing-research-assistant',
    vendorId: 'vendor-research-talent-hub',
    title: 'Research Assistant Placement',
    summary: 'Screened research assistant placement matched to your project needs and timeline.',
    category: 'recruitment',
    subcategory: 'research-assistants',
    type: 'service',
    price: { amount: 150, currency: 'GBP', interval: 'per-project' },
    keywords: ['research assistant', 'placement', 'recruitment'],
    skills: ['Recruitment', 'Screening', 'Placement'],
    stageIds: ['project'],
    rating: { average: 4.6, count: 9 },
    inventory: { status: 'available', quantity: 20, deliveryDays: 7 },
    targetAudience: ['Researchers', 'PIs', 'Labs'],
    tags: ['research assistant'],
  },
  {
    id: 'listing-phd-postdoc-listing',
    vendorId: 'vendor-university-of-ibadan',
    title: 'PhD & Postdoc Position Listing',
    summary: 'List open PhD and postdoctoral positions to a global academic audience with matched applicants.',
    category: 'recruitment',
    subcategory: 'phd-positions',
    type: 'job',
    price: { amount: 80, currency: 'GBP', interval: 'one-time' },
    keywords: ['phd', 'postdoc', 'position', 'recruitment'],
    skills: ['Recruitment', 'PhD', 'Postdoc'],
    stageIds: ['project', 'funding'],
    rating: { average: 4.5, count: 11 },
    inventory: { status: 'available', deliveryDays: 1 },
    targetAudience: ['Institutions', 'Labs'],
    tags: ['phd', 'postdoc'],
  },
  {
    id: 'listing-graduate-internship',
    vendorId: 'vendor-research-talent-hub',
    title: 'Graduate Internship Programme Listing',
    summary: 'Launch a graduate internship programme with structured placements and progress reporting.',
    category: 'recruitment',
    subcategory: 'internships',
    type: 'job',
    price: { amount: 100, currency: 'GBP', interval: 'one-time' },
    keywords: ['internship', 'graduate', 'programme', 'placement'],
    skills: ['Internships', 'Programme Design'],
    stageIds: ['project'],
    rating: { average: 4.6, count: 7 },
    inventory: { status: 'available', deliveryDays: 3 },
    targetAudience: ['Companies', 'Labs', 'Institutions'],
    tags: ['internship'],
  },
  {
    id: 'listing-university-consulting',
    vendorId: 'vendor-oxford-academic-services',
    title: 'University Strategy & Publication Consulting',
    summary: 'Strategic advisory for university research offices: publication strategy, journal portfolios, and rankings.',
    category: 'consulting',
    subcategory: 'university-consulting',
    type: 'service',
    price: { amount: 900, currency: 'GBP', interval: 'per-project' },
    keywords: ['university consulting', 'strategy', 'publication', 'rankings'],
    skills: ['Strategy', 'Publication Strategy', 'Advisory'],
    stageIds: ['publication', 'knowledge-transfer'],
    rating: { average: 4.9, count: 8 },
    featured: true,
    inventory: { status: 'available', quantity: 4, deliveryDays: 30 },
    targetAudience: ['Universities', 'Research offices'],
    tags: ['strategy', 'consulting'],
  },
  {
    id: 'listing-ngo-government-consulting',
    vendorId: 'vendor-african-dev-network',
    title: 'NGO & Government Research Consulting',
    summary: 'Monitoring and evaluation, policy research, and evidence-based consulting for NGOs and governments.',
    category: 'consulting',
    subcategory: 'ngo-consulting',
    type: 'service',
    price: { amount: 700, currency: 'GBP', interval: 'per-project' },
    keywords: ['ngo', 'government', 'consulting', 'monitoring', 'evaluation'],
    skills: ['Monitoring & Evaluation', 'Policy Research', 'Consulting'],
    stageIds: ['knowledge-transfer', 'impact'],
    rating: { average: 4.7, count: 10 },
    sponsored: true,
    inventory: { status: 'available', quantity: 6, deliveryDays: 21 },
    targetAudience: ['NGOs', 'Governments', 'Development partners'],
    tags: ['ngo', 'government', 'consulting'],
  },
  {
    id: 'listing-research-team-building',
    vendorId: 'vendor-african-dev-network',
    title: 'Research Team Assembly & Capacity Building',
    summary: 'Assemble and train research teams from a vetted network of specialists.',
    description: `Team assembly from our network of specialists: ${RESEARCH_TEAM.slice(0, 4)
      .map((member) => `${member.name} (${member.specialisation})`)
      .join(', ')} — plus tailored capacity building.`,
    category: 'consulting',
    subcategory: 'technology-consulting',
    type: 'service',
    price: { amount: 850, currency: 'GBP', interval: 'per-project' },
    keywords: ['research team', 'capacity building', 'training', 'recruitment'],
    skills: ['Team Assembly', 'Capacity Building', 'Training'],
    stageIds: ['project', 'knowledge-transfer'],
    rating: { average: 4.7, count: 6 },
    inventory: { status: 'available', quantity: 5, deliveryDays: 14 },
    targetAudience: ['Institutions', 'Labs', 'Governments'],
    tags: ['team building', 'capacity'],
  },
  {
    id: 'listing-surveillance-dashboard',
    vendorId: 'vendor-ibadan-statistics-lab',
    title: 'Community Health Surveillance Dashboard Template',
    summary: 'An interactive dashboard template for community health surveillance with a ready data pipeline.',
    category: 'digital-products',
    subcategory: 'software',
    type: 'digital-product',
    price: { amount: 85, currency: 'GBP', interval: 'one-time' },
    keywords: ['dashboard', 'surveillance', 'template', 'health', 'data pipeline'],
    skills: ['Dashboards', 'Data Pipelines'],
    researchAreas: ['Public Health', 'Epidemiology'],
    stageIds: ['dataset', 'analysis'],
    rating: { average: 4.8, count: 15 },
    bestSeller: true,
    inventory: { status: 'available', deliveryDays: 1 },
    sourceId: WORKSPACE_PROJECTS[3].id,
    sourceEntity: 'project',
    targetAudience: ['Researchers', 'Health programmes', 'NGOs'],
    tags: ['dashboard', 'surveillance'],
  },
  {
    id: 'listing-questionnaire-library',
    vendorId: 'vendor-graduate-student-services',
    title: 'Survey Questionnaire Instrument Library',
    summary: 'Validated questionnaire instruments and scales for health, education, and social research.',
    category: 'digital-products',
    subcategory: 'questionnaires',
    type: 'digital-product',
    price: { amount: 25, currency: 'GBP', interval: 'one-time' },
    keywords: ['questionnaire', 'survey', 'instruments', 'scales'],
    skills: ['Survey Design', 'Questionnaires'],
    stageIds: ['dataset'],
    rating: { average: 4.6, count: 21 },
    inventory: { status: 'available', deliveryDays: 1 },
    targetAudience: ['Researchers', 'Students'],
    tags: ['questionnaires', 'survey'],
  },
  {
    id: 'listing-open-dataset-package',
    vendorId: 'vendor-university-of-ibadan',
    title: 'Open Research Dataset Package',
    summary: 'Curated open research dataset with documentation, codebook, and citation metadata.',
    category: 'digital-products',
    subcategory: 'datasets',
    type: 'digital-product',
    price: { amount: 120, currency: 'GBP', interval: 'one-time' },
    keywords: ['dataset', 'open data', 'codebook', 'research data'],
    skills: ['Data Curation', 'Documentation'],
    researchAreas: ['Public Health', 'Environmental Science'],
    stageIds: ['dataset'],
    rating: { average: 4.7, count: 13 },
    inventory: { status: 'available', deliveryDays: 1 },
    sourceId: DATASETS[0].id,
    sourceEntity: 'dataset',
    targetAudience: ['Researchers', 'Students'],
    tags: ['dataset', 'open data'],
  },
  {
    id: 'listing-r-video-course',
    vendorId: 'vendor-kovacs-data-science',
    title: 'Intro to R: Video Course',
    summary: 'A self-paced video course covering R fundamentals, tidyverse, and reproducible reporting.',
    category: 'digital-products',
    subcategory: 'video-courses',
    type: 'digital-product',
    price: { amount: 49, currency: 'GBP', interval: 'one-time' },
    keywords: ['r', 'rstudio', 'video course', 'tidyverse'],
    skills: ['R', 'RStudio', 'Tidyverse'],
    stageIds: ['analysis'],
    rating: { average: 4.8, count: 19 },
    onSale: true,
    discount: { percent: 15, endsAt: '2026-08-31' },
    inventory: { status: 'available', deliveryDays: 0 },
    targetAudience: ['Students', 'Researchers'],
    careerStages: ['postgraduate', 'masters', 'doctoral'],
    tags: ['r', 'video course'],
  },
  {
    id: 'listing-compiled-compendium',
    vendorId: 'vendor-scholatia-press',
    title: 'Compiled Research Compendium (Publication Set)',
    summary: 'A compiled compendium of flagship publications with reading guides and citation-ready metadata.',
    category: 'digital-products',
    subcategory: 'ebooks',
    type: 'digital-product',
    price: { amount: 35, currency: 'GBP', interval: 'one-time' },
    keywords: ['compendium', 'publications', 'ebook', 'reading guide'],
    skills: ['Publishing', 'Compendia'],
    stageIds: ['publication'],
    rating: { average: 4.5, count: 9 },
    inventory: { status: 'available', deliveryDays: 0 },
    sourceId: WORKSPACE_PUBLICATIONS[0].doi,
    sourceEntity: 'publication',
    targetAudience: ['Researchers', 'Libraries', 'Students'],
    tags: ['compendium', 'publications'],
  },
  {
    id: 'listing-medieval-church-book',
    vendorId: 'vendor-scholatia-press',
    title: 'The Medieval Church in England (Book)',
    summary: 'A scholarly monograph on the medieval church in England, with open access and print editions.',
    category: 'physical-products',
    subcategory: 'books',
    type: 'physical-product',
    price: { amount: 25, currency: 'GBP', interval: 'one-time' },
    keywords: ['book', 'medieval history', 'monograph', 'church'],
    skills: ['Publishing', 'Books'],
    researchAreas: ['History', 'Medieval Studies'],
    stageIds: ['publication'],
    rating: { average: 4.8, count: 26 },
    bestSeller: true,
    inventory: { status: 'available', quantity: 120, deliveryDays: 5 },
    sourceId: PUBLISHERS[0].id,
    sourceEntity: 'publisher',
    targetAudience: ['Historians', 'Students', 'Libraries'],
    tags: ['book', 'medieval'],
  },
  {
    id: 'listing-microgrid-controller',
    vendorId: 'vendor-adebayo-energy-consulting',
    title: 'SunGrid Microgrid Controller (Device)',
    summary: 'A low-cost modular solar microgrid controller developed in-house, with installation support.',
    category: 'physical-products',
    subcategory: 'lab-equipment',
    type: 'physical-product',
    price: { amount: 150, currency: 'GBP', interval: 'one-time' },
    keywords: ['microgrid', 'controller', 'solar', 'device'],
    skills: ['Microgrids', 'Power Electronics'],
    researchAreas: ['Energy Systems'],
    stageIds: ['knowledge-transfer', 'impact'],
    rating: { average: 4.7, count: 8 },
    inventory: { status: 'available', quantity: 25, deliveryDays: 10 },
    sourceId: WORKSPACE_PROJECTS[4].id,
    sourceEntity: 'project',
    targetAudience: ['Startups', 'Communities', 'Researchers'],
    tags: ['microgrid', 'solar'],
  },
  {
    id: 'listing-science-kit',
    vendorId: 'vendor-youth-science-startup',
    title: 'Junior Science Experiment Kit',
    summary: 'Hands-on science experiment kits for school STEM programmes, with teacher guides.',
    category: 'physical-products',
    subcategory: 'scientific-kits',
    type: 'physical-product',
    price: { amount: 35, currency: 'GBP', interval: 'one-time' },
    keywords: ['science kit', 'stem', 'experiments', 'education'],
    skills: ['STEM Education', 'Science Kits'],
    stageIds: ['knowledge-transfer'],
    rating: { average: 4.7, count: 12 },
    onSale: true,
    discount: { percent: 10, endsAt: '2026-08-20' },
    inventory: { status: 'available', quantity: 200, deliveryDays: 7 },
    targetAudience: ['Schools', 'Parents', 'Teachers'],
    tags: ['science kit', 'stem'],
  },
  {
    id: 'listing-stats-textbook',
    vendorId: 'vendor-cape-town-bookstore',
    title: 'Statistical Methods for Research (Textbook)',
    summary: 'The standard applied statistics textbook with worked examples in Stata, R, and SPSS.',
    category: 'physical-products',
    subcategory: 'books',
    type: 'physical-product',
    price: { amount: 45, currency: 'GBP', interval: 'one-time' },
    keywords: ['textbook', 'statistics', 'stata', 'r', 'spss'],
    skills: ['Statistics', 'Books'],
    stageIds: ['analysis'],
    rating: { average: 4.6, count: 31 },
    featured: true,
    inventory: { status: 'available', quantity: 300, deliveryDays: 5 },
    targetAudience: ['Students', 'Researchers'],
    tags: ['textbook', 'statistics'],
  },
];

function reviewsForSeed(seed: ListingSeed, index: number): MarketplaceReview[] {
  const profile = ratingsFor(seed.rating.average, seed.rating.count);
  return profile.map((rating, i) => ({
    id: `review-${seed.id}-${i}`,
    listingId: seed.id,
    vendorId: seed.vendorId,
    reviewerName: REVIEWER_NAMES[(index + i) % REVIEWER_NAMES.length],
    rating,
    title: REVIEW_TITLES[(index + i) % REVIEW_TITLES.length],
    comment:
      rating >= 5
        ? 'Outstanding work — exceeded expectations and delivered ahead of schedule.'
        : 'Solid professional service, clear communication throughout the engagement.',
    helpfulVotes: (i * 3) % 42,
    reported: false,
    verifiedPurchase: i % 5 !== 4,
    reviewerSaid: i % 3 === 0 ? researcherOf(REVIEWER_NAMES.length % 2 === 0 ? 'ojuri' : 'smith').identity.said : undefined,
    date: `2026-0${6 - Math.floor(i / 5)}-0${(i % 9) + 1}`,
  }));
}

function makeListing(seed: ListingSeed, index: number): MarketplaceListing {
  const vendor = VENDORS.find((entry) => entry.id === seed.vendorId);
  const reviews = reviewsForSeed(seed, index);
  const rating = ratingFromReviews(reviews);
  const onSale = seed.onSale ?? Boolean(seed.discount);
  const orders = seed.orders ?? 10 + ((index * 5) % 80);
  const stageIds = seed.stageIds ?? ['knowledge-transfer'];
  return {
    id: seed.id,
    vendorId: seed.vendorId,
    vendorName: vendor?.name ?? seed.vendorId,
    vendorSlug: vendor?.slug ?? slugify(seed.vendorId),
    title: seed.title,
    summary: seed.summary,
    description: seed.description ?? seed.summary,
    category: seed.category,
    subcategory: seed.subcategory,
    type: seed.type,
    price: seed.price,
    discount: seed.discount,
    keywords: seed.keywords,
    researchAreas: seed.researchAreas ?? seed.keywords.slice(0, 3),
    targetAudience: seed.targetAudience ?? ['Researchers', 'Students'],
    careerStages: seed.careerStages ?? ['open-to-all'],
    skills: seed.skills ?? [],
    stageIds,
    inventory: {
      status: seed.inventory?.status ?? 'available',
      quantity: seed.inventory?.quantity ?? 50 - (index * 2) % 45,
      deliveryDays: seed.inventory?.deliveryDays ?? 3 + (index % 10),
      recurring: seed.inventory?.recurring,
      openSlots: seed.inventory?.openSlots,
    },
    rating,
    reviewCount: rating.count,
    favorites: seed.favorites ?? 20 + ((index * 7) % 90),
    orders,
    views: seed.orders ? orders * 18 : 120 + ((index * 23) % 400) + orders * 18,
    featured: seed.featured ?? index % 6 === 0,
    sponsored: seed.sponsored ?? index % 4 === 1,
    bestSeller: seed.bestSeller ?? index % 7 === 0,
    onSale,
    verifiedVendor: vendor?.verified ?? true,
    badges: vendor?.badges.slice(0, 3) ?? ['Verified Vendor'],
    country: vendor?.country,
    tags: seed.tags ?? [seed.category, seed.subcategory],
    status: 'active',
    url: buildListingUrl(seed.id),
    dateAdded: seed.dateAdded ?? '2026-03-15',
    lastUpdated: seed.lastUpdated ?? '2026-07-15',
    sourceId: seed.sourceId,
    sourceEntity: seed.sourceEntity,
  };
}

export const LISTINGS: MarketplaceListing[] = LISTING_SEEDS.map((seed, index) => makeListing(seed, index));

export const REVIEWS: MarketplaceReview[] = LISTING_SEEDS.flatMap((seed, index) => reviewsForSeed(seed, index));

// ---------------------------------------------------------------------------
// Orders, invoices, payments, refunds, disputes
// ---------------------------------------------------------------------------

const BUYER_NAMES = [
  'Dr. Amina Bello',
  'Prof. Kwame Mensah',
  'Ms. Fatima Zahra',
  'Dr. Carlos Mendes',
  'Mr. David Okafor',
  'Dr. Sarah Mitchell',
  'Prof. Wei Zhang',
  'Dr. Grace Adeyemi',
  'Mr. Peter Njoroge',
  'Dr. Lena Fischer',
];

const ORDER_STATUS_CYCLE: MarketplaceOrderStatus[] = [
  'completed',
  'completed',
  'delivered',
  'in-progress',
  'pending',
  'completed',
  'refunded',
  'disputed',
];

function placedAtFor(index: number): string {
  const day = ((index * 3) % 28) + 1;
  return `2026-07-${String(day).padStart(2, '0')}T10:${String((index * 7) % 60).padStart(2, '0')}:00Z`;
}

export const ORDERS: MarketplaceOrder[] = LISTINGS.slice(0, 36).map((listing, index) => {
  const status = ORDER_STATUS_CYCLE[index % ORDER_STATUS_CYCLE.length];
  const quantity = 1 + (index % 3);
  const unitPrice = effectivePrice(listing);
  const subtotal = Math.round(unitPrice * quantity * 100) / 100;
  const total = subtotal;
  const placedAt = placedAtFor(index);
  const completed = status === 'completed' || status === 'delivered';
  return {
    id: `order-${String(index + 1).padStart(3, '0')}`,
    orderNumber: `ORD-${String(index + 1).padStart(5, '0')}`,
    listingId: listing.id,
    vendorId: listing.vendorId,
    buyerName: BUYER_NAMES[index % BUYER_NAMES.length],
    buyerEmail: `buyer${index}@example.org`,
    items: [
      {
        listingId: listing.id,
        title: listing.title,
        quantity,
        unitPrice,
        discount: 0,
        total,
      },
    ],
    subtotal,
    discount: 0,
    total,
    currency: listing.price.currency,
    status,
    paymentStatus:
      status === 'refunded'
        ? 'refunded'
        : status === 'pending'
          ? 'pending'
          : status === 'disputed'
            ? 'paid'
            : 'paid',
    placedAt,
    completedAt: completed ? `2026-07-${String(Math.min(31, ((index * 3) % 28) + 5)).padStart(2, '0')}T12:00:00Z` : undefined,
    notes: status === 'disputed' ? 'Buyer raised a quality concern.' : undefined,
  };
});

export const INVOICES: MarketplaceInvoice[] = ORDERS.slice(0, 10).map((order, index) => ({
  id: `invoice-${String(index + 1).padStart(3, '0')}`,
  invoiceNumber: `INV-${String(index + 1).padStart(5, '0')}`,
  orderId: order.id,
  vendorId: order.vendorId,
  buyerName: order.buyerName,
  lines: order.items.map((item) => ({
    description: item.title,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.total,
  })),
  subtotal: order.subtotal,
  tax: 0,
  fees: Math.round(order.total * 0.08 * 100) / 100,
  total: Math.round((order.total + order.total * 0.08) * 100) / 100,
  currency: order.currency,
  status: order.status === 'completed' || order.status === 'delivered' ? 'paid' : 'sent',
  issuedAt: order.placedAt,
  dueAt: `2026-08-${String(((index * 5) % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  paidAt:
    order.status === 'completed' || order.status === 'delivered'
      ? `2026-07-${String(((index * 3) % 28) + 2).padStart(2, '0')}T09:00:00Z`
      : undefined,
}));

const PAYMENT_METHOD_CYCLE: MarketplacePaymentMethod[] = [
  'card',
  'bank-transfer',
  'mobile-money',
  'paypal',
  'escrow',
  'wallet',
  'institution-billing',
];

export const PAYMENTS: MarketplacePayment[] = ORDERS.slice(0, 18).map((order, index) => ({
  id: `payment-${String(index + 1).padStart(3, '0')}`,
  orderId: order.id,
  invoiceId: index < 10 ? INVOICES[index].id : undefined,
  amount: order.total,
  currency: order.currency,
  method: PAYMENT_METHOD_CYCLE[index % PAYMENT_METHOD_CYCLE.length],
  status: order.paymentStatus === 'pending' ? 'pending' : order.paymentStatus === 'refunded' ? 'refunded' : 'completed',
  escrowed: index % 2 === 0,
  reference: `pay_${String(index + 1).padStart(6, '0')}`,
  date: order.placedAt,
}));

export const REFUNDS: MarketplaceRefund[] = ORDERS.filter((order) => order.status === 'refunded')
  .slice(0, 3)
  .map((order, index) => ({
    id: `refund-${String(index + 1).padStart(3, '0')}`,
    orderId: order.id,
    amount: order.total,
    currency: order.currency,
    reason: 'Service not delivered within the agreed timeline.',
    status: 'completed',
    requestedAt: `2026-07-${String(((index * 4) % 20) + 8).padStart(2, '0')}T09:00:00Z`,
    decidedAt: `2026-07-${String(((index * 4) % 20) + 10).padStart(2, '0')}T09:00:00Z`,
    decidedBy: 'Marketplace Support',
  }));

export const DISPUTES: MarketplaceDispute[] = ORDERS.filter((order) => order.status === 'disputed')
  .slice(0, 2)
  .map((order, index) => ({
    id: `dispute-${String(index + 1).padStart(3, '0')}`,
    orderId: order.id,
    listingId: order.listingId,
    openedBy: order.buyerName,
    subject: 'Quality of delivered work',
    description: 'The buyer reports that the delivered work does not match the agreed scope.',
    status: index === 0 ? 'open' : 'resolved',
    severity: index === 0 ? 'medium' : 'low',
    messages: [
      { id: `dispute-msg-${index}-1`, from: order.buyerName, body: 'The deliverable missed the agreed statistical methods section.', sentAt: order.placedAt },
      { id: `dispute-msg-${index}-2`, from: 'Marketplace Support', body: 'We have opened an investigation and will update both parties within 3 working days.', sentAt: `2026-07-${String(((index * 5) % 20) + 6).padStart(2, '0')}T12:00:00Z` },
    ],
    openedAt: order.placedAt,
    resolvedAt: index === 1 ? `2026-07-${String(((index * 5) % 20) + 10).padStart(2, '0')}T12:00:00Z` : undefined,
  }));

// ---------------------------------------------------------------------------
// Coupons, promotions, bundles, bookings
// ---------------------------------------------------------------------------

export const COUPONS: MarketplaceCoupon[] = [
  {
    id: 'coupon-scholaria10',
    code: 'SCHOLARIA10',
    title: '10% off any order',
    description: '10% off any marketplace order over £50.',
    type: 'percent',
    value: 10,
    appliesTo: 'cart',
    minimumSpend: 50,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 214,
    status: 'active',
  },
  {
    id: 'coupon-stats20',
    code: 'STATS20',
    title: '20% off research services',
    description: '20% off all research services listings.',
    type: 'percent',
    value: 20,
    appliesTo: 'category',
    targetId: 'research-services',
    validFrom: '2026-06-01',
    validUntil: '2026-09-30',
    usageLimit: 500,
    timesUsed: 96,
    status: 'active',
  },
  {
    id: 'coupon-book5',
    code: 'BOOK5',
    title: '£5 off books',
    description: '£5 off any physical product listing.',
    type: 'fixed',
    value: 5,
    appliesTo: 'category',
    targetId: 'physical-products',
    minimumSpend: 20,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    timesUsed: 178,
    status: 'active',
  },
  {
    id: 'coupon-welcome15',
    code: 'WELCOME15',
    title: 'Welcome 15% off',
    description: '15% off your first order as a new buyer.',
    type: 'percent',
    value: 15,
    appliesTo: 'cart',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageLimit: 2000,
    timesUsed: 512,
    status: 'active',
  },
  {
    id: 'coupon-flash30',
    code: 'FLASH30',
    title: 'Flash 30% off education',
    description: 'Flash sale: 30% off education listings.',
    type: 'percent',
    value: 30,
    appliesTo: 'category',
    targetId: 'education',
    validFrom: '2026-06-15',
    validUntil: '2026-06-20',
    usageLimit: 100,
    timesUsed: 100,
    status: 'expired',
  },
];

export const PROMOTIONS: MarketplacePromotion[] = [
  {
    id: 'promo-july-stats-sale',
    name: 'July Statistical Analysis Sale',
    description: 'Up to 15% off research services throughout July.',
    kind: 'sale',
    discount: { percent: 15, startsAt: '2026-07-01', endsAt: '2026-07-31' },
    startsAt: '2026-07-01',
    endsAt: '2026-07-31',
    listingIds: ['listing-statistical-analysis', 'listing-qualitative-analysis', 'listing-systematic-review', 'listing-gis-spatial-analysis'],
  },
  {
    id: 'promo-manuscript-month',
    name: 'Manuscript Month',
    description: 'Publication services discounted for the submission season.',
    kind: 'seasonal',
    discount: { percent: 10, startsAt: '2026-07-01', endsAt: '2026-08-31' },
    startsAt: '2026-07-01',
    endsAt: '2026-08-31',
    listingIds: ['listing-journal-selection', 'listing-manuscript-pre-review', 'listing-response-to-reviewers', 'listing-journal-formatting'],
  },
  {
    id: 'promo-back-to-campus',
    name: 'Back to Campus',
    description: '20% off education listings for the new academic year.',
    kind: 'launch',
    discount: { percent: 20, startsAt: '2026-08-01', endsAt: '2026-09-30' },
    startsAt: '2026-08-01',
    endsAt: '2026-09-30',
    listingIds: ['listing-epidemiology-course', 'listing-spss-stata-workshop', 'listing-python-bootcamp', 'listing-r-video-course'],
  },
  {
    id: 'promo-stats-starter-bundle',
    name: 'Statistics Starter Bundle',
    description: 'Bundle discount across the statistics starter pack.',
    kind: 'bundle',
    discount: { percent: 15, startsAt: '2026-07-01', endsAt: '2026-09-30' },
    startsAt: '2026-07-01',
    endsAt: '2026-09-30',
    listingIds: ['listing-statistical-analysis', 'listing-statistics-tutoring', 'listing-r-video-course'],
  },
];

export const BUNDLES: MarketplaceBundle[] = [
  {
    id: 'bundle-stats-starter',
    name: 'Statistics Starter Bundle',
    description: 'Statistical analysis, tutoring, and an R course in one discounted package.',
    items: [
      { listingId: 'listing-statistical-analysis', title: 'Statistical Analysis & Biostatistics (Stata, R)', quantity: 1 },
      { listingId: 'listing-statistics-tutoring', title: '1:1 Statistics Tutoring', quantity: 3 },
      { listingId: 'listing-r-video-course', title: 'Intro to R: Video Course', quantity: 1 },
    ],
    listTotal: 250 + 90 + 49,
    discountPercent: 15,
    price: { amount: 331, currency: 'GBP', interval: 'one-time' },
    status: 'active',
  },
  {
    id: 'bundle-publishing-launch',
    name: 'Publishing Launch Bundle',
    description: 'Journal selection, pre-review, and response-to-reviewers as one submission package.',
    items: [
      { listingId: 'listing-journal-selection', title: 'Journal Selection & Submission Support', quantity: 1 },
      { listingId: 'listing-manuscript-pre-review', title: 'Manuscript Pre-Review & Cover Letter', quantity: 1 },
      { listingId: 'listing-response-to-reviewers', title: 'Response to Reviewers', quantity: 1 },
    ],
    listTotal: 120 + 150 + 140,
    discountPercent: 20,
    price: { amount: 328, currency: 'GBP', interval: 'one-time' },
    status: 'active',
  },
];

export const BOOKINGS: MarketplaceBooking[] = [
  {
    id: 'booking-visa-1',
    listingId: 'listing-conference-visa-support',
    vendorId: 'vendor-research-gateway-conferences',
    buyerName: BUYER_NAMES[2],
    scheduledFor: '2026-08-05T09:00:00Z',
    durationMinutes: 60,
    timezone: 'UTC',
    location: 'online',
    status: 'confirmed',
    price: { amount: 90, currency: 'GBP', interval: 'per-project' },
    notes: 'Visa consultation for ICAS conference.',
    createdAt: '2026-07-20T08:00:00Z',
  },
  {
    id: 'booking-tutor-1',
    listingId: 'listing-statistics-tutoring',
    vendorId: 'vendor-stem-tutors',
    buyerName: BUYER_NAMES[0],
    scheduledFor: '2026-08-04T15:00:00Z',
    durationMinutes: 60,
    timezone: 'UTC',
    location: 'online',
    status: 'confirmed',
    price: { amount: 30, currency: 'GBP', interval: 'per-hour' },
    createdAt: '2026-07-25T09:00:00Z',
  },
  {
    id: 'booking-proposal-1',
    listingId: 'listing-proposal-review',
    vendorId: 'vendor-grantcraft-consulting',
    buyerName: BUYER_NAMES[4],
    scheduledFor: '2026-08-06T10:00:00Z',
    durationMinutes: 60,
    timezone: 'UTC',
    location: 'online',
    status: 'requested',
    price: { amount: 200, currency: 'GBP', interval: 'per-project' },
    createdAt: '2026-07-28T14:00:00Z',
  },
  {
    id: 'booking-tutor-2',
    listingId: 'listing-statistics-tutoring',
    vendorId: 'vendor-stem-tutors',
    buyerName: BUYER_NAMES[3],
    scheduledFor: '2026-08-08T15:00:00Z',
    durationMinutes: 60,
    timezone: 'UTC',
    location: 'online',
    status: 'completed',
    price: { amount: 30, currency: 'GBP', interval: 'per-hour' },
    createdAt: '2026-07-18T10:00:00Z',
  },
  {
    id: 'booking-visa-2',
    listingId: 'listing-conference-visa-support',
    vendorId: 'vendor-research-gateway-conferences',
    buyerName: BUYER_NAMES[5],
    scheduledFor: '2026-08-09T09:00:00Z',
    durationMinutes: 60,
    timezone: 'UTC',
    location: 'online',
    status: 'requested',
    price: { amount: 90, currency: 'GBP', interval: 'per-project' },
    createdAt: '2026-07-29T11:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Conversations, messages, notifications, wishlists
// ---------------------------------------------------------------------------

export const CONVERSATIONS: {
  id: string;
  participants: string[];
  subject?: string;
  listingId?: string;
  orderId?: string;
  messages: MarketplaceMessage[];
  lastActivityAt: string;
}[] = [
  {
    id: 'conv-1',
    participants: [ORDERS[0].buyerName, 'Ibadan Statistics Lab'],
    subject: 'Statistical analysis scope',
    listingId: 'listing-statistical-analysis',
    orderId: ORDERS[0].id,
    messages: [
      { id: 'msg-1-1', from: ORDERS[0].buyerName, to: 'Ibadan Statistics Lab', body: 'Could you confirm the deliverables include the STROBE checklist?', sentAt: ORDERS[0].placedAt, readAt: ORDERS[0].placedAt },
      { id: 'msg-1-2', from: 'Ibadan Statistics Lab', to: ORDERS[0].buyerName, body: 'Yes — we include the STROBE checklist and a full methods appendix.', sentAt: `2026-07-${String(((ORDERS[0].placedAt.charCodeAt(ORDERS[0].placedAt.length - 9)) % 20) + 3).padStart(2, '0')}T09:00:00Z` },
    ],
    lastActivityAt: '2026-07-20T09:00:00Z',
  },
  {
    id: 'conv-2',
    participants: [ORDERS[3].buyerName, 'Oxford Academic Services'],
    subject: 'Journal shortlist',
    listingId: 'listing-journal-selection',
    orderId: ORDERS[3].id,
    messages: [
      { id: 'msg-2-1', from: ORDERS[3].buyerName, to: 'Oxford Academic Services', body: 'Please prioritise journals with fast first-decision times.', sentAt: ORDERS[3].placedAt, readAt: ORDERS[3].placedAt },
      { id: 'msg-2-2', from: 'Oxford Academic Services', to: ORDERS[3].buyerName, body: 'Noted — we will rank the shortlist by decision speed and impact.', sentAt: '2026-07-19T10:00:00Z' },
    ],
    lastActivityAt: '2026-07-19T10:00:00Z',
  },
  {
    id: 'conv-3',
    participants: [ORDERS[6].buyerName, 'GrantCraft Consulting'],
    subject: 'Proposal deadline',
    listingId: 'listing-grant-writing',
    orderId: ORDERS[6].id,
    messages: [
      { id: 'msg-3-1', from: ORDERS[6].buyerName, to: 'GrantCraft Consulting', body: 'Our funder moved the deadline to 15 August.', sentAt: ORDERS[6].placedAt },
      { id: 'msg-3-2', from: 'GrantCraft Consulting', to: ORDERS[6].buyerName, body: 'We can accommodate that — drafting is already 60% complete.', sentAt: '2026-07-22T08:00:00Z', readAt: '2026-07-22T09:00:00Z' },
    ],
    lastActivityAt: '2026-07-22T09:00:00Z',
  },
  {
    id: 'conv-4',
    participants: [ORDERS[9].buyerName, 'Africa Genomics Laboratory'],
    subject: 'Sample shipment',
    listingId: 'listing-dna-sequencing',
    orderId: ORDERS[9].id,
    messages: [
      { id: 'msg-4-1', from: 'Africa Genomics Laboratory', to: ORDERS[9].buyerName, body: 'Samples received — sequencing is scheduled for next week.', sentAt: '2026-07-16T14:00:00Z', readAt: '2026-07-16T15:00:00Z' },
    ],
    lastActivityAt: '2026-07-16T15:00:00Z',
  },
];

export const MESSAGES: MarketplaceMessage[] = CONVERSATIONS.flatMap((conversation) => conversation.messages);

export const NOTIFICATIONS: MarketplaceNotification[] = [
  {
    id: 'notif-1',
    recipientId: ORDERS[0].buyerName,
    type: 'order-update',
    title: 'Order confirmed',
    body: `Your order ${ORDERS[0].orderNumber} has been confirmed by the vendor.`,
    read: false,
    actionUrl: '/marketplace',
    createdAt: ORDERS[0].placedAt,
  },
  {
    id: 'notif-2',
    recipientId: 'vendor-ibadan-statistics-lab',
    type: 'payment-received',
    title: 'Payment received',
    body: `Payment of ${ORDERS[0].currency} ${ORDERS[0].total} received for ${ORDERS[0].orderNumber}.`,
    read: true,
    actionUrl: '/marketplace',
    createdAt: ORDERS[0].placedAt,
  },
  {
    id: 'notif-3',
    recipientId: 'vendor-grantcraft-consulting',
    type: 'booking-reminder',
    title: 'Upcoming booking',
    body: 'You have a proposal review consultation scheduled on 6 August.',
    read: false,
    actionUrl: '/marketplace',
    createdAt: '2026-07-30T08:00:00Z',
  },
  {
    id: 'notif-4',
    recipientId: 'Dr. Grace Adeyemi',
    type: 'review-received',
    title: 'New review',
    body: 'You received a 5-star review for the DNA Sequencing & Genotyping listing.',
    read: true,
    actionUrl: '/marketplace',
    createdAt: '2026-07-21T09:00:00Z',
  },
  {
    id: 'notif-5',
    recipientId: 'vendor-openlab-instruments',
    type: 'dispute',
    title: 'Dispute opened',
    body: 'A dispute has been opened on order ORD-00007.',
    read: false,
    actionUrl: '/marketplace',
    createdAt: '2026-07-18T10:00:00Z',
  },
  {
    id: 'notif-6',
    recipientId: 'Mr. Peter Njoroge',
    type: 'promotion',
    title: 'Back to Campus sale',
    body: 'Get 20% off education listings for the new academic year.',
    read: false,
    actionUrl: '/marketplace',
    createdAt: '2026-08-01T00:00:00Z',
  },
];

export const WISHLISTS: MarketplaceWishlist[] = [
  {
    id: 'wishlist-1',
    ownerId: 'Dr. Amina Bello',
    name: 'Grant season',
    listingIds: ['listing-grant-writing', 'listing-proposal-review', 'listing-funding-search'],
    createdAt: '2026-06-10',
  },
  {
    id: 'wishlist-2',
    ownerId: 'Dr. Sarah Mitchell',
    name: 'Lab equipment',
    listingIds: ['listing-spectrophotometer-rental', 'listing-centrifuge-hire', 'listing-dna-sequencing'],
    createdAt: '2026-06-18',
  },
  {
    id: 'wishlist-3',
    ownerId: 'Prof. Kwame Mensah',
    name: 'Course materials',
    listingIds: ['listing-python-bootcamp', 'listing-r-video-course', 'listing-stats-textbook'],
    createdAt: '2026-07-02',
  },
];

export const RECENTLY_VIEWED = [
  { ownerId: 'Dr. Amina Bello', listingIds: ['listing-statistical-analysis', 'listing-systematic-review', 'listing-journal-selection'], viewedAt: '2026-07-30T14:00:00Z' },
  { ownerId: 'Prof. Wei Zhang', listingIds: ['listing-dna-sequencing', 'listing-microscopy-imaging', 'listing-sample-analysis'], viewedAt: '2026-07-29T11:00:00Z' },
];

// ---------------------------------------------------------------------------
// Guest advertisers (Scholatia Ads surface, no Scholatia account required)
// ---------------------------------------------------------------------------

export const GUEST_ADVERTISERS: MarketplaceGuestAdvertiser[] = [
  {
    id: 'guest-hannah-instruments',
    companyName: 'Hannah Instruments Ltd',
    contactName: 'Michael Hannah',
    email: 'sales@hannah-instruments.example',
    country: 'Germany',
    website: 'https://hannah-instruments.example',
    verified: true,
    campaignIds: ['cam-equipment-q3'],
    promotedListingIds: ['listing-spectrophotometer-rental', 'listing-centrifuge-hire'],
    joinedAt: '2026-02-01',
    analytics: { activeCampaigns: 1, totalSpend: 4200, totalConversions: 61, roi: 340 },
  },
  {
    id: 'guest-globaled-certifications',
    companyName: 'GlobalEd Certifications',
    contactName: 'Priya Raman',
    email: 'partners@globaled-cert.example',
    country: 'United States',
    website: 'https://globaled-cert.example',
    verified: true,
    campaignIds: ['cam-courses-back-to-campus'],
    promotedListingIds: ['listing-python-bootcamp', 'listing-power-systems-course'],
    joinedAt: '2026-01-15',
    analytics: { activeCampaigns: 2, totalSpend: 3800, totalConversions: 74, roi: 290 },
  },
  {
    id: 'guest-africa-policy-lab',
    companyName: 'Africa Policy Lab',
    contactName: 'Dr. Kofi Asante',
    email: 'hello@africapolicylab.example',
    country: 'Ghana',
    website: 'https://africapolicylab.example',
    verified: false,
    campaignIds: ['cam-policy-consulting'],
    promotedListingIds: ['listing-ngo-government-consulting'],
    joinedAt: '2026-03-10',
    analytics: { activeCampaigns: 1, totalSpend: 2100, totalConversions: 28, roi: 180 },
  },
  {
    id: 'guest-fieldnotes-publishing',
    companyName: 'FieldNotes Publishing',
    contactName: 'Emma Whitfield',
    email: 'rights@fieldnotes-pub.example',
    country: 'United Kingdom',
    verified: true,
    campaignIds: ['cam-fieldnotes-books'],
    promotedListingIds: ['listing-medieval-church-book', 'listing-stats-textbook'],
    joinedAt: '2025-11-01',
    analytics: { activeCampaigns: 3, totalSpend: 5600, totalConversions: 92, roi: 410 },
  },
];

// ---------------------------------------------------------------------------
// Recommendations (AI / Intelligence integration)
// ---------------------------------------------------------------------------

function listingRecommendation(
  id: string,
  type: 'listing' | 'service' | 'product' | 'consultant' | 'storefront',
  query: string,
  audience: string,
  tags: string[],
): MarketplaceRecommendation {
  const top = searchListings(LISTINGS, query, 1)[0] ?? LISTINGS[0];
  return {
    id,
    type,
    targetId: top.id,
    title: top.title,
    summary: top.summary,
    url: top.url,
    score: scoreListingRelevance(top, query),
    confidence: 'high',
    reasons: ['Matches your research profile', 'Top-rated in its category', 'High completion rate'],
    tags,
    audience,
    date: CURRENT_DATE,
  };
}

export const RECOMMENDATIONS: MarketplaceRecommendation[] = [
  listingRecommendation('rec-listing-statistics', 'listing', 'statistical analysis biostatistics', 'Dr. Amina Bello', ['statistics', 'analysis']),
  listingRecommendation('rec-service-publishing', 'service', 'journal submission support publication', 'Dr. Sarah Mitchell', ['publication', 'submission']),
  listingRecommendation('rec-product-course', 'product', 'python research course', 'Mr. Peter Njoroge', ['python', 'course']),
  listingRecommendation('rec-consultant-funding', 'consultant', 'grant writing funding proposal', 'Prof. Kwame Mensah', ['funding', 'grants']),
  listingRecommendation('rec-storefront-genomics', 'storefront', 'sequencing genomics laboratory', 'Dr. Grace Adeyemi', ['sequencing', 'genomics']),
  {
    id: 'rec-journal',
    type: 'journal',
    targetId: `journal-${JOURNALS[0].journalId}`,
    sourceId: JOURNALS[0].journalId,
    sourceEntity: 'journal',
    title: JOURNALS[0].journalTitle,
    summary: JOURNALS[0].aimsAndScope ?? 'Recommended journal for your manuscript profile.',
    url: `/journals/${JOURNALS[0].journalId}`,
    score: 92,
    confidence: 'high',
    reasons: ['Aligns with your manuscript\u2019s discipline', 'Open access option available', 'Indexed in major databases'],
    tags: ['journal', 'publication'],
    audience: 'Dr. Amina Bello',
    date: CURRENT_DATE,
  },
  {
    id: 'rec-conference',
    type: 'conference',
    targetId: CONFERENCES[0].conferenceId,
    sourceId: CONFERENCES[0].conferenceId,
    sourceEntity: 'conference',
    title: CONFERENCES[0].title,
    summary: CONFERENCES[0].theme ?? 'Recommended conference for your research area.',
    url: `/conferences/${CONFERENCES[0].conferenceId}`,
    score: 88,
    confidence: 'high',
    reasons: ['Theme matches your research areas', 'Submissions currently open'],
    tags: ['conference', 'event'],
    audience: 'Dr. Sarah Mitchell',
    date: CURRENT_DATE,
  },
  {
    id: 'rec-grant',
    type: 'grant',
    targetId: FUNDING_OPPORTUNITIES[0].id,
    sourceId: FUNDING_OPPORTUNITIES[0].id,
    sourceEntity: 'funding',
    title: FUNDING_OPPORTUNITIES[0].title,
    summary: FUNDING_OPPORTUNITIES[0].summary,
    url: '/funding',
    score: 90,
    confidence: 'high',
    reasons: ['Matches your career stage', 'Deadline approaching', 'Within your discipline'],
    tags: ['funding', 'grant'],
    audience: 'Prof. Kwame Mensah',
    date: CURRENT_DATE,
  },
  {
    id: 'rec-reviewer',
    type: 'reviewer',
    targetId: `reviewer-${RESEARCHERS[1].username}`,
    sourceId: RESEARCHERS[1].identity.said,
    sourceEntity: 'researcher',
    title: RESEARCHERS[1].displayName,
    summary: `${RESEARCHERS[1].position.title} at ${RESEARCHERS[1].position.institution} — recommended as a peer reviewer for your field.`,
    url: `/researchers/${RESEARCHERS[1].username}`,
    score: 86,
    confidence: 'medium',
    reasons: ['Expert in your discipline', 'Active reviewing profile', 'High trust score'],
    tags: ['reviewer', 'peer review'],
    audience: 'Dr. Amina Bello',
    date: CURRENT_DATE,
  },
  {
    id: 'rec-collaborator',
    type: 'collaborator',
    targetId: `collaborator-${RESEARCHERS[2].username}`,
    sourceId: RESEARCHERS[2].identity.said,
    sourceEntity: 'researcher',
    title: RESEARCHERS[2].displayName,
    summary: `${RESEARCHERS[2].displayName} is a strong collaborator match for your research programme.`,
    url: `/researchers/${RESEARCHERS[2].username}`,
    score: 84,
    confidence: 'medium',
    reasons: ['Complementary skills', 'Open to collaboration', 'Similar research themes'],
    tags: ['collaborator', 'network'],
    audience: 'Dr. Sarah Mitchell',
    date: CURRENT_DATE,
  },
  {
    id: 'rec-publisher',
    type: 'publisher',
    targetId: PUBLISHERS[0].id,
    sourceId: PUBLISHERS[0].id,
    sourceEntity: 'publisher',
    title: PUBLISHERS[0].name,
    summary: PUBLISHERS[0].description,
    url: '/publishers',
    score: 82,
    confidence: 'medium',
    reasons: ['Open access portfolio', 'Strong disciplinary coverage', 'Verified publisher'],
    tags: ['publisher', 'publishing'],
    audience: 'Prof. Kwame Mensah',
    date: CURRENT_DATE,
  },
];

// ---------------------------------------------------------------------------
// Storefronts
// ---------------------------------------------------------------------------

export const STOREFRONTS: MarketplaceStorefront[] = VENDORS.map((vendor) => ({
  vendorId: vendor.id,
  slug: vendor.slug,
  name: vendor.name,
  url: buildStoreUrl(vendor.slug),
  description: vendor.description,
  categories: vendor.categories,
  featuredListingIds: LISTINGS.filter((listing) => listing.vendorId === vendor.id && listing.featured).map((listing) => listing.id),
  listingIds: LISTINGS.filter((listing) => listing.vendorId === vendor.id).map((listing) => listing.id),
  verified: vendor.verified,
  policies: {
    returns: 'Returns accepted within 14 days for digital and physical products in original condition.',
    refunds: 'Full refunds are processed within 7 working days for undelivered services.',
    delivery: 'Digital products delivered within 24 hours; physical products ship within 5 working days.',
    terms: 'Engagements are governed by the Scholatia Marketplace terms and dispute resolution policy.',
  },
}));

// ---------------------------------------------------------------------------
// Discovery & Advertising integration
// ---------------------------------------------------------------------------

export const MARKETPLACE_DISCOVERY_ITEMS: DiscoveryItem[] = toDiscoveryItems(LISTINGS);

export const MARKETPLACE_PROMOTABLE_OBJECTS: PromotableObject[] = registerPromotableObjects(
  LISTINGS.map((listing) => listingPromotableObject(listing)),
);

// ---------------------------------------------------------------------------
// Statistics, analytics, dashboards
// ---------------------------------------------------------------------------

export const MARKETPLACE_STATISTICS: MarketplaceStatistics = computeMarketplaceStatistics({
  vendors: VENDORS,
  listings: LISTINGS,
  reviews: REVIEWS,
  orders: ORDERS,
  bookings: BOOKINGS,
  refunds: REFUNDS,
  disputes: DISPUTES,
  coupons: COUPONS,
  promotions: PROMOTIONS,
});

export const MARKETPLACE_ANALYTICS = computeMarketplaceAnalytics({
  vendors: VENDORS,
  listings: LISTINGS,
  orders: ORDERS,
  reviews: REVIEWS,
  bookings: BOOKINGS,
  disputes: DISPUTES,
  messages: MESSAGES,
  wishlists: WISHLISTS,
});

export const MARKETPLACE_SALES_DASHBOARD = computeSalesDashboard({
  orders: ORDERS,
  refunds: REFUNDS,
  listings: LISTINGS,
});

export const MARKETPLACE_REVENUE_DASHBOARD = computeRevenueDashboard({
  orders: ORDERS,
  payments: PAYMENTS,
  refunds: REFUNDS,
  listings: LISTINGS,
  vendors: VENDORS,
});

// ---------------------------------------------------------------------------
// Featured exports
// ---------------------------------------------------------------------------

export const FEATURED_VENDOR: MarketplaceVendor = VENDORS[0];
export const FEATURED_STOREFRONT: MarketplaceStorefront = STOREFRONTS[0];
export const FEATURED_LISTING: MarketplaceListing = LISTINGS.find((listing) => listing.id === 'listing-statistical-analysis') ?? LISTINGS[0];
export const FEATURED_PROMOTION: MarketplacePromotion = PROMOTIONS[0];
export const FEATURED_BUNDLE: MarketplaceBundle = BUNDLES[0];
export const FEATURED_COUPON: MarketplaceCoupon = COUPONS[0];
export const FEATURED_RECOMMENDATION: MarketplaceRecommendation = RECOMMENDATIONS[0];

export const MARKETPLACE_PORTFOLIO: MarketplacePortfolio = {
  statistics: MARKETPLACE_STATISTICS,
  analytics: MARKETPLACE_ANALYTICS,
  salesDashboard: MARKETPLACE_SALES_DASHBOARD,
  revenueDashboard: MARKETPLACE_REVENUE_DASHBOARD,
  vendors: VENDORS,
  storefronts: STOREFRONTS,
  listings: LISTINGS,
  reviews: REVIEWS,
  orders: ORDERS,
  invoices: INVOICES,
  payments: PAYMENTS,
  refunds: REFUNDS,
  disputes: DISPUTES,
  coupons: COUPONS,
  promotions: PROMOTIONS,
  bundles: BUNDLES,
  bookings: BOOKINGS,
  conversations: CONVERSATIONS,
  notifications: NOTIFICATIONS,
  wishlists: WISHLISTS,
  guestAdvertisers: GUEST_ADVERTISERS,
  recommendations: RECOMMENDATIONS,
  discoveryItems: MARKETPLACE_DISCOVERY_ITEMS,
};
