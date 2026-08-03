import type {
  Group,
  GroupAnnouncement,
  GroupDiscussion,
  GroupEvent,
  GroupMedia,
  GroupMember,
  GroupProject,
  GroupPublication,
  GroupResource,
  GroupVisibility,
} from '@/types/groups';
import type { GroupAnalytics, GroupInsight, GroupPortfolio, GroupStatistics } from '@/types/groups';
import { GROUP_CATEGORIES, GROUP_VISIBILITIES } from '@/types/groups';
import {
  buildGroupPortfolio,
  createGroup,
  groupAnalytics,
  groupInsights,
  groupStatistics,
} from '@/lib/groups';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';

/**
 * Placeholder data for the Scholatia Academic Groups Foundation (Phase 2.2G
 * Part 1).
 *
 * The groups graph owns no external records: members and creators reference
 * canonical researchers by `username`, the owning institution references
 * canonical institutions by `institutionId`, and publications and projects may
 * reference canonical source records (projects, research, collaboration
 * workspaces, grants, conferences, journals) through `sourceId` +
 * `sourceEntity`. Statistics, analytics, insights, and the portfolio are all
 * derived from the typed group graph by the pure engine in `lib/groups.ts`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-01T12:00:00.000Z');

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
const DUBE = researcherOf('dube');
const RIVERS = researcherOf('rivers');
const KIM = researcherOf('kim');
const SCHNEIDER = researcherOf('schneider');
const ADESINA = researcherOf('adesina');
const WANG = researcherOf('wang');
const KOVACS = researcherOf('kovacs');
const ALMEIDA = researcherOf('almeida');
const NDLOVU = researcherOf('ndlovu');
const YUSUF = researcherOf('yusuf');

/** A member identified by canonical researcher username. */
function member(username: string, role: GroupMember['role'], joinedAt = '2025-06-01T09:00:00.000Z'): GroupMember {
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

/** Collection builders. `groupId` is stamped by `createGroup` at construction. */
function pub(
  id: string,
  title: string,
  type: GroupPublication['type'],
  status: GroupPublication['status'],
  authors: string[],
  publishedAt?: string,
  sourceId?: string,
  sourceEntity?: GroupPublication['sourceEntity'],
): GroupPublication {
  return { id, groupId: '', title, type, status, authors, sourceId, sourceEntity, publishedAt };
}

function evt(
  id: string,
  title: string,
  type: GroupEvent['type'],
  mode: GroupEvent['mode'],
  scheduledAt: string,
  speakers: string[],
  status: GroupEvent['status'],
  description?: string,
): GroupEvent {
  return { id, groupId: '', title, type, mode, scheduledAt, speakers, status, description };
}

function res(
  id: string,
  title: string,
  type: GroupResource['type'],
  contributor: string,
  addedAt = daysAgo(20),
  url?: string,
): GroupResource {
  return { id, groupId: '', title, type, contributor, addedAt, url };
}

function disc(
  id: string,
  title: string,
  body: string,
  author: string,
  replies: { author: string; body: string; createdAt: string }[],
  createdAt = daysAgo(6),
  pinned = false,
): GroupDiscussion {
  return {
    id,
    groupId: '',
    title,
    body,
    author,
    authorName: researcherOf(author).displayName,
    status: 'open',
    pinned,
    replies: replies.map((reply, index) => ({
      id: `${id}-reply-${index + 1}`,
      discussionId: id,
      author: reply.author,
      authorName: researcherOf(reply.author).displayName,
      body: reply.body,
      createdAt: reply.createdAt,
    })),
    createdAt,
  };
}

function annc(id: string, title: string, body: string, author: string, createdAt = daysAgo(3), pinned = false): GroupAnnouncement {
  return {
    id,
    groupId: '',
    title,
    body,
    author,
    authorName: researcherOf(author).displayName,
    pinned,
    createdAt,
  };
}

function proj(
  id: string,
  title: string,
  description: string,
  members: string[],
  status: GroupProject['status'],
  sourceId?: string,
  sourceEntity?: GroupProject['sourceEntity'],
  startedAt = daysAgo(90),
): GroupProject {
  return { id, groupId: '', title, description, members, status, sourceId, sourceEntity, startedAt, updatedAt: daysAgo(2) };
}

function med(id: string, kind: GroupMedia['kind'], title: string, uploadedBy: string, uploadedAt = daysAgo(15), url?: string): GroupMedia {
  return { id, groupId: '', kind, title, uploadedBy, uploadedAt, url };
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

// ---------------------------------------------------------------------------
// Group 1 — West African Health Consortium
// ---------------------------------------------------------------------------

const WEST_AFRICAN_HEALTH_CONSORTIUM: Group = createGroup({
  id: 'grp-west-african-health-consortium',
  name: 'West African Health Consortium',
  description:
    'A multi-site consortium driving malaria elimination, maternal health, and infectious disease surveillance across four West African states.',
  category: 'research-group',
  visibility: 'public',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Department of Public Health',
  country: 'Nigeria',
  discipline: 'Public Health',
  researchAreas: ['Infectious Disease Epidemiology', 'Malaria Elimination', 'Maternal Health', 'Disease Surveillance'],
  keywords: ['malaria', 'maternal-health', 'surveillance', 'tropical-medicine'],
  website: 'https://scholatia.org/groups/west-african-health-consortium',
  email: 'whc@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/whc', linkedin: 'https://linkedin.com/company/whc', orcid: 'https://orcid.org/0000-0001-0000-0000' },
  verificationStatus: 'Verified',
  administrators: [member('okonkwo', 'administrator', '2024-03-02T10:00:00.000Z'), member('dube', 'administrator', '2024-04-01T09:00:00.000Z')],
  moderators: [member('adesina', 'moderator', '2024-05-01T09:00:00.000Z'), member('yusuf', 'moderator', '2024-06-01T09:00:00.000Z')],
  members: [
    member('jscholar', 'member', '2024-07-01T09:00:00.000Z'),
    member('maria', 'member', '2025-01-15T09:00:00.000Z'),
    member('mbatha', 'member', '2025-02-10T09:00:00.000Z'),
    member('gallo', 'guest', '2025-03-12T09:00:00.000Z'),
    member('hussain', 'visitor', '2025-04-05T09:00:00.000Z'),
  ],
  publications: [
    pub('grp-wafric-pub-1', 'Seasonal malaria surveillance across state borders', 'article', 'published', ['ojuri', 'okonkwo', 'yusuf'], '2026-03-15T00:00:00.000Z', 'publication', 'publication'),
    pub('grp-wafric-pub-2', 'Maternal health cohort: baseline findings', 'report', 'in-review', ['ojuri', 'adesina', 'dube'], undefined, 'report', 'report'),
    pub('grp-wafric-pub-3', 'District-level surveillance dataset 2025', 'dataset', 'published', ['okonkwo', 'mbatha'], '2026-01-20T00:00:00.000Z', 'dataset', 'dataset'),
  ],
  events: [
    evt('grp-wafric-evt-1', 'Quarterly consortium sync', 'meeting', 'hybrid', daysAhead(5, 15), ['ojuri', 'okonkwo'], 'scheduled', 'Field data update and grant renewal timeline.'),
    evt('grp-wafric-evt-2', 'Community engagement workshop', 'workshop', 'in-person', daysAgo(12, 13), ['ojuri', 'adesina'], 'completed'),
    evt('grp-wafric-evt-3', 'Surveillance methods journal club', 'journal-club', 'online', daysAgo(28, 16), ['dube', 'maria'], 'completed'),
  ],
  resources: [
    res('grp-wafric-res-1', 'Surveillance protocol v3', 'document', 'ojuri', daysAgo(10)),
    res('grp-wafric-res-2', 'District health open dataset', 'dataset', 'okonkwo', daysAgo(30)),
    res('grp-wafric-res-3', 'Field data collection guideline', 'guideline', 'adesina', daysAgo(45)),
  ],
  discussions: [
    disc('grp-wafric-disc-1', 'Sampling strategy for rural clinics', 'How should we stratify the sample across rural and peri-urban clinics to keep estimates stable?', 'ojuri', [
      { author: 'okonkwo', body: 'Stratify by catchment population and oversample the smallest sites.', createdAt: daysAgo(5) },
      { author: 'mbatha', body: 'The protocol annex supports weighting; I can draft the weights.', createdAt: daysAgo(4) },
    ]),
    disc('grp-wafric-disc-2', 'Grant renewal evidence pack', 'What evidence should the renewal dossier foreground?', 'okonkwo', [{ author: 'ojuri', body: 'Lead with the seasonal surveillance trends and clinic coverage.', createdAt: daysAgo(2) }], daysAgo(7)),
  ],
  announcements: [
    annc('grp-wafric-annc-1', 'Grant renewal submitted', 'The renewal evidence pack was submitted to the national research council.', 'ojuri', daysAgo(2), true),
    annc('grp-wafric-annc-2', 'Welcome new members', 'Please join us in welcoming Dr. Bongani Ndlovu to the surveillance workstream.', 'okonkwo', daysAgo(20)),
  ],
  projects: [
    proj('grp-wafric-proj-1', 'Malaria Elimination Consortium', 'Multi-site malaria elimination research consortium.', ['ojuri', 'okonkwo', 'dube', 'mbatha'], 'active', 'grant-malaria-consortium', 'project'),
  ],
  media: [
    med('grp-wafric-med-1', 'image', 'Field sites overview', 'ojuri'),
    med('grp-wafric-med-2', 'presentation', 'Q2 consortium update', 'okonkwo'),
  ],
  createdAt: '2024-03-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 2 — Multilingual NLP Research Group
// ---------------------------------------------------------------------------

const MULTILINGUAL_NLP_RESEARCH_GROUP: Group = createGroup({
  id: 'grp-multilingual-nlp-research',
  name: 'Multilingual NLP Research Group',
  description:
    'An open research group building parsing, translation, and representation models for low-resource and typologically diverse languages.',
  category: 'research-group',
  visibility: 'public',
  owner: 'jscholar',
  ownerName: JSCHOLAR.displayName,
  institution: 'Institute for Computational Linguistics',
  department: 'Computational Linguistics',
  country: 'United Kingdom',
  discipline: 'Computational Linguistics',
  researchAreas: ['Multilingual Parsing', 'Low-Resource Machine Translation', 'Cross-Lingual Transfer', 'Language Typology'],
  keywords: ['nlp', 'low-resource', 'machine-translation', 'parsing'],
  website: 'https://scholatia.org/groups/multilingual-nlp-research',
  email: 'mnlp@scholatia.org',
  socialLinks: { github: 'https://github.com/mnlp', orcid: 'https://orcid.org/0000-0002-0000-0000' },
  verificationStatus: 'Verified',
  administrators: [member('smith', 'administrator', '2023-09-01T09:00:00.000Z')],
  moderators: [member('okonkwo', 'moderator', '2024-01-10T09:00:00.000Z')],
  members: [
    member('tanaka', 'member', '2024-02-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-03-01T09:00:00.000Z'),
    member('wang', 'member', '2024-04-01T09:00:00.000Z'),
    member('kovacs', 'guest', '2024-05-01T09:00:00.000Z'),
  ],
  publications: [
    pub('grp-mnlp-pub-1', 'Multilingual representations for cross-lingual transfer', 'article', 'published', ['jscholar', 'gallo'], '2025-08-10T00:00:00.000Z', 'multilingual-parsing-framework', 'research'),
    pub('grp-mnlp-pub-2', 'Benchmarking transfer across 40 languages', 'proceeding', 'published', ['jscholar', 'okonkwo'], '2025-06-20T00:00:00.000Z', 'cross-lingual-evaluation-benchmark', 'project'),
    pub('grp-mnlp-pub-3', 'Low-resource MT for African languages', 'preprint', 'in-review', ['okonkwo', 'jscholar', 'gallo'], undefined, 'low-resource-language-toolkit', 'project'),
  ],
  events: [
    evt('grp-mnlp-evt-1', 'Multilingual parsing working session', 'workshop', 'online', daysAhead(9, 14), ['jscholar', 'okonkwo'], 'scheduled'),
    evt('grp-mnlp-evt-2', 'Typology and transfer seminar', 'seminar', 'hybrid', daysAgo(9, 15), ['smith', 'gallo'], 'completed'),
  ],
  resources: [
    res('grp-mnlp-res-1', 'Low-resource language toolkit', 'software', 'jscholar', daysAgo(60), 'https://github.com/mnlp/toolkit'),
    res('grp-mnlp-res-2', 'Cross-lingual evaluation suite', 'dataset', 'okonkwo', daysAgo(90)),
  ],
  discussions: [
    disc('grp-mnlp-disc-1', 'Adaptation sets for tonal languages', 'Do current adaptation sets handle tone-marked orthographies reliably?', 'gallo', [
      { author: 'jscholar', body: 'Our pilot suggests normalising diacritics before tokenisation.', createdAt: daysAgo(3) },
    ]),
  ],
  announcements: [annc('grp-mnlp-annc-1', 'Shared task announced', 'The group is co-organising a shared task on low-resource parsing for 2027.', 'jscholar', daysAgo(8), true)],
  projects: [
    proj('grp-mnlp-proj-1', 'Multilingual Parsing Framework', 'Canonical parsing framework used across the module.', ['jscholar', 'gallo', 'okonkwo'], 'active', 'multilingual-parsing-framework', 'project'),
    proj('grp-mnlp-proj-2', 'Endangered Language Speech Archive', 'Documentation and speech modelling for endangered languages.', ['jscholar', 'kovacs'], 'planning', 'endangered-language-speech', 'project'),
  ],
  media: [med('grp-mnlp-med-1', 'presentation', 'Transfer learning across 40 languages', 'jscholar')],
  createdAt: '2023-09-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 3 — African Languages Technology Collective
// ---------------------------------------------------------------------------

const AFRICAN_LANGUAGES_TECHNOLOGY_COLLECTIVE: Group = createGroup({
  id: 'grp-african-languages-collective',
  name: 'African Languages Technology Collective',
  description:
    'A professional network advancing technology, corpora, and models for the hundreds of languages spoken across Africa.',
  category: 'professional-network',
  visibility: 'public',
  owner: 'okonkwo',
  ownerName: OKONKWO.displayName,
  institution: 'Obafemi Awolowo University',
  institutionId: 'INST-OAU-003',
  department: 'Department of Computer Science and Engineering',
  country: 'Nigeria',
  discipline: 'Artificial Intelligence',
  researchAreas: ['African Language Technology', 'Language Modelling', 'Speech Recognition', 'Machine Translation'],
  keywords: ['african-languages', 'yoruba', 'corpora', 'language-technology'],
  website: 'https://scholatia.org/groups/african-languages-collective',
  email: 'collective@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/afrilangtech', github: 'https://github.com/afrilangtech' },
  verificationStatus: 'Verified',
  administrators: [member('jscholar', 'administrator', '2024-02-01T09:00:00.000Z'), member('ndlovu', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('mbatha', 'member', '2024-05-01T09:00:00.000Z'),
    member('ojuri', 'member', '2024-06-01T09:00:00.000Z'),
    member('almeida', 'member', '2024-07-01T09:00:00.000Z'),
    member('tanaka', 'guest', '2025-01-10T09:00:00.000Z'),
  ],
  publications: [
    pub('grp-afri-pub-1', 'Yoruba language modelling: corpora and baselines', 'article', 'published', ['okonkwo', 'jscholar'], '2026-02-01T00:00:00.000Z', 'low-resource-language-toolkit', 'project'),
    pub('grp-afri-pub-2', 'Benchmarks for African language understanding', 'proceeding', 'in-review', ['okonkwo', 'gallo', 'ndlovu'], undefined),
  ],
  events: [
    evt('grp-afri-evt-1', 'African Language Technology Forum 2026', 'conference', 'hybrid', daysAhead(18, 9), ['okonkwo', 'jscholar', 'gallo'], 'scheduled', 'Annual gathering of the language technology community.'),
    evt('grp-afri-evt-2', 'Corpus annotation sprint', 'workshop', 'online', daysAgo(6, 11), ['okonkwo', 'ndlovu'], 'completed'),
  ],
  resources: [res('grp-afri-res-1', 'Annotated African corpora index', 'dataset', 'okonkwo', daysAgo(40)), res('grp-afri-res-2', 'Community annotation guidelines', 'guideline', 'gallo', daysAgo(70))],
  discussions: [disc('grp-afri-disc-1', 'Dialectal coverage strategy', 'How should the collective prioritise dialectal variants in corpora?', 'okonkwo', [{ author: 'mbatha', body: 'Start with the largest speech communities per region.', createdAt: daysAgo(4) }])],
  announcements: [annc('grp-afri-annc-1', 'Forum call for papers open', 'Submissions are open for the 2026 African Language Technology Forum.', 'okonkwo', daysAgo(12), true)],
  projects: [proj('grp-afri-proj-1', 'Low-Resource Language Toolkit', 'Open-source tools and corpora for under-resourced languages.', ['okonkwo', 'jscholar', 'gallo'], 'active', 'low-resource-language-toolkit', 'project')],
  media: [med('grp-afri-med-1', 'image', 'Forum 2025 highlights', 'okonkwo')],
  createdAt: '2024-01-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 4 — Energy Systems & Smart Grids Network
// ---------------------------------------------------------------------------

const ENERGY_SYSTEMS_AND_SMART_GRIDS_NETWORK: Group = createGroup({
  id: 'grp-energy-systems-network',
  name: 'Energy Systems & Smart Grids Network',
  description:
    'An interdisciplinary network connecting power systems researchers, utilities, and policymakers across West Africa.',
  category: 'professional-network',
  visibility: 'public',
  owner: 'adebayo',
  ownerName: ADEBAYO.displayName,
  institution: 'University of Lagos',
  institutionId: 'INST-UNILAG-002',
  department: 'Department of Electrical Engineering',
  country: 'Nigeria',
  discipline: 'Electrical Engineering',
  researchAreas: ['Renewable Energy', 'Smart Grids', 'Power Electronics', 'Energy Storage'],
  keywords: ['energy', 'smart-grid', 'renewables', 'microgrid'],
  website: 'https://scholatia.org/groups/energy-systems-network',
  email: 'energy@scholatia.org',
  socialLinks: { linkedin: 'https://linkedin.com/company/esgn', github: 'https://github.com/esgn' },
  verificationStatus: 'Trusted',
  administrators: [member('tanaka', 'administrator', '2024-02-15T09:00:00.000Z')],
  moderators: [member('wang', 'moderator', '2024-03-15T09:00:00.000Z')],
  members: [
    member('dube', 'member', '2024-04-15T09:00:00.000Z'),
    member('schneider', 'member', '2024-05-15T09:00:00.000Z'),
    member('kim', 'member', '2024-06-15T09:00:00.000Z'),
    member('hussain', 'guest', '2025-02-01T09:00:00.000Z'),
  ],
  publications: [
    pub('grp-energy-pub-1', 'Smart grid integration in West African megacities', 'article', 'published', ['adebayo', 'tanaka'], '2025-11-10T00:00:00.000Z'),
    pub('grp-energy-pub-2', 'Solar microgrid deployment review', 'report', 'published', ['adebayo', 'dube'], '2026-01-15T00:00:00.000Z'),
  ],
  events: [
    evt('grp-energy-evt-1', 'Regional grid modernisation workshop', 'workshop', 'in-person', daysAhead(12, 10), ['adebayo', 'wang'], 'scheduled'),
    evt('grp-energy-evt-2', 'Energy storage webinar', 'webinar', 'online', daysAgo(15, 15), ['schneider', 'kim'], 'completed'),
  ],
  resources: [res('grp-energy-res-1', 'Open microgrid simulation models', 'software', 'adebayo', daysAgo(25), 'https://github.com/esgn/models'), res('grp-energy-res-2', 'West African grid data registry', 'dataset', 'dube', daysAgo(55))],
  discussions: [disc('grp-energy-disc-1', 'Standards for microgrid interoperability', 'Which interconnection standards should the network endorse?', 'adebayo', [{ author: 'tanaka', body: 'Align with IEC and extend for low-voltage African contexts.', createdAt: daysAgo(5) }])],
  announcements: [annc('grp-energy-annc-1', 'Grid modernisation workshop', 'Registration is open for the regional workshop in Lagos.', 'adebayo', daysAgo(6), true)],
  projects: [proj('grp-energy-proj-1', 'National Solar Microgrid Programme', 'Deployment of commercial microgrid technology across rural communities.', ['adebayo', 'dube'], 'active', 'grant-solar-microgrid', 'project')],
  media: [med('grp-energy-med-1', 'video', 'Microgrid commissioning tour', 'adebayo')],
  createdAt: '2024-02-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 5 — Latin American Galaxy Simulation Network
// ---------------------------------------------------------------------------

const GALAXY_SIMULATION_NETWORK: Group = createGroup({
  id: 'grp-galaxy-simulation-network',
  name: 'Latin American Galaxy Simulation Network',
  description:
    'A regional network linking computational astrophysicists building galaxy formation simulations at exascale.',
  category: 'research-group',
  visibility: 'institution-only',
  owner: 'maria',
  ownerName: MARIA.displayName,
  institution: 'National Autonomous University of Mexico',
  department: 'Institute of Astronomy',
  country: 'Mexico',
  discipline: 'Astrophysics',
  researchAreas: ['Galaxy Formation', 'Dark Matter', 'Computational Astrophysics', 'Large-Scale Structure'],
  keywords: ['galaxies', 'simulation', 'astrophysics'],
  website: 'https://scholatia.org/groups/galaxy-simulation-network',
  email: 'galaxynet@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/galaxynet', github: 'https://github.com/galaxynet' },
  verificationStatus: 'Government Recognised',
  administrators: [member('tanaka', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('jscholar', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [
    member('dube', 'member', '2024-05-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-06-01T09:00:00.000Z'),
    member('schneider', 'guest', '2024-07-01T09:00:00.000Z'),
  ],
  publications: [pub('grp-galaxy-pub-1', 'Dark matter substructure in dwarf galaxies', 'article', 'in-review', ['maria', 'tanaka'], undefined), pub('grp-galaxy-pub-2', 'Exascale galaxy formation benchmarks', 'proceeding', 'published', ['maria', 'schneider'], '2025-10-05T00:00:00.000Z')],
  events: [evt('grp-galaxy-evt-1', 'Simulation showcase', 'seminar', 'hybrid', daysAhead(7, 16), ['maria', 'schneider'], 'scheduled'), evt('grp-galaxy-evt-2', 'Dark matter journal club', 'journal-club', 'online', daysAgo(21, 16), ['tanaka', 'dube'], 'completed')],
  resources: [res('grp-galaxy-res-1', 'Shared simulation infrastructure guide', 'document', 'maria', daysAgo(18)), res('grp-galaxy-res-2', 'Sample simulation catalogues', 'dataset', 'tanaka', daysAgo(50))],
  discussions: [disc('grp-galaxy-disc-1', 'Choosing a resolution for dwarf galaxy runs', 'What effective resolution should we target for the dwarf population?', 'maria', [{ author: 'schneider', body: 'Target 100 pc effective resolution with the new scheme.', createdAt: daysAgo(3) }])],
  announcements: [annc('grp-galaxy-annc-1', 'HPC allocation renewed', 'The national supercomputing allocation was renewed for a further two years.', 'maria', daysAgo(10), true)],
  projects: [proj('grp-galaxy-proj-1', 'Latin American Galaxy Simulation Network', 'Regional simulation network flagship project.', ['maria', 'tanaka', 'schneider'], 'active', 'grant-latam-galaxy', 'project')],
  media: [med('grp-galaxy-med-1', 'image', 'Simulation renderings', 'maria')],
  createdAt: '2024-02-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 6 — Medieval Manuscripts Working Group
// ---------------------------------------------------------------------------

const MEDIEVAL_MANUSCRIPTS_WORKING_GROUP: Group = createGroup({
  id: 'grp-medieval-manuscripts-working-group',
  name: 'Medieval Manuscripts Working Group',
  description:
    'A conference working group on digital medieval studies, manuscript cataloguing standards, and the paleography of episcopal registers.',
  category: 'conference-working-group',
  visibility: 'public',
  owner: 'smith',
  ownerName: SMITH.displayName,
  institution: 'University of Cambridge',
  institutionId: 'INST-CAM-013',
  department: 'Department of History',
  country: 'United Kingdom',
  discipline: 'History',
  researchAreas: ['Medieval History', 'Digital Humanities', 'Paleography', 'Manuscript Studies'],
  keywords: ['medieval', 'manuscripts', 'digital-humanities', 'paleography'],
  website: 'https://scholatia.org/groups/medieval-manuscripts-working-group',
  email: 'medieval@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/medms', github: 'https://github.com/medms' },
  verificationStatus: 'Trusted',
  administrators: [member('jscholar', 'administrator', '2024-01-20T09:00:00.000Z')],
  moderators: [member('gallo', 'moderator', '2024-02-20T09:00:00.000Z')],
  members: [member('almeida', 'member', '2024-03-20T09:00:00.000Z'), member('kovacs', 'member', '2024-04-20T09:00:00.000Z'), member('wang', 'guest', '2024-05-20T09:00:00.000Z')],
  publications: [pub('grp-medieval-pub-1', 'Open standards for digitised manuscripts', 'report', 'published', ['smith', 'almeida'], '2025-09-01T00:00:00.000Z'), pub('grp-medieval-pub-2', 'Episcopal registers and the medieval state', 'chapter', 'published', ['smith'], '2024-12-01T00:00:00.000Z')],
  events: [evt('grp-medieval-evt-1', 'Panel on the digital archive', 'conference', 'hybrid', daysAhead(22, 9), ['smith', 'jscholar'], 'scheduled'), evt('grp-medieval-evt-2', 'Paleography reading group', 'meeting', 'in-person', daysAgo(11, 15), ['smith'], 'completed')],
  resources: [res('grp-medieval-res-1', 'Open Manuscript Catalogue specification', 'guideline', 'smith', daysAgo(30)), res('grp-medieval-res-2', 'Digitised register corpus', 'dataset', 'almeida', daysAgo(80))],
  discussions: [disc('grp-medieval-disc-1', 'Catalogue metadata for fragmentary leaves', 'How should fragmentary leaves be described in the open catalogue?', 'smith', [{ author: 'almeida', body: 'Adopt the fragment-friendly extension to IIIF metadata.', createdAt: daysAgo(6) }])],
  announcements: [annc('grp-medieval-annc-1', 'Special session accepted', 'The working group session was accepted at the International Congress on Medieval Studies.', 'smith', daysAgo(14), true)],
  projects: [proj('grp-medieval-proj-1', 'Cambridge Digital Manuscripts', 'National digitisation programme for medieval manuscripts.', ['smith', 'jscholar', 'almeida'], 'active', 'grant-cambridge-digital', 'project')],
  media: [med('grp-medieval-med-1', 'image', 'Register folios', 'smith')],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 7 — Soft Robotics Laboratory Group
// ---------------------------------------------------------------------------

const SOFT_ROBOTICS_LABORATORY_GROUP: Group = createGroup({
  id: 'grp-soft-robotics-lab',
  name: 'Soft Robotics Laboratory Group',
  description:
    'The laboratory community behind compliant manipulation, soft actuators, and safe human-robot collaboration research.',
  category: 'laboratory',
  visibility: 'department-only',
  owner: 'tanaka',
  ownerName: TANAKA.displayName,
  institution: 'University of Tokyo',
  institutionId: 'INST-UTOKYO-020',
  department: 'Department of Mechanical Engineering',
  country: 'Japan',
  discipline: 'Robotics',
  researchAreas: ['Soft Robotics', 'Compliant Manipulation', 'Actuators', 'Human-Robot Collaboration'],
  keywords: ['robotics', 'soft-actuators', 'manipulation'],
  website: 'https://scholatia.org/groups/soft-robotics-lab',
  email: 'softlab@scholatia.org',
  socialLinks: { github: 'https://github.com/softlab', twitter: 'https://twitter.com/softlab' },
  verificationStatus: 'Verified',
  administrators: [member('wang', 'administrator', '2024-01-05T09:00:00.000Z')],
  moderators: [member('kim', 'moderator', '2024-02-05T09:00:00.000Z')],
  members: [member('schneider', 'member', '2024-03-05T09:00:00.000Z'), member('maria', 'member', '2024-04-05T09:00:00.000Z'), member('dube', 'visitor', '2025-01-01T09:00:00.000Z')],
  publications: [pub('grp-softlab-pub-1', 'Soft actuators for safe collaboration', 'article', 'published', ['tanaka', 'schneider'], '2025-07-15T00:00:00.000Z'), pub('grp-softlab-pub-2', 'Variable-stiffness compliant gripper', 'report', 'published', ['tanaka', 'kim'], '2026-02-20T00:00:00.000Z')],
  events: [evt('grp-softlab-evt-1', 'Lab demonstration day', 'workshop', 'in-person', daysAhead(4, 13), ['tanaka', 'wang'], 'scheduled'), evt('grp-softlab-evt-2', 'Manipulation research seminar', 'seminar', 'hybrid', daysAgo(16, 15), ['tanaka'], 'completed')],
  resources: [res('grp-softlab-res-1', 'SoftGrip actuator CAD and firmware', 'software', 'tanaka', daysAgo(22), 'https://github.com/softlab/softgrip'), res('grp-softlab-res-2', 'Benchmark manipulation trajectories', 'dataset', 'wang', daysAgo(64))],
  discussions: [disc('grp-softlab-disc-1', 'Stiffness scheduling for dynamic tasks', 'When should the gripper switch between compliant and stiff modes?', 'wang', [{ author: 'tanaka', body: 'Keyed to contact phase; prototype data supports a switch threshold.', createdAt: daysAgo(2) }])],
  announcements: [annc('grp-softlab-annc-1', 'ICRA paper accepted', 'The actuator control paper was accepted for presentation.', 'tanaka', daysAgo(9), true)],
  projects: [proj('grp-softlab-proj-1', 'Soft Robotic Eldercare Systems', 'Compliant systems for safe eldercare assistance.', ['tanaka', 'wang'], 'active', 'grant-soft-eldercare', 'project')],
  media: [med('grp-softlab-med-1', 'video', 'Gripper demonstrations', 'tanaka')],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 8 — Tropical Medicine Editorial Group
// ---------------------------------------------------------------------------

const TROPICAL_MEDICINE_EDITORIAL_GROUP: Group = createGroup({
  id: 'grp-tropical-medicine-editorial',
  name: 'Tropical Medicine Editorial Group',
  description:
    'The private editorial board for a portfolio journal covering tropical medicine, global health, and infectious disease control.',
  category: 'journal-editorial',
  visibility: 'private',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Department of Public Health',
  country: 'Nigeria',
  discipline: 'Medicine',
  researchAreas: ['Tropical Medicine', 'Infectious Diseases', 'Global Health'],
  keywords: ['journal', 'editorial', 'tropical-medicine'],
  website: 'https://scholatia.org/groups/tropical-medicine-editorial',
  email: 'editorial@scholatia.org',
  verificationStatus: 'Accredited',
  administrators: [member('dube', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [member('adesina', 'member', '2024-04-01T09:00:00.000Z'), member('mbatha', 'member', '2024-05-01T09:00:00.000Z'), member('hussain', 'member', '2024-06-01T09:00:00.000Z')],
  publications: [pub('grp-editorial-pub-1', 'Special issue: malaria elimination', 'report', 'in-review', ['ojuri', 'yusuf'], undefined)],
  events: [evt('grp-editorial-evt-1', 'Editorial board meeting', 'meeting', 'online', daysAhead(3, 11), ['ojuri', 'dube'], 'scheduled')],
  resources: [res('grp-editorial-res-1', 'Peer review guidelines', 'guideline', 'ojuri', daysAgo(33))],
  discussions: [disc('grp-editorial-disc-1', 'Scope expansion discussion', 'Should the journal expand into digital health surveillance?', 'ojuri', [{ author: 'dube', body: 'Support expansion with a focused special series.', createdAt: daysAgo(4) }])],
  announcements: [annc('grp-editorial-annc-1', 'Special issue call', 'Contributions are invited for the malaria elimination special issue.', 'ojuri', daysAgo(16), true)],
  projects: [],
  media: [],
  createdAt: '2024-01-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 9 — Digital Health Innovation Community
// ---------------------------------------------------------------------------

const DIGITAL_HEALTH_INNOVATION_COMMUNITY: Group = createGroup({
  id: 'grp-digital-health-innovation',
  name: 'Digital Health Innovation Community',
  description:
    'An open interest group exploring surveillance dashboards, decision support, and mHealth across public health systems.',
  category: 'interest-group',
  visibility: 'public',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Department of Public Health',
  country: 'Nigeria',
  discipline: 'Digital Health',
  researchAreas: ['Digital Health', 'Health Informatics', 'mHealth', 'Disease Surveillance'],
  keywords: ['digital-health', 'mhealth', 'dashboards'],
  website: 'https://scholatia.org/groups/digital-health-innovation',
  email: 'digitalhealth@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/dhic', github: 'https://github.com/dhic' },
  verificationStatus: 'Pending',
  administrators: [member('okonkwo', 'administrator', '2024-05-01T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2024-06-01T09:00:00.000Z')],
  members: [member('gallo', 'member', '2024-07-01T09:00:00.000Z'), member('yusuf', 'member', '2024-08-01T09:00:00.000Z'), member('jscholar', 'member', '2024-09-01T09:00:00.000Z')],
  publications: [pub('grp-dhealth-pub-1', 'Community health surveillance dashboards', 'report', 'published', ['ojuri', 'mbatha'], '2026-03-10T00:00:00.000Z')],
  events: [evt('grp-dhealth-evt-1', 'mHealth showcase', 'webinar', 'online', daysAhead(10, 15), ['ojuri', 'okonkwo'], 'scheduled'), evt('grp-dhealth-evt-2', 'Open data meetup', 'meeting', 'in-person', daysAgo(19, 17), ['mbatha'], 'completed')],
  resources: [res('grp-dhealth-res-1', 'Open surveillance dashboard demo', 'software', 'ojuri', daysAgo(27), 'https://github.com/dhic/dashboard')],
  discussions: [disc('grp-dhealth-disc-1', 'Privacy for district dashboards', 'How should aggregated district dashboards handle small-count disclosure?', 'okonkwo', [{ author: 'yusuf', body: 'Adopt cell suppression below the disclosure threshold.', createdAt: daysAgo(5) }])],
  announcements: [annc('grp-dhealth-annc-1', 'Quarterly showcase', 'Join the next mHealth showcase with live demos.', 'ojuri', daysAgo(7))],
  projects: [proj('grp-dhealth-proj-1', 'Community Health Surveillance Dashboard', 'Open dashboard for district-level disease surveillance.', ['ojuri', 'mbatha'], 'active', 'inno-health-dashboard', 'project')],
  media: [med('grp-dhealth-med-1', 'podcast', 'Digital health in the field', 'mbatha')],
  createdAt: '2024-04-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 10 — Climate Change Adaptation Research Cluster
// ---------------------------------------------------------------------------

const CLIMATE_ADAPTATION_RESEARCH_CLUSTER: Group = createGroup({
  id: 'grp-climate-adaptation-cluster',
  name: 'Climate Change Adaptation Research Cluster',
  description:
    'An interdisciplinary cluster studying climate impacts, adaptation pathways, and resilience in coastal and agricultural systems.',
  category: 'research-group',
  visibility: 'public',
  owner: 'rivers',
  ownerName: RIVERS.displayName,
  institution: 'Stanford University',
  institutionId: 'INST-SU-017',
  department: 'Department of Earth System Science',
  country: 'United States',
  discipline: 'Climate Science',
  researchAreas: ['Climate Adaptation', 'Coastal Resilience', 'Climate Risk', 'Sustainable Agriculture'],
  keywords: ['climate', 'adaptation', 'resilience'],
  website: 'https://scholatia.org/groups/climate-adaptation-cluster',
  email: 'climate@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/climatecluster', linkedin: 'https://linkedin.com/company/carc' },
  verificationStatus: 'Trusted',
  administrators: [member('almeida', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('kim', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [
    member('adesina', 'member', '2024-04-01T09:00:00.000Z'),
    member('dube', 'member', '2024-05-01T09:00:00.000Z'),
    member('tanaka', 'member', '2024-06-01T09:00:00.000Z'),
    member('wang', 'guest', '2024-07-01T09:00:00.000Z'),
    member('hussain', 'visitor', '2025-01-15T09:00:00.000Z'),
  ],
  publications: [pub('grp-climate-pub-1', 'Coastal adaptation pathways review', 'article', 'published', ['rivers', 'almeida'], '2025-12-05T00:00:00.000Z'), pub('grp-climate-pub-2', 'Crop resilience under warming scenarios', 'report', 'in-review', ['rivers', 'adesina'], undefined), pub('grp-climate-pub-3', 'Regional climate risk atlas', 'dataset', 'published', ['rivers', 'kim'], '2026-02-14T00:00:00.000Z')],
  events: [evt('grp-climate-evt-1', 'Adaptation futures symposium', 'conference', 'hybrid', daysAhead(25, 9), ['rivers', 'almeida', 'adesina'], 'scheduled'), evt('grp-climate-evt-2', 'Coastal resilience field update', 'seminar', 'online', daysAgo(13, 16), ['rivers', 'kim'], 'completed')],
  resources: [res('grp-climate-res-1', 'Open climate risk model suite', 'software', 'rivers', daysAgo(20), 'https://github.com/carc/models'), res('grp-climate-res-2', 'Coastal indicator datasets', 'dataset', 'almeida', daysAgo(48))],
  discussions: [disc('grp-climate-disc-1', 'Scenario harmonisation', 'Which SSP scenarios should the cluster standardise on?', 'rivers', [{ author: 'almeida', body: 'Adopt SSP2-4.5 as the central and SSP5-8.5 as the upper bound.', createdAt: daysAgo(5) }])],
  announcements: [annc('grp-climate-annc-1', 'Symposium programme live', 'The adaptation futures symposium programme is now public.', 'rivers', daysAgo(11), true)],
  projects: [proj('grp-climate-proj-1', 'Coastal Adaptation Research Consortium', 'Multi-institution coastal adaptation research.', ['rivers', 'almeida', 'kim'], 'active', 'grant-coastal-adaptation', 'project')],
  media: [med('grp-climate-med-1', 'image', 'Coastal survey sites', 'rivers'), med('grp-climate-med-2', 'presentation', 'Risk atlas launch', 'almeida')],
  createdAt: '2024-01-25T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 11 — Quantum Computing Interest Group
// ---------------------------------------------------------------------------

const QUANTUM_COMPUTING_INTEREST_GROUP: Group = createGroup({
  id: 'grp-quantum-computing-circle',
  name: 'Quantum Computing Interest Group',
  description:
    'An invitation-only circle for researchers exploring quantum algorithms, error correction, and quantum-chemistry simulations.',
  category: 'interest-group',
  visibility: 'invitation-only',
  owner: 'schneider',
  ownerName: SCHNEIDER.displayName,
  institution: 'ETH Zurich',
  institutionId: 'INST-ETH-018',
  department: 'Institute for Theoretical Physics',
  country: 'Switzerland',
  discipline: 'Quantum Physics',
  researchAreas: ['Quantum Algorithms', 'Quantum Error Correction', 'Quantum Chemistry', 'Quantum Hardware'],
  keywords: ['quantum', 'algorithms', 'error-correction'],
  website: 'https://scholatia.org/groups/quantum-computing-circle',
  email: 'quantum@scholatia.org',
  socialLinks: { github: 'https://github.com/qcg' },
  verificationStatus: 'Government Recognised',
  administrators: [member('wang', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('maria', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [member('tanaka', 'member', '2024-05-01T09:00:00.000Z'), member('dube', 'member', '2024-06-01T09:00:00.000Z'), member('kim', 'member', '2024-07-01T09:00:00.000Z')],
  publications: [pub('grp-quantum-pub-1', 'Error-corrected logical qubit roadmap', 'article', 'published', ['schneider', 'wang'], '2025-10-20T00:00:00.000Z'), pub('grp-quantum-pub-2', 'Quantum chemistry resource estimates', 'preprint', 'in-review', ['schneider', 'kim'], undefined)],
  events: [evt('grp-quantum-evt-1', 'Invitation-only seminar', 'seminar', 'online', daysAhead(8, 14), ['schneider', 'wang'], 'scheduled'), evt('grp-quantum-evt-2', 'Algorithms journal club', 'journal-club', 'online', daysAgo(24, 17), ['schneider', 'tanaka'], 'completed')],
  resources: [res('grp-quantum-res-1', 'Shared circuit simulation toolkit', 'software', 'wang', daysAgo(35), 'https://github.com/qcg/sim'), res('grp-quantum-res-2', 'Benchmark problem set', 'dataset', 'kim', daysAgo(70))],
  discussions: [disc('grp-quantum-disc-1', 'Noise model assumptions', 'Which noise model should the group standardise simulations on?', 'schneider', [{ author: 'wang', body: 'Use device-calibrated models from the current hardware generation.', createdAt: daysAgo(3) }])],
  announcements: [annc('grp-quantum-annc-1', 'Hardware access round', 'Applications for the next hardware access round close this month.', 'schneider', daysAgo(13), true)],
  projects: [proj('grp-quantum-proj-1', 'Quantum error correction benchmarks', 'Comparative benchmarks for error-corrected memory experiments.', ['schneider', 'wang'], 'active', 'grant-qec-benchmark', 'project')],
  media: [med('grp-quantum-med-1', 'video', 'Simulation visualisations', 'schneider')],
  createdAt: '2024-02-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 12 — Open Science Movement
// ---------------------------------------------------------------------------

const OPEN_SCIENCE_MOVEMENT: Group = createGroup({
  id: 'grp-open-science-movement',
  name: 'Open Science Movement',
  description:
    'A global professional network advancing open access, open data, open code, and reproducible research practice.',
  category: 'professional-network',
  visibility: 'public',
  owner: 'jscholar',
  ownerName: JSCHOLAR.displayName,
  institution: 'Institute for Computational Linguistics',
  department: 'Computational Linguistics',
  country: 'United Kingdom',
  discipline: 'Open Science',
  researchAreas: ['Open Access', 'Reproducibility', 'Open Data', 'Research Infrastructure'],
  keywords: ['open-science', 'open-access', 'reproducibility'],
  website: 'https://scholatia.org/groups/open-science-movement',
  email: 'openscience@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/openscience', github: 'https://github.com/openscience' },
  verificationStatus: 'Trusted',
  administrators: [member('ojuri', 'administrator', '2023-11-01T09:00:00.000Z')],
  moderators: [member('ndlovu', 'moderator', '2023-12-01T09:00:00.000Z')],
  members: [
    member('smith', 'member', '2024-01-01T09:00:00.000Z'),
    member('maria', 'member', '2024-02-01T09:00:00.000Z'),
    member('gallo', 'member', '2024-03-01T09:00:00.000Z'),
    member('almeida', 'member', '2024-04-01T09:00:00.000Z'),
    member('das', 'member', '2024-05-01T09:00:00.000Z'),
  ],
  publications: [pub('grp-osm-pub-1', 'Open science adoption across disciplines', 'report', 'published', ['jscholar', 'ojuri'], '2026-01-10T00:00:00.000Z'), pub('grp-osm-pub-2', 'Reproducibility checklists for field research', 'report', 'published', ['ndlovu', 'maria'], '2025-09-30T00:00:00.000Z')],
  events: [evt('grp-osm-evt-1', 'Open science town hall', 'webinar', 'online', daysAhead(14, 15), ['jscholar', 'ojuri'], 'scheduled'), evt('grp-osm-evt-2', 'Reproducibility sprint', 'workshop', 'hybrid', daysAgo(26, 10), ['ndlovu', 'maria'], 'completed')],
  resources: [res('grp-osm-res-1', 'Open licencing decision tree', 'guideline', 'jscholar', daysAgo(15)), res('grp-osm-res-2', 'Registry of open data repositories', 'reference', 'das', daysAgo(44))],
  discussions: [disc('grp-osm-disc-1', 'Preprint-first policy drafting', 'Should the network endorse a preprint-first publication policy?', 'jscholar', [{ author: 'ojuri', body: 'Yes, with emphasis on community norms per discipline.', createdAt: daysAgo(2) }])],
  announcements: [annc('grp-osm-annc-1', 'Town hall announcement', 'Join the next open science town hall on reproducibility.', 'jscholar', daysAgo(5), true)],
  projects: [proj('grp-osm-proj-1', 'Open Manuscript Catalogue', 'Open standards for describing digitised manuscripts.', ['smith', 'jscholar'], 'completed', 'inno-open-catalogue', 'project')],
  media: [med('grp-osm-med-1', 'podcast', 'Open science in practice', 'jscholar')],
  createdAt: '2023-10-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 13 — Materials Science Collaboration Group
// ---------------------------------------------------------------------------

const MATERIALS_SCIENCE_COLLABORATION_GROUP: Group = createGroup({
  id: 'grp-materials-collaboration',
  name: 'Materials Science Collaboration Group',
  description:
    'An institution-scoped collaboration on nanomaterials, energy materials, and characterisation infrastructure sharing.',
  category: 'research-group',
  visibility: 'institution-only',
  owner: 'kim',
  ownerName: KIM.displayName,
  institution: 'Seoul National University',
  institutionId: 'INST-SU-007',
  department: 'Department of Materials Science and Engineering',
  country: 'South Korea',
  discipline: 'Materials Science',
  researchAreas: ['Nanomaterials', 'Energy Materials', 'Characterisation', 'Thin Films'],
  keywords: ['nanomaterials', 'characterisation', 'energy-materials'],
  website: 'https://scholatia.org/groups/materials-collaboration',
  email: 'materials@scholatia.org',
  socialLinks: { linkedin: 'https://linkedin.com/company/mscg' },
  verificationStatus: 'Accredited',
  administrators: [member('schneider', 'administrator', '2024-03-10T09:00:00.000Z')],
  moderators: [member('rivers', 'moderator', '2024-04-10T09:00:00.000Z')],
  members: [member('adebayo', 'member', '2024-05-10T09:00:00.000Z'), member('tanaka', 'member', '2024-06-10T09:00:00.000Z'), member('wang', 'member', '2024-07-10T09:00:00.000Z')],
  publications: [pub('grp-materials-pub-1', 'Characterisation of nanostructured films', 'article', 'published', ['kim', 'schneider'], '2025-11-25T00:00:00.000Z')],
  events: [evt('grp-materials-evt-1', 'Characterisation facility tour', 'workshop', 'in-person', daysAhead(11, 11), ['kim', 'rivers'], 'scheduled')],
  resources: [res('grp-materials-res-1', 'Shared characterisation booking policy', 'document', 'kim', daysAgo(29)), res('grp-materials-res-2', 'Calibration reference datasets', 'dataset', 'schneider', daysAgo(58))],
  discussions: [disc('grp-materials-disc-1', 'Instrument time allocation', 'How should we prioritise instrument bookings during peak season?', 'kim', [{ author: 'rivers', body: 'Prioritise thesis-critical measurements with a shared queue.', createdAt: daysAgo(4) }])],
  announcements: [annc('grp-materials-annc-1', 'New instrument online', 'The new electron microscope is available for booking.', 'kim', daysAgo(8), true)],
  projects: [proj('grp-materials-proj-1', 'Nanomaterials for Energy Storage', 'Energy storage nanomaterials research.', ['kim', 'schneider', 'adebayo'], 'active', 'grant-nano-storage', 'project')],
  media: [med('grp-materials-med-1', 'image', 'Micrograph gallery', 'kim')],
  createdAt: '2024-02-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 14 — CSIR Cybersecurity Research Group
// ---------------------------------------------------------------------------

const CSIR_CYBERSECURITY_RESEARCH_GROUP: Group = createGroup({
  id: 'grp-csir-cybersecurity',
  name: 'CSIR Cybersecurity Research Group',
  description:
    'A department-scoped research group on threat detection, digital forensics, and secure critical infrastructure.',
  category: 'research-group',
  visibility: 'department-only',
  owner: 'ndlovu',
  ownerName: NDLOVU.displayName,
  institution: 'CSIR',
  department: 'Cyber Defence',
  country: 'South Africa',
  discipline: 'Cybersecurity',
  researchAreas: ['Threat Detection', 'Digital Forensics', 'Network Security', 'Critical Infrastructure'],
  keywords: ['cybersecurity', 'threat-detection', 'forensics'],
  website: 'https://scholatia.org/groups/csir-cybersecurity',
  email: 'cyber@scholatia.org',
  socialLinks: { github: 'https://github.com/csir-cyber' },
  verificationStatus: 'Government Recognised',
  administrators: [member('dube', 'administrator', '2024-02-10T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2024-03-10T09:00:00.000Z')],
  members: [member('okonkwo', 'member', '2024-04-10T09:00:00.000Z'), member('jscholar', 'member', '2024-05-10T09:00:00.000Z'), member('das', 'member', '2024-06-10T09:00:00.000Z')],
  publications: [pub('grp-cyber-pub-1', 'Threat detection benchmark for African networks', 'report', 'published', ['ndlovu', 'dube'], '2026-01-28T00:00:00.000Z'), pub('grp-cyber-pub-2', 'Digital forensics workflow review', 'article', 'in-review', ['ndlovu', 'mbatha'], undefined)],
  events: [evt('grp-cyber-evt-1', 'Threat intel briefing', 'seminar', 'online', daysAhead(6, 12), ['ndlovu', 'okonkwo'], 'scheduled')],
  resources: [res('grp-cyber-res-1', 'Open detection rule set', 'software', 'ndlovu', daysAgo(17), 'https://github.com/csir-cyber/rules'), res('grp-cyber-res-2', 'Forensics caseplaybook', 'guideline', 'mbatha', daysAgo(52))],
  discussions: [disc('grp-cyber-disc-1', 'Open-source detection strategy', 'Should the group open its detection rule set to the community?', 'ndlovu', [{ author: 'dube', body: 'Open with a responsible disclosure policy.', createdAt: daysAgo(6) }])],
  announcements: [annc('grp-cyber-annc-1', 'Benchmark release', 'The threat detection benchmark is now public.', 'ndlovu', daysAgo(10), true)],
  projects: [proj('grp-cyber-proj-1', 'Critical infrastructure monitoring', 'Secure monitoring framework for national critical infrastructure.', ['ndlovu', 'dube'], 'active', 'grant-cyber-critinfra', 'project')],
  media: [med('grp-cyber-med-1', 'presentation', 'Threat landscape 2026', 'ndlovu')],
  createdAt: '2024-01-30T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 15 — Agricultural Economics Forum
// ---------------------------------------------------------------------------

const AGRICULTURAL_ECONOMICS_FORUM: Group = createGroup({
  id: 'grp-agricultural-economics-forum',
  name: 'Agricultural Economics Forum',
  description:
    'A professional forum for applied agricultural economics, food systems, and rural livelihoods research across Africa.',
  category: 'professional-network',
  visibility: 'public',
  owner: 'adesina',
  ownerName: ADESINA.displayName,
  institution: 'University of Ghana',
  institutionId: 'INST-UG-010',
  department: 'Department of Agricultural Economics',
  country: 'Ghana',
  discipline: 'Agricultural Economics',
  researchAreas: ['Agricultural Economics', 'Food Security', 'Rural Livelihoods', 'Value Chains'],
  keywords: ['agriculture', 'food-security', 'value-chains'],
  website: 'https://scholatia.org/groups/agricultural-economics-forum',
  email: 'agricecon@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/agricecon' },
  verificationStatus: 'Trusted',
  administrators: [member('okonkwo', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('yusuf', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [member('rivers', 'member', '2024-05-01T09:00:00.000Z'), member('hussain', 'member', '2024-06-01T09:00:00.000Z'), member('almeida', 'member', '2024-07-01T09:00:00.000Z')],
  publications: [pub('grp-agri-pub-1', 'Farm productivity under climate stress', 'report', 'published', ['adesina', 'rivers'], '2025-12-18T00:00:00.000Z')],
  events: [evt('grp-agri-evt-1', 'Food systems policy roundtable', 'workshop', 'hybrid', daysAhead(16, 10), ['adesina', 'hussain'], 'scheduled'), evt('grp-agri-evt-2', 'Value chain data clinic', 'meeting', 'online', daysAgo(14, 15), ['adesina', 'okonkwo'], 'completed')],
  resources: [res('grp-agri-res-1', 'Farm survey instruments', 'teaching-material', 'adesina', daysAgo(36)), res('grp-agri-res-2', 'Regional price series data', 'dataset', 'yusuf', daysAgo(66))],
  discussions: [disc('grp-agri-disc-1', 'Index insurance for smallholders', 'What data are needed to make index insurance viable for smallholders?', 'adesina', [{ author: 'rivers', body: 'High-resolution weather data linked to plot-level yields.', createdAt: daysAgo(3) }])],
  announcements: [annc('grp-agri-annc-1', 'Policy roundtable announced', 'Join the food systems policy roundtable next month.', 'adesina', daysAgo(9), true)],
  projects: [proj('grp-agri-proj-1', 'Climate-resilient value chains', 'Research on climate-resilient agricultural value chains.', ['adesina', 'rivers'], 'active', 'grant-agri-valuechain', 'project')],
  media: [med('grp-agri-med-1', 'image', 'Field survey photos', 'adesina')],
  createdAt: '2024-02-05T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 16 — Public Health Faculty Group (UI)
// ---------------------------------------------------------------------------

const UI_PUBLIC_HEALTH_FACULTY_GROUP: Group = createGroup({
  id: 'grp-ui-public-health-faculty',
  name: 'Public Health Faculty Group (UI)',
  description:
    'The faculty-wide academic group for the Faculty of Medicine at the University of Ibadan, coordinating curricula, research, and community health.',
  category: 'faculty',
  visibility: 'institution-only',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Faculty of Medicine',
  country: 'Nigeria',
  discipline: 'Public Health',
  researchAreas: ['Medical Education', 'Epidemiology', 'Health Systems', 'Community Health'],
  keywords: ['faculty', 'medicine', 'ibadan'],
  website: 'https://scholatia.org/groups/ui-public-health-faculty',
  email: 'faculty@scholatia.org',
  verificationStatus: 'Verified',
  administrators: [member('yusuf', 'administrator', '2023-08-01T09:00:00.000Z')],
  moderators: [member('dube', 'moderator', '2023-09-01T09:00:00.000Z')],
  members: [
    member('adesina', 'member', '2023-10-01T09:00:00.000Z'),
    member('mbatha', 'member', '2023-11-01T09:00:00.000Z'),
    member('hussain', 'member', '2023-12-01T09:00:00.000Z'),
    member('okonkwo', 'member', '2024-01-01T09:00:00.000Z'),
  ],
  publications: [pub('grp-faculty-pub-1', 'Faculty research capacity report', 'report', 'published', ['ojuri', 'yusuf'], '2026-04-01T00:00:00.000Z')],
  events: [evt('grp-faculty-evt-1', 'Faculty research day', 'lecture', 'in-person', daysAhead(30, 9), ['ojuri', 'yusuf'], 'scheduled'), evt('grp-faculty-evt-2', 'Curriculum review meeting', 'meeting', 'hybrid', daysAgo(18, 11), ['ojuri', 'mbatha'], 'completed')],
  resources: [res('grp-faculty-res-1', 'Graduate research handbook', 'teaching-material', 'ojuri', daysAgo(42)), res('grp-faculty-res-2', 'Ethics application guidance', 'guideline', 'yusuf', daysAgo(75))],
  discussions: [disc('grp-faculty-disc-1', 'Interdisciplinary curriculum modules', 'Should the faculty introduce joint modules with computer science?', 'ojuri', [{ author: 'okonkwo', body: 'Strongly support; digital health needs are growing.', createdAt: daysAgo(5) }])],
  announcements: [annc('grp-faculty-annc-1', 'Research day registration', 'Register for the annual faculty research day.', 'ojuri', daysAgo(12), true)],
  projects: [proj('grp-faculty-proj-1', 'Community Health Surveillance Dashboard', 'Open dashboard for district-level disease surveillance.', ['ojuri', 'mbatha'], 'active', 'inno-health-dashboard', 'collaboration')],
  media: [med('grp-faculty-med-1', 'image', 'Faculty research day 2025', 'ojuri')],
  createdAt: '2023-07-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 17 — Computational Biology Consortium
// ---------------------------------------------------------------------------

const COMPUTATIONAL_BIOLOGY_CONSORTIUM: Group = createGroup({
  id: 'grp-computational-biology-consortium',
  name: 'Computational Biology Consortium',
  description:
    'A grant-funded consortium applying genomics, bioinformatics, and machine learning to infectious disease and health data.',
  category: 'grant-team',
  visibility: 'public',
  owner: 'dube',
  ownerName: DUBE.displayName,
  institution: 'University of Cape Town',
  institutionId: 'INST-UCT-006',
  department: 'Department of Bioinformatics',
  country: 'South Africa',
  discipline: 'Bioinformatics',
  researchAreas: ['Genomics', 'Bioinformatics', 'Machine Learning', 'Infectious Disease'],
  keywords: ['genomics', 'bioinformatics', 'grant'],
  website: 'https://scholatia.org/groups/computational-biology-consortium',
  email: 'bioconsortium@scholatia.org',
  socialLinks: { github: 'https://github.com/bioconsortium' },
  verificationStatus: 'Trusted',
  administrators: [member('ndlovu', 'administrator', '2024-01-01T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2024-02-01T09:00:00.000Z')],
  members: [
    member('ojuri', 'member', '2024-03-01T09:00:00.000Z'),
    member('okonkwo', 'member', '2024-04-01T09:00:00.000Z'),
    member('das', 'member', '2024-05-01T09:00:00.000Z'),
    member('jscholar', 'guest', '2024-06-01T09:00:00.000Z'),
  ],
  publications: [pub('grp-bio-pub-1', 'Genomic surveillance of resistant strains', 'article', 'published', ['dube', 'ndlovu', 'ojuri'], '2025-11-12T00:00:00.000Z'), pub('grp-bio-pub-2', 'Sequence analysis pipeline benchmarks', 'dataset', 'published', ['dube', 'das'], '2026-02-28T00:00:00.000Z')],
  events: [evt('grp-bio-evt-1', 'Consortium analysis sprint', 'workshop', 'online', daysAhead(13, 10), ['dube', 'ndlovu'], 'scheduled'), evt('grp-bio-evt-2', 'Grant steering call', 'meeting', 'hybrid', daysAgo(15, 12), ['dube', 'ojuri'], 'completed')],
  resources: [res('grp-bio-res-1', 'Analysis pipeline repository', 'software', 'dube', daysAgo(19), 'https://github.com/bioconsortium/pipeline'), res('grp-bio-res-2', 'Anonymised cohort dataset', 'dataset', 'ndlovu', daysAgo(61))],
  discussions: [disc('grp-bio-disc-1', 'Reproducible container environments', 'Which container registry should the consortium standardise on?', 'dube', [{ author: 'das', body: 'Pin to a frozen tag set for grant deliverables.', createdAt: daysAgo(4) }])],
  announcements: [annc('grp-bio-annc-1', 'Milestone achieved', 'The consortium completed its interim analysis milestone.', 'dube', daysAgo(7), true)],
  projects: [proj('grp-bio-proj-1', 'Genomic Surveillance Consortium', 'Consortium for genomic surveillance of infectious disease.', ['dube', 'ndlovu', 'ojuri'], 'active', 'grant-genomic-surveillance', 'project')],
  media: [med('grp-bio-med-1', 'presentation', 'Interim consortium results', 'dube')],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 18 — Network Science Editorial Group
// ---------------------------------------------------------------------------

const NETWORK_SCIENCE_EDITORIAL_GROUP: Group = createGroup({
  id: 'grp-network-science-editorial',
  name: 'Network Science Editorial Group',
  description:
    'The private editorial group steering an interdisciplinary journal on networks across physics, computing, and social science.',
  category: 'journal-editorial',
  visibility: 'private',
  owner: 'wang',
  ownerName: WANG.displayName,
  institution: 'Tsinghua University',
  department: 'Department of Computer Science',
  country: 'China',
  discipline: 'Network Science',
  researchAreas: ['Network Science', 'Graph Algorithms', 'Complex Systems', 'Social Networks'],
  keywords: ['networks', 'editorial', 'complex-systems'],
  website: 'https://scholatia.org/groups/network-science-editorial',
  email: 'netsci@scholatia.org',
  verificationStatus: 'Government Recognised',
  administrators: [member('tanaka', 'administrator', '2024-01-15T09:00:00.000Z')],
  moderators: [member('schneider', 'moderator', '2024-02-15T09:00:00.000Z')],
  members: [member('rivers', 'member', '2024-03-15T09:00:00.000Z'), member('jscholar', 'member', '2024-04-15T09:00:00.000Z'), member('almeida', 'member', '2024-05-15T09:00:00.000Z')],
  publications: [pub('grp-netsci-pub-1', 'Special issue on multilayer networks', 'report', 'in-review', ['wang', 'tanaka'], undefined)],
  events: [evt('grp-netsci-evt-1', 'Editorial strategy meeting', 'meeting', 'online', daysAhead(7, 13), ['wang', 'schneider'], 'scheduled')],
  resources: [res('grp-netsci-res-1', 'Reviewer guidelines', 'guideline', 'wang', daysAgo(28))],
  discussions: [disc('grp-netsci-disc-1', 'Special issue timeline', 'Should the multilayer networks special issue be extended?', 'wang', [{ author: 'tanaka', body: 'Extend by two months to align with conference deadlines.', createdAt: daysAgo(6) }])],
  announcements: [annc('grp-netsci-annc-1', 'Call for special issue', 'The multilayer networks special issue call is open.', 'wang', daysAgo(15), true)],
  projects: [],
  media: [],
  createdAt: '2024-01-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 19 — Africa Policy Research Institute
// ---------------------------------------------------------------------------

const AFRICA_POLICY_RESEARCH_INSTITUTE: Group = createGroup({
  id: 'grp-africa-policy-research',
  name: 'Africa Policy Research Institute',
  description:
    'A professional network connecting policy researchers across economics, governance, and public health in Africa.',
  category: 'professional-network',
  visibility: 'public',
  owner: 'yusuf',
  ownerName: YUSUF.displayName,
  institution: 'Bayero University Kano',
  department: 'Department of Public Administration',
  country: 'Nigeria',
  discipline: 'Public Policy',
  researchAreas: ['Public Policy', 'Governance', 'Health Policy', 'Social Policy'],
  keywords: ['policy', 'governance', 'africa'],
  website: 'https://scholatia.org/groups/africa-policy-research',
  email: 'policy@scholatia.org',
  socialLinks: { linkedin: 'https://linkedin.com/company/apri' },
  verificationStatus: 'Pending',
  administrators: [member('hussain', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('almeida', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [member('ojuri', 'member', '2024-04-01T09:00:00.000Z'), member('adesina', 'member', '2024-05-01T09:00:00.000Z'), member('dube', 'member', '2024-06-01T09:00:00.000Z')],
  publications: [pub('grp-policy-pub-1', 'Health financing policy brief', 'report', 'published', ['yusuf', 'ojuri'], '2026-03-05T00:00:00.000Z')],
  events: [evt('grp-policy-evt-1', 'Governance dialogue', 'seminar', 'hybrid', daysAhead(20, 10), ['yusuf', 'hussain'], 'scheduled'), evt('grp-policy-evt-2', 'Policy clinic', 'workshop', 'online', daysAgo(22, 14), ['yusuf'], 'completed')],
  resources: [res('grp-policy-res-1', 'Policy brief templates', 'teaching-material', 'yusuf', daysAgo(37)), res('grp-policy-res-2', 'National policy datasets index', 'reference', 'hussain', daysAgo(68))],
  discussions: [disc('grp-policy-disc-1', 'Open policy drafting platform', 'Should the institute adopt open policy drafting for major briefs?', 'yusuf', [{ author: 'hussain', body: 'Adopt for consultation drafts with structured comment windows.', createdAt: daysAgo(3) }])],
  announcements: [annc('grp-policy-annc-1', 'Policy clinic series', 'Monthly policy clinics now open for registration.', 'yusuf', daysAgo(11))],
  projects: [proj('grp-policy-proj-1', 'Regional health policy observatory', 'Observatory tracking health policy implementation across the region.', ['yusuf', 'ojuri'], 'planning', 'grant-policy-observatory', 'project')],
  media: [med('grp-policy-med-1', 'podcast', 'Policy in practice', 'yusuf')],
  createdAt: '2024-01-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 20 — Institute for Advanced Medical Research Group
// ---------------------------------------------------------------------------

const INSTITUTE_FOR_ADVANCED_MEDICAL_RESEARCH_GROUP: Group = createGroup({
  id: 'grp-iamr-research',
  name: 'Institute for Advanced Medical Research Group',
  description:
    'The research group of the Institute for Advanced Medical Research at the University of Ibadan, focused on malaria, tuberculosis, and maternal health.',
  category: 'research-group',
  visibility: 'institution-only',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Institute for Advanced Medical Research',
  country: 'Nigeria',
  discipline: 'Medicine',
  researchAreas: ['Malaria', 'Tuberculosis', 'Maternal Health', 'Clinical Trials'],
  keywords: ['iamr', 'malaria', 'tuberculosis'],
  website: 'https://scholatia.org/groups/iamr-research',
  email: 'iamr@scholatia.org',
  verificationStatus: 'Accredited',
  administrators: [member('mbatha', 'administrator', '2023-10-01T09:00:00.000Z')],
  moderators: [member('adesina', 'moderator', '2023-11-01T09:00:00.000Z')],
  members: [member('yusuf', 'member', '2023-12-01T09:00:00.000Z'), member('dube', 'member', '2024-01-01T09:00:00.000Z'), member('okonkwo', 'guest', '2024-02-01T09:00:00.000Z')],
  publications: [pub('grp-iamr-pub-1', 'TB diagnostic accuracy trial', 'article', 'published', ['ojuri', 'mbatha'], '2025-10-10T00:00:00.000Z'), pub('grp-iamr-pub-2', 'Malaria elimination research agenda', 'report', 'in-review', ['ojuri', 'adesina'], undefined)],
  events: [evt('grp-iamr-evt-1', 'Institute research seminar', 'seminar', 'hybrid', daysAhead(9, 14), ['ojuri', 'mbatha'], 'scheduled'), evt('grp-iamr-evt-2', 'Clinical trials monitoring', 'meeting', 'in-person', daysAgo(23, 10), ['ojuri', 'dube'], 'completed')],
  resources: [res('grp-iamr-res-1', 'Ethics-approved protocol library', 'document', 'ojuri', daysAgo(31)), res('grp-iamr-res-2', 'Clinical data dictionaries', 'reference', 'mbatha', daysAgo(60))],
  discussions: [disc('grp-iamr-disc-1', 'Next diagnostic trial design', 'Which diagnostic should the next institute trial evaluate?', 'ojuri', [{ author: 'mbatha', body: 'Prioritise a point-of-care assay for community sites.', createdAt: daysAgo(5) }])],
  announcements: [annc('grp-iamr-annc-1', 'Research agenda published', 'The malaria elimination research agenda is now public.', 'ojuri', daysAgo(14), true)],
  projects: [proj('grp-iamr-proj-1', 'Malaria Elimination Consortium', 'Multi-site malaria elimination research consortium.', ['ojuri', 'mbatha', 'dube'], 'active', 'grant-malaria-consortium', 'project')],
  media: [med('grp-iamr-med-1', 'image', 'Institute laboratories', 'ojuri')],
  createdAt: '2023-09-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 21 — Astronomy & Cosmology Interest Circle
// ---------------------------------------------------------------------------

const ASTRONOMY_COSMOLOGY_INTEREST_CIRCLE: Group = createGroup({
  id: 'grp-astronomy-cosmology-circle',
  name: 'Astronomy & Cosmology Interest Circle',
  description:
    'An open circle for early-career researchers and enthusiasts studying galaxies, cosmology, and astronomical instrumentation.',
  category: 'interest-group',
  visibility: 'public',
  owner: 'maria',
  ownerName: MARIA.displayName,
  institution: 'National Autonomous University of Mexico',
  department: 'Institute of Astronomy',
  country: 'Mexico',
  discipline: 'Astrophysics',
  researchAreas: ['Cosmology', 'Galaxy Formation', 'Astronomical Instrumentation', 'Outreach'],
  keywords: ['astronomy', 'cosmology', 'outreach'],
  website: 'https://scholatia.org/groups/astronomy-cosmology-circle',
  email: 'astronomy@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/astrocirce' },
  verificationStatus: 'Pending',
  administrators: [member('gallo', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('jscholar', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [member('tanaka', 'member', '2024-05-01T09:00:00.000Z'), member('dube', 'member', '2024-06-01T09:00:00.000Z'), member('almeida', 'member', '2024-07-01T09:00:00.000Z')],
  publications: [pub('grp-astron-pub-1', 'Public observing night highlights', 'report', 'published', ['maria', 'gallo'], '2026-02-22T00:00:00.000Z')],
  events: [evt('grp-astron-evt-1', 'Nights of the Stars', 'lecture', 'in-person', daysAhead(15, 19), ['maria', 'gallo'], 'scheduled'), evt('grp-astron-evt-2', 'Cosmology reading circle', 'journal-club', 'online', daysAgo(17, 18), ['maria', 'tanaka'], 'completed')],
  resources: [res('grp-astron-res-1', 'Public lecture toolkit', 'teaching-material', 'maria', daysAgo(26)), res('grp-astron-res-2', 'Night sky event calendars', 'reference', 'gallo', daysAgo(57))],
  discussions: [disc('grp-astron-disc-1', 'Virtual observing programme', 'Should the circle offer virtual observing sessions for remote members?', 'maria', [{ author: 'gallo', body: 'Yes, and archive the sessions for the wider community.', createdAt: daysAgo(7) }])],
  announcements: [annc('grp-astron-annc-1', 'Observing night announced', 'The next Nights of the Stars session is open to all members.', 'maria', daysAgo(9), true)],
  projects: [proj('grp-astron-proj-1', 'Community observing programme', 'Community observing and astronomy outreach programme.', ['maria', 'gallo'], 'active', 'project-community-observing', 'project')],
  media: [med('grp-astron-med-1', 'image', 'Observing night gallery', 'maria')],
  createdAt: '2024-02-10T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 22 — Psychology & Language Behaviour Lab
// ---------------------------------------------------------------------------

const PSYCHOLOGY_LANGUAGE_BEHAVIOUR_LAB: Group = createGroup({
  id: 'grp-psychology-language-lab',
  name: 'Psychology & Language Behaviour Lab',
  description:
    'A department-scoped laboratory group studying language behaviour, psycholinguistics, and cognitive development.',
  category: 'laboratory',
  visibility: 'department-only',
  owner: 'kovacs',
  ownerName: KOVACS.displayName,
  institution: 'Eötvös Loránd University',
  department: 'Department of Cognitive Psychology',
  country: 'Hungary',
  discipline: 'Psychology',
  researchAreas: ['Psycholinguistics', 'Language Acquisition', 'Cognitive Development', 'Bilingualism'],
  keywords: ['psycholinguistics', 'bilingualism', 'language'],
  website: 'https://scholatia.org/groups/psychology-language-lab',
  email: 'psycholab@scholatia.org',
  socialLinks: { github: 'https://github.com/psycholab' },
  verificationStatus: 'Government Recognised',
  administrators: [member('gallo', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('jscholar', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [member('smith', 'member', '2024-04-01T09:00:00.000Z'), member('okonkwo', 'member', '2024-05-01T09:00:00.000Z'), member('das', 'guest', '2024-06-01T09:00:00.000Z')],
  publications: [pub('grp-psychlab-pub-1', 'Bilingual processing across modalities', 'article', 'in-review', ['kovacs', 'gallo'], undefined)],
  events: [evt('grp-psychlab-evt-1', 'Lab talk: language development', 'seminar', 'hybrid', daysAhead(6, 15), ['kovacs', 'jscholar'], 'scheduled')],
  resources: [res('grp-psychlab-res-1', 'Stimulus battery', 'dataset', 'kovacs', daysAgo(24)), res('grp-psychlab-res-2', 'Experiment protocols', 'document', 'gallo', daysAgo(49))],
  discussions: [disc('grp-psychlab-disc-1', 'Cross-modal priming design', 'Which priming design best isolates modality effects?', 'kovacs', [{ author: 'gallo', body: 'Use a fully crossed visual-auditory design with counterbalancing.', createdAt: daysAgo(4) }])],
  announcements: [annc('grp-psychlab-annc-1', 'Lab talk this week', 'Join the language development lab talk this week.', 'kovacs', daysAgo(2), true)],
  projects: [proj('grp-psychlab-proj-1', 'Bilingualism across the lifespan', 'Longitudinal study of bilingual development.', ['kovacs', 'gallo'], 'planning', 'project-bilingual-longitudinal', 'project')],
  media: [med('grp-psychlab-med-1', 'podcast', 'Talking language lab', 'kovacs')],
  createdAt: '2024-01-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 23 — Ocean Sustainability Network
// ---------------------------------------------------------------------------

const OCEAN_SUSTAINABILITY_NETWORK: Group = createGroup({
  id: 'grp-ocean-sustainability-network',
  name: 'Ocean Sustainability Network',
  description:
    'An open research group on oceanography, marine ecosystems, and sustainable ocean management across the Atlantic.',
  category: 'research-group',
  visibility: 'public',
  owner: 'almeida',
  ownerName: ALMEIDA.displayName,
  institution: 'University of Lisbon',
  department: 'Faculty of Sciences',
  country: 'Portugal',
  discipline: 'Oceanography',
  researchAreas: ['Oceanography', 'Marine Ecosystems', 'Blue Economy', 'Coastal Management'],
  keywords: ['ocean', 'marine', 'blue-economy'],
  website: 'https://scholatia.org/groups/ocean-sustainability-network',
  email: 'ocean@scholatia.org',
  socialLinks: { twitter: 'https://twitter.com/oceannet', linkedin: 'https://linkedin.com/company/osn' },
  verificationStatus: 'Pending',
  administrators: [member('rivers', 'administrator', '2024-03-01T09:00:00.000Z')],
  moderators: [member('kim', 'moderator', '2024-04-01T09:00:00.000Z')],
  members: [member('tanaka', 'member', '2024-05-01T09:00:00.000Z'), member('dube', 'member', '2024-06-01T09:00:00.000Z'), member('mbatha', 'member', '2024-07-01T09:00:00.000Z')],
  publications: [pub('grp-ocean-pub-1', 'Marine ecosystem health indicators', 'report', 'published', ['almeida', 'rivers'], '2026-01-30T00:00:00.000Z')],
  events: [evt('grp-ocean-evt-1', 'Blue economy symposium', 'conference', 'hybrid', daysAhead(27, 9), ['almeida', 'rivers'], 'scheduled'), evt('grp-ocean-evt-2', 'Coastal monitoring workshop', 'workshop', 'in-person', daysAgo(20, 10), ['almeida', 'kim'], 'completed')],
  resources: [res('grp-ocean-res-1', 'Open oceanographic data catalogue', 'dataset', 'almeida', daysAgo(32)), res('grp-ocean-res-2', 'Monitoring sensor guide', 'document', 'rivers', daysAgo(63))],
  discussions: [disc('grp-ocean-disc-1', 'Harmonising buoy networks', 'How can national buoy networks share standards?', 'almeida', [{ author: 'rivers', body: 'Adopt common calibration intervals and open formats.', createdAt: daysAgo(6) }])],
  announcements: [annc('grp-ocean-annc-1', 'Symposium submissions open', 'Submissions for the blue economy symposium are open.', 'almeida', daysAgo(13))],
  projects: [proj('grp-ocean-proj-1', 'Atlantic coastal monitoring', 'Transatlantic coastal monitoring collaboration.', ['almeida', 'rivers'], 'active', 'project-atlantic-monitoring', 'project')],
  media: [med('grp-ocean-med-1', 'video', 'Survey expedition footage', 'almeida')],
  createdAt: '2024-02-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 24 — AI for Public Health Project Team
// ---------------------------------------------------------------------------

const AI_FOR_PUBLIC_HEALTH_PROJECT_TEAM: Group = createGroup({
  id: 'grp-ai-for-public-health-team',
  name: 'AI for Public Health Project Team',
  description:
    'A cross-disciplinary project team applying machine learning to disease prediction, health resource allocation, and community surveillance.',
  category: 'project-team',
  visibility: 'public',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Department of Public Health',
  country: 'Nigeria',
  discipline: 'Artificial Intelligence',
  researchAreas: ['Machine Learning', 'Health Informatics', 'Predictive Modelling', 'Disease Surveillance'],
  keywords: ['ai', 'machine-learning', 'public-health'],
  website: 'https://scholatia.org/groups/ai-for-public-health-team',
  email: 'aiph@scholatia.org',
  socialLinks: { github: 'https://github.com/aiph' },
  verificationStatus: 'Pending',
  administrators: [member('okonkwo', 'administrator', '2024-02-01T09:00:00.000Z')],
  moderators: [member('das', 'moderator', '2024-03-01T09:00:00.000Z')],
  members: [member('jscholar', 'member', '2024-04-01T09:00:00.000Z'), member('mbatha', 'member', '2024-05-01T09:00:00.000Z'), member('gallo', 'member', '2024-06-01T09:00:00.000Z'), member('yusuf', 'guest', '2024-07-01T09:00:00.000Z')],
  publications: [pub('grp-aiph-pub-1', 'Predictive models for outbreak early warning', 'preprint', 'in-review', ['ojuri', 'okonkwo', 'das'], undefined)],
  events: [evt('grp-aiph-evt-1', 'Model review sprint', 'workshop', 'online', daysAhead(11, 10), ['okonkwo', 'das'], 'scheduled'), evt('grp-aiph-evt-2', 'Data ethics clinic', 'seminar', 'hybrid', daysAgo(25, 14), ['ojuri', 'jscholar'], 'completed')],
  resources: [res('grp-aiph-res-1', 'Early warning model notebook', 'software', 'das', daysAgo(16), 'https://github.com/aiph/notebooks'), res('grp-aiph-res-2', 'Anonymised health dataset', 'dataset', 'okonkwo', daysAgo(46))],
  discussions: [disc('grp-aiph-disc-1', 'Model governance for deployment', 'What guardrails are needed before deploying early warning models?', 'ojuri', [{ author: 'das', body: 'Require prospective validation and a human-in-the-loop review.', createdAt: daysAgo(3) }])],
  announcements: [annc('grp-aiph-annc-1', 'Early warning prototype', 'The first outbreak early warning prototype is ready for piloting.', 'ojuri', daysAgo(6), true)],
  projects: [proj('grp-aiph-proj-1', 'Community Health Surveillance Dashboard', 'Open dashboard for district-level disease surveillance.', ['ojuri', 'okonkwo', 'das'], 'active', 'inno-health-dashboard', 'project')],
  media: [med('grp-aiph-med-1', 'presentation', 'Model preview', 'okonkwo')],
  createdAt: '2024-01-20T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 25 — Department of Computer Science Group (OAU)
// ---------------------------------------------------------------------------

const OAU_COMPUTER_SCIENCE_DEPARTMENT_GROUP: Group = createGroup({
  id: 'grp-oau-computer-science-dept',
  name: 'Department of Computer Science Group (OAU)',
  description:
    'The department group for Computer Science and Engineering at Obafemi Awolowo University, coordinating teaching, labs, and research.',
  category: 'department',
  visibility: 'department-only',
  owner: 'okonkwo',
  ownerName: OKONKWO.displayName,
  institution: 'Obafemi Awolowo University',
  institutionId: 'INST-OAU-003',
  department: 'Department of Computer Science and Engineering',
  country: 'Nigeria',
  discipline: 'Computer Science',
  researchAreas: ['Machine Learning', 'Software Engineering', 'Artificial Intelligence', 'Embedded Systems'],
  keywords: ['department', 'computer-science', 'oau'],
  website: 'https://scholatia.org/groups/oau-computer-science-dept',
  email: 'csdept@scholatia.org',
  verificationStatus: 'Accredited',
  administrators: [member('jscholar', 'administrator', '2023-09-01T09:00:00.000Z')],
  moderators: [member('ndlovu', 'moderator', '2023-10-01T09:00:00.000Z')],
  members: [member('ojuri', 'member', '2023-11-01T09:00:00.000Z'), member('gallo', 'member', '2023-12-01T09:00:00.000Z'), member('dube', 'member', '2024-01-01T09:00:00.000Z')],
  publications: [pub('grp-csdept-pub-1', 'Department research output report', 'report', 'published', ['okonkwo', 'jscholar'], '2026-02-10T00:00:00.000Z')],
  events: [evt('grp-csdept-evt-1', 'Department seminar series', 'seminar', 'hybrid', daysAhead(8, 15), ['okonkwo', 'ndlovu'], 'scheduled'), evt('grp-csdept-evt-2', 'Lab open day', 'workshop', 'in-person', daysAgo(30, 10), ['okonkwo'], 'completed')],
  resources: [res('grp-csdept-res-1', 'Graduate thesis template', 'teaching-material', 'okonkwo', daysAgo(21)), res('grp-csdept-res-2', 'Lab equipment booking policy', 'document', 'jscholar', daysAgo(54))],
  discussions: [disc('grp-csdept-disc-1', 'Curriculum refresh', 'Which elective tracks should the department introduce next year?', 'okonkwo', [{ author: 'jscholar', body: 'Add an AI and data science track with industry placement.', createdAt: daysAgo(5) }])],
  announcements: [annc('grp-csdept-annc-1', 'Seminar series begins', 'The department seminar series resumes this month.', 'okonkwo', daysAgo(10), true)],
  projects: [proj('grp-csdept-proj-1', 'Intelligent Systems Laboratory', 'Laboratory research on machine learning and computer vision.', ['okonkwo', 'jscholar'], 'active', 'oau-lab-intelligent', 'collaboration')],
  media: [med('grp-csdept-med-1', 'image', 'Department labs', 'okonkwo')],
  createdAt: '2023-08-15T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Group 26 — University of Ibadan Research Network
// ---------------------------------------------------------------------------

const UNIVERSITY_OF_IBADAN_RESEARCH_NETWORK: Group = createGroup({
  id: 'grp-university-of-ibadan-network',
  name: 'University of Ibadan Research Network',
  description:
    'The cross-faculty institution group for the University of Ibadan, connecting researchers across medicine, science, arts, and social sciences.',
  category: 'institution',
  visibility: 'public',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  institution: 'University of Ibadan',
  institutionId: 'INST-UI-001',
  department: 'Office of Research Management',
  country: 'Nigeria',
  discipline: 'Multidisciplinary',
  researchAreas: ['Multidisciplinary Research', 'Research Infrastructure', 'Grant Coordination', 'Research Ethics'],
  keywords: ['ibadan', 'institution', 'multidisciplinary'],
  website: 'https://scholatia.org/groups/university-of-ibadan-network',
  email: 'network@scholatia.org',
  socialLinks: { linkedin: 'https://linkedin.com/company/uiresearch', twitter: 'https://twitter.com/uiresearch' },
  verificationStatus: 'Verified',
  administrators: [member('okonkwo', 'administrator', '2023-06-01T09:00:00.000Z'), member('adesina', 'administrator', '2023-07-01T09:00:00.000Z')],
  moderators: [member('mbatha', 'moderator', '2023-08-01T09:00:00.000Z'), member('yusuf', 'moderator', '2023-09-01T09:00:00.000Z')],
  members: [
    member('jscholar', 'member', '2023-10-01T09:00:00.000Z'),
    member('gallo', 'member', '2023-11-01T09:00:00.000Z'),
    member('dube', 'member', '2023-12-01T09:00:00.000Z'),
    member('maria', 'member', '2024-01-01T09:00:00.000Z'),
    member('smith', 'guest', '2024-02-01T09:00:00.000Z'),
    member('hussain', 'visitor', '2024-03-01T09:00:00.000Z'),
  ],
  publications: [pub('grp-uiresearch-pub-1', 'Annual research output compendium', 'report', 'published', ['ojuri', 'okonkwo'], '2026-04-15T00:00:00.000Z')],
  events: [evt('grp-uiresearch-evt-1', 'Cross-faculty research mixer', 'meeting', 'in-person', daysAhead(19, 15), ['ojuri', 'adesina'], 'scheduled'), evt('grp-uiresearch-evt-2', 'Grant writing clinic', 'workshop', 'hybrid', daysAgo(29, 10), ['ojuri', 'yusuf'], 'completed')],
  resources: [res('grp-uiresearch-res-1', 'Institutional grant handbook', 'guideline', 'ojuri', daysAgo(38)), res('grp-uiresearch-res-2', 'Research ethics guidance', 'reference', 'mbatha', daysAgo(72))],
  discussions: [disc('grp-uiresearch-disc-1', 'Shared research instruments', 'Should the university maintain a shared instruments registry?', 'ojuri', [{ author: 'okonkwo', body: 'Yes, with booking and maintenance records per instrument.', createdAt: daysAgo(6) }])],
  announcements: [annc('grp-uiresearch-annc-1', 'Annual research day', 'Save the date for the university annual research day.', 'ojuri', daysAgo(18), true)],
  projects: [proj('grp-uiresearch-proj-1', 'Institute for Advanced Medical Research', 'Flagship centre for tropical disease research.', ['ojuri', 'mbatha'], 'active', 'ui-centre-iamr', 'collaboration')],
  media: [med('grp-uiresearch-med-1', 'image', 'Research day highlights', 'ojuri')],
  createdAt: '2023-05-01T09:00:00.000Z',
});

// ---------------------------------------------------------------------------
// Derived aggregates — statistics, analytics, insights, portfolio
// ---------------------------------------------------------------------------

export const GROUPS: Group[] = [
  WEST_AFRICAN_HEALTH_CONSORTIUM,
  MULTILINGUAL_NLP_RESEARCH_GROUP,
  AFRICAN_LANGUAGES_TECHNOLOGY_COLLECTIVE,
  ENERGY_SYSTEMS_AND_SMART_GRIDS_NETWORK,
  GALAXY_SIMULATION_NETWORK,
  MEDIEVAL_MANUSCRIPTS_WORKING_GROUP,
  SOFT_ROBOTICS_LABORATORY_GROUP,
  TROPICAL_MEDICINE_EDITORIAL_GROUP,
  DIGITAL_HEALTH_INNOVATION_COMMUNITY,
  CLIMATE_ADAPTATION_RESEARCH_CLUSTER,
  QUANTUM_COMPUTING_INTEREST_GROUP,
  OPEN_SCIENCE_MOVEMENT,
  MATERIALS_SCIENCE_COLLABORATION_GROUP,
  CSIR_CYBERSECURITY_RESEARCH_GROUP,
  AGRICULTURAL_ECONOMICS_FORUM,
  UI_PUBLIC_HEALTH_FACULTY_GROUP,
  COMPUTATIONAL_BIOLOGY_CONSORTIUM,
  NETWORK_SCIENCE_EDITORIAL_GROUP,
  AFRICA_POLICY_RESEARCH_INSTITUTE,
  INSTITUTE_FOR_ADVANCED_MEDICAL_RESEARCH_GROUP,
  ASTRONOMY_COSMOLOGY_INTEREST_CIRCLE,
  PSYCHOLOGY_LANGUAGE_BEHAVIOUR_LAB,
  OCEAN_SUSTAINABILITY_NETWORK,
  AI_FOR_PUBLIC_HEALTH_PROJECT_TEAM,
  OAU_COMPUTER_SCIENCE_DEPARTMENT_GROUP,
  UNIVERSITY_OF_IBADAN_RESEARCH_NETWORK,
];

export const GROUP_STATISTICS: GroupStatistics = groupStatistics(GROUPS);
export const GROUP_ANALYTICS: GroupAnalytics = groupAnalytics(GROUPS);
export const GROUP_INSIGHTS: GroupInsight[] = groupInsights(GROUPS);
export const GROUP_PORTFOLIO: GroupPortfolio = buildGroupPortfolio(GROUPS, { top: 6 });

export const FEATURED_GROUPS = GROUP_PORTFOLIO.featured;
export const CURRENT_GROUPS_USER = CURRENT_USER;
export const DEFAULT_GROUP_CATEGORY = 'research-group' as const;
export const DEFAULT_GROUP_VISIBILITY: GroupVisibility = 'public';
export const DEFAULT_GROUP = WEST_AFRICAN_HEALTH_CONSORTIUM;

export const GROUP_COUNTRIES = Array.from(new Set(GROUPS.map((group) => group.country))).sort();
export const GROUP_INSTITUTIONS = Array.from(
  new Set(GROUPS.map((group) => `${group.institution}${group.institutionId ? `|${group.institutionId}` : ''}`)),
).sort();
export const GROUP_DISCIPLINES = Array.from(new Set(GROUPS.map((group) => group.discipline))).sort();
export const GROUP_RESEARCH_AREAS = Array.from(new Set(GROUPS.flatMap((group) => group.researchAreas))).sort();
export const GROUP_KEYWORDS = Array.from(new Set(GROUPS.flatMap((group) => group.keywords))).sort();

export const GROUP_CATEGORY_OPTIONS = GROUP_CATEGORIES;
export const GROUP_VISIBILITY_OPTIONS = GROUP_VISIBILITIES;

export type {
  GroupAnnouncement,
  GroupDiscussion,
  GroupEvent,
  GroupMedia,
  GroupMember,
  GroupProject,
  GroupPublication,
  GroupResource,
};
