/**
 * CRIE context, session & workspace types (fspec §2.2).
 *
 * `ContextPack` is the assembled, bounded, weighted operative context for an
 * interaction (micro → meso → macro → eco → platform). `ResearchSession` is a
 * goal-directed temporal envelope of researcher–CRIE interaction, and
 * `Workspace` is the researcher's persistent research surface (CRIE Chs. 5–7).
 */
import type {
  Auditable,
  ConfidenceScore,
  ProvenanceRef,
  ResearcherRef,
  Versioned,
} from './base';

/** The five context pack kinds (CRIE Ch. 5). */
export type ContextKind = 'micro' | 'meso' | 'macro' | 'eco' | 'platform';

export const CONTEXT_KINDS: readonly ContextKind[] = [
  'micro',
  'meso',
  'macro',
  'eco',
  'platform',
];

/** A reference to an assembled context pack (used by memory and reasoning). */
export interface ContextPackRef {
  contextPackId: string;
  contextKind: ContextKind;
}

/** A single provenance-bearing element of a context pack. */
export interface ContextElement {
  id: string;
  sourceType: string;
  sourceId: string;
  relevanceWeight: number; // 0..1
  confidence: ConfidenceScore;
  content: string;
  provenance: ProvenanceRef;
}

/** The assembled, bounded, weighted operative context for an interaction. */
export interface ContextPack extends Auditable {
  id: string;
  researchEntityId?: string;
  sessionId?: string;
  contextKind: ContextKind;
  elements: ContextElement[];
  budgetUsed: number;
  budgetLimit: number;
}

export type SessionStatus = 'active' | 'ended' | 'abandoned';

/** A goal-directed temporal envelope of researcher–CRIE interaction. */
export interface ResearchSession extends Auditable {
  id: string;
  researcher: ResearcherRef;
  workspaceId?: string;
  status: SessionStatus;
  goals: SessionGoal[];
  startedAt: string;
  endedAt?: string;
}

export type SessionRole = 'researcher' | 'assistant' | 'agent' | 'system';

/** A message within a session. */
export interface SessionMessage extends Auditable {
  id: string;
  sessionId: string;
  role: SessionRole;
  content: string;
}

export type SessionGoalType =
  | 'explore'
  | 'draft'
  | 'analyse'
  | 'review'
  | 'plan'
  | 'verify'
  | 'learn'
  | 'administrative';

/** The intent a session serves. */
export interface SessionGoal extends Auditable {
  id: string;
  sessionId: string;
  goalType: SessionGoalType;
  statement: string;
}

/** The researcher's persistent research surface (CRIE Ch. 7). */
export interface Workspace extends Auditable, Versioned {
  id: string;
  researcher: ResearcherRef;
  panes: WorkspacePane[];
}

export type WorkspacePaneKind =
  | 'documents'
  | 'advisory'
  | 'agents'
  | 'memory'
  | 'context'
  | 'conversation';

/** A pane within the workspace. */
export interface WorkspacePane extends Auditable {
  id: string;
  workspaceId: string;
  paneKind: WorkspacePaneKind;
  title: string;
  open?: boolean;
}

/** A document open in the workspace. */
export interface OpenDocument extends Auditable {
  id: string;
  workspaceId: string;
  documentId: string;
  paneId: string;
  focusState?: string;
}

/** The currently active passage/selection. */
export interface SelectedPassage extends Auditable {
  id: string;
  openDocumentId: string;
  chunkId: string;
  startOffset: number;
  endOffset: number;
  note?: string;
}

/** A consolidation checkpoint of a session (roll-forward of short-term memory). */
export interface SessionConsolidation extends Auditable {
  id: string;
  sessionId: string;
  consolidatedAt: string;
  memoryItemIds: string[];
  rule: string;
}
