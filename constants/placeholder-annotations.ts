import {
  addAnnotationReaction,
  addThreadReply,
  annotationAnalytics,
  annotationStatistics,
  applyAnnotationDecision,
  archiveAnnotation,
  createAnnotation,
  parseMentions,
  toggleAnnotationBookmark,
} from '@/lib/annotations';
import type {
  Annotation,
  AnnotationAnalytics,
  AnnotationStatistics,
} from '@/types/annotations';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { JOURNAL_WORKFLOW } from '@/constants/placeholder-workflows';
import type { ResearcherProfile } from '@/types/researcher';

/**
 * Placeholder annotation data for the Scholatia Annotation & Comment Engine
 * (Phase 2.2F ACSDE).
 *
 * Annotations reference canonical sources only — the thesis and journal
 * artefacts (`art-thesis-multilingual-parsing`,
 * `art-manuscript-low-resource-toolkit`), the journal and conference records
 * (`JNL-001`, `CONF-001`), the annotated corpus dataset
 * (`lrlt-annotated-corpus-v2`), and the NIH funding record (`nih`). Locations
 * are content-free: chapter/section/paragraph/sentence/figure/citation ids and
 * offsets — never document content. Reviewer roles span the full platform
 * vocabulary (author, co-author, supervisor, co-supervisor, reviewer,
 * associate-editor, editor, conference-reviewer, conference-chair, examiner,
 * external-examiner, grant-reviewer, collaborator, institution-admin).
 * Threads, mentions, reactions, resolutions, history, and bookmarks are built
 * through the pure engine.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-01T12:00:00.000Z');
const GRANT_WORKFLOW_ID = 'wfi-grant-nih-computational-linguistics';

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
const WANG = researcherOf('wang');
const MARIA = researcherOf('maria');
const SCHNEIDER = researcherOf('schneider');
const ADESINA = researcherOf('adesina');
const GALLO = researcherOf('gallo');

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

const THESIS_SOURCE = {
  sourceEntity: 'artefact',
  sourceId: 'art-thesis-multilingual-parsing',
} as const;

const MANUSCRIPT_SOURCE = {
  sourceEntity: 'artefact',
  sourceId: 'art-manuscript-low-resource-toolkit',
} as const;

// ---------------------------------------------------------------------------
// 1 — Thesis Chapter 3, Data Splits — supervisor recommendation (open)
// ---------------------------------------------------------------------------

let thesisRecommendation = createAnnotation({
  sourceEntity: THESIS_SOURCE.sourceEntity,
  sourceId: THESIS_SOURCE.sourceId,
  type: 'sentence',
  commentType: 'recommendation',
  role: 'supervisor',
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  title: 'Report corpus size per language',
  body: 'Recommend reporting corpus size per language in the data-splits table so transfer effects are attributable. @jscholar please confirm the numbers.',
  location: {
    sourceEntity: THESIS_SOURCE.sourceEntity,
    sourceId: THESIS_SOURCE.sourceId,
    target: 'sentence',
    chapterId: 'artc-thesis-ch3',
    sectionId: 'arts-3-2-data-splits',
    sentenceId: 'arts-3-2-s1',
    startOffset: 214,
    endOffset: 301,
  },
  mentions: parseMentions('Recommend reporting corpus size per language in the data-splits table so transfer effects are attributable. @jscholar please confirm the numbers.', PEOPLE),
  workflowId: 'wfi-phd-thesis-multilingual-parsing-r4',
  at: daysAgo(12),
});
thesisRecommendation = addThreadReply(thesisRecommendation, {
  author: JSCHOLAR.username,
  authorName: JSCHOLAR.displayName,
  body: 'Added a per-language corpus-size column in revision. @adebayo could you check the updated table?',
  mentions: parseMentions('Added a per-language corpus-size column in revision. @adebayo could you check the updated table?', PEOPLE),
  at: daysAgo(9),
});
thesisRecommendation = addThreadReply(thesisRecommendation, {
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  body: 'Looks good — keep the column next to the split counts.',
  parentReplyId: thesisRecommendation.thread.replies[0].id,
  at: daysAgo(7),
});
thesisRecommendation = addAnnotationReaction(thesisRecommendation, {
  emoji: '👍',
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  at: daysAgo(7),
});
thesisRecommendation = toggleAnnotationBookmark(thesisRecommendation, JSCHOLAR.username, JSCHOLAR.displayName, daysAgo(7));

// ---------------------------------------------------------------------------
// 2 — Thesis Chapter 4, Results — examiner required correction (accepted)
// ---------------------------------------------------------------------------

let examinerCorrection = createAnnotation({
  sourceEntity: THESIS_SOURCE.sourceEntity,
  sourceId: THESIS_SOURCE.sourceId,
  type: 'paragraph',
  commentType: 'required-correction',
  role: 'examiner',
  author: OKONKWO.username,
  authorName: OKONKWO.displayName,
  title: 'Report variance across seeds',
  body: 'Required correction: report variance across random seeds for the headline parsing accuracy figures in Table 4.2.',
  location: {
    sourceEntity: THESIS_SOURCE.sourceEntity,
    sourceId: THESIS_SOURCE.sourceId,
    target: 'paragraph',
    chapterId: 'artc-thesis-ch4',
    sectionId: 'arts-4-2-results',
    paragraphId: 'arts-4-2-p3',
    startOffset: 0,
    endOffset: 120,
  },
  reviewId: 'rv-rvc-thesis-r4-okonkwo',
  workflowId: 'wfi-phd-thesis-multilingual-parsing-r4',
  at: daysAgo(20),
});
examinerCorrection = applyAnnotationDecision({
  annotation: examinerCorrection,
  decision: 'accept-suggestion',
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  comment: 'Variance across five seeds now reported in the revised table.',
  at: daysAgo(4),
});

// ---------------------------------------------------------------------------
// 3 — Thesis Chapter 4, Error Analysis — examiner statistical issue (rejected)
// ---------------------------------------------------------------------------

let examinerStatistics = createAnnotation({
  sourceEntity: THESIS_SOURCE.sourceEntity,
  sourceId: THESIS_SOURCE.sourceId,
  type: 'word',
  commentType: 'statistical-issue',
  role: 'examiner',
  author: OKONKWO.username,
  authorName: OKONKWO.displayName,
  title: 'Significance claim overstated',
  body: 'The word \u201csignificantly\u201d overstates the effect given the overlapping confidence intervals reported in Figure 4.3.',
  location: {
    sourceEntity: THESIS_SOURCE.sourceEntity,
    sourceId: THESIS_SOURCE.sourceId,
    target: 'word',
    chapterId: 'artc-thesis-ch4',
    sectionId: 'arts-4-3-error-analysis',
    sentenceId: 'arts-4-3-s2',
    startOffset: 18,
    endOffset: 31,
  },
  at: daysAgo(20),
});
examinerStatistics = applyAnnotationDecision({
  annotation: examinerStatistics,
  decision: 'reject-suggestion',
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  comment: 'Intervals were recomputed with corrected standard errors; the claim stands.',
  at: daysAgo(5),
});

// ---------------------------------------------------------------------------
// 4 — Thesis Chapter 1, Research Questions — co-supervisor question (pending)
// ---------------------------------------------------------------------------

let coSupervisorQuestion = createAnnotation({
  sourceEntity: THESIS_SOURCE.sourceEntity,
  sourceId: THESIS_SOURCE.sourceId,
  type: 'sentence',
  commentType: 'question',
  role: 'co-supervisor',
  author: OKONKWO.username,
  authorName: OKONKWO.displayName,
  title: 'How do RQs map to the evaluation?',
  body: 'Question: how does each research question map to a specific evaluation metric in Chapter 3?',
  location: {
    sourceEntity: THESIS_SOURCE.sourceEntity,
    sourceId: THESIS_SOURCE.sourceId,
    target: 'sentence',
    chapterId: 'artc-thesis-ch1',
    sectionId: 'arts-1-2-research-questions',
    sentenceId: 'arts-1-2-s2',
  },
  at: daysAgo(8),
});
coSupervisorQuestion = applyAnnotationDecision({
  annotation: coSupervisorQuestion,
  decision: 'needs-discussion',
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  comment: 'Added a mapping table in the appendix; awaiting a follow-up review.',
  at: daysAgo(2),
});

// ---------------------------------------------------------------------------
// 5 — Thesis Chapter 2, Related Work — external examiner observation (archived)
// ---------------------------------------------------------------------------

let externalObservation = createAnnotation({
  sourceEntity: THESIS_SOURCE.sourceEntity,
  sourceId: THESIS_SOURCE.sourceId,
  type: 'highlight',
  commentType: 'observation',
  role: 'external-examiner',
  author: DUBE.username,
  authorName: DUBE.displayName,
  title: 'Related work coverage',
  body: 'Observation: the related-work survey would benefit from recent multilingual parsing studies from the UD community.',
  location: {
    sourceEntity: THESIS_SOURCE.sourceEntity,
    sourceId: THESIS_SOURCE.sourceId,
    target: 'paragraph',
    chapterId: 'artc-thesis-ch2',
    sectionId: 'arts-2-1-multilingual-parsing',
    paragraphId: 'arts-2-1-p2',
  },
  at: daysAgo(45),
});
externalObservation = archiveAnnotation(externalObservation, JSCHOLAR.username, JSCHOLAR.displayName, 'Superseded by the revised related-work chapter.', daysAgo(30));

// ---------------------------------------------------------------------------
// 6 — Journal manuscript, Methodology — reviewer suggested correction (resolved)
// ---------------------------------------------------------------------------

let reviewerSuggestion = createAnnotation({
  sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
  sourceId: MANUSCRIPT_SOURCE.sourceId,
  type: 'inline',
  commentType: 'suggested-correction',
  role: 'reviewer',
  author: SMITH.username,
  authorName: SMITH.displayName,
  title: 'Make the evaluation fully reproducible',
  body: 'Suggested correction: publish the exact seed list and evaluation harness so the methodology section is fully reproducible.',
  location: {
    sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
    sourceId: MANUSCRIPT_SOURCE.sourceId,
    target: 'paragraph',
    sectionId: 'arts-methodology',
    paragraphId: 'arts-methodology-p1',
    startOffset: 0,
    endOffset: 88,
  },
  reviewId: 'rv-rvc-jnl-001-r2-smith',
  workflowId: JOURNAL_WORKFLOW.id,
  at: daysAgo(28),
});
reviewerSuggestion = addThreadReply(reviewerSuggestion, {
  author: OJURI.username,
  authorName: OJURI.displayName,
  body: 'The seed list and harness are now linked from the data availability statement. @smith could you confirm?',
  mentions: parseMentions('The seed list and harness are now linked from the data availability statement. @smith could you confirm?', PEOPLE),
  at: daysAgo(6),
});
reviewerSuggestion = applyAnnotationDecision({
  annotation: reviewerSuggestion,
  decision: 'accept-partially',
  actor: SMITH.username,
  actorName: SMITH.displayName,
  comment: 'Harness linked; seeds listed for five runs.',
  at: daysAgo(3),
});

// ---------------------------------------------------------------------------
// 7 — Journal manuscript, Results — reviewer methodology issue (open)
// ---------------------------------------------------------------------------

const reviewerMethodology = createAnnotation({
  sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
  sourceId: MANUSCRIPT_SOURCE.sourceId,
  type: 'figure',
  commentType: 'methodology-issue',
  role: 'reviewer',
  author: SMITH.username,
  authorName: SMITH.displayName,
  title: 'Figure 2 baseline unclear',
  body: 'Methodology issue: the baseline curve in Figure 2 should be identified in the legend. @ojuri please label it.',
  location: {
    sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
    sourceId: MANUSCRIPT_SOURCE.sourceId,
    target: 'figure',
    sectionId: 'arts-results',
    figureId: 'arts-results-fig2',
  },
  mentions: parseMentions('Methodology issue: the baseline curve in Figure 2 should be identified in the legend. @ojuri please label it.', PEOPLE),
  reviewId: 'rv-rvc-jnl-001-r2-smith',
  workflowId: JOURNAL_WORKFLOW.id,
  at: daysAgo(9),
});

// ---------------------------------------------------------------------------
// 8 — Journal manuscript, Introduction — associate editor citation issue (open)
// ---------------------------------------------------------------------------

const editorCitation = createAnnotation({
  sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
  sourceId: MANUSCRIPT_SOURCE.sourceId,
  type: 'citation',
  commentType: 'citation-issue',
  role: 'associate-editor',
  author: MARIA.username,
  authorName: MARIA.displayName,
  title: 'Missing citation for transfer baselines',
  body: 'Citation issue: the transfer baseline claim needs a citation in the introduction.',
  location: {
    sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
    sourceId: MANUSCRIPT_SOURCE.sourceId,
    target: 'citation',
    sectionId: 'arts-introduction',
    citationId: 'mns-lrp-cit-7',
  },
  workflowId: JOURNAL_WORKFLOW.id,
  at: daysAgo(6),
});

// ---------------------------------------------------------------------------
// 9 — Journal manuscript, Discussion — editor approval note (resolved, bookmarked)
// ---------------------------------------------------------------------------

let editorApprovalNote = createAnnotation({
  sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
  sourceId: MANUSCRIPT_SOURCE.sourceId,
  type: 'general-note',
  commentType: 'approval-note',
  role: 'editor',
  author: SCHNEIDER.username,
  authorName: SCHNEIDER.displayName,
  title: 'Discussion section ready',
  body: 'Approval note: the discussion section now addresses the reviewers\u2019 concerns. Proceeding to production check.',
  location: {
    sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
    sourceId: MANUSCRIPT_SOURCE.sourceId,
    target: 'document',
    sectionId: 'arts-discussion',
  },
  workflowId: JOURNAL_WORKFLOW.id,
  at: daysAgo(5),
});
editorApprovalNote = applyAnnotationDecision({
  annotation: editorApprovalNote,
  decision: 'accept-suggestion',
  actor: SCHNEIDER.username,
  actorName: SCHNEIDER.displayName,
  comment: 'Noted for production.',
  at: daysAgo(2),
});
editorApprovalNote = toggleAnnotationBookmark(editorApprovalNote, OJURI.username, OJURI.displayName, daysAgo(2));

// ---------------------------------------------------------------------------
// 10 — Journal record — editor sticky note (open)
// ---------------------------------------------------------------------------

const journalSticky = createAnnotation({
  sourceEntity: 'journal',
  sourceId: 'JNL-001',
  type: 'sticky-note',
  commentType: 'recommendation',
  role: 'editor',
  author: SCHNEIDER.username,
  authorName: SCHNEIDER.displayName,
  title: 'Reminder — verify ORCID records',
  body: 'Sticky note: verify ORCID records for all authors before the production handover.',
  location: {
    sourceEntity: 'journal',
    sourceId: 'JNL-001',
    target: 'document',
  },
  workflowId: JOURNAL_WORKFLOW.id,
  at: daysAgo(4),
});

// ---------------------------------------------------------------------------
// 11 — Conference paper — conference reviewer suggestion (resolved)
// ---------------------------------------------------------------------------

let conferenceSuggestion = createAnnotation({
  sourceEntity: 'conference',
  sourceId: 'CONF-001',
  type: 'section',
  commentType: 'suggested-correction',
  role: 'conference-reviewer',
  author: TANAKA.username,
  authorName: TANAKA.displayName,
  title: 'Trim the related-work section',
  body: 'Suggested correction: the related-work section can be trimmed to make room for the evaluation details.',
  location: {
    sourceEntity: 'conference',
    sourceId: 'CONF-001',
    target: 'section',
    sectionId: 'arts-siri2026-related-work',
  },
  at: daysAgo(15),
});
conferenceSuggestion = applyAnnotationDecision({
  annotation: conferenceSuggestion,
  decision: 'accept-partially',
  actor: OJURI.username,
  actorName: OJURI.displayName,
  comment: 'Trimmed two paragraphs.',
  at: daysAgo(8),
});

// ---------------------------------------------------------------------------
// 12 — Conference paper — conference chair formatting issue (archived)
// ---------------------------------------------------------------------------

let chairFormatting = createAnnotation({
  sourceEntity: 'conference',
  sourceId: 'CONF-001',
  type: 'figure',
  commentType: 'formatting-issue',
  role: 'conference-chair',
  author: DUBE.username,
  authorName: DUBE.displayName,
  title: 'Figure resolution',
  body: 'Formatting issue: Figure 1 needs to be regenerated at 300 dpi for the proceedings.',
  location: {
    sourceEntity: 'conference',
    sourceId: 'CONF-001',
    target: 'figure',
    figureId: 'arts-siri2026-fig1',
  },
  at: daysAgo(20),
});
chairFormatting = archiveAnnotation(chairFormatting, OJURI.username, OJURI.displayName, 'Replaced at higher resolution.', daysAgo(12));

// ---------------------------------------------------------------------------
// 13 — Dataset — institution admin ethical concern (pending)
// ---------------------------------------------------------------------------

let datasetEthics = createAnnotation({
  sourceEntity: 'dataset',
  sourceId: 'lrlt-annotated-corpus-v2',
  type: 'dataset',
  commentType: 'ethical-concern',
  role: 'institution-admin',
  author: ADESINA.username,
  authorName: ADESINA.displayName,
  title: 'Consent documentation',
  body: 'Ethical concern: confirm consent documentation for the included community speech samples before the next release. @ojuri please attach the consent register.',
  location: {
    sourceEntity: 'dataset',
    sourceId: 'lrlt-annotated-corpus-v2',
    target: 'dataset',
    datasetId: 'lrlt-annotated-corpus-v2',
  },
  mentions: parseMentions('Ethical concern: confirm consent documentation for the included community speech samples before the next release. @ojuri please attach the consent register.', PEOPLE),
  at: daysAgo(3),
});
datasetEthics = applyAnnotationDecision({
  annotation: datasetEthics,
  decision: 'needs-discussion',
  actor: OJURI.username,
  actorName: OJURI.displayName,
  comment: 'Consent register is being compiled; will share this week.',
  at: daysAgo(1),
});

// ---------------------------------------------------------------------------
// 14 — Grant — grant reviewer escalation (pending)
// ---------------------------------------------------------------------------

let grantEscalation = createAnnotation({
  sourceEntity: 'funding',
  sourceId: 'nih',
  type: 'general-note',
  commentType: 'approval-note',
  role: 'grant-reviewer',
  author: WANG.username,
  authorName: WANG.displayName,
  title: 'Budget line review',
  body: 'Approval note: the personnel budget line requires program-officer sign-off before submission.',
  location: {
    sourceEntity: 'funding',
    sourceId: 'nih',
    target: 'document',
  },
  workflowId: GRANT_WORKFLOW_ID,
  at: daysAgo(4),
});
grantEscalation = applyAnnotationDecision({
  annotation: grantEscalation,
  decision: 'escalate',
  actor: OJURI.username,
  actorName: OJURI.displayName,
  comment: 'Escalated to the program officer.',
  at: daysAgo(1),
});

// ---------------------------------------------------------------------------
// 15 — Thesis Chapter 3, Evaluation Metrics — supervisor grammar (open)
// ---------------------------------------------------------------------------

const supervisorGrammar = createAnnotation({
  sourceEntity: THESIS_SOURCE.sourceEntity,
  sourceId: THESIS_SOURCE.sourceId,
  type: 'equation',
  commentType: 'grammar',
  role: 'supervisor',
  author: ADEBAYO.username,
  authorName: ADEBAYO.displayName,
  title: 'Notation consistency',
  body: 'Grammar: keep the notation for the F1 formula consistent with the metrics paragraph above.',
  location: {
    sourceEntity: THESIS_SOURCE.sourceEntity,
    sourceId: THESIS_SOURCE.sourceId,
    target: 'equation',
    chapterId: 'artc-thesis-ch3',
    sectionId: 'arts-3-3-evaluation-metrics',
    equationId: 'arts-3-3-eq1',
  },
  at: daysAgo(11),
});

// ---------------------------------------------------------------------------
// 16 — Journal manuscript, Conclusion — co-author style note (open)
// ---------------------------------------------------------------------------

let coAuthorStyle = createAnnotation({
  sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
  sourceId: MANUSCRIPT_SOURCE.sourceId,
  type: 'paragraph',
  commentType: 'style',
  role: 'co-author',
  author: SMITH.username,
  authorName: SMITH.displayName,
  title: 'Passive voice in conclusion',
  body: 'Style: prefer active voice in the conclusion paragraph for the toolkit contribution.',
  location: {
    sourceEntity: MANUSCRIPT_SOURCE.sourceEntity,
    sourceId: MANUSCRIPT_SOURCE.sourceId,
    target: 'paragraph',
    sectionId: 'arts-conclusion',
    paragraphId: 'arts-conclusion-p1',
  },
  workflowId: JOURNAL_WORKFLOW.id,
  at: daysAgo(4),
});
coAuthorStyle = addAnnotationReaction(coAuthorStyle, {
  emoji: '💡',
  actor: GALLO.username,
  actorName: GALLO.displayName,
  at: daysAgo(3),
});
coAuthorStyle = addAnnotationReaction(coAuthorStyle, {
  emoji: '💡',
  actor: OJURI.username,
  actorName: OJURI.displayName,
  at: daysAgo(2),
});

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export const ANNOTATIONS: Annotation[] = [
  thesisRecommendation,
  examinerCorrection,
  examinerStatistics,
  coSupervisorQuestion,
  externalObservation,
  reviewerSuggestion,
  reviewerMethodology,
  editorCitation,
  editorApprovalNote,
  journalSticky,
  conferenceSuggestion,
  chairFormatting,
  datasetEthics,
  grantEscalation,
  supervisorGrammar,
  coAuthorStyle,
];

export const ANNOTATION_STATISTICS: AnnotationStatistics = annotationStatistics(ANNOTATIONS);
export const ANNOTATION_ANALYTICS: AnnotationAnalytics = annotationAnalytics(ANNOTATIONS);
export const ANNOTATION_HISTORY = ANNOTATIONS.flatMap((annotation) => annotation.history);
export const DEFAULT_ANNOTATION = thesisRecommendation;
export const CURRENT_ANNOTATION_USER = CURRENT_USER;
export const CURRENT_ANNOTATION_USER_NAME = OJURI.displayName;
