/**
 * E-08 Session Engine — Mission 004-D (Wave 2).
 *
 * Pure session helpers over `ResearchSession`, `SessionGoal`,
 * `SessionMessage`, and `SessionConsolidation` (CRIE Chs. 6–7).
 * Sessions are goal-directed envelopes of researcher–CRIE interaction.
 */
import type {
  ResearchSession,
  SessionConsolidation,
  SessionGoal,
  SessionGoalType,
  SessionMessage,
  SessionRole,
  SessionStatus,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export function researchSessionId(label: string): string {
  return `session-${slugOf(label)}`;
}

export interface SessionInput {
  label: string;
  researcher: { username: string; name?: string };
  workspaceId?: string;
  goals?: SessionGoal[];
  status?: SessionStatus;
}

export function createSession(input: SessionInput): ResearchSession {
  const now = nowIso();
  return {
    id: researchSessionId(input.label),
    researcher: { username: input.researcher.username, name: input.researcher.name },
    workspaceId: input.workspaceId,
    status: input.status ?? 'active',
    goals: input.goals ?? [],
    startedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export function endSession(session: ResearchSession): ResearchSession {
  const now = nowIso();
  return { ...session, status: 'ended', endedAt: now, updatedAt: now };
}

export interface SessionGoalInput {
  label: string;
  sessionId: string;
  goalType: SessionGoalType;
  statement: string;
}

export function sessionGoal(input: SessionGoalInput): SessionGoal {
  const now = nowIso();
  return {
    id: `goal-${slugOf(input.label)}`,
    sessionId: input.sessionId,
    goalType: input.goalType,
    statement: input.statement,
    createdAt: now,
    updatedAt: now,
  };
}

export function addSessionGoal(session: ResearchSession, goal: SessionGoal): ResearchSession {
  const now = nowIso();
  return { ...session, goals: [...session.goals, goal], updatedAt: now };
}

export function sessionMessageId(label: string): string {
  return `msg-${slugOf(label)}`;
}

export function createSessionMessage(
  sessionId: string,
  role: SessionRole,
  content: string,
): SessionMessage {
  const now = nowIso();
  return {
    id: sessionMessageId(content),
    sessionId,
    role,
    content,
    createdAt: now,
    updatedAt: now,
  };
}

export function sessionsFor(
  sessions: readonly ResearchSession[],
  username: string,
): ResearchSession[] {
  return sessions.filter((session) => session.researcher.username === username);
}

export function activeSessions(sessions: readonly ResearchSession[]): ResearchSession[] {
  return sessions.filter((session) => session.status === 'active');
}

export interface SessionStatistics {
  total: number;
  active: number;
  ended: number;
  totalGoals: number;
}

export function sessionStatistics(sessions: readonly ResearchSession[]): SessionStatistics {
  const active = sessions.filter((session) => session.status === 'active').length;
  const ended = sessions.filter((session) => session.status === 'ended').length;
  const totalGoals = sessions.reduce((sum, session) => sum + session.goals.length, 0);
  return { total: sessions.length, active, ended, totalGoals };
}

export function consolidateSession(
  session: ResearchSession,
  memoryItemIds: string[],
  rule: string,
): SessionConsolidation {
  const now = nowIso();
  return {
    id: `consolidation-${session.id}`,
    sessionId: session.id,
    consolidatedAt: now,
    memoryItemIds,
    rule,
    createdAt: now,
    updatedAt: now,
  };
}
