import type {
  ContextElement,
  ContextPack,
  EpisodicMemory,
  EvidenceAssessment,
  KGEntity,
  KGRelation,
  KnowledgeGraph,
  LiteratureSummary,
  LongTermMemory,
  MemoryItem,
  ProvenanceRef,
  ResearchAnalytics,
  ResearchEntity,
  ResearcherRef,
  ResearchSession,
  SemanticMemory,
  SessionGoal,
  ShortTermMemory,
  WritingDraft,
} from '@/types/crie';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { researchEntityStatistics } from '@/lib/crie/research-intelligence';
import { createResearchEntity } from '@/lib/crie/research-intelligence';
import {
  createKGEntity,
  createKGRelation,
  createKnowledgeGraph,
  crieIdRef,
  graphStatistics,
} from '@/lib/crie/knowledge-graph';
import {
  assembleContext,
  contextElement,
  contextStatistics,
  createContextPack,
} from '@/lib/crie/context';
import {
  addSessionGoal,
  createSession,
  createSessionMessage,
  sessionGoal,
  sessionStatistics,
} from '@/lib/crie/session';
import {
  assessEvidence,
  claimStatistics,
  createClaim,
  createContradiction,
  createEvidenceRecord,
} from '@/lib/crie/evidence';
import {
  addCitationContext,
  citationStatistics,
  createCitation,
  createReference,
} from '@/lib/crie/citation';
import {
  assessGap,
  assessNovelty,
  createLiteratureSearch,
  createResearchGap,
  literatureStatistics,
  searchQuery,
  summarizeLiterature,
} from '@/lib/crie/literature';
import { analyticsIndicator, analyticsStatistics, researchAnalytics } from '@/lib/crie/analytics';
import { createRecommendation, recommendationStatistics } from '@/lib/crie/recommendations';
import { policyStatistics, recordAudit, recordConsent } from '@/lib/crie/policy';
import { createEthicsReview, decideEthics, ethicsStatistics, refuse } from '@/lib/crie/ethics';
import {
  createOrchestrationPlan,
  orchestrationStatistics,
  orchestrationTask,
} from '@/lib/crie/agent-coordinator';
import {
  createPublicationPlan,
  matchConference,
  matchJournal,
  publicationStatistics,
} from '@/lib/crie/publication';
import { createGrantOpportunity, createGrantProposal, grantStatistics } from '@/lib/crie/grant';
import { careerStatistics, createCareerGoal, deriveCareerSignal } from '@/lib/crie/career';
import { createLearnerState, learnerMastery, learnerStatistics, recommendLearning } from '@/lib/crie/learning';
import { createWritingDraft, writingStatistics } from '@/lib/crie/writing';
import { createSupervisionRecord, supervisionStatistics } from '@/lib/crie/supervision';
import { createGuidance, createMentoringSession, mentorshipStatistics } from '@/lib/crie/mentorship';
import { lifecycleStatistics } from '@/lib/crie/lifecycle';

/**
 * Placeholder data for the Cognitive Research Intelligence Environment (CRIE).
 *
 * Seed data for Mission 004-D (Waves 1 & 2): research entities with living
 * cognitive models, RKG seeds, context packs, sessions and workspaces, memory
 * items, claims and evidence, references and citations, literature gaps and
 * novelty, analytics, recommendations, governance, and integration contracts.
 *
 * CRIE owns no external records: researchers are canonical usernames,
 * institutions are canonical ids (e.g. `INST-UI-001`), and every derived value
 * is computed from the typed domain by the pure engines in `lib/crie/*`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-04T12:00:00.000Z');
const NOW_ISO = NOW.toISOString();

const byUsername = (username: string) => RESEARCHERS.find((r) => r.username === username);

const ref = (username: string): ResearcherRef => {
  const profile = byUsername(username);
  return { username, name: profile?.displayName };
};

const prov = (
  sourceId: string,
  sourceType = 'document',
  method: ProvenanceRef['method'] = 'human-curation',
): ProvenanceRef => ({
  sourceType,
  sourceId,
  assertedAt: NOW_ISO,
  method,
  version: 1,
});

// ---------------------------------------------------------------------------
// Research entities (root cognitive objects)
// ---------------------------------------------------------------------------

export const CRIE_ENTITIES: ResearchEntity[] = [
  createResearchEntity({
    kind: 'project',
    owner: ref('ojuri'),
    title: 'Academic Social Network and Collaborative Research',
    stage: 'methodology',
  }),
  createResearchEntity({
    kind: 'study',
    owner: ref('smith'),
    title: 'Federated Learning for Privacy-Preserving Scholarly Analytics',
    stage: 'analysis',
  }),
  createResearchEntity({
    kind: 'thesis',
    owner: ref('adebayo'),
    title: 'Digital Transformation of Higher Education in Africa',
    stage: 'literature',
  }),
  createResearchEntity({
    kind: 'paper',
    owner: ref('maria'),
    title: 'Knowledge Graphs for Research Intelligence',
    stage: 'publication',
  }),
  createResearchEntity({
    kind: 'grant-programme',
    owner: ref('tanaka'),
    title: 'Open Science Infrastructure for Research Ecosystems',
    stage: 'impact',
  }),
];

const OJURI_ENTITY = CRIE_ENTITIES[0];
const MARIA_ENTITY = CRIE_ENTITIES[3];

export const CRIE_RESEARCH_ENTITY_STATISTICS = researchEntityStatistics(CRIE_ENTITIES);
export const CRIE_LIFECYCLE_STATISTICS = lifecycleStatistics(CRIE_ENTITIES);

// ---------------------------------------------------------------------------
// Research Knowledge Graph seeds
// ---------------------------------------------------------------------------

export const CRIE_KG_ENTITIES: KGEntity[] = [
  createKGEntity({
    label: 'ojuri',
    entityClass: 'people',
    attributes: { institutionId: 'INST-UI-001' },
    provenance: prov('researcher-ojuri', 'system'),
  }),
  createKGEntity({
    label: 'university-of-ibadan',
    entityClass: 'organisations',
    attributes: { institutionId: 'INST-UI-001' },
    provenance: prov('institution-INST-UI-001', 'system'),
  }),
  createKGEntity({
    label: 'academic-social-network',
    entityClass: 'concepts',
    attributes: { researchEntityId: OJURI_ENTITY.id },
    provenance: prov(OJURI_ENTITY.id, 'system'),
  }),
  createKGEntity({
    label: 'collaborative-research',
    entityClass: 'concepts',
    provenance: prov(OJURI_ENTITY.id, 'system'),
  }),
  createKGEntity({
    label: 'crie-paper',
    entityClass: 'works',
    attributes: { researchEntityId: MARIA_ENTITY.id },
    provenance: prov(MARIA_ENTITY.id, 'system'),
  }),
  createKGEntity({
    label: 'knowledge-graphs',
    entityClass: 'concepts',
    provenance: prov(MARIA_ENTITY.id, 'system'),
  }),
];

export const CRIE_KG_RELATIONS: KGRelation[] = [
  createKGRelation({
    label: 'ojuri-affiliated-ui',
    subject: crieIdRef('kg-ojuri', 'people'),
    object: crieIdRef('kg-university-of-ibadan', 'organisations'),
    predicate: 'affiliated-with',
    strength: 0.95,
    confidenceValue: 0.9,
    provenance: prov('researcher-ojuri', 'system'),
  }),
  createKGRelation({
    label: 'ojuri-builds-asn',
    subject: crieIdRef('kg-ojuri', 'people'),
    object: crieIdRef('kg-academic-social-network', 'concepts'),
    predicate: 'builds-on',
    strength: 0.9,
    confidenceValue: 0.85,
    provenance: prov(OJURI_ENTITY.id, 'system'),
  }),
  createKGRelation({
    label: 'crie-cites-kg',
    subject: crieIdRef('kg-crie-paper', 'works'),
    object: crieIdRef('kg-knowledge-graphs', 'concepts'),
    predicate: 'references',
    strength: 0.8,
    confidenceValue: 0.8,
    provenance: prov(MARIA_ENTITY.id, 'system'),
  }),
];

export const CRIE_KNOWLEDGE_GRAPH: KnowledgeGraph = createKnowledgeGraph(
  'researcher',
  CURRENT_USER,
  CRIE_KG_ENTITIES,
  CRIE_KG_RELATIONS,
);

export const CRIE_GRAPH_STATISTICS = graphStatistics(CRIE_KNOWLEDGE_GRAPH);

// ---------------------------------------------------------------------------
// Context packs
// ---------------------------------------------------------------------------

export const CRIE_CONTEXT_ELEMENTS: ContextElement[] = [
  contextElement({
    label: 'current-stage',
    sourceType: 'crie-lifecycle',
    sourceId: OJURI_ENTITY.id,
    relevanceWeight: 0.9,
    content: `Research entity is in the ${OJURI_ENTITY.model.stage} stage.`,
    provenance: prov(OJURI_ENTITY.id, 'system'),
  }),
  contextElement({
    label: 'active-hypothesis',
    sourceType: 'crie-cognitive',
    sourceId: OJURI_ENTITY.id,
    relevanceWeight: 0.7,
    content: 'Hypothesis: scholarly collaboration increases research impact.',
    provenance: prov(OJURI_ENTITY.id, 'system'),
  }),
  contextElement({
    label: 'cited-work',
    sourceType: 'document',
    sourceId: 'doc-knowledge-graphs',
    relevanceWeight: 0.5,
    content: 'Knowledge graphs support research intelligence retrieval.',
    provenance: prov('crie-paper'),
  }),
];

export const CRIE_CONTEXT_PACKS: ContextPack[] = [
  assembleContext(
    createContextPack({
      label: 'ojuri-methodology',
      contextKind: 'micro',
      budgetLimit: 1,
      researchEntityId: OJURI_ENTITY.id,
    }),
    CRIE_CONTEXT_ELEMENTS,
  ),
  createContextPack({
    label: 'ojuri-meso',
    contextKind: 'meso',
    budgetLimit: 2,
    researchEntityId: OJURI_ENTITY.id,
    elements: [CRIE_CONTEXT_ELEMENTS[0], CRIE_CONTEXT_ELEMENTS[1]],
  }),
];

export const CRIE_CONTEXT_STATISTICS = contextStatistics(CRIE_CONTEXT_PACKS);

// ---------------------------------------------------------------------------
// Sessions, goals, and messages
// ---------------------------------------------------------------------------

const OJURI_SESSION: ResearchSession = createSession({
  label: 'ojuri-methodology-plan',
  researcher: ref(CURRENT_USER),
  workspaceId: 'workspace-ojuri',
});

export const CRIE_SESSION_GOALS: SessionGoal[] = [
  sessionGoal({ label: 'plan-methodology', sessionId: OJURI_SESSION.id, goalType: 'plan', statement: 'Plan the methodology section.' }),
  sessionGoal({ label: 'review-literature', sessionId: OJURI_SESSION.id, goalType: 'review', statement: 'Review the literature gaps.' }),
];

export const CRIE_SESSION: ResearchSession = CRIE_SESSION_GOALS.reduce(
  (session, goal) => addSessionGoal(session, goal),
  OJURI_SESSION,
);

export const CRIE_SESSION_MESSAGES = [
  createSessionMessage(CRIE_SESSION.id, 'researcher', 'Help me choose a study design.'),
  createSessionMessage(CRIE_SESSION.id, 'assistant', 'Given your aims, a mixed-methods design fits the literature gaps.'),
  createSessionMessage(CRIE_SESSION.id, 'agent', 'Gap assessment complete: 2 confirmed gaps.'),
];

export const CRIE_SESSION_STATISTICS = sessionStatistics([CRIE_SESSION]);

// ---------------------------------------------------------------------------
// Memory items (unified multi-scale memory)
// ---------------------------------------------------------------------------

export const CRIE_SHORT_TERM_MEMORY: ShortTermMemory = {
  id: 'mem-st-001',
  owner: ref(CURRENT_USER),
  memoryType: 'short-term',
  sessionId: CRIE_SESSION.id,
  content: 'Selected mixed-methods design for the collaboration study.',
  provenance: prov(CRIE_SESSION.id, 'system', 'inference'),
  accessPolicy: 'researcher',
  relevance: 0.9,
  createdAt: NOW_ISO,
  updatedAt: NOW_ISO,
  version: 1,
};

export const CRIE_EPISODIC_MEMORY: EpisodicMemory = {
  id: 'mem-ep-001',
  owner: ref(CURRENT_USER),
  memoryType: 'episodic',
  content: 'Researcher chose mixed-methods after reviewing the gap assessment.',
  provenance: prov(CRIE_SESSION.id, 'system'),
  accessPolicy: 'researcher',
  happenedAt: NOW_ISO,
  createdAt: NOW_ISO,
  updatedAt: NOW_ISO,
  version: 1,
};

export const CRIE_SEMANTIC_MEMORY: SemanticMemory = {
  id: 'mem-se-001',
  owner: ref(CURRENT_USER),
  memoryType: 'semantic',
  content: 'Mixed-methods designs fit multi-actor collaboration studies.',
  provenance: prov(CRIE_SESSION.id, 'system', 'inference'),
  accessPolicy: 'researcher',
  sourceMemoryItemIds: ['mem-ep-001'],
  relevance: 0.75,
  createdAt: NOW_ISO,
  updatedAt: NOW_ISO,
  version: 1,
};

export const CRIE_LONG_TERM_MEMORY: LongTermMemory = {
  id: 'mem-lt-001',
  owner: ref(CURRENT_USER),
  memoryType: 'long-term',
  content: 'Core research interests: scholarly networks, research intelligence.',
  provenance: prov('researcher-ojuri', 'system'),
  accessPolicy: 'researcher',
  relevance: 0.6,
  createdAt: NOW_ISO,
  updatedAt: NOW_ISO,
  version: 1,
};

export const CRIE_MEMORY_ITEMS: MemoryItem[] = [
  CRIE_SHORT_TERM_MEMORY,
  CRIE_EPISODIC_MEMORY,
  CRIE_SEMANTIC_MEMORY,
  CRIE_LONG_TERM_MEMORY,
];

// ---------------------------------------------------------------------------
// Claims and evidence
// ---------------------------------------------------------------------------

export const CRIE_CLAIM_1 = createClaim({
  label: 'collaboration-impact',
  claimType: 'empirical',
  statement: 'Collaboration increases citation impact.',
  confidenceValue: 0.6,
  documentChunkId: 'chunk-crie-paper',
});

export const CRIE_CLAIM_2 = createClaim({
  label: 'kg-intelligence',
  claimType: 'theoretical',
  statement: 'Knowledge graphs improve research intelligence retrieval.',
  confidenceValue: 0.7,
});

export const CRIE_EVIDENCE_1 = createEvidenceRecord({
  label: 'collaboration-study-2025',
  evidenceType: 'reference',
  summary: 'Study showing a positive collaboration-impact association.',
  provenance: prov('ref-collaboration-study', 'document', 'extraction'),
  confidenceValue: 0.65,
  researchEntityId: OJURI_ENTITY.id,
});

export const CRIE_EVIDENCE_2 = createEvidenceRecord({
  label: 'kg-benchmark-2025',
  evidenceType: 'experiment',
  summary: 'Benchmark of RKG retrieval over scholarly corpora.',
  provenance: prov('ref-kg-benchmark', 'document', 'extraction'),
  confidenceValue: 0.7,
  researchEntityId: MARIA_ENTITY.id,
});

export const CRIE_EVIDENCE_ASSESSMENTS: EvidenceAssessment[] = [
  assessEvidence(CRIE_CLAIM_1.id, CRIE_EVIDENCE_1.id, 'supports', 0.7),
  assessEvidence(CRIE_CLAIM_2.id, CRIE_EVIDENCE_2.id, 'supports', 0.8),
  assessEvidence(CRIE_CLAIM_2.id, CRIE_EVIDENCE_1.id, 'contradicts', 0.2),
];

export const CRIE_CONTRADICTION = createContradiction({
  label: 'kg-impact-debate',
  claimA: CRIE_CLAIM_2.id,
  claimB: CRIE_CLAIM_1.id,
  severity: 'minor',
});

export const CRIE_CLAIM_STATISTICS = claimStatistics([CRIE_CLAIM_1, CRIE_CLAIM_2], CRIE_EVIDENCE_ASSESSMENTS);

// ---------------------------------------------------------------------------
// References and citations
// ---------------------------------------------------------------------------

export const CRIE_REFERENCE_1 = createReference({
  label: 'collaboration-study',
  identifierKind: 'doi',
  identifier: '10.1000/xyz-collaboration',
  title: 'Collaboration and citation impact in scholarly networks',
  authors: ['Ojuri', 'Smith'],
  venue: 'Journal of Research Intelligence',
  year: 2025,
  confidenceValue: 0.9,
  provenance: prov('ref-collaboration-study', 'document', 'extraction'),
});

export const CRIE_REFERENCE_2 = createReference({
  label: 'kg-benchmark',
  identifierKind: 'doi',
  identifier: '10.1000/xyz-kg-benchmark',
  title: 'Benchmarking research knowledge graphs',
  authors: ['Maria'],
  venue: 'Knowledge Engineering Review',
  year: 2025,
  confidenceValue: 0.85,
  provenance: prov('ref-kg-benchmark', 'document', 'extraction'),
});

export const CRIE_CITATIONS = [
  createCitation({
    label: 'ojuri-cites-collab',
    citingDocumentId: 'doc-crie-paper',
    referenceId: CRIE_REFERENCE_1.id,
    citationStyle: 'apa',
    confidenceValue: 0.9,
    provenance: prov('doc-crie-paper', 'document', 'extraction'),
  }),
  createCitation({
    label: 'ojuri-cites-kg',
    citingDocumentId: 'doc-crie-paper',
    referenceId: CRIE_REFERENCE_2.id,
    citationStyle: 'apa',
    confidenceValue: 0.8,
    provenance: prov('doc-crie-paper', 'document', 'extraction'),
  }),
];

export const CRIE_CITATION_CONTEXTS = [
  addCitationContext({
    label: 'collab-support',
    citationId: CRIE_CITATIONS[0].id,
    chunkId: 'chunk-crie-paper',
    intent: 'support',
    quote: 'Collaboration increases citation impact.',
  }),
];

export const CRIE_CITATION_STATISTICS = citationStatistics(
  [CRIE_REFERENCE_1, CRIE_REFERENCE_2],
  CRIE_CITATIONS,
  CRIE_CITATION_CONTEXTS,
);

// ---------------------------------------------------------------------------
// Literature, gaps, and novelty
// ---------------------------------------------------------------------------

export const CRIE_LITERATURE_SEARCH = createLiteratureSearch({
  label: 'collaboration-impact',
  researcher: ref(CURRENT_USER),
  researchEntityId: OJURI_ENTITY.id,
  status: 'complete',
  queries: [
    searchQuery('collaboration AND citation impact', { year: { gte: 2020 } }),
    searchQuery('research knowledge graph retrieval', { type: 'benchmark' }),
  ],
});

export const CRIE_LITERATURE_SUMMARY: LiteratureSummary = summarizeLiterature({
  label: 'collaboration-impact-summary',
  literatureSearchId: CRIE_LITERATURE_SEARCH.id,
  summary: 'Strong evidence that collaboration raises citation impact.',
  coveredDocumentIds: ['doc-collaboration-study', 'doc-kg-benchmark'],
  confidenceValue: 0.7,
  provenance: [prov('crie-paper', 'system', 'inference')],
});

export const CRIE_RESEARCH_GAP = createResearchGap({
  label: 'africa-collaboration',
  gapType: 'geographical',
  statement: 'Few studies of collaboration impact in African research ecosystems.',
  researchEntityId: OJURI_ENTITY.id,
  status: 'confirmed',
});

export const CRIE_GAP_ASSESSMENT = assessGap({
  label: 'africa-collaboration',
  researchGapId: CRIE_RESEARCH_GAP.id,
  strength: 0.8,
  confidenceValue: 0.75,
  evidenceRecordIds: [CRIE_EVIDENCE_1.id],
});

export const CRIE_NOVELTY_ASSESSMENT = assessNovelty({
  label: 'crie-paper-novelty',
  researchEntityId: OJURI_ENTITY.id,
  documentId: 'doc-crie-paper',
  noveltyScore: 0.72,
  confidenceValue: 0.7,
  rationale: 'Novel application of knowledge graphs to research intelligence.',
});

export const CRIE_LITERATURE_STATISTICS = literatureStatistics(
  [CRIE_LITERATURE_SEARCH],
  [CRIE_RESEARCH_GAP],
  [CRIE_NOVELTY_ASSESSMENT],
);

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export const CRIE_RESEARCH_ANALYTICS: ResearchAnalytics = researchAnalytics({
  scope: 'researcher',
  scopeId: CURRENT_USER,
  indicators: [
    analyticsIndicator('publicationCount', 0.7, 1, 0.9),
    analyticsIndicator('citationCount', 0.6, 1, 0.8),
    analyticsIndicator('collaborationCount', 0.8, 1, 0.85),
    analyticsIndicator('timeInStage', 0.5, 1, 0.7),
  ],
});

export const CRIE_ANALYTICS_STATISTICS = analyticsStatistics([CRIE_RESEARCH_ANALYTICS]);

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

export const CRIE_RECOMMENDATION = createRecommendation({
  label: 'mixed-methods-design',
  owner: ref(CURRENT_USER),
  kind: 'recommendation',
  target: OJURI_ENTITY.id,
  summary: 'Adopt a mixed-methods design for the collaboration study.',
  explanation: {
    reasons: ['Two confirmed literature gaps.', 'Population spans institutions and roles.'],
    alternatives: ['Cross-sectional survey', 'Systematic review'],
    evidenceChainIds: [CRIE_EVIDENCE_1.id],
    tradeoffs: ['Longer fieldwork window.'],
  },
  confidenceValue: 0.75,
  status: 'proposed',
});

export const CRIE_RECOMMENDATION_STATISTICS = recommendationStatistics([CRIE_RECOMMENDATION]);

// ---------------------------------------------------------------------------
// Governance: consent, audit, ethics, refusals
// ---------------------------------------------------------------------------

export const CRIE_CONSENT_RECORD = recordConsent({
  label: 'ojuri-memory-consent',
  researcher: ref(CURRENT_USER),
  consentScope: 'memory',
  dataUse: ['session memory', 'context assembly'],
});

export const CRIE_AUDIT_RECORD = recordAudit({
  label: 'ojuri-context-assembled',
  actorType: 'system',
  actorId: 'E-07',
  eventType: 'create',
  payload: { contextPackIds: CRIE_CONTEXT_PACKS.map((pack) => pack.id) },
  researcher: ref(CURRENT_USER),
});

export const CRIE_ETHICS_REVIEW = createEthicsReview({
  label: 'collaboration-study-ethics',
  researchEntityId: OJURI_ENTITY.id,
  reviewKind: 'expedited',
});

export const CRIE_ETHICS_DECISION = decideEthics({
  label: 'collaboration-study-ethics',
  ethicsReviewId: CRIE_ETHICS_REVIEW.id,
  decision: 'conditionally-approve',
  rationale: 'No sensitive personal data; consent required for participant data.',
  conditions: ['Obtain informed consent from participants.'],
  decidedBy: ref('adebayo'),
});

export const CRIE_REFUSAL = refuse({
  label: 'export-restricted-data',
  researcher: ref(CURRENT_USER),
  refusalReason: 'consent',
  explanation: 'Data export refused: no consent scope for federation sharing.',
});

export const CRIE_ETHICS_STATISTICS = ethicsStatistics(
  [CRIE_ETHICS_REVIEW],
  [CRIE_ETHICS_DECISION],
  [CRIE_REFUSAL],
);

export const CRIE_POLICY_STATISTICS = policyStatistics([]);

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export const CRIE_ORCHESTRATION_PLAN = createOrchestrationPlan({
  owner: ref(CURRENT_USER),
  intent: 'Methodology planning pipeline',
  sessionId: CRIE_SESSION.id,
  budgets: { tokens: 12000, timeMin: 30 },
  tasks: [
    orchestrationTask({ step: 'Assess literature gaps', agentId: 'AG-16', status: 'done', priority: 'high' }, 0),
    orchestrationTask({ step: 'Recommend methodology', agentId: 'AG-18', requiresApproval: true, priority: 'high' }, 1),
    orchestrationTask({ step: 'Estimate statistical power', agentId: 'AG-20', priority: 'medium' }, 2),
  ],
});

export const CRIE_ORCHESTRATION_STATISTICS = orchestrationStatistics([CRIE_ORCHESTRATION_PLAN]);

// ---------------------------------------------------------------------------
// Publication, grants, career, learning, writing, supervision, mentorship
// ---------------------------------------------------------------------------

export const CRIE_PUBLICATION_PLAN = createPublicationPlan({
  label: 'crie-paper-journal',
  researchEntityId: OJURI_ENTITY.id,
  owner: ref(CURRENT_USER),
  targetType: 'journal',
  targets: ['Journal of Research Intelligence'],
  status: 'targeting',
});

export const CRIE_JOURNAL_MATCH = matchJournal({
  label: 'crie-jri-fit',
  publicationPlanId: CRIE_PUBLICATION_PLAN.id,
  journalProfileId: 'journal-profile-jri',
  fitScore: 0.82,
  rationale: 'Scope strongly overlaps research intelligence.',
  confidenceValue: 0.8,
});

export const CRIE_CONFERENCE_MATCH = matchConference({
  label: 'crie-rsc-fit',
  researchEntityId: OJURI_ENTITY.id,
  conferenceId: 'conference-rsc',
  fitScore: 0.7,
  rationale: 'Research computing conference with knowledge graph track.',
  provenance: prov('crie-paper', 'system', 'inference'),
  confidenceValue: 0.7,
});

export const CRIE_PUBLICATION_STATISTICS = publicationStatistics(
  [CRIE_PUBLICATION_PLAN],
  [],
  [CRIE_JOURNAL_MATCH],
  [CRIE_CONFERENCE_MATCH],
);

export const CRIE_GRANT_OPPORTUNITY = createGrantOpportunity({
  label: 'open-science-infrastructure',
  funder: 'Research Innovation Fund',
  title: 'Open Science Infrastructure for Research Ecosystems',
  description: 'Funding for open infrastructure supporting research ecosystems.',
  deadline: '2026-12-15T00:00:00.000Z',
  amount: 150000,
});

export const CRIE_GRANT_PROPOSAL = createGrantProposal({
  label: 'open-science-infrastructure',
  researchEntityId: OJURI_ENTITY.id,
  grantOpportunityId: CRIE_GRANT_OPPORTUNITY.id,
  lead: ref(CURRENT_USER),
  sections: ['Background', 'Methodology', 'Budget'],
});

export const CRIE_GRANT_STATISTICS = grantStatistics(
  [CRIE_GRANT_OPPORTUNITY],
  [CRIE_GRANT_PROPOSAL],
);

export const CRIE_CAREER_GOAL = createCareerGoal({
  label: 'professorship',
  researcher: ref(CURRENT_USER),
  statement: 'Attain a full professorship in research intelligence.',
  horizonMonths: 36,
  goalStatus: 'active',
});

export const CRIE_CAREER_SIGNAL = deriveCareerSignal({
  label: 'professorship-alignment',
  researcher: ref(CURRENT_USER),
  kind: 'alignment',
  statement: 'Publication and supervision portfolio aligns with the target.',
  confidenceValue: 0.8,
});

export const CRIE_CAREER_STATISTICS = careerStatistics(
  [CRIE_CAREER_GOAL],
  [],
  [CRIE_CAREER_SIGNAL],
);

export const CRIE_LEARNER_STATE = createLearnerState({
  label: 'ojuri-research-training',
  researcher: ref(CURRENT_USER),
  mastery: [
    learnerMastery('concept-knowledge-graphs', 0.85, 0.8, NOW_ISO),
    learnerMastery('concept-mixed-methods', 0.6, 0.7, NOW_ISO),
  ],
  misconceptions: ['confuses correlation with causation'],
  progress: 0.55,
  lifecycleStage: OJURI_ENTITY.model.stage,
});

export const CRIE_LEARNING_RECOMMENDATION = recommendLearning({
  label: 'mixed-methods-scaffold',
  researcher: ref(CURRENT_USER),
  recommendationKind: 'method-scaffold',
  rationale: 'Mastery of mixed methods is below target.',
  reasonEvidence: ['concept-mixed-methods'],
  learningObjectId: 'crs-research-methods',
  confidenceValue: 0.7,
});

export const CRIE_LEARNER_STATISTICS = learnerStatistics(
  [CRIE_LEARNER_STATE],
  [CRIE_LEARNING_RECOMMENDATION],
);

export const CRIE_WRITING_DRAFT: WritingDraft = createWritingDraft({
  label: 'methods-section',
  researchEntityId: OJURI_ENTITY.id,
  author: ref(CURRENT_USER),
  draftType: 'methods',
  title: 'Methods',
  content: 'We adopt a mixed-methods design to examine collaboration impact.',
  provenance: prov('doc-crie-paper', 'system', 'inference'),
  documentId: 'doc-crie-paper',
  citations: [CRIE_REFERENCE_1.id],
});

export const CRIE_WRITING_STATISTICS = writingStatistics([CRIE_WRITING_DRAFT]);

export const CRIE_SUPERVISION_RECORD = createSupervisionRecord({
  label: 'ojuri-supervision',
  supervisor: ref('adebayo'),
  researchEntityId: OJURI_ENTITY.id,
  startedAt: '2024-09-01T00:00:00.000Z',
  status: 'active',
  meetingsHeld: 12,
});

export const CRIE_SUPERVISION_STATISTICS = supervisionStatistics([CRIE_SUPERVISION_RECORD]);

export const CRIE_MENTORSHIP_GUIDANCE = createGuidance({
  label: 'ojuri-goal-setting',
  mentor: ref('tanaka'),
  mentee: ref(CURRENT_USER),
  guidanceKind: 'goal-setting',
  content: 'Set quarterly milestones toward the professorship goal.',
  rationale: 'Long-horizon goals benefit from quarterly checkpoints.',
});

export const CRIE_MENTORING_SESSION = createMentoringSession({
  label: 'ojuri-q3-2026',
  mentor: ref('tanaka'),
  mentee: ref(CURRENT_USER),
  heldAt: '2026-07-20T10:00:00.000Z',
  agenda: ['Publication pipeline', 'Grant strategy'],
  outcomes: ['Draft grant proposal by September.'],
  followUp: 'Review draft proposal next session.',
});

export const CRIE_MENTORSHIP_STATISTICS = mentorshipStatistics(
  [CRIE_MENTORSHIP_GUIDANCE],
  [CRIE_MENTORING_SESSION],
);
