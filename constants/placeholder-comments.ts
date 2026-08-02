import {
  addComment,
  addCommentReaction,
  addReply,
  addReplyReaction,
  archiveThread,
  commentAnalytics,
  commentStatistics,
  createCommentThread,
  editTranscript,
  regenerateTranscript,
  resolveThread,
  summarizeVoiceComment,
  transcribeVoiceComment,
} from '@/lib/comments';
import { parseMentions } from '@/lib/annotations';
import type {
  CommentAnalytics,
  CommentStatistics,
  CommentThread,
  TranscriptionProvider,
  VoiceComment,
} from '@/types/comments';
import { DEFAULT_TRANSCRIPTION_PROVIDER } from '@/types/comments';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';

/**
 * Placeholder comment, thread & voice review data for the Scholatia ACSDE
 * (Phase 2.2F). Threads attach to canonical sources (manuscript artefact,
 * thesis artefact, journal, dataset, conference) across all four thread kinds
 * (discussion, review-discussion, editorial-discussion,
 * supervision-discussion). Voice comments demonstrate the transcription
 * abstraction layer: audio-only, transcript-only, audio + transcript, and AI
 * transcription modes, editable transcripts, regenerated transcripts, AI
 * summaries, and confidence scoring. Everything is built through the pure
 * engine.
 */

const NOW = new Date('2026-08-01T12:00:00.000Z');
const JOURNAL_ID = 'JNL-001';
const DATASET_ID = 'lrlt-annotated-corpus-v2';
const CONFERENCE_ID = 'CONF-001';

function researcherOf(username: string): ResearcherProfile {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  if (!found) {
    throw new Error(`Missing researcher seed: ${username}`);
  }
  return found;
}

const OJURI = researcherOf('ojuri');
const JSCHOLAR = researcherOf('jscholar');
const SMITH = researcherOf('smith');
const ADEBAYO = researcherOf('adebayo');
const OKONKWO = researcherOf('okonkwo');
const DUBE = researcherOf('dube');
const TANAKA = researcherOf('tanaka');
const SCHNEIDER = researcherOf('schneider');
const MARIA = researcherOf('maria');
const ADESINA = researcherOf('adesina');

const PEOPLE = RESEARCHERS.map((researcher) => ({
  username: researcher.username,
  name: researcher.displayName,
}));

function daysAgo(days: number, hour = 10): string {
  const date = new Date(NOW);
  date.setDate(date.getDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

// ---------------------------------------------------------------------------
// Thread 1 — Review discussion on the journal manuscript (open)
// ---------------------------------------------------------------------------

let reproducibilityThread = createCommentThread({
  sourceEntity: 'artefact',
  sourceId: 'art-manuscript-low-resource-toolkit',
  title: 'Reproducibility review discussion',
  kind: 'review-discussion',
  at: daysAgo(16),
});
reproducibilityThread = addComment(reproducibilityThread, {
  author: SMITH.username,
  authorName: SMITH.displayName,
  body: 'The seed list and evaluation harness are now linked from the data availability statement. Good.',
  at: daysAgo(10),
});
reproducibilityThread = addReply(reproducibilityThread, {
  author: OJURI.username,
  authorName: OJURI.displayName,
  body: 'Thanks @smith. The harness also pins dependency versions. @adebayo could you double-check the lockfile?',
  mentions: parseMentions('Thanks @smith. The harness also pins dependency versions. @adebayo could you double-check the lockfile?', PEOPLE),
  at: daysAgo(9),
});
reproducibilityThread = addReply(reproducibilityThread, {
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  body: 'Lockfile is pinned and reproducible from a clean clone.',
  parentReplyId: reproducibilityThread.replies[0].id,
  at: daysAgo(7),
});
reproducibilityThread = addCommentReaction(reproducibilityThread, reproducibilityThread.comments[0].id, {
  emoji: '👍',
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  at: daysAgo(7),
});
reproducibilityThread = addReplyReaction(reproducibilityThread, reproducibilityThread.replies[0].id, {
  emoji: '💡',
  actor: SCHNEIDER.username,
  actorName: SCHNEIDER.displayName,
  at: daysAgo(6),
});

// ---------------------------------------------------------------------------
// Thread 2 — Editorial discussion on the journal record (open)
// ---------------------------------------------------------------------------

let editorialThread = createCommentThread({
  sourceEntity: 'journal',
  sourceId: JOURNAL_ID,
  title: 'Production handover checklist',
  kind: 'editorial-discussion',
  at: daysAgo(8),
});
editorialThread = addComment(editorialThread, {
  author: SCHNEIDER.username,
  authorName: SCHNEIDER.displayName,
  body: 'All reviews resolved; moving the manuscript to the production handover checklist.',
  at: daysAgo(7),
});
editorialThread = addReply(editorialThread, {
  author: MARIA.username,
  authorName: MARIA.displayName,
  body: 'Verified ORCID records for all five authors.',
  at: daysAgo(6),
});
editorialThread = addReply(editorialThread, {
  author: SCHNEIDER.username,
  authorName: SCHNEIDER.displayName,
  body: 'Confirmed — proceeding.',
  parentReplyId: editorialThread.replies[0].id,
  at: daysAgo(5),
});

// ---------------------------------------------------------------------------
// Thread 3 — Supervision discussion on the thesis artefact (resolved)
// ---------------------------------------------------------------------------

let supervisionThread = createCommentThread({
  sourceEntity: 'artefact',
  sourceId: 'art-thesis-multilingual-parsing',
  title: 'Chapter 4 status check',
  kind: 'supervision-discussion',
  at: daysAgo(14),
});
supervisionThread = addComment(supervisionThread, {
  author: JSCHOLAR.username,
  authorName: JSCHOLAR.displayName,
  body: 'Chapter 4 results table updated with variance across seeds.',
  at: daysAgo(12),
});
supervisionThread = addReply(supervisionThread, {
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  body: 'Approved — on to Chapter 5.',
  at: daysAgo(10),
});
supervisionThread = resolveThread(supervisionThread, daysAgo(10));

// ---------------------------------------------------------------------------
// Thread 4 — Discussion on the dataset record (archived)
// ---------------------------------------------------------------------------

let consentThread = createCommentThread({
  sourceEntity: 'dataset',
  sourceId: DATASET_ID,
  title: 'Consent register',
  kind: 'discussion',
  at: daysAgo(20),
});
consentThread = addComment(consentThread, {
  author: ADESINA.username,
  authorName: ADESINA.displayName,
  body: 'The consent register has been shared with the ethics office for the next release.',
  at: daysAgo(15),
});
consentThread = archiveThread(consentThread, daysAgo(9));

// ---------------------------------------------------------------------------
// Voice comments
// ---------------------------------------------------------------------------

// 1 — External examiner — audio + transcript (edited)
let examinerVoice = createVoiceCommentFor({
  sourceEntity: 'artefact',
  sourceId: 'art-thesis-multilingual-parsing',
  author: DUBE.username,
  authorName: DUBE.displayName,
  mode: 'audio-and-transcript',
  audioUrl: '/audio/reviews/external-examiner-thesis-r4.m4a',
  durationSeconds: 48,
  language: 'en-US',
  at: daysAgo(6),
});
examinerVoice = transcribeVoiceComment({
  voiceComment: examinerVoice,
  text: 'The revision reads well. I would still recommend reporting inter annotator agreement in chapter three, along with the per-language corpus sizes.',
  confidence: 0.94,
  language: 'en-US',
  speakerId: DUBE.username,
  now: daysAgo(6, 14),
});
examinerVoice = editTranscript(
  examinerVoice,
  'The revision reads well. I would still recommend reporting inter-annotator agreement in chapter three, along with the per-language corpus sizes.',
  daysAgo(6, 15),
);
examinerVoice = {
  ...examinerVoice,
  aiSummary: summarizeVoiceComment(examinerVoice),
};

// 2 — Journal reviewer — AI transcription (regenerated)
let reviewerVoice = createVoiceCommentFor({
  sourceEntity: 'artefact',
  sourceId: 'art-manuscript-low-resource-toolkit',
  author: SMITH.username,
  authorName: SMITH.displayName,
  mode: 'ai-transcription',
  durationSeconds: 62,
  language: 'en-US',
  at: daysAgo(5),
});
reviewerVoice = transcribeVoiceComment({
  voiceComment: reviewerVoice,
  text: 'The evaluation is solid. The baseline curve in figure two needs a label in the legend, and the conclusion would benefit from a short limitations paragraph.',
  confidence: 0.91,
  now: daysAgo(5, 16),
});
reviewerVoice = regenerateTranscript(
  reviewerVoice,
  'The evaluation is solid. The baseline curve in Figure 2 needs a label in the legend, and the conclusion would benefit from a short limitations paragraph.',
  DEFAULT_TRANSCRIPTION_PROVIDER,
  daysAgo(5, 17),
);
reviewerVoice = {
  ...reviewerVoice,
  aiSummary: summarizeVoiceComment(reviewerVoice),
};

// 3 — Co-supervisor — transcript only (transcribed)
let coSupervisorVoice = createVoiceCommentFor({
  sourceEntity: 'artefact',
  sourceId: 'art-thesis-multilingual-parsing',
  author: OKONKWO.username,
  authorName: OKONKWO.displayName,
  mode: 'transcript-only',
  durationSeconds: 27,
  language: 'en-US',
  at: daysAgo(4),
});
coSupervisorVoice = transcribeVoiceComment({
  voiceComment: coSupervisorVoice,
  text: 'Confirm the research question to metric mapping is visible in the appendix.',
  confidence: 0.97,
  now: daysAgo(4, 12),
});
coSupervisorVoice = {
  ...coSupervisorVoice,
  aiSummary: summarizeVoiceComment(coSupervisorVoice),
};

// 4 — Conference reviewer — audio only (no transcript)
const conferenceVoice = createVoiceCommentFor({
  sourceEntity: 'conference',
  sourceId: CONFERENCE_ID,
  author: TANAKA.username,
  authorName: TANAKA.displayName,
  mode: 'audio-only',
  audioUrl: '/audio/reviews/conference-siri2026.m4a',
  durationSeconds: 42,
  language: 'en-US',
  at: daysAgo(3),
});

function createVoiceCommentFor(input: {
  sourceEntity: string;
  sourceId: string;
  author: string;
  authorName: string;
  mode: VoiceComment['mode'];
  audioUrl?: string;
  durationSeconds: number;
  language: string;
  at: string;
}): VoiceComment {
  return {
    id: `vc-${input.sourceId}-${input.author}-${input.mode}`,
    sourceEntity: input.sourceEntity,
    sourceId: input.sourceId,
    author: input.author,
    authorName: input.authorName,
    mode: input.mode,
    status: 'recorded',
    audioUrl: input.audioUrl,
    durationSeconds: input.durationSeconds,
    language: input.language,
    mentions: [],
    reactions: [],
    createdAt: input.at,
    updatedAt: input.at,
  };
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export const COMMENT_THREADS: CommentThread[] = [
  reproducibilityThread,
  editorialThread,
  supervisionThread,
  consentThread,
];

export const VOICE_COMMENTS: VoiceComment[] = [
  examinerVoice,
  reviewerVoice,
  coSupervisorVoice,
  conferenceVoice,
];

export const COMMENT_STATISTICS: CommentStatistics = commentStatistics(
  COMMENT_THREADS,
  VOICE_COMMENTS,
);
export const COMMENT_ANALYTICS: CommentAnalytics = commentAnalytics(COMMENT_THREADS, VOICE_COMMENTS);

export const TRANSCRIPTION_PROVIDERS: TranscriptionProvider[] = [
  DEFAULT_TRANSCRIPTION_PROVIDER,
  {
    id: 'third-party-stt',
    name: 'Third-Party Speech-to-Text',
    languages: ['en-US', 'en-GB'],
    capabilities: {
      speechToText: true,
      punctuation: true,
      speakerIdentification: false,
      confidence: true,
      editableTranscript: true,
      regeneratedTranscript: false,
    },
  },
];

export const DEFAULT_THREAD = reproducibilityThread;
export const DEFAULT_VOICE_COMMENT = examinerVoice;
export const CURRENT_COMMENT_USER = OJURI.username;
export const CURRENT_COMMENT_USER_NAME = OJURI.displayName;
