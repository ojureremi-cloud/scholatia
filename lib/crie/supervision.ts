/**
 * E-25 Supervision Engine — Mission 004-D (Wave 2).
 *
 * Pure supervision helpers over `SupervisionRecord` and
 * `SupervisionFeedback` (CRIE Ch. 24).
 */
import type {
  ResearcherRef,
  SupervisionFeedback,
  SupervisionFeedbackType,
  SupervisionRecord,
  SupervisionStatus,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export interface SupervisionRecordInput {
  label: string;
  supervisor: ResearcherRef;
  researchEntityId: string;
  startedAt: string;
  status?: SupervisionStatus;
  meetingsHeld?: number;
}

export function createSupervisionRecord(input: SupervisionRecordInput): SupervisionRecord {
  const now = nowIso();
  return {
    id: `supervision-${slugOf(input.label)}`,
    supervisor: input.supervisor,
    researchEntityId: input.researchEntityId,
    status: input.status ?? 'active',
    startedAt: input.startedAt,
    meetingsHeld: input.meetingsHeld ?? 0,
    createdAt: now,
    updatedAt: now,
  };
}

export interface SupervisionFeedbackInput {
  label: string;
  supervisionRecordId: string;
  feedbackType: SupervisionFeedbackType;
  content: string;
  issuedBy: ResearcherRef;
}

export function addFeedback(input: SupervisionFeedbackInput): SupervisionFeedback {
  const now = nowIso();
  return {
    id: `supervision-feedback-${slugOf(input.label)}`,
    supervisionRecordId: input.supervisionRecordId,
    feedbackType: input.feedbackType,
    content: input.content,
    issuedBy: input.issuedBy,
    issuedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export interface SupervisionStatistics {
  records: number;
  active: number;
  completed: number;
  feedback: number;
}

export function supervisionStatistics(
  records: readonly SupervisionRecord[],
  feedback: readonly SupervisionFeedback[] = [],
): SupervisionStatistics {
  return {
    records: records.length,
    active: records.filter((record) => record.status === 'active').length,
    completed: records.filter((record) => record.status === 'completed').length,
    feedback: feedback.length,
  };
}
