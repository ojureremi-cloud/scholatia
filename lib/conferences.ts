import type { ConferenceProfile, ConferenceCommitteeMember, ConferenceRegistrationOption, ConferenceSubmissionOption } from '@/types/identity';

export function createConferenceProfile(overrides: Partial<ConferenceProfile> = {}): ConferenceProfile {
  return {
    conferenceId: 'CONF-001',
    conferenceCode: 'SCH-2026',
    title: 'Scholatia International Conference on Research and Innovation',
    shortTitle: 'SIRI 2026',
    eventType: 'International Conference',
    theme: 'Responsible AI and Open Scientific Inquiry',
    subTheme: 'Trust, Verification and Collaboration',
    description: 'A flagship scholarly event connecting researchers, institutions and publishers across the globe.',
    objectives: ['Advance interdisciplinary research', 'Support scholarly exchange', 'Showcase verified academic work'],
    venue: 'London Convention Centre',
    virtualPlatform: 'Scholatia Live',
    country: 'United Kingdom',
    city: 'London',
    institution: 'Scholatia Partner Institution',
    startDate: '2026-09-15',
    endDate: '2026-09-17',
    timezone: 'GMT',
    language: 'English',
    posterImage: '/images/conference-poster.jpg',
    logo: '/images/conference-logo.png',
    organisers: ['Scholatia', 'Partner Institution'],
    sponsors: ['Scholatia', 'Open Science Foundation'],
    partners: ['Research Network'],
    registrationStatus: 'Open',
    submissionStatus: 'Open',
    verificationStatus: 'Verified',
    trustScore: 91,
    researchAreas: ['Artificial Intelligence', 'Open Science'],
    keywords: ['research', 'conference', 'verification'],
    committee: [
      { role: 'Conference Chair', name: 'Prof. A. Rivera' },
      { role: 'Programme Chair', name: 'Dr. L. Chen' },
    ],
    registrations: [
      { audience: 'Researchers', status: 'Open', fee: 'Free' },
      { audience: 'Students', status: 'Limited', fee: 'Free' },
    ],
    submissions: [
      { type: 'Abstract', required: true, deadline: '2026-07-30' },
      { type: 'Full Paper', required: false, deadline: '2026-08-20' },
    ],
    speakers: ['Prof. A. Rivera', 'Dr. L. Chen'],
    schedule: ['Registration opens', 'Keynote sessions', 'Networking dinner'],
    registrationUrl: 'https://example.org/register',
    submissionUrl: 'https://example.org/submit',
    website: 'https://example.org/conference',
    ...overrides,
  };
}

export function createConferenceCommitteeMember(role: ConferenceCommitteeMember['role']): ConferenceCommitteeMember {
  return {
    role,
    name: 'TBD',
  };
}

export function createConferenceRegistrationOption(audience: ConferenceRegistrationOption['audience']): ConferenceRegistrationOption {
  return {
    audience,
    status: 'Open',
    fee: 'TBD',
  };
}

export function createConferenceSubmissionOption(type: ConferenceSubmissionOption['type']): ConferenceSubmissionOption {
  return {
    type,
    required: true,
  };
}
