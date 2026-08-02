import type {
  ArtefactChapter,
  ArtefactSection,
  ScholarlyArtefact,
  Workbench,
  WorkbenchItem,
  WorkbenchVersion,
  WorkflowAnalytics,
  WorkflowInsight,
  WorkflowInstance,
  WorkflowMilestone,
  WorkflowPortfolio,
  WorkflowStage,
  WorkflowStageStatus,
  WorkflowStageTemplate,
  WorkflowStatistics,
  WorkflowTemplate,
  WorkflowTemplateKind,
  WorkflowTransition,
  WorkflowDeadline,
} from '@/types/workflows';
import {
  achieveWorkflowMilestone,
  addWorkflowDeadline,
  addWorkflowMilestone,
  approveWorkflow,
  artefactWordCount,
  buildWorkflowPortfolio,
  completeWorkflow,
  createWorkbenchItem,
  createWorkflowFromTemplate,
  extendWorkflowDeadline,
  requestWorkflowRevision,
  setStageStatus,
  submitWorkflowForReview,
  submitWorkflowRevision,
  transitionWorkflow,
  workflowAnalytics,
  workflowInsights,
  workflowStatistics,
} from '@/lib/workflows';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';

/**
 * Placeholder data for the Scholatia Workflow, Task & Review Orchestration
 * Platform (SWTROP, Phase 2.2E).
 *
 * The workflow graph owns no external records: workflows reference canonical
 * journals (JNL-001), conferences (CONF-001), institutions (INST-UI-001),
 * projects, grants, marketplace listings, and service orders through
 * `sourceId` + `sourceEntity`; milestones carry the canonical
 * `ResearchLifecycleStageId`; researchers are referenced by canonical
 * username. Statistics, analytics, insights, and the portfolio are all derived
 * from the typed graph by the pure engines in `lib/workflows.ts`,
 * `lib/tasks.ts`, and `lib/reviews.ts`.
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
const MARIA = researcherOf('maria');
const JSCHOLAR = researcherOf('jscholar');
const TANAKA = researcherOf('tanaka');
const OKONKWO = researcherOf('okonkwo');
const ADESINA = researcherOf('adesina');
const WANG = researcherOf('wang');
const DUBE = researcherOf('dube');
const ADEBAYO = researcherOf('adebayo');

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
// Template stage helper
// ---------------------------------------------------------------------------

function stage(
  id: string,
  name: string,
  kind: WorkflowStageTemplate['kind'],
  order: number,
  role: WorkflowStageTemplate['role'],
  opts: Partial<Pick<WorkflowStageTemplate, 'description' | 'stageId' | 'estimatedDurationDays' | 'optional'>> = {},
): WorkflowStageTemplate {
  return { id, name, kind, order, role, ...opts };
}

// ---------------------------------------------------------------------------
// Workflow templates (12 kinds — the full catalogue)
// ---------------------------------------------------------------------------

const UNDERGRADUATE_TEMPLATE: WorkflowTemplate = {
  id: 'wft-undergraduate-project',
  name: 'Undergraduate Project',
  kind: 'undergraduate-project',
  description: 'The classic final-year undergraduate research project, from topic selection to supervised report submission.',
  audience: 'Undergraduate students',
  ownerRole: 'student',
  tags: ['undergraduate', 'capstone', 'supervised'],
  sourceEntity: 'institution',
  stages: [
    stage('topic-selection', 'Topic selection', 'task', 1, 'student', { stageId: 'idea', estimatedDurationDays: 14 }),
    stage('topic-approval', 'Topic approval', 'approval', 2, 'supervisor', { stageId: 'idea', estimatedDurationDays: 7 }),
    stage('proposal-writing', 'Proposal writing', 'task', 3, 'student', { stageId: 'proposal', estimatedDurationDays: 21 }),
    stage('proposal-approval', 'Proposal approval', 'approval', 4, 'supervisor', { stageId: 'proposal', estimatedDurationDays: 7 }),
    stage('data-collection', 'Data collection', 'task', 5, 'student', { stageId: 'project', estimatedDurationDays: 45 }),
    stage('analysis', 'Analysis', 'task', 6, 'student', { stageId: 'analysis', estimatedDurationDays: 30 }),
    stage('draft-report', 'Draft report', 'task', 7, 'student', { stageId: 'manuscript', estimatedDurationDays: 30 }),
    stage('report-review', 'Report review', 'review', 8, 'supervisor', { stageId: 'manuscript', estimatedDurationDays: 7 }),
    stage('final-approval', 'Final approval', 'approval', 9, 'supervisor', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('submission', 'Submission', 'submission', 10, 'student', { stageId: 'submission', estimatedDurationDays: 7 }),
  ],
};

const MASTERS_TEMPLATE: WorkflowTemplate = {
  id: 'wft-masters-dissertation',
  name: "Master's Dissertation",
  kind: 'masters-dissertation',
  description: 'A supervised research dissertation at master level, covering topic, proposal, ethics, chapters, and final submission.',
  audience: 'Masters students',
  ownerRole: 'student',
  tags: ['masters', 'dissertation', 'supervised'],
  sourceEntity: 'institution',
  stages: [
    stage('topic-selection', 'Topic selection', 'task', 1, 'student', { stageId: 'idea', estimatedDurationDays: 14 }),
    stage('topic-approval', 'Topic approval', 'approval', 2, 'supervisor', { stageId: 'idea', estimatedDurationDays: 7 }),
    stage('proposal-writing', 'Proposal writing', 'task', 3, 'student', { stageId: 'proposal', estimatedDurationDays: 21 }),
    stage('proposal-approval', 'Proposal approval', 'approval', 4, 'supervisor', { stageId: 'proposal', estimatedDurationDays: 7 }),
    stage('ethics-approval', 'Ethics approval', 'approval', 5, 'committee-member', { stageId: 'funding', estimatedDurationDays: 14 }),
    stage('data-collection', 'Data collection', 'task', 6, 'student', { stageId: 'project', estimatedDurationDays: 60 }),
    stage('analysis', 'Analysis', 'task', 7, 'student', { stageId: 'analysis', estimatedDurationDays: 45 }),
    stage('draft-chapters', 'Draft chapters', 'task', 8, 'student', { stageId: 'manuscript', estimatedDurationDays: 60 }),
    stage('chapter-reviews', 'Chapter reviews', 'review', 9, 'supervisor', { stageId: 'manuscript', estimatedDurationDays: 21 }),
    stage('revision', 'Revision', 'task', 10, 'student', { stageId: 'manuscript', estimatedDurationDays: 21 }),
    stage('final-approval', 'Final approval', 'approval', 11, 'supervisor', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('submission', 'Submission', 'submission', 12, 'student', { stageId: 'submission', estimatedDurationDays: 7 }),
  ],
};

const PHD_TEMPLATE: WorkflowTemplate = {
  id: 'wft-phd-thesis',
  name: 'PhD Thesis',
  kind: 'phd-thesis',
  description: 'The full doctoral supervision workflow: topic, proposal, ethics, chapters, annual reviews, internal and external examination, and repository publication.',
  audience: 'Doctoral candidates',
  ownerRole: 'student',
  tags: ['phd', 'thesis', 'examination'],
  sourceEntity: 'institution',
  stages: [
    stage('topic-selection', 'Topic selection', 'task', 1, 'student', { stageId: 'idea', estimatedDurationDays: 30 }),
    stage('topic-approval', 'Topic approval', 'approval', 2, 'supervisor', { stageId: 'idea', estimatedDurationDays: 14 }),
    stage('proposal-writing', 'Proposal writing', 'task', 3, 'student', { stageId: 'proposal', estimatedDurationDays: 45 }),
    stage('proposal-approval', 'Proposal approval', 'approval', 4, 'supervisor', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('ethics-approval', 'Ethics approval', 'approval', 5, 'committee-member', { stageId: 'funding', estimatedDurationDays: 21 }),
    stage('data-collection', 'Data collection', 'task', 6, 'student', { stageId: 'project', estimatedDurationDays: 180 }),
    stage('analysis', 'Analysis', 'task', 7, 'student', { stageId: 'analysis', estimatedDurationDays: 120 }),
    stage('draft-chapters', 'Draft chapters', 'task', 8, 'student', { stageId: 'manuscript', estimatedDurationDays: 180 }),
    stage('chapter-reviews', 'Chapter reviews', 'review', 9, 'supervisor', { stageId: 'manuscript', estimatedDurationDays: 30 }),
    stage('annual-progress-review', 'Annual progress review', 'review', 10, 'committee-member', { stageId: 'manuscript', estimatedDurationDays: 14 }),
    stage('revision', 'Revision', 'task', 11, 'student', { stageId: 'manuscript', estimatedDurationDays: 60 }),
    stage('pre-submission-seminar', 'Pre-submission seminar', 'decision', 12, 'committee-member', { stageId: 'submission', estimatedDurationDays: 14 }),
    stage('final-approval', 'Final approval', 'approval', 13, 'supervisor', { stageId: 'submission', estimatedDurationDays: 14 }),
    stage('internal-examination', 'Internal examination', 'examination', 14, 'internal-examiner', { stageId: 'submission', estimatedDurationDays: 21 }),
    stage('external-examination', 'External examination', 'examination', 15, 'external-examiner', { stageId: 'submission', estimatedDurationDays: 30 }),
    stage('repository-submission', 'Repository submission', 'submission', 16, 'student', { stageId: 'publication', estimatedDurationDays: 14 }),
    stage('repository-publication', 'Repository publication', 'notification', 17, 'publisher', { stageId: 'publication', estimatedDurationDays: 14 }),
  ],
};

const JOURNAL_TEMPLATE: WorkflowTemplate = {
  id: 'wft-journal-submission',
  name: 'Journal Submission',
  kind: 'journal-submission',
  description: 'The editorial workflow from manuscript preparation through peer review rounds to production and publication.',
  audience: 'Authors submitting to Scholatia journals',
  ownerRole: 'author',
  tags: ['journal', 'editorial', 'peer-review'],
  sourceEntity: 'journal',
  stages: [
    stage('prepare-manuscript', 'Prepare manuscript', 'task', 1, 'author', { stageId: 'manuscript', estimatedDurationDays: 30 }),
    stage('editor-assignment', 'Editor assignment', 'task', 2, 'handling-editor', { stageId: 'submission', estimatedDurationDays: 3 }),
    stage('editorial-screening', 'Initial editorial screening', 'review', 3, 'editor', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('peer-review-round', 'Peer review round', 'review', 4, 'reviewer', { stageId: 'peer-review', estimatedDurationDays: 30 }),
    stage('editorial-decision', 'Editorial decision', 'decision', 5, 'handling-editor', { stageId: 'peer-review', estimatedDurationDays: 7 }),
    stage('revision', 'Revision', 'task', 6, 'author', { stageId: 'manuscript', estimatedDurationDays: 30 }),
    stage('re-review', 'Re-review', 'review', 7, 'reviewer', { stageId: 'peer-review', estimatedDurationDays: 21 }),
    stage('acceptance', 'Acceptance', 'approval', 8, 'editor', { stageId: 'publication', estimatedDurationDays: 7 }),
    stage('production', 'Production', 'task', 9, 'editorial-assistant', { stageId: 'publication', estimatedDurationDays: 30 }),
    stage('publication', 'Publication', 'notification', 10, 'publisher', { stageId: 'publication', estimatedDurationDays: 7 }),
  ],
};

const CONFERENCE_TEMPLATE: WorkflowTemplate = {
  id: 'wft-conference-submission',
  name: 'Conference Submission',
  kind: 'conference-submission',
  description: 'The conference workflow from abstract submission through scientific committee screening, peer review, and camera-ready production.',
  audience: 'Authors submitting to Scholatia conferences',
  ownerRole: 'author',
  tags: ['conference', 'committee', 'presentation'],
  sourceEntity: 'conference',
  stages: [
    stage('abstract-submission', 'Abstract submission', 'submission', 1, 'author', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('committee-screening', 'Scientific committee screening', 'review', 2, 'scientific-committee', { stageId: 'submission', estimatedDurationDays: 10 }),
    stage('peer-review', 'Peer review', 'review', 3, 'reviewer', { stageId: 'peer-review', estimatedDurationDays: 21 }),
    stage('acceptance-decision', 'Acceptance decision', 'decision', 4, 'conference-chair', { stageId: 'peer-review', estimatedDurationDays: 7 }),
    stage('camera-ready', 'Camera ready', 'task', 5, 'author', { stageId: 'manuscript', estimatedDurationDays: 14 }),
    stage('presentation', 'Presentation', 'task', 6, 'author', { stageId: 'conference', estimatedDurationDays: 7 }),
    stage('proceedings-publication', 'Proceedings publication', 'notification', 7, 'publisher', { stageId: 'publication', estimatedDurationDays: 14 }),
  ],
};

const BOOK_TEMPLATE: WorkflowTemplate = {
  id: 'wft-book-publishing',
  name: 'Book Publishing',
  kind: 'book-publishing',
  description: 'The scholarly book workflow from acquisition proposal through editing, typesetting, and publication.',
  audience: 'Authors and scholarly editors',
  ownerRole: 'author',
  tags: ['book', 'monograph', 'editing'],
  sourceEntity: 'publisher',
  stages: [
    stage('proposal', 'Book proposal', 'task', 1, 'author', { stageId: 'idea', estimatedDurationDays: 45 }),
    stage('acquisition-review', 'Acquisition review', 'review', 2, 'editor', { stageId: 'idea', estimatedDurationDays: 21 }),
    stage('contract', 'Publishing contract', 'approval', 3, 'publisher', { stageId: 'funding', estimatedDurationDays: 14 }),
    stage('manuscript-writing', 'Manuscript writing', 'task', 4, 'author', { stageId: 'manuscript', estimatedDurationDays: 180 }),
    stage('chapter-reviews', 'Chapter reviews', 'review', 5, 'editor', { stageId: 'manuscript', estimatedDurationDays: 30 }),
    stage('copyedit', 'Copyedit', 'task', 6, 'editorial-assistant', { stageId: 'manuscript', estimatedDurationDays: 45 }),
    stage('typeset', 'Typeset', 'task', 7, 'editorial-assistant', { stageId: 'manuscript', estimatedDurationDays: 45 }),
    stage('proof-approval', 'Proof approval', 'approval', 8, 'author', { stageId: 'publication', estimatedDurationDays: 14 }),
    stage('publication', 'Publication', 'notification', 9, 'publisher', { stageId: 'publication', estimatedDurationDays: 14 }),
  ],
};

const GRANT_TEMPLATE: WorkflowTemplate = {
  id: 'wft-grant-proposal',
  name: 'Grant Proposal',
  kind: 'grant-proposal',
  description: 'The grant workflow from needs definition through proposal writing, internal review, budget approval, and submission to funders.',
  audience: 'Principal investigators',
  ownerRole: 'principal-investigator',
  tags: ['grant', 'funding', 'proposal'],
  sourceEntity: 'funding',
  stages: [
    stage('needs-definition', 'Needs definition', 'task', 1, 'principal-investigator', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('proposal-writing', 'Proposal writing', 'task', 2, 'principal-investigator', { stageId: 'proposal', estimatedDurationDays: 45 }),
    stage('internal-review', 'Internal review', 'review', 3, 'researcher', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('budget-approval', 'Budget approval', 'approval', 4, 'institution-officer', { stageId: 'funding', estimatedDurationDays: 14 }),
    stage('submission', 'Submission', 'submission', 5, 'principal-investigator', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('funding-decision', 'Funding decision', 'decision', 6, 'grant-officer', { stageId: 'peer-review', estimatedDurationDays: 60 }),
    stage('award-acceptance', 'Award acceptance', 'approval', 7, 'grant-officer', { stageId: 'funding', estimatedDurationDays: 14 }),
    stage('award-setup', 'Award setup', 'task', 8, 'co-investigator', { stageId: 'project', estimatedDurationDays: 14 }),
  ],
};

const ETHICS_TEMPLATE: WorkflowTemplate = {
  id: 'wft-ethics-review',
  name: 'Ethics Review',
  kind: 'ethics-review',
  description: 'The research ethics workflow from application through departmental and committee review to approval and closure.',
  audience: 'Researchers and students',
  ownerRole: 'researcher',
  tags: ['ethics', 'compliance', 'committee'],
  sourceEntity: 'institution',
  stages: [
    stage('application', 'Application', 'task', 1, 'researcher', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('departmental-review', 'Departmental review', 'review', 2, 'committee-member', { stageId: 'proposal', estimatedDurationDays: 10 }),
    stage('committee-review', 'Ethics committee review', 'review', 3, 'committee-member', { stageId: 'proposal', estimatedDurationDays: 21 }),
    stage('ethics-approval', 'Ethics approval', 'approval', 4, 'committee-member', { stageId: 'funding', estimatedDurationDays: 7 }),
    stage('amendment', 'Amendment', 'task', 5, 'researcher', { stageId: 'project', estimatedDurationDays: 14, optional: true }),
    stage('closure-report', 'Closure report', 'task', 6, 'researcher', { stageId: 'knowledge-transfer', estimatedDurationDays: 14 }),
  ],
};

const CONSULTANCY_TEMPLATE: WorkflowTemplate = {
  id: 'wft-consultancy-project',
  name: 'Consultancy Project',
  kind: 'consultancy-project',
  description: 'The consultancy workflow from brief and scoping through proposal, contract, delivery phases, and acceptance.',
  audience: 'Consultants and clients',
  ownerRole: 'provider',
  tags: ['consultancy', 'delivery', 'contract'],
  sourceEntity: 'service',
  stages: [
    stage('brief', 'Client brief', 'task', 1, 'client', { stageId: 'idea', estimatedDurationDays: 7 }),
    stage('scoping', 'Scoping', 'task', 2, 'provider', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('proposal', 'Consultancy proposal', 'task', 3, 'provider', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('contract-approval', 'Contract approval', 'approval', 4, 'client', { stageId: 'funding', estimatedDurationDays: 14 }),
    stage('delivery-phases', 'Delivery phases', 'task', 5, 'provider', { stageId: 'project', estimatedDurationDays: 90 }),
    stage('progress-reviews', 'Progress reviews', 'review', 6, 'client', { stageId: 'project', estimatedDurationDays: 30 }),
    stage('final-delivery', 'Final delivery', 'submission', 7, 'provider', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('acceptance', 'Acceptance', 'approval', 8, 'client', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('closure', 'Closure', 'task', 9, 'provider', { stageId: 'knowledge-transfer', estimatedDurationDays: 7 }),
  ],
};

const INSTITUTIONAL_TEMPLATE: WorkflowTemplate = {
  id: 'wft-institutional-approval',
  name: 'Institutional Approval',
  kind: 'institutional-approval',
  description: 'The internal institutional approval workflow for requests, clearances, and official decisions.',
  audience: 'Institution officers and staff',
  ownerRole: 'institution-officer',
  tags: ['institutional', 'approval', 'governance'],
  sourceEntity: 'institution',
  stages: [
    stage('request', 'Request', 'task', 1, 'institution-officer', { stageId: 'idea', estimatedDurationDays: 7 }),
    stage('review', 'Review', 'review', 2, 'institution-officer', { stageId: 'proposal', estimatedDurationDays: 14 }),
    stage('approval', 'Approval', 'approval', 3, 'institution-officer', { stageId: 'funding', estimatedDurationDays: 7 }),
    stage('notification', 'Notification', 'notification', 4, 'institution-officer', { stageId: 'knowledge-transfer', estimatedDurationDays: 3 }),
  ],
};

const MARKETPLACE_TEMPLATE: WorkflowTemplate = {
  id: 'wft-marketplace-delivery',
  name: 'Marketplace Delivery',
  kind: 'marketplace-delivery',
  description: 'The marketplace workflow from order and provider acceptance through fulfilment, delivery, and acceptance.',
  audience: 'Buyers and providers',
  ownerRole: 'provider',
  tags: ['marketplace', 'order', 'delivery'],
  sourceEntity: 'marketplace',
  stages: [
    stage('order', 'Order', 'task', 1, 'client', { stageId: 'idea', estimatedDurationDays: 3 }),
    stage('provider-acceptance', 'Provider acceptance', 'task', 2, 'provider', { stageId: 'project', estimatedDurationDays: 3 }),
    stage('fulfilment', 'Fulfilment', 'task', 3, 'provider', { stageId: 'project', estimatedDurationDays: 14 }),
    stage('delivery', 'Delivery', 'submission', 4, 'provider', { stageId: 'submission', estimatedDurationDays: 3 }),
    stage('acceptance', 'Acceptance', 'approval', 5, 'client', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('rating-review', 'Rating and review', 'task', 6, 'client', { stageId: 'impact', estimatedDurationDays: 7 }),
  ],
};

const SERVICE_TEMPLATE: WorkflowTemplate = {
  id: 'wft-service-delivery',
  name: 'Service Delivery',
  kind: 'service-delivery',
  description: 'The service workflow from order through provider assignment, milestones, progress reviews, and final delivery acceptance.',
  audience: 'Clients and service providers',
  ownerRole: 'provider',
  tags: ['service', 'milestones', 'delivery'],
  sourceEntity: 'service',
  stages: [
    stage('order', 'Service order', 'task', 1, 'client', { stageId: 'idea', estimatedDurationDays: 3 }),
    stage('provider-assignment', 'Provider assignment', 'task', 2, 'provider', { stageId: 'project', estimatedDurationDays: 5 }),
    stage('milestones', 'Service milestones', 'task', 3, 'provider', { stageId: 'project', estimatedDurationDays: 60 }),
    stage('progress-reviews', 'Progress reviews', 'review', 4, 'client', { stageId: 'project', estimatedDurationDays: 30 }),
    stage('final-delivery', 'Final delivery', 'submission', 5, 'provider', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('acceptance', 'Acceptance', 'approval', 6, 'client', { stageId: 'submission', estimatedDurationDays: 7 }),
    stage('rating', 'Rating', 'task', 7, 'client', { stageId: 'impact', estimatedDurationDays: 7 }),
  ],
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  UNDERGRADUATE_TEMPLATE,
  MASTERS_TEMPLATE,
  PHD_TEMPLATE,
  JOURNAL_TEMPLATE,
  CONFERENCE_TEMPLATE,
  BOOK_TEMPLATE,
  GRANT_TEMPLATE,
  ETHICS_TEMPLATE,
  CONSULTANCY_TEMPLATE,
  INSTITUTIONAL_TEMPLATE,
  MARKETPLACE_TEMPLATE,
  SERVICE_TEMPLATE,
];

export const TEMPLATES_BY_KIND: Record<WorkflowTemplateKind, WorkflowTemplate> = {
  'undergraduate-project': UNDERGRADUATE_TEMPLATE,
  'masters-dissertation': MASTERS_TEMPLATE,
  'phd-thesis': PHD_TEMPLATE,
  'journal-submission': JOURNAL_TEMPLATE,
  'conference-submission': CONFERENCE_TEMPLATE,
  'book-publishing': BOOK_TEMPLATE,
  'grant-proposal': GRANT_TEMPLATE,
  'ethics-review': ETHICS_TEMPLATE,
  'consultancy-project': CONSULTANCY_TEMPLATE,
  'institutional-approval': INSTITUTIONAL_TEMPLATE,
  'marketplace-delivery': MARKETPLACE_TEMPLATE,
  'service-delivery': SERVICE_TEMPLATE,
};

// ---------------------------------------------------------------------------
// Workflow 1 — PhD thesis (revision-submitted, round 4)
// ---------------------------------------------------------------------------

let phd = createWorkflowFromTemplate({
  template: PHD_TEMPLATE,
  owner: JSCHOLAR.username,
  ownerName: JSCHOLAR.displayName,
  title: 'PhD Thesis — Multilingual Parsing',
  description: 'Doctoral thesis on multilingual dependency parsing for low-resource African languages.',
  priority: 'high',
  sourceId: 'multilingual-parsing-framework',
  sourceEntity: 'project',
  sourceTitle: 'Multilingual Parsing Framework',
  now: daysAgo(420),
});

phd.assignees = ['supervisor', 'co-supervisor', 'student', 'internal-examiner', 'external-examiner'];
phd = activate(phd, ADEBAYO.username, ADEBAYO.displayName, daysAgo(420));

const phdStageStatuses: Array<[string, string]> = [
  ['topic-selection', 'completed'],
  ['topic-approval', 'completed'],
  ['proposal-writing', 'completed'],
  ['proposal-approval', 'completed'],
  ['ethics-approval', 'completed'],
  ['data-collection', 'completed'],
  ['analysis', 'completed'],
  ['draft-chapters', 'completed'],
  ['chapter-reviews', 'completed'],
  ['annual-progress-review', 'completed'],
  ['revision', 'completed'],
  ['pre-submission-seminar', 'completed'],
  ['final-approval', 'completed'],
];

phdStageStatuses.forEach(([stageId, status], index) => {
  phd = setStageStatus({
    workflow: phd,
    stageId: workflowStageIdOf(phd, stageId),
    status: status as WorkflowStageStatus,
    actor: JSCHOLAR.username,
    actorName: JSCHOLAR.displayName,
    now: daysAgo(420 - index * 24),
  });
});

phd = setStageStatus({
  workflow: phd,
  stageId: workflowStageIdOf(phd, 'internal-examination'),
  status: 'in-progress',
  actor: OKONKWO.username,
  actorName: OKONKWO.displayName,
  now: daysAgo(8),
});

phd = submitWorkflowForReview(phd, JSCHOLAR.username, JSCHOLAR.displayName, daysAgo(6));
phd = requestWorkflowRevision(phd, OKONKWO.username, OKONKWO.displayName, 'Internal examiner requested corrections to chapters 4–5.', daysAgo(5));
phd = submitWorkflowRevision(phd, JSCHOLAR.username, JSCHOLAR.displayName, daysAgo(2));

phd = addWorkflowDeadline({
  workflow: phd,
  title: 'External examination submission',
  dueAt: daysAhead(14),
  gracePeriodDays: 7,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  now: daysAgo(2),
});

phd = addWorkflowMilestone({
  workflow: phd,
  title: 'Proposal approved',
  stageId: 'proposal',
  targetDate: daysAgo(300),
});
phd = addWorkflowMilestone({
  workflow: phd,
  title: 'Data collection complete',
  stageId: 'dataset',
  targetDate: daysAgo(120),
});
phd = achieveWorkflowMilestone({ workflow: phd, milestoneId: milestoneIdOf(phd, 'Proposal approved'), actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(300) });
phd = achieveWorkflowMilestone({ workflow: phd, milestoneId: milestoneIdOf(phd, 'Data collection complete'), actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(120) });

phd = addWorkflowDeadline({
  workflow: phd,
  title: 'Chapter 3 revision deadline',
  dueAt: daysAgo(30),
  actor: JSCHOLAR.username,
  actorName: JSCHOLAR.displayName,
  now: daysAgo(50),
});
phd = extendWorkflowDeadline({
  workflow: phd,
  deadlineId: 'wfd-chapter-3-revision-deadline',
  extendedTo: daysAgo(20),
  actor: ADEBAYO.username,
  actorName: ADEBAYO.displayName,
  now: daysAgo(40),
});

export const PHD_WORKFLOW = phd;

function workflowStageIdOf(workflow: WorkflowInstance, templateStageId: string): string {
  const stage = workflow.stages.find((entry) => entry.templateStageId === templateStageId);
  if (!stage) {
    throw new Error(`Missing stage ${templateStageId} in ${workflow.id}`);
  }
  return stage.id;
}

function milestoneIdOf(workflow: WorkflowInstance, title: string): string {
  const milestone = workflow.milestones.find((entry) => entry.title === title);
  if (!milestone) {
    throw new Error(`Missing milestone "${title}" in ${workflow.id}`);
  }
  return milestone.id;
}

function activate(workflow: WorkflowInstance, actor: string, actorName: string, now: string): WorkflowInstance {
  let updated = transitionWorkflow({ workflow, to: 'assigned', actor, actorName, now });
  updated = transitionWorkflow({ workflow: updated, to: 'accepted', actor, actorName, now });
  return transitionWorkflow({ workflow: updated, to: 'in-progress', actor, actorName, now });
}

// ---------------------------------------------------------------------------
// Workflow 2 — Masters dissertation (in-progress)
// ---------------------------------------------------------------------------

let masters = createWorkflowFromTemplate({
  template: MASTERS_TEMPLATE,
  owner: MARIA.username,
  ownerName: MARIA.displayName,
  title: 'Masters — Malaria Surveillance',
  description: 'Dissertation on seasonal malaria surveillance data across West African clinics.',
  priority: 'medium',
  sourceId: 'cross-lingual-corpus-annotation',
  sourceEntity: 'project',
  sourceTitle: 'Cross-Lingual Corpus Annotation',
  now: daysAgo(200),
});

masters = activate(masters, ADEBAYO.username, ADEBAYO.displayName, daysAgo(200));

const mastersStageStatuses: Array<[string, string]> = [
  ['topic-selection', 'completed'],
  ['topic-approval', 'completed'],
  ['proposal-writing', 'completed'],
  ['proposal-approval', 'completed'],
  ['ethics-approval', 'completed'],
  ['data-collection', 'completed'],
  ['analysis', 'in-progress'],
];
mastersStageStatuses.forEach(([stageId, status], index) => {
  masters = setStageStatus({
    workflow: masters,
    stageId: workflowStageIdOf(masters, stageId),
    status: status as WorkflowStageStatus,
    actor: MARIA.username,
    actorName: MARIA.displayName,
    now: daysAgo(200 - index * 20),
  });
});

masters = addWorkflowDeadline({
  workflow: masters,
  title: 'Draft chapters deadline',
  dueAt: daysAhead(25),
  gracePeriodDays: 5,
  actor: MARIA.username,
  actorName: MARIA.displayName,
  now: daysAgo(5),
});

masters = addWorkflowMilestone({ workflow: masters, title: 'Ethics approved', stageId: 'funding', targetDate: daysAgo(140) });
masters = achieveWorkflowMilestone({ workflow: masters, milestoneId: milestoneIdOf(masters, 'Ethics approved'), actor: MARIA.username, actorName: MARIA.displayName, now: daysAgo(140) });

export const MASTERS_WORKFLOW = masters;

// ---------------------------------------------------------------------------
// Workflow 3 — Journal submission (revision-requested)
// ---------------------------------------------------------------------------

let journal = createWorkflowFromTemplate({
  template: JOURNAL_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Journal — Low-Resource Language Toolkit',
  description: 'Journal submission reporting the low-resource language toolkit and cross-lingual benchmarks.',
  priority: 'high',
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
  sourceTitle: 'Scholatia Journal of Open Research',
  now: daysAgo(120),
});

journal = activate(journal, SMITH.username, SMITH.displayName, daysAgo(120));

const journalStageStatuses: Array<[string, string]> = [
  ['prepare-manuscript', 'completed'],
  ['editor-assignment', 'completed'],
  ['editorial-screening', 'completed'],
  ['peer-review-round', 'completed'],
  ['editorial-decision', 'completed'],
  ['revision', 'completed'],
];
journalStageStatuses.forEach(([stageId, status], index) => {
  journal = setStageStatus({
    workflow: journal,
    stageId: workflowStageIdOf(journal, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(120 - index * 12),
  });
});
journal = setStageStatus({
  workflow: journal,
  stageId: workflowStageIdOf(journal, 're-review'),
  status: 'in-progress',
  actor: SMITH.username,
  actorName: SMITH.displayName,
  now: daysAgo(9),
});
journal = submitWorkflowForReview(journal, OJURI.username, OJURI.displayName, daysAgo(8));
journal = requestWorkflowRevision(journal, SMITH.username, SMITH.displayName, 'Reviewers requested expanded evaluation methodology and reproducibility details.', daysAgo(6));

export const JOURNAL_WORKFLOW = journal;

// ---------------------------------------------------------------------------
// Workflow 4 — Conference submission (approved / accepted)
// ---------------------------------------------------------------------------

let conference = createWorkflowFromTemplate({
  template: CONFERENCE_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Conference — Reproducible LLM Evaluation',
  description: 'Conference paper on reproducible evaluation of large language models on African languages.',
  priority: 'high',
  sourceId: 'CONF-001',
  sourceEntity: 'conference',
  sourceTitle: 'Scholatia International Conference on Research and Innovation',
  now: daysAgo(90),
});

conference = activate(conference, TANAKA.username, TANAKA.displayName, daysAgo(90));

const conferenceStageStatuses: Array<[string, string]> = [
  ['abstract-submission', 'completed'],
  ['committee-screening', 'completed'],
  ['peer-review', 'completed'],
  ['acceptance-decision', 'completed'],
  ['camera-ready', 'completed'],
];
conferenceStageStatuses.forEach(([stageId, status], index) => {
  conference = setStageStatus({
    workflow: conference,
    stageId: workflowStageIdOf(conference, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(90 - index * 10),
  });
});
conference = submitWorkflowForReview(conference, OJURI.username, OJURI.displayName, daysAgo(30));
conference = approveWorkflow(conference, TANAKA.username, TANAKA.displayName, 'Accepted for presentation.', daysAgo(20));

export const CONFERENCE_WORKFLOW = conference;

// ---------------------------------------------------------------------------
// Workflow 5 — Grant proposal (awaiting-review)
// ---------------------------------------------------------------------------

let grant = createWorkflowFromTemplate({
  template: GRANT_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Grant — NIH Computational Linguistics',
  description: 'Grant proposal to NIH for computational linguistics infrastructure in low-resource languages.',
  priority: 'urgent',
  sourceId: 'nih',
  sourceEntity: 'funding',
  sourceTitle: 'NIH',
  now: daysAgo(75),
});

grant = activate(grant, WANG.username, WANG.displayName, daysAgo(75));

const grantStageStatuses: Array<[string, string]> = [
  ['needs-definition', 'completed'],
  ['proposal-writing', 'completed'],
  ['internal-review', 'completed'],
  ['budget-approval', 'completed'],
  ['submission', 'completed'],
];
grantStageStatuses.forEach(([stageId, status], index) => {
  grant = setStageStatus({
    workflow: grant,
    stageId: workflowStageIdOf(grant, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(75 - index * 10),
  });
});
grant = submitWorkflowForReview(grant, OJURI.username, OJURI.displayName, daysAgo(30));

grant = addWorkflowDeadline({
  workflow: grant,
  title: 'Funding decision',
  dueAt: daysAhead(10),
  actor: OJURI.username,
  actorName: OJURI.displayName,
  now: daysAgo(30),
});

export const GRANT_WORKFLOW = grant;

// ---------------------------------------------------------------------------
// Workflow 6 — Ethics review (approved)
// ---------------------------------------------------------------------------

let ethics = createWorkflowFromTemplate({
  template: ETHICS_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Ethics — Low-Resource Language Toolkit',
  description: 'Ethics review application for the low-resource language toolkit data collection.',
  priority: 'medium',
  sourceId: 'low-resource-language-toolkit',
  sourceEntity: 'project',
  sourceTitle: 'Low-Resource Language Toolkit',
  now: daysAgo(60),
});

ethics = activate(ethics, OKONKWO.username, OKONKWO.displayName, daysAgo(60));

const ethicsStageStatuses: Array<[string, string]> = [
  ['application', 'completed'],
  ['departmental-review', 'completed'],
  ['committee-review', 'completed'],
];
ethicsStageStatuses.forEach(([stageId, status], index) => {
  ethics = setStageStatus({
    workflow: ethics,
    stageId: workflowStageIdOf(ethics, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(60 - index * 8),
  });
});
ethics = submitWorkflowForReview(ethics, OJURI.username, OJURI.displayName, daysAgo(30));
ethics = approveWorkflow(ethics, OKONKWO.username, OKONKWO.displayName, 'Ethics approval granted.', daysAgo(20));

export const ETHICS_WORKFLOW = ethics;

// ---------------------------------------------------------------------------
// Workflow 7 — Service delivery (in-progress)
// ---------------------------------------------------------------------------

let service = createWorkflowFromTemplate({
  template: SERVICE_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Service — Statistical Analysis',
  description: 'Statistical analysis service for a clinical cohort study.',
  priority: 'medium',
  sourceId: 'ord-service-021',
  sourceEntity: 'service-order',
  sourceTitle: 'Statistical Analysis Service',
  now: daysAgo(40),
});

service = activate(service, OJURI.username, OJURI.displayName, daysAgo(40));

const serviceStageStatuses: Array<[string, string]> = [
  ['order', 'completed'],
  ['provider-assignment', 'completed'],
  ['milestones', 'in-progress'],
];
serviceStageStatuses.forEach(([stageId, status], index) => {
  service = setStageStatus({
    workflow: service,
    stageId: workflowStageIdOf(service, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(40 - index * 6),
  });
});
service = addWorkflowMilestone({ workflow: service, title: 'Milestone 1 — data validation', stageId: 'dataset', targetDate: daysAgo(15) });
service = achieveWorkflowMilestone({ workflow: service, milestoneId: milestoneIdOf(service, 'Milestone 1 — data validation'), actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(15) });
service = addWorkflowMilestone({ workflow: service, title: 'Milestone 2 — regression models', stageId: 'analysis', targetDate: daysAhead(10) });

export const SERVICE_WORKFLOW = service;

// ---------------------------------------------------------------------------
// Workflow 8 — Undergraduate project (in-progress)
// ---------------------------------------------------------------------------

let undergraduate = createWorkflowFromTemplate({
  template: UNDERGRADUATE_TEMPLATE,
  owner: DUBE.username,
  ownerName: DUBE.displayName,
  title: 'Undergraduate — AI Literacy in Secondary Schools',
  description: 'Final-year project assessing AI literacy interventions in secondary schools.',
  priority: 'medium',
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  sourceTitle: 'University of Ibadan',
  now: daysAgo(45),
});

undergraduate = activate(undergraduate, ADEBAYO.username, ADEBAYO.displayName, daysAgo(45));

const undergraduateStageStatuses: Array<[string, string]> = [
  ['topic-selection', 'completed'],
  ['topic-approval', 'completed'],
  ['proposal-writing', 'completed'],
  ['proposal-approval', 'completed'],
  ['data-collection', 'in-progress'],
];
undergraduateStageStatuses.forEach(([stageId, status], index) => {
  undergraduate = setStageStatus({
    workflow: undergraduate,
    stageId: workflowStageIdOf(undergraduate, stageId),
    status: status as WorkflowStageStatus,
    actor: DUBE.username,
    actorName: DUBE.displayName,
    now: daysAgo(45 - index * 6),
  });
});
undergraduate = addWorkflowMilestone({ workflow: undergraduate, title: 'Proposal approved', stageId: 'proposal', targetDate: daysAgo(20) });
undergraduate = achieveWorkflowMilestone({ workflow: undergraduate, milestoneId: milestoneIdOf(undergraduate, 'Proposal approved'), actor: DUBE.username, actorName: DUBE.displayName, now: daysAgo(20) });

export const UNDERGRADUATE_WORKFLOW = undergraduate;

// ---------------------------------------------------------------------------
// Workflow 9 — Institutional approval (approved)
// ---------------------------------------------------------------------------

let institutional = createWorkflowFromTemplate({
  template: INSTITUTIONAL_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Institutional — Research Data Repository',
  description: 'Request for an institutional research data repository clearance.',
  priority: 'low',
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  sourceTitle: 'University of Ibadan',
  now: daysAgo(30),
});

institutional = activate(institutional, ADESINA.username, ADESINA.displayName, daysAgo(30));

const institutionalStageStatuses: Array<[string, string]> = [
  ['request', 'completed'],
  ['review', 'completed'],
  ['approval', 'completed'],
];
institutionalStageStatuses.forEach(([stageId, status], index) => {
  institutional = setStageStatus({
    workflow: institutional,
    stageId: workflowStageIdOf(institutional, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(30 - index * 5),
  });
});
institutional = submitWorkflowForReview(institutional, OJURI.username, OJURI.displayName, daysAgo(12));
institutional = approveWorkflow(institutional, ADESINA.username, ADESINA.displayName, 'Repository clearance granted.', daysAgo(8));

export const INSTITUTIONAL_WORKFLOW = institutional;

// ---------------------------------------------------------------------------
// Workflow 10 — Book publishing (draft)
// ---------------------------------------------------------------------------

const BOOK_WORKFLOW = createWorkflowFromTemplate({
  template: BOOK_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Book — African Language Technologies',
  description: 'Planned scholarly monograph on African language technologies.',
  priority: 'low',
  sourceId: 'CONF-001',
  sourceEntity: 'conference',
  sourceTitle: 'Scholatia Press',
  now: daysAgo(5),
});

// ---------------------------------------------------------------------------
// Workflow 11 — Marketplace delivery (completed)
// ---------------------------------------------------------------------------

let marketplace = createWorkflowFromTemplate({
  template: MARKETPLACE_TEMPLATE,
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  title: 'Marketplace — Python ML Analysis',
  description: 'Marketplace delivery of a Python machine-learning analysis package.',
  priority: 'medium',
  sourceId: 'listing-python-ml-analysis',
  sourceEntity: 'marketplace',
  sourceTitle: 'Python ML Analysis',
  now: daysAgo(35),
});

marketplace = activate(marketplace, OJURI.username, OJURI.displayName, daysAgo(35));

const marketplaceStageStatuses: Array<[string, string]> = [
  ['order', 'completed'],
  ['provider-acceptance', 'completed'],
  ['fulfilment', 'completed'],
  ['delivery', 'completed'],
  ['acceptance', 'completed'],
  ['rating-review', 'completed'],
];
marketplaceStageStatuses.forEach(([stageId, status], index) => {
  marketplace = setStageStatus({
    workflow: marketplace,
    stageId: workflowStageIdOf(marketplace, stageId),
    status: status as WorkflowStageStatus,
    actor: OJURI.username,
    actorName: OJURI.displayName,
    now: daysAgo(35 - index * 4),
  });
});
marketplace = submitWorkflowForReview(marketplace, OJURI.username, OJURI.displayName, daysAgo(10));
marketplace = approveWorkflow(marketplace, OJURI.username, OJURI.displayName, 'Deliverable accepted by the buyer.', daysAgo(6));
marketplace = completeWorkflow(marketplace, OJURI.username, OJURI.displayName, daysAgo(2));

export const MARKETPLACE_WORKFLOW = marketplace;

// ---------------------------------------------------------------------------
// Derived workflow aggregates
// ---------------------------------------------------------------------------

export const WORKFLOW_INSTANCES: WorkflowInstance[] = [
  PHD_WORKFLOW,
  MASTERS_WORKFLOW,
  JOURNAL_WORKFLOW,
  CONFERENCE_WORKFLOW,
  GRANT_WORKFLOW,
  ETHICS_WORKFLOW,
  SERVICE_WORKFLOW,
  UNDERGRADUATE_WORKFLOW,
  INSTITUTIONAL_WORKFLOW,
  BOOK_WORKFLOW,
  MARKETPLACE_WORKFLOW,
];

export const WORKFLOW_STATISTICS: WorkflowStatistics = workflowStatistics(WORKFLOW_INSTANCES, NOW.toISOString());
export const WORKFLOW_ANALYTICS: WorkflowAnalytics = workflowAnalytics(WORKFLOW_INSTANCES, NOW.toISOString());
export const WORKFLOW_INSIGHTS: WorkflowInsight[] = workflowInsights(WORKFLOW_INSTANCES);
export const WORKFLOW_PORTFOLIO: WorkflowPortfolio = buildWorkflowPortfolio(WORKFLOW_INSTANCES, WORKFLOW_TEMPLATES, {
  now: NOW.toISOString(),
  top: 4,
});

export const FEATURED_WORKFLOWS = WORKFLOW_PORTFOLIO.featured;
export const CURRENT_WORKFLOW_USER = CURRENT_USER;
export const DEFAULT_WORKFLOW = PHD_WORKFLOW;
export const DEFAULT_WORKFLOW_TEMPLATE = JOURNAL_TEMPLATE;
export const DEFAULT_WORKFLOW_KIND = 'journal-submission' as const;

// ---------------------------------------------------------------------------
// Workbench — the private research surface of the current user
// ---------------------------------------------------------------------------

const RESEARCH_WORKBENCH: Workbench = {
  id: 'wb-ojuri',
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  items: [],
  versions: [],
  createdAt: daysAgo(400),
  updatedAt: daysAgo(1),
};

const workbenchItems: Array<{
  type: WorkbenchItem['type'];
  title: string;
  body?: string;
  content?: string;
  tags?: string[];
  sourceId?: string;
  sourceEntity?: string;
  days: number;
  status?: WorkbenchItem['status'];
  version?: number;
}> = [
  {
    type: 'note',
    title: 'Meeting notes — thesis supervision',
    body: 'Supervisor advised focusing Chapter 4 on parsing accuracy across dialect clusters.',
    tags: ['phd', 'supervision'],
    days: 2,
  },
  {
    type: 'brainstorm',
    title: 'Research directions for African NLP',
    body: 'Candidate directions: dependency parsing, speech corpora, machine translation benchmarks.',
    tags: ['nlp', 'brainstorm'],
    days: 40,
  },
  {
    type: 'outline',
    title: 'Thesis outline v3',
    content: '1 Introduction, 2 Related Work, 3 Methodology, 4 Experiments, 5 Discussion, 6 Conclusion',
    tags: ['thesis', 'outline'],
    days: 60,
    status: 'active',
    version: 3,
  },
  {
    type: 'reference',
    title: 'Adesina & Okafor (2025) low-resource parsing',
    body: 'Foundational paper on multilingual parsing for low-resource languages.',
    tags: ['reference', 'related-work'],
    sourceId: 'JNL-001',
    sourceEntity: 'journal',
    days: 80,
  },
  {
    type: 'pdf',
    title: 'survey-of-african-languages.pdf',
    content: 'Survey corpus compiled from open repositories.',
    tags: ['pdf', 'corpus'],
    days: 5,
    status: 'draft',
  },
  {
    type: 'dataset',
    title: 'Yoruba corpus sample',
    content: '10k sentence pairs, tokenised, with POS tags.',
    tags: ['dataset', 'yoruba'],
    days: 90,
  },
  {
    type: 'clipping',
    title: 'Conference call for papers — SIRI 2026',
    body: 'Deadline 15 August 2026. Open Science Infrastructure track.',
    tags: ['clipping', 'conference'],
    sourceId: 'CONF-001',
    sourceEntity: 'conference',
    days: 15,
  },
  {
    type: 'screenshot',
    title: 'Screenshot — cohort dashboard',
    content: 'Cohort recruitment dashboard capture for the malaria study.',
    tags: ['screenshot', 'cohort'],
    days: 12,
  },
  {
    type: 'calculation',
    title: 'Sample size calc — malaria cohort',
    content: 'n = 480 clusters, power 0.80, alpha 0.05.',
    tags: ['calculation', 'statistics'],
    days: 22,
  },
  {
    type: 'voice-note',
    title: 'Voice note — supervisor feedback round 4',
    body: 'Strengthen the error analysis section; add cross-lingual transfer discussion.',
    content: 'Strengthen the error analysis section; add cross-lingual transfer discussion.',
    tags: ['voice', 'supervision'],
    days: 4,
    status: 'promoted',
  },
  {
    type: 'ai-note',
    title: 'AI summary — related work cluster',
    body: 'Cluster of 14 related papers on multilingual parsing; dominant methods: transfer learning and synthetic data.',
    tags: ['ai', 'related-work'],
    days: 18,
  },
  {
    type: 'draft-section',
    title: 'Draft section — methodology',
    body: 'Methodology section draft covering model configuration, data splits, and evaluation metrics.',
    content: 'Methodology section draft covering model configuration, data splits, and evaluation metrics.',
    tags: ['thesis', 'chapter-3'],
    days: 7,
    status: 'promoted',
  },
  {
    type: 'draft-chapter',
    title: 'Draft chapter — introduction',
    body: 'Introduction chapter draft framing the research questions.',
    tags: ['thesis', 'chapter-1'],
    days: 30,
  },
  {
    type: 'temp-file',
    title: 'figures-v2.png',
    content: 'Figure exports for the conference submission.',
    tags: ['temp', 'figures'],
    days: 3,
  },
];

let workbenchState: Workbench = RESEARCH_WORKBENCH;
workbenchItems.forEach((item) => {
  workbenchState = createWorkbenchItem({
    workbench: workbenchState,
    type: item.type,
    title: item.title,
    body: item.body,
    content: item.content,
    tags: item.tags,
    sourceId: item.sourceId,
    sourceEntity: item.sourceEntity,
    now: daysAgo(item.days),
  });
  const created = workbenchState.items[0];
  workbenchState = {
    ...workbenchState,
    items: workbenchState.items.map((entry) =>
      entry.id === created.id
        ? { ...entry, status: item.status ?? 'active', version: item.version ?? 1, updatedAt: daysAgo(item.days) }
        : entry,
    ),
  };
});

export const RESEARCH_WORKBENCH_DATA: Workbench = workbenchState;
export const DEFAULT_WORKBENCH = workbenchState;

// ---------------------------------------------------------------------------
// Scholarly artefacts
// ---------------------------------------------------------------------------

const THESIS_ARTEFACT: ScholarlyArtefact = {
  id: 'art-thesis-multilingual-parsing',
  title: 'Multilingual Dependency Parsing for Low-Resource African Languages',
  description: 'Doctoral thesis artefact tracking chapters and sections through supervised review.',
  type: 'thesis',
  status: 'under-review',
  owner: JSCHOLAR.username,
  ownerName: JSCHOLAR.displayName,
  chapters: [
    {
      id: 'artc-thesis-ch1',
      artefactId: 'art-thesis-multilingual-parsing',
      title: 'Chapter 1 — Introduction',
      order: 1,
      status: 'approved',
      sections: [
        section('art-thesis-multilingual-parsing', '1.1 Background', 'approved', 1200, daysAgo(150)),
        section('art-thesis-multilingual-parsing', '1.2 Research Questions', 'approved', 900, daysAgo(150)),
      ],
      createdAt: daysAgo(300),
      updatedAt: daysAgo(150),
    },
    {
      id: 'artc-thesis-ch2',
      artefactId: 'art-thesis-multilingual-parsing',
      title: 'Chapter 2 — Related Work',
      order: 2,
      status: 'approved',
      sections: [
        section('art-thesis-multilingual-parsing', '2.1 Multilingual Parsing', 'approved', 2400, daysAgo(200)),
        section('art-thesis-multilingual-parsing', '2.2 Low-Resource Methods', 'approved', 1800, daysAgo(200)),
      ],
      createdAt: daysAgo(280),
      updatedAt: daysAgo(180),
    },
    {
      id: 'artc-thesis-ch3',
      artefactId: 'art-thesis-multilingual-parsing',
      title: 'Chapter 3 — Methodology',
      order: 3,
      status: 'revision-submitted',
      sections: [
        section('art-thesis-multilingual-parsing', '3.1 Model Architecture', 'approved', 2000, daysAgo(120)),
        section('art-thesis-multilingual-parsing', '3.2 Data Splits', 'revision-submitted', 1500, daysAgo(40)),
        section('art-thesis-multilingual-parsing', '3.3 Evaluation Metrics', 'revision-submitted', 1100, daysAgo(40)),
      ],
      createdAt: daysAgo(250),
      updatedAt: daysAgo(40),
    },
    {
      id: 'artc-thesis-ch4',
      artefactId: 'art-thesis-multilingual-parsing',
      title: 'Chapter 4 — Experiments',
      order: 4,
      status: 'revision-requested',
      sections: [
        section('art-thesis-multilingual-parsing', '4.1 Setup', 'revision-requested', 1600, daysAgo(60)),
        section('art-thesis-multilingual-parsing', '4.2 Results', 'revision-requested', 2200, daysAgo(60)),
        section('art-thesis-multilingual-parsing', '4.3 Error Analysis', 'awaiting-review', 1300, daysAgo(10)),
      ],
      createdAt: daysAgo(220),
      updatedAt: daysAgo(10),
    },
  ],
  sections: [],
  createdAt: daysAgo(300),
  updatedAt: daysAgo(2),
};

function section(
  artefactId: string,
  title: string,
  status: ArtefactSection['status'],
  wordCount: number,
  createdAt: string,
  reviewer?: string,
): ArtefactSection {
  return {
    id: `arts-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    artefactId,
    title,
    order: 1,
    status,
    wordCount,
    reviewer,
    reviewerName: reviewer ? researcherOf(reviewer).displayName : undefined,
    createdAt,
    updatedAt: createdAt,
  };
}

const MANUSCRIPT_ARTEFACT: ScholarlyArtefact = {
  id: 'art-manuscript-low-resource-toolkit',
  title: 'Low-Resource Language Toolkit: Benchmarks and Reproducibility',
  description: 'Journal manuscript artefact for the Scholatia Journal of Open Research.',
  type: 'manuscript',
  status: 'under-review',
  owner: OJURI.username,
  ownerName: OJURI.displayName,
  chapters: [],
  sections: [
    section('art-manuscript-low-resource-toolkit', 'Abstract', 'approved', 220, daysAgo(110), 'smith'),
    section('art-manuscript-low-resource-toolkit', 'Introduction', 'approved', 1500, daysAgo(110)),
    section('art-manuscript-low-resource-toolkit', 'Methodology', 'revision-requested', 2400, daysAgo(60)),
    section('art-manuscript-low-resource-toolkit', 'Results', 'revision-requested', 2800, daysAgo(60)),
    section('art-manuscript-low-resource-toolkit', 'Discussion', 'revision-submitted', 1700, daysAgo(30)),
    section('art-manuscript-low-resource-toolkit', 'Conclusion', 'draft', 800, daysAgo(20)),
  ],
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
  sourceTitle: 'Scholatia Journal of Open Research',
  createdAt: daysAgo(110),
  updatedAt: daysAgo(20),
};

MANUSCRIPT_ARTEFACT.wordCount = artefactWordCount(MANUSCRIPT_ARTEFACT);
THESIS_ARTEFACT.wordCount = artefactWordCount(THESIS_ARTEFACT);

export const ARTEFACTS: ScholarlyArtefact[] = [THESIS_ARTEFACT, MANUSCRIPT_ARTEFACT];
export const DEFAULT_ARTEFACT = MANUSCRIPT_ARTEFACT;
export const THESIS_ARTEFACT_DATA = THESIS_ARTEFACT;
export const CURRENT_WORKFLOW_USER_NAME = OJURI.displayName;

export type {
  ArtefactChapter,
  ArtefactSection,
  ScholarlyArtefact,
  Workbench,
  WorkbenchItem,
  WorkbenchVersion,
  WorkflowInstance,
  WorkflowMilestone,
  WorkflowStage,
  WorkflowTemplate,
  WorkflowTransition,
  WorkflowDeadline,
};
