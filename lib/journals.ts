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
