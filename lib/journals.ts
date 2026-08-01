import type { JournalProfile, EditorialStructureMember, ArticleSummary, IssueSummary, VolumeSummary } from '@/types/identity';

export function createJournalProfile(overrides: Partial<JournalProfile> = {}): JournalProfile {
  return {
    journalId: 'JNL-001',
    journalTitle: 'Scholatia Journal of Open Research',
    shortTitle: 'SJOR',
    issn: '1234-5678',
    eissn: '2345-6789',
    publicationType: 'Journal',
    publisher: 'Scholatia Press',
    institution: 'Scholatia Partner Institution',
    country: 'United Kingdom',
    language: 'English',
    discipline: 'Computer Science',
    researchAreas: ['Artificial Intelligence', 'Open Science'],
    aimsAndScope: 'A trusted venue for rigorous, transparent, and impactful scholarly work.',
    editorialPolicy: 'The journal follows transparent and inclusive editorial practices.',
    openAccessStatus: 'Open Access',
    publicationFrequency: 'Monthly',
    reviewModel: 'Double Blind',
    indexingServices: ['DOAJ', 'Crossref'],
    website: 'https://example.org/journal',
    verificationStatus: 'Verified',
    trustScore: 93,
    editorialStructure: [
      { role: 'Editor-in-Chief', name: 'Prof. S. Patel' },
      { role: 'Managing Editor', name: 'Dr. N. Owusu' },
    ],
    submissionTypes: ['Research Article', 'Review Article', 'Short Communication'],
    peerReviewModes: ['Double Blind', 'Open Review'],
    workflow: ['Submission', 'Editorial Screening', 'Reviewer Assignment', 'Peer Review', 'Decision', 'Revision', 'Acceptance', 'Copyediting', 'Typesetting', 'Proofreading', 'Publication', 'Archiving'],
    editors: ['Prof. S. Patel'],
    reviewBoard: ['Dr. N. Owusu'],
    productionTeam: ['Production Office'],
    publishingStaff: ['Publishing Team'],
    articles: [{ title: 'Trust in Scholarly Infrastructure', authors: ['A. Smith'], status: 'Accepted' }],
    issues: [{ issueNumber: '1', year: '2026', status: 'Published' }],
    volumes: [{ volumeNumber: '1', year: '2026', status: 'Published' }],
    latestIssue: 'Issue 1, 2026',
    doiPrefix: '10.1234',
    impactMetrics: {
      impactFactor: 2.8,
      fiveYearImpactFactor: 3.1,
      citeScore: 4.2,
      sjr: 1.05,
      snip: 1.2,
      hIndex: 42,
      totalCitations: 12800,
      totalDownloads: 245000,
      quartile: 'Q1',
    },
    indexingRecords: [
      { service: 'DOAJ', status: 'Indexed' },
      { service: 'Crossref', status: 'Indexed' },
    ],
    callsForPapers: [],
    publicationQueue: [],
    issueSchedule: [],
    editorialDecisionStats: {
      submitted: 120,
      underReview: 24,
      inRevision: 12,
      accepted: 30,
      rejected: 45,
      inProduction: 9,
      published: 260,
      acceptanceRate: 31,
      rejectionRate: 42,
      avgDaysToFirstDecision: 42,
      avgDaysToAcceptance: 145,
    },
    policy: {
      articleProcessingCharges: 'None',
      submissionFee: 'None',
      embargoPeriod: 'None',
      licensing: 'Creative Commons Attribution 4.0 (CC BY)',
      copyright: 'Authors retain copyright',
      plagiarismPolicy: 'Screened with plagiarism detection software',
      dataPolicy: 'Data availability statements required',
      ethicsPolicy: 'Compliance with research ethics standards',
      appealsPolicy: 'Authors may appeal editorial decisions',
      conflictsOfInterestPolicy: 'All conflicts of interest must be declared',
      preprintsPolicy: 'Preprints permitted',
    },
    analytics: {
      annualSubmissions: 145,
      annualPublications: 62,
      acceptanceRate: 31,
      rejectionRate: 42,
      totalDownloads: 245000,
      totalCitations: 12800,
      altmetricScore: 87,
      googleScholarRank: 'Top 10%',
      medianDaysToFirstDecision: 42,
      medianDaysToAcceptance: 145,
    },
    ...overrides,
  };
}

export function createEditorialStructureMember(role: EditorialStructureMember['role']): EditorialStructureMember {
  return {
    role,
    name: 'TBD',
  };
}

export function createArticleSummary(title: string): ArticleSummary {
  return {
    title,
    authors: ['TBD'],
    status: 'Draft',
  };
}

export function createIssueSummary(issueNumber: string): IssueSummary {
  return {
    issueNumber,
    year: new Date().getFullYear().toString(),
    status: 'Upcoming',
  };
}

export function createVolumeSummary(volumeNumber: string): VolumeSummary {
  return {
    volumeNumber,
    year: new Date().getFullYear().toString(),
    status: 'Upcoming',
  };
}
