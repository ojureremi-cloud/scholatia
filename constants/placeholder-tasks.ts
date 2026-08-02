import {
  addTaskComment,
  buildTaskBoard,
  createTask,
  taskAnalytics,
  taskStatistics,
  tasksForAssignee,
  updateTaskStatus,
} from '@/lib/tasks';
import type { Task, TaskAnalytics, TaskStatistics } from '@/types/tasks';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';
import {
  CONFERENCE_WORKFLOW,
  ETHICS_WORKFLOW,
  GRANT_WORKFLOW,
  JOURNAL_WORKFLOW,
  MASTERS_WORKFLOW,
  PHD_WORKFLOW,
  SERVICE_WORKFLOW,
} from '@/constants/placeholder-workflows';

/**
 * Placeholder task data for the Scholatia Task Engine (Phase 2.2E SWTROP).
 *
 * Tasks are aggregate roots. Most attach to a canonical workflow through
 * `workflowId` (referencing the workflow constants in placeholder-workflows);
 * standalone tasks reference canonical artefacts, datasets, and service orders
 * through `sourceId` + `sourceEntity`. Researchers are referenced by canonical
 * username. Statistics and analytics are derived by the pure engines in
 * `lib/tasks.ts`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-01T12:00:00.000Z');

function researcherOf(username: string): ResearcherProfile {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  if (!found) {
    throw new Error(`Missing researcher seed: ${username}`);
  }
  return found;
}

const OJURI = researcherOf('ojuri');
const SMITH = researcherOf('smith');
const MARIA = researcherOf('maria');
const JSCHOLAR = researcherOf('jscholar');
const TANAKA = researcherOf('tanaka');
const OKONKWO = researcherOf('okonkwo');
const ADEBAYO = researcherOf('adebayo');

function daysAgo(days: number, hour = 10): string {
  const date = new Date(NOW);
  date.setDate(date.getDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

function daysAhead(days: number, hour = 14): string {
  const date = new Date(NOW);
  date.setDate(date.getDate() + days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

// ---------------------------------------------------------------------------
// Task seeds (attached to canonical workflows)
// ---------------------------------------------------------------------------

let thesisTask = createTask({
  title: 'Finalise Chapter 4 error analysis',
  description: 'Complete the error analysis section of Chapter 4 with dialect-cluster breakdowns.',
  priority: 'high',
  assignee: JSCHOLAR.username,
  assigneeName: JSCHOLAR.displayName,
  workflowId: PHD_WORKFLOW.id,
  tags: ['thesis', 'chapter-4', 'analysis'],
  dueDate: daysAhead(6),
  createdBy: JSCHOLAR.username,
  createdByName: JSCHOLAR.displayName,
  createdAt: daysAgo(12),
});
thesisTask = updateTaskStatus({ task: thesisTask, status: 'in-progress', actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(4) });
thesisTask = addTaskComment({ task: thesisTask, author: OKONKWO.username, authorName: OKONKWO.displayName, body: 'Focus on per-language breakdowns; the internal examiner asked for clustering detail.', now: daysAgo(3) }).task;

let examinerTask = createTask({
  title: 'Respond to internal examiner comments',
  description: 'Address the round-4 corrections flagged for chapters 4 and 5.',
  priority: 'urgent',
  assignee: JSCHOLAR.username,
  assigneeName: JSCHOLAR.displayName,
  workflowId: PHD_WORKFLOW.id,
  tags: ['thesis', 'revision'],
  dueDate: daysAhead(2),
  createdBy: OKONKWO.username,
  createdByName: OKONKWO.displayName,
  createdAt: daysAgo(5),
});
examinerTask = updateTaskStatus({ task: examinerTask, status: 'in-review', actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(2) });

let literatureTask = createTask({
  title: 'Literature review update — low-resource parsing',
  description: 'Fold in the 2025 low-resource parsing publications into Chapter 2.',
  priority: 'medium',
  assignee: JSCHOLAR.username,
  assigneeName: JSCHOLAR.displayName,
  workflowId: PHD_WORKFLOW.id,
  tags: ['thesis', 'literature-review'],
  createdBy: ADEBAYO.username,
  createdByName: ADEBAYO.displayName,
  createdAt: daysAgo(30),
});
literatureTask = updateTaskStatus({ task: literatureTask, status: 'done', actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(14) });

let journalRevisionTask = createTask({
  title: 'Revise methodology section for re-review',
  description: 'Expand evaluation methodology and reproducibility details requested by the reviewers.',
  priority: 'high',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  workflowId: JOURNAL_WORKFLOW.id,
  tags: ['journal', 'revision'],
  dueDate: daysAhead(9),
  createdBy: OJURI.username,
  createdByName: OJURI.displayName,
  createdAt: daysAgo(6),
});
journalRevisionTask = updateTaskStatus({ task: journalRevisionTask, status: 'in-progress', actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(3) });
journalRevisionTask = addTaskComment({ task: journalRevisionTask, author: SMITH.username, authorName: SMITH.displayName, body: 'Please also document the exact evaluation harness versions.', now: daysAgo(2) }).task;

let reproducibilityTask = createTask({
  title: 'Prepare reproducible evaluation scripts',
  description: 'Package the evaluation harness into a container with pinned dependencies.',
  priority: 'medium',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  workflowId: JOURNAL_WORKFLOW.id,
  tags: ['journal', 'reproducibility'],
  createdBy: SMITH.username,
  createdByName: SMITH.displayName,
  createdAt: daysAgo(6),
});
reproducibilityTask = updateTaskStatus({ task: reproducibilityTask, status: 'blocked', actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(1) });

const cameraReadyTask = createTask({  title: 'Camera-ready formatting for SIRI 2026',
  description: 'Apply the SIRI-2026 camera-ready template and upload the final PDF.',
  priority: 'medium',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  workflowId: CONFERENCE_WORKFLOW.id,
  tags: ['conference', 'camera-ready'],
  dueDate: daysAhead(14),
  createdBy: OJURI.username,
  createdByName: OJURI.displayName,
  createdAt: daysAgo(20),
});

let consentTask = createTask({
  title: 'Compile ethics consent forms',
  description: 'Digitise the signed consent forms for the toolkit data collection.',
  priority: 'high',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  workflowId: ETHICS_WORKFLOW.id,
  tags: ['ethics', 'compliance'],
  createdBy: OKONKWO.username,
  createdByName: OKONKWO.displayName,
  createdAt: daysAgo(25),
});
consentTask = updateTaskStatus({ task: consentTask, status: 'done', actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(15) });

let budgetTask = createTask({
  title: 'Draft grant budget justification',
  description: 'Write the budget justification narrative for the NIH submission.',
  priority: 'high',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  workflowId: GRANT_WORKFLOW.id,
  tags: ['grant', 'budget'],
  createdBy: OJURI.username,
  createdByName: OJURI.displayName,
  createdAt: daysAgo(50),
});
budgetTask = updateTaskStatus({ task: budgetTask, status: 'done', actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(32) });

let regressionTask = createTask({
  title: 'Milestone 2 — regression models',
  description: 'Fit and validate the regression models for the clinical cohort study.',
  priority: 'high',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  workflowId: SERVICE_WORKFLOW.id,
  sourceId: 'ord-service-021',
  sourceEntity: 'service-order',
  tags: ['service', 'statistics'],
  dueDate: daysAhead(10),
  createdBy: OJURI.username,
  createdByName: OJURI.displayName,
  createdAt: daysAgo(15),
});
regressionTask = updateTaskStatus({ task: regressionTask, status: 'in-progress', actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(7) });

const cohortTask = createTask({
  title: 'Recruit cohort clinics — malaria study',
  description: 'Finalise clinic recruitment across the three survey regions.',
  priority: 'medium',
  assignee: MARIA.username,
  assigneeName: MARIA.displayName,
  workflowId: MASTERS_WORKFLOW.id,
  tags: ['masters', 'cohort'],
  dueDate: daysAhead(21),
  createdBy: MARIA.username,
  createdByName: MARIA.displayName,
  createdAt: daysAgo(9),
});

let proofreadTask = createTask({
  title: 'Proofread thesis introduction',
  description: 'Copy-edit pass over Chapter 1 before supervisor submission.',
  priority: 'low',
  assignee: JSCHOLAR.username,
  assigneeName: JSCHOLAR.displayName,
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  tags: ['thesis', 'proofreading'],
  dueDate: daysAhead(5),
  createdBy: JSCHOLAR.username,
  createdByName: JSCHOLAR.displayName,
  createdAt: daysAgo(3),
});
proofreadTask = updateTaskStatus({ task: proofreadTask, status: 'in-review', actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(1) });

let licenceTask = createTask({
  title: 'Verify dataset licence metadata',
  description: 'Confirm licence fields on the released corpus before publication.',
  priority: 'high',
  assignee: OJURI.username,
  assigneeName: OJURI.displayName,
  sourceId: 'listing-python-ml-analysis',
  sourceEntity: 'marketplace',
  tags: ['dataset', 'licence'],
  createdBy: TANAKA.username,
  createdByName: TANAKA.displayName,
  createdAt: daysAgo(4),
});
licenceTask = updateTaskStatus({ task: licenceTask, status: 'blocked', actor: OJURI.username, actorName: OJURI.displayName, now: daysAgo(2) });

let summaryTask = createTask({
  title: 'Summarise supervisor feedback',
  description: 'Distil the round-4 supervision voice note into actionable items.',
  priority: 'medium',
  assignee: JSCHOLAR.username,
  assigneeName: JSCHOLAR.displayName,
  sourceId: 'art-thesis-multilingual-parsing',
  sourceEntity: 'artefact',
  tags: ['thesis', 'supervision'],
  createdBy: ADEBAYO.username,
  createdByName: ADEBAYO.displayName,
  createdAt: daysAgo(6),
});
summaryTask = updateTaskStatus({ task: summaryTask, status: 'done', actor: JSCHOLAR.username, actorName: JSCHOLAR.displayName, now: daysAgo(5) });

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

export const TASKS: Task[] = [
  thesisTask,
  examinerTask,
  literatureTask,
  journalRevisionTask,
  reproducibilityTask,
  cameraReadyTask,
  consentTask,
  budgetTask,
  regressionTask,
  cohortTask,
  proofreadTask,
  licenceTask,
  summaryTask,
];

export const TASK_STATISTICS: TaskStatistics = taskStatistics(TASKS, NOW.toISOString());
export const TASK_ANALYTICS: TaskAnalytics = taskAnalytics(TASKS, NOW.toISOString());
export const TASK_BOARD = buildTaskBoard(TASKS);
export const MY_TASKS: Task[] = tasksForAssignee(TASKS, CURRENT_USER);
export const DEFAULT_TASK = thesisTask;
export const CURRENT_TASK_USER = CURRENT_USER;
export const CURRENT_TASK_USER_NAME = OJURI.displayName;
