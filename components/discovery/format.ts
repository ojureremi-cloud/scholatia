import type { DiscoveryEntityType } from '@/types/discovery';

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatYear(year: string | undefined): string {
  return year ?? '—';
}

export const entityTypeLabels: Record<DiscoveryEntityType, string> = {
  researcher: 'Researcher',
  journal: 'Journal',
  conference: 'Conference',
  institution: 'Institution',
  publisher: 'Publisher',
  project: 'Project',
  publication: 'Publication',
  dataset: 'Dataset',
  manuscript: 'Manuscript',
  funding: 'Funding',
};

export const entityTypeIcons: Record<DiscoveryEntityType, string> = {
  researcher: '👩‍🔬',
  journal: '📄',
  conference: '🎤',
  institution: '🏛️',
  publisher: '🏢',
  project: '🚀',
  publication: '✍️',
  dataset: '📊',
  manuscript: '📜',
  funding: '💰',
};

export function entityTypeLabel(entityType: DiscoveryEntityType): string {
  return entityTypeLabels[entityType];
}

export function entityTypeIcon(entityType: DiscoveryEntityType): string {
  return entityTypeIcons[entityType];
}
