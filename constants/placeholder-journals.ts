import type {
  ArticleSummary,
  EditorialDecisionStatistics,
  JournalArticleRef,
  JournalCallForPapersRef,
  JournalIssueRef,
  JournalPortfolioAnalytics,
  JournalPortfolioStatistics,
  JournalProfile,
  JournalRelationships,
  JournalReviewerRef,
  JournalVolumeRef,
  PublicationWorkflowStage,
} from '@/types/identity';
import { createJournalProfile } from '@/lib/journals';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { DATASETS } from '@/constants/placeholder-datasets';
import { WORKSPACE_PROJECTS } from '@/constants/placeholder-research';

/**
 * Canonical publication workflow, typed against the existing journal domain
 * type `PublicationWorkflowStage` so no workflow is ever hardcoded outside the
 * journals module.
 */
const STANDARD_WORKFLOW: PublicationWorkflowStage[] = [
  'Submission',
  'Editorial Screening',
  'Reviewer Assignment',
  'Peer Review',
  'Decision',
  'Revision',
  'Acceptance',
  'Copyediting',
  'Typesetting',
  'Proofreading',
  'Publication',
  'Archiving',
];

function makeJournal(overrides: Partial<JournalProfile>): JournalProfile {
  return createJournalProfile({ workflow: STANDARD_WORKFLOW, ...overrides });
}

const SCHOLATIA_OPEN_RESEARCH: JournalProfile = makeJournal({
  journalId: 'JNL-001',
  journalTitle: 'Scholatia Journal of Open Research',
  shortTitle: 'SJOR',
  issn: '2753-0910',
  eissn: '2753-0929',
  doiPrefix: '10.46793/sjor',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Computer Science',
  researchAreas: ['Open Science', 'Artificial Intelligence', 'Scholarly Communication'],
  aimsAndScope: 'A trusted, fully open venue for rigorous, transparent, and reproducible research across the scholarly communication lifecycle.',
  editorialPolicy: 'The journal follows transparent, inclusive, and community-led editorial practices with a strong focus on research integrity.',
  openAccessStatus: 'Diamond',
  publicationFrequency: 'Monthly',
  reviewModel: 'Double Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Scopus'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'In Review' },
  ],
  website: 'https://example.org/sjor',
  verificationStatus: 'Trusted',
  trustScore: 96,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. A. Rivera', affiliation: 'Scholatia' },
    { role: 'Managing Editor', name: 'Dr. L. Chen', affiliation: 'Scholatia' },
    { role: 'Associate Editor', name: 'Dr. M. Osei', affiliation: 'University of Ghana' },
    { role: 'Data Editor', name: 'Dr. N. Owusu', affiliation: 'Scholatia' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Short Communication', 'Dataset', 'Software Paper', 'Protocol'],
  peerReviewModes: ['Double Blind', 'Open Review', 'Transparent Review'],
  editors: ['Prof. A. Rivera', 'Dr. L. Chen', 'Dr. M. Osei'],
  reviewBoard: ['Dr. S. Alabi', 'Dr. R. Kaur', 'Dr. T. Zhang', 'Dr. J. van der Berg', 'Dr. P. Silva', 'Dr. H. Nakamura'],
  productionTeam: ['Production Office', 'Copyediting Desk', 'Typesetting Team'],
  publishingStaff: ['Publishing Team', 'Indexing Coordinator'],
  articles: [
    { title: 'Open Science Practices across Scholarly Communities', authors: ['Prof. A. Rivera', 'Dr. L. Chen'], status: 'Published' },
    { title: 'A Verified Identity Framework for Academic Publishing', authors: ['Dr. N. Owusu', 'Dr. R. Kaur'], status: 'Published' },
    { title: 'Reproducible Evaluation of Large Language Models', authors: ['Dr. T. Zhang', 'Dr. S. Alabi'], status: 'Accepted' },
    { title: 'FAIR Data Curation for Research Repositories', authors: ['Dr. P. Silva'], status: 'In Production' },
    { title: 'Gamified Peer Review Incentives', authors: ['Dr. H. Nakamura'], status: 'Under Review' },
    { title: 'Editorial Workflow Automation for Small Publishers', authors: ['Dr. J. van der Berg'], status: 'Under Review' },
    { title: 'Citation Networks and Research Integrity', authors: ['Dr. R. Kaur'], status: 'In Revision' },
    { title: 'Blockchain for Scholarly Reputation', authors: ['Dr. M. Osei'], status: 'Rejected' },
    { title: 'Altmetrics in the Global South', authors: ['Prof. A. Rivera'], status: 'Rejected' },
    { title: 'Open Peer Review Pilot Report', authors: ['Dr. S. Alabi'], status: 'Editorial Screening' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Published' },
    { issueNumber: '4', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 3, 2026',
  impactMetrics: {
    impactFactor: 4.8,
    fiveYearImpactFactor: 5.2,
    citeScore: 6.1,
    sjr: 1.45,
    snip: 1.8,
    hIndex: 63,
    totalCitations: 18400,
    totalDownloads: 412000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjor-cfp-1',
      title: 'Special Issue on Trustworthy AI',
      theme: 'Trustworthy and Responsible AI',
      deadline: '2026-10-15',
      status: 'Open',
      submissionTypes: ['Research Article', 'Review Article', 'Dataset'],
      targetIssue: 'Issue 7, 2027',
      guestEditor: 'Prof. A. Rivera',
    },
    {
      id: 'sjor-cfp-2',
      title: 'Special Issue on Research Integrity',
      theme: 'Integrity and Verification in Scholarly Publishing',
      deadline: '2026-11-30',
      status: 'Open',
      submissionTypes: ['Research Article', 'Perspective', 'Commentary'],
      targetIssue: 'Issue 8, 2027',
      guestEditor: 'Dr. R. Kaur',
    },
    {
      id: 'sjor-cfp-3',
      title: 'Special Issue on Open Data',
      theme: 'Open Data Publishing and Reuse',
      deadline: '2026-08-31',
      status: 'Closed',
      submissionTypes: ['Dataset', 'Protocol'],
      targetIssue: 'Issue 4, 2026',
      guestEditor: 'Dr. N. Owusu',
    },
  ],
  publicationQueue: [
    {
      id: 'sjor-pq-1',
      title: 'FAIR Data Curation for Research Repositories',
      authors: ['Dr. P. Silva'],
      stage: 'Copyediting',
      doi: '10.46793/sjor.2026.3.11',
      issue: 'Issue 3, 2026',
      scheduledPublication: '2026-08-15',
    },
    {
      id: 'sjor-pq-2',
      title: 'Reproducible Evaluation of Large Language Models',
      authors: ['Dr. T. Zhang', 'Dr. S. Alabi'],
      stage: 'Typesetting',
      doi: '10.46793/sjor.2026.3.12',
      issue: 'Issue 3, 2026',
      scheduledPublication: '2026-08-20',
    },
    {
      id: 'sjor-pq-3',
      title: 'Verified Identity Frameworks in the Wild',
      authors: ['Dr. N. Owusu'],
      stage: 'Proofreading',
      issue: 'Issue 4, 2026',
      scheduledPublication: '2026-09-15',
    },
  ],
  issueSchedule: [
    {
      id: 'sjor-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-08-20',
      status: 'In Production',
      theme: 'Open Science Infrastructure',
      articles: 8,
    },
    {
      id: 'sjor-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-15',
      status: 'Planned',
      theme: 'Trustworthy AI',
      articles: 10,
    },
    {
      id: 'sjor-sch-3',
      issueNumber: '5',
      volume: '2',
      year: '2026',
      publicationDate: '2026-10-20',
      status: 'Planned',
      theme: 'General Issue',
      articles: 9,
    },
  ],
  editorialDecisionStats: {
    submitted: 418,
    underReview: 34,
    inRevision: 18,
    accepted: 96,
    rejected: 148,
    inProduction: 9,
    published: 264,
    acceptanceRate: 31,
    rejectionRate: 48,
    avgDaysToFirstDecision: 38,
    avgDaysToAcceptance: 142,
  },
  policy: {
    articleProcessingCharges: 'None (Diamond Open Access)',
    submissionFee: 'None',
    embargoPeriod: 'None',
    licensing: 'Creative Commons Attribution 4.0 (CC BY)',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'All manuscripts screened with plagiarism detection software',
    dataPolicy: 'Data availability statements required; data must be FAIR',
    ethicsPolicy: 'Research ethics compliance required; ethics clearance evidence collected',
    appealsPolicy: 'Formal appeals handled by the Editor-in-Chief within 30 days',
    conflictsOfInterestPolicy: 'Declarations collected from authors, editors, and reviewers',
    preprintsPolicy: 'Preprint posting permitted before and after submission',
  },
  analytics: {
    annualSubmissions: 312,
    annualPublications: 98,
    acceptanceRate: 31,
    rejectionRate: 48,
    totalDownloads: 412000,
    totalCitations: 18400,
    altmetricScore: 94,
    googleScholarRank: 'Top 5%',
    medianDaysToFirstDecision: 38,
    medianDaysToAcceptance: 142,
  },
});

const SCHOLATIA_COMPUTATIONAL_LINGUISTICS: JournalProfile = makeJournal({
  journalId: 'JNL-002',
  journalTitle: 'Scholatia Journal of Computational Linguistics',
  shortTitle: 'SJCL',
  issn: '2753-1011',
  eissn: '2753-102X',
  doiPrefix: '10.46793/sjcl',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia Partner Institution',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Computational Linguistics',
  researchAreas: ['Natural Language Processing', 'Dependency Parsing', 'Language Resources'],
  aimsAndScope: 'Publishes high-quality research on the computational analysis of natural language across all languages and modalities.',
  editorialPolicy: 'The journal follows a double-blind editorial process with transparent reviewer guidance.',
  openAccessStatus: 'Hybrid',
  publicationFrequency: 'Quarterly',
  reviewModel: 'Double Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Scopus'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'Indexed' },
  ],
  website: 'https://example.org/sjcl',
  verificationStatus: 'Verified',
  trustScore: 93,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. E. Mensah', affiliation: 'Scholatia Partner Institution' },
    { role: 'Associate Editor', name: 'Dr. K. Tanaka', affiliation: 'Tech University' },
    { role: 'Reviews Editor', name: 'Dr. B. Okafor', affiliation: 'Institute for Computational Linguistics' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Short Communication', 'Dataset', 'Software Paper'],
  peerReviewModes: ['Double Blind', 'Open Review'],
  editors: ['Prof. E. Mensah', 'Dr. K. Tanaka'],
  reviewBoard: ['Dr. V. Popescu', 'Dr. A. Iwata', 'Dr. L. Meyer', 'Dr. G. Haddad'],
  productionTeam: ['Production Office', 'Typesetting Team'],
  publishingStaff: ['Publishing Team'],
  articles: [
    { title: 'Cross-Lingual Transfer in Low-Resource Parsing', authors: ['Dr. J. Scholar', 'Dr. C. Researcher'], status: 'Published' },
    { title: 'Annotation Consistency across Multilingual Treebanks', authors: ['Dr. D. Linguist'], status: 'Published' },
    { title: 'Neural Language Models for Historical Texts', authors: ['Dr. A. Iwata'], status: 'Accepted' },
    { title: 'Evaluation Harnesses for Speech Recognition', authors: ['Dr. V. Popescu'], status: 'Under Review' },
    { title: 'Typology-Aware Transfer Schedules', authors: ['Dr. L. Meyer'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 3.9,
    fiveYearImpactFactor: 4.4,
    citeScore: 5.2,
    sjr: 1.2,
    snip: 1.55,
    hIndex: 51,
    totalCitations: 11200,
    totalDownloads: 268000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjcl-cfp-1',
      title: 'Special Issue on Multilingual NLP',
      theme: 'Multilingual and Low-Resource Natural Language Processing',
      deadline: '2026-12-15',
      status: 'Open',
      submissionTypes: ['Research Article', 'Review Article', 'Dataset'],
      targetIssue: 'Issue 5, 2027',
      guestEditor: 'Prof. E. Mensah',
    },
  ],
  publicationQueue: [
    {
      id: 'sjcl-pq-1',
      title: 'Neural Language Models for Historical Texts',
      authors: ['Dr. A. Iwata'],
      stage: 'Proofreading',
      doi: '10.46793/sjcl.2026.2.21',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-30',
    },
  ],
  issueSchedule: [
    {
      id: 'sjcl-sch-1',
      issueNumber: '2',
      volume: '2',
      year: '2026',
      publicationDate: '2026-08-30',
      status: 'In Production',
      theme: 'Language Resources and Evaluation',
      articles: 7,
    },
    {
      id: 'sjcl-sch-2',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-11-30',
      status: 'Planned',
      theme: 'General Issue',
      articles: 8,
    },
  ],
  editorialDecisionStats: {
    submitted: 186,
    underReview: 21,
    inRevision: 9,
    accepted: 38,
    rejected: 74,
    inProduction: 4,
    published: 108,
    acceptanceRate: 32,
    rejectionRate: 52,
    avgDaysToFirstDecision: 47,
    avgDaysToAcceptance: 168,
  },
  policy: {
    articleProcessingCharges: 'Optional open access fee of £1,800',
    submissionFee: 'None',
    embargoPeriod: '12 months for subscription articles',
    licensing: 'Creative Commons Attribution 4.0 (CC BY) for open articles',
    copyright: 'Authors retain copyright; subscription articles assigned to publisher',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data and code availability statements required for research articles',
    ethicsPolicy: 'Adherence to the ACM Code of Ethics required',
    appealsPolicy: 'Appeals reviewed by the editorial board',
    conflictsOfInterestPolicy: 'Declarations collected from all authors and reviewers',
    preprintsPolicy: 'Preprints permitted with a link on acceptance',
  },
  analytics: {
    annualSubmissions: 141,
    annualPublications: 54,
    acceptanceRate: 32,
    rejectionRate: 52,
    totalDownloads: 268000,
    totalCitations: 11200,
    altmetricScore: 71,
    googleScholarRank: 'Top 15%',
    medianDaysToFirstDecision: 47,
    medianDaysToAcceptance: 168,
  },
});

const SCHOLATIA_BIOMEDICAL_DATA_SCIENCE: JournalProfile = makeJournal({
  journalId: 'JNL-003',
  journalTitle: 'Scholatia Journal of Biomedical Data Science',
  shortTitle: 'SJBDS',
  issn: '2753-1135',
  eissn: '2753-1143',
  doiPrefix: '10.46793/sjbds',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia Partner Institution',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Biomedical Informatics',
  researchAreas: ['Health Data Science', 'Bioinformatics', 'Clinical Analytics'],
  aimsAndScope: 'Advances the application of data science, machine learning, and informatics to biomedical research and clinical practice.',
  editorialPolicy: 'The journal prioritises methodological rigour, reproducibility, and open sharing of health data assets.',
  openAccessStatus: 'Gold',
  publicationFrequency: 'Monthly',
  reviewModel: 'Double Blind',
  indexingServices: ['PubMed Central', 'Crossref', 'Scopus'],
  indexingRecords: [
    { service: 'PubMed Central', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'In Review' },
  ],
  website: 'https://example.org/sjbds',
  verificationStatus: 'Verified',
  trustScore: 91,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. H. Adeyemi', affiliation: 'University of Lagos' },
    { role: 'Deputy Editor', name: 'Dr. F. Moreau', affiliation: 'Scholatia Partner Institution' },
    { role: 'Statistical Editor', name: 'Dr. P. Novak', affiliation: 'Research Institute' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Short Communication', 'Dataset', 'Software Paper', 'Protocol'],
  peerReviewModes: ['Double Blind'],
  editors: ['Prof. H. Adeyemi', 'Dr. F. Moreau'],
  reviewBoard: ['Dr. C. Duarte', 'Dr. M. Al-Rashid', 'Dr. Y. Kim', 'Dr. R. Whitfield', 'Dr. L. Okafor'],
  productionTeam: ['Production Office', 'Copyediting Desk'],
  publishingStaff: ['Publishing Team', 'Compliance Officer'],
  articles: [
    { title: 'Federated Learning for Multicentre Clinical Data', authors: ['Dr. F. Moreau', 'Dr. C. Duarte'], status: 'Published' },
    { title: 'Benchmarking Survival Models on Real-World Data', authors: ['Dr. P. Novak'], status: 'Published' },
    { title: 'Privacy-Preserving Genotype Analysis', authors: ['Dr. M. Al-Rashid'], status: 'Accepted' },
    { title: 'Medical Imaging Transfer Learning under Data Scarcity', authors: ['Dr. Y. Kim'], status: 'In Production' },
    { title: 'Explainable AI for ICU Predictions', authors: ['Dr. R. Whitfield'], status: 'Under Review' },
    { title: 'Electronic Health Record Harmonisation Framework', authors: ['Dr. L. Okafor'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 5.4,
    fiveYearImpactFactor: 5.9,
    citeScore: 7.2,
    sjr: 1.6,
    snip: 2.1,
    hIndex: 57,
    totalCitations: 14900,
    totalDownloads: 305000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjbds-cfp-1',
      title: 'Special Issue on Health AI',
      theme: 'Responsible AI in Clinical Practice',
      deadline: '2026-09-30',
      status: 'Open',
      submissionTypes: ['Research Article', 'Dataset', 'Protocol'],
      targetIssue: 'Issue 6, 2027',
      guestEditor: 'Prof. H. Adeyemi',
    },
    {
      id: 'sjbds-cfp-2',
      title: 'Special Issue on Rare Disease Data',
      theme: 'Data Sharing for Rare Diseases',
      deadline: '2026-08-15',
      status: 'Closed',
      submissionTypes: ['Dataset', 'Research Article'],
      targetIssue: 'Issue 3, 2026',
      guestEditor: 'Dr. F. Moreau',
    },
  ],
  publicationQueue: [
    {
      id: 'sjbds-pq-1',
      title: 'Medical Imaging Transfer Learning under Data Scarcity',
      authors: ['Dr. Y. Kim'],
      stage: 'Copyediting',
      doi: '10.46793/sjbds.2026.2.17',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-10',
    },
    {
      id: 'sjbds-pq-2',
      title: 'Privacy-Preserving Genotype Analysis',
      authors: ['Dr. M. Al-Rashid'],
      stage: 'Typesetting',
      issue: 'Issue 3, 2026',
      scheduledPublication: '2026-09-05',
    },
  ],
  issueSchedule: [
    {
      id: 'sjbds-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-05',
      status: 'In Production',
      theme: 'Health AI and Informatics',
      articles: 9,
    },
    {
      id: 'sjbds-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-10-10',
      status: 'Planned',
      theme: 'General Issue',
      articles: 10,
    },
  ],
  editorialDecisionStats: {
    submitted: 224,
    underReview: 26,
    inRevision: 14,
    accepted: 52,
    rejected: 96,
    inProduction: 7,
    published: 126,
    acceptanceRate: 34,
    rejectionRate: 51,
    avgDaysToFirstDecision: 35,
    avgDaysToAcceptance: 138,
  },
  policy: {
    articleProcessingCharges: '£1,900 (Gold Open Access)',
    submissionFee: 'None',
    embargoPeriod: 'None',
    licensing: 'Creative Commons Attribution 4.0 (CC BY)',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data sharing statements required; clinical data governed by consent agreements',
    ethicsPolicy: 'Ethics committee approval documentation required for clinical studies',
    appealsPolicy: 'Appeals considered by the editor-in-chief within 60 days',
    conflictsOfInterestPolicy: 'Declarations collected from authors, editors, and reviewers',
    preprintsPolicy: 'Preprints permitted for research articles',
  },
  analytics: {
    annualSubmissions: 201,
    annualPublications: 68,
    acceptanceRate: 34,
    rejectionRate: 51,
    totalDownloads: 305000,
    totalCitations: 14900,
    altmetricScore: 83,
    googleScholarRank: 'Top 10%',
    medianDaysToFirstDecision: 35,
    medianDaysToAcceptance: 138,
  },
});

const SCHOLATIA_CLIMATE_ENVIRONMENT: JournalProfile = makeJournal({
  journalId: 'JNL-004',
  journalTitle: 'Scholatia Journal of Climate and Environment',
  shortTitle: 'SJCE',
  issn: '2753-1224',
  eissn: '2753-1232',
  doiPrefix: '10.46793/sjce',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia Partner Institution',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Environmental Science',
  researchAreas: ['Climate Science', 'Environmental Monitoring', 'Sustainability'],
  aimsAndScope: 'Publishes evidence-driven research on climate change, environmental systems, and sustainable development.',
  editorialPolicy: 'The journal values interdisciplinary evidence and transparent data reporting.',
  openAccessStatus: 'Hybrid',
  publicationFrequency: 'Bimonthly',
  reviewModel: 'Single Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Web of Science'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Web of Science', status: 'In Review' },
  ],
  website: 'https://example.org/sjce',
  verificationStatus: 'Verified',
  trustScore: 89,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. I. Njoroge', affiliation: 'University of Nairobi' },
    { role: 'Managing Editor', name: 'Dr. C. Andersson', affiliation: 'Scholatia Partner Institution' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Short Communication', 'Dataset', 'Case Study'],
  peerReviewModes: ['Single Blind', 'Open Review'],
  editors: ['Prof. I. Njoroge', 'Dr. C. Andersson'],
  reviewBoard: ['Dr. E. Sato', 'Dr. W. Mensah', 'Dr. A. Reyes', 'Dr. T. Lindqvist'],
  productionTeam: ['Production Office'],
  publishingStaff: ['Publishing Team'],
  articles: [
    { title: 'Urban Heat Islands and Public Health in Tropical Cities', authors: ['Dr. E. Sato'], status: 'Published' },
    { title: 'Community-Based Monitoring of Coastal Erosion', authors: ['Dr. W. Mensah'], status: 'Published' },
    { title: 'Carbon Accounting Frameworks for Small States', authors: ['Prof. I. Njoroge'], status: 'Accepted' },
    { title: 'Remote Sensing of Deforestation Hotspots', authors: ['Dr. A. Reyes'], status: 'Under Review' },
    { title: 'Seasonal Variability in Precipitation Extremes', authors: ['Dr. T. Lindqvist'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 4.2,
    fiveYearImpactFactor: 4.7,
    citeScore: 5.8,
    sjr: 1.3,
    snip: 1.7,
    hIndex: 48,
    totalCitations: 9600,
    totalDownloads: 214000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjce-cfp-1',
      title: 'Special Issue on Climate Adaptation',
      theme: 'Adaptation Pathways for the Global South',
      deadline: '2026-11-01',
      status: 'Open',
      submissionTypes: ['Research Article', 'Case Study', 'Dataset'],
      targetIssue: 'Issue 5, 2027',
      guestEditor: 'Prof. I. Njoroge',
    },
  ],
  publicationQueue: [
    {
      id: 'sjce-pq-1',
      title: 'Carbon Accounting Frameworks for Small States',
      authors: ['Prof. I. Njoroge'],
      stage: 'Proofreading',
      doi: '10.46793/sjce.2026.2.9',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-25',
    },
  ],
  issueSchedule: [
    {
      id: 'sjce-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-10-15',
      status: 'Planned',
      theme: 'Climate Adaptation and Resilience',
      articles: 8,
    },
    {
      id: 'sjce-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-12-15',
      status: 'Planned',
      theme: 'General Issue',
      articles: 9,
    },
  ],
  editorialDecisionStats: {
    submitted: 152,
    underReview: 19,
    inRevision: 8,
    accepted: 34,
    rejected: 61,
    inProduction: 3,
    published: 89,
    acceptanceRate: 35,
    rejectionRate: 49,
    avgDaysToFirstDecision: 41,
    avgDaysToAcceptance: 155,
  },
  policy: {
    articleProcessingCharges: 'Optional open access fee of £1,600',
    submissionFee: 'None',
    embargoPeriod: '12 months for subscription articles',
    licensing: 'Creative Commons Attribution 4.0 (CC BY) for open articles',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data availability statements required; environmental data encouraged openly',
    ethicsPolicy: 'Fieldwork ethics and community consent standards enforced',
    appealsPolicy: 'Appeals reviewed by the editorial board',
    conflictsOfInterestPolicy: 'Declarations collected from all parties',
    preprintsPolicy: 'Preprints permitted',
  },
  analytics: {
    annualSubmissions: 119,
    annualPublications: 44,
    acceptanceRate: 35,
    rejectionRate: 49,
    totalDownloads: 214000,
    totalCitations: 9600,
    altmetricScore: 66,
    googleScholarRank: 'Top 20%',
    medianDaysToFirstDecision: 41,
    medianDaysToAcceptance: 155,
  },
});

const SCHOLATIA_HIGHER_EDUCATION: JournalProfile = makeJournal({
  journalId: 'JNL-005',
  journalTitle: 'Scholatia Journal of Higher Education',
  shortTitle: 'SJHE',
  issn: '2753-1313',
  eissn: '2753-1321',
  doiPrefix: '10.46793/sjhe',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia Partner Institution',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Education',
  researchAreas: ['Higher Education Policy', 'Pedagogy', 'Digital Learning'],
  aimsAndScope: 'Advances scholarship on higher education teaching, learning, governance, and policy.',
  editorialPolicy: 'The journal promotes diverse voices and rigorous qualitative and quantitative research.',
  openAccessStatus: 'Subscription',
  publicationFrequency: 'Quarterly',
  reviewModel: 'Double Blind',
  indexingServices: ['ERIC', 'Crossref', 'Scopus'],
  indexingRecords: [
    { service: 'ERIC', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'Indexed' },
  ],
  website: 'https://example.org/sjhe',
  verificationStatus: 'Verified',
  trustScore: 88,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. S. Bell', affiliation: 'University of Cambridge' },
    { role: 'Associate Editor', name: 'Dr. R. Nkrumah', affiliation: 'University of Ghana' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Case Study', 'Short Communication'],
  peerReviewModes: ['Double Blind'],
  editors: ['Prof. S. Bell', 'Dr. R. Nkrumah'],
  reviewBoard: ['Dr. M. Pires', 'Dr. K. Okonkwo', 'Dr. H. Whitfield', 'Dr. A. Nakamura'],
  productionTeam: ['Production Office', 'Copyediting Desk'],
  publishingStaff: ['Publishing Team'],
  articles: [
    { title: 'Institutional Trust and Student Retention', authors: ['Dr. R. Nkrumah'], status: 'Published' },
    { title: 'Digital Divide in Remote Learning Delivery', authors: ['Dr. M. Pires'], status: 'Published' },
    { title: 'Research Integrity Training in Undergraduate Curricula', authors: ['Prof. S. Bell'], status: 'Accepted' },
    { title: 'Academic Identity and Career Progression', authors: ['Dr. K. Okonkwo'], status: 'Under Review' },
    { title: 'The Role of Mentoring in Doctoral Completion', authors: ['Dr. H. Whitfield'], status: 'In Revision' },
    { title: 'Micro-credentialing Trends in the Commonwealth', authors: ['Dr. A. Nakamura'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 2.6,
    fiveYearImpactFactor: 2.9,
    citeScore: 3.4,
    sjr: 0.85,
    snip: 1.1,
    hIndex: 37,
    totalCitations: 6100,
    totalDownloads: 143000,
    quartile: 'Q2',
  },
  callsForPapers: [
    {
      id: 'sjhe-cfp-1',
      title: 'Special Issue on Digital Transformation',
      theme: 'Digital Transformation of Higher Education',
      deadline: '2026-10-31',
      status: 'Open',
      submissionTypes: ['Research Article', 'Case Study'],
      targetIssue: 'Issue 4, 2027',
      guestEditor: 'Prof. S. Bell',
    },
  ],
  publicationQueue: [],
  issueSchedule: [
    {
      id: 'sjhe-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-30',
      status: 'In Production',
      theme: 'Teaching and Learning Innovation',
      articles: 6,
    },
    {
      id: 'sjhe-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-12-31',
      status: 'Planned',
      theme: 'General Issue',
      articles: 7,
    },
  ],
  editorialDecisionStats: {
    submitted: 118,
    underReview: 14,
    inRevision: 6,
    accepted: 27,
    rejected: 51,
    inProduction: 2,
    published: 74,
    acceptanceRate: 33,
    rejectionRate: 50,
    avgDaysToFirstDecision: 44,
    avgDaysToAcceptance: 172,
  },
  policy: {
    articleProcessingCharges: 'Not applicable (subscription journal)',
    submissionFee: 'None',
    embargoPeriod: '18 months',
    licensing: 'Author-assigned licence on a case-by-case basis',
    copyright: 'Copyright transferred to the publisher on acceptance',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data availability statements encouraged',
    ethicsPolicy: 'Educational research ethics standards applied',
    appealsPolicy: 'Appeals reviewed by the editorial board',
    conflictsOfInterestPolicy: 'Declarations collected from authors and reviewers',
    preprintsPolicy: 'Preprints permitted',
  },
  analytics: {
    annualSubmissions: 96,
    annualPublications: 31,
    acceptanceRate: 33,
    rejectionRate: 50,
    totalDownloads: 143000,
    totalCitations: 6100,
    altmetricScore: 52,
    googleScholarRank: 'Top 30%',
    medianDaysToFirstDecision: 44,
    medianDaysToAcceptance: 172,
  },
});

const SCHOLATIA_AFRICAN_STUDIES: JournalProfile = makeJournal({
  journalId: 'JNL-006',
  journalTitle: 'Scholatia Journal of African Studies',
  shortTitle: 'SJAS',
  issn: '2753-1402',
  eissn: '2753-1410',
  doiPrefix: '10.46793/sjas',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'University of Ghana',
  country: 'Ghana',
  language: 'English',
  discipline: 'Area Studies',
  researchAreas: ['African Studies', 'Postcolonial Studies', 'Public Policy'],
  aimsAndScope: 'Provides a rigorous, globally visible venue for interdisciplinary scholarship on Africa and the diaspora.',
  editorialPolicy: 'The journal centres African scholarship and community engagement.',
  openAccessStatus: 'Open Access',
  publicationFrequency: 'Bimonthly',
  reviewModel: 'Open Review',
  indexingServices: ['DOAJ', 'Crossref'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
  ],
  website: 'https://example.org/sjas',
  verificationStatus: 'Trusted',
  trustScore: 90,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. A. Adebayo', affiliation: 'University of Ghana' },
    { role: 'Managing Editor', name: 'Dr. N. Kiprop', affiliation: 'University of Nairobi' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Case Study', 'Perspective', 'Book Review'],
  peerReviewModes: ['Open Review', 'Transparent Review'],
  editors: ['Prof. A. Adebayo', 'Dr. N. Kiprop'],
  reviewBoard: ['Dr. C. Diop', 'Dr. L. Balogun', 'Dr. S. Mwangi', 'Dr. F. Ndlovu'],
  productionTeam: ['Production Office'],
  publishingStaff: ['Publishing Team', 'Community Outreach'],
  articles: [
    { title: 'Digital Archives and the Preservation of Indigenous Knowledge', authors: ['Dr. C. Diop'], status: 'Published' },
    { title: 'Decolonising Scholarly Publishing Infrastructure', authors: ['Prof. A. Adebayo'], status: 'Published' },
    { title: 'Urbanisation and Informal Economies in West Africa', authors: ['Dr. L. Balogun'], status: 'Accepted' },
    { title: 'Language Policy and Multilingual Education in East Africa', authors: ['Dr. S. Mwangi'], status: 'Under Review' },
    { title: 'Regional Integration and Trade Corridors', authors: ['Dr. F. Ndlovu'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 1.9,
    fiveYearImpactFactor: 2.2,
    citeScore: 2.6,
    sjr: 0.62,
    snip: 0.9,
    hIndex: 29,
    totalCitations: 4300,
    totalDownloads: 128000,
    quartile: 'Q2',
  },
  callsForPapers: [
    {
      id: 'sjas-cfp-1',
      title: 'Special Issue on Digital Humanities in Africa',
      theme: 'Digital Humanities and African Archives',
      deadline: '2026-12-01',
      status: 'Open',
      submissionTypes: ['Research Article', 'Case Study', 'Dataset'],
      targetIssue: 'Issue 5, 2027',
      guestEditor: 'Prof. A. Adebayo',
    },
    {
      id: 'sjas-cfp-2',
      title: 'Special Issue on Higher Education and Development',
      theme: 'Universities and Sustainable Development',
      deadline: '2026-09-01',
      status: 'Upcoming',
      submissionTypes: ['Research Article', 'Perspective'],
      targetIssue: 'Issue 4, 2027',
      guestEditor: 'Dr. N. Kiprop',
    },
  ],
  publicationQueue: [
    {
      id: 'sjas-pq-1',
      title: 'Urbanisation and Informal Economies in West Africa',
      authors: ['Dr. L. Balogun'],
      stage: 'Copyediting',
      doi: '10.46793/sjas.2026.2.14',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-18',
    },
  ],
  issueSchedule: [
    {
      id: 'sjas-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-25',
      status: 'In Production',
      theme: 'Digital Archives and Knowledge Systems',
      articles: 7,
    },
    {
      id: 'sjas-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-11-25',
      status: 'Planned',
      theme: 'General Issue',
      articles: 8,
    },
  ],
  editorialDecisionStats: {
    submitted: 134,
    underReview: 17,
    inRevision: 7,
    accepted: 31,
    rejected: 55,
    inProduction: 4,
    published: 82,
    acceptanceRate: 36,
    rejectionRate: 47,
    avgDaysToFirstDecision: 36,
    avgDaysToAcceptance: 149,
  },
  policy: {
    articleProcessingCharges: 'None (author-side waived for Global South authors)',
    submissionFee: 'None',
    embargoPeriod: 'None',
    licensing: 'Creative Commons Attribution 4.0 (CC BY)',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data availability statements required; open data encouraged',
    ethicsPolicy: 'Community consent and research ethics enforced for fieldwork',
    appealsPolicy: 'Appeals handled by the editor-in-chief',
    conflictsOfInterestPolicy: 'Declarations collected from all parties',
    preprintsPolicy: 'Preprints permitted',
  },
  analytics: {
    annualSubmissions: 112,
    annualPublications: 40,
    acceptanceRate: 36,
    rejectionRate: 47,
    totalDownloads: 128000,
    totalCitations: 4300,
    altmetricScore: 58,
    googleScholarRank: 'Top 25%',
    medianDaysToFirstDecision: 36,
    medianDaysToAcceptance: 149,
  },
});

const SCHOLATIA_SOCIAL_DATA_SCIENCE: JournalProfile = makeJournal({
  journalId: 'JNL-007',
  journalTitle: 'Scholatia Journal of Social Data Science',
  shortTitle: 'SJSDS',
  issn: '2753-1526',
  eissn: '2753-1534',
  doiPrefix: '10.46793/sjsds',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia Partner Institution',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Social Science',
  researchAreas: ['Computational Social Science', 'Data Ethics', 'Social Analytics'],
  aimsAndScope: 'Publishes computational and data-driven research on social phenomena with attention to ethics and fairness.',
  editorialPolicy: 'The journal requires rigorous methods and explicit attention to algorithmic fairness.',
  openAccessStatus: 'Hybrid',
  publicationFrequency: 'Quarterly',
  reviewModel: 'Double Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Scopus'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'In Review' },
  ],
  website: 'https://example.org/sjsds',
  verificationStatus: 'Verified',
  trustScore: 87,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. M. Rossi', affiliation: 'Scholatia Partner Institution' },
    { role: 'Associate Editor', name: 'Dr. Q. Hussain', affiliation: 'Research Institute' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Dataset', 'Software Paper', 'Short Communication'],
  peerReviewModes: ['Double Blind', 'Transparent Review'],
  editors: ['Prof. M. Rossi', 'Dr. Q. Hussain'],
  reviewBoard: ['Dr. I. Fontaine', 'Dr. B. Chopra', 'Dr. E. Osei', 'Dr. S. Wang'],
  productionTeam: ['Production Office', 'Typesetting Team'],
  publishingStaff: ['Publishing Team'],
  articles: [
    { title: 'Fairness Metrics for Social Media Moderation', authors: ['Dr. I. Fontaine'], status: 'Published' },
    { title: 'Opinion Dynamics on Multilingual Networks', authors: ['Dr. B. Chopra'], status: 'Published' },
    { title: 'Measuring Digital Inequalities with Mobile Data', authors: ['Dr. E. Osei'], status: 'Accepted' },
    { title: 'Causal Inference from Observational Social Data', authors: ['Dr. S. Wang'], status: 'Under Review' },
    { title: 'Reproducibility Practices in Computational Social Science', authors: ['Prof. M. Rossi'], status: 'In Revision' },
    { title: 'Predicting Protests from News Corpora', authors: ['Dr. Q. Hussain'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 3.1,
    fiveYearImpactFactor: 3.5,
    citeScore: 4.0,
    sjr: 1.0,
    snip: 1.35,
    hIndex: 41,
    totalCitations: 7800,
    totalDownloads: 197000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjsds-cfp-1',
      title: 'Special Issue on Data Ethics',
      theme: 'Ethics and Governance of Social Data',
      deadline: '2026-10-10',
      status: 'Open',
      submissionTypes: ['Research Article', 'Dataset', 'Perspective'],
      targetIssue: 'Issue 4, 2027',
      guestEditor: 'Prof. M. Rossi',
    },
  ],
  publicationQueue: [
    {
      id: 'sjsds-pq-1',
      title: 'Measuring Digital Inequalities with Mobile Data',
      authors: ['Dr. E. Osei'],
      stage: 'Proofreading',
      doi: '10.46793/sjsds.2026.2.12',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-28',
    },
  ],
  issueSchedule: [
    {
      id: 'sjsds-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-10-30',
      status: 'Planned',
      theme: 'Fairness and Governance of Social Data',
      articles: 7,
    },
  ],
  editorialDecisionStats: {
    submitted: 143,
    underReview: 16,
    inRevision: 8,
    accepted: 32,
    rejected: 60,
    inProduction: 3,
    published: 84,
    acceptanceRate: 34,
    rejectionRate: 51,
    avgDaysToFirstDecision: 39,
    avgDaysToAcceptance: 158,
  },
  policy: {
    articleProcessingCharges: 'Optional open access fee of £1,700',
    submissionFee: 'None',
    embargoPeriod: '12 months',
    licensing: 'Creative Commons Attribution 4.0 (CC BY) for open articles',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data and code availability required; human-subject data protections enforced',
    ethicsPolicy: 'Institutional review board approval required for human data',
    appealsPolicy: 'Appeals reviewed by the editorial board',
    conflictsOfInterestPolicy: 'Declarations collected from all parties',
    preprintsPolicy: 'Preprints permitted',
  },
  analytics: {
    annualSubmissions: 121,
    annualPublications: 38,
    acceptanceRate: 34,
    rejectionRate: 51,
    totalDownloads: 197000,
    totalCitations: 7800,
    altmetricScore: 69,
    googleScholarRank: 'Top 15%',
    medianDaysToFirstDecision: 39,
    medianDaysToAcceptance: 158,
  },
});

const SCHOLATIA_LANGUAGE_DOCUMENTATION: JournalProfile = makeJournal({
  journalId: 'JNL-008',
  journalTitle: 'Scholatia Journal of Language Documentation',
  shortTitle: 'SJLD',
  issn: '2753-1615',
  eissn: '2753-1623',
  doiPrefix: '10.46793/sjld',
  publicationType: 'Journal',
  publisher: 'University of Hawai\u02BBi Press',
  institution: 'University of Hawai\u02BBi',
  country: 'United States',
  language: 'English',
  discipline: 'Linguistics',
  researchAreas: ['Language Documentation', 'Endangered Languages', 'Fieldwork'],
  aimsAndScope: 'Publishes open research on endangered language documentation, fieldwork methods, and community linguistics.',
  editorialPolicy: 'The journal follows open review with strong community data sovereignty standards.',
  openAccessStatus: 'Diamond',
  publicationFrequency: 'Biannual',
  reviewModel: 'Open Review',
  indexingServices: ['DOAJ', 'Crossref'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
  ],
  website: 'https://example.org/sjld',
  verificationStatus: 'Trusted',
  trustScore: 92,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. K. Makela', affiliation: 'University of Hawai\u02BBi' },
    { role: 'Reviews Editor', name: 'Dr. O. Ramirez', affiliation: 'Research Institute' },
  ],
  submissionTypes: ['Research Article', 'Case Study', 'Dataset', 'Protocol'],
  peerReviewModes: ['Open Review', 'Transparent Review'],
  editors: ['Prof. K. Makela', 'Dr. O. Ramirez'],
  reviewBoard: ['Dr. N. Silva', 'Dr. T. Lartey', 'Dr. G. Frost', 'Dr. M. Aro'],
  productionTeam: ['Production Office'],
  publishingStaff: ['Publishing Team'],
  articles: [
    { title: 'Community Data Sovereignty in Language Archives', authors: ['Dr. N. Silva'], status: 'Published' },
    { title: 'Phonetic Documentation of Understudied Varieties', authors: ['Dr. T. Lartey'], status: 'Published' },
    { title: 'Grammar Sketch of an Endangered Bantu Language', authors: ['Dr. G. Frost'], status: 'Accepted' },
    { title: 'Speech Technology for Documentation Workflows', authors: ['Dr. M. Aro'], status: 'Under Review' },
    { title: 'Lexicographic Best Practices for Small Communities', authors: ['Prof. K. Makela'], status: 'In Revision' },
    { title: 'Typological Claims from Single-Speaker Corpora', authors: ['Dr. O. Ramirez'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 2.3,
    fiveYearImpactFactor: 2.6,
    citeScore: 3.1,
    sjr: 0.78,
    snip: 1.05,
    hIndex: 34,
    totalCitations: 5200,
    totalDownloads: 164000,
    quartile: 'Q2',
  },
  callsForPapers: [
    {
      id: 'sjld-cfp-1',
      title: 'Special Issue on Community Linguistics',
      theme: 'Community-Led Documentation Practices',
      deadline: '2027-01-15',
      status: 'Open',
      submissionTypes: ['Research Article', 'Case Study', 'Dataset'],
      targetIssue: 'Issue 3, 2027',
      guestEditor: 'Prof. K. Makela',
    },
  ],
  publicationQueue: [
    {
      id: 'sjld-pq-1',
      title: 'Grammar Sketch of an Endangered Bantu Language',
      authors: ['Dr. G. Frost'],
      stage: 'Typesetting',
      doi: '10.46793/sjld.2026.2.8',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-09-10',
    },
  ],
  issueSchedule: [
    {
      id: 'sjld-sch-1',
      issueNumber: '2',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-10',
      status: 'In Production',
      theme: 'Community-Led Documentation',
      articles: 5,
    },
    {
      id: 'sjld-sch-2',
      issueNumber: '1',
      volume: '3',
      year: '2027',
      publicationDate: '2027-03-10',
      status: 'Planned',
      theme: 'Fieldwork Methods',
      articles: 6,
    },
  ],
  editorialDecisionStats: {
    submitted: 87,
    underReview: 11,
    inRevision: 5,
    accepted: 22,
    rejected: 35,
    inProduction: 2,
    published: 58,
    acceptanceRate: 37,
    rejectionRate: 45,
    avgDaysToFirstDecision: 43,
    avgDaysToAcceptance: 161,
  },
  policy: {
    articleProcessingCharges: 'None (Diamond Open Access)',
    submissionFee: 'None',
    embargoPeriod: 'None',
    licensing: 'Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC)',
    copyright: 'Authors retain copyright; community consent terms recorded',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Community data sovereignty agreements required before data publication',
    ethicsPolicy: 'Fieldwork ethics and community consent standards enforced',
    appealsPolicy: 'Appeals handled by the editorial board',
    conflictsOfInterestPolicy: 'Declarations collected from authors and reviewers',
    preprintsPolicy: 'Preprints permitted',
  },
  analytics: {
    annualSubmissions: 74,
    annualPublications: 27,
    acceptanceRate: 37,
    rejectionRate: 45,
    totalDownloads: 164000,
    totalCitations: 5200,
    altmetricScore: 61,
    googleScholarRank: 'Top 25%',
    medianDaysToFirstDecision: 43,
    medianDaysToAcceptance: 161,
  },
});

const SCHOLATIA_ENGINEERING_SYSTEMS: JournalProfile = makeJournal({
  journalId: 'JNL-009',
  journalTitle: 'Scholatia Journal of Engineering Systems',
  shortTitle: 'SJES',
  issn: '2753-1712',
  eissn: '2753-1720',
  doiPrefix: '10.46793/sjes',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia Partner Institution',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Engineering',
  researchAreas: ['Systems Engineering', 'Robotics', 'Renewable Energy Systems'],
  aimsAndScope: 'Publishes applied and theoretical research on the design, modelling, and control of engineering systems.',
  editorialPolicy: 'The journal emphasises reproducible experiments and open hardware reports.',
  openAccessStatus: 'Gold',
  publicationFrequency: 'Monthly',
  reviewModel: 'Single Blind',
  indexingServices: ['Crossref', 'Scopus', 'Inspec'],
  indexingRecords: [
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'Indexed' },
    { service: 'Inspec', status: 'In Review' },
  ],
  website: 'https://example.org/sjes',
  verificationStatus: 'Verified',
  trustScore: 90,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. J. Liu', affiliation: 'Tech University' },
    { role: 'Associate Editor', name: 'Dr. S. Fernandez', affiliation: 'Scholatia Partner Institution' },
    { role: 'Industrial Editor', name: 'Dr. A. Mensah', affiliation: 'Industry Partner' },
  ],
  submissionTypes: ['Research Article', 'Short Communication', 'Software Paper', 'Case Study'],
  peerReviewModes: ['Single Blind'],
  editors: ['Prof. J. Liu', 'Dr. S. Fernandez'],
  reviewBoard: ['Dr. R. Tan', 'Dr. K. Bello', 'Dr. C. Zimmerman', 'Dr. P. Okoye'],
  productionTeam: ['Production Office', 'Typesetting Team'],
  publishingStaff: ['Publishing Team'],
  articles: [
    { title: 'Model Predictive Control for Microgrid Stability', authors: ['Dr. R. Tan'], status: 'Published' },
    { title: 'Open-Source Robotics Middleware Benchmarks', authors: ['Dr. K. Bello'], status: 'Published' },
    { title: 'Digital Twins for Renewable Energy Assets', authors: ['Dr. C. Zimmerman'], status: 'Accepted' },
    { title: 'Reliability Analysis of Distributed Sensor Networks', authors: ['Dr. P. Okoye'], status: 'Under Review' },
    { title: 'Low-Cost Instrumentation for Field Laboratories', authors: ['Prof. J. Liu'], status: 'In Revision' },
    { title: 'Optimising Maintenance Scheduling with Reinforcement Learning', authors: ['Dr. S. Fernandez'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 3.7,
    fiveYearImpactFactor: 4.1,
    citeScore: 4.9,
    sjr: 1.15,
    snip: 1.5,
    hIndex: 46,
    totalCitations: 8700,
    totalDownloads: 231000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjes-cfp-1',
      title: 'Special Issue on Smart Energy Systems',
      theme: 'Smart Grids and Renewable Integration',
      deadline: '2026-11-20',
      status: 'Open',
      submissionTypes: ['Research Article', 'Case Study', 'Software Paper'],
      targetIssue: 'Issue 5, 2027',
      guestEditor: 'Prof. J. Liu',
    },
  ],
  publicationQueue: [
    {
      id: 'sjes-pq-1',
      title: 'Digital Twins for Renewable Energy Assets',
      authors: ['Dr. C. Zimmerman'],
      stage: 'Copyediting',
      doi: '10.46793/sjes.2026.2.19',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-22',
    },
    {
      id: 'sjes-pq-2',
      title: 'Low-Cost Instrumentation for Field Laboratories',
      authors: ['Prof. J. Liu'],
      stage: 'Proofreading',
      issue: 'Issue 3, 2026',
      scheduledPublication: '2026-09-12',
    },
  ],
  issueSchedule: [
    {
      id: 'sjes-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-12',
      status: 'In Production',
      theme: 'Energy Systems and Control',
      articles: 8,
    },
    {
      id: 'sjes-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-10-12',
      status: 'Planned',
      theme: 'General Issue',
      articles: 9,
    },
  ],
  editorialDecisionStats: {
    submitted: 197,
    underReview: 22,
    inRevision: 11,
    accepted: 45,
    rejected: 85,
    inProduction: 6,
    published: 111,
    acceptanceRate: 34,
    rejectionRate: 50,
    avgDaysToFirstDecision: 33,
    avgDaysToAcceptance: 134,
  },
  policy: {
    articleProcessingCharges: '£1,750 (Gold Open Access)',
    submissionFee: 'None',
    embargoPeriod: 'None',
    licensing: 'Creative Commons Attribution 4.0 (CC BY)',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'Screened with plagiarism detection software',
    dataPolicy: 'Data and code availability required; open hardware encouraged',
    ethicsPolicy: 'Engineering ethics and safety standards applied',
    appealsPolicy: 'Appeals reviewed by the editor-in-chief',
    conflictsOfInterestPolicy: 'Declarations collected from all parties',
    preprintsPolicy: 'Preprints permitted',
  },
  analytics: {
    annualSubmissions: 168,
    annualPublications: 57,
    acceptanceRate: 34,
    rejectionRate: 50,
    totalDownloads: 231000,
    totalCitations: 8700,
    altmetricScore: 64,
    googleScholarRank: 'Top 15%',
    medianDaysToFirstDecision: 33,
    medianDaysToAcceptance: 134,
  },
});

const SCHOLATIA_RESEARCH_INTEGRITY: JournalProfile = makeJournal({
  journalId: 'JNL-010',
  journalTitle: 'Scholatia Journal of Research Integrity',
  shortTitle: 'SJRI',
  issn: '2753-1801',
  eissn: '2753-181X',
  doiPrefix: '10.46793/sjri',
  publicationType: 'Journal',
  publisher: 'Scholatia Press',
  institution: 'Scholatia',
  country: 'United Kingdom',
  language: 'English',
  discipline: 'Research Integrity',
  researchAreas: ['Research Integrity', 'Reproducibility', 'Scholarly Ethics'],
  aimsAndScope: 'Publishes policy, empirical, and methodological research on research integrity, reproducibility, and scholarly ethics.',
  editorialPolicy: 'The journal is a leading voice on integrity standards, with transparent handling of research misconduct cases.',
  openAccessStatus: 'Open Access',
  publicationFrequency: 'Quarterly',
  reviewModel: 'Double Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Scopus'],
  indexingRecords: [
    { service: 'DOAJ', status: 'Indexed' },
    { service: 'Crossref', status: 'Indexed' },
    { service: 'Scopus', status: 'Indexed' },
  ],
  website: 'https://example.org/sjri',
  verificationStatus: 'Trusted',
  trustScore: 95,
  editorialStructure: [
    { role: 'Editor-in-Chief', name: 'Prof. R. Whitfield', affiliation: 'Scholatia' },
    { role: 'Integrity Editor', name: 'Dr. V. Ivanova', affiliation: 'Scholatia Partner Institution' },
    { role: 'Ethics Advisor', name: 'Prof. M. Tanaka', affiliation: 'University of Oxford' },
  ],
  submissionTypes: ['Research Article', 'Review Article', 'Perspective', 'Case Study', 'Commentary'],
  peerReviewModes: ['Double Blind', 'Transparent Review'],
  editors: ['Prof. R. Whitfield', 'Dr. V. Ivanova'],
  reviewBoard: ['Dr. H. Dubois', 'Dr. E. Karanja', 'Dr. S. Nakamura', 'Dr. L. Petrova', 'Dr. A. Bianchi'],
  productionTeam: ['Production Office', 'Copyediting Desk'],
  publishingStaff: ['Publishing Team', 'Integrity Officer'],
  articles: [
    { title: 'Reproducibility Checklists across Disciplines', authors: ['Dr. V. Ivanova'], status: 'Published' },
    { title: 'Retraction Practices and Post-Publication Correction', authors: ['Prof. R. Whitfield'], status: 'Published' },
    { title: 'AI-Generated Content Disclosure Policies', authors: ['Dr. E. Karanja'], status: 'Accepted' },
    { title: 'Image Manipulation Detection at Scale', authors: ['Dr. L. Petrova'], status: 'Under Review' },
    { title: 'Preprint Integrity and Peer Review Overlap', authors: ['Dr. A. Bianchi'], status: 'In Revision' },
    { title: 'Bias in Peer Review Assignments', authors: ['Dr. H. Dubois'], status: 'Rejected' },
  ],
  issues: [
    { issueNumber: '1', year: '2025', status: 'Published' },
    { issueNumber: '2', year: '2026', status: 'Published' },
    { issueNumber: '3', year: '2026', status: 'Upcoming' },
  ],
  volumes: [
    { volumeNumber: '1', year: '2025', status: 'Published' },
    { volumeNumber: '2', year: '2026', status: 'Upcoming' },
  ],
  latestIssue: 'Issue 2, 2026',
  impactMetrics: {
    impactFactor: 4.5,
    fiveYearImpactFactor: 5.0,
    citeScore: 5.9,
    sjr: 1.4,
    snip: 1.75,
    hIndex: 55,
    totalCitations: 13100,
    totalDownloads: 289000,
    quartile: 'Q1',
  },
  callsForPapers: [
    {
      id: 'sjri-cfp-1',
      title: 'Special Issue on AI and Integrity',
      theme: 'Artificial Intelligence in Scholarly Publishing',
      deadline: '2026-12-20',
      status: 'Open',
      submissionTypes: ['Research Article', 'Perspective', 'Commentary'],
      targetIssue: 'Issue 6, 2027',
      guestEditor: 'Prof. R. Whitfield',
    },
    {
      id: 'sjri-cfp-2',
      title: 'Special Issue on Reproducibility',
      theme: 'Reproducible Research Practices',
      deadline: '2026-10-01',
      status: 'Upcoming',
      submissionTypes: ['Research Article', 'Case Study', 'Dataset'],
      targetIssue: 'Issue 4, 2027',
      guestEditor: 'Dr. V. Ivanova',
    },
  ],
  publicationQueue: [
    {
      id: 'sjri-pq-1',
      title: 'AI-Generated Content Disclosure Policies',
      authors: ['Dr. E. Karanja'],
      stage: 'Copyediting',
      doi: '10.46793/sjri.2026.2.15',
      issue: 'Issue 2, 2026',
      scheduledPublication: '2026-08-19',
    },
    {
      id: 'sjri-pq-2',
      title: 'Preprint Integrity and Peer Review Overlap',
      authors: ['Dr. A. Bianchi'],
      stage: 'Typesetting',
      issue: 'Issue 3, 2026',
      scheduledPublication: '2026-09-22',
    },
  ],
  issueSchedule: [
    {
      id: 'sjri-sch-1',
      issueNumber: '3',
      volume: '2',
      year: '2026',
      publicationDate: '2026-09-22',
      status: 'In Production',
      theme: 'Integrity in the Age of AI',
      articles: 6,
    },
    {
      id: 'sjri-sch-2',
      issueNumber: '4',
      volume: '2',
      year: '2026',
      publicationDate: '2026-12-22',
      status: 'Planned',
      theme: 'General Issue',
      articles: 7,
    },
  ],
  editorialDecisionStats: {
    submitted: 121,
    underReview: 15,
    inRevision: 7,
    accepted: 29,
    rejected: 52,
    inProduction: 4,
    published: 77,
    acceptanceRate: 35,
    rejectionRate: 49,
    avgDaysToFirstDecision: 31,
    avgDaysToAcceptance: 126,
  },
  policy: {
    articleProcessingCharges: 'None (funded by Scholatia Press)',
    submissionFee: 'None',
    embargoPeriod: 'None',
    licensing: 'Creative Commons Attribution 4.0 (CC BY)',
    copyright: 'Authors retain copyright',
    plagiarismPolicy: 'Strict screening with plagiarism and image-manipulation detection',
    dataPolicy: 'Data and code sharing required where ethically possible',
    ethicsPolicy: 'Research misconduct handling follows COPE guidelines',
    appealsPolicy: 'Formal appeals handled with full COPE-compliant process',
    conflictsOfInterestPolicy: 'Comprehensive declarations required from all parties',
    preprintsPolicy: 'Preprints permitted and encouraged',
  },
  analytics: {
    annualSubmissions: 104,
    annualPublications: 36,
    acceptanceRate: 35,
    rejectionRate: 49,
    totalDownloads: 289000,
    totalCitations: 13100,
    altmetricScore: 88,
    googleScholarRank: 'Top 10%',
    medianDaysToFirstDecision: 31,
    medianDaysToAcceptance: 126,
  },
});

export const JOURNALS: JournalProfile[] = [
  SCHOLATIA_OPEN_RESEARCH,
  SCHOLATIA_COMPUTATIONAL_LINGUISTICS,
  SCHOLATIA_BIOMEDICAL_DATA_SCIENCE,
  SCHOLATIA_CLIMATE_ENVIRONMENT,
  SCHOLATIA_HIGHER_EDUCATION,
  SCHOLATIA_AFRICAN_STUDIES,
  SCHOLATIA_SOCIAL_DATA_SCIENCE,
  SCHOLATIA_LANGUAGE_DOCUMENTATION,
  SCHOLATIA_ENGINEERING_SYSTEMS,
  SCHOLATIA_RESEARCH_INTEGRITY,
];

export const FEATURED_JOURNAL: JournalProfile = JOURNALS[0];

export const RECENT_JOURNALS: JournalProfile[] = JOURNALS.slice(0, 3);

export const JOURNAL_ISSUES: JournalIssueRef[] = JOURNALS.flatMap((journal) =>
  journal.issues.map((issue) => ({ journal, issue }))
);

export const CURRENT_ISSUES: JournalIssueRef[] = JOURNAL_ISSUES.slice(0, 8);

export const RECENT_ISSUES: JournalIssueRef[] = JOURNAL_ISSUES
  .filter((entry) => entry.issue.status === 'Published')
  .slice(0, 6);

export const JOURNAL_VOLUMES: JournalVolumeRef[] = JOURNALS.flatMap((journal) =>
  journal.volumes.map((volume) => ({ journal, volume }))
).slice(0, 8);

export const ACCEPTED_ARTICLES: JournalArticleRef[] = JOURNALS.flatMap((journal) =>
  journal.articles
    .filter((article) => article.status === 'Accepted' || article.status === 'In Production')
    .map((article) => ({ journal, article }))
).slice(0, 6);

export const PUBLISHED_ARTICLES: JournalArticleRef[] = JOURNALS.flatMap((journal) =>
  journal.articles
    .filter((article) => article.status === 'Published')
    .map((article) => ({ journal, article }))
).slice(0, 6);

export const JOURNAL_REVIEWERS: JournalReviewerRef[] = JOURNALS.flatMap((journal) =>
  journal.reviewBoard.map((reviewer) => ({ journal, reviewer }))
).slice(0, 12);

export const CALLS_FOR_PAPERS: JournalCallForPapersRef[] = JOURNALS.flatMap((journal) =>
  (journal.callsForPapers ?? []).map((call) => ({ journal, call }))
).filter((entry) => entry.call.status !== 'Closed');

function buildJournalPortfolioStatistics(journals: JournalProfile[]): JournalPortfolioStatistics {
  const allArticles = journals.flatMap((journal) => journal.articles);
  const byStatus = (status: ArticleSummary['status']) => allArticles.filter((article) => article.status === status).length;
  const activeCalls = journals.reduce(
    (sum, journal) => sum + (journal.callsForPapers ?? []).filter((call) => call.status === 'Open').length,
    0
  );
  const totalSubmissions = journals.reduce(
    (sum, journal) => sum + (journal.editorialDecisionStats?.submitted ?? 0),
    0
  );
  const avgTrustScore = Math.round(journals.reduce((sum, journal) => sum + journal.trustScore, 0) / journals.length);

  return {
    totalJournals: journals.length,
    openAccessJournals: journals.filter((journal) => journal.openAccessStatus === 'Open Access').length,
    hybridJournals: journals.filter((journal) => journal.openAccessStatus === 'Hybrid').length,
    subscriptionJournals: journals.filter((journal) => journal.openAccessStatus === 'Subscription').length,
    diamondJournals: journals.filter((journal) => journal.openAccessStatus === 'Diamond').length,
    goldJournals: journals.filter((journal) => journal.openAccessStatus === 'Gold').length,
    publishedArticles: byStatus('Published'),
    acceptedArticles: byStatus('Accepted'),
    underReviewArticles: byStatus('Under Review'),
    inRevisionArticles: byStatus('In Revision'),
    rejectedArticles: byStatus('Rejected'),
    inProductionArticles: byStatus('In Production'),
    activeCallsForPapers: activeCalls,
    totalSubmissions,
    avgTrustScore,
  };
}

function buildPortfolioEditorialStats(journals: JournalProfile[]): EditorialDecisionStatistics {
  const sum = (pick: (stats: EditorialDecisionStatistics) => number) =>
    journals.reduce((acc, journal) => acc + (journal.editorialDecisionStats ? pick(journal.editorialDecisionStats) : 0), 0);

  const submitted = sum((s) => s.submitted);
  const rejected = sum((s) => s.rejected);
  const published = sum((s) => s.published);

  return {
    submitted,
    underReview: sum((s) => s.underReview),
    inRevision: sum((s) => s.inRevision),
    accepted: sum((s) => s.accepted),
    rejected,
    inProduction: sum((s) => s.inProduction),
    published,
    acceptanceRate: submitted > 0 ? Math.round((published / submitted) * 100) : 0,
    rejectionRate: submitted > 0 ? Math.round((rejected / submitted) * 100) : 0,
    avgDaysToFirstDecision: Math.round(sum((s) => s.avgDaysToFirstDecision) / journals.length),
    avgDaysToAcceptance: Math.round(sum((s) => s.avgDaysToAcceptance) / journals.length),
  };
}

function buildJournalPortfolioAnalytics(journals: JournalProfile[]): JournalPortfolioAnalytics {
  const totalArticles = journals.reduce((sum, journal) => sum + journal.articles.length, 0);
  const totalPublished = journals.reduce(
    (sum, journal) => sum + journal.articles.filter((article) => article.status === 'Published').length,
    0
  );
  const totalSubmissions = journals.reduce(
    (sum, journal) => sum + (journal.editorialDecisionStats?.submitted ?? 0),
    0
  );
  const totalAccepted = journals.reduce(
    (sum, journal) => sum + (journal.editorialDecisionStats?.accepted ?? 0),
    0
  );
  const totalRejected = journals.reduce(
    (sum, journal) => sum + (journal.editorialDecisionStats?.rejected ?? 0),
    0
  );
  const totalDownloads = journals.reduce((sum, journal) => sum + (journal.analytics?.totalDownloads ?? 0), 0);
  const totalCitations = journals.reduce((sum, journal) => sum + (journal.analytics?.totalCitations ?? 0), 0);
  const withDecisionStats = journals.filter((journal) => journal.editorialDecisionStats);
  const averageAcceptanceRate = Math.round(
    withDecisionStats.reduce((sum, journal) => sum + (journal.editorialDecisionStats?.acceptanceRate ?? 0), 0) /
      Math.max(withDecisionStats.length, 1)
  );
  const averageRejectionRate = Math.round(
    withDecisionStats.reduce((sum, journal) => sum + (journal.editorialDecisionStats?.rejectionRate ?? 0), 0) /
      Math.max(withDecisionStats.length, 1)
  );
  const withImpactFactor = journals.filter((journal) => journal.impactMetrics?.impactFactor);
  const averageImpactFactor = Math.round(
    (withImpactFactor.reduce((sum, journal) => sum + (journal.impactMetrics?.impactFactor ?? 0), 0) /
      Math.max(withImpactFactor.length, 1)) *
      10
  ) / 10;
  const highestImpactJournal = withImpactFactor.reduce<JournalProfile | null>(
    (highest, journal) =>
      !highest || (journal.impactMetrics?.impactFactor ?? 0) > (highest.impactMetrics?.impactFactor ?? 0)
        ? journal
        : highest,
    null
  );
  const mostCitedJournal = journals.reduce<JournalProfile | null>(
    (highest, journal) =>
      !highest || (journal.analytics?.totalCitations ?? 0) > (highest.analytics?.totalCitations ?? 0)
        ? journal
        : highest,
    null
  );

  return {
    totalJournals: journals.length,
    totalArticles,
    totalPublished,
    totalSubmissions,
    totalAccepted,
    totalRejected,
    totalDownloads,
    totalCitations,
    averageAcceptanceRate,
    averageRejectionRate,
    averageImpactFactor,
    highestImpactJournal: highestImpactJournal?.journalTitle,
    mostCitedJournal: mostCitedJournal?.journalTitle,
  };
}

export const JOURNAL_PORTFOLIO_STATISTICS: JournalPortfolioStatistics =
  buildJournalPortfolioStatistics(JOURNALS);

export const JOURNAL_PORTFOLIO_EDITORIAL_STATS: EditorialDecisionStatistics =
  buildPortfolioEditorialStats(JOURNALS);

export const JOURNAL_PORTFOLIO_ANALYTICS: JournalPortfolioAnalytics =
  buildJournalPortfolioAnalytics(JOURNALS);

function buildJournalRelationships(journals: JournalProfile[]): JournalRelationships {
  const journalIds = new Set(journals.map((journal) => journal.journalId));

  const authorsById = new Map<string, string>();
  MANUSCRIPTS.forEach((manuscript) => {
    manuscript.authors.forEach((author) => {
      authorsById.set(author.said, author.name);
    });
  });

  const institutions = new Set<string>();
  journals.forEach((journal) => {
    if (journal.institution) {
      institutions.add(journal.institution);
    }
  });
  MANUSCRIPTS.forEach((manuscript) => {
    manuscript.authors.forEach((author) => {
      institutions.add(author.institution);
    });
  });

  const grants = new Map<string, { title: string; detail: string }>();
  MANUSCRIPTS.forEach((manuscript) => {
    manuscript.relationships.grants.forEach((grant) => {
      grants.set(grant.id, { title: grant.title, detail: grant.detail ?? 'Grant funded research' });
    });
  });

  const publications = new Map<string, { title: string; detail: string }>();
  MANUSCRIPTS.forEach((manuscript) => {
    manuscript.relationships.publications.forEach((publication) => {
      publications.set(publication.id, {
        title: publication.title,
        detail: publication.detail ?? 'Linked publication',
      });
    });
  });

  return {
    manuscripts: MANUSCRIPTS.filter((manuscript) =>
      manuscript.targetJournals.some((target) => journalIds.has(target.journal.journalId))
    ).map((manuscript) => ({
      id: manuscript.id,
      title: manuscript.title,
      detail: `Status: ${manuscript.status}`,
    })),
    datasets: DATASETS.slice(0, 6).map((dataset) => ({
      id: dataset.id,
      title: dataset.title,
      detail: dataset.doi,
    })),
    projects: WORKSPACE_PROJECTS.slice(0, 6).map((project) => ({
      id: project.id,
      title: project.name,
      detail: `Status: ${project.status}`,
    })),
    authors: [...authorsById.entries()].map(([said, name]) => ({
      id: said,
      title: name,
      detail: said,
    })),
    institutions: [...institutions].map((name) => ({
      id: `inst-${name}`,
      title: name,
      detail: 'Affiliated institution',
    })),
    grants: [...grants.entries()].map(([id, grant]) => ({
      id,
      title: grant.title,
      detail: grant.detail,
    })),
    publications: [...publications.entries()].map(([id, publication]) => ({
      id,
      title: publication.title,
      detail: publication.detail,
    })),
  };
}

export const JOURNAL_RELATIONSHIPS: JournalRelationships = buildJournalRelationships(JOURNALS);
