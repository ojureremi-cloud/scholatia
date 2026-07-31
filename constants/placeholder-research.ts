import type { PublicationEntry } from '@/constants/placeholder-profile';
import type { ResearchLifecycleStageId } from '@/types/research';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';

export type WorkspaceProjectStatus = 'active' | 'completed' | 'draft' | 'planned' | 'on-hold';

export interface ProjectMilestone {
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  role: string;
  status: WorkspaceProjectStatus;
  period: string;
  collaborators: string[];
  fundingSource?: string;
  fundingAmount?: string;
  fundingProgress?: number;
  progress: number;
  category: string;
  milestones: ProjectMilestone[];
}

export interface ResearchDeadline {
  id: string;
  title: string;
  venue: string;
  type: 'Submission' | 'Grant' | 'Event' | 'Report';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GrantOpportunity {
  id: string;
  title: string;
  funder: string;
  amount: string;
  deadline: string;
  focus: string;
  eligibility: string;
}

export interface CollaborationRequest {
  id: string;
  name: string;
  role: string;
  institution: string;
  message: string;
  researchAreas: string[];
}

export interface PipelineStageItem {
  project: string;
  detail: string;
  /** Canonical research lifecycle stage the item belongs to. */
  stageId: ResearchLifecycleStageId;
}

export interface PipelineStage {
  id: ResearchLifecycleStageId;
  name: string;
  description: string;
  icon: string;
  items: PipelineStageItem[];
}

export interface FundingStatusEntry {
  projectId: string;
  projectName: string;
  funder: string;
  requested: string;
  awarded: string;
  progress: number;
  status: 'funded' | 'partial' | 'pending';
}

export interface TeamMember {
  name: string;
  role: string;
  institution: string;
  specialisation: string;
  activeProjects: number;
}

export interface ProjectTimelineEntry {
  date: string;
  title: string;
  detail: string;
  type: 'Milestone' | 'Publication' | 'Grant';
}

export interface PublicationTimelineEntry {
  year: string;
  title: string;
  venue: string;
  type: string;
  citations: number;
}

export interface CitationBreakdownEntry {
  label: string;
  percentage: number;
}

export const WORKSPACE_PROJECTS: WorkspaceProject[] = [
  {
    id: 'multilingual-parsing-framework',
    name: 'Multilingual Parsing Framework',
    description:
      'A cross-lingual dependency parsing framework supporting over 50 languages with transfer learning from high-resource to low-resource languages.',
    role: 'Principal Investigator',
    status: 'active',
    period: '2022 - Present',
    collaborators: ['Prof. Aisha Mentor', 'Dr. Chen Researcher', 'Dr. Farid Developer'],
    fundingSource: 'National Research Council — Grant 2022/113',
    fundingAmount: '£450,000',
    fundingProgress: 100,
    progress: 65,
    category: 'Multilingual NLP',
    milestones: [
      { title: 'Transfer learning module', date: '2025-06-01', status: 'completed' },
      { title: '50th language supported', date: '2026-01-01', status: 'completed' },
      { title: 'Public evaluation release', date: '2026-11-01', status: 'in-progress' },
      { title: 'Final benchmark report', date: '2027-03-01', status: 'pending' },
    ],
  },
  {
    id: 'low-resource-language-toolkit',
    name: 'Low-Resource Language Toolkit',
    description:
      'Developing open-source tools and annotated corpora for under-represented languages to enable NLP research in low-resource settings.',
    role: 'Co-Investigator',
    status: 'active',
    period: '2021 - Present',
    collaborators: ['Dr. Dina Linguist', 'Dr. Farid Developer', 'Priya Patel'],
    fundingSource: 'Digital Futures Fund — Grant 2021/087',
    fundingAmount: '£180,000',
    fundingProgress: 75,
    progress: 80,
    category: 'Language Technology',
    milestones: [
      { title: 'Corpus v2 annotation', date: '2025-09-01', status: 'completed' },
      { title: 'Open-source tooling release', date: '2026-03-01', status: 'completed' },
      { title: 'Evaluation suite', date: '2026-08-01', status: 'in-progress' },
      { title: 'Community adoption report', date: '2026-12-01', status: 'pending' },
    ],
  },
  {
    id: 'cross-lingual-evaluation-benchmark',
    name: 'Cross-Lingual Evaluation Benchmark',
    description:
      'Building a shared evaluation suite for cross-lingual natural language understanding covering 40 languages.',
    role: 'Co-Investigator',
    status: 'active',
    period: '2025 - 2027',
    collaborators: ['Dr. Chen Researcher', 'Sam Okafor'],
    fundingSource: 'University Innovation Fund',
    fundingAmount: '£90,000',
    fundingProgress: 40,
    progress: 30,
    category: 'Evaluation',
    milestones: [
      { title: 'Task definition', date: '2025-10-01', status: 'completed' },
      { title: 'Multilingual test sets', date: '2026-06-01', status: 'completed' },
      { title: 'Scoring harness', date: '2026-10-01', status: 'in-progress' },
      { title: 'Benchmark publication', date: '2027-02-01', status: 'pending' },
    ],
  },
  {
    id: 'syntax-semantics-interface',
    name: 'Syntax-Semantics Interface in Typologically Diverse Languages',
    description:
      'Investigating the mapping between syntactic structures and semantic interpretations across languages with different typological profiles.',
    role: 'Researcher',
    status: 'completed',
    period: '2018 - 2021',
    collaborators: ['Prof. Aisha Mentor', 'Dr. Dina Linguist'],
    fundingSource: 'University Fellowship — 2018/014',
    fundingAmount: '£75,000',
    fundingProgress: 100,
    progress: 100,
    category: 'Theoretical Linguistics',
    milestones: [
      { title: 'Cross-linguistic study', date: '2019-06-01', status: 'completed' },
      { title: 'Typology corpus', date: '2020-03-01', status: 'completed' },
      { title: 'Project monograph', date: '2021-09-01', status: 'completed' },
      { title: 'Final report', date: '2021-12-01', status: 'completed' },
    ],
  },
  {
    id: 'cross-lingual-corpus-annotation',
    name: 'Cross-Lingual Corpus Annotation',
    description:
      'Annotated multilingual corpora for training and evaluating cross-lingual parsing and transfer models.',
    role: 'Principal Investigator',
    status: 'completed',
    period: '2019 - 2021',
    collaborators: ['Dr. Dina Linguist', 'Dr. Farid Developer'],
    fundingSource: 'Language Preservation Foundation',
    fundingAmount: '£95,000',
    fundingProgress: 100,
    progress: 100,
    category: 'Corpus Linguistics',
    milestones: [
      { title: 'Annotation guidelines', date: '2019-12-01', status: 'completed' },
      { title: 'Corpus release v1', date: '2020-09-01', status: 'completed' },
      { title: 'Inter-annotator agreement study', date: '2021-03-01', status: 'completed' },
      { title: 'Corpus release v2', date: '2021-08-01', status: 'completed' },
    ],
  },
  {
    id: 'endangered-language-speech',
    name: 'Speech Recognition for Endangered Languages',
    description:
      'Exploring automatic speech recognition and forced alignment for documenting and preserving endangered languages.',
    role: 'Principal Investigator',
    status: 'draft',
    period: 'Proposed 2027',
    collaborators: ['Dr. Dina Linguist', 'Sam Okafor'],
    fundingSource: 'Funding proposal in preparation',
    fundingAmount: '£220,000',
    fundingProgress: 0,
    progress: 15,
    category: 'Speech Processing',
    milestones: [
      { title: 'Scoping study', date: '2026-09-01', status: 'in-progress' },
      { title: 'Community partnerships', date: '2027-01-01', status: 'pending' },
      { title: 'Data collection', date: '2027-04-01', status: 'pending' },
      { title: 'System prototype', date: '2027-11-01', status: 'pending' },
    ],
  },
  {
    id: 'sign-language-multimodal',
    name: 'Multimodal Sign Language Processing',
    description:
      'A preliminary study of multimodal models for sign language recognition and translation using community-created data.',
    role: 'Co-Investigator',
    status: 'draft',
    period: 'Proposed 2027',
    collaborators: ['Dr. Chen Researcher', 'Priya Patel'],
    fundingSource: 'Idea stage',
    fundingAmount: '£140,000',
    fundingProgress: 0,
    progress: 10,
    category: 'Multimodal NLP',
    milestones: [
      { title: 'Literature review', date: '2026-10-01', status: 'in-progress' },
      { title: 'Data agreements', date: '2027-02-01', status: 'pending' },
      { title: 'Feasibility study', date: '2027-05-01', status: 'pending' },
    ],
  },
];

export const WORKSPACE_PUBLICATIONS: PublicationEntry[] = [
  {
    title: 'Evaluating Annotation Consistency in Multilingual Corpora',
    authors: ['J. Scholar', 'D. Linguist', 'F. Developer'],
    journal: 'Journal of Language Documentation',
    year: '2024',
    citations: 32,
    doi: '10.1000/placeholder.2024.0032',
    type: 'Journal Article',
  },
  {
    title: 'Neural Approaches to Syntax in Multilingual Contexts',
    authors: ['J. Scholar', 'A. Mentor', 'B. Collaborator'],
    journal: 'Journal of Natural Language Processing',
    year: '2023',
    citations: 45,
    doi: '10.1000/placeholder.2023.0045',
    type: 'Journal Article',
  },
  {
    title: 'Low-Resource Language Parsing with Cross-Lingual Transfer',
    authors: ['J. Scholar', 'C. Researcher'],
    journal: 'Computational Linguistics Journal',
    year: '2022',
    citations: 120,
    doi: '10.1000/placeholder.2022.0120',
    type: 'Journal Article',
  },
  {
    title: 'A Corpus Study of Syntactic Variation in Under-Resourced Languages',
    authors: ['J. Scholar', 'D. Linguist'],
    journal: 'Language Resources and Evaluation',
    year: '2021',
    citations: 89,
    doi: '10.1000/placeholder.2021.0089',
    type: 'Journal Article',
  },
  {
    title: 'Benchmarking Transfer Learning across 40 Languages',
    authors: ['J. Scholar', 'C. Researcher', 'S. Okafor'],
    journal: 'EMNLP 2025 Proceedings',
    year: '2025',
    citations: 12,
    doi: '10.1000/placeholder.2025.0012',
    type: 'Conference Paper',
  },
  {
    title: 'A Typology-Driven Approach to Low-Resource Dependency Parsing',
    authors: ['J. Scholar', 'C. Researcher'],
    journal: 'LREC 2024 Proceedings',
    year: '2024',
    citations: 18,
    doi: '10.1000/placeholder.2024.0018',
    type: 'Conference Paper',
  },
  {
    title: 'Multilingual Representations for Cross-Lingual Transfer Learning',
    authors: ['J. Scholar', 'A. Mentor', 'E. Collaborator'],
    journal: 'ACL Conference on Empirical Methods',
    year: '2020',
    citations: 210,
    doi: '10.1000/placeholder.2020.0210',
    type: 'Conference Paper',
  },
  {
    title: 'Multilingual Natural Language Processing',
    authors: ['J. Scholar', 'A. Mentor'],
    journal: 'Cambridge University Press',
    year: '2023',
    citations: 67,
    doi: '10.1000/placeholder.2023.0067',
    type: 'Book',
  },
  {
    title: 'Transfer Learning for Low-Resource Languages',
    authors: ['J. Scholar', 'C. Researcher'],
    journal: 'Advances in Cross-Lingual NLP',
    year: '2024',
    citations: 15,
    doi: '10.1000/placeholder.2024.0015',
    type: 'Book Chapter',
  },
  {
    title: 'Annotation Practices for Typologically Diverse Corpora',
    authors: ['J. Scholar'],
    journal: 'The Handbook of Language Resources',
    year: '2022',
    citations: 24,
    doi: '10.1000/placeholder.2022.0024',
    type: 'Book Chapter',
  },
  {
    title: 'Rethinking Evaluation Metrics for Typologically Diverse Languages',
    authors: ['J. Scholar'],
    journal: 'Institute Working Paper Series',
    year: '2025',
    citations: 8,
    doi: '10.1000/placeholder.2025.0008',
    type: 'Working Paper',
  },
  {
    title: 'Speech Processing for Endangered Languages: A Roadmap',
    authors: ['J. Scholar', 'D. Linguist'],
    journal: 'arXiv preprint',
    year: '2025',
    citations: 5,
    doi: '10.1000/placeholder.2025.0005',
    type: 'Preprint',
  },
  {
    title: 'Annotation Guidelines for Typologically Diverse Corpora',
    authors: ['J. Scholar'],
    journal: 'arXiv preprint',
    year: '2019',
    citations: 34,
    doi: '10.1000/placeholder.2019.0034',
    type: 'Preprint',
  },
];

export const RESEARCH_DEADLINES: ResearchDeadline[] = [
  {
    id: 'deadline-emnlp',
    title: 'Full paper submission',
    venue: 'EMNLP 2026',
    type: 'Submission',
    date: '2026-09-11',
    priority: 'high',
  },
  {
    id: 'deadline-special-issue',
    title: 'Special issue manuscript',
    venue: 'Journal of Natural Language Processing',
    type: 'Submission',
    date: '2026-08-28',
    priority: 'medium',
  },
  {
    id: 'deadline-grant',
    title: 'Early career grant application',
    venue: 'National Research Council',
    type: 'Grant',
    date: '2026-10-01',
    priority: 'high',
  },
  {
    id: 'deadline-fieldwork',
    title: 'Fieldwork funding round',
    venue: 'Language Preservation Foundation',
    type: 'Grant',
    date: '2026-09-15',
    priority: 'medium',
  },
  {
    id: 'deadline-report',
    title: 'Quarterly progress report',
    venue: 'Digital Futures Fund',
    type: 'Report',
    date: '2026-08-14',
    priority: 'low',
  },
];

export const GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: 'grant-multilingual-ai',
    title: 'Multilingual AI Initiative',
    funder: 'Horizon Research Fund',
    amount: '£600,000',
    deadline: '2026-11-30',
    focus: 'Cross-lingual and multilingual artificial intelligence systems, with emphasis on low-resource languages.',
    eligibility: 'Research organisations and universities',
  },
  {
    id: 'grant-open-language',
    title: 'Open Language Technology Programme',
    funder: 'Digital Futures Fund',
    amount: '£250,000',
    deadline: '2026-10-15',
    focus: 'Open-source language technology, corpora, and tooling that benefit the broader research community.',
    eligibility: 'Individual researchers and small teams',
  },
  {
    id: 'grant-cross-disciplinary',
    title: 'Cross-Disciplinary Collaboration Grant',
    funder: 'National Research Council',
    amount: '£300,000',
    deadline: '2026-12-01',
    focus: 'Projects bridging linguistics, computer science, and social science for language preservation.',
    eligibility: 'Teams spanning two or more disciplines',
  },
  {
    id: 'grant-endangered-archive',
    title: 'Endangered Languages Digital Archive',
    funder: 'Language Preservation Foundation',
    amount: '£120,000',
    deadline: '2026-09-30',
    focus: 'Digitisation and annotation of endangered language recordings and documentary materials.',
    eligibility: 'Academic and community researchers',
  },
];

export const COLLABORATION_REQUESTS: CollaborationRequest[] = [
  {
    id: 'req-diallo',
    name: 'Dr. Amara Diallo',
    role: 'Senior Lecturer',
    institution: 'University of Dakar',
    message: 'Requests collaboration on annotating Wolof and Pulaar corpora for multilingual dependency parsing.',
    researchAreas: ['West African Languages', 'Corpus Annotation', 'Low-Resource NLP'],
  },
  {
    id: 'req-tanaka',
    name: 'Prof. Yuki Tanaka',
    role: 'Professor of Computer Science',
    institution: 'Tokyo Institute of Technology',
    message: 'Invites joint work on evaluating cross-lingual transfer across Japanese and underrepresented languages.',
    researchAreas: ['Transfer Learning', 'Evaluation', 'Multilingual NLP'],
  },
  {
    id: 'req-fernandez',
    name: 'Dr. Lucia Fernández',
    role: 'Research Scientist',
    institution: 'National Autonomous University of Mexico',
    message: 'Interested in contributing indigenous language datasets to the Cross-Lingual Evaluation Benchmark.',
    researchAreas: ['Benchmarking', 'Indigenous Languages', 'Dataset Curation'],
  },
];

const PIPELINE_ITEMS: Record<ResearchLifecycleStageId, { project: string; detail: string }[]> = {
  idea: [{ project: 'Speech Recognition for Endangered Languages', detail: 'Scoping study' }],
  'concept-note': [{ project: 'Multimodal Sign Language Processing', detail: 'Preliminary review' }],
  proposal: [],
  funding: [{ project: 'Cross-Lingual Evaluation Benchmark', detail: 'Extension proposal under review' }],
  project: [
    { project: 'Multilingual Parsing Framework', detail: 'Training runs' },
    { project: 'Low-Resource Language Toolkit', detail: 'Tooling release' },
  ],
  dataset: [],
  analysis: [{ project: 'Low-Resource Language Toolkit', detail: 'Evaluation suite' }],
  manuscript: [],
  submission: [{ project: 'EMNLP 2026 Submission', detail: 'In preparation' }],
  'peer-review': [],
  publication: [{ project: 'Speech Processing Roadmap', detail: 'Preprint published' }],
  conference: [],
  citation: [],
  impact: [],
  'knowledge-transfer': [],
};

export const RESEARCH_PIPELINE: PipelineStage[] = ResearchLifecycleEngine.getAllStages().map(
  (stage) => ({
    id: stage.id,
    name: stage.name,
    description: stage.description,
    icon: stage.icon,
    items: (PIPELINE_ITEMS[stage.id] ?? []).map((item) => ({ ...item, stageId: stage.id })),
  })
);

export const FUNDING_STATUS: FundingStatusEntry[] = [
  {
    projectId: 'multilingual-parsing-framework',
    projectName: 'Multilingual Parsing Framework',
    funder: 'National Research Council',
    requested: '£450,000',
    awarded: '£450,000',
    progress: 100,
    status: 'funded',
  },
  {
    projectId: 'low-resource-language-toolkit',
    projectName: 'Low-Resource Language Toolkit',
    funder: 'Digital Futures Fund',
    requested: '£240,000',
    awarded: '£180,000',
    progress: 75,
    status: 'partial',
  },
  {
    projectId: 'cross-lingual-evaluation-benchmark',
    projectName: 'Cross-Lingual Evaluation Benchmark',
    funder: 'University Innovation Fund',
    requested: '£90,000',
    awarded: '£36,000',
    progress: 40,
    status: 'partial',
  },
  {
    projectId: 'syntax-semantics-interface',
    projectName: 'Syntax-Semantics Interface',
    funder: 'University Fellowship Programme',
    requested: '£75,000',
    awarded: '£75,000',
    progress: 100,
    status: 'funded',
  },
  {
    projectId: 'cross-lingual-corpus-annotation',
    projectName: 'Cross-Lingual Corpus Annotation',
    funder: 'Language Preservation Foundation',
    requested: '£95,000',
    awarded: '£95,000',
    progress: 100,
    status: 'funded',
  },
  {
    projectId: 'endangered-language-speech',
    projectName: 'Speech Recognition for Endangered Languages',
    funder: 'Funding proposal in preparation',
    requested: '£220,000',
    awarded: '£0',
    progress: 0,
    status: 'pending',
  },
];

export const RESEARCH_TEAM: TeamMember[] = [
  {
    name: 'Dr. Jane Scholar',
    role: 'Principal Investigator',
    institution: 'Institute for Computational Linguistics',
    specialisation: 'Multilingual NLP and parsing',
    activeProjects: 4,
  },
  {
    name: 'Prof. Aisha Mentor',
    role: 'Senior Collaborator',
    institution: 'University of Cambridge',
    specialisation: 'Syntax and parsing',
    activeProjects: 2,
  },
  {
    name: 'Dr. Chen Researcher',
    role: 'Senior Research Scientist',
    institution: 'Tech University',
    specialisation: 'Transfer learning',
    activeProjects: 3,
  },
  {
    name: 'Dr. Dina Linguist',
    role: 'Field Linguist',
    institution: 'University of Oxford',
    specialisation: 'Language typology',
    activeProjects: 3,
  },
  {
    name: 'Dr. Farid Developer',
    role: 'Research Software Engineer',
    institution: 'Institute for Computational Linguistics',
    specialisation: 'Corpus tooling',
    activeProjects: 2,
  },
  {
    name: 'Priya Patel',
    role: 'PhD Candidate',
    institution: 'Institute for Computational Linguistics',
    specialisation: 'Low-resource machine translation',
    activeProjects: 2,
  },
  {
    name: 'Sam Okafor',
    role: 'Research Assistant',
    institution: 'Institute for Computational Linguistics',
    specialisation: 'Evaluation and benchmarking',
    activeProjects: 2,
  },
];

export const PROJECT_TIMELINE: ProjectTimelineEntry[] = [
  {
    date: 'Mar 2026',
    title: 'Toolkit v2 released',
    detail: 'Low-Resource Language Toolkit open-source release',
    type: 'Milestone',
  },
  {
    date: 'Jan 2026',
    title: 'Benchmark launch',
    detail: 'First stable version of the Cross-Lingual Evaluation Benchmark',
    type: 'Milestone',
  },
  {
    date: 'Dec 2025',
    title: 'EMNLP paper accepted',
    detail: 'Benchmarking Transfer Learning across 40 Languages',
    type: 'Publication',
  },
  {
    date: 'Sep 2025',
    title: 'Fieldwork trip completed',
    detail: 'Corpus collection with endangered language communities',
    type: 'Milestone',
  },
  {
    date: 'Jun 2025',
    title: 'Parsing framework milestone',
    detail: '50th language supported in Multilingual Parsing Framework',
    type: 'Milestone',
  },
  {
    date: 'Apr 2025',
    title: 'Preprint published',
    detail: 'Speech Processing for Endangered Languages: A Roadmap',
    type: 'Publication',
  },
];

export const PUBLICATION_TIMELINE: PublicationTimelineEntry[] = [
  {
    year: '2025',
    title: 'Benchmarking Transfer Learning across 40 Languages',
    venue: 'EMNLP 2025',
    type: 'Conference Paper',
    citations: 12,
  },
  {
    year: '2025',
    title: 'Speech Processing for Endangered Languages: A Roadmap',
    venue: 'arXiv',
    type: 'Preprint',
    citations: 5,
  },
  {
    year: '2025',
    title: 'Rethinking Evaluation Metrics for Typologically Diverse Languages',
    venue: 'Institute Working Paper Series',
    type: 'Working Paper',
    citations: 8,
  },
  {
    year: '2024',
    title: 'Evaluating Annotation Consistency in Multilingual Corpora',
    venue: 'Journal of Language Documentation',
    type: 'Journal Article',
    citations: 32,
  },
  {
    year: '2024',
    title: 'A Typology-Driven Approach to Low-Resource Dependency Parsing',
    venue: 'LREC 2024',
    type: 'Conference Paper',
    citations: 18,
  },
  {
    year: '2024',
    title: 'Transfer Learning for Low-Resource Languages',
    venue: 'Advances in Cross-Lingual NLP',
    type: 'Book Chapter',
    citations: 15,
  },
  {
    year: '2023',
    title: 'Neural Approaches to Syntax in Multilingual Contexts',
    venue: 'Journal of Natural Language Processing',
    type: 'Journal Article',
    citations: 45,
  },
  {
    year: '2023',
    title: 'Multilingual Natural Language Processing',
    venue: 'Cambridge University Press',
    type: 'Book',
    citations: 67,
  },
  {
    year: '2022',
    title: 'Low-Resource Language Parsing with Cross-Lingual Transfer',
    venue: 'Computational Linguistics Journal',
    type: 'Journal Article',
    citations: 120,
  },
  {
    year: '2022',
    title: 'Annotation Practices for Typologically Diverse Corpora',
    venue: 'The Handbook of Language Resources',
    type: 'Book Chapter',
    citations: 24,
  },
  {
    year: '2021',
    title: 'A Corpus Study of Syntactic Variation in Under-Resourced Languages',
    venue: 'Language Resources and Evaluation',
    type: 'Journal Article',
    citations: 89,
  },
  {
    year: '2020',
    title: 'Multilingual Representations for Cross-Lingual Transfer Learning',
    venue: 'ACL Conference on Empirical Methods',
    type: 'Conference Paper',
    citations: 210,
  },
  {
    year: '2019',
    title: 'Annotation Guidelines for Typologically Diverse Corpora',
    venue: 'arXiv',
    type: 'Preprint',
    citations: 34,
  },
];

export const CITATION_METRICS = {
  totalArticles: 24,
  totalCitations: 1560,
  hIndex: 12,
};

export const CITATION_BREAKDOWN: CitationBreakdownEntry[] = [
  { label: 'Journal articles', percentage: 68 },
  { label: 'Conference papers', percentage: 24 },
  { label: 'Books and chapters', percentage: 5 },
  { label: 'Preprints', percentage: 3 },
];
