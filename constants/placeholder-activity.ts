import type {
  ActivityAttachment,
  ActivityAttachmentType,
  ActivityBookmark,
  ActivityComment,
  ActivityInsight,
  ActivityItem,
  ActivityMention,
  ActivityModerationEntry,
  ActivityPin,
  ActivityReaction,
  ActivityReport,
  ActivityShare,
  ActivitySource,
  ActivitySourceEntityType,
  ActivityStatistics,
  ActivityTrendingEntry,
  ActivityType,
} from '@/types/activity';
import type { ActivityAnalytics, ActivityFeed, ActivityPortfolio, ActivityRecommendation, ActivityRecommendationProfile } from '@/types/activity';
import { ACTIVITY_EMOJIS } from '@/types/activity';
import {
  activityAnalytics,
  activityInsights,
  activityStatistics,
  buildFeeds,
  createActivity,
  featuredActivities,
  hashtagsForActivities,
  recommendationScore,
  recommendedActivities,
  resolveEngagement,
  trendScore,
  trendingActivities,
} from '@/lib/activity';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Placeholder data for the Scholatia Unified Scholarly Activity Feed
 * (Phase 2.2C).
 *
 * The feed owns no records: every activity below references an existing
 * canonical source record through `sourceId` + `sourceEntity` — a researcher
 * username, a journal id, a conference id, an institution id, a publisher id,
 * a grant id, a dataset id, a manuscript id, a project id, a commerce order, a
 * service, a marketplace listing or vendor, an ad campaign, or a subscription.
 * Feeds, trending, recommendations, moderation, statistics, and analytics are
 * all derived from the activity, comment, bookmark, share, report, and
 * moderation ledgers by the pure engine in `lib/activity.ts`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-07-31T12:00:00.000Z');

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
const OKONKWO = researcherOf('okonkwo');
const ADESINA = researcherOf('adesina');
const MARIA = researcherOf('maria');

/** A researcher actor identified by canonical username. */
function actorOf(username: string): ActivityItem['actor'] {
  const profile = researcherOf(username);
  return { id: profile.username, name: profile.displayName, username: profile.username, avatar: profile.avatar };
}

/** A non-researcher actor (a module, a publisher, a conference) by canonical id. */
function systemActor(id: string, name: string): ActivityItem['actor'] {
  return { id, name };
}

function source(id: string, entityType: ActivitySourceEntityType, title?: string): ActivitySource {
  return { id, entityType, title };
}

function mentionOf(username: string): ActivityMention {
  const profile = researcherOf(username);
  return { username: profile.username, name: profile.displayName, entityType: 'researcher', entityId: profile.username };
}

function attach(
  id: string,
  type: ActivityAttachmentType,
  title: string,
  entityId?: string,
  entityType?: ActivitySourceEntityType,
  url?: string,
): ActivityAttachment {
  return { id, type, title, entityId, entityType, url };
}

let reactionSeq = 0;
function react(emoji: string, username: string, at: string): ActivityReaction {
  reactionSeq += 1;
  const profile = researcherOf(username);
  return { id: `reaction-${reactionSeq}`, emoji, actorId: profile.username, actorName: profile.displayName, createdAt: at };
}

type ActivitySeed = {
  id: string;
  type: ActivityType;
  verb: string;
  actor: ActivityItem['actor'];
  title: string;
  body?: string;
  source: ActivitySource;
  stageId?: ResearchLifecycleStageId;
  visibility?: ActivityItem['visibility'];
  restriction?: string;
  hashtags?: string[];
  mentions?: ActivityMention[];
  attachments?: ActivityAttachment[];
  reactions?: ActivityReaction[];
  views?: number;
  pinned?: boolean;
  featured?: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
};

function act(seed: ActivitySeed): ActivityItem {
  return createActivity({
    id: seed.id,
    type: seed.type,
    verb: seed.verb,
    actor: seed.actor,
    title: seed.title,
    body: seed.body,
    source: seed.source,
    stageId: seed.stageId,
    visibility: seed.visibility,
    restriction: seed.restriction,
    hashtags: seed.hashtags,
    mentions: seed.mentions,
    attachments: seed.attachments,
    reactions: seed.reactions,
    views: seed.views,
    pinned: seed.pinned,
    featured: seed.featured,
    metadata: seed.metadata,
    createdAt: seed.createdAt,
  });
}

// ---------------------------------------------------------------------------
// Activity seeds — one or more per canonical activity type
// ---------------------------------------------------------------------------

const RAW_ACTIVITIES: ActivityItem[] = [
  act({
    id: 'act-publication-smith-1',
    type: 'publication',
    verb: 'published',
    actor: actorOf('smith'),
    title: 'Low-resource dependency parsing for West African languages',
    body: 'Open access paper published in SJOR. Thanks to @ojuri and the Ibadan NLP group for the multilingual treebank contributions.',
    source: source('10.1000/placeholder.2026.0042', 'publication', 'Low-resource dependency parsing'),
    stageId: 'publication',
    hashtags: ['nlp', 'lowresourcelanguages', 'parsing'],
    mentions: [mentionOf('ojuri')],
    attachments: [attach('att-1', 'publication', 'Low-resource dependency parsing', '10.1000/placeholder.2026.0042', 'publication')],
    reactions: [react('👍', 'ojuri', '2026-07-31T09:30:00.000Z'), react('🎉', 'jscholar', '2026-07-31T09:45:00.000Z'), react('🧠', 'wang', '2026-07-31T10:00:00.000Z')],
    views: 482,
    pinned: true,
    featured: true,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-31T09:00:00.000Z',
  }),
  act({
    id: 'act-citation-okonkwo-1',
    type: 'citation',
    verb: 'cited',
    actor: actorOf('okonkwo'),
    title: 'Recent work cited in a systematic review',
    body: 'The multilingual parsing framework has been cited in a new systematic review of African language technologies.',
    source: source('10.1000/placeholder.2025.0111', 'publication', 'Systematic review of African language technologies'),
    stageId: 'citation',
    hashtags: ['nlp', 'citations'],
    mentions: [mentionOf('smith'), mentionOf('ojuri')],
    views: 96,
    featured: false,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-30T15:20:00.000Z',
  }),
  act({
    id: 'act-dataset-wang-1',
    type: 'dataset',
    verb: 'released',
    actor: actorOf('wang'),
    title: 'Multilingual treebank dataset v3 released',
    body: 'Version 3 of the multilingual parsing treebanks is now available, adding two new languages and corrected annotations.',
    source: source('mpf-multilingual-treebanks', 'dataset', 'Multilingual treebanks v3'),
    stageId: 'dataset',
    hashtags: ['nlp', 'datasets'],
    attachments: [attach('att-2', 'dataset', 'mpf-multilingual-treebanks', 'mpf-multilingual-treebanks', 'dataset')],
    reactions: [react('🚀', 'ojuri', '2026-07-29T12:00:00.000Z')],
    views: 210,
    featured: false,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-29T11:30:00.000Z',
  }),
  act({
    id: 'act-manuscript-ojuri-1',
    type: 'manuscript',
    verb: 'submitted',
    actor: actorOf('ojuri'),
    title: 'Manuscript submitted: MS-2026-0014',
    body: 'Manuscript on cross-lingual transfer submitted to SJOR for peer review.',
    source: source('MS-2026-0014', 'manuscript', 'Cross-lingual transfer manuscript'),
    stageId: 'submission',
    hashtags: ['nlp', 'submission'],
    views: 64,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-28T08:45:00.000Z',
  }),
  act({
    id: 'act-conference-siri-1',
    type: 'conference',
    verb: 'announced',
    actor: systemActor('CONF-001', 'SIRI 2026'),
    title: 'SIRI 2026 call for papers open',
    body: 'The Scholatia International Research & Innovation conference is accepting papers until the 15 August deadline.',
    source: source('CONF-001', 'conference', 'SIRI 2026'),
    stageId: 'conference',
    hashtags: ['conference', 'callforpapers'],
    views: 340,
    featured: false,
    createdAt: '2026-07-27T10:00:00.000Z',
  }),
  act({
    id: 'act-journal-sjor-1',
    type: 'journal',
    verb: 'announced',
    actor: systemActor('JNL-001', 'Scholatia Journal of Open Research'),
    title: 'SJOR special issue on African language technologies',
    body: 'The Scholatia Journal of Open Research invites submissions for a special issue on African language technologies.',
    source: source('JNL-001', 'journal', 'SJOR'),
    stageId: 'publication',
    hashtags: ['journal', 'specialissue', 'nlp'],
    views: 275,
    featured: true,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-26T09:15:00.000Z',
  }),
  act({
    id: 'act-publisher-press-1',
    type: 'publisher',
    verb: 'launched',
    actor: systemActor('scholatia-press', 'Scholatia Press'),
    title: 'Scholatia Press launches open book series',
    body: 'A new open-access book series covering computational approaches to African languages.',
    source: source('scholatia-press', 'publisher', 'Scholatia Press'),
    hashtags: ['publishing', 'openaccess'],
    views: 150,
    createdAt: '2026-07-25T14:00:00.000Z',
  }),
  act({
    id: 'act-peer-review-smith-1',
    type: 'peer-review',
    verb: 'completed',
    actor: actorOf('smith'),
    title: 'Completed peer review for SJOR',
    body: 'Completed a peer review round for a manuscript under consideration at the Scholatia Journal of Open Research.',
    source: source('JNL-001', 'journal', 'SJOR'),
    stageId: 'peer-review',
    hashtags: ['peerreview'],
    views: 42,
    createdAt: '2026-07-24T16:30:00.000Z',
  }),
  act({
    id: 'act-funding-nrc-1',
    type: 'funding',
    verb: 'opened',
    actor: systemActor('adv-pan-african-research-foundation', 'Pan-African Research Foundation'),
    title: 'Funding call extended: language technology research',
    body: 'The National Research Council call on language technology research has been extended to the end of August.',
    source: source('grant-nrc-2022-113', 'grant', 'NRC language technology grant'),
    stageId: 'funding',
    hashtags: ['funding', 'grant', 'nlp'],
    views: 188,
    featured: false,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-23T11:00:00.000Z',
  }),
  act({
    id: 'act-grant-adebayo-1',
    type: 'grant',
    verb: 'awarded',
    actor: actorOf('adebayo'),
    title: 'Grant awarded: DFF collaboration programme',
    body: 'Awarded a Danish International Development Agency collaboration grant for low-resource language work.',
    source: source('grant-dff-2021-087', 'grant', 'DFF collaboration grant'),
    stageId: 'funding',
    hashtags: ['grant', 'funding'],
    mentions: [mentionOf('ojuri'), mentionOf('tanaka')],
    reactions: [react('🎉', 'ojuri', '2026-07-22T09:00:00.000Z'), react('👏', 'wang', '2026-07-22T09:20:00.000Z')],
    views: 132,
    createdAt: '2026-07-22T08:40:00.000Z',
  }),
  act({
    id: 'act-project-mpf-1',
    type: 'project',
    verb: 'advanced',
    actor: actorOf('ojuri'),
    title: 'Parsing framework milestone 4 complete',
    body: 'Milestone 4 of the multilingual parsing framework is complete — annotation pipeline stabilised.',
    source: source('multilingual-parsing-framework', 'project', 'Multilingual Parsing Framework'),
    stageId: 'project',
    visibility: 'collaborators',
    restriction: 'Visible to project collaborators.',
    hashtags: ['nlp', 'milestone'],
    mentions: [mentionOf('smith'), mentionOf('tanaka')],
    reactions: [react('🔥', 'smith', '2026-07-21T10:00:00.000Z')],
    views: 58,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-21T09:30:00.000Z',
  }),
  act({
    id: 'act-collaborator-tanaka-1',
    type: 'collaborator',
    verb: 'joined',
    actor: actorOf('tanaka'),
    title: 'Joined the low-resource language toolkit project',
    body: 'Excited to join the low-resource language toolkit project as a collaborator.',
    source: source('low-resource-language-toolkit', 'project', 'Low-Resource Language Toolkit'),
    stageId: 'project',
    visibility: 'followers',
    restriction: 'Visible to followers.',
    hashtags: ['nlp', 'collaboration'],
    views: 73,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-20T13:00:00.000Z',
  }),
  act({
    id: 'act-award-okonkwo-1',
    type: 'award',
    verb: 'received',
    actor: actorOf('okonkwo'),
    title: 'Received best paper award at SIRI 2026',
    body: 'Honoured to receive the best paper award at the Scholatia International Research & Innovation conference.',
    source: source('CONF-001', 'conference', 'SIRI 2026'),
    stageId: 'conference',
    hashtags: ['award', 'conference'],
    reactions: [react('🏆', 'ojuri', '2026-07-19T17:00:00.000Z'), react('👏', 'maria', '2026-07-19T17:15:00.000Z')],
    views: 301,
    featured: false,
    createdAt: '2026-07-19T16:45:00.000Z',
  }),
  act({
    id: 'act-institution-ui-1',
    type: 'institution',
    verb: 'announced',
    actor: systemActor('INST-UI-001', 'University of Ibadan'),
    title: 'University of Ibadan expands NLP faculty',
    body: 'Two new faculty appointments strengthen the computational linguistics group at the University of Ibadan.',
    source: source('INST-UI-001', 'institution', 'University of Ibadan'),
    visibility: 'institution',
    restriction: 'Visible to the institution community.',
    hashtags: ['institution', 'nlp'],
    views: 220,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-18T09:00:00.000Z',
  }),
  act({
    id: 'act-education-ojuri-1',
    type: 'education',
    verb: 'completed',
    actor: actorOf('ojuri'),
    title: 'Completed advanced course at the University of Ibadan',
    body: 'Completed the advanced machine translation course at the University of Ibadan.',
    source: source('INST-UI-001', 'institution', 'University of Ibadan'),
    hashtags: ['education', 'nlp'],
    views: 51,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-17T12:30:00.000Z',
  }),
  act({
    id: 'act-profile-ojuri-1',
    type: 'profile',
    verb: 'updated',
    actor: actorOf('ojuri'),
    title: 'Profile updated',
    body: 'Updated profile headline and research areas.',
    source: source('ojuri', 'researcher', 'Dr. Adebisi Ojurere'),
    visibility: 'private',
    restriction: 'Visible only to you.',
    views: 0,
    createdAt: '2026-07-16T08:00:00.000Z',
  }),
  act({
    id: 'act-orcid-ojuri-1',
    type: 'orcid',
    verb: 'synced',
    actor: actorOf('ojuri'),
    title: 'ORCID record synchronised',
    body: 'Publications and funding were synchronised to the ORCID record.',
    source: source('ojuri', 'researcher', 'Dr. Adebisi Ojurere'),
    hashtags: ['orcid'],
    views: 12,
    createdAt: '2026-07-15T10:10:00.000Z',
  }),
  act({
    id: 'act-verification-ojuri-1',
    type: 'verification',
    verb: 'verified',
    actor: actorOf('ojuri'),
    title: 'Identity verified',
    body: 'The institutional email for the University of Ibadan was verified.',
    source: source('ojuri', 'researcher', 'Dr. Adebisi Ojurere'),
    stageId: 'idea',
    hashtags: ['verification'],
    views: 18,
    createdAt: '2026-07-14T09:00:00.000Z',
  }),
  act({
    id: 'act-trust-smith-1',
    type: 'trust',
    verb: 'earned',
    actor: actorOf('smith'),
    title: 'Earned the verified collaborator trust badge',
    body: 'Completed identity verification and earned the verified collaborator badge.',
    source: source('smith', 'researcher', 'Dr. John Smith'),
    hashtags: ['trust', 'verification'],
    reactions: [react('🛡️', 'ojuri', '2026-07-13T11:00:00.000Z')],
    views: 87,
    createdAt: '2026-07-13T10:30:00.000Z',
  }),
  act({
    id: 'act-advertising-cam-1',
    type: 'advertising',
    verb: 'launched',
    actor: systemActor('adv-scholar-profile', 'Scholatia Advertising'),
    title: 'Campaign live: paper promotion',
    body: 'The paper promotion campaign is now live with a sponsored placement across discovery.',
    source: source('cam-paper-promotion', 'campaign', 'Paper promotion campaign'),
    hashtags: ['advertising'],
    views: 145,
    createdAt: '2026-07-12T09:00:00.000Z',
  }),
  act({
    id: 'act-marketplace-product-1',
    type: 'marketplace-product',
    verb: 'listed',
    actor: systemActor('vendor-ibadan-statistics-lab', 'Ibadan Statistics Lab'),
    title: 'New listing: statistical analysis service',
    body: 'The Ibadan Statistics Lab listed a new statistical analysis service on the marketplace.',
    source: source('listing-statistical-analysis', 'listing', 'Statistical analysis service'),
    hashtags: ['marketplace', 'statistics'],
    attachments: [attach('att-3', 'link', 'listing-statistical-analysis', 'listing-statistical-analysis', 'listing')],
    views: 96,
    createdAt: '2026-07-11T15:00:00.000Z',
  }),
  act({
    id: 'act-marketplace-purchase-1',
    type: 'marketplace-purchase',
    verb: 'purchased',
    actor: actorOf('maria'),
    title: 'Purchased statistical analysis service',
    body: 'Order ord-2026-0001 was placed for the statistical analysis service from the Ibadan Statistics Lab.',
    source: source('ord-2026-0001', 'order', 'Statistical analysis order'),
    hashtags: ['marketplace', 'purchase'],
    attachments: [attach('att-4', 'link', 'ord-2026-0001', 'ord-2026-0001', 'order')],
    reactions: [react('👍', 'ojuri', '2026-07-10T10:00:00.000Z')],
    views: 77,
    createdAt: '2026-07-10T09:30:00.000Z',
  }),
  act({
    id: 'act-research-service-1',
    type: 'research-service',
    verb: 'updated',
    actor: actorOf('ojuri'),
    title: 'Statistical analysis service package updated',
    body: 'Updated the statistical analysis service package with a new delivery milestone.',
    source: source('svc-statistical-analysis-1', 'service', 'Statistical analysis service'),
    hashtags: ['services', 'statistics'],
    views: 39,
    createdAt: '2026-07-09T14:00:00.000Z',
  }),
  act({
    id: 'act-service-order-1',
    type: 'service-order',
    verb: 'placed',
    actor: actorOf('dube'),
    title: 'Service order placed: editing & proofreading',
    body: 'A service order was placed for the editing and proofreading package.',
    source: source('svc-editing-proofreading-1', 'service', 'Editing & proofreading'),
    hashtags: ['services', 'editing'],
    views: 44,
    createdAt: '2026-07-08T11:45:00.000Z',
  }),
  act({
    id: 'act-subscription-1',
    type: 'subscription',
    verb: 'activated',
    actor: actorOf('ojuri'),
    title: 'Researcher Pro subscription activated',
    body: 'Activated the Researcher Pro plan (sub-ojuri-pro) with advanced analytics.',
    source: source('sub-ojuri-pro', 'subscription', 'Researcher Pro'),
    hashtags: ['subscription'],
    views: 28,
    createdAt: '2026-07-07T08:20:00.000Z',
  }),
  act({
    id: 'act-commerce-1',
    type: 'commerce',
    verb: 'settled',
    actor: actorOf('ojuri'),
    title: 'Transaction settled: ord-2026-0001',
    body: 'The marketplace order was settled and the invoice released.',
    source: source('ord-2026-0001', 'order', 'Statistical analysis order'),
    hashtags: ['commerce', 'payment'],
    views: 34,
    createdAt: '2026-07-06T16:00:00.000Z',
  }),
  act({
    id: 'act-recommendation-1',
    type: 'recommendation',
    verb: 'recommended',
    actor: systemActor('scholatia-intelligence', 'Scholatia Intelligence'),
    title: 'Recommended reading based on your research areas',
    body: 'A paper on cross-lingual transfer was recommended based on your NLP research areas.',
    source: source('10.1000/placeholder.2026.0042', 'publication', 'Low-resource dependency parsing'),
    hashtags: ['recommendation', 'nlp'],
    mentions: [mentionOf('ojuri')],
    views: 22,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-07-05T09:00:00.000Z',
  }),
  act({
    id: 'act-ai-insight-1',
    type: 'ai-insight',
    verb: 'generated',
    actor: systemActor('scholatia-ai', 'Scholatia AI'),
    title: 'AI insight: citation momentum is rising',
    body: 'Citation activity for your multilingual parsing work is up 24% this quarter.',
    source: source('ojuri', 'researcher', 'Dr. Adebisi Ojurere'),
    hashtags: ['ai', 'insight'],
    views: 15,
    createdAt: '2026-07-04T07:30:00.000Z',
  }),
  act({
    id: 'act-announcement-1',
    type: 'announcement',
    verb: 'posted',
    actor: systemActor('scholatia-platform', 'Scholatia'),
    title: 'Platform announcement: new discovery filters',
    body: 'Discovery now supports continent and year filters across every scholarly record type.',
    source: source('scholatia-platform', 'announcement', 'Platform announcement'),
    hashtags: ['announcement'],
    views: 210,
    createdAt: '2026-07-03T10:00:00.000Z',
  }),
  act({
    id: 'act-security-1',
    type: 'security',
    verb: 'flagged',
    actor: systemActor('scholatia-security', 'Scholatia Security'),
    title: 'Security alert: unusual login detected',
    body: 'An unusual login attempt was blocked for your account. Review your recent sessions.',
    source: source('ojuri', 'researcher', 'Dr. Adebisi Ojurere'),
    visibility: 'restricted',
    restriction: 'Visible only to you.',
    hashtags: ['security'],
    views: 3,
    createdAt: '2026-07-02T22:15:00.000Z',
  }),
  act({
    id: 'act-grant-nrc-2',
    type: 'grant',
    verb: 'reported',
    actor: actorOf('ojuri'),
    title: 'Grant milestone reported: NRC language technology',
    body: 'Quarterly milestone report submitted for grant grant-nrc-2022-113.',
    source: source('grant-nrc-2022-113', 'grant', 'NRC language technology grant'),
    stageId: 'funding',
    hashtags: ['grant', 'report'],
    views: 31,
    createdAt: '2026-07-01T09:00:00.000Z',
  }),
  act({
    id: 'act-publication-jscholar-1',
    type: 'publication',
    verb: 'posted',
    actor: actorOf('jscholar'),
    title: 'Preprint posted: annotation consistency in treebanks',
    body: 'Preprint on annotation consistency across multilingual treebanks posted.',
    source: source('10.1000/placeholder.2026.0042', 'publication', 'Annotation consistency in treebanks'),
    stageId: 'publication',
    hashtags: ['nlp', 'preprint'],
    mentions: [mentionOf('ojuri')],
    reactions: [react('💡', 'ojuri', '2026-06-30T12:00:00.000Z')],
    views: 89,
    metadata: { discipline: 'nlp' },
    createdAt: '2026-06-30T11:30:00.000Z',
  }),
  act({
    id: 'act-citation-smith-1',
    type: 'citation',
    verb: 'received',
    actor: actorOf('smith'),
    title: 'Publication cited in a journal article',
    body: 'The open research paper was cited in a new journal article on language technology evaluation.',
    source: source('10.1000/placeholder.2026.0042', 'publication', 'Low-resource dependency parsing'),
    stageId: 'citation',
    hashtags: ['citations'],
    views: 55,
    createdAt: '2026-06-29T13:00:00.000Z',
  }),
  act({
    id: 'act-conference-schl-1',
    type: 'conference',
    verb: 'announced',
    actor: systemActor('CONF-002', 'SCHL 2026'),
    title: 'SCHL 2026 registration opens',
    body: 'Registration for the Scholatia Humanities & Languages conference is now open.',
    source: source('CONF-002', 'conference', 'SCHL 2026'),
    stageId: 'conference',
    hashtags: ['conference'],
    views: 118,
    createdAt: '2026-06-28T09:00:00.000Z',
  }),
  act({
    id: 'act-peer-review-ojuri-1',
    type: 'peer-review',
    verb: 'accepted',
    actor: actorOf('ojuri'),
    title: 'Accepted peer review invitation from SJOR',
    body: 'Accepted an invitation to review a manuscript for the Scholatia Journal of Open Research.',
    source: source('JNL-001', 'journal', 'SJOR'),
    stageId: 'peer-review',
    hashtags: ['peerreview'],
    views: 25,
    createdAt: '2026-06-27T10:00:00.000Z',
  }),
  act({
    id: 'act-manuscript-ojuri-2',
    type: 'manuscript',
    verb: 'revised',
    actor: actorOf('ojuri'),
    title: 'Manuscript revision uploaded: MS-2026-0014',
    body: 'Revision addressing reviewer feedback uploaded for MS-2026-0014.',
    source: source('MS-2026-0014', 'manuscript', 'Cross-lingual transfer manuscript'),
    stageId: 'manuscript',
    hashtags: ['manuscript', 'revision'],
    views: 48,
    createdAt: '2026-06-26T15:30:00.000Z',
  }),
];

// ---------------------------------------------------------------------------
// Comments, bookmarks, shares, reports, moderation, pins
// ---------------------------------------------------------------------------

export const COMMENTS: ActivityComment[] = [
  {
    id: 'comment-1',
    activityId: 'act-publication-smith-1',
    author: actorOf('wang'),
    body: 'Great work — the treebank contributions were key here.',
    mentions: [],
    reactions: [react('👍', 'ojuri', '2026-07-31T11:00:00.000Z')],
    createdAt: '2026-07-31T10:10:00.000Z',
    replies: [
      {
        id: 'reply-1',
        commentId: 'comment-1',
        author: actorOf('smith'),
        body: 'Thanks @wang — credit to the whole group.',
        mentions: [mentionOf('wang')],
        reactions: [],
        createdAt: '2026-07-31T10:30:00.000Z',
      },
    ],
  },
  {
    id: 'comment-2',
    activityId: 'act-publication-smith-1',
    author: actorOf('ojuri'),
    body: 'Congratulations! The parsing results are reproducible on the treebanks.',
    mentions: [],
    reactions: [],
    createdAt: '2026-07-31T09:50:00.000Z',
    replies: [],
  },
  {
    id: 'comment-3',
    activityId: 'act-journal-sjor-1',
    author: actorOf('ojuri'),
    body: 'Looking forward to the special issue.',
    mentions: [],
    reactions: [react('🎉', 'smith', '2026-07-26T10:00:00.000Z')],
    createdAt: '2026-07-26T09:30:00.000Z',
    replies: [],
  },
  {
    id: 'comment-4',
    activityId: 'act-ai-insight-1',
    author: actorOf('ojuri'),
    body: 'Useful signal for the quarterly grant report.',
    mentions: [],
    reactions: [],
    createdAt: '2026-07-04T08:00:00.000Z',
    replies: [],
  },
];

export const BOOKMARKS: ActivityBookmark[] = [
  { id: 'bookmark-1', activityId: 'act-publication-smith-1', bookmarkedBy: 'ojuri', bookmarkedByName: OJURI.displayName, bookmarkedAt: '2026-07-31T10:00:00.000Z' },
  { id: 'bookmark-2', activityId: 'act-journal-sjor-1', bookmarkedBy: 'ojuri', bookmarkedByName: OJURI.displayName, bookmarkedAt: '2026-07-26T10:00:00.000Z' },
  { id: 'bookmark-3', activityId: 'act-award-okonkwo-1', bookmarkedBy: 'smith', bookmarkedByName: SMITH.displayName, bookmarkedAt: '2026-07-19T18:00:00.000Z' },
];

export const SHARES: ActivityShare[] = [
  { id: 'share-1', activityId: 'act-publication-smith-1', sharedBy: 'ojuri', sharedByName: OJURI.displayName, platform: 'scholatia', sharedAt: '2026-07-31T10:05:00.000Z' },
  { id: 'share-2', activityId: 'act-dataset-wang-1', sharedBy: 'maria', sharedByName: MARIA.displayName, platform: 'linkedin', sharedAt: '2026-07-29T12:30:00.000Z' },
  { id: 'share-3', activityId: 'act-journal-sjor-1', sharedBy: 'smith', sharedByName: SMITH.displayName, platform: 'email', sharedAt: '2026-07-26T10:10:00.000Z' },
];

export const REPORTS: ActivityReport[] = [
  {
    id: 'report-1',
    activityId: 'act-announcement-1',
    reportedBy: 'okonkwo',
    reportedByName: OKONKWO.displayName,
    reason: 'Duplicate activity',
    detail: 'Appears twice in the feed.',
    status: 'open',
    createdAt: '2026-07-03T11:00:00.000Z',
  },
  {
    id: 'report-2',
    activityId: 'act-announcement-1',
    reportedBy: 'adesina',
    reportedByName: ADESINA.displayName,
    reason: 'Spam',
    detail: 'Looks like promotional content.',
    status: 'reviewing',
    createdAt: '2026-07-03T12:00:00.000Z',
  },
  {
    id: 'report-3',
    activityId: 'act-marketplace-product-1',
    reportedBy: 'okonkwo',
    reportedByName: OKONKWO.displayName,
    reason: 'Other',
    status: 'resolved',
    createdAt: '2026-07-11T16:00:00.000Z',
    resolvedAt: '2026-07-12T09:00:00.000Z',
    resolvedBy: 'moderator-1',
  },
];

export const MODERATION: ActivityModerationEntry[] = [
  {
    id: 'moderation-1',
    activityId: 'act-announcement-1',
    action: 'hidden',
    moderator: 'moderator-1',
    moderatorName: 'Scholatia Moderation',
    reason: 'Duplicate promotional content under review.',
    createdAt: '2026-07-03T14:00:00.000Z',
  },
];

export const PINS: ActivityPin[] = [
  { activityId: 'act-publication-smith-1', pinnedBy: 'ojuri', pinnedByName: OJURI.displayName, pinnedAt: '2026-07-31T10:00:00.000Z' },
  { activityId: 'act-journal-sjor-1', pinnedBy: 'smith', pinnedByName: SMITH.displayName, pinnedAt: '2026-07-26T10:00:00.000Z' },
];

// ---------------------------------------------------------------------------
// Derived aggregates — engagement, scores, statistics, analytics, feeds
// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

/** The current user's canonical recommendation profile. */
export const OJURI_PROFILE: ActivityRecommendationProfile = {
  username: OJURI.username,
  institution: 'INST-UI-001',
  disciplines: ['nlp', 'parsing', 'ai'],
  follows: ['smith', 'jscholar', 'wang'],
};

export const ACTIVITIES: ActivityItem[] = RAW_ACTIVITIES.map((activity) =>
  resolveEngagement(activity, COMMENTS, BOOKMARKS, SHARES),
).map((activity) => ({
  ...activity,
  trendScore: trendScore(activity, COMMENTS, BOOKMARKS, SHARES, NOW),
  recommendationScore: recommendationScore(activity, OJURI_PROFILE),
}));

export const FEATURED_ACTIVITIES: ActivityItem[] = featuredActivities(ACTIVITIES);
export const TRENDING: ActivityTrendingEntry[] = trendingActivities(ACTIVITIES, COMMENTS, BOOKMARKS, SHARES, { now: NOW, top: 10, period: '7d' });
export const RECOMMENDATIONS: ActivityRecommendation[] = recommendedActivities(ACTIVITIES, OJURI_PROFILE, { top: 10 });
export const FEEDS: ActivityFeed[] = buildFeeds(ACTIVITIES, OJURI_PROFILE, COMMENTS, BOOKMARKS, SHARES, {
  discipline: 'nlp',
  journalId: 'JNL-001',
  conferenceId: 'CONF-001',
});
export const ACTIVITY_STATISTICS: ActivityStatistics = activityStatistics(ACTIVITIES, COMMENTS, BOOKMARKS, SHARES, REPORTS, MODERATION);
export const ACTIVITY_ANALYTICS: ActivityAnalytics = activityAnalytics(ACTIVITIES, COMMENTS, BOOKMARKS, SHARES, OJURI_PROFILE, {
  discipline: 'nlp',
  journalId: 'JNL-001',
  conferenceId: 'CONF-001',
});
export const INSIGHTS: ActivityInsight[] = activityInsights(ACTIVITIES, COMMENTS, BOOKMARKS, SHARES);
export const ALL_HASHTAGS: { tag: string; count: number }[] = hashtagsForActivities(ACTIVITIES);

export const ACTIVITY_PORTFOLIO: ActivityPortfolio = {
  statistics: ACTIVITY_STATISTICS,
  analytics: ACTIVITY_ANALYTICS,
  activities: ACTIVITIES,
  comments: COMMENTS,
  bookmarks: BOOKMARKS,
  shares: SHARES,
  reports: REPORTS,
  moderation: MODERATION,
  feeds: FEEDS,
  trending: TRENDING,
  recommendations: RECOMMENDATIONS,
  featured: FEATURED_ACTIVITIES,
  pinned: PINS,
  insights: INSIGHTS,
};

export const CURRENT_ACTIVITY_USER = CURRENT_USER;
export const FEATURED_ACTIVITY = FEATURED_ACTIVITIES[0];
export const DEFAULT_ACTIVITY_TYPE = 'publication' as const;
export const DEFAULT_ACTIVITY_VISIBILITY = 'public' as const;
export const ACTIVITY_EMOJI_PALETTE = ACTIVITY_EMOJIS;
export { PINS as PINNED_ACTIVITIES };
