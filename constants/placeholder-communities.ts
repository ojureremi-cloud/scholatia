import type {
  Community,
  CommunityAchievement,
  CommunityAnnouncement,
  CommunityAnswer,
  CommunityBookmark,
  CommunityDiscussion,
  CommunityEvent,
  CommunityFollower,
  CommunityMember,
  CommunityMentorship,
  CommunityOpportunity,
  CommunityPoll,
  CommunityQuestion,
  CommunityReport,
  CommunityResource,
  CommunitySpotlight,
  CommunityTrend,
  CommunityWarning,
} from '@/types/communities';
import type { CommunityAnalytics, CommunityInsight, CommunityPortfolio, CommunityStatistics } from '@/types/communities';
import { COMMUNITY_CATEGORIES, COMMUNITY_VISIBILITIES } from '@/types/communities';
import {
  buildCommunityPortfolio,
  communityAnalytics,
  communityInsights,
  communityStatistics,
  createCommunity,
} from '@/lib/communities';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';

/**
 * Placeholder data for the Scholatia Scholarly Communities Platform (Phase
 * 2.2G.2).
 *
 * The communities graph owns no external records: creators, members, mentors,
 * experts, ambassadors, and followers reference canonical researchers by
 * `username`; resources may reference canonical `doi` and `url` records owned
 * by other modules. Statistics, analytics, insights, the portfolio, and the
 * recommendation set are all derived from the typed community graph by the
 * pure engine in `lib/communities.ts`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-03T12:00:00.000Z');

const DEFAULT_RULES = [
  'Be respectful and constructive in every exchange.',
  'Cite sources and share evidence for claims.',
  'Keep discussions on-topic for the community discipline.',
  'Respect confidentiality of unpublished work.',
  'Report harmful or unsolicited content to moderators.',
];

const DEFAULT_CODE_OF_CONDUCT =
  'Every member of this community is expected to uphold the values of scholarly integrity, mutual respect, and constructive exchange. Harassment, discrimination, and content that undermines the scholarly record are grounds for warnings, temporary suspension, or permanent removal.';

// ---------------------------------------------------------------------------
// Shared canonical references
// ---------------------------------------------------------------------------

function researcherOf(username: string): ResearcherProfile {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  if (!found) {
    throw new Error(`Missing researcher seed: ${username}`);
  }
  return found;
}

const OJURI = researcherOf('ojuri');
const SMITH = researcherOf('smith');
const ADEBAYO = researcherOf('adebayo');
const MARIA = researcherOf('maria');
const JSCHOLAR = researcherOf('jscholar');
const TANAKA = researcherOf('tanaka');
const OKONKWO = researcherOf('okonkwo');
const RIVERS = researcherOf('rivers');
const KIM = researcherOf('kim');
const SCHNEIDER = researcherOf('schneider');
const ADESINA = researcherOf('adesina');
const DAS = researcherOf('das');
const OKAFOR = researcherOf('okafor');
const WANG = researcherOf('wang');
const MBATHA = researcherOf('mbatha');
const KOVACS = researcherOf('kovacs');
const ALMEIDA = researcherOf('almeida');
const HUSSAIN = researcherOf('hussain');
const NDLOVU = researcherOf('ndlovu');
const GALLO = researcherOf('gallo');
const YUSUF = researcherOf('yusuf');

/** A member identified by canonical researcher username. */
function member(username: string, role: CommunityMember['role'], joinedAt = '2025-06-01T09:00:00.000Z'): CommunityMember {
  const profile = researcherOf(username);
  return {
    username: profile.username,
    name: profile.displayName,
    avatar: profile.avatar,
    role,
    status: 'active',
    joinedAt,
  };
}

function follower(username: string, followedAt = '2025-09-01T09:00:00.000Z'): CommunityFollower {
  const profile = researcherOf(username);
  return {
    username: profile.username,
    name: profile.displayName,
    avatar: profile.avatar,
    followedAt,
  };
}

function daysAgo(days: number, hour = 10): string {
  const date = new Date(NOW);
  date.setDate(date.getDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

function daysAhead(days: number, hour = 14): string {
  const date = new Date(NOW);
  date.setDate(date.getDate() + days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

/** Collection builders. `communityId` is stamped by `createCommunity`. */
function annc(
  id: string,
  title: string,
  body: string,
  author: string,
  createdAt = daysAgo(3),
  pinned = false,
): CommunityAnnouncement {
  return {
    id,
    communityId: '',
    title,
    body,
    author,
    authorName: researcherOf(author).displayName,
    pinned,
    createdAt,
  };
}

function disc(
  id: string,
  title: string,
  body: string,
  author: string,
  replies: { author: string; body: string; createdAt: string; parentId?: string }[],
  createdAt = daysAgo(6),
  pinned = false,
  status: CommunityDiscussion['status'] = 'open',
): CommunityDiscussion {
  return {
    id,
    communityId: '',
    title,
    body,
    author,
    authorName: researcherOf(author).displayName,
    status,
    pinned,
    reportCount: 0,
    replies: replies.map((reply, index) => ({
      id: `${id}-reply-${index + 1}`,
      discussionId: id,
      parentId: reply.parentId,
      author: reply.author,
      authorName: researcherOf(reply.author).displayName,
      body: reply.body,
      createdAt: reply.createdAt,
    })),
    createdAt,
    updatedAt: replies[replies.length - 1]?.createdAt ?? createdAt,
  };
}

function ques(
  id: string,
  title: string,
  body: string,
  author: string,
  answers: { author: string; body: string; createdAt: string; upvotes?: number }[],
  tags: string[],
  createdAt = daysAgo(5),
  status: CommunityQuestion['status'] = 'open',
): CommunityQuestion {
  return {
    id,
    communityId: '',
    title,
    body,
    author,
    authorName: researcherOf(author).displayName,
    tags,
    status,
    answers: answers.map((answer, index) => ({
      id: `${id}-answer-${index + 1}`,
      questionId: id,
      author: answer.author,
      authorName: researcherOf(answer.author).displayName,
      body: answer.body,
      upvotes: answer.upvotes ?? 0,
      createdAt: answer.createdAt,
    })) as CommunityAnswer[],
    createdAt,
  };
}

function res(
  id: string,
  title: string,
  type: CommunityResource['type'],
  contributor: string,
  addedAt = daysAgo(20),
  url?: string,
  doi?: string,
): CommunityResource {
  return { id, communityId: '', title, type, contributor, addedAt, url, doi };
}

function evt(
  id: string,
  title: string,
  type: CommunityEvent['type'],
  mode: CommunityEvent['mode'],
  scheduledAt: string,
  speakers: string[],
  status: CommunityEvent['status'],
  description?: string,
): CommunityEvent {
  return { id, communityId: '', title, type, mode, scheduledAt, speakers, status, description };
}

function poll(
  id: string,
  question: string,
  options: string[],
  author: string,
  createdAt = daysAgo(4),
  status: CommunityPoll['status'] = 'open',
  votes: Record<string, number> = {},
): CommunityPoll {
  return {
    id,
    communityId: '',
    question,
    options,
    votes,
    author,
    authorName: researcherOf(author).displayName,
    status,
    createdAt,
  };
}

function ment(
  id: string,
  mentor: string,
  mentee: string,
  area: string,
  status: CommunityMentorship['status'],
  startedAt = daysAgo(30),
): CommunityMentorship {
  return {
    id,
    communityId: '',
    mentor,
    mentorName: researcherOf(mentor).displayName,
    mentee,
    menteeName: researcherOf(mentee).displayName,
    area,
    status,
    startedAt,
  };
}

function opp(
  id: string,
  title: string,
  kind: CommunityOpportunity['kind'],
  postedBy: string,
  postedAt = daysAgo(4),
  deadline = daysAhead(30),
  description?: string,
): CommunityOpportunity {
  return { id, communityId: '', title, kind, postedBy, postedAt, deadline, description };
}

function spot(
  id: string,
  username: string,
  title: string,
  body: string,
  author: string,
  publishedAt = daysAgo(10),
): CommunitySpotlight {
  const profile = researcherOf(username);
  return {
    id,
    communityId: '',
    username,
    name: profile.displayName,
    title,
    body,
    author,
    publishedAt,
  };
}

function ach(
  id: string,
  title: string,
  icon: string,
  description: string,
  awardedTo: string,
  awardedAt = daysAgo(8),
): CommunityAchievement {
  return { id, communityId: '', title, icon, description, awardedTo, awardedAt };
}

function bm(id: string, username: string, discussionId: string, savedAt = daysAgo(2)): CommunityBookmark {
  return { id, communityId: '', username, discussionId, savedAt };
}

function trend(id: string, label: string, score: number, period: CommunityTrend['period'] = 'week'): CommunityTrend {
  return { id, communityId: '', label, score, period };
}

function rept(
  id: string,
  targetKind: CommunityReport['targetKind'],
  targetId: string,
  targetTitle: string,
  reporter: string,
  reason: string,
  status: CommunityReport['status'] = 'open',
  createdAt = daysAgo(3),
): CommunityReport {
  return { id, communityId: '', targetKind, targetId, targetTitle, reporter, reason, status, createdAt };
}

// ---------------------------------------------------------------------------
// Community 1 — Open Science Community
// ---------------------------------------------------------------------------

const OPEN_SCIENCE_COMMUNITY: Community = createCommunity({
  id: 'com-open-science',
  name: 'Open Science Community',
  description:
    'A global open knowledge ecosystem advancing open access, open data, open code, and reproducible research practice across every discipline.',
  category: 'open-science',
  discipline: 'Open Science',
  researchAreas: ['Open Access', 'Open Data', 'Open Code', 'Reproducibility', 'Research Infrastructure'],
  keywords: ['open-science', 'open-access', 'reproducibility', 'preprints'],
  language: 'English',
  country: 'Global',
  region: 'Global',
  visibility: 'public',
  creator: 'jscholar',
  creatorName: JSCHOLAR.displayName,
  verificationStatus: 'Trusted',
  website: 'https://scholatia.org/communities/open-science',
  socialLinks: { twitter: 'https://twitter.com/openscience', github: 'https://github.com/openscience' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('ojuri', 'administrator', '2023-11-01T09:00:00.000Z'), member('ndlovu', 'administrator', '2023-12-01T09:00:00.000Z')],
  moderators: [member('maria', 'moderator', '2024-01-01T09:00:00.000Z'), member('das', 'moderator', '2024-02-01T09:00:00.000Z')],
  members: [
    member('smith', 'contributor', '2024-03-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-04-01T09:00:00.000Z'),
    member('almeida', 'member', '2024-05-01T09:00:00.000Z'),
    member('mbatha', 'member', '2024-06-01T09:00:00.000Z'),
    member('yusuf', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('jscholar', 'contributor', '2024-01-01T09:00:00.000Z'), member('ojuri', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('das', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [
    follower('tanaka', '2025-02-01T09:00:00.000Z'),
    follower('rivers', '2025-02-10T09:00:00.000Z'),
    follower('schneider', '2025-03-01T09:00:00.000Z'),
    follower('hussain', '2025-03-15T09:00:00.000Z'),
    follower('okafor', '2025-04-01T09:00:00.000Z'),
    follower('kovacs', '2025-04-20T09:00:00.000Z'),
  ],
  announcements: [
    annc('com-os-annc-1', 'Preprint-first policy endorsed', 'The community formally endorses a preprint-first publication policy with discipline-aware norms.', 'jscholar', daysAgo(5), true),
    annc('com-os-annc-2', 'Reproducibility sprint results', 'The 2026 reproducibility sprint validated 47 field research pipelines.', 'ndlovu', daysAgo(18)),
  ],
  discussions: [
    disc('com-os-disc-1', 'Preprint-first policy drafting', 'Should the network endorse a preprint-first publication policy across disciplines?', 'jscholar', [
      { author: 'ojuri', body: 'Yes — with emphasis on community norms per discipline and embargo windows where required.', createdAt: daysAgo(2) },
      { author: 'das', body: 'Agree. Incentivise rapid posting with reviewer credit where journal policy allows.', createdAt: daysAgo(1), parentId: 'com-os-disc-1-reply-1' },
      { author: 'smith', body: 'Support, but keep a registry of journal-specific embargo rules.', createdAt: daysAgo(1) },
    ], daysAgo(9), true),
    disc('com-os-disc-2', 'Open licence selection for datasets', 'Which licence should the community recommend for field-collected datasets?', 'das', [
      { author: 'mbatha', body: 'CC-BY for reuse with community attribution; consider ShareAlike for derivative corpora.', createdAt: daysAgo(4) },
    ]),
  ],
  questions: [
    ques('com-os-ques-1', 'How do I register a pre-registration for a qualitative study?', 'The OSF templates focus on quantitative designs — what do qualitative researchers use?', 'gallo', [
      { author: 'jscholar', body: 'Use the qualitative pre-registration template from OSF and document the analysis plan iteratively.', createdAt: daysAgo(3), upvotes: 5 },
    ], ['preregistration', 'qualitative'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-os-res-1', 'Open licencing decision tree', 'teaching-material', 'jscholar', daysAgo(15)),
    res('com-os-res-2', 'Registry of open data repositories', 'repository', 'das', daysAgo(44), 'https://scholatia.org/repositories'),
    res('com-os-res-3', 'Reproducibility checklists for field research', 'protocol', 'ndlovu', daysAgo(26)),
  ],
  events: [
    evt('com-os-evt-1', 'Open Science Town Hall', 'webinar', 'online', daysAhead(14, 15), ['jscholar', 'ojuri'], 'scheduled', 'Quarterly town hall on open science policy and practice.'),
    evt('com-os-evt-2', 'Reproducibility Sprint', 'workshop', 'hybrid', daysAgo(26, 10), ['ndlovu', 'maria'], 'completed'),
  ],
  polls: [poll('com-os-poll-1', 'Should preprints count toward promotion in your discipline?', ['Yes, fully', 'Partially', 'No'], 'jscholar', daysAgo(7), 'open', { 'Yes, fully': 41, Partially: 22, No: 7 })],
  mentorships: [ment('com-os-ment-1', 'jscholar', 'gallo', 'Open research practice', 'active')],
  opportunities: [opp('com-os-opp-1', 'Open science ambassador programme', 'volunteer', 'ojuri', daysAgo(5), daysAhead(21), 'Represent open science at national research councils.')],
  spotlights: [spot('com-os-spot-1', 'das', 'Building the reproducibility infrastructure', 'Priya Das has driven the community dataset validation pipeline since 2025.', 'jscholar')],
  achievements: [ach('com-os-ach-1', '100 validated pipelines', '🧪', 'The community validated its 100th reproducible research pipeline.', 'das')],
  bookmarks: [bm('com-os-bm-1', 'ojuri', 'com-os-disc-1')],
  trends: [trend('com-os-trend-1', 'Preprint-first', 92), trend('com-os-trend-2', 'Open data', 78), trend('com-os-trend-3', 'Licences', 55, 'day')],
  reports: [],
  warnings: [],
  createdAt: '2023-10-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 2 — African NLP Research Community
// ---------------------------------------------------------------------------

const AFRICAN_NLP_RESEARCH_COMMUNITY: Community = createCommunity({
  id: 'com-african-nlp-research',
  name: 'African NLP Research Community',
  description:
    'An open research community building corpora, models, and benchmarks for the languages of Africa, with a focus on data sovereignty and community partnerships.',
  category: 'research',
  discipline: 'Artificial Intelligence',
  researchAreas: ['African Language Technology', 'Low-Resource NLP', 'Machine Translation', 'Speech Recognition', 'Data Sovereignty'],
  keywords: ['african-languages', 'nlp', 'corpora', 'yoruba', 'speech'],
  language: 'English',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'public',
  creator: 'okonkwo',
  creatorName: OKONKWO.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/african-nlp-research',
  socialLinks: { twitter: 'https://twitter.com/afrinlp', github: 'https://github.com/afrinlp' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('jscholar', 'administrator', '2024-02-01T09:00:00.000Z'), member('ndlovu', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-04-01T09:00:00.000Z'), member('mbatha', 'moderator', '2024-05-01T09:00:00.000Z')],
  members: [
    member('ojuri', 'member', '2024-06-01T09:00:00.000Z'),
    member('almeida', 'contributor', '2024-07-01T09:00:00.000Z'),
    member('tanaka', 'member', '2025-01-10T09:00:00.000Z'),
    member('dube', 'member', '2025-02-10T09:00:00.000Z'),
  ],
  mentors: [member('okonkwo', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('jscholar', 'member', '2024-01-02T09:00:00.000Z'), member('gallo', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('wang', '2025-03-01T09:00:00.000Z'), follower('hussain', '2025-03-20T09:00:00.000Z'), follower('yusuf', '2025-04-05T09:00:00.000Z')],
  announcements: [
    annc('com-anlp-annc-1', 'Forum call for papers open', 'Submissions are open for the 2026 African Language Technology Forum.', 'okonkwo', daysAgo(12), true),
    annc('com-anlp-annc-2', 'Corpus annotation sprint completed', 'The Yoruba and Swahili corpora grew by 40% in the latest sprint.', 'ndlovu', daysAgo(9)),
  ],
  discussions: [
    disc('com-anlp-disc-1', 'Dialectal coverage strategy', 'How should the community prioritise dialectal variants in corpora collection?', 'okonkwo', [
      { author: 'mbatha', body: 'Start with the largest speech communities per region, then close dialectal gaps.', createdAt: daysAgo(4) },
      { author: 'gallo', body: 'Weigh coverage by speaker population AND documentation risk.', createdAt: daysAgo(3), parentId: 'com-anlp-disc-1-reply-1' },
    ], daysAgo(8), true),
    disc('com-anlp-disc-2', 'Data sovereignty licensing', 'How do community consent agreements interact with open licences?', 'ndlovu', [
      { author: 'ojuri', body: 'Keep consent metadata separate from the licence and always gate access.', createdAt: daysAgo(2) },
    ]),
  ],
  questions: [
    ques('com-anlp-ques-1', 'Benchmarks for under-resourced languages', 'What evaluation protocols should we standardise for languages without test sets?', 'gallo', [
      { author: 'okonkwo', body: 'Adopt zero-shot transfer baselines plus a held-out community-reviewed test set.', createdAt: daysAgo(4), upvotes: 8 },
    ], ['benchmarks', 'evaluation'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-anlp-res-1', 'Annotated African corpora index', 'dataset', 'okonkwo', daysAgo(40)),
    res('com-anlp-res-2', 'Community annotation guidelines', 'protocol', 'gallo', daysAgo(70)),
    res('com-anlp-res-3', 'Low-resource language toolkit', 'software', 'jscholar', daysAgo(60), 'https://github.com/afrinlp/toolkit'),
  ],
  events: [
    evt('com-anlp-evt-1', 'African Language Technology Forum 2026', 'conference', 'hybrid', daysAhead(18, 9), ['okonkwo', 'jscholar', 'gallo'], 'scheduled', 'Annual gathering of the African language technology community.'),
    evt('com-anlp-evt-2', 'Corpus annotation sprint', 'workshop', 'online', daysAgo(6, 11), ['okonkwo', 'ndlovu'], 'completed'),
  ],
  polls: [poll('com-anlp-poll-1', 'Which 5 languages should the next corpus drive focus on?', ['Yoruba', 'Swahili', 'Hausa', 'Amharic', 'Wolof'], 'okonkwo', daysAgo(6), 'open', { Yoruba: 33, Swahili: 28, Hausa: 21, Amharic: 11, Wolof: 7 })],
  mentorships: [ment('com-anlp-ment-1', 'okonkwo', 'dube', 'Low-resource machine translation', 'active')],
  opportunities: [opp('com-anlp-opp-1', 'Shared task on low-resource parsing', 'research-call', 'jscholar', daysAgo(8), daysAhead(45), 'Co-organised shared task for 2027.')],
  spotlights: [spot('com-anlp-spot-1', 'okonkwo', 'Championing African language technology', 'Dr. Nneka Okonkwo leads corpus initiatives across three language families.', 'jscholar')],
  achievements: [ach('com-anlp-ach-1', '1M annotated tokens', '📝', 'The community corpus crossed one million annotated tokens.', 'gallo')],
  bookmarks: [bm('com-anlp-bm-1', 'ojuri', 'com-anlp-disc-2')],
  trends: [trend('com-anlp-trend-1', 'Data sovereignty', 88), trend('com-anlp-trend-2', 'Yoruba corpora', 74)],
  reports: [rept('com-anlp-rep-1', 'discussion', 'com-anlp-disc-2', 'Data sovereignty licensing', 'yusuf', 'Proposed licensing text needs clarification.', 'reviewed')],
  warnings: [],
  createdAt: '2024-01-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 3 — Early Career Researchers Network
// ---------------------------------------------------------------------------

const EARLY_CAREER_RESEARCHERS_NETWORK: Community = createCommunity({
  id: 'com-early-career-researchers',
  name: 'Early Career Researchers Network',
  description:
    'A global support ecosystem for doctoral candidates, postdocs, and new faculty — mentoring, grant coaching, publishing strategy, and peer review of career moves.',
  category: 'early-career',
  discipline: 'Career Development',
  researchAreas: ['Mentoring', 'Grant Writing', 'Career Development', 'Publishing Strategy', 'Work–Life Integration'],
  keywords: ['ecr', 'phd', 'postdoc', 'mentoring', 'grants'],
  language: 'English',
  country: 'Global',
  region: 'Global',
  visibility: 'public',
  creator: 'ojuri',
  creatorName: OJURI.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/early-career-researchers',
  socialLinks: { twitter: 'https://twitter.com/ecrnetwork', linkedin: 'https://linkedin.com/company/ecrn' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('okafor', 'administrator', '2024-02-01T09:00:00.000Z'), member('hussain', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2024-04-01T09:00:00.000Z'), member('kovacs', 'moderator', '2024-05-01T09:00:00.000Z')],
  members: [
    member('yusuf', 'member', '2024-06-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-07-01T09:00:00.000Z'),
    member('dube', 'contributor', '2024-08-01T09:00:00.000Z'),
    member('almeida', 'member', '2024-09-01T09:00:00.000Z'),
  ],
  mentors: [member('ojuri', 'member', '2024-01-01T09:00:00.000Z'), member('maria', 'member', '2024-01-02T09:00:00.000Z'), member('smith', 'member', '2024-01-03T09:00:00.000Z')],
  experts: [member('ndlovu', 'member', '2024-01-04T09:00:00.000Z')],
  ambassadors: [member('okafor', 'member', '2024-01-05T09:00:00.000Z')],
  followers: [follower('tanaka', '2025-01-01T09:00:00.000Z'), follower('wang', '2025-01-10T09:00:00.000Z'), follower('schneider', '2025-02-01T09:00:00.000Z'), follower('rivers', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-ecr-annc-1', 'Mentoring round open', 'Applications for the autumn mentoring round are open until the end of the month.', 'ojuri', daysAgo(4), true),
    annc('com-ecr-annc-2', 'Grant clinic recordings', 'Recordings of the grant writing clinic are available in the resources library.', 'okafor', daysAgo(11)),
  ],
  discussions: [
    disc('com-ecr-disc-1', 'First-author strategy as a postdoc', 'How should a postdoc negotiate first-authorship on a collaborative project?', 'okafor', [
      { author: 'ojuri', body: 'Document contribution agreements in writing at project kickoff.', createdAt: daysAgo(2) },
      { author: 'smith', body: 'Use the CRediT taxonomy to make contributions explicit.', createdAt: daysAgo(1), parentId: 'com-ecr-disc-1-reply-1' },
    ], daysAgo(7), true),
    disc('com-ecr-disc-2', 'Choosing between two postdoc offers', 'What factors beyond salary should drive the decision between two postdoc offers?', 'hussain', [
      { author: 'kovacs', body: 'Weigh mentorship quality and publication pipeline over headline package.', createdAt: daysAgo(3) },
    ]),
  ],
  questions: [
    ques('com-ecr-ques-1', 'How do I request my supervisor for co-authorship?', 'I contributed analysis but my supervisor lists me as an acknowledgement.', 'dube', [
      { author: 'mbatha', body: 'Reference the journal authorship policy and bring evidence of your contribution.', createdAt: daysAgo(2), upvotes: 12 },
    ], ['authorship', 'supervisor'], daysAgo(5), 'answered'),
  ],
  resources: [
    res('com-ecr-res-1', 'Grant writing clinic recordings', 'teaching-material', 'okafor', daysAgo(12)),
    res('com-ecr-res-2', 'Postdoc negotiation checklist', 'protocol', 'ojuri', daysAgo(20)),
  ],
  events: [
    evt('com-ecr-evt-1', 'Monthly career drop-in', 'webinar', 'online', daysAhead(6, 16), ['ojuri', 'okafor'], 'scheduled', 'Open Q&A on career moves.'),
    evt('com-ecr-evt-2', 'Grant writing clinic', 'workshop', 'hybrid', daysAgo(29, 10), ['ojuri', 'yusuf'], 'completed'),
  ],
  polls: [poll('com-ecr-poll-1', 'What is your biggest career blocker right now?', ['Funding', 'Publications', 'Work–life balance', 'Supervision'], 'okafor', daysAgo(5), 'open', { Funding: 38, Publications: 27, 'Work–life balance': 20, Supervision: 15 })],
  mentorships: [ment('com-ecr-ment-1', 'ojuri', 'yusuf', 'Research leadership', 'active'), ment('com-ecr-ment-2', 'maria', 'gallo', 'Navigating field research', 'active')],
  opportunities: [opp('com-ecr-opp-1', 'ECR travel fellowship', 'funding-call', 'ojuri', daysAgo(6), daysAhead(40), 'Travel support for early-career presenters.')],
  spotlights: [spot('com-ecr-spot-1', 'yusuf', 'From clinic to flagship grant', 'Folake Yusuf secured her first national grant after the community clinic.', 'okafor')],
  achievements: [ach('com-ecr-ach-1', '500 mentorships matched', '🤝', 'The network matched its 500th mentoring pair.', 'ojuri')],
  bookmarks: [bm('com-ecr-bm-1', 'dube', 'com-ecr-disc-1')],
  trends: [trend('com-ecr-trend-1', 'Postdoc offers', 81), trend('com-ecr-trend-2', 'Authorship', 69)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 4 — Women in Science & Research
// ---------------------------------------------------------------------------

const WOMEN_IN_SCIENCE_RESEARCH: Community = createCommunity({
  id: 'com-women-in-research',
  name: 'Women in Science & Research',
  description:
    'A global community championing women in STEM and the social sciences — visibility, leadership pipelines, mentoring circles, and systemic change.',
  category: 'women-in-research',
  discipline: 'Multidisciplinary',
  researchAreas: ['Leadership', 'Mentoring Circles', 'Gender Equity', 'Scientific Visibility', 'Career Progression'],
  keywords: ['women-in-stem', 'leadership', 'mentoring', 'equity'],
  language: 'English',
  country: 'Global',
  region: 'Global',
  visibility: 'public',
  creator: 'maria',
  creatorName: MARIA.displayName,
  verificationStatus: 'Trusted',
  website: 'https://scholatia.org/communities/women-in-research',
  socialLinks: { twitter: 'https://twitter.com/wirs', linkedin: 'https://linkedin.com/company/wirs' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('rivers', 'administrator', '2024-02-01T09:00:00.000Z'), member('kim', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('adebayo', 'member', '2024-05-01T09:00:00.000Z'),
    member('mbatha', 'contributor', '2024-06-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-07-01T09:00:00.000Z'),
    member('yusuf', 'member', '2024-08-01T09:00:00.000Z'),
  ],
  mentors: [member('maria', 'member', '2024-01-01T09:00:00.000Z'), member('rivers', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('kim', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('gallo', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('schneider', '2025-02-01T09:00:00.000Z'), follower('tanaka', '2025-02-20T09:00:00.000Z'), follower('okafor', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-wir-annc-1', 'Leadership cohort applications', 'The senior leadership mentoring cohort is now accepting applications.', 'maria', daysAgo(5), true),
  ],
  discussions: [
    disc('com-wir-disc-1', 'Addressing bias in review panels', 'How do we make panel shortlisting more equitable in practice?', 'rivers', [
      { author: 'maria', body: 'Use anonymised shortlisting and structured evaluation rubrics.', createdAt: daysAgo(3) },
      { author: 'kim', body: 'Mandate two-stage scoring before any discussion.', createdAt: daysAgo(2), parentId: 'com-wir-disc-1-reply-1' },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-wir-ques-1', 'Negotiating start-up packages', 'What resources help negotiate a competitive start-up package?', 'hussain', [
      { author: 'maria', body: 'Benchmark against peer institutions and itemise every need before the offer.', createdAt: daysAgo(4), upvotes: 9 },
    ], ['negotiation'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-wir-res-1', 'Equitable review rubric', 'research-tool', 'rivers', daysAgo(14)),
    res('com-wir-res-2', 'Leadership reading list', 'book', 'kim', daysAgo(30)),
  ],
  events: [
    evt('com-wir-evt-1', 'Mentoring circle kickoff', 'meetup', 'online', daysAhead(9, 15), ['maria', 'rivers'], 'scheduled'),
    evt('com-wir-evt-2', 'Visibility workshop', 'workshop', 'hybrid', daysAgo(21, 12), ['kim'], 'completed'),
  ],
  polls: [poll('com-wir-poll-1', 'Which initiative should lead next?', ['Panel equity toolkit', 'Speaker database', 'Leadership academy'], 'maria', daysAgo(6), 'open', { 'Panel equity toolkit': 35, 'Speaker database': 30, 'Leadership academy': 35 })],
  mentorships: [ment('com-wir-ment-1', 'maria', 'gallo', 'Research leadership', 'active')],
  opportunities: [opp('com-wir-opp-1', 'Speaker database nominations', 'volunteer', 'kim', daysAgo(3), daysAhead(15), 'Nominate women experts for conference panels.')],
  spotlights: [spot('com-wir-spot-1', 'kim', 'Leading materials research in Asia', 'Prof. Min-jun Kim became the youngest department head in the materials school.', 'maria')],
  achievements: [ach('com-wir-ach-1', '200 speakers amplified', '🎤', 'The community amplified 200 women speakers across conferences.', 'gallo')],
  bookmarks: [],
  trends: [trend('com-wir-trend-1', 'Panel equity', 84), trend('com-wir-trend-2', 'Negotiation', 66)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-05T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 5 — Global AI Researchers Community
// ---------------------------------------------------------------------------

const GLOBAL_AI_RESEARCHERS_COMMUNITY: Community = createCommunity({
  id: 'com-global-ai-researchers',
  name: 'Global AI Researchers Community',
  description:
    'An open ecosystem for AI researchers — foundations, responsible AI, applications, and evaluation — spanning academia and industry.',
  category: 'ai',
  discipline: 'Artificial Intelligence',
  researchAreas: ['Machine Learning', 'Responsible AI', 'LLMs', 'AI Safety', 'Evaluation', 'Applications'],
  keywords: ['ai', 'ml', 'llm', 'responsible-ai', 'evaluation'],
  language: 'English',
  country: 'Global',
  region: 'Global',
  visibility: 'public',
  creator: 'schneider',
  creatorName: SCHNEIDER.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/global-ai-researchers',
  socialLinks: { twitter: 'https://twitter.com/airesearch', github: 'https://github.com/airesearch' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('okonkwo', 'administrator', '2024-02-01T09:00:00.000Z'), member('das', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('wang', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('tanaka', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('jscholar', 'member', '2024-06-01T09:00:00.000Z'),
    member('adebayo', 'member', '2024-07-01T09:00:00.000Z'),
    member('dube', 'member', '2024-08-01T09:00:00.000Z'),
  ],
  mentors: [member('schneider', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('das', 'member', '2024-01-02T09:00:00.000Z'), member('okonkwo', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('adebayo', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('hussain', '2025-01-01T09:00:00.000Z'), follower('rivers', '2025-02-01T09:00:00.000Z'), follower('mbatha', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-ai-annc-1', 'Evaluation benchmark release', 'The community released an open evaluation harness for foundation models.', 'das', daysAgo(6), true),
  ],
  discussions: [
    disc('com-ai-disc-1', 'Benchmark contamination', 'How should the community handle training-set contamination in leaderboards?', 'schneider', [
      { author: 'das', body: 'Ship private held-out sets with release-time frozen answers.', createdAt: daysAgo(3) },
      { author: 'okonkwo', body: 'Publish contamination probes per model family.', createdAt: daysAgo(2), parentId: 'com-ai-disc-1-reply-1' },
    ], daysAgo(8), true),
    disc('com-ai-disc-2', 'Compute sharing consortium', 'Could members pool GPU allocations for community benchmarks?', 'tanaka', [
      { author: 'wang', body: 'A federated schedule would make scarce allocations go further.', createdAt: daysAgo(1) },
    ]),
  ],
  questions: [
    ques('com-ai-ques-1', 'Choosing a base model for low-resource languages', 'Which open-weight model handles African languages best out of the box?', 'okonkwo', [
      { author: 'schneider', body: 'Compare on your own dev set — our community harness reports per-family scores.', createdAt: daysAgo(5), upvotes: 10 },
    ], ['llm', 'low-resource'], daysAgo(9), 'answered'),
  ],
  resources: [
    res('com-ai-res-1', 'Open evaluation harness', 'software', 'das', daysAgo(7), 'https://github.com/airesearch/harness'),
    res('com-ai-res-2', 'Responsible AI guidelines', 'protocol', 'schneider', daysAgo(22)),
  ],
  events: [
    evt('com-ai-evt-1', 'Foundations journal club', 'journal-club', 'online', daysAhead(4, 17), ['schneider', 'das'], 'scheduled'),
    evt('com-ai-evt-2', 'Responsible AI seminar', 'seminar', 'hybrid', daysAgo(14, 15), ['okonkwo'], 'completed'),
  ],
  polls: [poll('com-ai-poll-1', 'Where should evaluation standards lead next?', ['Safety', 'Multilinguality', 'Agents', 'Cost'], 'das', daysAgo(4), 'open', { Safety: 40, Multilinguality: 25, Agents: 20, Cost: 15 })],
  mentorships: [ment('com-ai-ment-1', 'schneider', 'dube', 'Responsible AI evaluation', 'active')],
  opportunities: [opp('com-ai-opp-1', 'Shared benchmark contribution call', 'research-call', 'das', daysAgo(5), daysAhead(60), 'Contribute tasks to the open evaluation suite.')],
  spotlights: [spot('com-ai-spot-1', 'das', 'Building honest benchmarks', 'Priya Das released the community evaluation harness used across 90 labs.', 'schneider')],
  achievements: [ach('com-ai-ach-1', '90 labs onboarded', '🧪', 'The evaluation harness is used by 90 research labs worldwide.', 'das')],
  bookmarks: [bm('com-ai-bm-1', 'jscholar', 'com-ai-disc-1')],
  trends: [trend('com-ai-trend-1', 'Evaluation', 95), trend('com-ai-trend-2', 'Contamination', 72), trend('com-ai-trend-3', 'Compute', 61, 'day')],
  reports: [],
  warnings: [],
  createdAt: '2024-01-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 6 — Public Health Research Community
// ---------------------------------------------------------------------------

const PUBLIC_HEALTH_RESEARCH_COMMUNITY: Community = createCommunity({
  id: 'com-public-health-research',
  name: 'Public Health Research Community',
  description:
    'An open research community for public health — epidemiology, health systems, disease surveillance, and community-based interventions.',
  category: 'health-sciences',
  discipline: 'Public Health',
  researchAreas: ['Epidemiology', 'Health Systems', 'Disease Surveillance', 'Maternal Health', 'Health Equity'],
  keywords: ['public-health', 'epidemiology', 'surveillance', 'health-systems'],
  language: 'English',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'public',
  creator: 'ojuri',
  creatorName: OJURI.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/public-health-research',
  socialLinks: { twitter: 'https://twitter.com/phrc', orcid: 'https://orcid.org/0000-0001-0000-0000' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('okonkwo', 'administrator', '2024-03-01T09:00:00.000Z'), member('dube', 'administrator', '2024-04-01T09:00:00.000Z')],
  moderators: [member('adesina', 'moderator', '2024-05-01T09:00:00.000Z'), member('yusuf', 'moderator', '2024-06-01T09:00:00.000Z')],
  members: [
    member('mbatha', 'contributor', '2024-07-01T09:00:00.000Z'),
    member('maria', 'member', '2025-01-15T09:00:00.000Z'),
    member('hussain', 'member', '2025-02-10T09:00:00.000Z'),
  ],
  mentors: [member('ojuri', 'member', '2024-01-01T09:00:00.000Z'), member('dube', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('adesina', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('schneider', '2025-03-01T09:00:00.000Z'), follower('tanaka', '2025-03-10T09:00:00.000Z'), follower('rivers', '2025-04-01T09:00:00.000Z')],
  announcements: [
    annc('com-phr-annc-1', 'Surveillance methods journal club', 'The journal club on surveillance methods convenes Thursday.', 'ojuri', daysAgo(2), true),
  ],
  discussions: [
    disc('com-phr-disc-1', 'Sampling for rural clinics', 'How should we stratify samples across rural and peri-urban clinics?', 'ojuri', [
      { author: 'okonkwo', body: 'Stratify by catchment population and oversample the smallest sites.', createdAt: daysAgo(5) },
      { author: 'mbatha', body: 'The protocol annex supports weighting; I can draft the weights.', createdAt: daysAgo(4), parentId: 'com-phr-disc-1-reply-1' },
    ], daysAgo(8), true),
    disc('com-phr-disc-2', 'Disclosure thresholds for dashboards', 'How should district dashboards handle small-count disclosure?', 'yusuf', [
      { author: 'ojuri', body: 'Adopt cell suppression below the disclosure threshold.', createdAt: daysAgo(2) },
    ]),
  ],
  questions: [
    ques('com-phr-ques-1', 'Instrument for community health worker supervision', 'Which validated instrument fits district-level supervision assessment?', 'hussain', [
      { author: 'dube', body: 'The WHO supervision toolkit is the lightest validated option for our scale.', createdAt: daysAgo(3), upvotes: 7 },
    ], ['supervision', 'instruments'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-phr-res-1', 'Surveillance protocol v3', 'protocol', 'ojuri', daysAgo(10)),
    res('com-phr-res-2', 'District health open dataset', 'dataset', 'okonkwo', daysAgo(30)),
  ],
  events: [
    evt('com-phr-evt-1', 'Quarterly consortium sync', 'meetup', 'hybrid', daysAhead(5, 15), ['ojuri', 'okonkwo'], 'scheduled'),
    evt('com-phr-evt-2', 'Community engagement workshop', 'workshop', 'in-person', daysAgo(12, 13), ['ojuri', 'adesina'], 'completed'),
  ],
  polls: [poll('com-phr-poll-1', 'Priority for the next evidence synthesis?', ['Malaria elimination', 'Maternal health', 'Digital surveillance'], 'ojuri', daysAgo(6), 'open', { 'Malaria elimination': 45, 'Maternal health': 30, 'Digital surveillance': 25 })],
  mentorships: [ment('com-phr-ment-1', 'ojuri', 'yusuf', 'Surveillance methods', 'active')],
  opportunities: [opp('com-phr-opp-1', 'Malaria elimination special issue', 'research-call', 'ojuri', daysAgo(7), daysAhead(35), 'Contributions invited for a special series.')],
  spotlights: [spot('com-phr-spot-1', 'yusuf', 'Antibiotic stewardship in the field', 'Folake Yusuf led a regional stewardship campaign reaching 900 community members.', 'ojuri')],
  achievements: [ach('com-phr-ach-1', 'Regional atlas published', '🗺️', 'The community published the regional disease atlas.', 'ojuri')],
  bookmarks: [],
  trends: [trend('com-phr-trend-1', 'Surveillance', 86), trend('com-phr-trend-2', 'Malaria', 77)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 7 — Climate Change Researchers Community
// ---------------------------------------------------------------------------

const CLIMATE_CHANGE_RESEARCHERS_COMMUNITY: Community = createCommunity({
  id: 'com-climate-change-researchers',
  name: 'Climate Change Researchers Community',
  description:
    'An interdisciplinary community studying climate impacts, adaptation pathways, and resilience in coastal, agricultural, and urban systems.',
  category: 'sustainability',
  discipline: 'Climate Science',
  researchAreas: ['Climate Adaptation', 'Coastal Resilience', 'Climate Risk', 'Sustainable Agriculture', 'Urban Climate'],
  keywords: ['climate', 'adaptation', 'resilience', 'risk'],
  language: 'English',
  country: 'United States',
  region: 'Global',
  visibility: 'public',
  creator: 'rivers',
  creatorName: RIVERS.displayName,
  verificationStatus: 'Trusted',
  website: 'https://scholatia.org/communities/climate-change-researchers',
  socialLinks: { twitter: 'https://twitter.com/climateresearch', linkedin: 'https://linkedin.com/company/crc' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('almeida', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('kim', 'moderator', '2024-03-01T09:00:00.000Z'), member('hussain', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('adesina', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('dube', 'member', '2024-06-01T09:00:00.000Z'),
    member('tanaka', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('rivers', 'member', '2024-01-01T09:00:00.000Z'), member('almeida', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('kim', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('hussain', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('schneider', '2025-01-01T09:00:00.000Z'), follower('mbatha', '2025-02-01T09:00:00.000Z'), follower('gallo', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-cli-annc-1', 'Adaptation futures symposium', 'The symposium programme is now public.', 'rivers', daysAgo(11), true),
  ],
  discussions: [
    disc('com-cli-disc-1', 'Scenario harmonisation', 'Which SSP scenarios should the community standardise on?', 'rivers', [
      { author: 'almeida', body: 'Adopt SSP2-4.5 as central and SSP5-8.5 as the upper bound.', createdAt: daysAgo(5) },
      { author: 'kim', body: 'Add SSP1-2.6 for adaptation-only studies.', createdAt: daysAgo(4), parentId: 'com-cli-disc-1-reply-1' },
    ], daysAgo(10), true),
  ],
  questions: [
    ques('com-cli-ques-1', 'Coastal indicator standardisation', 'Which coastal indicator set should the community adopt for comparable field data?', 'almeida', [
      { author: 'rivers', body: 'Adopt the community coastal indicator set from the 2025 data round.', createdAt: daysAgo(2), upvotes: 6 },
    ], ['coastal', 'indicators'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-cli-res-1', 'Open climate risk model suite', 'software', 'rivers', daysAgo(20), 'https://github.com/climateresearch/models'),
    res('com-cli-res-2', 'Coastal indicator datasets', 'dataset', 'almeida', daysAgo(48)),
  ],
  events: [
    evt('com-cli-evt-1', 'Adaptation futures symposium', 'conference', 'hybrid', daysAhead(25, 9), ['rivers', 'almeida', 'adesina'], 'scheduled'),
    evt('com-cli-evt-2', 'Coastal resilience field update', 'seminar', 'online', daysAgo(13, 16), ['rivers', 'kim'], 'completed'),
  ],
  polls: [poll('com-cli-poll-1', 'Which adaptation pathway should the 2027 study focus on?', ['Managed retreat', 'Ecosystem-based adaptation', 'Hard infrastructure'], 'rivers', daysAgo(8), 'open', { 'Managed retreat': 33, 'Ecosystem-based adaptation': 47, 'Hard infrastructure': 20 })],
  mentorships: [ment('com-cli-ment-1', 'rivers', 'hussain', 'Climate risk modelling', 'active')],
  opportunities: [opp('com-cli-opp-1', 'Coastal adaptation research consortium', 'funding-call', 'almeida', daysAgo(6), daysAhead(50), 'Multi-institution consortium call.')],
  spotlights: [spot('com-cli-spot-1', 'almeida', 'Mapping coastal resilience', 'Dr. Joao Almeida led the community risk atlas covering 14 countries.', 'rivers')],
  achievements: [ach('com-cli-ach-1', 'Risk atlas launched', '🗺️', 'The community released the regional climate risk atlas.', 'almeida')],
  bookmarks: [bm('com-cli-bm-1', 'adesina', 'com-cli-disc-1')],
  trends: [trend('com-cli-trend-1', 'Adaptation', 89), trend('com-cli-trend-2', 'Coastal', 74)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-25T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 8 — Engineering Innovation Community
// ---------------------------------------------------------------------------

const ENGINEERING_INNOVATION_COMMUNITY: Community = createCommunity({
  id: 'com-engineering-innovation',
  name: 'Engineering Innovation Community',
  description:
    'An open community for engineers turning research into deployable systems — smart grids, microgrids, energy storage, and manufacturing innovation.',
  category: 'engineering',
  discipline: 'Electrical Engineering',
  researchAreas: ['Renewable Energy', 'Smart Grids', 'Microgrids', 'Energy Storage', 'Manufacturing'],
  keywords: ['engineering', 'energy', 'smart-grid', 'microgrid', 'innovation'],
  language: 'English',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'public',
  creator: 'adebayo',
  creatorName: ADEBAYO.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/engineering-innovation',
  socialLinks: { linkedin: 'https://linkedin.com/company/eic', github: 'https://github.com/eic' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('tanaka', 'administrator', '2024-02-15T09:00:00.000Z')],
  moderators: [member('wang', 'moderator', '2024-03-15T09:00:00.000Z')],
  members: [
    member('dube', 'contributor', '2024-04-15T09:00:00.000Z'),
    member('schneider', 'member', '2024-05-15T09:00:00.000Z'),
    member('kim', 'member', '2024-06-15T09:00:00.000Z'),
  ],
  mentors: [member('adebayo', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('tanaka', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('dube', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('hussain', '2025-01-01T09:00:00.000Z'), follower('rivers', '2025-02-01T09:00:00.000Z'), follower('yusuf', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-eng-annc-1', 'Grid modernisation workshop', 'Registration is open for the regional workshop in Lagos.', 'adebayo', daysAgo(6), true),
  ],
  discussions: [
    disc('com-eng-disc-1', 'Interoperability standards for microgrids', 'Which interconnection standards should the community endorse?', 'adebayo', [
      { author: 'tanaka', body: 'Align with IEC and extend for low-voltage African contexts.', createdAt: daysAgo(5) },
    ], daysAgo(9), true),
    disc('com-eng-disc-2', 'Grid-scale storage siting', 'How should storage siting balance transmission constraints and land use?', 'wang', [
      { author: 'schneider', body: 'Co-optimise siting with the grid model before committing.', createdAt: daysAgo(1) },
    ]),
  ],
  questions: [
    ques('com-eng-ques-1', 'Microgrid controller reference design', 'Is there an open reference design for community microgrid controllers?', 'dube', [
      { author: 'adebayo', body: 'Yes — the SunGrid controller repo includes a full reference design.', createdAt: daysAgo(4), upvotes: 5 },
    ], ['microgrid', 'controllers'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-eng-res-1', 'Open microgrid simulation models', 'software', 'adebayo', daysAgo(25), 'https://github.com/eic/models'),
    res('com-eng-res-2', 'West African grid data registry', 'dataset', 'dube', daysAgo(55)),
  ],
  events: [
    evt('com-eng-evt-1', 'Regional grid modernisation workshop', 'workshop', 'in-person', daysAhead(12, 10), ['adebayo', 'wang'], 'scheduled'),
    evt('com-eng-evt-2', 'Energy storage webinar', 'webinar', 'online', daysAgo(15, 15), ['schneider', 'kim'], 'completed'),
  ],
  polls: [poll('com-eng-poll-1', 'Which innovation area should the incubator support next?', ['Battery recycling', 'Solar microgrids', 'EV charging'], 'adebayo', daysAgo(5), 'open', { 'Battery recycling': 22, 'Solar microgrids': 55, 'EV charging': 23 })],
  mentorships: [ment('com-eng-ment-1', 'adebayo', 'yusuf', 'Energy systems engineering', 'active')],
  opportunities: [opp('com-eng-opp-1', 'Engineering incubator intake', 'research-call', 'tanaka', daysAgo(4), daysAhead(28), 'Apply for prototype funding and mentorship.')],
  spotlights: [spot('com-eng-spot-1', 'adebayo', 'Powering 40 rural communities', 'The SunGrid controller now powers 40 rural communities across the region.', 'tanaka')],
  achievements: [ach('com-eng-ach-1', '40 communities connected', '⚡', 'The community prototype reached 40 rural communities.', 'adebayo')],
  bookmarks: [bm('com-eng-bm-1', 'dube', 'com-eng-disc-1')],
  trends: [trend('com-eng-trend-1', 'Microgrids', 90), trend('com-eng-trend-2', 'Storage', 68)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 9 — Digital Humanities Community
// ---------------------------------------------------------------------------

const DIGITAL_HUMANITIES_COMMUNITY: Community = createCommunity({
  id: 'com-digital-humanities',
  name: 'Digital Humanities Community',
  description:
    'An open community at the intersection of computation and the humanities — digital editions, text analysis, manuscripts, and public humanities.',
  category: 'arts-humanities',
  discipline: 'Digital Humanities',
  researchAreas: ['Digital Editions', 'Text Analysis', 'Manuscript Studies', 'Public Humanities', 'Digital Archives'],
  keywords: ['digital-humanities', 'manuscripts', 'tei', 'archives'],
  language: 'English',
  country: 'United Kingdom',
  region: 'Europe',
  visibility: 'public',
  creator: 'smith',
  creatorName: SMITH.displayName,
  verificationStatus: 'Trusted',
  website: 'https://scholatia.org/communities/digital-humanities',
  socialLinks: { twitter: 'https://twitter.com/dhcommunity', github: 'https://github.com/dhcommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('jscholar', 'administrator', '2024-01-20T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-02-20T09:00:00.000Z')],
  members: [
    member('almeida', 'contributor', '2024-03-20T09:00:00.000Z'),
    member('kovacs', 'member', '2024-04-20T09:00:00.000Z'),
    member('hussain', 'member', '2024-05-20T09:00:00.000Z'),
  ],
  mentors: [member('smith', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('gallo', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('kovacs', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('wang', '2025-02-01T09:00:00.000Z'), follower('tanaka', '2025-02-15T09:00:00.000Z'), follower('maria', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-dh-annc-1', 'Special session accepted', 'The working group session was accepted at the International Congress on Medieval Studies.', 'smith', daysAgo(14), true),
  ],
  discussions: [
    disc('com-dh-disc-1', 'Metadata for fragmentary leaves', 'How should fragmentary leaves be described in open catalogues?', 'smith', [
      { author: 'almeida', body: 'Adopt the fragment-friendly extension to IIIF metadata.', createdAt: daysAgo(6) },
      { author: 'gallo', body: 'Include provenance depth to support provenance-aware editions.', createdAt: daysAgo(4), parentId: 'com-dh-disc-1-reply-1' },
    ], daysAgo(12), true),
  ],
  questions: [
    ques('com-dh-ques-1', 'TEI encoding for editorial notes', 'What is the community-recommended TEI profile for critical apparatus?', 'kovacs', [
      { author: 'smith', body: 'Follow the TEI Critical Edition module with named witnesses.', createdAt: daysAgo(5), upvotes: 6 },
    ], ['tei', 'editions'], daysAgo(9), 'answered'),
  ],
  resources: [
    res('com-dh-res-1', 'Open Manuscript Catalogue specification', 'protocol', 'smith', daysAgo(30)),
    res('com-dh-res-2', 'Digitised register corpus', 'dataset', 'almeida', daysAgo(80)),
  ],
  events: [
    evt('com-dh-evt-1', 'Panel on the digital archive', 'conference', 'hybrid', daysAhead(22, 9), ['smith', 'jscholar'], 'scheduled'),
    evt('com-dh-evt-2', 'Paleography reading group', 'reading-group', 'in-person', daysAgo(11, 15), ['smith'], 'completed'),
  ],
  polls: [poll('com-dh-poll-1', 'Which corpus should the community digitise next?', ['Medieval charters', 'Early modern letters', 'Liturgical manuscripts'], 'smith', daysAgo(7), 'open', { 'Medieval charters': 40, 'Early modern letters': 25, 'Liturgical manuscripts': 35 })],
  mentorships: [ment('com-dh-ment-1', 'smith', 'kovacs', 'Digital editions', 'active')],
  opportunities: [opp('com-dh-opp-1', 'Digital edition fellowship', 'funding-call', 'jscholar', daysAgo(9), daysAhead(42), 'Fellowship to complete a digital critical edition.')],
  spotlights: [spot('com-dh-spot-1', 'smith', 'Opening the medieval archive', 'The open catalogue now describes over 8,000 digitised manuscripts.', 'jscholar')],
  achievements: [ach('com-dh-ach-1', '8,000 manuscripts catalogued', '📜', 'The community catalogue passed 8,000 descriptions.', 'smith')],
  bookmarks: [],
  trends: [trend('com-dh-trend-1', 'IIIF metadata', 79), trend('com-dh-trend-2', 'Digital editions', 71)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 10 — Economics & Social Policy Forum
// ---------------------------------------------------------------------------

const ECONOMICS_SOCIAL_POLICY_FORUM: Community = createCommunity({
  id: 'com-economics-social-policy',
  name: 'Economics & Social Policy Forum',
  description:
    'An open forum for applied economics, social policy evaluation, poverty research, and evidence-based governance.',
  category: 'social-sciences',
  discipline: 'Economics',
  researchAreas: ['Applied Economics', 'Social Policy', 'Impact Evaluation', 'Poverty Research', 'Behavioural Economics'],
  keywords: ['economics', 'social-policy', 'impact', 'poverty'],
  language: 'English',
  country: 'Ghana',
  region: 'West Africa',
  visibility: 'public',
  creator: 'adesina',
  creatorName: ADESINA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/economics-social-policy',
  socialLinks: { linkedin: 'https://linkedin.com/company/espf' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('hussain', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('ojuri', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('dube', 'member', '2024-05-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('adesina', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('hussain', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('dube', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('rivers', '2025-01-01T09:00:00.000Z'), follower('mbatha', '2025-02-01T09:00:00.000Z'), follower('schneider', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-esp-annc-1', 'Impact evaluation clinic', 'The impact evaluation clinic opens for registration this week.', 'adesina', daysAgo(4), true),
  ],
  discussions: [
    disc('com-esp-disc-1', 'Natural experiments in policy evaluation', 'When are natural experiments credible enough for policy weight?', 'adesina', [
      { author: 'hussain', body: 'Credibility hinges on a plausible exclusion restriction and balance.', createdAt: daysAgo(3) },
    ], daysAgo(8), true),
  ],
  questions: [
    ques('com-esp-ques-1', 'Survey weights for phone-based panels', 'How should weights adjust for differential non-response in phone panels?', 'dube', [
      { author: 'adesina', body: 'Calibrate to the sampling frame and trim extreme weights.', createdAt: daysAgo(2), upvotes: 4 },
    ], ['surveys', 'weights'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-esp-res-1', 'Impact evaluation field toolkit', 'teaching-material', 'adesina', daysAgo(18)),
    res('com-esp-res-2', 'Open household panel dataset', 'dataset', 'hussain', daysAgo(40)),
  ],
  events: [
    evt('com-esp-evt-1', 'Policy roundtable', 'seminar', 'hybrid', daysAhead(16, 14), ['adesina', 'hussain'], 'scheduled'),
  ],
  polls: [poll('com-esp-poll-1', 'Which policy question should the 2027 evidence review cover?', ['Cash transfers', 'Health financing', 'Education access'], 'adesina', daysAgo(5), 'open', { 'Cash transfers': 44, 'Health financing': 31, 'Education access': 25 })],
  mentorships: [ment('com-esp-ment-1', 'adesina', 'gallo', 'Impact evaluation', 'active')],
  opportunities: [opp('com-esp-opp-1', 'Policy brief competition', 'research-call', 'hussain', daysAgo(3), daysAhead(25), 'Publish a policy brief from your research.')],
  spotlights: [spot('com-esp-spot-1', 'adesina', 'Evidence for agricultural policy', 'Folake Adesina’s farm-panel work now informs national extension policy.', 'hussain')],
  achievements: [ach('com-esp-ach-1', '50 policy briefs', '📊', 'The forum published 50 policy briefs.', 'adesina')],
  bookmarks: [],
  trends: [trend('com-esp-trend-1', 'Impact evaluation', 82), trend('com-esp-trend-2', 'Cash transfers', 64)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 11 — Bioinformatics & Computational Biology Community
// ---------------------------------------------------------------------------

const BIOINFORMATICS_COMPUTATIONAL_BIOLOGY_COMMUNITY: Community = createCommunity({
  id: 'com-bioinformatics',
  name: 'Bioinformatics & Computational Biology Community',
  description:
    'An open research community for computational biology — genomics pipelines, single-cell analysis, phylogenetics, and open tooling.',
  category: 'research',
  discipline: 'Bioinformatics',
  researchAreas: ['Genomics', 'Single-Cell Analysis', 'Phylogenetics', 'Metagenomics', 'Reproducible Pipelines'],
  keywords: ['bioinformatics', 'genomics', 'single-cell', 'pipelines'],
  language: 'English',
  country: 'South Africa',
  region: 'Africa',
  visibility: 'public',
  creator: 'mbatha',
  creatorName: MBATHA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/bioinformatics',
  socialLinks: { twitter: 'https://twitter.com/biocommunity', github: 'https://github.com/biocommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('dube', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('okonkwo', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('jscholar', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('adesina', 'member', '2024-05-01T09:00:00.000Z'),
    member('rivers', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('mbatha', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('dube', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('okonkwo', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('schneider', '2025-01-01T09:00:00.000Z'), follower('kim', '2025-02-01T09:00:00.000Z'), follower('maria', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-bio-annc-1', 'Single-cell benchmarking round', 'The single-cell benchmarking round is now open for submissions.', 'mbatha', daysAgo(7), true),
  ],
  discussions: [
    disc('com-bio-disc-1', 'Containerising legacy pipelines', 'How should we containerise legacy R pipelines without breaking workflows?', 'dube', [
      { author: 'mbatha', body: 'Freeze dependency versions and capture the full session info in the image.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-bio-ques-1', 'Normalisation for multi-batch single-cell data', 'Which normalisation approach handles batch effects in single-cell integration?', 'rivers', [
      { author: 'mbatha', body: 'Use harmony-style batch correction after scRNA normalisation.', createdAt: daysAgo(3), upvotes: 11 },
    ], ['single-cell', 'normalisation'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-bio-res-1', 'Genomics pipeline registry', 'software', 'mbatha', daysAgo(12), 'https://github.com/biocommunity/pipelines'),
    res('com-bio-res-2', 'Reference single-cell datasets', 'dataset', 'dube', daysAgo(38)),
  ],
  events: [
    evt('com-bio-evt-1', 'Pipeline builders session', 'workshop', 'online', daysAhead(10, 16), ['mbatha', 'dube'], 'scheduled'),
  ],
  polls: [poll('com-bio-poll-1', 'Which platform should the community standardise on?', ['Nextflow', 'Snakemake', 'WDL'], 'mbatha', daysAgo(6), 'open', { Nextflow: 50, Snakemake: 30, WDL: 20 })],
  mentorships: [ment('com-bio-ment-1', 'mbatha', 'adesina', 'Computational genomics', 'active')],
  opportunities: [opp('com-bio-opp-1', 'African genomics data drive', 'research-call', 'dube', daysAgo(5), daysAhead(60), 'Contribute validated genomes from under-represented populations.')],
  spotlights: [spot('com-bio-spot-1', 'mbatha', 'Building African genomics capacity', 'Dr. Bongani Ndlovu trained 200 researchers in reproducible pipelines.', 'dube')],
  achievements: [ach('com-bio-ach-1', '200 researchers trained', '🧬', 'The community trained 200 researchers in reproducible pipelines.', 'mbatha')],
  bookmarks: [bm('com-bio-bm-1', 'jscholar', 'com-bio-disc-1')],
  trends: [trend('com-bio-trend-1', 'Single-cell', 85), trend('com-bio-trend-2', 'Pipelines', 73)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 12 — Robotics & Automation Community
// ---------------------------------------------------------------------------

const ROBOTICS_AUTOMATION_COMMUNITY: Community = createCommunity({
  id: 'com-robotics-automation',
  name: 'Robotics & Automation Community',
  description:
    'An open research community for robotics — manipulation, locomotion, human-robot collaboration, and embodied intelligence.',
  category: 'engineering',
  discipline: 'Robotics',
  researchAreas: ['Manipulation', 'Soft Robotics', 'Human-Robot Collaboration', 'Locomotion', 'Embodied AI'],
  keywords: ['robotics', 'manipulation', 'soft-robotics', 'automation'],
  language: 'Japanese',
  country: 'Japan',
  region: 'East Asia',
  visibility: 'public',
  creator: 'tanaka',
  creatorName: TANAKA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/robotics-automation',
  socialLinks: { github: 'https://github.com/robocommunity', twitter: 'https://twitter.com/robocommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('wang', 'administrator', '2024-01-05T09:00:00.000Z')],
  moderators: [member('kim', 'moderator', '2024-02-05T09:00:00.000Z')],
  members: [
    member('schneider', 'contributor', '2024-03-05T09:00:00.000Z'),
    member('maria', 'member', '2024-04-05T09:00:00.000Z'),
    member('adebayo', 'member', '2024-05-05T09:00:00.000Z'),
  ],
  mentors: [member('tanaka', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('kim', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('adebayo', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('dube', '2025-01-01T09:00:00.000Z'), follower('hussain', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-rob-annc-1', 'ICRA paper accepted', 'The actuator control paper was accepted for presentation.', 'tanaka', daysAgo(9), true),
  ],
  discussions: [
    disc('com-rob-disc-1', 'Stiffness scheduling for dynamic tasks', 'When should compliant grippers switch between soft and stiff modes?', 'wang', [
      { author: 'tanaka', body: 'Key the switch to contact phase; prototype data supports a threshold.', createdAt: daysAgo(2) },
    ], daysAgo(7), true),
  ],
  questions: [
    ques('com-rob-ques-1', 'Sim-to-real transfer for manipulation', 'Which sim-to-real techniques generalise best for compliant grippers?', 'adebayo', [
      { author: 'tanaka', body: 'Domain randomisation plus system identification on the soft actuator.', createdAt: daysAgo(4), upvotes: 7 },
    ], ['sim2real', 'manipulation'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-rob-res-1', 'SoftGrip actuator CAD and firmware', 'software', 'tanaka', daysAgo(22), 'https://github.com/robocommunity/softgrip'),
    res('com-rob-res-2', 'Benchmark manipulation trajectories', 'dataset', 'wang', daysAgo(64)),
  ],
  events: [
    evt('com-rob-evt-1', 'Lab demonstration day', 'workshop', 'in-person', daysAhead(4, 13), ['tanaka', 'wang'], 'scheduled'),
  ],
  polls: [poll('com-rob-poll-1', 'Which benchmark should the community adopt?', ['Grasping', 'In-hand manipulation', 'Mobile manipulation'], 'tanaka', daysAgo(5), 'open', { Grasping: 36, 'In-hand manipulation': 34, 'Mobile manipulation': 30 })],
  mentorships: [ment('com-rob-ment-1', 'tanaka', 'adebayo', 'Compliant manipulation', 'active')],
  opportunities: [opp('com-rob-opp-1', 'Benchmark challenge', 'research-call', 'wang', daysAgo(6), daysAhead(30), 'Open manipulation benchmark challenge.')],
  spotlights: [spot('com-rob-spot-1', 'tanaka', 'Compliant eldercare robots', 'The soft gripper platform entered eldercare pilots.', 'wang')],
  achievements: [ach('com-rob-ach-1', 'Eldercare pilot launched', '🤖', 'The soft robotics platform launched its first eldercare pilot.', 'tanaka')],
  bookmarks: [],
  trends: [trend('com-rob-trend-1', 'Soft actuators', 80), trend('com-rob-trend-2', 'Sim2real', 66)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 13 — Quantum Computing Researchers
// ---------------------------------------------------------------------------

const QUANTUM_COMPUTING_RESEARCHERS_COMMUNITY: Community = createCommunity({
  id: 'com-quantum-computing',
  name: 'Quantum Computing Researchers',
  description:
    'An invitation-only community for researchers exploring quantum algorithms, error correction, and quantum-chemistry simulations.',
  category: 'research',
  discipline: 'Quantum Physics',
  researchAreas: ['Quantum Algorithms', 'Quantum Error Correction', 'Quantum Chemistry', 'Quantum Hardware'],
  keywords: ['quantum', 'algorithms', 'error-correction', 'qec'],
  language: 'English',
  country: 'Switzerland',
  region: 'Europe',
  visibility: 'invitation-only',
  creator: 'schneider',
  creatorName: SCHNEIDER.displayName,
  verificationStatus: 'Government Recognised',
  website: 'https://scholatia.org/communities/quantum-computing',
  socialLinks: { github: 'https://github.com/qcommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('wang', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('maria', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('tanaka', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('dube', 'member', '2024-06-01T09:00:00.000Z'),
    member('kim', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('schneider', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('wang', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [],
  followers: [follower('jscholar', '2025-01-01T09:00:00.000Z')],
  announcements: [
    annc('com-qc-annc-1', 'Hardware access round', 'Applications for the next hardware access round close this month.', 'schneider', daysAgo(13), true),
  ],
  discussions: [
    disc('com-qc-disc-1', 'Noise model assumptions', 'Which noise model should the community standardise simulations on?', 'schneider', [
      { author: 'wang', body: 'Use device-calibrated models from the current hardware generation.', createdAt: daysAgo(3) },
    ], daysAgo(10), true),
  ],
  questions: [
    ques('com-qc-ques-1', 'Logical qubit error budget', 'How should we allocate an error budget across a logical qubit pipeline?', 'kim', [
      { author: 'schneider', body: 'Start from the target logical failure rate and decompose backwards.', createdAt: daysAgo(2), upvotes: 9 },
    ], ['error-correction'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-qc-res-1', 'Shared circuit simulation toolkit', 'software', 'wang', daysAgo(35), 'https://github.com/qcommunity/sim'),
    res('com-qc-res-2', 'Benchmark problem set', 'dataset', 'kim', daysAgo(70)),
  ],
  events: [
    evt('com-qc-evt-1', 'Invitation-only seminar', 'seminar', 'online', daysAhead(8, 14), ['schneider', 'wang'], 'scheduled'),
  ],
  polls: [],
  mentorships: [ment('com-qc-ment-1', 'schneider', 'kim', 'Error correction benchmarks', 'active')],
  opportunities: [opp('com-qc-opp-1', 'QEC benchmark collaboration', 'research-call', 'wang', daysAgo(8), daysAhead(45), 'Comparative benchmarks for error-corrected memory.')],
  spotlights: [spot('com-qc-spot-1', 'schneider', 'Logical qubit roadmap', 'The community roadmap targets error-corrected logical qubits by 2028.', 'wang')],
  achievements: [ach('com-qc-ach-1', 'First logical memory run', '🔬', 'The community completed its first logical memory experiment.', 'schneider')],
  bookmarks: [],
  trends: [trend('com-qc-trend-1', 'Logical qubits', 91), trend('com-qc-trend-2', 'QEC', 84)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 14 — Astronomy & Astrophysics Community
// ---------------------------------------------------------------------------

const ASTRONOMY_ASTROPHYSICS_COMMUNITY: Community = createCommunity({
  id: 'com-astronomy-astrophysics',
  name: 'Astronomy & Astrophysics Community',
  description:
    'An open community connecting observational astronomers and computational astrophysicists across the global south and north.',
  category: 'research',
  discipline: 'Astrophysics',
  researchAreas: ['Galaxy Formation', 'Dark Matter', 'Exoplanets', 'Large-Scale Structure', 'Observational Astronomy'],
  keywords: ['astronomy', 'galaxies', 'dark-matter', 'astrophysics'],
  language: 'Spanish',
  country: 'Mexico',
  region: 'Latin America',
  visibility: 'public',
  creator: 'maria',
  creatorName: MARIA.displayName,
  verificationStatus: 'Government Recognised',
  website: 'https://scholatia.org/communities/astronomy-astrophysics',
  socialLinks: { twitter: 'https://twitter.com/astrocommunity', github: 'https://github.com/astrocommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('tanaka', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('jscholar', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('dube', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-06-01T09:00:00.000Z'),
    member('schneider', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('maria', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('tanaka', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('gallo', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('rivers', '2025-01-01T09:00:00.000Z'), follower('almeida', '2025-02-01T09:00:00.000Z'), follower('wang', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-ast-annc-1', 'HPC allocation renewed', 'The national supercomputing allocation was renewed for a further two years.', 'maria', daysAgo(10), true),
  ],
  discussions: [
    disc('com-ast-disc-1', 'Resolution for dwarf galaxy runs', 'What effective resolution should we target for the dwarf population?', 'maria', [
      { author: 'schneider', body: 'Target 100 pc effective resolution with the new scheme.', createdAt: daysAgo(3) },
    ], daysAgo(8), true),
  ],
  questions: [
    ques('com-ast-ques-1', 'Open data formats for survey archives', 'Which format should community survey releases standardise on?', 'dube', [
      { author: 'maria', body: 'Adopt the survey\u2019s community-verified columnar format.', createdAt: daysAgo(4), upvotes: 6 },
    ], ['data-formats'], daysAgo(9), 'answered'),
  ],
  resources: [
    res('com-ast-res-1', 'Shared simulation infrastructure guide', 'protocol', 'maria', daysAgo(18)),
    res('com-ast-res-2', 'Sample simulation catalogues', 'dataset', 'tanaka', daysAgo(50)),
  ],
  events: [
    evt('com-ast-evt-1', 'Simulation showcase', 'seminar', 'hybrid', daysAhead(7, 16), ['maria', 'schneider'], 'scheduled'),
    evt('com-ast-evt-2', 'Dark matter journal club', 'journal-club', 'online', daysAgo(21, 16), ['tanaka', 'dube'], 'completed'),
  ],
  polls: [],
  mentorships: [ment('com-ast-ment-1', 'maria', 'gallo', 'Observational data analysis', 'active')],
  opportunities: [opp('com-ast-opp-1', 'Community observing programme', 'research-call', 'maria', daysAgo(6), daysAhead(40), 'Join the community observing programme.')],
  spotlights: [spot('com-ast-spot-1', 'maria', 'Exascale simulations for the region', 'The network delivered exascale galaxy formation benchmarks for the region.', 'tanaka')],
  achievements: [ach('com-ast-ach-1', 'Exascale benchmarks delivered', '🖥️', 'The community delivered its first exascale benchmark run.', 'maria')],
  bookmarks: [],
  trends: [trend('com-ast-trend-1', 'Simulations', 83), trend('com-ast-trend-2', 'Dark matter', 72)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 15 — Materials Science Community
// ---------------------------------------------------------------------------

const MATERIALS_SCIENCE_COMMUNITY: Community = createCommunity({
  id: 'com-materials-science',
  name: 'Materials Science Community',
  description:
    'An institution-scoped community for nanomaterials, energy materials, and shared characterisation infrastructure.',
  category: 'research',
  discipline: 'Materials Science',
  researchAreas: ['Nanomaterials', 'Energy Materials', 'Characterisation', 'Thin Films'],
  keywords: ['nanomaterials', 'characterisation', 'energy-materials'],
  language: 'Korean',
  country: 'South Korea',
  region: 'East Asia',
  visibility: 'institution-only',
  creator: 'kim',
  creatorName: KIM.displayName,
  verificationStatus: 'Accredited',
  website: 'https://scholatia.org/communities/materials-science',
  socialLinks: { linkedin: 'https://linkedin.com/company/msc' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('schneider', 'administrator', '2024-03-10T09:00:00.000Z')],
  moderators: [member('rivers', 'moderator', '2024-04-10T09:00:00.000Z')],
  members: [
    member('adebayo', 'contributor', '2024-05-10T09:00:00.000Z'),
    member('tanaka', 'member', '2024-06-10T09:00:00.000Z'),
    member('wang', 'member', '2024-07-10T09:00:00.000Z'),
  ],
  mentors: [member('kim', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('schneider', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [],
  followers: [follower('maria', '2025-01-01T09:00:00.000Z')],
  announcements: [
    annc('com-mat-annc-1', 'New instrument online', 'The new electron microscope is available for booking.', 'kim', daysAgo(8), true),
  ],
  discussions: [
    disc('com-mat-disc-1', 'Instrument time allocation', 'How should we prioritise instrument bookings during peak season?', 'kim', [
      { author: 'rivers', body: 'Prioritise thesis-critical measurements with a shared queue.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [],
  resources: [
    res('com-mat-res-1', 'Shared characterisation booking policy', 'protocol', 'kim', daysAgo(29)),
    res('com-mat-res-2', 'Calibration reference datasets', 'dataset', 'schneider', daysAgo(58)),
  ],
  events: [
    evt('com-mat-evt-1', 'Characterisation facility tour', 'workshop', 'in-person', daysAhead(11, 11), ['kim', 'rivers'], 'scheduled'),
  ],
  polls: [poll('com-mat-poll-1', 'Should the community open the facility booking API?', ['Yes, public', 'Yes, institution-only', 'No'], 'kim', daysAgo(4), 'open', { 'Yes, public': 20, 'Yes, institution-only': 60, No: 20 })],
  mentorships: [],
  opportunities: [opp('com-mat-opp-1', 'Nanostructured films call', 'research-call', 'schneider', daysAgo(7), daysAhead(35), 'Internal call for thin-film characterisation projects.')],
  spotlights: [],
  achievements: [ach('com-mat-ach-1', 'Microscope online', '🔬', 'The new electron microscope came online for the community.', 'kim')],
  bookmarks: [],
  trends: [trend('com-mat-trend-1', 'Characterisation', 76), trend('com-mat-trend-2', 'Nanomaterials', 69)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 16 — Cybersecurity Research Community
// ---------------------------------------------------------------------------

const CYBERSECURITY_RESEARCH_COMMUNITY: Community = createCommunity({
  id: 'com-cybersecurity-research',
  name: 'Cybersecurity Research Community',
  description:
    'An open research community for threat detection, digital forensics, and secure critical infrastructure.',
  category: 'research',
  discipline: 'Cybersecurity',
  researchAreas: ['Threat Detection', 'Digital Forensics', 'Network Security', 'Critical Infrastructure'],
  keywords: ['cybersecurity', 'threat-detection', 'forensics'],
  language: 'English',
  country: 'South Africa',
  region: 'Africa',
  visibility: 'public',
  creator: 'ndlovu',
  creatorName: NDLOVU.displayName,
  verificationStatus: 'Government Recognised',
  website: 'https://scholatia.org/communities/cybersecurity-research',
  socialLinks: { github: 'https://github.com/cybercommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('dube', 'administrator', '2024-02-10T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2024-03-10T09:00:00.000Z')],
  members: [
    member('okonkwo', 'contributor', '2024-04-10T09:00:00.000Z'),
    member('jscholar', 'member', '2024-05-10T09:00:00.000Z'),
    member('das', 'member', '2024-06-10T09:00:00.000Z'),
  ],
  mentors: [member('ndlovu', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('dube', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('das', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('schneider', '2025-01-01T09:00:00.000Z'), follower('tanaka', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-cyb-annc-1', 'Benchmark release', 'The threat detection benchmark is now public.', 'ndlovu', daysAgo(10), true),
  ],
  discussions: [
    disc('com-cyb-disc-1', 'Open-source detection strategy', 'Should the community open its detection rule set?', 'ndlovu', [
      { author: 'dube', body: 'Open with a responsible disclosure policy.', createdAt: daysAgo(6) },
    ], daysAgo(11), true),
  ],
  questions: [
    ques('com-cyb-ques-1', 'Forensics chain of custody', 'How should distributed teams maintain digital chain of custody?', 'das', [
      { author: 'ndlovu', body: 'Hash-seal every artefact at intake and log access immutably.', createdAt: daysAgo(2), upvotes: 8 },
    ], ['forensics'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-cyb-res-1', 'Open detection rule set', 'software', 'ndlovu', daysAgo(17), 'https://github.com/cybercommunity/rules'),
    res('com-cyb-res-2', 'Forensics caseplaybook', 'protocol', 'mbatha', daysAgo(52)),
  ],
  events: [
    evt('com-cyb-evt-1', 'Threat intel briefing', 'seminar', 'online', daysAhead(6, 12), ['ndlovu', 'okonkwo'], 'scheduled'),
  ],
  polls: [poll('com-cyb-poll-1', 'Which threat family should the next benchmark focus on?', ['Ransomware', 'Phishing', 'Zero-days', 'Insider threats'], 'ndlovu', daysAgo(5), 'open', { Ransomware: 48, Phishing: 22, 'Zero-days': 20, 'Insider threats': 10 })],
  mentorships: [ment('com-cyb-ment-1', 'ndlovu', 'das', 'Threat intelligence', 'active')],
  opportunities: [opp('com-cyb-opp-1', 'Critical infrastructure monitoring project', 'research-call', 'dube', daysAgo(6), daysAhead(40), 'Contribute to national critical infrastructure monitoring.')],
  spotlights: [spot('com-cyb-spot-1', 'ndlovu', 'Securing national infrastructure', 'The community framework now monitors national critical infrastructure.', 'dube')],
  achievements: [ach('com-cyb-ach-1', 'Benchmark public', '📡', 'The community released its first public threat detection benchmark.', 'ndlovu')],
  bookmarks: [],
  trends: [trend('com-cyb-trend-1', 'Threat detection', 87), trend('com-cyb-trend-2', 'Forensics', 70)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-30T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 17 — Agricultural Science & Food Systems Community
// ---------------------------------------------------------------------------

const AGRICULTURAL_SCIENCE_FOOD_SYSTEMS_COMMUNITY: Community = createCommunity({
  id: 'com-agricultural-science',
  name: 'Agricultural Science & Food Systems Community',
  description:
    'An open community for agricultural research, food systems, and rural livelihoods across Africa and beyond.',
  category: 'research',
  discipline: 'Agricultural Economics',
  researchAreas: ['Food Systems', 'Crop Resilience', 'Rural Livelihoods', 'AgTech', 'Food Security'],
  keywords: ['agriculture', 'food-systems', 'agtech', 'food-security'],
  language: 'English',
  country: 'Ghana',
  region: 'West Africa',
  visibility: 'public',
  creator: 'adesina',
  creatorName: ADESINA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/agricultural-science',
  socialLinks: { linkedin: 'https://linkedin.com/company/agcommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('rivers', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('dube', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('ojuri', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('yusuf', 'member', '2024-05-01T09:00:00.000Z'),
    member('mbatha', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('adesina', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('rivers', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('hussain', '2025-01-01T09:00:00.000Z'), follower('gallo', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-ag-annc-1', 'Seasonal trial results', 'The maize resilience trial results are available in the resources library.', 'adesina', daysAgo(7), true),
  ],
  discussions: [
    disc('com-ag-disc-1', 'Farmer-led data collection', 'How should we validate farmer-reported yields against plot measurements?', 'adesina', [
      { author: 'dube', body: 'Use GPS-tagged plots and a calibration sub-sample.', createdAt: daysAgo(5) },
    ], daysAgo(10), true),
  ],
  questions: [
    ques('com-ag-ques-1', 'Seed systems for drought tolerance', 'Which open-source maize lines fit the Sahel agroecology best?', 'rivers', [
      { author: 'adesina', body: 'The drought-tolerant open lines from the 2025 trial are promising.', createdAt: daysAgo(3), upvotes: 5 },
    ], ['seed-systems', 'drought'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-ag-res-1', 'Farm panel dataset', 'dataset', 'adesina', daysAgo(21)),
    res('com-ag-res-2', 'Crop resilience protocol', 'protocol', 'rivers', daysAgo(45)),
  ],
  events: [
    evt('com-ag-evt-1', 'Food systems forum', 'conference', 'hybrid', daysAhead(20, 9), ['adesina', 'rivers'], 'scheduled'),
  ],
  polls: [poll('com-ag-poll-1', 'Which value chain should the 2027 study prioritise?', ['Maize', 'Cassava', 'Dairy', 'Horticulture'], 'adesina', daysAgo(6), 'open', { Maize: 30, Cassava: 35, Dairy: 20, Horticulture: 15 })],
  mentorships: [ment('com-ag-ment-1', 'adesina', 'yusuf', 'Agricultural impact evaluation', 'active')],
  opportunities: [opp('com-ag-opp-1', 'AgTech field trials', 'research-call', 'rivers', daysAgo(4), daysAhead(50), 'Partner on agtech field trials.')],
  spotlights: [spot('com-ag-spot-1', 'adesina', 'Farmer forums across three countries', 'The community consultation reached 700 farming households.', 'rivers')],
  achievements: [ach('com-ag-ach-1', '700 households reached', '🌾', 'The community reached 700 farming households in its consultation round.', 'adesina')],
  bookmarks: [],
  trends: [trend('com-ag-trend-1', 'Food security', 84), trend('com-ag-trend-2', 'Drought tolerance', 65)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 18 — Language Documentation & Linguistics Community
// ---------------------------------------------------------------------------

const LANGUAGE_DOCUMENTATION_LINGUISTICS_COMMUNITY: Community = createCommunity({
  id: 'com-language-documentation',
  name: 'Language Documentation & Linguistics Community',
  description:
    'An open community for documentary linguistics — endangered languages, fieldwork methodology, corpora, and community partnerships.',
  category: 'research',
  discipline: 'Linguistics',
  researchAreas: ['Language Documentation', 'Endangered Languages', 'Fieldwork Methods', 'Sociolinguistics', 'Corpus Linguistics'],
  keywords: ['linguistics', 'language-documentation', 'endangered-languages', 'fieldwork'],
  language: 'Spanish',
  country: 'Argentina',
  region: 'Latin America',
  visibility: 'public',
  creator: 'gallo',
  creatorName: GALLO.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/language-documentation',
  socialLinks: { twitter: 'https://twitter.com/langdoc', orcid: 'https://orcid.org/0000-0003-0000-0000' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('smith', 'administrator', '2024-02-01T09:00:00.000Z'), member('jscholar', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('okonkwo', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('almeida', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('kovacs', 'member', '2024-06-01T09:00:00.000Z'),
    member('tanaka', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('gallo', 'member', '2024-01-01T09:00:00.000Z'), member('smith', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('jscholar', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('almeida', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('maria', '2025-01-01T09:00:00.000Z'), follower('dube', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-ld-annc-1', 'Field season coordination', 'Field season planning begins; community consent templates are ready.', 'gallo', daysAgo(6), true),
  ],
  discussions: [
    disc('com-ld-disc-1', 'Consent metadata standards', 'How should consent records attach to archived recordings?', 'gallo', [
      { author: 'smith', body: 'Store consent as first-class metadata linked to each session.', createdAt: daysAgo(4) },
      { author: 'okonkwo', body: 'Gate access with layered permissions per consent scope.', createdAt: daysAgo(2), parentId: 'com-ld-disc-1-reply-1' },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-ld-ques-1', 'Orthography decisions with communities', 'How do we decide orthography in collaboration with speaker communities?', 'almeida', [
      { author: 'gallo', body: 'Co-design with community committees and document decisions transparently.', createdAt: daysAgo(3), upvotes: 10 },
    ], ['orthography', 'fieldwork'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-ld-res-1', 'Field recording protocols', 'protocol', 'gallo', daysAgo(16)),
    res('com-ld-res-2', 'River Plate sociolinguistic corpus', 'dataset', 'gallo', daysAgo(60)),
  ],
  events: [
    evt('com-ld-evt-1', 'Community language workshops', 'workshop', 'in-person', daysAhead(13, 12), ['gallo', 'smith'], 'scheduled'),
  ],
  polls: [poll('com-ld-poll-1', 'Which archive should host the community corpus?', ['Native corpus platform', 'International archive', 'Both'], 'gallo', daysAgo(5), 'open', { 'Native corpus platform': 34, 'International archive': 31, Both: 35 })],
  mentorships: [ment('com-ld-ment-1', 'gallo', 'kovacs', 'Documentary linguistics', 'active')],
  opportunities: [opp('com-ld-opp-1', 'Endangered language recording drive', 'research-call', 'smith', daysAgo(5), daysAhead(45), 'Join the recording drive for under-documented languages.')],
  spotlights: [spot('com-ld-spot-1', 'gallo', 'Documenting the Gran Chaco', 'Dr. Camila Gallo\u2019s fieldwork now covers 12 endangered languages.', 'smith')],
  achievements: [ach('com-ld-ach-1', '12 languages documented', '🗣️', 'The community documented 12 endangered languages.', 'gallo')],
  bookmarks: [],
  trends: [trend('com-ld-trend-1', 'Consent metadata', 78), trend('com-ld-trend-2', 'Fieldwork', 72)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 19 — Psychology & Behavioural Science Community
// ---------------------------------------------------------------------------

const PSYCHOLOGY_BEHAVIOURAL_SCIENCE_COMMUNITY: Community = createCommunity({
  id: 'com-psychology-behavioural',
  name: 'Psychology & Behavioural Science Community',
  description:
    'An open community for psychology and behavioural science — replication, interventions, and research transparency.',
  category: 'social-sciences',
  discipline: 'Psychology',
  researchAreas: ['Cognitive Psychology', 'Behavioural Interventions', 'Replication', 'Decision Science', 'Developmental Psychology'],
  keywords: ['psychology', 'behavioural-science', 'replication', 'nudge'],
  language: 'Hungarian',
  country: 'Hungary',
  region: 'Europe',
  visibility: 'public',
  creator: 'kovacs',
  creatorName: KOVACS.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/psychology-behavioural',
  socialLinks: { twitter: 'https://twitter.com/behavioural' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('smith', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('hussain', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('yusuf', 'member', '2024-05-01T09:00:00.000Z'),
    member('dube', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('kovacs', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('smith', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('hussain', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('maria', '2025-01-01T09:00:00.000Z'), follower('rivers', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-psy-annc-1', 'Replication sprint', 'The replication sprint sign-up is open through Friday.', 'kovacs', daysAgo(4), true),
  ],
  discussions: [
    disc('com-psy-disc-1', 'Preregistration for interventions', 'What preregistration depth is appropriate for behavioural interventions?', 'kovacs', [
      { author: 'smith', body: 'Preregister the primary analysis and the stopping rule.', createdAt: daysAgo(3) },
    ], daysAgo(8), true),
  ],
  questions: [
    ques('com-psy-ques-1', 'Power analysis for multi-site RCTs', 'How should power account for site-level ICC in multi-site RCTs?', 'hussain', [
      { author: 'kovacs', body: 'Use the design effect with a conservative ICC from pilot data.', createdAt: daysAgo(2), upvotes: 6 },
    ], ['power', 'rct'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-psy-res-1', 'Replication protocol templates', 'protocol', 'kovacs', daysAgo(19)),
    res('com-psy-res-2', 'Behavioural intervention registry', 'repository', 'smith', daysAgo(40)),
  ],
  events: [
    evt('com-psy-evt-1', 'Decision science seminar', 'seminar', 'online', daysAhead(9, 15), ['kovacs', 'smith'], 'scheduled'),
  ],
  polls: [poll('com-psy-poll-1', 'Which replication target should the community take on?', ['Ego depletion', 'Framing effects', 'Default effects'], 'kovacs', daysAgo(6), 'open', { 'Ego depletion': 25, 'Framing effects': 40, 'Default effects': 35 })],
  mentorships: [ment('com-psy-ment-1', 'kovacs', 'yusuf', 'Behavioural intervention design', 'active')],
  opportunities: [opp('com-psy-opp-1', 'Replication consortium', 'research-call', 'smith', daysAgo(5), daysAhead(30), 'Join a multi-lab replication consortium.')],
  spotlights: [spot('com-psy-spot-1', 'kovacs', 'Replication-first lab culture', 'Dr. Reka Kovacs led a 12-lab replication collaboration.', 'smith')],
  achievements: [ach('com-psy-ach-1', '12-lab consortium', '🔬', 'The community launched a 12-lab replication consortium.', 'kovacs')],
  bookmarks: [],
  trends: [trend('com-psy-trend-1', 'Replication', 86), trend('com-psy-trend-2', 'Preregistration', 75)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-05T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 20 — Ocean & Marine Science Community
// ---------------------------------------------------------------------------

const OCEAN_MARINE_SCIENCE_COMMUNITY: Community = createCommunity({
  id: 'com-ocean-marine-science',
  name: 'Ocean & Marine Science Community',
  description:
    'An open community for oceanography, marine ecology, and coastal sustainability — including community-based monitoring.',
  category: 'research',
  discipline: 'Oceanography',
  researchAreas: ['Oceanography', 'Marine Ecology', 'Coastal Erosion', 'Fisheries', 'Ocean Monitoring'],
  keywords: ['ocean', 'marine', 'coastal', 'fisheries'],
  language: 'Portuguese',
  country: 'Portugal',
  region: 'Europe',
  visibility: 'public',
  creator: 'almeida',
  creatorName: ALMEIDA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/ocean-marine-science',
  socialLinks: { twitter: 'https://twitter.com/oceancommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('rivers', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('mbatha', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('maria', 'member', '2024-05-01T09:00:00.000Z'),
    member('dube', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('almeida', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('rivers', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('tanaka', '2025-01-01T09:00:00.000Z'), follower('hussain', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-ocn-annc-1', 'Community-based monitoring pilot', 'The coastal monitoring pilot publishes its first quarterly report.', 'almeida', daysAgo(8), true),
  ],
  discussions: [
    disc('com-ocn-disc-1', 'Community-based monitoring of erosion', 'How should community observations calibrate with satellite data?', 'almeida', [
      { author: 'rivers', body: 'Ground-truth a calibration subset at each monitoring site.', createdAt: daysAgo(5) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-ocn-ques-1', 'Fisheries data sharing agreements', 'Which data-sharing agreement best protects small-scale fishers?', 'mbatha', [
      { author: 'almeida', body: 'Use community ownership models with named benefit-sharing.', createdAt: daysAgo(2), upvotes: 7 },
    ], ['fisheries', 'data-sharing'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-ocn-res-1', 'Ocean monitoring toolkit', 'research-tool', 'almeida', daysAgo(23)),
    res('com-ocn-res-2', 'Coastal observation datasets', 'dataset', 'rivers', daysAgo(44)),
  ],
  events: [
    evt('com-ocn-evt-1', 'Marine science webinar', 'webinar', 'online', daysAhead(12, 14), ['almeida', 'rivers'], 'scheduled'),
  ],
  polls: [],
  mentorships: [ment('com-ocn-ment-1', 'almeida', 'mbatha', 'Marine data management', 'active')],
  opportunities: [opp('com-ocn-opp-1', 'Coastal monitoring volunteer', 'volunteer', 'almeida', daysAgo(3), daysAhead(20), 'Volunteer for community-based coastal monitoring.')],
  spotlights: [spot('com-ocn-spot-1', 'almeida', 'Monitoring 14 coastlines', 'The community monitors 14 coastlines with 60 local observers.', 'rivers')],
  achievements: [ach('com-ocn-ach-1', '14 coastlines monitored', '🌊', 'The community monitors 14 coastlines across the region.', 'almeida')],
  bookmarks: [],
  trends: [trend('com-ocn-trend-1', 'Coastal erosion', 79), trend('com-ocn-trend-2', 'Fisheries', 63)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 21 — Energy & Sustainability Engineering Community
// ---------------------------------------------------------------------------

const ENERGY_SUSTAINABILITY_ENGINEERING_COMMUNITY: Community = createCommunity({
  id: 'com-energy-sustainability',
  name: 'Energy & Sustainability Engineering Community',
  description:
    'An open community for sustainable energy engineering — renewables, energy access, and low-carbon systems in South Asia.',
  category: 'engineering',
  discipline: 'Energy Engineering',
  researchAreas: ['Renewables', 'Energy Access', 'Low-Carbon Systems', 'Solar PV', 'Energy Policy'],
  keywords: ['energy', 'sustainability', 'renewables', 'energy-access'],
  language: 'Urdu',
  country: 'Pakistan',
  region: 'South Asia',
  visibility: 'public',
  creator: 'hussain',
  creatorName: HUSSAIN.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/energy-sustainability',
  socialLinks: { linkedin: 'https://linkedin.com/company/ese' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('adebayo', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('dube', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('yusuf', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('rivers', 'member', '2024-05-01T09:00:00.000Z'),
    member('okonkwo', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('hussain', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('adebayo', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('dube', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('maria', '2025-01-01T09:00:00.000Z'), follower('schneider', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-ese-annc-1', 'Solar access report', 'The community published its solar energy access report for the region.', 'hussain', daysAgo(6), true),
  ],
  discussions: [
    disc('com-ese-disc-1', 'Mini-grid finance models', 'Which finance models sustain community mini-grids beyond subsidy?', 'hussain', [
      { author: 'adebayo', body: 'Layered revenue models with productive-use anchors work best.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [],
  resources: [
    res('com-ese-res-1', 'Solar PV design toolkit', 'software', 'hussain', daysAgo(18), 'https://github.com/ese/toolkit'),
    res('com-ese-res-2', 'Energy access dataset', 'dataset', 'dube', daysAgo(39)),
  ],
  events: [
    evt('com-ese-evt-1', 'Energy access webinar', 'webinar', 'online', daysAhead(15, 14), ['hussain', 'adebayo'], 'scheduled'),
  ],
  polls: [poll('com-ese-poll-1', 'Which energy access gap should the community model next?', ['Rural households', 'Schools', 'Health centres'], 'hussain', daysAgo(4), 'open', { 'Rural households': 50, Schools: 25, 'Health centres': 25 })],
  mentorships: [ment('com-ese-ment-1', 'hussain', 'yusuf', 'Solar system design', 'active')],
  opportunities: [opp('com-ese-opp-1', 'Mini-grid field study', 'research-call', 'adebayo', daysAgo(5), daysAhead(35), 'Field study partnership for mini-grid sustainability.')],
  spotlights: [spot('com-ese-spot-1', 'hussain', 'Energising rural schools', 'The community solar programme electrified 80 rural schools.', 'adebayo')],
  achievements: [ach('com-ese-ach-1', '80 schools electrified', '⚡', 'The community solar programme electrified 80 rural schools.', 'hussain')],
  bookmarks: [],
  trends: [trend('com-ese-trend-1', 'Energy access', 88), trend('com-ese-trend-2', 'Mini-grids', 70)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 22 — Student Researchers of the Global South
// ---------------------------------------------------------------------------

const STUDENT_RESEARCHERS_GLOBAL_SOUTH_COMMUNITY: Community = createCommunity({
  id: 'com-student-researchers-global-south',
  name: 'Student Researchers of the Global South',
  description:
    'A student-led community for research skills, publishing guidance, scholarships, and peer support across the global south.',
  category: 'student',
  discipline: 'Multidisciplinary',
  researchAreas: ['Research Skills', 'Scholarships', 'Publishing', 'Peer Mentoring', 'Undergraduate Research'],
  keywords: ['students', 'scholarships', 'research-skills', 'global-south'],
  language: 'English',
  country: 'India',
  region: 'South Asia',
  visibility: 'public',
  creator: 'okafor',
  creatorName: OKAFOR.displayName,
  verificationStatus: 'Pending',
  website: 'https://scholatia.org/communities/student-researchers',
  socialLinks: { twitter: 'https://twitter.com/studentresearch' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('das', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-03-01T09:00:00.000Z'), member('mbatha', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('gallo', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-06-01T09:00:00.000Z'),
    member('dube', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('okafor', 'member', '2024-01-01T09:00:00.000Z'), member('ojuri', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('das', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('yusuf', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('kovacs', '2025-01-01T09:00:00.000Z'), follower('almeida', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-stu-annc-1', 'Scholarship digest', 'The monthly scholarship digest for graduate students is out.', 'okafor', daysAgo(5), true),
  ],
  discussions: [
    disc('com-stu-disc-1', 'First paper from thesis chapters', 'Should a student publish thesis chapters before defence?', 'das', [
      { author: 'okafor', body: 'Publish early — with supervisor consent — to establish priority.', createdAt: daysAgo(3) },
    ], daysAgo(8), true),
  ],
  questions: [
    ques('com-stu-ques-1', 'Applying for PhD scholarships', 'What makes a competitive PhD application in the current cycle?', 'yusuf', [
      { author: 'ojuri', body: 'A sharp research statement with named advisors wins over generic essays.', createdAt: daysAgo(2), upvotes: 14 },
    ], ['phd', 'scholarships'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-stu-res-1', 'Graduate scholarship database', 'repository', 'okafor', daysAgo(10)),
    res('com-stu-res-2', 'Research writing guides', 'teaching-material', 'das', daysAgo(25)),
  ],
  events: [
    evt('com-stu-evt-1', 'Undergraduate research showcase', 'meetup', 'hybrid', daysAhead(17, 11), ['okafor', 'das'], 'scheduled'),
  ],
  polls: [poll('com-stu-poll-1', 'Which support topic should the community cover next?', ['Thesis writing', 'Conference travel', 'Networking', 'Mentorship'], 'okafor', daysAgo(5), 'open', { 'Thesis writing': 30, 'Conference travel': 20, Networking: 25, Mentorship: 25 })],
  mentorships: [ment('com-stu-ment-1', 'ojuri', 'dube', 'Research career planning', 'active')],
  opportunities: [opp('com-stu-opp-1', 'Student paper prize', 'research-call', 'das', daysAgo(6), daysAhead(40), 'Submit your first-author paper for the community prize.')],
  spotlights: [spot('com-stu-spot-1', 'dube', 'From student to funded researcher', 'Thabo Dube secured a doctoral fellowship after community mentorship.', 'okafor')],
  achievements: [ach('com-stu-ach-1', '50 scholarships tracked', '🎓', 'The community tracked 50 open scholarship opportunities.', 'okafor')],
  bookmarks: [bm('com-stu-bm-1', 'gallo', 'com-stu-disc-1')],
  trends: [trend('com-stu-trend-1', 'Scholarships', 91), trend('com-stu-trend-2', 'PhD applications', 74)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 23 — Academic Society of Tropical Medicine
// ---------------------------------------------------------------------------

const ACADEMIC_SOCIETY_TROPICAL_MEDICINE: Community = createCommunity({
  id: 'com-academic-society-tropical-medicine',
  name: 'Academic Society of Tropical Medicine',
  description:
    'An academic society convening clinicians and researchers working on tropical medicine, global health, and infectious disease control.',
  category: 'academic-society',
  discipline: 'Medicine',
  researchAreas: ['Tropical Medicine', 'Infectious Diseases', 'Global Health', 'Vaccinology', 'Antimicrobial Resistance'],
  keywords: ['tropical-medicine', 'global-health', 'infectious-disease', 'amr'],
  language: 'English',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'public',
  creator: 'ojuri',
  creatorName: OJURI.displayName,
  verificationStatus: 'Accredited',
  website: 'https://scholatia.org/communities/academic-society-tropical-medicine',
  socialLinks: { twitter: 'https://twitter.com/astm', orcid: 'https://orcid.org/0000-0001-0000-0000' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('dube', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('adesina', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('mbatha', 'member', '2024-05-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-06-01T09:00:00.000Z'),
    member('okonkwo', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('ojuri', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('dube', 'member', '2024-01-02T09:00:00.000Z'), member('yusuf', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('hussain', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('schneider', '2025-01-01T09:00:00.000Z'), follower('maria', '2025-02-01T09:00:00.000Z'), follower('gallo', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-astm-annc-1', 'Annual congress programme', 'The annual congress programme is live — early-bird registration closes soon.', 'ojuri', daysAgo(9), true),
  ],
  discussions: [
    disc('com-astm-disc-1', 'Special issue: malaria elimination', 'Contributions are invited for the malaria elimination special issue.', 'ojuri', [
      { author: 'dube', body: 'We should foreground cross-border surveillance studies.', createdAt: daysAgo(4) },
    ], daysAgo(16), true),
  ],
  questions: [
    ques('com-astm-ques-1', 'AMR surveillance harmonisation', 'Which WHO guidance should the society endorse for AMR surveillance?', 'yusuf', [
      { author: 'ojuri', body: 'Endorse the WHO GLASS framework with national adaptation notes.', createdAt: daysAgo(3), upvotes: 9 },
    ], ['amr', 'surveillance'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-astm-res-1', 'Congress proceedings archive', 'repository', 'ojuri', daysAgo(20)),
    res('com-astm-res-2', 'AMR stewardship toolkit', 'research-tool', 'yusuf', daysAgo(33)),
  ],
  events: [
    evt('com-astm-evt-1', 'Annual congress 2026', 'conference', 'hybrid', daysAhead(30, 9), ['ojuri', 'dube', 'yusuf'], 'scheduled'),
  ],
  polls: [poll('com-astm-poll-1', 'Which theme should the 2027 congress feature?', ['Vaccinology', 'Digital health', 'AMR', 'Elimination'], 'ojuri', daysAgo(7), 'open', { Vaccinology: 30, 'Digital health': 20, AMR: 25, Elimination: 25 })],
  mentorships: [ment('com-astm-ment-1', 'ojuri', 'mbatha', 'Clinical research leadership', 'active')],
  opportunities: [opp('com-astm-opp-1', 'Tropical medicine fellowship', 'funding-call', 'dube', daysAgo(6), daysAhead(60), 'Fellowship for early-career clinicians.')],
  spotlights: [spot('com-astm-spot-1', 'yusuf', 'Antibiotic stewardship at scale', 'Folake Yusuf led stewardship campaigns reaching 900 community members.', 'ojuri')],
  achievements: [ach('com-astm-ach-1', 'Congress record turnout', '🎟️', 'The 2025 congress set a record turnout.', 'ojuri')],
  bookmarks: [],
  trends: [trend('com-astm-trend-1', 'Malaria elimination', 90), trend('com-astm-trend-2', 'AMR', 76)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 24 — Computational Linguistics Association
// ---------------------------------------------------------------------------

const COMPUTATIONAL_LINGUISTICS_ASSOCIATION: Community = createCommunity({
  id: 'com-computational-linguistics-association',
  name: 'Computational Linguistics Association',
  description:
    'An academic society for computational linguistics and natural language processing — standards, shared tasks, and community governance.',
  category: 'academic-society',
  discipline: 'Computational Linguistics',
  researchAreas: ['Parsing', 'Machine Translation', 'Language Typology', 'Evaluation', 'Corpora'],
  keywords: ['nlp', 'computational-linguistics', 'parsing', 'translation'],
  language: 'English',
  country: 'United Kingdom',
  region: 'Europe',
  visibility: 'public',
  creator: 'jscholar',
  creatorName: JSCHOLAR.displayName,
  verificationStatus: 'Trusted',
  website: 'https://scholatia.org/communities/computational-linguistics-association',
  socialLinks: { github: 'https://github.com/cla', twitter: 'https://twitter.com/cla' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('smith', 'administrator', '2023-09-01T09:00:00.000Z')],
  moderators: [member('okonkwo', 'moderator', '2024-01-10T09:00:00.000Z'), member('gallo', 'moderator', '2024-02-10T09:00:00.000Z')],
  members: [
    member('tanaka', 'contributor', '2024-03-01T09:00:00.000Z'),
    member('wang', 'member', '2024-04-01T09:00:00.000Z'),
    member('kovacs', 'member', '2024-05-01T09:00:00.000Z'),
  ],
  mentors: [member('jscholar', 'member', '2023-09-01T09:00:00.000Z')],
  experts: [member('smith', 'member', '2023-09-02T09:00:00.000Z'), member('okonkwo', 'member', '2023-09-03T09:00:00.000Z')],
  ambassadors: [member('gallo', 'member', '2023-09-04T09:00:00.000Z')],
  followers: [follower('das', '2025-01-01T09:00:00.000Z'), follower('schneider', '2025-02-01T09:00:00.000Z'), follower('almeida', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-cla-annc-1', 'Shared task announced', 'The association is co-organising a shared task on low-resource parsing for 2027.', 'jscholar', daysAgo(8), true),
  ],
  discussions: [
    disc('com-cla-disc-1', 'Evaluation standard for typologically diverse languages', 'How should the association standardise evaluation across language families?', 'jscholar', [
      { author: 'okonkwo', body: 'Publish per-family scores plus a diversity-weighted aggregate.', createdAt: daysAgo(3) },
      { author: 'smith', body: 'Include typological feature coverage in the report card.', createdAt: daysAgo(2), parentId: 'com-cla-disc-1-reply-1' },
    ], daysAgo(10), true),
  ],
  questions: [
    ques('com-cla-ques-1', 'Shared task governance', 'How should shared task baselines be governed to avoid gaming?', 'wang', [
      { author: 'jscholar', body: 'Freeze test sets, publish contamination checks, and audit top systems.', createdAt: daysAgo(4), upvotes: 8 },
    ], ['shared-tasks'], daysAgo(9), 'answered'),
  ],
  resources: [
    res('com-cla-res-1', 'Cross-lingual evaluation suite', 'software', 'okonkwo', daysAgo(90)),
    res('com-cla-res-2', 'Multilingual parsing framework', 'software', 'jscholar', daysAgo(60), 'https://github.com/cla/framework'),
  ],
  events: [
    evt('com-cla-evt-1', 'Typology and transfer seminar', 'seminar', 'hybrid', daysAgo(9, 15), ['smith', 'gallo'], 'completed'),
    evt('com-cla-evt-2', 'Shared task working session', 'workshop', 'online', daysAhead(9, 14), ['jscholar', 'okonkwo'], 'scheduled'),
  ],
  polls: [],
  mentorships: [ment('com-cla-ment-1', 'jscholar', 'gallo', 'Evaluation methodology', 'active')],
  opportunities: [opp('com-cla-opp-1', 'Shared task baselines', 'research-call', 'okonkwo', daysAgo(7), daysAhead(50), 'Contribute baselines to the 2027 shared task.')],
  spotlights: [spot('com-cla-spot-1', 'okonkwo', 'Leading African NLP standards', 'The association adopted community-led evaluation standards.', 'jscholar')],
  achievements: [ach('com-cla-ach-1', '40-language benchmark', '🌐', 'The association released a 40-language benchmark.', 'jscholar')],
  bookmarks: [bm('com-cla-bm-1', 'wang', 'com-cla-disc-1')],
  trends: [trend('com-cla-trend-1', 'Evaluation', 92), trend('com-cla-trend-2', 'Shared tasks', 77)],
  reports: [],
  warnings: [],
  createdAt: '2023-09-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 25 — Open Data & Reproducibility Community
// ---------------------------------------------------------------------------

const OPEN_DATA_REPRODUCIBILITY_COMMUNITY: Community = createCommunity({
  id: 'com-open-data-reproducibility',
  name: 'Open Data & Reproducibility Community',
  description:
    'An open community for open data practice, reproducible workflows, and research infrastructure from India and beyond.',
  category: 'open-science',
  discipline: 'Open Science',
  researchAreas: ['Open Data', 'Reproducibility', 'Research Infrastructure', 'Data Governance', 'Machine Learning'],
  keywords: ['open-data', 'reproducibility', 'infrastructure', 'data-governance'],
  language: 'Hindi',
  country: 'India',
  region: 'South Asia',
  visibility: 'public',
  creator: 'das',
  creatorName: DAS.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/open-data-reproducibility',
  socialLinks: { twitter: 'https://twitter.com/odrcommunity', github: 'https://github.com/odrcommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('jscholar', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('okafor', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('ndlovu', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('mbatha', 'member', '2024-05-01T09:00:00.000Z'),
    member('dube', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('das', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('jscholar', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('okafor', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('rivers', '2025-01-01T09:00:00.000Z'), follower('hussain', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-odr-annc-1', 'Data validation sprint', 'The community data validation sprint kicks off next week.', 'das', daysAgo(5), true),
  ],
  discussions: [
    disc('com-odr-disc-1', 'Validating community-contributed datasets', 'What validation pipeline should community datasets pass through?', 'das', [
      { author: 'jscholar', body: 'Schema checks, cross-field consistency, and sample review.', createdAt: daysAgo(3) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-odr-ques-1', 'Licensing contributed code', 'Which licence should the community apply to contributed code?', 'okafor', [
      { author: 'das', body: 'Apache-2.0 for code with CC-BY for associated data.', createdAt: daysAgo(2), upvotes: 6 },
    ], ['licensing', 'open-source'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-odr-res-1', 'Data validation harness', 'software', 'das', daysAgo(11), 'https://github.com/odrcommunity/harness'),
    res('com-odr-res-2', 'Reproducibility checklist', 'protocol', 'ndlovu', daysAgo(27)),
  ],
  events: [
    evt('com-odr-evt-1', 'Reproducibility clinic', 'workshop', 'online', daysAhead(11, 15), ['das', 'ndlovu'], 'scheduled'),
  ],
  polls: [poll('com-odr-poll-1', 'Which dataset theme should the community validate next?', ['Climate', 'Health', 'Language', 'Agriculture'], 'das', daysAgo(4), 'open', { Climate: 25, Health: 30, Language: 30, Agriculture: 15 })],
  mentorships: [ment('com-odr-ment-1', 'das', 'dube', 'Reproducible pipelines', 'active')],
  opportunities: [opp('com-odr-opp-1', 'Data governance working group', 'volunteer', 'jscholar', daysAgo(4), daysAhead(25), 'Join the data governance working group.')],
  spotlights: [spot('com-odr-spot-1', 'das', 'Validating 100 pipelines', 'The community validated its 100th reproducible pipeline.', 'jscholar')],
  achievements: [ach('com-odr-ach-1', '100 pipelines validated', '✅', 'The community validated its 100th reproducible pipeline.', 'das')],
  bookmarks: [],
  trends: [trend('com-odr-trend-1', 'Data governance', 83), trend('com-odr-trend-2', 'Validation', 71)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 26 — Mentoring Network for Indian Scholars
// ---------------------------------------------------------------------------

const MENTORING_NETWORK_INDIAN_SCHOLARS: Community = createCommunity({
  id: 'com-mentoring-network-indian-scholars',
  name: 'Mentoring Network for Indian Scholars',
  description:
    'A mentoring network connecting early-career Indian scholars with senior researchers for career and research guidance.',
  category: 'early-career',
  discipline: 'Multidisciplinary',
  researchAreas: ['Mentoring', 'Career Development', 'Research Strategy', 'Grant Writing', 'Networking'],
  keywords: ['mentoring', 'india', 'career', 'grants'],
  language: 'English',
  country: 'India',
  region: 'South Asia',
  visibility: 'public',
  creator: 'das',
  creatorName: DAS.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/mentoring-network-indian-scholars',
  socialLinks: { linkedin: 'https://linkedin.com/company/mnis' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('okafor', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('hussain', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('dube', 'member', '2024-05-01T09:00:00.000Z'),
    member('mbatha', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('das', 'member', '2024-01-01T09:00:00.000Z'), member('jscholar', 'member', '2024-01-02T09:00:00.000Z'), member('ndlovu', 'member', '2024-01-03T09:00:00.000Z')],
  experts: [member('okafor', 'member', '2024-01-04T09:00:00.000Z')],
  ambassadors: [member('hussain', 'member', '2024-01-05T09:00:00.000Z')],
  followers: [follower('gallo', '2025-01-01T09:00:00.000Z'), follower('almeida', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-mnis-annc-1', 'Mentoring pairs announced', 'The spring mentoring pairs have been matched.', 'das', daysAgo(6), true),
  ],
  discussions: [
    disc('com-mnis-disc-1', 'Navigating joint supervision', 'How should mentees approach multiple supervisors with competing priorities?', 'okafor', [
      { author: 'das', body: 'Establish a shared research agreement and meeting cadence.', createdAt: daysAgo(3) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-mnis-ques-1', 'When should I approach a senior mentor?', 'What is the right time to request a formal mentoring relationship?', 'dube', [
      { author: 'ndlovu', body: 'After you can articulate your research direction and what you need.', createdAt: daysAgo(2), upvotes: 7 },
    ], ['mentoring'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-mnis-res-1', 'Mentoring agreement template', 'teaching-material', 'das', daysAgo(15)),
  ],
  events: [
    evt('com-mnis-evt-1', 'Speed networking hour', 'meetup', 'online', daysAhead(8, 16), ['das', 'okafor'], 'scheduled'),
  ],
  polls: [],
  mentorships: [ment('com-mnis-ment-1', 'das', 'mbatha', 'Research strategy', 'active'), ment('com-mnis-ment-2', 'ndlovu', 'hussain', 'Cyber research careers', 'active')],
  opportunities: [opp('com-mnis-opp-1', 'Mentor intake', 'volunteer', 'das', daysAgo(3), daysAhead(20), 'Volunteer as a mentor for the next cohort.')],
  spotlights: [spot('com-mnis-spot-1', 'dube', 'Mentee to funded researcher', 'Thabo Dube secured a doctoral fellowship after community mentorship.', 'das')],
  achievements: [ach('com-mnis-ach-1', '300 pairs matched', '🤝', 'The network matched its 300th mentoring pair.', 'das')],
  bookmarks: [],
  trends: [trend('com-mnis-trend-1', 'Mentoring', 87), trend('com-mnis-trend-2', 'Supervision', 68)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 27 — West African Researchers Network
// ---------------------------------------------------------------------------

const WEST_AFRICAN_RESEARCHERS_NETWORK: Community = createCommunity({
  id: 'com-west-african-researchers',
  name: 'West African Researchers Network',
  description:
    'A regional community connecting researchers across West Africa — collaboration, funding intelligence, and regional data sharing.',
  category: 'regional',
  discipline: 'Multidisciplinary',
  researchAreas: ['Regional Collaboration', 'Research Funding', 'Data Sharing', 'Public Health', 'Energy', 'Education'],
  keywords: ['west-africa', 'regional', 'collaboration', 'funding'],
  language: 'English',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'public',
  creator: 'okonkwo',
  creatorName: OKONKWO.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/west-african-researchers',
  socialLinks: { twitter: 'https://twitter.com/warn', linkedin: 'https://linkedin.com/company/warn' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('ojuri', 'administrator', '2024-02-01T09:00:00.000Z'), member('adesina', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-04-01T09:00:00.000Z'), member('mbatha', 'moderator', '2024-05-01T09:00:00.000Z')],
  members: [
    member('adebayo', 'contributor', '2024-06-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-07-01T09:00:00.000Z'),
    member('ndlovu', 'member', '2024-08-01T09:00:00.000Z'),
  ],
  mentors: [member('ojuri', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('adesina', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('dube', '2025-01-01T09:00:00.000Z'), follower('rivers', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-warn-annc-1', 'Regional funding digest', 'The regional funding digest for Q3 is published.', 'okonkwo', daysAgo(5), true),
  ],
  discussions: [
    disc('com-warn-disc-1', 'Cross-border data sharing', 'What governance makes cross-border health data sharing workable?', 'ojuri', [
      { author: 'adesina', body: 'Bilateral agreements with harmonised anonymisation standards.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-warn-ques-1', 'Regional grant consortium formation', 'How do we structure a multi-country grant consortium?', 'adebayo', [
      { author: 'okonkwo', body: 'Lead agency model with clear country workstreams and budgets.', createdAt: daysAgo(3), upvotes: 5 },
    ], ['grants', 'consortia'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-warn-res-1', 'Regional funder map', 'repository', 'okonkwo', daysAgo(14)),
    res('com-warn-res-2', 'Consortium toolkit', 'teaching-material', 'adesina', daysAgo(32)),
  ],
  events: [
    evt('com-warn-evt-1', 'Regional research symposium', 'conference', 'hybrid', daysAhead(24, 9), ['okonkwo', 'ojuri', 'adesina'], 'scheduled'),
  ],
  polls: [poll('com-warn-poll-1', 'Which regional priority should the network champion?', ['Health systems', 'Energy access', 'Digital skills', 'Food security'], 'okonkwo', daysAgo(6), 'open', { 'Health systems': 35, 'Energy access': 25, 'Digital skills': 20, 'Food security': 20 })],
  mentorships: [ment('com-warn-ment-1', 'ojuri', 'hussain', 'Regional research leadership', 'active')],
  opportunities: [opp('com-warn-opp-1', 'Regional early-career forum', 'research-call', 'adesina', daysAgo(5), daysAhead(30), 'Present your research at the regional forum.')],
  spotlights: [spot('com-warn-spot-1', 'okonkwo', 'Championing regional AI capacity', 'The network funded cross-border NLP capacity building.', 'ojuri')],
  achievements: [ach('com-warn-ach-1', '12-country network', '🌍', 'The network spans 12 West African countries.', 'okonkwo')],
  bookmarks: [],
  trends: [trend('com-warn-trend-1', 'Data sharing', 81), trend('com-warn-trend-2', 'Funding', 73)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 28 — Latin American Science Community
// ---------------------------------------------------------------------------

const LATIN_AMERICAN_SCIENCE_COMMUNITY: Community = createCommunity({
  id: 'com-latin-american-science',
  name: 'Latin American Science Community',
  description:
    'A regional community for science across Latin America — multilingual collaboration, regional datasets, and visibility.',
  category: 'regional',
  discipline: 'Multidisciplinary',
  researchAreas: ['Regional Collaboration', 'Biodiversity', 'Astronomy', 'Social Sciences', 'Open Science'],
  keywords: ['latin-america', 'regional', 'spanish', 'portuguese'],
  language: 'Spanish',
  country: 'Mexico',
  region: 'Latin America',
  visibility: 'public',
  creator: 'maria',
  creatorName: MARIA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/latin-american-science',
  socialLinks: { twitter: 'https://twitter.com/lascommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('gallo', 'administrator', '2024-02-01T09:00:00.000Z'), member('almeida', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('kovacs', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('dube', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('schneider', 'member', '2024-06-01T09:00:00.000Z'),
    member('mbatha', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('maria', 'member', '2024-01-01T09:00:00.000Z'), member('gallo', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('almeida', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('kovacs', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('tanaka', '2025-01-01T09:00:00.000Z'), follower('rivers', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-las-annc-1', 'Regional data day', 'The regional open data day is scheduled for next month.', 'maria', daysAgo(7), true),
  ],
  discussions: [
    disc('com-las-disc-1', 'Multilingual publication support', 'How should the community support non-English publication venues?', 'gallo', [
      { author: 'maria', body: 'Curate a directory of regional journals with language policies.', createdAt: daysAgo(3) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-las-ques-1', 'Regional biodiversity data standards', 'Which standards make regional biodiversity data interoperable?', 'almeida', [
      { author: 'maria', body: 'Adopt Darwin Core with national extensions.', createdAt: daysAgo(4), upvotes: 5 },
    ], ['biodiversity', 'standards'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-las-res-1', 'Regional journal directory', 'repository', 'gallo', daysAgo(16)),
  ],
  events: [
    evt('com-las-evt-1', 'Regional science conference', 'conference', 'hybrid', daysAhead(28, 9), ['maria', 'gallo', 'almeida'], 'scheduled'),
  ],
  polls: [],
  mentorships: [ment('com-las-ment-1', 'gallo', 'kovacs', 'Publishing in the region', 'active')],
  opportunities: [opp('com-las-opp-1', 'Regional data sprint', 'research-call', 'almeida', daysAgo(5), daysAhead(35), 'Join the regional open data sprint.')],
  spotlights: [spot('com-las-spot-1', 'gallo', 'Amplifying regional voices', 'The community amplified regional research across 10 countries.', 'maria')],
  achievements: [ach('com-las-ach-1', '10 countries connected', '🌎', 'The community spans 10 Latin American countries.', 'maria')],
  bookmarks: [],
  trends: [trend('com-las-trend-1', 'Regional journals', 76), trend('com-las-trend-2', 'Biodiversity', 64)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 29 — East Asian Scholars Community
// ---------------------------------------------------------------------------

const EAST_ASIAN_SCHOLARS_COMMUNITY: Community = createCommunity({
  id: 'com-east-asian-scholars',
  name: 'East Asian Scholars Community',
  description:
    'A regional community for scholars across East Asia — cross-institutional collaboration, international visibility, and shared infrastructure.',
  category: 'regional',
  discipline: 'Multidisciplinary',
  researchAreas: ['Regional Collaboration', 'Engineering', 'Materials', 'Language Technology', 'International Visibility'],
  keywords: ['east-asia', 'regional', 'collaboration'],
  language: 'Chinese',
  country: 'China',
  region: 'East Asia',
  visibility: 'public',
  creator: 'wang',
  creatorName: WANG.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/east-asian-scholars',
  socialLinks: { github: 'https://github.com/eascommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('tanaka', 'administrator', '2024-02-01T09:00:00.000Z'), member('kim', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('schneider', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('adebayo', 'contributor', '2024-05-01T09:00:00.000Z'),
    member('maria', 'member', '2024-06-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-07-01T09:00:00.000Z'),
  ],
  mentors: [member('wang', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('tanaka', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('kim', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('das', '2025-01-01T09:00:00.000Z'), follower('hussain', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-eas-annc-1', 'Cross-border exchange programme', 'The exchange programme for doctoral scholars is open.', 'wang', daysAgo(6), true),
  ],
  discussions: [
    disc('com-eas-disc-1', 'Shared infrastructure access', 'How should shared instruments be allocated across institutions?', 'kim', [
      { author: 'tanaka', body: 'A federated booking registry with transparent queueing.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [],
  resources: [
    res('com-eas-res-1', 'International funding map', 'repository', 'wang', daysAgo(21)),
  ],
  events: [
    evt('com-eas-evt-1', 'Regional collaboration summit', 'conference', 'hybrid', daysAhead(26, 9), ['wang', 'tanaka', 'kim'], 'scheduled'),
  ],
  polls: [poll('com-eas-poll-1', 'Which shared facility should the community prioritise?', ['Compute', 'Characterisation', 'Translation services'], 'wang', daysAgo(5), 'open', { Compute: 40, Characterisation: 35, 'Translation services': 25 })],
  mentorships: [ment('com-eas-ment-1', 'wang', 'adebayo', 'International publishing', 'active')],
  opportunities: [opp('com-eas-opp-1', 'Exchange fellowships', 'funding-call', 'tanaka', daysAgo(4), daysAhead(45), 'Apply for cross-institution exchange fellowships.')],
  spotlights: [spot('com-eas-spot-1', 'kim', 'Leading materials research in Asia', 'The community supported a new materials research collaboration.', 'wang')],
  achievements: [ach('com-eas-ach-1', 'Federated registry live', '🔗', 'The federated shared-instrument registry went live.', 'kim')],
  bookmarks: [],
  trends: [trend('com-eas-trend-1', 'Collaboration', 79), trend('com-eas-trend-2', 'Exchange', 67)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-05T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 30 — University of Ibadan Research Community
// ---------------------------------------------------------------------------

const UNIVERSITY_IBADAN_RESEARCH_COMMUNITY: Community = createCommunity({
  id: 'com-university-ibadan-research',
  name: 'University of Ibadan Research Community',
  description:
    'The institutional research community of the University of Ibadan — cross-faculty collaboration, institutional grants, and research culture.',
  category: 'institutional',
  discipline: 'Multidisciplinary',
  researchAreas: ['Public Health', 'Tropical Medicine', 'Sciences', 'Humanities', 'Institutional Research Culture'],
  keywords: ['university-of-ibadan', 'institutional', 'research-culture'],
  language: 'English',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'institution-only',
  creator: 'ojuri',
  creatorName: OJURI.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/university-ibadan-research',
  socialLinks: { linkedin: 'https://linkedin.com/company/ui-research', orcid: 'https://orcid.org/0000-0001-0000-0000' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('okonkwo', 'administrator', '2023-05-01T09:00:00.000Z')],
  moderators: [member('adesina', 'moderator', '2023-06-01T09:00:00.000Z'), member('yusuf', 'moderator', '2023-07-01T09:00:00.000Z')],
  members: [
    member('mbatha', 'contributor', '2023-08-01T09:00:00.000Z'),
    member('hussain', 'member', '2023-09-01T09:00:00.000Z'),
    member('dube', 'member', '2023-10-01T09:00:00.000Z'),
  ],
  mentors: [member('ojuri', 'member', '2023-04-01T09:00:00.000Z')],
  experts: [member('okonkwo', 'member', '2023-04-02T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2023-04-03T09:00:00.000Z')],
  followers: [follower('maria', '2025-01-01T09:00:00.000Z'), follower('jscholar', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-ui-annc-1', 'Annual research day', 'Save the date for the university annual research day.', 'ojuri', daysAgo(18), true),
  ],
  discussions: [
    disc('com-ui-disc-1', 'Shared research instruments registry', 'Should the university maintain a shared instruments registry?', 'ojuri', [
      { author: 'okonkwo', body: 'Yes, with booking and maintenance records per instrument.', createdAt: daysAgo(6) },
    ], daysAgo(12), true),
  ],
  questions: [
    ques('com-ui-ques-1', 'Institutional ethics approval timelines', 'How can we shorten ethics approval timelines for multi-site studies?', 'yusuf', [
      { author: 'ojuri', body: 'Use the harmonised ethics template and parallel review.', createdAt: daysAgo(3), upvotes: 9 },
    ], ['ethics'], daysAgo(8), 'answered'),
  ],
  resources: [
    res('com-ui-res-1', 'Institutional grant handbook', 'teaching-material', 'ojuri', daysAgo(38)),
    res('com-ui-res-2', 'Research ethics guidance', 'protocol', 'mbatha', daysAgo(72)),
  ],
  events: [
    evt('com-ui-evt-1', 'Cross-faculty research mixer', 'meetup', 'in-person', daysAhead(19, 15), ['ojuri', 'adesina'], 'scheduled'),
  ],
  polls: [poll('com-ui-poll-1', 'Which research area should the university fund next?', ['Tropical medicine', 'AI', 'Energy', 'Humanities'], 'ojuri', daysAgo(6), 'open', { 'Tropical medicine': 40, AI: 30, Energy: 20, Humanities: 10 })],
  mentorships: [ment('com-ui-ment-1', 'ojuri', 'dube', 'Institutional leadership', 'active')],
  opportunities: [opp('com-ui-opp-1', 'Cross-faculty seed grants', 'funding-call', 'okonkwo', daysAgo(5), daysAhead(30), 'Apply for cross-faculty seed funding.')],
  spotlights: [spot('com-ui-spot-1', 'ojuri', 'Advancing medical research', 'The institute for advanced medical research opened its new centre.', 'okonkwo')],
  achievements: [ach('com-ui-ach-1', 'New centre opened', '🏥', 'The advanced medical research centre opened its doors.', 'ojuri')],
  bookmarks: [],
  trends: [trend('com-ui-trend-1', 'Research culture', 80), trend('com-ui-trend-2', 'Seed grants', 70)],
  reports: [],
  warnings: [],
  createdAt: '2023-05-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 31 — Multidisciplinary Health Systems Research
// ---------------------------------------------------------------------------

const MULTIDISCIPLINARY_HEALTH_SYSTEMS_COMMUNITY: Community = createCommunity({
  id: 'com-multidisciplinary-health-systems',
  name: 'Multidisciplinary Health Systems Research',
  description:
    'A multidisciplinary community bridging medicine, engineering, data science, and policy to strengthen health systems.',
  category: 'multidisciplinary',
  discipline: 'Health Systems',
  researchAreas: ['Health Systems', 'Digital Health', 'Health Economics', 'Health Engineering', 'Health Policy'],
  keywords: ['health-systems', 'multidisciplinary', 'digital-health', 'policy'],
  language: 'English',
  country: 'South Africa',
  region: 'Africa',
  visibility: 'public',
  creator: 'mbatha',
  creatorName: MBATHA.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/multidisciplinary-health-systems',
  socialLinks: { github: 'https://github.com/mhscommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('ojuri', 'administrator', '2024-02-01T09:00:00.000Z'), member('adebayo', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-04-01T09:00:00.000Z'), member('dube', 'moderator', '2024-05-01T09:00:00.000Z')],
  members: [
    member('okonkwo', 'contributor', '2024-06-01T09:00:00.000Z'),
    member('rivers', 'member', '2024-07-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-08-01T09:00:00.000Z'),
  ],
  mentors: [member('mbatha', 'member', '2024-01-01T09:00:00.000Z'), member('ojuri', 'member', '2024-01-02T09:00:00.000Z')],
  experts: [member('adebayo', 'member', '2024-01-03T09:00:00.000Z')],
  ambassadors: [member('dube', 'member', '2024-01-04T09:00:00.000Z')],
  followers: [follower('tanaka', '2025-01-01T09:00:00.000Z'), follower('schneider', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-mhs-annc-1', 'Health systems conference', 'The multidisciplinary health systems conference call for papers is open.', 'mbatha', daysAgo(8), true),
  ],
  discussions: [
    disc('com-mhs-disc-1', 'Bridging clinical and engineering teams', 'How do mixed teams align on outcome metrics?', 'mbatha', [
      { author: 'adebayo', body: 'Co-design the evaluation framework before prototyping.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-mhs-ques-1', 'Health economics for device rollouts', 'What economic framework fits low-resource device rollouts?', 'hussain', [
      { author: 'mbatha', body: 'Budget impact plus equity weights, not cost per QALY alone.', createdAt: daysAgo(3), upvotes: 6 },
    ], ['health-economics', 'devices'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-mhs-res-1', 'Health systems evaluation toolkit', 'research-tool', 'mbatha', daysAgo(17)),
    res('com-mhs-res-2', 'Open health systems dataset', 'dataset', 'dube', daysAgo(46)),
  ],
  events: [
    evt('com-mhs-evt-1', 'Health systems conference', 'conference', 'hybrid', daysAhead(21, 9), ['mbatha', 'ojuri', 'adebayo'], 'scheduled'),
  ],
  polls: [poll('com-mhs-poll-1', 'Which integration should the community prototype?', ['EMR interoperability', 'Supply chain analytics', 'Community dashboards'], 'mbatha', daysAgo(6), 'open', { 'EMR interoperability': 40, 'Supply chain analytics': 25, 'Community dashboards': 35 })],
  mentorships: [ment('com-mhs-ment-1', 'mbatha', 'yusuf', 'Health systems evaluation', 'active')],
  opportunities: [opp('com-mhs-opp-1', 'Health systems journal special issue', 'research-call', 'ojuri', daysAgo(6), daysAhead(40), 'Contribute to the health systems special issue.')],
  spotlights: [spot('com-mhs-spot-1', 'mbatha', 'Bridging disciplines', 'The community convened engineering and clinical teams on device rollouts.', 'ojuri')],
  achievements: [ach('com-mhs-ach-1', 'Cross-disciplinary summit', '🧩', 'The community hosted its first cross-disciplinary health summit.', 'mbatha')],
  bookmarks: [],
  trends: [trend('com-mhs-trend-1', 'Interoperability', 82), trend('com-mhs-trend-2', 'Devices', 65)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 32 — Pharmaceutical & Health Sciences Community
// ---------------------------------------------------------------------------

const PHARMACEUTICAL_HEALTH_SCIENCES_COMMUNITY: Community = createCommunity({
  id: 'com-pharmaceutical-health-sciences',
  name: 'Pharmaceutical & Health Sciences Community',
  description:
    'An open community for pharmaceutical sciences, clinical pharmacology, and health sciences education.',
  category: 'health-sciences',
  discipline: 'Pharmaceutical Sciences',
  researchAreas: ['Pharmacology', 'Drug Discovery', 'Clinical Trials', 'Pharmacy Practice', 'Antimicrobial Stewardship'],
  keywords: ['pharmaceutical', 'pharmacology', 'clinical-trials', 'stewardship'],
  language: 'Arabic',
  country: 'Nigeria',
  region: 'West Africa',
  visibility: 'public',
  creator: 'yusuf',
  creatorName: YUSUF.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/pharmaceutical-health-sciences',
  socialLinks: { twitter: 'https://twitter.com/pharmacycommunity', orcid: 'https://orcid.org/0000-0002-0000-0000' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('ojuri', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('dube', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('okonkwo', 'member', '2024-05-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('yusuf', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('ojuri', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('schneider', '2025-01-01T09:00:00.000Z'), follower('maria', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-phs-annc-1', 'Antimicrobial stewardship week', 'The community is running an antimicrobial stewardship awareness week.', 'yusuf', daysAgo(6), true),
  ],
  discussions: [
    disc('com-phs-disc-1', 'Clinical trial transparency', 'How should the community push for trial registration in the region?', 'yusuf', [
      { author: 'ojuri', body: 'Advocate for registration as a precondition for ethics approval.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-phs-ques-1', 'Bioequivalence for locally manufactured generics', 'Which regulatory path supports local generics manufacture?', 'hussain', [
      { author: 'yusuf', body: 'Follow the regional pharmacopoeia with shared bioequivalence hubs.', createdAt: daysAgo(2), upvotes: 7 },
    ], ['generics', 'regulation'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-phs-res-1', 'Stewardship toolkit', 'research-tool', 'yusuf', daysAgo(13)),
    res('com-phs-res-2', 'Clinical pharmacology lecture series', 'teaching-material', 'ojuri', daysAgo(35)),
  ],
  events: [
    evt('com-phs-evt-1', 'Clinical pharmacology webinar', 'webinar', 'online', daysAhead(10, 14), ['yusuf', 'ojuri'], 'scheduled'),
  ],
  polls: [poll('com-phs-poll-1', 'Which stewardship target should the community lead with?', ['Antibiotic counselling', 'Prescribing audits', 'Community awareness'], 'yusuf', daysAgo(5), 'open', { 'Antibiotic counselling': 35, 'Prescribing audits': 30, 'Community awareness': 35 })],
  mentorships: [ment('com-phs-ment-1', 'yusuf', 'dube', 'Clinical trials', 'active')],
  opportunities: [opp('com-phs-opp-1', 'Pharmacy residency mentorship', 'volunteer', 'mbatha', daysAgo(4), daysAhead(25), 'Mentor pharmacy residents.')],
  spotlights: [spot('com-phs-spot-1', 'yusuf', 'Stewardship at scale', 'Folake Yusuf led stewardship campaigns reaching 900 community members.', 'ojuri')],
  achievements: [ach('com-phs-ach-1', 'Stewardship week', '💊', 'The community ran its first antimicrobial stewardship week.', 'yusuf')],
  bookmarks: [],
  trends: [trend('com-phs-trend-1', 'Stewardship', 85), trend('com-phs-trend-2', 'Clinical trials', 69)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 33 — Educational Technology & Pedagogy Community
// ---------------------------------------------------------------------------

const EDUCATIONAL_TECHNOLOGY_PEDAGOGY_COMMUNITY: Community = createCommunity({
  id: 'com-educational-technology-pedagogy',
  name: 'Educational Technology & Pedagogy Community',
  description:
    'An open community for educational technology, learning design, and evidence-based pedagogy.',
  category: 'educational',
  discipline: 'Education',
  researchAreas: ['Educational Technology', 'Learning Design', 'Assessment', 'Open Education', 'Digital Pedagogy'],
  keywords: ['edtech', 'pedagogy', 'learning-design', 'open-education'],
  language: 'English',
  country: 'United Kingdom',
  region: 'Europe',
  visibility: 'public',
  creator: 'smith',
  creatorName: SMITH.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/educational-technology',
  socialLinks: { twitter: 'https://twitter.com/edtechcommunity' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('jscholar', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('kovacs', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('gallo', 'contributor', '2024-04-01T09:00:00.000Z'),
    member('okafor', 'member', '2024-05-01T09:00:00.000Z'),
    member('hussain', 'member', '2024-06-01T09:00:00.000Z'),
  ],
  mentors: [member('smith', 'member', '2024-01-01T09:00:00.000Z')],
  experts: [member('jscholar', 'member', '2024-01-02T09:00:00.000Z')],
  ambassadors: [member('okafor', 'member', '2024-01-03T09:00:00.000Z')],
  followers: [follower('maria', '2025-01-01T09:00:00.000Z'), follower('dube', '2025-02-01T09:00:00.000Z')],
  announcements: [
    annc('com-edt-annc-1', 'Learning design sprint', 'The learning design sprint registration is open.', 'smith', daysAgo(5), true),
  ],
  discussions: [
    disc('com-edt-disc-1', 'AI in assessment', 'How should the community approach AI-assisted assessment tools?', 'smith', [
      { author: 'jscholar', body: 'Pilot with transparent rubric mapping and human review.', createdAt: daysAgo(4) },
    ], daysAgo(9), true),
  ],
  questions: [
    ques('com-edt-ques-1', 'Open textbook authoring platforms', 'Which platform supports collaborative open textbook authoring?', 'okafor', [
      { author: 'smith', body: 'Versioned platforms with accessibility-first tooling work best.', createdAt: daysAgo(3), upvotes: 6 },
    ], ['open-education'], daysAgo(7), 'answered'),
  ],
  resources: [
    res('com-edt-res-1', 'Learning design templates', 'teaching-material', 'smith', daysAgo(15)),
    res('com-edt-res-2', 'Open education resource registry', 'repository', 'jscholar', daysAgo(38)),
  ],
  events: [
    evt('com-edt-evt-1', 'Digital pedagogy seminar', 'seminar', 'online', daysAhead(12, 15), ['smith', 'jscholar'], 'scheduled'),
  ],
  polls: [poll('com-edt-poll-1', 'Which topic should the next workshop cover?', ['Assessment design', 'Accessibility', 'AI tutors'], 'smith', daysAgo(4), 'open', { 'Assessment design': 40, Accessibility: 30, 'AI tutors': 30 })],
  mentorships: [ment('com-edt-ment-1', 'smith', 'okafor', 'Learning design', 'active')],
  opportunities: [opp('com-edt-opp-1', 'Open textbook contribution', 'research-call', 'jscholar', daysAgo(5), daysAhead(40), 'Contribute chapters to an open textbook.')],
  spotlights: [spot('com-edt-spot-1', 'smith', 'Opening the curriculum', 'The community released its first open textbook.', 'jscholar')],
  achievements: [ach('com-edt-ach-1', 'First open textbook', '📖', 'The community published its first open textbook.', 'smith')],
  bookmarks: [],
  trends: [trend('com-edt-trend-1', 'Assessment', 78), trend('com-edt-trend-2', 'Open education', 71)],
  reports: [],
  warnings: [],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Community 34 — Mentorship Network for African Scholars
// ---------------------------------------------------------------------------

const MENTORSHIP_NETWORK_AFRICAN_SCHOLARS: Community = createCommunity({
  id: 'com-mentorship-network-african-scholars',
  name: 'Mentorship Network for African Scholars',
  description:
    'A pan-African mentorship network pairing early-career scholars with established researchers across disciplines.',
  category: 'early-career',
  discipline: 'Multidisciplinary',
  researchAreas: ['Mentoring', 'Career Development', 'Research Strategy', 'Publishing', 'Leadership'],
  keywords: ['mentorship', 'africa', 'early-career', 'leadership'],
  language: 'English',
  country: 'South Africa',
  region: 'Africa',
  visibility: 'public',
  creator: 'ndlovu',
  creatorName: NDLOVU.displayName,
  verificationStatus: 'Verified',
  website: 'https://scholatia.org/communities/mentorship-network-african-scholars',
  socialLinks: { linkedin: 'https://linkedin.com/company/mnas' },
  rules: DEFAULT_RULES,
  codeOfConduct: DEFAULT_CODE_OF_CONDUCT,
  administrators: [member('ojuri', 'administrator', '2024-02-01T09:00:00.000Z'), member('mbatha', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-04-01T09:00:00.000Z'), member('dube', 'moderator', '2024-05-01T09:00:00.000Z')],
  members: [
    member('okonkwo', 'contributor', '2024-06-01T09:00:00.000Z'),
    member('adesina', 'member', '2024-07-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-08-01T09:00:00.000Z'),
  ],
  mentors: [member('ndlovu', 'member', '2024-01-01T09:00:00.000Z'), member('ojuri', 'member', '2024-01-02T09:00:00.000Z'), member('maria', 'member', '2024-01-03T09:00:00.000Z'), member('smith', 'member', '2024-01-04T09:00:00.000Z')],
  experts: [member('okonkwo', 'member', '2024-01-05T09:00:00.000Z')],
  ambassadors: [member('mbatha', 'member', '2024-01-06T09:00:00.000Z')],
  followers: [follower('hussain', '2025-01-01T09:00:00.000Z'), follower('rivers', '2025-02-01T09:00:00.000Z'), follower('almeida', '2025-03-01T09:00:00.000Z')],
  announcements: [
    annc('com-mnas-annc-1', 'Mentor matching round', 'The pan-African mentor matching round opens today.', 'ndlovu', daysAgo(4), true),
  ],
  discussions: [
    disc('com-mnas-disc-1', 'Retaining scholars in the region', 'What structural support keeps early-career scholars in the region?', 'ndlovu', [
      { author: 'ojuri', body: 'Named fellowships and sabbatical exchange programmes.', createdAt: daysAgo(3) },
      { author: 'mbatha', body: 'Regional hubs with joint supervision.', createdAt: daysAgo(2), parentId: 'com-mnas-disc-1-reply-1' },
    ], daysAgo(8), true),
  ],
  questions: [
    ques('com-mnas-ques-1', 'Regional supervision models', 'How do we make cross-institution supervision practical?', 'adesina', [
      { author: 'ndlovu', body: 'Co-supervision agreements with shared milestones work best.', createdAt: daysAgo(2), upvotes: 8 },
    ], ['supervision', 'regional'], daysAgo(6), 'answered'),
  ],
  resources: [
    res('com-mnas-res-1', 'Mentorship handbook', 'teaching-material', 'ndlovu', daysAgo(20)),
  ],
  events: [
    evt('com-mnas-evt-1', 'Pan-African mentoring summit', 'conference', 'hybrid', daysAhead(23, 9), ['ndlovu', 'ojuri', 'maria'], 'scheduled'),
  ],
  polls: [poll('com-mnas-poll-1', 'Which mentoring format should the network scale?', ['One-to-one', 'Circles', 'Flash mentoring'], 'ndlovu', daysAgo(5), 'open', { 'One-to-one': 45, Circles: 30, 'Flash mentoring': 25 })],
  mentorships: [ment('com-mnas-ment-1', 'ndlovu', 'adesina', 'Research leadership', 'active'), ment('com-mnas-ment-2', 'maria', 'gallo', 'Field research', 'active')],
  opportunities: [opp('com-mnas-opp-1', 'Regional sabbatical exchange', 'funding-call', 'ojuri', daysAgo(5), daysAhead(45), 'Apply for a regional sabbatical exchange.')],
  spotlights: [spot('com-mnas-spot-1', 'mbatha', 'Growing African genomics leaders', 'The network matched 300 mentoring pairs across the continent.', 'ndlovu')],
  achievements: [ach('com-mnas-ach-1', '300 pairs matched', '🤝', 'The network matched its 300th mentoring pair.', 'ndlovu')],
  bookmarks: [],
  trends: [trend('com-mnas-trend-1', 'Retention', 83), trend('com-mnas-trend-2', 'Co-supervision', 74)],
  reports: [],
  warnings: [],
  createdAt: '2024-01-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Derived aggregates — statistics, analytics, insights, portfolio
// ---------------------------------------------------------------------------

export const COMMUNITIES: Community[] = [
  OPEN_SCIENCE_COMMUNITY,
  AFRICAN_NLP_RESEARCH_COMMUNITY,
  EARLY_CAREER_RESEARCHERS_NETWORK,
  WOMEN_IN_SCIENCE_RESEARCH,
  GLOBAL_AI_RESEARCHERS_COMMUNITY,
  PUBLIC_HEALTH_RESEARCH_COMMUNITY,
  CLIMATE_CHANGE_RESEARCHERS_COMMUNITY,
  ENGINEERING_INNOVATION_COMMUNITY,
  DIGITAL_HUMANITIES_COMMUNITY,
  ECONOMICS_SOCIAL_POLICY_FORUM,
  BIOINFORMATICS_COMPUTATIONAL_BIOLOGY_COMMUNITY,
  ROBOTICS_AUTOMATION_COMMUNITY,
  QUANTUM_COMPUTING_RESEARCHERS_COMMUNITY,
  ASTRONOMY_ASTROPHYSICS_COMMUNITY,
  MATERIALS_SCIENCE_COMMUNITY,
  CYBERSECURITY_RESEARCH_COMMUNITY,
  AGRICULTURAL_SCIENCE_FOOD_SYSTEMS_COMMUNITY,
  LANGUAGE_DOCUMENTATION_LINGUISTICS_COMMUNITY,
  PSYCHOLOGY_BEHAVIOURAL_SCIENCE_COMMUNITY,
  OCEAN_MARINE_SCIENCE_COMMUNITY,
  ENERGY_SUSTAINABILITY_ENGINEERING_COMMUNITY,
  STUDENT_RESEARCHERS_GLOBAL_SOUTH_COMMUNITY,
  ACADEMIC_SOCIETY_TROPICAL_MEDICINE,
  COMPUTATIONAL_LINGUISTICS_ASSOCIATION,
  OPEN_DATA_REPRODUCIBILITY_COMMUNITY,
  MENTORING_NETWORK_INDIAN_SCHOLARS,
  WEST_AFRICAN_RESEARCHERS_NETWORK,
  LATIN_AMERICAN_SCIENCE_COMMUNITY,
  EAST_ASIAN_SCHOLARS_COMMUNITY,
  UNIVERSITY_IBADAN_RESEARCH_COMMUNITY,
  MULTIDISCIPLINARY_HEALTH_SYSTEMS_COMMUNITY,
  PHARMACEUTICAL_HEALTH_SCIENCES_COMMUNITY,
  EDUCATIONAL_TECHNOLOGY_PEDAGOGY_COMMUNITY,
  MENTORSHIP_NETWORK_AFRICAN_SCHOLARS,
];

export const COMMUNITY_STATISTICS: CommunityStatistics = communityStatistics(COMMUNITIES);
export const COMMUNITY_ANALYTICS: CommunityAnalytics = communityAnalytics(COMMUNITIES);
export const COMMUNITY_INSIGHTS: CommunityInsight[] = communityInsights(COMMUNITIES);
export const COMMUNITY_PORTFOLIO: CommunityPortfolio = buildCommunityPortfolio(COMMUNITIES, { top: 6 });

export const FEATURED_COMMUNITIES = COMMUNITY_PORTFOLIO.featured;
export const TRENDING_COMMUNITIES = COMMUNITY_PORTFOLIO.trending;
export const CURRENT_COMMUNITIES_USER = CURRENT_USER;
export const DEFAULT_COMMUNITY_CATEGORY = 'research' as const;
export const DEFAULT_COMMUNITY_VISIBILITY: Community['visibility'] = 'public';
export const DEFAULT_COMMUNITY = OPEN_SCIENCE_COMMUNITY;

export const COMMUNITY_COUNTRIES = Array.from(new Set(COMMUNITIES.map((community) => community.country))).sort();
export const COMMUNITY_LANGUAGES = Array.from(new Set(COMMUNITIES.map((community) => community.language))).sort();
export const COMMUNITY_DISCIPLINES = Array.from(new Set(COMMUNITIES.map((community) => community.discipline))).sort();
export const COMMUNITY_RESEARCH_AREAS = Array.from(new Set(COMMUNITIES.flatMap((community) => community.researchAreas))).sort();
export const COMMUNITY_KEYWORDS = Array.from(new Set(COMMUNITIES.flatMap((community) => community.keywords))).sort();

export const COMMUNITY_CATEGORY_OPTIONS = COMMUNITY_CATEGORIES;
export const COMMUNITY_VISIBILITY_OPTIONS = COMMUNITY_VISIBILITIES;

export type {
  CommunityAchievement,
  CommunityAnnouncement,
  CommunityAnswer,
  CommunityBookmark,
  CommunityDiscussion,
  CommunityEvent,
  CommunityFollower,
  CommunityMember,
  CommunityMentorship,
  CommunityOpportunity,
  CommunityPoll,
  CommunityQuestion,
  CommunityReport,
  CommunityResource,
  CommunitySpotlight,
  CommunityTrend,
  CommunityWarning,
};
