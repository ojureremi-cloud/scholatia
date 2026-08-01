import type {
  JournalProfile,
  PublicationWorkflowStage,
} from '@/types/identity';
import type { ResearchLifecycleStage } from '@/types/research';
import { createJournalProfile } from '@/lib/journals';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';
import type {
  Manuscript,
  ManuscriptStatistics,
  ManuscriptTimelineEntry,
  PeerReviewSummary,
} from '@/types/manuscript';
import {
  MANUSCRIPT_STAGE_ID,
  type ManuscriptLifecycleStageId,
} from '@/types/manuscript';

/**
 * Canonical lifecycle stage definitions for the Manuscript, Submission, and
 * Peer Review stages, sourced from the ResearchLifecycleEngine so this module
 * never hardcodes lifecycle logic.
 */
export const MANUSCRIPT_LIFECYCLE_STAGE: ResearchLifecycleStage =
  ResearchLifecycleEngine.getStage(MANUSCRIPT_STAGE_ID)!;

export const SUBMISSION_LIFECYCLE_STAGE: ResearchLifecycleStage =
  ResearchLifecycleEngine.getStage('submission')!;

export const PEER_REVIEW_LIFECYCLE_STAGE: ResearchLifecycleStage =
  ResearchLifecycleEngine.getStage('peer-review')!;

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

const COMPUTATIONAL_LINGUISTICS_JOURNAL: JournalProfile = makeJournal({
  journalId: 'CLJ-001',
  journalTitle: 'Computational Linguistics Journal',
  shortTitle: 'CLJ',
  issn: '0891-2017',
  eissn: '1530-9312',
  publisher: 'MIT Press',
  country: 'United States',
  discipline: 'Computational Linguistics',
  researchAreas: ['Natural Language Processing', 'Dependency Parsing', 'Machine Translation'],
  aimsAndScope: 'Publishes articles on the computational analysis of natural language across all languages and modalities.',
  openAccessStatus: 'Hybrid',
  reviewModel: 'Double Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Scopus'],
  verificationStatus: 'Verified',
  trustScore: 95,
  submissionTypes: ['Research Article', 'Review Article', 'Short Communication', 'Dataset', 'Software Paper'],
  peerReviewModes: ['Double Blind', 'Open Review'],
});

const LANGUAGE_RESOURCES_EVALUATION_JOURNAL: JournalProfile = makeJournal({
  journalId: 'LRE-002',
  journalTitle: 'Language Resources and Evaluation',
  shortTitle: 'LRE',
  issn: '1574-020X',
  eissn: '1572-8412',
  publisher: 'Springer',
  country: 'Netherlands',
  discipline: 'Language Resources',
  researchAreas: ['Corpora', 'Language Resources', 'Evaluation', 'Annotation'],
  openAccessStatus: 'Hybrid',
  reviewModel: 'Single Blind',
  indexingServices: ['DOAJ', 'Scopus', 'Web of Science'],
  verificationStatus: 'Verified',
  trustScore: 92,
  submissionTypes: ['Research Article', 'Review Article', 'Dataset', 'Protocol', 'Software Paper'],
  peerReviewModes: ['Single Blind', 'Open Review'],
});

const JOURNAL_OF_NLP: JournalProfile = makeJournal({
  journalId: 'JNLP-003',
  journalTitle: 'Journal of Natural Language Processing',
  shortTitle: 'JNLP',
  publisher: 'Association for Natural Language Processing',
  country: 'Japan',
  discipline: 'Natural Language Processing',
  researchAreas: ['Syntax', 'Semantics', 'Multilingual NLP'],
  openAccessStatus: 'Gold',
  reviewModel: 'Double Blind',
  indexingServices: ['Crossref', 'J-STAGE'],
  verificationStatus: 'Trusted',
  trustScore: 89,
  submissionTypes: ['Research Article', 'Review Article', 'Short Communication'],
  peerReviewModes: ['Double Blind'],
});

const JOURNAL_OF_LANGUAGE_DOCUMENTATION: JournalProfile = makeJournal({
  journalId: 'JLD-004',
  journalTitle: 'Journal of Language Documentation',
  shortTitle: 'JLD',
  publisher: 'University of Hawai\u02BBi Press',
  country: 'United States',
  discipline: 'Language Documentation',
  researchAreas: ['Language Documentation', 'Endangered Languages', 'Fieldwork'],
  openAccessStatus: 'Open Access',
  reviewModel: 'Open Review',
  indexingServices: ['DOAJ', 'Crossref'],
  verificationStatus: 'Verified',
  trustScore: 88,
  submissionTypes: ['Research Article', 'Case Study', 'Dataset', 'Protocol'],
  peerReviewModes: ['Open Review', 'Transparent Review'],
});

const LANGUAGE_LEARNING_JOURNAL: JournalProfile = makeJournal({
  journalId: 'LL-005',
  journalTitle: 'Language Learning',
  shortTitle: 'LL',
  publisher: 'Wiley',
  country: 'United States',
  discipline: 'Second Language Acquisition',
  researchAreas: ['Second Language Acquisition', 'Learner Corpora', 'Transfer'],
  openAccessStatus: 'Subscription',
  reviewModel: 'Double Blind',
  indexingServices: ['Scopus', 'Web of Science'],
  verificationStatus: 'Verified',
  trustScore: 91,
  submissionTypes: ['Research Article', 'Short Communication', 'Review Article'],
  peerReviewModes: ['Double Blind'],
});

const SECOND_LANGUAGE_RESEARCH_JOURNAL: JournalProfile = makeJournal({
  journalId: 'SLR-006',
  journalTitle: 'Second Language Research',
  shortTitle: 'SLR',
  publisher: 'SAGE Publishing',
  country: 'United Kingdom',
  discipline: 'Second Language Acquisition',
  researchAreas: ['Second Language Research', 'Transfer', 'Learner Corpora'],
  openAccessStatus: 'Hybrid',
  reviewModel: 'Double Blind',
  indexingServices: ['SAGE Journals', 'Scopus'],
  verificationStatus: 'Verified',
  trustScore: 90,
  submissionTypes: ['Research Article', 'Short Communication', 'Review Article'],
  peerReviewModes: ['Double Blind'],
});

const LANGUAGE_DOC_CONSERVATION_JOURNAL: JournalProfile = makeJournal({
  journalId: 'LDCC-007',
  journalTitle: 'Language Documentation & Conservation',
  shortTitle: 'LD&C',
  publisher: 'University of Hawai\u02BBi Press',
  country: 'United States',
  discipline: 'Language Documentation',
  researchAreas: ['Language Documentation', 'Speech Technology', 'Community Linguistics'],
  openAccessStatus: 'Diamond',
  reviewModel: 'Open Review',
  indexingServices: ['DOAJ', 'Crossref'],
  verificationStatus: 'Trusted',
  trustScore: 87,
  submissionTypes: ['Research Article', 'Review Article', 'Dataset', 'Case Study'],
  peerReviewModes: ['Open Review', 'Transparent Review'],
});

const TRANSACTIONS_ACL_JOURNAL: JournalProfile = makeJournal({
  journalId: 'TACL-008',
  journalTitle: 'Transactions of the Association for Computational Linguistics',
  shortTitle: 'TACL',
  publisher: 'Association for Computational Linguistics',
  country: 'United States',
  discipline: 'Computational Linguistics',
  researchAreas: ['Natural Language Processing', 'Evaluation', 'Benchmarking'],
  openAccessStatus: 'Open Access',
  reviewModel: 'Double Blind',
  indexingServices: ['DOAJ', 'Crossref', 'Scopus'],
  verificationStatus: 'Trusted',
  trustScore: 94,
  submissionTypes: ['Research Article', 'Short Communication'],
  peerReviewModes: ['Double Blind'],
});

const JANE = {
  id: 'author-jane',
  name: 'Dr. Jane Scholar',
  said: 'SAID-0000-0000-0001',
  orcid: '0000-0001-0000-0001',
  institution: 'Institute for Computational Linguistics',
};
const CHEN = {
  id: 'author-chen',
  name: 'Dr. Chen Researcher',
  said: 'SAID-0000-0000-0003',
  orcid: '0000-0002-0000-0003',
  institution: 'Tech University',
};
const DINA = {
  id: 'author-dina',
  name: 'Dr. Dina Linguist',
  said: 'SAID-0000-0000-0004',
  orcid: '0000-0003-0000-0004',
  institution: 'University of Oxford',
};
const FARID = {
  id: 'author-farid',
  name: 'Dr. Farid Developer',
  said: 'SAID-0000-0000-0005',
  orcid: '0000-0004-0000-0005',
  institution: 'Institute for Computational Linguistics',
};
const PRIYA = {
  id: 'author-priya',
  name: 'Priya Patel',
  said: 'SAID-0000-0000-0006',
  institution: 'Institute for Computational Linguistics',
};
const SAM = {
  id: 'author-sam',
  name: 'Sam Okafor',
  said: 'SAID-0000-0000-0007',
  orcid: '0000-0005-0000-0007',
  institution: 'Institute for Computational Linguistics',
};
const AISHA = {
  id: 'author-aisha',
  name: 'Prof. Aisha Mentor',
  said: 'SAID-0000-0000-0002',
  orcid: '0000-0006-0000-0002',
  institution: 'University of Cambridge',
};

type ManuscriptInput = Omit<Manuscript, 'stageId'> & {
  stageId?: Manuscript['stageId'];
};

function createManuscript(data: ManuscriptInput): Manuscript {
  return { stageId: (data.stageId ?? 'manuscript') as ManuscriptLifecycleStageId, ...data };
}

export const MANUSCRIPTS: Manuscript[] = [
  createManuscript({
    id: 'mns-low-resource-parsing',
    title: 'Evaluating Cross-Lingual Transfer in Dependency Parsing under Low-Resource Constraints',
    description:
      'A controlled evaluation of cross-lingual transfer strategies for dependency parsing under low-resource constraints, with per-language error analyses across 24 under-represented languages.',
    stageId: 'peer-review',
    status: 'major-revision',
    correspondingAuthor: JANE.name,
    institution: JANE.institution,
    createdAt: '2025-11-20',
    updatedAt: '2026-07-15',
    preprintDoi: '10.1000/placeholder.preprint.2025.0014',
    authors: [
      { ...JANE, role: 'corresponding' },
      { ...CHEN, role: 'co-author' },
      { ...SAM, role: 'co-author' },
      { ...DINA, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-lrp-v1',
        version: 'v1.0',
        createdAt: '2025-11-20',
        status: 'draft',
        filename: 'low-resource-parsing-v1.tex',
        wordCount: 11800,
        pageCount: 36,
        changes: 'Initial draft circulated to co-authors.',
      },
      {
        id: 'mns-lrp-v11',
        version: 'v1.1',
        createdAt: '2026-01-15',
        status: 'submitted',
        filename: 'low-resource-parsing-submitted.pdf',
        wordCount: 12100,
        pageCount: 38,
        changes: 'Submission version addressing co-author comments.',
      },
      {
        id: 'mns-lrp-v2',
        version: 'v2.0',
        createdAt: '2026-04-10',
        status: 'revised',
        filename: 'low-resource-parsing-r1-revised.pdf',
        wordCount: 12400,
        pageCount: 39,
        changes: 'Round 1 revision responding to reviewer reports.',
      },
      {
        id: 'mns-lrp-v21',
        version: 'v2.1',
        createdAt: '2026-07-10',
        status: 'revised',
        filename: 'low-resource-parsing-r2-revised.pdf',
        wordCount: 12600,
        pageCount: 40,
        changes: 'Round 2 revision addressing the remaining methodological concerns.',
      },
    ],
    submissions: [
      {
        id: 'mns-lrp-sub-1',
        journalId: COMPUTATIONAL_LINGUISTICS_JOURNAL.journalId,
        journalTitle: COMPUTATIONAL_LINGUISTICS_JOURNAL.journalTitle,
        submissionType: 'Research Article',
        reviewModel: 'Double Blind',
        submittedAt: '2026-01-15',
        status: 'major-revision',
        manuscriptId: 'MS-2026-0014',
        rounds: [
          {
            id: 'mns-lrp-r1',
            round: 1,
            startedAt: '2026-02-01',
            completedAt: '2026-03-18',
            status: 'completed',
            invitedReviewers: ['Reviewer 1', 'Reviewer 2', 'Reviewer 3'],
            completedReviews: ['Reviewer 1', 'Reviewer 2'],
            comments: [
              {
                id: 'mns-lrp-r1c1',
                reviewer: 'Anonymous Reviewer 1',
                anonymous: true,
                recommendation: 'major-revision',
                date: '2026-03-15',
                summary: 'The low-resource setup is compelling but the baseline selection is incomplete.',
                details:
                  'The evaluation would be strengthened by additional supervised baselines and per-language ablations for the transfer component. The current table hides high variance in the lowest-resource languages.',
              },
              {
                id: 'mns-lrp-r1c2',
                reviewer: 'Anonymous Reviewer 2',
                anonymous: true,
                recommendation: 'minor-revision',
                date: '2026-03-16',
                summary: 'Sound experimental design; mostly presentation concerns.',
                details:
                  'The paper is well organised. Please clarify the significance of the difference between the two transfer schedules and add significance testing.',
              },
            ],
          },
          {
            id: 'mns-lrp-r2',
            round: 2,
            startedAt: '2026-05-20',
            status: 'in-progress',
            invitedReviewers: ['Reviewer 1', 'Reviewer 4'],
            completedReviews: ['Reviewer 1'],
            comments: [
              {
                id: 'mns-lrp-r2c1',
                reviewer: 'Anonymous Reviewer 1',
                anonymous: true,
                recommendation: 'major-revision',
                date: '2026-07-01',
                summary: 'Ablations now support the claims, but the discussion section needs restructuring.',
                details:
                  'The added ablations are persuasive. The discussion section should foreground practical guidance for practitioners and address the interaction between corpus size and transfer gains more directly.',
              },
            ],
          },
        ],
        decision: {
          id: 'mns-lrp-dec-2',
          round: 2,
          type: 'major-revision',
          date: '2026-07-05',
          summary: 'The editors request a further major revision focused on the discussion and practical recommendations section.',
        },
      },
    ],
    targetJournals: [
      {
        id: 'mns-lrp-tj-1',
        journal: COMPUTATIONAL_LINGUISTICS_JOURNAL,
        fit: 'high',
        status: 'in-revision',
        submissionType: 'Research Article',
      },
      {
        id: 'mns-lrp-tj-2',
        journal: LANGUAGE_RESOURCES_EVALUATION_JOURNAL,
        fit: 'medium',
        status: 'considered',
        submissionType: 'Research Article',
      },
    ],
    revisions: [
      {
        id: 'mns-lrp-rev-1',
        version: 'v2.0',
        date: '2026-04-10',
        reason: 'Response to round 1 reviewer reports',
        summary: 'Added supervised baselines, per-language ablations, and significance testing.',
        status: 'completed',
      },
      {
        id: 'mns-lrp-rev-2',
        version: 'v2.1',
        date: '2026-07-10',
        reason: 'Response to round 2 reviewer report',
        summary: 'Restructured the discussion and added a practical guidance section for practitioners.',
        status: 'in-progress',
      },
    ],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id, CHEN.id] },
      { role: 'Methodology', authors: [JANE.id, CHEN.id, SAM.id] },
      { role: 'Software', authors: [SAM.id, CHEN.id] },
      { role: 'Data curation', authors: [DINA.id, SAM.id] },
      { role: 'Formal analysis', authors: [JANE.id, SAM.id] },
      { role: 'Investigation', authors: [JANE.id, CHEN.id] },
      { role: 'Validation', authors: [DINA.id] },
      { role: 'Writing – original draft', authors: [JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, CHEN.id, SAM.id, DINA.id] },
      { role: 'Funding acquisition', authors: [JANE.id] },
    ],
    checklist: [
      { id: 'mns-lrp-cl-1', label: 'Cover letter', detail: 'Addressed to the Editors of Computational Linguistics Journal', required: true, complete: true },
      { id: 'mns-lrp-cl-2', label: 'Title page with author information', required: true, complete: true },
      { id: 'mns-lrp-cl-3', label: 'Data availability statement', detail: 'Links the UD treebank dataset record', required: true, complete: true },
      { id: 'mns-lrp-cl-4', label: 'Code availability statement', detail: 'Links the parsing framework repository', required: true, complete: true },
      { id: 'mns-lrp-cl-5', label: 'ORCID identifiers for all authors', required: true, complete: true },
      { id: 'mns-lrp-cl-6', label: 'Competing interests declaration', required: true, complete: true },
      { id: 'mns-lrp-cl-7', label: 'Suggested reviewers', detail: 'Optional list of potential reviewers', required: false, complete: false },
      { id: 'mns-lrp-cl-8', label: 'Journal formatting applied', required: true, complete: true },
    ],
    metadata: {
      abstract:
        'Cross-lingual transfer is a central strategy for dependency parsing in low-resource languages, yet the literature rarely isolates the factors that make transfer succeed or fail. We present a controlled evaluation across 24 under-represented languages, comparing transfer schedules, annotation policies, and model configurations against supervised upper bounds. Our results show that typological proximity and corpus size interact strongly with transfer gains, and that gains concentrate in languages with moderate corpus sizes rather than the smallest ones. We release per-language error analyses and practical guidance for practitioners.',
      keywords: ['dependency parsing', 'cross-lingual transfer', 'low-resource NLP', 'typology', 'evaluation'],
      subjects: ['Computational Linguistics', 'Natural Language Processing', 'Low-Resource Languages'],
      language: 'English',
      wordCount: 12600,
      pageCount: 40,
      figures: 9,
      tables: 4,
      references: 87,
    },
    relationships: {
      project: {
        id: 'multilingual-parsing-framework',
        title: 'Multilingual Parsing Framework',
        detail: 'Active',
      },
      datasets: [
        {
          id: 'mpf-multilingual-treebanks',
          title: 'Multilingual Parsing Framework — UD Treebanks',
          detail: '10.1000/placeholder.dataset.0001',
        },
        {
          id: 'xbench-multilingual-evaluation',
          title: 'Cross-Lingual Evaluation Benchmark (XBench)',
          detail: '10.1000/placeholder.dataset.0003',
        },
      ],
      grants: [
        {
          id: 'grant-nrc-2022-113',
          title: 'National Research Council — Grant 2022/113',
          detail: '£450,000 awarded',
        },
      ],
      publications: [
        {
          id: 'pub-2022-0120',
          title: 'Low-Resource Language Parsing with Cross-Lingual Transfer',
          detail: 'Computational Linguistics Journal · 2022 · 10.1000/placeholder.2022.0120',
        },
      ],
      researchers: [JANE.said, CHEN.said, SAM.said, DINA.said],
    },
    readiness: {
      score: 82,
      status: 'in-progress',
      checks: [
        { label: 'Complete statistical analyses', complete: true },
        { label: 'All figures at publication quality', complete: true },
        { label: 'References complete and consistent', complete: true },
        { label: 'Data and code links verified', complete: true },
        { label: 'Author contributions finalised', complete: true },
        { label: 'Final response to reviewers submitted', complete: false, note: 'Round 2 revision under review' },
      ],
    },
    tags: ['dependency parsing', 'cross-lingual', 'low-resource', 'transfer learning', 'evaluation'],
  }),

  createManuscript({
    id: 'mns-xbench-suite',
    title: 'XBench: A Multilingual Evaluation Suite for Cross-Lingual Natural Language Understanding',
    description:
      'Presents the XBench benchmark, a harmonised evaluation suite covering 40 languages across nine tasks, with scoring harnesses and per-language breakdowns.',
    stageId: 'submission',
    status: 'submitted',
    correspondingAuthor: JANE.name,
    institution: JANE.institution,
    createdAt: '2026-04-02',
    updatedAt: '2026-07-25',
    preprintDoi: '10.1000/placeholder.preprint.2026.0021',
    authors: [
      { ...JANE, role: 'corresponding' },
      { ...CHEN, role: 'co-author' },
      { ...SAM, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-xbench-v1',
        version: 'v1.0',
        createdAt: '2026-06-20',
        status: 'draft',
        filename: 'xbench-suite-v1.tex',
        wordCount: 9800,
        pageCount: 30,
        changes: 'Internal draft of the benchmark paper.',
      },
      {
        id: 'mns-xbench-v11',
        version: 'v1.1',
        createdAt: '2026-07-25',
        status: 'submitted',
        filename: 'xbench-suite-submitted.pdf',
        wordCount: 10200,
        pageCount: 32,
        changes: 'Submission version prepared for Language Resources and Evaluation.',
      },
    ],
    submissions: [
      {
        id: 'mns-xbench-sub-1',
        journalId: LANGUAGE_RESOURCES_EVALUATION_JOURNAL.journalId,
        journalTitle: LANGUAGE_RESOURCES_EVALUATION_JOURNAL.journalTitle,
        submissionType: 'Dataset',
        reviewModel: 'Single Blind',
        submittedAt: '2026-07-25',
        status: 'submitted',
        manuscriptId: 'LRE-D-26-00189',
        rounds: [],
      },
    ],
    targetJournals: [
      {
        id: 'mns-xbench-tj-1',
        journal: LANGUAGE_RESOURCES_EVALUATION_JOURNAL,
        fit: 'high',
        status: 'submitted',
        submissionType: 'Dataset',
      },
      {
        id: 'mns-xbench-tj-2',
        journal: COMPUTATIONAL_LINGUISTICS_JOURNAL,
        fit: 'medium',
        status: 'considered',
        submissionType: 'Research Article',
      },
    ],
    revisions: [],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id, CHEN.id] },
      { role: 'Methodology', authors: [JANE.id, CHEN.id] },
      { role: 'Software', authors: [SAM.id, CHEN.id] },
      { role: 'Data curation', authors: [SAM.id, JANE.id] },
      { role: 'Validation', authors: [CHEN.id, SAM.id] },
      { role: 'Writing – original draft', authors: [JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, CHEN.id, SAM.id] },
    ],
    checklist: [
      { id: 'mns-xbench-cl-1', label: 'Cover letter', required: true, complete: true },
      { id: 'mns-xbench-cl-2', label: 'Data availability statement', detail: 'Links the XBench dataset record', required: true, complete: true },
      { id: 'mns-xbench-cl-3', label: 'Scoring harness and code', required: true, complete: true },
      { id: 'mns-xbench-cl-4', label: 'ORCID identifiers for all authors', required: true, complete: true },
      { id: 'mns-xbench-cl-5', label: 'Formatting applied for LRE', required: true, complete: true },
      { id: 'mns-xbench-cl-6', label: 'Suggested reviewers', required: false, complete: false },
    ],
    metadata: {
      abstract:
        'We introduce XBench, a harmonised multilingual evaluation suite covering 40 languages across nine tasks. XBench provides consistent test sets, scoring harnesses, and per-language breakdowns designed to make cross-lingual evaluation reproducible and comparable. We describe the curation pipeline, quality-control procedures, and the scoring protocol, and release all resources openly.',
      keywords: ['benchmarking', 'evaluation', 'multilingual NLU', 'cross-lingual transfer'],
      subjects: ['Computational Linguistics', 'Evaluation', 'Multilingual NLP'],
      language: 'English',
      wordCount: 10200,
      pageCount: 32,
      figures: 6,
      tables: 3,
      references: 64,
    },
    relationships: {
      project: {
        id: 'cross-lingual-evaluation-benchmark',
        title: 'Cross-Lingual Evaluation Benchmark',
        detail: 'Active',
      },
      datasets: [
        {
          id: 'xbench-multilingual-evaluation',
          title: 'Cross-Lingual Evaluation Benchmark (XBench)',
          detail: '10.1000/placeholder.dataset.0003',
        },
      ],
      grants: [
        {
          id: 'grant-uif',
          title: 'University Innovation Fund',
          detail: '£36,000 awarded',
        },
      ],
      publications: [
        {
          id: 'pub-2025-0012',
          title: 'Benchmarking Transfer Learning across 40 Languages',
          detail: 'EMNLP 2025 Proceedings · 2025 · 10.1000/placeholder.2025.0012',
        },
      ],
      researchers: [JANE.said, CHEN.said, SAM.said],
    },
    readiness: {
      score: 68,
      status: 'in-progress',
      checks: [
        { label: 'Benchmark resources registered with DOI', complete: true },
        { label: 'Scoring harness reproducible', complete: true },
        { label: 'Per-language breakdowns finalised', complete: true },
        { label: 'Author contributions finalised', complete: true },
        { label: 'Editorial screening response', complete: false, note: 'Awaiting editorial decision' },
      ],
    },
    tags: ['benchmark', 'evaluation', 'multilingual', 'NLU', '40 languages'],
  }),

  createManuscript({
    id: 'mns-xbench-lessons',
    title: 'XBench at Scale: Lessons from Benchmarking Transfer Learning across 40 Languages',
    description:
      'A synthesis paper capturing design lessons, failure modes, and recommended practices from building and applying the XBench multilingual evaluation suite.',
    stageId: 'manuscript',
    status: 'draft',
    correspondingAuthor: JANE.name,
    institution: JANE.institution,
    createdAt: '2026-05-12',
    updatedAt: '2026-07-28',
    authors: [
      { ...JANE, role: 'corresponding' },
      { ...SAM, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-xbench-lessons-v1',
        version: 'v0.9',
        createdAt: '2026-07-28',
        status: 'draft',
        filename: 'xbench-lessons-draft.tex',
        wordCount: 7200,
        pageCount: 24,
        changes: 'Working draft in preparation for co-author review.',
      },
    ],
    submissions: [],
    targetJournals: [
      {
        id: 'mns-xbench-lessons-tj-1',
        journal: TRANSACTIONS_ACL_JOURNAL,
        fit: 'medium',
        status: 'preparing',
        submissionType: 'Research Article',
      },
      {
        id: 'mns-xbench-lessons-tj-2',
        journal: COMPUTATIONAL_LINGUISTICS_JOURNAL,
        fit: 'medium',
        status: 'considered',
        submissionType: 'Research Article',
      },
    ],
    revisions: [],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id] },
      { role: 'Investigation', authors: [SAM.id, JANE.id] },
      { role: 'Writing – original draft', authors: [JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, SAM.id] },
    ],
    checklist: [
      { id: 'mns-xbench-lessons-cl-1', label: 'Outline agreed with co-authors', required: true, complete: true },
      { id: 'mns-xbench-lessons-cl-2', label: 'Full draft complete', required: true, complete: false, note: 'Two sections remaining' },
      { id: 'mns-xbench-lessons-cl-3', label: 'Figures prepared', required: true, complete: false },
      { id: 'mns-xbench-lessons-cl-4', label: 'Co-author review round', required: true, complete: false },
      { id: 'mns-xbench-lessons-cl-5', label: 'Target journal selected', required: true, complete: true },
    ],
    metadata: {
      abstract:
        'This synthesis paper documents the design process behind XBench, a 40-language multilingual evaluation suite, and the lessons learned while applying it across research projects. We discuss evaluation-design failure modes, the pitfalls of translation-based test sets, and practices that improved reproducibility and community adoption.',
      keywords: ['evaluation', 'benchmarking', 'lessons learned', 'multilingual NLP'],
      subjects: ['Computational Linguistics', 'Evaluation'],
      language: 'English',
      wordCount: 7200,
      pageCount: 24,
      figures: 4,
      tables: 2,
      references: 52,
    },
    relationships: {
      project: {
        id: 'cross-lingual-evaluation-benchmark',
        title: 'Cross-Lingual Evaluation Benchmark',
        detail: 'Active',
      },
      datasets: [
        {
          id: 'xbench-multilingual-evaluation',
          title: 'Cross-Lingual Evaluation Benchmark (XBench)',
          detail: '10.1000/placeholder.dataset.0003',
        },
      ],
      grants: [
        {
          id: 'grant-uif',
          title: 'University Innovation Fund',
          detail: '£36,000 awarded',
        },
      ],
      publications: [
        {
          id: 'pub-2025-0012',
          title: 'Benchmarking Transfer Learning across 40 Languages',
          detail: 'EMNLP 2025 Proceedings · 2025 · 10.1000/placeholder.2025.0012',
        },
      ],
      researchers: [JANE.said, SAM.said],
    },
    readiness: {
      score: 35,
      status: 'not-ready',
      checks: [
        { label: 'Full draft complete', complete: false, note: 'Two sections remaining' },
        { label: 'Figures prepared', complete: false },
        { label: 'Co-author review completed', complete: false },
        { label: 'References complete', complete: false },
      ],
    },
    tags: ['evaluation', 'benchmarking', 'lessons learned', 'multilingual NLP'],
  }),

  createManuscript({
    id: 'mns-syntax-survey',
    title: 'Neural Approaches to Syntax in Multilingual Contexts: A Survey',
    description:
      'A comprehensive survey of neural methods for syntactic processing across multilingual and typologically diverse contexts, accepted at the Journal of Natural Language Processing.',
    stageId: 'peer-review',
    status: 'accepted',
    correspondingAuthor: AISHA.name,
    institution: AISHA.institution,
    createdAt: '2022-02-15',
    updatedAt: '2023-03-01',
    doi: '10.1000/placeholder.2023.0045',
    authors: [
      { ...JANE, role: 'co-author' },
      { ...AISHA, role: 'corresponding' },
    ],
    versions: [
      {
        id: 'mns-syntax-v1',
        version: 'v1.0',
        createdAt: '2022-04-01',
        status: 'submitted',
        filename: 'syntax-survey-submitted.pdf',
        wordCount: 9800,
        pageCount: 31,
        changes: 'Initial submission.',
      },
      {
        id: 'mns-syntax-v2',
        version: 'v1.1',
        createdAt: '2022-09-12',
        status: 'revised',
        filename: 'syntax-survey-revised.pdf',
        wordCount: 10400,
        pageCount: 33,
        changes: 'Revision addressing reviewer comments.',
      },
      {
        id: 'mns-syntax-v3',
        version: 'v1.2',
        createdAt: '2023-03-01',
        status: 'accepted',
        filename: 'syntax-survey-camera-ready.pdf',
        wordCount: 10600,
        pageCount: 34,
        changes: 'Accepted camera-ready version.',
      },
    ],
    submissions: [
      {
        id: 'mns-syntax-sub-1',
        journalId: JOURNAL_OF_NLP.journalId,
        journalTitle: JOURNAL_OF_NLP.journalTitle,
        submissionType: 'Review Article',
        reviewModel: 'Double Blind',
        submittedAt: '2022-04-01',
        status: 'accepted',
        manuscriptId: 'JNLP-2022-0088',
        rounds: [
          {
            id: 'mns-syntax-r1',
            round: 1,
            startedAt: '2022-05-10',
            completedAt: '2022-08-20',
            status: 'completed',
            invitedReviewers: ['Reviewer 1', 'Reviewer 2'],
            completedReviews: ['Reviewer 1', 'Reviewer 2'],
            comments: [
              {
                id: 'mns-syntax-r1c1',
                reviewer: 'Anonymous Reviewer 1',
                anonymous: true,
                recommendation: 'minor-revision',
                date: '2022-08-15',
                summary: 'A thorough survey; recommend expanding the discussion of cross-lingual pre-training.',
                details:
                  'The survey is comprehensive and well structured. We suggest a dedicated subsection on cross-lingual pre-training objectives and their relation to syntactic typology.',
              },
            ],
          },
          {
            id: 'mns-syntax-r2',
            round: 2,
            startedAt: '2022-10-01',
            completedAt: '2022-11-20',
            status: 'completed',
            invitedReviewers: ['Reviewer 1'],
            completedReviews: ['Reviewer 1'],
            comments: [
              {
                id: 'mns-syntax-r2c1',
                reviewer: 'Anonymous Reviewer 1',
                anonymous: true,
                recommendation: 'accept',
                date: '2022-11-15',
                summary: 'The revision addresses the previous concerns; recommend acceptance.',
                details:
                  'All previous concerns have been addressed. The added subsection on cross-lingual pre-training is a valuable contribution.',
              },
            ],
          },
        ],
        decision: {
          id: 'mns-syntax-dec-2',
          round: 2,
          type: 'accept',
          date: '2022-12-01',
          summary: 'The survey is accepted for publication in the Journal of Natural Language Processing.',
        },
      },
    ],
    targetJournals: [
      {
        id: 'mns-syntax-tj-1',
        journal: JOURNAL_OF_NLP,
        fit: 'high',
        status: 'accepted',
        submissionType: 'Review Article',
      },
    ],
    revisions: [
      {
        id: 'mns-syntax-rev-1',
        version: 'v1.1',
        date: '2022-09-12',
        reason: 'Response to round 1 reviewer reports',
        summary: 'Added a subsection on cross-lingual pre-training objectives and typology.',
        status: 'completed',
      },
      {
        id: 'mns-syntax-rev-2',
        version: 'v1.2',
        date: '2023-03-01',
        reason: 'Camera-ready preparation',
        summary: 'Final formatting, proofing, and DOI assignment.',
        status: 'completed',
      },
    ],
    contributions: [
      { role: 'Conceptualization', authors: [AISHA.id, JANE.id] },
      { role: 'Methodology', authors: [AISHA.id] },
      { role: 'Investigation', authors: [JANE.id, AISHA.id] },
      { role: 'Supervision', authors: [AISHA.id] },
      { role: 'Writing – original draft', authors: [JANE.id, AISHA.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, AISHA.id] },
    ],
    checklist: [
      { id: 'mns-syntax-cl-1', label: 'Cover letter', required: true, complete: true },
      { id: 'mns-syntax-cl-2', label: 'Author contributions statement', required: true, complete: true },
      { id: 'mns-syntax-cl-3', label: 'Data availability statement', required: true, complete: true },
      { id: 'mns-syntax-cl-4', label: 'ORCID identifiers for all authors', required: true, complete: true },
      { id: 'mns-syntax-cl-5', label: 'Copyright transfer signed', required: true, complete: true },
    ],
    metadata: {
      abstract:
        'We survey neural approaches to syntactic processing in multilingual and typologically diverse contexts, covering cross-lingual pre-training, parsing architectures, and transfer-learning strategies. The survey synthesises findings across dependency parsing, sequence labelling, and language modelling, and identifies open problems for multilingual syntax research.',
      keywords: ['syntax', 'neural networks', 'multilingual NLP', 'typology', 'survey'],
      subjects: ['Computational Linguistics', 'Syntax', 'Multilingual NLP'],
      language: 'English',
      wordCount: 10600,
      pageCount: 34,
      figures: 3,
      tables: 2,
      references: 148,
    },
    relationships: {
      project: {
        id: 'syntax-semantics-interface',
        title: 'Syntax-Semantics Interface in Typologically Diverse Languages',
        detail: 'Completed',
      },
      datasets: [
        {
          id: 'ssit-typology-corpus',
          title: 'Syntax-Semantics Interface Typology Corpus',
          detail: '10.1000/placeholder.dataset.0005',
        },
      ],
      grants: [
        {
          id: 'grant-uf-2018-014',
          title: 'University Fellowship — 2018/014',
          detail: '£75,000 awarded',
        },
      ],
      publications: [
        {
          id: 'pub-2023-0045',
          title: 'Neural Approaches to Syntax in Multilingual Contexts',
          detail: 'Journal of Natural Language Processing · 2023 · 10.1000/placeholder.2023.0045',
        },
      ],
      researchers: [JANE.said, AISHA.said],
    },
    readiness: {
      score: 95,
      status: 'ready',
      checks: [
        { label: 'Accepted manuscript archived', complete: true },
        { label: 'DOI registered', complete: true },
        { label: 'Publication record linked', complete: true },
        { label: 'Author records updated', complete: true },
      ],
    },
    tags: ['syntax', 'survey', 'neural networks', 'multilingual', 'typology'],
  }),

  createManuscript({
    id: 'mns-annotation-practices',
    title: 'Standardising Cross-Lingual Corpus Annotation: Guidelines and Inter-Annotator Agreement',
    description:
      'A community-focused methods paper on standardising cross-lingual corpus annotation, withdrawn from the Journal of Language Documentation for restructuring.',
    stageId: 'submission',
    status: 'withdrawn',
    correspondingAuthor: JANE.name,
    institution: JANE.institution,
    createdAt: '2024-09-10',
    updatedAt: '2026-06-30',
    authors: [
      { ...JANE, role: 'corresponding' },
      { ...DINA, role: 'co-author' },
      { ...PRIYA, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-ann-v1',
        version: 'v1.0',
        createdAt: '2025-05-01',
        status: 'submitted',
        filename: 'annotation-practices-submitted.pdf',
        wordCount: 8600,
        pageCount: 27,
        changes: 'Submitted to the Journal of Language Documentation.',
      },
      {
        id: 'mns-ann-v2',
        version: 'v1.1',
        createdAt: '2026-06-15',
        status: 'revised',
        filename: 'annotation-practices-revised.pdf',
        wordCount: 9000,
        pageCount: 29,
        changes: 'Revision prepared before withdrawal.',
      },
    ],
    submissions: [
      {
        id: 'mns-ann-sub-1',
        journalId: JOURNAL_OF_LANGUAGE_DOCUMENTATION.journalId,
        journalTitle: JOURNAL_OF_LANGUAGE_DOCUMENTATION.journalTitle,
        submissionType: 'Research Article',
        reviewModel: 'Open Review',
        submittedAt: '2025-05-01',
        status: 'withdrawn',
        manuscriptId: 'JLD-2025-0112',
        rounds: [
          {
            id: 'mns-ann-r1',
            round: 1,
            startedAt: '2025-06-01',
            completedAt: '2025-08-20',
            status: 'completed',
            invitedReviewers: ['Reviewer 1', 'Reviewer 2'],
            completedReviews: ['Reviewer 1', 'Reviewer 2'],
            comments: [
              {
                id: 'mns-ann-r1c1',
                reviewer: 'Dr. L. Chen',
                anonymous: false,
                recommendation: 'major-revision',
                date: '2025-08-15',
                summary: 'The guideline framework is useful but the agreement metrics need to be reported more carefully.',
                details:
                  'Please report agreement per annotation layer and discuss adjudication outcomes in more depth. The framing as a single standard is premature given the diversity of existing practice.',
              },
            ],
          },
        ],
        decision: {
          id: 'mns-ann-dec-1',
          round: 1,
          type: 'withdraw',
          date: '2026-06-30',
          summary: 'Withdrawn by the authors to restructure the paper as a community resource and resubmit to an open venue.',
        },
      },
    ],
    targetJournals: [
      {
        id: 'mns-ann-tj-1',
        journal: JOURNAL_OF_LANGUAGE_DOCUMENTATION,
        fit: 'medium',
        status: 'withdrawn',
        submissionType: 'Research Article',
      },
      {
        id: 'mns-ann-tj-2',
        journal: LANGUAGE_RESOURCES_EVALUATION_JOURNAL,
        fit: 'high',
        status: 'considered',
        submissionType: 'Protocol',
      },
    ],
    revisions: [
      {
        id: 'mns-ann-rev-1',
        version: 'v1.1',
        date: '2026-06-15',
        reason: 'Response to round 1 reviewer reports',
        summary: 'Reworked the agreement metrics section; restructuring prompted the withdrawal.',
        status: 'completed',
      },
    ],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id, DINA.id] },
      { role: 'Methodology', authors: [JANE.id, DINA.id, PRIYA.id] },
      { role: 'Data curation', authors: [PRIYA.id] },
      { role: 'Validation', authors: [DINA.id] },
      { role: 'Writing – original draft', authors: [JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, DINA.id, PRIYA.id] },
    ],
    checklist: [
      { id: 'mns-ann-cl-1', label: 'Cover letter', required: true, complete: true },
      { id: 'mns-ann-cl-2', label: 'Anonymised manuscript (open review waived)', required: false, complete: true },
      { id: 'mns-ann-cl-3', label: 'Data availability statement', required: true, complete: true },
      { id: 'mns-ann-cl-4', label: 'Withdrawal notification to editors', required: true, complete: true },
      { id: 'mns-ann-cl-5', label: 'Resubmission plan agreed', required: true, complete: false, note: 'Awaiting restructure' },
    ],
    metadata: {
      abstract:
        'Cross-lingual corpus annotation lacks widely accepted standards, making comparison across projects difficult. We propose a guideline framework built on community practice and report inter-annotator agreement across multiple annotation layers from three projects.',
      keywords: ['annotation', 'guidelines', 'inter-annotator agreement', 'corpus linguistics'],
      subjects: ['Corpus Linguistics', 'Language Documentation'],
      language: 'English',
      wordCount: 9000,
      pageCount: 29,
      figures: 5,
      tables: 3,
      references: 71,
    },
    relationships: {
      project: {
        id: 'cross-lingual-corpus-annotation',
        title: 'Cross-Lingual Corpus Annotation',
        detail: 'Completed',
      },
      datasets: [
        {
          id: 'clca-annotation-guidelines',
          title: 'Cross-Lingual Corpus Annotation Guidelines',
          detail: '10.1000/placeholder.dataset.0004',
        },
      ],
      grants: [
        {
          id: 'grant-lpf',
          title: 'Language Preservation Foundation',
          detail: '£95,000 awarded',
        },
      ],
      publications: [],
      researchers: [JANE.said, DINA.said, PRIYA.said],
    },
    readiness: {
      score: 45,
      status: 'in-progress',
      checks: [
        { label: 'Restructure plan drafted', complete: false, note: 'Being drafted with co-authors' },
        { label: 'Agreement metrics finalised', complete: true },
        { label: 'New target venue confirmed', complete: false },
        { label: 'Resubmission draft prepared', complete: false },
      ],
    },
    tags: ['annotation', 'guidelines', 'inter-annotator agreement', 'corpus linguistics'],
  }),

  createManuscript({
    id: 'mns-learner-transfer',
    title: 'Transfer Effects in Learner English: An Error-Annotated Study of Nine L1 Backgrounds',
    description:
      'An error-annotated corpus study of L1 transfer effects in learner English, rejected at Second Language Research after full peer review.',
    stageId: 'peer-review',
    status: 'rejected',
    correspondingAuthor: JANE.name,
    institution: JANE.institution,
    createdAt: '2025-02-10',
    updatedAt: '2026-05-18',
    authors: [
      { ...JANE, role: 'corresponding' },
      { ...PRIYA, role: 'co-author' },
      { ...DINA, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-learner-v1',
        version: 'v1.0',
        createdAt: '2025-09-01',
        status: 'submitted',
        filename: 'learner-transfer-submitted.pdf',
        wordCount: 9200,
        pageCount: 28,
        changes: 'Submitted to Second Language Research.',
      },
    ],
    submissions: [
      {
        id: 'mns-learner-sub-1',
        journalId: SECOND_LANGUAGE_RESEARCH_JOURNAL.journalId,
        journalTitle: SECOND_LANGUAGE_RESEARCH_JOURNAL.journalTitle,
        submissionType: 'Research Article',
        reviewModel: 'Double Blind',
        submittedAt: '2025-09-01',
        status: 'rejected',
        manuscriptId: 'SLR-25-0114',
        rounds: [
          {
            id: 'mns-learner-r1',
            round: 1,
            startedAt: '2025-10-01',
            completedAt: '2026-05-10',
            status: 'completed',
            invitedReviewers: ['Reviewer 1', 'Reviewer 2', 'Reviewer 3'],
            completedReviews: ['Reviewer 1', 'Reviewer 2', 'Reviewer 3'],
            comments: [
              {
                id: 'mns-learner-r1c1',
                reviewer: 'Anonymous Reviewer 1',
                anonymous: true,
                recommendation: 'reject',
                date: '2026-05-01',
                summary: 'The contribution over the existing transfer literature is unclear.',
                details:
                  'The study re-observes well-documented transfer patterns and the novelty relative to earlier learner-corpus work is not convincingly argued.',
              },
              {
                id: 'mns-learner-r1c2',
                reviewer: 'Anonymous Reviewer 2',
                anonymous: true,
                recommendation: 'major-revision',
                date: '2026-05-02',
                summary: 'Interesting data; framing and controls need substantial work.',
                details:
                  'The corpus is valuable. The authors should add proficiency controls and clarify how transfer is distinguished from universal developmental patterns.',
              },
            ],
          },
        ],
        decision: {
          id: 'mns-learner-dec-1',
          round: 1,
          type: 'reject',
          date: '2026-05-18',
          summary: 'Rejected after full review. The editors noted the data are valuable and encouraged resubmission to a more applied venue.',
        },
      },
    ],
    targetJournals: [
      {
        id: 'mns-learner-tj-1',
        journal: SECOND_LANGUAGE_RESEARCH_JOURNAL,
        fit: 'medium',
        status: 'rejected',
        submissionType: 'Research Article',
      },
      {
        id: 'mns-learner-tj-2',
        journal: LANGUAGE_LEARNING_JOURNAL,
        fit: 'low',
        status: 'considered',
        submissionType: 'Research Article',
      },
    ],
    revisions: [],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id, DINA.id] },
      { role: 'Data curation', authors: [PRIYA.id] },
      { role: 'Formal analysis', authors: [JANE.id, PRIYA.id] },
      { role: 'Validation', authors: [DINA.id] },
      { role: 'Writing – original draft', authors: [JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, PRIYA.id, DINA.id] },
    ],
    checklist: [
      { id: 'mns-learner-cl-1', label: 'Cover letter', required: true, complete: true },
      { id: 'mns-learner-cl-2', label: 'Data availability statement', detail: 'Links the learner corpus dataset record', required: true, complete: true },
      { id: 'mns-learner-cl-3', label: 'Ethical approval documentation', required: true, complete: true },
      { id: 'mns-learner-cl-4', label: 'ORCID identifiers for all authors', required: true, complete: true },
      { id: 'mns-learner-cl-5', label: 'Resubmission decision', detail: 'Feedback to be incorporated', required: false, complete: false, note: 'Awaiting author decision' },
    ],
    metadata: {
      abstract:
        'Using a restricted-access error-annotated learner corpus covering nine L1 backgrounds, we analyse how L1 typology shapes error profiles in learner English. We find systematic transfer effects, moderated by proficiency, and discuss implications for teaching and for automated learner-language processing.',
      keywords: ['learner corpus', 'error annotation', 'L1 transfer', 'second language acquisition'],
      subjects: ['Second Language Acquisition', 'Corpus Linguistics'],
      language: 'English',
      wordCount: 9200,
      pageCount: 28,
      figures: 7,
      tables: 4,
      references: 93,
    },
    relationships: {
      project: {
        id: 'low-resource-language-toolkit',
        title: 'Low-Resource Language Toolkit',
        detail: 'Active',
      },
      datasets: [
        {
          id: 'leac-error-annotated-corpus',
          title: 'Learner English Error-Annotated Corpus',
          detail: '10.1000/placeholder.dataset.0008',
        },
      ],
      grants: [
        {
          id: 'grant-dff-2021-087',
          title: 'Digital Futures Fund — Grant 2021/087',
          detail: '£180,000 awarded',
        },
      ],
      publications: [],
      researchers: [JANE.said, PRIYA.said, DINA.said],
    },
    readiness: {
      score: 55,
      status: 'in-progress',
      checks: [
        { label: 'Reviewer feedback documented', complete: true },
        { label: 'Proficiency controls designed', complete: false, note: 'Required for resubmission' },
        { label: 'Alternative venue shortlisted', complete: true },
        { label: 'Revised framing drafted', complete: false },
      ],
    },
    tags: ['learner corpus', 'error annotation', 'L1 transfer', 'second language acquisition'],
  }),

  createManuscript({
    id: 'mns-speech-roadmap',
    title: 'Speech Processing for Endangered Languages: A Roadmap',
    description:
      'A roadmap for applying automatic speech recognition and forced alignment to endangered language documentation, currently in minor revision at Language Documentation & Conservation.',
    stageId: 'peer-review',
    status: 'minor-revision',
    correspondingAuthor: DINA.name,
    institution: DINA.institution,
    createdAt: '2025-03-05',
    updatedAt: '2026-06-10',
    preprintDoi: '10.1000/placeholder.2025.0005',
    authors: [
      { ...JANE, role: 'co-author' },
      { ...DINA, role: 'corresponding' },
      { ...SAM, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-speech-v1',
        version: 'v1.0',
        createdAt: '2025-06-01',
        status: 'submitted',
        filename: 'speech-roadmap-submitted.pdf',
        wordCount: 7400,
        pageCount: 24,
        changes: 'Submitted to Language Documentation & Conservation.',
      },
      {
        id: 'mns-speech-v2',
        version: 'v1.1',
        createdAt: '2026-06-10',
        status: 'revised',
        filename: 'speech-roadmap-revised.pdf',
        wordCount: 7800,
        pageCount: 26,
        changes: 'Minor revision addressing reviewer comments.',
      },
    ],
    submissions: [
      {
        id: 'mns-speech-sub-1',
        journalId: LANGUAGE_DOC_CONSERVATION_JOURNAL.journalId,
        journalTitle: LANGUAGE_DOC_CONSERVATION_JOURNAL.journalTitle,
        submissionType: 'Review Article',
        reviewModel: 'Open Review',
        submittedAt: '2025-06-01',
        status: 'minor-revision',
        manuscriptId: 'LD&C-2025-0041',
        rounds: [
          {
            id: 'mns-speech-r1',
            round: 1,
            startedAt: '2025-07-01',
            completedAt: '2026-05-20',
            status: 'completed',
            invitedReviewers: ['Reviewer 1', 'Reviewer 2'],
            completedReviews: ['Reviewer 1', 'Reviewer 2'],
            comments: [
              {
                id: 'mns-speech-r1c1',
                reviewer: 'Anonymous Reviewer 1',
                anonymous: true,
                recommendation: 'minor-revision',
                date: '2026-05-15',
                summary: 'A well-scoped roadmap; minor clarifications requested.',
                details:
                  'Please clarify how the roadmap accounts for community data sovereignty and add examples of successful documentation projects using forced alignment.',
              },
              {
                id: 'mns-speech-r1c2',
                reviewer: 'Anonymous Reviewer 2',
                anonymous: true,
                recommendation: 'minor-revision',
                date: '2026-05-18',
                summary: 'Useful synthesis of the current landscape.',
                details:
                  'A short section on evaluation metrics for documentation workflows would strengthen the practical guidance.',
              },
            ],
          },
        ],
        decision: {
          id: 'mns-speech-dec-1',
          round: 1,
          type: 'minor-revision',
          date: '2026-05-25',
          summary: 'Minor revision requested. Both reviewers were broadly positive about the roadmap.',
        },
      },
    ],
    targetJournals: [
      {
        id: 'mns-speech-tj-1',
        journal: LANGUAGE_DOC_CONSERVATION_JOURNAL,
        fit: 'high',
        status: 'in-revision',
        submissionType: 'Review Article',
      },
      {
        id: 'mns-speech-tj-2',
        journal: JOURNAL_OF_LANGUAGE_DOCUMENTATION,
        fit: 'medium',
        status: 'considered',
        submissionType: 'Research Article',
      },
    ],
    revisions: [
      {
        id: 'mns-speech-rev-1',
        version: 'v1.1',
        date: '2026-06-10',
        reason: 'Response to round 1 reviewer reports',
        summary: 'Added community data sovereignty discussion and an evaluation-metrics section.',
        status: 'completed',
      },
    ],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id, DINA.id] },
      { role: 'Methodology', authors: [SAM.id, JANE.id] },
      { role: 'Investigation', authors: [DINA.id, SAM.id] },
      { role: 'Writing – original draft', authors: [DINA.id, JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, DINA.id, SAM.id] },
    ],
    checklist: [
      { id: 'mns-speech-cl-1', label: 'Cover letter', required: true, complete: true },
      { id: 'mns-speech-cl-2', label: 'Community consent statement', required: true, complete: true },
      { id: 'mns-speech-cl-3', label: 'Data availability statement', detail: 'Links the speech recordings dataset record', required: true, complete: true },
      { id: 'mns-speech-cl-4', label: 'ORCID identifiers for all authors', required: true, complete: true },
      { id: 'mns-speech-cl-5', label: 'Response to reviewers', required: true, complete: true },
    ],
    metadata: {
      abstract:
        'Speech technology offers new tools for endangered language documentation, but deployment remains fragmented. This roadmap synthesises the state of automatic speech recognition and forced alignment for documentation work, outlines a staged implementation path, and discusses community data sovereignty and evaluation practices.',
      keywords: ['speech processing', 'endangered languages', 'forced alignment', 'documentation', 'roadmap'],
      subjects: ['Speech Processing', 'Language Documentation', 'Endangered Languages'],
      language: 'English',
      wordCount: 7800,
      pageCount: 26,
      figures: 4,
      tables: 2,
      references: 66,
    },
    relationships: {
      project: {
        id: 'endangered-language-speech',
        title: 'Speech Recognition for Endangered Languages',
        detail: 'In preparation',
      },
      datasets: [
        {
          id: 'els-speech-recordings',
          title: 'Endangered Language Speech Recordings',
          detail: '10.1000/placeholder.dataset.0006',
        },
      ],
      grants: [
        {
          id: 'grant-hrf',
          title: 'Horizon Research Fund',
          detail: 'Proposal under review',
        },
        {
          id: 'grant-lpf-fieldwork',
          title: 'Language Preservation Foundation — Fieldwork round',
          detail: 'Funding secured',
        },
      ],
      publications: [
        {
          id: 'pub-2025-0005',
          title: 'Speech Processing for Endangered Languages: A Roadmap',
          detail: 'arXiv preprint · 2025 · 10.1000/placeholder.2025.0005',
        },
      ],
      researchers: [JANE.said, DINA.said, SAM.said],
    },
    readiness: {
      score: 72,
      status: 'in-progress',
      checks: [
        { label: 'All reviewer comments addressed', complete: true },
        { label: 'Resubmitted revision', complete: true },
        { label: 'Figures at publication quality', complete: false },
        { label: 'Author records updated', complete: false },
      ],
    },
    tags: ['speech processing', 'endangered languages', 'forced alignment', 'documentation'],
  }),

  createManuscript({
    id: 'mns-sign-language-feasibility',
    title: 'Multimodal Sign Language Recognition and Translation: A Feasibility Study',
    description:
      'A feasibility study of multimodal models for sign language recognition and translation using community-created data, currently under review at Language Resources and Evaluation.',
    stageId: 'peer-review',
    status: 'under-review',
    correspondingAuthor: JANE.name,
    institution: JANE.institution,
    createdAt: '2026-01-20',
    updatedAt: '2026-07-22',
    authors: [
      { ...JANE, role: 'corresponding' },
      { ...CHEN, role: 'co-author' },
      { ...PRIYA, role: 'co-author' },
      { ...FARID, role: 'co-author' },
    ],
    versions: [
      {
        id: 'mns-sign-v1',
        version: 'v1.0',
        createdAt: '2026-04-15',
        status: 'submitted',
        filename: 'sign-language-feasibility-submitted.pdf',
        wordCount: 6800,
        pageCount: 22,
        changes: 'Submitted to Language Resources and Evaluation.',
      },
    ],
    submissions: [
      {
        id: 'mns-sign-sub-1',
        journalId: LANGUAGE_RESOURCES_EVALUATION_JOURNAL.journalId,
        journalTitle: LANGUAGE_RESOURCES_EVALUATION_JOURNAL.journalTitle,
        submissionType: 'Research Article',
        reviewModel: 'Single Blind',
        submittedAt: '2026-04-15',
        status: 'under-review',
        manuscriptId: 'LRE-D-26-00112',
        rounds: [
          {
            id: 'mns-sign-r1',
            round: 1,
            startedAt: '2026-05-10',
            status: 'in-progress',
            invitedReviewers: ['Reviewer 1', 'Reviewer 2'],
            completedReviews: [],
            comments: [],
          },
        ],
      },
    ],
    targetJournals: [
      {
        id: 'mns-sign-tj-1',
        journal: LANGUAGE_RESOURCES_EVALUATION_JOURNAL,
        fit: 'high',
        status: 'under-review',
        submissionType: 'Research Article',
      },
    ],
    revisions: [],
    contributions: [
      { role: 'Conceptualization', authors: [JANE.id, CHEN.id] },
      { role: 'Methodology', authors: [JANE.id, CHEN.id] },
      { role: 'Data curation', authors: [PRIYA.id] },
      { role: 'Formal analysis', authors: [CHEN.id] },
      { role: 'Writing – original draft', authors: [JANE.id] },
      { role: 'Writing – review & editing', authors: [JANE.id, CHEN.id, PRIYA.id, FARID.id] },
    ],
    checklist: [
      { id: 'mns-sign-cl-1', label: 'Cover letter', required: true, complete: true },
      { id: 'mns-sign-cl-2', label: 'Community consent statement', detail: 'Consent from content creators', required: true, complete: true },
      { id: 'mns-sign-cl-3', label: 'Data availability statement', detail: 'Links the sign language dataset record', required: true, complete: true },
      { id: 'mns-sign-cl-4', label: 'Ethics clearance', required: true, complete: true },
      { id: 'mns-sign-cl-5', label: 'ORCID identifiers for all authors', required: true, complete: true },
    ],
    metadata: {
      abstract:
        'We assess the feasibility of multimodal models for sign language recognition and translation trained on a small, community-created dataset. While absolute performance is limited by data scale, our results identify the data requirements and modelling choices that would make a larger deployment viable.',
      keywords: ['sign language', 'multimodal', 'translation', 'recognition', 'feasibility'],
      subjects: ['Multimodal NLP', 'Computer Vision', 'Sign Language Processing'],
      language: 'English',
      wordCount: 6800,
      pageCount: 22,
      figures: 6,
      tables: 3,
      references: 58,
    },
    relationships: {
      project: {
        id: 'sign-language-multimodal',
        title: 'Multimodal Sign Language Processing',
        detail: 'Draft',
      },
      datasets: [
        {
          id: 'msl-multimodal-data',
          title: 'Multimodal Sign Language Data',
          detail: '10.1000/placeholder.dataset.0007',
        },
      ],
      grants: [],
      publications: [],
      researchers: [JANE.said, CHEN.said, PRIYA.said, FARID.said],
    },
    readiness: {
      score: 60,
      status: 'in-progress',
      checks: [
        { label: 'Data and consent documented', complete: true },
        { label: 'Experiments reproducible', complete: true },
        { label: 'Reviewer assignment complete', complete: true },
        { label: 'Reviews returned', complete: false, note: 'Awaiting reviewer reports' },
      ],
    },
    tags: ['sign language', 'multimodal', 'translation', 'feasibility'],
  }),
];

export const MANUSCRIPT_TIMELINE_ENTRIES: ManuscriptTimelineEntry[] = [
  {
    date: 'Jul 2026',
    title: 'Major revision uploaded',
    detail: 'Round 2 revision of the low-resource parsing manuscript uploaded to Computational Linguistics Journal',
    type: 'Revision',
  },
  {
    date: 'Jul 2026',
    title: 'XBench suite submitted',
    detail: 'Submitted to Language Resources and Evaluation for editorial screening',
    type: 'Submission',
  },
  {
    date: 'May 2026',
    title: 'Rejected after full review',
    detail: 'Learner transfer study rejected at Second Language Research with constructive feedback',
    type: 'Decision',
  },
  {
    date: 'Apr 2026',
    title: 'Syntax survey accepted',
    detail: 'Accepted at the Journal of Natural Language Processing; DOI 10.1000/placeholder.2023.0045',
    type: 'Acceptance',
  },
  {
    date: 'Mar 2026',
    title: 'Major revision requested',
    detail: 'Computational Linguistics Journal returned round 1 reviews requesting a major revision',
    type: 'Decision',
  },
  {
    date: 'Feb 2026',
    title: 'Speech roadmap under review',
    detail: 'Reviewer assignment completed at Language Documentation & Conservation',
    type: 'Review',
  },
];

export const RECENT_MANUSCRIPTS: Manuscript[] = [...MANUSCRIPTS]
  .sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt))
  .slice(0, 3);

export const FEATURED_MANUSCRIPT: Manuscript = MANUSCRIPTS[0];

export const FEATURED_PEER_REVIEW_SUMMARY: PeerReviewSummary = {
  reviewRounds: 2,
  completedRounds: 1,
  invitedReviewers: 5,
  completedReviews: 3,
  averageRecommendation: 'major-revision',
  summary:
    'Two rounds of review at Computational Linguistics Journal. Reviewers confirmed the value of the evaluation while requesting stronger baselines, ablations, and a restructured discussion.',
};

function buildManuscriptStatistics(manuscripts: Manuscript[]): ManuscriptStatistics {
  const totalManuscripts = manuscripts.length;
  const byStatus = (status: Manuscript['status']) =>
    manuscripts.filter((manuscript) => manuscript.status === status).length;
  const lifecycleCompletionPercent =
    ResearchLifecycleEngine.getCompletionPercentage('peer-review');

  return {
    totalManuscripts,
    drafts: byStatus('draft'),
    submitted: byStatus('submitted'),
    underReview: byStatus('under-review'),
    inRevision: byStatus('major-revision') + byStatus('minor-revision'),
    accepted: byStatus('accepted'),
    rejected: byStatus('rejected'),
    withdrawn: byStatus('withdrawn'),
    avgReviewDays: 42,
    lifecycleCompletionPercent,
  };
}

export const MANUSCRIPT_STATISTICS: ManuscriptStatistics =
  buildManuscriptStatistics(MANUSCRIPTS);
