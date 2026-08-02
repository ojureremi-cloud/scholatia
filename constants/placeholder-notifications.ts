import type {
  Notification,
  NotificationAlert,
  NotificationAnalytics,
  NotificationCategory,
  NotificationChannel,
  NotificationDelivery,
  NotificationDigest,
  NotificationDigestFrequency,
  NotificationPreference,
  NotificationPriority,
  NotificationSource,
  NotificationSourceEntityType,
  NotificationStatistics,
  NotificationSubscription,
  NotificationTarget,
  NotificationTemplate,
} from '@/types/notifications';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITIES,
} from '@/types/notifications';
import {
  buildNotificationUrl,
  createNotification,
  digestNotifications,
  notificationAnalytics,
  notificationStatistics,
} from '@/lib/notifications';
import { createSaidIdentifier } from '@/lib/said';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import type { ResearcherProfile } from '@/types/researcher';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Placeholder data for the Scholatia Unified Notification Engine
 * (Phase 2.2A).
 *
 * The engine owns no records: every notification below references an existing
 * canonical source record through `sourceId` + `sourceEntity` — a researcher
 * username, a journal id, a conference id, an institution id, a grant id, a
 * dataset id, a manuscript id, a publisher id, a project id, a commerce order,
 * a service, a marketplace listing, an ad campaign, or a trust integrity
 * record. Deliveries, digests, statistics, and analytics are all derived from
 * the notifications array by the pure engine in `lib/notifications.ts`.
 */

const CURRENT_DATE = '2026-07-31';

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
const MARIA = researcherOf('maria');

const targetOjuri: NotificationTarget = {
  username: OJURI.username,
  name: OJURI.displayName,
  said: OJURI.identity.said,
};

const targetSmith: NotificationTarget = {
  username: SMITH.username,
  name: SMITH.displayName,
  said: SMITH.identity.said,
};

const targetJscholar: NotificationTarget = {
  username: JSCHOLAR.username,
  name: JSCHOLAR.displayName,
  said: JSCHOLAR.identity.said,
};

const targetInstitution: NotificationTarget = {
  username: 'uni-ibadan',
  name: 'University of Ibadan',
  entityType: 'institution',
  said: 'SAID-INST-0000',
};

const targetJournal: NotificationTarget = {
  userId: 'JNL-001',
  name: 'Scholatia Journal of Open Research',
  entityType: 'journal',
};

function source(
  id: string,
  entityType: NotificationSourceEntityType,
  title?: string,
  url?: string,
): NotificationSource {
  return { id, entityType, title, url: url ?? buildNotificationUrl({ id, entityType, title }) };
}

// ---------------------------------------------------------------------------
// Notification seeds
// ---------------------------------------------------------------------------

type NotificationSeed = {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  status?: Notification['status'];
  channels?: NotificationChannel[];
  sourceId: string;
  sourceEntity: NotificationSourceEntityType;
  sourceTitle?: string;
  sourceUrl?: string;
  stageId?: ResearchLifecycleStageId;
  actor?: Notification['actor'];
  actionLabel?: string;
  actionUrl?: string;
  createdAt: string;
};

function ntf(seed: NotificationSeed): Notification {
  return createNotification({
    id: seed.id,
    title: seed.title,
    body: seed.body,
    category: seed.category,
    priority: seed.priority,
    status: seed.status,
    channels: seed.channels,
    source: source(seed.sourceId, seed.sourceEntity, seed.sourceTitle, seed.sourceUrl),
    target: targetOjuri,
    actor: seed.actor,
    stageId: seed.stageId,
    createdAt: seed.createdAt,
    action: seed.actionLabel
      ? { label: seed.actionLabel, url: seed.actionUrl ?? buildNotificationUrl(source(seed.sourceId, seed.sourceEntity)) }
      : undefined,
  });
}

export const NOTIFICATIONS: Notification[] = [
  // --- Identity -----------------------------------------------------------
  ntf({
    id: 'ntf-identity-verification',
    title: 'Identity verification approved',
    body: `Your Scholatia Academic Identity (SAID) for ${OJURI.displayName} was verified at Verified Researcher level. Your profile now carries the platform verification badge.`,
    category: 'identity',
    priority: 'high',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: OJURI.username,
    sourceEntity: 'researcher',
    sourceTitle: OJURI.displayName,
    stageId: 'impact',
    createdAt: '2026-07-02T08:30:00.000Z',
  }),
  ntf({
    id: 'ntf-identity-orcid-linked',
    title: 'ORCID record linked',
    body: 'Your ORCID iD was linked to your Scholatia profile, strengthening your scholarly identity across the ecosystem.',
    category: 'identity',
    priority: 'normal',
    status: 'read',
    channels: ['in-app'],
    sourceId: OJURI.username,
    sourceEntity: 'researcher',
    sourceTitle: OJURI.displayName,
    createdAt: '2026-06-18T12:00:00.000Z',
  }),

  // --- Research -----------------------------------------------------------
  ntf({
    id: 'ntf-research-project-milestone',
    title: 'Project milestone in progress',
    body: 'The public evaluation release milestone of the Multilingual Parsing Framework is in progress and due in November 2026.',
    category: 'research',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email', 'push'],
    sourceId: 'multilingual-parsing-framework',
    sourceEntity: 'project',
    sourceTitle: 'Multilingual Parsing Framework',
    stageId: 'project',
    createdAt: '2026-07-28T09:15:00.000Z',
  }),
  ntf({
    id: 'ntf-research-publication-cited',
    title: 'New citation to your work',
    body: 'A 2026 paper in the Scholatia Journal of Computational Linguistics cited your multilingual parsing research.',
    category: 'research',
    priority: 'normal',
    status: 'read',
    channels: ['in-app'],
    sourceId: '10.1000/placeholder.2025.0111',
    sourceEntity: 'publication',
    sourceTitle: 'Cross-lingual transfer study',
    stageId: 'citation',
    createdAt: '2026-07-20T14:00:00.000Z',
  }),
  ntf({
    id: 'ntf-research-manuscript-status',
    title: 'Manuscript status update',
    body: 'Your manuscript "Evaluating Cross-Lingual Transfer in Dependency Parsing" moved to major revision after round 1 peer review.',
    category: 'research',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'mns-low-resource-parsing',
    sourceEntity: 'manuscript',
    sourceTitle: 'Cross-lingual Transfer in Dependency Parsing',
    stageId: 'peer-review',
    createdAt: '2026-07-25T10:00:00.000Z',
  }),

  // --- Projects -----------------------------------------------------------
  ntf({
    id: 'ntf-projects-deadline',
    title: 'Grant reporting deadline',
    body: 'The mid-year report for grant NRC 2022/113 is due on 31 July 2026. Submit your progress summary to stay on track.',
    category: 'projects',
    priority: 'urgent',
    status: 'unread',
    channels: ['in-app', 'email', 'push', 'mobile'],
    sourceId: 'multilingual-parsing-framework',
    sourceEntity: 'project',
    sourceTitle: 'Multilingual Parsing Framework',
    stageId: 'funding',
    actionLabel: 'View project',
    createdAt: '2026-07-30T07:00:00.000Z',
  }),
  ntf({
    id: 'ntf-projects-collaboration',
    title: 'Collaboration request accepted',
    body: `${MARIA.displayName} accepted your collaboration invitation on the Low-Resource Language Toolkit.`,
    category: 'projects',
    priority: 'normal',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'low-resource-language-toolkit',
    sourceEntity: 'project',
    sourceTitle: 'Low-Resource Language Toolkit',
    actor: { id: MARIA.username, name: MARIA.displayName },
    stageId: 'project',
    createdAt: '2026-07-15T16:20:00.000Z',
  }),

  // --- Datasets -----------------------------------------------------------
  ntf({
    id: 'ntf-datasets-version',
    title: 'Dataset v3.1 published',
    body: 'A new version of the Multilingual Parsing Framework treebanks (v3.1) was published with 10 additional languages.',
    category: 'datasets',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: 'mpf-multilingual-treebanks',
    sourceEntity: 'dataset',
    sourceTitle: 'Multilingual Parsing Framework — UD Treebanks',
    stageId: 'dataset',
    createdAt: '2026-07-19T11:00:00.000Z',
  }),
  ntf({
    id: 'ntf-datasets-downloaded',
    title: 'Your dataset was downloaded',
    body: 'The annotated low-resource corpus was downloaded 340 times this week, a 12% increase over last week.',
    category: 'datasets',
    priority: 'low',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'lrlt-annotated-corpus-v2',
    sourceEntity: 'dataset',
    sourceTitle: 'Annotated Low-Resource Corpus v2',
    stageId: 'impact',
    createdAt: '2026-07-16T09:00:00.000Z',
  }),

  // --- Discovery ----------------------------------------------------------
  ntf({
    id: 'ntf-discovery-trend',
    title: 'Your research area is trending',
    body: '"Cross-lingual transfer learning" is now among the top 10 trending topics on Scholatia Discovery this week.',
    category: 'discovery',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app'],
    sourceId: 'trend-cross-lingual-transfer',
    sourceEntity: 'publication',
    sourceTitle: 'Trending research topic',
    stageId: 'publication',
    createdAt: '2026-07-27T13:30:00.000Z',
  }),
  ntf({
    id: 'ntf-discovery-alert',
    title: 'New paper matching your interests',
    body: 'A new publication on low-resource dependency parsing matches your saved research interests.',
    category: 'discovery',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: '10.1000/placeholder.2026.0042',
    sourceEntity: 'publication',
    sourceTitle: 'Low-resource parsing study',
    stageId: 'publication',
    actionLabel: 'View in discovery',
    createdAt: '2026-07-29T08:00:00.000Z',
  }),

  // --- Intelligence -------------------------------------------------------
  ntf({
    id: 'ntf-intelligence-recommendation',
    title: 'Recommended collaboration',
    body: `${SMITH.displayName} at the University of Cambridge is a strong potential collaborator for your parsing research — 82% match confidence.`,
    category: 'intelligence',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app'],
    sourceId: SMITH.username,
    sourceEntity: 'researcher',
    sourceTitle: SMITH.displayName,
    actionLabel: 'View recommendation',
    createdAt: '2026-07-26T10:45:00.000Z',
  }),
  ntf({
    id: 'ntf-intelligence-forecast',
    title: 'Research forecast available',
    body: 'Intelligence forecasts a 28% increase in citations for your published parsing work over the next year.',
    category: 'intelligence',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: '10.1000/placeholder.2024.0032',
    sourceEntity: 'publication',
    sourceTitle: 'Citation forecast',
    stageId: 'impact',
    createdAt: '2026-07-10T15:00:00.000Z',
  }),

  // --- Trust --------------------------------------------------------------
  ntf({
    id: 'ntf-trust-score-update',
    title: 'Your trust score increased',
    body: 'Your trust score rose to 92 after verified contributions. Trust signals remain reusable across commerce, marketplace, services, and publishing.',
    category: 'trust',
    priority: 'high',
    status: 'read',
    channels: ['in-app'],
    sourceId: OJURI.username,
    sourceEntity: 'researcher',
    sourceTitle: OJURI.displayName,
    stageId: 'impact',
    createdAt: '2026-07-12T09:30:00.000Z',
  }),
  ntf({
    id: 'ntf-trust-integrity',
    title: 'Integrity record resolved',
    body: 'The integrity event related to the retraction notice you follow was resolved and the record updated on the Trust platform.',
    category: 'trust',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: 'integrity-retraction-1',
    sourceEntity: 'publication',
    sourceTitle: 'Retraction integrity record',
    createdAt: '2026-07-08T14:00:00.000Z',
  }),

  // --- Advertising --------------------------------------------------------
  ntf({
    id: 'ntf-ads-campaign-report',
    title: 'Weekly campaign report',
    body: 'Your paper promotion campaign reached 48,000 impressions with a 2.1% CTR and 312 profile visits this week.',
    category: 'advertising',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'cam-paper-promotion',
    sourceEntity: 'campaign',
    sourceTitle: 'Paper promotion campaign',
    actionLabel: 'View campaign',
    createdAt: '2026-07-27T08:00:00.000Z',
  }),
  ntf({
    id: 'ntf-ads-budget',
    title: 'Campaign budget threshold reached',
    body: 'Your journal launch campaign has consumed 80% of its monthly budget. Adjust the daily cap to avoid overspend.',
    category: 'advertising',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email', 'push'],
    sourceId: 'cam-journal-launch',
    sourceEntity: 'campaign',
    sourceTitle: 'Journal launch campaign',
    createdAt: '2026-07-29T10:00:00.000Z',
  }),

  // --- Commerce -----------------------------------------------------------
  ntf({
    id: 'ntf-commerce-order-shipped',
    title: 'Order confirmed and processing',
    body: 'Your order ord-2026-0001 (Statistical Analysis Service) was confirmed. Payment settled and the provider was notified.',
    category: 'commerce',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: 'ord-2026-0001',
    sourceEntity: 'order',
    sourceTitle: 'Statistical Analysis Service order',
    stageId: 'funding',
    createdAt: '2026-07-02T10:00:00.000Z',
  }),
  ntf({
    id: 'ntf-commerce-subscription-renewal',
    title: 'Subscription renews in 2 days',
    body: 'Your Researcher Pro subscription renews on 1 August 2026. Manage billing before the renewal date.',
    category: 'commerce',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email', 'push', 'mobile'],
    sourceId: 'sub-ojuri-pro',
    sourceEntity: 'subscription',
    sourceTitle: 'Researcher Pro subscription',
    actionLabel: 'Manage billing',
    createdAt: '2026-07-30T09:00:00.000Z',
  }),
  ntf({
    id: 'ntf-commerce-payout',
    title: 'Commission payout completed',
    body: 'A commission payout of 206 USD for your vendor earnings was credited to your wallet.',
    category: 'commerce',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: 'wallet-ojuri',
    sourceEntity: 'subscription',
    sourceTitle: 'Wallet credit',
    stageId: 'funding',
    createdAt: '2026-07-14T12:00:00.000Z',
  }),

  // --- Marketplace --------------------------------------------------------
  ntf({
    id: 'ntf-marketplace-listing-review',
    title: 'New review on your listing',
    body: 'A verified buyer left a 5-star review on the Statistical Analysis listing on the marketplace.',
    category: 'marketplace',
    priority: 'normal',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'listing-statistical-analysis',
    sourceEntity: 'listing',
    sourceTitle: 'Statistical Analysis listing',
    createdAt: '2026-07-21T17:00:00.000Z',
  }),
  ntf({
    id: 'ntf-marketplace-inquiry',
    title: 'New inquiry on your listing',
    body: 'A researcher inquired about the Academic Editing listing. Respond within 24 hours to keep your response rate high.',
    category: 'marketplace',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'listing-academic-editing',
    sourceEntity: 'listing',
    sourceTitle: 'Academic Editing listing',
    actionLabel: 'Respond',
    createdAt: '2026-07-28T11:30:00.000Z',
  }),

  // --- Services -----------------------------------------------------------
  ntf({
    id: 'ntf-services-order-delivered',
    title: 'Service order delivered',
    body: 'The editing order on svc-editing-proofreading-1 was delivered. Review the work and release payment when satisfied.',
    category: 'services',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'svc-editing-proofreading-1',
    sourceEntity: 'service',
    sourceTitle: 'Editing & Proofreading service',
    stageId: 'peer-review',
    actionLabel: 'View order',
    createdAt: '2026-07-26T15:45:00.000Z',
  }),
  ntf({
    id: 'ntf-services-milestone',
    title: 'Milestone completed',
    body: 'The "Revision round" milestone on your statistical analysis order was completed by the provider.',
    category: 'services',
    priority: 'normal',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'ord-service-001',
    sourceEntity: 'milestone',
    sourceTitle: 'Statistical analysis order milestone',
    createdAt: '2026-07-18T13:00:00.000Z',
  }),
  ntf({
    id: 'ntf-services-dispute',
    title: 'Dispute opened on an order',
    body: 'A dispute was opened on order SV-2026-0001. Scholatia Trust is reviewing the evidence and order history.',
    category: 'services',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'disp-service-1',
    sourceEntity: 'dispute',
    sourceTitle: 'Service dispute',
    createdAt: '2026-07-24T09:00:00.000Z',
  }),

  // --- Publishing ---------------------------------------------------------
  ntf({
    id: 'ntf-publishing-cfp',
    title: 'Call for papers: special issue',
    body: 'The Scholatia Journal of Computational Linguistics opened a call for papers on low-resource NLP, closing 30 September 2026.',
    category: 'publishing',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'JNL-002',
    sourceEntity: 'journal',
    sourceTitle: 'Journal call for papers',
    stageId: 'submission',
    actionLabel: 'View call',
    createdAt: '2026-07-23T08:30:00.000Z',
  }),
  ntf({
    id: 'ntf-publishing-issue',
    title: 'New journal issue published',
    body: 'Volume 7, Issue 3 of the Scholatia Journal of Open Research is now published with 24 articles.',
    category: 'publishing',
    priority: 'low',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'JNL-001',
    sourceEntity: 'journal',
    sourceTitle: 'Scholatia Journal of Open Research',
    createdAt: '2026-07-05T10:00:00.000Z',
  }),

  // --- Publishers ---------------------------------------------------------
  ntf({
    id: 'ntf-publishers-portfolio',
    title: 'Publisher portfolio update',
    body: 'Scholatia Press added the Low-Resource Language Toolkit to its open access portfolio.',
    category: 'publishers',
    priority: 'low',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'scholatia-press',
    sourceEntity: 'publisher',
    sourceTitle: 'Scholatia Press',
    createdAt: '2026-07-11T09:00:00.000Z',
  }),

  // --- Institutions -------------------------------------------------------
  ntf({
    id: 'ntf-institutions-licence',
    title: 'Institutional licence renewed',
    body: 'The University of Ibadan renewed its institutional membership plan, keeping enterprise access active for your department.',
    category: 'institutions',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: 'INST-UI-001',
    sourceEntity: 'institution',
    sourceTitle: 'University of Ibadan',
    createdAt: '2026-07-06T09:00:00.000Z',
  }),
  ntf({
    id: 'ntf-institutions-verification',
    title: 'Institution verification approved',
    body: 'Your affiliation with the University of Ibadan was verified by the institution, upgrading your trust signals.',
    category: 'institutions',
    priority: 'high',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'INST-UI-001',
    sourceEntity: 'institution',
    sourceTitle: 'University of Ibadan',
    stageId: 'impact',
    createdAt: '2026-06-28T10:30:00.000Z',
  }),

  // --- Funding ------------------------------------------------------------
  ntf({
    id: 'ntf-funding-opportunity',
    title: 'New funding opportunity matches you',
    body: 'A new call from the National Research Council matches your research areas. Applications close 15 September 2026.',
    category: 'funding',
    priority: 'normal',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'grant-nrc-2022-113',
    sourceEntity: 'funding',
    sourceTitle: 'National Research Council call',
    stageId: 'funding',
    actionLabel: 'View opportunity',
    createdAt: '2026-07-26T07:00:00.000Z',
  }),
  ntf({
    id: 'ntf-funding-deadline',
    title: 'Funding application deadline in 7 days',
    body: 'Your draft application for the Digital Futures Fund closes on 7 August 2026. Finalise your proposal.',
    category: 'funding',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email', 'push'],
    sourceId: 'grant-dff-2021-087',
    sourceEntity: 'funding',
    sourceTitle: 'Digital Futures Fund',
    stageId: 'funding',
    actionLabel: 'Continue draft',
    createdAt: '2026-07-31T08:00:00.000Z',
  }),

  // --- Conferences --------------------------------------------------------
  ntf({
    id: 'ntf-conferences-accepted',
    title: 'Conference abstract accepted',
    body: 'Your abstract was accepted for the Scholatia International Conference on Research. Registration closes 14 August 2026.',
    category: 'conferences',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'CONF-001',
    sourceEntity: 'conference',
    sourceTitle: 'Scholatia International Conference',
    stageId: 'conference',
    actionLabel: 'Register',
    createdAt: '2026-07-22T12:00:00.000Z',
  }),
  ntf({
    id: 'ntf-conferences-schedule',
    title: 'Conference schedule released',
    body: 'The session schedule for the Scholatia Computational Linguistics conference is now available.',
    category: 'conferences',
    priority: 'low',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'CONF-002',
    sourceEntity: 'conference',
    sourceTitle: 'Scholatia Computational Linguistics conference',
    createdAt: '2026-07-03T10:00:00.000Z',
  }),

  // --- Journals -----------------------------------------------------------
  ntf({
    id: 'ntf-journals-decision',
    title: 'Editorial decision available',
    body: 'A decision is available for your manuscript at the Scholatia Journal of Computational Linguistics. Review the editorial report.',
    category: 'journals',
    priority: 'high',
    status: 'unread',
    channels: ['in-app', 'email'],
    sourceId: 'JNL-002',
    sourceEntity: 'journal',
    sourceTitle: 'Scholatia Journal of Computational Linguistics',
    stageId: 'peer-review',
    actionLabel: 'Review decision',
    createdAt: '2026-07-24T16:00:00.000Z',
  }),
  ntf({
    id: 'ntf-journals-review-invitation',
    title: 'Peer review invitation',
    body: 'You were invited to review a manuscript in your field for the Scholatia Journal of Open Research.',
    category: 'journals',
    priority: 'normal',
    status: 'read',
    channels: ['in-app', 'email'],
    sourceId: 'JNL-001',
    sourceEntity: 'journal',
    sourceTitle: 'Scholatia Journal of Open Research',
    stageId: 'peer-review',
    actionLabel: 'Accept or decline',
    createdAt: '2026-07-09T09:00:00.000Z',
  }),

  // --- Cross-module synthetic alerts --------------------------------------
  ntf({
    id: 'ntf-trust-advertising-spend',
    title: 'Trusted advertiser boost applied',
    body: 'Your paper promotion campaign is now boosted under the Scholatia trust tier, improving placement quality signals.',
    category: 'advertising',
    priority: 'low',
    status: 'read',
    channels: ['in-app'],
    sourceId: 'cam-paper-promotion',
    sourceEntity: 'campaign',
    sourceTitle: 'Paper promotion campaign',
    createdAt: '2026-07-17T09:00:00.000Z',
  }),
];

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

function defaultPreference(category: NotificationCategory): NotificationPreference {
  const channels = Object.fromEntries(NOTIFICATION_CHANNELS.map((channel) => [channel, true])) as Record<
    NotificationChannel,
    boolean
  >;
  return {
    id: `pref-${category}`,
    target: targetOjuri,
    category,
    channels,
    muted: false,
    digestFrequency: 'realtime',
    quietHours: { enabled: true, start: '22:00', end: '07:00' },
  };
}

export const PREFERENCES: NotificationPreference[] = NOTIFICATION_CATEGORIES.map((category) => ({
  ...defaultPreference(category),
  id: `pref-${category}`,
  muted: category === 'advertising',
  channels: {
    ...defaultPreference(category).channels,
    sms: category === 'projects' || category === 'funding' || category === 'commerce',
    webhook: category === 'publishers' || category === 'institutions',
  },
  digestFrequency: category === 'advertising' || category === 'marketplace' ? 'daily' : 'realtime',
}));

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-research-milestone',
    name: 'Research milestone update',
    category: 'research',
    title: 'Milestone status update',
    body: 'The milestone "{milestone}" for {project} changed to {status}.',
    defaultPriority: 'normal',
    defaultChannels: ['in-app', 'email'],
    icon: '🔬',
  },
  {
    id: 'tpl-manuscript-decision',
    name: 'Editorial decision',
    category: 'journals',
    title: 'Editorial decision available',
    body: 'A decision is available for your manuscript at {journal}.',
    defaultPriority: 'high',
    defaultChannels: ['in-app', 'email'],
    icon: '🗞️',
  },
  {
    id: 'tpl-funding-deadline',
    name: 'Funding deadline',
    category: 'funding',
    title: 'Funding deadline approaching',
    body: '{grant} closes on {date}. Finalise your application.',
    defaultPriority: 'urgent',
    defaultChannels: ['in-app', 'email', 'push'],
    icon: '💰',
  },
  {
    id: 'tpl-order-status',
    name: 'Commerce order update',
    category: 'commerce',
    title: 'Order status update',
    body: 'Your order {order} is now {status}.',
    defaultPriority: 'normal',
    defaultChannels: ['in-app', 'email'],
    icon: '💳',
  },
  {
    id: 'tpl-subscription-renewal',
    name: 'Subscription renewal',
    category: 'commerce',
    title: 'Subscription renews soon',
    body: 'Your {plan} subscription renews on {date}.',
    defaultPriority: 'high',
    defaultChannels: ['in-app', 'email', 'push'],
    icon: '💳',
  },
  {
    id: 'tpl-trust-update',
    name: 'Trust score update',
    category: 'trust',
    title: 'Trust score updated',
    body: 'Your trust score is now {score}.',
    defaultPriority: 'high',
    defaultChannels: ['in-app'],
    icon: '🛡️',
  },
  {
    id: 'tpl-campaign-report',
    name: 'Campaign performance',
    category: 'advertising',
    title: 'Campaign weekly report',
    body: '{campaign} reached {impressions} impressions at {ctr} CTR.',
    defaultPriority: 'normal',
    defaultChannels: ['in-app', 'email'],
    icon: '📢',
  },
  {
    id: 'tpl-dataset-version',
    name: 'Dataset release',
    category: 'datasets',
    title: 'Dataset version published',
    body: '{dataset} version {version} is now available.',
    defaultPriority: 'normal',
    defaultChannels: ['in-app', 'email'],
    icon: '🗄️',
  },
  {
    id: 'tpl-conference-acceptance',
    name: 'Conference acceptance',
    category: 'conferences',
    title: 'Abstract accepted',
    body: 'Your abstract was accepted for {conference}.',
    defaultPriority: 'high',
    defaultChannels: ['in-app', 'email'],
    icon: '🎤',
  },
  {
    id: 'tpl-discovery-alert',
    name: 'Discovery alert',
    category: 'discovery',
    title: 'New match for your interests',
    body: 'A new {entity} matches your saved interests: {title}.',
    defaultPriority: 'normal',
    defaultChannels: ['in-app', 'email'],
    icon: '🔎',
  },
];

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export const SUBSCRIPTIONS: NotificationSubscription[] = [
  {
    id: 'sub-notif-project-parsing',
    target: targetOjuri,
    sourceEntity: 'project',
    sourceId: 'multilingual-parsing-framework',
    events: ['milestone', 'deadline', 'updated'],
    channels: ['in-app', 'email', 'push'],
    active: true,
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'sub-notif-journal-cl',
    target: targetOjuri,
    sourceEntity: 'journal',
    sourceId: 'JNL-002',
    events: ['created', 'accepted', 'rejected', 'published'],
    channels: ['in-app', 'email'],
    active: true,
    createdAt: '2026-02-01T09:00:00.000Z',
  },
  {
    id: 'sub-notif-conference-siri',
    target: targetOjuri,
    sourceEntity: 'conference',
    sourceId: 'CONF-001',
    events: ['deadline', 'updated'],
    channels: ['in-app', 'email'],
    active: true,
    createdAt: '2026-03-15T09:00:00.000Z',
  },
  {
    id: 'sub-notif-funding-nrc',
    target: targetOjuri,
    sourceEntity: 'funding',
    sourceId: 'grant-nrc-2022-113',
    events: ['deadline', 'funded'],
    channels: ['in-app', 'email', 'sms'],
    active: true,
    createdAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'sub-notif-dataset-mpf',
    target: targetOjuri,
    sourceEntity: 'dataset',
    sourceId: 'mpf-multilingual-treebanks',
    events: ['created', 'updated'],
    channels: ['in-app'],
    active: true,
    createdAt: '2026-05-01T09:00:00.000Z',
  },
  {
    id: 'sub-notif-service-editing',
    target: targetOjuri,
    sourceEntity: 'service',
    sourceId: 'svc-editing-proofreading-1',
    events: ['milestone', 'reviewed', 'updated'],
    channels: ['in-app', 'email'],
    active: true,
    createdAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'sub-notif-order-receipts',
    target: targetOjuri,
    sourceEntity: 'order',
    sourceId: 'ord-2026-0001',
    events: ['payment', 'payout', 'updated'],
    channels: ['in-app', 'email'],
    active: true,
    createdAt: '2026-07-01T09:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Deliveries (derived from notifications)
// ---------------------------------------------------------------------------

function deliveryFor(notification: Notification, index: number): NotificationDelivery[] {
  const createdAt = new Date(notification.createdAt);
  const opened =
    notification.status === 'read' || notification.status === 'archived' || notification.status === 'dismissed';
  const clicked = notification.status === 'archived' || notification.status === 'dismissed';
  const inApp: NotificationDelivery = {
    id: `del-${notification.id}-in-app`,
    notificationId: notification.id,
    channel: 'in-app',
    status: clicked ? 'clicked' : opened ? 'opened' : 'delivered',
    queuedAt: createdAt.toISOString(),
    deliveredAt: createdAt.toISOString(),
    openedAt: opened ? new Date(createdAt.getTime() + 60 * 60 * 1000).toISOString() : undefined,
    clickedAt: clicked ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined,
  };
  const deliveries = [inApp];
  if (notification.channels.includes('email')) {
    deliveries.push({
      id: `del-${notification.id}-email`,
      notificationId: notification.id,
      channel: 'email',
      status: notification.status === 'read' || index % 3 === 0 ? 'delivered' : 'sent',
      queuedAt: createdAt.toISOString(),
      sentAt: createdAt.toISOString(),
      deliveredAt: notification.status === 'read' || index % 3 === 0 ? createdAt.toISOString() : undefined,
    });
  }
  if (notification.channels.includes('push')) {
    deliveries.push({
      id: `del-${notification.id}-push`,
      notificationId: notification.id,
      channel: 'push',
      status: index % 5 === 0 ? 'failed' : 'delivered',
      queuedAt: createdAt.toISOString(),
      sentAt: createdAt.toISOString(),
      deliveredAt: index % 5 === 0 ? undefined : createdAt.toISOString(),
      error: index % 5 === 0 ? 'Device token expired' : undefined,
    });
  }
  return deliveries;
}

export const DELIVERIES: NotificationDelivery[] = NOTIFICATIONS.flatMap((notification, index) =>
  deliveryFor(notification, index),
);

// ---------------------------------------------------------------------------
// Digests (derived by the engine)
// ---------------------------------------------------------------------------

const OTHER_TARGETS: NotificationTarget[] = [targetSmith, targetJscholar, targetInstitution, targetJournal];

const OTHER_NOTIFICATIONS: Notification[] = OTHER_TARGETS.flatMap((target, targetIndex) =>
  NOTIFICATIONS.filter((_, index) => index % OTHER_TARGETS.length === targetIndex).map((notification) => ({
    ...notification,
    id: `${notification.id}-${target.username ?? target.userId}`,
    target,
  })),
);

export const DAILY_DIGEST: NotificationDigest = digestNotifications(
  NOTIFICATIONS,
  targetOjuri,
  'daily',
  new Date(CURRENT_DATE),
);
export const WEEKLY_DIGEST: NotificationDigest = digestNotifications(
  NOTIFICATIONS,
  targetOjuri,
  'weekly',
  new Date(CURRENT_DATE),
);

export const DIGESTS: NotificationDigest[] = [
  DAILY_DIGEST,
  WEEKLY_DIGEST,
  digestNotifications(OTHER_NOTIFICATIONS, targetSmith, 'weekly', new Date(CURRENT_DATE)),
  digestNotifications(OTHER_NOTIFICATIONS, targetInstitution, 'weekly', new Date(CURRENT_DATE)),
  digestNotifications(OTHER_NOTIFICATIONS, targetJournal, 'daily', new Date(CURRENT_DATE)),
].map((digest, index) => (index > 1 ? { ...digest, sentAt: digest.generatedAt } : digest));

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export const ALERTS: NotificationAlert[] = [
  {
    id: 'alert-funding-deadline',
    priority: 'urgent',
    title: 'Funding application deadline',
    message: 'Your draft application for the Digital Futures Fund closes in 7 days.',
    category: 'funding',
    source: source('grant-dff-2021-087', 'funding', 'Digital Futures Fund'),
    createdAt: '2026-07-31T08:00:00.000Z',
    acknowledged: false,
  },
  {
    id: 'alert-project-report',
    priority: 'urgent',
    title: 'Grant report due today',
    message: 'The mid-year report for grant NRC 2022/113 is due on 31 July 2026.',
    category: 'projects',
    source: source('multilingual-parsing-framework', 'project', 'Multilingual Parsing Framework'),
    createdAt: '2026-07-31T07:00:00.000Z',
    acknowledged: false,
  },
  {
    id: 'alert-subscription',
    priority: 'high',
    title: 'Subscription renews soon',
    message: 'Your Researcher Pro subscription renews on 1 August 2026.',
    category: 'commerce',
    source: source('sub-ojuri-pro', 'subscription', 'Researcher Pro subscription'),
    createdAt: '2026-07-30T09:00:00.000Z',
    acknowledged: false,
  },
  {
    id: 'alert-ads-budget',
    priority: 'high',
    title: 'Campaign budget nearly spent',
    message: 'Your journal launch campaign has consumed 80% of its monthly budget.',
    category: 'advertising',
    source: source('cam-journal-launch', 'campaign', 'Journal launch campaign'),
    createdAt: '2026-07-29T10:00:00.000Z',
    acknowledged: true,
  },
];

// ---------------------------------------------------------------------------
// Statistics, analytics, aggregate root
// ---------------------------------------------------------------------------

export const NOTIFICATION_STATISTICS: NotificationStatistics = notificationStatistics({
  notifications: NOTIFICATIONS,
  preferences: PREFERENCES,
  templates: TEMPLATES,
  subscriptions: SUBSCRIPTIONS,
  deliveries: DELIVERIES,
  digests: DIGESTS,
  alerts: ALERTS,
});

export const NOTIFICATION_ANALYTICS: NotificationAnalytics = notificationAnalytics({
  notifications: NOTIFICATIONS,
  deliveries: DELIVERIES,
  digests: DIGESTS,
});

export const ALL_NOTIFICATIONS: Notification[] = [...NOTIFICATIONS, ...OTHER_NOTIFICATIONS];

export const UNREAD_NOTIFICATIONS: Notification[] = NOTIFICATIONS.filter(
  (notification) => notification.status === 'unread',
);

export const RECENT_NOTIFICATIONS: Notification[] = [...NOTIFICATIONS].sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt),
);

export const URGENT_NOTIFICATIONS: Notification[] = NOTIFICATIONS.filter(
  (notification) => notification.priority === 'urgent' || notification.priority === 'high',
);

export const LIFECYCLE_NOTIFICATIONS: { stageId: ResearchLifecycleStageId; items: Notification[] }[] = (
  ['idea', 'concept-note', 'proposal', 'funding', 'project', 'dataset', 'analysis', 'manuscript', 'submission', 'peer-review', 'publication', 'conference', 'citation', 'impact', 'knowledge-transfer'] as ResearchLifecycleStageId[]
  ).map((stageId) => ({
    stageId,
    items: NOTIFICATIONS.filter((notification) => notification.stageId === stageId),
  }))
  .filter((group) => group.items.length > 0);

export const NOTIFICATION_PORTFOLIO = {
  statistics: NOTIFICATION_STATISTICS,
  analytics: NOTIFICATION_ANALYTICS,
  notifications: NOTIFICATIONS,
  preferences: PREFERENCES,
  templates: TEMPLATES,
  channels: [...NOTIFICATION_CHANNELS],
  deliveries: DELIVERIES,
  digests: DIGESTS,
  subscriptions: SUBSCRIPTIONS,
  alerts: ALERTS,
};

// ---------------------------------------------------------------------------
// Featured & helper exports
// ---------------------------------------------------------------------------

export const FEATURED_NOTIFICATION: Notification = URGENT_NOTIFICATIONS.find(
  (notification) => notification.priority === 'urgent',
) ?? NOTIFICATIONS[0];
export const FEATURED_ALERT: NotificationAlert = ALERTS[0];
export const FEATURED_DIGEST: NotificationDigest = WEEKLY_DIGEST;
export const FEATURED_PREFERENCE: NotificationPreference =
  PREFERENCES.find((preference) => preference.category === 'research') ?? PREFERENCES[0];
export const FEATURED_SUBSCRIPTION: NotificationSubscription = SUBSCRIPTIONS[0];
export const FEATURED_TEMPLATE: NotificationTemplate =
  TEMPLATES.find((template) => template.category === 'funding') ?? TEMPLATES[0];

export const DEFAULT_NOTIFICATION_PRIORITY: NotificationPriority = 'normal';
export const DEFAULT_NOTIFICATION_CHANNEL: NotificationChannel = 'in-app';

export const NOTIFICATION_DIGEST_FREQUENCIES: NotificationDigestFrequency[] = ['realtime', 'daily', 'weekly'];

export { NOTIFICATION_CATEGORIES, NOTIFICATION_CHANNELS, NOTIFICATION_PRIORITIES };
export { createSaidIdentifier };
