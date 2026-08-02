import type {
  CollaborationMember,
  CollaborationWorkspace,
  WorkspaceDiscussion,
  WorkspaceDocument,
  WorkspaceInvitation,
  WorkspaceLogEntry,
  WorkspaceMeeting,
  WorkspaceMilestone,
  WorkspaceTask,
} from '@/types/collaboration';
import type { CollaborationAnalytics, CollaborationInsight, CollaborationPortfolio, CollaborationStatistics } from '@/types/collaboration';
import {
  buildCollaborationPortfolio,
  collaborationAnalytics,
  collaborationInsights,
  collaborationStatistics,
  createWorkspace,
} from '@/lib/collaboration';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';

/**
 * Placeholder data for the Scholatia Collaboration Workspace Platform
 * (Phase 2.2D).
 *
 * The workspace graph owns no external records: members reference canonical
 * researchers by `username`, milestones carry the canonical
 * `ResearchLifecycleStageId`, and workspaces reference canonical source
 * records (projects, institutions, conferences, journals) through `sourceId` +
 * `sourceEntity`. Statistics, analytics, insights, and the portfolio are all
 * derived from the typed workspace graph by the pure engine in
 * `lib/collaboration.ts`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-01T12:00:00.000Z');

// ---------------------------------------------------------------------------
// Shared canonical references
// ---------------------------------------------------------------------------

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
const ADESINA = researcherOf('adesina');
const WANG = researcherOf('wang');
const DUBE = researcherOf('dube');
const ADEBAYO = researcherOf('adebayo');

/** A member identified by canonical researcher username. */
function memberOf(username: string, role: CollaborationMember['role'], status: CollaborationMember['status'] = 'active', joinedAt?: string): CollaborationMember {
  const profile = researcherOf(username);
  return {
    username: profile.username,
    name: profile.displayName,
    avatar: profile.avatar,
    role,
    status,
    joinedAt: joinedAt ?? '2026-01-15T09:00:00.000Z',
  };
}

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
// Workspace 1 — research-group
// ---------------------------------------------------------------------------

const groupMembers: CollaborationMember[] = [
  memberOf('ojuri', 'owner', 'active', '2024-03-01T09:00:00.000Z'),
  memberOf('okonkwo', 'admin', 'active', '2024-03-02T10:00:00.000Z'),
  memberOf('adesina', 'editor', 'active', '2024-03-10T11:00:00.000Z'),
  memberOf('dube', 'member', 'active', '2024-04-01T09:00:00.000Z'),
  memberOf('maria', 'member', 'invited', '2026-07-28T09:00:00.000Z'),
];

const groupTasks: WorkspaceTask[] = [
  {
    id: 'task-group-1',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Draft malaria surveillance protocol',
    description: 'Protocol for the national surveillance programme across the four participating states.',
    status: 'done',
    priority: 'high',
    assignee: 'ojuri',
    assigneeName: OJURI.displayName,
    dueDate: '2026-06-15T00:00:00.000Z',
    createdBy: 'ojuri',
    createdAt: '2026-05-20T09:00:00.000Z',
    completedAt: '2026-06-12T14:00:00.000Z',
  },
  {
    id: 'task-group-2',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Collect seasonal data across sites',
    description: 'Field data collection for the maternal health cohort at all participating clinics.',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'okonkwo',
    assigneeName: OKONKWO.displayName,
    dueDate: '2026-08-20T00:00:00.000Z',
    createdBy: 'ojuri',
    createdAt: '2026-06-10T09:00:00.000Z',
  },
  {
    id: 'task-group-3',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Review community engagement plan',
    description: 'Feedback round on the community engagement and dissemination plan.',
    status: 'in-review',
    priority: 'medium',
    assignee: 'adesina',
    assigneeName: ADESINA.displayName,
    dueDate: '2026-08-05T00:00:00.000Z',
    createdBy: 'okonkwo',
    createdAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'task-group-4',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Prepare grant renewal evidence pack',
    description: 'Evidence synthesis for the annual grant renewal to the national research council.',
    status: 'todo',
    priority: 'high',
    assignee: 'dube',
    assigneeName: DUBE.displayName,
    dueDate: '2026-08-30T00:00:00.000Z',
    createdBy: 'ojuri',
    createdAt: '2026-07-15T09:00:00.000Z',
  },
];

const groupDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-group-1',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Surveillance protocol v3',
    type: 'protocol',
    status: 'published',
    author: 'ojuri',
    authorName: OJURI.displayName,
    updatedAt: '2026-06-12T14:00:00.000Z',
    version: 3,
  },
  {
    id: 'doc-group-2',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Quarterly field report Q2',
    type: 'report',
    status: 'in-review',
    author: 'okonkwo',
    authorName: OKONKWO.displayName,
    updatedAt: '2026-07-20T10:00:00.000Z',
    version: 1,
  },
  {
    id: 'doc-group-3',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Community engagement guideline',
    type: 'guideline',
    status: 'draft',
    author: 'adesina',
    authorName: ADESINA.displayName,
    updatedAt: '2026-07-25T09:00:00.000Z',
    version: 1,
  },
];

const groupMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-group-1',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Quarterly consortium sync',
    scheduledAt: daysAgo(10, 13),
    status: 'completed',
    attendees: ['ojuri', 'okonkwo', 'adesina', 'dube'],
    agenda: 'Field data update, grant renewal timeline, publication pipeline.',
  },
  {
    id: 'meet-group-2',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Data analysis planning',
    scheduledAt: daysAhead(5, 15),
    status: 'scheduled',
    attendees: ['ojuri', 'okonkwo', 'maria'],
    agenda: 'Analysis plan for the maternal health cohort dataset.',
  },
];

const groupMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-group-1',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Protocol approved',
    description: 'The surveillance protocol passed institutional review.',
    status: 'achieved',
    stageId: 'proposal',
    targetDate: '2026-06-15T00:00:00.000Z',
    achievedAt: '2026-06-12T14:00:00.000Z',
  },
  {
    id: 'ms-group-2',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Field data complete',
    description: 'All participating clinics complete seasonal data collection.',
    status: 'in-progress',
    stageId: 'dataset',
    targetDate: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'ms-group-3',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Manuscript submitted',
    description: 'First-author manuscript submitted to a portfolio journal.',
    status: 'planned',
    stageId: 'submission',
    targetDate: '2026-11-30T00:00:00.000Z',
  },
];

const groupDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-group-1',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Sampling strategy for rural clinics',
    body: 'How should we stratify the sample across rural and peri-urban clinics to keep estimates stable?',
    author: 'ojuri',
    authorName: OJURI.displayName,
    status: 'open',
    replies: [
      {
        id: 'reply-group-1',
        discussionId: 'disc-group-1',
        author: 'okonkwo',
        authorName: OKONKWO.displayName,
        body: 'Stratify by catchment population and oversample the smallest sites — the protocol annex supports this.',
        createdAt: daysAgo(6, 12),
      },
    ],
    createdAt: daysAgo(8, 9),
  },
  {
    id: 'disc-group-2',
    workspaceId: 'ws-west-african-health-consortium',
    title: 'Renewal evidence pack structure',
    body: 'Proposed structure for the grant renewal evidence pack — feedback welcome before Friday.',
    author: 'adesina',
    authorName: ADESINA.displayName,
    status: 'resolved',
    replies: [],
    createdAt: daysAgo(12, 11),
  },
];

const groupInvitations: WorkspaceInvitation[] = [
  {
    id: 'inv-group-1',
    workspaceId: 'ws-west-african-health-consortium',
    invitedBy: 'ojuri',
    invitedByName: OJURI.displayName,
    invitee: 'maria',
    inviteeName: MARIA.displayName,
    role: 'member',
    status: 'pending',
    createdAt: '2026-07-28T09:00:00.000Z',
  },
];

const groupLog: WorkspaceLogEntry[] = [
  { id: 'log-group-1', workspaceId: 'ws-west-african-health-consortium', type: 'created', actor: 'ojuri', actorName: OJURI.displayName, message: 'Workspace created', createdAt: '2024-03-01T09:00:00.000Z' },
  { id: 'log-group-2', workspaceId: 'ws-west-african-health-consortium', type: 'member-added', actor: 'ojuri', actorName: OJURI.displayName, message: 'Dr. Nneka Okonkwo joined as admin', createdAt: '2024-03-02T10:00:00.000Z' },
  { id: 'log-group-3', workspaceId: 'ws-west-african-health-consortium', type: 'task-completed', actor: 'ojuri', actorName: OJURI.displayName, message: 'Draft malaria surveillance protocol completed', createdAt: '2026-06-12T14:00:00.000Z' },
  { id: 'log-group-4', workspaceId: 'ws-west-african-health-consortium', type: 'milestone-achieved', actor: 'ojuri', actorName: OJURI.displayName, message: 'Milestone Protocol approved achieved', createdAt: '2026-06-12T14:05:00.000Z' },
  { id: 'log-group-5', workspaceId: 'ws-west-african-health-consortium', type: 'invitation-sent', actor: 'ojuri', actorName: OJURI.displayName, message: 'Invited Dr. Maria Fernández', createdAt: '2026-07-28T09:00:00.000Z' },
];

const WEST_AFRICAN_HEALTH_CONSORTIUM: CollaborationWorkspace = createWorkspace({
  id: 'ws-west-african-health-consortium',
  name: 'West African Health Consortium',
  kind: 'research-group',
  description: 'Multi-country research group on infectious disease surveillance and maternal health across West Africa.',
  visibility: 'institution',
  status: 'active',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  sourceTitle: 'University of Ibadan',
  tags: ['public-health', 'epidemiology', 'surveillance', 'maternal-health'],
  members: groupMembers,
  createdAt: '2024-03-01T09:00:00.000Z',
});

WEST_AFRICAN_HEALTH_CONSORTIUM.tasks = groupTasks;
WEST_AFRICAN_HEALTH_CONSORTIUM.documents = groupDocuments;
WEST_AFRICAN_HEALTH_CONSORTIUM.meetings = groupMeetings;
WEST_AFRICAN_HEALTH_CONSORTIUM.milestones = groupMilestones;
WEST_AFRICAN_HEALTH_CONSORTIUM.discussions = groupDiscussions;
WEST_AFRICAN_HEALTH_CONSORTIUM.invitations = groupInvitations;
WEST_AFRICAN_HEALTH_CONSORTIUM.log = groupLog;
WEST_AFRICAN_HEALTH_CONSORTIUM.updatedAt = '2026-07-28T09:00:00.000Z';

// ---------------------------------------------------------------------------
// Workspace 2 — research-lab
// ---------------------------------------------------------------------------

const labMembers: CollaborationMember[] = [
  memberOf('smith', 'owner', 'active', '2023-09-01T09:00:00.000Z'),
  memberOf('jscholar', 'admin', 'active', '2023-09-05T10:00:00.000Z'),
  memberOf('tanaka', 'editor', 'active', '2024-01-15T09:00:00.000Z'),
  memberOf('wang', 'member', 'active', '2024-02-01T09:00:00.000Z'),
  memberOf('adebayo', 'viewer', 'active', '2026-03-01T09:00:00.000Z'),
];

const labTasks: WorkspaceTask[] = [
  {
    id: 'task-lab-1',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Benchmark low-resource languages',
    description: 'Extend the parsing benchmark to the full low-resource language suite.',
    status: 'done',
    priority: 'high',
    assignee: 'jscholar',
    assigneeName: JSCHOLAR.displayName,
    dueDate: '2026-07-10T00:00:00.000Z',
    createdBy: 'smith',
    createdAt: '2026-05-25T09:00:00.000Z',
    completedAt: '2026-07-08T16:00:00.000Z',
  },
  {
    id: 'task-lab-2',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Release treebank contributions',
    description: 'Package and release the new treebank contributions under the shared licence.',
    status: 'in-review',
    priority: 'urgent',
    assignee: 'tanaka',
    assigneeName: TANAKA.displayName,
    dueDate: '2026-08-08T00:00:00.000Z',
    createdBy: 'smith',
    createdAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'task-lab-3',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Cross-lingual transfer experiments',
    description: 'Run the cross-lingual transfer experiments for the ACL submission.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'wang',
    assigneeName: WANG.displayName,
    dueDate: '2026-08-25T00:00:00.000Z',
    createdBy: 'jscholar',
    createdAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'task-lab-4',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Document reproducibility steps',
    status: 'todo',
    priority: 'medium',
    assignee: 'adebayo',
    assigneeName: ADEBAYO.displayName,
    dueDate: '2026-09-01T00:00:00.000Z',
    createdBy: 'smith',
    createdAt: '2026-07-18T09:00:00.000Z',
  },
];

const labDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-lab-1',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Parsing benchmark technical report',
    type: 'report',
    status: 'published',
    author: 'jscholar',
    authorName: JSCHOLAR.displayName,
    updatedAt: '2026-07-08T16:00:00.000Z',
    version: 2,
  },
  {
    id: 'doc-lab-2',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Multilingual transfer manuscript',
    type: 'manuscript',
    status: 'in-review',
    author: 'smith',
    authorName: SMITH.displayName,
    updatedAt: '2026-07-22T10:00:00.000Z',
    version: 4,
  },
  {
    id: 'doc-lab-3',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Treebank release notes',
    type: 'note',
    status: 'draft',
    author: 'tanaka',
    authorName: TANAKA.displayName,
    updatedAt: '2026-07-25T09:00:00.000Z',
    version: 1,
  },
];

const labMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-lab-1',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Weekly lab meeting',
    scheduledAt: daysAgo(1, 15),
    status: 'completed',
    attendees: ['smith', 'jscholar', 'tanaka', 'wang'],
    agenda: 'Benchmark status, transfer experiments, release planning.',
  },
  {
    id: 'meet-lab-2',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'ACL submission review',
    scheduledAt: daysAhead(3, 10),
    status: 'scheduled',
    attendees: ['smith', 'jscholar', 'wang'],
    agenda: 'Final pass over the ACL submission and rebuttal plan.',
  },
];

const labMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-lab-1',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Benchmark v2 published',
    description: 'The extended low-resource benchmark is released.',
    status: 'achieved',
    stageId: 'dataset',
    targetDate: '2026-07-10T00:00:00.000Z',
    achievedAt: '2026-07-08T16:00:00.000Z',
  },
  {
    id: 'ms-lab-2',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'ACL submission',
    description: 'Cross-lingual transfer paper submitted to ACL.',
    status: 'in-progress',
    stageId: 'submission',
    targetDate: '2026-08-15T00:00:00.000Z',
  },
  {
    id: 'ms-lab-3',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Treebank release',
    description: 'Treebank contributions released to the community.',
    status: 'planned',
    stageId: 'knowledge-transfer',
    targetDate: '2026-09-30T00:00:00.000Z',
  },
];

const labDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-lab-1',
    workspaceId: 'ws-multilingual-parsing-lab',
    title: 'Licensing choice for treebanks',
    body: 'CC-BY vs. CC-BY-SA for the new treebanks — need a decision before release.',
    author: 'smith',
    authorName: SMITH.displayName,
    status: 'open',
    replies: [
      {
        id: 'reply-lab-1',
        discussionId: 'disc-lab-1',
        author: 'jscholar',
        authorName: JSCHOLAR.displayName,
        body: 'CC-BY keeps reuse simple for downstream parsing research.',
        createdAt: daysAgo(4, 12),
      },
    ],
    createdAt: daysAgo(6, 9),
  },
];

const labInvitations: WorkspaceInvitation[] = [
  {
    id: 'inv-lab-1',
    workspaceId: 'ws-multilingual-parsing-lab',
    invitedBy: 'smith',
    invitedByName: SMITH.displayName,
    invitee: 'adebayo',
    inviteeName: ADEBAYO.displayName,
    role: 'viewer',
    status: 'accepted',
    createdAt: '2026-02-20T09:00:00.000Z',
  },
];

const labLog: WorkspaceLogEntry[] = [
  { id: 'log-lab-1', workspaceId: 'ws-multilingual-parsing-lab', type: 'created', actor: 'smith', actorName: SMITH.displayName, message: 'Workspace created', createdAt: '2023-09-01T09:00:00.000Z' },
  { id: 'log-lab-2', workspaceId: 'ws-multilingual-parsing-lab', type: 'task-completed', actor: 'jscholar', actorName: JSCHOLAR.displayName, message: 'Benchmark low-resource languages completed', createdAt: '2026-07-08T16:00:00.000Z' },
  { id: 'log-lab-3', workspaceId: 'ws-multilingual-parsing-lab', type: 'milestone-achieved', actor: 'jscholar', actorName: JSCHOLAR.displayName, message: 'Milestone Benchmark v2 published achieved', createdAt: '2026-07-08T16:05:00.000Z' },
  { id: 'log-lab-4', workspaceId: 'ws-multilingual-parsing-lab', type: 'discussion-opened', actor: 'smith', actorName: SMITH.displayName, message: 'Opened discussion Licensing choice for treebanks', createdAt: daysAgo(6, 9) },
  { id: 'log-lab-5', workspaceId: 'ws-multilingual-parsing-lab', type: 'document-published', actor: 'jscholar', actorName: JSCHOLAR.displayName, message: 'Parsing benchmark technical report published', createdAt: '2026-07-08T16:10:00.000Z' },
];

const MULTILINGUAL_PARSING_LAB: CollaborationWorkspace = createWorkspace({
  id: 'ws-multilingual-parsing-lab',
  name: 'Multilingual Parsing Lab',
  kind: 'research-lab',
  description: 'Lab focused on multilingual dependency parsing, low-resource languages, and cross-lingual transfer.',
  visibility: 'public',
  status: 'active',
  owner: 'smith',
  ownerName: SMITH.displayName,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  sourceTitle: 'University of Ibadan',
  tags: ['nlp', 'parsing', 'multilingual', 'treebanks'],
  members: labMembers,
  createdAt: '2023-09-01T09:00:00.000Z',
});

MULTILINGUAL_PARSING_LAB.tasks = labTasks;
MULTILINGUAL_PARSING_LAB.documents = labDocuments;
MULTILINGUAL_PARSING_LAB.meetings = labMeetings;
MULTILINGUAL_PARSING_LAB.milestones = labMilestones;
MULTILINGUAL_PARSING_LAB.discussions = labDiscussions;
MULTILINGUAL_PARSING_LAB.invitations = labInvitations;
MULTILINGUAL_PARSING_LAB.log = labLog;
MULTILINGUAL_PARSING_LAB.updatedAt = '2026-07-25T09:00:00.000Z';

// ---------------------------------------------------------------------------
// Workspace 3 — project-workspace
// ---------------------------------------------------------------------------

const projectMembers: CollaborationMember[] = [
  memberOf('maria', 'owner', 'active', '2025-01-10T09:00:00.000Z'),
  memberOf('tanaka', 'admin', 'active', '2025-01-12T10:00:00.000Z'),
  memberOf('wang', 'editor', 'active', '2025-01-20T09:00:00.000Z'),
];

const projectTasks: WorkspaceTask[] = [
  {
    id: 'task-project-1',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Model coastal erosion scenarios',
    description: 'Run the coastal erosion projections for the 2030 and 2050 horizons.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'tanaka',
    assigneeName: TANAKA.displayName,
    dueDate: '2026-08-28T00:00:00.000Z',
    createdBy: 'maria',
    createdAt: '2026-06-05T09:00:00.000Z',
  },
  {
    id: 'task-project-2',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Network analysis of adaptation research',
    description: 'Map the collaboration network across the funded adaptation projects.',
    status: 'in-review',
    priority: 'medium',
    assignee: 'wang',
    assigneeName: WANG.displayName,
    dueDate: '2026-08-12T00:00:00.000Z',
    createdBy: 'maria',
    createdAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'task-project-3',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Synthesise policy recommendations',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-15T00:00:00.000Z',
    createdBy: 'maria',
    createdAt: '2026-07-10T09:00:00.000Z',
  },
];

const projectDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-project-1',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Climate adaptation project report',
    type: 'report',
    status: 'in-review',
    author: 'maria',
    authorName: MARIA.displayName,
    updatedAt: '2026-07-18T10:00:00.000Z',
    version: 1,
  },
];

const projectMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-project-1',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Model validation sync',
    scheduledAt: daysAhead(7, 11),
    status: 'scheduled',
    attendees: ['maria', 'tanaka', 'wang'],
    agenda: 'Validate the erosion model against observed coastline data.',
  },
];

const projectMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-project-1',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Dataset assembled',
    description: 'The coastal and network datasets are assembled and validated.',
    status: 'achieved',
    stageId: 'dataset',
    targetDate: '2026-05-30T00:00:00.000Z',
    achievedAt: '2026-05-28T15:00:00.000Z',
  },
  {
    id: 'ms-project-2',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Analysis complete',
    description: 'The full analysis suite is complete.',
    status: 'in-progress',
    stageId: 'analysis',
    targetDate: '2026-09-01T00:00:00.000Z',
  },
];

const projectDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-project-1',
    workspaceId: 'ws-climate-adaptation-project',
    title: 'Horizon choice for projections',
    body: 'Should the final figures emphasise 2030 or 2050 horizons?',
    author: 'maria',
    authorName: MARIA.displayName,
    status: 'open',
    replies: [],
    createdAt: daysAgo(3, 10),
  },
];

const projectInvitations: WorkspaceInvitation[] = [
  {
    id: 'inv-project-1',
    workspaceId: 'ws-climate-adaptation-project',
    invitedBy: 'maria',
    invitedByName: MARIA.displayName,
    invitee: 'dube',
    inviteeName: DUBE.displayName,
    role: 'member',
    status: 'pending',
    createdAt: daysAgo(2, 9),
  },
];

const projectLog: WorkspaceLogEntry[] = [
  { id: 'log-project-1', workspaceId: 'ws-climate-adaptation-project', type: 'created', actor: 'maria', actorName: MARIA.displayName, message: 'Workspace created', createdAt: '2025-01-10T09:00:00.000Z' },
  { id: 'log-project-2', workspaceId: 'ws-climate-adaptation-project', type: 'milestone-achieved', actor: 'maria', actorName: MARIA.displayName, message: 'Milestone Dataset assembled achieved', createdAt: '2026-05-28T15:00:00.000Z' },
  { id: 'log-project-3', workspaceId: 'ws-climate-adaptation-project', type: 'task-created', actor: 'maria', actorName: MARIA.displayName, message: 'Task Synthesise policy recommendations created', createdAt: '2026-07-10T09:00:00.000Z' },
  { id: 'log-project-4', workspaceId: 'ws-climate-adaptation-project', type: 'invitation-sent', actor: 'maria', actorName: MARIA.displayName, message: 'Invited Dr. Thabo Dube', createdAt: daysAgo(2, 9) },
];

const CLIMATE_ADAPTATION_PROJECT: CollaborationWorkspace = createWorkspace({
  id: 'ws-climate-adaptation-project',
  name: 'Climate Adaptation Project',
  kind: 'project-workspace',
  description: 'Project workspace for funded climate adaptation research — coastal erosion modelling and the research collaboration network.',
  visibility: 'members',
  status: 'active',
  owner: 'maria',
  ownerName: MARIA.displayName,
  sourceId: 'grant-dff-2021-087',
  sourceEntity: 'grant',
  sourceTitle: 'Climate Adaptation Research Grant',
  tags: ['climate', 'adaptation', 'modelling', 'networks'],
  members: projectMembers,
  createdAt: '2025-01-10T09:00:00.000Z',
});

CLIMATE_ADAPTATION_PROJECT.tasks = projectTasks;
CLIMATE_ADAPTATION_PROJECT.documents = projectDocuments;
CLIMATE_ADAPTATION_PROJECT.meetings = projectMeetings;
CLIMATE_ADAPTATION_PROJECT.milestones = projectMilestones;
CLIMATE_ADAPTATION_PROJECT.discussions = projectDiscussions;
CLIMATE_ADAPTATION_PROJECT.invitations = projectInvitations;
CLIMATE_ADAPTATION_PROJECT.log = projectLog;
CLIMATE_ADAPTATION_PROJECT.updatedAt = daysAgo(2, 9);

// ---------------------------------------------------------------------------
// Workspace 4 — institution-space
// ---------------------------------------------------------------------------

const institutionMembers: CollaborationMember[] = [
  memberOf('ojuri', 'owner', 'active', '2024-06-01T09:00:00.000Z'),
  memberOf('adebayo', 'admin', 'active', '2024-06-02T10:00:00.000Z'),
  memberOf('smith', 'editor', 'active', '2024-06-10T09:00:00.000Z'),
  memberOf('jscholar', 'member', 'active', '2024-07-01T09:00:00.000Z'),
  memberOf('okonkwo', 'member', 'active', '2024-08-01T09:00:00.000Z'),
];

const institutionTasks: WorkspaceTask[] = [
  {
    id: 'task-inst-1',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Faculty research showcase',
    description: 'Organise the annual faculty research showcase across all departments.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'adebayo',
    assigneeName: ADEBAYO.displayName,
    dueDate: '2026-09-10T00:00:00.000Z',
    createdBy: 'ojuri',
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'task-inst-2',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Update institutional profile',
    description: 'Refresh the institutional public profile with the latest outputs.',
    status: 'todo',
    priority: 'medium',
    assignee: 'jscholar',
    assigneeName: JSCHOLAR.displayName,
    dueDate: '2026-08-22T00:00:00.000Z',
    createdBy: 'ojuri',
    createdAt: '2026-07-05T09:00:00.000Z',
  },
];

const institutionDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-inst-1',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Annual research highlights',
    type: 'report',
    status: 'in-review',
    author: 'adebayo',
    authorName: ADEBAYO.displayName,
    updatedAt: '2026-07-21T10:00:00.000Z',
    version: 1,
  },
  {
    id: 'doc-inst-2',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Institutional data management guideline',
    type: 'guideline',
    status: 'published',
    author: 'ojuri',
    authorName: OJURI.displayName,
    updatedAt: '2026-05-10T09:00:00.000Z',
    version: 2,
  },
];

const institutionMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-inst-1',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Research committee',
    scheduledAt: daysAgo(6, 14),
    status: 'completed',
    attendees: ['ojuri', 'adebayo', 'smith', 'jscholar'],
    agenda: 'Showcase planning, profile refresh, cross-department priorities.',
  },
  {
    id: 'meet-inst-2',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Showcase kick-off',
    scheduledAt: daysAhead(12, 10),
    status: 'scheduled',
    attendees: ['ojuri', 'adebayo'],
    agenda: 'Venue, call for participation, judging criteria.',
  },
];

const institutionMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-inst-1',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Data guideline published',
    description: 'Institutional research data management guideline published.',
    status: 'achieved',
    stageId: 'knowledge-transfer',
    targetDate: '2026-05-15T00:00:00.000Z',
    achievedAt: '2026-05-10T09:00:00.000Z',
  },
  {
    id: 'ms-inst-2',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Showcase delivered',
    description: 'Annual faculty research showcase delivered.',
    status: 'planned',
    stageId: 'conference',
    targetDate: '2026-09-15T00:00:00.000Z',
  },
];

const institutionDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-inst-1',
    workspaceId: 'ws-university-of-ibadan',
    title: 'Showcase categories',
    body: 'Proposed categories for the showcase — open to suggestions.',
    author: 'ojuri',
    authorName: OJURI.displayName,
    status: 'open',
    replies: [],
    createdAt: daysAgo(5, 9),
  },
];

const institutionInvitations: WorkspaceInvitation[] = [];

const institutionLog: WorkspaceLogEntry[] = [
  { id: 'log-inst-1', workspaceId: 'ws-university-of-ibadan', type: 'created', actor: 'ojuri', actorName: OJURI.displayName, message: 'Workspace created', createdAt: '2024-06-01T09:00:00.000Z' },
  { id: 'log-inst-2', workspaceId: 'ws-university-of-ibadan', type: 'milestone-achieved', actor: 'ojuri', actorName: OJURI.displayName, message: 'Milestone Data guideline published achieved', createdAt: '2026-05-10T09:00:00.000Z' },
  { id: 'log-inst-3', workspaceId: 'ws-university-of-ibadan', type: 'discussion-opened', actor: 'ojuri', actorName: OJURI.displayName, message: 'Opened discussion Showcase categories', createdAt: daysAgo(5, 9) },
];

const UNIVERSITY_OF_IBADAN: CollaborationWorkspace = createWorkspace({
  id: 'ws-university-of-ibadan',
  name: 'University of Ibadan',
  kind: 'institution-space',
  description: 'Institutional research space for the University of Ibadan — faculty showcase, outputs, and cross-department collaboration.',
  visibility: 'institution',
  status: 'active',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  sourceTitle: 'University of Ibadan',
  tags: ['university', 'institution', 'faculty', 'research-committee'],
  members: institutionMembers,
  createdAt: '2024-06-01T09:00:00.000Z',
});

UNIVERSITY_OF_IBADAN.tasks = institutionTasks;
UNIVERSITY_OF_IBADAN.documents = institutionDocuments;
UNIVERSITY_OF_IBADAN.meetings = institutionMeetings;
UNIVERSITY_OF_IBADAN.milestones = institutionMilestones;
UNIVERSITY_OF_IBADAN.discussions = institutionDiscussions;
UNIVERSITY_OF_IBADAN.invitations = institutionInvitations;
UNIVERSITY_OF_IBADAN.log = institutionLog;
UNIVERSITY_OF_IBADAN.updatedAt = daysAgo(5, 9);

// ---------------------------------------------------------------------------
// Workspace 5 — conference-space
// ---------------------------------------------------------------------------

const conferenceMembers: CollaborationMember[] = [
  memberOf('smith', 'owner', 'active', '2026-01-05T09:00:00.000Z'),
  memberOf('jscholar', 'admin', 'active', '2026-01-06T10:00:00.000Z'),
  memberOf('wang', 'editor', 'active', '2026-01-20T09:00:00.000Z'),
  memberOf('tanaka', 'member', 'active', '2026-02-01T09:00:00.000Z'),
];

const conferenceTasks: WorkspaceTask[] = [
  {
    id: 'task-conf-1',
    workspaceId: 'ws-acl-2026',
    title: 'Collect camera-ready papers',
    description: 'Chase camera-ready submissions and verify formatting compliance.',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'jscholar',
    assigneeName: JSCHOLAR.displayName,
    dueDate: '2026-08-15T00:00:00.000Z',
    createdBy: 'smith',
    createdAt: '2026-06-30T09:00:00.000Z',
  },
  {
    id: 'task-conf-2',
    workspaceId: 'ws-acl-2026',
    title: 'Assign review matches',
    description: 'Finalise reviewer assignments for the late-breaking papers.',
    status: 'in-review',
    priority: 'high',
    assignee: 'wang',
    assigneeName: WANG.displayName,
    dueDate: '2026-08-05T00:00:00.000Z',
    createdBy: 'smith',
    createdAt: '2026-07-02T09:00:00.000Z',
  },
  {
    id: 'task-conf-3',
    workspaceId: 'ws-acl-2026',
    title: 'Schedule poster sessions',
    status: 'todo',
    priority: 'medium',
    assignee: 'tanaka',
    assigneeName: TANAKA.displayName,
    dueDate: '2026-08-25T00:00:00.000Z',
    createdBy: 'jscholar',
    createdAt: '2026-07-12T09:00:00.000Z',
  },
];

const conferenceDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-conf-1',
    workspaceId: 'ws-acl-2026',
    title: 'Call for papers',
    type: 'reference',
    status: 'published',
    author: 'smith',
    authorName: SMITH.displayName,
    updatedAt: '2026-01-10T09:00:00.000Z',
    version: 1,
  },
  {
    id: 'doc-conf-2',
    workspaceId: 'ws-acl-2026',
    title: 'Reviewer guidelines',
    type: 'guideline',
    status: 'published',
    author: 'jscholar',
    authorName: JSCHOLAR.displayName,
    updatedAt: '2026-02-01T09:00:00.000Z',
    version: 1,
  },
];

const conferenceMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-conf-1',
    workspaceId: 'ws-acl-2026',
    title: 'Programme committee meeting',
    scheduledAt: daysAhead(9, 16),
    status: 'scheduled',
    attendees: ['smith', 'jscholar', 'wang', 'tanaka'],
    agenda: 'Final programme, poster session allocation, acceptance decisions.',
  },
];

const conferenceMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-conf-1',
    workspaceId: 'ws-acl-2026',
    title: 'Call published',
    description: 'The call for papers is public.',
    status: 'achieved',
    stageId: 'submission',
    targetDate: '2026-01-15T00:00:00.000Z',
    achievedAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'ms-conf-2',
    workspaceId: 'ws-acl-2026',
    title: 'Acceptance notifications',
    description: 'Acceptance notifications sent to all authors.',
    status: 'planned',
    stageId: 'peer-review',
    targetDate: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'ms-conf-3',
    workspaceId: 'ws-acl-2026',
    title: 'Conference delivered',
    description: 'The conference is delivered end-to-end.',
    status: 'planned',
    stageId: 'conference',
    targetDate: '2026-09-15T00:00:00.000Z',
  },
];

const conferenceDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-conf-1',
    workspaceId: 'ws-acl-2026',
    title: 'Virtual session format',
    body: 'Hybrid or fully virtual for the late-breaking track?',
    author: 'smith',
    authorName: SMITH.displayName,
    status: 'open',
    replies: [],
    createdAt: daysAgo(4, 9),
  },
];

const conferenceInvitations: WorkspaceInvitation[] = [
  {
    id: 'inv-conf-1',
    workspaceId: 'ws-acl-2026',
    invitedBy: 'smith',
    invitedByName: SMITH.displayName,
    invitee: 'tanaka',
    inviteeName: TANAKA.displayName,
    role: 'member',
    status: 'accepted',
    createdAt: '2026-01-20T09:00:00.000Z',
  },
];

const conferenceLog: WorkspaceLogEntry[] = [
  { id: 'log-conf-1', workspaceId: 'ws-acl-2026', type: 'created', actor: 'smith', actorName: SMITH.displayName, message: 'Workspace created', createdAt: '2026-01-05T09:00:00.000Z' },
  { id: 'log-conf-2', workspaceId: 'ws-acl-2026', type: 'document-published', actor: 'smith', actorName: SMITH.displayName, message: 'Call for papers published', createdAt: '2026-01-10T09:00:00.000Z' },
  { id: 'log-conf-3', workspaceId: 'ws-acl-2026', type: 'milestone-achieved', actor: 'smith', actorName: SMITH.displayName, message: 'Milestone Call published achieved', createdAt: '2026-01-10T09:05:00.000Z' },
  { id: 'log-conf-4', workspaceId: 'ws-acl-2026', type: 'meeting-scheduled', actor: 'smith', actorName: SMITH.displayName, message: 'Scheduled Programme committee meeting', createdAt: daysAgo(3, 11) },
];

const ACL_2026: CollaborationWorkspace = createWorkspace({
  id: 'ws-acl-2026',
  name: 'ACL 2026',
  kind: 'conference-space',
  description: 'Conference workspace for ACL 2026 — programme committee, submissions, reviews, and scheduling.',
  visibility: 'public',
  status: 'active',
  owner: 'smith',
  ownerName: SMITH.displayName,
  sourceId: 'CONF-001',
  sourceEntity: 'conference',
  sourceTitle: 'ACL 2026',
  tags: ['conference', 'nlp', 'acl', 'programme'],
  members: conferenceMembers,
  createdAt: '2026-01-05T09:00:00.000Z',
});

ACL_2026.tasks = conferenceTasks;
ACL_2026.documents = conferenceDocuments;
ACL_2026.meetings = conferenceMeetings;
ACL_2026.milestones = conferenceMilestones;
ACL_2026.discussions = conferenceDiscussions;
ACL_2026.invitations = conferenceInvitations;
ACL_2026.log = conferenceLog;
ACL_2026.updatedAt = daysAgo(3, 11);

// ---------------------------------------------------------------------------
// Workspace 6 — journal-space
// ---------------------------------------------------------------------------

const journalMembers: CollaborationMember[] = [
  memberOf('jscholar', 'owner', 'active', '2025-03-01T09:00:00.000Z'),
  memberOf('smith', 'admin', 'active', '2025-03-05T10:00:00.000Z'),
  memberOf('ojuri', 'editor', 'active', '2025-04-01T09:00:00.000Z'),
  memberOf('adesina', 'member', 'active', '2025-05-01T09:00:00.000Z'),
];

const journalTasks: WorkspaceTask[] = [
  {
    id: 'task-journal-1',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Solicit special issue reviewers',
    description: 'Build the reviewer pool for the special issue on reproducibility.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'smith',
    assigneeName: SMITH.displayName,
    dueDate: '2026-08-18T00:00:00.000Z',
    createdBy: 'jscholar',
    createdAt: '2026-06-25T09:00:00.000Z',
  },
  {
    id: 'task-journal-2',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Compile editorial board report',
    status: 'todo',
    priority: 'medium',
    assignee: 'adesina',
    assigneeName: ADESINA.displayName,
    dueDate: '2026-09-05T00:00:00.000Z',
    createdBy: 'jscholar',
    createdAt: '2026-07-15T09:00:00.000Z',
  },
];

const journalDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-journal-1',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Author guidelines',
    type: 'guideline',
    status: 'published',
    author: 'jscholar',
    authorName: JSCHOLAR.displayName,
    updatedAt: '2025-03-15T09:00:00.000Z',
    version: 3,
  },
  {
    id: 'doc-journal-2',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Special issue call for papers',
    type: 'reference',
    status: 'published',
    author: 'jscholar',
    authorName: JSCHOLAR.displayName,
    updatedAt: '2026-04-10T09:00:00.000Z',
    version: 1,
  },
];

const journalMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-journal-1',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Editorial board call',
    scheduledAt: daysAhead(15, 14),
    status: 'scheduled',
    attendees: ['jscholar', 'smith', 'ojuri', 'adesina'],
    agenda: 'Special issue progress, reviewer pool, production pipeline.',
  },
];

const journalMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-journal-1',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Special issue announced',
    description: 'The reproducibility special issue is publicly announced.',
    status: 'achieved',
    stageId: 'publication',
    targetDate: '2026-04-15T00:00:00.000Z',
    achievedAt: '2026-04-10T09:00:00.000Z',
  },
  {
    id: 'ms-journal-2',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'First accepted article',
    description: 'The first special issue article is accepted.',
    status: 'in-progress',
    stageId: 'peer-review',
    targetDate: '2026-08-30T00:00:00.000Z',
  },
];

const journalDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-journal-1',
    workspaceId: 'ws-journal-of-scholarly-open-research',
    title: 'Reviewer incentives',
    body: 'What incentives should the journal offer reviewers for the special issue?',
    author: 'jscholar',
    authorName: JSCHOLAR.displayName,
    status: 'open',
    replies: [],
    createdAt: daysAgo(2, 9),
  },
];

const journalInvitations: WorkspaceInvitation[] = [];

const journalLog: WorkspaceLogEntry[] = [
  { id: 'log-journal-1', workspaceId: 'ws-journal-of-scholarly-open-research', type: 'created', actor: 'jscholar', actorName: JSCHOLAR.displayName, message: 'Workspace created', createdAt: '2025-03-01T09:00:00.000Z' },
  { id: 'log-journal-2', workspaceId: 'ws-journal-of-scholarly-open-research', type: 'milestone-achieved', actor: 'jscholar', actorName: JSCHOLAR.displayName, message: 'Milestone Special issue announced achieved', createdAt: '2026-04-10T09:00:00.000Z' },
  { id: 'log-journal-3', workspaceId: 'ws-journal-of-scholarly-open-research', type: 'discussion-opened', actor: 'jscholar', actorName: JSCHOLAR.displayName, message: 'Opened discussion Reviewer incentives', createdAt: daysAgo(2, 9) },
];

const JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH: CollaborationWorkspace = createWorkspace({
  id: 'ws-journal-of-scholarly-open-research',
  name: 'Journal of Scholarly Open Research',
  kind: 'journal-space',
  description: 'Journal workspace — editorial board operations, special issues, and production pipeline for the open research journal.',
  visibility: 'institution',
  status: 'active',
  owner: 'jscholar',
  ownerName: JSCHOLAR.displayName,
  sourceId: 'JNL-001',
  sourceEntity: 'journal',
  sourceTitle: 'Journal of Scholarly Open Research',
  tags: ['journal', 'open-research', 'editorial', 'special-issue'],
  members: journalMembers,
  createdAt: '2025-03-01T09:00:00.000Z',
});

JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.tasks = journalTasks;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.documents = journalDocuments;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.meetings = journalMeetings;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.milestones = journalMilestones;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.discussions = journalDiscussions;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.invitations = journalInvitations;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.log = journalLog;
JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH.updatedAt = daysAgo(2, 9);

// ---------------------------------------------------------------------------
// Workspace 7 — community
// ---------------------------------------------------------------------------

const communityMembers: CollaborationMember[] = [
  memberOf('adesina', 'owner', 'active', '2024-09-01T09:00:00.000Z'),
  memberOf('okonkwo', 'admin', 'active', '2024-09-10T10:00:00.000Z'),
  memberOf('dube', 'editor', 'active', '2024-10-01T09:00:00.000Z'),
  memberOf('maria', 'member', 'active', '2025-01-01T09:00:00.000Z'),
  memberOf('wang', 'member', 'active', '2025-02-01T09:00:00.000Z'),
];

const communityTasks: WorkspaceTask[] = [
  {
    id: 'task-community-1',
    workspaceId: 'ws-open-science-community',
    title: 'Run reproducibility workshop',
    description: 'Coordinate the community reproducibility workshop with the special issue.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'dube',
    assigneeName: DUBE.displayName,
    dueDate: '2026-08-28T00:00:00.000Z',
    createdBy: 'adesina',
    createdAt: '2026-06-18T09:00:00.000Z',
  },
  {
    id: 'task-community-2',
    workspaceId: 'ws-open-science-community',
    title: 'Maintain resource hub',
    description: 'Curate the community resource hub with new templates and guides.',
    status: 'todo',
    priority: 'medium',
    assignee: 'okonkwo',
    assigneeName: OKONKWO.displayName,
    dueDate: '2026-09-12T00:00:00.000Z',
    createdBy: 'adesina',
    createdAt: '2026-07-08T09:00:00.000Z',
  },
];

const communityDocuments: WorkspaceDocument[] = [
  {
    id: 'doc-community-1',
    workspaceId: 'ws-open-science-community',
    title: 'Open science starter kit',
    type: 'guideline',
    status: 'published',
    author: 'adesina',
    authorName: ADESINA.displayName,
    updatedAt: '2026-03-20T09:00:00.000Z',
    version: 2,
  },
  {
    id: 'doc-community-2',
    workspaceId: 'ws-open-science-community',
    title: 'Workshop agenda draft',
    type: 'note',
    status: 'draft',
    author: 'dube',
    authorName: DUBE.displayName,
    updatedAt: '2026-07-22T09:00:00.000Z',
    version: 1,
  },
];

const communityMeetings: WorkspaceMeeting[] = [
  {
    id: 'meet-community-1',
    workspaceId: 'ws-open-science-community',
    title: 'Community town hall',
    scheduledAt: daysAhead(6, 17),
    status: 'scheduled',
    attendees: ['adesina', 'okonkwo', 'dube', 'maria', 'wang'],
    agenda: 'Workshop logistics, resource hub roadmap, new contributor onboarding.',
  },
];

const communityMilestones: WorkspaceMilestone[] = [
  {
    id: 'ms-community-1',
    workspaceId: 'ws-open-science-community',
    title: 'Starter kit published',
    description: 'The open science starter kit is live for the community.',
    status: 'achieved',
    stageId: 'knowledge-transfer',
    targetDate: '2026-03-25T00:00:00.000Z',
    achievedAt: '2026-03-20T09:00:00.000Z',
  },
  {
    id: 'ms-community-2',
    workspaceId: 'ws-open-science-community',
    title: 'Workshop delivered',
    description: 'The reproducibility workshop is delivered.',
    status: 'in-progress',
    stageId: 'impact',
    targetDate: '2026-09-01T00:00:00.000Z',
  },
];

const communityDiscussions: WorkspaceDiscussion[] = [
  {
    id: 'disc-community-1',
    workspaceId: 'ws-open-science-community',
    title: 'Workshop format',
    body: 'Half-day virtual or full-day hybrid for the reproducibility workshop?',
    author: 'adesina',
    authorName: ADESINA.displayName,
    status: 'open',
    replies: [
      {
        id: 'reply-community-1',
        discussionId: 'disc-community-1',
        author: 'dube',
        authorName: DUBE.displayName,
        body: 'Hybrid keeps remote participants engaged while enabling hands-on sessions.',
        createdAt: daysAgo(3, 12),
      },
    ],
    createdAt: daysAgo(5, 10),
  },
];

const communityInvitations: WorkspaceInvitation[] = [
  {
    id: 'inv-community-1',
    workspaceId: 'ws-open-science-community',
    invitedBy: 'adesina',
    invitedByName: ADESINA.displayName,
    invitee: 'maria',
    inviteeName: MARIA.displayName,
    role: 'member',
    status: 'accepted',
    createdAt: '2024-12-20T09:00:00.000Z',
  },
];

const communityLog: WorkspaceLogEntry[] = [
  { id: 'log-community-1', workspaceId: 'ws-open-science-community', type: 'created', actor: 'adesina', actorName: ADESINA.displayName, message: 'Workspace created', createdAt: '2024-09-01T09:00:00.000Z' },
  { id: 'log-community-2', workspaceId: 'ws-open-science-community', type: 'document-published', actor: 'adesina', actorName: ADESINA.displayName, message: 'Open science starter kit published', createdAt: '2026-03-20T09:00:00.000Z' },
  { id: 'log-community-3', workspaceId: 'ws-open-science-community', type: 'milestone-achieved', actor: 'adesina', actorName: ADESINA.displayName, message: 'Milestone Starter kit published achieved', createdAt: '2026-03-20T09:05:00.000Z' },
  { id: 'log-community-4', workspaceId: 'ws-open-science-community', type: 'discussion-opened', actor: 'adesina', actorName: ADESINA.displayName, message: 'Opened discussion Workshop format', createdAt: daysAgo(5, 10) },
];

const OPEN_SCIENCE_COMMUNITY: CollaborationWorkspace = createWorkspace({
  id: 'ws-open-science-community',
  name: 'Open Science Community',
  kind: 'community',
  description: 'A community workspace for reproducible research, open data, and scholarly communication best practice.',
  visibility: 'public',
  status: 'active',
  owner: 'adesina',
  ownerName: ADESINA.displayName,
  tags: ['open-science', 'community', 'reproducibility', 'mentorship'],
  members: communityMembers,
  createdAt: '2024-09-01T09:00:00.000Z',
});

OPEN_SCIENCE_COMMUNITY.tasks = communityTasks;
OPEN_SCIENCE_COMMUNITY.documents = communityDocuments;
OPEN_SCIENCE_COMMUNITY.meetings = communityMeetings;
OPEN_SCIENCE_COMMUNITY.milestones = communityMilestones;
OPEN_SCIENCE_COMMUNITY.discussions = communityDiscussions;
OPEN_SCIENCE_COMMUNITY.invitations = communityInvitations;
OPEN_SCIENCE_COMMUNITY.log = communityLog;
OPEN_SCIENCE_COMMUNITY.updatedAt = daysAgo(3, 12);

// ---------------------------------------------------------------------------
// Workspace 8 — archived workspace (for coverage)
// ---------------------------------------------------------------------------

const ARCHIVED_HEALTH_GROUP: CollaborationWorkspace = createWorkspace({
  id: 'ws-tropical-medicine-archive',
  name: 'Tropical Medicine Archive',
  kind: 'research-group',
  description: 'Archived research group on tropical medicine surveillance (2022–2024).',
  visibility: 'members',
  status: 'archived',
  owner: 'ojuri',
  ownerName: OJURI.displayName,
  sourceId: 'INST-UI-001',
  sourceEntity: 'institution',
  sourceTitle: 'University of Ibadan',
  tags: ['tropical-medicine', 'archive'],
  members: [memberOf('ojuri', 'owner', 'active', '2022-01-01T09:00:00.000Z')],
  createdAt: '2022-01-01T09:00:00.000Z',
});

ARCHIVED_HEALTH_GROUP.tasks = [
  {
    id: 'task-archive-1',
    workspaceId: 'ws-tropical-medicine-archive',
    title: 'Archive field notebooks',
    status: 'done',
    priority: 'low',
    createdBy: 'ojuri',
    createdAt: '2023-06-01T09:00:00.000Z',
    completedAt: '2023-07-01T09:00:00.000Z',
  },
];
ARCHIVED_HEALTH_GROUP.log = [
  { id: 'log-archive-1', workspaceId: 'ws-tropical-medicine-archive', type: 'created', actor: 'ojuri', actorName: OJURI.displayName, message: 'Workspace created', createdAt: '2022-01-01T09:00:00.000Z' },
];
ARCHIVED_HEALTH_GROUP.updatedAt = '2023-07-01T09:00:00.000Z';

// ---------------------------------------------------------------------------
// Derived aggregates — statistics, analytics, insights, portfolio
// ---------------------------------------------------------------------------

export const WORKSPACES: CollaborationWorkspace[] = [
  WEST_AFRICAN_HEALTH_CONSORTIUM,
  MULTILINGUAL_PARSING_LAB,
  CLIMATE_ADAPTATION_PROJECT,
  UNIVERSITY_OF_IBADAN,
  ACL_2026,
  JOURNAL_OF_SCHOLARLY_OPEN_RESEARCH,
  OPEN_SCIENCE_COMMUNITY,
  ARCHIVED_HEALTH_GROUP,
];

export const COLLABORATION_STATISTICS: CollaborationStatistics = collaborationStatistics(WORKSPACES);
export const COLLABORATION_ANALYTICS: CollaborationAnalytics = collaborationAnalytics(WORKSPACES, NOW);
export const INSIGHTS: CollaborationInsight[] = collaborationInsights(WORKSPACES);
export const COLLABORATION_PORTFOLIO: CollaborationPortfolio = buildCollaborationPortfolio(WORKSPACES, { now: NOW, top: 10 });

export const FEATURED_WORKSPACES = COLLABORATION_PORTFOLIO.featured;
export const CURRENT_COLLABORATION_USER = CURRENT_USER;
export const DEFAULT_WORKSPACE_KIND = 'research-group' as const;
export const DEFAULT_WORKSPACE_VISIBILITY = 'members' as const;
export const DEFAULT_WORKSPACE = WEST_AFRICAN_HEALTH_CONSORTIUM;

export type {
  WorkspaceDiscussion,
  WorkspaceDocument,
  WorkspaceInvitation,
  WorkspaceLogEntry,
  WorkspaceMeeting,
  WorkspaceMilestone,
  WorkspaceTask,
};
