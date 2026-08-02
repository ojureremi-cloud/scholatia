import {
  addReviewComment,
  addReviewVoiceNote,
  approveApproval,
  completeReviewCycle,
  createApproval,
  createReview,
  createReviewCycle,
  openNextReviewRound,
  requestApprovalMinorRevision,
  reviewAnalytics,
  reviewStatistics,
  setReviewStatus,
  submitReview,
} from '@/lib/reviews';
import type {
  Approval,
  ApprovalHistoryEntry,
  Review,
  ReviewAnalytics,
  ReviewCycle,
  ReviewStatistics,
} from '@/types/reviews';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';
import {
  CONFERENCE_WORKFLOW,
  ETHICS_WORKFLOW,
  GRANT_WORKFLOW,
  JOURNAL_WORKFLOW,
  PHD_WORKFLOW,
} from '@/constants/placeholder-workflows';

/**
 * Placeholder review & approval data for the Scholatia Review & Approval
 * Engine (Phase 2.2E SWTROP).
 *
 * Review cycles are universal and round-agnostic — the thesis cycle is already
 * at round 4, the journal cycle at round 2, with no fixed Review 1/2/3
 * anywhere. Voice review is first-class: the supervisory review carries typed
 * comments, voice comments with retained audio, inline annotations, and a
 * voice reply. Approvals carry an append-only decision history built through
 * the engine. Everything reviewed references canonical workflows through
 * `workflowId` and canonical sources through `sourceId` + `sourceEntity`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-01T12:00:00.000Z');

function researcherOf(username: string): ResearcherProfile {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  if (!found) {
    throw new Error(`Missing researcher seed: ${username}`);
  }
  return found;
}

const OJURI = researcherOf('ojuri');
const SMITH = researcherOf('smith');
const JSCHOLAR = researcherOf('jscholar');
const TANAKA = researcherOf('tanaka');
const OKONKWO = researcherOf('okonkwo');
const ADEBAYO = researcherOf('adebayo');
const RIVERS = researcherOf('rivers');
const WANG = researcherOf('wang');

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
// Review cycle 1 — Journal manuscript (round 2, minor-revision in progress)
// ---------------------------------------------------------------------------

let journalCycle = createReviewCycle({
  round: 1,
  workflowId: JOURNAL_WORKFLOW.id,
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
  requestedBy: OJURI.username,
  requestedByName: OJURI.displayName,
  openedAt: daysAgo(90),
});

const journalReviewOneCreated = createReview({
  cycle: journalCycle,
  reviewer: SMITH.username,
  reviewerName: SMITH.displayName,
  kind: 'peer-review',
  title: 'Review 1 — Low-resource toolkit',
  description: 'Full peer review of the manuscript.',
  dueAt: daysAgo(80),
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
});
journalCycle = journalReviewOneCreated.cycle;
submitReview({
  review: journalReviewOneCreated.review,
  decision: 'major-revision',
  comments: [
    { author: SMITH.username, authorName: SMITH.displayName, type: 'summary', body: 'Solid contribution; evaluation methodology needs to be fully reproducible.' },
    { author: SMITH.username, authorName: SMITH.displayName, type: 'inline', body: 'Report variance across seeds here.', inlineAnchor: 'experiments.setup' },
  ],
  now: daysAgo(80),
});

journalCycle = completeReviewCycle(journalCycle, daysAgo(80));
journalCycle = openNextReviewRound(journalCycle, daysAgo(30));

const journalReviewTwoCreated = createReview({
  cycle: journalCycle,
  reviewer: SMITH.username,
  reviewerName: SMITH.displayName,
  kind: 'peer-review',
  title: 'Re-review after revisions',
  dueAt: daysAhead(7),
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
});
journalCycle = journalReviewTwoCreated.cycle;
setReviewStatus(journalReviewTwoCreated.review, 'in-progress', daysAgo(3));
addReviewComment({
  review: journalReviewTwoCreated.review,
  author: SMITH.username,
  authorName: SMITH.displayName,
  type: 'general',
  body: 'Methodology much improved. Two remaining minor points below.',
  now: daysAgo(3),
});

const JOURNAL_REVIEW_CYCLE = journalCycle;

// ---------------------------------------------------------------------------
// Review cycle 2 — Conference submission (round 1 completed, approved)
// ---------------------------------------------------------------------------

let conferenceCycle = createReviewCycle({
  round: 1,
  workflowId: CONFERENCE_WORKFLOW.id,
  sourceId: 'CONF-001',
  sourceEntity: 'conference',
  requestedBy: OJURI.username,
  requestedByName: OJURI.displayName,
  openedAt: daysAgo(60),
});

const conferenceReviewCreated = createReview({
  cycle: conferenceCycle,
  reviewer: TANAKA.username,
  reviewerName: TANAKA.displayName,
  kind: 'peer-review',
  title: 'SIRI-2026 program committee review',
  dueAt: daysAgo(40),
  sourceId: 'CONF-001',
  sourceEntity: 'conference',
});
conferenceCycle = conferenceReviewCreated.cycle;
submitReview({
  review: conferenceReviewCreated.review,
  decision: 'approve',
  comments: [
    { author: TANAKA.username, authorName: TANAKA.displayName, type: 'summary', body: 'Strong evaluation; recommend acceptance for the Open Science Infrastructure track.' },
  ],
  now: daysAgo(30),
});
conferenceCycle = completeReviewCycle(conferenceCycle, daysAgo(30));

const CONFERENCE_REVIEW_CYCLE = conferenceCycle;

// ---------------------------------------------------------------------------
// Review cycle 3 — PhD thesis supervisory cycle (round 4, voice review)
// ---------------------------------------------------------------------------

let thesisCycle = createReviewCycle({
  round: 1,
  workflowId: PHD_WORKFLOW.id,
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  requestedBy: JSCHOLAR.username,
  requestedByName: JSCHOLAR.displayName,
  openedAt: daysAgo(320),
});

const thesisReviewCreated = createReview({
  cycle: thesisCycle,
  reviewer: ADEBAYO.username,
  reviewerName: ADEBAYO.displayName,
  kind: 'supervisory',
  title: 'Supervisory review — Chapter 4',
  dueAt: daysAgo(10),
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
});
thesisCycle = thesisReviewCreated.cycle;
submitReview({
  review: thesisReviewCreated.review,
  decision: 'minor-revision',
  comments: [
    { author: ADEBAYO.username, authorName: ADEBAYO.displayName, type: 'general', body: 'Strengthen the error analysis section and add a cross-lingual transfer discussion.' },
    { author: ADEBAYO.username, authorName: ADEBAYO.displayName, type: 'inline', body: 'Show dialect-cluster accuracy separately here.', inlineAnchor: 'chapter4.results' },
  ],
  now: daysAgo(12),
});
thesisCycle = completeReviewCycle(thesisCycle, daysAgo(12));
thesisCycle = openNextReviewRound(thesisCycle, daysAgo(8));

const thesisReviewTwoCreated = createReview({
  cycle: thesisCycle,
  reviewer: ADEBAYO.username,
  reviewerName: ADEBAYO.displayName,
  kind: 'supervisory',
  title: 'Round 4 — voice review',
  dueAt: daysAgo(4),
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
});
thesisCycle = thesisReviewTwoCreated.cycle;
let thesisReviewTwo: Review = thesisReviewTwoCreated.review;
thesisReviewTwo = addReviewVoiceNote({
  review: thesisReviewTwo,
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  transcript: 'The error analysis section is now much stronger. Please also discuss cross-lingual transfer before the final seminar.',
  audioUrl: 'https://cdn.scholatia.test/audio/supervision-round-4.mp3',
  durationSeconds: 94,
  status: 'transcribed',
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  now: daysAgo(6),
});
thesisReviewTwo = addReviewVoiceNote({
  review: thesisReviewTwo,
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  transcript: 'One more point: cite the 2025 low-resource parsing work in related work.',
  durationSeconds: 22,
  status: 'recorded',
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  now: daysAgo(6),
});
thesisReviewTwo = addReviewComment({
  review: thesisReviewTwo,
  author: JSCHOLAR.username,
  authorName: JSCHOLAR.displayName,
  type: 'reply',
  body: 'Thank you — I have addressed the error analysis note and will add the cross-lingual transfer discussion.',
  parentCommentId: thesisReviewTwo.comments[0]?.id,
  now: daysAgo(5),
});
thesisReviewTwo = setReviewStatus(thesisReviewTwo, 'in-progress', daysAgo(5));

const THESIS_REVIEW_CYCLE = thesisCycle;

// ---------------------------------------------------------------------------
// Review cycle 4 — Ethics review (completed, approved)
// ---------------------------------------------------------------------------

let ethicsCycle = createReviewCycle({
  round: 1,
  workflowId: ETHICS_WORKFLOW.id,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  requestedBy: OJURI.username,
  requestedByName: OJURI.displayName,
  openedAt: daysAgo(50),
});

const ethicsReviewCreated = createReview({
  cycle: ethicsCycle,
  reviewer: OKONKWO.username,
  reviewerName: OKONKWO.displayName,
  kind: 'ethics',
  title: 'Ethics committee review',
  dueAt: daysAgo(35),
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
});
ethicsCycle = ethicsReviewCreated.cycle;
submitReview({
  review: ethicsReviewCreated.review,
  decision: 'approve',
  comments: [
    { author: OKONKWO.username, authorName: OKONKWO.displayName, type: 'summary', body: 'Consent and data protection arrangements are adequate.' },
  ],
  now: daysAgo(20),
});
ethicsCycle = completeReviewCycle(ethicsCycle, daysAgo(20));

const ETHICS_REVIEW_CYCLE = ethicsCycle;

// ---------------------------------------------------------------------------
// Review cycle 5 — Grant review (round 1 open, in-progress)
// ---------------------------------------------------------------------------

let grantCycle = createReviewCycle({
  round: 1,
  workflowId: GRANT_WORKFLOW.id,
  sourceId: 'nih',
  sourceEntity: 'funding',
  requestedBy: WANG.username,
  requestedByName: WANG.displayName,
  openedAt: daysAgo(28),
});

const grantReviewCreated = createReview({
  cycle: grantCycle,
  reviewer: RIVERS.username,
  reviewerName: RIVERS.displayName,
  kind: 'grant',
  title: 'NIH panel review',
  dueAt: daysAhead(10),
  sourceId: 'nih',
  sourceEntity: 'funding',
});
grantCycle = grantReviewCreated.cycle;
setReviewStatus(grantReviewCreated.review, 'in-progress', daysAgo(12));
addReviewComment({
  review: grantReviewCreated.review,
  author: RIVERS.username,
  authorName: RIVERS.displayName,
  type: 'general',
  body: 'The infrastructure angle is compelling; checking feasibility of the corpus targets.',
  now: daysAgo(11),
});

const GRANT_REVIEW_CYCLE = grantCycle;

export const REVIEW_CYCLES: ReviewCycle[] = [
  JOURNAL_REVIEW_CYCLE,
  CONFERENCE_REVIEW_CYCLE,
  THESIS_REVIEW_CYCLE,
  ETHICS_REVIEW_CYCLE,
  GRANT_REVIEW_CYCLE,
];

// ---------------------------------------------------------------------------
// Approvals (append-only decision history)
// ---------------------------------------------------------------------------

let proposalApproval = createApproval({
  kind: 'proposal-approval',
  title: 'Proposal approval — multilingual parsing thesis',
  description: 'Supervisory approval of the doctoral research proposal.',
  approver: ADEBAYO.username,
  approverName: ADEBAYO.displayName,
  approverRole: 'supervisor',
  requestedBy: JSCHOLAR.username,
  requestedByName: JSCHOLAR.displayName,
  workflowId: PHD_WORKFLOW.id,
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  createdAt: daysAgo(300),
});
const proposalHistory = approveApproval(proposalApproval, ADEBAYO.username, ADEBAYO.displayName, 'Approved with minor scope refinements.', daysAgo(299));
proposalApproval = proposalHistory.approval;

const thesisChapterApproval = createApproval({
  kind: 'chapter-approval',
  title: 'Chapter 4 approval',
  description: 'Supervisor sign-off on the revised Chapter 4.',
  approver: ADEBAYO.username,
  approverName: ADEBAYO.displayName,
  approverRole: 'supervisor',
  requestedBy: JSCHOLAR.username,
  requestedByName: JSCHOLAR.displayName,
  workflowId: PHD_WORKFLOW.id,
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  createdAt: daysAgo(6),
});

let ethicsApproval = createApproval({
  kind: 'ethics-approval',
  title: 'Ethics approval — toolkit data collection',
  description: 'Committee approval for the data collection protocol.',
  approver: OKONKWO.username,
  approverName: OKONKWO.displayName,
  approverRole: 'committee-chair',
  requestedBy: OJURI.username,
  requestedByName: OJURI.displayName,
  workflowId: ETHICS_WORKFLOW.id,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  createdAt: daysAgo(30),
});
let ethicsHistory = requestApprovalMinorRevision(ethicsApproval, OKONKWO.username, OKONKWO.displayName, 'Please clarify consent withdrawal procedures.', daysAgo(28));
ethicsApproval = ethicsHistory.approval;
ethicsHistory = approveApproval(ethicsApproval, OKONKWO.username, OKONKWO.displayName, 'Consent withdrawal procedures clarified; approved.', daysAgo(20));
ethicsApproval = ethicsHistory.approval;

const publicationApproval = createApproval({
  kind: 'publication-approval',
  title: 'Publication approval — JNL-001',
  description: 'Editorial approval to proceed to production.',
  approver: SMITH.username,
  approverName: SMITH.displayName,
  approverRole: 'handling-editor',
  requestedBy: OJURI.username,
  requestedByName: OJURI.displayName,
  workflowId: JOURNAL_WORKFLOW.id,
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
  createdAt: daysAgo(8),
});

const grantApproval = createApproval({
  kind: 'grant-approval',
  title: 'Grant approval — NIH submission',
  description: 'Internal sign-off before the NIH submission is finalised.',
  approver: WANG.username,
  approverName: WANG.displayName,
  approverRole: 'program-officer',
  requestedBy: OJURI.username,
  requestedByName: OJURI.displayName,
  workflowId: GRANT_WORKFLOW.id,
  sourceId: 'nih',
  sourceEntity: 'funding',
  createdAt: daysAgo(30),
});

export const APPROVALS: Approval[] = [
  proposalApproval,
  thesisChapterApproval,
  ethicsApproval,
  publicationApproval,
  grantApproval,
];

export const APPROVAL_HISTORY: ApprovalHistoryEntry[] = [
  ...(proposalApproval.history ?? []),
  ...(ethicsApproval.history ?? []),
];

export const REVIEW_STATISTICS: ReviewStatistics = reviewStatistics(REVIEW_CYCLES);
export const REVIEW_ANALYTICS: ReviewAnalytics = reviewAnalytics(REVIEW_CYCLES, APPROVALS);
export const DEFAULT_REVIEW = thesisReviewTwo;
export const DEFAULT_REVIEW_CYCLE = THESIS_REVIEW_CYCLE;
export const DEFAULT_APPROVAL = publicationApproval;
export const CURRENT_REVIEW_USER = CURRENT_USER;
export const CURRENT_REVIEW_USER_NAME = OJURI.displayName;
