/**
 * CRIE conversation types (fspec §2.13).
 *
 * `Conversation` is a conversation thread and `ConversationTurn` a single
 * turn within it (CRIE Ch. 41). Conversation records are append-only.
 */
import type { Auditable, ResearcherRef } from './base';

export type ConversationKind = 'assistant' | 'session' | 'agent' | 'support';

/** A conversation thread. */
export interface Conversation extends Auditable {
  id: string;
  researcher: ResearcherRef;
  sessionId?: string;
  conversationKind: ConversationKind;
  title: string;
}

export type ConversationRole = 'researcher' | 'assistant' | 'agent' | 'system';

/** A single turn within a conversation. */
export interface ConversationTurn extends Auditable {
  id: string;
  conversationId: string;
  role: ConversationRole;
  content: string;
}
