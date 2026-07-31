import type { EducationEntry, EmploymentEntry } from '@/types/identity';

export type ProjectStatus = 'active' | 'completed' | 'planned' | 'on-hold';

export interface PublicationEntry {
  title: string;
  authors: string[];
  journal: string;
  year: string;
  citations: number;
  doi: string;
  type: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  role: string;
  status: ProjectStatus;
  period: string;
  collaborators: string[];
  funding?: string;
}

export interface AwardEntry {
  title: string;
  organisation: string;
  year: string;
  description: string;
}

export interface GrantEntry {
  title: string;
  funder: string;
  amount: string;
  status: 'Active' | 'Completed' | 'Pending';
  period: string;
  role: string;
}

export interface CollaboratorEntry {
  name: string;
  role: string;
  institution: string;
  researchAreas: string[];
  jointPublications: number;
  yearsActive: string;
}

export interface VerificationChecklistItem {
  label: string;
  detail: string;
  status: 'verified' | 'pending' | 'not-started';
}

export interface CitationYearEntry {
  year: string;
  citations: number;
}

export interface SkillGroup {
  category: string;
  description: string;
  skills: string[];
}

export interface AffiliationMembership {
  name: string;
  type: string;
  role: string;
  since: string;
}

export const PLACEHOLDER_PUBLICATIONS: PublicationEntry[] = [
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
    title: 'Multilingual Representations for Cross-Lingual Transfer Learning',
    authors: ['J. Scholar', 'A. Mentor', 'E. Collaborator'],
    journal: 'ACL Conference on Empirical Methods',
    year: '2020',
    citations: 210,
    doi: '10.1000/placeholder.2020.0210',
    type: 'Conference Paper',
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

export const PLACEHOLDER_PROJECTS: ProjectEntry[] = [
  {
    name: 'Multilingual Parsing Framework',
    description:
      'A cross-lingual dependency parsing framework supporting over 50 languages with transfer learning from high-resource to low-resource languages.',
    role: 'Principal Investigator',
    status: 'active',
    period: '2022 - Present',
    collaborators: ['A. Mentor', 'C. Researcher', 'E. Collaborator'],
    funding: 'National Research Council — Grant 2022/113',
  },
  {
    name: 'Low-Resource Language Toolkit',
    description:
      'Developing open-source tools and annotated corpora for under-represented languages to enable NLP research in low-resource settings.',
    role: 'Co-Investigator',
    status: 'active',
    period: '2021 - Present',
    collaborators: ['D. Linguist', 'F. Developer'],
    funding: 'Digital Futures Fund — Grant 2021/087',
  },
  {
    name: 'Syntax-Semantics Interface in Typologically Diverse Languages',
    description:
      'Investigating the mapping between syntactic structures and semantic interpretations across languages with different typological profiles.',
    role: 'Researcher',
    status: 'completed',
    period: '2018 - 2021',
    collaborators: ['A. Mentor', 'D. Linguist'],
    funding: 'University Fellowship — 2018/014',
  },
  {
    name: 'Cross-Lingual Evaluation Benchmark',
    description:
      'Building a shared evaluation suite for cross-lingual natural language understanding covering 40 languages.',
    role: 'Co-Investigator',
    status: 'planned',
    period: '2025 - 2027',
    collaborators: ['C. Researcher'],
  },
];

export const PLACEHOLDER_AWARDS: AwardEntry[] = [
  {
    title: 'Best Paper Award',
    organisation: 'ACL 2020',
    year: '2020',
    description: 'Awarded for the paper on multilingual representations for cross-lingual transfer learning.',
  },
  {
    title: 'Outstanding Reviewer Recognition',
    organisation: 'Computational Linguistics Journal',
    year: '2022',
    description: 'Recognised for consistently high-quality and timely peer review contributions.',
  },
  {
    title: 'Early Career Researcher Grant',
    organisation: 'National Research Council',
    year: '2021',
    description: 'Competitive early career funding supporting the Low-Resource Language Toolkit project.',
  },
  {
    title: 'Rising Scholar Award',
    organisation: 'Institute for Computational Linguistics',
    year: '2019',
    description: 'Awarded for outstanding contributions to research in low-resource language processing.',
  },
];

export const PLACEHOLDER_GRANTS: GrantEntry[] = [
  {
    title: 'Multilingual Parsing Framework',
    funder: 'National Research Council',
    amount: '£450,000',
    status: 'Active',
    period: '2022 - 2025',
    role: 'Principal Investigator',
  },
  {
    title: 'Low-Resource Language Toolkit',
    funder: 'Digital Futures Fund',
    amount: '£180,000',
    status: 'Active',
    period: '2021 - 2024',
    role: 'Co-Investigator',
  },
  {
    title: 'Cross-Lingual Corpus Annotation',
    funder: 'Language Preservation Foundation',
    amount: '£95,000',
    status: 'Completed',
    period: '2019 - 2021',
    role: 'Principal Investigator',
  },
  {
    title: 'Syntax-Semantics Interface Research Fellowship',
    funder: 'University Fellowship Programme',
    amount: '£75,000',
    status: 'Pending',
    period: '2025 - 2027',
    role: 'Principal Investigator',
  },
];

export const PLACEHOLDER_COLLABORATORS: CollaboratorEntry[] = [
  {
    name: 'Prof. Aisha Mentor',
    role: 'Professor of Computational Linguistics',
    institution: 'University of Cambridge',
    researchAreas: ['Syntax', 'Multilingual NLP', 'Parsing'],
    jointPublications: 12,
    yearsActive: '2016 - Present',
  },
  {
    name: 'Dr. Chen Researcher',
    role: 'Senior Research Scientist',
    institution: 'Tech University',
    researchAreas: ['Machine Translation', 'Transfer Learning'],
    jointPublications: 8,
    yearsActive: '2018 - Present',
  },
  {
    name: 'Dr. Dina Linguist',
    role: 'Lecturer in Linguistics',
    institution: 'University of Oxford',
    researchAreas: ['Typology', 'Field Linguistics', 'Endangered Languages'],
    jointPublications: 6,
    yearsActive: '2017 - Present',
  },
  {
    name: 'Dr. Farid Developer',
    role: 'Research Software Engineer',
    institution: 'Institute for Computational Linguistics',
    researchAreas: ['Software Engineering', 'Corpus Tooling'],
    jointPublications: 4,
    yearsActive: '2020 - Present',
  },
];

export const PLACEHOLDER_VERIFICATION_ITEMS: VerificationChecklistItem[] = [
  {
    label: 'Email address verified',
    detail: 'Institutional email confirmed at first registration.',
    status: 'verified',
  },
  {
    label: 'Identity verified',
    detail: 'Government-issued identification reviewed and approved.',
    status: 'verified',
  },
  {
    label: 'Institution affiliation verified',
    detail: 'Affiliation confirmed with the Institute for Computational Linguistics.',
    status: 'verified',
  },
  {
    label: 'ORCID linked',
    detail: 'ORCID iD 0000-0002-1825-0097 is connected and trusted.',
    status: 'verified',
  },
  {
    label: 'Publications verified',
    detail: 'Publication records cross-checked against journal and DOI metadata.',
    status: 'verified',
  },
  {
    label: 'Peer review activity',
    detail: 'Verified peer review contributions across three venues.',
    status: 'pending',
  },
  {
    label: 'Professional endorsements',
    detail: 'Awaiting endorsements from verified collaborators.',
    status: 'not-started',
  },
];

export const PLACEHOLDER_CITATIONS: CitationYearEntry[] = [
  { year: '2019', citations: 34 },
  { year: '2020', citations: 210 },
  { year: '2021', citations: 89 },
  { year: '2022', citations: 120 },
  { year: '2023', citations: 45 },
];

export const PLACEHOLDER_SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Research Methods',
    description: 'Core methodologies used across my research practice.',
    skills: ['Statistical Modeling', 'Corpus Annotation', 'Experimental Design', 'Qualitative Analysis', 'Cross-Lingual Evaluation'],
  },
  {
    category: 'Programming & Tools',
    description: 'Programming languages and tooling for NLP research.',
    skills: ['Python', 'PyTorch', 'NumPy', 'scikit-learn', 'Hugging Face Transformers', 'Git'],
  },
  {
    category: 'Data & Evaluation',
    description: 'Data management, annotation, and evaluation expertise.',
    skills: ['Dataset Curation', 'Inter-Annotator Agreement', 'Benchmarking', 'Error Analysis', 'Reproducible Research'],
  },
  {
    category: 'Languages',
    description: 'Working languages for research and collaboration.',
    skills: ['English', 'French', 'German', 'Swahili'],
  },
  {
    category: 'Professional Skills',
    description: 'Academic and professional competencies.',
    skills: ['Peer Review', 'Mentoring', 'Grant Writing', 'Public Speaking', 'Open Source Collaboration'],
  },
  {
    category: 'Certifications',
    description: 'Professional development and certifications.',
    skills: ['Responsible Research Conduct', 'Research Data Management', 'Open Science Practices'],
  },
];

export const PLACEHOLDER_EDUCATION: EducationEntry[] = [
  {
    institution: 'University of Cambridge',
    degree: 'PhD in Computational Linguistics',
    field: 'Computational Linguistics',
    startDate: '2010',
    endDate: '2013',
    description: 'Dissertation on multilingual syntactic parsing with low-resource language adaptation.',
  },
  {
    institution: 'University of Oxford',
    degree: 'MSc in Linguistics',
    field: 'Linguistics',
    startDate: '2008',
    endDate: '2009',
    description: 'Specialisation in syntax-semantics interface and language typology.',
  },
  {
    institution: 'University of Nairobi',
    degree: 'BA in Linguistics and Computer Science',
    field: 'Linguistics, Computer Science',
    startDate: '2004',
    endDate: '2007',
  },
];

export const PLACEHOLDER_EMPLOYMENT: EmploymentEntry[] = [
  {
    organisation: 'Institute for Computational Linguistics',
    role: 'Senior Researcher',
    startDate: '2015',
    description: 'Leading research on multilingual NLP and low-resource language processing.',
  },
  {
    organisation: 'Tech University',
    role: 'Research Associate',
    startDate: '2013',
    endDate: '2015',
    description: 'Worked on dependency parsing and language resource development.',
  },
  {
    organisation: 'Digital Language Lab',
    role: 'Research Assistant',
    startDate: '2009',
    endDate: '2010',
    description: 'Assisted with corpus construction and annotation projects.',
  },
];

export const PLACEHOLDER_INTERESTS = {
  disciplines: ['Computer Science', 'Linguistics'],
  fieldsOfStudy: ['Computational Linguistics', 'Artificial Intelligence', 'Natural Language Processing'],
  keywords: ['NLP', 'linguistics', 'machine learning', 'corpus linguistics', 'multilingual', 'typology'],
  topics: [
    'Multilingual NLP',
    'Low-Resource Languages',
    'Syntax-Semantics Interface',
    'Dependency Parsing',
    'Transfer Learning',
    'Language Preservation',
    'Typologically Diverse Languages',
    'Cross-Lingual Evaluation',
  ],
};

export const PLACEHOLDER_AFFILIATIONS = {
  current: {
    institution: 'Institute for Computational Linguistics',
    department: 'Computational Linguistics',
    role: 'Senior Researcher',
    since: '2015',
    type: 'Research Institute',
  },
  memberships: [
    { name: 'Association for Computational Linguistics (ACL)', type: 'Professional Association', role: 'Member', since: '2013' },
    { name: 'Linguistic Society of America (LSA)', type: 'Professional Association', role: 'Member', since: '2012' },
    { name: 'Language Preservation Network', type: 'Research Network', role: 'Steering Group Member', since: '2019' },
  ] as AffiliationMembership[],
  institutionHistory: [
    { institution: 'Tech University', role: 'Research Associate', period: '2013 - 2015' },
    { institution: 'University of Cambridge', role: 'Doctoral Researcher', period: '2010 - 2013' },
    { institution: 'Digital Language Lab', role: 'Research Assistant', period: '2009 - 2010' },
  ],
};

export const PLACEHOLDER_ORCID = {
  connected: true,
  orcidId: '0000-0002-1825-0097',
  name: 'Jane Scholar',
  lastSynced: '2 days ago',
  recordUrl: 'https://orcid.org/0000-0002-1825-0097',
  permissions: [
    'Read your ORCID record',
    'Add and update publications',
    'Add and update affiliations',
    'Add and update peer review activities',
  ],
};
