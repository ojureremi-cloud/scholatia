/**
 * CRIE agent & orchestration types (fspec §2.14, §4.6).
 *
 * The Agent Catalogue (AG-01…AG-36, CRIE Ch. 43) and Autonomous Research
 * Agents (ARA-01…ARA-12, CRIE Ch. 62) are bounded-autonomy actors with
 * machine- and human-readable charters. Every agent declares an autonomy
 * envelope (L1–L5); L5-autonomous is disabled by default (CRIE §62.6).
 */
import type {
  Auditable,
  ProvenanceRef,
  ResearcherRef,
} from './base';
import type { MemoryAccess } from './memory';

/** Autonomy levels (CRIE §62.6). */
export type AutonomyLevel =
  | 'L1-assist'
  | 'L2-advise'
  | 'L3-execute-checkpoint'
  | 'L4-execute-bounded'
  | 'L5-autonomous';

export const AUTONOMY_LEVELS: readonly AutonomyLevel[] = [
  'L1-assist',
  'L2-advise',
  'L3-execute-checkpoint',
  'L4-execute-bounded',
  'L5-autonomous',
];

export const CRIE_AUTONOMY_LEVEL_LABELS: Record<AutonomyLevel, string> = {
  'L1-assist': 'Assist',
  'L2-advise': 'Advise',
  'L3-execute-checkpoint': 'Execute with checkpoint',
  'L4-execute-bounded': 'Execute bounded',
  'L5-autonomous': 'Autonomous (disabled by default)',
};

/** Agent identifiers — AG-01…AG-36 (Ch. 43) and ARA-01…ARA-12 (Ch. 62). */
export type AgentId =
  | 'AG-01'
  | 'AG-02'
  | 'AG-03'
  | 'AG-04'
  | 'AG-05'
  | 'AG-06'
  | 'AG-07'
  | 'AG-08'
  | 'AG-09'
  | 'AG-10'
  | 'AG-11'
  | 'AG-12'
  | 'AG-13'
  | 'AG-14'
  | 'AG-15'
  | 'AG-16'
  | 'AG-17'
  | 'AG-18'
  | 'AG-19'
  | 'AG-20'
  | 'AG-21'
  | 'AG-22'
  | 'AG-23'
  | 'AG-24'
  | 'AG-25'
  | 'AG-26'
  | 'AG-27'
  | 'AG-28'
  | 'AG-29'
  | 'AG-30'
  | 'AG-31'
  | 'AG-32'
  | 'AG-33'
  | 'AG-34'
  | 'AG-35'
  | 'AG-36'
  | 'ARA-01'
  | 'ARA-02'
  | 'ARA-03'
  | 'ARA-04'
  | 'ARA-05'
  | 'ARA-06'
  | 'ARA-07'
  | 'ARA-08'
  | 'ARA-09'
  | 'ARA-10'
  | 'ARA-11'
  | 'ARA-12';

export const AGENT_IDS: readonly AgentId[] = [
  'AG-01',
  'AG-02',
  'AG-03',
  'AG-04',
  'AG-05',
  'AG-06',
  'AG-07',
  'AG-08',
  'AG-09',
  'AG-10',
  'AG-11',
  'AG-12',
  'AG-13',
  'AG-14',
  'AG-15',
  'AG-16',
  'AG-17',
  'AG-18',
  'AG-19',
  'AG-20',
  'AG-21',
  'AG-22',
  'AG-23',
  'AG-24',
  'AG-25',
  'AG-26',
  'AG-27',
  'AG-28',
  'AG-29',
  'AG-30',
  'AG-31',
  'AG-32',
  'AG-33',
  'AG-34',
  'AG-35',
  'AG-36',
  'ARA-01',
  'ARA-02',
  'ARA-03',
  'ARA-04',
  'ARA-05',
  'ARA-06',
  'ARA-07',
  'ARA-08',
  'ARA-09',
  'ARA-10',
  'ARA-11',
  'ARA-12',
];

/** Human-readable names for the Agent Catalogue and ARA charters. */
export const CRIE_AGENT_LABELS: Partial<Record<AgentId, string>> = {
  'AG-01': 'Context Agent',
  'AG-02': 'Session Agent',
  'AG-03': 'Workspace Agent',
  'AG-04': 'Lifecycle Agent',
  'AG-05': 'Knowledge Graph Agent',
  'AG-06': 'Semantic Agent',
  'AG-07': 'Index Agent',
  'AG-08': 'Search Agent',
  'AG-09': 'Reasoning Agent',
  'AG-10': 'Prompt Agent',
  'AG-11': 'Memory Agent',
  'AG-12': 'Evidence Agent',
  'AG-13': 'Citation Agent',
  'AG-14': 'Document Agent',
  'AG-15': 'Literature Agent',
  'AG-16': 'Gap Detection Agent',
  'AG-17': 'Peer Review Agent',
  'AG-18': 'Methodology Agent',
  'AG-19': 'Journal Agent',
  'AG-20': 'Statistics Agent',
  'AG-21': 'Grant Agent',
  'AG-22': 'Instrument Agent',
  'AG-23': 'Ethics Agent',
  'AG-24': 'Integrity Agent',
  'AG-25': 'Learning Agent',
  'AG-26': 'Writing Agent',
  'AG-27': 'Supervisor Agent',
  'AG-28': 'Patent Agent',
  'AG-29': 'Innovation Agent',
  'AG-30': 'Career Agent',
  'AG-31': 'Mentorship Agent',
  'AG-32': 'Prediction Agent',
  'AG-33': 'Analytics Agent',
  'AG-34': 'Adaptive Agent',
  'AG-35': 'Conversation Agent',
  'AG-36': 'Notification Agent',
  'ARA-01': 'Autonomous Research Agent — Literature',
  'ARA-02': 'Autonomous Research Agent — Evidence',
  'ARA-03': 'Autonomous Research Agent — Reasoning',
  'ARA-04': 'Autonomous Research Agent — Methods',
  'ARA-05': 'Autonomous Research Agent — Analysis',
  'ARA-06': 'Autonomous Research Agent — Writing',
  'ARA-07': 'Autonomous Research Agent — Publication',
  'ARA-08': 'Autonomous Research Agent — Grant',
  'ARA-09': 'Autonomous Research Agent — Review',
  'ARA-10': 'Autonomous Research Agent — Teaching',
  'ARA-11': 'Autonomous Research Agent — Mentoring',
  'ARA-12': 'Autonomous Research Agent — Innovation',
};

export type AgentStatus = 'provisioned' | 'authorised' | 'active' | 'paused' | 'retired';

/** A specialised, bounded-autonomy software actor. */
export interface Agent extends Auditable {
  id: AgentId;
  name: string;
  charter: AgentCharter;
  autonomyLevel: AutonomyLevel;
  status: AgentStatus;
  sharedMemory: MemoryAccess; // what it may read/write
}

/** The machine- and human-readable charter (mission, competence, limits). */
export interface AgentCharter {
  mission: string;
  competence: string[];
  limits: string[]; // declared boundaries
  inputs: string[];
  outputs: string[];
  escalation: string; // escalation path
  policies: string[]; // policy references
}

export type AgentTaskStatus = 'pending' | 'running' | 'checkpoint' | 'complete' | 'failed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/** A task assigned to an agent. */
export interface AgentTask extends Auditable {
  id: string;
  agentId: AgentId;
  orchestrationPlanId?: string;
  status: AgentTaskStatus;
  priority: TaskPriority;
  result?: unknown;
  provenance: ProvenanceRef;
}

/** An execution record of an agent task. */
export interface AgentExecution extends Auditable {
  id: string;
  taskId: string;
  agentId: AgentId;
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'succeeded' | 'failed';
  output?: string;
}

/** The declared autonomy level (L1–L5) and boundaries of an agent. */
export interface AutonomyEnvelope {
  agentId: AgentId;
  autonomyLevel: AutonomyLevel;
  boundaries: string[];
  requiresApprovalFor: string[];
  disabledByDefault: boolean;
}

/** A recorded delegation between agents or to the researcher. */
export interface DelegationRecord extends Auditable {
  id: string;
  fromAgentId: AgentId;
  toAgentId?: AgentId;
  toResearcher?: ResearcherRef;
  taskId: string;
  reason: string;
}
