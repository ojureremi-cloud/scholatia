/**
 * E-23 Mentorship Engine — Mission 004-D (Wave 2).
 *
 * Pure mentorship helpers over `MentorshipGuidance` and `MentoringSession`
 * (CRIE Ch. 34).
 */
import type {
  GuidanceKind,
  MentoringSession,
  MentorshipGuidance,
  ResearcherRef,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export interface MentorshipGuidanceInput {
  label: string;
  mentor: ResearcherRef;
  mentee: ResearcherRef;
  guidanceKind: GuidanceKind;
  content: string;
  rationale: string;
}

export function createGuidance(input: MentorshipGuidanceInput): MentorshipGuidance {
  const now = nowIso();
  return {
    id: `guidance-${slugOf(input.label)}`,
    mentor: input.mentor,
    mentee: input.mentee,
    guidanceKind: input.guidanceKind,
    content: input.content,
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export interface MentoringSessionInput {
  label: string;
  mentor: ResearcherRef;
  mentee: ResearcherRef;
  heldAt: string;
  agenda: string[];
  outcomes: string[];
  followUp?: string;
}

export function createMentoringSession(input: MentoringSessionInput): MentoringSession {
  const now = nowIso();
  return {
    id: `mentoring-session-${slugOf(input.label)}`,
    mentor: input.mentor,
    mentee: input.mentee,
    heldAt: input.heldAt,
    agenda: input.agenda,
    outcomes: input.outcomes,
    followUp: input.followUp,
    createdAt: now,
    updatedAt: now,
  };
}

export function sessionsForPair(
  sessions: readonly MentoringSession[],
  mentorUsername: string,
  menteeUsername: string,
): MentoringSession[] {
  return sessions.filter(
    (session) =>
      session.mentor.username === mentorUsername && session.mentee.username === menteeUsername,
  );
}

export function guidanceKindsFor(
  guidance: readonly MentorshipGuidance[],
  menteeUsername: string,
): GuidanceKind[] {
  return guidance
    .filter((item) => item.mentee.username === menteeUsername)
    .map((item) => item.guidanceKind);
}

export interface MentorshipStatistics {
  guidance: number;
  sessions: number;
}

export function mentorshipStatistics(
  guidance: readonly MentorshipGuidance[],
  sessions: readonly MentoringSession[] = [],
): MentorshipStatistics {
  return { guidance: guidance.length, sessions: sessions.length };
}
