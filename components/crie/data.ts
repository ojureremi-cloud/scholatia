import type {
  AgentId,
  DecisionCapability,
  LifecycleStageId,
  MemoryTypeId,
  OrchestrationPlan,
  OrchestrationTask,
  ReasoningParadigm,
  ReasoningTrace,
  ResearchEntity,
} from '@/types/crie';
import {
  CRIE_ANALYTICS_STATISTICS,
  CRIE_CAREER_GOAL,
  CRIE_CAREER_SIGNAL,
  CRIE_CAREER_STATISTICS,
  CRIE_CITATION_STATISTICS,
  CRIE_CLAIM_STATISTICS,
  CRIE_CONTEXT_STATISTICS,
  CRIE_ENTITIES,
  CRIE_ETHICS_REVIEW,
  CRIE_ETHICS_DECISION,
  CRIE_ETHICS_STATISTICS,
  CRIE_EVIDENCE_1,
  CRIE_GRAPH_STATISTICS,
  CRIE_KNOWLEDGE_GRAPH,
  CRIE_LEARNER_STATISTICS,
  CRIE_LIFECYCLE_STATISTICS,
  CRIE_LITERATURE_STATISTICS,
  CRIE_MEMORY_ITEMS,
  CRIE_MENTORSHIP_STATISTICS,
  CRIE_ORCHESTRATION_PLAN,
  CRIE_POLICY_STATISTICS,
  CRIE_PUBLICATION_STATISTICS,
  CRIE_RECOMMENDATION,
  CRIE_RECOMMENDATION_STATISTICS,
  CRIE_RESEARCH_ANALYTICS,
  CRIE_RESEARCH_ENTITY_STATISTICS,
  CRIE_SESSION,
  CRIE_SESSION_STATISTICS,
  CRIE_SUPERVISION_STATISTICS,
  CRIE_WRITING_STATISTICS,
} from '@/constants/placeholder-crie';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { analyticsIndicator, analyticsStatistics, researchAnalytics, rollup } from '@/lib/crie/analytics';
import { awaitingApproval, failedTasks, orchestrationStatistics, oversightView, runningTasks } from '@/lib/crie/agent-coordinator';
import { stageCoverage } from '@/lib/crie/lifecycle';
import { memoryStatistics, recallByType } from '@/lib/crie/memory';
import { checkPolicy, policyStatistics, DEFAULT_CRIE_POLICIES } from '@/lib/crie/policy';
import { createReasoningTrace, reasoningStatistics, reasoningStep, reasoningTraceId } from '@/lib/crie/reasoning';
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
import { deriveEntityTrust, deriveRelationTrust, trustStatistics } from '@/lib/crie/trust';
import { createEnterpriseCognitiveModel, createInstitutionalAsset, institutionStatistics } from '@/lib/crie/institution';
import {
  createFederationContract,
  createGovernedExchange,
  createMemberSovereignty,
  federationStatistics,
} from '@/lib/crie/federation';
import { searchGraph, searchStatistics } from '@/lib/crie/search';
import { confidence } from '@/lib/crie/utils';
import { agentLabel } from './format';

const CURRENT_USERNAME = 'ojuri';

const currentUserRef = () => {
  const profile = RESEARCHERS.find((researcher) => researcher.username === CURRENT_USERNAME);
  return { username: CURRENT_USERNAME, name: profile?.displayName };
};

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

export function crieOverviewModel() {
  const ownEntities = CRIE_ENTITIES.filter((entity) => entity.owner.username === CURRENT_USERNAME);
  const activeEntities = ownEntities.filter((entity) => {
    const index = ['idea', 'problem', 'objectives', 'questions', 'hypotheses', 'literature', 'framework', 'methodology', 'instrument', 'analysis', 'interpretation', 'publication'].indexOf(entity.model.stage);
    return index < 11;
  });
  return {
    researcher: currentUserRef(),
    entities: CRIE_ENTITIES,
    ownEntities,
    activeEntities,
    entityStatistics: CRIE_RESEARCH_ENTITY_STATISTICS,
    lifecycleStatistics: CRIE_LIFECYCLE_STATISTICS,
    sessionStatistics: CRIE_SESSION_STATISTICS,
    contextStatistics: CRIE_CONTEXT_STATISTICS,
    graphStatistics: CRIE_GRAPH_STATISTICS,
    memoryStatistics: memoryStatistics(CRIE_MEMORY_ITEMS),
    analyticsStatistics: CRIE_ANALYTICS_STATISTICS,
    recommendationStatistics: CRIE_RECOMMENDATION_STATISTICS,
  };
}

// ---------------------------------------------------------------------------
// Research workspace
// ---------------------------------------------------------------------------

export function crieWorkspaceModel() {
  const current = CRIE_ENTITIES.find((entity) => entity.owner.username === CURRENT_USERNAME) ?? CRIE_ENTITIES[0];
  const otherEntities = CRIE_ENTITIES.filter((entity) => entity.id !== current.id);
  return {
    current,
    otherEntities,
    session: CRIE_SESSION,
    recommendations: [CRIE_RECOMMENDATION],
    recommendationStatistics: CRIE_RECOMMENDATION_STATISTICS,
  };
}

export function entityStageProgress(entity: ResearchEntity): number {
  return stageCoverage(entity.model.statusVector);
}

// ---------------------------------------------------------------------------
// Reasoning
// ---------------------------------------------------------------------------

export function crieReasoningModel() {
  const entity = CRIE_ENTITIES.find((candidate) => candidate.owner.username === CURRENT_USERNAME) ?? CRIE_ENTITIES[0];
  const traces: ReasoningTrace[] = [
    {
      ...createReasoningTrace({
        researchEntityId: entity.id,
        sessionId: CRIE_SESSION.id,
        paradigm: 'educational',
        steps: [
          reasoningStep(1, 'premise', 'Two literature gaps are confirmed for this entity.'),
          reasoningStep(2, 'evidence-lookup', 'Gap assessment binds to evidence records.', [CRIE_EVIDENCE_1.id]),
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
          reasoningStep(2, 'evidence-lookup', 'Reference evidence supports the claim.', [CRIE_EVIDENCE_1.id]),
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
    claimStatistics: CRIE_CLAIM_STATISTICS,
    recommendation: CRIE_RECOMMENDATION,
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

export function crieGraphModel() {
  return {
    graph: CRIE_KNOWLEDGE_GRAPH,
    statistics: CRIE_GRAPH_STATISTICS,
  };
}

// ---------------------------------------------------------------------------
// Memory
// ---------------------------------------------------------------------------

export function crieMemoryModel() {
  return {
    items: CRIE_MEMORY_ITEMS,
    statistics: memoryStatistics(CRIE_MEMORY_ITEMS),
  };
}

export function memoryByType(type: MemoryTypeId) {
  return recallByType(CRIE_MEMORY_ITEMS, type);
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

export function crieAgentsModel() {
  const plan = CRIE_ORCHESTRATION_PLAN;
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

export function crieAnalyticsModel() {
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
  const global = rollup([CRIE_RESEARCH_ANALYTICS, institution, enterprise], 'global', 'ecosystem');
  return {
    researcher: CRIE_RESEARCH_ANALYTICS,
    institution,
    enterprise,
    global,
    researcherStats: analyticsStatistics([CRIE_RESEARCH_ANALYTICS]),
    institutionStats: analyticsStatistics([institution]),
    enterpriseStats: analyticsStatistics([enterprise]),
    globalStats: analyticsStatistics([global]),
  };
}

export function crieProductivityModel() {
  return {
    lifecycleStatistics: CRIE_LIFECYCLE_STATISTICS,
    writingStatistics: CRIE_WRITING_STATISTICS,
    learnerStatistics: CRIE_LEARNER_STATISTICS,
    publicationStatistics: CRIE_PUBLICATION_STATISTICS,
  };
}

export function crieImpactModel() {
  return {
    analytics: CRIE_RESEARCH_ANALYTICS,
    citationStatistics: CRIE_CITATION_STATISTICS,
    literatureStatistics: CRIE_LITERATURE_STATISTICS,
    careerStatistics: CRIE_CAREER_STATISTICS,
  };
}

export function crieCollaborationModel() {
  return {
    careerGoal: CRIE_CAREER_GOAL,
    careerSignal: CRIE_CAREER_SIGNAL,
    supervisionStatistics: CRIE_SUPERVISION_STATISTICS,
    mentorshipStatistics: CRIE_MENTORSHIP_STATISTICS,
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

export function crieTrustModel() {
  const entityScores = CRIE_KNOWLEDGE_GRAPH.entities.map((entity) => deriveEntityTrust(entity));
  const relationScores = CRIE_KNOWLEDGE_GRAPH.relations.map((relation) => deriveRelationTrust(relation));
  const scores = [...entityScores, ...relationScores];
  return {
    entityScores,
    relationScores,
    scores,
    statistics: trustStatistics(scores),
  };
}

export function crieInstitutionModel() {
  const model = createEnterpriseCognitiveModel({
    label: 'ui-enterprise',
    institutionId: 'INST-UI-001',
    strategicGoals: ['Strengthen research intelligence', 'Grow open science infrastructure'],
    strengthAreas: ['Collaborative research', 'Research computing'],
    researchEntityIds: CRIE_ENTITIES.map((entity) => entity.id),
  });
  const assets = [
    createInstitutionalAsset({
      label: 'ui-dataset-catalogue',
      institutionId: 'INST-UI-001',
      assetKind: 'dataset',
      title: 'Research dataset catalogue',
      accessClass: 'public',
      consentScope: ['research-analytics'],
      curator: 'ojuri',
    }),
    createInstitutionalAsset({
      label: 'ui-methods-curriculum',
      institutionId: 'INST-UI-001',
      assetKind: 'curriculum',
      title: 'Graduate research methods curriculum',
      accessClass: 'institution',
      consentScope: ['learning-signals'],
      curator: 'adebayo',
    }),
    createInstitutionalAsset({
      label: 'ui-institutional-repository',
      institutionId: 'INST-UI-001',
      assetKind: 'repository',
      title: 'Institutional repository',
      accessClass: 'public',
      consentScope: ['federation'],
      curator: 'library',
    }),
  ];
  return {
    model,
    assets,
    statistics: institutionStatistics([model], assets),
  };
}

export function crieFederationModel() {
  const contracts = [
    createFederationContract({
      label: 'ui-lagos-agreement',
      institutionId: 'INST-UI-001',
      memberInstitutionId: 'INST-UNILAG-002',
      contractType: 'aggregate-analytics',
      dataScope: ['Aggregate publication analytics'],
      consentScope: ['federation'],
      sovereigntyClauses: ['No raw researcher data', 'Opt-in only', 'Aggregate results only'],
      status: 'active',
    }),
    createFederationContract({
      label: 'ui-knust-agreement',
      institutionId: 'INST-UI-001',
      memberInstitutionId: 'INST-KNUST-003',
      contractType: 'knowledge-exchange',
      dataScope: ['Public knowledge graph entities'],
      consentScope: ['federation'],
      sovereigntyClauses: ['Public entities only', 'Per-item consent'],
      status: 'negotiating',
    }),
  ];
  const exchanges = [
    createGovernedExchange({
      label: 'ui-agg-2026-q3',
      federationContractId: contracts[0].id,
      exchangeType: 'aggregate',
      payloadRef: 'analytics-rollup-2026-q3',
      consentScope: ['federation'],
      confidenceValue: 0.8,
    }),
    createGovernedExchange({
      label: 'ui-kg-signal-2026-08',
      federationContractId: contracts[0].id,
      exchangeType: 'signal',
      payloadRef: 'graph-signal-2026-08',
      consentScope: ['federation'],
      confidenceValue: 0.7,
    }),
  ];
  const sovereignty = createMemberSovereignty({
    label: 'ui-sovereignty',
    institutionId: 'INST-UI-001',
    governingContractIds: contracts.map((contract) => contract.id),
    reservedRights: ['Revoke consent at any time', 'Withdraw from any exchange'],
    sharedSignals: ['Aggregate analytics', 'Public graph entities'],
    neverShared: ['Private memory', 'Raw researcher data'],
  });
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

export function crieSearchModel(query: string) {
  const results = searchGraph(CRIE_KNOWLEDGE_GRAPH, query);
  return {
    results,
    statistics: searchStatistics([results]),
  };
}

export function crieSettingsModel() {
  return {
    ethicsReview: CRIE_ETHICS_REVIEW,
    ethicsDecision: CRIE_ETHICS_DECISION,
    ethicsStatistics: CRIE_ETHICS_STATISTICS,
    policyStatistics: CRIE_POLICY_STATISTICS,
    consentScopes: ['research-analytics', 'learning-signals', 'memory', 'context', 'digital-twin', 'federation', 'career', 'publication-assist', 'grant-assist'] as const,
  };
}

export type CRIEDecisionCapability = DecisionCapability;
export type CRIELifecycleStageId = LifecycleStageId;
export type CRIEReasoningParadigm = ReasoningParadigm;
export type CRIEAgentView = { id: AgentId; label: string; task?: OrchestrationTask };
