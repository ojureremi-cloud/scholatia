import type {
  Conversation,
  ConversationMember,
  ConversationRole,
  ConversationSummary,
  Message,
  MessageAnalytics,
  MessageArchive,
  MessageAttachment,
  MessageMention,
  MessageMute,
  MessagePin,
  MessageReaction,
  MessageStatistics,
  MessageStatus,
  MessageType,
  ReadReceipt,
  StarredMessage,
  TypingIndicator,
} from '@/types/messages';
import {
  archiveConversation,
  createConversation,
  createMessage,
  defaultPermissionsForRole,
  extractActionItems,
  findConversationBetween,
  hashtagsForConversation,
  messageAnalytics,
  messageStatistics,
  muteConversation,
  summarizeConversation,
  unreadConversationIds,
} from '@/lib/messages';
import type { ResearcherProfile } from '@/types/researcher';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Placeholder data for the Scholatia Messaging Platform (Phase 2.2B).
 *
 * The messaging platform owns no records: every conversation references a
 * canonical Scholatia record through its `context` (a researcher, journal,
 * conference, institution, publisher, project, grant, order, service, or
 * listing), and every member is a canonical researcher username or module id.
 * This is the single source of truth that supersedes the legacy lightweight
 * Marketplace conversation model — marketplace/service/order conversations
 * reference the same canonical orders and services the commerce and services
 * modules already expose.
 *
 * Deliveries are decomposed into per-recipient statuses and read receipts,
 * and AI-ready insights (summaries, action items, meeting notes, reply
 * suggestions, collaboration opportunities) are derived by the pure engine in
 * `lib/messages.ts` — no schema change is ever needed.
 */

const CURRENT_USER = 'ojuri';

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
const JSCHOLAR = researcherOf('jscholar');
const ADEBAYO = researcherOf('adebayo');
const OKONKWO = researcherOf('okonkwo');
const ADESINA = researcherOf('adesina');

/** A researcher participant identified by canonical username. */
function memberOf(profile: ResearcherProfile, role: ConversationRole, joinedAt: string): ConversationMember {
  return {
    id: profile.username,
    username: profile.username,
    name: profile.displayName,
    avatar: profile.avatar,
    role,
    permissions: defaultPermissionsForRole(role),
    joinedAt,
  };
}

/** A non-researcher participant (a module, a vendor, support) by canonical id. */
function staff(id: string, name: string, role: ConversationRole, joinedAt: string, avatar?: string): ConversationMember {
  return {
    id,
    name,
    avatar,
    role,
    permissions: defaultPermissionsForRole(role),
    joinedAt,
  };
}

// ---------------------------------------------------------------------------
// Message seed helper
// ---------------------------------------------------------------------------

type MessageSeed = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  body: string;
  type?: MessageType;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  mentions?: MessageMention[];
  hashtags?: string[];
  replyToId?: string;
  createdAt: string;
  status?: MessageStatus;
  editedAt?: string;
  editCount?: number;
  deletedAt?: string;
  deletedBy?: string;
  pinnedAt?: string;
  pinnedBy?: string;
  starredAt?: string;
  starredBy?: string;
  deliveredAt?: string;
  readReceipts?: ReadReceipt[];
  metadata?: Record<string, string>;
};

function message(seed: MessageSeed): Message {
  const base = createMessage({
    id: seed.id,
    conversationId: seed.conversationId,
    senderId: seed.senderId,
    senderName: seed.senderName,
    senderUsername: seed.senderUsername,
    type: seed.type,
    body: seed.body,
    attachments: seed.attachments,
    reactions: seed.reactions,
    mentions: seed.mentions,
    hashtags: seed.hashtags,
    replyToId: seed.replyToId,
    createdAt: seed.createdAt,
  });
  return {
    ...base,
    status: seed.status ?? base.status,
    editedAt: seed.editedAt,
    editCount: seed.editCount ?? 0,
    deletedAt: seed.deletedAt,
    deletedBy: seed.deletedBy,
    pinnedAt: seed.pinnedAt,
    pinnedBy: seed.pinnedBy,
    starredAt: seed.starredAt,
    starredBy: seed.starredBy,
    deliveredAt: seed.deliveredAt,
    readReceipts: seed.readReceipts ?? [],
    metadata: seed.metadata ?? {},
  };
}

function receipt(readerId: string, readerName: string, readAt: string): ReadReceipt {
  return { readerId, readerName, readAt };
}

function reaction(emoji: string, actor: ResearcherProfile, createdAt: string): MessageReaction {
  return { emoji, actorId: actor.username, actorName: actor.displayName, createdAt };
}

// ---------------------------------------------------------------------------
// Conversations (one per conversation kind, all 11 modules)
// ---------------------------------------------------------------------------

export const CONVERSATIONS: Conversation[] = [
  createConversation({
    id: 'conv-ojuri-smith',
    type: 'direct',
    title: 'Editorial collaboration',
    description: 'Direct line on manuscript MS-2026-0014 — structural edits, reviewer responses, and the Cambridge open manuscripts catalogue.',
    context: { entityType: 'manuscript', id: 'MS-2026-0014', title: 'Language preservation through transfer learning', url: '/manuscripts', stageId: 'manuscript' },
    members: [
      memberOf(OJURI, 'owner', '2026-07-02T08:00:00.000Z'),
      memberOf(SMITH, 'member', '2026-07-02T08:05:00.000Z'),
    ],
    settings: { aiAssistEnabled: true, readReceipts: true, typingIndicators: true },
    lastMessageAt: '2026-07-30T16:42:00.000Z',
    lastMessagePreview: 'Agreed — I will share the annotated corpus by Friday.',
    createdAt: '2026-07-02T08:00:00.000Z',
  }),
  createConversation({
    id: 'conv-west-africa-health-data-group',
    type: 'group',
    title: 'West Africa Health Data Working Group',
    description: 'Cross-institutional working group standardising disease surveillance data across Nigeria, Ghana, and South Africa.',
    context: { entityType: 'group', id: 'west-africa-health-data-group', title: 'Health data standards' },
    members: [
      memberOf(OJURI, 'owner', '2026-05-14T09:00:00.000Z'),
      memberOf(ADEBAYO, 'admin', '2026-05-14T09:10:00.000Z'),
      memberOf(OKONKWO, 'member', '2026-05-15T07:30:00.000Z'),
      memberOf(ADESINA, 'member', '2026-05-15T07:45:00.000Z'),
    ],
    topics: [
      { id: 'topic-surveillance', label: 'Surveillance standards', context: { entityType: 'dataset', id: 'ds-malaria-surveillance' } },
      { id: 'topic-capacity', label: 'Field capacity building' },
    ],
    settings: { mentionsEnabled: true, hashtagsEnabled: true, aiAssistEnabled: true },
    lastMessageAt: '2026-07-29T11:20:00.000Z',
    lastMessagePreview: 'Decision: the standardised schema ships with the August release.',
    createdAt: '2026-05-14T09:00:00.000Z',
  }),
  createConversation({
    id: 'conv-uni-ibadan-faculty',
    type: 'institution',
    title: 'Faculty of Medicine — Research reporting',
    description: 'University of Ibadan research office reporting channel for the Faculty of Medicine.',
    context: { entityType: 'institution', id: 'INST-UI-001', title: 'University of Ibadan', url: '/institutions', stageId: 'impact' },
    members: [
      memberOf(OJURI, 'owner', '2026-01-20T08:00:00.000Z'),
      staff('INST-UI-001', 'University of Ibadan — Research Office', 'admin', '2026-01-20T08:00:00.000Z', '🎓'),
    ],
    settings: { attachmentsEnabled: true, aiAssistEnabled: true },
    lastMessageAt: '2026-07-28T13:10:00.000Z',
    lastMessagePreview: 'Thank you — the annual report has been logged for the committee.',
    createdAt: '2026-01-20T08:00:00.000Z',
  }),
  createConversation({
    id: 'conv-scholatia-press-agreement',
    type: 'publisher',
    title: 'Open access agreement — Scholatia Press',
    description: 'Open access fee waiver and repository deposit agreement with Scholatia Press.',
    context: { entityType: 'publisher', id: 'scholatia-press', title: 'Scholatia Press', url: '/publishers' },
    members: [
      memberOf(OJURI, 'owner', '2026-06-03T10:00:00.000Z'),
      staff('scholatia-press', 'Scholatia Press — Editorial Office', 'admin', '2026-06-03T10:00:00.000Z', '🏛️'),
    ],
    settings: { aiAssistEnabled: true },
    lastMessageAt: '2026-07-27T15:45:00.000Z',
    lastMessagePreview: 'The waiver has been applied to your accepted article.',
    createdAt: '2026-06-03T10:00:00.000Z',
  }),
  createConversation({
    id: 'conv-siri-2026-presentation',
    type: 'conference',
    title: 'SIRI 2026 — Presentation scheduling',
    description: 'SIRI 2026 abstract, session scheduling, and poster logistics.',
    context: { entityType: 'conference', id: 'CONF-001', title: 'Scholatia International Conference on Research and Innovation', url: '/conferences', stageId: 'conference' },
    members: [
      memberOf(OJURI, 'owner', '2026-04-11T09:00:00.000Z'),
      staff('CONF-001', 'SIRI 2026 — Programme Committee', 'admin', '2026-04-11T09:00:00.000Z', '🎤'),
    ],
    settings: { aiAssistEnabled: true },
    lastMessageAt: '2026-07-26T12:30:00.000Z',
    lastMessagePreview: 'Your session is confirmed for 14:30 on day two.',
    createdAt: '2026-04-11T09:00:00.000Z',
  }),
  createConversation({
    id: 'conv-sjor-editorial',
    type: 'journal',
    title: 'SJOR — Editorial review',
    description: 'Peer review and editorial correspondence with the Scholatia Journal of Open Research.',
    context: { entityType: 'journal', id: 'JNL-001', title: 'Scholatia Journal of Open Research', url: '/journals', stageId: 'peer-review' },
    members: [
      memberOf(OJURI, 'owner', '2026-06-22T11:00:00.000Z'),
      staff('JNL-001', 'SJOR — Editorial Office', 'admin', '2026-06-22T11:00:00.000Z', '🗞️'),
    ],
    settings: { aiAssistEnabled: true, readReceipts: true },
    lastMessageAt: '2026-07-25T10:05:00.000Z',
    lastMessagePreview: 'We have returned the revised manuscript for final checks.',
    createdAt: '2026-06-22T11:00:00.000Z',
  }),
  createConversation({
    id: 'conv-multilingual-parsing-framework',
    type: 'project',
    title: 'Multilingual Parsing Framework — health corpus',
    description: 'Cross-lingual dependency parsing with a health-domain annotation work package for low-resource West African languages.',
    context: { entityType: 'project', id: 'multilingual-parsing-framework', title: 'Multilingual Parsing Framework', url: '/research/multilingual-parsing-framework', stageId: 'project' },
    members: [
      memberOf(JSCHOLAR, 'owner', '2026-03-08T08:00:00.000Z'),
      memberOf(OJURI, 'member', '2026-03-08T08:30:00.000Z'),
      memberOf(SMITH, 'member', '2026-03-09T09:00:00.000Z'),
    ],
    topics: [
      { id: 'topic-corpus', label: 'Health corpus annotation', context: { entityType: 'dataset', id: 'grant-nrc-2022-113' } },
      { id: 'topic-transfer', label: 'Transfer learning' },
    ],
    settings: { aiAssistEnabled: true, mentionsEnabled: true },
    lastMessageAt: '2026-07-24T17:55:00.000Z',
    lastMessagePreview: 'The transfer learning module hits 50 languages with the health subset.',
    createdAt: '2026-03-08T08:00:00.000Z',
  }),
  createConversation({
    id: 'conv-grant-nrc-2022-113',
    type: 'grant',
    title: 'NRC Grant 2022/113 — reporting',
    description: 'Reporting and milestone tracking for the National Research Council grant underpinning the parsing framework.',
    context: { entityType: 'funding', id: 'grant-nrc-2022-113', title: 'National Research Council Grant 2022/113', url: '/funding', stageId: 'funding' },
    members: [
      memberOf(JSCHOLAR, 'owner', '2026-02-15T09:00:00.000Z'),
      memberOf(OJURI, 'member', '2026-02-15T09:30:00.000Z'),
      memberOf(SMITH, 'member', '2026-02-16T10:00:00.000Z'),
    ],
    settings: { aiAssistEnabled: true },
    lastMessageAt: '2026-07-23T09:40:00.000Z',
    lastMessagePreview: 'Mid-year report uploaded — expenditure is on track at 52%.',
    createdAt: '2026-02-15T09:00:00.000Z',
  }),
  createConversation({
    id: 'conv-statistical-analysis-order',
    type: 'marketplace',
    title: 'Ibadan Statistics Lab — Order 2026-0001',
    description: 'Statistical design and analysis for the national malaria surveillance study, delivered under order ord-2026-0001.',
    context: { entityType: 'order', id: 'ord-2026-0001', title: 'Statistical analysis service', url: '/commerce' },
    members: [
      memberOf(OJURI, 'owner', '2026-07-02T10:00:00.000Z'),
      staff('vendor-ibadan-statistics-lab', 'Ibadan Statistics Lab', 'admin', '2026-07-02T10:00:00.000Z', '🛍️'),
    ],
    settings: { attachmentsEnabled: true, aiAssistEnabled: true },
    lastMessageAt: '2026-07-22T14:20:00.000Z',
    lastMessagePreview: 'Final report and analysis scripts have been delivered.',
    createdAt: '2026-07-02T10:00:00.000Z',
  }),
  createConversation({
    id: 'conv-editing-service',
    type: 'service',
    title: 'Academic editing service — MS-2026-0014',
    description: 'Language polishing and structural editing engagement for manuscript MS-2026-0014.',
    context: { entityType: 'service', id: 'svc-editing-proofreading-1', title: 'Academic English language polishing', url: '/services' },
    members: [
      memberOf(OJURI, 'owner', '2026-06-18T09:00:00.000Z'),
      memberOf(JSCHOLAR, 'admin', '2026-06-18T09:05:00.000Z'),
    ],
    settings: { aiAssistEnabled: true, readReceipts: true },
    lastMessageAt: '2026-07-21T16:05:00.000Z',
    lastMessagePreview: 'Edited manuscript returned with tracked changes.',
    createdAt: '2026-06-18T09:00:00.000Z',
  }),
  createConversation({
    id: 'conv-scholatia-support',
    type: 'support',
    title: 'Scholatia Support — institution verification',
    description: 'Support ticket about institution verification delays and notification settings.',
    context: { entityType: 'community', id: 'scholatia-support', title: 'Scholatia Support' },
    members: [
      memberOf(OJURI, 'owner', '2026-07-01T08:30:00.000Z'),
      staff('scholatia-support', 'Scholatia Support', 'admin', '2026-07-01T08:30:00.000Z', '🎧'),
    ],
    settings: { aiAssistEnabled: true },
    lastMessageAt: '2026-07-20T18:10:00.000Z',
    lastMessagePreview: 'Verification is now approved — apologies for the delay.',
    createdAt: '2026-07-01T08:30:00.000Z',
  }),
];

// ---------------------------------------------------------------------------
// Messages (one conversation after another, chronological within each)
// ---------------------------------------------------------------------------

export const MESSAGES: Message[] = [
  // conv-ojuri-smith — direct editorial collaboration
  message({
    id: 'msg-smith-1',
    conversationId: 'conv-ojuri-smith',
    senderId: SMITH.username,
    senderName: SMITH.displayName,
    senderUsername: SMITH.username,
    body: 'Good to connect, Adebisi. I have reviewed the transfer-learning sections of MS-2026-0014 and left inline comments.',
    createdAt: '2026-07-02T09:00:00.000Z',
    deliveredAt: '2026-07-02T09:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-02T09:15:00.000Z')],
    reactions: [reaction('👏', OJURI, '2026-07-02T09:15:30.000Z')],
    hashtags: ['manuscript', 'editing'],
    metadata: { thread: 'ms-2026-0014' },
  }),
  message({
    id: 'msg-ojuri-1',
    conversationId: 'conv-ojuri-smith',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Thank you, Henry. I will fold in your comments on the health-corpus evaluation this week.',
    replyToId: 'msg-smith-1',
    createdAt: '2026-07-03T10:30:00.000Z',
    readReceipts: [receipt(SMITH.username, SMITH.displayName, '2026-07-03T10:45:00.000Z')],
  }),
  message({
    id: 'msg-smith-2',
    conversationId: 'conv-ojuri-smith',
    senderId: SMITH.username,
    senderName: SMITH.displayName,
    senderUsername: SMITH.username,
    body: 'Attaching the annotated corpus notes from the Cambridge catalogue — please reuse the tag #reviewers when you reply.',
    attachments: [
      { id: 'att-smith-corpus', type: 'dataset', title: 'Cambridge open manuscripts — annotated subset', entityId: 'ds-cambridge-manuscripts', fileName: 'cambridge-annotations.json' },
    ],
    createdAt: '2026-07-20T12:00:00.000Z',
    deliveredAt: '2026-07-20T12:00:03.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-20T12:20:00.000Z')],
    mentions: [{ username: OJURI.username, userId: OJURI.username, name: OJURI.displayName }],
    hashtags: ['reviewers'],
  }),
  message({
    id: 'msg-ojuri-2',
    conversationId: 'conv-ojuri-smith',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Noted — the health corpus adds 4,200 sentences in Yoruba and Hausa. I will share the annotated subset by Friday. @smith could you confirm the licensing section?',
    replyToId: 'msg-smith-2',
    mentions: [{ username: SMITH.username, userId: SMITH.username, name: SMITH.displayName }],
    createdAt: '2026-07-25T14:00:00.000Z',
    deliveredAt: '2026-07-25T14:00:04.000Z',
    readReceipts: [receipt(SMITH.username, SMITH.displayName, '2026-07-25T14:30:00.000Z')],
    reactions: [reaction('👍', SMITH, '2026-07-25T14:31:00.000Z')],
    hashtags: ['health-corpus'],
  }),
  message({
    id: 'msg-smith-3',
    conversationId: 'conv-ojuri-smith',
    senderId: SMITH.username,
    senderName: SMITH.displayName,
    senderUsername: SMITH.username,
    body: 'Meeting summary — (1) decision: corpus under CC-BY 4.0; (2) outcome: Friday handover; (3) agenda: licensing and the evaluation suite.',
    createdAt: '2026-07-26T09:00:00.000Z',
    deliveredAt: '2026-07-26T09:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-26T09:10:00.000Z')],
    hashtags: ['meeting', 'licensing'],
    metadata: { meeting: 'true' },
  }),
  message({
    id: 'msg-ojuri-3',
    conversationId: 'conv-ojuri-smith',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Agreed — I will share the annotated corpus by Friday.',
    createdAt: '2026-07-30T16:42:00.000Z',
    deliveredAt: '2026-07-30T16:42:01.000Z',
    status: 'delivered',
    reactions: [reaction('❤️', SMITH, '2026-07-30T16:50:00.000Z')],
    hashtags: ['health-corpus'],
  }),
  // conv-west-africa-health-data-group — group
  message({
    id: 'msg-wahdg-1',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Welcome everyone. This group will align surveillance schemas across Nigeria, Ghana, and South Africa. Action item: each member to share their field schema by next Monday.',
    createdAt: '2026-05-14T10:00:00.000Z',
    readReceipts: [
      receipt(ADEBAYO.username, ADEBAYO.displayName, '2026-05-14T10:20:00.000Z'),
      receipt(OKONKWO.username, OKONKWO.displayName, '2026-05-14T10:30:00.000Z'),
      receipt(ADESINA.username, ADESINA.displayName, '2026-05-14T10:35:00.000Z'),
    ],
    reactions: [reaction('👏', ADEBAYO, '2026-05-14T10:22:00.000Z'), reaction('🤝', OKONKWO, '2026-05-14T10:31:00.000Z')],
    hashtags: ['surveillance'],
  }),
  message({
    id: 'msg-wahdg-2',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: ADEBAYO.username,
    senderName: ADEBAYO.displayName,
    senderUsername: ADEBAYO.username,
    body: 'Sharing our smart-grid-adjacent telemetry schema for comparison — different domain but the event model transfers.',
    attachments: [{ id: 'att-adebayo-schema', type: 'document', title: 'Telemetry event schema', fileName: 'telemetry-schema.json', mimeType: 'application/json' }],
    createdAt: '2026-05-20T09:00:00.000Z',
    deliveredAt: '2026-05-20T09:00:05.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-05-20T09:10:00.000Z')],
    hashtags: ['schema'],
  }),
  message({
    id: 'msg-wahdg-3',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: OKONKWO.username,
    senderName: OKONKWO.displayName,
    senderUsername: OKONKWO.username,
    body: 'Decision from our machine-learning review: the schema must version-stamp every row. I will draft the versioning proposal.',
    createdAt: '2026-06-12T11:00:00.000Z',
    deliveredAt: '2026-06-12T11:00:03.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-12T11:15:00.000Z')],
    reactions: [reaction('💡', ADESINA, '2026-06-12T11:30:00.000Z')],
    hashtags: ['schema', 'versioning'],
    metadata: { decision: 'true' },
  }),
  message({
    id: 'msg-wahdg-4',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: ADESINA.username,
    senderName: ADESINA.displayName,
    senderUsername: ADESINA.username,
    body: 'The agriculture extension data shares the same identifier pattern — happy to co-author the field manual.',
    createdAt: '2026-06-20T15:00:00.000Z',
    deliveredAt: '2026-06-20T15:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-20T15:10:00.000Z')],
    reactions: [reaction('🤝', OKONKWO, '2026-06-20T15:20:00.000Z')],
  }),
  message({
    id: 'msg-wahdg-5',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Video call recap — agenda: identifier harmonisation; decision: adopt the proposed versioning; outcome: August release of the standardised schema.',
    type: 'video-call',
    attachments: [{ id: 'att-wahdg-call', type: 'video-call', title: 'Working group call recording', url: '/messages/conv-west-africa-health-data-group/call', durationSeconds: 2760 }],
    createdAt: '2026-07-01T12:00:00.000Z',
    deliveredAt: '2026-07-01T12:00:04.000Z',
    readReceipts: [
      receipt(ADEBAYO.username, ADEBAYO.displayName, '2026-07-01T12:30:00.000Z'),
      receipt(OKONKWO.username, OKONKWO.displayName, '2026-07-01T12:30:00.000Z'),
      receipt(ADESINA.username, ADESINA.displayName, '2026-07-01T12:30:00.000Z'),
    ],
    reactions: [reaction('👍', ADEBAYO, '2026-07-01T12:31:00.000Z')],
    hashtags: ['meeting'],
    metadata: { meeting: 'true' },
  }),
  message({
    id: 'msg-wahdg-6',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: ADEBAYO.username,
    senderName: ADEBAYO.displayName,
    senderUsername: ADEBAYO.username,
    body: 'Decision: the standardised schema ships with the August release.',
    createdAt: '2026-07-29T11:20:00.000Z',
    deliveredAt: '2026-07-29T11:20:03.000Z',
    status: 'delivered',
    reactions: [reaction('🎉', OJURI, '2026-07-29T11:25:00.000Z'), reaction('🎉', OKONKWO, '2026-07-29T11:26:00.000Z'), reaction('🎉', ADESINA, '2026-07-29T11:27:00.000Z')],
    hashtags: ['schema'],
    metadata: { decision: 'true' },
  }),
  // conv-uni-ibadan-faculty — institution
  message({
    id: 'msg-ui-1',
    conversationId: 'conv-uni-ibadan-faculty',
    senderId: 'INST-UI-001',
    senderName: 'University of Ibadan — Research Office',
    body: 'Reminder: the Faculty of Medicine annual research report is due on 31 July. Please include grant-nrc-2022-113 expenditure.',
    createdAt: '2026-07-01T08:00:00.000Z',
    deliveredAt: '2026-07-01T08:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-01T08:30:00.000Z')],
    hashtags: ['reporting'],
  }),
  message({
    id: 'msg-ui-2',
    conversationId: 'conv-uni-ibadan-faculty',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Attaching the completed annual report with the impact metrics and the malaria surveillance outcomes.',
    attachments: [
      { id: 'att-ui-report', type: 'document', title: 'Faculty annual research report 2025/26', fileName: 'ui-annual-report.pdf', mimeType: 'application/pdf', fileSize: 1840000 },
      { id: 'att-ui-grant', type: 'grant', title: 'Grant 2022/113 expenditure summary', entityId: 'grant-nrc-2022-113' },
    ],
    createdAt: '2026-07-28T12:00:00.000Z',
    deliveredAt: '2026-07-28T12:00:03.000Z',
    status: 'delivered',
    readReceipts: [],
    hashtags: ['reporting', 'impact'],
    metadata: { milestone: 'annual-report' },
  }),
  message({
    id: 'msg-ui-3',
    conversationId: 'conv-uni-ibadan-faculty',
    senderId: 'INST-UI-001',
    senderName: 'University of Ibadan — Research Office',
    body: 'Thank you — the annual report has been logged for the committee.',
    createdAt: '2026-07-28T13:10:00.000Z',
    status: 'sent',
  }),
  // conv-scholatia-press-agreement — publisher
  message({
    id: 'msg-press-1',
    conversationId: 'conv-scholatia-press-agreement',
    senderId: 'scholatia-press',
    senderName: 'Scholatia Press — Editorial Office',
    body: 'Your institution qualifies for the institutional open access waiver. Please confirm the publication for the waiver to apply.',
    createdAt: '2026-06-03T11:00:00.000Z',
    deliveredAt: '2026-06-03T11:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-03T11:20:00.000Z')],
    hashtags: ['open-access'],
  }),
  message({
    id: 'msg-press-2',
    conversationId: 'conv-scholatia-press-agreement',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Confirmed — the waiver applies to our malaria surveillance manuscript accepted by SJOR.',
    attachments: [
      { id: 'att-press-ms', type: 'manuscript', title: 'Malaria surveillance across West Africa', entityId: 'MS-2026-0014' },
      { id: 'att-press-journal', type: 'journal', title: 'Scholatia Journal of Open Research', entityId: 'JNL-001' },
    ],
    createdAt: '2026-07-15T09:30:00.000Z',
    deliveredAt: '2026-07-15T09:30:03.000Z',
    readReceipts: [receipt('scholatia-press', 'Scholatia Press — Editorial Office', '2026-07-15T10:00:00.000Z')],
    reactions: [reaction('👍', JSCHOLAR, '2026-07-15T10:10:00.000Z')],
    hashtags: ['open-access', 'waiver'],
  }),
  message({
    id: 'msg-press-3',
    conversationId: 'conv-scholatia-press-agreement',
    senderId: 'scholatia-press',
    senderName: 'Scholatia Press — Editorial Office',
    body: 'The waiver has been applied to your accepted article.',
    createdAt: '2026-07-27T15:45:00.000Z',
    status: 'sent',
  }),
  // conv-siri-2026-presentation — conference
  message({
    id: 'msg-siri-1',
    conversationId: 'conv-siri-2026-presentation',
    senderId: 'CONF-001',
    senderName: 'SIRI 2026 — Programme Committee',
    body: 'Congratulations — your abstract has been accepted for an oral session at SIRI 2026.',
    createdAt: '2026-06-20T10:00:00.000Z',
    deliveredAt: '2026-06-20T10:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-20T10:30:00.000Z')],
    reactions: [reaction('🎉', OJURI, '2026-06-20T10:31:00.000Z')],
    hashtags: ['siri2026'],
    metadata: { milestone: 'accepted' },
  }),
  message({
    id: 'msg-siri-2',
    conversationId: 'conv-siri-2026-presentation',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Attaching the updated abstract and the poster draft for the session preview.',
    attachments: [
      { id: 'att-siri-poster', type: 'image', title: 'SIRI 2026 poster draft', fileName: 'siri-2026-poster.png', mimeType: 'image/png', fileSize: 2450000 },
      { id: 'att-siri-conf', type: 'conference', title: 'SIRI 2026', entityId: 'CONF-001' },
    ],
    createdAt: '2026-07-10T14:00:00.000Z',
    deliveredAt: '2026-07-10T14:00:03.000Z',
    readReceipts: [receipt('CONF-001', 'SIRI 2026 — Programme Committee', '2026-07-10T15:00:00.000Z')],
    hashtags: ['siri2026', 'poster'],
  }),
  message({
    id: 'msg-siri-3',
    conversationId: 'conv-siri-2026-presentation',
    senderId: 'CONF-001',
    senderName: 'SIRI 2026 — Programme Committee',
    body: 'Your session is confirmed for 14:30 on day two.',
    createdAt: '2026-07-26T12:30:00.000Z',
    status: 'sent',
  }),
  // conv-sjor-editorial — journal
  message({
    id: 'msg-sjor-1',
    conversationId: 'conv-sjor-editorial',
    senderId: 'JNL-001',
    senderName: 'SJOR — Editorial Office',
    body: 'We are pleased to invite you to revise and resubmit your manuscript following major revisions.',
    createdAt: '2026-06-22T12:00:00.000Z',
    deliveredAt: '2026-06-22T12:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-22T12:20:00.000Z')],
    hashtags: ['peer-review'],
  }),
  message({
    id: 'msg-sjor-2',
    conversationId: 'conv-sjor-editorial',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Resubmitting the revised manuscript with a point-by-point response to the reviewers.',
    attachments: [
      { id: 'att-sjor-ms', type: 'manuscript', title: 'Revised manuscript — malaria surveillance', entityId: 'MS-2026-0014', fileName: 'sjor-revision.pdf', mimeType: 'application/pdf', fileSize: 2210000 },
      { id: 'att-sjor-doc', type: 'document', title: 'Response to reviewers', fileName: 'response-to-reviewers.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ],
    createdAt: '2026-07-24T10:00:00.000Z',
    deliveredAt: '2026-07-24T10:00:03.000Z',
    status: 'delivered',
    readReceipts: [],
    hashtags: ['peer-review', 'revision'],
  }),
  message({
    id: 'msg-sjor-3',
    conversationId: 'conv-sjor-editorial',
    senderId: 'JNL-001',
    senderName: 'SJOR — Editorial Office',
    body: 'We have returned the revised manuscript for final checks.',
    createdAt: '2026-07-25T10:05:00.000Z',
    status: 'sent',
  }),
  // conv-multilingual-parsing-framework — project
  message({
    id: 'msg-mpf-1',
    conversationId: 'conv-multilingual-parsing-framework',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'Kick-off: the health corpus work package is now live. @ojuri will lead annotation; @smith owns the evaluation suite.',
    mentions: [
      { username: OJURI.username, userId: OJURI.username, name: OJURI.displayName },
      { username: SMITH.username, userId: SMITH.username, name: SMITH.displayName },
    ],
    createdAt: '2026-03-08T09:00:00.000Z',
    deliveredAt: '2026-03-08T09:00:02.000Z',
    readReceipts: [
      receipt(OJURI.username, OJURI.displayName, '2026-03-08T09:10:00.000Z'),
      receipt(SMITH.username, SMITH.displayName, '2026-03-08T09:15:00.000Z'),
    ],
    reactions: [reaction('🤝', OJURI, '2026-03-08T09:11:00.000Z')],
    hashtags: ['kickoff'],
  }),
  message({
    id: 'msg-mpf-2',
    conversationId: 'conv-multilingual-parsing-framework',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'The Yoruba and Hausa health corpus now covers 4,200 sentences with expert annotations. Will need to confirm the licensing before release.',
    attachments: [{ id: 'att-mpf-dataset', type: 'dataset', title: 'Health corpus v0.4', entityId: 'ds-health-corpus-014', fileName: 'health-corpus-v0.4.tsv', mimeType: 'text/tab-separated-values' }],
    createdAt: '2026-05-30T10:00:00.000Z',
    deliveredAt: '2026-05-30T10:00:03.000Z',
    readReceipts: [
      receipt(JSCHOLAR.username, JSCHOLAR.displayName, '2026-05-30T10:20:00.000Z'),
      receipt(SMITH.username, SMITH.displayName, '2026-05-30T10:25:00.000Z'),
    ],
    reactions: [reaction('🔥', JSCHOLAR, '2026-05-30T10:21:00.000Z')],
    hashtags: ['health-corpus', 'licensing'],
  }),
  message({
    id: 'msg-mpf-3',
    conversationId: 'conv-multilingual-parsing-framework',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'Agenda for the sync — (1) corpus licensing, (2) transfer-learning thresholds, (3) the 50-language milestone. Meeting notes will follow.',
    type: 'rich-text',
    createdAt: '2026-06-15T09:00:00.000Z',
    deliveredAt: '2026-06-15T09:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-15T09:30:00.000Z')],
    hashtags: ['meeting'],
  }),
  message({
    id: 'msg-mpf-4',
    conversationId: 'conv-multilingual-parsing-framework',
    senderId: SMITH.username,
    senderName: SMITH.displayName,
    senderUsername: SMITH.username,
    body: 'Meeting notes — decision: release the corpus under CC-BY 4.0; outcome: evaluation suite baseline published; agenda: 50-language evaluation release by November.',
    createdAt: '2026-06-15T11:00:00.000Z',
    deliveredAt: '2026-06-15T11:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-15T11:20:00.000Z')],
    reactions: [reaction('💡', OJURI, '2026-06-15T11:25:00.000Z')],
    hashtags: ['meeting', 'licensing'],
    metadata: { meeting: 'true' },
  }),
  message({
    id: 'msg-mpf-5',
    conversationId: 'conv-multilingual-parsing-framework',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'The transfer learning module hits 50 languages with the health subset.',
    createdAt: '2026-07-24T17:55:00.000Z',
    status: 'sent',
    reactions: [reaction('🎉', OJURI, '2026-07-24T18:00:00.000Z')],
    hashtags: ['milestone'],
  }),
  // conv-grant-nrc-2022-113 — grant / funding
  message({
    id: 'msg-grant-1',
    conversationId: 'conv-grant-nrc-2022-113',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'The mid-year report must include the health corpus work package deliverables and the transfer-learning milestones.',
    createdAt: '2026-07-05T09:00:00.000Z',
    deliveredAt: '2026-07-05T09:00:02.000Z',
    readReceipts: [
      receipt(OJURI.username, OJURI.displayName, '2026-07-05T09:15:00.000Z'),
      receipt(SMITH.username, SMITH.displayName, '2026-07-05T09:20:00.000Z'),
    ],
    hashtags: ['reporting'],
  }),
  message({
    id: 'msg-grant-2',
    conversationId: 'conv-grant-nrc-2022-113',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Attaching the health corpus deliverables for the mid-year report.',
    attachments: [
      { id: 'att-grant-ds', type: 'dataset', title: 'Health corpus deliverables', entityId: 'ds-health-corpus-014' },
      { id: 'att-grant-grant', type: 'grant', title: 'Grant 2022/113', entityId: 'grant-nrc-2022-113' },
    ],
    createdAt: '2026-07-10T10:00:00.000Z',
    deliveredAt: '2026-07-10T10:00:03.000Z',
    readReceipts: [receipt(JSCHOLAR.username, JSCHOLAR.displayName, '2026-07-10T10:20:00.000Z')],
    reactions: [reaction('👍', JSCHOLAR, '2026-07-10T10:21:00.000Z')],
    hashtags: ['reporting', 'health-corpus'],
  }),
  message({
    id: 'msg-grant-3',
    conversationId: 'conv-grant-nrc-2022-113',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'Mid-year report uploaded — expenditure is on track at 52%.',
    createdAt: '2026-07-23T09:40:00.000Z',
    status: 'sent',
  }),
  // conv-statistical-analysis-order — marketplace / commerce order
  message({
    id: 'msg-order-1',
    conversationId: 'conv-statistical-analysis-order',
    senderId: 'vendor-ibadan-statistics-lab',
    senderName: 'Ibadan Statistics Lab',
    body: 'We have started the statistical design for the malaria surveillance study. The analysis plan will be shared first for approval.',
    createdAt: '2026-07-05T10:00:00.000Z',
    deliveredAt: '2026-07-05T10:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-05T10:15:00.000Z')],
    hashtags: ['order-2026-0001'],
  }),
  message({
    id: 'msg-order-2',
    conversationId: 'conv-statistical-analysis-order',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Approved — please proceed with the multi-site regression model and the surveillance dashboard.',
    attachments: [{ id: 'att-order-ds', type: 'dataset', title: 'Malaria surveillance dataset', entityId: 'ds-malaria-surveillance' }],
    createdAt: '2026-07-08T09:00:00.000Z',
    deliveredAt: '2026-07-08T09:00:03.000Z',
    readReceipts: [receipt('vendor-ibadan-statistics-lab', 'Ibadan Statistics Lab', '2026-07-08T09:30:00.000Z')],
    hashtags: ['order-2026-0001'],
  }),
  message({
    id: 'msg-order-3',
    conversationId: 'conv-statistical-analysis-order',
    senderId: 'vendor-ibadan-statistics-lab',
    senderName: 'Ibadan Statistics Lab',
    body: 'Final report and analysis scripts have been delivered.',
    attachments: [
      { id: 'att-order-report', type: 'document', title: 'Statistical analysis report', fileName: 'surveillance-analysis-report.pdf', mimeType: 'application/pdf', fileSize: 1430000 },
      { id: 'att-order-order', type: 'order', title: 'Order 2026-0001', entityId: 'ord-2026-0001' },
    ],
    createdAt: '2026-07-22T14:20:00.000Z',
    status: 'sent',
    reactions: [reaction('🎉', OJURI, '2026-07-22T14:40:00.000Z')],
    hashtags: ['order-2026-0001', 'delivered'],
  }),
  // conv-editing-service — service engagement
  message({
    id: 'msg-svc-1',
    conversationId: 'conv-editing-service',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'Received MS-2026-0014 — I will return the language polish with tracked changes within five working days.',
    attachments: [{ id: 'att-svc-ms', type: 'manuscript', title: 'MS-2026-0014', entityId: 'MS-2026-0014' }],
    createdAt: '2026-06-18T10:00:00.000Z',
    deliveredAt: '2026-06-18T10:00:02.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-18T10:20:00.000Z')],
    hashtags: ['editing'],
  }),
  message({
    id: 'msg-svc-2',
    conversationId: 'conv-editing-service',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'Thanks — please keep the terminology of the health-domain glossaries intact.',
    attachments: [{ id: 'att-svc-glossary', type: 'document', title: 'Health-domain glossary', fileName: 'health-glossary.pdf', mimeType: 'application/pdf' }],
    replyToId: 'msg-svc-1',
    createdAt: '2026-06-18T11:00:00.000Z',
    deliveredAt: '2026-06-18T11:00:03.000Z',
    readReceipts: [receipt(JSCHOLAR.username, JSCHOLAR.displayName, '2026-06-18T11:15:00.000Z')],
    hashtags: ['editing', 'glossary'],
  }),
  message({
    id: 'msg-svc-3',
    conversationId: 'conv-editing-service',
    senderId: JSCHOLAR.username,
    senderName: JSCHOLAR.displayName,
    senderUsername: JSCHOLAR.username,
    body: 'Edited manuscript returned with tracked changes.',
    attachments: [{ id: 'att-svc-edited', type: 'file', title: 'Edited manuscript', fileName: 'MS-2026-0014-edited.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 1890000 }],
    createdAt: '2026-07-21T16:05:00.000Z',
    status: 'sent',
    reactions: [reaction('👏', OJURI, '2026-07-21T16:20:00.000Z')],
    hashtags: ['editing', 'delivered'],
  }),
  // conv-scholatia-support — support
  message({
    id: 'msg-sup-1',
    conversationId: 'conv-scholatia-support',
    senderId: OJURI.username,
    senderName: OJURI.displayName,
    senderUsername: OJURI.username,
    body: 'My institution verification has been pending for two weeks — the notification settings for follow-ups also seem off.',
    createdAt: '2026-07-01T09:00:00.000Z',
    deliveredAt: '2026-07-01T09:00:02.000Z',
    readReceipts: [receipt('scholatia-support', 'Scholatia Support', '2026-07-01T09:10:00.000Z')],
    hashtags: ['verification'],
  }),
  message({
    id: 'msg-sup-2',
    conversationId: 'conv-scholatia-support',
    senderId: 'scholatia-support',
    senderName: 'Scholatia Support',
    body: 'We have escalated the verification to the identity team and will follow up within 24 hours.',
    createdAt: '2026-07-02T10:00:00.000Z',
    deliveredAt: '2026-07-02T10:00:03.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-02T10:30:00.000Z')],
    reactions: [reaction('👍', OJURI, '2026-07-02T10:31:00.000Z')],
    hashtags: ['verification'],
  }),
  message({
    id: 'msg-sup-3',
    conversationId: 'conv-scholatia-support',
    senderId: 'scholatia-support',
    senderName: 'Scholatia Support',
    body: 'Verification is now approved — apologies for the delay. Leaving a voice note with the next steps for notification routing.',
    type: 'voice-note',
    attachments: [{ id: 'att-sup-voice', type: 'voice-note', title: 'Verification next steps', fileName: 'verification-next-steps.mp3', mimeType: 'audio/mpeg', durationSeconds: 84 }],
    createdAt: '2026-07-20T18:10:00.000Z',
    status: 'sent',
  }),
  // A deleted message example, for the "deleted" state.
  message({
    id: 'msg-deleted-1',
    conversationId: 'conv-west-africa-health-data-group',
    senderId: ADESINA.username,
    senderName: ADESINA.displayName,
    senderUsername: ADESINA.username,
    body: 'This message was deleted.',
    createdAt: '2026-06-25T13:00:00.000Z',
    status: 'read',
    deletedAt: '2026-06-25T13:20:00.000Z',
    deletedBy: ADESINA.username,
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-06-25T13:05:00.000Z')],
  }),
  // An edited message example.
  message({
    id: 'msg-edited-1',
    conversationId: 'conv-ojuri-smith',
    senderId: SMITH.username,
    senderName: SMITH.displayName,
    senderUsername: SMITH.username,
    body: 'Correction — the licensing section is under CC-BY 4.0, not CC-BY-NC.',
    createdAt: '2026-07-27T15:00:00.000Z',
    editedAt: '2026-07-27T15:12:00.000Z',
    editCount: 1,
    deliveredAt: '2026-07-27T15:00:03.000Z',
    readReceipts: [receipt(OJURI.username, OJURI.displayName, '2026-07-27T15:10:00.000Z')],
    hashtags: ['licensing'],
    metadata: { edited: 'true' },
  }),
];

// ---------------------------------------------------------------------------
// Pins & stars (derived from messages for consistency)
// ---------------------------------------------------------------------------

export const PINNED_MESSAGES: MessagePin[] = (() => {
  const seeded = [
    { id: 'msg-ojuri-2', by: OJURI.username, at: '2026-07-26T09:30:00.000Z' },
    { id: 'msg-wahdg-5', by: OJURI.username, at: '2026-07-02T08:00:00.000Z' },
  ];
  const pins: MessagePin[] = seeded.map((entry) => {
    const found = MESSAGES.find((item) => item.id === entry.id);
    return {
      messageId: entry.id,
      conversationId: found?.conversationId ?? '',
      pinnedBy: entry.by,
      pinnedByName: OJURI.displayName,
      pinnedAt: entry.at,
    };
  });
  CONVERSATIONS.forEach((conversation) => {
    conversation.pinnedMessageIds = pins
      .filter((pin) => pin.conversationId === conversation.id)
      .map((pin) => pin.messageId);
  });
  return pins;
})();

export const STARRED_MESSAGES: StarredMessage[] = [
  {
    messageId: 'msg-smith-2',
    conversationId: 'conv-ojuri-smith',
    starredBy: OJURI.username,
    starredByName: OJURI.displayName,
    starredAt: '2026-07-20T12:30:00.000Z',
  },
  {
    messageId: 'msg-order-3',
    conversationId: 'conv-statistical-analysis-order',
    starredBy: OJURI.username,
    starredByName: OJURI.displayName,
    starredAt: '2026-07-22T15:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Per-user feature state
// ---------------------------------------------------------------------------

export const ARCHIVES: MessageArchive[] = [
  archiveConversation([], 'conv-statistical-analysis-order', OJURI.username)[0],
  archiveConversation([], 'conv-uni-ibadan-faculty', OJURI.username)[0],
].filter((entry): entry is MessageArchive => Boolean(entry));

export const MUTES: MessageMute[] = [
  muteConversation([], 'conv-scholatia-support', OJURI.username)[0],
].filter((entry): entry is MessageMute => Boolean(entry));

export const TYPING: TypingIndicator[] = [
  {
    conversationId: 'conv-ojuri-smith',
    participantId: SMITH.username,
    participantName: SMITH.displayName,
    startedAt: '2026-07-31T09:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

export const ALL_MESSAGES: Message[] = [...MESSAGES].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const UNREAD_CONVERSATION_IDS: Set<string> = unreadConversationIds(ALL_MESSAGES, CURRENT_USER);

export const UNREAD_MESSAGES: Message[] = ALL_MESSAGES.filter(
  (item) => item.senderId !== CURRENT_USER && !item.readReceipts.some((entry) => entry.readerId === CURRENT_USER),
);

export const MESSAGING_STATISTICS: MessageStatistics = messageStatistics({
  conversations: CONVERSATIONS,
  messages: ALL_MESSAGES,
  starred: STARRED_MESSAGES,
  pinned: PINNED_MESSAGES,
  archives: ARCHIVES,
  mutes: MUTES,
});

export const MESSAGING_ANALYTICS: MessageAnalytics = messageAnalytics({
  conversations: CONVERSATIONS,
  messages: ALL_MESSAGES,
});

export const MESSAGING_PORTFOLIO = {
  statistics: MESSAGING_STATISTICS,
  analytics: MESSAGING_ANALYTICS,
  conversations: CONVERSATIONS,
  messages: ALL_MESSAGES,
  starred: STARRED_MESSAGES,
  pinned: PINNED_MESSAGES,
  archives: ARCHIVES,
  mutes: MUTES,
  typing: TYPING,
};

export const MESSAGE_SUMMARIES: ConversationSummary[] = CONVERSATIONS.map((conversation) =>
  summarizeConversation(conversation, ALL_MESSAGES),
);

export const DIRECT_CONVERSATION: Conversation | undefined = findConversationBetween(CONVERSATIONS, OJURI.username, SMITH.username);

export const FEATURED_CONVERSATION: Conversation = DIRECT_CONVERSATION ?? CONVERSATIONS[0];

export const FEATURED_MESSAGE: Message | undefined = ALL_MESSAGES.find((item) => item.id === 'msg-ojuri-2');

export const FEATURED_SUMMARY: ConversationSummary | undefined = MESSAGE_SUMMARIES.find(
  (summary) => summary.conversationId === FEATURED_CONVERSATION.id,
);

export const FEATURED_ACTION_ITEMS = extractActionItems(
  ALL_MESSAGES.filter((item) => item.conversationId === FEATURED_CONVERSATION.id),
).slice(0, 5);

export const FEATURED_HASHTAGS = hashtagsForConversation(ALL_MESSAGES, FEATURED_CONVERSATION.id).slice(0, 6);

export const ALL_ACTION_ITEMS = extractActionItems(ALL_MESSAGES).slice(0, 8);

export const TOPIC_TAGS = hashtagsForConversation(ALL_MESSAGES, FEATURED_CONVERSATION.id).map((entry) => entry.tag);

export const DEFAULT_MESSAGE_STATUS: MessageStatus = 'sent';

export const FEATURED_MESSAGE_TYPE: MessageType = 'text';

export const FEATURED_LIFECYCLE_STAGE: ResearchLifecycleStageId = FEATURED_CONVERSATION.context?.stageId ?? 'project';
