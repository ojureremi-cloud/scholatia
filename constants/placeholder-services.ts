import type {
  CareerStage,
  CurrencyCode,
} from '@/types/funding';
import type {
  DiscoveryEntityType,
  DiscoveryItem,
} from '@/types/discovery';
import type {
  ResearchLifecycleStageId,
} from '@/types/research';
import type {
  ResearcherPositionType,
  ResearcherProfile,
} from '@/types/researcher';
import type {
  Service,
  ServiceAdMetrics,
  ServiceBoostLevel,
  ServiceCategory,
  ServiceCategoryGroup,
  ServiceMarketplaceAnalytics,
  ServiceOrder,
  ServiceOrderMilestone,
  ServiceOrderStatus,
  ServicePackage,
  ServicePaymentStatus,
  ServicePortfolio,
  ServicePortfolioItem,
  ServicePriceInterval,
  ServiceProvider,
  ServiceProviderAvailability,
  ServiceProviderAvailabilityStatus,
  ServiceProviderBadge,
  ServiceProviderCertification,
  ServiceProviderSkill,
  ServiceProviderType,
  ServiceRatingDistribution,
  ServiceRatingSummary,
  ServiceRecommendation,
  ServiceReview,
  ServiceStatistics,
  ServiceStatus,
  ServiceTestimonial,
  ServiceType,
  ServiceDispute,
  ServiceDisputeStatus,
  ServiceRequirement,
  ProviderStatistics,
} from '@/types/services';
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_GROUPS,
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_GROUP_ICONS,
  SERVICE_CATEGORY_GROUP_LABELS,
  SERVICE_CATEGORY_ICONS,
  SERVICE_CATEGORY_TO_GROUP,
  SERVICE_DELIVERY_BASE_DAYS,
  SERVICE_PROVIDER_TYPE_LABELS,
  SERVICE_TYPE_LABELS,
  SERVICE_TO_DISCOVERY_ENTITY,
  servicePromotableEntityType,
} from '@/types/services';

import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS } from '@/constants/placeholder-research';
import { FUNDING_OPPORTUNITIES } from '@/constants/placeholder-funding';

import {
  buildProviderUrl,
  buildServiceRecommendation,
  buildServiceUrl,
  bundleServices,
  effectiveServicePrice,
  estimateDelivery,
  marketplaceAnalytics,
  providerStatistics,
  servicePromotableObject,
  serviceStatistics,
  sortServices,
  toDiscoveryItems,
  searchServices,
  topRated,
  newest,
  relatedServices,
  frequentlyBoughtTogether,
} from '@/lib/services';
import type { ServiceBundle } from '@/lib/services';
import { registerPromotableObjects } from '@/lib/ads';
import { createSaidIdentifier } from '@/lib/said';

/**
 * Placeholder data for the Scholatia Research Services Marketplace
 * (Phase 2.1).
 *
 * The Research Services Marketplace is the platform-wide professional services
 * layer for academia: 60 verified providers, 150+ research services across 40
 * categories, 40 reviews, 40 portfolio items, 40 testimonials, 40 completed
 * jobs (orders), 20 milestones, and 20 disputes. Every provider reuses an
 * existing researcher identity when applicable, every service is promotable
 * through the Advertising module and searchable through the Discovery module,
 * and every order, review, milestone, and dispute is derived from the pure
 * engine in `lib/services.ts`.
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

function ratingSummaryFor(average: number, count: number): ServiceRatingSummary {
  const distribution: ServiceRatingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  if (count === 0) return { average: 0, count: 0, distribution };
  const a = Math.max(1, Math.min(5, average));
  const weights = [1, 2, 3, 4, 5].map((star) => {
    const diff = a - star;
    return Math.max(0.05, 1 / (1 + diff * diff));
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  (['1', '2', '3', '4', '5'] as const).forEach((star, index) => {
    distribution[star] = Math.round((weights[index] / total) * count);
  });
  const assigned = (Object.values(distribution) as number[]).reduce((sum, value) => sum + value, 0);
  distribution['5'] += count - assigned;
  return { average: Math.round(average * 10) / 10, count, distribution };
}

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

type ProviderSeed = {
  id: string;
  username: string;
  name?: string;
  type: ServiceProviderType;
  headline: string;
  tagline: string;
  description: string;
  country?: string;
  city?: string;
  institution?: string;
  institutionId?: string;
  position?: ResearcherPositionType;
  department?: string;
  researcherUsername?: string;
  specializations: string[];
  skills?: { name: string; category: string; level: SkillLevel }[];
  certifications?: { name: string; issuer: string; year: string }[];
  languages?: string[];
  responseTime?: string;
  availabilityStatus?: ServiceProviderAvailabilityStatus;
  openSlots?: number;
  weeklyHours?: number;
  nextAvailable?: string;
  verified?: boolean;
  trustScore?: number;
  ratingAverage?: number;
  ratingCount?: number;
  completedJobs?: number;
  memberSince?: string;
  joinedAt?: string;
  followers?: number;
  featured?: boolean;
  badges?: ServiceProviderBadge[];
};

// ---------------------------------------------------------------------------
// Provider default pools
// ---------------------------------------------------------------------------

const SKILL_LEVEL_BY_TYPE: Record<ServiceProviderType, SkillLevel> = {
  researcher: 'Expert',
  statistician: 'Expert',
  methodologist: 'Advanced',
  'qualitative-analyst': 'Advanced',
  'data-analyst': 'Advanced',
  editor: 'Expert',
  translator: 'Advanced',
  grantwriter: 'Expert',
  'academic-writer': 'Expert',
  consultant: 'Advanced',
  mentor: 'Advanced',
  tutor: 'Intermediate',
  designer: 'Advanced',
};

const TYPE_SKILLS: Record<ServiceProviderType, { name: string; category: string; level: SkillLevel }[]> = {
  researcher: [
    { name: 'Research Methodology', category: 'Research', level: 'Expert' },
    { name: 'Academic Writing', category: 'Professional', level: 'Advanced' },
    { name: 'Project Management', category: 'Professional', level: 'Advanced' },
  ],
  statistician: [
    { name: 'Statistical Modeling', category: 'Statistics', level: 'Expert' },
    { name: 'R Programming', category: 'Statistics', level: 'Expert' },
    { name: 'SPSS', category: 'Statistics', level: 'Advanced' },
    { name: 'Data Visualization', category: 'Statistics', level: 'Advanced' },
  ],
  methodologist: [
    { name: 'Study Design', category: 'Research', level: 'Expert' },
    { name: 'Sampling Strategy', category: 'Research', level: 'Advanced' },
    { name: 'Statistical Methods', category: 'Research', level: 'Advanced' },
  ],
  'qualitative-analyst': [
    { name: 'Qualitative Coding', category: 'Qualitative', level: 'Expert' },
    { name: 'Thematic Analysis', category: 'Qualitative', level: 'Expert' },
    { name: 'NVivo', category: 'Qualitative', level: 'Advanced' },
    { name: 'Interview Design', category: 'Qualitative', level: 'Advanced' },
  ],
  'data-analyst': [
    { name: 'Data Wrangling', category: 'Data', level: 'Expert' },
    { name: 'Python', category: 'Data', level: 'Expert' },
    { name: 'SQL', category: 'Data', level: 'Advanced' },
    { name: 'Data Visualization', category: 'Data', level: 'Advanced' },
  ],
  editor: [
    { name: 'Copy Editing', category: 'Editing', level: 'Expert' },
    { name: 'Proofreading', category: 'Editing', level: 'Expert' },
    { name: 'Style Guides (APA/MLA/Chicago)', category: 'Editing', level: 'Advanced' },
    { name: 'Academic English', category: 'Editing', level: 'Expert' },
  ],
  translator: [
    { name: 'Academic Translation', category: 'Translation', level: 'Expert' },
    { name: 'Terminology Management', category: 'Translation', level: 'Advanced' },
    { name: 'Localization', category: 'Translation', level: 'Advanced' },
  ],
  grantwriter: [
    { name: 'Proposal Writing', category: 'Grants', level: 'Expert' },
    { name: 'Budget Development', category: 'Grants', level: 'Advanced' },
    { name: 'Funder Relations', category: 'Grants', level: 'Advanced' },
    { name: 'Impact Frameworks', category: 'Grants', level: 'Advanced' },
  ],
  'academic-writer': [
    { name: 'Scholarly Writing', category: 'Writing', level: 'Expert' },
    { name: 'Literature Synthesis', category: 'Writing', level: 'Expert' },
    { name: 'Thesis Structuring', category: 'Writing', level: 'Advanced' },
  ],
  consultant: [
    { name: 'Research Strategy', category: 'Consulting', level: 'Expert' },
    { name: 'Policy Analysis', category: 'Consulting', level: 'Advanced' },
    { name: 'Stakeholder Engagement', category: 'Consulting', level: 'Advanced' },
  ],
  mentor: [
    { name: 'Career Coaching', category: 'Mentoring', level: 'Expert' },
    { name: 'Research Mentoring', category: 'Mentoring', level: 'Advanced' },
    { name: 'Feedback Delivery', category: 'Mentoring', level: 'Advanced' },
  ],
  tutor: [
    { name: 'Subject Tutoring', category: 'Teaching', level: 'Advanced' },
    { name: 'Exam Preparation', category: 'Teaching', level: 'Advanced' },
    { name: 'Lesson Design', category: 'Teaching', level: 'Intermediate' },
  ],
  designer: [
    { name: 'Scientific Poster Design', category: 'Design', level: 'Expert' },
    { name: 'Data Visualization', category: 'Design', level: 'Expert' },
    { name: 'Graphic Design', category: 'Design', level: 'Advanced' },
  ],
};

const TYPE_CERTIFICATIONS: Record<ServiceProviderType, { name: string; issuer: string; year: string }[]> = {
  researcher: [{ name: 'Research Integrity Certification', issuer: 'Scholatia Academy', year: '2023' }],
  statistician: [
    { name: 'Certified Statistical Analyst', issuer: 'American Statistical Association', year: '2021' },
    { name: 'Advanced R Programming', issuer: 'DataCamp', year: '2022' },
  ],
  methodologist: [{ name: 'Clinical Research Methodology', issuer: 'NIH Training', year: '2020' }],
  'qualitative-analyst': [{ name: 'Qualitative Research Methods', issuer: 'QSR International', year: '2021' }],
  'data-analyst': [
    { name: 'Python for Data Science', issuer: 'Coursera', year: '2022' },
    { name: 'SQL for Analysts', issuer: 'edX', year: '2021' },
  ],
  editor: [{ name: 'Professional Editing Certification', issuer: 'Editorial Freelancers Association', year: '2019' }],
  translator: [{ name: 'Certified Academic Translator', issuer: 'International Federation of Translators', year: '2020' }],
  grantwriter: [{ name: 'Certified Grant Writer', issuer: 'Grant Professionals Association', year: '2021' }],
  'academic-writer': [{ name: 'Academic Writing Certification', issuer: 'Cambridge Professional Development', year: '2020' }],
  consultant: [{ name: 'Research Management Professional', issuer: 'ARMA International', year: '2022' }],
  mentor: [{ name: 'Mentoring Excellence Certificate', issuer: 'National Center for Faculty Development', year: '2021' }],
  tutor: [{ name: 'TESOL Certification', issuer: 'Cambridge Assessment', year: '2019' }],
  designer: [{ name: 'Professional Design Certification', issuer: 'Adobe', year: '2022' }],
};

const LANGUAGE_BY_COUNTRY: Record<string, string[]> = {
  Nigeria: ['English', 'Yoruba'],
  'United Kingdom': ['English', 'French'],
  Kenya: ['English', 'Swahili'],
  Ghana: ['English', 'Twi'],
  Poland: ['English', 'Polish'],
  India: ['English', 'Hindi'],
  Italy: ['English', 'Italian'],
  'South Korea': ['English', 'Korean'],
  France: ['English', 'French'],
  Mexico: ['English', 'Spanish'],
  Germany: ['English', 'German'],
  Senegal: ['English', 'French'],
  Egypt: ['English', 'Arabic'],
  Lebanon: ['English', 'Arabic'],
  China: ['English', 'Mandarin'],
  Denmark: ['English', 'Danish'],
  Brazil: ['English', 'Portuguese'],
  Spain: ['English', 'Spanish'],
  Bangladesh: ['English', 'Bengali'],
  Taiwan: ['English', 'Mandarin'],
  Pakistan: ['English', 'Urdu'],
  Russia: ['English', 'Russian'],
  'Saudi Arabia': ['English', 'Arabic'],
  Canada: ['English', 'French'],
  Uganda: ['English', 'Swahili'],
  'South Africa': ['English', 'Zulu'],
  Japan: ['English', 'Japanese'],
  Switzerland: ['English', 'German'],
  'United States': ['English', 'Spanish'],
  Argentina: ['English', 'Spanish'],
  Portugal: ['English', 'Portuguese'],
  Ethiopia: ['English', 'Amharic'],
  Zambia: ['English', 'Bemba'],
  Rwanda: ['English', 'Kinyarwanda'],
  Zimbabwe: ['English', 'Shona'],
  Morocco: ['English', 'Arabic'],
  Turkey: ['English', 'Turkish'],
  Indonesia: ['English', 'Indonesian'],
  Vietnam: ['English', 'Vietnamese'],
  Chile: ['English', 'Spanish'],
};

const PORTFOLIO_POOL: { title: string; result: string }[] = [
  { title: 'Multi-country survey data analysis', result: 'Delivered a 120-page analysis report with full methodology appendix.' },
  { title: 'Systematic review with meta-analysis', result: 'Published in a Q1 journal; 14 studies synthesised.' },
  { title: 'Grant proposal for climate resilience', result: 'Awarded a £480,000 international grant.' },
  { title: 'Editorial pass on a doctoral thesis', result: 'Thesis accepted with minor revisions after two editing rounds.' },
  { title: 'Qualitative study of health worker retention', result: 'Thematic framework adopted by the ministry.' },
  { title: 'Machine learning model for publication trends', result: 'Model reached 91% accuracy and was deployed in a dashboard.' },
  { title: 'Data visualisation for an annual research report', result: 'Dashboards viewed by 12,000+ stakeholders.' },
  { title: 'Language polishing for a methods paper', result: 'Accepted at a Nature-family journal after polishing.' },
  { title: 'Interview transcription and coding for an education study', result: '38 interviews coded with 0.92 inter-coder reliability.' },
  { title: 'Publication strategy for an early-career researcher', result: 'Built a 3-year roadmap; first paper accepted in 4 months.' },
  { title: 'Econometric analysis of market access', result: 'Instrumental-variable analysis published in a field journal.' },
  { title: 'Poster design for a national conference', result: 'Won Best Poster at the national research conference.' },
];

const TESTIMONIAL_COMMENTS: string[] = [
  'Exceptionally thorough work with clear, honest communication throughout. Highly recommend.',
  'Delivered exactly what the proposal required and answered every question patiently.',
  'Turnaround was faster than promised and the quality was outstanding.',
  'A true expert who explained the methods so my committee could follow them easily.',
  'Went above and beyond — the analysis survived two rounds of very tough reviewer comments.',
  'Professional, punctual, and genuinely invested in the success of my research.',
  'The best academic support I have used; would not have met the deadline without them.',
  'Clear explanations, rigorous methods, and a real interest in the subject area.',
];

const BUYER_NAMES = [
  'Dr. Amina Yusuf',
  'Prof. Peter Osei',
  'Dr. Maria Lopez',
  'Dr. Chen Wei',
  'Prof. Grace Adhiambo',
  'Dr. Samuel Okafor',
  'Dr. Rina Sharma',
  'Prof. David Mensah',
  'Dr. Fatima Al-Mansouri',
  'Dr. Tom Becker',
  'Prof. Nneka Eze',
  'Dr. Lucas Silva',
];

// ---------------------------------------------------------------------------
// Provider seeds — 22 researcher-linked + 38 specialist providers
// ---------------------------------------------------------------------------

const PROVIDER_SEEDS: ProviderSeed[] = [
  // -- Researcher-linked providers (reuse existing SAID identities) --
  {
    id: 'prov-ojuri', username: 'ojuri', researcherUsername: 'ojuri', type: 'statistician',
    headline: 'Biostatistician & Public Health Researcher',
    tagline: '20+ years of field epidemiology and health data analysis',
    description: 'Professor of Public Health and Tropical Medicine at the University of Ibadan offering biostatistical analysis, study design, and grant writing for health research across West Africa.',
    specializations: ['Biostatistics', 'Epidemiology', 'Health research'],
    responseTime: 'Within 3 working days',
    ratingAverage: 4.9, ratingCount: 86, completedJobs: 164,
  },
  {
    id: 'prov-smith', username: 'smith', researcherUsername: 'smith', type: 'editor',
    headline: 'Academic Editor & Manuscript Historian',
    tagline: 'Senior medievalist specialising in editorial polish and archival rigour',
    description: 'Professor of Medieval History at the University of Cambridge offering rigorous academic editing, language polishing, and manuscript preparation grounded in decades of scholarly publishing.',
    specializations: ['Academic editing', 'Manuscript preparation', 'Digital humanities'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.8, ratingCount: 74, completedJobs: 141,
  },
  {
    id: 'prov-adebayo', username: 'adebayo', researcherUsername: 'adebayo', type: 'consultant',
    headline: 'Energy Systems Research Consultant',
    tagline: 'Distinguished professor advising on energy research design and strategy',
    description: 'Distinguished Professor of Energy Engineering at the University of Lagos offering research design, methodology consulting, and grant strategy for engineering and energy research.',
    specializations: ['Research design', 'Grant strategy', 'Engineering research'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.9, ratingCount: 92, completedJobs: 178,
  },
  {
    id: 'prov-maria', username: 'maria', researcherUsername: 'maria', type: 'statistician',
    headline: 'Astrophysicist & Statistical Analyst',
    tagline: 'High-performance data analysis for quantitative researchers',
    description: 'Astrophysicist at UNAM offering statistical analysis and Python-based data analysis for demanding quantitative research, from survey data to large observational datasets.',
    specializations: ['Statistical analysis', 'Python', 'Large datasets'],
    responseTime: 'Within 2 working days',
    ratingAverage: 5.0, ratingCount: 61, completedJobs: 120,
  },
  {
    id: 'prov-jscholar', username: 'jscholar', researcherUsername: 'jscholar', type: 'academic-writer',
    headline: 'Academic Writer & Language Specialist',
    tagline: 'Publishes and polishes across linguistics and the humanities',
    description: 'Cambridge researcher specialising in academic writing, language polishing, and publication strategy for authors whose first language is not English.',
    specializations: ['Academic writing', 'Language polishing', 'Publication strategy'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.7, ratingCount: 58, completedJobs: 133,
  },
  {
    id: 'prov-tanaka', username: 'tanaka', researcherUsername: 'tanaka', type: 'data-analyst',
    headline: 'Robotics Engineer & Machine Learning Specialist',
    tagline: 'Practical machine learning and technical writing for applied research',
    description: 'Professor of Robotics at the University of Tokyo offering machine learning modelling, Python data analysis, and technical writing for applied and engineering research.',
    specializations: ['Machine learning', 'Python', 'Technical writing'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.8, ratingCount: 67, completedJobs: 150,
  },
  {
    id: 'prov-okonkwo', username: 'okonkwo', researcherUsername: 'okonkwo', type: 'data-analyst',
    headline: 'AI Researcher & Python Analyst',
    tagline: 'From messy data to reproducible analysis pipelines',
    description: 'AI researcher at Obafemi Awolowo University offering Python data analysis, machine learning modelling, and data cleaning with reproducible pipelines.',
    specializations: ['Python', 'Machine learning', 'Data cleaning'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.9, ratingCount: 83, completedJobs: 159,
  },
  {
    id: 'prov-dube', username: 'dube', researcherUsername: 'dube', type: 'statistician',
    headline: 'Bioinformatics Statistician',
    tagline: 'Statistical rigour for genomics and health research',
    description: 'Bioinformatics researcher at the University of Cape Town offering biostatistics, statistical analysis, and machine learning for genomics and health data.',
    specializations: ['Biostatistics', 'Genomics', 'Machine learning'],
    responseTime: 'Within 3 working days',
    ratingAverage: 4.8, ratingCount: 55, completedJobs: 118,
  },
  {
    id: 'prov-rivers', username: 'rivers', researcherUsername: 'rivers', type: 'data-analyst',
    headline: 'Climate Data Scientist & Visualisation Expert',
    tagline: 'Turning climate and environmental data into clear visuals',
    description: 'Climate scientist at Stanford University offering statistical analysis, data cleaning, and data visualisation for environmental and climate research.',
    specializations: ['Data visualisation', 'Statistical analysis', 'Climate data'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.9, ratingCount: 49, completedJobs: 104,
  },
  {
    id: 'prov-kim', username: 'kim', researcherUsername: 'kim', type: 'methodologist',
    headline: 'Materials Scientist & Research Methodologist',
    tagline: 'Study design and technical writing for materials research',
    description: 'Professor of Materials Science at Seoul National University offering research design, methodology consulting, and technical writing for experimental research.',
    specializations: ['Research design', 'Methodology', 'Technical writing'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.7, ratingCount: 44, completedJobs: 97,
  },
  {
    id: 'prov-schneider', username: 'schneider', researcherUsername: 'schneider', type: 'methodologist',
    headline: 'Quantum Computing Methodologist',
    tagline: 'Advanced methodology consulting for frontier research',
    description: 'Quantum computing researcher at ETH Zurich offering methodology consulting and statistical analysis for frontier experimental and theoretical research.',
    specializations: ['Methodology', 'Statistical analysis', 'Physics'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.8, ratingCount: 39, completedJobs: 86,
  },
  {
    id: 'prov-adesina', username: 'adesina', researcherUsername: 'adesina', type: 'statistician',
    headline: 'Agricultural Economist & Econometrician',
    tagline: 'Causal analysis and survey design for development research',
    description: 'Agricultural economist at the University of Ghana offering econometrics, survey design, and statistical analysis for development and agricultural research.',
    specializations: ['Econometrics', 'Survey design', 'Development research'],
    responseTime: 'Within 3 working days',
    ratingAverage: 4.8, ratingCount: 62, completedJobs: 128,
  },
  {
    id: 'prov-das', username: 'das', researcherUsername: 'das', type: 'data-analyst',
    headline: 'Machine Learning Researcher & Analyst',
    tagline: 'Robust models and reproducible analysis for ML research',
    description: 'Machine learning researcher at the Indian Institute of Science offering machine learning modelling, Python analysis, and model evaluation services.',
    specializations: ['Machine learning', 'Python', 'Model evaluation'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.9, ratingCount: 71, completedJobs: 145,
  },
  {
    id: 'prov-okafor', username: 'okafor', researcherUsername: 'okafor', type: 'data-analyst',
    headline: 'Software Engineer & Data Analyst',
    tagline: 'Reproducible data pipelines for research teams',
    description: 'Software engineering researcher at the University of Nigeria offering Python data analysis, data cleaning, and technical writing for research software.',
    specializations: ['Python', 'Data cleaning', 'Technical writing'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.7, ratingCount: 47, completedJobs: 112,
  },
  {
    id: 'prov-wang', username: 'wang', researcherUsername: 'wang', type: 'statistician',
    headline: 'Network Scientist & Statistician',
    tagline: 'Statistical analysis and visualisation for complex systems',
    description: 'Professor of Network Science at Tsinghua University offering statistical analysis, data visualisation, and methodology consulting for complex-systems research.',
    specializations: ['Statistical analysis', 'Data visualisation', 'Network science'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.8, ratingCount: 66, completedJobs: 139,
  },
  {
    id: 'prov-mbatha', username: 'mbatha', researcherUsername: 'mbatha', type: 'statistician',
    headline: 'Bioinformatics & Literature Specialist',
    tagline: 'Biostatistics, systematic reviews, and evidence synthesis',
    description: 'Bioinformatics researcher offering biostatistics, systematic reviews, and meta-analysis for health and life-sciences research across southern Africa.',
    specializations: ['Biostatistics', 'Systematic review', 'Meta-analysis'],
    responseTime: 'Within 3 working days',
    ratingAverage: 4.8, ratingCount: 41, completedJobs: 90,
  },
  {
    id: 'prov-kovacs', username: 'kovacs', researcherUsername: 'kovacs', type: 'tutor',
    headline: 'Mathematician & Research Tutor',
    tagline: 'Clear tutoring for mathematics and quantitative methods',
    description: 'Mathematician offering tutoring and exam preparation in mathematics, statistics, and quantitative methods, plus statistical analysis for research.',
    specializations: ['Tutoring', 'Statistics', 'Mathematics'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.9, ratingCount: 88, completedJobs: 167,
  },
  {
    id: 'prov-almeida', username: 'almeida', researcherUsername: 'almeida', type: 'data-analyst',
    headline: 'Oceanographer & Data Specialist',
    tagline: 'Data cleaning and visualisation for environmental science',
    description: 'Professor of Oceanography at the University of Lisbon offering data cleaning, data visualisation, and statistical analysis for environmental data.',
    specializations: ['Data cleaning', 'Data visualisation', 'Environmental data'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.7, ratingCount: 36, completedJobs: 82,
  },
  {
    id: 'prov-hussain', username: 'hussain', researcherUsername: 'hussain', type: 'qualitative-analyst',
    headline: 'Public Policy Qualitative Analyst',
    tagline: 'Interview and focus-group analysis for policy research',
    description: 'Public policy researcher at the University of Lahore offering qualitative analysis, thematic analysis, and proposal development for policy and social research.',
    specializations: ['Qualitative analysis', 'Thematic analysis', 'Proposals'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.8, ratingCount: 52, completedJobs: 106,
  },
  {
    id: 'prov-ndlovu', username: 'ndlovu', researcherUsername: 'ndlovu', type: 'consultant',
    headline: 'Cybersecurity Research Consultant',
    tagline: 'Research design and technical writing for computing research',
    description: 'Cybersecurity researcher at CSIR offering research design, methodology consulting, and technical writing for computing and information-systems research.',
    specializations: ['Research design', 'Technical writing', 'Computing'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.7, ratingCount: 33, completedJobs: 76,
  },
  {
    id: 'prov-gallo', username: 'gallo', researcherUsername: 'gallo', type: 'academic-writer',
    headline: 'Linguist & Academic Translator',
    tagline: 'Writing, translation, and mentoring across the humanities',
    description: 'Linguist at the University of Buenos Aires offering academic writing, translation, and academic mentoring for researchers across the humanities and social sciences.',
    specializations: ['Academic writing', 'Translation', 'Mentoring'],
    responseTime: 'Within 2 working days',
    ratingAverage: 4.8, ratingCount: 45, completedJobs: 99,
  },
  {
    id: 'prov-yusuf', username: 'yusuf', researcherUsername: 'yusuf', type: 'mentor',
    headline: 'Academic Mentor & Career Coach',
    tagline: 'Guiding early-career researchers through the academic path',
    description: 'Early-career researcher mentor offering academic mentoring, career development, and publication strategy for postgraduate and early-career researchers.',
    specializations: ['Mentoring', 'Career development', 'Publication strategy'],
    responseTime: 'Within 1 working day',
    ratingAverage: 4.9, ratingCount: 57, completedJobs: 121,
  },

  // -- Specialist providers (standalone experts) --
  {
    id: 'prov-anna', username: 'anna', type: 'editor',
    headline: 'Academic Editor (English)',
    tagline: 'Native-level editing for non-native English authors',
    description: 'Doctoral-level editor in Warsaw specialising in language polishing, editing, and referencing for social-science and humanities manuscripts.',
    country: 'Poland', city: 'Warsaw', institution: 'University of Warsaw',
    specializations: ['Editing', 'Language polishing', 'Referencing'],
    ratingAverage: 4.9, ratingCount: 78, completedJobs: 152,
  },
  {
    id: 'prov-raj', username: 'raj', type: 'editor',
    headline: 'Senior Academic Editor',
    tagline: 'Editorial support across the sciences and engineering',
    description: 'Former journal editor in Delhi offering editing, proofreading, and journal formatting with deep knowledge of author guidelines.',
    country: 'India', city: 'New Delhi', institution: 'Indian Institute of Technology Delhi',
    specializations: ['Editing', 'Formatting', 'Submission support'],
    ratingAverage: 4.8, ratingCount: 63, completedJobs: 131,
  },
  {
    id: 'prov-grace', username: 'grace', type: 'editor',
    headline: 'Academic Editor & Proofreader',
    tagline: 'Meticulous editing for theses, articles, and reports',
    description: 'Editor in Accra offering editing, proofreading, and language polishing for graduate theses and journal articles.',
    country: 'Ghana', city: 'Accra', institution: 'University of Ghana',
    specializations: ['Editing', 'Proofreading', 'Theses'],
    ratingAverage: 4.7, ratingCount: 40, completedJobs: 95,
  },
  {
    id: 'prov-luisa', username: 'luisa', type: 'editor',
    headline: 'Humanities Editor & Italianist',
    tagline: 'Editorial craft for history, literature, and the humanities',
    description: 'Editor in Rome specialising in humanities editing, referencing, and formatting across European academic traditions.',
    country: 'Italy', city: 'Rome', institution: 'Sapienza University of Rome',
    specializations: ['Editing', 'Referencing', 'Humanities'],
    ratingAverage: 4.8, ratingCount: 34, completedJobs: 73,
  },
  {
    id: 'prov-hana', username: 'hana', type: 'translator',
    headline: 'Academic Translator (EN-KO)',
    tagline: 'Precise academic translation for Korean researchers',
    description: 'Translator in Seoul offering academic translation, language polishing, and terminology management for English–Korean research.',
    country: 'South Korea', city: 'Seoul', institution: 'Korea University',
    specializations: ['Translation', 'Language polishing', 'Terminology'],
    ratingAverage: 4.9, ratingCount: 59, completedJobs: 122,
  },
  {
    id: 'prov-pierre', username: 'pierre', type: 'translator',
    headline: 'Academic Translator (EN-FR)',
    tagline: 'Faithful scientific translation for francophone authors',
    description: 'Translator in Paris offering academic translation and language polishing for French and English research manuscripts.',
    country: 'France', city: 'Paris', institution: 'Sorbonne University',
    specializations: ['Translation', 'Language polishing'],
    ratingAverage: 4.8, ratingCount: 47, completedJobs: 101,
  },
  {
    id: 'prov-susan', username: 'susan', type: 'grantwriter',
    headline: 'Professional Grant Writer',
    tagline: 'Winning proposals for UK and European funders',
    description: 'Grant writer in London with a 40+ proposal track record across research councils, foundations, and EU programmes.',
    country: 'United Kingdom', city: 'London', institution: 'University College London',
    specializations: ['Grant writing', 'Proposals', 'Budget development'],
    ratingAverage: 4.9, ratingCount: 81, completedJobs: 143,
  },
  {
    id: 'prov-diego', username: 'diego', type: 'grantwriter',
    headline: 'Grant Writer & Proposal Strategist',
    tagline: 'Funding strategy for Latin American research',
    description: 'Grant writer in Mexico City supporting researchers with funding strategy, proposal development, and budget preparation for national and international calls.',
    country: 'Mexico', city: 'Mexico City', institution: 'UNAM',
    specializations: ['Grant writing', 'Funding strategy', 'Proposals'],
    ratingAverage: 4.8, ratingCount: 52, completedJobs: 108,
  },
  {
    id: 'prov-priya', username: 'priya', type: 'statistician',
    headline: 'Statistical Consultant',
    tagline: 'Applied statistics for surveys, experiments, and trials',
    description: 'Statistician in Bangalore offering statistical analysis, SPSS analysis, and survey design for social and behavioural research.',
    country: 'India', city: 'Bangalore', institution: 'Indian Statistical Institute',
    specializations: ['Statistical analysis', 'SPSS', 'Survey design'],
    ratingAverage: 4.9, ratingCount: 90, completedJobs: 174,
  },
  {
    id: 'prov-martin', username: 'martin', type: 'statistician',
    headline: 'Statistical Analyst & Methodologist',
    tagline: 'Rigorous quantitative support for European researchers',
    description: 'Statistician in Berlin offering statistical analysis, biostatistics, and methodology consulting across the social and health sciences.',
    country: 'Germany', city: 'Berlin', institution: 'Humboldt University of Berlin',
    specializations: ['Statistical analysis', 'Biostatistics', 'Methodology'],
    ratingAverage: 4.8, ratingCount: 65, completedJobs: 136,
  },
  {
    id: 'prov-amara', username: 'amara', type: 'statistician',
    headline: 'Biostatistician',
    tagline: 'Health-data analysis for African research programmes',
    description: 'Biostatistician in Dakar offering biostatistics, statistical analysis, and data cleaning for public-health and clinical research.',
    country: 'Senegal', city: 'Dakar', institution: 'Université Cheikh Anta Diop',
    specializations: ['Biostatistics', 'Statistical analysis', 'Health data'],
    ratingAverage: 4.8, ratingCount: 43, completedJobs: 89,
  },
  {
    id: 'prov-thomas', username: 'thomas', type: 'statistician',
    headline: 'Econometrician & Statistician',
    tagline: 'Causal inference for development and economics research',
    description: 'Statistician in Nairobi offering econometrics, statistical analysis, and survey design for development economics and public policy.',
    country: 'Kenya', city: 'Nairobi', institution: 'University of Nairobi',
    specializations: ['Econometrics', 'Statistical analysis', 'Survey design'],
    ratingAverage: 4.7, ratingCount: 38, completedJobs: 84,
  },
  {
    id: 'prov-claire', username: 'claire', type: 'methodologist',
    headline: 'Research Methodologist',
    tagline: 'Mixed-methods design for social research',
    description: 'Methodologist in Lyon offering research design, methodology consulting, and survey design for mixed-methods social research.',
    country: 'France', city: 'Lyon', institution: 'Université Lumière Lyon 2',
    specializations: ['Research design', 'Methodology', 'Mixed methods'],
    ratingAverage: 4.8, ratingCount: 46, completedJobs: 98,
  },
  {
    id: 'prov-john', username: 'john', type: 'methodologist',
    headline: 'Methodology & Research Design Consultant',
    tagline: 'Study designs that withstand peer review',
    description: 'Methodologist in Kumasi offering research design, methodology consulting, and proposal development for West African research teams.',
    country: 'Ghana', city: 'Kumasi', institution: 'Kwame Nkrumah University of Science and Technology',
    specializations: ['Research design', 'Methodology', 'Proposals'],
    ratingAverage: 4.8, ratingCount: 37, completedJobs: 79,
  },
  {
    id: 'prov-sara', username: 'sara', type: 'qualitative-analyst',
    headline: 'Qualitative Researcher',
    tagline: 'Interview and focus-group analysis for social research',
    description: 'Qualitative researcher in Cairo offering qualitative analysis, thematic analysis, and NVivo analysis for health and social research.',
    country: 'Egypt', city: 'Cairo', institution: 'Cairo University',
    specializations: ['Qualitative analysis', 'Thematic analysis', 'NVivo'],
    ratingAverage: 4.9, ratingCount: 54, completedJobs: 110,
  },
  {
    id: 'prov-leila', username: 'leila', type: 'qualitative-analyst',
    headline: 'Qualitative & Mixed-Methods Analyst',
    tagline: 'Sensitive, rigorous analysis of lived experience',
    description: 'Qualitative researcher in Beirut offering thematic analysis, grounded theory, and interview analysis for education, health, and conflict studies.',
    country: 'Lebanon', city: 'Beirut', institution: 'American University of Beirut',
    specializations: ['Qualitative analysis', 'Grounded theory', 'Thematic analysis'],
    ratingAverage: 4.8, ratingCount: 31, completedJobs: 68,
  },
  {
    id: 'prov-peter', username: 'peter', type: 'qualitative-analyst',
    headline: 'NVivo Specialist',
    tagline: 'Systematic coding and querying with NVivo',
    description: 'Qualitative analyst in Enugu offering NVivo analysis, thematic analysis, and interview analysis for qualitative dissertations and studies.',
    country: 'Nigeria', city: 'Enugu', institution: 'University of Nigeria',
    specializations: ['NVivo', 'Thematic analysis', 'Interview analysis'],
    ratingAverage: 4.7, ratingCount: 29, completedJobs: 64,
  },
  {
    id: 'prov-wei', username: 'wei', type: 'data-analyst',
    headline: 'Data Analyst & Visualisation Engineer',
    tagline: 'Clean data and compelling visuals for research',
    description: 'Data analyst in Shanghai offering data cleaning, Python analysis, and data visualisation for business and policy research.',
    country: 'China', city: 'Shanghai', institution: 'Fudan University',
    specializations: ['Data cleaning', 'Python', 'Data visualisation'],
    ratingAverage: 4.8, ratingCount: 60, completedJobs: 125,
  },
  {
    id: 'prov-emma', username: 'emma', type: 'data-analyst',
    headline: 'Data Analyst (Nordics)',
    tagline: 'Reproducible analysis for public-sector research',
    description: 'Data analyst in Copenhagen offering data cleaning, statistical analysis, and visualisation for Nordic public-sector and social research.',
    country: 'Denmark', city: 'Copenhagen', institution: 'University of Copenhagen',
    specializations: ['Data cleaning', 'Statistical analysis', 'Visualisation'],
    ratingAverage: 4.8, ratingCount: 42, completedJobs: 88,
  },
  {
    id: 'prov-carlos', username: 'carlos', type: 'data-analyst',
    headline: 'Data Analyst & Statistician',
    tagline: 'Portuguese-language support for data-driven research',
    description: 'Data analyst in São Paulo offering Python analysis, statistical analysis, and data cleaning for Brazilian and Latin American research teams.',
    country: 'Brazil', city: 'São Paulo', institution: 'University of São Paulo',
    specializations: ['Python', 'Statistical analysis', 'Data cleaning'],
    ratingAverage: 4.7, ratingCount: 35, completedJobs: 77,
  },
  {
    id: 'prov-isabel', username: 'isabel', type: 'academic-writer',
    headline: 'Academic Writer (Spanish & English)',
    tagline: 'Bilingual academic writing for the humanities',
    description: 'Academic writer in Madrid offering academic writing, thesis writing, and language polishing in Spanish and English.',
    country: 'Spain', city: 'Madrid', institution: 'Complutense University of Madrid',
    specializations: ['Academic writing', 'Thesis writing', 'Language polishing'],
    ratingAverage: 4.8, ratingCount: 48, completedJobs: 103,
  },
  {
    id: 'prov-james', username: 'james', type: 'academic-writer',
    headline: 'Academic Writer (Social Sciences)',
    tagline: 'Structured, well-argued academic prose',
    description: 'Academic writer in Edinburgh specialising in literature reviews, thesis chapters, and social-science manuscripts.',
    country: 'United Kingdom', city: 'Edinburgh', institution: 'University of Edinburgh',
    specializations: ['Academic writing', 'Literature reviews', 'Thesis writing'],
    ratingAverage: 4.9, ratingCount: 72, completedJobs: 148,
  },
  {
    id: 'prov-nadia', username: 'nadia', type: 'academic-writer',
    headline: 'Academic Writer (South Asia)',
    tagline: 'Writing support for postgraduate researchers',
    description: 'Academic writer in Dhaka offering thesis writing, academic writing, and referencing support for postgraduate researchers across South Asia.',
    country: 'Bangladesh', city: 'Dhaka', institution: 'University of Dhaka',
    specializations: ['Thesis writing', 'Academic writing', 'Referencing'],
    ratingAverage: 4.7, ratingCount: 39, completedJobs: 87,
  },
  {
    id: 'prov-helen', username: 'helen', type: 'mentor',
    headline: 'Academic Mentor & Writing Coach',
    tagline: 'Guiding doctoral students to completion',
    description: 'Mentor in Lagos offering academic mentoring, thesis coaching, and career development for doctoral and early-career researchers.',
    country: 'Nigeria', city: 'Lagos', institution: 'University of Lagos',
    specializations: ['Mentoring', 'Thesis coaching', 'Career development'],
    ratingAverage: 4.9, ratingCount: 84, completedJobs: 156,
  },
  {
    id: 'prov-victor', username: 'victor', type: 'mentor',
    headline: 'Research Mentor & Grant Coach',
    tagline: 'From proposal idea to funded project',
    description: 'Mentor in Nairobi guiding early-career researchers through proposal development, publication strategy, and career planning.',
    country: 'Kenya', city: 'Nairobi', institution: 'Strathmore University',
    specializations: ['Mentoring', 'Grant coaching', 'Publication strategy'],
    ratingAverage: 4.8, ratingCount: 56, completedJobs: 114,
  },
  {
    id: 'prov-sophia', username: 'sophia', type: 'mentor',
    headline: 'Early-Career Research Mentor',
    tagline: 'Supporting the transition into independent research',
    description: 'Mentor in Taipei offering academic mentoring and career development for postgraduate and early-career researchers in East Asia.',
    country: 'Taiwan', city: 'Taipei', institution: 'National Taiwan University',
    specializations: ['Mentoring', 'Career development'],
    ratingAverage: 4.8, ratingCount: 44, completedJobs: 92,
  },
  {
    id: 'prov-marcus', username: 'marcus', type: 'tutor',
    headline: 'Research Tutor (Statistics & Methods)',
    tagline: 'Patient tutoring for quantitative courses',
    description: 'Tutor in Rio de Janeiro offering tutoring and exam preparation in statistics, research methods, and Python for undergraduates and postgraduates.',
    country: 'Brazil', city: 'Rio de Janeiro', institution: 'Federal University of Rio de Janeiro',
    specializations: ['Tutoring', 'Statistics', 'Research methods'],
    ratingAverage: 4.7, ratingCount: 66, completedJobs: 129,
  },
  {
    id: 'prov-ayesha', username: 'ayesha', type: 'tutor',
    headline: 'Academic Tutor (STEM)',
    tagline: 'Focused exam preparation for STEM students',
    description: 'Tutor in Karachi offering tutoring and exam preparation in mathematics, physics, and quantitative methods.',
    country: 'Pakistan', city: 'Karachi', institution: 'University of Karachi',
    specializations: ['Tutoring', 'Mathematics', 'Exam preparation'],
    ratingAverage: 4.6, ratingCount: 51, completedJobs: 116,
  },
  {
    id: 'prov-daniel', username: 'daniel', type: 'tutor',
    headline: 'Academic Writing Tutor',
    tagline: 'Helping students write better, faster',
    description: 'Tutor in Abuja offering academic writing tutoring, thesis coaching, and language polishing for undergraduate and postgraduate students.',
    country: 'Nigeria', city: 'Abuja', institution: 'University of Abuja',
    specializations: ['Tutoring', 'Academic writing', 'Language polishing'],
    ratingAverage: 4.7, ratingCount: 45, completedJobs: 94,
  },
  {
    id: 'prov-george', username: 'george', type: 'consultant',
    headline: 'Research & Policy Consultant',
    tagline: 'Evidence for West African policy and programmes',
    description: 'Consultant in Accra offering research consulting, policy analysis, and proposal development for NGOs and government programmes.',
    country: 'Ghana', city: 'Accra', institution: 'Institute for Statistical, Social and Economic Research',
    specializations: ['Consulting', 'Policy analysis', 'Proposals'],
    ratingAverage: 4.8, ratingCount: 58, completedJobs: 119,
  },
  {
    id: 'prov-elena', username: 'elena', type: 'consultant',
    headline: 'Research Strategy Consultant',
    tagline: 'Strategic advice for ambitious research programmes',
    description: 'Consultant in Moscow offering research strategy, publication strategy, and methodology consulting for large research programmes.',
    country: 'Russia', city: 'Moscow', institution: 'Moscow State University',
    specializations: ['Consulting', 'Publication strategy', 'Methodology'],
    ratingAverage: 4.7, ratingCount: 30, completedJobs: 61,
  },
  {
    id: 'prov-ahmed', username: 'ahmed', type: 'consultant',
    headline: 'Higher-Education Consultant',
    tagline: 'Institutional research strategy for the Gulf',
    description: 'Consultant in Riyadh advising universities on research strategy, capacity building, and publication culture.',
    country: 'Saudi Arabia', city: 'Riyadh', institution: 'King Saud University',
    specializations: ['Consulting', 'Research strategy', 'Capacity building'],
    ratingAverage: 4.8, ratingCount: 36, completedJobs: 75,
  },
  {
    id: 'prov-mia', username: 'mia', type: 'designer',
    headline: 'Scientific Illustrator & Poster Designer',
    tagline: 'Clear, beautiful figures and posters',
    description: 'Designer in Toronto specialising in scientific poster design, figure design, and data visualisation for conferences and publications.',
    country: 'Canada', city: 'Toronto', institution: 'University of Toronto',
    specializations: ['Poster design', 'Figure design', 'Visualisation'],
    ratingAverage: 4.9, ratingCount: 69, completedJobs: 134,
  },
  {
    id: 'prov-luca', username: 'luca', type: 'designer',
    headline: 'Academic Infographic Designer',
    tagline: 'Visuals that explain research to any audience',
    description: 'Designer in Milan offering poster design, infographics, and data visualisation for research communication.',
    country: 'Italy', city: 'Milan', institution: 'Polytechnic University of Milan',
    specializations: ['Poster design', 'Infographics', 'Visualisation'],
    ratingAverage: 4.7, ratingCount: 33, completedJobs: 71,
  },
  {
    id: 'prov-femi', username: 'femi', type: 'editor',
    headline: 'Editor & Referencing Specialist',
    tagline: 'Flawless citations in every style',
    description: 'Editor in Port Harcourt specialising in referencing, formatting, and editing for theses and journal submissions.',
    country: 'Nigeria', city: 'Port Harcourt', institution: 'University of Port Harcourt',
    specializations: ['Referencing', 'Formatting', 'Editing'],
    ratingAverage: 4.6, ratingCount: 28, completedJobs: 63,
  },
  {
    id: 'prov-linda', username: 'linda', type: 'grantwriter',
    headline: 'Grant Writer (East Africa)',
    tagline: 'Funding success for East African researchers',
    description: 'Grant writer in Kampala offering grant writing, proposal development, and budget preparation for East African research institutions.',
    country: 'Uganda', city: 'Kampala', institution: 'Makerere University',
    specializations: ['Grant writing', 'Proposals', 'Budget preparation'],
    ratingAverage: 4.8, ratingCount: 40, completedJobs: 85,
  },
  {
    id: 'prov-yuri', username: 'yuri', type: 'statistician',
    headline: 'Statistician & Data Scientist',
    tagline: 'Applied statistics for Russian and CIS research',
    description: 'Statistician in St. Petersburg offering statistical analysis and Python data analysis for Russian and CIS research teams.',
    country: 'Russia', city: 'St. Petersburg', institution: 'Saint Petersburg State University',
    specializations: ['Statistical analysis', 'Python', 'Data analysis'],
    ratingAverage: 4.7, ratingCount: 32, completedJobs: 69,
  },
  {
    id: 'prov-farida', username: 'farida', type: 'qualitative-analyst',
    headline: 'Qualitative Analyst (West Africa)',
    tagline: 'Rich analysis of interviews and community data',
    description: 'Qualitative analyst in Kano offering thematic analysis, qualitative analysis, and transcription analysis for West African research.',
    country: 'Nigeria', city: 'Kano', institution: 'Bayero University Kano',
    specializations: ['Thematic analysis', 'Qualitative analysis', 'Interviews'],
    ratingAverage: 4.7, ratingCount: 26, completedJobs: 58,
  },
];

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

const RESPONSE_TIME_DEFAULT = 'Within 2 working days';

function buildProviderAvailability(seed: ProviderSeed): ServiceProviderAvailability {
  const status: ServiceProviderAvailabilityStatus = seed.availabilityStatus ?? 'available';
  const openSlots = seed.openSlots ?? (status === 'available' ? 4 + (seed.username.length % 6) : status === 'busy' ? 1 : 0);
  return {
    status,
    openSlots,
    nextAvailable: seed.nextAvailable ?? (status === 'available' ? CURRENT_DATE : '2026-08-15'),
    weeklyHours: seed.weeklyHours ?? 20 + (seed.username.length % 20),
  };
}

function makeProvider(seed: ProviderSeed, index: number): ServiceProvider {
  const researcher = seed.researcherUsername ? researcherOf(seed.researcherUsername) : undefined;
  const name = seed.name ?? researcher?.displayName ?? seed.username.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  const country = seed.country ?? researcher?.country ?? 'United Kingdom';
  const city = seed.city ?? researcher?.position.city;
  const institution = seed.institution ?? researcher?.position.institution ?? 'Independent Specialist';
  const institutionId = seed.institutionId ?? researcher?.position.institutionId;
  const position = seed.position ?? researcher?.position.title;
  const languages = seed.languages ?? LANGUAGE_BY_COUNTRY[country] ?? ['English'];
  const skills: ServiceProviderSkill[] = (seed.skills ?? TYPE_SKILLS[seed.type]).map((skill, skillIndex) => ({
    id: `${seed.id}-skill-${skillIndex}`,
    name: skill.name,
    category: skill.category,
    level: skill.level ?? SKILL_LEVEL_BY_TYPE[seed.type],
  }));
  const certifications: ServiceProviderCertification[] = (seed.certifications ?? TYPE_CERTIFICATIONS[seed.type]).map(
    (certification, certIndex) => ({
      id: `${seed.id}-cert-${certIndex}`,
      name: certification.name,
      issuer: certification.issuer,
      year: certification.year,
      credentialId: `${seed.id.toUpperCase().replace(/-/g, '')}-${certification.year}`,
    }),
  );
  const ratingAverage = seed.ratingAverage ?? 4.6 + ((index * 7) % 4) / 10;
  const ratingCount = seed.ratingCount ?? 20 + ((index * 13) % 60);
  const rating = ratingSummaryFor(ratingAverage, ratingCount);
  const completedJobs = seed.completedJobs ?? 40 + ((index * 17) % 80);
  const badges: ServiceProviderBadge[] = [
    'Verified Provider',
    ...(rating.average >= 4.8 ? ['Top Rated'] : []),
    ...(researcher ? ['Institution Verified', 'Academic Verified'] : []),
    ...(seed.featured ? ['Expert'] : []),
  ] as ServiceProviderBadge[];
  const joinedAt = seed.joinedAt ?? `202${index % 6}-0${(index % 9) + 1}-10`;
  const portfolio: ServicePortfolioItem[] = index < 40
    ? [
        {
          id: `${seed.id}-portfolio-0`,
          title: PORTFOLIO_POOL[index % PORTFOLIO_POOL.length].title,
          description: `${seed.type.replace(/-/g, ' ')} work delivered for a research client.`,
          category: PORTFOLIO_CATEGORY_BY_TYPE[seed.type],
          client: 'Research client',
          year: `202${index % 6}`,
          result: PORTFOLIO_POOL[index % PORTFOLIO_POOL.length].result,
        },
      ]
    : [];
  const testimonials: ServiceTestimonial[] = index < 40
    ? [
        {
          id: `${seed.id}-testimonial-0`,
          providerId: seed.id,
          clientName: BUYER_NAMES[index % BUYER_NAMES.length],
          clientRole: index % 2 === 0 ? 'Doctoral Researcher' : 'Principal Investigator',
          rating: Math.max(4, Math.min(5, Math.round(ratingAverage))),
          comment: TESTIMONIAL_COMMENTS[index % TESTIMONIAL_COMMENTS.length],
          serviceTitle: seed.specializations[0].replace(/-/g, ' '),
          date: `2026-0${(index % 6) + 1}-15`,
        },
      ]
    : [];
  return {
    id: seed.id,
    username: seed.username,
    name,
    type: seed.type,
    avatar: researcher?.avatar ?? (['🧑‍🏫', '👩‍🏫', '👨‍🏫', '🧑‍🔬', '👩‍🔬', '👨‍🔬'][index % 6]),
    headline: seed.headline,
    tagline: seed.tagline,
    description: seed.description,
    country,
    city,
    institution,
    institutionId,
    position,
    researcherUsername: seed.researcherUsername,
    researcherSaid: researcher?.identity.said,
    verified: seed.verified ?? true,
    trustScore: seed.trustScore ?? 78 + (index % 21),
    badges,
    rating,
    responseTime: seed.responseTime ?? RESPONSE_TIME_DEFAULT,
    completedJobs,
    completedJobsValue: Math.round(completedJobs * 180 * 100) / 100,
    successRate: 92 + (index % 8),
    languages,
    skills,
    certifications,
    specializations: seed.specializations,
    availability: buildProviderAvailability(seed),
    portfolio,
    testimonials,
    memberSince: seed.memberSince ?? `202${index % 5}-03-01`,
    joinedAt,
    followers: 120 + index * 47,
    serviceCount: 0,
  };
}

const PORTFOLIO_CATEGORY_BY_TYPE: Record<ServiceProviderType, ServiceCategory> = {
  researcher: 'research-design',
  statistician: 'statistical-analysis',
  methodologist: 'methodology-consulting',
  'qualitative-analyst': 'qualitative-analysis',
  'data-analyst': 'python-data-analysis',
  editor: 'editing-proofreading',
  translator: 'translation',
  grantwriter: 'grantwriting',
  'academic-writer': 'academic-writing',
  consultant: 'research-design',
  mentor: 'academic-mentoring',
  tutor: 'tutoring',
  designer: 'poster-design',
};

export const PROVIDERS: ServiceProvider[] = PROVIDER_SEEDS.map((seed, index) => makeProvider(seed, index));

// ---------------------------------------------------------------------------
// Service type mapping
// ---------------------------------------------------------------------------

const SERVICE_TYPE_BY_CATEGORY: Record<ServiceCategory, ServiceType> = {
  'academic-writing': 'writing',
  'thesis-writing': 'writing',
  'manuscript-preparation': 'writing',
  'technical-writing': 'writing',
  'editing-proofreading': 'editing',
  'language-polishing': 'editing',
  formatting: 'editing',
  'referencing-citations': 'editing',
  translation: 'translation',
  'statistical-analysis': 'analysis',
  biostatistics: 'analysis',
  econometrics: 'analysis',
  'python-data-analysis': 'analysis',
  'machine-learning-modeling': 'analysis',
  'qualitative-analysis': 'analysis',
  'thematic-analysis': 'analysis',
  'nvivo-analysis': 'analysis',
  'interview-transcription': 'analysis',
  'grounded-theory': 'analysis',
  grantwriting: 'writing',
  'proposal-development': 'writing',
  'budget-preparation': 'consultation',
  'funding-strategy': 'consultation',
  'literature-review': 'review',
  'systematic-review': 'review',
  'meta-analysis': 'review',
  'research-design': 'consultation',
  'methodology-consulting': 'consultation',
  'survey-design': 'consultation',
  'journal-selection': 'consultation',
  'submission-support': 'consultation',
  'response-to-reviewers': 'editing',
  'abstract-writing': 'writing',
  'poster-design': 'design',
  'data-cleaning': 'analysis',
  'data-visualisation': 'design',
  'academic-mentoring': 'mentoring',
  tutoring: 'tutoring',
  'publication-strategy': 'consultation',
  'career-development': 'training',
};

// ---------------------------------------------------------------------------
// Service seeds — 160 services across all 40 categories
// ---------------------------------------------------------------------------

type ServiceSpec = {
  title: string;
  provider: string;
  price: number;
  compareAt?: number;
  rating?: number;
  featured?: boolean;
  sponsored?: boolean;
  boostLevel?: ServiceBoostLevel;
  currency?: CurrencyCode;
  priceInterval?: ServicePriceInterval;
  deliveryDays?: number;
  revisions?: number;
  careerStages?: CareerStage[];
  skills?: string[];
  keywords?: string[];
  disciplines?: string[];
  languages?: string[];
  sourceId?: string;
};

const CATEGORY_SERVICE_SPECS: Record<ServiceCategory, ServiceSpec[]> = {
  'academic-writing': [
    { title: 'Complete research article writing', provider: 'jscholar', price: 320, featured: true },
    { title: 'Full dissertation writing support', provider: 'james', price: 450 },
    { title: 'Spanish-English bilingual academic writing', provider: 'isabel', price: 260 },
    { title: 'Grant-backed writing for publication', provider: 'jscholar', price: 360, sponsored: true, boostLevel: 'pro' },
  ],
  'thesis-writing': [
    { title: 'Thesis writing from proposal to defense', provider: 'james', price: 520, featured: true },
    { title: 'Dissertation chapter development', provider: 'nadia', price: 380 },
    { title: 'Masters thesis writing and structuring', provider: 'isabel', price: 300 },
    { title: 'Doctoral thesis editing and rewriting', provider: 'james', price: 640, sponsored: true, boostLevel: 'premium' },
  ],
  'manuscript-preparation': [
    { title: 'Journal manuscript preparation and submission', provider: 'anna', price: 180 },
    { title: 'Manuscript formatting per journal guidelines', provider: 'femi', price: 120 },
    { title: 'Manuscript preparation for non-native speakers', provider: 'jscholar', price: 200, featured: true },
    { title: 'Pre-submission manuscript checklist and polish', provider: 'raj', price: 160, sponsored: true, boostLevel: 'standard' },
  ],
  'technical-writing': [
    { title: 'Technical report writing for research projects', provider: 'tanaka', price: 240 },
    { title: 'Software documentation for research tools', provider: 'okafor', price: 210 },
    { title: 'Policy briefing and technical white papers', provider: 'ndlovu', price: 260 },
    { title: 'Engineering research writing and documentation', provider: 'wang', price: 280, sponsored: true, boostLevel: 'pro' },
  ],
  'editing-proofreading': [
    { title: 'Professional copy editing for manuscripts', provider: 'anna', price: 150, featured: true },
    { title: 'Proofreading for journal submissions', provider: 'grace', price: 110 },
    { title: 'Deep structural editing for theses', provider: 'luisa', price: 190 },
    { title: 'Editorial pass with style-guide compliance', provider: 'raj', price: 170, sponsored: true, boostLevel: 'standard' },
  ],
  'language-polishing': [
    { title: 'Academic English language polishing', provider: 'jscholar', price: 140, featured: true },
    { title: 'Post-editing of translated manuscripts', provider: 'gallo', price: 160 },
    { title: 'Language polishing for ESL authors', provider: 'anna', price: 130 },
    { title: 'Submission-ready language revision', provider: 'smith', price: 150, sponsored: true, boostLevel: 'pro' },
  ],
  formatting: [
    { title: 'APA/MLA/Chicago formatting service', provider: 'femi', price: 90 },
    { title: 'Typesetting and layout for theses', provider: 'luisa', price: 120 },
    { title: 'Journal author-guideline formatting', provider: 'raj', price: 100 },
    { title: 'Reference and citation formatting', provider: 'femi', price: 80, sponsored: true, boostLevel: 'standard' },
  ],
  'referencing-citations': [
    { title: 'Citation management and reference lists', provider: 'femi', price: 70 },
    { title: 'Reference checking against sources', provider: 'raj', price: 85 },
    { title: 'Bibliography building for theses', provider: 'anna', price: 95 },
    { title: 'Citation audit before submission', provider: 'smith', price: 110, featured: true },
  ],
  translation: [
    { title: 'English-Korean academic translation', provider: 'hana', price: 240, featured: true },
    { title: 'French-English scientific translation', provider: 'pierre', price: 260 },
    { title: 'Spanish-English humanities translation', provider: 'gallo', price: 230 },
    { title: 'Terminology-managed research translation', provider: 'jscholar', price: 280, sponsored: true, boostLevel: 'pro' },
  ],
  'statistical-analysis': [
    { title: 'Statistical analysis for manuscripts', provider: 'ojuri', price: 260, featured: true },
    { title: 'SPSS and R analysis with write-up', provider: 'priya', price: 240 },
    { title: 'Advanced statistical modelling', provider: 'martin', price: 320 },
    { title: 'Survey and experimental data analysis', provider: 'maria', price: 300, sponsored: true, boostLevel: 'premium' },
  ],
  biostatistics: [
    { title: 'Biostatistics for clinical studies', provider: 'ojuri', price: 320, featured: true },
    { title: 'Genomics and health data analysis', provider: 'dube', price: 360 },
    { title: 'Biostatistical review for grant proposals', provider: 'amara', price: 280 },
    { title: 'Survival analysis and trial statistics', provider: 'martin', price: 340, sponsored: true, boostLevel: 'pro' },
  ],
  econometrics: [
    { title: 'Econometric analysis with causal methods', provider: 'adesina', price: 340, featured: true },
    { title: 'Instrumental variables and panel methods', provider: 'thomas', price: 360 },
    { title: 'Time-series and forecasting for research', provider: 'yuri', price: 320 },
    { title: 'Microeconometrics for development studies', provider: 'wang', price: 350, sponsored: true, boostLevel: 'standard' },
  ],
  'python-data-analysis': [
    { title: 'Python data analysis and pipelines', provider: 'okonkwo', price: 220, featured: true },
    { title: 'Reproducible Python analysis notebooks', provider: 'das', price: 240 },
    { title: 'Data wrangling and cleaning in Python', provider: 'wei', price: 180 },
    { title: 'Python analysis for publication', provider: 'carlos', price: 200, sponsored: true, boostLevel: 'pro' },
  ],
  'machine-learning-modeling': [
    { title: 'Machine learning model development', provider: 'tanaka', price: 420, featured: true },
    { title: 'ML modeling with model evaluation', provider: 'das', price: 460 },
    { title: 'Applied ML for research questions', provider: 'okonkwo', price: 380 },
    { title: 'Reproducible ML for publications', provider: 'emma', price: 400, sponsored: true, boostLevel: 'premium' },
  ],
  'qualitative-analysis': [
    { title: 'Qualitative analysis of interviews', provider: 'hussain', price: 200, featured: true },
    { title: 'Focus-group analysis and reporting', provider: 'sara', price: 220 },
    { title: 'Qualitative analysis for policy research', provider: 'leila', price: 240 },
    { title: 'Qualitative coding with framework', provider: 'farida', price: 190, sponsored: true, boostLevel: 'standard' },
  ],
  'thematic-analysis': [
    { title: 'Thematic analysis with rich reporting', provider: 'sara', price: 180, featured: true },
    { title: 'Braun & Clarke thematic analysis', provider: 'hussain', price: 200 },
    { title: 'Thematic analysis for dissertations', provider: 'farida', price: 170 },
    { title: 'Cross-case thematic synthesis', provider: 'leila', price: 210, sponsored: true, boostLevel: 'pro' },
  ],
  'nvivo-analysis': [
    { title: 'NVivo coding and querying', provider: 'peter', price: 190, featured: true },
    { title: 'NVivo project setup and training', provider: 'sara', price: 220 },
    { title: 'Systematic NVivo analysis with audit trail', provider: 'farida', price: 210 },
    { title: 'NVivo support for mixed methods', provider: 'hussain', price: 200, sponsored: true, boostLevel: 'standard' },
  ],
  'interview-transcription': [
    { title: 'Interview transcription and coding', provider: 'leila', price: 160 },
    { title: 'Focus group transcription and analysis', provider: 'peter', price: 180 },
    { title: 'Transcription analysis for theses', provider: 'farida', price: 150 },
    { title: 'Interview analysis with quotes library', provider: 'sara', price: 170, sponsored: true, boostLevel: 'pro' },
  ],
  'grounded-theory': [
    { title: 'Grounded theory development', provider: 'leila', price: 260, featured: true },
    { title: 'Open, axial, and selective coding', provider: 'hussain', price: 240 },
    { title: 'Grounded theory for dissertations', provider: 'sara', price: 230 },
    { title: 'Constructivist grounded theory support', provider: 'peter', price: 250, sponsored: true, boostLevel: 'standard' },
  ],
  grantwriting: [
    { title: 'Grant proposal writing', provider: 'susan', price: 480, featured: true },
    { title: 'Research proposal development for funders', provider: 'diego', price: 440 },
    { title: 'East Africa-focused grant writing', provider: 'linda', price: 400 },
    { title: 'Full proposal package with budget', provider: 'susan', price: 560, sponsored: true, boostLevel: 'premium' },
  ],
  'proposal-development': [
    { title: 'Research proposal development', provider: 'diego', price: 380 },
    { title: 'Proposal development for NGOs', provider: 'george', price: 340 },
    { title: 'Academic proposal development', provider: 'linda', price: 360 },
    { title: 'Proposal outline and structuring', provider: 'susan', price: 300, sponsored: true, boostLevel: 'pro' },
  ],
  'budget-preparation': [
    { title: 'Research budget preparation', provider: 'susan', price: 140, featured: true },
    { title: 'Budget narrative and justification', provider: 'linda', price: 150 },
    { title: 'Funder-compliant budget spreadsheets', provider: 'diego', price: 160 },
    { title: 'Costing for grant applications', provider: 'elena', price: 130, sponsored: true, boostLevel: 'standard' },
  ],
  'funding-strategy': [
    { title: 'Funding strategy and landscape mapping', provider: 'susan', price: 220, featured: true },
    { title: 'Funder matching for research ideas', provider: 'victor', price: 200 },
    { title: 'Grant-readiness assessment', provider: 'adesina', price: 180 },
    { title: 'Portfolio funding strategy', provider: 'diego', price: 240, sponsored: true, boostLevel: 'pro' },
  ],
  'literature-review': [
    { title: 'Comprehensive literature review', provider: 'mbatha', price: 300, featured: true },
    { title: 'Literature review for dissertations', provider: 'james', price: 280 },
    { title: 'Scoping review and synthesis', provider: 'ojuri', price: 320 },
    { title: 'Narrative review with critical appraisal', provider: 'sara', price: 260, sponsored: true, boostLevel: 'standard' },
  ],
  'systematic-review': [
    { title: 'Full systematic review (PRISMA)', provider: 'mbatha', price: 640, featured: true },
    { title: 'Systematic review with screening', provider: 'ojuri', price: 580 },
    { title: 'Systematic review protocol development', provider: 'amara', price: 420 },
    { title: 'Systematic review update and extension', provider: 'james', price: 520, sponsored: true, boostLevel: 'premium' },
  ],
  'meta-analysis': [
    { title: 'Meta-analysis with effect-size pooling', provider: 'mbatha', price: 700, featured: true },
    { title: 'Meta-analysis for clinical studies', provider: 'ojuri', price: 680 },
    { title: 'Network meta-analysis support', provider: 'dube', price: 720 },
    { title: 'Meta-analysis reporting and figures', provider: 'martin', price: 600, sponsored: true, boostLevel: 'pro' },
  ],
  'research-design': [
    { title: 'Research design and study planning', provider: 'adebayo', price: 320, featured: true },
    { title: 'Mixed-methods design consulting', provider: 'claire', price: 280 },
    { title: 'Experimental design for labs', provider: 'kim', price: 340 },
    { title: 'Design review against funder criteria', provider: 'john', price: 300, sponsored: true, boostLevel: 'standard' },
  ],
  'methodology-consulting': [
    { title: 'Methodology consulting for complex studies', provider: 'schneider', price: 360, featured: true },
    { title: 'Methods review for manuscripts', provider: 'claire', price: 300 },
    { title: 'Sampling and power analysis', provider: 'kim', price: 320 },
    { title: 'Methodology for interdisciplinary research', provider: 'adebayo', price: 340, sponsored: true, boostLevel: 'pro' },
  ],
  'survey-design': [
    { title: 'Survey design and questionnaire development', provider: 'adesina', price: 260, featured: true },
    { title: 'Sampling strategy and weighting', provider: 'thomas', price: 280 },
    { title: 'Instrument validation support', provider: 'priya', price: 240 },
    { title: 'Survey design for policy research', provider: 'claire', price: 250, sponsored: true, boostLevel: 'standard' },
  ],
  'journal-selection': [
    { title: 'Journal selection and targeting', provider: 'anna', price: 120, featured: true },
    { title: 'Journal fit analysis for manuscripts', provider: 'raj', price: 130 },
    { title: 'Impact-factor and audience alignment', provider: 'smith', price: 140 },
    { title: 'Journal strategy for new submissions', provider: 'jscholar', price: 150, sponsored: true, boostLevel: 'standard' },
  ],
  'submission-support': [
    { title: 'Manuscript submission handling', provider: 'raj', price: 130, featured: true },
    { title: 'Submission preparation and cover letter', provider: 'smith', price: 140 },
    { title: 'Journal portal submission guidance', provider: 'anna', price: 120 },
    { title: 'Full submission package assembly', provider: 'james', price: 170, sponsored: true, boostLevel: 'pro' },
  ],
  'response-to-reviewers': [
    { title: 'Response-to-reviewers drafting', provider: 'smith', price: 240, featured: true },
    { title: 'Point-by-point reviewer responses', provider: 'jscholar', price: 220 },
    { title: 'Revised manuscript with response letter', provider: 'anna', price: 280 },
    { title: 'Resubmission strategy for major revisions', provider: 'raj', price: 260, sponsored: true, boostLevel: 'pro' },
  ],
  'abstract-writing': [
    { title: 'Conference abstract writing', provider: 'gallo', price: 100 },
    { title: 'Abstract development for proceedings', provider: 'james', price: 110 },
    { title: 'Abstracts for multiple venues', provider: 'isabel', price: 120 },
    { title: 'Structured abstract for journals', provider: 'mia', price: 90, sponsored: true, boostLevel: 'standard' },
  ],
  'poster-design': [
    { title: 'Scientific poster design', provider: 'mia', price: 140, featured: true },
    { title: 'Conference poster layout and figures', provider: 'luca', price: 160 },
    { title: 'Figure design for publications', provider: 'rivers', price: 180 },
    { title: 'Infographic poster for outreach', provider: 'wei', price: 150, sponsored: true, boostLevel: 'pro' },
  ],
  'data-cleaning': [
    { title: 'Data cleaning and validation', provider: 'almeida', price: 160, featured: true },
    { title: 'Dataset preparation for analysis', provider: 'okonkwo', price: 140 },
    { title: 'Tidy datasets for reproducible research', provider: 'wei', price: 150 },
    { title: 'Data quality audits', provider: 'emma', price: 170, sponsored: true, boostLevel: 'standard' },
  ],
  'data-visualisation': [
    { title: 'Data visualisation for manuscripts', provider: 'rivers', price: 200, featured: true },
    { title: 'Publication-ready figures', provider: 'mia', price: 220 },
    { title: 'Interactive dashboards for research', provider: 'wei', price: 280 },
    { title: 'Visual abstracts for papers', provider: 'emma', price: 180, sponsored: true, boostLevel: 'pro' },
  ],
  'academic-mentoring': [
    { title: 'Academic mentoring for early-career researchers', provider: 'yusuf', price: 90, featured: true },
    { title: 'Doctoral mentoring and coaching', provider: 'helen', price: 110 },
    { title: 'Mentoring for grant applicants', provider: 'victor', price: 100 },
    { title: 'Career mentoring for postdocs', provider: 'sophia', price: 95, sponsored: true, boostLevel: 'standard' },
  ],
  tutoring: [
    { title: 'Statistics and methods tutoring', provider: 'kovacs', price: 60, featured: true },
    { title: 'Research methods exam prep', provider: 'marcus', price: 55 },
    { title: 'Mathematics tutoring for research', provider: 'ayesha', price: 50 },
    { title: 'Academic writing tutoring', provider: 'daniel', price: 58, sponsored: true, boostLevel: 'standard' },
  ],
  'publication-strategy': [
    { title: 'Publication strategy and roadmap', provider: 'gallo', price: 220, featured: true },
    { title: 'Target-journal strategy for early-career', provider: 'victor', price: 200 },
    { title: 'Publication planning for projects', provider: 'elena', price: 240 },
    { title: 'Visibility and citation strategy', provider: 'james', price: 210, sponsored: true, boostLevel: 'pro' },
  ],
  'career-development': [
    { title: 'Academic career development planning', provider: 'helen', price: 120, featured: true },
    { title: 'Faculty application coaching', provider: 'victor', price: 140 },
    { title: 'Research identity and portfolio building', provider: 'sophia', price: 130 },
    { title: 'Career transitions in academia', provider: 'yusuf', price: 110, sponsored: true, boostLevel: 'standard' },
  ],
};

// ---------------------------------------------------------------------------
// Service derivation
// ---------------------------------------------------------------------------

type ServiceSeed = ServiceSpec & {
  id: string;
  category: ServiceCategory;
  type: ServiceType;
  group: ServiceCategoryGroup;
  summary: string;
  description: string;
  researchAreas: string[];
  stageIds: ResearchLifecycleStageId[];
  status: ServiceStatus;
  dateAdded: string;
  lastUpdated: string;
  discountPercent?: number;
  sourceEntity?: DiscoveryEntityType;
  reviewCount?: number;
};

function providerOf(username: string): ServiceProvider {
  const found = PROVIDERS.find((provider) => provider.username === username);
  if (!found) throw new Error(`Missing provider seed: ${username}`);
  return found;
}

function serviceSummary(category: ServiceCategory, provider: ServiceProvider): string {
  return `${SERVICE_CATEGORY_LABELS[category]} delivered by ${provider.name}, a verified ${SERVICE_PROVIDER_TYPE_LABELS[provider.type].toLowerCase()} on Scholatia.`;
}

function serviceDescription(category: ServiceCategory, type: ServiceType, provider: ServiceProvider): string {
  return `A complete ${SERVICE_TYPE_LABELS[type].toLowerCase()} engagement covering scoping, execution, revisions, and handover. Delivered by ${provider.name} (${SERVICE_PROVIDER_TYPE_LABELS[provider.type]}), specialising in ${provider.specializations.join(', ').toLowerCase()}, with milestone tracking and order protection through the Scholatia marketplace. Part of the ${SERVICE_CATEGORY_GROUP_LABELS[SERVICE_CATEGORY_TO_GROUP[category]]} service group.`;
}

function stageIdsFor(category: ServiceCategory): ResearchLifecycleStageId[] {
  const entity = SERVICE_TO_DISCOVERY_ENTITY[category];
  switch (entity) {
    case 'manuscript':
      return ['manuscript', 'submission', 'peer-review'];
    case 'funding':
      return ['idea', 'proposal', 'funding'];
    case 'journal':
      return ['submission', 'peer-review', 'publication'];
    case 'conference':
      return ['conference'];
    case 'dataset':
      return ['dataset', 'analysis'];
    case 'publication':
      return ['manuscript', 'submission', 'publication'];
    case 'project':
      return ['project', 'analysis'];
    default:
      return ['proposal', 'manuscript'];
  }
}

function sourceRefFor(category: ServiceCategory, index: number): { sourceId?: string; sourceEntity?: DiscoveryEntityType } {
  const entity = SERVICE_TO_DISCOVERY_ENTITY[category];
  switch (entity) {
    case 'manuscript': {
      const manuscript = MANUSCRIPTS[index % MANUSCRIPTS.length];
      return { sourceId: manuscript.id, sourceEntity: entity };
    }
    case 'project': {
      const project = WORKSPACE_PROJECTS[index % WORKSPACE_PROJECTS.length];
      return { sourceId: project.id, sourceEntity: entity };
    }
    case 'journal': {
      const journal = JOURNALS[index % JOURNALS.length];
      return { sourceId: journal.journalId, sourceEntity: entity };
    }
    case 'conference': {
      const conference = CONFERENCES[index % CONFERENCES.length];
      return { sourceId: conference.conferenceId, sourceEntity: entity };
    }
    case 'dataset': {
      const dataset = DATASETS[index % DATASETS.length];
      return { sourceId: dataset.id, sourceEntity: entity };
    }
    case 'funding': {
      const opportunity = FUNDING_OPPORTUNITIES[index % FUNDING_OPPORTUNITIES.length];
      return { sourceId: opportunity.id, sourceEntity: entity };
    }
    case 'publication': {
      const publication = WORKSPACE_PUBLICATIONS[index % WORKSPACE_PUBLICATIONS.length];
      return { sourceId: publication.doi, sourceEntity: entity };
    }
    case 'researcher': {
      const researcher = RESEARCHERS[index % RESEARCHERS.length];
      return { sourceId: researcher.username, sourceEntity: entity };
    }
    default:
      return { sourceEntity: entity };
  }
}

function dateAddedFor(index: number): string {
  return `202${index % 5}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`;
}

function defaultCareerStages(category: ServiceCategory): CareerStage[] {
  if (category === 'tutoring') return ['undergraduate', 'postgraduate', 'masters'];
  if (category === 'academic-mentoring' || category === 'career-development') {
    return ['postgraduate', 'doctoral', 'postdoctoral', 'early-career'];
  }
  if (category === 'thesis-writing') return ['masters', 'doctoral'];
  return ['open-to-all'];
}

function buildServiceAdMetrics(seed: ServiceSeed, views: number): ServiceAdMetrics {
  const impressions = Math.round(views * 2.4);
  const clicks = Math.round(impressions * 0.025);
  const inquiries = Math.round(clicks * 0.3);
  const conversions = Math.round(inquiries * 0.4);
  const spend = Math.round(impressions * 0.008);
  const revenue = conversions * seed.price;
  return {
    impressions,
    clicks,
    inquiries,
    conversions,
    ctr: Math.round((clicks / impressions) * 10000) / 100,
    cpc: Math.round((spend / Math.max(1, clicks)) * 100) / 100,
    roi: Math.round(((revenue - spend) / Math.max(1, spend)) * 100),
  };
}

const GROUP_REQUIREMENTS: Record<ServiceCategoryGroup, { label: string; description?: string; required: boolean }[]> = {
  writing: [
    { label: 'Topic outline', required: true },
    { label: 'Target length (words or pages)', required: true },
    { label: 'Reference list or bibliography', required: false },
    { label: 'Style guide preference', required: false },
  ],
  editing: [
    { label: 'Manuscript draft (any stage)', required: true },
    { label: 'Target journal style guide', required: false },
    { label: 'Editing focus (language, structure, citations)', required: false },
  ],
  statistics: [
    { label: 'Dataset (CSV/Excel/SPSS)', required: true },
    { label: 'Research question and hypotheses', required: true },
    { label: 'Software preference (R, SPSS, Stata, Python)', required: false },
  ],
  qualitative: [
    { label: 'Transcripts or interview recordings', required: true },
    { label: 'Coding framework or research questions', required: false },
    { label: 'Software preference (NVivo, MAXQDA)', required: false },
  ],
  grants: [
    { label: 'Funding call guidelines', required: true },
    { label: 'Draft proposal (optional)', required: false },
    { label: 'Budget spreadsheet', required: false },
    { label: 'CVs of named researchers', required: false },
  ],
  literature: [
    { label: 'Research question or scope', required: true },
    { label: 'Inclusion/exclusion criteria', required: false },
    { label: 'Database list (PubMed, Scopus, Web of Science)', required: false },
  ],
  research: [
    { label: 'Study aims and context', required: true },
    { label: 'Existing protocol or methods (optional)', required: false },
    { label: 'Target population and sample', required: false },
  ],
  publishing: [
    { label: 'Manuscript and target journal', required: true },
    { label: 'Author guidelines or call details', required: false },
    { label: 'Reviewer comments (for response services)', required: false },
  ],
  conference: [
    { label: 'Abstract or talk content', required: true },
    { label: 'Conference theme and formatting rules', required: false },
    { label: 'Preferred visual style', required: false },
  ],
  data: [
    { label: 'Raw dataset', required: true },
    { label: 'Data dictionary or variable list', required: false },
    { label: 'Desired output format', required: false },
  ],
  mentoring: [
    { label: 'Career stage and goals', required: true },
    { label: 'Current draft or plan (optional)', required: false },
    { label: 'Preferred focus areas', required: false },
  ],
  consulting: [
    { label: 'Project brief', required: true },
    { label: 'Timeline and milestones', required: false },
    { label: 'Budget envelope', required: false },
  ],
};

function buildRequirements(category: ServiceCategory): ServiceRequirement[] {
  return GROUP_REQUIREMENTS[SERVICE_CATEGORY_TO_GROUP[category]].map((requirement, index) => ({
    id: `req-${category}-${index}`,
    label: requirement.label,
    description: requirement.description,
    required: requirement.required,
  }));
}

function buildPackages(seed: ServiceSeed): ServicePackage[] {
  const base = seed.price;
  const currency = seed.currency ?? 'USD';
  const interval = seed.priceInterval ?? 'per-project';
  const delivery = seed.deliveryDays ?? SERVICE_DELIVERY_BASE_DAYS[seed.category];
  const revisions = seed.revisions ?? 2;
  const label = SERVICE_CATEGORY_LABELS[seed.category].toLowerCase();
  return [
    {
      id: `${seed.id}-basic`,
      name: 'Basic',
      description: 'Core deliverable with essential support.',
      price: { amount: Math.round(base * 0.6 * 100) / 100, currency, interval },
      deliveryDays: Math.max(1, delivery + 2),
      revisions: 1,
      includes: [`Complete ${label} deliverable`, 'One revision round', 'Email support during delivery'],
    },
    {
      id: `${seed.id}-standard`,
      name: 'Standard',
      description: 'The most popular option with expanded scope.',
      price: { amount: base, currency, interval, compareAt: seed.compareAt },
      deliveryDays: delivery,
      revisions,
      popular: true,
      includes: [
        `Full ${label} service with documentation`,
        `${revisions} revision rounds`,
        'Priority email support',
        'Deliverable files in multiple formats',
      ],
    },
    {
      id: `${seed.id}-premium`,
      name: 'Premium',
      description: 'White-glove delivery with senior provider attention.',
      price: { amount: Math.round(base * 1.6 * 100) / 100, currency, interval },
      deliveryDays: Math.max(1, delivery - 1),
      revisions: revisions + 2,
      includes: [
        'Everything in Standard',
        'Dedicated senior provider',
        'Video handover call',
        'Extended revisions',
        '48-hour priority turnaround',
      ],
    },
  ];
}

function buildServiceSeeds(): ServiceSeed[] {
  const seeds: ServiceSeed[] = [];
  let index = 0;
  for (const category of SERVICE_CATEGORIES) {
    const specs = CATEGORY_SERVICE_SPECS[category];
    specs.forEach((spec, variant) => {
      const provider = providerOf(spec.provider);
      const type = SERVICE_TYPE_BY_CATEGORY[category];
      const source = sourceRefFor(category, index);
      seeds.push({
        ...spec,
        id: `svc-${category}-${variant + 1}`,
        category,
        type,
        group: SERVICE_CATEGORY_TO_GROUP[category],
        summary: serviceSummary(category, provider),
        description: serviceDescription(category, type, provider),
        researchAreas: spec.disciplines?.slice(0, 1) ?? [provider.specializations[0]],
        stageIds: stageIdsFor(category),
        status: 'active',
        dateAdded: dateAddedFor(index),
        lastUpdated: `2026-07-${String((index % 28) + 1).padStart(2, '0')}`,
        sourceEntity: source.sourceEntity,
        sourceId: source.sourceId,
        discountPercent: spec.compareAt ? Math.round(((spec.compareAt - spec.price) / spec.compareAt) * 100) : undefined,
      });
      index += 1;
    });
  }
  return seeds;
}

function makeService(seed: ServiceSeed, index: number): Service {
  const provider = providerOf(seed.provider);
  const ratingAverage = seed.rating ?? 4.6 + ((index * 7) % 4) / 10;
  const reviewCount = seed.reviewCount ?? 8 + ((index * 11) % 40);
  const rating = ratingSummaryFor(ratingAverage, reviewCount);
  const completedJobs = Math.max(4, Math.round(provider.completedJobs / 5));
  const views = completedJobs * 12 + ((index * 37) % 300);
  const boosted = seed.sponsored ?? false;
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    description: seed.description,
    category: seed.category,
    group: seed.group,
    type: seed.type,
    providerId: provider.id,
    providerName: provider.name,
    price: {
      amount: seed.price,
      currency: seed.currency ?? 'USD',
      interval: seed.priceInterval ?? 'per-project',
      compareAt: seed.compareAt,
    },
    discount: seed.discountPercent ? { percent: seed.discountPercent } : undefined,
    packages: buildPackages(seed),
    rating,
    reviewCount,
    completedJobs,
    inquiries: completedJobs * 3 + ((index * 7) % 40),
    favorites: (index * 13) % 90,
    views,
    keywords: seed.keywords ?? [seed.category, ...provider.specializations],
    researchAreas: seed.researchAreas,
    disciplines: seed.disciplines ?? provider.specializations,
    careerStages: seed.careerStages ?? defaultCareerStages(seed.category),
    stageIds: seed.stageIds,
    deliveryDays: seed.deliveryDays ?? SERVICE_DELIVERY_BASE_DAYS[seed.category],
    revisions: seed.revisions ?? 2,
    languages: seed.languages ?? provider.languages,
    targetAudience: ['Researchers', 'Doctoral candidates', 'Early-career faculty'],
    skills: seed.skills ?? provider.specializations,
    requirements: buildRequirements(seed.category),
    featured: seed.featured ?? false,
    sponsored: boosted,
    promoted: boosted,
    boostLevel: seed.boostLevel,
    sponsoredLabel: boosted
      ? (index % 3 === 0 ? 'Promoted' : index % 3 === 1 ? 'Sponsored' : 'Recommended')
      : undefined,
    adCampaignId: boosted ? `campaign-service-${seed.id}` : undefined,
    adPlacement: boosted ? 'marketplace' : undefined,
    adMetrics: boosted ? buildServiceAdMetrics(seed, views) : undefined,
    badges: provider.badges.slice(0, 3),
    status: seed.status,
    url: buildServiceUrl(seed.id),
    dateAdded: seed.dateAdded,
    lastUpdated: seed.lastUpdated,
    sourceId: seed.sourceId,
    sourceEntity: seed.sourceEntity,
  };
}

const SERVICE_SEEDS = buildServiceSeeds();

export const SERVICES: Service[] = SERVICE_SEEDS.map((seed, index) => makeService(seed, index));

export function serviceCategoryIcon(category: ServiceCategory): string {
  return SERVICE_CATEGORY_ICONS[category];
}

export function serviceCategoryGroupIcon(group: ServiceCategoryGroup): string {
  return SERVICE_CATEGORY_GROUP_ICONS[group];
}

/** The institution record a provider belongs to, when registered on Scholatia. */
export function providerInstitution(provider: ServiceProvider): { id: string; name: string } | undefined {
  const match = INSTITUTIONS.find((entry) => entry.profile.institutionName === provider.institution);
  return match ? { id: match.profile.institutionId, name: match.profile.institutionName } : undefined;
}

export const SERVICE_CATEGORY_GROUP_COUNTS: { group: ServiceCategoryGroup; label: string; icon: string; services: number }[] =
  SERVICE_CATEGORY_GROUPS.map((group) => ({
    group,
    label: SERVICE_CATEGORY_GROUP_LABELS[group],
    icon: SERVICE_CATEGORY_GROUP_ICONS[group],
    services: SERVICES.filter((service) => service.group === group).length,
  }));

// ---------------------------------------------------------------------------
// Reviews, orders, milestones, disputes
// ---------------------------------------------------------------------------

const REVIEW_SEED_TITLES = [
  'Excellent work, delivered ahead of schedule',
  'Clear, rigorous, and professional',
  'High quality analysis with great communication',
  'Went above and beyond expectations',
  'Transformed my manuscript',
  'Responsive, accurate, and thorough',
  'Exactly what my research needed',
  'Fast turnaround with outstanding results',
];

export const REVIEWS: ServiceReview[] = SERVICES.slice(0, 40).map((service, index) => ({
  id: `rev-service-${index + 1}`,
  serviceId: service.id,
  providerId: service.providerId,
  reviewerName: BUYER_NAMES[index % BUYER_NAMES.length],
  reviewerSaid: createSaidIdentifier(400 + index),
  rating: Math.max(4, Math.min(5, Math.round(service.rating.average + ((index % 3) - 1) * 0.2))),
  title: REVIEW_SEED_TITLES[index % REVIEW_SEED_TITLES.length],
  comment: `We engaged ${service.providerName} for ${service.summary.toLowerCase()} and the outcome exceeded our expectations. The process was clear, the communication prompt, and the deliverable was ready before the deadline.`,
  helpfulVotes: 2 + (index % 9),
  verifiedPurchase: true,
  date: `2026-0${(index % 6) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
}));

const MILESTONE_TITLES = ['Scoping & requirements', 'Draft deliverable', 'Revision round', 'Final delivery & handover'];

function buildMilestones(orderId: string, service: Service, index: number): ServiceOrderMilestone[] {
  const step = Math.max(2, Math.round(service.deliveryDays / 4));
  return MILESTONE_TITLES.map((title, milestoneIndex) => {
    const day = Math.min(28, (index % 24) + 1 + milestoneIndex * step);
    const completed = milestoneIndex < 3;
    return {
      id: `${orderId}-ms-${milestoneIndex + 1}`,
      orderId,
      title,
      description: `${title.toLowerCase()} for ${service.title}.`,
      status: completed ? 'completed' : milestoneIndex === 0 ? 'in-progress' : 'pending',
      dueDate: `2026-0${(index % 6) + 1}-${String(day).padStart(2, '0')}`,
      completedAt: completed ? `2026-0${(index % 6) + 1}-${String(day).padStart(2, '0')}` : undefined,
    };
  });
}

export const ORDERS: ServiceOrder[] = SERVICES.slice(0, 40).map((service, index) => {
  const statuses: ServiceOrderStatus[] = ['completed', 'completed', 'completed', 'in-progress', 'delivered', 'pending', 'completed', 'cancelled'];
  const status = statuses[index % statuses.length];
  const paymentStatus: ServicePaymentStatus = status === 'cancelled' ? 'refunded' : status === 'pending' ? 'pending' : 'paid';
  const placedAt = `2026-0${(index % 6) + 1}-${String((index % 24) + 1).padStart(2, '0')}`;
  const id = `ord-service-${String(index + 1).padStart(3, '0')}`;
  return {
    id,
    orderNumber: `SV-2026-${String(index + 1).padStart(4, '0')}`,
    serviceId: service.id,
    packageId: service.packages[index % 3]?.id,
    providerId: service.providerId,
    providerName: service.providerName,
    buyerName: BUYER_NAMES[(index + 2) % BUYER_NAMES.length],
    buyerSaid: createSaidIdentifier(300 + index),
    amount: service.packages[index % 3]?.price.amount ?? service.price.amount,
    currency: service.price.currency,
    status,
    paymentStatus,
    placedAt,
    deadline: `2026-0${(index % 6) + 1}-${String(Math.min(28, (index % 24) + 12)).padStart(2, '0')}`,
    deliveredAt:
      status === 'completed' || status === 'delivered'
        ? `2026-0${(index % 6) + 1}-${String(Math.min(28, (index % 24) + 3)).padStart(2, '0')}`
        : undefined,
    completedAt:
      status === 'completed'
        ? `2026-0${(index % 6) + 1}-${String(Math.min(28, (index % 24) + 5)).padStart(2, '0')}`
        : undefined,
    milestones: index < 5 ? buildMilestones(id, service, index) : [],
    notes: index % 4 === 0 ? 'Buyer requested an additional revision before final delivery.' : undefined,
  };
});

export const MILESTONES: ServiceOrderMilestone[] = ORDERS.flatMap((order) => order.milestones);

export const DISPUTES: ServiceDispute[] = SERVICES.slice(20, 40).map((service, index) => {
  const statuses: ServiceDisputeStatus[] = ['resolved', 'open', 'investigating', 'closed', 'resolved', 'open'];
  const status = statuses[index % statuses.length];
  const refunded = status === 'resolved' && index % 2 === 0;
  const order = ORDERS.find((entry) => entry.serviceId === service.id);
  return {
    id: `disp-service-${index + 1}`,
    orderId: order?.id ?? `ord-service-${String(index + 21).padStart(3, '0')}`,
    serviceId: service.id,
    providerId: service.providerId,
    openedBy: index % 2 === 0 ? 'buyer' : 'provider',
    subject: index % 2 === 0 ? 'Deliverable did not match the agreed scope' : 'Requested revision exceeds the package terms',
    description: `The ${SERVICE_CATEGORY_LABELS[service.category].toLowerCase()} order was disputed during delivery. Scholatia Trust reviewed the evidence and the order history.`,
    status,
    openedAt: `2026-0${(index % 6) + 1}-${String((index % 24) + 2).padStart(2, '0')}`,
    resolvedAt:
      status === 'resolved' || status === 'closed'
        ? `2026-0${(index % 6) + 1}-${String(Math.min(28, (index % 24) + 8)).padStart(2, '0')}`
        : undefined,
    resolution:
      status === 'resolved'
        ? refunded
          ? 'Partial refund issued to the buyer.'
          : 'Resolution in favour of the provider; deliverable accepted.'
        : undefined,
    refunded,
    refundAmount: refunded ? Math.round(service.price.amount * 0.5 * 100) / 100 : undefined,
    currency: service.price.currency,
  };
});

// ---------------------------------------------------------------------------
// Testimonials, portfolios, recommendations, bundles
// ---------------------------------------------------------------------------

export const TESTIMONIALS: ServiceTestimonial[] = PROVIDERS.flatMap((provider) => provider.testimonials);

export const SERVICE_PORTFOLIO_ITEMS: ServicePortfolioItem[] = PROVIDERS.flatMap((provider) => provider.portfolio);

export const RECOMMENDATIONS: ServiceRecommendation[] = [
  buildServiceRecommendation({
    id: 'rec-service-1',
    type: 'editor',
    targetId: 'svc-editing-proofreading-1',
    sourceId: 'MS-2026-0014',
    sourceEntity: 'manuscript',
    title: 'Polish your manuscript before submission',
    summary: 'Top-rated editing and language polishing from a verified editor.',
    url: buildServiceUrl('svc-editing-proofreading-1'),
    score: 96,
    confidence: 'high',
    reasons: ['Provider holds a Top Rated badge', 'Average rating above 4.8', 'Delivers within 3 working days'],
    tags: ['editing', 'submission', 'language'],
    audience: 'Manuscript authors',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-2',
    type: 'statistician',
    targetId: 'svc-statistical-analysis-1',
    sourceId: 'grant-nrc-2022-113',
    sourceEntity: 'funding',
    title: 'Rigorous statistics for your funded study',
    summary: 'Biostatistics and statistical analysis from a senior statistician.',
    url: buildServiceUrl('svc-statistical-analysis-1'),
    score: 94,
    confidence: 'high',
    reasons: ['20+ years of field epidemiology', '164 completed jobs', 'Responds within 3 working days'],
    tags: ['statistics', 'biostatistics', 'analysis'],
    audience: 'Principal investigators',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-3',
    type: 'provider',
    targetId: 'svc-grantwriting-1',
    sourceId: 'grant-lpf',
    sourceEntity: 'funding',
    title: 'Write proposals that get funded',
    summary: 'Professional grant writing with a 40+ proposal track record.',
    url: buildServiceUrl('svc-grantwriting-1'),
    score: 92,
    confidence: 'high',
    reasons: ['Certified Grant Writer', 'Proposals across research councils and EU programmes', 'Budget development included'],
    tags: ['grants', 'proposals', 'funding'],
    audience: 'Early-career researchers',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-4',
    type: 'service',
    targetId: 'svc-thesis-writing-1',
    sourceId: 'JNLP-2022-0088',
    sourceEntity: 'manuscript',
    title: 'Complete your thesis with expert support',
    summary: 'Thesis writing from proposal to defense, delivered milestone by milestone.',
    url: buildServiceUrl('svc-thesis-writing-1'),
    score: 90,
    confidence: 'medium',
    reasons: ['Structured chapter development', 'Revisions included', 'Milestone-based delivery'],
    tags: ['thesis', 'dissertation', 'writing'],
    audience: 'Doctoral candidates',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-5',
    type: 'mentor',
    targetId: 'svc-academic-mentoring-1',
    sourceId: 'yusuf',
    sourceEntity: 'researcher',
    title: 'A mentor for your academic journey',
    summary: 'Academic mentoring and career development for early-career researchers.',
    url: buildServiceUrl('svc-academic-mentoring-1'),
    score: 91,
    confidence: 'high',
    reasons: ['Top Rated mentor', 'Career development focus', '1-hour sessions'],
    tags: ['mentoring', 'career', 'guidance'],
    audience: 'Postgraduates and postdocs',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-6',
    type: 'service',
    targetId: 'svc-data-visualisation-1',
    sourceId: 'mpf-multilingual-treebanks',
    sourceEntity: 'dataset',
    title: 'Publication-ready figures for your data',
    summary: 'Data visualisation that makes your results clear at a glance.',
    url: buildServiceUrl('svc-data-visualisation-1'),
    score: 89,
    confidence: 'medium',
    reasons: ['Designer-led figures', 'Journal-ready output', 'Fast turnaround'],
    tags: ['visualisation', 'figures', 'design'],
    audience: 'Researchers with datasets',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-7',
    type: 'category',
    targetId: 'svc-literature-review-1',
    sourceId: '10.1000/placeholder.2024.0032',
    sourceEntity: 'publication',
    title: 'Evidence synthesis you can trust',
    summary: 'Literature, systematic, and meta-analysis reviews conducted to PRISMA standards.',
    url: buildServiceUrl('svc-literature-review-1'),
    score: 88,
    confidence: 'medium',
    reasons: ['PRISMA-compliant methods', 'Critical appraisal included', 'Search strategies documented'],
    tags: ['literature', 'systematic review', 'meta-analysis'],
    audience: 'Health and social science researchers',
    date: CURRENT_DATE,
  }),
  buildServiceRecommendation({
    id: 'rec-service-8',
    type: 'package',
    targetId: 'svc-systematic-review-1',
    sourceId: '10.1000/placeholder.2025.0111',
    sourceEntity: 'publication',
    title: 'Full systematic review, one package',
    summary: 'The Premium package covers protocol to final report with meta-analysis support.',
    url: buildServiceUrl('svc-systematic-review-1'),
    score: 93,
    confidence: 'high',
    reasons: ['Protocol, screening, synthesis, and reporting', 'Dedicated senior provider', 'Extended revisions'],
    tags: ['systematic review', 'premium', 'evidence'],
    audience: 'Research groups',
    date: CURRENT_DATE,
  }),
];

export const SERVICE_BUNDLES: ServiceBundle[] = [
  bundleServices(SERVICES, ['svc-editing-proofreading-1', 'svc-statistical-analysis-1', 'svc-literature-review-1'], 12),
  bundleServices(SERVICES, ['svc-grantwriting-1', 'svc-budget-preparation-1', 'svc-funding-strategy-1'], 15),
  bundleServices(SERVICES, ['svc-thesis-writing-1', 'svc-data-cleaning-1', 'svc-academic-mentoring-1'], 10),
];

// ---------------------------------------------------------------------------
// Statistics, analytics, featured exports, aggregate root
// ---------------------------------------------------------------------------

export const PROVIDER_STATISTICS: ProviderStatistics = providerStatistics({
  providers: PROVIDERS,
  services: SERVICES,
  reviews: REVIEWS,
  orders: ORDERS,
});

export const SERVICE_STATISTICS: ServiceStatistics = serviceStatistics({
  services: SERVICES,
  providers: PROVIDERS,
  reviews: REVIEWS,
  orders: ORDERS,
  milestones: MILESTONES,
  disputes: ORDERS.filter((order) => order.status === 'disputed'),
  testimonials: TESTIMONIALS,
  portfolios: SERVICE_PORTFOLIO_ITEMS,
});

export const SERVICE_ANALYTICS: ServiceMarketplaceAnalytics = marketplaceAnalytics({
  services: SERVICES,
  providers: PROVIDERS,
  orders: ORDERS,
  reviews: REVIEWS,
});

export const SERVICE_DISCOVERY_ITEMS: DiscoveryItem[] = toDiscoveryItems(SERVICES);

export const SERVICE_PROMOTABLE_OBJECTS = registerPromotableObjects(
  SERVICES.map((service) => servicePromotableObject(service)),
);

/** Derived advertising entity type lookup so the Services page can disclose promotions. */
export const SERVICE_AD_ENTITY_TYPE: Record<string, string> = Object.fromEntries(
  SERVICES.map((service) => [service.id, servicePromotableEntityType(service)]),
) as Record<string, string>;

export const TOP_RATED_SERVICES: Service[] = topRated(SERVICES, 8);
export const NEWEST_SERVICES: Service[] = newest(SERVICES, 8);
export const POPULAR_SERVICES: Service[] = sortServices(SERVICES, 'popularity').slice(0, 8);
export const SEARCH_SERVICE_RESULTS: Service[] = searchServices(SERVICES, 'statistical analysis', 10);

export const FEATURED_SERVICE: Service = SERVICES.find((service) => service.featured) ?? SERVICES[0];
export const FEATURED_PROVIDER: ServiceProvider = PROVIDERS[0];
export const FEATURED_REVIEW: ServiceReview = REVIEWS[0];
export const FEATURED_ORDER: ServiceOrder = ORDERS.find((order) => order.status === 'in-progress') ?? ORDERS[0];
export const FEATURED_MILESTONE: ServiceOrderMilestone =
  MILESTONES.find((milestone) => milestone.status === 'in-progress') ?? MILESTONES[0];
export const FEATURED_DISPUTE: ServiceDispute = DISPUTES.find((dispute) => dispute.status === 'open') ?? DISPUTES[0];
export const FEATURED_RECOMMENDATION: ServiceRecommendation = RECOMMENDATIONS[0];
export const FEATURED_BUNDLE: ServiceBundle = SERVICE_BUNDLES[0];
export const FEATURED_PROVIDER_URL: string = buildProviderUrl(FEATURED_PROVIDER.username);
export const CHEAPEST_SERVICE_PRICE: number = Math.min(...SERVICES.map((service) => effectiveServicePrice(service)));
export const FEATURED_SERVICE_DELIVERY: { days: number; range: string } = estimateDelivery(FEATURED_SERVICE);
export const RELATED_TO_FEATURED: Service[] = relatedServices(SERVICES, FEATURED_SERVICE, 4);
export const BOUGHT_TOGETHER: Service[] = frequentlyBoughtTogether(SERVICES, FEATURED_SERVICE, 3);

export const SERVICE_PORTFOLIO: ServicePortfolio = {
  statistics: SERVICE_STATISTICS,
  analytics: SERVICE_ANALYTICS,
  providers: PROVIDERS,
  services: SERVICES,
  categories: [...SERVICE_CATEGORIES],
  packages: SERVICES.flatMap((service) => service.packages),
  reviews: REVIEWS,
  testimonials: TESTIMONIALS,
  portfolios: SERVICE_PORTFOLIO_ITEMS,
  orders: ORDERS,
  milestones: MILESTONES,
  disputes: DISPUTES,
  recommendations: RECOMMENDATIONS,
  discoveryItems: SERVICE_DISCOVERY_ITEMS,
};
