import type {
  AgentId,
  CareerGoal,
  CareerSignal,
  Citation,
  CitationContext,
  Claim,
  ContextPack,
  DecisionCapability,
  EnterpriseCognitiveModel,
  EthicsDecision,
  EthicsReview,
  FederationContract,
  GovernedExchange,
  InstitutionalKnowledgeAsset,
  KnowledgeGraph,
  LearnerState,
  LifecycleStageId,
  LiteratureSearch,
  MemberSovereignty,
  MemoryItem,
  MemoryTypeId,
  MentorshipGuidance,
  NoveltyAssessment,
  OrchestrationPlan,
  OrchestrationTask,
  PublicationPlan,
  ReasoningParadigm,
  ReasoningTrace,
  Recommendation,
  Reference,
  ResearchAnalytics,
  ResearchEntity,
  ResearchGap,
  ResearchSession,
  SupervisionRecord,
  WritingDraft,
} from '@/types/crie';
import type { PolicyStatistics } from '@/lib/crie/policy';
import { analyticsIndicator, analyticsStatistics, researchAnalytics, rollup } from '@/lib/crie/analytics';
import { awaitingApproval, failedTasks, orchestrationStatistics, oversightView, runningTasks } from '@/lib/crie/agent-coordinator';
import { careerStatistics } from '@/lib/crie/career';
import { citationStatistics } from '@/lib/crie/citation';
import { contextStatistics } from '@/lib/crie/context';
import { claimStatistics } from '@/lib/crie/evidence';
import { ethicsStatistics } from '@/lib/crie/ethics';
import { federationStatistics } from '@/lib/crie/federation';
import { institutionStatistics } from '@/lib/crie/institution';
import { graphStatistics } from '@/lib/crie/knowledge-graph';
import { learnerStatistics } from '@/lib/crie/learning';
import { lifecycleStatistics, stageCoverage } from '@/lib/crie/lifecycle';
import { literatureStatistics } from '@/lib/crie/literature';
import { memoryStatistics, recallByType } from '@/lib/crie/memory';
import { mentorshipStatistics } from '@/lib/crie/mentorship';
import { checkPolicy, policyStatistics, DEFAULT_CRIE_POLICIES } from '@/lib/crie/policy';
import { publicationStatistics } from '@/lib/crie/publication';
import { createReasoningTrace, reasoningStatistics, reasoningStep, reasoningTraceId } from '@/lib/crie/reasoning';
import { recommendationStatistics } from '@/lib/crie/recommendations';
import { researchEntityStatistics } from '@/lib/crie/research-intelligence';
import { sessionStatistics } from '@/lib/crie/session';
import { supervisionStatistics } from '@/lib/crie/supervision';
import { deriveEntityTrust, deriveRelationTrust, trustStatistics } from '@/lib/crie/trust';
import { writingStatistics } from '@/lib/crie/writing';
import {
  addOption,
  bestOption,
  decisionOption,
  decisionStatistics,
  evaluateDecision,
  finalizeDecision,
  frameDecision,
  rankOptions,
  recordDecision,
} from '@/lib/crie/decision';
import { searchGraph, searchStatistics } from '@/lib/crie/search';
import { confidence } from '@/lib/crie/utils';
import { agentLabel } from './format';

const CURRENT_USERNAME = 'ojuri';

const currentUserRef = () => ({ username: CURRENT_USERNAME });

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

export type CRIEOverviewInputs = {
  entities: readonly ResearchEntity[];
  graph: KnowledgeGraph;
  memoryItems: readonly MemoryItem[];
  contextPacks: readonly ContextPack[];
  analyticsRecords: readonly ResearchAnalytics[];
  sessions: readonly ResearchSession[];
  recommendations: readonly Recommendation[];
};

export function crieOverviewModel(inputs: CRIEOverviewInputs) {
  const { entities, graph, memoryItems, contextPacks, analyticsRecords, sessions, recommendations } = inputs;
  const ownEntities = entities.filter((entity) => entity.owner.username === CURRENT_USERNAME);
  const activeEntities = ownEntities.filter((entity) => {
    const index = ['idea', 'problem', 'objectives', 'questions', 'hypotheses', 'literature', 'framework', 'methodology', 'instrument', 'analysis', 'interpretation', 'publication'].indexOf(entity.model.stage);
    return index < 11;
  });
  return {
    researcher: currentUserRef(),
    entities,
    ownEntities,
    activeEntities,
    entityStatistics: researchEntityStatistics(entities),
    lifecycleStatistics: lifecycleStatistics(entities),
    sessionStatistics: sessionStatistics(sessions),
    contextStatistics: contextStatistics(contextPacks),
    graphStatistics: graphStatistics(graph),
    memoryStatistics: memoryStatistics(memoryItems),
    analyticsStatistics: analyticsStatistics(analyticsRecords),
    recommendationStatistics: recommendationStatistics(recommendations),
  };
}

// ---------------------------------------------------------------------------
// Research workspace
// ---------------------------------------------------------------------------

export type CRIEWorkspaceInputs = {
  entities: readonly ResearchEntity[];
  session: ResearchSession;
  recommendation?: Recommendation;
};

export function crieWorkspaceModel(inputs: CRIEWorkspaceInputs) {
  const { entities, session, recommendation } = inputs;
  const current = entities.find((entity) => entity.owner.username === CURRENT_USERNAME) ?? entities[0];
  const otherEntities = entities.filter((entity) => entity.id !== current.id);
  const recommendations = recommendation ? [recommendation] : [];
  return {
    current,
    otherEntities,
    session,
    recommendations,
    recommendationStatistics: recommendationStatistics(recommendations),
  };
}

export function entityStageProgress(entity: ResearchEntity): number {
  return stageCoverage(entity.model.statusVector);
}

// ---------------------------------------------------------------------------
// Reasoning
// ---------------------------------------------------------------------------

export type CRIEReasoningInputs = {
  entity: ResearchEntity;
  session: ResearchSession;
  evidenceRecords: readonly { id: string }[];
  recommendation?: Recommendation;
  claims: readonly Claim[];
};

export function crieReasoningModel(inputs: CRIEReasoningInputs) {
  const { entity, session, evidenceRecords, recommendation, claims } = inputs;
  const firstEvidence = evidenceRecords[0];
  const traces: ReasoningTrace[] = [
    {
      ...createReasoningTrace({
        researchEntityId: entity.id,
        sessionId: session.id,
        paradigm: 'educational',
        steps: [
          reasoningStep(1, 'premise', 'Two literature gaps are confirmed for this entity.'),
          reasoningStep(2, 'evidence-lookup', 'Gap assessment binds to evidence records.', firstEvidence ? [firstEvidence.id] : []),
          reasoningStep(3, 'inference', 'A mixed-methods design addresses both gaps.'),
          reasoningStep(4, 'validation', 'Novelty assessment confirms the framing.'),
        ],
        conclusion: {
          id: 'conclusion-mixed-methods',
          statement: 'Adopt a mixed-methods design for the collaboration study.',
          confidence: confidence(0.75),
        },
        confidenceValue: 0.75,
      }),
      id: reasoningTraceId(`${entity.id}-educational`),
    },
    {
      ...createReasoningTrace({
        researchEntityId: entity.id,
        paradigm: 'research',
        steps: [
          reasoningStep(1, 'premise', 'Claim: collaboration increases citation impact.'),
          reasoningStep(2, 'evidence-lookup', 'Reference evidence supports the claim.', firstEvidence ? [firstEvidence.id] : []),
          reasoningStep(3, 'validation', 'Contradiction severity is minor; not refuted.'),
        ],
        conclusion: {
          id: 'conclusion-claim-supported',
          statement: 'The collaboration-impact claim is supported by current evidence.',
          confidence: confidence(0.65),
        },
        confidenceValue: 0.65,
      }),
      id: reasoningTraceId(`${entity.id}-research`),
    },
  ];
  return {
    traces,
    statistics: reasoningStatistics(traces),
    claimStatistics: claimStatistics(claims),
    recommendation,
  };
}

export function crieDecisionModel() {
  const authority = currentUserRef();
  const framed = frameDecision({
    label: 'study-design',
    authority,
    frame: 'Choose a study design for the collaboration study',
    objectives: ['Address confirmed gaps', 'Span institutions and roles'],
    constraints: ['Researcher-led', 'Within fieldwork window'],
  });
  const mixedMethods = decisionOption({
    label: 'mixed-methods',
    description: 'Mixed-methods design combining survey and qualitative interviews.',
    tradeoffs: ['Longer fieldwork window'],
  });
  const survey = decisionOption({
    label: 'cross-sectional-survey',
    description: 'Cross-sectional survey of collaboration patterns.',
    tradeoffs: ['Limited depth on motivation'],
  });
  const withOptions = addOption(addOption(framed, mixedMethods), survey);
  const evaluated = evaluateDecision(withOptions, {
    [mixedMethods.id]: 0.85,
    [survey.id]: 0.6,
  });
  const record = recordDecision(evaluated, mixedMethods.id, 'Highest objective coverage and gap fit.', [
    'Improved gap coverage',
    'Multi-role dataset',
  ]);
  const finalized = finalizeDecision(evaluated, record);
  return {
    decision: finalized,
    options: rankOptions(finalized),
    best: bestOption(finalized),
    statistics: decisionStatistics([finalized]),
  };
}

// ---------------------------------------------------------------------------
// Knowledge graph
// ---------------------------------------------------------------------------

export function crieGraphModel(graph: KnowledgeGraph) {
  return {
    graph,
    statistics: graphStatistics(graph),
  };
}

// ---------------------------------------------------------------------------
// Memory
// ---------------------------------------------------------------------------

export function crieMemoryModel(items: readonly MemoryItem[]) {
  return {
    items,
    statistics: memoryStatistics(items),
  };
}

export function memoryByType(items: readonly MemoryItem[], type: MemoryTypeId) {
  return recallByType(items, type);
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

export function crieAgentsModel(plan: OrchestrationPlan) {
  const agentIds = [
    ...new Set(plan.tasks.map((task) => task.agentId).filter((id): id is AgentId => Boolean(id))),
  ];
  const agents: CRIEAgentView[] = agentIds.map((agentId) => ({
    id: agentId,
    label: agentLabel(agentId),
    task: plan.tasks.find((task) => task.agentId === agentId),
  }));
  return {
    plan,
    agents,
    statistics: orchestrationStatistics([plan]),
    oversight: oversightView(plan, []),
    awaitingApproval: awaitingApproval(plan),
    running: runningTasks(plan),
    failed: failedTasks(plan),
  };
}

export function crieAgentModel(plan: OrchestrationPlan, agentId: string) {
  const id = agentId as AgentId;
  const tasks = plan.tasks.filter((task) => task.agentId === id);
  return {
    agent: { id, label: agentLabel(id) } as CRIEAgentView,
    tasks,
    plan,
  };
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export type CRIEAnalyticsInputs = {
  researcher: ResearchAnalytics;
};

export function crieAnalyticsModel(inputs: CRIEAnalyticsInputs) {
  const { researcher } = inputs;
  const institution = researchAnalytics({
    scope: 'institution',
    scopeId: 'INST-UI-001',
    indicators: [
      analyticsIndicator('publicationCount', 0.72, 1, 0.9),
      analyticsIndicator('openAccessRate', 0.64, 1, 0.85),
      analyticsIndicator('grantSuccessRate', 0.55, 1, 0.8),
      analyticsIndicator('collaborationCount', 0.6, 1, 0.8),
    ],
  });
  const enterprise = researchAnalytics({
    scope: 'enterprise',
    scopeId: 'ecosystem-africa',
    indicators: [
      analyticsIndicator('publicationCount', 0.58, 1, 0.8),
      analyticsIndicator('citationCount', 0.51, 1, 0.8),
      analyticsIndicator('openAccessRate', 0.6, 1, 0.8),
    ],
  });
  const global = rollup([researcher, institution, enterprise], 'global', 'ecosystem');
  return {
    researcher,
    institution,
    enterprise,
    global,
    researcherStats: analyticsStatistics([researcher]),
    institutionStats: analyticsStatistics([institution]),
    enterpriseStats: analyticsStatistics([enterprise]),
    globalStats: analyticsStatistics([global]),
  };
}

export type CRIEProductivityInputs = {
  entities: readonly ResearchEntity[];
  writingDrafts: readonly WritingDraft[];
  learnerStates: readonly LearnerState[];
  publicationPlans: readonly PublicationPlan[];
};

export function crieProductivityModel(inputs: CRIEProductivityInputs) {
  const { entities, writingDrafts, learnerStates, publicationPlans } = inputs;
  return {
    lifecycleStatistics: lifecycleStatistics(entities),
    writingStatistics: writingStatistics(writingDrafts),
    learnerStatistics: learnerStatistics(learnerStates),
    publicationStatistics: publicationStatistics(publicationPlans),
  };
}

export type CRIEImpactInputs = {
  analytics: ResearchAnalytics;
  references: readonly Reference[];
  citations: readonly Citation[];
  citationContexts: readonly CitationContext[];
  literatureSearches: readonly LiteratureSearch[];
  researchGaps: readonly ResearchGap[];
  noveltyAssessments: readonly NoveltyAssessment[];
  careerGoals: readonly CareerGoal[];
  careerSignals: readonly CareerSignal[];
};

export function crieImpactModel(inputs: CRIEImpactInputs) {
  const { analytics, references, citations, citationContexts, literatureSearches, researchGaps, noveltyAssessments, careerGoals, careerSignals } = inputs;
  return {
    analytics,
    citationStatistics: citationStatistics(references, citations, citationContexts),
    literatureStatistics: literatureStatistics(literatureSearches, researchGaps, noveltyAssessments),
    careerStatistics: careerStatistics(careerGoals, [], careerSignals),
  };
}

export type CRIECollaborationInputs = {
  careerGoal: CareerGoal;
  careerSignal: CareerSignal;
  supervisionRecords: readonly SupervisionRecord[];
  mentorshipGuidance: readonly MentorshipGuidance[];
};

export function crieCollaborationModel(inputs: CRIECollaborationInputs) {
  const { careerGoal, careerSignal, supervisionRecords, mentorshipGuidance } = inputs;
  return {
    careerGoal,
    careerSignal,
    supervisionStatistics: supervisionStatistics(supervisionRecords),
    mentorshipStatistics: mentorshipStatistics(mentorshipGuidance),
  };
}

// ---------------------------------------------------------------------------
// Administration
// ---------------------------------------------------------------------------

export function criePolicyModel() {
  const verdicts = DEFAULT_CRIE_POLICIES.map((rule) => checkPolicy(rule, 'researcher'));
  return {
    rules: DEFAULT_CRIE_POLICIES,
    verdicts,
    statistics: policyStatistics(DEFAULT_CRIE_POLICIES, verdicts),
  };
}

export function crieTrustModel(graph: KnowledgeGraph) {
  const entityScores = graph.entities.map((entity) => deriveEntityTrust(entity));
  const relationScores = graph.relations.map((relation) => deriveRelationTrust(relation));
  const scores = [...entityScores, ...relationScores];
  return {
    entityScores,
    relationScores,
    scores,
    statistics: trustStatistics(scores),
  };
}

export type CRIEInstitutionInputs = {
  entities: readonly ResearchEntity[];
  enterprise: EnterpriseCognitiveModel;
  assets: readonly InstitutionalKnowledgeAsset[];
};

export function crieInstitutionModel(inputs: CRIEInstitutionInputs) {
  const { entities, enterprise, assets } = inputs;
  const model: EnterpriseCognitiveModel = {
    ...enterprise,
    researchEntityIds: entities.map((entity) => entity.id),
  };
  return {
    model,
    assets,
    statistics: institutionStatistics([model], assets),
  };
}

export type CRIEFederationInputs = {
  contracts: readonly FederationContract[];
  exchanges: readonly GovernedExchange[];
  sovereignty: MemberSovereignty;
};

export function crieFederationModel(inputs: CRIEFederationInputs) {
  const { contracts, exchanges, sovereignty } = inputs;
  return {
    contracts,
    exchanges,
    sovereignty,
    statistics: federationStatistics(contracts, exchanges),
  };
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export function crieSearchModel(graph: KnowledgeGraph, query: string) {
  const results = searchGraph(graph, query);
  return {
    results,
    statistics: searchStatistics([results]),
  };
}

export type CRIESettingsInputs = {
  ethicsReview: EthicsReview;
  ethicsDecision: EthicsDecision;
  policyStatistics: PolicyStatistics;
};

export function crieSettingsModel(inputs: CRIESettingsInputs) {
  const { ethicsReview, ethicsDecision, policyStatistics } = inputs;
  return {
    ethicsReview,
    ethicsDecision,
    ethicsStatistics: ethicsStatistics([ethicsReview], [ethicsDecision]),
    policyStatistics,
    consentScopes: ['research-analytics', 'learning-signals', 'memory', 'context', 'digital-twin', 'federation', 'career', 'publication-assist', 'grant-assist'] as const,
  };
}

export type CRIEDecisionCapability = DecisionCapability;
export type CRIELifecycleStageId = LifecycleStageId;
export type CRIEReasoningParadigm = ReasoningParadigm;
export type CRIEAgentView = { id: AgentId; label: string; task?: OrchestrationTask };
