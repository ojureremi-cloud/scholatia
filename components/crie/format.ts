import {
  CRIE_AGENT_LABELS,
  CRIE_AUTONOMY_LEVEL_LABELS,
  CRIE_KG_ENTITY_CLASS_ICONS,
  CRIE_KG_ENTITY_CLASS_LABELS,
  CRIE_LIFECYCLE_STAGE_ICONS,
  CRIE_LIFECYCLE_STAGE_LABELS,
  CRIE_MEMORY_TYPE_LABELS,
  CRIE_REASONING_PARADIGM_LABELS,
  AUTONOMY_LEVELS,
} from '@/types/crie';
import type {
  AgentId,
  AutonomyLevel,
  ConfidenceScore,
  KGEntityClass,
  LifecycleStageId,
  MemoryTypeId,
  ReasoningParadigm,
} from '@/types/crie';

// ---------------------------------------------------------------------------
// Dates, numbers
// ---------------------------------------------------------------------------

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return '—';
  return `${formatDate(iso)} at ${formatTime(iso)}`;
}

export function formatRelative(iso: string | undefined, now = new Date()): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(iso);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatRatio(numerator: number, denominator: number): string {
  return `${Math.round((numerator / Math.max(1, denominator)) * 100)}%`;
}

// ---------------------------------------------------------------------------
// CRIE labels and icons
// ---------------------------------------------------------------------------

export function lifecycleStageLabel(stage: LifecycleStageId): string {
  return CRIE_LIFECYCLE_STAGE_LABELS[stage] ?? stage;
}

export function lifecycleStageIcon(stage: LifecycleStageId): string {
  return CRIE_LIFECYCLE_STAGE_ICONS[stage] ?? '🧭';
}

export function kgEntityClassLabel(entityClass: KGEntityClass): string {
  return CRIE_KG_ENTITY_CLASS_LABELS[entityClass] ?? entityClass;
}

export function kgEntityClassIcon(entityClass: KGEntityClass): string {
  return CRIE_KG_ENTITY_CLASS_ICONS[entityClass] ?? '🏷️';
}

export function memoryTypeLabel(memoryType: MemoryTypeId): string {
  return CRIE_MEMORY_TYPE_LABELS[memoryType] ?? memoryType;
}

export function autonomyLevelLabel(level: AutonomyLevel): string {
  return CRIE_AUTONOMY_LEVEL_LABELS[level] ?? level;
}

export function agentLabel(agentId: AgentId): string {
  return CRIE_AGENT_LABELS[agentId] ?? agentId;
}

export function reasoningParadigmLabel(paradigm: ReasoningParadigm): string {
  return CRIE_REASONING_PARADIGM_LABELS[paradigm] ?? paradigm;
}

const ENTITY_KIND_LABELS: Record<string, string> = {
  project: 'Project',
  study: 'Study',
  thesis: 'Thesis',
  paper: 'Paper',
  'grant-programme': 'Grant programme',
  patent: 'Patent',
  innovation: 'Innovation',
};

const ENTITY_KIND_ICONS: Record<string, string> = {
  project: '🗂️',
  study: '🔬',
  thesis: '📖',
  paper: '📜',
  'grant-programme': '💰',
  patent: '🧪',
  innovation: '💡',
};

export function entityKindLabel(kind: string): string {
  return ENTITY_KIND_LABELS[kind] ?? kind;
}

export function kgEntityLabel(entity: { crieId: string; attributes?: Record<string, unknown> }): string {
  const explicit = entity.attributes?.label;
  if (typeof explicit === 'string' && explicit.length > 0) return explicit;
  return entity.crieId.replace(/^kg-/, '').replace(/-/g, ' ');
}

export function entityKindIcon(kind: string): string {
  return ENTITY_KIND_ICONS[kind] ?? '📄';
}

export function autonomyLevelShort(level: AutonomyLevel): string {
  return AUTONOMY_LEVELS.includes(level) ? level.split('-')[0] : level;
}

// ---------------------------------------------------------------------------
// Badge tones
// ---------------------------------------------------------------------------

export type BadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export function confidenceTone(score: ConfidenceScore): BadgeTone {
  switch (score.band) {
    case 'very-high':
    case 'high':
      return 'success';
    case 'medium':
      return 'info';
    case 'low':
      return 'warning';
    case 'very-low':
      return 'danger';
    default:
      return 'default';
  }
}

export function confidencePercent(score: ConfidenceScore): string {
  return formatPercent(score.value);
}

export function stageProgressTone(progress: number): BadgeTone {
  if (progress >= 0.8) return 'success';
  if (progress >= 0.5) return 'info';
  if (progress >= 0.2) return 'warning';
  return 'danger';
}

export function statusTone(status: string): BadgeTone {
  const value = status.toLowerCase();
  if (['active', 'complete', 'confirmed', 'achieved', 'approved', 'granted', 'done', 'supported', 'succeeded', 'verified'].includes(value)) {
    return 'success';
  }
  if (['running', 'in-progress', 'planned', 'proposed', 'submitted', 'awaiting-approval', 'pending', 'checkpoint', 'targeting'].includes(value)) {
    return 'info';
  }
  if (['paused', 'negotiating', 'expedited', 'conditionally-approve', 'in-review'].includes(value)) {
    return 'warning';
  }
  if (['failed', 'refuted', 'retired', 'deprecated', 'rejected', 'terminated', 'refused', 'failed'].includes(value)) {
    return 'danger';
  }
  return 'default';
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export function crieUrl(): string {
  return '/crie';
}

export function crieDashboardUrl(): string {
  return '/crie/dashboard';
}

export function crieResearchUrl(): string {
  return '/crie/research';
}

export function crieProjectsUrl(): string {
  return '/crie/projects';
}

export function crieKnowledgeUrl(): string {
  return '/crie/knowledge';
}

export function crieGraphUrl(): string {
  return '/crie/graph';
}

export function crieMemoryUrl(): string {
  return '/crie/memory';
}

export function crieReasoningUrl(): string {
  return '/crie/reasoning';
}

export function crieAgentsUrl(): string {
  return '/crie/agents';
}

export function crieAnalyticsUrl(): string {
  return '/crie/analytics';
}

export function crieInstitutionsUrl(): string {
  return '/crie/institutions';
}

export function crieFederationUrl(): string {
  return '/crie/federation';
}

export function crieTrustUrl(): string {
  return '/crie/trust';
}

export function crieSearchUrl(): string {
  return '/crie/search';
}

export function crieSettingsUrl(): string {
  return '/crie/settings';
}

export function researchEntityUrl(entity: { id: string }): string {
  return `/crie/research/${entity.id}`;
}

export function projectUrl(entity: { id: string }): string {
  return `/crie/projects/${entity.id}`;
}

export function graphEntityUrl(entity: { crieId: string }): string {
  return `/crie/graph/${entity.crieId}`;
}

export function agentUrl(agent: { id: string }): string {
  return `/crie/agents/${agent.id}`;
}

export function memoryUrl(memory: { id: string }): string {
  return `/crie/memory/${memory.id}`;
}
