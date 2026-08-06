/**
 * CRIE mentorship types (fspec §2.11).
 *
 * `MentorshipGuidance` provides scaffolding guidance for a mentoring
 * relationship; `MentoringSession` is a structured mentoring session
 * (CRIE Ch. 34).
 */
import type { Auditable, ResearcherRef } from './base';

export type GuidanceKind =
  | 'goal-setting'
  | 'career-path'
  | 'research-advice'
  | 'writing-support'
  | 'feedback'
  | 'reflection';

/** Scaffolding guidance for a mentoring relationship. */
export interface MentorshipGuidance extends Auditable {
  id: string;
  mentor: ResearcherRef;
  mentee: ResearcherRef;
  guidanceKind: GuidanceKind;
  content: string;
  rationale: string;
}

/** A structured mentoring session. */
export interface MentoringSession extends Auditable {
  id: string;
  mentor: ResearcherRef;
  mentee: ResearcherRef;
  heldAt: string;
  agenda: string[];
  outcomes: string[];
  followUp?: string;
}
