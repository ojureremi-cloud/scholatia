import type { ResearchLifecycleStageId } from '@/types/research';
import type { DiscoveryEntityType } from '@/types/discovery';

/**
 * Scholatia Unified Notification Engine (Phase 2.2A).
 *
 * The Unified Notification Engine is the canonical platform-wide notification
 * backbone of the Scholatia ecosystem. It is NOT a messaging module and it is
 * NOT an activity feed. It is the event-driven infrastructure every existing
 * and future module emits into: a single typed notification graph that later
 * powers the Activity Feed, Messaging, email notifications, push notifications,
 * mobile notifications, institution and publisher notifications, enterprise
 * notifications, AI recommendations, and workflow alerts.
 *
 * Every notification references its source record through the canonical
 * `sourceId` + `sourceEntity` pattern and never duplicates a record owned by
 * another module. Delivery is decomposed into channels, templates, deliveries,
 * digests, and subscriptions so that no engine logic is re-implemented by any
 * consuming module.
 */

/** The notification categories map 1:1 to the modules that emit notifications. */
export type NotificationCategory =
  | 'identity'
  | 'research'
  | 'projects'
  | 'datasets'
  | 'discovery'
  | 'intelligence'
  | 'trust'
  | 'advertising'
  | 'commerce'
  | 'marketplace'
  | 'services'
  | 'publishing'
  | 'publishers'
  | 'institutions'
  | 'funding'
  | 'conferences'
  | 'journals';

/** The delivery channels a notification can be routed through. */
export type NotificationChannel =
  | 'in-app'
  | 'email'
  | 'push'
  | 'mobile'
  | 'desktop'
  | 'sms'
  | 'webhook';

/** Canonical priority vocabulary. `urgent` is reserved for time-critical alerts. */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/** Lifecycle state of a single notification for its target. */
export type NotificationStatus = 'unread' | 'read' | 'archived' | 'dismissed';

/**
 * The entity vocabulary a notification can reference. Extends the unified
 * Discovery entity types with the commerce-facing records that are not part
 * of the scholarly index.
 */
export type NotificationSourceEntityType =
  | DiscoveryEntityType
  | 'order'
  | 'service'
  | 'listing'
  | 'campaign'
  | 'subscription'
  | 'review'
  | 'dispute'
  | 'milestone';

/** The event vocabulary a notification subscription can listen to. */
export type NotificationEventType =
  | 'created'
  | 'updated'
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'published'
  | 'funded'
  | 'awarded'
  | 'cited'
  | 'reviewed'
  | 'milestone'
  | 'deadline'
  | 'payment'
  | 'payout'
  | 'dispute'
  | 'recommended'
  | 'trust-change'
  | 'invitation'
  | 'verification';

/** How often a target receives a consolidated digest. */
export type NotificationDigestFrequency = 'realtime' | 'daily' | 'weekly';

/** The record a notification points back at. Only references, never duplicates. */
export interface NotificationSource {
  id: string;
  entityType: NotificationSourceEntityType;
  title?: string;
  url?: string;
}

/** The recipient of a notification, identified by a canonical platform ID. */
export interface NotificationTarget {
  userId?: string;
  username?: string;
  said?: string;
  name?: string;
  entityType?: 'researcher' | 'institution' | 'journal' | 'conference' | 'publisher' | 'group' | 'community';
}

/** The actor that triggered a notification, when known. */
export interface NotificationActor {
  id: string;
  name: string;
  avatar?: string;
}

/** A call-to-action attached to a notification. */
export interface NotificationAction {
  label: string;
  url?: string;
}

/** A single canonical notification event targeting one recipient. */
export interface Notification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: NotificationChannel[];
  source: NotificationSource;
  target: NotificationTarget;
  actor?: NotificationActor;
  action?: NotificationAction;
  /** Canonical lifecycle stage of the source record, when applicable. */
  stageId?: ResearchLifecycleStageId;
  metadata?: Record<string, string>;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  expiresAt?: string;
}

/** Per-category, per-channel preference for one target. */
export interface NotificationPreference {
  id: string;
  target: NotificationTarget;
  category: NotificationCategory;
  channels: Record<NotificationChannel, boolean>;
  muted: boolean;
  digestFrequency: NotificationDigestFrequency;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

/** A reusable notification template bound to a category. */
export interface NotificationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  title: string;
  body: string;
  defaultPriority: NotificationPriority;
  defaultChannels: NotificationChannel[];
  icon?: string;
  url?: string;
}

/** Delivery state of a single notification across one channel. */
export type NotificationDeliveryStatus = 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  queuedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  error?: string;
}

/** A consolidated summary of a notification digest. */
export interface NotificationDigestSummary {
  total: number;
  unread: number;
  byCategory: { category: NotificationCategory; count: number }[];
  byPriority: { priority: NotificationPriority; count: number }[];
}

/** A periodic digest delivered to a target. */
export interface NotificationDigest {
  id: string;
  target: NotificationTarget;
  frequency: NotificationDigestFrequency;
  generatedAt: string;
  sentAt?: string;
  items: Notification[];
  summary: NotificationDigestSummary;
}

/** A standing subscription to events for a specific source record. */
export interface NotificationSubscription {
  id: string;
  target: NotificationTarget;
  sourceEntity: NotificationSourceEntityType;
  sourceId: string;
  events: NotificationEventType[];
  channels: NotificationChannel[];
  active: boolean;
  createdAt: string;
}

/** A derived time-critical alert surfaced outside the standard list. */
export interface NotificationAlert {
  id: string;
  priority: 'high' | 'urgent';
  title: string;
  message: string;
  category: NotificationCategory;
  source: NotificationSource;
  createdAt: string;
  acknowledged: boolean;
}

// ---------------------------------------------------------------------------
// Statistics, analytics, portfolio
// ---------------------------------------------------------------------------

export interface NotificationCategoryStat {
  category: NotificationCategory;
  count: number;
  unread: number;
}

export interface NotificationPriorityStat {
  priority: NotificationPriority;
  count: number;
  unread: number;
}

export interface NotificationStatusStat {
  status: NotificationStatus;
  count: number;
}

export interface NotificationChannelStat {
  channel: NotificationChannel;
  count: number;
  delivered: number;
}

export interface NotificationStatistics {
  totalNotifications: number;
  totalUnread: number;
  totalRead: number;
  totalArchived: number;
  totalDismissed: number;
  totalCategories: number;
  totalTemplates: number;
  totalSubscriptions: number;
  totalDigests: number;
  totalDeliveries: number;
  deliverySuccessRate: number;
  activeAlerts: number;
  byCategory: NotificationCategoryStat[];
  byPriority: NotificationPriorityStat[];
  byStatus: NotificationStatusStat[];
  byChannel: NotificationChannelStat[];
}

export interface NotificationAnalytics {
  totalDeliveries: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalFailed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  deliveryByChannel: NotificationChannelStat[];
  byCategory: NotificationCategoryStat[];
  byPriority: NotificationPriorityStat[];
  topSources: { sourceId: string; entityType: NotificationSourceEntityType; count: number }[];
  digestsGenerated: number;
  digestsDelivered: number;
}

/** Aggregate root of the Unified Notification Engine. */
export interface NotificationPortfolio {
  statistics: NotificationStatistics;
  analytics: NotificationAnalytics;
  notifications: Notification[];
  preferences: NotificationPreference[];
  templates: NotificationTemplate[];
  channels: NotificationChannel[];
  deliveries: NotificationDelivery[];
  digests: NotificationDigest[];
  subscriptions: NotificationSubscription[];
  alerts: NotificationAlert[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const NOTIFICATION_CATEGORIES: readonly NotificationCategory[] = [
  'identity',
  'research',
  'projects',
  'datasets',
  'discovery',
  'intelligence',
  'trust',
  'advertising',
  'commerce',
  'marketplace',
  'services',
  'publishing',
  'publishers',
  'institutions',
  'funding',
  'conferences',
  'journals',
];

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  identity: 'Identity',
  research: 'Research',
  projects: 'Projects',
  datasets: 'Datasets',
  discovery: 'Discovery',
  intelligence: 'Intelligence',
  trust: 'Trust',
  advertising: 'Advertising',
  commerce: 'Commerce',
  marketplace: 'Marketplace',
  services: 'Services',
  publishing: 'Publishing',
  publishers: 'Publishers',
  institutions: 'Institutions',
  funding: 'Funding',
  conferences: 'Conferences',
  journals: 'Journals',
};

export const NOTIFICATION_CATEGORY_ICONS: Record<NotificationCategory, string> = {
  identity: '🪪',
  research: '🔬',
  projects: '📁',
  datasets: '🗄️',
  discovery: '🔎',
  intelligence: '🧠',
  trust: '🛡️',
  advertising: '📢',
  commerce: '💳',
  marketplace: '🛍️',
  services: '🛠️',
  publishing: '📰',
  publishers: '🏛️',
  institutions: '🎓',
  funding: '💰',
  conferences: '🎤',
  journals: '🗞️',
};

export const NOTIFICATION_CHANNELS: readonly NotificationChannel[] = [
  'in-app',
  'email',
  'push',
  'mobile',
  'desktop',
  'sms',
  'webhook',
];

export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  'in-app': 'In-app',
  email: 'Email',
  push: 'Push',
  mobile: 'Mobile',
  desktop: 'Desktop',
  sms: 'SMS',
  webhook: 'Webhook',
};

export const NOTIFICATION_CHANNEL_ICONS: Record<NotificationChannel, string> = {
  'in-app': '🔔',
  email: '📧',
  push: '📲',
  mobile: '📱',
  desktop: '💻',
  sms: '💬',
  webhook: '🔗',
};

export const NOTIFICATION_PRIORITIES: readonly NotificationPriority[] = ['low', 'normal', 'high', 'urgent'];

export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

export const NOTIFICATION_STATUSES: readonly NotificationStatus[] = ['unread', 'read', 'archived', 'dismissed'];

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  archived: 'Archived',
  dismissed: 'Dismissed',
};

export const NOTIFICATION_SOURCE_ENTITY_TYPES: readonly NotificationSourceEntityType[] = [
  'researcher',
  'journal',
  'conference',
  'institution',
  'publisher',
  'project',
  'publication',
  'dataset',
  'manuscript',
  'funding',
  'order',
  'service',
  'listing',
  'campaign',
  'subscription',
  'review',
  'dispute',
  'milestone',
];

export const NOTIFICATION_EVENT_TYPES: readonly NotificationEventType[] = [
  'created',
  'updated',
  'submitted',
  'accepted',
  'rejected',
  'published',
  'funded',
  'awarded',
  'cited',
  'reviewed',
  'milestone',
  'deadline',
  'payment',
  'payout',
  'dispute',
  'recommended',
  'trust-change',
  'invitation',
  'verification',
];
