import type { InstitutionVerificationStatus } from '@/types/identity';

/**
 * Scholatia Academic Groups Foundation (Phase 2.2G Part 1).
 *
 * A group is a structured scholarly space on Scholatia — a persistent,
 * role-governed community that spans many surfaces. Groups exist at every
 * scholarly scale: research groups, department groups, faculty groups,
 * institution groups, conference working groups, journal editorial groups,
 * grant teams, laboratory groups, project teams, interest groups, and
 * professional networks. A group owns a profile, a governed membership, and
 * a growing body of shared scholarship: publications, events, resources,
 * discussions, announcements, projects, and media.
 *
 * The module owns no external records. Members reference canonical researchers
 * by `username`; the owning institution references canonical institutions by
 * `institutionId`; publications and projects reference canonical source
 * records through `sourceId` + `sourceEntity` — it never duplicates a record
 * owned by another module. Verification status reuses the canonical
 * `InstitutionVerificationStatus` vocabulary from the Identity platform.
 * Derived counts (members, publications, events, resources) are computed from
 * the typed graph by the pure engine in `lib/groups.ts`, never hand-maintained.
 */

/** The group vocabulary — one category per scholarly space type. */
export type GroupCategory =
  | 'research-group'
  | 'department'
  | 'faculty'
  | 'institution'
  | 'conference-working-group'
  | 'journal-editorial'
  | 'grant-team'
  | 'laboratory'
  | 'project-team'
  | 'interest-group'
  | 'professional-network';

/** Who can see the group and its content. */
export type GroupVisibility = 'public' | 'private' | 'invitation-only' | 'institution-only' | 'department-only';

/** The permission level a researcher holds inside a group. */
export type GroupRole = 'owner' | 'administrator' | 'moderator' | 'member' | 'guest' | 'visitor';

/** Membership lifecycle of a researcher inside a group. */
export type GroupMemberStatus = 'active' | 'invited' | 'pending' | 'removed';

/** The kinds of publications a group has contributed to or produced. */
export type GroupPublicationType = 'article' | 'preprint' | 'dataset' | 'report' | 'chapter' | 'proceeding';

/** The lifecycle of a group publication. */
export type GroupPublicationStatus = 'published' | 'in-review' | 'draft';

/** The kinds of events a group hosts. */
export type GroupEventType = 'seminar' | 'workshop' | 'meeting' | 'lecture' | 'journal-club' | 'webinar' | 'conference';

/** How a group event is delivered. */
export type GroupEventMode = 'in-person' | 'online' | 'hybrid';

/** The lifecycle of a group event. */
export type GroupEventStatus = 'scheduled' | 'completed' | 'cancelled';

/** The kinds of shared resources a group curates. */
export type GroupResourceType = 'document' | 'dataset' | 'software' | 'guideline' | 'teaching-material' | 'reference' | 'tool';

/** The lifecycle of a group discussion. */
export type GroupDiscussionStatus = 'open' | 'resolved' | 'closed';

/** The lifecycle of a group project. */
export type GroupProjectStatus = 'planning' | 'active' | 'completed';

/** The kinds of media a group gallery holds. */
export type GroupMediaKind = 'image' | 'video' | 'podcast' | 'presentation';

/** A researcher member of a group, referenced by canonical username. */
export interface GroupMember {
  username: string;
  name: string;
  avatar?: string;
  role: GroupRole;
  status: GroupMemberStatus;
  joinedAt: string;
}

/** Public contact and social presence of a group. */
export interface GroupSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  orcid?: string;
  youtube?: string;
}

/** A publication a group has produced or contributed to. */
export interface GroupPublication {
  id: string;
  groupId: string;
  title: string;
  type: GroupPublicationType;
  status: GroupPublicationStatus;
  /** Canonical author researcher usernames. */
  authors: string[];
  /** Canonical source record this publication serves, when applicable. */
  sourceId?: string;
  sourceEntity?: 'publication' | 'dataset' | 'report' | 'project' | 'research';
  publishedAt?: string;
}

/** An event hosted or co-hosted by the group. */
export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  type: GroupEventType;
  mode: GroupEventMode;
  scheduledAt: string;
  durationHours?: number;
  location?: string;
  /** Canonical speaker researcher usernames. */
  speakers: string[];
  status: GroupEventStatus;
}

/** A shared resource curated by the group. */
export interface GroupResource {
  id: string;
  groupId: string;
  title: string;
  type: GroupResourceType;
  url?: string;
  /** Canonical contributor researcher username. */
  contributor: string;
  addedAt: string;
}

/** A threaded reply inside a group discussion. */
export interface GroupDiscussionReply {
  id: string;
  discussionId: string;
  author: string;
  authorName?: string;
  body: string;
  createdAt: string;
}

/** A discussion thread opened inside a group. */
export interface GroupDiscussion {
  id: string;
  groupId: string;
  title: string;
  body?: string;
  author: string;
  authorName?: string;
  status: GroupDiscussionStatus;
  pinned?: boolean;
  replies: GroupDiscussionReply[];
  createdAt: string;
}

/** An announcement broadcast to the group membership. */
export interface GroupAnnouncement {
  id: string;
  groupId: string;
  title: string;
  body: string;
  author: string;
  authorName?: string;
  pinned?: boolean;
  createdAt: string;
}

/** A project run by the group, referencing canonical source records. */
export interface GroupProject {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  /** Canonical source record this project serves, when applicable. */
  sourceId?: string;
  sourceEntity?: 'project' | 'research' | 'collaboration';
  /** Canonical member researcher usernames. */
  members: string[];
  status: GroupProjectStatus;
  startedAt?: string;
  updatedAt?: string;
}

/** A media item in the group gallery. */
export interface GroupMedia {
  id: string;
  groupId: string;
  kind: GroupMediaKind;
  title: string;
  url?: string;
  uploadedBy: string;
  uploadedAt: string;
}

/**
 * A single academic group — the aggregate of a scholarly community on the
 * platform. Derived counts are computed by the engine, never hand-maintained.
 */
export interface Group {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: GroupCategory;
  visibility: GroupVisibility;
  /** The canonical owner researcher username. */
  owner: string;
  ownerName?: string;
  /** Group administrators, referenced by canonical username. */
  administrators: GroupMember[];
  /** Group moderators, referenced by canonical username. */
  moderators: GroupMember[];
  /** Group members (member / guest / visitor roles). */
  members: GroupMember[];
  /** Canonical institution this group belongs to. */
  institution: string;
  institutionId?: string;
  department: string;
  country: string;
  discipline: string;
  researchAreas: string[];
  keywords: string[];
  profileImage?: string;
  coverImage?: string;
  website?: string;
  email?: string;
  socialLinks?: GroupSocialLinks;
  verificationStatus: InstitutionVerificationStatus;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  publicationCount: number;
  eventCount: number;
  resourceCount: number;
  publications: GroupPublication[];
  events: GroupEvent[];
  resources: GroupResource[];
  discussions: GroupDiscussion[];
  announcements: GroupAnnouncement[];
  projects: GroupProject[];
  media: GroupMedia[];
}

/** The filter vocabulary for browsing groups. */
export interface GroupFilter {
  category?: GroupCategory;
  visibility?: GroupVisibility;
  country?: string;
  institution?: string;
  discipline?: string;
  verification?: InstitutionVerificationStatus;
  researchArea?: string;
  keyword?: string;
}

export type GroupSort = 'recent' | 'name' | 'members' | 'publications' | 'events' | 'research';

// ---------------------------------------------------------------------------
// Statistics, analytics, portfolio
// ---------------------------------------------------------------------------

export interface GroupCategoryStat {
  category: GroupCategory;
  count: number;
  members: number;
}

export interface GroupVisibilityStat {
  visibility: GroupVisibility;
  count: number;
}

export interface GroupCountryStat {
  country: string;
  count: number;
}

export interface GroupRoleStat {
  role: GroupRole;
  count: number;
}

export interface GroupVerificationStat {
  status: InstitutionVerificationStatus;
  count: number;
}

export interface GroupStatistics {
  totalGroups: number;
  totalMembers: number;
  totalAdministrators: number;
  totalModerators: number;
  totalPublications: number;
  totalEvents: number;
  totalResources: number;
  totalDiscussions: number;
  totalAnnouncements: number;
  totalProjects: number;
  totalMedia: number;
  totalResearchAreas: number;
  totalKeywords: number;
  byCategory: GroupCategoryStat[];
  byVisibility: GroupVisibilityStat[];
  byCountry: GroupCountryStat[];
  byVerification: GroupVerificationStat[];
  byRole: GroupRoleStat[];
}

export interface GroupAnalytics {
  avgMembersPerGroup: number;
  avgPublicationsPerGroup: number;
  avgEventsPerGroup: number;
  avgResourcesPerGroup: number;
  publicShare: number;
  institutionShare: number;
  mostActiveGroupId: string;
  topCountries: { country: string; count: number }[];
  topDisciplines: { discipline: string; count: number }[];
  topResearchAreas: { area: string; count: number }[];
  topKeywords: { keyword: string; count: number }[];
}

/** A derived AI insight over the groups graph. */
export interface GroupInsight {
  id: string;
  title: string;
  body: string;
  type: 'trend' | 'cluster' | 'spotlight' | 'summary' | 'opportunity';
  groupId?: string;
}

/** Aggregate root of the Academic Groups Foundation. */
export interface GroupPortfolio {
  statistics: GroupStatistics;
  analytics: GroupAnalytics;
  groups: Group[];
  members: GroupMember[];
  publications: GroupPublication[];
  events: GroupEvent[];
  resources: GroupResource[];
  discussions: GroupDiscussion[];
  announcements: GroupAnnouncement[];
  projects: GroupProject[];
  media: GroupMedia[];
  insights: GroupInsight[];
  featured: Group[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const GROUP_CATEGORIES: readonly GroupCategory[] = [
  'research-group',
  'department',
  'faculty',
  'institution',
  'conference-working-group',
  'journal-editorial',
  'grant-team',
  'laboratory',
  'project-team',
  'interest-group',
  'professional-network',
];

export const GROUP_CATEGORY_LABELS: Record<GroupCategory, string> = {
  'research-group': 'Research Group',
  department: 'Department Group',
  faculty: 'Faculty Group',
  institution: 'Institution Group',
  'conference-working-group': 'Conference Working Group',
  'journal-editorial': 'Journal Editorial Group',
  'grant-team': 'Grant Team',
  laboratory: 'Laboratory Group',
  'project-team': 'Project Team',
  'interest-group': 'Interest Group',
  'professional-network': 'Professional Network',
};

export const GROUP_CATEGORY_ICONS: Record<GroupCategory, string> = {
  'research-group': '👥',
  department: '🏛️',
  faculty: '🎓',
  institution: '🏫',
  'conference-working-group': '🎤',
  'journal-editorial': '🗞️',
  'grant-team': '💰',
  laboratory: '🧪',
  'project-team': '📁',
  'interest-group': '💡',
  'professional-network': '🌍',
};

export const GROUP_VISIBILITIES: readonly GroupVisibility[] = [
  'public',
  'private',
  'invitation-only',
  'institution-only',
  'department-only',
];

export const GROUP_VISIBILITY_LABELS: Record<GroupVisibility, string> = {
  public: 'Public',
  private: 'Private',
  'invitation-only': 'Invitation Only',
  'institution-only': 'Institution Only',
  'department-only': 'Department Only',
};

export const GROUP_VISIBILITY_ICONS: Record<GroupVisibility, string> = {
  public: '🌍',
  private: '🔒',
  'invitation-only': '📨',
  'institution-only': '🎓',
  'department-only': '🏛️',
};

export const GROUP_ROLES: readonly GroupRole[] = [
  'owner',
  'administrator',
  'moderator',
  'member',
  'guest',
  'visitor',
];

export const GROUP_ROLE_LABELS: Record<GroupRole, string> = {
  owner: 'Owner',
  administrator: 'Administrator',
  moderator: 'Moderator',
  member: 'Member',
  guest: 'Guest',
  visitor: 'Visitor',
};

export const GROUP_ROLE_ICONS: Record<GroupRole, string> = {
  owner: '👑',
  administrator: '🛡️',
  moderator: '⚖️',
  member: '👤',
  guest: '🤝',
  visitor: '👁️',
};

export const GROUP_MEMBER_STATUSES: readonly GroupMemberStatus[] = [
  'active',
  'invited',
  'pending',
  'removed',
];

export const GROUP_MEMBER_STATUS_LABELS: Record<GroupMemberStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  pending: 'Pending',
  removed: 'Removed',
};

export const GROUP_MEMBER_STATUS_ICONS: Record<GroupMemberStatus, string> = {
  active: '✅',
  invited: '📨',
  pending: '⏳',
  removed: '🚫',
};

export const GROUP_PUBLICATION_TYPES: readonly GroupPublicationType[] = [
  'article',
  'preprint',
  'dataset',
  'report',
  'chapter',
  'proceeding',
];

export const GROUP_PUBLICATION_TYPE_LABELS: Record<GroupPublicationType, string> = {
  article: 'Article',
  preprint: 'Preprint',
  dataset: 'Dataset',
  report: 'Report',
  chapter: 'Chapter',
  proceeding: 'Proceedings',
};

export const GROUP_PUBLICATION_TYPE_ICONS: Record<GroupPublicationType, string> = {
  article: '📄',
  preprint: '📰',
  dataset: '🗄️',
  report: '📊',
  chapter: '📚',
  proceeding: '🎤',
};

export const GROUP_PUBLICATION_STATUSES: readonly GroupPublicationStatus[] = [
  'published',
  'in-review',
  'draft',
];

export const GROUP_PUBLICATION_STATUS_LABELS: Record<GroupPublicationStatus, string> = {
  published: 'Published',
  'in-review': 'In Review',
  draft: 'Draft',
};

export const GROUP_PUBLICATION_STATUS_ICONS: Record<GroupPublicationStatus, string> = {
  published: '✅',
  'in-review': '🔍',
  draft: '✍️',
};

export const GROUP_EVENT_TYPES: readonly GroupEventType[] = [
  'seminar',
  'workshop',
  'meeting',
  'lecture',
  'journal-club',
  'webinar',
  'conference',
];

export const GROUP_EVENT_TYPE_LABELS: Record<GroupEventType, string> = {
  seminar: 'Seminar',
  workshop: 'Workshop',
  meeting: 'Meeting',
  lecture: 'Lecture',
  'journal-club': 'Journal Club',
  webinar: 'Webinar',
  conference: 'Conference',
};

export const GROUP_EVENT_TYPE_ICONS: Record<GroupEventType, string> = {
  seminar: '🎓',
  workshop: '🛠️',
  meeting: '🤝',
  lecture: '🎙️',
  'journal-club': '📖',
  webinar: '💻',
  conference: '🎤',
};

export const GROUP_EVENT_MODES: readonly GroupEventMode[] = ['in-person', 'online', 'hybrid'];

export const GROUP_EVENT_MODE_LABELS: Record<GroupEventMode, string> = {
  'in-person': 'In Person',
  online: 'Online',
  hybrid: 'Hybrid',
};

export const GROUP_EVENT_STATUSES: readonly GroupEventStatus[] = ['scheduled', 'completed', 'cancelled'];

export const GROUP_EVENT_STATUS_LABELS: Record<GroupEventStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const GROUP_EVENT_STATUS_ICONS: Record<GroupEventStatus, string> = {
  scheduled: '📅',
  completed: '✅',
  cancelled: '❌',
};

export const GROUP_RESOURCE_TYPES: readonly GroupResourceType[] = [
  'document',
  'dataset',
  'software',
  'guideline',
  'teaching-material',
  'reference',
  'tool',
];

export const GROUP_RESOURCE_TYPE_LABELS: Record<GroupResourceType, string> = {
  document: 'Document',
  dataset: 'Dataset',
  software: 'Software',
  guideline: 'Guideline',
  'teaching-material': 'Teaching Material',
  reference: 'Reference',
  tool: 'Tool',
};

export const GROUP_RESOURCE_TYPE_ICONS: Record<GroupResourceType, string> = {
  document: '📝',
  dataset: '🗄️',
  software: '💻',
  guideline: '📜',
  'teaching-material': '🧑‍🏫',
  reference: '📚',
  tool: '🔧',
};

export const GROUP_DISCUSSION_STATUSES: readonly GroupDiscussionStatus[] = ['open', 'resolved', 'closed'];

export const GROUP_DISCUSSION_STATUS_LABELS: Record<GroupDiscussionStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const GROUP_DISCUSSION_STATUS_ICONS: Record<GroupDiscussionStatus, string> = {
  open: '💬',
  resolved: '✅',
  closed: '🔒',
};

export const GROUP_PROJECT_STATUSES: readonly GroupProjectStatus[] = ['planning', 'active', 'completed'];

export const GROUP_PROJECT_STATUS_LABELS: Record<GroupProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  completed: 'Completed',
};

export const GROUP_PROJECT_STATUS_ICONS: Record<GroupProjectStatus, string> = {
  planning: '🗺️',
  active: '🚀',
  completed: '🏁',
};

export const GROUP_MEDIA_KINDS: readonly GroupMediaKind[] = ['image', 'video', 'podcast', 'presentation'];

export const GROUP_MEDIA_KIND_LABELS: Record<GroupMediaKind, string> = {
  image: 'Image',
  video: 'Video',
  podcast: 'Podcast',
  presentation: 'Presentation',
};

export const GROUP_MEDIA_KIND_ICONS: Record<GroupMediaKind, string> = {
  image: '🖼️',
  video: '🎬',
  podcast: '🎙️',
  presentation: '📽️',
};
