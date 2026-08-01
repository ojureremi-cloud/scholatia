import type { ConferenceProfile, ConferenceSubmissionType } from '@/types/identity';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Canonical research lifecycle stage that every conference in Scholatia belongs
 * to. Conferences are stage 12 of the lifecycle (Conference Dissemination),
 * sitting between Publication and Citation.
 */
export const CONFERENCE_LIFECYCLE_STAGE_ID: ResearchLifecycleStageId = 'conference';

export type ConferencePaperStatus = 'Accepted' | 'In Production' | 'Published';

export interface ConferenceAcceptedPaper {
  id: string;
  conferenceId: string;
  title: string;
  authors: string[];
  submissionType: ConferenceSubmissionType;
  track: string;
  status: ConferencePaperStatus;
  sessionId?: string;
  presentationSlot?: string;
  room?: string;
  pageRange?: string;
  doi?: string;
  proceedings?: string;
  bestPaperAward?: string;
}

export type ConferenceSessionType = 'Keynote' | 'Oral' | 'Poster' | 'Panel' | 'Demo' | 'Workshop' | 'Tutorial';

export interface ConferenceSession {
  id: string;
  conferenceId: string;
  name: string;
  track: string;
  date: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  mode?: 'In Person' | 'Virtual' | 'Hybrid';
  chairs: string[];
  paperIds: string[];
  type: ConferenceSessionType;
}

export interface ConferenceTrack {
  id: string;
  conferenceId: string;
  name: string;
  description?: string;
  chairs?: string[];
  paperCount?: number;
}

export interface ConferenceKeynoteSpeaker {
  id: string;
  conferenceId: string;
  name: string;
  affiliation: string;
  talkTitle: string;
  abstract?: string;
}

export interface ConferenceProceedings {
  id: string;
  conferenceId: string;
  title: string;
  publisher: string;
  issn?: string;
  eissn?: string;
  doiPrefix?: string;
  volume?: string;
  year: string;
  numberOfPapers: number;
  publicationStatus: 'Published' | 'In Production' | 'Planned';
  publicationDate?: string;
  editors?: string[];
  indexing?: string[];
}

export interface BestPaperAward {
  id: string;
  conferenceId: string;
  category:
    | 'Best Paper'
    | 'Best Student Paper'
    | 'Best Demo'
    | 'Best Dataset'
    | 'Best Poster'
    | 'Honourable Mention';
  title: string;
  authors: string[];
  paperId?: string;
  prize?: string;
}

export interface ConferenceWorkshop {
  id: string;
  conferenceId: string;
  title: string;
  organisers: string[];
  date: string;
  duration?: string;
  format: 'Workshop' | 'Doctoral Consortium' | 'Symposium';
  theme: string;
  topics: string[];
  submissionDeadline?: string;
  paperCount?: number;
}

export interface ConferenceTutorial {
  id: string;
  conferenceId: string;
  title: string;
  instructors: string[];
  date: string;
  duration?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'Hands-on' | 'Lecture' | 'Hybrid';
  prerequisites?: string;
  capacity?: number;
}

export interface SessionChair {
  id: string;
  conferenceId: string;
  name: string;
  affiliation?: string;
  track?: string;
  session?: string;
}

export interface TravelGrant {
  id: string;
  conferenceId: string;
  name: string;
  amount: string;
  region?: string;
  eligibility: string;
  deadline: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  fundingPartner?: string;
}

export interface VisaInformation {
  conferenceId: string;
  country: string;
  invitationLetterAvailable: boolean;
  processingTimeDays?: number;
  requirements: string[];
  supportContact?: string;
}

export interface ConferenceAnalytics {
  conferenceId: string;
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number;
  totalAttendees: number;
  registeredAttendees: number;
  countriesRepresented: number;
  keynoteCount: number;
  paperCount: number;
  workshopCount: number;
  tutorialCount: number;
  demoCount: number;
  totalSponsors: number;
  travelGrantsAwarded: number;
  bestPaperAwards: number;
  participantSatisfaction?: number;
}

export interface ConferenceRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

export interface ConferenceRelationships {
  projects: ConferenceRelationshipRef[];
  datasets: ConferenceRelationshipRef[];
  manuscripts: ConferenceRelationshipRef[];
  publications: ConferenceRelationshipRef[];
  researchers: ConferenceRelationshipRef[];
  institutions: ConferenceRelationshipRef[];
  funding: ConferenceRelationshipRef[];
}

export interface ConferencePortfolioStatistics {
  totalConferences: number;
  upcomingConferences: number;
  completedConferences: number;
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number;
  totalAttendees: number;
  totalKeynotes: number;
  totalWorkshops: number;
  totalTutorials: number;
  totalSponsors: number;
  countriesRepresented: number;
  avgTrustScore: number;
}

/**
 * A conference profile enriched with the full dissemination ecosystem of the
 * conference stage: tracks, accepted papers, sessions, keynote speakers,
 * workshops, tutorials, session chairs, proceedings, awards, travel grants,
 * visa information, and analytics. The conference model itself stays the
 * existing `ConferenceProfile`; this type only layers the stage-12 ecosystem on
 * top of it.
 */
export interface ConferenceRecord extends ConferenceProfile {
  tracks: ConferenceTrack[];
  acceptedPapers: ConferenceAcceptedPaper[];
  sessions: ConferenceSession[];
  keynoteSpeakers: ConferenceKeynoteSpeaker[];
  workshops: ConferenceWorkshop[];
  tutorials: ConferenceTutorial[];
  sessionChairs: SessionChair[];
  proceedings?: ConferenceProceedings;
  bestPaperAwards: BestPaperAward[];
  travelGrants: TravelGrant[];
  visa?: VisaInformation;
  analytics: ConferenceAnalytics;
  submissionDeadline?: string;
  cameraReadyDeadline?: string;
}
